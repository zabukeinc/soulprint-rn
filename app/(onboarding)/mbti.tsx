// app/(onboarding)/mbti.tsx

import React, { useState } from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Screen } from '@/src/design/primitives/Screen'
import { Button } from '@/src/design/primitives/Button'
import ProgressDots from '@/src/components/ProgressDots'
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
