# Onboarding Name Step + Birthplace Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a name-input screen as onboarding step 1 and replace the hardcoded birthplace list with a searchable city picker backed by mocked real-coordinate data, with all answers persisted via a new OnboardingContext.

**Architecture:** Mocked city dataset (`src/data/cities.mock.ts`) behind a service function (`src/services/cities.ts`) so a future backend swap touches one file. Onboarding answers live in `OnboardingContext` (root-level, AsyncStorage-backed). Location screen becomes search-first (design direction A, approved).

**Tech Stack:** Expo SDK 54, expo-router 6, React Native 0.81, AsyncStorage 2.2, TypeScript.

**Spec:** `docs/superpowers/specs/2026-08-01-onboarding-name-location-design.md`

**Constraints:**
- No test framework exists. Verification = `npx tsc --noEmit` (must exit clean) + manual walkthrough (Task 10). Do NOT add jest.
- Do NOT run `git commit`/`git add` — the user requests commits explicitly.

---

### Task 1: City mock data

**Files:**
- Create: `src/data/cities.mock.ts`

- [ ] **Step 1: Create the file**

```ts
export type City = {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  timezone: string; // IANA
  gmt: string; // display offset, standard time
};

// Mock dataset — real coordinates. Backend will replace this (see src/services/cities.ts).
export const CITIES: City[] = [
  // Indonesia — WIB (GMT+7)
  { id: 'jakarta', name: 'Jakarta', country: 'Indonesia', lat: -6.2088, lng: 106.8456, timezone: 'Asia/Jakarta', gmt: 'GMT+7' },
  { id: 'bandung', name: 'Bandung', country: 'Indonesia', lat: -6.9175, lng: 107.6191, timezone: 'Asia/Jakarta', gmt: 'GMT+7' },
  { id: 'surabaya', name: 'Surabaya', country: 'Indonesia', lat: -7.2575, lng: 112.7521, timezone: 'Asia/Jakarta', gmt: 'GMT+7' },
  { id: 'yogyakarta', name: 'Yogyakarta', country: 'Indonesia', lat: -7.7956, lng: 110.3695, timezone: 'Asia/Jakarta', gmt: 'GMT+7' },
  { id: 'semarang', name: 'Semarang', country: 'Indonesia', lat: -6.9667, lng: 110.4167, timezone: 'Asia/Jakarta', gmt: 'GMT+7' },
  { id: 'medan', name: 'Medan', country: 'Indonesia', lat: 3.5952, lng: 98.6722, timezone: 'Asia/Jakarta', gmt: 'GMT+7' },
  { id: 'palembang', name: 'Palembang', country: 'Indonesia', lat: -2.9761, lng: 104.7754, timezone: 'Asia/Jakarta', gmt: 'GMT+7' },
  { id: 'bandar-lampung', name: 'Bandar Lampung', country: 'Indonesia', lat: -5.45, lng: 105.2667, timezone: 'Asia/Jakarta', gmt: 'GMT+7' },
  { id: 'padang', name: 'Padang', country: 'Indonesia', lat: -0.9471, lng: 100.4172, timezone: 'Asia/Jakarta', gmt: 'GMT+7' },
  { id: 'pekanbaru', name: 'Pekanbaru', country: 'Indonesia', lat: 0.5071, lng: 101.4478, timezone: 'Asia/Jakarta', gmt: 'GMT+7' },
  { id: 'batam', name: 'Batam', country: 'Indonesia', lat: 1.1301, lng: 104.0529, timezone: 'Asia/Jakarta', gmt: 'GMT+7' },
  { id: 'bogor', name: 'Bogor', country: 'Indonesia', lat: -6.5971, lng: 106.806, timezone: 'Asia/Jakarta', gmt: 'GMT+7' },
  { id: 'depok', name: 'Depok', country: 'Indonesia', lat: -6.4025, lng: 106.7942, timezone: 'Asia/Jakarta', gmt: 'GMT+7' },
  { id: 'bekasi', name: 'Bekasi', country: 'Indonesia', lat: -6.2383, lng: 106.9756, timezone: 'Asia/Jakarta', gmt: 'GMT+7' },
  { id: 'tangerang', name: 'Tangerang', country: 'Indonesia', lat: -6.1783, lng: 106.6319, timezone: 'Asia/Jakarta', gmt: 'GMT+7' },
  { id: 'pontianak', name: 'Pontianak', country: 'Indonesia', lat: -0.0263, lng: 109.3425, timezone: 'Asia/Pontianak', gmt: 'GMT+7' },
  // Indonesia — WITA (GMT+8) / WIT (GMT+9)
  { id: 'balikpapan', name: 'Balikpapan', country: 'Indonesia', lat: -1.2379, lng: 116.8529, timezone: 'Asia/Makassar', gmt: 'GMT+8' },
  { id: 'denpasar', name: 'Denpasar (Bali)', country: 'Indonesia', lat: -8.6705, lng: 115.2126, timezone: 'Asia/Makassar', gmt: 'GMT+8' },
  { id: 'makassar', name: 'Makassar', country: 'Indonesia', lat: -5.1477, lng: 119.4327, timezone: 'Asia/Makassar', gmt: 'GMT+8' },
  { id: 'jayapura', name: 'Jayapura', country: 'Indonesia', lat: -2.5916, lng: 140.669, timezone: 'Asia/Jayapura', gmt: 'GMT+9' },
  { id: 'ambon', name: 'Ambon', country: 'Indonesia', lat: -3.6954, lng: 128.1814, timezone: 'Asia/Jayapura', gmt: 'GMT+9' },
  // Southeast Asia
  { id: 'singapore', name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, timezone: 'Asia/Singapore', gmt: 'GMT+8' },
  { id: 'kuala-lumpur', name: 'Kuala Lumpur', country: 'Malaysia', lat: 3.139, lng: 101.6869, timezone: 'Asia/Kuala_Lumpur', gmt: 'GMT+8' },
  { id: 'bangkok', name: 'Bangkok', country: 'Thailand', lat: 13.7563, lng: 100.5018, timezone: 'Asia/Bangkok', gmt: 'GMT+7' },
  { id: 'ho-chi-minh', name: 'Ho Chi Minh City', country: 'Vietnam', lat: 10.8231, lng: 106.6297, timezone: 'Asia/Ho_Chi_Minh', gmt: 'GMT+7' },
  { id: 'hanoi', name: 'Hanoi', country: 'Vietnam', lat: 21.0278, lng: 105.8342, timezone: 'Asia/Ho_Chi_Minh', gmt: 'GMT+7' },
  { id: 'manila', name: 'Manila', country: 'Philippines', lat: 14.5995, lng: 120.9842, timezone: 'Asia/Manila', gmt: 'GMT+8' },
  { id: 'phnom-penh', name: 'Phnom Penh', country: 'Cambodia', lat: 11.5564, lng: 104.9282, timezone: 'Asia/Phnom_Penh', gmt: 'GMT+7' },
  { id: 'vientiane', name: 'Vientiane', country: 'Laos', lat: 17.9757, lng: 102.6331, timezone: 'Asia/Vientiane', gmt: 'GMT+7' },
  // East Asia
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, timezone: 'Asia/Tokyo', gmt: 'GMT+9' },
  { id: 'osaka', name: 'Osaka', country: 'Japan', lat: 34.6937, lng: 135.5023, timezone: 'Asia/Tokyo', gmt: 'GMT+9' },
  { id: 'seoul', name: 'Seoul', country: 'South Korea', lat: 37.5665, lng: 126.978, timezone: 'Asia/Seoul', gmt: 'GMT+9' },
  { id: 'hong-kong', name: 'Hong Kong', country: 'Hong Kong', lat: 22.3193, lng: 114.1694, timezone: 'Asia/Hong_Kong', gmt: 'GMT+8' },
  { id: 'taipei', name: 'Taipei', country: 'Taiwan', lat: 25.033, lng: 121.5654, timezone: 'Asia/Taipei', gmt: 'GMT+8' },
  { id: 'shanghai', name: 'Shanghai', country: 'China', lat: 31.2304, lng: 121.4737, timezone: 'Asia/Shanghai', gmt: 'GMT+8' },
  { id: 'beijing', name: 'Beijing', country: 'China', lat: 39.9042, lng: 116.4074, timezone: 'Asia/Shanghai', gmt: 'GMT+8' },
  // South Asia
  { id: 'mumbai', name: 'Mumbai', country: 'India', lat: 19.076, lng: 72.8777, timezone: 'Asia/Kolkata', gmt: 'GMT+5:30' },
  { id: 'delhi', name: 'New Delhi', country: 'India', lat: 28.7041, lng: 77.1025, timezone: 'Asia/Kolkata', gmt: 'GMT+5:30' },
  { id: 'dhaka', name: 'Dhaka', country: 'Bangladesh', lat: 23.8103, lng: 90.4125, timezone: 'Asia/Dhaka', gmt: 'GMT+6' },
  { id: 'kathmandu', name: 'Kathmandu', country: 'Nepal', lat: 27.7172, lng: 85.324, timezone: 'Asia/Kathmandu', gmt: 'GMT+5:45' },
  // Middle East
  { id: 'dubai', name: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708, timezone: 'Asia/Dubai', gmt: 'GMT+4' },
  { id: 'riyadh', name: 'Riyadh', country: 'Saudi Arabia', lat: 24.7136, lng: 46.6753, timezone: 'Asia/Riyadh', gmt: 'GMT+3' },
  { id: 'doha', name: 'Doha', country: 'Qatar', lat: 25.2854, lng: 51.531, timezone: 'Asia/Qatar', gmt: 'GMT+3' },
  { id: 'istanbul', name: 'Istanbul', country: 'Türkiye', lat: 41.0082, lng: 28.9784, timezone: 'Europe/Istanbul', gmt: 'GMT+3' },
  // Europe
  { id: 'london', name: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278, timezone: 'Europe/London', gmt: 'GMT+0' },
  { id: 'paris', name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, timezone: 'Europe/Paris', gmt: 'GMT+1' },
  { id: 'berlin', name: 'Berlin', country: 'Germany', lat: 52.52, lng: 13.405, timezone: 'Europe/Berlin', gmt: 'GMT+1' },
  { id: 'amsterdam', name: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lng: 4.9041, timezone: 'Europe/Amsterdam', gmt: 'GMT+1' },
  { id: 'madrid', name: 'Madrid', country: 'Spain', lat: 40.4168, lng: -3.7038, timezone: 'Europe/Madrid', gmt: 'GMT+1' },
  { id: 'rome', name: 'Rome', country: 'Italy', lat: 41.9028, lng: 12.4964, timezone: 'Europe/Rome', gmt: 'GMT+1' },
  { id: 'zurich', name: 'Zurich', country: 'Switzerland', lat: 47.3769, lng: 8.5417, timezone: 'Europe/Zurich', gmt: 'GMT+1' },
  { id: 'stockholm', name: 'Stockholm', country: 'Sweden', lat: 59.3293, lng: 18.0686, timezone: 'Europe/Stockholm', gmt: 'GMT+1' },
  { id: 'oslo', name: 'Oslo', country: 'Norway', lat: 59.9139, lng: 10.7522, timezone: 'Europe/Oslo', gmt: 'GMT+1' },
  { id: 'copenhagen', name: 'Copenhagen', country: 'Denmark', lat: 55.6761, lng: 12.5683, timezone: 'Europe/Copenhagen', gmt: 'GMT+1' },
  { id: 'helsinki', name: 'Helsinki', country: 'Finland', lat: 60.1699, lng: 24.9384, timezone: 'Europe/Helsinki', gmt: 'GMT+2' },
  { id: 'dublin', name: 'Dublin', country: 'Ireland', lat: 53.3498, lng: -6.2603, timezone: 'Europe/Dublin', gmt: 'GMT+0' },
  { id: 'lisbon', name: 'Lisbon', country: 'Portugal', lat: 38.7223, lng: -9.1393, timezone: 'Europe/Lisbon', gmt: 'GMT+0' },
  { id: 'prague', name: 'Prague', country: 'Czechia', lat: 50.0755, lng: 14.4378, timezone: 'Europe/Prague', gmt: 'GMT+1' },
  { id: 'vienna', name: 'Vienna', country: 'Austria', lat: 48.2082, lng: 16.3738, timezone: 'Europe/Vienna', gmt: 'GMT+1' },
  { id: 'athens', name: 'Athens', country: 'Greece', lat: 37.9838, lng: 23.7275, timezone: 'Europe/Athens', gmt: 'GMT+2' },
  { id: 'moscow', name: 'Moscow', country: 'Russia', lat: 55.7558, lng: 37.6173, timezone: 'Europe/Moscow', gmt: 'GMT+3' },
  // North America
  { id: 'new-york', name: 'New York', country: 'USA', lat: 40.7128, lng: -74.006, timezone: 'America/New_York', gmt: 'GMT-5' },
  { id: 'los-angeles', name: 'Los Angeles', country: 'USA', lat: 34.0522, lng: -118.2437, timezone: 'America/Los_Angeles', gmt: 'GMT-8' },
  { id: 'san-francisco', name: 'San Francisco', country: 'USA', lat: 37.7749, lng: -122.4194, timezone: 'America/Los_Angeles', gmt: 'GMT-8' },
  { id: 'chicago', name: 'Chicago', country: 'USA', lat: 41.8781, lng: -87.6298, timezone: 'America/Chicago', gmt: 'GMT-6' },
  { id: 'toronto', name: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832, timezone: 'America/Toronto', gmt: 'GMT-5' },
  { id: 'vancouver', name: 'Vancouver', country: 'Canada', lat: 49.2827, lng: -123.1207, timezone: 'America/Vancouver', gmt: 'GMT-8' },
  { id: 'mexico-city', name: 'Mexico City', country: 'Mexico', lat: 19.4326, lng: -99.1332, timezone: 'America/Mexico_City', gmt: 'GMT-6' },
  { id: 'honolulu', name: 'Honolulu', country: 'USA', lat: 21.3069, lng: -157.8583, timezone: 'Pacific/Honolulu', gmt: 'GMT-10' },
  // South America
  { id: 'sao-paulo', name: 'São Paulo', country: 'Brazil', lat: -23.5505, lng: -46.6333, timezone: 'America/Sao_Paulo', gmt: 'GMT-3' },
  { id: 'buenos-aires', name: 'Buenos Aires', country: 'Argentina', lat: -34.6037, lng: -58.3816, timezone: 'America/Argentina/Buenos_Aires', gmt: 'GMT-3' },
  { id: 'lima', name: 'Lima', country: 'Peru', lat: -12.0464, lng: -77.0428, timezone: 'America/Lima', gmt: 'GMT-5' },
  // Oceania
  { id: 'sydney', name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, timezone: 'Australia/Sydney', gmt: 'GMT+10' },
  { id: 'melbourne', name: 'Melbourne', country: 'Australia', lat: -37.8136, lng: 144.9631, timezone: 'Australia/Melbourne', gmt: 'GMT+10' },
  { id: 'perth', name: 'Perth', country: 'Australia', lat: -31.9505, lng: 115.8605, timezone: 'Australia/Perth', gmt: 'GMT+8' },
  { id: 'auckland', name: 'Auckland', country: 'New Zealand', lat: -36.8485, lng: 174.7633, timezone: 'Pacific/Auckland', gmt: 'GMT+12' },
  { id: 'wellington', name: 'Wellington', country: 'New Zealand', lat: -41.2865, lng: 174.7762, timezone: 'Pacific/Auckland', gmt: 'GMT+12' },
  // Africa
  { id: 'cairo', name: 'Cairo', country: 'Egypt', lat: 30.0444, lng: 31.2357, timezone: 'Africa/Cairo', gmt: 'GMT+2' },
  { id: 'lagos', name: 'Lagos', country: 'Nigeria', lat: 6.5244, lng: 3.3792, timezone: 'Africa/Lagos', gmt: 'GMT+1' },
  { id: 'cape-town', name: 'Cape Town', country: 'South Africa', lat: -33.9249, lng: 18.4241, timezone: 'Africa/Johannesburg', gmt: 'GMT+2' },
  { id: 'nairobi', name: 'Nairobi', country: 'Kenya', lat: -1.2921, lng: 36.8219, timezone: 'Africa/Nairobi', gmt: 'GMT+3' },
];
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

---

### Task 2: City search service

**Files:**
- Create: `src/services/cities.ts`

- [ ] **Step 1: Create the file**

```ts
import { CITIES, type City } from '@/src/data/cities.mock';

