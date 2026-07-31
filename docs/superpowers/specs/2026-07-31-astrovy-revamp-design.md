# Astrovy Revamp — Design Spec

> Full visual + functional revamp of the Soulprint React Native app, rebranded as **Astrovy**, following the Astrovy Brand Guidelines (`references/Astrovy BG.html`).

---

## 1. Context

### Current State

The app is a polished prototype at `app/` using Expo Router. It has:
- 8 onboarding screens (welcome → first-mirror)
- 5 tab screens (Today, Soulprint, Decode, Mirror, Profile)
- 7 secondary screens (tarot, horoscope, love, compatibility, snapshot, share-card, share-tarot, pricing)
- A tarot engine (78 cards), daily content arrays, and an AsyncStorage engagement hook

### Critical Problems Being Fixed

1. **Onboarding data discarded** — each screen holds local state; nothing persisted
2. **Hardcoded identity** — "Gy", Aquarius, Life Path 7, Bandung everywhere
3. **Startup always restarts onboarding** — `app/index.tsx` unconditionally redirects to welcome
4. **Fake premium** — `TierContext` is in-memory boolean; pricing CTA does nothing
5. **Non-functional sharing** — no native share or image capture
6. **UTC date bug** — `toISOString()` causes streak/tarot limit errors near midnight
7. **Visual mismatch** — current beige/green theme doesn't match Astrovy guidelines
8. **Overwrought copy** — precious vocabulary, redundant CTAs, pre-explanatory cards

### Decisions (Approved)

- **Brand:** Astrovy (full rename)
- **Scope:** Visual + Functional
- **Persistence:** Local (AsyncStorage) — no backend
- **Astrology:** Local calculation (simplified mean orbital elements)
- **Sharing:** Image capture (`react-native-view-shot`) + native share (`expo-sharing`)
- **Navigation:** Keep 5-tab structure; rename "Soulprint" tab to "Astro"
- **Approach:** Foundation first, then screens (Approach B)

---

## 2. Architecture

```
App
├── Design System (src/design/)
│   ├── tokens.ts              # Colors, typography, radii, spacing, shadows, gradients, motion
│   ├── fonts.ts               # Poppins + DM Sans loading
│   └── primitives/            # Button, Card, Badge, Chip, Input, Divider, Screen, StarField, Eyebrow
│
├── State (src/context/ + src/hooks/)
│   ├── ProfileContext.tsx     # Persisted onboarding/profile data
│   ├── TierContext.tsx        # Persisted premium state
│   └── useEngagement.ts       # Refactored: error states, local dates, hydration flag
│
├── Engine (src/lib/astrology/)
│   ├── zodiac.ts              # Sign, element, modality, symbol, dates
│   ├── numerology.ts          # Life path, expression number
│   ├── moonPhase.ts           # Moon phase from date
│   ├── natal.ts               # Sun/Moon/Mercury/Venus/Mars positions
│   ├── archetype.ts           # Derive archetype from zodiac + numerology + focus
│   ├── horoscope.ts           # Daily horoscope generation from natal data
│   └── compatibility.ts       # Sign-pair compatibility matrix
│
├── Content (src/lib/)
│   ├── dailyContent.ts        # Existing arrays, refactored for dynamic mood labels
│   ├── tarot.ts               # Existing 78-card deck
│   ├── tarotEngine.ts         # Existing, refactored for dynamic archetype
│   └── compatibility.ts       # New: sign-pair compatibility matrix
│
├── Components (src/components/)
│   ├── BottomNav.tsx          # Redesigned with Astrovy style
│   ├── NatalChart.tsx         # Redesigned
│   ├── VisualStreakTracker.tsx
│   ├── WeeklyReadingCard.tsx
│   ├── PatternAlertCard.tsx
│   ├── Illustrations.tsx
│   ├── SoftMascot.tsx
│   ├── ProgressDots.tsx
│   └── ShareCardView.tsx      # New: composable shareable card
│
├── Infrastructure (src/lib/)
│   ├── storage.ts             # AsyncStorage wrapper with error handling
│   ├── dates.ts               # Local date utilities (fix UTC bug)
│   └── share.ts               # View shot + native share
│
└── Screens (app/)
    ├── (onboarding)/          # All screens use ProfileContext
    ├── (tabs)/                # All screens use new design system + real data
    └── *.tsx                  # Secondary screens redesigned
```

### Key Architecture Decisions

