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
