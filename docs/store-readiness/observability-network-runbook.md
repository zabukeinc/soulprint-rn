# Observability and Network Runbook

Last updated: 2026-08-09

## What Was Added

- `@react-native-community/netinfo` for app-wide network state.
- `NetworkProvider` with a non-blocking offline banner.
- API timeout and error categorization in `src/lib/api.ts`.
- Backend-owned client event logging through `POST /v1/client-events`.
- Privacy filtering before events leave the device.

## Developer Notification

Client events are stored in the backend database table `client_events`. This avoids an external paid monitoring account for MVP.

For developer notification, add a small admin/dashboard view or a server-side scheduled alert later. The raw foundation is now owned by the backend.

## What Gets Reported

- API timeouts.
- Network/fetch failures.
- Backend 5xx responses.
- UI exceptions manually captured by the app boundary/helpers.

## What Does Not Get Reported By Default

- Normal 401 session expiry.
- Premium-required 403.
- Validation errors.
- Feature quota/rate-limit errors.
- Expected user cancellation flows.

## Privacy Rules

Events must not include:

- journal text
- birth profile details
- AI prompts
- auth tokens
- purchase tokens
- raw request or response bodies
- email addresses

The current mobile logger removes known sensitive fields and scrubs email/token-like strings from messages before posting to the backend.

## Manual QA

- [ ] Launch while online.
- [ ] Launch while offline.
- [ ] Turn Wi-Fi off while on Today page.
- [ ] Try check-in offline.
- [ ] Try tarot draw offline.
- [ ] Try compatibility offline.
- [ ] Kill backend and reload Today.
- [ ] Force backend 500 and confirm `/v1/client-events` stores one event.
- [ ] Force validation error and confirm `/v1/client-events` does not receive noise.
- [ ] Set invalid API URL and confirm timeout/network message appears.
- [ ] Confirm no journal text, birth details, AI prompts, or purchase tokens are stored.

## Store Review Note

Client diagnostics can affect privacy declarations because diagnostics may be collected. Update App Store privacy and Play Data safety if backend client-event logging remains enabled in production.