1. **Design system in `src/design/`** — single source of truth. No inline colors/hex in screens.
2. **ProfileContext replaces all hardcoded identity** — name, zodiac, life path, archetype, focus, location from persisted data.
3. **Astrology engine is pure functions** — no React, no state. Testable in isolation.
4. **Startup routing checks profile existence** — `app/index.tsx` reads ProfileContext.
5. **Storage layer wraps AsyncStorage** — centralized error handling, typed keys.
6. **Date utilities fix UTC bug** — all comparisons use local date strings.

---

## 3. Design System

### 3.1 Color Tokens

The 6 brand colors from the reference — no others:

| Name | Hex | Role |
|---|---|---|
| Deep Space | `#0F0F23` | Primary Text · BG Dark |
| Royal Violet | `#7B61FF` | Primary Brand · CTA |
| Soft Lavender | `#B39DFF` | Accent · Highlights |
| Pastel Lilac | `#E2C6FF` | Borders · Subtle Fill |
| Light Background | `#F3F0FF` | Surface · Cards BG |
| Cosmic Gray | `#6B6B7D` | Secondary Text |
| White | `#FFFFFF` | (utility) |

### Approved Contrast Combinations

| Pair | Contrast | Use |
|---|---|---|
| Deep Space on White | 15.3:1 | Primary body text |
| White on Royal Violet | 5.1:1 | Buttons, CTAs |
| Soft Lavender on Deep Space | 6.8:1 | Dark mode accents |

### 3.2 Gradients

Exactly 3 brand gradients from the reference:

| Name | Angle | Stops |
|---|---|---|
| Cosmic Violet | 135° | `#A78BFF → #7B61FF` |
| Deep Orbit | 135° | `#7B61FF → #0F0F23` |
| Nebula | 180° | `#E2C6FF → #B39DFF → #7B61FF` |

App background: solid `#F3F0FF` (Light Background). Gradients used only for hero/dark surfaces and premium cards.

### 3.3 Typography

Two typefaces: **Poppins** (headings) and **DM Sans** (body).

| Label | Font | Weight | Size | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| Display | Poppins | 800 | 88px | 96 | -2.64 |
| H1 | Poppins | 700 | 48px | 56 | -0.96 |
| H2 | Poppins | 600 | 32px | 40 | -0.32 |
| H3 | Poppins | 600 | 24px | 32 | 0 |
| Body Large | DM Sans | 400 | 18px | 30.6 | 0 |
| Body | DM Sans | 400 | 16px | 27.2 | 0 |
| Caption | DM Sans | 500 | 12px | 19.2 | 0 |
| Eyebrow | DM Sans | 700 | 11px | 16 | 2.2 (uppercase) |

Loaded via `expo-google-fonts/poppins` and `expo-google-fonts/dm-sans`.

### 3.4 Spacing

```
4, 8, 12, 16, 24, 32, 48, 64, 80
```

### 3.5 Border Radius

| Token | Value | Use |
|---|---|---|
| xs | 4 | Small elements |
| sm | 8 | |
| md | 12 | |
| lg | 16 | |
| xl | 20 | Cards (from component examples) |
| xxl | 28 | |
| full | 100 | Pill buttons |

### 3.6 Shadows

| Token | Color | Offset | Opacity | Radius | Use |
|---|---|---|---|---|---|
| ctaPrimary | `#7B61FF` | 0, 4 | 0.35 | 16 | Primary buttons |
| ctaPrimaryHover | `#7B61FF` | 0, 8 | 0.45 | 24 | Button press/hover |
| card | `#7B61FF` | 0, 4 | 0.12 | 16 | Light cards |
| cardHover | `#7B61FF` | 0, 12 | 0.15 | 40 | Card press/hover |

### 3.7 Motion

Durations:

| Token | ms | Use |
|---|---|---|
| micro | 100 | Hover, press |
| fast | 200 | Toggle |
| base | 300 | Standard transition |
| medium | 400 | Modal |
| slow | 600 | Page |
| ambient | 1000 | Loops |

Easings:

| Token | Cubic Bezier | Use |
|---|---|---|
| easeOut | `0, 0, 0.2, 1` | Entrances, reveals |
| easeIn | `0.4, 0, 1, 1` | Exits, dismissals |
| spring | `0.34, 1.56, 0.64, 1` | Buttons, interactions |
| linear | `0, 0, 1, 1` | Progress, loops |

### 3.8 Component Primitives

