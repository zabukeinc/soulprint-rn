import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { theme } from '@/src/lib/theme';

const patternCards = [
  { title: 'Private Processor', desc: 'You feel more than you show.' },
  { title: 'Pattern Reader', desc: 'You notice emotional shifts quickly.' },
  { title: 'Consistency Seeker', desc: 'You trust repeated actions more than big words.' },
  { title: 'Quiet Intensity', desc: 'You may look calm while processing deeply.' },
];

export default function SnapshotScreen() {
  const router = useRouter();

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
        <Text style={styles.headerLabel}>Snapshot</Text>
        <View style={styles.backButtonPlaceholder} />
      </View>

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

      <LinearGradient
        colors={theme.gradients.firstMirror}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
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
      </LinearGradient>

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

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push('/pricing')}
      >
        <LinearGradient
          colors={theme.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Deep dive into your Soulprint →</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push('/(tabs)/today')}
      >
        <View style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Continue to Today</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
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
  headerLabel: { fontSize: 12, color: theme.colors.muted },
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
  button: {
    width: '100%',
    minHeight: 48,
    borderRadius: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    ...theme.shadows.primaryGlow,
  },
  buttonText: { fontSize: 12, fontWeight: '800', color: '#FFFFFF' },
  secondaryButton: {
    width: '100%',
    minHeight: 48,
    borderRadius: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
  },
  secondaryButtonText: { fontSize: 14, fontWeight: '800', color: theme.colors.ink },
});
