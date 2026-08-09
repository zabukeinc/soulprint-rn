# Astrovy — API Contract (React Native ↔ Backend)

> **Status:** Draft v1 · **Backend:** TBD (you) · **Client:** `soulprint-rn` (Expo SDK 54)
> **Purpose:** Full endpoint spec the RN app will consume. Backend not yet built — this doc is the source of truth for what to build.

---

## 1. Decisions (locked)

| # | Decision | Choice |
|---|----------|--------|
| D1 | Identity | Real accounts: email+password register, social auth (Apple/Google) |
| D2 | Backend scope | Everything server-side: astrology engine, content generation, engagement state, tarot RNG, streak logic |
| D3 | Payments | IAP (App Store / Google Play) with server receipt validation — **designed here, implementation deferred** |
| D4 | API style | REST + JSON, versioned (`/v1`) |
| D5 | Auth tokens | Short-lived JWT access token + rotating refresh token |

## 2. Tradeoffs you accepted (read once, then build)

1. **Offline = broken app.** Every screen needs network. Mitigation: client caches last good response per endpoint (AsyncStorage), shows stale data silently.
2. **"Kept only for you" is now false.** Journals/moods live on your server. Either update the Today journal-hint copy, or encrypt journal text client-side with a device key (then server-side journal features are impossible — pick one).
3. **Latency on every tap.** Mitigation built into this contract: **aggregate endpoints** (`/v1/today`, `/v1/mirror`) — one request per screen, not ten.
4. **Streak correctness.** The client had a UTC midnight bug. Server must compute "today"/streaks in the **user's profile timezone** (`X-Timezone` header), never UTC.
5. **Register friction vs onboarding conversion.** Recommendation: keep onboarding local-first, prompt register **after first-mirror** (value shown → ask for account). `POST /profiles` accepts the full onboarding payload in one shot, so ordering stays flexible.

---

## 3. Conventions

### 3.1 Base URL

```
Production: https://api.astrovy.space/v1
Staging:    https://api-staging.astrovy.space/v1
```

### 3.2 Headers

| Header | Required | Notes |
|---|---|---|
| `Authorization: Bearer <access_token>` | All except `/auth/*`, `/cities` | |
| `Content-Type: application/json` | POST/PATCH | |
| `Idempotency-Key: <uuid>` | `POST /tarot/draws`, `POST /check-ins` | Retry-safe mutations |
| `X-Timezone: Asia/Jakarta` | All authed requests | IANA tz; drives "today"/streak math |

### 3.3 Dates & times

- Dates: `YYYY-MM-DD` (user-local, per `X-Timezone`)
- Timestamps: ISO 8601 UTC (`2026-08-01T07:00:00Z`)
- Birth time: `HH:mm` or `null`

### 3.4 Error envelope

All errors, all endpoints:

```json
{
  "error": {
    "code": "TAROT_LIMIT_REACHED",
    "message": "Free tier includes 1 draw per day.",
    "details": { "drawsRemaining": 0, "resetsAt": "2026-08-02T00:00:00+07:00" }
  }
}
```

| HTTP | `code` examples |
|---|---|
| 400 | `VALIDATION_ERROR` (`details.fields` = per-field messages) |
| 401 | `UNAUTHORIZED`, `TOKEN_EXPIRED`, `INVALID_CREDENTIALS` |
| 403 | `PREMIUM_REQUIRED`, `FORBIDDEN` |
| 404 | `NOT_FOUND` |
| 409 | `EMAIL_TAKEN`, `ALREADY_CHECKED_IN` |
| 429 | `RATE_LIMITED` (+ `Retry-After` header) |
| 500 | `INTERNAL_ERROR` |

### 3.5 Pagination

Cursor-based on list endpoints: `?limit=20&cursor=<opaque>` → `{ "data": [...], "nextCursor": "string | null" }`.

### 3.6 Tier gating

Server returns **only what the caller's tier allows** (premium fields omitted for free users) and `403 PREMIUM_REQUIRED` on premium-only endpoints. Never ship premium content in a free response "hidden" — it's readable in the payload.

---

## 4. Domain models

### 4.1 `User`