```
src/design/primitives/
├── Button.tsx     # primary | secondary | ghost | dark; sm | md | lg; pill-shaped
├── Card.tsx       # light | dark | gradient | soft; pressable optional
├── Badge.tsx      # pill badges: New, Premium, Pro, Astrology, Live, Beta, Soon
├── Chip.tsx       # selectable chips (mood, focus, MBTI)
├── Input.tsx      # text input with Astrovy styling
├── Divider.tsx
├── Screen.tsx     # screen wrapper with gradient bg + safe area
├── StarField.tsx  # decorative star background for dark surfaces
├── Eyebrow.tsx    # section label with violet line prefix
└── index.ts       # barrel export
```

#### Button Contract

```ts
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  onPress?: () => void
  disabled?: boolean
  loading?: boolean
  icon?: ReactNode
  fullWidth?: boolean
}
```

- Pill-shaped (`radii.full`)
- Poppins semibold
- Press state: scale 0.97 with spring easing
- Disabled: 50% opacity
- Primary CTA: violet shadow when not disabled
- Loading: spinner replaces children

#### Card Contract

```ts
interface CardProps {
  variant: 'light' | 'dark' | 'gradient' | 'soft'
  children: ReactNode
  padding?: keyof typeof spacing
  radius?: keyof typeof radii
  shadow?: keyof typeof shadows
  onPress?: () => void
  style?: ViewStyle
}
```

---

## 4. State Architecture

### 4.1 Storage Layer (`src/lib/storage.ts`)

Typed AsyncStorage wrapper. Keys:

- `astrovy_profile`
- `astrovy_engagement`
- `astrovy_tier`
- `astrovy_onboarding_complete`

Functions:
- `loadJSON<T>(key)` → `{ ok, data, error }`
- `saveJSON<T>(key, value)` → `{ ok, error }`
- `removeKey(key)` → `{ ok, error }`
- `clearAllAppData()` → clears all 4 keys

Errors surface, never swallowed.

### 4.2 Date Utilities (`src/lib/dates.ts`)

- `getLocalDateString(date?)` → `YYYY-MM-DD` in local time
- `getYesterdayString()` → local yesterday
- `getDayOfYear(date?)` → number
- `getWeekNumber(date?)` → ISO week number
- `isSameDay(dateStr, date?)` → boolean

Replaces all `toISOString().split('T')[0]` usage.

### 4.3 ProfileContext

```ts
interface BirthData {
  date: string              // 'YYYY-MM-DD' — validated
  time: string | null       // 'HH:MM' or null if skipped
  location: {
    city: string
    country: string
    timezone: string        // 'Asia/Jakarta', etc.
    lat: number | null
    lng: number | null
  }
}

interface ProfileData {
  name: string | null
  birth: BirthData
  mbti: string | null
  focus: string             // 'love' | 'lost' | 'self-worth' | 'career' | 'healing' | 'purpose'
  feedback: {
    firstMirrorAccuracy: 'accurate' | 'partial' | 'inaccurate' | null
  }
  createdAt: string
}

interface ProfileContextValue {
  profile: ProfileData | null
  hydrated: boolean
  hasProfile: boolean
  setBirthDate, setBirthTime, setLocation, setMbti, setFocus, setName
  setFirstMirrorFeedback
  finalizeProfile()
  clearProfile(): Promise<void>
}
```

Behaviors:
- Incremental persistence — each onboarding step saves immediately
- `hasProfile` = `profile !== null && onboardingComplete === true`
- `finalizeProfile()` sets onboarding complete
- Birth time `null` when skipped (not `23:59`)
- Location includes timezone + coordinates

### City Data

```ts
const CITIES = [
  { city: 'Bandung',     country: 'Indonesia',    timezone: 'Asia/Jakarta',        lat: -6.9175,  lng: 107.6191 },
  { city: 'Jakarta',     country: 'Indonesia',    timezone: 'Asia/Jakarta',        lat: -6.2088,  lng: 106.8456 },
  { city: 'Surabaya',    country: 'Indonesia',    timezone: 'Asia/Jakarta',        lat: -7.2575,  lng: 112.7521 },
  { city: 'Bali',        country: 'Indonesia',    timezone: 'Asia/Makassar',       lat: -8.3405,  lng: 115.0920 },
  { city: 'Yogyakarta',  country: 'Indonesia',    timezone: 'Asia/Jakarta',        lat: -7.7956,  lng: 110.3695 },
  { city: 'New York',    country: 'USA',          timezone: 'America/New_York',    lat: 40.7128,  lng: -74.0060 },
  { city: 'Los Angeles', country: 'USA',          timezone: 'America/Los_Angeles', lat: 34.0522,  lng: -118.2437 },
  { city: 'London',      country: 'UK',           timezone: 'Europe/London',       lat: 51.5074,  lng: -0.1278 },
  { city: 'Tokyo',       country: 'Japan',        timezone: 'Asia/Tokyo',          lat: 35.6762,  lng: 139.6503 },
  { city: 'Sydney',      country: 'Australia',    timezone: 'Australia/Sydney',    lat: -33.8688, lng: 151.2093 },
]
```

