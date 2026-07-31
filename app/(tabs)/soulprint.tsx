// app/(tabs)/soulprint.tsx

import React, { useMemo, useState } from 'react'
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { Screen, Card, Eyebrow, Button, Badge } from '@/src/design/primitives'
import { colors, typography, spacing, radii } from '@/src/design/tokens'
import { useProfile } from '@/src/context/ProfileContext'
import { useTier } from '@/src/context/TierContext'
import {
  calculateNatalChart,
  deriveArchetype,
  calculateLifePath,
  getZodiacSign,
  getZodiacInfo,
  type NatalChart,
  type Archetype,
  type Planet,
} from '@/src/lib/astrology'

type SectionId = 'chart' | 'patterns' | 'strengths' | 'growth'

interface Section {
  id: SectionId
  title: string
}

const SECTIONS: Section[] = [
  { id: 'chart', title: 'Your chart' },
  { id: 'patterns', title: 'Your patterns' },
  { id: 'strengths', title: 'Your strengths' },
  { id: 'growth', title: 'Growth areas' },
]

const PLANET_LABELS: Record<Planet, string> = {
  sun: 'Sun',
  moon: 'Moon',
  mercury: 'Mercury',
  venus: 'Venus',
  mars: 'Mars',
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export default function SoulprintScreen() {
  const router = useRouter()
  const { profile } = useProfile()
  const { isPremium } = useTier()
  const [expandedId, setExpandedId] = useState<SectionId | null>('chart')

  const computed = useMemo(() => {
    if (!profile?.birth?.date) return null
    const [year, month, day] = profile.birth.date.split('-').map(Number)
    if (!year || !month || !day) return null

    const zodiacSign = getZodiacSign(month, day)
    const lifePath = calculateLifePath(year, month, day)
    const focus = profile.focus || 'purpose'

    const loc = profile.birth.location
    const natalChart = calculateNatalChart({
      date: profile.birth.date,
      time: profile.birth.time,
      location: {
        city: loc.city || 'Unknown',
        lat: loc.lat ?? 0,
        lng: loc.lng ?? 0,
        timezone: loc.timezone || 'UTC',
      },
    })

    const archetype = deriveArchetype(zodiacSign, lifePath, focus)
    const zodiacInfo = getZodiacInfo(zodiacSign)

    return { natalChart, archetype, zodiacInfo, lifePath }
  }, [profile])

  const toggleSection = (id: SectionId) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  const renderSectionContent = (id: SectionId) => {
    if (!computed) return null

    if (id === 'chart') {
      const planets: Planet[] = ['sun', 'moon', 'mercury', 'venus', 'mars']
      return (
        <View style={styles.sectionBody}>
          {planets.map((p) => {
            const pos = computed.natalChart[p]
            return (
              <View key={p} style={styles.planetRow}>
                <View style={styles.planetLabelCol}>
                  <Text style={styles.planetName}>{PLANET_LABELS[p]}</Text>
                  <Text style={styles.planetSign}>
                    {capitalize(pos.sign)} · {Math.floor(pos.degrees)}°
                  </Text>
                </View>
                <Text style={styles.planetMeaning}>{pos.meaning}</Text>
              </View>
            )
          })}
        </View>
      )
    }

    const list = id === 'patterns'
      ? computed.archetype.patterns
      : id === 'strengths'
        ? computed.archetype.strengths
        : computed.archetype.growth

    return (
      <View style={styles.sectionBody}>
        {list.map((item, i) => (
          <View key={`${id}-${i}`} style={styles.listItem}>
            <Text style={styles.listBullet}>·</Text>
            <Text style={styles.listText}>{item}</Text>
          </View>
        ))}
      </View>
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
          <Eyebrow>Astro</Eyebrow>
          <Text style={styles.headerTitle}>Your Astro</Text>
        </Animated.View>

        {computed ? (
          <Animated.View entering={FadeInUp.duration(500).delay(80)}>
            <Card variant="gradient" padding="lg" style={styles.heroCard}>
              <Text style={styles.heroLabel}>Core Archetype</Text>
              <Text style={styles.heroName}>{computed.archetype.name}</Text>
              <Text style={styles.heroTagline}>{computed.archetype.tagline}</Text>
              <Text style={styles.heroDesc}>{computed.archetype.description}</Text>
              <View style={styles.heroBadges}>
                <Badge variant="astrology">
                  {computed.zodiacInfo.name} Sun
                </Badge>
                <Badge variant="astrology">Life Path {computed.lifePath}</Badge>
                <Badge variant="astrology">
                  {capitalize(profile?.focus || 'Purpose')}
                </Badge>
              </View>
            </Card>
          </Animated.View>
        ) : (
          <Card variant="light" padding="lg" style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No chart yet</Text>
            <Text style={styles.emptyText}>
              Complete your profile to see your natal chart and archetype.
            </Text>
          </Card>
        )}

        <View style={styles.sections}>
          {SECTIONS.map((section, index) => {
            const isExpanded = expandedId === section.id
            return (
              <Animated.View
                key={section.id}
                entering={FadeInUp.duration(500).delay(150 + index * 70)}
              >
                <Card variant="light" padding="lg" style={styles.sectionCard}>
                  <Pressable
                    onPress={() => toggleSection(section.id)}
                    style={styles.sectionHeader}
                    accessibilityRole="button"
                    accessibilityState={{ expanded: isExpanded }}
                  >
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                    <Text style={styles.expandArrow}>{isExpanded ? '−' : '+'}</Text>
                  </Pressable>
                  {isExpanded && renderSectionContent(section.id)}
                </Card>
              </Animated.View>
            )
          })}
        </View>

        <View style={styles.ctaRow}>
          <Animated.View
            entering={FadeInUp.duration(500).delay(500)}
            style={styles.ctaCol}
          >
            {!isPremium && (
              <Button
                variant="primary"
                fullWidth
                onPress={() => router.push('/pricing')}
              >
                Unlock full reading
              </Button>
            )}
            <Button
              variant={isPremium ? 'primary' : 'secondary'}
              fullWidth
              onPress={() => router.push('/snapshot')}
            >
              Save snapshot
            </Button>
          </Animated.View>
        </View>
      </ScrollView>
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
  headerTitle: {
    ...typography.scale.h1,
    color: colors.deepSpace,
    marginBottom: spacing.lg,
  },
  heroCard: { marginBottom: spacing.lg },
  heroLabel: {
    ...typography.scale.eyebrow,
    color: colors.white,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    opacity: 0.85,
  },
  heroName: {
    ...typography.scale.h2,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  heroTagline: {
    ...typography.scale.caption,
    color: colors.pastelLilac,
    marginBottom: spacing.md,
  },
  heroDesc: {
    ...typography.scale.body,
    color: colors.white,
    marginBottom: spacing.md,
    opacity: 0.9,
  },
  heroBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  emptyCard: { marginBottom: spacing.lg },
  emptyTitle: {
    ...typography.scale.h3,
    color: colors.deepSpace,
    marginBottom: spacing.xs,
  },
  emptyText: {
    ...typography.scale.body,
    color: colors.cosmicGray,
  },
  sections: { gap: spacing.md, marginBottom: spacing.lg },
  sectionCard: { padding: spacing.lg },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    ...typography.scale.h3,
    color: colors.deepSpace,
  },
  expandArrow: {
    fontSize: 22,
    color: colors.royalViolet,
    fontWeight: typography.weights.bold,
  },
  sectionBody: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(123,97,255,0.10)',
  },
  planetRow: {
    marginBottom: spacing.md,
  },
  planetLabelCol: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
    marginBottom: 4,
  },
  planetName: {
    ...typography.scale.body,
    fontWeight: typography.weights.semibold,
    color: colors.deepSpace,
  },
  planetSign: {
    ...typography.scale.caption,
    color: colors.royalViolet,
    fontWeight: typography.weights.semibold,
  },
  planetMeaning: {
    ...typography.scale.body,
    color: colors.cosmicGray,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  listBullet: {
    ...typography.scale.body,
    color: colors.royalViolet,
    fontWeight: typography.weights.bold,
    lineHeight: 24,
  },
  listText: {
    ...typography.scale.body,
    color: colors.deepSpace,
    flex: 1,
  },
  ctaRow: { marginTop: spacing.sm },
  ctaCol: { gap: spacing.sm },
})
