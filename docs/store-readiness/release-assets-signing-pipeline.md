# Release Assets, Signing, and Pipeline Checklist

Last updated: 2026-08-09

## Store Identity

- [ ] Final app name: `Astrovy`.
- [ ] Final iOS Bundle ID decided.
- [ ] Final Android package name decided.
- [ ] Production API URL set to `https://api.astrovy.space/v1`.
- [ ] Website URL set to `https://astrovy.space`.
- [ ] Privacy Policy URL set to `https://astrovy.space/privacy`.
- [ ] Terms URL set to `https://astrovy.space/terms`.
- [ ] Support/contact URL or email set.

## Visual Assets

- [ ] App icon exported at required iOS and Android sizes.
- [ ] Adaptive Android icon foreground/background checked.
- [ ] Splash screen uses `splash_icon.png`.
- [ ] App Store screenshots prepared for required iPhone sizes.
- [ ] Play Store phone screenshots prepared.
- [ ] Play Store feature graphic prepared.
- [ ] Screenshots show real app screens, not placeholder loading states.

Recommended screenshot set:

- Today page with generated signal.
- First Mirror result.
- Tarot draw.
- Birth chart summary or premium full chart.
- Compatibility quick/full match.
- Journey history.
- Pricing/paywall.

## Build Signing

### iOS

- [ ] Apple Developer Program active.
- [ ] App Store Connect app created.
- [ ] Bundle ID matches app config.
- [ ] Signing certificate and provisioning profile ready through EAS or Xcode.
- [ ] TestFlight internal build uploaded.

### Android

- [ ] Play Console developer account active.
- [ ] App record created.
- [ ] Upload key generated and stored safely.
- [ ] App signing by Google Play enabled.
- [ ] Internal testing build uploaded.

## Environment

- [ ] Production backend deployed and healthy.
- [ ] Production web deployed and reachable.
- [ ] Mobile production build does not point to localhost.
- [ ] Mobile production build does not expose premium preview toggle.
- [ ] AI provider production key configured only in backend environment.
- [ ] CORS allows production web and required clients only.

## CI/CD Recommendation

Use GitHub Actions for server deployment and EAS for mobile builds.

Backend and web:

- [ ] Push to `main`/`master` triggers deploy.
- [ ] GitHub Actions SSHs into VPS.
- [ ] Server pulls latest commit.
- [ ] Backend runs `npm ci`, `npm run prisma:migrate:deploy`, `npm run build`, and PM2 restart.
- [ ] Web runs `npm ci`, `npm run build`, and PM2 restart.
- [ ] Workflow verifies health URL after restart.

Mobile:

- [ ] Use EAS Build profiles: `development`, `preview`, `production`.
- [ ] Use EAS Submit for TestFlight and Play internal testing.
- [ ] Store secrets in EAS secrets or GitHub environment secrets.
- [ ] Require manual approval before production submit.

## Pre-Submission QA

- [ ] Fresh install register/login/onboarding works.
- [ ] Returning user session works.
- [ ] Account deletion works.
- [ ] Legal links open correctly.
- [ ] Offline and slow network states work.
- [ ] Purchase sandbox works on both platforms.
- [ ] Restore purchase works on both platforms.
- [ ] No raw backend validation error is visible to users.
- [ ] No debug-only premium toggle is visible.
- [ ] No API key appears in mobile bundle or git.

## Release Strategy

- [ ] Ship first to internal testers.
- [ ] Ship TestFlight external beta if Apple approves.
- [ ] Ship Play closed testing if required by account status.
- [ ] Start production rollout small.
- [ ] Watch backend logs, AI usage logs, signups, purchases, and crash reports after rollout.