```json
{
  "id": "usr_01J...",
  "email": "gy@example.com",
  "hasPassword": true,
  "linkedProviders": ["apple"],
  "createdAt": "2026-08-01T00:00:00Z"
}
```

### 4.2 `Profile` (birth data + preferences)

```json
{
  "name": "Gy",
  "birthDate": "1995-02-10",
  "birthTime": "06:30",
  "birthPlace": {
    "city": "Bandung", "country": "Indonesia",
    "timezone": "Asia/Jakarta", "lat": -6.9175, "lng": 107.6191
  },
  "mbti": "INFJ",
  "focus": "love",
  "onboardingComplete": true
}
```

`focus` enum: `love | lost | self-worth | career | healing | purpose`

### 4.3 `AstroProfile` (server-computed, read-only)

```json
{
  "sunSign": "aquarius",
  "lifePath": 7,
  "archetype": { "name": "The Quiet Strategist", "tagline": "...", "emoji": "🌿" },
  "natalChart": [
    { "planet": "sun", "sign": "aquarius", "degree": 318.4, "retrograde": false, "meaning": "..." }
  ]
}
```

Computed once at profile create/update; cached. Recomputed when birth fields change.

### 4.4 `Entitlement`

```json
{
  "tier": "premium",
  "status": "active",
  "productId": "astrovy_premium_annual",
  "expiresAt": "2027-08-01T00:00:00Z",
  "willRenew": true
}
```

`tier`: `free | premium` · `status`: `active | grace | expired | none`

### 4.5 Engagement models

```json
// CheckIn — mood enum: steady | tender | restless | quiet
{ "date": "2026-08-01", "mood": "steady", "createdAt": "..." }

// JournalEntry
{ "id": "jrn_...", "date": "2026-08-01", "prompt": "...", "text": "...", "createdAt": "..." }

// TarotDraw
{
  "id": "drw_...",
  "cardId": "the-moon",
  "name": "The Moon",
  "emoji": "🌙",
  "suit": "major-arcana",
  "reversed": false,
  "position": "present",
  "keywords": ["intuition", "shadow"],
  "meaning": "...",
  "date": "2026-08-01"
}
```

`meaning` is tier-appropriate text (free gets the free reading; premium gets the deep one).

---

## 5. Endpoints

### 5.1 Auth — `/auth`

#### `POST /auth/register`

```json
// REQ
{ "email": "gy@example.com", "password": "min8chars", "name": "Gy" }
// RES 201
{
  "user": { "id": "usr_...", "email": "gy@example.com" },
  "tokens": {
    "accessToken": "eyJ...", "accessTokenExpiresIn": 900,
    "refreshToken": "rft_...", "refreshTokenExpiresIn": 2592000
  }
}
```

Errors: `409 EMAIL_TAKEN`, `400 VALIDATION_ERROR`.

#### `POST /auth/login`

REQ `{ "email", "password" }` → RES 200, same shape as register.
Errors: `401 INVALID_CREDENTIALS` — identical message for unknown email vs wrong password (no enumeration).

#### `POST /auth/social`

```json
// REQ — provider: apple | google
{ "provider": "apple", "identityToken": "<provider identity token>" }
// RES 200 → same shape as register. Unknown email → account created implicitly.
```

#### `POST /auth/refresh`

REQ `{ "refreshToken" }` → RES 200, new token pair; old refresh token revoked (rotation).

#### `POST /auth/logout` · auth

Revokes the presented refresh token. RES `204`.

#### `POST /auth/password/forgot`

REQ `{ "email" }` → always RES `202` (no enumeration). Sends reset link.

#### `POST /auth/password/reset`

REQ `{ "token", "newPassword" }` → RES `204`.

---

### 5.2 Cities — onboarding location search

#### `GET /cities?q={query}&limit=8`

No auth (used pre-register). Replaces the `src/services/cities.ts` mock — keep the client function signature identical.

```json
// RES 200
{ "data": [
  { "city": "Bandung", "country": "Indonesia", "timezone": "Asia/Jakarta", "lat": -6.9175, "lng": 107.6191 }
] }
```

Min query length 2; fuzzy name+country match. (Alternative: keep shipping the bundled city list and skip this endpoint until usage justifies it — your call.)

---

### 5.3 Profile — `/profiles`

