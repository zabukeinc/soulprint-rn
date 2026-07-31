# Astrovy Revamp — Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the design system, state architecture, and astrology engine that the screen revamp will consume.

**Architecture:** Pure-function astrology engine, AsyncStorage-backed state contexts with error handling and hydration flags, and a token-based design system with primitive components. No backend, no test framework (verify via `tsc --noEmit` and manual checks).

**Tech Stack:** Expo SDK 54, Expo Router 6, React Native 0.81, TypeScript, expo-linear-gradient, expo-google-fonts, AsyncStorage, react-native-reanimated, react-native-safe-area-context

**Spec:** `docs/superpowers/specs/2026-07-31-astrovy-revamp-design.md`

---

## File Structure

### Design System
- `src/design/tokens.ts` — colors, gradients, typography, spacing, radii, shadows, motion
- `src/design/fonts.ts` — Poppins + DM Sans loading
- `src/design/primitives/` — Button, Card, Badge, Chip, Input, Divider, Screen, StarField, Eyebrow
- `src/design/primitives/index.ts`, `src/design/index.ts` — barrel exports

### Infrastructure
- `src/lib/storage.ts` — typed AsyncStorage wrapper
- `src/lib/dates.ts` — local date utilities
- `src/lib/share.ts` — view-shot + native share

### State
- `src/context/ProfileContext.tsx` — persisted onboarding/profile
- `src/context/TierContext.tsx` — persisted premium
- `src/hooks/useEngagement.ts` — refactored

### Astrology Engine
- `src/lib/astrology/` — zodiac, numerology, moonPhase, natal, archetype, horoscope, compatibility, index

### App Root
- `app/_layout.tsx` — new providers
- `app/index.tsx` — conditional routing

---

## Task 1: Install Dependencies

**Files:** Modify `package.json`

- [ ] **Step 1: Install packages**

```bash
npx expo install react-native-view-shot expo-sharing
npx expo install @expo-google-fonts/poppins @expo-google-fonts/dm-sans
```

- [ ] **Step 2: Verify** — Run: `npx tsc --noEmit`. Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add view-shot, sharing, and google fonts dependencies"
```

---

## Task 2: Design Tokens

**Files:** Create `src/design/tokens.ts`

- [ ] **Step 1: Create tokens file**

```ts
// src/design/tokens.ts

export const colors = {
  deepSpace:     '#0F0F23',
  royalViolet:   '#7B61FF',
  softLavender:  '#B39DFF',
  pastelLilac:   '#E2C6FF',
  lightBg:       '#F3F0FF',
  cosmicGray:    '#6B6B7D',
  white:         '#FFFFFF',
} as const

export const contrast = {
  textOnLight:  { color: colors.deepSpace,    bg: colors.white,       ratio: '15.3:1' },
  textOnCTA:    { color: colors.white,         bg: colors.royalViolet, ratio: '5.1:1'  },
  accentOnDark: { color: colors.softLavender,  bg: colors.deepSpace,   ratio: '6.8:1'  },
} as const

export const gradients = {
  cosmicViolet: ['#A78BFF', '#7B61FF'],
  deepOrbit:    ['#7B61FF', '#0F0F23'],
  nebula:       ['#E2C6FF', '#B39DFF', '#7B61FF'],
} as const

export const typography = {
  families: { heading: 'Poppins', body: 'DM Sans' },
  weights: {
    light: '300', regular: '400', medium: '500',
    semibold: '600', bold: '700', extrabold: '800',
  },
  scale: {
    display:    { fontFamily: 'Poppins',  fontSize: 88, fontWeight: '800' as const, lineHeight: 96,  letterSpacing: -2.64 },
    h1:         { fontFamily: 'Poppins',  fontSize: 48, fontWeight: '700' as const, lineHeight: 56,  letterSpacing: -0.96 },
    h2:         { fontFamily: 'Poppins',  fontSize: 32, fontWeight: '600' as const, lineHeight: 40,  letterSpacing: -0.32 },
    h3:         { fontFamily: 'Poppins',  fontSize: 24, fontWeight: '600' as const, lineHeight: 32,  letterSpacing: 0 },
    bodyLarge:  { fontFamily: 'DM Sans',  fontSize: 18, fontWeight: '400' as const, lineHeight: 30.6 },
    body:       { fontFamily: 'DM Sans',  fontSize: 16, fontWeight: '400' as const, lineHeight: 27.2 },
    caption:    { fontFamily: 'DM Sans',  fontSize: 12, fontWeight: '500' as const, lineHeight: 19.2 },
    eyebrow:    { fontFamily: 'DM Sans',  fontSize: 11, fontWeight: '700' as const, lineHeight: 16,  letterSpacing: 2.2 },
  },
} as const

export const spacing = {
  xs: 4, sm: 8, smMd: 12, md: 16, lg: 24, xl: 32, xxl: 48, xxxl: 64, huge: 80,
} as const

export const radii = {
  none: 0, xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, full: 100,
} as const