### 4.4 TierContext (Persisted)

```ts
interface TierContextValue {
  isPremium: boolean
  hydrated: boolean
  toggleTier()
  setPremium(value: boolean)
  upgrade()    // stub for future billing
  restore()    // stub for future billing
}
```

- Persisted to `astrovy_tier`
- `hydrated` flag for loading states
- Profile toggle still works, now persists
- `upgrade()` / `restore()` currently call `setPremium(true)`

### 4.5 useEngagement (Refactored)

Key fixes:
- Uses `getLocalDateString()` instead of `toISOString()`
- Functional state updates everywhere (`setState((prev) => ...)`)
- `hydrated` flag exposed
- `error` state surfaced
- Journal prompt parameterized (not hardcoded)
- Storage key: `astrovy_engagement`
- `clearAllData()` calls `clearAllAppData()` (clears everything)

```ts
interface UseEngagementResult extends EngagementState {
  hydrated: boolean
  error: string | null
  checkInToday, addJournalEntry, addMood, unlockReading
  canUnlock, reflectionsNeeded, getStreakDays
  clearAllData: () => Promise<void>
  getConsecutiveMood, getWeeklyReadingStatus
  markWeeklyReadingSeen, dismissWeeklyReading
  drawTarotCard, canDrawTarot, getTarotDrawsRemaining
}
```

### 4.6 Startup Routing

```tsx
// app/index.tsx
if (!hydrated) return <LoadingScreen />
if (hasProfile) return <Redirect href="/(tabs)/today" />
return <Redirect href="/(onboarding)/welcome" />
```

### 4.7 Onboarding Resume

When ProfileContext hydrates with partial data (onboarding incomplete):

- No data → welcome
- Has birth date, no time → birth-time
- Has time, no location → location
- Has location, no mbti → mbti
- Has mbti, no focus → focus-mood
- Has focus, not finalized → generating

Resume screen shown before the step:
- Eyebrow: "Welcome back"
- Title: "Let's pick up where you left off."
- CTA: "Continue" → last incomplete step
- Secondary: "Start over" → clears partial profile, routes to welcome

### 4.8 Root Layout

```tsx
<SafeAreaProvider>
  <ProfileProvider>
    <TierProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </TierProvider>
  </ProfileProvider>
</SafeAreaProvider>
```

Gradient background and SafeAreaView move into `Screen` primitive.

---

## 5. Astrology Engine

### 5.1 Accuracy Disclaimer

Real natal charts require Swiss Ephemeris (~30MB). This engine uses **simplified mean orbital elements** for planetary positions. Accuracy: ±1-2 degrees. Near sign boundaries (cusps), can occasionally produce the wrong sign. Acceptable for a personalization app; not for professional astrology.

Rising sign (ascendant) requires exact birth time + sidereal time + house systems — too complex for this scope. Not included.

### 5.2 Zodiac (`src/lib/astrology/zodiac.ts`)

```ts
type ZodiacSign = 'aries' | 'taurus' | ... | 'pisces'
type Element = 'fire' | 'earth' | 'air' | 'water'
type Modality = 'cardinal' | 'fixed' | 'mutable'

interface ZodiacInfo {
  sign, name, symbol, element, modality, rulingPlanet, dates, traits
}

getZodiacSign(month, day): ZodiacSign
getZodiacInfo(sign): ZodiacInfo
```

Tropical zodiac date ranges.

### 5.3 Numerology (`src/lib/astrology/numerology.ts`)

```ts
type LifePathNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 11 | 22 | 33

calculateLifePath(year, month, day): LifePathNumber  // Pythagorean reduction, preserves master numbers
getNumerologyInfo(lifePath): { lifePath, name, description, strengths, challenges }
```

Life path meanings: 1 Pioneer, 2 Diplomat, 3 Creator, 4 Builder, 5 Adventurer, 6 Nurturer, 7 Seeker, 8 Powerhouse, 9 Humanitarian, 11 Visionary, 22 Architect, 33 Teacher.