#### `POST /profiles` · auth

One-shot onboarding submit (called from the `generating` screen). **Triggers AstroProfile computation** — the server-side replacement for the fake 4s `generating` animation.

```json
// REQ — full OnboardingData from OnboardingContext
{
  "name": "Gy",
  "birthDate": "1995-02-10",
  "birthTime": "06:30",
  "birthPlace": { "city": "Bandung", "country": "Indonesia", "timezone": "Asia/Jakarta", "lat": -6.9175, "lng": 107.6191 },
  "mbti": "INFJ",
  "focus": "love"
}
// RES 201
{ "profile": { "...Profile" }, "astro": { "...AstroProfile" } }
```

#### `GET /profiles/me` · auth

RES 200 `{ "profile": {...}, "astro": {...} }`.
Client caches this; it's the source that kills every hardcoded "Gy / Aquarius Sun / Life Path 7 / Quiet Strategist" across ~6 screens.

#### `PATCH /profiles/me` · auth

Partial update of any Profile field. Birth-field changes → AstroProfile recomputed; response includes the new `astro`.

#### `GET /natal-chart` · auth

Full planet list for the `horoscope` screen chart (fed as props into `NatalChart`, replacing hardcoded `natalPlanets`).

```json
// RES 200
{ "planets": [
  { "planet": "sun", "symbol": "☉", "degree": 318.4, "sign": "aquarius",
    "signSymbol": "♒", "house": 10, "retrograde": false, "meaning": "..." }
] }
```

---

### 5.4 Today digest — the aggregate

#### `GET /today` · auth

**One request powers the entire Today tab.** All fields computed in user tz.

```json
// RES 200
{
  "date": "2026-08-01",
  "user": { "name": "Gy" },
  "streak": 5,
  "checkedInToday": true,
  "todayMood": "steady",
  "moodResponse": "Grounded today. Trust what's working.",
  "dailyReading": {
    "signal": { "title": "...", "sub": "..." },
    "insight": "...",
    "move": "...",
    "attribution": "for Aquarius Sun, Life Path 7"
  },
  "energies": [
    { "label": "Calm", "value": 0.8 },
    { "label": "Direct", "value": 0.6 },
    { "label": "Testing", "value": 0.4 }
  ],
  "journal": {
    "prompt": "What do I need but avoid asking for?",
    "lastEntry": { "id": "jrn_...", "date": "2026-07-30", "text": "..." }
  },
  "patternAlert": { "mood": "tender", "message": "Three tender days. Something is asking to be understood." },
  "weeklyReading": {
    "id": "wr_2026w31",
    "title": "...",
    "body": "...",
    "isNew": true,
    "dismissed": false
  },
  "tarot": { "drawsRemaining": 1, "limit": 1 },
  "tier": "free"
}
```

`patternAlert` is `null` when no 3-consecutive-mood pattern. `moodResponse` is `null` until check-in. `energies` may be omitted in v1 (currently hardcoded client-side).

---

### 5.5 Check-ins & journal

#### `POST /check-ins` · auth · idempotent

Mood check-in from Today. **Server updates the streak** and returns the new value — the single source of truth for streaks.

```json
// REQ
{ "mood": "steady" }
// RES 201
{ "checkIn": { "date": "2026-08-01", "mood": "steady" }, "streak": 6,
  "moodResponse": "Grounded today. Trust what's working.",
  "patternAlert": null }
```

Errors: `409 ALREADY_CHECKED_IN` (return current state anyway in `details`).

#### `GET /check-ins?from=YYYY-MM-DD&to=YYYY-MM-DD` · auth

History for Mirror grids. Default: last 30 days.

#### `POST /journal-entries` · auth

```json
// REQ
{ "text": "...", "prompt": "What do I need but avoid asking for?" }
// RES 201
{ "entry": { "...JournalEntry" }, "reflections": 4 }
```

`reflections` = new total (drives the "3 reflections to unlock" gate server-side).

#### `GET /journal-entries?limit=20&cursor=...` · auth

Newest first. Powers Mirror "Your reflections" list.

#### `DELETE /journal-entries/{id}` · auth → `204`. (Optional v1.)

---

### 5.6 Tarot — `/tarot`

