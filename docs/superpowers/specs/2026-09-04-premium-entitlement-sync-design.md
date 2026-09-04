# Premium Entitlement Synchronization

## Goal

Make the backend entitlement the single source of truth for premium access, so a verified purchase, restore, or store-side change updates every screen without restarting the app.

## Data Flow

1. Google Play checkout succeeds.
2. The app sends the purchase token to `POST /v1/iap/google/verify`.
3. The backend verifies the purchase and updates the entitlement transactionally.
4. The app refreshes its shared entitlement state before reporting Premium as active.
5. Every premium-gated screen reads the shared state.

## Refresh Policy

- Refresh immediately after a successful purchase verification.
- Refresh immediately after restoring purchases.
- Refresh when the app moves from background to active, throttled to at most once per 60 seconds.
- Do not refetch on every navigation or render.

## Pending Verification

If the store confirms payment but backend verification fails or is delayed, show an explicit activation-pending message. Do not grant local premium access until the backend reports an active or grace entitlement.

## Error Handling

- A foreground refresh failure retains the last known entitlement and does not sign the user out.
- Purchase verification failure keeps the existing restore-purchases recovery path.
- Tier refresh requests are de-duplicated while one is already in progress.

## Verification

- Unit test the refresh throttle and concurrent refresh de-duplication.
- Verify a purchase refreshes the premium state used by Profile and a gated screen.
- Verify background-to-active refreshes the entitlement once within the throttle window.
