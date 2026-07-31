// app/snapshot.tsx

import React, { useMemo, useRef } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { Screen } from '@/src/design/primitives'
import { Card } from '@/src/design/primitives'
import { Button } from '@/src/design/primitives'
import { Eyebrow } from '@/src/design/primitives'
import { colors, typography, spacing, radii, shadows } from '@/src/design/tokens'
import { useProfile } from '@/src/context/ProfileContext'
import {
  calculateNatalChart,
  calculateLifePath,
  getZodiacSign,
  getZodiacInfo,
  deriveArchetype,
} from '@/src/lib/astrology'
import { captureAndShare, buildShareMessage } from '@/src/lib/share'

export default function SnapshotScreen() {
  const router = useRouter()
  const { profile } = useProfile()
  const shareRef = useRef<View>(null)

  const data = useMemo(() => {
    if (!profile?.birth?.date) return null
    const [y, m, d] = profile.birth.date.split('-').map(Number)
    const sign = getZodiacSign(m, d)
    const lifePath = calculateLifePath(y, m, d)
    const archetype = deriveArchetype(sign, lifePath, profile.focus || 'purpose')
    const zodiacInfo = getZodiacInfo(sign)
    const natal = calculateNatalChart({
      date: profile.birth.date,
      time: profile.birth.time,
      location: {
        city: profile.birth.location.city,
        lat: profile.birth.location.lat ?? 0,
        lng: profile.birth.location.lng ?? 0,
        timezone: profile.birth.location.timezone,
      },
    })
    return { sign, lifePath, archetype, zodiacInfo, natal }
  }, [profile])

  const handleShare = async () => {
    if (!data) return
    const message = buildShareMessage('snapshot', {
      zodiac: data.zodiacInfo.name,
      lifePath: data.lifePath,
      archetype: data.archetype.name,
    })
    await captureAndShare(shareRef as React.RefObject<View>, message)
  }

  const handleDone = () => {
    router.replace('/(tabs)/today')
  }

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
              Snapshot
            </Eyebrow>
            <Text style={styles.headerTitle}>Your archetype, mapped.</Text>
          </View>
          <View style={styles.backPlaceholder} />
        </View>

        {/* Archetype hero card (shareable) */}
        <Animated.View entering={FadeInUp.duration(500).delay(50)}>
          <View ref={shareRef} style={styles.shareable}>
            <Card variant="gradient" padding="lg" style={styles.heroCard}>
              <Eyebrow color={colors.white}>Your core archetype</Eyebrow>
              <Text style={styles.heroName}>{data?.archetype.name ?? 'The Strategist'}</Text>
              <Text style={styles.heroTagline}>
                {data?.archetype.tagline ?? 'Air \u00B7 Fixed \u00B7 Strategist'}
              </Text>
              <Text style={styles.heroDesc}>
                {data?.archetype.description ??
                  'Add your birth date to map your archetype.'}
              </Text>
              <View style={styles.badges}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {data ? `${data.zodiacInfo.name} Sun` : 'Sun sign'}
                  </Text>
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Life Path {data?.lifePath ?? '?'}</Text>
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {data?.natal.moon.sign ? `${data.natal.moon.sign} Moon` : 'Moon sign'}
                  </Text>
                </View>
              </View>
            </Card>
          </View>
        </Animated.View>

        {/* Patterns */}
        {data && (
          <Animated.View entering={FadeInUp.duration(500).delay(100)}>
            <Eyebrow>What this may reveal</Eyebrow>
            <View style={styles.grid}>
              {data.archetype.patterns.map((p) => (
                <Card key={p} variant="light" padding="md" style={styles.patternCard}>
                  <Text style={styles.patternTitle}>{p}</Text>
                </Card>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Strengths & Growth */}
        {data && (
          <Animated.View entering={FadeInUp.duration(500).delay(150)}>
            <View style={styles.row}>
              <Card variant="light" padding="md" style={styles.halfCard}>
                <Eyebrow color={colors.royalViolet} showLine={false}>
                  Strengths
                </Eyebrow>
                {data.archetype.strengths.map((s) => (
                  <Text key={s} style={styles.listText}>
                    {'\u2022'} {s}
                  </Text>
                ))}
              </Card>
              <Card variant="soft" padding="md" style={styles.halfCard}>
                <Eyebrow color={colors.royalViolet} showLine={false}>
                  Growth edges
                </Eyebrow>
                {data.archetype.growth.map((g) => (
                  <Text key={g} style={styles.listText}>
                    {'\u2022'} {g}
                  </Text>
                ))}
              </Card>
            </View>
          </Animated.View>
        )}

        {/* CTAs */}
        <Animated.View entering={FadeInUp.duration(500).delay(200)} style={styles.ctas}>
          <Button onPress={handleShare} size="lg" fullWidth>
            Share
          </Button>
          <Button onPress={handleDone} variant="secondary" size="lg" fullWidth>
            Done
          </Button>
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
  shareable: { marginBottom: spacing.md },
  heroCard: {},
  heroName: {
    ...typography.scale.h2,
    color: colors.white,
    marginVertical: spacing.xs,
  },
  heroTagline: {
    ...typography.scale.caption,
    color: colors.pastelLilac,
    marginBottom: spacing.sm + 2,
  },
  heroDesc: {
    ...typography.scale.body,
    color: colors.white,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  badge: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 1,
    borderRadius: radii.full,
    backgroundColor: 'rgba(255,255,255,0.20)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  badgeText: {
    ...typography.scale.caption,
    fontWeight: typography.weights.semibold,
    color: colors.white,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  patternCard: { width: '48%' },
  patternTitle: {
    ...typography.scale.caption,
    fontWeight: typography.weights.medium,
    color: colors.deepSpace,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  halfCard: { flex: 1 },
  listText: {
    ...typography.scale.caption,
    color: colors.deepSpace,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  ctas: { gap: spacing.sm },
})