Server-side RNG replaces `tarotEngine.ts`. The 78-card catalog (`src/lib/tarot.ts`) moves server-side; the app keeps only rendering. Archetype comes from the user's AstroProfile — never sent by the client.

#### `GET /tarot/draws/today` · auth

Restores state when reopening the screen mid-day.

```json
// RES 200
{ "draws": [ { "...TarotDraw" } ], "drawsRemaining": 0, "limit": 1,
  "resetsAt": "2026-08-02T00:00:00+07:00" }
```

#### `POST /tarot/draws` · auth · idempotent

```json
// REQ
{ "spread": "single" }   // free: "single" (1 card, random position). premium: "three" (past/present/future)
// RES 201
{ "draws": [ { "...TarotDraw" } ], "drawsRemaining": 2, "limit": 3 }
```

Server rules (port from `tarotEngine.ts`): past+present from archetype pool, future from full deck, unique cards within a spread, 20% reversal chance.
Errors: `403 PREMIUM_REQUIRED` (`spread: "three"` on free tier), `429 TAROT_LIMIT_REACHED` (`details.resetsAt`).

`share-tarot` screen renders from the draw payload — **no endpoint** (image capture is client-side).

---

### 5.7 Readings — `/readings`

Long-form generated content. All tier-gated per §3.6. Cacheable client-side for 24h (`ETag` or `cacheUntil` field).

#### `GET /readings/astrovy` · auth

Powers the Astrovy tab (6 sections).

```json
// RES 200 (premium; free gets "core" only + "locked": true)
{ "archetype": { "name": "The Quiet Strategist", "tagline": "...", "emoji": "🌿" },
  "badges": ["Aquarius Sun", "Life Path 7", "Love Focus"],
  "sections": [
    { "key": "emotional", "title": "Emotional Core", "core": "...",
      "pattern": "...", "insight": "...", "affirmation": "..." }
  ],
  "weeklyTheme": { "title": "...", "body": "..." } }
```

Free-tier response: each section has `core` + `"locked": true`, deep fields omitted.

#### `GET /readings/love` · auth

Powers the Love screen.

```json
// RES 200
{ "hero": "...",
  "insights": [
    { "key": "attachment", "title": "How you attach", "body": "..." },
    { "key": "give", "title": "How you give love", "body": "..." },
    { "key": "need", "title": "What you need", "body": "..." },
    { "key": "trigger", "title": "Your triggers", "body": "..." },
    { "key": "growth", "title": "Your growth edge", "body": "..." }
  ] }
```

#### `GET /readings/weekly` · auth

Standalone weekly reading (also embedded in `/today`). Query `?current=true` → current week only.

```json
// RES 200
{ "id": "wr_2026w31", "weekStart": "2026-07-27", "title": "...", "body": "...",
  "isNew": true, "dismissed": false }
```

#### `POST /readings/weekly/{id}/dismiss` · auth → `204`. Sets `dismissed=true` for the digest.

---

### 5.8 Horoscope — `/horoscope`

#### `GET /horoscope/daily?date=YYYY-MM-DD` · auth

Default: today (user tz). Powers the horoscope screen's 4 category tabs.

```json
// RES 200
{ "date": "2026-08-01",
  "categories": { "overview": "...", "love": "...", "career": "...", "growth": "..." },
  "moonPhase": { "phase": "full", "name": "Full Moon", "emoji": "🌕",
                 "illumination": 0.99, "meaning": "..." },
  "luckyHour": "14:00", "color": "#7B61FF", "affirmation": "..." }
```

Natal chart visual: `GET /natal-chart` (§5.3).

---

### 5.9 Compatibility — `/compatibility`

#### `POST /compatibility/readings` · auth

Replaces the fake 1.8s timer + hardcoded 74%.

```json
// REQ
{ "partnerName": "Alex", "partnerSign": "leo" }   // partnerName optional
// RES 201
{ "id": "cmp_...",
  "userSign": "aquarius", "partnerSign": "leo", "partnerName": "Alex",
  "scores": { "overall": 74, "love": 80, "communication": 68, "friendship": 75 },
  "sections": [
    { "key": "draws", "title": "What draws you together", "body": "..." },
    { "key": "friction", "title": "Where you rub", "body": "..." },
    { "key": "growth", "title": "How you grow", "body": "..." }
  ],
  "quote": "..." }
```

