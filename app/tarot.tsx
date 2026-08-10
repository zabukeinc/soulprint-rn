import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTier } from '@/src/context/TierContext';
import { useEngagement } from '@/src/hooks/useEngagement';
import { theme } from '@/src/lib/theme';
import { getPositionMeaning } from '@/src/lib/tarotEngine';
import { TAROT_CARDS } from '@/src/lib/tarot';
import { InlineRefreshing, SkeletonBlock, SkeletonCard } from '@/src/components/LoadingState';
import { TarotArtworkCard } from '@/src/components/TarotArtworkCard';
import type { TarotVisual } from '@/src/services/backend';

type Position = 'past' | 'present' | 'future';

interface DrawnCard {
  cardId: string;
  reversed: boolean;
  position: Position;
  name?: string;
  emoji?: string;
  keywords?: unknown;
  visual?: TarotVisual;
  meaning?: string;
  interpretation?: {
    meaning?: string;
    reflectionPrompt?: string;
    action?: string;
    shadowNote?: string;
    source?: string;
  } | null;
}

export default function TarotScreen() {
  const router = useRouter();
  const { isPremium } = useTier();
  const engagement = useEngagement();

  // Restore today's drawn cards from persisted state
  const todayCards = engagement?.todayTarotCards || [];
  const initialDrawn: DrawnCard[] = todayCards.map((c) => ({
    cardId: c.cardId,
    reversed: c.reversed,
    position: c.position,
    name: c.backend?.name,
    emoji: c.backend?.emoji,
    keywords: c.backend?.keywords,
    visual: c.backend?.visual,
    meaning: c.backend?.meaning,
    interpretation: c.backend?.interpretation,
  }));

  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>(initialDrawn);
  const [revealedIndex, setRevealedIndex] = useState(initialDrawn.length > 0 ? initialDrawn.length - 1 : 0);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    // Re-sync if engagement loads after mount
    if (todayCards.length > 0 && drawnCards.length === 0) {
      const restored = todayCards.map((c) => ({
        cardId: c.cardId,
        reversed: c.reversed,
        position: c.position,
        name: c.backend?.name,
        emoji: c.backend?.emoji,
        keywords: c.backend?.keywords,
        visual: c.backend?.visual,
        meaning: c.backend?.meaning,
        interpretation: c.backend?.interpretation,
      }));
      setDrawnCards(restored);
      setRevealedIndex(restored.length - 1);
    }
  }, [engagement?.todayTarotCards]);

  const canDraw = engagement?.canDrawTarot?.(isPremium) ?? true;
  const drawsRemaining = engagement?.getTarotDrawsRemaining?.(isPremium) ?? (isPremium ? 3 : 1);

  const handleDraw = useCallback(async () => {
    if (!canDraw || drawing) return;
    setDrawing(true);
    const draw = isPremium ? engagement?.drawTarotSpread?.() : engagement?.drawTarotCard?.();
    try {
      const result = await draw;
      if (!result) return;
      const cards = result.draws.map((card: any) => ({
        cardId: card.cardId,
        reversed: card.reversed,
        position: card.position,
        name: card.name,
        emoji: card.emoji,
        keywords: card.keywords,
        visual: card.visual,
        meaning: card.meaning,
        interpretation: card.interpretation,
      }));
      setDrawnCards(cards);
      setRevealedIndex(0);
    } finally {
      setDrawing(false);
    }
  }, [canDraw, drawing, engagement, isPremium]);

  const handleRevealNext = () => {
    if (revealedIndex < drawnCards.length - 1) {
      setRevealedIndex((prev) => prev + 1);
    }
  };

  const handleShare = (card: DrawnCard) => {
    router.push({
      pathname: '/share-tarot',
      params: {
        cardId: card.cardId,
        reversed: card.reversed ? '1' : '0',
        position: card.position,
      },
    });
  };

  const getCard = (drawn: DrawnCard) => {
    const fallback = TAROT_CARDS.find((c) => c.id === drawn.cardId);
    const keywords = Array.isArray(drawn.keywords)
      ? drawn.keywords.join(', ')
      : fallback
        ? drawn.reversed
          ? fallback.keywords.reversed
          : fallback.keywords.upright
        : '';
    return {
      name: drawn.name ?? fallback?.name ?? drawn.cardId,
      emoji: drawn.emoji ?? fallback?.emoji ?? '✦',
      keywords,
      visual: drawn.visual,
      meaning: drawn.interpretation?.meaning ?? drawn.meaning ?? (fallback ? (isPremium ? fallback.meaning.premium : fallback.meaning.free) : ''),
      reflectionPrompt: drawn.interpretation?.reflectionPrompt,
      action: drawn.interpretation?.action,
      shadowNote: drawn.interpretation?.shadowNote,
    };
  };

  const allRevealed = revealedIndex >= drawnCards.length - 1;
  const isSingleCard = drawnCards.length === 1;

  if (!engagement.loaded && engagement.loading) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerLabel}>Daily Tarot</Text>
            <Text style={styles.headerTitle}>{isPremium ? 'Your three-card spread' : 'Your daily card'}</Text>
          </View>
          <View style={styles.backButtonPlaceholder} />
        </View>
        <SkeletonBlock width="92%" height={12} radius={6} style={{ alignSelf: 'center', marginBottom: 8 }} />
        <SkeletonBlock width="64%" height={12} radius={6} style={{ alignSelf: 'center', marginBottom: 28 }} />
        <SkeletonCard height={260} lines={3} />
        <View style={styles.spread}>
          {[0, 1, 2].slice(0, isPremium ? 3 : 1).map((item) => (
            <SkeletonCard key={item} height={180} lines={2} style={{ marginTop: 14 }} />
          ))}
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerLabel}>Daily Tarot</Text>
          <Text style={styles.headerTitle}>
            {isPremium ? 'Your three-card spread' : 'Your daily card'}
          </Text>
        </View>
        <View style={styles.backButtonPlaceholder} />
      </View>

      <Text style={styles.description}>
        {isPremium
          ? 'A mirror of your energy — past, present, and where it leads.'
          : 'One card. One message. Wherever you are right now.'}
      </Text>

      {engagement.refreshing && (
        <InlineRefreshing label="Updating tarot state..." />
      )}

      {/* Draw Button or Status */}
      {drawnCards.length === 0 && (
        <Animated.View entering={FadeInUp.duration(500)} style={styles.drawSection}>
          <View style={styles.drawIconBg}>
            <Text style={styles.drawIcon}>🃏</Text>
          </View>
          <Text style={styles.drawTitle}>
            {canDraw ? 'Draw your card' : 'No draws left today'}
          </Text>
          <Text style={styles.drawSub}>
            {canDraw
              ? isPremium
                ? `${drawsRemaining} spreads remaining today`
                : '1 free card per day'
              : 'Come back tomorrow for a new reading'}
          </Text>
          {canDraw && (
            <TouchableOpacity activeOpacity={0.85} onPress={handleDraw} disabled={drawing}>
              <LinearGradient
                colors={theme.gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.drawButton, drawing && styles.drawButtonDisabled]}
              >
                <Text style={styles.drawButtonText}>
                  {drawing ? 'Drawing...' : isPremium ? 'Draw Past / Present / Future' : 'Draw My Card'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
          {!isPremium && (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push('/pricing')}
              style={styles.upgradeHint}
            >
              <Text style={styles.upgradeHintText}>
                ✦ Upgrade for the full 3-card spread
              </Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      )}

      {/* Cards — single (free) or spread (premium) */}
      {drawnCards.length > 0 && (
        <View style={styles.spread}>
          {drawnCards.map((drawn, index) => {
            const card = getCard(drawn);
            const isRevealed = index <= revealedIndex;

            if (!isRevealed) return null;

            return (
              <Animated.View
                key={`${drawn.position}-${drawn.cardId}`}
                entering={FadeInUp.duration(500).delay(index * 200)}
                style={styles.cardContainer}
              >
                {!isSingleCard && (
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardPosition}>{drawn.position}</Text>
                    <Text style={styles.cardPositionMeaning}>
                      {getPositionMeaning(drawn.position)}
                    </Text>
                  </View>
                )}

                <LinearGradient
                  colors={['#FFF9EF', '#F7F2EA'] as const}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardBody}
                >
                  <TarotArtworkCard
                    name={card.name}
                    reversed={drawn.reversed}
                    keywords={card.keywords}
                    visual={card.visual}
                    fallbackSymbol={card.emoji}
                  />
                  <View style={styles.readingPanel}>
                    <Text style={styles.cardName}>{card.name}</Text>
                    <Text style={styles.cardKeywords}>{card.keywords}</Text>
                  </View>
                  <Text style={styles.cardMeaning}>
                    {card.meaning}
                  </Text>
                  {isPremium && (card.reflectionPrompt || card.action || card.shadowNote) && (
                    <View style={styles.interpretationPanel}>
                      {card.reflectionPrompt && (
                        <View style={styles.interpretationBlock}>
                          <Text style={styles.interpretationLabel}>Mirror Question</Text>
                          <Text style={styles.interpretationText}>{card.reflectionPrompt}</Text>
                        </View>
                      )}
                      {card.action && (
                        <View style={styles.interpretationBlock}>
                          <Text style={styles.interpretationLabel}>Best Move</Text>
                          <Text style={styles.interpretationText}>{card.action}</Text>
                        </View>
                      )}
                      {card.shadowNote && (
                        <View style={styles.interpretationBlock}>
                          <Text style={styles.interpretationLabel}>Shadow Note</Text>
                          <Text style={styles.interpretationText}>{card.shadowNote}</Text>
                        </View>
                      )}
                    </View>
                  )}
                </LinearGradient>

                <TouchableOpacity
                  style={styles.shareBtn}
                  onPress={() => handleShare(drawn)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.shareBtnText}>Share to Story →</Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}

          {/* Reveal Next Button (only for premium multi-card) */}
          {!allRevealed && !isSingleCard && (
            <TouchableOpacity activeOpacity={0.85} onPress={handleRevealNext}>
              <LinearGradient
                colors={theme.gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.revealButton}
              >
                <Text style={styles.revealButtonText}>
                  Reveal {drawnCards[revealedIndex + 1]?.position}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
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
                <TouchableOpacity activeOpacity={0.85} onPress={handleDraw} disabled={drawing}>
                  <LinearGradient
                    colors={theme.gradients.primary}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.drawAgainButton, drawing && styles.drawButtonDisabled]}
                  >
                    <Text style={styles.drawAgainText}>
                      {drawing ? 'Drawing...' : isPremium ? 'Draw Again' : 'Draw Another Card'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
              {!isPremium && (
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => router.push('/pricing')}
                  style={styles.upgradeHint}
                >
                  <Text style={styles.upgradeHintText}>
                    ✦ Upgrade for the full 3-card spread
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 130,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.76)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.warmSoft,
  },
  backIcon: { fontSize: 18, color: theme.colors.ink },
  backButtonPlaceholder: { width: 40 },
  headerCenter: { alignItems: 'center', flex: 1 },
  headerLabel: {
    fontSize: 11,
    letterSpacing: 1.4,
    color: '#8B72CF',
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 4,
  },
  headerTitle: {
    fontFamily: theme.fonts.serif,
    fontSize: 22,
    fontWeight: '500',
    color: theme.colors.ink,
  },
  description: {
    fontSize: 14,
    color: theme.colors.muted,
    lineHeight: 23,
    marginBottom: 24,
    textAlign: 'center',
  },
  drawSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  drawIconBg: {
    width: 80,
    height: 80,
    borderRadius: 32,
    backgroundColor: '#E8DDFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...theme.shadows.warmSm,
  },
  drawIcon: { fontSize: 36 },
  drawTitle: {
    fontFamily: theme.fonts.serif,
    fontSize: 24,
    fontWeight: '500',
    color: theme.colors.ink,
    marginBottom: 4,
  },
  drawSub: {
    fontSize: 13,
    color: theme.colors.muted,
    marginBottom: 24,
  },
  drawButton: {
    minHeight: 54,
    borderRadius: 27,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.primaryGlow,
  },
  drawButtonDisabled: {
    opacity: 0.72,
  },
  drawButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  upgradeHint: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(232,221,251,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(139,114,207,0.2)',
  },
  upgradeHintText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8B72CF',
  },
  spread: { gap: 16 },
  cardContainer: {
    marginBottom: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  cardPosition: {
    fontSize: 11,
    letterSpacing: 1.2,
    color: '#8B72CF',
    textTransform: 'uppercase',
    fontWeight: '800',
  },
  cardPositionMeaning: {
    fontSize: 12,
    color: theme.colors.muted,
  },
  cardBody: {
    borderRadius: 24,
    padding: 14,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    ...theme.shadows.warmSoft,
  },
  readingPanel: {
    paddingHorizontal: 6,
    paddingTop: 18,
  },
  cardName: {
    fontFamily: theme.fonts.serif,
    fontSize: 22,
    fontWeight: '500',
    color: theme.colors.ink,
    marginBottom: 4,
  },
  cardKeywords: {
    fontSize: 12,
    color: theme.colors.muted,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  cardMeaning: {
    fontSize: 14,
    color: theme.colors.ink,
    lineHeight: 23,
    fontWeight: '500',
  },
  interpretationPanel: {
    marginTop: 16,
    gap: 10,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(31,33,48,0.08)',
  },
  interpretationBlock: {
    gap: 4,
  },
  interpretationLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8B72CF',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  interpretationText: {
    fontSize: 13,
    color: theme.colors.ink,
    lineHeight: 20,
  },
  shareBtn: {
    marginTop: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  shareBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8B72CF',
  },
  revealButton: {
    minHeight: 48,
    borderRadius: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    ...theme.shadows.primaryGlow,
  },
  revealButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  completeMessage: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  completeText: {
    fontFamily: theme.fonts.serif,
    fontSize: 18,
    fontWeight: '500',
    color: theme.colors.ink,
    marginBottom: 4,
  },
  completeSub: {
    fontSize: 13,
    color: theme.colors.muted,
    marginBottom: 16,
  },
  drawAgainButton: {
    minHeight: 48,
    borderRadius: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.primaryGlow,
  },
  drawAgainText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