export const shadows = {
  ctaPrimary:      { shadowColor: '#7B61FF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 3 },
  ctaPrimaryHover: { shadowColor: '#7B61FF', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.45, shadowRadius: 24, elevation: 4 },
  card:            { shadowColor: '#7B61FF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 16, elevation: 2 },
  cardHover:       { shadowColor: '#7B61FF', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.15, shadowRadius: 40, elevation: 4 },
} as const

export const motion = {
  durations: { micro: 100, fast: 200, base: 300, medium: 400, slow: 600, ambient: 1000 },
  easings: {
    easeOut: [0, 0, 0.2, 1] as const,
    easeIn:  [0.4, 0, 1, 1] as const,
    spring:  [0.34, 1.56, 0.64, 1] as const,
    linear:  [0, 0, 1, 1] as const,
  },
} as const
```

- [ ] **Step 2: Verify** — Run: `npx tsc --noEmit`. Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/design/tokens.ts
git commit -m "feat: add Astrovy design tokens"
```

---

## Task 3: Font Loading

**Files:** Create `src/design/fonts.ts`

- [ ] **Step 1: Check exact export names from dm-sans package**

Run: `ls node_modules/@expo-google-fonts/dm-sans/build/`

The export names may use `DMSans` (no space) or `DM Sans` (with space). Adjust the import below to match.

- [ ] **Step 2: Create font loading utility**

```ts
// src/design/fonts.ts

import { useFonts } from 'expo-font'
import {
  Poppins_300Light, Poppins_400Regular, Poppins_500Medium,
  Poppins_600SemiBold, Poppins_700Bold, Poppins_800ExtraBold,
} from '@expo-google-fonts/poppins'
import {
  DMSans_300Light, DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold,
} from '@expo-google-fonts/dm-sans'

export function useAstrovyFonts() {
  const [loaded, error] = useFonts({
    Poppins_300Light, Poppins_400Regular, Poppins_500Medium,
    Poppins_600SemiBold, Poppins_700Bold, Poppins_800ExtraBold,
    DMSans_300Light, DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold,
  })
  return { loaded, error }
}
```

Note: If `@expo-google-fonts/dm-sans` uses spaces in export names, update the import. Verify with the `ls` command above.

- [ ] **Step 3: Verify** — Run: `npx tsc --noEmit`. Expected: No errors (fix import names if needed).

- [ ] **Step 4: Commit**

```bash
git add src/design/fonts.ts
git commit -m "feat: add Poppins and DM Sans font loading"
```

---

## Task 4: Primitives — Eyebrow, Button

**Files:** Create `src/design/primitives/Eyebrow.tsx`, `src/design/primitives/Button.tsx`

- [ ] **Step 1: Create Eyebrow**

```tsx
// src/design/primitives/Eyebrow.tsx

import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors, typography, spacing } from '../tokens'

interface EyebrowProps {
  children: React.ReactNode
  color?: string
  showLine?: boolean
}

export function Eyebrow({ children, color, showLine = true }: EyebrowProps) {
  return (
    <View style={styles.container}>
      {showLine && <View style={[styles.line, { backgroundColor: color || colors.royalViolet }]} />}
      <Text style={[styles.text, { color: color || colors.royalViolet }]}>{children}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  line: { width: 24, height: 2, borderRadius: 2 },
  text: { ...typography.scale.eyebrow, textTransform: 'uppercase' },
})
```

- [ ] **Step 2: Create Button**

```tsx
// src/design/primitives/Button.tsx

import React from 'react'
import { Pressable, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { colors, typography, spacing, radii, shadows } from '../tokens'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'dark'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  children: React.ReactNode
  onPress?: () => void
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
  fullWidth?: boolean
  style?: ViewStyle
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const variantStyles: Record<ButtonVariant, { bg: string; text: string; border?: string }> = {
  primary:   { bg: colors.royalViolet, text: colors.white },
  secondary: { bg: colors.lightBg, text: colors.royalViolet, border: colors.pastelLilac },
  ghost:     { bg: 'transparent', text: colors.deepSpace, border: 'rgba(15,15,35,0.15)' },
  dark:      { bg: colors.deepSpace, text: colors.white },
}

const sizeStyles: Record<ButtonSize, { paddingVertical: number; paddingHorizontal: number; fontSize: number }> = {
  sm: { paddingVertical: 8, paddingHorizontal: 20, fontSize: 12 },
  md: { paddingVertical: 12, paddingHorizontal: 28, fontSize: 14 },
  lg: { paddingVertical: 16, paddingHorizontal: 36, fontSize: 16 },
}

export function Button({
  variant = 'primary', size = 'md', children, onPress,
  disabled = false, loading = false, icon, fullWidth = false, style,
}: ButtonProps) {
  const scale = useSharedValue(1)
  const vs = variantStyles[variant]
  const ss = sizeStyles[size]

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }))

  const handlePressIn = () => { scale.value = withSpring(0.97, { damping: 15, stiffness: 300 }) }
  const handlePressOut = () => { scale.value = withSpring(1, { damping: 15, stiffness: 300 }) }

  const showShadow = variant === 'primary' && !disabled && !loading

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[
        styles.base,
        { backgroundColor: vs.bg, paddingVertical: ss.paddingVertical, paddingHorizontal: ss.paddingHorizontal, opacity: disabled ? 0.5 : 1 },
        vs.border && { borderWidth: 1.5, borderColor: vs.border },
        showShadow && shadows.ctaPrimary,
        fullWidth && { width: '100%' },
        animatedStyle,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={vs.text} size="small" />
      ) : (
        <>
          {icon}
          <Text style={[styles.text, { color: vs.text, fontSize: ss.fontSize }]}>{children}</Text>
        </>
      )}
    </AnimatedPressable>
  )
}

const styles = StyleSheet.create({
  base: { borderRadius: radii.full, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  text: { fontFamily: typography.families.heading, fontWeight: typography.weights.semibold, letterSpacing: 0.14 },
})
```

- [ ] **Step 3: Verify** — Run: `npx tsc --noEmit`. Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/design/primitives/Eyebrow.tsx src/design/primitives/Button.tsx
git commit -m "feat: add Eyebrow and Button primitives"
```

---

## Task 5: Primitives — Card, Badge, Chip

**Files:** Create `src/design/primitives/Card.tsx`, `Badge.tsx`, `Chip.tsx`

- [ ] **Step 1: Create Card**

```tsx
// src/design/primitives/Card.tsx

import React from 'react'
import { Pressable, View, StyleSheet, ViewStyle } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { colors, spacing, radii, shadows } from '../tokens'

type CardVariant = 'light' | 'dark' | 'gradient' | 'soft'

interface CardProps {
  variant?: CardVariant
  children: React.ReactNode
  padding?: keyof typeof spacing
  radius?: keyof typeof radii
  shadow?: keyof typeof shadows
  onPress?: () => void
  style?: ViewStyle
}

const variantConfig: Record<CardVariant, { bg?: string; gradient?: string[]; border?: string }> = {
  light:    { bg: colors.white, border: 'rgba(123,97,255,0.12)' },
  dark:     { bg: colors.deepSpace },
  gradient: { gradient: ['#A78BFF', '#7B61FF'] },
  soft:     { bg: colors.lightBg, border: 'rgba(123,97,255,0.10)' },
}

export function Card({ variant = 'light', children, padding = 'lg', radius = 'xl', shadow = 'card', onPress, style }: CardProps) {
  const config = variantConfig[variant]
  const baseStyle = {
    borderRadius: radii[radius],
    padding: spacing[padding],
    ...(config.border && { borderWidth: 1, borderColor: config.border }),
    ...shadows[shadow],
  }

  if (config.gradient) {
    const content = (
      <LinearGradient colors={config.gradient as [string, string]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[baseStyle, style]}>
        {children}
      </LinearGradient>
    )
    if (onPress) return <Pressable onPress={onPress}>{content}</Pressable>
    return content
  }

  if (onPress) {
    return <Pressable onPress={onPress} style={[baseStyle, { backgroundColor: config.bg }, style]}>{children}</Pressable>
  }
  return <View style={[baseStyle, { backgroundColor: config.bg }, style]}>{children}</View>
}
```

- [ ] **Step 2: Create Badge**

```tsx
// src/design/primitives/Badge.tsx

import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors, typography, spacing, radii } from '../tokens'

type BadgeVariant = 'new' | 'premium' | 'pro' | 'astrology' | 'live' | 'beta' | 'soon' | 'free'

interface BadgeProps { variant: BadgeVariant; children: React.ReactNode }

const variants: Record<BadgeVariant, { bg: string; text: string; border?: string }> = {
  new:       { bg: colors.lightBg, text: colors.royalViolet, border: colors.pastelLilac },
  premium:   { bg: colors.royalViolet, text: colors.white },
  pro:       { bg: colors.deepSpace, text: colors.white },
  astrology: { bg: colors.pastelLilac, text: colors.deepSpace },
  live:      { bg: '#E8FFF4', text: '#14863E', border: '#BBF7D0' },
  beta:      { bg: '#FFF7E6', text: '#B45309', border: '#FDE68A' },
  soon:      { bg: 'rgba(15,15,35,0.06)', text: colors.cosmicGray },
  free:      { bg: colors.lightBg, text: colors.royalViolet, border: colors.pastelLilac },
}

export function Badge({ variant, children }: BadgeProps) {
  const v = variants[variant]
  return (
    <View style={[styles.base, { backgroundColor: v.bg, borderWidth: v.border ? 1 : 0, borderColor: v.border }]}>
      <Text style={[styles.text, { color: v.text }]}>{children}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  base: { paddingHorizontal: spacing.sm + 2, paddingVertical: 5, borderRadius: radii.full, alignSelf: 'flex-start' },
  text: { ...typography.scale.caption, fontWeight: typography.weights.semibold },
})
```

- [ ] **Step 3: Create Chip**

```tsx
// src/design/primitives/Chip.tsx

import React from 'react'
import { Pressable, Text, StyleSheet } from 'react-native'
import { colors, typography, spacing, radii } from '../tokens'

interface ChipProps { label: string; emoji?: string; selected: boolean; onPress: () => void }

export function Chip({ label, emoji, selected, onPress }: ChipProps) {
  return (
    <Pressable onPress={onPress} style={[styles.base, selected && styles.selected]}>
      {emoji && <Text style={styles.emoji}>{emoji}</Text>}
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: { flex: 1, paddingVertical: spacing.sm, borderRadius: radii.lg, alignItems: 'center', backgroundColor: colors.white, borderWidth: 1, borderColor: 'rgba(123,97,255,0.12)' },
  selected: { backgroundColor: colors.royalViolet, borderColor: 'transparent' },
  emoji: { fontSize: 18, marginBottom: 2 },
  label: { ...typography.scale.caption, fontWeight: typography.weights.bold, color: colors.cosmicGray },
  labelSelected: { color: colors.white },
})
```

- [ ] **Step 4: Verify** — Run: `npx tsc --noEmit`. Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add src/design/primitives/Card.tsx src/design/primitives/Badge.tsx src/design/primitives/Chip.tsx
git commit -m "feat: add Card, Badge, Chip primitives"
```

---

## Task 6: Primitives — Divider, Input, Screen, StarField

**Files:** Create `src/design/primitives/Divider.tsx`, `Input.tsx`, `Screen.tsx`, `StarField.tsx`

- [ ] **Step 1: Create Divider**

```tsx
// src/design/primitives/Divider.tsx
import React from 'react'
import { View, StyleSheet } from 'react-native'
import { colors, spacing } from '../tokens'

interface DividerProps { marginVertical?: keyof typeof spacing }

export function Divider({ marginVertical = 'md' }: DividerProps) {
  return <View style={[styles.line, { marginVertical: spacing[marginVertical] }]} />
}

const styles = StyleSheet.create({ line: { height: 1, backgroundColor: 'rgba(123,97,255,0.10)' } })
```

- [ ] **Step 2: Create Input**

```tsx
// src/design/primitives/Input.tsx
import React from 'react'
import { TextInput, StyleSheet } from 'react-native'
import { colors, typography, spacing, radii } from '../tokens'

interface InputProps {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  multiline?: boolean
  numberOfLines?: number
}

export function Input({ value, onChangeText, placeholder, multiline = false, numberOfLines = 1 }: InputProps) {
  return (
    <TextInput
      style={[styles.base, multiline && styles.multiline]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.cosmicGray + '80'}
      multiline={multiline}
      numberOfLines={numberOfLines}
      textAlignVertical={multiline ? 'top' : 'center'}
    />
  )
}

const styles = StyleSheet.create({
  base: { ...typography.scale.body, color: colors.deepSpace, backgroundColor: colors.lightBg, borderRadius: radii.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 2, borderWidth: 1, borderColor: 'rgba(123,97,255,0.10)' },
  multiline: { minHeight: 60 },
})
```

- [ ] **Step 3: Create Screen**

```tsx
// src/design/primitives/Screen.tsx
import React from 'react'
import { View, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { colors } from '../tokens'

interface ScreenProps { children: React.ReactNode; dark?: boolean; edges?: ('top' | 'bottom' | 'left' | 'right')[] }

export function Screen({ children, dark = false, edges = ['top'] }: ScreenProps) {
  if (dark) {
    return (
      <SafeAreaView style={styles.container} edges={edges}>
        <LinearGradient colors={['#7B61FF', '#0F0F23']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
        <View style={styles.content}>{children}</View>
      </SafeAreaView>
    )
  }
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.lightBg }]} edges={edges}>
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({ container: { flex: 1 }, content: { flex: 1 } })
```

- [ ] **Step 4: Create StarField**

```tsx
// src/design/primitives/StarField.tsx
import React from 'react'
import { View, StyleSheet } from 'react-native'
import { colors } from '../tokens'

interface StarFieldProps { opacity?: number }

const STARS = [
  { x: '10%', y: '15%', size: 2, color: colors.pastelLilac, opacity: 0.8 },
  { x: '80%', y: '20%', size: 1.5, color: colors.softLavender, opacity: 0.6 },
  { x: '65%', y: '75%', size: 2, color: colors.pastelLilac, opacity: 0.7 },
  { x: '30%', y: '80%', size: 1.5, color: colors.royalViolet, opacity: 0.5 },
  { x: '90%', y: '60%', size: 2.5, color: colors.pastelLilac, opacity: 0.4 },
  { x: '45%', y: '35%', size: 1.5, color: colors.softLavender, opacity: 0.5 },
  { x: '15%', y: '50%', size: 1, color: colors.royalViolet, opacity: 0.3 },
  { x: '75%', y: '40%', size: 1.5, color: colors.pastelLilac, opacity: 0.6 },
]

export function StarField({ opacity = 1 }: StarFieldProps) {
  return (
    <View style={[StyleSheet.absoluteFill, { opacity }]} pointerEvents="none">
      {STARS.map((star, i) => (
        <View
          key={i}
          style={[
            styles.star,
            { left: star.x as any, top: star.y as any, width: star.size, height: star.size, backgroundColor: star.color, opacity: star.opacity },
          ]}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  star: { position: 'absolute', borderRadius: 50 },
})
```

- [ ] **Step 5: Verify** — Run: `npx tsc --noEmit`. Expected: No errors.

- [ ] **Step 6: Commit**

```bash
git add src/design/primitives/Divider.tsx src/design/primitives/Input.tsx src/design/primitives/Screen.tsx src/design/primitives/StarField.tsx
git commit -m "feat: add Divider, Input, Screen, StarField primitives"
```

---

## Task 7: Barrel Exports

**Files:** Create `src/design/primitives/index.ts`, `src/design/index.ts`

- [ ] **Step 1: Create barrel exports**

```ts
// src/design/primitives/index.ts
export { Button } from './Button'
export { Card } from './Card'
export { Badge } from './Badge'
export { Chip } from './Chip'
export { Divider } from './Divider'
export { Input } from './Input'
export { Screen } from './Screen'
export { StarField } from './StarField'
export { Eyebrow } from './Eyebrow'
```

```ts
// src/design/index.ts
export * from './tokens'
export * from './fonts'
export * from './primitives'
```

- [ ] **Step 2: Verify** — Run: `npx tsc --noEmit`. Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/design/primitives/index.ts src/design/index.ts
git commit -m "feat: add design system barrel exports"
```

---

## Task 8: Storage Layer

**Files:** Create `src/lib/storage.ts`

- [ ] **Step 1: Create storage wrapper**

```ts
// src/lib/storage.ts

import AsyncStorage from '@react-native-async-storage/async-storage'

type StorageKey = 'astrovy_profile' | 'astrovy_engagement' | 'astrovy_tier' | 'astrovy_onboarding_complete'

interface StorageResult<T> { ok: boolean; data: T | null; error: string | null }

export const STORAGE_KEYS = {
  profile: 'astrovy_profile',
  engagement: 'astrovy_engagement',
  tier: 'astrovy_tier',
  onboardingComplete: 'astrovy_onboarding_complete',
} as const

export async function loadJSON<T>(key: StorageKey): Promise<StorageResult<T>> {
  try {
    const raw = await AsyncStorage.getItem(key)
    if (!raw) return { ok: true, data: null, error: null }
    return { ok: true, data: JSON.parse(raw) as T, error: null }
  } catch (e) {
    return { ok: false, data: null, error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function saveJSON<T>(key: StorageKey, value: T): Promise<StorageResult<void>> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value))
    return { ok: true, data: null, error: null }
  } catch (e) {
    return { ok: false, data: null, error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function removeKey(key: StorageKey): Promise<StorageResult<void>> {
  try {
    await AsyncStorage.removeItem(key)
    return { ok: true, data: null, error: null }
  } catch (e) {
    return { ok: false, data: null, error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function clearAllAppData(): Promise<void> {
  await Promise.all([
    AsyncStorage.removeItem(STORAGE_KEYS.profile),
    AsyncStorage.removeItem(STORAGE_KEYS.engagement),
    AsyncStorage.removeItem(STORAGE_KEYS.tier),
    AsyncStorage.removeItem(STORAGE_KEYS.onboardingComplete),
  ])
}
```

- [ ] **Step 2: Verify** — Run: `npx tsc --noEmit`. Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/storage.ts
git commit -m "feat: add typed AsyncStorage wrapper with error handling"
```

---

## Task 9: Date Utilities

**Files:** Create `src/lib/dates.ts`

- [ ] **Step 1: Create date utilities**

```ts
// src/lib/dates.ts

export function getLocalDateString(date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function getYesterdayString(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return getLocalDateString(d)
}

export function getDayOfYear(date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export function getWeekNumber(date = new Date()): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

export function isSameDay(dateStr: string, date = new Date()): boolean {
  return dateStr === getLocalDateString(date)
}

export function formatDateShort(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('en', { month: 'short', day: 'numeric' })
}
```

- [ ] **Step 2: Verify** — Run: `npx tsc --noEmit`. Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/dates.ts
git commit -m "feat: add local date utilities (fixes UTC bug)"
```

---

## Task 10: Zodiac Module

**Files:** Create `src/lib/astrology/zodiac.ts`

- [ ] **Step 1: Create zodiac module**

```ts
// src/lib/astrology/zodiac.ts

export type ZodiacSign =
  | 'aries' | 'taurus' | 'gemini' | 'cancer'
  | 'leo' | 'virgo' | 'libra' | 'scorpio'
  | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces'

export type Element = 'fire' | 'earth' | 'air' | 'water'
export type Modality = 'cardinal' | 'fixed' | 'mutable'

export interface ZodiacInfo {
  sign: ZodiacSign; name: string; symbol: string; element: Element
  modality: Modality; rulingPlanet: string; dates: string; traits: string[]
}

const ZODIAC_RANGES: { sign: ZodiacSign; start: [number, number]; end: [number, number] }[] = [
  { sign: 'capricorn',   start: [12, 22], end: [1, 19] },
  { sign: 'aquarius',    start: [1, 20],  end: [2, 18] },
  { sign: 'pisces',      start: [2, 19],  end: [3, 20] },
  { sign: 'aries',       start: [3, 21],  end: [4, 19] },
  { sign: 'taurus',      start: [4, 20],  end: [5, 20] },
  { sign: 'gemini',      start: [5, 21],  end: [6, 20] },
  { sign: 'cancer',      start: [6, 21],  end: [7, 22] },
  { sign: 'leo',         start: [7, 23],  end: [8, 22] },
  { sign: 'virgo',       start: [8, 23],  end: [9, 22] },
  { sign: 'libra',       start: [9, 23],  end: [10, 22] },
  { sign: 'scorpio',     start: [10, 23], end: [11, 21] },
  { sign: 'sagittarius', start: [11, 22], end: [12, 21] },
]

const ZODIAC_INFO: Record<ZodiacSign, ZodiacInfo> = {
  aries:       { sign: 'aries', name: 'Aries', symbol: '\u2648', element: 'fire', modality: 'cardinal', rulingPlanet: 'Mars', dates: 'Mar 21 - Apr 19', traits: ['Bold', 'Direct', 'Energetic', 'Pioneering'] },
  taurus:      { sign: 'taurus', name: 'Taurus', symbol: '\u2649', element: 'earth', modality: 'fixed', rulingPlanet: 'Venus', dates: 'Apr 20 - May 20', traits: ['Grounded', 'Patient', 'Loyal', 'Sensual'] },
  gemini:      { sign: 'gemini', name: 'Gemini', symbol: '\u264A', element: 'air', modality: 'mutable', rulingPlanet: 'Mercury', dates: 'May 21 - Jun 20', traits: ['Curious', 'Adaptable', 'Witty', 'Communicative'] },
  cancer:      { sign: 'cancer', name: 'Cancer', symbol: '\u264B', element: 'water', modality: 'cardinal', rulingPlanet: 'Moon', dates: 'Jun 21 - Jul 22', traits: ['Nurturing', 'Intuitive', 'Protective', 'Emotional'] },
  leo:         { sign: 'leo', name: 'Leo', symbol: '\u264C', element: 'fire', modality: 'fixed', rulingPlanet: 'Sun', dates: 'Jul 23 - Aug 22', traits: ['Confident', 'Generous', 'Warm', 'Creative'] },
  virgo:       { sign: 'virgo', name: 'Virgo', symbol: '\u264D', element: 'earth', modality: 'mutable', rulingPlanet: 'Mercury', dates: 'Aug 23 - Sep 22', traits: ['Analytical', 'Practical', 'Diligent', 'Grounded'] },
  libra:       { sign: 'libra', name: 'Libra', symbol: '\u264E', element: 'air', modality: 'cardinal', rulingPlanet: 'Venus', dates: 'Sep 23 - Oct 22', traits: ['Diplomatic', 'Fair', 'Social', 'Harmonious'] },
  scorpio:     { sign: 'scorpio', name: 'Scorpio', symbol: '\u264F', element: 'water', modality: 'fixed', rulingPlanet: 'Pluto', dates: 'Oct 23 - Nov 21', traits: ['Intense', 'Passionate', 'Loyal', 'Magnetic'] },
  sagittarius: { sign: 'sagittarius', name: 'Sagittarius', symbol: '\u2650', element: 'fire', modality: 'mutable', rulingPlanet: 'Jupiter', dates: 'Nov 22 - Dec 21', traits: ['Adventurous', 'Optimistic', 'Honest', 'Free-spirited'] },
  capricorn:   { sign: 'capricorn', name: 'Capricorn', symbol: '\u2651', element: 'earth', modality: 'cardinal', rulingPlanet: 'Saturn', dates: 'Dec 22 - Jan 19', traits: ['Disciplined', 'Ambitious', 'Patient', 'Responsible'] },
  aquarius:    { sign: 'aquarius', name: 'Aquarius', symbol: '\u2652', element: 'air', modality: 'fixed', rulingPlanet: 'Uranus', dates: 'Jan 20 - Feb 18', traits: ['Independent', 'Innovative', 'Humanitarian', 'Analytical'] },
  pisces:      { sign: 'pisces', name: 'Pisces', symbol: '\u2653', element: 'water', modality: 'mutable', rulingPlanet: 'Neptune', dates: 'Feb 19 - Mar 20', traits: ['Compassionate', 'Intuitive', 'Artistic', 'Gentle'] },
}

export function getZodiacSign(month: number, day: number): ZodiacSign {
  for (const range of ZODIAC_RANGES) {
    const [sm, sd] = range.start
    const [em, ed] = range.end
    if (sm > em) {
      // Wraps around year boundary (Capricorn)
      if ((month === sm && day >= sd) || (month === em && day <= ed) || (month > sm) || (month < em)) {
        return range.sign
      }
    } else {
      if ((month === sm && day >= sd) || (month === em && day <= ed) || (month > sm && month < em)) {
        return range.sign
      }
    }
  }
  return 'capricorn'
}

export function getZodiacInfo(sign: ZodiacSign): ZodiacInfo {
  return ZODIAC_INFO[sign]
}
```

- [ ] **Step 2: Verify** — Run: `npx tsc --noEmit`. Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/astrology/zodiac.ts
git commit -m "feat: add zodiac sign calculation module"
```

---

## Task 11: Numerology Module

**Files:** Create `src/lib/astrology/numerology.ts`

- [ ] **Step 1: Create numerology module**

```ts
// src/lib/astrology/numerology.ts

export type LifePathNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 11 | 22 | 33

export interface NumerologyInfo {
  lifePath: LifePathNumber; name: string; description: string
  strengths: string[]; challenges: string[]
}

function reduceNumber(n: number): LifePathNumber {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split('').reduce((a, b) => a + Number(b), 0)
  }
  return n as LifePathNumber
}

export function calculateLifePath(year: number, month: number, day: number): LifePathNumber {
  const digits = `${year}${month}${day}`.split('').map(Number)
  const sum = digits.reduce((a, b) => a + b, 0)
  return reduceNumber(sum)
}

const NUMEROLOGY_INFO: Record<LifePathNumber, NumerologyInfo> = {
  1:  { lifePath: 1,  name: 'The Pioneer',     description: 'Leadership, independence, and the drive to forge new paths.', strengths: ['Independent', 'Determined', 'Innovative'], challenges: ['Stubborn', 'Impatient'] },
  2:  { lifePath: 2,  name: 'The Diplomat',    description: 'Cooperation, sensitivity, and the gift of mediation.', strengths: ['Cooperative', 'Empathetic', 'Patient'], challenges: ['Over-sensitive', 'Indecisive'] },
  3:  { lifePath: 3,  name: 'The Creator',     description: 'Expression, joy, and the power of communication.', strengths: ['Creative', 'Expressive', 'Optimistic'], challenges: ['Scattered', 'Superficial'] },
  4:  { lifePath: 4,  name: 'The Builder',     description: 'Structure, discipline, and the ability to manifest.', strengths: ['Disciplined', 'Reliable', 'Hardworking'], challenges: ['Rigid', 'Controlling'] },
  5:  { lifePath: 5,  name: 'The Adventurer',  description: 'Freedom, change, and the hunger for experience.', strengths: ['Adaptable', 'Curious', 'Magnetic'], challenges: ['Restless', 'Impulsive'] },
  6:  { lifePath: 6,  name: 'The Nurturer',    description: 'Responsibility, love, and the instinct to care for others.', strengths: ['Caring', 'Responsible', 'Harmonious'], challenges: ['Self-sacrificing', 'Worrier'] },
  7:  { lifePath: 7,  name: 'The Seeker',      description: 'Wisdom, introspection, and the search for deeper truth.', strengths: ['Analytical', 'Intuitive', 'Wise'], challenges: ['Isolated', 'Skeptical'] },
  8:  { lifePath: 8,  name: 'The Powerhouse',  description: 'Ambition, material mastery, and the drive to achieve.', strengths: ['Ambitious', 'Confident', 'Strategic'], challenges: ['Workaholic', 'Controlling'] },
  9:  { lifePath: 9,  name: 'The Humanitarian',description: 'Compassion, completion, and the desire to serve.', strengths: ['Compassionate', 'Idealistic', 'Generous'], challenges: ['Martyr complex', 'Aloof'] },
  11: { lifePath: 11, name: 'The Visionary',   description: 'Intuition, inspiration, and the bridge to higher knowing.', strengths: ['Intuitive', 'Inspiring', 'Sensitive'], challenges: ['Anxious', 'Overwhelmed'] },
  22: { lifePath: 22, name: 'The Architect',   description: 'Manifestation at scale — turning visions into reality.', strengths: ['Practical visionary', 'Powerful', 'Capable'], challenges: ['Pressure', 'Self-doubt'] },
  33: { lifePath: 33, name: 'The Teacher',     description: 'Service, healing, and the calling to uplift others.', strengths: ['Compassionate', 'Wise', 'Healing'], challenges: ['Self-neglect', 'Overwhelmed'] },
}

export function getNumerologyInfo(lifePath: LifePathNumber): NumerologyInfo {
  return NUMEROLOGY_INFO[lifePath]
}
```

- [ ] **Step 2: Verify** — Run: `npx tsc --noEmit`. Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/astrology/numerology.ts
git commit -m "feat: add numerology life path calculation"
```

---

## Task 12: Moon Phase Module

**Files:** Create `src/lib/astrology/moonPhase.ts`

- [ ] **Step 1: Create moon phase module**

```ts
// src/lib/astrology/moonPhase.ts

export type MoonPhase =
  | 'new' | 'waxingCrescent' | 'firstQuarter' | 'waxingGibbous'
  | 'full' | 'waningGibbous' | 'lastQuarter' | 'waningCrescent'

export interface MoonPhaseInfo {
  phase: MoonPhase; name: string; symbol: string; illumination: number; meaning: string
}

const KNOWN_NEW_MOON_JDE = 2451550.1
const SYNODIC_MONTH = 29.530588853

function toJulianDay(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5
}

const MOON_PHASE_INFO: Record<MoonPhase, Omit<MoonPhaseInfo, 'illumination'>> = {
  new:            { phase: 'new',             name: 'New Moon',          symbol: '\uD83C\uDF11', meaning: 'A time for beginnings and setting intentions.' },
  waxingCrescent: { phase: 'waxingCrescent',  name: 'Waxing Crescent',   symbol: '\uD83C\uDF12', meaning: 'Growth and building momentum.' },
  firstQuarter:   { phase: 'firstQuarter',    name: 'First Quarter',     symbol: '\uD83C\uDF13', meaning: 'Action and commitment to your path.' },
  waxingGibbous:  { phase: 'waxingGibbous',   name: 'Waxing Gibbous',    symbol: '\uD83C\uDF14', meaning: 'Refinement and preparation.' },
  full:           { phase: 'full',            name: 'Full Moon',         symbol: '\uD83C\uDF15', meaning: 'Illumination and culmination.' },
  waningGibbous:  { phase: 'waningGibbous',   name: 'Waning Gibbous',    symbol: '\uD83C\uDF16', meaning: 'Gratitude and sharing.' },
  lastQuarter:    { phase: 'lastQuarter',     name: 'Last Quarter',      symbol: '\uD83C\uDF17', meaning: 'Release and forgiveness.' },
  waningCrescent: { phase: 'waningCrescent',  name: 'Waning Crescent',   symbol: '\uD83C\uDF18', meaning: 'Rest and reflection.' },
}

export function getMoonPhase(date = new Date()): MoonPhaseInfo {
  const jde = toJulianDay(date)
  const daysSinceNew = ((jde - KNOWN_NEW_MOON_JDE) % SYNODIC_MONTH + SYNODIC_MONTH) % SYNODIC_MONTH
  const phaseFraction = daysSinceNew / SYNODIC_MONTH
  const illumination = Math.round((1 - Math.cos(2 * Math.PI * phaseFraction)) / 2 * 100)

  let phase: MoonPhase
  if (phaseFraction < 0.03 || phaseFraction > 0.97) phase = 'new'
  else if (phaseFraction < 0.22) phase = 'waxingCrescent'
  else if (phaseFraction < 0.28) phase = 'firstQuarter'
  else if (phaseFraction < 0.47) phase = 'waxingGibbous'
  else if (phaseFraction < 0.53) phase = 'full'
  else if (phaseFraction < 0.72) phase = 'waningGibbous'
  else if (phaseFraction < 0.78) phase = 'lastQuarter'
  else phase = 'waningCrescent'

  return { ...MOON_PHASE_INFO[phase], illumination }
}
```

- [ ] **Step 2: Verify** — Run: `npx tsc --noEmit`. Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/astrology/moonPhase.ts
git commit -m "feat: add moon phase calculation"
```

---

## Task 13: Natal Chart Module

**Files:** Create `src/lib/astrology/natal.ts`

- [ ] **Step 1: Create natal chart module**

```ts
// src/lib/astrology/natal.ts

import { ZodiacSign } from './zodiac'

export type Planet = 'sun' | 'moon' | 'mercury' | 'venus' | 'mars'

export interface NatalPosition {
  planet: Planet; sign: ZodiacSign; degrees: number; fullDegrees: number; retrograde: boolean; meaning: string
}

export interface NatalChart {
  sun: NatalPosition; moon: NatalPosition; mercury: NatalPosition
  venus: NatalPosition; mars: NatalPosition
  birthDate: string; birthTime: string | null
  location: { city: string; lat: number; lng: number; timezone: string }
}

const J2000_JD = 2451545.0

const PLANETARY_ELEMENTS: Record<Planet, { L0: number; n: number }> = {
  sun:     { L0: 280.460,  n: 0.9856474 },
  moon:    { L0: 218.316,  n: 13.176396 },
  mercury: { L0: 252.250,  n: 4.0923771 },
  venus:   { L0: 181.979,  n: 1.6021687 },
  mars:    { L0: 355.433,  n: 0.5240207 },
}

function toJulianDay(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5
}

function normalize(deg: number): number {
  return ((deg % 360) + 360) % 360
}

const SIGNS_ORDER: ZodiacSign[] = [
  'aries','taurus','gemini','cancer','leo','virgo',
  'libra','scorpio','sagittarius','capricorn','aquarius','pisces'
]

const PLANET_MEANINGS: Record<Planet, Partial<Record<ZodiacSign, string>>> = {
  sun: {
    aries: 'Your identity is forged through action and initiative.',
    taurus: 'Your identity is rooted in stability and the senses.',
    gemini: 'Your identity is shaped by curiosity and communication.',
    cancer: 'Your identity flows from emotional connection and care.',
    leo: 'Your identity radiates through creativity and self-expression.',
    virgo: 'Your identity is crafted through precision and service.',
    libra: 'Your identity is found in balance and relationship.',
    scorpio: 'Your identity is forged through intensity and transformation.',
    sagittarius: 'Your identity is shaped by adventure and meaning.',
    capricorn: 'Your identity is built through discipline and ambition.',
    aquarius: 'Your identity is rooted in independence and vision.',
    pisces: 'Your identity flows from compassion and imagination.',
  },
  moon: {
    aries: 'Your emotions are immediate and fiery.',
    taurus: 'Your emotions seek stability and comfort.',
    gemini: 'Your emotions are processed through thought.',
    cancer: 'Your emotions are deep and nurturing.',
    leo: 'Your emotions are warm and expressive.',
    virgo: 'Your emotions are processed through analysis.',
    libra: 'Your emotions seek harmony and balance.',
    scorpio: 'Your emotions are intense and private.',
    sagittarius: 'Your emotions are expansive and optimistic.',
    capricorn: 'Your emotions are controlled and reserved.',
    aquarius: 'Your emotions are detached and observant.',
    pisces: 'Your emotions are fluid and empathic.',
  },
  mercury: {
    aries: 'You communicate directly and quickly.',
    taurus: 'You communicate deliberately and practically.',
    gemini: 'You communicate with versatility and wit.',
    cancer: 'You communicate with feeling and memory.',
    leo: 'You communicate with warmth and drama.',
    virgo: 'You communicate precisely and analytically.',
    libra: 'You communicate diplomatically and fairly.',
    scorpio: 'You communicate with depth and probing.',
    sagittarius: 'You communicate with enthusiasm and vision.',
    capricorn: 'You communicate concisely and authoritatively.',
    aquarius: 'You communicate with originality and objectivity.',
    pisces: 'You communicate intuitively and poetically.',
  },
  venus: {
    aries: 'You love passionately and impulsively.',
    taurus: 'You love sensually and steadfastly.',
    gemini: 'You love through conversation and play.',
    cancer: 'You love nurturing and protectively.',
    leo: 'You love generously and proudly.',
    virgo: 'You love through devotion and acts of service.',
    libra: 'You love harmoniously and romantically.',
    scorpio: 'You love intensely and exclusively.',
    sagittarius: 'You love freely and adventurously.',
    capricorn: 'You love committedly and responsibly.',
    aquarius: 'You love unconventionally and as a friend first.',
    pisces: 'You love unconditionally and romantically.',
  },
  mars: {
    aries: 'You act with urgency and courage.',
    taurus: 'You act with patience and persistence.',
    gemini: 'You act through adaptability and quick thinking.',
    cancer: 'You act driven by emotional need.',
    leo: 'You act with confidence and flair.',
    virgo: 'You act with precision and technique.',
    libra: 'You act through cooperation and strategy.',
    scorpio: 'You act with intensity and strategy.',
    sagittarius: 'You act with conviction and speed.',
    capricorn: 'You act with discipline and purpose.',
    aquarius: 'You act with innovation and idealism.',
    pisces: 'You act guided by intuition and feeling.',
  },
}

function calcPlanetPosition(planet: Planet, daysSinceJ2000: number): NatalPosition {
  const elements = PLANETARY_ELEMENTS[planet]
  const meanLongitude = normalize(elements.L0 + elements.n * daysSinceJ2000)
  const signIndex = Math.floor(meanLongitude / 30)
  const sign = SIGNS_ORDER[signIndex] || 'aries'
  const degreesInSign = meanLongitude % 30
  const meaning = PLANET_MEANINGS[planet]?.[sign] ?? ''

  return { planet, sign, degrees: degreesInSign, fullDegrees: meanLongitude, retrograde: false, meaning }
}

export function calculateNatalChart(birth: {
  date: string; time: string | null
  location: { city: string; lat: number; lng: number; timezone: string }
}): NatalChart {
  const [year, month, day] = birth.date.split('-').map(Number)
  let hour = 12, minute = 0
  if (birth.time) {
    const [h, m] = birth.time.split(':').map(Number)
    hour = h; minute = m
  }
  const birthDate = new Date(year, month - 1, day, hour, minute)
  const jd = toJulianDay(birthDate)
  const daysSinceJ2000 = jd - J2000_JD

  return {
    sun: calcPlanetPosition('sun', daysSinceJ2000),
    moon: calcPlanetPosition('moon', daysSinceJ2000),
    mercury: calcPlanetPosition('mercury', daysSinceJ2000),
    venus: calcPlanetPosition('venus', daysSinceJ2000),
    mars: calcPlanetPosition('mars', daysSinceJ2000),
    birthDate: birth.date, birthTime: birth.time, location: birth.location,
  }
}
```

- [ ] **Step 2: Verify** — Run: `npx tsc --noEmit`. Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/astrology/natal.ts
git commit -m "feat: add natal chart calculation (simplified orbital elements)"
```

---

## Task 14: Archetype Module

**Files:** Create `src/lib/astrology/archetype.ts`

- [ ] **Step 1: Create archetype module**

```ts
// src/lib/astrology/archetype.ts

import { ZodiacSign, Element, getZodiacInfo } from './zodiac'
import { LifePathNumber, getNumerologyInfo } from './numerology'

export interface Archetype {
  name: string; tagline: string; description: string
  patterns: string[]; strengths: string[]; growth: string[]
}

const elementAdjectives: Record<Element, { vibe: string; trait: string }> = {
  fire:  { vibe: 'Bold',     trait: 'passionate' },
  earth: { vibe: 'Grounded', trait: 'practical' },
  air:   { vibe: 'Quiet',    trait: 'analytical' },
  water: { vibe: 'Deep',     trait: 'intuitive' },
}

const lifePathRoles: Record<LifePathNumber, string> = {
  1: 'Pioneer', 2: 'Diplomat', 3: 'Creator', 4: 'Builder',
  5: 'Adventurer', 6: 'Healer', 7: 'Strategist', 8: 'Achiever',
  9: 'Humanitarian', 11: 'Visionary', 22: 'Architect', 33: 'Guide',
}

const focusPatterns: Record<string, string[]> = {
  love:        ['Private Processor', 'Pattern Reader', 'Consistency Seeker', 'Quiet Intensity'],
  lost:        ['Wayfinder', 'Meaning Seeker', 'Crossroads Watcher', 'Inner Compass'],
  'self-worth':['Quiet Validator', 'Self Observer', 'Worth Builder', 'Gentle Advocate'],
  career:      ['Strategic Mover', 'Pattern Optimizer', 'Vision Holder', 'Steady Climber'],
  healing:     ['Gentle Healer', 'Past Integrator', 'Emotion Processor', 'Slow Bloomer'],
  purpose:     ['Purpose Seeker', 'Meaning Weaver', 'Deep Diver', 'North Star Follower'],
}

const elementGrowth: Record<Element, string[]> = {
  fire:  ['Slow down before acting', 'Listen before deciding', 'Patience with others'],
  earth: ['Embrace change', 'Feel before planning', 'Let go of control'],
  air:   ['Stay with feelings', 'Finish what you start', 'Ground your ideas'],
  water: ['Set boundaries', 'Act on your feelings', 'Trust your strength'],
}

export function deriveArchetype(zodiacSign: ZodiacSign, lifePath: LifePathNumber, focus: string): Archetype {
  const zodiacInfo = getZodiacInfo(zodiacSign)
  const element = zodiacInfo.element
  const numInfo = getNumerologyInfo(lifePath)

  const adjective = elementAdjectives[element].vibe
  const role = lifePathRoles[lifePath]
  const name = `The ${adjective} ${role}`

  const tagline = `${element.charAt(0).toUpperCase() + element.slice(1)} \u00B7 ${zodiacInfo.modality.charAt(0).toUpperCase() + zodiacInfo.modality.slice(1)} \u00B7 ${role}`
  const patterns = focusPatterns[focus] || focusPatterns.purpose
  const strengths = [...zodiacInfo.traits.slice(0, 2), ...numInfo.strengths.slice(0, 2)]
  const growth = elementGrowth[element]
  const description = `As ${name}, you carry the ${elementAdjectives[element].trait} nature of ${zodiacInfo.name} with the life path of ${numInfo.name}. Your focus on ${focus} shapes how these qualities express themselves day to day.`

  return { name, tagline, description, patterns, strengths, growth }
}
```

- [ ] **Step 2: Verify** — Run: `npx tsc --noEmit`. Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/astrology/archetype.ts
git commit -m "feat: add archetype derivation from zodiac + numerology + focus"
```

---

## Task 15: Horoscope Module

**Files:** Create `src/lib/astrology/horoscope.ts`

- [ ] **Step 1: Create horoscope module**

This module contains 12 sign-specific content arrays. The content is substantial. See the spec section 5.7 for the full content. Each sign has 4 categories (overview, love, career, growth) with 3 entries each.

```ts
// src/lib/astrology/horoscope.ts

import { NatalChart } from './natal'
import { ZodiacSign } from './zodiac'
import { getMoonPhase, MoonPhaseInfo } from './moonPhase'
import { getDayOfYear } from '@/src/lib/dates'

export interface DailyHoroscope {
  date: string
  categories: { overview: string; love: string; career: string; growth: string }
  moonPhase: MoonPhaseInfo
  luckyHour: number
  affirmation: string
}

// Content arrays for each sign - 3 entries per category
// See spec section 5.7 for content guidelines
const HOROSCOPE_CONTENT: Record<ZodiacSign, {
  overview: string[]; love: string[]; career: string[]; growth: string[]
}> = {
  aries: {
    overview: ['Your fire is your compass today. Trust where it points.', 'Slow down \u2014 the rush is hiding the real opportunity.', 'Your boldness opens a door you didn\u2019t expect.'],
    love: ['Say what you mean. Directness is your love language.', 'Passion is close. Don\u2019t confuse it with urgency.', 'Your warmth draws someone in today.'],
    career: ['Lead with conviction. Others are waiting for your signal.', 'A quick decision pays off. Trust your gut.', 'Don\u2019t let impatience rush a good plan.'],
    growth: ['Pausing is not weakness. It\u2019s strategy.', 'Channel your fire into one thing today.', 'Your independence is a gift \u2014 share it.'],
  },
  taurus: {
    overview: ['Stability is your superpower. Don\u2019t abandon it for novelty.', 'Your senses are speaking. Listen with your body.', 'Patience pays today \u2014 let things ripen.'],
    love: ['Show your loyalty through small acts, not grand gestures.', 'Comfort is your love language. Share it.', 'Don\u2019t confuse stubbornness with devotion.'],
    career: ['Your consistency is noticed. Keep showing up.', 'A practical approach wins over flash.', 'Don\u2019t resist change \u2014 adapt at your pace.'],
    growth: ['Let go of one thing you\u2019re holding too tightly.', 'Pleasure is not indulgence. It\u2019s restoration.', 'Your groundedness anchors others.'],
  },
  gemini: {
    overview: ['Your curiosity unlocks a new perspective today.', 'Too many options? Pick one and go deep.', 'Your words carry more weight than you think.'],
    love: ['Conversation is your foreplay. Talk first.', 'Don\u2019t let restlessness sabotage connection.', 'Your wit opens a heart today.'],
    career: ['Your adaptability is your edge. Use it.', 'Follow through \u2014 don\u2019t just start.', 'A new idea is worth pursuing.'],
    growth: ['Finish what you start today.', 'Depth over breadth \u2014 choose one thing.', 'Your silence is also communication.'],
  },
  cancer: {
    overview: ['Your intuition is loud today. Trust it.', 'Your emotions are information, not a problem.', 'Home is where your power resets.'],
    love: ['Show your care through presence, not words.', 'Your vulnerability is your strength.', 'Don\u2019t retreat \u2014 reach out.'],
    career: ['Your memory and care are assets. Use them.', 'Don\u2019t take criticism personally.', 'A nurturing approach solves a problem.'],
    growth: ['Boundaries are self-care, not rejection.', 'Feel the feeling, then decide.', 'Your sensitivity is a radar, not a weakness.'],
  },
  leo: {
    overview: ['Your warmth lights up the room. Share it.', 'Don\u2019t confuse attention with connection.', 'Your creativity is asking for expression.'],
    love: ['Generosity is your love language. Give freely.', 'Let others shine too \u2014 it doesn\u2019t dim you.', 'Your pride is protecting something. What?'],
    career: ['Your confidence opens doors. Walk through.', 'Lead with warmth, not ego.', 'Recognition is coming. Stay grounded.'],
    growth: ['You don\u2019t need an audience to be worthy.', 'Let someone else take the lead today.', 'Your vulnerability is brave, not weak.'],
  },
  virgo: {
    overview: ['Your precision is your gift. Don\u2019t apologize for it.', 'Perfection is the enemy of done.', 'Your service is love in action.'],
    love: ['Show care through acts, not words.', 'Don\u2019t criticize what you love.', 'Your devotion runs deep. Let it show.'],
    career: ['Your analysis solves a problem others missed.', 'Done is better than perfect.', 'Your reliability is your reputation.'],
    growth: ['Let go of one thing that\u2019s not quite right.', 'Rest is productive.', 'You are enough as you are.'],
  },
  libra: {
    overview: ['Balance is your gift. Don\u2019t lose yourself maintaining it.', 'Your fairness is needed today.', 'Beauty restores your peace.'],
    love: ['Harmony is your love language. Create it.', 'Don\u2019t avoid conflict \u2014 address it gently.', 'Your charm opens a door today.'],
    career: ['Your diplomacy diffuses tension. Use it.', 'Make a decision \u2014 don\u2019t wait for perfect balance.', 'Your aesthetic sense is an asset.'],
    growth: ['Your opinion matters too.', 'Conflict is not the enemy of harmony.', 'Choose yourself first today.'],
  },
  scorpio: {
    overview: ['Your intensity is your power. Don\u2019t dilute it.', 'What you\u2019re avoiding is what you need to face.', 'Your depth is your gift. Dive.'],
    love: ['Your loyalty is fierce. Share it wisely.', 'Vulnerability is your strength, not weakness.', 'Don\u2019t test \u2014 trust.'],
    career: ['Your strategic mind sees what others miss.', 'Your focus is your edge. Use it.', 'Don\u2019t hold grudges \u2014 move forward.'],
    growth: ['Let go of one thing you\u2019re controlling.', 'Your feelings are not a threat.', 'Trust is a risk worth taking.'],
  },
  sagittarius: {
    overview: ['Your optimism is your compass. Follow it.', 'Freedom is calling. Answer.', 'Your honesty is refreshing \u2014 use it kindly.'],
    love: ['Adventure is your love language. Share it.', 'Don\u2019t flee from depth \u2014 stay.', 'Your enthusiasm is contagious.'],
    career: ['Your vision sees the big picture. Share it.', 'Follow through on your promises.', 'A new opportunity is worth exploring.'],
    growth: ['Commitment is not a cage.', 'Stay with one thing today.', 'Your bluntness can wound. Temper it.'],
  },
  capricorn: {
    overview: ['Your discipline builds something lasting today.', 'Don\u2019t forget to rest on the climb.', 'Your ambition is valid. Keep going.'],
    love: ['Show your devotion through presence.', 'Don\u2019t let work replace connection.', 'Your steadiness is your love language.'],
    career: ['Your strategy pays off. Trust the plan.', 'Don\u2019t carry it all alone \u2014 delegate.', 'Your patience is your advantage.'],
    growth: ['Rest is not laziness.', 'Let someone help you.', 'Your feelings deserve attention too.'],
  },
  aquarius: {
    overview: ['Your vision is ahead of its time. Share it.', 'Don\u2019t confuse detachment with independence.', 'Your individuality is your gift.'],
    love: ['Friendship is the foundation of your love.', 'Don\u2019t disappear into your mind.', 'Your uniqueness is attractive.'],
    career: ['Your innovation solves a problem. Speak up.', 'Collaborate \u2014 you don\u2019t have to do it alone.', 'Your idealism is an asset, not naivety.'],
    growth: ['Your feelings are not a distraction.', 'Connection is not conformity.', 'Stay present with one person today.'],
  },
  pisces: {
    overview: ['Your intuition is your guide. Trust it.', 'Your compassion heals. Don\u2019t forget yourself.', 'Your imagination is asking for expression.'],
    love: ['Your empathy is your love language.', 'Don\u2019t lose yourself in someone else.', 'Your gentleness is your strength.'],
    career: ['Your creativity solves a problem. Offer it.', 'Don\u2019t let overwhelm stop you.', 'Your sensitivity is your radar.'],
    growth: ['Boundaries protect your softness.', 'Ground yourself before helping others.', 'Your feelings are valid, not a burden.'],
  },
}

const AFFIRMATIONS: string[] = [
  'I trust what I know.', 'I am allowed to take up space.', 'My feelings are valid.',
  'I choose honesty over comfort.', 'I am enough as I am.', 'I trust the timing of my life.',
  'I release what I cannot control.',
]

export function generateDailyHoroscope(natal: NatalChart, date = new Date()): DailyHoroscope {
  const sunSign = natal.sun.sign
  const content = HOROSCOPE_CONTENT[sunSign]
  const dayOfYear = getDayOfYear(date)

  return {
    date: date.toISOString().split('T')[0],
    categories: {
      overview: content.overview[dayOfYear % content.overview.length],
      love: content.love[dayOfYear % content.love.length],
      career: content.career[dayOfYear % content.career.length],
      growth: content.growth[dayOfYear % content.growth.length],
    },
    moonPhase: getMoonPhase(date),
    luckyHour: dayOfYear % 24,
    affirmation: AFFIRMATIONS[dayOfYear % AFFIRMATIONS.length],
  }
}
```

- [ ] **Step 2: Verify** — Run: `npx tsc --noEmit`. Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/astrology/horoscope.ts
git commit -m "feat: add daily horoscope generation from natal chart"
```

---

## Task 16: Compatibility Module

**Files:** Create `src/lib/astrology/compatibility.ts`

- [ ] **Step 1: Create compatibility module**

```ts
// src/lib/astrology/compatibility.ts

import { ZodiacSign, Element, getZodiacInfo } from './zodiac'

export interface CompatibilityResult {
  userSign: ZodiacSign; partnerSign: ZodiacSign
  overallScore: number; loveScore: number; communicationScore: number; friendshipScore: number
  summary: string; strengths: string[]; challenges: string[]; advice: string
}

const elementCompatibility: Record<Element, Record<Element, { score: number; dynamic: string }>> = {
  fire: {
    fire:  { score: 75, dynamic: 'high energy, passionate, may compete' },
    earth: { score: 40, dynamic: 'challenging \u2014 impulse meets caution' },
    air:   { score: 85, dynamic: 'high energy, passionate, inspiring' },
    water: { score: 45, dynamic: 'steam \u2014 intense but volatile' },
  },
  earth: {
    fire:  { score: 40, dynamic: 'challenging \u2014 caution meets impulse' },
    earth: { score: 80, dynamic: 'stable, grounded, may lack spark' },
    air:   { score: 50, dynamic: 'challenging \u2014 practical vs abstract' },
    water: { score: 85, dynamic: 'nurturing, stable, emotionally rich' },
  },
  air: {
    fire:  { score: 85, dynamic: 'high energy, passionate, inspiring' },
    earth: { score: 50, dynamic: 'challenging \u2014 abstract vs practical' },
    air:   { score: 70, dynamic: 'mental connection, may lack depth' },
    water: { score: 55, dynamic: 'challenging \u2014 logic meets emotion' },
  },
  water: {
    fire:  { score: 45, dynamic: 'steam \u2014 intense but volatile' },
    earth: { score: 85, dynamic: 'nurturing, stable, emotionally rich' },
    air:   { score: 55, dynamic: 'challenging \u2014 emotion meets logic' },
    water: { score: 75, dynamic: 'deep emotional bond, may overwhelm' },
  },
}

export function calculateCompatibility(userSign: ZodiacSign, partnerSign: ZodiacSign): CompatibilityResult {
  const userElement = getZodiacInfo(userSign).element
  const partnerElement = getZodiacInfo(partnerSign).element
  const compat = elementCompatibility[userElement][partnerElement]

  const sameSign = userSign === partnerSign
  const overallScore = sameSign ? 65 : compat.score

  const loveScore = Math.min(95, overallScore + (userElement === partnerElement ? 10 : 5))
  const communicationScore = Math.min(90, overallScore + (userElement === 'air' || partnerElement === 'air' ? 10 : 0))
  const friendshipScore = Math.min(92, overallScore + 5)

  const userZodiac = getZodiacInfo(userSign)
  const partnerZodiac = getZodiacInfo(partnerSign)

  const summary = sameSign
    ? `Two ${userZodiac.name}s \u2014 deep understanding, but watch for blind spots.`
    : `${userZodiac.name} and ${partnerZodiac.name}: ${compat.dynamic}.`

  const strengths = sameSign
    ? ['Deep mutual understanding', 'Shared values', 'Natural rhythm']
    : [`${userElement} meets ${partnerElement}`, compat.dynamic.split(',')[0], 'Complementary perspectives']

  const challenges = sameSign
    ? ['Shared blind spots', 'No one to balance you', 'Amplified weaknesses']
    : [compat.dynamic, 'Different needs for stimulation', 'Learning each other\u2019s language']

  const advice = sameSign
    ? 'Celebrate your mirror \u2014 but seek outside perspectives to grow.'
    : `Your differences are your strength. ${userElement} and ${partnerElement} teach each other what they lack.`

  return { userSign, partnerSign, overallScore, loveScore, communicationScore, friendshipScore, summary, strengths, challenges, advice }
}
```

- [ ] **Step 2: Verify** — Run: `npx tsc --noEmit`. Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/astrology/compatibility.ts
git commit -m "feat: add zodiac compatibility calculation"
```

---

## Task 17: Astrology Barrel Export

**Files:** Create `src/lib/astrology/index.ts`

- [ ] **Step 1: Create barrel export**

```ts
// src/lib/astrology/index.ts

export { getZodiacSign, getZodiacInfo } from './zodiac'
export type { ZodiacSign, Element, Modality, ZodiacInfo } from './zodiac'

export { calculateLifePath, getNumerologyInfo } from './numerology'
export type { LifePathNumber, NumerologyInfo } from './numerology'

export { getMoonPhase } from './moonPhase'
export type { MoonPhase, MoonPhaseInfo } from './moonPhase'

export { calculateNatalChart } from './natal'
export type { Planet, NatalPosition, NatalChart } from './natal'

export { deriveArchetype } from './archetype'
export type { Archetype } from './archetype'

export { generateDailyHoroscope } from './horoscope'
export type { DailyHoroscope } from './horoscope'

export { calculateCompatibility } from './compatibility'
export type { CompatibilityResult } from './compatibility'
```

- [ ] **Step 2: Verify** — Run: `npx tsc --noEmit`. Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/astrology/index.ts
git commit -m "feat: add astrology engine barrel export"
```

---

## Task 18: ProfileContext

**Files:** Rewrite `src/context/ProfileContext.tsx`

- [ ] **Step 1: Read current file** — Read `src/context/ProfileContext.tsx` to see if it exists (it may not — check first).

- [ ] **Step 2: Create/rewrite ProfileContext**

```tsx
// src/context/ProfileContext.tsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { loadJSON, saveJSON, removeKey } from '@/src/lib/storage'

export interface BirthData {
  date: string
  time: string | null
  location: {
    city: string; country: string; timezone: string; lat: number | null; lng: number | null
  }
}

export interface ProfileData {
  name: string | null
  birth: BirthData
  mbti: string | null
  focus: string
  feedback: { firstMirrorAccuracy: 'accurate' | 'partial' | 'inaccurate' | null }
  createdAt: string
}

interface ProfileContextValue {
  profile: ProfileData | null
  hydrated: boolean
  hasProfile: boolean
  onboardingStep: number
  setBirthDate: (date: string) => void
  setBirthTime: (time: string | null) => void
  setLocation: (location: BirthData['location']) => void
  setMbti: (mbti: string | null) => void
  setFocus: (focus: string) => void
  setName: (name: string | null) => void
  setFirstMirrorFeedback: (feedback: ProfileData['feedback']['firstMirrorAccuracy']) => void
  finalizeProfile: () => void
  clearProfile: () => Promise<void>
}

const ProfileContext = createContext<ProfileContextValue>({
  profile: null, hydrated: false, hasProfile: false, onboardingStep: 0,
  setBirthDate: () => {}, setBirthTime: () => {}, setLocation: () => {},
  setMbti: () => {}, setFocus: () => {}, setName: () => {},
  setFirstMirrorFeedback: () => {}, finalizeProfile: () => {}, clearProfile: async () => {},
})

const DEFAULT_PROFILE: ProfileData = {
  name: null,
  birth: { date: '', time: null, location: { city: '', country: '', timezone: '', lat: null, lng: null } },
  mbti: null, focus: '',
  feedback: { firstMirrorAccuracy: null },
  createdAt: '',
}

function getOnboardingStep(profile: ProfileData | null): number {
  if (!profile) return 0
  if (!profile.birth.date) return 1
  if (profile.birth.time === undefined) return 2
  if (!profile.birth.location.city) return 3
  if (profile.mbti === undefined) return 4
  if (!profile.focus) return 5
  return 6
}

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [hydrated, setHydrated] = useState(false)
  const [onboardingComplete, setOnboardingComplete] = useState(false)

  useEffect(() => {
    (async () => {
      const profileResult = await loadJSON<ProfileData>('astrovy_profile')
      if (profileResult.ok && profileResult.data) {
        setProfile(profileResult.data)
      }
      const completeResult = await loadJSON<boolean>('astrovy_onboarding_complete')
      if (completeResult.ok && completeResult.data) {
        setOnboardingComplete(true)
      }
      setHydrated(true)
    })()
  }, [])

  const persist = useCallback(async (newProfile: ProfileData) => {
    await saveJSON('astrovy_profile', newProfile)
  }, [])

  const updateProfile = useCallback((updater: (prev: ProfileData) => ProfileData) => {
    setProfile((prev) => {
      const base = prev || { ...DEFAULT_PROFILE, createdAt: new Date().toISOString() }
      const next = updater(base)
      persist(next)
      return next
    })
  }, [persist])

  const setBirthDate = useCallback((date: string) => {
    updateProfile((p) => ({ ...p, birth: { ...p.birth, date } }))
  }, [updateProfile])

  const setBirthTime = useCallback((time: string | null) => {
    updateProfile((p) => ({ ...p, birth: { ...p.birth, time } }))
  }, [updateProfile])

  const setLocation = useCallback((location: BirthData['location']) => {
    updateProfile((p) => ({ ...p, birth: { ...p.birth, location } }))
  }, [updateProfile])

  const setMbti = useCallback((mbti: string | null) => {
    updateProfile((p) => ({ ...p, mbti }))
  }, [updateProfile])

  const setFocus = useCallback((focus: string) => {
    updateProfile((p) => ({ ...p, focus }))
  }, [updateProfile])

  const setName = useCallback((name: string | null) => {
    updateProfile((p) => ({ ...p, name }))
  }, [updateProfile])

  const setFirstMirrorFeedback = useCallback((feedback: ProfileData['feedback']['firstMirrorAccuracy']) => {
    updateProfile((p) => ({ ...p, feedback: { firstMirrorAccuracy: feedback } }))
  }, [updateProfile])

  const finalizeProfile = useCallback(() => {
    setOnboardingComplete(true)
    saveJSON('astrovy_onboarding_complete', true)
  }, [])

  const clearProfile = useCallback(async () => {
    await removeKey('astrovy_profile')
    await removeKey('astrovy_onboarding_complete')
    setProfile(null)
    setOnboardingComplete(false)
  }, [])

  const hasProfile = profile !== null && onboardingComplete
  const onboardingStep = getOnboardingStep(profile)

  return (
    <ProfileContext.Provider value={{
      profile, hydrated, hasProfile, onboardingStep,
      setBirthDate, setBirthTime, setLocation, setMbti, setFocus,
      setName, setFirstMirrorFeedback, finalizeProfile, clearProfile,
    }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  return useContext(ProfileContext)
}
```

- [ ] **Step 3: Verify** — Run: `npx tsc --noEmit`. Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/context/ProfileContext.tsx
git commit -m "feat: add ProfileContext with persisted onboarding data"
```

---

## Task 19: TierContext (Persisted)

**Files:** Rewrite `src/context/TierContext.tsx`

- [ ] **Step 1: Read current file** — Read `src/context/TierContext.tsx`

- [ ] **Step 2: Rewrite TierContext**

```tsx
// src/context/TierContext.tsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { loadJSON, saveJSON } from '@/src/lib/storage'

interface TierContextValue {
  isPremium: boolean
  hydrated: boolean
  toggleTier: () => void
  setPremium: (value: boolean) => void
  upgrade: () => void
  restore: () => void
}

const TierContext = createContext<TierContextValue>({
  isPremium: false, hydrated: false,
  toggleTier: () => {}, setPremium: () => {},
  upgrade: () => {}, restore: () => {},
})

export function TierProvider({ children }: { children: React.ReactNode }) {
  const [isPremium, setIsPremium] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    (async () => {
      const result = await loadJSON<boolean>('astrovy_tier')
      if (result.ok && result.data) {
        setIsPremium(result.data)
      }
      setHydrated(true)
    })()
  }, [])

  const persist = useCallback(async (value: boolean) => {
    await saveJSON('astrovy_tier', value)
  }, [])

  const setPremium = useCallback((value: boolean) => {
    setIsPremium(value)
    persist(value)
  }, [persist])

  const toggleTier = useCallback(() => {
    setIsPremium((prev) => {
      const next = !prev
      persist(next)
      return next
    })
  }, [persist])

  const upgrade = useCallback(() => { setPremium(true) }, [setPremium])
  const restore = useCallback(() => { setPremium(true) }, [setPremium])

  return (
    <TierContext.Provider value={{ isPremium, hydrated, toggleTier, setPremium, upgrade, restore }}>
      {children}
    </TierContext.Provider>
  )
}

export function useTier() {
  return useContext(TierContext)
}
```

- [ ] **Step 3: Verify** — Run: `npx tsc --noEmit`. Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/context/TierContext.tsx
git commit -m "feat: add persisted TierContext with upgrade/restore stubs"
```

---

## Task 20: useEngagement Refactor

**Files:** Rewrite `src/hooks/useEngagement.ts`

- [ ] **Step 1: Read current file** — Read `src/hooks/useEngagement.ts` to understand current implementation.

- [ ] **Step 2: Rewrite useEngagement**

Key changes from current:
- Uses `getLocalDateString()` from `@/src/lib/dates` instead of `toISOString()`
- All mutations use functional `setState((prev) => ...)` to prevent race conditions
- Exposes `hydrated` and `error` state
- Storage key changed to `astrovy_engagement`
- `clearAllData` calls `clearAllAppData()` from storage layer
- Journal prompt parameterized

```tsx
// src/hooks/useEngagement.ts

import { useState, useEffect, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getLocalDateString, getYesterdayString, getWeekNumber } from '@/src/lib/dates'
import { clearAllAppData } from '@/src/lib/storage'
import { getWeeklyReadingIndex } from '@/src/lib/dailyContent'

const STORAGE_KEY = 'astrovy_engagement'

interface JournalEntry { id: number; text: string; date: string; prompt: string }
interface MoodEntry { mood: string; date: string; time: string }
interface TarotDraw { cardId: string; reversed: boolean; position: 'past' | 'present' | 'future'; date: string }

interface EngagementState {
  streak: number; lastCheckIn: string | null
  journalEntries: JournalEntry[]; moodHistory: MoodEntry[]
  unlockedReadings: string[]; reflections: number
  lastWeeklyReadingDate: string | null; dismissedWeeklyReading: boolean
  tarotDrawsToday: number; lastTarotDate: string | null; todayTarotCards: TarotDraw[]
}

const DEFAULT_STATE: EngagementState = {
  streak: 0, lastCheckIn: null,
  journalEntries: [], moodHistory: [],
  unlockedReadings: [], reflections: 0,
  lastWeeklyReadingDate: null, dismissedWeeklyReading: false,
  tarotDrawsToday: 0, lastTarotDate: null, todayTarotCards: [],
}

async function loadState(): Promise<EngagementState> {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY)
    if (saved) return { ...DEFAULT_STATE, ...JSON.parse(saved) }
  } catch {}
  return { ...DEFAULT_STATE }
}

export function useEngagement() {
  const [state, setState] = useState<EngagementState>(DEFAULT_STATE)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadState().then((s) => { setState(s); setLoaded(true) }).catch((e) => setError(e.message))
  }, [])

  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch((e) => setError(e.message))
    }
  }, [state, loaded])

  const checkInToday = useCallback(() => {
    const today = getLocalDateString()
    setState((prev) => {
      if (prev.lastCheckIn === today) return prev
      let newStreak = prev.streak
      if (prev.lastCheckIn === getYesterdayString()) newStreak = prev.streak + 1
      else if (prev.lastCheckIn !== today) newStreak = 1
      return { ...prev, streak: newStreak, lastCheckIn: today }
    })
  }, [])

  const addJournalEntry = useCallback((text: string, prompt = 'What do I need but avoid asking for?') => {
    const entry: JournalEntry = { id: Date.now(), text, date: getLocalDateString(), prompt }
    setState((prev) => ({
      ...prev,
      journalEntries: [entry, ...prev.journalEntries],
      reflections: prev.reflections + 1,
    }))
  }, [])

  const addMood = useCallback((mood: string) => {
    const entry: MoodEntry = {
      mood,
      date: getLocalDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setState((prev) => ({ ...prev, moodHistory: [entry, ...prev.moodHistory] }))
  }, [])

  const unlockReading = useCallback((readingId: string) => {
    setState((prev) => {
      if (prev.unlockedReadings.includes(readingId)) return prev
      return { ...prev, unlockedReadings: [...prev.unlockedReadings, readingId] }
    })
  }, [])

  const canUnlock = useCallback((requiredReflections = 3) => state.reflections >= requiredReflections, [state.reflections])
  const reflectionsNeeded = useCallback((required = 3) => Math.max(0, required - state.reflections), [state.reflections])

  const clearAllData = useCallback(async () => {
    try {
      await clearAllAppData()
    } catch {}
    setState({ ...DEFAULT_STATE })
  }, [])

  const drawTarotCard = useCallback((cardId: string, reversed: boolean, position: 'past' | 'present' | 'future') => {
    const today = getLocalDateString()
    const draw: TarotDraw = { cardId, reversed, position, date: today }
    setState((prev) => {
      const isNewDay = prev.lastTarotDate !== today
      return {
        ...prev,
        lastTarotDate: today,
        tarotDrawsToday: isNewDay ? 1 : prev.tarotDrawsToday + 1,
        todayTarotCards: isNewDay ? [draw] : [...prev.todayTarotCards, draw],
      }
    })
  }, [])

  const canDrawTarot = useCallback((isPremium: boolean) => {
    const today = getLocalDateString()
    const isNewDay = state.lastTarotDate !== today
    const drawsToday = isNewDay ? 0 : state.tarotDrawsToday
    const limit = isPremium ? 3 : 1
    return drawsToday < limit
  }, [state.lastTarotDate, state.tarotDrawsToday])

  const getTarotDrawsRemaining = useCallback((isPremium: boolean) => {
    const today = getLocalDateString()
    const isNewDay = state.lastTarotDate !== today
    const drawsToday = isNewDay ? 0 : state.tarotDrawsToday
    const limit = isPremium ? 3 : 1
    return Math.max(0, limit - drawsToday)
  }, [state.lastTarotDate, state.tarotDrawsToday])

  const getConsecutiveMood = useCallback(() => {
    if (state.moodHistory.length < 3) return null
    const recent = state.moodHistory.slice(0, 3)
    const firstMood = recent[0].mood
    const allSame = recent.every((m) => m.mood === firstMood)
    return allSame ? firstMood : null
  }, [state.moodHistory])

  const getWeeklyReadingStatus = useCallback(() => {
    const weekStart = getWeeklyReadingIndex().toString()
    const isNewWeek = state.lastWeeklyReadingDate !== weekStart
    return { isNewWeek, weekStart }
  }, [state.lastWeeklyReadingDate])

  const markWeeklyReadingSeen = useCallback(() => {
    const weekStart = getWeeklyReadingIndex().toString()
    setState((prev) => ({ ...prev, lastWeeklyReadingDate: weekStart, dismissedWeeklyReading: false }))
  }, [])

  const dismissWeeklyReading = useCallback(() => {
    setState((prev) => ({ ...prev, dismissedWeeklyReading: true }))
  }, [])

  const getStreakDays = useCallback(() => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = getLocalDateString(d)
      const dayName = d.toLocaleDateString('en', { weekday: 'short' }).charAt(0)
      const hadCheckIn = state.moodHistory.some((m) => m.date === dateStr)
      days.push({ date: dateStr, day: dayName, active: hadCheckIn })
    }
    return days
  }, [state.moodHistory])

  return {
    ...state,
    hydrated: loaded,
    error,
    checkInToday, addJournalEntry, addMood, unlockReading,
    canUnlock, reflectionsNeeded, getStreakDays,
    clearAllData, getConsecutiveMood,
    getWeeklyReadingStatus, markWeeklyReadingSeen, dismissWeeklyReading,
    drawTarotCard, canDrawTarot, getTarotDrawsRemaining,
  }
}
```

- [ ] **Step 3: Verify** — Run: `npx tsc --noEmit`. Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useEngagement.ts
git commit -m "feat: refactor useEngagement with local dates, functional updates, error state"
```