Errors: `403 PREMIUM_REQUIRED` (compatibility is premium per Decode screen).

#### `GET /compatibility/readings?limit=10` · auth

Past readings (enables a "recent comparisons" row later). Optional v1.

---

### 5.10 Mirror — aggregate

#### `GET /mirror` · auth

One request powers the Mirror tab.

```json
// RES 200
{
  "streak": 5,
  "reflections": 4,
  "reflectionsToUnlock": 3,
  "days": [
    { "date": "2026-07-26", "dayLetter": "S", "checkedIn": true,
      "mood": "steady", "journaled": true }
  ],
  "moodPattern": { "topMood": "steady", "count": 4, "window": 7, "advice": "..." },
  "recentEntries": [ { "...JournalEntry (x5)" } ],
  "savedReadings": [
    { "key": "snapshot", "title": "Free Snapshot", "unlocked": true },
    { "key": "astrovy", "title": "Full Astrovy", "unlocked": false }
  ]
}
```

`days` = trailing 7 days. `moodPattern` is `null` with <3 entries.

---

### 5.11 Feedback

#### `POST /feedback` · auth

Generic — covers first-mirror accuracy and love-reading resonance (both currently discarded client-side).

```json
// REQ — targetType: first_mirror | love_reading | daily_reading | tarot_draw
//       value: accurate | partial | inaccurate   (first_mirror)
//              yes | somewhat | no               (readings)
{ "targetType": "love_reading", "targetId": null, "value": "somewhat" }
// RES 204
```

---

### 5.12 Account — `/users`

#### `GET /users/me` · auth

Profile screen identity block.

```json
// RES 200
{ "user": { "...User" }, "profile": { "...Profile" },
  "astro": { "...AstroProfile" }, "entitlement": { "...Entitlement" } }
```

#### `DELETE /users/me` · auth

Profile screen "Delete account". REQ `{ "password": "..." }` (password-less social accounts: `{ "confirm": "DELETE" }`).
→ `204`. Server hard-deletes user, profile, engagement, journals, draws, readings. Client then wipes AsyncStorage and routes to onboarding welcome.

---

### 5.13 Entitlements & IAP (designed, implementation deferred)

#### `GET /entitlements/me` · auth

Replaces `TierContext`'s in-memory boolean as the premium gate everywhere.

```json
// RES 200
{ "tier": "premium", "status": "active", "productId": "astrovy_premium_annual",
  "expiresAt": "2027-08-01T00:00:00Z", "willRenew": true }
```

#### `GET /products` · auth

Pricing screen display data (until StoreKit/Play Billing provides localized prices client-side — then this becomes optional).

```json
// RES 200
{ "products": [
  { "id": "astrovy_premium_monthly", "period": "monthly", "price": "9.00", "currency": "USD" },
  { "id": "astrovy_premium_annual", "period": "annual", "price": "72.00", "currency": "USD",
    "badge": "Save $36", "monthlyEquivalent": "6.00" }
],
  "features": ["Full natal chart", "Weekly personalized readings",
               "Compatibility with any sign", "Three-card daily tarot",
               "Unlimited journal history"] }
```

#### `POST /iap/apple/verify` · auth — **deferred**

REQ `{ "receiptData": "<base64 App Store receipt>" }` → validates with Apple, upserts entitlement. RES 200 `{ "...Entitlement" }`.

#### `POST /iap/google/verify` · auth — **deferred**

REQ `{ "purchaseToken": "...", "productId": "..." }` → validates with Play Developer API. RES 200 `{ "...Entitlement" }`.

> When implemented, also needs: App Store Server Notifications + Play RTDN webhook endpoints (server-to-server, not called by the app) to handle renewals/cancellations/refunds. Out of this contract's scope — note it so you don't design yourself into a corner.

---

### 5.14 Devices (future — push notifications)

#### `POST /devices` · auth — **future**

REQ `{ "expoPushToken": "ExponentPushToken[...]", "platform": "ios" }` → `201`. Enables "Daily Signal" reminders later. Not in v1 scope but cheap to add when the table exists.

---

