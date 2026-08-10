# Privacy and Data Safety Inventory

Last updated: 2026-08-09

## Main Concern

Store privacy answers must match real behavior. The risky assumption is thinking astrology content is not sensitive because it is entertainment. Astrovy collects birth data, reflections, compatibility inputs, AI prompts, and subscription state, so the disclosure must be careful.

## Data Collected

| Category | Examples | Purpose | Stored In Backend | Shared With Third Parties |
| --- | --- | --- | --- | --- |
| Account info | Email, username | Authentication, account management | Yes | No, except infrastructure providers |
| User profile | Display name, birth date, birth time, birth place, coordinates, zodiac/MBTI inputs | Birth chart, personalization, compatibility | Yes | May be sent to AI provider when generating content |
| User content | Check-ins, reflections, journal entries, feedback answers | Mirror, Journey, personalization feedback | Yes | May be sent to AI provider when generating content |
| Compatibility input | Partner name, birth date/time/place, zodiac sign | Quick and full match reports | Yes for saved/history flows | May be sent to AI provider when generating content |
| App activity | Tarot draws, reading history, generated content cache, feature usage | Daily loop, quota, quality, abuse prevention | Yes | No, except infrastructure providers |
| Purchases | Product ID, entitlement tier/status, expiry, renewal state, store transaction ID or token hash | Premium access control | Yes | Apple/Google process payment |
| Diagnostics | API errors, request metadata, AI generation logs, non-production debug logs | Reliability, support, abuse prevention | Yes | Infrastructure providers |
| Contact info | Early access email | Waitlist and launch contact | Yes | No, except email provider if added later |

## Data Not Currently Expected

- Ads identifiers.
- Contacts.
- Photos or videos.
- Precise live location from GPS.
- Health data.
- Financial details such as card numbers.

If any SDK is added later, update this file before release.

## App Store App Privacy Draft

Likely declarations:

- Contact Info: Email Address, linked to user, used for app functionality and account management.
- User Content: Other User Content, linked to user, used for app functionality and personalization.
- Identifiers: User ID, linked to user, used for app functionality.
- Purchases: Purchase History, linked to user, used for app functionality.
- Usage Data: Product Interaction, linked to user, used for analytics/app functionality if retained in backend logs.
- Diagnostics: Crash Data or Performance Data only if a diagnostics SDK is added.

Do not declare “Data Not Collected” unless the production app truly avoids all persisted user/account data.

## Play Console Data Safety Draft

Likely declarations:

- Personal info: Email address, name/user-provided profile details.
- App activity: App interactions and in-app search/history.
- App info and performance: Crash logs/diagnostics only if collected.
- Financial info: Purchase history for subscription status, not payment card data.
- Location: Do not declare precise device location unless GPS is used. If birth place coordinates are user-entered profile data, disclose clearly in Privacy Policy even if not collected from device sensors.

## AI Provider Disclosure

If Alibaba Qwen/OpenAI or another model receives profile/reflection context, the Privacy Policy and store disclosures should say that selected user inputs may be processed by trusted AI service providers to generate personalized readings.

## Retention Rules To Confirm

- Account data should be deleted when the user deletes their account.
- Generated content and AI logs should be deleted or anonymized with account deletion.
- IAP records may need limited retention for fraud, refund, tax, or audit reasons.
- Early access emails should be deletable on request.

## What To Verify Before Submission

- [ ] No analytics SDK was added without updating this inventory.
- [ ] No crash reporting SDK was added without updating this inventory.
- [ ] AI prompts do not include passwords, raw auth tokens, payment details, or unrelated personal data.
- [ ] Account deletion actually deletes or anonymizes user-owned data.
- [ ] Privacy Policy on `https://astrovy.space` matches this inventory.

## Official References

- Google Play Data safety: https://support.google.com/googleplay/android-developer/answer/10787469
- Apple App Privacy details: https://developer.apple.com/app-store/app-privacy-details/
