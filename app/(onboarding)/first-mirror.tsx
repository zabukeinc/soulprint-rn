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
