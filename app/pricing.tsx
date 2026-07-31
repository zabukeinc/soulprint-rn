// app/pricing.tsx

import React, { useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { Screen } from '@/src/design/primitives'
import { Card } from '@/src/design/primitives'
import { Button } from '@/src/design/primitives'
import { Badge } from '@/src/design/primitives'
import { Eyebrow } from '@/src/design/primitives'
import { colors, typography, spacing, radii, shadows } from '@/src/design/tokens'
import { useTier } from '@/src/context/TierContext'

type Plan = 'monthly' | 'annual'

const FEATURES = [
  'Full natal chart',
  'Weekly personalized readings',
  'Compatibility with any sign',
  'Three-card daily tarot',
  'Unlimited journal history',
]

export default function PricingScreen() {
  const router = useRouter()
  const { upgrade } = useTier()
  const [plan, setPlan] = useState<Plan>('annual')

  const price = plan === 'monthly' ? '9' : '6'
  const priceSub = plan === 'monthly' ? '/month' : '/month'

  const handleStartPremium = () => {
    upgrade()
    router.back()
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
              Premium
            </Eyebrow>
            <Text style={styles.headerTitle}>Astrovy Premium</Text>
          </View>
          <View style={styles.backPlaceholder} />
        </View>

        {/* Subtitle */}
        <Animated.View entering={FadeInUp.duration(500)} style={styles.subtitleWrap}>
          <Text style={styles.subtitle}>
            Every reading, every week, every sign {'\u2014'} yours.
          </Text>
        </Animated.View>

        {/* Plan toggle */}
        <Animated.View entering={FadeInUp.duration(500).delay(50)} style={styles.toggle}>
          <Pressable
            onPress={() => setPlan('monthly')}
            style={[styles.toggleBtn, plan === 'monthly' && styles.toggleBtnActive]}
          >
            <Text
              style={[
                styles.toggleText,
                plan === 'monthly' && styles.toggleTextActive,
              ]}
            >
              Monthly
            </Text>
            <Text
              style={[
                styles.toggleSub,
                plan === 'monthly' && styles.toggleSubActive,
              ]}
            >
              $9/mo
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setPlan('annual')}
            style={[styles.toggleBtn, plan === 'annual' && styles.toggleBtnActive]}
          >
            <Text
              style={[
                styles.toggleText,
                plan === 'annual' && styles.toggleTextActive,
              ]}
            >
              Annual
            </Text>
            <Text
              style={[
                styles.toggleSub,
                plan === 'annual' && styles.toggleSubActive,
              ]}
            >
              $6/mo
            </Text>
            {plan === 'annual' && (
              <View style={styles.saveBadge}>
                <Text style={styles.saveBadgeText}>Save $36</Text>
              </View>
            )}
          </Pressable>
        </Animated.View>

        {/* Price card */}
        <Animated.View entering={FadeInUp.duration(500).delay(100)}>
          <Card variant="gradient" padding="lg" style={styles.priceCard}>
            <Eyebrow color={colors.white}>Selected plan</Eyebrow>
            <View style={styles.priceRow}>
              <View>
                <Text style={styles.planName}>
                  {plan === 'monthly' ? 'Monthly' : 'Annual'}
                </Text>
                <Text style={styles.planSub}>
                  {plan === 'monthly' ? 'Billed monthly' : '$72 billed yearly'}
                </Text>
              </View>
              <View style={styles.priceBox}>
                <Text style={styles.price}>${price}</Text>
                <Text style={styles.priceSub}>{priceSub}</Text>
              </View>
            </View>
            <View style={styles.cancelRow}>
              <View style={styles.cancelDot} />
              <Text style={styles.cancelText}>Cancel anytime</Text>
            </View>
          </Card>
        </Animated.View>

        {/* Features */}
        <Animated.View entering={FadeInUp.duration(500).delay(150)}>
          <Card variant="light" padding="lg" style={styles.featuresCard}>
            <Eyebrow>What you unlock</Eyebrow>
            {FEATURES.map((feature) => (
              <View key={feature} style={styles.featureRow}>
                <View style={styles.featureDot} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </Card>
        </Animated.View>

        {/* CTAs */}
        <Animated.View entering={FadeInUp.duration(500).delay(200)} style={styles.ctas}>
          <Button onPress={handleStartPremium} size="lg" fullWidth>
            Start Premium
          </Button>
          <Pressable onPress={() => router.back()} style={styles.secondaryBtn}>
            <Text style={styles.secondaryText}>Maybe later</Text>
          </Pressable>
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
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
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
  subtitleWrap: { alignItems: 'center', marginBottom: spacing.lg },
  subtitle: {
    ...typography.scale.body,
    color: colors.cosmicGray,
    textAlign: 'center',
    lineHeight: 24,
  },
  toggle: {
    flexDirection: 'row',
    gap: spacing.xs,
    padding: spacing.xs,
    backgroundColor: colors.white,
    borderRadius: radii.xxl,
    borderWidth: 1,
    borderColor: 'rgba(123,97,255,0.12)',
    marginBottom: spacing.md,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    borderRadius: radii.xl,
    alignItems: 'center',
    position: 'relative',
  },
  toggleBtnActive: {
    backgroundColor: colors.royalViolet,
  },
  toggleText: {
    ...typography.scale.caption,
    fontWeight: typography.weights.bold,
    color: colors.cosmicGray,
  },
  toggleTextActive: { color: colors.white },
  toggleSub: {
    ...typography.scale.caption,
    color: colors.cosmicGray,
    marginTop: 2,
  },
  toggleSubActive: { color: colors.pastelLilac },
  saveBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radii.full,
    backgroundColor: colors.pastelLilac,
    borderWidth: 2,
    borderColor: colors.white,
  },
  saveBadgeText: {
    fontSize: 9,
    fontWeight: typography.weights.extrabold,
    color: colors.royalViolet,
  },
  priceCard: { marginBottom: spacing.md },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginVertical: spacing.sm,
  },
  planName: {
    ...typography.scale.h2,
    color: colors.white,
  },
  planSub: {
    ...typography.scale.caption,
    color: colors.pastelLilac,
  },
  priceBox: { alignItems: 'flex-end' },
  price: {
    fontFamily: typography.families.heading,
    fontSize: 40,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },
  priceSub: {
    ...typography.scale.caption,
    color: colors.pastelLilac,
  },
  cancelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  cancelDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16A7A0',
  },
  cancelText: {
    ...typography.scale.caption,
    color: colors.pastelLilac,
  },
  featuresCard: { marginBottom: spacing.md },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm + 2,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.royalViolet,
  },
  featureText: {
    ...typography.scale.body,
    color: colors.deepSpace,
  },
  ctas: { gap: spacing.sm },
  secondaryBtn: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  secondaryText: {
    ...typography.scale.body,
    color: colors.cosmicGray,
    fontWeight: typography.weights.medium,
  },
})
