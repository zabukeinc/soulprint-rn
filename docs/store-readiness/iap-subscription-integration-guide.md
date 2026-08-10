# IAP Subscription Integration Guide

Last updated: 2026-08-09

## Main Concern

The app should never decide premium access locally. Apple and Google own the payment event, but Astrovy backend owns the entitlement used by the product.

## Current State

- Mobile is Expo SDK 54 and uses `expo-iap` for the store billing bridge.
- Backend has:
  - `GET /v1/products`
  - `GET /v1/entitlements/me`
  - `PATCH /v1/entitlements/me/preview` for non-production preview only
  - `POST /v1/iap/apple/verify`
  - `POST /v1/iap/google/verify`
  - Prisma tables for `Entitlement` and `IapVerificationAttempt`
- Apple verification currently records an attempt and returns `501 NOT_IMPLEMENTED`.
- Google verification is implemented, but returns `501 PROVIDER_NOT_CONFIGURED` until `GOOGLE_PACKAGE_NAME` and `GOOGLE_SERVICE_ACCOUNT_JSON_BASE64` are set.

## Recommended Product IDs

Use the same IDs in backend, App Store Connect, Play Console, and mobile:

- `astrovy_premium_monthly`
- `astrovy_premium_annual`

If the store rejects either ID format, update all three places together.

## Step 1: Create Store Products

### App Store Connect

- Create the app record with the final Bundle ID.
- Add auto-renewable subscription group: `Astrovy Premium`.
- Add monthly product: `astrovy_premium_monthly`.
- Add annual product: `astrovy_premium_annual`.
- Fill localized name, description, pricing, review screenshot, and subscription review notes.

### Play Console

- Create the app with the final package name.
- Create subscriptions using the same product IDs.
- Add base plans for monthly and annual billing.
- Activate products only when the app is ready for internal testing.

## Step 2: Add Backend Environment

Add production-only values on the server. Never commit these.

```bash
APPLE_BUNDLE_ID=
APPLE_ISSUER_ID=
APPLE_KEY_ID=
APPLE_PRIVATE_KEY_BASE64=
APPLE_ENVIRONMENT=Production

GOOGLE_PACKAGE_NAME=
GOOGLE_SERVICE_ACCOUNT_JSON_BASE64=
```

Use sandbox values in staging if a staging backend exists.

## Step 3: Mobile Purchase Flow

Expected flow:

1. App calls `GET /v1/products` for app-facing copy and feature list.
2. App asks native store SDK for real localized products and prices.
3. User taps purchase.
4. Native store returns transaction or purchase token.
5. App posts store proof to backend.
6. Backend verifies with Apple or Google.
7. Backend upserts `Entitlement`.
8. App calls `GET /v1/entitlements/me` and unlocks premium only from backend response.

Current SDK decision:

- Expo app uses `expo-iap`.
- Do not rely on Expo Go for IAP testing. IAP needs an Android development build or a Play Store testing build.

## Step 4: Backend Verification Contract

### Apple

`POST /v1/iap/apple/verify`

```json
{
  "transactionId": "2000000000000000",
  "productId": "astrovy_premium_monthly"
}
```

Backend responsibilities:

- Fetch signed transaction data from App Store Server API.
- Verify signed transaction and renewal info.
- Check bundle ID, product ID, environment, ownership, expiry, revocation, and subscription status.
- Store hashed request data in `IapVerificationAttempt`.
- Upsert `Entitlement` only after verification passes.

### Google

`POST /v1/iap/google/verify`

```json
{
  "purchaseToken": "purchase-token-from-google",
  "productId": "astrovy_premium_monthly"
}
```

Backend responsibilities:

- Call Google Play Developer API subscription purchase endpoint.
- Check package name, product ID, expiry, acknowledgement state, cancellation state, and linked purchase token.
- Acknowledge purchase if needed.
- Store hashed request data in `IapVerificationAttempt`.
- Upsert `Entitlement` only after verification passes.

## Step 5: Server Notifications

Add public webhook endpoints:

- `POST /v1/iap/apple/notifications`
- `POST /v1/iap/google/notifications`

Rules:

- Verify webhook signatures.
- Make webhook handling idempotent.
- Never downgrade premium until the provider says the entitlement is expired, revoked, or cancelled beyond grace period.
- Keep `willRenew`, `expiresAt`, `status`, and `productId` updated.

## Step 6: Restore Purchases

Restore must:

- Ask the native store SDK for active purchases.
- Send each store proof to backend verify endpoint.
- Refresh `/v1/entitlements/me`.
- Show clear copy:
  - Active: `Premium is active on this account.`
  - Missing: `No active subscription was found for this store account.`
  - Network error: `Could not check purchases. Try again when your connection is stable.`

## Step 7: Test Matrix

- [ ] iOS sandbox monthly purchase unlocks premium.
- [ ] iOS restore unlocks premium on reinstall.
- [ ] iOS cancelled subscription remains active until expiry.
- [ ] iOS expired subscription returns free.
- [ ] Android license tester monthly purchase unlocks premium.
- [ ] Android restore unlocks premium on reinstall.
- [ ] Android cancelled subscription remains active until expiry.
- [ ] Android expired subscription returns free.
- [ ] Backend rejects fake product IDs.
- [ ] Backend rejects replayed tokens when ownership does not match current user.
- [ ] Mobile never unlocks premium from local state only.

## Official References

- Apple App Store Server API: https://developer.apple.com/documentation/appstoreserverapi
- Apple subscription entitlement guidance: https://developer.apple.com/documentation/storekit/maintaining-a-users-subscription-status-with-app-store-server-api
- Google Play subscriptions lifecycle: https://developer.android.com/google/play/billing/lifecycle/subscriptions
