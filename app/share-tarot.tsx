// app/share-tarot.tsx

import React, { useRef } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { Screen } from '@/src/design/primitives'
import { Card } from '@/src/design/primitives'
import { Button } from '@/src/design/primitives'
import { colors, typography, spacing, radii, shadows } from '@/src/design/tokens'
import { TAROT_CARDS } from '@/src/lib/tarot'
import { captureAndShare, buildShareMessage } from '@/src/lib/share'

const SUIT_GRADIENTS: Record<string, readonly [string, string, string]> = {
  Major: ['#1a0b2e', '#4a148c', '#311b92'] as const,
  Wands: ['#bf360c', '#e65100', '#ff6f00'] as const,
  Cups: ['#0d47a1', '#1976d2', '#0097a7'] as const,
  Swords: ['#263238', '#455a64', '#78909c'] as const,
  Pentacles: ['#1b5e20', '#2e7d32', '#558b2f'] as const,
}

export default function ShareTarotScreen() {
  const router = useRouter()
  const { cardId, reversed, position } = useLocalSearchParams<{
    cardId: string
    reversed: string
    position: string
  }>()
  const shareRef = useRef<View>(null)

  const card = TAROT_CARDS.find((c) => c.id === cardId)
  const isReversed = reversed === '1'

  if (!card) {
    return (
      <Screen>
        <View style={styles.missing}>
          <Text style={styles.missingText}>Card not found.</Text>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backIcon}>{'<'}</Text>
          </Pressable>
        </View>
      </Screen>
    )
  }

  const gradient = SUIT_GRADIENTS[card.suit] || SUIT_GRADIENTS.Major
  const positionLabel = position
    ? `${position.charAt(0).toUpperCase() + position.slice(1)}${isReversed ? ' \u00B7 Reversed' : ''}`
    : isReversed
      ? 'Reversed'
      : 'Upright'

  const handleShare = async () => {
    const message = buildShareMessage('tarot', {
      cardName: card.name,
      meaning: isReversed ? card.keywords.reversed : card.keywords.upright,
    })
    await captureAndShare(shareRef as React.RefObject<View>, message)
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
          <Text style={styles.headerTitle}>Share</Text>
          <View style={styles.backPlaceholder} />
        </View>

        {/* Shareable card composition */}
        <Animated.View entering={FadeInUp.duration(500)} style={styles.cardWrapper}>
          <View ref={shareRef} style={styles.captureRoot}>
            <LinearGradient
              colors={gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.card}
            >
              <View style={styles.blobTop} />
              <View style={styles.blobBottom} />

              <Text style={styles.brand}>ASTROVY</Text>

              <Text style={[styles.emoji, isReversed && styles.emojiReversed]}>
                {card.emoji}
              </Text>

              <Text style={styles.position}>{positionLabel.toUpperCase()}</Text>

              <Text style={styles.cardName} numberOfLines={2}>
                {card.name}
              </Text>

              <Text style={styles.keywords}>
                {isReversed ? card.keywords.reversed : card.keywords.upright}
              </Text>

              <Text style={styles.meaning}>{card.meaning.free}</Text>

              <View style={styles.tag}>
                <Text style={styles.tagText}>YOUR CARD TODAY</Text>
              </View>

              <View style={styles.footerLine} />
              <Text style={styles.footerBrand}>astrovy.app</Text>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Actions */}
        <Animated.View entering={FadeInUp.duration(500).delay(100)} style={styles.actions}>
          <Button onPress={handleShare} size="lg" fullWidth>
            Share
          </Button>
          <Text style={styles.hint}>Share this card to your story.</Text>
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
  headerTitle: {
    ...typography.scale.h3,
    color: colors.deepSpace,
  },
  cardWrapper: {
    width: '100%',
  },
  captureRoot: {
    width: '100%',
    aspectRatio: 9 / 16,
    borderRadius: radii.xxl,
    overflow: 'hidden',
    ...shadows.cardHover,
  },
  card: {
    flex: 1,
    padding: 28,
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
  },
  blobTop: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -60,
    right: -60,
  },
  blobBottom: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.06)',
    bottom: -40,
    left: -40,
  },
  brand: {
    ...typography.scale.eyebrow,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 4,
    marginTop: spacing.sm + 2,
    textAlign: 'center',
  },
  emoji: {
    fontSize: 96,
    marginTop: spacing.xs,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 8 },
    textShadowRadius: 20,
  },
  emojiReversed: { transform: [{ rotate: '180deg' }] },
  position: {
    ...typography.scale.caption,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 3,
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
    marginTop: -spacing.xs,
  },
  cardName: {
    fontFamily: typography.families.heading,
    fontSize: 38,
    fontWeight: typography.weights.extrabold,
    color: colors.white,
    textAlign: 'center',
    lineHeight: 44,
    letterSpacing: -1,
    paddingHorizontal: spacing.sm,
  },
  keywords: {
    ...typography.scale.caption,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: typography.weights.bold,
    marginTop: -spacing.xs,
  },
  meaning: {
    ...typography.scale.bodyLarge,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: spacing.sm + 2,
    maxWidth: 300,
  },
  tag: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  tagText: {
    ...typography.scale.caption,
    fontWeight: typography.weights.extrabold,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 2,
  },
  footerLine: {
    width: 40,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  footerBrand: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 2,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.xs,
  },
  actions: {
    marginTop: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  hint: {
    ...typography.scale.caption,
    color: colors.cosmicGray,
  },
  missing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  missingText: {
    ...typography.scale.body,
    color: colors.cosmicGray,
  },
})
