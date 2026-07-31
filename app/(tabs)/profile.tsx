// app/(tabs)/profile.tsx

import React, { useMemo } from 'react'
import { View, Text, Pressable, Alert, ScrollView, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { Screen, Card, Button, Badge } from '@/src/design/primitives'
import { colors, typography, spacing } from '@/src/design/tokens'
import { useProfile } from '@/src/context/ProfileContext'
import { useTier } from '@/src/context/TierContext'
import { useEngagement } from '@/src/hooks/useEngagement'
import {
  getZodiacSign,
  getZodiacInfo,
  calculateLifePath,
} from '@/src/lib/astrology'

export default function ProfileScreen() {
  const router = useRouter()
  const { profile } = useProfile()
  const { isPremium, toggleTier } = useTier()
  const engagement = useEngagement()

  const identity = useMemo(() => {
    if (!profile?.birth?.date) return null
    const [year, month, day] = profile.birth.date.split('-').map(Number)
    if (!year || !month || !day) return null

    const sign = getZodiacSign(month, day)
    const zodiac = getZodiacInfo(sign).name
    const lifePath = calculateLifePath(year, month, day)

    return { zodiac, lifePath }
  }, [profile])

  const name = profile?.name || 'Friend'
  const focus = profile?.focus
    ? profile.focus.charAt(0).toUpperCase() + profile.focus.slice(1)
    : '—'
  const city = profile?.birth?.location?.city || '—'

  const handleDelete = () => {
    Alert.alert(
      'Delete all data?',
      'This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await engagement.clearAllData()
            router.replace('/(onboarding)/welcome')
          },
        },
      ],
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
          <Text style={styles.headerTitle}>Profile</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(500).delay(80)}>
          <Card variant="light" padding="lg" style={styles.identityCard}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{name}</Text>
              <Badge variant={isPremium ? 'premium' : 'free'}>
                {isPremium ? 'Premium' : 'Free plan'}
              </Badge>
            </View>

            <View style={styles.identityGrid}>
              <View style={styles.identityItem}>
                <Text style={styles.identityLabel}>Zodiac</Text>
                <Text style={styles.identityValue}>
                  {identity?.zodiac ?? '—'}
                </Text>
              </View>
              <View style={styles.identityItem}>
                <Text style={styles.identityLabel}>Life Path</Text>
                <Text style={styles.identityValue}>
                  {identity?.lifePath ?? '—'}
                </Text>
              </View>
              <View style={styles.identityItem}>
                <Text style={styles.identityLabel}>Focus</Text>
                <Text style={styles.identityValue}>{focus}</Text>
              </View>
              <View style={styles.identityItem}>
                <Text style={styles.identityLabel}>City</Text>
                <Text style={styles.identityValue}>{city}</Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(500).delay(160)}>
          <Card variant="light" padding="lg" style={styles.tierCard}>
            <View style={styles.tierRow}>
              <View style={styles.tierTextCol}>
                <Text style={styles.tierTitle}>Premium (demo)</Text>
                <Text style={styles.tierSub}>
                  {isPremium ? 'Premium active' : 'Free plan'}
                </Text>
              </View>
              <Pressable
                onPress={toggleTier}
                style={[
                  styles.toggle,
                  isPremium ? styles.toggleOn : styles.toggleOff,
                ]}
                accessibilityRole="switch"
                accessibilityState={{ checked: isPremium }}
              >
                <View
                  style={[
                    styles.toggleKnob,
                    isPremium ? styles.knobOn : styles.knobOff,
                  ]}
                />
              </Pressable>
            </View>
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(500).delay(240)}>
          <Card variant="light" padding="lg" style={styles.settingsCard}>
            <Pressable
              style={styles.settingsRow}
              onPress={() => router.push('/pricing')}
              accessibilityRole="button"
            >
              <Text style={styles.settingsLabel}>Subscription</Text>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
            <View style={styles.settingsDivider} />
            <Pressable
              style={styles.settingsRow}
              onPress={handleDelete}
              accessibilityRole="button"
            >
              <Text style={[styles.settingsLabel, styles.deleteText]}>
                Delete account
              </Text>
              <Text style={[styles.chevron, styles.deleteChevron]}>›</Text>
            </Pressable>
          </Card>
        </Animated.View>
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
  identityCard: { marginBottom: spacing.md },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  name: {
    ...typography.scale.h2,
    color: colors.deepSpace,
  },
  identityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  identityItem: {
    width: '48%',
  },
  identityLabel: {
    ...typography.scale.caption,
    color: colors.cosmicGray,
    marginBottom: 4,
  },
  identityValue: {
    ...typography.scale.body,
    fontWeight: typography.weights.semibold,
    color: colors.deepSpace,
  },
  tierCard: { marginBottom: spacing.md },
  tierRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tierTextCol: { flex: 1 },
  tierTitle: {
    ...typography.scale.body,
    fontWeight: typography.weights.semibold,
    color: colors.deepSpace,
    marginBottom: 2,
  },
  tierSub: {
    ...typography.scale.caption,
    color: colors.cosmicGray,
  },
  toggle: {
    width: 52,
    height: 30,
    borderRadius: 15,
    padding: 3,
    justifyContent: 'center',
  },
  toggleOn: {
    backgroundColor: colors.royalViolet,
  },
  toggleOff: {
    backgroundColor: 'rgba(15,15,35,0.15)',
  },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
  },
  knobOn: {
    alignSelf: 'flex-end',
  },
  knobOff: {
    alignSelf: 'flex-start',
  },
  settingsCard: { padding: 0, overflow: 'hidden' },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  settingsLabel: {
    ...typography.scale.body,
    color: colors.deepSpace,
  },
  chevron: {
    fontSize: 22,
    color: colors.cosmicGray,
    fontWeight: typography.weights.bold,
  },
  settingsDivider: {
    height: 1,
    backgroundColor: 'rgba(123,97,255,0.10)',
    marginHorizontal: spacing.lg,
  },
  deleteText: {
    color: '#D93025',
  },
  deleteChevron: {
    color: '#D93025',
  },
})
