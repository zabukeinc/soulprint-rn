// app/horoscope.tsx

import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { Screen } from '@/src/design/primitives'
import { Card } from '@/src/design/primitives'
import { Chip } from '@/src/design/primitives'
import { Eyebrow } from '@/src/design/primitives'
import { colors, typography, spacing, radii, shadows } from '@/src/design/tokens'
import { useProfile } from '@/src/context/ProfileContext'
import {
  calculateNatalChart,
  generateDailyHoroscope,
  getZodiacInfo,
} from '@/src/lib/astrology'

const CATEGORIES = [
  { id: 'overview', label: 'Overview', emoji: '\u2726' },
  { id: 'love', label: 'Love', emoji: '\u{1F495}' },
  { id: 'career', label: 'Career', emoji: '\u{1F9ED}' },
  { id: 'growth', label: 'Growth', emoji: '\u{1F331}' },
] as const

type CategoryId = (typeof CATEGORIES)[number]['id']

export default function HoroscopeScreen() {
  const router = useRouter()
  const { profile } = useProfile()
  const [activeCategory, setActiveCategory] = useState<CategoryId>('overview')

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

  const horoscope = useMemo(() => {
    if (!natal) return null
    return generateDailyHoroscope(natal)
  }, [natal])

  const sunSignInfo = natal ? getZodiacInfo(natal.sun.sign) : null
  const reading = horoscope?.categories[activeCategory] ?? ''
  const moon = horoscope?.moonPhase

  return (
    <Screen>
      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={8}
          >
            <Text style={styles.backIcon}>{'<'}</Text>
          </Pressable>
          <View style={styles.headerCenter}>
            <Eyebrow color={colors.royalViolet} showLine={false}>
              Horoscope
            </Eyebrow>
            <Text style={styles.headerTitle}>Horoscope</Text>
          </View>
          <View style={styles.backPlaceholder} />
        </View>

        {/* Natal chart label */}
        <Animated.View entering={FadeInUp.duration(500).delay(50)}>
          <Card variant="dark" padding="lg" style={styles.chartCard}>
            <Eyebrow color={colors.softLavender}>Your chart</Eyebrow>
            <Text style={styles.chartName}>
              {sunSignInfo ? `${sunSignInfo.name} Sun` : 'Natal chart'}
            </Text>
            <Text style={styles.chartSub}>
              {natal
                ? `Sun in ${sunSignInfo?.name} \u00B7 ${natal.moon.sign} Moon`
                : 'Add your birth date for a personal reading.'}
            </Text>
          </Card>
        </Animated.View>

        {/* Moon phase */}
        {moon && (
          <Animated.View
            entering={FadeInUp.duration(500).delay(100)}
            style={styles.moonCard}
          >
            <View style={styles.moonRow}>
              <Text style={styles.moonEmoji}>{moon.symbol}</Text>
              <View>
                <Eyebrow color={colors.royalViolet} showLine={false}>
                  Moon Phase
                </Eyebrow>
                <Text style={styles.moonPhase}>{moon.name}</Text>
              </View>
              <View style={styles.moonIllum}>
                <Text style={styles.moonIllumText}>{moon.illumination}%</Text>
              </View>
            </View>
            <Text style={styles.moonMeaning}>{moon.meaning}</Text>
          </Animated.View>
        )}

        {/* Category tabs */}
        <Animated.View entering={FadeInUp.duration(500).delay(150)} style={styles.tabs}>
          {CATEGORIES.map((cat) => (
            <Chip
              key={cat.id}
              label={cat.label}
              emoji={cat.emoji}
              selected={activeCategory === cat.id}
              onPress={() => setActiveCategory(cat.id)}
            />
          ))}
        </Animated.View>

        {/* Reading card */}
        <Animated.View entering={FadeInUp.duration(500).delay(200)} key={activeCategory}>
          <Card variant="gradient" padding="lg">
            <Eyebrow color={colors.white}>
              {CATEGORIES.find((c) => c.id === activeCategory)?.label} Reading
            </Eyebrow>
            <Text style={styles.readingText}>{reading}</Text>
            {horoscope && (
              <Text style={styles.affirmation}>{horoscope.affirmation}</Text>
            )}
          </Card>
        </Animated.View>

        {/* Lucky hour */}
        {horoscope && (
          <Animated.View entering={FadeInUp.duration(500).delay(250)} style={styles.luckyCard}>
            <Eyebrow color={colors.royalViolet} showLine={false}>
              Lucky hour
            </Eyebrow>
            <Text style={styles.luckyText}>
              {horoscope.luckyHour}:00 \u2014 energy peaks here today.
            </Text>
          </Animated.View>
        )}
      </Animated.ScrollView>
    </Screen>
  )
}

// Pressable import for back button
import { Pressable } from 'react-native'

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
  chartCard: { marginBottom: spacing.md },
  chartName: {
    ...typography.scale.h2,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  chartSub: {
    ...typography.scale.caption,
    color: colors.softLavender,
  },
  moonCard: {
    borderRadius: radii.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(123,97,255,0.12)',
    ...shadows.card,
  },
  moonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    marginBottom: spacing.xs,
  },
  moonEmoji: { fontSize: 28 },
  moonPhase: {
    ...typography.scale.body,
    fontWeight: typography.weights.semibold,
    color: colors.deepSpace,
  },
  moonIllum: {
    marginLeft: 'auto',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: radii.full,
    backgroundColor: colors.lightBg,
  },
  moonIllumText: {
    ...typography.scale.caption,
    fontWeight: typography.weights.bold,
    color: colors.royalViolet,
  },
  moonMeaning: {
    ...typography.scale.caption,
    color: colors.cosmicGray,
    lineHeight: 20,
  },
  tabs: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  readingText: {
    ...typography.scale.body,
    color: colors.white,
    lineHeight: 26,
  },
  affirmation: {
    ...typography.scale.caption,
    color: colors.pastelLilac,
    fontStyle: 'italic',
    marginTop: spacing.md,
  },
  luckyCard: {
    borderRadius: radii.xl,
    padding: spacing.md,
    backgroundColor: colors.lightBg,
    borderWidth: 1,
    borderColor: 'rgba(123,97,255,0.10)',
  },
  luckyText: {
    ...typography.scale.caption,
    color: colors.deepSpace,
  },
})
