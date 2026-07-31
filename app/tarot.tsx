// app/tarot.tsx

import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { Screen } from '@/src/design/primitives'
import { Card } from '@/src/design/primitives'
import { Button } from '@/src/design/primitives'
import { Eyebrow } from '@/src/design/primitives'
import { colors, typography, spacing, radii, shadows } from '@/src/design/tokens'
import { useProfile } from '@/src/context/ProfileContext'
import { useTier } from '@/src/context/TierContext'
import { useEngagement } from '@/src/hooks/useEngagement'
import {
  calculateNatalChart,
  calculateLifePath,
  getZodiacSign,
  deriveArchetype,
} from '@/src/lib/astrology'
import { drawSingleCard, drawSpread, getPositionMeaning } from '@/src/lib/tarotEngine'
import { TAROT_CARDS } from '@/src/lib/tarot'

type Position = 'past' | 'present' | 'future'

interface DrawnCard {
  cardId: string
  reversed: boolean
  position: Position
}

export default function TarotScreen() {
  const router = useRouter()
  const { isPremium } = useTier()
  const engagement = useEngagement()
  const { profile } = useProfile()

  const archetype = useMemo(() => {
    if (!profile?.birth?.date) return 'Quiet Strategist'
    const [y, m, d] = profile.birth.date.split('-').map(Number)
    const sign = getZodiacSign(m, d)
    const lifePath = calculateLifePath(y, m, d)
    const a = deriveArchetype(sign, lifePath, profile.focus || 'purpose')
    return a.name.replace(/^The\s+/, '')
  }, [profile])

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

  const todayCards = engagement?.todayTarotCards ?? []
  const initialDrawn: DrawnCard[] = todayCards.map((c) => ({
    cardId: c.cardId,
    reversed: c.reversed,
    position: c.position,
  }))

  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>(initialDrawn)
  const [revealedIndex, setRevealedIndex] = useState(
    initialDrawn.length > 0 ? initialDrawn.length - 1 : 0,
  )

  useEffect(() => {
    if (todayCards.length > 0 && drawnCards.length === 0) {
      const restored = todayCards.map((c) => ({
        cardId: c.cardId,
        reversed: c.reversed,
        position: c.position,
      }))
      setDrawnCards(restored)
      setRevealedIndex(restored.length - 1)
    }
  }, [engagement?.todayTarotCards])

  const canDraw = engagement?.canDrawTarot?.(isPremium) ?? true
  const drawsRemaining = engagement?.getTarotDrawsRemaining?.(isPremium) ?? (isPremium ? 3 : 1)

  const handleDraw = useCallback(() => {
    if (!canDraw) return

    if (isPremium) {
      const spread = drawSpread(archetype, true)
      const cards: DrawnCard[] = [
        { cardId: spread.past.card.id, reversed: spread.past.reversed, position: 'past' },
        { cardId: spread.present.card.id, reversed: spread.present.reversed, position: 'present' },
        { cardId: spread.future.card.id, reversed: spread.future.reversed, position: 'future' },
      ]
      setDrawnCards(cards)
      setRevealedIndex(0)
      cards.forEach((c) => engagement?.drawTarotCard?.(c.cardId, c.reversed, c.position))
    } else {
      const result = drawSingleCard(archetype, true)
      const card: DrawnCard = {
        cardId: result.card.id,
        reversed: result.reversed,
        position: result.position,
      }
      setDrawnCards([card])
      setRevealedIndex(0)
      engagement?.drawTarotCard?.(card.cardId, card.reversed, card.position)
    }
  }, [canDraw, archetype, engagement, isPremium])

  const handleRevealNext = () => {
    if (revealedIndex < drawnCards.length - 1) {
      setRevealedIndex((prev) => prev + 1)
    }
  }

  const handleShare = (card: DrawnCard) => {
    router.push({
      pathname: '/share-tarot',
      params: {
        cardId: card.cardId,
        reversed: card.reversed ? '1' : '0',
        position: card.position,
      },
    })
  }

  const getCard = (cardId: string) => TAROT_CARDS.find((c) => c.id === cardId)!

  const allRevealed = revealedIndex >= drawnCards.length - 1
  const isSingleCard = drawnCards.length === 1
  const hasDrawn = drawnCards.length > 0

  const drawLabel = !hasDrawn
    ? 'Draw'
    : allRevealed
      ? canDraw
        ? 'Draw again'
        : 'Return tomorrow'
      : 'Reveal'

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
              Tarot
            </Eyebrow>
            <Text style={styles.headerTitle}>
              {isPremium ? 'Your three-card spread.' : 'Your card for today.'}
            </Text>
          </View>
          <View style={styles.backPlaceholder} />
        </View>

        {!hasDrawn && (
          <Animated.View entering={FadeInUp.duration(500)} style={styles.drawSection}>
            <View style={styles.drawIconBg}>
              <Text style={styles.drawIcon}>{'\u{1F0CF}'}</Text>
            </View>
            <Text style={styles.drawTitle}>
              {canDraw ? 'Draw your card' : 'No draws left today'}
            </Text>
            <Text style={styles.drawSub}>
              {canDraw
                ? isPremium
                  ? `${drawsRemaining} spreads remaining today`
                  : '1 free card per day'
                : 'Return tomorrow for a new reading'}
            </Text>
            {canDraw ? (
              <Button onPress={handleDraw} size="lg" fullWidth>
                {drawLabel}
              </Button>
            ) : (
              <Text style={styles.limitMessage}>Return tomorrow</Text>
            )}
            {!isPremium && (
              <Pressable
                onPress={() => router.push('/pricing')}
                style={styles.upgradeHint}
              >
                <Text style={styles.upgradeHintText}>
                  {'\u2726'} Unlock your three-card spread
                </Text>
              </Pressable>
            )}
          </Animated.View>
        )}

        {hasDrawn && (
          <View style={styles.spread}>
            {drawnCards.map((drawn, index) => {
              const card = getCard(drawn.cardId)
              const isRevealed = index <= revealedIndex
              if (!isRevealed) return null

              return (
                <Animated.View
                  key={`${drawn.position}-${drawn.cardId}`}
                  entering={FadeInUp.duration(500).delay(index * 200)}
                >
                  <Card variant="gradient" padding="lg" style={styles.cardBody}>
                    {!isSingleCard && (
                      <View style={styles.cardHeader}>
                        <Text style={styles.cardPosition}>{drawn.position}</Text>
                        <Text style={styles.cardPositionMeaning}>
                          {getPositionMeaning(drawn.position)}
                        </Text>
                      </View>
                    )}
                    <View style={styles.cardEmojiRow}>
                      <Text
                        style={[styles.cardEmoji, drawn.reversed && styles.cardEmojiReversed]}
                      >
                        {card.emoji}
                      </Text>
                      {drawn.reversed && (
                        <View style={styles.reversedBadge}>
                          <Text style={styles.reversedBadgeText}>Reversed</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.cardName}>{card.name}</Text>
                    <Text style={styles.cardKeywords}>
                      {drawn.reversed ? card.keywords.reversed : card.keywords.upright}
                    </Text>
                    <Text style={styles.cardMeaning}>
                      {isPremium ? card.meaning.premium : card.meaning.free}
                    </Text>
                  </Card>
                  <Pressable
                    style={styles.shareBtn}
                    onPress={() => handleShare(drawn)}
                  >
                    <Text style={styles.shareBtnText}>Share {'\u2192'}</Text>
                  </Pressable>
                </Animated.View>
              )
            })}

            {!allRevealed && !isSingleCard && (
              <Button onPress={handleRevealNext} size="md" fullWidth>
                {drawLabel} {drawnCards[revealedIndex + 1]?.position}
              </Button>
            )}

            {allRevealed && (
              <View style={styles.completeMessage}>
                <Text style={styles.completeText}>
                  {isPremium ? 'Your reading is complete.' : 'Your card is revealed.'}
                </Text>
                <Text style={styles.completeSub}>
                  {canDraw
                    ? isPremium
                      ? 'Draw again or return tomorrow.'
                      : 'Come back tomorrow for a new card.'
                    : 'Return tomorrow for a new reading.'}
                </Text>
                {canDraw && (
                  <Button onPress={handleDraw} size="md" fullWidth>
                    {drawLabel}
                  </Button>
                )}
                {!isPremium && (
                  <Pressable
                    onPress={() => router.push('/pricing')}
                    style={styles.upgradeHint}
                  >
                    <Text style={styles.upgradeHintText}>
                      {'\u2726'} Unlock your three-card spread
                    </Text>
                  </Pressable>
                )}
              </View>
            )}
          </View>
        )}

        {natal && (
          <View style={styles.chartNote}>
            <Eyebrow>Your chart</Eyebrow>
            <Text style={styles.chartNoteText}>
              Readings tuned to {archetype}.
            </Text>
          </View>
        )}
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
  drawSection: { alignItems: 'center', paddingVertical: spacing.xl },
  drawIconBg: {
    width: 80,
    height: 80,
    borderRadius: 32,
    backgroundColor: colors.pastelLilac,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadows.card,
  },
  drawIcon: { fontSize: 36 },
  drawTitle: {
    ...typography.scale.h3,
    color: colors.deepSpace,
    marginBottom: spacing.xs,
  },
  drawSub: {
    ...typography.scale.caption,
    color: colors.cosmicGray,
    marginBottom: spacing.lg,
  },
  limitMessage: {
    ...typography.scale.body,
    color: colors.cosmicGray,
    paddingVertical: spacing.md,
  },
  upgradeHint: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radii.full,
    backgroundColor: colors.lightBg,
    borderWidth: 1,
    borderColor: colors.pastelLilac,
  },
  upgradeHintText: {
    ...typography.scale.caption,
    fontWeight: typography.weights.bold,
    color: colors.royalViolet,
  },
  spread: { gap: spacing.md },
  cardBody: { marginBottom: spacing.sm },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  cardPosition: {
    ...typography.scale.eyebrow,
    color: colors.white,
    textTransform: 'uppercase',
  },
  cardPositionMeaning: {
    ...typography.scale.caption,
    color: colors.pastelLilac,
  },
  cardEmojiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm + 2,
  },
  cardEmoji: { fontSize: 40 },
  cardEmojiReversed: { transform: [{ rotate: '180deg' }] },
  reversedBadge: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: radii.full,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  reversedBadgeText: {
    ...typography.scale.caption,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },
  cardName: {
    ...typography.scale.h3,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  cardKeywords: {
    ...typography.scale.caption,
    color: colors.pastelLilac,
    marginBottom: spacing.sm + 2,
    fontStyle: 'italic',
  },
  cardMeaning: {
    ...typography.scale.body,
    color: colors.white,
  },
  shareBtn: {
    marginTop: spacing.xs,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  shareBtnText: {
    ...typography.scale.caption,
    fontWeight: typography.weights.bold,
    color: colors.royalViolet,
  },
  completeMessage: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.xs,
  },
  completeText: {
    ...typography.scale.h3,
    color: colors.deepSpace,
    marginBottom: spacing.xs,
  },
  completeSub: {
    ...typography.scale.caption,
    color: colors.cosmicGray,
    marginBottom: spacing.md,
  },
  chartNote: { marginTop: spacing.lg },
  chartNoteText: {
    ...typography.scale.caption,
    color: colors.cosmicGray,
  },
})
