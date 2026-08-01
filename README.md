# Astrovy — React Native

> A warm, private self-discovery app — now on mobile.

## Getting Started

```bash
# Install dependencies
yarn install

# Start the dev server
npx expo start

# Run on iOS simulator
npx expo start --ios

# Run on Android emulator
npx expo start --android
```

## Tech Stack

- **Expo SDK 54** — Development platform
- **Expo Router** — File-based navigation
- **React Native Reanimated** — Smooth 60fps animations
- **Expo Linear Gradient** — Gradient backgrounds matching the web prototype
- **AsyncStorage** — Local persistence for streaks, moods, journals
- **TypeScript** — Full type safety
- **Lucide React Native** — Icon set

## Project Structure

```
app/
├── _layout.tsx                 # Root layout (providers + gradient bg)
├── index.tsx                   # Entry redirect → onboarding
├── (onboarding)/               # Onboarding flow (no bottom tabs)
│   ├── welcome.tsx
│   ├── birth-date.tsx
│   ├── birth-time.tsx
│   ├── location.tsx
│   ├── mbti.tsx
│   ├── focus-mood.tsx
│   ├── generating.tsx
│   └── first-mirror.tsx
├── (tabs)/                     # Main app tabs (with bottom nav)
│   ├── _layout.tsx             # Custom bottom tab bar
│   ├── today.tsx
│   ├── astrovy.tsx
│   ├── decode.tsx
│   ├── mirror.tsx
│   └── profile.tsx
├── love.tsx                    # Detail: Love Pattern Reading
├── compatibility.tsx           # Detail: Compatibility Reading
├── share-card.tsx              # Detail: Shareable insight card
├── snapshot.tsx                # Detail: Free snapshot view
├── pricing.tsx                 # Premium pricing screen
├── components/                 # Shared UI components
│   ├── BottomNav.tsx
│   ├── Illustrations.tsx
│   ├── ProgressDots.tsx
│   └── SoftMascot.tsx
├── context/
│   └── TierContext.tsx         # Free/Premium state
├── hooks/
│   └── useEngagement.ts        # Streaks, moods, journals (AsyncStorage)
└── lib/
    └── theme.ts                # Colors, shadows, gradients, radii
```

## Design Match

Every screen, color, shadow, gradient, and radius is an exact match to the web prototype:

| Web Prototype | React Native Equivalent |
|---------------|------------------------|
| Tailwind CSS  | StyleSheet + inline styles |
| Framer Motion | React Native Reanimated |
| CSS Gradients | expo-linear-gradient |
| CSS Shadows   | StyleSheet shadow props |
| localStorage  | @react-native-async-storage/async-storage |
| Lucide React  | lucide-react-native |

## Navigation

- **Onboarding flow**: `welcome → birth-date → birth-time → location → mbti → focus-mood → generating → first-mirror → (tabs)/today`
- **Main tabs**: Today, Astrovy, Decode, Mirror, Profile
- **Detail screens**: Love, Compatibility, Share Card, Snapshot, Pricing (pushed on top of tabs)

## State

- **TierContext**: Free/Premium toggle (in-memory, synced across all screens)
- **useEngagement**: Streaks, mood history, journal entries, reflection count (persisted via AsyncStorage)
# astrovy-rn