---

## Task 21: Share Utility

**Files:** Create `src/lib/share.ts`

- [ ] **Step 1: Create share utility**

```ts
// src/lib/share.ts

import { captureRef } from 'react-native-view-shot'
import * as Sharing from 'expo-sharing'
import { Platform } from 'react-native'

export async function captureAndShare(viewRef: React.RefObject<View>, message: string): Promise<{ ok: boolean; error: string | null }> {
  try {
    const uri = await captureRef(viewRef, {
      format: 'png',
      quality: 1,
      result: 'tmpfile',
    })

    if (!uri) {
      return { ok: false, error: 'Capture failed' }
    }

    const mimeType = 'image/png'
    const dialogTitle = 'Share'

    if (Platform.OS === 'web') {
      // Web fallback: open in new tab
      window.open(uri, '_blank')
      return { ok: true, error: null }
    }

    await Sharing.shareAsync(uri, {
      dialogTitle,
      mimeType,
    })

    return { ok: true, error: null }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export function buildShareMessage(type: 'tarot' | 'horoscope' | 'archetype' | 'compatibility' | 'snapshot', data: Record<string, string | number>): string {
  switch (type) {
    case 'tarot':
      return `My card today\n${data.cardName} \u2014 ${data.meaning}\n\nGet your reading on Astrovy`
    case 'horoscope':
      return `My horoscope today\n${data.zodiac} \u2014 ${data.category}: ${data.reading}\n\nMap your cosmos on Astrovy`
    case 'archetype':
      return `My archetype\nI'm ${data.name} \u2014 ${data.tagline}\n\nDiscover yours on Astrovy`
    case 'compatibility':
      return `Our compatibility\n${data.userSign} \u00D7 ${data.partnerSign} \u2014 ${data.score}% match\n\nCheck yours on Astrovy`
    case 'snapshot':
      return `My Astrovy snapshot\n${data.zodiac} Sun \u00B7 Life Path ${data.lifePath} \u00B7 ${data.archetype}\n\nMap your cosmos on Astrovy`
  }
}
```

Note: This imports `View` from react-native for the ref type. Add `import { View } from 'react-native'` at the top if needed, or use `import type { View } from 'react-native'`.

- [ ] **Step 2: Verify** — Run: `npx tsc --noEmit`. Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/share.ts
git commit -m "feat: add share utility (view-shot + native share)"
```