### 5.4 Moon Phase (`src/lib/astrology/moonPhase.ts`)

```ts
type MoonPhase = 'new' | 'waxingCrescent' | 'firstQuarter' | 'waxingGibbous'
              | 'full' | 'waningGibbous' | 'lastQuarter' | 'waningCrescent'

getMoonPhase(date?): { phase, name, symbol, illumination, meaning }
```

Known new moon: JDE 2451550.1. Synodic month: 29.530588853 days.

### 5.5 Natal Positions (`src/lib/astrology/natal.ts`)

```ts
type Planet = 'sun' | 'moon' | 'mercury' | 'venus' | 'mars'

interface NatalPosition { planet, sign, degrees, fullDegrees, retrograde, meaning }
interface NatalChart { sun, moon, mercury, venus, mars, birthDate, birthTime, location }

calculateNatalChart(birth: { date, time, location }): NatalChart
```

Simplified mean orbital elements. Reference epoch: J2000.0 (JD 2451545.0). Birth time `null` → solar noon fallback. Retrograde detection simplified.

### 5.6 Archetype (`src/lib/astrology/archetype.ts`)

```ts
interface Archetype { name, tagline, description, patterns, strengths, growth }

deriveArchetype(zodiacSign, lifePath, focus): Archetype
```

Compositional derivation: element adjective × life path role × focus. ~30 data entries cover 864 combinations. Deterministic.

### 5.7 Horoscope (`src/lib/astrology/horoscope.ts`)

```ts
interface DailyHoroscope {
  date, categories: { overview, love, career, growth }
  moonPhase, luckyHour, color, affirmation
}

generateDailyHoroscope(natal, date?): DailyHoroscope
```

12 sign-specific content arrays × 4 categories × ~7 entries each. Day-of-year seeds selection. Moon phase adds modifier.

### 5.8 Compatibility (`src/lib/astrology/compatibility.ts`)

```ts
interface CompatibilityResult {
  userSign, partnerSign, overallScore, loveScore
  communicationScore, friendshipScore, summary, strengths, challenges, advice
}

calculateCompatibility(userSign, partnerSign): CompatibilityResult
```

Element compatibility matrix. 78 unique sign pairs (symmetrical).

### 5.9 Content To Write

- 12 zodiac sign info entries
- 12 numerology meanings
- 8 moon phase meanings
- 60 planet-in-sign interpretations (5 planets × 12 signs)
- Archetype composition data (~30 entries)
- ~336 daily horoscope entries (12 × 4 × 7)
- Compatibility matrix (78 pairs)

---

## 6. Sharing Implementation

### Dependencies

- `react-native-view-shot` — capture view as image
- `expo-sharing` — native share sheet
- `expo-media-library` (optional) — save to camera roll

### Flow

```text
User taps Share
  → captureRef(viewRef, { format: 'png', quality: 1 })
  → if capture fails → toast "Couldn't share. Try again."
  → expo-sharing.shareAsync(uri, { dialogTitle, mimeType })
  → if share fails → toast "Couldn't share. Try again."
```

### Share Sheet Copy

| Share type | Title | Body | App link |
|---|---|---|---|
| Tarot | "My card today" | "{Card Name} — {one-line meaning}" | "Get your reading on Astrovy" |
| Horoscope | "My horoscope today" | "{Zodiac} — {category}: {first sentence}" | "Map your cosmos on Astrovy" |
| Archetype | "My archetype" | "I'm {Name} — {tagline}" | "Discover yours on Astrovy" |
| Compatibility | "Our compatibility" | "{Sign} × {Sign} — {score}% match" | "Check yours on Astrovy" |
| Snapshot | "My Astrovy snapshot" | "{Zodiac} Sun · Life Path {n} · {Archetype}" | "Map your cosmos on Astrovy" |

---

## 7. Navigation Structure

### Route Tree (Unchanged)

```
/
├── index.tsx                         → conditional redirect
├── _layout.tsx                       → root Stack/providers
├── (onboarding)/                     → 8 screens
├── (tabs)/                           → 5 tabs
├── tarot.tsx
├── horoscope.tsx
├── love.tsx
├── compatibility.tsx
├── snapshot.tsx
├── share-card.tsx
├── share-tarot.tsx
└── pricing.tsx
```

### Tab Rename

| Old | New |
|---|---|
| Today | Today |
| Soulprint | **Astro** |
| Decode | Decode |
| Mirror | Mirror |
| Profile | Profile |

