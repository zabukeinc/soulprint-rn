import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { theme } from '@/src/lib/theme';

const patternCards = [
  { title: 'Private Processor', desc: 'You feel more than you show.' },
  { title: 'Pattern Reader', desc: 'You notice emotional shifts quickly.' },
  { title: 'Consistency Seeker', desc: 'You trust repeated actions more than big words.' },
  { title: 'Quiet Intensity', desc: 'You may look calm while processing deeply.' },
];

export default function FirstMirrorScreen() {
  const router = useRouter();
  const [feedback, setFeedback] = useState<string | null>(null);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeInUp.duration(500)} style={styles.center}>
        <View style={styles.iconBg}>
          <Text style={styles.icon}>✦</Text>
        </View>
        <Text style={styles.label}>First Mirror</Text>
        <Text style={styles.title}>Hi Gy, your first Soulprint is ready.</Text>
        <Text style={styles.desc}>
          We found a few patterns that may explain how you process emotion, connection, and direction.
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(100).duration(500)}
        style={styles.heroCard}
      >
        <View style={styles.heroGlow} />
        <View style={styles.heroRow}>
          <View style={styles.heroAvatar}>
            <Text style={styles.heroAvatarEmoji}>🌿</Text>
          </View>
          <View>
            <Text style={styles.heroLabel}>Your Core Archetype</Text>
            <Text style={styles.heroTitle}>The Quiet Strategist</Text>
          </View>
        </View>
        <Text style={styles.heroDesc}>
          You tend to understand things deeply before you explain them. People may see calmness, but your inner world is usually more active than it looks.
        </Text>
        <View style={styles.badges}>
          {['Aquarius Sun', 'Life Path 7', 'Love Focus'].map((badge) => (
            <View key={badge} style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      <Text style={styles.sectionTitle}>What this may reveal</Text>
      <View style={styles.grid}>
        {patternCards.map((card, i) => (
          <Animated.View
            key={card.title}
            entering={FadeInUp.delay(200 + i * 50).duration(400)}
            style={styles.patternCard}
          >
            <Text style={styles.patternTitle}>{card.title}</Text>
            <Text style={styles.patternDesc}>{card.desc}</Text>
          </Animated.View>
        ))}
      </View>

      <Animated.View entering={FadeInUp.delay(400).duration(500)} style={styles.insightCard}>
        <Text style={styles.insightTitle}>The part of you asking to be understood</Text>
        <Text style={styles.insightText}>
          You may not always want attention. But you do want to feel emotionally considered.
        </Text>
        <Text style={styles.insightText}>
          When people miss the small details, it can feel louder than they realize.
        </Text>
      </Animated.View>

      <View style={styles.feedbackSection}>
        <Text style={styles.feedbackLabel}>Did this feel close to you?</Text>
        <View style={styles.feedbackRow}>
          {['Yes, surprisingly', 'A little', 'Not really'].map((opt) => (
            <TouchableOpacity
              key={opt}
              onPress={() => setFeedback(opt)}
              style={[
                styles.feedbackBtn,
                feedback === opt && styles.feedbackBtnActive,
              ]}
            >
              <Text
                style={[
                  styles.feedbackBtnText,
                  feedback === opt && styles.feedbackBtnTextActive,
                ]}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(500).duration(500)} style={styles.deepDiveCard}>
        <Text style={styles.deepDiveTitle}>
          There is more beneath this pattern.
        </Text>
        <Text style={styles.deepDiveText}>
          Your full Soulprint explores the parts of you that may need more language: love pattern, shadow self, career energy, growth direction, and your 12-month theme.
        </Text>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push('/pricing')}
        >
          <LinearGradient
            colors={theme.gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.deepDiveButton}
          >
            <Text style={styles.deepDiveButtonText}>
              Deep dive into your Soulprint →
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push('/(tabs)/today')}
      >
        <LinearGradient
          colors={theme.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.mainButton}
        >
          <Text style={styles.mainButtonText}>Continue to Today</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 24,
  },
  center: { alignItems: 'center', marginBottom: 16 },
  iconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8B72CF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: 'rgba(139,114,207,0.25)',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    shadowOpacity: 1,
    elevation: 6,
  },
  icon: { fontSize: 24, color: '#FFFFFF' },
  label: {
    fontSize: 11,
    letterSpacing: 1.4,
    color: '#8B72CF',
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 4,
  },
  title: {
    fontFamily: theme.fonts.serif,
    fontSize: 24,
    fontWeight: '500',
    color: theme.colors.ink,
    letterSpacing: -0.6,
    lineHeight: 28,
    textAlign: 'center',
    marginBottom: 4,
  },
  desc: {
    fontSize: 12,
    color: theme.colors.muted,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 260,
  },
  heroCard: {
    borderRadius: theme.radius.lg,
    padding: 20,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#FFFDF7',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    ...theme.shadows.warmSoft,
  },
  heroGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.5)',
    right: -30,
    top: -30,
    opacity: 0.2,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  heroAvatar: {
    width: 50,
    height: 50,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroAvatarEmoji: { fontSize: 24 },
  heroLabel: {
    fontSize: 10,
    letterSpacing: 1.2,
    color: '#8B72CF',
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 2,
  },
  heroTitle: {
    fontFamily: theme.fonts.serif,
    fontSize: 20,
    fontWeight: '500',
    color: theme.colors.ink,
    lineHeight: 24,
  },
  heroDesc: {
    fontSize: 12,
    color: theme.colors.muted,
    lineHeight: 20,
    marginBottom: 12,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
  },
  badgeText: { fontSize: 10, fontWeight: '500', color: '#6C5F99' },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.ink,
    marginBottom: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  patternCard: {
    width: '48%',
    borderRadius: 16,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
  },
  patternTitle: { fontSize: 11, fontWeight: '500', color: theme.colors.ink, marginBottom: 2 },
  patternDesc: { fontSize: 10, color: theme.colors.muted, lineHeight: 14 },
  insightCard: {
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(232,221,251,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(139,114,207,0.2)',
  },
  insightTitle: { fontSize: 11, fontWeight: '500', color: theme.colors.ink, marginBottom: 8 },
  insightText: { fontSize: 12, color: theme.colors.muted, lineHeight: 20, marginBottom: 4 },
  feedbackSection: { marginBottom: 16 },
  feedbackLabel: {
    fontSize: 11,
    color: theme.colors.muted,
    textAlign: 'center',
    marginBottom: 8,
  },
  feedbackRow: { flexDirection: 'row', gap: 8 },
  feedbackBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    alignItems: 'center',
  },
  feedbackBtnActive: {
    backgroundColor: '#8B72CF',
    borderColor: 'transparent',
  },
  feedbackBtnText: { fontSize: 10, fontWeight: '500', color: theme.colors.muted },
  feedbackBtnTextActive: { color: '#FFFFFF' },
  deepDiveCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
  },
  deepDiveTitle: { fontSize: 11, fontWeight: '500', color: theme.colors.ink, marginBottom: 4 },
  deepDiveText: { fontSize: 11, color: theme.colors.muted, lineHeight: 18, marginBottom: 12 },
  deepDiveButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
    ...theme.shadows.primaryGlow,
  },
  deepDiveButtonText: { fontSize: 12, fontWeight: '800', color: '#FFFFFF' },
  mainButton: {
    width: '100%',
    minHeight: 48,
    borderRadius: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.primaryGlow,
  },
  mainButtonText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
});
