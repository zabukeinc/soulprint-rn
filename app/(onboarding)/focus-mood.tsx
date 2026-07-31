// app/(onboarding)/focus-mood.tsx

import React, { useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Screen } from '@/src/design/primitives/Screen'
import { Button } from '@/src/design/primitives/Button'
import ProgressDots from '@/src/components/ProgressDots'
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