export type { City };

// Backend swap point: replace implementation with
//   fetch(`${API_URL}/cities?q=${encodeURIComponent(query)}`)
// keeping this exact signature.
export async function searchCities(query: string): Promise<City[]> {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  return CITIES.filter(
    (c) => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q),
  ).slice(0, 8);
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

---

### Task 3: OnboardingContext

**Files:**
- Create: `src/context/OnboardingContext.tsx`

- [ ] **Step 1: Create the file**

```tsx
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { City } from '@/src/data/cities.mock';

export type OnboardingData = {
  name: string;
  birthDate: string | null; // 'YYYY-MM-DD'
  birthTime: string | null; // 'HH:mm'
  birthPlace: City | null;
  mbti: string | null;
  focusMood: string | null;
};

const EMPTY: OnboardingData = {
  name: '',
  birthDate: null,
  birthTime: null,
  birthPlace: null,
  mbti: null,
  focusMood: null,
};

const STORAGE_KEY = 'astrovy_onboarding';

type OnboardingContextValue = {
  data: OnboardingData;
  hydrated: boolean;
  update: (patch: Partial<OnboardingData>) => void;
  clear: () => Promise<void>;
};

const OnboardingContext = createContext<OnboardingContextValue>({
  data: EMPTY,
  hydrated: false,
  update: () => {},
  clear: async () => {},
});

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<OnboardingData>(EMPTY);
  const [hydrated, setHydrated] = useState(false);
  const hydratedRef = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setData({ ...EMPTY, ...JSON.parse(raw) });
      } catch {
        // corrupted payload — start fresh
      } finally {
        hydratedRef.current = true;
        setHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (hydratedRef.current) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)).catch(() => {});
    }
  }, [data]);

  const update = (patch: Partial<OnboardingData>) =>
    setData((d) => ({ ...d, ...patch }));

  const clear = async () => {
    setData(EMPTY);
    await AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  };

  return (
    <OnboardingContext.Provider value={{ data, hydrated, update, clear }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  return useContext(OnboardingContext);
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

---

### Task 4: Mount provider at root

**Files:**
- Modify: `app/_layout.tsx`
- [ ] **Step 1: Add import**

After line 5 (`import { TierProvider } from '@/src/context/TierContext';`):

```tsx
import { OnboardingProvider } from '@/src/context/OnboardingContext';
```

- [ ] **Step 2: Wrap**

Change `<TierProvider>` (line 12) to `<TierProvider><OnboardingProvider>` style nesting and matching close. Final JSX:

```tsx
    <SafeAreaProvider>
      <TierProvider>
        <OnboardingProvider>
          <View style={styles.container}>
            <LinearGradient
              colors={['#F2EDE3', '#EAF5EC', '#EFEAF7']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <SafeAreaView style={styles.safeArea} edges={['top']}>
              <Stack screenOptions={{ headerShown: false }} />
            </SafeAreaView>
          </View>
          <StatusBar style="dark" />
        </OnboardingProvider>
      </TierProvider>
    </SafeAreaProvider>
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

---

### Task 5: Name screen + route registration

**Files:**
- Create: `app/(onboarding)/name.tsx`
- Modify: `app/(onboarding)/_layout.tsx`
- Modify: `app/(onboarding)/welcome.tsx`

- [ ] **Step 1: Create `app/(onboarding)/name.tsx`**

```tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import ProgressDots from '@/src/components/ProgressDots';
import { theme } from '@/src/lib/theme';
import { useOnboarding } from '@/src/context/OnboardingContext';

export default function NameScreen() {
  const router = useRouter();
  const { data, update } = useOnboarding();
  const [name, setName] = useState(data.name);
  const canContinue = name.trim().length > 0;

  const onContinue = () => {
    if (!canContinue) return;
    update({ name: name.trim() });
    router.push('/(onboarding)/birth-date');
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInUp.duration(500)} style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.stepText}>1 of 7</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(100).duration(500)}>
          <Text style={styles.label}>First things first</Text>
          <Text style={styles.title}>What should the stars call you?</Text>
          <Text style={styles.description}>
            Your name shapes how your readings speak to you.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).duration(500)} style={styles.inputCard}>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor={theme.colors.muted + '80'}
            style={styles.input}
            autoFocus
            autoCapitalize="words"
            maxLength={30}
            returnKeyType="done"
            onSubmitEditing={onContinue}
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(300).duration(500)}>
          <TouchableOpacity activeOpacity={0.85} disabled={!canContinue} onPress={onContinue}>
            <LinearGradient
              colors={canContinue ? theme.gradients.primary : ['#C4B8E0', '#A0D4D0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.button, !canContinue && styles.buttonDisabled]}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
        <ProgressDots total={7} current={0} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.76)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.warmSoft,
  },
  backIcon: { fontSize: 18, color: theme.colors.ink },
  stepText: { fontSize: 12, color: theme.colors.muted },
  label: {
    fontSize: 11,
    letterSpacing: 1.4,
    color: '#8B72CF',
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 12,
  },
  title: {
    fontFamily: theme.fonts.serif,
    fontSize: 28,
    fontWeight: '500',
    color: theme.colors.ink,
    letterSpacing: -1.2,
    lineHeight: 32,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: theme.colors.muted,
    lineHeight: 23,
    marginBottom: 24,
  },
  inputCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    backgroundColor: 'rgba(255,255,255,0.78)',
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 24,
    ...theme.shadows.warmSm,
  },
  input: {
    fontSize: 18,
    fontFamily: theme.fonts.serif,
    color: theme.colors.ink,
    paddingVertical: 14,
  },
  button: {
    width: '100%',
    minHeight: 54,
    borderRadius: 27,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.primaryGlow,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
});
```

- [ ] **Step 2: Register route in `app/(onboarding)/_layout.tsx`**

Add after line 12 (`<Stack.Screen name="welcome" />`):

```tsx
      <Stack.Screen name="name" />
```

- [ ] **Step 3: Repoint welcome button in `app/(onboarding)/welcome.tsx`**

Line 48 — change:

```tsx
onPress={() => router.push('/(onboarding)/birth-date')}
```

to:

```tsx
onPress={() => router.push('/(onboarding)/name')}
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

---

### Task 6: Rewrite location screen (search-first)

**Files:**
- Modify: `app/(onboarding)/location.tsx` (full rewrite)

- [ ] **Step 1: Replace entire file content**

```tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import ProgressDots from '@/src/components/ProgressDots';
import { theme } from '@/src/lib/theme';
import { searchCities, type City } from '@/src/services/cities';
import { useOnboarding } from '@/src/context/OnboardingContext';

function formatCoords(c: City) {
  const lat = `${Math.abs(c.lat).toFixed(2)}°${c.lat >= 0 ? 'N' : 'S'}`;
  const lng = `${Math.abs(c.lng).toFixed(2)}°${c.lng >= 0 ? 'E' : 'W'}`;
  return `${lat}, ${lng}`;
}

export default function LocationScreen() {
  const router = useRouter();
  const { data, update } = useOnboarding();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<City[]>([]);
  const [selected, setSelected] = useState<City | null>(data.birthPlace);

  useEffect(() => {
    const t = setTimeout(async () => {
      setResults(await searchCities(query));
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const onSelect = (city: City) => setSelected(city);

  const onContinue = () => {
    if (!selected) return;
    update({ birthPlace: selected });
    router.push('/(onboarding)/mbti');
  };

  const showIdle = query.trim().length < 2;
  const showEmpty = !showIdle && results.length === 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Animated.View entering={FadeInUp.duration(500)} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.stepText}>4 of 7</Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(100).duration(500)}>
        <Text style={styles.label}>Place matters</Text>
        <Text style={styles.title}>Where were you born?</Text>
        <Text style={styles.description}>We use it to anchor your chart.</Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(200).duration(500)} style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search your birth city"
          placeholderTextColor={theme.colors.muted + '80'}
          style={styles.searchInput}
          autoCapitalize="words"
          autoCorrect={false}
        />
      </Animated.View>

      {showIdle && !selected && (
        <Text style={styles.hint}>Start typing your birth city.</Text>
      )}
      {showEmpty && (
        <Text style={styles.hint}>No matches — try a nearby larger city.</Text>
      )}

      <View style={styles.list}>
        {results.map((city, index) => {
          const isSelected = selected?.id === city.id;
          return (
            <Animated.View key={city.id} entering={FadeInUp.delay(index * 40).duration(400)}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => onSelect(city)}
                style={[styles.cityItem, isSelected && styles.cityItemActive]}
              >
                <Text style={styles.pinIcon}>{isSelected ? '📍' : '·'}</Text>
                <View style={styles.cityInfo}>
                  <Text style={styles.cityName}>
                    {city.name}, {city.country}
                  </Text>
                  <Text style={styles.cityMeta}>{formatCoords(city)}</Text>
                </View>
                <View style={styles.gmtChip}>
                  <Text style={styles.gmtChipText}>{city.gmt}</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>

      {selected && (
        <Animated.View entering={FadeInUp.duration(400)} style={styles.selectedCard}>
          <Text style={styles.selectedPin}>📍</Text>
          <View style={styles.cityInfo}>
            <Text style={styles.selectedLabel}>Selected</Text>
            <Text style={styles.selectedName}>
              {selected.name}, {selected.country}
            </Text>
          </View>
          <View style={styles.gmtChip}>
            <Text style={styles.gmtChipText}>{selected.gmt}</Text>
          </View>
        </Animated.View>
      )}

      <Animated.View entering={FadeInUp.delay(300).duration(500)}>
        <TouchableOpacity activeOpacity={0.85} disabled={!selected} onPress={onContinue}>
          <LinearGradient
            colors={selected ? theme.gradients.primary : ['#C4B8E0', '#A0D4D0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.button, !selected && styles.buttonDisabled]}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
      <ProgressDots total={7} current={3} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.76)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.warmSoft,
  },
  backIcon: { fontSize: 18, color: theme.colors.ink },
  stepText: { fontSize: 12, color: theme.colors.muted },
  label: {
    fontSize: 11,
    letterSpacing: 1.4,
    color: '#8B72CF',
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 12,
  },
  title: {
    fontFamily: theme.fonts.serif,
    fontSize: 28,
    fontWeight: '500',
    color: theme.colors.ink,
    letterSpacing: -1.2,
    lineHeight: 32,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: theme.colors.muted,
    lineHeight: 23,
    marginBottom: 20,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    backgroundColor: 'rgba(255,255,255,0.74)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    ...theme.shadows.warmSm,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 14, color: theme.colors.ink },
  hint: {
    fontSize: 12,
    color: theme.colors.muted,
    textAlign: 'center',
    marginBottom: 16,
  },
  list: { gap: 8, marginBottom: 12 },
  cityItem: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    backgroundColor: 'rgba(255,255,255,0.72)',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...theme.shadows.warmSm,
  },
  cityItemActive: {
    borderColor: 'rgba(139,114,207,0.35)',
    backgroundColor: 'rgba(232,221,251,0.98)',
  },
  pinIcon: { fontSize: 14, color: '#8B72CF', width: 18, textAlign: 'center' },
  cityInfo: { flex: 1 },
  cityName: { fontSize: 14, fontWeight: '600', color: theme.colors.ink },
  cityMeta: { fontSize: 11, color: theme.colors.muted, marginTop: 2 },
  gmtChip: {
    borderRadius: 8,
    backgroundColor: 'rgba(139,114,207,0.14)',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  gmtChipText: { fontSize: 10, fontWeight: '700', color: '#6C5F99' },
  selectedCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(232,221,251,0.9)',
    borderWidth: 2,
    borderColor: 'rgba(139,114,207,0.3)',
    ...theme.shadows.warmSm,
  },
  selectedPin: { fontSize: 18 },
  selectedLabel: { fontSize: 12, color: theme.colors.muted, marginBottom: 2 },
  selectedName: { fontSize: 14, fontWeight: '700', color: theme.colors.ink },
  button: {
    width: '100%',
    minHeight: 54,
    borderRadius: 27,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.primaryGlow,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
});
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

---

### Task 7: Wire answers into context + renumber steps

**Files:**
- Modify: `app/(onboarding)/birth-date.tsx`
- Modify: `app/(onboarding)/birth-time.tsx`
- Modify: `app/(onboarding)/mbti.tsx`
- Modify: `app/(onboarding)/focus-mood.tsx`
- Modify: `app/(onboarding)/generating.tsx`

- [ ] **Step 1: `birth-date.tsx`**

Add import after line 8:

```tsx
import { useOnboarding } from '@/src/context/OnboardingContext';
```

Inside `BirthDateScreen`, after `const router = useRouter();` (line 15):

```tsx
  const { update } = useOnboarding();
```

Replace the Continue `onPress` (line 116) with:

```tsx
          onPress={() => {
            update({
              birthDate: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
            });
            router.push('/(onboarding)/birth-time');
          }}
```

Line 35: `1 of 6` → `2 of 7`. Line 128: `<ProgressDots total={6} current={0} />` → `<ProgressDots total={7} current={1} />`.

- [ ] **Step 2: `birth-time.tsx`**

Add import after line 7:

```tsx
import { useOnboarding } from '@/src/context/OnboardingContext';
```

Inside `BirthTimeScreen`, after `const router = useRouter();` (line 10):

```tsx
  const { update } = useOnboarding();
```

Continue `onPress` (line 93) →

```tsx
          onPress={() => {
            update({ birthTime: time });
            router.push('/(onboarding)/location');
          }}
```

Skip `onPress` (line 109) →

```tsx
          onPress={() => {
            update({ birthTime: null });
            router.push('/(onboarding)/location');
          }}
```

Line 33: `2 of 6` → `3 of 7`. Line 115: `<ProgressDots total={6} current={1} />` → `<ProgressDots total={7} current={2} />`.

- [ ] **Step 3: `mbti.tsx`**

Add import after line 14:

```tsx
import { useOnboarding } from '@/src/context/OnboardingContext';
```

Inside `MbtiScreen`, after `const router = useRouter();` (line 38):

```tsx
  const { update } = useOnboarding();
```

Continue `onPress` (line 98) →

```tsx
          onPress={() => {
            update({ mbti: selected === "I'm not sure" ? null : selected });
            router.push('/(onboarding)/focus-mood');
          }}
```

Skip `onPress` (line 114) →

```tsx
          onPress={() => {
            update({ mbti: null });
            router.push('/(onboarding)/focus-mood');
          }}
```

Line 55: `4 of 6` → `5 of 7`. Line 120: `<ProgressDots total={6} current={3} />` → `<ProgressDots total={7} current={4} />`.

- [ ] **Step 4: `focus-mood.tsx`**

Add import after line 14:

```tsx
import { useOnboarding } from '@/src/context/OnboardingContext';
```

Inside `FocusMoodScreen`, after `const router = useRouter();` (line 29):

```tsx
  const { update } = useOnboarding();
```

Continue `onPress` (line 83) →

```tsx
          onPress={() => {
            update({ focusMood: focus });
            router.push('/(onboarding)/generating');
          }}
```

Line 45: `5 of 6` → `6 of 7`. Line 96: `<ProgressDots total={6} current={4} />` → `<ProgressDots total={7} current={5} />`.

- [ ] **Step 5: `generating.tsx` renumber**

Line 111: `<ProgressDots total={6} current={5} />` → `<ProgressDots total={7} current={6} />`.

- [ ] **Step 6: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

---

### Task 8: Consumers — real name + data

**Files:**
- Modify: `app/(onboarding)/first-mirror.tsx`
- Modify: `app/snapshot.tsx`
- Modify: `app/(onboarding)/generating.tsx`

- [ ] **Step 1: `first-mirror.tsx`**

Add import after line 14:

```tsx
import { useOnboarding } from '@/src/context/OnboardingContext';
```

Inside `FirstMirrorScreen`, after `const router = useRouter();` (line 24):

```tsx
  const { data } = useOnboarding();
```

Line 50 — replace:

```tsx
        <Text style={styles.title}>Hi Gy, your first Astrovy is ready.</Text>
```

with:

```tsx
        <Text style={styles.title}>
          Hi {data.name || 'friend'}, your first Astrovy is ready.
        </Text>
```

- [ ] **Step 2: `snapshot.tsx`**

Add import after line 14:

```tsx
import { useOnboarding } from '@/src/context/OnboardingContext';
```

Inside `SnapshotScreen`, after `const router = useRouter();` (line 24):

```tsx
  const { data } = useOnboarding();
```

Line 49 — replace:

```tsx
        <Text style={styles.title}>Hi Gy, your first Astrovy is ready.</Text>
```

with:

```tsx
        <Text style={styles.title}>
          Hi {data.name || 'friend'}, your first Astrovy is ready.
        </Text>
```

- [ ] **Step 3: `generating.tsx` — stage copy uses real data**

Add import after line 15:

```tsx
import { useOnboarding } from '@/src/context/OnboardingContext';
```

Delete the module-level `const stages = [...]` block (lines 17-22). Inside `GeneratingScreen`, after `const router = useRouter();` (line 25):

```tsx
  const { data } = useOnboarding();
  const stages = [
    { id: 1, text: `Reading your birth date${data.birthDate ? ` (${data.birthDate})` : ''}...`, delay: 600 },
    { id: 2, text: `Placing ${data.birthPlace?.name ?? 'your birthplace'} into the chart...`, delay: 1400 },
    { id: 3, text: 'Listening to your current focus...', delay: 2200 },
    { id: 4, text: 'Preparing your first emotional mirror...', delay: 3000 },
  ];
```

(The existing `useEffect` referencing `stages` keeps working — it closes over the component-scope constant.)

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

---

### Task 9: Reset store on onboarding restart

**Files:**
- Modify: `app/(onboarding)/welcome.tsx`

- [ ] **Step 1: Clear on mount**

Change line 1 import to:

```tsx
import React, { useEffect } from 'react';
```

Add import after line 9:

```tsx
import { useOnboarding } from '@/src/context/OnboardingContext';
```

Inside `WelcomeScreen`, after `const router = useRouter();` (line 13):

```tsx
  const { clear, hydrated } = useOnboarding();
  useEffect(() => {
    if (hydrated) clear(); // restart resets answers; gated to avoid hydration race
  }, [hydrated]);
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

---

### Task 10: Final verification

- [ ] **Step 1: Typecheck whole project**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 2: Grep for leftovers**

Run: `rg -n "of 6|total=\{6\}" app/`
Expected: no matches.

Run: `rg -n "Hi Gy" app/`
Expected: no matches.

- [ ] **Step 3: Manual walkthrough (simulator)**

Run: `npm start` → open iOS sim. Walk all 8 screens:

1. welcome → "Begin gently" lands on **name** (step 1 of 7)
2. name: Continue disabled when empty; type name → Continue works
3. birth-date (2 of 7) → birth-time (3 of 7, Skip works)
4. location (4 of 7): type "ban" → results w/ coords + GMT chip; tap row → selected card appears; Continue only enabled after selection; query "zzz" → no-match hint
5. mbti (5 of 7) → focus-mood (6 of 7) → generating (7 of 7): stage text shows real birth date + chosen city
6. first-mirror: greets with typed name, not "Gy"
7. snapshot (`/snapshot`): greets with typed name
8. Kill app mid-onboarding, reopen, start from welcome → answers reset