---

## Task 22: Update Daily Content Mood Labels

**Files:** Modify `src/lib/dailyContent.ts`

- [ ] **Step 1: Read current file** — Read `src/lib/dailyContent.ts`

- [ ] **Step 2: Update mood alerts**

Replace the `moodAlerts` object to use new mood labels:

```ts
export const moodAlerts: Record<string, string> = {
  Steady: "Three steady days. That consistency is worth trusting.",
  Tender: "Three tender days. Something is asking to be understood.",
  Restless: "Restlessness three times this week. The chase may be a distraction.",
  Quiet: "Three quiet days. Your body is asking for something different.",
}
```

This replaces `Emotional` with `Tender` and `Numb` with `Quiet`.

- [ ] **Step 3: Verify** — Run: `npx tsc --noEmit`. Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/dailyContent.ts
git commit -m "feat: update mood labels (Emotional->Tender, Numb->Quiet)"
```

---

## Task 23: App Root Layout

**Files:** Modify `app/_layout.tsx`

- [ ] **Step 1: Read current file** — Read `app/_layout.tsx`

- [ ] **Step 2: Rewrite root layout**

```tsx
// app/_layout.tsx

import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ProfileProvider } from '@/src/context/ProfileContext'
import { TierProvider } from '@/src/context/TierContext'
import { useAstrovyFonts } from '@/src/design/fonts'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { colors } from '@/src/design/tokens'

