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
