# Astrovy Revamp — Screen Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign all 21 screens using the Astrovy design system, real profile data from ProfileContext, and the astrology engine. Apply all new copy and CTA specs.

**Architecture:** Each screen uses `Screen` primitive for background/safe-area, consumes `ProfileContext`/`TierContext`/`useEngagement`, and calls pure functions from the astrology engine. No inline colors, no hardcoded identity, no old `theme.ts` imports.

**Tech Stack:** Expo Router, React Native Reanimated, expo-linear-gradient, design primitives from `src/design/`, astrology engine from `src/lib/astrology/`

**Spec:** `docs/superpowers/specs/2026-07-31-astrovy-revamp-design.md` (sections 8-9)

**Foundation:** Already built on `astrovy-foundation` branch — all design tokens, primitives, contexts, engine, and infrastructure are available.

---

## File Structure

### Onboarding (8 screens)
- Modify: `app/(onboarding)/welcome.tsx`
- Modify: `app/(onboarding)/birth-date.tsx`
- Modify: `app/(onboarding)/birth-time.tsx`
- Modify: `app/(onboarding)/location.tsx`
- Modify: `app/(onboarding)/mbti.tsx`
- Modify: `app/(onboarding)/focus-mood.tsx`
- Modify: `app/(onboarding)/generating.tsx`
- Modify: `app/(onboarding)/first-mirror.tsx`

### Tabs (5 screens + layout)
- Modify: `app/(tabs)/_layout.tsx`
- Modify: `app/(tabs)/today.tsx`
- Modify: `app/(tabs)/soulprint.tsx` → renamed conceptually to "Astro"
- Modify: `app/(tabs)/decode.tsx`
- Modify: `app/(tabs)/mirror.tsx`
- Modify: `app/(tabs)/profile.tsx`

### Secondary (7 screens)
- Modify: `app/tarot.tsx`
- Modify: `app/horoscope.tsx`
- Modify: `app/love.tsx`
- Modify: `app/compatibility.tsx`
- Modify: `app/snapshot.tsx`
- Modify: `app/share-card.tsx`
- Modify: `app/share-tarot.tsx`
- Modify: `app/pricing.tsx`

### Components
- Modify: `src/components/BottomNav.tsx`
- Modify: `src/components/PatternAlertCard.tsx`
- Modify: `src/components/WeeklyReadingCard.tsx`
- Create: `src/components/ShareCardView.tsx`

### Cleanup
- Delete: `src/lib/theme.ts` (replaced by `src/design/tokens.ts`)

---

## Task 1: BottomNav Redesign

**Files:** Modify `src/components/BottomNav.tsx`

- [ ] **Step 1: Read current file** — Read `src/components/BottomNav.tsx`

- [ ] **Step 2: Rewrite BottomNav with Astrovy design**

```tsx
// src/components/BottomNav.tsx

import React from 'react'
import { View, Pressable, Text, StyleSheet } from 'react-native'
import { Sun, Star, BookOpen, Moon, User } from 'lucide-react-native'
import { colors, typography, spacing, radii, shadows } from '@/src/design/tokens'

interface BottomNavProps {
  currentScreen: string
  onNavigate: (screen: string) => void
}

const TABS = [
  { id: 'today',     icon: Sun,      label: 'Today' },
  { id: 'soulprint', icon: Star,     label: 'Astro' },
  { id: 'decode',    icon: BookOpen, label: 'Decode' },
  { id: 'mirror',    icon: Moon,     label: 'Mirror' },
  { id: 'profile',   icon: User,     label: 'Profile' },
]

export default function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  return (
    <View style={styles.container}>
      <View style={styles.nav}>
        {TABS.map((tab) => {
          const Icon = tab.icon
          const active = currentScreen === tab.id
          return (
            <Pressable
              key={tab.id}
              onPress={() => onNavigate(tab.id)}
              style={styles.tab}
            >
              <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
                <Icon size={20} color={active ? colors.white : colors.cosmicGray} />
              </View>
              <Text style={[styles.label, active && styles.labelActive]}>{tab.label}</Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radii.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    ...shadows.card,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: colors.royalViolet,
  },
  label: {
    ...typography.scale.caption,
    fontSize: 10,
    color: colors.cosmicGray,
  },
  labelActive: {
    color: colors.royalViolet,
    fontWeight: typography.weights.semibold,
  },
})
```

- [ ] **Step 3: Verify** — Run: `npx tsc --noEmit`. Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/BottomNav.tsx
git commit -m "feat: redesign BottomNav with Astrovy visual language"
```

---

## Task 2: Tabs Layout Fix

**Files:** Modify `app/(tabs)/_layout.tsx`

- [ ] **Step 1: Read current file** — Read `app/(tabs)/_layout.tsx`

- [ ] **Step 2: Rewrite tabs layout with fixed active-screen calculation**

```tsx
// app/(tabs)/_layout.tsx

import React from 'react'
import { Tabs } from 'expo-router'
import BottomNav from '@/src/components/BottomNav'
import { usePathname, useRouter } from 'expo-router'

function CustomBottomTabBar() {
  const pathname = usePathname()
  const router = useRouter()

  // Extract screen name from pathname like "/(tabs)/today" → "today"
  const currentScreen = pathname.split('/').pop() || 'today'

  return (
    <BottomNav
      currentScreen={currentScreen}
      onNavigate={(screen) => {
        router.navigate(`/(tabs)/${screen}`)
      }}
    />
  )
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={() => <CustomBottomTabBar />}
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Tabs.Screen name="today" />
      <Tabs.Screen name="soulprint" />
      <Tabs.Screen name="decode" />
      <Tabs.Screen name="mirror" />
      <Tabs.Screen name="profile" />
    </Tabs>
  )
}
```

Key changes:
- `currentScreen` uses `pathname.split('/').pop()` instead of `pathname.replace('/', '')` — fixes grouped path issue
- Removed unused `tabRoutes` constant

- [ ] **Step 3: Verify** — Run: `npx tsc --noEmit`. Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add app/(tabs)/_layout.tsx
git commit -m "fix: tabs layout active-screen calculation for grouped paths"
```

---

## Task 3: Welcome Screen

**Files:** Modify `app/(onboarding)/welcome.tsx`

- [ ] **Step 1: Read current file** — Read `app/(onboarding)/welcome.tsx`

- [ ] **Step 2: Rewrite welcome screen**

Key changes from spec section 8.5:
- Eyebrow: "Your personal cosmos"
- Title: "Astrovy"
- Description: "Mapped from the moment you arrived."
- Explanatory card: REMOVED entirely
- CTA: "Continue" (not "Begin gently")
- Uses Astrovy design primitives
- Uses `Screen` wrapper

```tsx
// app/(onboarding)/welcome.tsx

import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { Screen } from '@/src/design/primitives/Screen'
import { Button } from '@/src/design/primitives/Button'
import { Eyebrow } from '@/src/design/primitives/Eyebrow'
import { colors, typography, spacing } from '@/src/design/tokens'

export default function WelcomeScreen() {
  const router = useRouter()

  return (
    <Screen>
      <View style={styles.container}>
        <Animated.View entering={FadeInUp.duration(600)} style={styles.content}>
          <Eyebrow>Your personal cosmos</Eyebrow>
          <Text style={styles.title}>Astrovy</Text>
          <Text style={styles.description}>
            Mapped from the moment you arrived.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).duration(500)}>
          <Button fullWidth size="lg" onPress={() => router.push('/(onboarding)/birth-date')}>
            Continue
          </Button>
        </Animated.View>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xxxl,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    ...typography.scale.display,
    fontSize: 64,
    color: colors.deepSpace,
    marginBottom: spacing.md,
  },
  description: {
    ...typography.scale.bodyLarge,
    color: colors.cosmicGray,
  },
})
```