## 6. Page → endpoint map (the thing you asked for)

| Screen | Endpoints | Replaces (current client source) |
|---|---|---|
| **(onboarding) welcome** | — | — |
| **(onboarding) name** | — (local state) | — |
| **(onboarding) birth-date / birth-time** | — (local state) | — |
| **(onboarding) location** | `GET /cities` | `src/services/cities.ts` mock (signature unchanged) |
| **(onboarding) mbti / focus-mood** | — (local state) | — |
| **(onboarding) generating** | `POST /profiles` | fake 4s `setTimeout` animation → real compute call |
| **(onboarding) first-mirror** | (data from `POST /profiles` response) + `POST /feedback` | hardcoded archetype/cards; discarded feedback |
| **register/login screen (new)** | `POST /auth/register`, `POST /auth/social`, `POST /auth/login` | — (new screen, prompt after first-mirror) |
| **(tabs) today** | `GET /today`, `POST /check-ins`, `POST /journal-entries` | `dailyContent.ts`, `useEngagement` (local), hardcoded energies/prompts |
| **(tabs) astrovy** | `GET /readings/astrovy` | hardcoded `sections[]` + hardcoded archetype/badges |
| **(tabs) decode** | — (uses cached entitlement from `GET /entitlements/me`) | `TierContext` boolean |
| **(tabs) mirror** | `GET /mirror` | `useEngagement` journal/mood/streak derivations |
| **(tabs) profile** | `GET /users/me`, `PATCH /profiles/me`, `DELETE /users/me`, `GET /entitlements/me` | hardcoded identity; fake tier toggle |
| **love** | `GET /readings/love`, `POST /feedback` | hardcoded `insights[]`; discarded feedback buttons |
| **compatibility** | `POST /compatibility/readings` | fake timer + hardcoded 74%/sections |
| **horoscope** | `GET /horoscope/daily`, `GET /natal-chart` | `horoscope.ts` day-indexed arrays, hardcoded `natalPlanets` |
| **tarot** | `GET /tarot/draws/today`, `POST /tarot/draws` | `tarotEngine.ts` client RNG + local draw limits |
| **share-tarot** | — (renders from draw payload) | — |
| **share-card** | — (client-side image capture) | — |
| **snapshot** | — (renders from cached `GET /profiles/me` + `GET /readings/astrovy`) | hardcoded archetype hero/cards |
| **pricing** | `GET /products`, `POST /iap/{apple,google}/verify` (deferred) | hardcoded plans; dead CTA |

**Total: 26 endpoints** (2 deferred IAP, 1 future devices, 1 optional cities).

---

## 7. Client refactor notes (what changes in this repo)

1. `OnboardingContext` → submit via `POST /profiles` on `generating`; keep local copy for resume.
2. `TierContext` → backed by `GET /entitlements/me` (cache + revalidate on app foreground).
3. `useEngagement` → thin wrapper over `/check-ins`, `/journal-entries`, `/tarot`, `/mirror`. AsyncStorage becomes **cache**, not source of truth.
4. `src/lib/tarot.ts`, `tarotEngine.ts`, `dailyContent.ts`, `horoscope.ts` → deleted; content arrives from API.
5. New: `src/lib/api.ts` (fetch wrapper: base URL, auth header, token-refresh retry, `X-Timezone`, error envelope parsing) + `src/lib/auth.ts` (token storage in `expo-secure-store`, not AsyncStorage — tokens are secrets).
6. Startup routing: hydrated check becomes token check (`/users/me` 401 → login screen).

## 8. Open questions (answer before backend sprint)

1. **Content generation**: curated arrays ported server-side, or LLM-generated per user? LLM → add `POST /readings/*/regenerate` + cost/latency budget + moderation. This is your biggest cost decision.
2. **Journal privacy** (§2.2): update copy, or client-side encryption?
3. **Social providers at v1?** Apple is effectively mandatory on iOS if you offer any social login.
4. **Cities**: endpoint, or keep the bundled list?
5. **Account deletion grace period** (immediate hard delete vs 30-day soft delete)?
6. **Rate limits** per endpoint class (auth stricter than reads)?

---

## Changelog

| Date | Change |
|---|---|
| 2026-08-01 | v1 draft — initial contract |

