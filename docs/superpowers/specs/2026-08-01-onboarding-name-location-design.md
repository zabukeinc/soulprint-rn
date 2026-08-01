# Onboarding: Name Step + Birthplace Revamp — Design

> Date: 2026-08-01. Status: approved by user. App: **Astrovy** (RN, Expo Router).

## Goal

1. Add a **name input** step to onboarding (currently no name is ever collected; "Gy" is hardcoded in `app/snapshot.tsx` and `app/(onboarding)/first-mirror.tsx`).
2. Revamp the **birthplace step** (`app/(onboarding)/location.tsx`) — currently a hardcoded 10-city list with flag emojis, preselected index 0, no real data. Birthplace is needed for **real astrological calculation** → requires lat/lng + timezone per city.

## Key Decisions (recorded at user request)

| Decision | Choice | Rationale |
|---|---|---|
| Birthplace purpose | Real astro calc | Needs coords + IANA timezone, not vibes |
| City data source | **Mock first, backend later** | Backend endpoint doesn't exist yet; mock must use **real coords** (fake coords → garbage readings in dev) |
| API contract | Locked now: `{id, name, country, lat, lng, timezone, gmt}` (IANA tz + display offset e.g. `"GMT+7"`) | Backend swap touches one file only; `gmt` precomputed in mock — avoids relying on Hermes `Intl` support |
| Location layout | **A — search-first minimal** | No hero card/flags; title → search → results w/ coords + GMT chip (approved via browser mockup) |
| Name placement | Own screen, first (after welcome) | One job per screen; personalizes all later screens |
| GPS detect | Rejected | GPS = current location ≠ birthplace; confuses intent |
| Persistence | AsyncStorage `astrovy_onboarding` via context | Nothing in onboarding was persisted before; name would vanish without it |

## Flow (8 screens)

```
welcome → name (NEW) → birth-date → birth-time → location → mbti → focus-mood → generating → first-mirror
```

- Register `name` in `app/(onboarding)/_layout.tsx` Stack.
- Renumber all step indicators "X of 6" → "X of 7"; `ProgressDots total={7}` on every screen; name screen = step 1 of 7 (index 0).

## 2. Name Screen — `app/(onboarding)/name.tsx`

- Uppercase label: "First things first"; serif title: "What should the stars call you?"
- Single `TextInput`, autofocus, `maxLength={30}`, `returnKeyType="done"`.
- Gradient Continue button (existing pattern) — **disabled** until `name.trim().length > 0`.
- On continue: save to context → `router.push('/(onboarding)/birth-date')`.
- Visual patterns copied from existing screens: `FadeInUp` entrance, `ProgressDots`, warm card styles from `theme`.

## 3. Location Revamp — `app/(onboarding)/location.tsx`

**Remove:** hardcoded `cities` array, flag emojis, hero card + `IllustrationMood`, preselected default (`useState(0)`), "Selected" card.

**New behavior:**
- Title block kept: label "Place matters", title "Where were you born?", desc "We use it to anchor your chart."
- Search input → **300ms debounce** → `searchCities(query)`.
- Result rows: `📍 {name}` + `{lat}°N/S, {lng}°E/W` meta + `{gmt}` chip (straight from data, no runtime tz math).
- Tap row → selected state (existing purple highlight style). Continue **disabled until a selection exists**.
- States: idle ("Start typing your birth city"), searching→results, no-results ("No matches — try a nearby larger city").

## 4. Data Layer

- `src/data/cities.mock.ts` — ~80 real cities (Indonesia-heavy + world majors): `{id, name, country, lat, lng, timezone}`.
- `src/services/cities.ts` — `export async function searchCities(query: string): Promise<City[]>` (case-insensitive substring on name/country, limit 8). **Only this file changes when backend lands.**
- `src/context/OnboardingContext.tsx` — state `{name, birthDate, birthTime, birthPlace: City | null, mbti, focusMood}` + `update(patch)` + `clear()`; loads/saves AsyncStorage key `astrovy_onboarding`; provider wraps **root `app/_layout.tsx`** (snapshot.tsx lives outside the `(onboarding)` group and needs `name`).

## 5. Consumers

- `app/snapshot.tsx`, `app/(onboarding)/first-mirror.tsx`: replace hardcoded "Gy" with context `name` (fallback "friend" if empty).
- `app/(onboarding)/generating.tsx`: read stored answers (birth date/place feed the "reading" copy).

## 6. Error Handling & Risks

- Search is local/sync behind async interface → no network errors now; backend swap is transparent.
- **Stale-state risk:** half-finished onboarding persists. Mitigation: clear `astrovy_onboarding` on welcome mount (restarting onboarding resets answers). Do NOT clear on completion — `name` must persist app-wide (snapshot.tsx greeting) until a profile/settings owner exists.
- Empty name can never be saved (Continue disabled).

## 7. Testing

- No test framework in project (no jest). Verification = `npx tsc --noEmit` + manual simulator walkthrough of all 8 screens.
- Adding jest is a separate decision, out of scope.

## Out of Scope

- Backend city endpoint implementation, GPS/reverse geocoding, chart calculation itself, jest setup.