export default function RootLayout() {
  const { loaded, error } = useAstrovyFonts()

  if (!loaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.royalViolet} size="large" />
      </View>
    )
  }

  return (
    <SafeAreaProvider>
      <ProfileProvider>
        <TierProvider>
          <Stack screenOptions={{ headerShown: false }} />
          <StatusBar style="dark" />
        </TierProvider>
      </ProfileProvider>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.lightBg,
  },
})
```

Key changes:
- Added `ProfileProvider` wrapping `TierProvider`
- Added font loading gate (shows spinner until fonts loaded)
- Removed inline gradient background (moved to `Screen` primitive)
- Removed inline `SafeAreaView` (moved to `Screen` primitive)

- [ ] **Step 3: Verify** — Run: `npx tsc --noEmit`. Expected: No errors (there may be errors from screens still using old `theme` imports — that's expected and will be fixed in the screen revamp plan).

- [ ] **Step 4: Commit**

```bash
git add app/_layout.tsx
git commit -m "feat: update root layout with ProfileProvider, TierProvider, font loading"
```

---

## Task 24: App Index (Conditional Routing)

**Files:** Modify `app/index.tsx`

- [ ] **Step 1: Read current file** — Read `app/index.tsx`

- [ ] **Step 2: Rewrite index with conditional routing**

```tsx
// app/index.tsx

