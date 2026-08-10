# Astrovy Store MVP To-Do

Last updated: 2026-08-09

## Goal

Prepare Astrovy for App Store and Play Store review without pretending unfinished paid features are production-ready.

## Already In Place

- [x] In-app account deletion entry in Settings.
- [x] Legal links in Settings.
- [x] Public landing page with Privacy Policy, Terms, and Contact.
- [x] Backend entitlement source of truth exists through `/v1/entitlements/me`.
- [x] Backend blocks preview premium toggle in production.
- [x] Backend has Apple placeholder verification and Google Play verification skeleton.

## Release Blockers

- [ ] **Remove or dev-gate the premium preview toggle in production mobile builds.**
  - The current app still exposes a premium simulation flow through mobile UI.
  - Production users must only become premium from a verified backend entitlement.
  - Keep test toggles behind `__DEV__` or an internal build flag only.

- [ ] **Finish real subscription purchase flow.**
  - Android/Play Store path is wired in mobile through `expo-iap` and backend `/v1/iap/google/verify`.
  - Backend still needs production `GOOGLE_PACKAGE_NAME` and `GOOGLE_SERVICE_ACCOUNT_JSON_BASE64`.
  - iOS/App Store purchase verification remains the next phase.
  - Restore purchase must be tested on real Android store builds.

- [ ] **Add subscription server notifications.**
  - Apple App Store Server Notifications V2.
  - Google Real-time Developer Notifications through Pub/Sub.
  - Backend must update entitlement on renewals, cancellations, billing retry, grace period, and expiry.

- [ ] **Finish network, offline, timeout, and empty-state QA.**
  - Every API-backed screen must render usable UI during loading.
  - Retry must be available after failures.
  - Expired sessions must redirect cleanly to auth.
  - No page should show stale generated copy as if it is fresh backend content.

- [ ] **Complete privacy and data safety declarations.**
  - App Store App Privacy.
  - Play Console Data safety.
  - Privacy Policy page must match the real data collected and shared.

- [ ] **Add AI and spiritual-content disclaimers.**
  - Keep it subtle, but it is needed because readings can be interpreted as personal guidance.
  - Place in onboarding consent, legal pages, and one small footer/disclaimer in reading-heavy areas.

- [ ] **Prepare release assets and signing.**
  - App icon, splash, screenshots, feature graphic, app preview copy.
  - Apple bundle ID and signing.
  - Android package name and upload key.
  - TestFlight and Play internal testing before production rollout.

## Production Readiness Rule

Do not submit the app while the production build contains a fake premium path. Reviewers can trigger it, users can misunderstand it, and backend entitlement will disagree with mobile behavior.