- [ ] **Step 3: Verify** — Run: `npx tsc --noEmit`. Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add app/(onboarding)/welcome.tsx
git commit -m "feat: redesign welcome screen with Astrovy design and copy"
```

---

## Task 4: Birth Date Screen

**Files:** Modify `app/(onboarding)/birth-date.tsx`

- [ ] **Step 1: Read current file** — Read `app/(onboarding)/birth-date.tsx`

- [ ] **Step 2: Rewrite birth date screen**

Key changes:
- Question: "When were you born?" (no step label)
- Uses ProfileContext to persist birth date
- Uses Astrovy design primitives
- Date validation: prevent impossible dates (Feb 31, future dates)
- Continue → birth-time

```tsx
// app/(onboarding)/birth-date.tsx

import React, { useState } from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Screen } from '@/src/design/primitives/Screen'
import { Button } from '@/src/design/primitives/Button'
import { ProgressDots } from '@/src/components/ProgressDots'
import { useProfile } from '@/src/context/ProfileContext'
import { colors, typography, spacing } from '@/src/design/tokens'

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1)
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1)
const YEARS = Array.from({ length: 100 }, (_, i) => 2024 - i)

function isValidDate(day: number, month: number, year: number): boolean {
  const date = new Date(year, month - 1, day)
  const now = new Date()
  return date.getMonth() === month - 1 && date.getDate() === day && date <= now
}