### Bottom Nav Fixes

- `currentScreen` calculation fixed for grouped paths
- Unused `tabRoutes` removed
- Redesigned with Astrovy visual language

### Onboarding Navigation

- `router.replace()` instead of `router.push()` when completing onboarding
- Prevents back-stack accumulation into onboarding screens

---

## 8. Complete Copy & CTA Spec

### 8.1 Copywriting Rules

1. Warm, not precious.
2. Short, not terse.
3. One question per screen.
4. Labels are nouns, not sentences.
5. CTAs are verbs. "Continue", "Draw", "Save", "Share", "Done".
6. No adverbs in CTAs.
7. No guilt in secondary CTAs. "Maybe later" not "Stay with my free reading".
8. No pre-explanation. If UI is self-evident, write zero.
9. Personalization shown, not announced.
10. Trust the user.

### 8.2 Today Screen — New Structure (7 sections)

1. Header — greeting + name + streak badge
2. Mood check-in — question + 4 chips + response
3. Daily reading — ONE card merging signal + insight + move
4. Journal — prompt + expandable input
5. Pattern alert — (conditional)
6. Weekly reading — (conditional)
7. Quick explore — compact row: Tarot + Horoscope

**Removed:** Mock energy cards, redundant week section, VisualStreakTracker, Soulprint link (in bottom nav), last reflection card (moved to Mirror), avatar circle.

### 8.3 Today Copy

