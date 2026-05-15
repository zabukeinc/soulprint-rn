import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native';
import { theme } from '@/src/lib/theme';
import { TAROT_CARDS } from '@/src/lib/tarot';

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

  return (
    <View style={styles.container}>
      {/* Shareable Card */}
      <View style={styles.cardWrapper}>
        <LinearGradient
          colors={theme.gradients.hero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View style={styles.cardGlow} />
          
          {/* Soulprint Brand */}
          <Text style={styles.brand}>✦ Soulprint</Text>

          {/* Position Label */}
          <Text style={styles.positionLabel}>
            {position?.toUpperCase()} · {isReversed ? 'Reversed' : 'Upright'}
          </Text>

          {/* Card Emoji */}
          <Text style={[styles.emoji, isReversed && styles.emojiReversed]}>
            {card.emoji}
          </Text>

          {/* Card Name */}
          <Text style={styles.cardName}>{card.name}</Text>

          {/* Keywords */}
          <Text style={styles.keywords}>
            {isReversed ? card.keywords.reversed : card.keywords.upright}
          </Text>

          {/* Divider */}
          <View style={styles.divider} />

          {/* One-line meaning */}
          <Text style={styles.meaning}>{card.meaning.free}</Text>

          {/* Archetype Tag */}
          <View style={styles.tag}>
            <Text style={styles.tagText}>The Quiet Strategist</Text>
          </View>
        </LinearGradient>
      </View>

      {/* Actions */}
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
    backgroundColor: theme.colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  cardWrapper: {
    width: '100%',
    aspectRatio: 0.8,
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: 'rgba(99,82,60,0.15)',
    shadowOffset: { width: 0, height: 20 },
    shadowRadius: 40,
    shadowOpacity: 1,
    elevation: 10,
  },
  card: {
    flex: 1,
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  cardGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.25)',
    top: -60,
    right: -60,
  },
  brand: {
    fontSize: 12,
    letterSpacing: 2,
    color: '#8B72CF',
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 16,
  },
  positionLabel: {
    fontSize: 10,
    letterSpacing: 1.4,
    color: theme.colors.muted,
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 16,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emojiReversed: {
    transform: [{ rotate: '180deg' }],
  },
  cardName: {
    fontFamily: theme.fonts.serif,
    fontSize: 28,
    fontWeight: '500',
    color: theme.colors.ink,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  keywords: {
    fontSize: 12,
    color: theme.colors.muted,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 16,
    lineHeight: 18,
  },
  divider: {
    width: 40,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(139,114,207,0.3)',
    marginBottom: 16,
  },
  meaning: {
    fontSize: 16,
    color: theme.colors.ink,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
    marginBottom: 20,
    maxWidth: 260,
  },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6C5F99',
  },
  actions: {
    marginTop: 24,
    alignItems: 'center',
    gap: 12,
  },
  closeBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
  },
  closeText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.ink,
  },
  hint: {
    fontSize: 12,
    color: theme.colors.muted,
  },
});
