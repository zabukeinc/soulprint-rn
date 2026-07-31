// app/(onboarding)/birth-date.tsx

import React, { useState } from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Screen } from '@/src/design/primitives/Screen'
import { Button } from '@/src/design/primitives/Button'
import ProgressDots from '@/src/components/ProgressDots'
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
