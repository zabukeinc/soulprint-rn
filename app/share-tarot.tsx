import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native';
import { TAROT_CARDS } from '@/src/lib/tarot';

// Bold Wrapped-style gradients per suit
const SUIT_GRADIENTS: Record<string, readonly [string, string, string]> = {
  Major: ['#1a0b2e', '#4a148c', '#311b92'] as const,
  Wands: ['#bf360c', '#e65100', '#ff6f00'] as const,
  Cups: ['#0d47a1', '#1976d2', '#0097a7'] as const,
  Swords: ['#263238', '#455a64', '#78909c'] as const,
  Pentacles: ['#1b5e20', '#2e7d32', '#558b2f'] as const,
};

export default function ShareTarotScreen() {
  const router = useRouter();
  const { cardId, reversed, position } = useLocalSearchParams<{
    cardId: string;
    reversed: string;
    position: string;
  }>();

  const card = TAROT_CARDS.find((c) => c.id === cardId);
  const isReversed = reversed === '1';

  if (!card) return null;

  const gradient = SUIT_GRADIENTS[card.suit] || SUIT_GRADIENTS.Major;
  const positionLabel = position
    ? `${position.charAt(0).toUpperCase() + position.slice(1)}${isReversed ? ' · Reversed' : ''}`
    : isReversed ? 'Reversed' : 'Upright';

  return (
    <View style={styles.container}>
      {/* The actual shareable card — vertical, full bleed, bold */}
      <View style={styles.cardWrapper}>
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          {/* Decorative top blob */}
          <View style={styles.blobTop} />
          <View style={styles.blobBottom} />

          {/* Small brand header */}
          <Text style={styles.brand}>SOULPRINT</Text>

          {/* Big emoji */}
          <Text style={[styles.emoji, isReversed && styles.emojiReversed]}>
            {card.emoji}
          </Text>

          {/* Position label */}
          <Text style={styles.position}>{positionLabel.toUpperCase()}</Text>

          {/* Giant card name */}
          <Text style={styles.cardName} numberOfLines={2}>
            {card.name}
          </Text>

          {/* Keywords */}
          <Text style={styles.keywords}>
            {isReversed ? card.keywords.reversed : card.keywords.upright}
          </Text>

          {/* Meaning as a pull quote */}
          <Text style={styles.meaning}>
            {card.meaning.free}
          </Text>

          {/* Archetype tag */}
          <View style={styles.tag}>
            <Text style={styles.tagText}>THE QUIET STRATEGIST</Text>
          </View>

          {/* Decorative footer line */}
          <View style={styles.footerLine} />
          <Text style={styles.footerBrand}>soulprint.app</Text>
        </LinearGradient>
      </View>

      {/* Actions below the card */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
        <Text style={styles.hint}>
          Screenshot this card to share to your Story
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  cardWrapper: {
    width: '100%',
    aspectRatio: 9 / 16,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowRadius: 40,
    shadowOpacity: 0.5,
    elevation: 20,
  },
  card: {
    flex: 1,
    padding: 28,
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
  },
  // Decorative blobs
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
    fontSize: 11,
    letterSpacing: 4,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '800',
    marginTop: 12,
    textAlign: 'center',
  },
  emoji: {
    fontSize: 96,
    marginTop: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 8 },
    textShadowRadius: 20,
  },
  emojiReversed: {
    transform: [{ rotate: '180deg' }],
  },
  position: {
    fontSize: 12,
    letterSpacing: 3,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: -8,
  },
  cardName: {
    fontSize: 38,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 44,
    letterSpacing: -1,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
    paddingHorizontal: 8,
  },
  keywords: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '700',
    marginTop: -4,
  },
  meaning: {
    fontSize: 17,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '500',
    paddingHorizontal: 12,
    maxWidth: 300,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  tagText: {
    fontSize: 11,
    fontWeight: '800',
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
    fontWeight: '600',
    marginBottom: 8,
  },
  actions: {
    marginTop: 20,
    alignItems: 'center',
    gap: 10,
  },
  closeBtn: {
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  closeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  hint: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
});