| Element | Copy |
|---|---|
| Greeting (morning) | "Good morning" |
| Greeting (afternoon) | "Good afternoon" |
| Greeting (evening) | "Good evening" |
| Greeting (late night) | "Still awake?" |
| Mood question | "How's today feeling?" |
| Mood: Steady 💛 | Response: "Grounded today. Trust what's working." |
| Mood: Tender 🌊 | Response: "Feelings close to the surface. That's information, not a flaw." |
| Mood: Restless ⚡ | Response: "Something wants your attention. Sit with the question." |
| Mood: Quiet 🧊 | Response: "Quiet is still a signal. Your body may need rest, not distraction." |
| Daily reading eyebrow | "Today" |
| Move label | "Try this" |
| Personalization | "— for {Zodiac} Sun, Life Path {n}" |
| Journal eyebrow | "Reflect" |
| Journal placeholder | "Write freely..." |
| Journal hint | "Kept only for you" |
| Journal saved title | "✓ Saved" |
| Journal saved sub | "Kept safe, just for you." |
| Pattern eyebrow | "Pattern" |
| Pattern icon | ✦ |
| Weekly eyebrow | "This week" |
| Weekly dismiss | "Got it" |
| Explore eyebrow | "Explore" |
| Tarot title | "Tarot" |
| Tarot sub (can draw, free) | "Your card is waiting" |
| Tarot sub (can draw, premium) | "3 draws left" |
| Tarot sub (can't draw) | "Return tomorrow" |
| Horoscope title | "Horoscope" |
| Horoscope sub | "Today's reading" |

### 8.4 Pattern Alert Copy (updated mood labels)

| Mood | Copy |
|---|---|
| Steady | "Three steady days. That consistency is worth trusting." |
| Tender | "Three tender days. Something is asking to be understood." |
| Restless | "Restlessness three times this week. The chase may be a distraction." |
| Quiet | "Three quiet days. Your body is asking for something different." |

### 8.5 Onboarding Copy

| Screen | Eyebrow/Title | Description | CTA |
|---|---|---|---|
| Welcome | "Your personal cosmos" / "Astrovy" | "Mapped from the moment you arrived." | "Continue" |
| Birth date | — / "When were you born?" | — | "Continue" |
| Birth time | — / "What time? (Optional)" | — | "Continue" / "Skip" |
| Location | — / "Where were you born?" | Search: "Search cities..." | "Continue" |
| MBTI | — / "Know your personality type?" | — | "Continue" / "Skip" |
| Focus | — / "What feels most alive right now?" | — | "Continue" |
| Generating | — / (animated) | "Reading your chart..." → "Mapping your patterns..." → "Finding your archetype..." → "Almost there..." | "See what the stars say" |
| First mirror | — / "Hi, {name}" | "Your archetype" / "Does this feel right?" | "Continue" |

Step labels ("1 of 6") removed. Progress dots show position.

First mirror feedback options: "Yes, that's me" / "Somewhat" / "Not quite".

### 8.6 Tab Screens Copy

#### Astro (formerly Soulprint)

| Element | Copy |
|---|---|
| Header | "Your Astro" |
| Sections | "Your chart", "Your patterns", "Your strengths", "Growth areas" |
| Upgrade CTA | "Unlock full reading" |
| Snapshot CTA | "Save snapshot" |

#### Decode

| Element | Copy |
|---|---|
| Header | "Readings" |
| Description | (removed) |
| Tier badge | "Premium" / "Free" |
| Full Chart | "Your chart and the archetype it shapes." |
| Love | "How you love and why." |
| Compatibility | "How your signs meet." |
| Palm Reading | badge "Soon" only, no description |
| Card "Open →" | (removed) |
| Upgrade | "Unlock all readings" |

#### Mirror

| Element | Copy |
|---|---|
| Header | "Your Mirror" |
| Description | "Your patterns, over time." |
| Streak label | "Streak" |
| Moods label | "Moods" |
| Reflections label | "Reflections" |
| Recent moods | "Recent moods" |
| Top mood | "Most common" |
| Latest reflection | "Latest reflection" |
| Upgrade | "Unlock your full reflection" |

#### Profile

| Element | Copy |
|---|---|
| Identity | Dynamic: `{name}`, `{Zodiac} Sun`, `Life Path {n}`, `{Focus}`, `{location.city}` |
| Tier toggle | "Premium (demo)" |
| Tier status | "Free plan" / "Premium" |
| Subscription | "Subscription" |
| Delete | "Delete account" |
| Delete confirm | "Delete all data? This cannot be undone." |
| Delete CTA | "Delete" / "Cancel" |

Removed: Daily Signal toggle, Deep Tone toggle, Privacy row, About row (until real destinations exist).

### 8.7 Secondary Screens Copy

#### Tarot

| Element | Copy |
|---|---|
| Header | "Tarot" |
| Description (free) | "Your card for today." |
| Description (premium) | "Your three-card spread." |
| Draw | "Draw" |
| Draw again | "Draw again" |
| Reveal | "Reveal" |
| Share | "Share" |
| Upgrade | "Unlock your three-card spread" |
| Limit | "Return tomorrow" |

#### Horoscope

| Element | Copy |
|---|---|
| Header | "Horoscope" |
| Categories | Overview / Love / Career / Growth |
| Natal chart label | "Your chart" |
| Back | ← icon only |

#### Love

| Element | Copy |
|---|---|
| Header | "Love" |
| Description | "How you love and why." |
| Feedback question | "Does this resonate?" |
| Feedback | "Yes" / "Somewhat" / "Not quite" |
| Back | ← icon only |

#### Compatibility

| Element | Copy |
|---|---|
| Header | "Compatibility" |
| Description | "How your signs meet." |
| Partner name | "Their name (optional)" |
| Sign selector | "Their sign" |
| Reveal CTA | "Reveal" |
| Back | ← icon only |

#### Snapshot

| Element | Copy |
|---|---|
| Header | "Snapshot" |
| Done CTA | "Done" |
| Share CTA | "Share" |
| Back | ← icon only |

#### Share Card / Share Tarot

| Element | Copy |
|---|---|
| Header | "Share" |
| Share CTA | "Share" |
| Back | ← icon only |

#### Pricing

| Element | Copy |
|---|---|
| Header | "Astrovy Premium" |
| Subtitle | "Every reading, every week, every sign — yours." |
| Plans | "Monthly" / "Annual" |
| Save badge | "Save $36" |
| Annual note | "$72/year" |
| Cancel note | "Cancel anytime" |
| Features title | "Included:" |
| Features | "Full natal chart" / "Weekly personalized readings" / "Compatibility with any sign" / "Three-card daily tarot" / "Unlimited journal history" |
| Primary CTA | "Start Premium" (calls `upgrade()`) |
| Secondary CTA | "Maybe later" |
| Back | ← icon only |

### 8.8 Daily Content (Kept As-Is)

- 14 daily signals ✓
- 7 daily insights ✓
- 7 daily moves ✓
- 4 weekly readings ✓
- 7 journal prompts ✓

Mood labels updated: `Emotional → Tender`, `Numb → Quiet`. Mood alerts rewritten to match.

---

## 9. State Copy

### 9.1 Empty States

**Mirror — No journal entries:**
- Eyebrow: "Reflections"
- Empty: "No reflections yet."
- Encouragement: "Your first prompt is waiting on Today."
- CTA: "Go to Today"

**Mirror — No mood history:**
- Eyebrow: "Moods"
- Empty: "No moods logged yet."
- Encouragement: "Check in on Today to start tracking."

**Mirror — Fresh user (no data):**
- Header: "Your Mirror"
- Description: "Your patterns, over time."
- Empty: "Nothing here yet — and that's fine."
- Encouragement: "Check in on Today to start your mirror."
- CTA: "Go to Today"

### 9.2 Error States

| Scenario | Title | Body | CTA |
|---|---|---|---|
| Storage save failure | "Couldn't save" | "Something went wrong. Your reflection wasn't saved." | "Try again" |
| Storage load failure | "Couldn't load your data" | "We couldn't retrieve your reflections and moods." | "Try again" / "Start fresh" |
| Profile load failure | "Couldn't load your profile" | "Your birth data couldn't be retrieved." | "Try again" / "Restart onboarding" |
| Astrology calc failure | "Chart unavailable" | "We couldn't calculate your chart. This sometimes happens near sign transitions." | "Try again" |
| Tarot draw failure | (toast) | "Couldn't draw a card. Try again." | — |
| Share failure | (toast) | "Couldn't share. Try again." | — |
| Delete failure | (dialog) | "Couldn't delete data. Try again." | "OK" |
| Generic fallback | "Something went wrong" | "Unexpected error. Try again, or restart the app." | "Try again" |

### 9.3 Loading States

| Scenario | Copy |
|---|---|
| App startup | Astrovy logo, no text (or "Loading...") |
| Generating stage 1 | "Reading your chart..." |
| Generating stage 2 | "Mapping your patterns..." |
| Generating stage 3 | "Finding your archetype..." |
| Generating stage 4 | "Almost there..." |
| Tarot shuffle | "Shuffling..." |
| Compatibility calc | "Comparing your signs..." |
| Horoscope generation | "Reading the stars..." |
| Share image prep | "Preparing..." |
| Engagement hydration | Skeleton screen, no copy |

### 9.4 Onboarding Resume

| Element | Copy |
|---|---|
| Eyebrow | "Welcome back" |
| Title | "Let's pick up where you left off." |
| CTA | "Continue" |
| Secondary | "Start over" |

Resume logic:
- No data → welcome
- Has birth date, no time → birth-time
- Has time, no location → location
- Has location, no mbti → mbti
- Has mbti, no focus → focus-mood
- Has focus, not finalized → generating

### 9.5 Share Sheet Copy

| Type | Title | Body | App Link |
|---|---|---|---|
| Tarot | "My card today" | "{Card Name} — {one-line meaning}" | "Get your reading on Astrovy" |
| Horoscope | "My horoscope today" | "{Zodiac} — {category}: {first sentence}" | "Map your cosmos on Astrovy" |
| Archetype | "My archetype" | "I'm {Name} — {tagline}" | "Discover yours on Astrovy" |
| Compatibility | "Our compatibility" | "{Sign} × {Sign} — {score}% match" | "Check yours on Astrovy" |
| Snapshot | "My Astrovy snapshot" | "{Zodiac} Sun · Life Path {n} · {Archetype}" | "Map your cosmos on Astrovy" |

---

## 10. Dependencies to Add

```
react-native-view-shot    # image capture for sharing
expo-sharing              # native share sheet
expo-google-fonts         # Poppins + DM Sans (or @expo-google-fonts/poppins, @expo-google-fonts/dm-sans)
```

Existing (kept):
- expo, expo-router, react-native, react-native-reanimated, expo-linear-gradient, AsyncStorage, lucide-react-native, react-native-svg, react-native-safe-area-context, react-native-screens

---

## 11. Implementation Phases

1. **Design system** — tokens, fonts, primitives (Button, Card, Badge, Chip, Input, Screen, etc.)
2. **State architecture** — storage layer, date utils, ProfileContext, TierContext, useEngagement refactor
3. **Astrology engine** — zodiac, numerology, moon phase, natal, archetype, horoscope, compatibility + content
4. **Screen redesign** — onboarding → tabs → secondary (using new design system + real data)
5. **Sharing** — view-shot + native share integration
6. **Polish** — motion, accessibility, testing

---

## 12. Out of Scope

- Backend / API
- Authentication
- Real In-App Purchases (billing SDK)
- Cloud sync
- Push notifications
- Analytics
- Rising sign / ascendant calculation
- Outer planets (Jupiter through Pluto)
- House placements
- Aspects
- Test framework setup (unless explicitly requested)