export default function BirthDateScreen() {
  const router = useRouter()
  const { setBirthDate } = useProfile()
  const [day, setDay] = useState(27)
  const [month, setMonth] = useState(1)
  const [year, setYear] = useState(2000)

  const valid = isValidDate(day, month, year)

  const handleContinue = () => {
    if (!valid) return
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    setBirthDate(dateStr)
    router.push('/(onboarding)/birth-time')
  }

  return (
    <Screen>
      <View style={styles.container}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backIcon}>{"<"}</Text>
        </Pressable>
        <ProgressDots current={1} total={6} />
        <Text style={styles.question}>When were you born?</Text>

        <View style={styles.pickers}>
          <ScrollView style={styles.picker}>
            {DAYS.map((d) => (
              <Pressable key={d} onPress={() => setDay(d)} style={[styles.option, day === d && styles.optionActive]}>
                <Text style={[styles.optionText, day === d && styles.optionTextActive]}>{d}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <ScrollView style={styles.picker}>
            {MONTHS.map((m) => (
              <Pressable key={m} onPress={() => setMonth(m)} style={[styles.option, month === m && styles.optionActive]}>
                <Text style={[styles.optionText, month === m && styles.optionTextActive]}>{m}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <ScrollView style={styles.picker}>
            {YEARS.map((y) => (
              <Pressable key={y} onPress={() => setYear(y)} style={[styles.option, year === y && styles.optionActive]}>
                <Text style={[styles.optionText, year === y && styles.optionTextActive]}>{y}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {!valid && <Text style={styles.error}>That date doesn't look right.</Text>}

        <Button fullWidth size="lg" onPress={handleContinue} disabled={!valid}>
          Continue
        </Button>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxxl },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  backIcon: { fontSize: 16, color: colors.deepSpace },
  question: { ...typography.scale.h2, color: colors.deepSpace, marginBottom: spacing.lg },
  pickers: { flex: 1, flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  picker: { flex: 1 },
  option: { paddingVertical: spacing.sm, alignItems: 'center', borderRadius: 12 },
  optionActive: { backgroundColor: colors.royalViolet },
  optionText: { ...typography.scale.body, color: colors.deepSpace },
  optionTextActive: { color: colors.white, fontWeight: typography.weights.semibold },
  error: { ...typography.scale.caption, color: '#F43F5E', marginBottom: spacing.sm, textAlign: 'center' },
})
```

- [ ] **Step 3: Verify** — Run: `npx tsc --noEmit`. Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add app/(onboarding)/birth-date.tsx
git commit -m "feat: redesign birth date screen with ProfileContext and validation"
```

---

## Task 5: Birth Time Screen

**Files:** Modify `app/(onboarding)/birth-time.tsx`

- [ ] **Step 1: Read current file** — Read `app/(onboarding)/birth-time.tsx`

- [ ] **Step 2: Rewrite birth time screen**

Key changes:
- Question: "What time? (Optional)"
- Skip stores `null`, not `23:59`
- Uses ProfileContext
- CTAs: "Continue" / "Skip"

```tsx
// app/(onboarding)/birth-time.tsx

import React, { useState } from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Screen } from '@/src/design/primitives/Screen'
import { Button } from '@/src/design/primitives/Button'
import { ProgressDots } from '@/src/components/ProgressDots'
import { useProfile } from '@/src/context/ProfileContext'
import { colors, typography, spacing } from '@/src/design/tokens'

const HOURS = Array.from({ length: 24 }, (_, i) => i)
const MINUTES = Array.from({ length: 60 }, (_, i) => i)

export default function BirthTimeScreen() {
  const router = useRouter()
  const { setBirthTime } = useProfile()
  const [hour, setHour] = useState<number | null>(null)
  const [minute, setMinute] = useState<number | null>(null)

  const time = (hour !== null && minute !== null)
    ? `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
    : null

  const handleContinue = () => {
    setBirthTime(time)
    router.push('/(onboarding)/location')
  }

  const handleSkip = () => {
    setBirthTime(null)
    router.push('/(onboarding)/location')
  }

  return (
    <Screen>
      <View style={styles.container}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backIcon}>{"<"}</Text>
        </Pressable>
        <ProgressDots current={2} total={6} />
        <Text style={styles.question}>What time?</Text>
        <Text style={styles.optional}>(Optional)</Text>

        <View style={styles.pickers}>
          <ScrollView style={styles.picker}>
            {HOURS.map((h) => (
              <Pressable key={h} onPress={() => setHour(h)} style={[styles.option, hour === h && styles.optionActive]}>
                <Text style={[styles.optionText, hour === h && styles.optionTextActive]}>{String(h).padStart(2, '0')}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <ScrollView style={styles.picker}>
            {MINUTES.map((m) => (
              <Pressable key={m} onPress={() => setMinute(m)} style={[styles.option, minute === m && styles.optionActive]}>
                <Text style={[styles.optionText, minute === m && styles.optionTextActive]}>{String(m).padStart(2, '0')}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.ctaRow}>
          <Button variant="ghost" size="md" onPress={handleSkip}>Skip</Button>
          <Button variant="primary" size="md" onPress={handleContinue} fullWidth>
            Continue
          </Button>
        </View>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxxl },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  backIcon: { fontSize: 16, color: colors.deepSpace },
  question: { ...typography.scale.h2, color: colors.deepSpace },
  optional: { ...typography.scale.body, color: colors.cosmicGray, marginBottom: spacing.lg },
  pickers: { flex: 1, flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  picker: { flex: 1 },
  option: { paddingVertical: spacing.sm, alignItems: 'center', borderRadius: 12 },
  optionActive: { backgroundColor: colors.royalViolet },
  optionText: { ...typography.scale.body, color: colors.deepSpace },
  optionTextActive: { color: colors.white, fontWeight: typography.weights.semibold },
  ctaRow: { gap: spacing.sm },
})
```

- [ ] **Step 3: Verify** — Run: `npx tsc --noEmit`. Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add app/(onboarding)/birth-time.tsx
git commit -m "feat: redesign birth time screen with null-skip and ProfileContext"
```

---

## Task 6: Location Screen

**Files:** Modify `app/(onboarding)/location.tsx`

- [ ] **Step 1: Read current file** — Read `app/(onboarding)/location.tsx`

- [ ] **Step 2: Rewrite location screen**

Key changes:
- Question: "Where were you born?"
- Stores full location data (city, country, timezone, lat, lng)
- Search placeholder: "Search cities..."
- CTA: "Continue"

```tsx
// app/(onboarding)/location.tsx

import React, { useState } from 'react'
import { View, Text, TextInput, ScrollView, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Screen } from '@/src/design/primitives/Screen'
import { Button } from '@/src/design/primitives/Button'
import { ProgressDots } from '@/src/components/ProgressDots'
import { useProfile } from '@/src/context/ProfileContext'
import { colors, typography, spacing, radii } from '@/src/design/tokens'

const CITIES = [
  { city: 'Bandung',     country: 'Indonesia',    timezone: 'Asia/Jakarta',        lat: -6.9175,  lng: 107.6191 },
  { city: 'Jakarta',     country: 'Indonesia',    timezone: 'Asia/Jakarta',        lat: -6.2088,  lng: 106.8456 },
  { city: 'Surabaya',    country: 'Indonesia',    timezone: 'Asia/Jakarta',        lat: -7.2575,  lng: 112.7521 },
  { city: 'Bali',        country: 'Indonesia',    timezone: 'Asia/Makassar',       lat: -8.3405,  lng: 115.0920 },
  { city: 'Yogyakarta',  country: 'Indonesia',    timezone: 'Asia/Jakarta',        lat: -7.7956,  lng: 110.3695 },
  { city: 'New York',    country: 'USA',          timezone: 'America/New_York',    lat: 40.7128,  lng: -74.0060 },
  { city: 'Los Angeles', country: 'USA',          timezone: 'America/Los_Angeles', lat: 34.052,  lng: -118.2437 },
  { city: 'London',      country: 'UK',           timezone: 'Europe/London',       lat: 51.5074,  lng: -0.1278 },
  { city: 'Tokyo',       country: 'Japan',        timezone: 'Asia/Tokyo',          lat: 35.6762,  lng: 139.6503 },
  { city: 'Sydney',      country: 'Australia',    timezone: 'Australia/Sydney',    lat: -33.8688, lng: 151.2093 },
]

export default function LocationScreen() {
  const router = useRouter()
  const { setLocation } = useProfile()
  const [search, setSearch] = useState('')
  const [selectedIdx, setSelectedIdx] = useState<number | null>(0)

  const filtered = CITIES.filter((c) =>
    c.city.toLowerCase().includes(search.toLowerCase())
  )

  const handleContinue = () => {
    if (selectedIdx === null) return
    const city = CITIES[selectedIdx]
    setLocation({
      city: city.city,
      country: city.country,
      timezone: city.timezone,
      lat: city.lat,
      lng: city.lng,
    })
    router.push('/(onboarding)/mbti')
  }

  return (
    <Screen>
      <View style={styles.container}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backIcon}>{"<"}</Text>
        </Pressable>
        <ProgressDots current={3} total={6} />
        <Text style={styles.question}>Where were you born?</Text>

        <TextInput
          style={styles.search}
          placeholder="Search cities..."
          placeholderTextColor={colors.cosmicGray + '80'}
          value={search}
          onChangeText={setSearch}
        />

        <ScrollView style={styles.list}>
          {filtered.map((c) => {
            const originalIdx = CITIES.indexOf(c)
            return (
              <Pressable
                key={`${c.city}-${c.country}`}
                onPress={() => setSelectedIdx(originalIdx)}
                style={[styles.cityItem, selectedIdx === originalIdx && styles.cityItemActive]}
              >
                <Text style={[styles.cityName, selectedIdx === originalIdx && styles.cityNameActive]}>{c.city}</Text>
                <Text style={[styles.cityCountry, selectedIdx === originalIdx && styles.cityCountryActive]}>{c.country}</Text>
              </Pressable>
            )
          })}
        </ScrollView>

        <Button fullWidth size="lg" onPress={handleContinue} disabled={selectedIdx === null}>
          Continue
        </Button>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxxl },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  backIcon: { fontSize: 16, color: colors.deepSpace },
  question: { ...typography.scale.h2, color: colors.deepSpace, marginBottom: spacing.lg },
  search: {
    ...typography.scale.body,
    color: colors.deepSpace,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderWidth: 1,
    borderColor: 'rgba(123,97,255,0.10)',
    marginBottom: spacing.md,
  },
  list: { flex: 1 },
  cityItem: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radii.lg,
    marginBottom: spacing.xs,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(123,97,255,0.06)',
  },
  cityItemActive: {
    backgroundColor: colors.royalViolet,
    borderColor: 'transparent',
  },
  cityName: { ...typography.scale.body, fontWeight: typography.weights.semibold, color: colors.deepSpace },
  cityNameActive: { color: colors.white },
  cityCountry: { ...typography.scale.caption, color: colors.cosmicGray },
  cityCountryActive: { color: colors.pastelLilac },
})
```

- [ ] **Step 3: Verify** — Run: `npx tsc --noEmit`. Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add app/(onboarding)/location.tsx
git commit -m "feat: redesign location screen with full city data and ProfileContext"
```

---

## Task 7: MBTI Screen

**Files:** Modify `app/(onboarding)/mbti.tsx`

- [ ] **Step 1: Read current file** — Read `app/(onboarding)/mbti.tsx`

- [ ] **Step 2: Rewrite MBTI screen**

Key changes:
- Question: "Know your personality type?"
- Skip: stores `null`, just "Skip" (not "Skip and test later")
- Uses ProfileContext

```tsx
// app/(onboarding)/mbti.tsx

import React, { useState } from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Screen } from '@/src/design/primitives/Screen'
import { Button } from '@/src/design/primitives/Button'
import { ProgressDots } from '@/src/components/ProgressDots'
import { useProfile } from '@/src/context/ProfileContext'
import { colors, typography, spacing, radii } from '@/src/design/tokens'

const MBTI_TYPES = ['INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP','ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP']

export default function MbtiScreen() {
  const router = useRouter()
  const { setMbti } = useProfile()
  const [selected, setSelected] = useState<string | null>(null)

  const handleContinue = () => {
    setMbti(selected)
    router.push('/(onboarding)/focus-mood')
  }

  const handleSkip = () => {
    setMbti(null)
    router.push('/(onboarding)/focus-mood')
  }

  return (
    <Screen>
      <View style={styles.container}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backIcon}>{"<"}</Text>
        </Pressable>
        <ProgressDots current={4} total={6} />
        <Text style={styles.question}>Know your personality type?</Text>

        <ScrollView style={styles.list}>
          <View style={styles.grid}>
            {MBTI_TYPES.map((type) => (
              <Pressable
                key={type}
                onPress={() => setSelected(type)}
                style={[styles.typeChip, selected === type && styles.typeChipActive]}
              >
                <Text style={[styles.typeText, selected === type && styles.typeTextActive]}>{type}</Text>
              </Pressable>
            ))}
            <Pressable
              onPress={() => setSelected('unsure')}
              style={[styles.typeChip, selected === 'unsure' && styles.typeChipActive, { flexBasis: '100%' }]}
            >
              <Text style={[styles.typeText, selected === 'unsure' && styles.typeTextActive]}>I'm not sure</Text>
            </Pressable>
          </View>
        </ScrollView>

        <View style={styles.ctaRow}>
          <Button variant="ghost" size="md" onPress={handleSkip}>Skip</Button>
          <Button variant="primary" size="md" onPress={handleContinue} fullWidth disabled={!selected}>
            Continue
          </Button>
        </View>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxxl },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  backIcon: { fontSize: 16, color: colors.deepSpace },
  question: { ...typography.scale.h2, color: colors.deepSpace, marginBottom: spacing.lg },
  list: { flex: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  typeChip: {
    flexBasis: '30%',
    flexGrow: 1,
    paddingVertical: spacing.md,
    borderRadius: radii.lg,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(123,97,255,0.10)',
    alignItems: 'center',
  },
  typeChipActive: { backgroundColor: colors.royalViolet, borderColor: 'transparent' },
  typeText: { ...typography.scale.body, fontWeight: typography.weights.semibold, color: colors.deepSpace },
  typeTextActive: { color: colors.white },
  ctaRow: { gap: spacing.sm },
})
```

- [ ] **Step 3: Verify** — Run: `npx tsc --noEmit`. Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add app/(onboarding)/mbti.tsx
git commit -m "feat: redesign MBTI screen with ProfileContext and simplified skip"
```

---

## Task 8: Focus/Mood Screen

**Files:** Modify `app/(onboarding)/focus-mood.tsx`

- [ ] **Step 1: Read current file** — Read `app/(onboarding)/focus-mood.tsx`

- [ ] **Step 2: Rewrite focus screen**

Key changes:
- Question: "What feels most alive right now?"
- CTA: "Continue" (not "Create My Soulprint")
- Uses ProfileContext

```tsx
// app/(onboarding)/focus-mood.tsx

import React, { useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Screen } from '@/src/design/primitives/Screen'
import { Button } from '@/src/design/primitives/Button'
import { ProgressDots } from '@/src/components/ProgressDots'
import { useProfile } from '@/src/context/ProfileContext'
import { colors, typography, spacing, radii } from '@/src/design/tokens'

const FOCUS_OPTIONS = [
  { id: 'love', label: 'Love' },
  { id: 'lost', label: 'Feeling lost' },
  { id: 'self-worth', label: 'Self-worth' },
  { id: 'career', label: 'Career' },
  { id: 'healing', label: 'Healing' },
  { id: 'purpose', label: 'Purpose' },
]

export default function FocusMoodScreen() {
  const router = useRouter()
  const { setFocus } = useProfile()
  const [focus, setLocalFocus] = useState<string | null>(null)

  const handleContinue = () => {
    if (!focus) return
    setFocus(focus)
    router.push('/(onboarding)/generating')
  }

  return (
    <Screen>
      <View style={styles.container}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backIcon}>{"<"}</Text>
        </Pressable>
        <ProgressDots current={5} total={6} />
        <Text style={styles.question}>What feels most alive right now?</Text>

        <View style={styles.options}>
          {FOCUS_OPTIONS.map((opt) => (
            <Pressable
              key={opt.id}
              onPress={() => setLocalFocus(opt.id)}
              style={[styles.option, focus === opt.id && styles.optionActive]}
            >
              <Text style={[styles.optionText, focus === opt.id && styles.optionTextActive]}>{opt.label}</Text>
            </Pressable>
          ))}
        </View>

        <Button fullWidth size="lg" onPress={handleContinue} disabled={!focus}>
          Continue
        </Button>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxxl },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  backIcon: { fontSize: 16, color: colors.deepSpace },
  question: { ...typography.scale.h2, color: colors.deepSpace, marginBottom: spacing.lg },
  options: { flex: 1, gap: spacing.sm },
  option: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.lg,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(123,97,255,0.10)',
  },
  optionActive: { backgroundColor: colors.royalViolet, borderColor: 'transparent' },
  optionText: { ...typography.scale.bodyLarge, color: colors.deepSpace },
  optionTextActive: { color: colors.white, fontWeight: typography.weights.semibold },
})
```

- [ ] **Step 3: Verify** — Run: `npx tsc --noEmit`. Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add app/(onboarding)/focus-mood.tsx
git commit -m "feat: redesign focus screen with ProfileContext"
```

---

## Task 9: Generating Screen

**Files:** Modify `app/(onboarding)/generating.tsx`

- [ ] **Step 1: Read current file** — Read `app/(onboarding)/generating.tsx`

- [ ] **Step 2: Rewrite generating screen**

Key changes:
- Stage labels: "Reading your chart..." → "Mapping your patterns..." → "Finding your archetype..." → "Almost there..."
- CTA: "See what the stars say"
- Timer cleanup on unmount
- Dark screen with StarField

```tsx
// app/(onboarding)/generating.tsx

import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import { Screen } from '@/src/design/primitives/Screen'
import { Button } from '@/src/design/primitives/Button'
import { StarField } from '@/src/design/primitives/StarField'
import { colors, typography, spacing } from '@/src/design/tokens'

const STAGES = [
  { delay: 0, text: 'Reading your chart...' },
  { delay: 800, text: 'Mapping your patterns...' },
  { delay: 1600, text: 'Finding your archetype...' },
  { delay: 2400, text: 'Almost there...' },
]

export default function GeneratingScreen() {
  const router = useRouter()
  const [stage, setStage] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    STAGES.forEach((s, i) => {
      timers.push(setTimeout(() => setStage(i), s.delay))
    })
    timers.push(setTimeout(() => setDone(true), 3200))
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <Screen dark>
      <StarField />
      <View style={styles.container}>
        <View style={styles.stageArea}>
          {STAGES.map((s, i) => (
            stage >= i && (
              <Animated.View key={i} entering={FadeIn.duration(400)} exiting={FadeOut.duration(200)}>
                <Text style={[styles.stageText, i === stage ? styles.stageActive : styles.stageInactive]}>
                  {s.text}
                </Text>
              </Animated.View>
            )
          ))}
        </View>

        {done && (
          <Animated.View entering={FadeIn.duration(400)}>
            <Button fullWidth size="lg" onPress={() => router.push('/(onboarding)/first-mirror')}>
              See what the stars say
            </Button>
          </Animated.View>
        )}
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: spacing.xxxl, paddingBottom: spacing.xxxl },
  stageArea: { flex: 1, justifyContent: 'center', gap: spacing.md },
  stageText: { ...typography.scale.h3, textAlign: 'center' },
  stageActive: { color: colors.white },
  stageInactive: { color: colors.softLavender, opacity: 0.4 },
})
```

- [ ] **Step 3: Verify** — Run: `npx tsc --noEmit`. Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add app/(onboarding)/generating.tsx
git commit -m "feat: redesign generating screen with timer cleanup and Astrovy dark theme"
```

---

## Task 10: First Mirror Screen

**Files:** Modify `app/(onboarding)/first-mirror.tsx`

- [ ] **Step 1: Read current file** — Read `app/(onboarding)/first-mirror.tsx`

- [ ] **Step 2: Rewrite first mirror screen**

Key changes:
- Dynamic name from ProfileContext
- Dynamic archetype from astrology engine
- Dynamic zodiac + life path badges
- Feedback: "Does this feel right?" / "Yes, that's me" / "Somewhat" / "Not quite"
- CTA: "Continue" (not "Continue to Today")
- Uses `router.replace()` to prevent back-stack into onboarding
- Calls `finalizeProfile()` on continue

```tsx
// app/(onboarding)/first-mirror.tsx

import React, { useState, useMemo } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Screen } from '@/src/design/primitives/Screen'
import { Button } from '@/src/design/primitives/Button'
import { Card } from '@/src/design/primitives/Card'
import { Badge } from '@/src/design/primitives/Badge'
import { Eyebrow } from '@/src/design/primitives/Eyebrow'
import { useProfile } from '@/src/context/ProfileContext'
import { calculateNatalChart, deriveArchetype, calculateLifePath, getZodiacInfo, getZodiacSign } from '@/src/lib/astrology'
import { colors, typography, spacing, radii } from '@/src/design/tokens'

const FEEDBACK_OPTIONS = [
  { id: 'accurate', label: "Yes, that's me" },
  { id: 'partial', label: 'Somewhat' },
  { id: 'inaccurate', label: 'Not quite' },
] as const

export default function FirstMirrorScreen() {
  const router = useRouter()
  const { profile, setFirstMirrorFeedback, finalizeProfile } = useProfile()
  const [feedback, setFeedback] = useState<string | null>(null)

  const { archetype, zodiacInfo, lifePath } = useMemo(() => {
    if (!profile?.birth?.date) {
      return { archetype: null, zodiacInfo: null, lifePath: null }
    }
    const [year, month, day] = profile.birth.date.split('-').map(Number)
    const sign = getZodiacSign(month, day)
    const lp = calculateLifePath(year, month, day)
    const natal = calculateNatalChart({
      date: profile.birth.date,
      time: profile.birth.time,
      location: {
        city: profile.birth.location.city,
        lat: profile.birth.location.lat || 0,
        lng: profile.birth.location.lng || 0,
        timezone: profile.birth.location.timezone,
      },
    })
    const arch = deriveArchetype(sign, lp, profile.focus || 'purpose')
    return { archetype: arch, zodiacInfo: getZodiacInfo(sign), lifePath: lp }
  }, [profile])

  if (!archetype || !zodiacInfo || !lifePath) {
    return (
      <Screen>
        <View style={styles.container}>
          <Text style={styles.error}>Chart unavailable</Text>
        </View>
      </Screen>
    )
  }

  const handleContinue = () => {
    if (feedback) {
      setFirstMirrorFeedback(feedback as 'accurate' | 'partial' | 'inaccurate')
    }
    finalizeProfile()
    router.replace('/(tabs)/today')
  }

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.greeting}>Hi, {profile?.name || 'friend'}</Text>

        <Card variant="gradient" padding="lg" style={styles.archetypeCard}>
          <Eyebrow color={colors.white}>Your archetype</Eyebrow>
          <Text style={styles.archetypeName}>{archetype.name}</Text>
          <Text style={styles.archetypeTagline}>{archetype.tagline}</Text>
        </Card>

        <View style={styles.badges}>
          <Badge variant="astrology">{zodiacInfo.name} Sun</Badge>
          <Badge variant="premium">Life Path {lifePath}</Badge>
          <Badge variant="free">{profile?.focus}</Badge>
        </View>

        <Text style={styles.patternsTitle}>Your patterns</Text>
        {archetype.patterns.map((pattern, i) => (
          <Card key={i} variant="soft" padding="md" style={styles.patternCard}>
            <Text style={styles.patternName}>{pattern}</Text>
          </Card>
        ))}

        <Text style={styles.feedbackQuestion}>Does this feel right?</Text>
        <View style={styles.feedbackRow}>
          {FEEDBACK_OPTIONS.map((opt) => (
            <Pressable
              key={opt.id}
              onPress={() => setFeedback(opt.id)}
              style={[styles.feedbackBtn, feedback === opt.id && styles.feedbackBtnActive]}
            >
              <Text style={[styles.feedbackText, feedback === opt.id && styles.feedbackTextActive]}>{opt.label}</Text>
            </Pressable>
          ))}
        </View>

        <Button fullWidth size="lg" onPress={handleContinue}>
          Continue
        </Button>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxxl },
  greeting: { ...typography.scale.h1, color: colors.deepSpace, marginBottom: spacing.lg },
  archetypeCard: { marginBottom: spacing.lg },
  archetypeName: { ...typography.scale.h2, color: colors.white, marginBottom: spacing.xs },
  archetypeTagline: { ...typography.scale.body, color: colors.pastelLilac },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  patternsTitle: { ...typography.scale.h3, color: colors.deepSpace, marginBottom: spacing.md },
  patternCard: { marginBottom: spacing.xs },
  patternName: { ...typography.scale.body, color: colors.deepSpace, fontWeight: typography.weights.medium },
  feedbackQuestion: { ...typography.scale.h3, color: colors.deepSpace, marginTop: spacing.lg, marginBottom: spacing.md },
  feedbackRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  feedbackBtn: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    borderRadius: radii.full,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(123,97,255,0.10)',
    alignItems: 'center',
  },
  feedbackBtnActive: { backgroundColor: colors.royalViolet, borderColor: 'transparent' },
  feedbackText: { ...typography.scale.caption, color: colors.deepSpace },
  feedbackTextActive: { color: colors.white, fontWeight: typography.weights.semibold },
  error: { ...typography.scale.body, color: colors.cosmicGray, textAlign: 'center', marginTop: spacing.xxxl },
})
```

- [ ] **Step 3: Verify** — Run: `npx tsc --noEmit`. Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add app/(onboarding)/first-mirror.tsx
git commit -m "feat: redesign first mirror screen with dynamic archetype from astrology engine"
```

---

## Tasks 11-16: Tab Screens

Each tab screen follows the same pattern: `Screen` wrapper, ProfileContext for identity, astrology engine for calculations, Astrovy design primitives, new copy.

### Task 11: Today Screen

**Files:** Modify `app/(tabs)/today.tsx`

Key changes from spec section 8.2-8.3:
- 7 sections (down from 14): header, mood, daily reading (merged), journal, pattern alert, weekly reading, quick explore
- Removed: mock energy cards, week section, VisualStreakTracker, Soulprint link, last reflection, avatar
- Mood labels: Steady/Tender/Restless/Quiet
- Daily reading merges signal + insight + move into one card
- Uses ProfileContext for name + astrology for personalization line
- Uses useEngagement for mood/journal/streak/tarot status

- [ ] **Step 1: Read current file** — Read `app/(tabs)/today.tsx`

- [ ] **Step 2: Rewrite Today screen**

```tsx
// app/(tabs)/today.tsx

import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { Screen } from '@/src/design/primitives/Screen'
import { Card } from '@/src/design/primitives/Card'
import { Chip } from '@/src/design/primitives/Chip'
import { Button } from '@/src/design/primitives/Button'
import { Eyebrow } from '@/src/design/primitives/Eyebrow'
import { Divider } from '@/src/design/primitives/Divider'
import { Input } from '@/src/design/primitives/Input'
import { useEngagement } from '@/src/hooks/useEngagement'
import { useTier } from '@/src/context/TierContext'
import { useProfile } from '@/src/context/ProfileContext'
import { calculateLifePath, getZodiacSign, getZodiacInfo } from '@/src/lib/astrology'
import { getTodaySignal, getTodayInsight, getTodayMove, getWeeklyReading } from '@/src/lib/dailyContent'
import PatternAlertCard from '@/src/components/PatternAlertCard'
import WeeklyReadingCard from '@/src/components/WeeklyReadingCard'
import { colors, typography, spacing, radii } from '@/src/design/tokens'

const MOODS = [
  { emoji: '\uD83D\uDC9B', label: 'Steady' },
  { emoji: '\uD83C\uDF0A', label: 'Tender' },
  { emoji: '\u26A1', label: 'Restless' },
  { emoji: '\uD83E\uDDCA', label: 'Quiet' },
]

const MOOD_RESPONSES: Record<string, string> = {
  Steady: 'Grounded today. Trust what\u2019s working.',
  Tender: 'Feelings close to the surface. That\u2019s information, not a flaw.',
  Restless: 'Something wants your attention. Sit with the question.',
  Quiet: 'Quiet is still a signal. Your body may need rest, not distraction.',
}

const JOURNAL_PROMPTS = [
  'What do I need but avoid asking for?',
  'What pattern keeps showing up that I keep ignoring?',
  'If I were honest with myself right now, what would I say?',
  'What am I performing today that I don\u2019t actually want to do?',
  'What would I do differently if I wasn\u2019t afraid of being seen?',
  'What emotion have I been sitting on all week?',
  'What would the person I\u2019m becoming do right now?',
]

function getGreeting() {
  const h = new Date().getHours()
  if (h < 6) return 'Still awake?'
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  if (h < 21) return 'Good evening'
  return 'Still awake?'
}

function getDayIndex() {
  return (new Date().getDate() + new Date().getMonth()) % 7
}

export default function TodayScreen() {
  const router = useRouter()
  const engagement = useEngagement()
  const { isPremium } = useTier()
  const { profile } = useProfile()
  const dayIdx = getDayIndex()

  const [selectedMood, setSelectedMood] = useState<string | null>(
    engagement?.moodHistory?.[0]?.mood || null
  )
  const [expandedJournal, setExpandedJournal] = useState(false)
  const [journalText, setJournalText] = useState('')
  const [journalSaved, setJournalSaved] = useState(false)

  useEffect(() => {
    if (engagement) engagement.checkInToday()
  }, [])

  const signal = getTodaySignal()
  const insight = getTodayInsight()
  const move = getTodayMove()
  const prompt = JOURNAL_PROMPTS[dayIdx]
  const streak = engagement?.streak || 0

  const personalization = useMemo(() => {
    if (!profile?.birth?.date) return ''
    const [y, m, d] = profile.birth.date.split('-').map(Number)
    const sign = getZodiacSign(m, d)
    const lp = calculateLifePath(y, m, d)
    const zi = getZodiacInfo(sign)
    return `\u2014 for ${zi.name} Sun, Life Path ${lp}`
  }, [profile])

  const consecutiveMood = engagement?.getConsecutiveMood?.() || null
  const weeklyStatus = engagement?.getWeeklyReadingStatus?.()
  const showWeeklyCard = weeklyStatus?.isNewWeek && !engagement?.dismissedWeeklyReading

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood)
    engagement?.addMood(mood)
  }

  const handleSaveJournal = () => {
    if (journalText.trim() && engagement) {
      engagement.addJournalEntry(journalText, prompt)
      setJournalSaved(true)
    }
  }

  return (
    <Screen>
      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Header */}
        <Animated.View entering={FadeInUp.duration(500)}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.name}>{profile?.name || 'Friend'}</Text>
            </View>
            {streak > 0 && (
              <View style={styles.streakBadge}>
                <Text style={styles.streakEmoji}>{"\uD83D\uDD25"}</Text>
                <Text style={styles.streakNum}>{streak}</Text>
              </View>
            )}
          </View>
        </Animated.View>

        {/* 2. Mood check-in */}
        <Animated.View entering={FadeInUp.duration(500).delay(50)}>
          <Text style={styles.moodQuestion}>How's today feeling?</Text>
        </Animated.View>
        <View style={styles.moodRow}>
          {MOODS.map((mood, i) => (
            <Animated.View key={mood.label} entering={FadeInUp.duration(500).delay(100 + i * 60)} style={{ flex: 1 }}>
              <Chip
                label={mood.label}
                emoji={mood.emoji}
                selected={selectedMood === mood.label}
                onPress={() => handleMoodSelect(mood.label)}
              />
            </Animated.View>
          ))}
        </View>
        {selectedMood && MOOD_RESPONSES[selectedMood] && (
          <Animated.View entering={FadeInUp.duration(400)}>
            <Text style={styles.moodResponse}>{MOOD_RESPONSES[selectedMood]}</Text>
          </Animated.View>
        )}

        {/* 3. Daily reading (merged card) */}
        <Animated.View entering={FadeInUp.duration(500).delay(200)}>
          <Card variant="gradient" padding="lg" style={styles.dailyCard}>
            <Eyebrow color={colors.white}>Today</Eyebrow>
            <Text style={styles.signalTitle}>{signal.title}</Text>
            <Text style={styles.signalSub}>{signal.sub}</Text>
            <Divider marginVertical="md" />
            <Text style={styles.insightText}>"{insight}"</Text>
            <Divider marginVertical="md" />
            <Text style={styles.moveLabel}>Try this</Text>
            <Text style={styles.moveText}>{move}</Text>
            {personalization ? <Text style={styles.personalization}>{personalization}</Text> : null}
          </Card>
        </Animated.View>

        {/* 4. Journal */}
        <Animated.View entering={FadeInUp.duration(500).delay(250)}>
          {expandedJournal ? (
            <Card variant="light" padding="lg">
              <Text style={styles.journalPrompt}>{prompt}</Text>
              {journalSaved ? (
                <View style={styles.journalSaved}>
                  <Text style={styles.journalSavedTitle}>{"\u2713"} Saved</Text>
                  <Text style={styles.journalSavedSub}>Kept safe, just for you.</Text>
                </View>
              ) : (
                <>
                  <Input
                    value={journalText}
                    onChangeText={setJournalText}
                    placeholder="Write freely..."
                    multiline
                  />
                  <View style={styles.journalFooter}>
                    <Text style={styles.journalHint}>Kept only for you</Text>
                    <Button size="sm" onPress={handleSaveJournal} disabled={!journalText.trim()}>
                      Save
                    </Button>
                  </View>
                </>
              )}
            </Card>
          ) : (
            <Card variant="light" padding="lg" onPress={() => setExpandedJournal(true)}>
              <Eyebrow>Reflect</Eyebrow>
              <Text style={styles.journalPreview}>{prompt}</Text>
            </Card>
          )}
        </Animated.View>

        {/* 5. Pattern alert (conditional) */}
        {consecutiveMood && (
          <Animated.View entering={FadeInUp.duration(400)}>
            <PatternAlertCard mood={consecutiveMood} />
          </Animated.View>
        )}

        {/* 6. Weekly reading (conditional) */}
        {showWeeklyCard && (
          <Animated.View entering={FadeInUp.duration(400)}>
            <WeeklyReadingCard
              visible={true}
              onDismiss={() => engagement?.dismissWeeklyReading?.()}
            />
          </Animated.View>
        )}

        {/* 7. Quick explore */}
        <Animated.View entering={FadeInUp.duration(500).delay(300)}>
          <Eyebrow>Explore</Eyebrow>
          <View style={styles.exploreRow}>
            <Card variant="soft" padding="md" style={styles.exploreCard} onPress={() => router.push('/tarot')}>
              <Text style={styles.exploreTitle}>Tarot</Text>
              <Text style={styles.exploreSub}>
                {engagement?.canDrawTarot?.(isPremium)
                  ? isPremium
                    ? `${engagement?.getTarotDrawsRemaining?.(isPremium)} draws left`
                    : 'Your card is waiting'
                  : 'Return tomorrow'}
              </Text>
            </Card>
            <Card variant="soft" padding="md" style={styles.exploreCard} onPress={() => router.push('/horoscope')}>
              <Text style={styles.exploreTitle}>Horoscope</Text>
              <Text style={styles.exploreSub}>Today's reading</Text>
            </Card>
          </View>
        </Animated.View>
      </Animated.ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xxl, paddingBottom: 130 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  greeting: { ...typography.scale.caption, color: colors.cosmicGray },
  name: { ...typography.scale.h1, color: colors.deepSpace },
  streakBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16, backgroundColor: 'rgba(123,97,255,0.12)' },
  streakEmoji: { fontSize: 12 },
  streakNum: { ...typography.scale.caption, fontWeight: typography.weights.bold, color: colors.royalViolet },
  moodQuestion: { ...typography.scale.body, fontWeight: typography.weights.medium, color: colors.deepSpace, marginBottom: spacing.sm },
  moodRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  moodResponse: { ...typography.scale.caption, color: colors.deepSpace, backgroundColor: 'rgba(123,97,255,0.08)', borderRadius: radii.lg, padding: spacing.md, marginBottom: spacing.md },
  dailyCard: { marginBottom: spacing.md },
  signalTitle: { ...typography.scale.h3, color: colors.white, marginTop: spacing.sm, marginBottom: spacing.xs },
  signalSub: { ...typography.scale.body, color: colors.pastelLilac },
  insightText: { ...typography.scale.body, color: colors.white, fontStyle: 'italic' },
  moveLabel: { ...typography.scale.caption, fontWeight: typography.weights.semibold, color: colors.pastelLilac, marginBottom: 4 },
  moveText: { ...typography.scale.body, color: colors.white },
  personalization: { ...typography.scale.caption, color: colors.pastelLilac, opacity: 0.7, marginTop: spacing.sm },
  journalPrompt: { ...typography.scale.body, color: colors.deepSpace, marginBottom: spacing.sm, fontWeight: typography.weights.medium },
  journalPreview: { ...typography.scale.body, color: colors.cosmicGray },
  journalSaved: { paddingVertical: spacing.lg, alignItems: 'center' },
  journalSavedTitle: { ...typography.scale.h3, color: colors.deepSpace, marginBottom: 4 },
  journalSavedSub: { ...typography.scale.caption, color: colors.cosmicGray },
  journalFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm },
  journalHint: { ...typography.scale.caption, color: colors.cosmicGray },
  exploreRow: { flexDirection: 'row', gap: spacing.sm },
  exploreCard: { flex: 1 },
  exploreTitle: { ...typography.scale.body, fontWeight: typography.weights.semibold, color: colors.deepSpace, marginBottom: 4 },
  exploreSub: { ...typography.scale.caption, color: colors.cosmicGray },
})
```

- [ ] **Step 3: Verify** — Run: `npx tsc --noEmit`. Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add app/(tabs)/today.tsx
git commit -m "feat: redesign Today screen with 7-section structure and Astrovy design"
```

---

### Task 12: Astro (Soulprint) Screen

**Files:** Modify `app/(tabs)/soulprint.tsx`

Key changes:
- Header: "Your Astro"
- Dynamic archetype, chart, patterns from ProfileContext + astrology engine
- Sections: "Your chart", "Your patterns", "Your strengths", "Growth areas"
- CTA: "Unlock full reading" / "Save snapshot"

- [ ] **Step 1: Read current file** — Read `app/(tabs)/soulprint.tsx`

- [ ] **Step 2: Rewrite with dynamic data from ProfileContext + astrology engine**

The screen should:
- Read profile from ProfileContext
- Calculate natal chart, archetype, zodiac, life path using astrology engine
- Display expandable sections with real data
- Use Astrovy Card/Badge/Button/Eyebrow primitives
- Gate premium content with TierContext
- CTAs: "Unlock full reading" → /pricing, "Save snapshot" → /snapshot

- [ ] **Step 3: Verify** — Run: `npx tsc --noEmit`. Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add app/(tabs)/soulprint.tsx
git commit -m "feat: redesign Astro screen with dynamic natal chart and archetype"
```

---

### Task 13: Decode Screen

**Files:** Modify `app/(tabs)/decode.tsx`

Key changes:
- Header: "Readings" (no description, no avatar)
- Items: "Full Chart" / "Love" / "Compatibility" / "Palm Reading" (Soon badge)
- No "Open →" on cards
- Upgrade: "Unlock all readings"
- Tier badge: "Premium" / "Free"

- [ ] **Step 1: Read current file** — Read `app/(tabs)/decode.tsx`

- [ ] **Step 2: Rewrite with Astrovy design and new copy**

- [ ] **Step 3: Verify** — Run: `npx tsc --noEmit`. Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add app/(tabs)/decode.tsx
git commit -m "feat: redesign Decode screen with Astrovy design and new copy"
```

---

### Task 14: Mirror Screen

**Files:** Modify `app/(tabs)/mirror.tsx`

Key changes:
- Header: "Your Mirror"
- Description: "Your patterns, over time."
- Labels: "Streak", "Moods", "Reflections", "Recent moods", "Most common", "Latest reflection"
- Empty states for fresh users (spec section 9.1)
- CTA: "Unlock your full reflection"

- [ ] **Step 1: Read current file** — Read `app/(tabs)/mirror.tsx`

- [ ] **Step 2: Rewrite with Astrovy design, empty states, and new copy**

- [ ] **Step 3: Verify** — Run: `npx tsc --noEmit`. Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add app/(tabs)/mirror.tsx
git commit -m "feat: redesign Mirror screen with empty states and Astrovy design"
```

---

### Task 15: Profile Screen

**Files:** Modify `app/(tabs)/profile.tsx`

Key changes:
- Dynamic identity from ProfileContext
- Tier toggle labeled "Premium (demo)"
- Removed: Daily Signal, Deep Tone, Privacy, About rows
- Kept: Subscription → /pricing, Delete account
- Delete confirm: "Delete all data? This cannot be undone." / "Delete" / "Cancel"
- Delete calls `clearAllData()` which clears everything via `clearAllAppData()`

- [ ] **Step 1: Read current file** — Read `app/(tabs)/profile.tsx`

- [ ] **Step 2: Rewrite with dynamic identity and cleaned-up settings**

- [ ] **Step 3: Verify** — Run: `npx tsc --noEmit`. Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add app/(tabs)/profile.tsx
git commit -m "feat: redesign Profile screen with dynamic identity and cleaned settings"
```

---

### Task 16: PatternAlertCard + WeeklyReadingCard Updates

**Files:** Modify `src/components/PatternAlertCard.tsx`, `src/components/WeeklyReadingCard.tsx`

- [ ] **Step 1: Read both files**

- [ ] **Step 2: Update PatternAlertCard**

Key changes:
- Eyebrow: "Pattern" (not "Pattern emerging")
- Icon: ✦ (not 🌊)
- Uses Astrovy design primitives

- [ ] **Step 3: Update WeeklyReadingCard**

Key changes:
- Eyebrow: "This week" (not "This week's reflection")
- Dismiss: "Got it" (not "Acknowledge →")
- Uses Astrovy Card primitive

- [ ] **Step 4: Verify** — Run: `npx tsc --noEmit`. Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/PatternAlertCard.tsx src/components/WeeklyReadingCard.tsx
git commit -m "feat: update PatternAlertCard and WeeklyReadingCard with Astrovy design"
```

---

## Tasks 17-22: Secondary Screens

### Task 17: Tarot Screen

**Files:** Modify `app/tarot.tsx`

Key changes:
- Header: "Tarot"
- Description: "Your card for today." (free) / "Your three-card spread." (premium)
- Draw: "Draw" / "Draw again" / "Reveal"
- Share: "Share" → /share-tarot
- Upgrade: "Unlock your three-card spread"
- Limit: "Return tomorrow"
- Dynamic archetype from ProfileContext
- Uses captureAndShare for sharing

- [ ] **Step 1: Read current file** — Read `app/tarot.tsx`

- [ ] **Step 2: Rewrite with Astrovy design, dynamic archetype, new copy**

- [ ] **Step 3: Verify** — Run: `npx tsc --noEmit`. Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add app/tarot.tsx
git commit -m "feat: redesign Tarot screen with dynamic archetype and Astrovy design"
```

---

### Task 18: Horoscope Screen

**Files:** Modify `app/horoscope.tsx`

Key changes:
- Header: "Horoscope"
- Uses `generateDailyHoroscope(natal)` from astrology engine (replaces hardcoded content)
- Categories: Overview / Love / Career / Growth
- Moon phase display
- Natal chart label: "Your chart"
- Back: ← icon only

- [ ] **Step 1: Read current file** — Read `app/horoscope.tsx`

- [ ] **Step 2: Rewrite with real horoscope generation from natal chart**

- [ ] **Step 3: Verify** — Run: `npx tsc --noEmit`. Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add app/horoscope.tsx
git commit -m "feat: redesign Horoscope screen with real natal-based generation"
```

---

### Task 19: Love + Compatibility Screens

**Files:** Modify `app/love.tsx`, `app/compatibility.tsx`

#### Love:
- Header: "Love"
- Description: "How you love and why."
- Feedback: "Does this resonate?" / "Yes" / "Somewhat" / "Not quite"
- Dynamic content from natal Venus sign

#### Compatibility:
- Header: "Compatibility"
- Description: "How your signs meet."
- Partner name: "Their name (optional)"
- Sign selector: "Their sign"
- Uses `calculateCompatibility()` from astrology engine
- Reveal CTA: "Reveal"

- [ ] **Step 1: Read both files**

- [ ] **Step 2: Rewrite both with Astrovy design, real calculations, new copy**

- [ ] **Step 3: Verify** — Run: `npx tsc --noEmit`. Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add app/love.tsx app/compatibility.tsx
git commit -m "feat: redesign Love and Compatibility screens with real calculations"
```

---

### Task 20: Snapshot + Share Card + Share Tarot Screens

**Files:** Modify `app/snapshot.tsx`, `app/share-card.tsx`, `app/share-tarot.tsx`

Key changes:
- All use "Share" header and "Share" CTA
- Share CTA calls `captureAndShare()` from `src/lib/share.ts`
- Snapshot: "Done" CTA → /(tabs)/today
- Back: ← icon only
- Create `ShareCardView` component for composable shareable card

- [ ] **Step 1: Read all three files**

- [ ] **Step 2: Create ShareCardView component**

Create `src/components/ShareCardView.tsx` — a ref-able view that can be captured for sharing. Contains the visual composition for any share type (tarot card, archetype, snapshot).

- [ ] **Step 3: Rewrite all three screens with share integration**

- [ ] **Step 4: Verify** — Run: `npx tsc --noEmit`. Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add app/snapshot.tsx app/share-card.tsx app/share-tarot.tsx src/components/ShareCardView.tsx
git commit -m "feat: redesign share screens with native share integration"
```

---

### Task 21: Pricing Screen

**Files:** Modify `app/pricing.tsx`

Key changes:
- Header: "Astrovy Premium" (not "Go deeper")
- Subtitle: "Every reading, every week, every sign — yours."
- Plans: "Monthly" / "Annual"
- Save badge: "Save $36" (not "Save!")
- Annual note: "$72/year"
- Features: "Full natal chart" / "Weekly personalized readings" / "Compatibility with any sign" / "Three-card daily tarot" / "Unlimited journal history"
- Primary CTA: "Start Premium" → calls `upgrade()` from TierContext
- Secondary: "Maybe later" → router.back()
- Back: ← icon only

- [ ] **Step 1: Read current file** — Read `app/pricing.tsx`

- [ ] **Step 2: Rewrite with Astrovy design, working CTA, new copy**

- [ ] **Step 3: Verify** — Run: `npx tsc --noEmit`. Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add app/pricing.tsx
git commit -m "feat: redesign Pricing screen with working upgrade CTA"
```

---

### Task 22: Delete Old Theme + Final Cleanup

**Files:** Delete `src/lib/theme.ts`

- [ ] **Step 1: Verify no files still import from `@/src/lib/theme`**

Run: `grep -r "lib/theme" app/ src/ || echo "NO_IMPORTS"`

If any files still import from theme.ts, update them to use `@/src/design/tokens` first.

- [ ] **Step 2: Delete old theme file**

```bash
rm src/lib/theme.ts
```

- [ ] **Step 3: Verify** — Run: `npx tsc --noEmit`. Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove old theme.ts, fully migrated to Astrovy design tokens"
```

---

## Task 23: Full Typecheck + Run Verification

- [ ] **Step 1: Run full typecheck**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 2: Test app startup**

Run: `npx expo start`
Verify:
- App loads without crash
- First launch → onboarding welcome
- Complete onboarding → Today tab
- Kill app, relaunch → goes directly to Today (not onboarding)
- Profile shows real name/zodiac/life path (not hardcoded)
- Tarot draw works
- Horoscope shows real sign-based content
- Pricing "Start Premium" toggles premium state
- Delete account clears data and returns to onboarding

- [ ] **Step 3: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve screen revamp typecheck and runtime issues"
```

---

## Summary

This plan redesigns all 21 screens:

1. **BottomNav + Tabs layout** (Tasks 1-2): Fixed navigation, Astrovy-styled nav bar
2. **Onboarding** (Tasks 3-10): 8 screens with ProfileContext persistence, dynamic first-mirror
3. **Tab screens** (Tasks 11-16): Today (7-section), Astro, Decode, Mirror, Profile, component updates
4. **Secondary screens** (Tasks 17-21): Tarot, Horoscope, Love, Compatibility, Snapshot, Share, Pricing
5. **Cleanup** (Tasks 22-23): Remove old theme, full verification

All screens consume the foundation built in Plan 1:
- Design tokens and primitives from `src/design/`
- ProfileContext for identity and onboarding data
- TierContext for premium state
- useEngagement for moods, journal, streaks, tarot
- Astrology engine for real calculations
- Share utility for native sharing
