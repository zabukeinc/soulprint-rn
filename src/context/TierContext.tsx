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
