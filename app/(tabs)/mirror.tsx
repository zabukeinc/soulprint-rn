// app/(tabs)/mirror.tsx

import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { Screen, Card, Eyebrow, Button } from '@/src/design/primitives'
import { colors, typography, spacing } from '@/src/design/tokens'
import { useEngagement } from '@/src/hooks/useEngagement'
import { useTier } from '@/src/context/TierContext'
import { formatDateShort } from '@/src/lib/dates'

function mostCommonMood(moods: { mood: string }[]): string | null {
  if (moods.length === 0) return null
  const counts: Record<string, number> = {}
  for (const m of moods) {
    counts[m.mood] = (counts[m.mood] || 0) + 1
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
}

export default function MirrorScreen() {
  const router = useRouter()
  const engagement = useEngagement()
  const { isPremium } = useTier()

  const streak = engagement.streak || 0
  const moodHistory = engagement.moodHistory || []
  const journalEntries = engagement.journalEntries || []
  const reflections = engagement.reflections || 0

  const isEmpty = moodHistory.length === 0 && journalEntries.length === 0 && streak === 0
  const recentMoods = moodHistory.slice(0, 5)
  const commonMood = mostCommonMood(moodHistory)
  const latestReflection = journalEntries[0] ?? null

  if (isEmpty) {
    return (
      <Screen>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInUp.duration(500)}>
            <Eyebrow>Mirror</Eyebrow>
            <Text style={styles.headerTitle}>Your Mirror</Text>
            <Text style={styles.headerDesc}>Your patterns, over time.</Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.duration(500).delay(120)}>
            <Card variant="light" padding="xl" style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>
                Nothing here yet — and that's fine.
              </Text>
              <Text style={styles.emptyText}>
                Check in on Today to start your mirror.
              </Text>
              <View style={styles.emptyCta}>
                <Button
                  variant="primary"
                  onPress={() => router.push('/(tabs)/today')}
                >
                  Go to Today
                </Button>
              </View>
            </Card>
          </Animated.View>
        </ScrollView>
      </Screen>
    )
  }

  return (
    <Screen>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInUp.duration(500)}>
          <Eyebrow>Mirror</Eyebrow>
          <Text style={styles.headerTitle}>Your Mirror</Text>
          <Text style={styles.headerDesc}>Your patterns, over time.</Text>
        </Animated.View>

        <View style={styles.statsRow}>
          <Animated.View
            entering={FadeInUp.duration(500).delay(80)}
            style={styles.statCol}
          >
            <Card variant="light" padding="md" style={styles.statCard}>
              <Text style={styles.statLabel}>Streak</Text>
              <Text style={styles.statValue}>{streak}</Text>
            </Card>
          </Animated.View>
          <Animated.View
            entering={FadeInUp.duration(500).delay(140)}
            style={styles.statCol}
          >
            <Card variant="light" padding="md" style={styles.statCard}>
              <Text style={styles.statLabel}>Moods</Text>
              <Text style={styles.statValue}>{moodHistory.length}</Text>
            </Card>
          </Animated.View>
          <Animated.View
            entering={FadeInUp.duration(500).delay(200)}
            style={styles.statCol}
          >
            <Card variant="light" padding="md" style={styles.statCard}>
              <Text style={styles.statLabel}>Reflections</Text>
              <Text style={styles.statValue}>{reflections}</Text>
            </Card>
          </Animated.View>
        </View>

        <Animated.View entering={FadeInUp.duration(500).delay(260)}>
          <Card variant="light" padding="lg" style={styles.sectionCard}>
            <Eyebrow>Recent moods</Eyebrow>
            {recentMoods.length > 0 ? (
              <View style={styles.moodList}>
                {recentMoods.map((m, i) => (
                  <View key={`${m.date}-${m.time}-${i}`} style={styles.moodRow}>
                    <Text style={styles.moodEmoji}>
                      {moodEmoji(m.mood)}
                    </Text>
                    <Text style={styles.moodLabel}>{m.mood}</Text>
                    <Text style={styles.moodDate}>{formatDateShort(m.date)}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.placeholder}>No moods logged yet.</Text>
            )}
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(500).delay(320)}>
          <Card variant="light" padding="lg" style={styles.sectionCard}>
            <Eyebrow>Most common</Eyebrow>
            {commonMood ? (
              <View style={styles.commonRow}>
                <Text style={styles.moodEmoji}>{moodEmoji(commonMood)}</Text>
                <Text style={styles.commonLabel}>{commonMood}</Text>
              </View>
            ) : (
              <Text style={styles.placeholder}>Not enough data yet.</Text>
            )}
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(500).delay(380)}>
          <Card variant="light" padding="lg" style={styles.sectionCard}>
            <Eyebrow>Latest reflection</Eyebrow>
            {latestReflection ? (
              <View>
                <Text style={styles.reflectionPrompt}>{latestReflection.prompt}</Text>
                <Text style={styles.reflectionText}>{latestReflection.text}</Text>
                <Text style={styles.reflectionDate}>
                  {formatDateShort(latestReflection.date)}
                </Text>
              </View>
            ) : (
              <Text style={styles.placeholder}>No reflections yet.</Text>
            )}
          </Card>
        </Animated.View>

        {!isPremium && (
          <Animated.View entering={FadeInUp.duration(500).delay(440)}>
            <Button
              variant="primary"
              fullWidth
              onPress={() => router.push('/pricing')}
            >
              Unlock your full reflection
            </Button>
          </Animated.View>
        )}
      </ScrollView>
    </Screen>
  )
}

function moodEmoji(mood: string): string {
  const map: Record<string, string> = {
    Steady: '\uD83D\uDC9B',
    Tender: '\uD83C\uDF0A',
    Restless: '\u26A1',
    Quiet: '\uD83E\uDDCA',
  }
  return map[mood] || '\uD83D\uDCAD'
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: 130,
  },
  headerTitle: {
    ...typography.scale.h1,
    color: colors.deepSpace,
    marginBottom: spacing.xs,
  },
  headerDesc: {
    ...typography.scale.body,
    color: colors.cosmicGray,
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statCol: { flex: 1 },
  statCard: { alignItems: 'center' },
  statLabel: {
    ...typography.scale.caption,
    color: colors.cosmicGray,
    marginBottom: 4,
  },
  statValue: {
    ...typography.scale.h2,
    color: colors.deepSpace,
  },
  sectionCard: { marginBottom: spacing.md },
  moodList: { gap: spacing.sm },
  moodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  moodEmoji: { fontSize: 18 },
  moodLabel: {
    ...typography.scale.body,
    color: colors.deepSpace,
    flex: 1,
  },
  moodDate: {
    ...typography.scale.caption,
    color: colors.cosmicGray,
  },
  placeholder: {
    ...typography.scale.body,
    color: colors.cosmicGray,
    fontStyle: 'italic',
  },
  commonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  commonLabel: {
    ...typography.scale.h3,
    color: colors.deepSpace,
  },
  reflectionPrompt: {
    ...typography.scale.caption,
    color: colors.royalViolet,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.xs,
  },
  reflectionText: {
    ...typography.scale.body,
    color: colors.deepSpace,
    marginBottom: spacing.xs,
  },
  reflectionDate: {
    ...typography.scale.caption,
    color: colors.cosmicGray,
  },
  emptyCard: { alignItems: 'center', marginTop: spacing.xl },
  emptyTitle: {
    ...typography.scale.h3,
    color: colors.deepSpace,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typography.scale.body,
    color: colors.cosmicGray,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  emptyCta: {},
})
