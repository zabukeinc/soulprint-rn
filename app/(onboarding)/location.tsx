// app/(onboarding)/location.tsx

import React, { useState } from 'react'
import { View, Text, TextInput, ScrollView, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Screen } from '@/src/design/primitives/Screen'
import { Button } from '@/src/design/primitives/Button'
import ProgressDots from '@/src/components/ProgressDots'
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
