// app/love.tsx

import React, { useMemo, useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { Screen } from '@/src/design/primitives'
import { Card } from '@/src/design/primitives'
import { Button } from '@/src/design/primitives'
import { Eyebrow } from '@/src/design/primitives'
import { colors, typography, spacing, radii, shadows } from '@/src/design/tokens'
import { useProfile } from '@/src/context/ProfileContext'
import { calculateNatalChart, getZodiacInfo } from '@/src/lib/astrology'

type Feedback = 'yes' | 'somewhat' | 'no' | null

const FEEDBACK_OPTIONS: { id: Feedback; label: string }[] = [
  { id: 'yes', label: 'Yes' },
  { id: 'somewhat', label: 'Somewhat' },
  { id: 'no', label: 'Not quite' },
]

export default function LoveScreen() {
  const router = useRouter()
  const { profile } = useProfile()
  const [feedback, setFeedback] = useState<Feedback>(null)

  const natal = useMemo(() => {
    if (!profile?.birth?.date) return null
    return calculateNatalChart({
      date: profile.birth.date,
      time: profile.birth.time,
      location: {
        city: profile.birth.location.city,
        lat: profile.birth.location.lat ?? 0,
        lng: profile.birth.location.lng ?? 0,
        timezone: profile.birth.location.timezone,
      },
    })
  }, [profile])

  const venus = natal?.venus
  const venusInfo = venus ? getZodiacInfo(venus.sign) : null

  return (
    <Screen>
      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()} hitSlop={8}>
            <Text style={styles.backIcon}>{'<'}</Text>
          </Pressable>
          <View style={styles.headerCenter}>
            <Eyebrow color={colors.royalViolet} showLine={false}>
              Love
            </Eyebrow>
            <Text style={styles.headerTitle}>How you love and why.</Text>
          </View>
          <View style={styles.backPlaceholder} />
        </View>

        {/* Venus hero */}
        <Animated.View entering={FadeInUp.duration(500).delay(50)}>
          <Card variant="gradient" padding="lg" style={styles.heroCard}>
            <Eyebrow color={colors.white}>
              {venusInfo ? `Venus in ${venusInfo.name}` : 'Venus sign'}
            </Eyebrow>
            <Text style={styles.heroText}>
              {venus?.meaning ?? 'Add your birth date to reveal how you love.'}
            </Text>
          </Card>
        </Animated.View>

        {/* Venus traits */}
        {venusInfo && (
          <Animated.View entering={FadeInUp.duration(500).delay(100)}>
            <Card variant="light" padding="lg" style={styles.traitsCard}>
              <Eyebrow>Venus traits</Eyebrow>
              <View style={styles.traitRow}>
                {venusInfo.traits.map((trait) => (
                  <View key={trait} style={styles.traitBadge}>
                    <Text style={styles.traitBadgeText}>{trait}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.traitDesc}>
                {venusInfo.element} \u00B7 {venusInfo.modality} \u2014 ruled by{' '}
                {venusInfo.rulingPlanet}.
              </Text>
            </Card>
          </Animated.View>
        )}

        {/* Feedback */}
        <Animated.View entering={FadeInUp.duration(500).delay(150)}>
          <Card variant="soft" padding="lg" style={styles.feedbackCard}>
            <Text style={styles.feedbackLabel}>Does this resonate?</Text>
            <View style={styles.feedbackRow}>
              {FEEDBACK_OPTIONS.map((opt) => (
                <Button
                  key={opt.id}
                  variant={feedback === opt.id ? 'primary' : 'secondary'}
                  size="sm"
                  fullWidth
                  onPress={() => setFeedback(opt.id)}
                >
                  {opt.label}
                </Button>
              ))}
            </View>
            {feedback && (
              <Text style={styles.feedbackNote}>
                {feedback === 'yes'
                  ? 'Noted. We\u2019ll tune future readings to this.'
                  : feedback === 'somewhat'
                    ? 'Thanks \u2014 we\u2019ll refine the signal.'
                    : 'Got it. We\u2019ll adjust the lens.'}
              </Text>
            )}
          </Card>
        </Animated.View>
      </Animated.ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: 130,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(123,97,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  backIcon: { fontSize: 18, color: colors.deepSpace, fontWeight: '700' },
  backPlaceholder: { width: 40 },
  headerCenter: { alignItems: 'center', flex: 1 },
  headerTitle: {
    ...typography.scale.h3,
    color: colors.deepSpace,
  },
  heroCard: { marginBottom: spacing.md },
  heroText: {
    ...typography.scale.bodyLarge,
    color: colors.white,
    lineHeight: 28,
  },
  traitsCard: { marginBottom: spacing.md },
  traitRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm + 2,
  },
  traitBadge: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    backgroundColor: colors.lightBg,
    borderWidth: 1,
    borderColor: colors.pastelLilac,
  },
  traitBadgeText: {
    ...typography.scale.caption,
    fontWeight: typography.weights.semibold,
    color: colors.royalViolet,
  },
  traitDesc: {
    ...typography.scale.caption,
    color: colors.cosmicGray,
  },
  feedbackCard: {},
  feedbackLabel: {
    ...typography.scale.body,
    fontWeight: typography.weights.medium,
    color: colors.deepSpace,
    marginBottom: spacing.sm + 2,
  },
  feedbackRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  feedbackNote: {
    ...typography.scale.caption,
    color: colors.cosmicGray,
    marginTop: spacing.sm + 2,
    fontStyle: 'italic',
  },
})
