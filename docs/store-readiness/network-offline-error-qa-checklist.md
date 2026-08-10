# Network, Offline, and Error-State QA Checklist

Last updated: 2026-08-09

## What This Means

This is the check that the app still feels usable when the backend is slow, offline, returns validation errors, returns 401, or returns 500. It is not only a developer test; it is a release quality test.

## Why It Matters

Astrovy depends on generated content and backend state. If the app blocks navigation, shows stale static copy, or silently ignores a tap, users will think the app is broken even when the backend is only slow.

## How To Check Locally

Use one or more of these methods:

- Turn off Wi-Fi and cellular on the device or simulator.
- Kill the backend process, then open each API-backed page.
- Use a slow network profile from macOS Network Link Conditioner or Android emulator network settings.
- Temporarily point the app API URL to an invalid host.
- Force backend errors by using an expired auth token or invalid request body.
- Watch backend logs and mobile console logs while tapping actions.

## Screens To Test

- [ ] Register
- [ ] Login
- [ ] Onboarding birth profile
- [ ] Onboarding generation page
- [ ] Today page
- [ ] Check-in
- [ ] Reflection journal save
- [ ] Daily tarot draw
- [ ] Mirror
- [ ] Journey history
- [ ] Decode
- [ ] Compatibility quick match
- [ ] Compatibility full match
- [ ] Birth chart
- [ ] Pricing
- [ ] Settings
- [ ] Account deletion

## Required Behavior

- [ ] First load shows skeletons, not fake final copy.
- [ ] Pull-to-refresh or retry exists when loading fails.
- [ ] Buttons show immediate pressed/loading state.
- [ ] Repeated taps do not create duplicate requests.
- [ ] 401 logs the user out or asks them to sign in again.
- [ ] 403 premium errors open a paywall or locked state, not a raw error.
- [ ] 422 validation errors show human-readable field messages.
- [ ] 429 quota errors explain the wait/reset time.
- [ ] 500 errors show a calm retry message.
- [ ] Offline state does not erase existing cached content.
- [ ] Slow generated content can finish in background.

## Pass Criteria

The app passes this checklist only when every API-backed action has visible state within 150ms of tap and no screen is blocked forever by a pending request.
