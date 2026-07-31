// app/(onboarding)/birth-time.tsx

import React, { useState } from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Screen } from '@/src/design/primitives/Screen'
import { Button } from '@/src/design/primitives/Button'
import ProgressDots from '@/src/components/ProgressDots'
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