import { Redirect } from 'expo-router'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { useProfile } from '@/src/context/ProfileContext'
import { colors } from '@/src/design/tokens'

export default function Index() {
  const { hasProfile, hydrated } = useProfile()

  if (!hydrated) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.royalViolet} size="large" />
      </View>
    )
  }

  if (hasProfile) {
    return <Redirect href="/(tabs)/today" />
  }

  return <Redirect href="/(onboarding)/welcome" />
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.lightBg,
  },
})
```

- [ ] **Step 3: Verify** — Run: `npx tsc --noEmit`. Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add app/index.tsx
git commit -m "feat: add conditional startup routing based on profile existence"
```

---

## Task 25: Full Typecheck Verification

- [ ] **Step 1: Run full typecheck**

Run: `npx tsc --noEmit`

Expected: There will likely be errors from existing screens that still import from `@/src/lib/theme` (the old theme). These are expected and will be resolved in the Screen Revamp plan. The foundation modules themselves should have no errors.

- [ ] **Step 2: Verify foundation modules compile**

Check that the following directories have no errors:
- `src/design/` — all tokens, fonts, primitives
- `src/lib/storage.ts`, `src/lib/dates.ts`, `src/lib/share.ts`
- `src/lib/astrology/` — all 7 modules + index
- `src/context/ProfileContext.tsx`, `src/context/TierContext.tsx`
- `src/hooks/useEngagement.ts`

If any foundation module has errors, fix them before proceeding.

- [ ] **Step 3: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve foundation typecheck errors"
```

---

## Summary

This plan creates the complete foundation for the Astrovy revamp:

1. **Design system** (Tasks 2-7): tokens, fonts, 9 primitive components, barrel exports
2. **Infrastructure** (Tasks 8-9, 21): storage wrapper, date utilities, share utility
3. **Astrology engine** (Tasks 10-17): zodiac, numerology, moon phase, natal chart, archetype, horoscope, compatibility
4. **State** (Tasks 18-20): ProfileContext, persisted TierContext, refactored useEngagement
5. **Content update** (Task 22): mood label changes
6. **App root** (Tasks 23-24): new providers, font loading gate, conditional routing
7. **Verification** (Task 25): full typecheck

The Screen Revamp plan (Part 2) will consume this foundation to redesign all 21 screens.
