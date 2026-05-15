import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { theme } from '@/src/lib/theme';
import { getTodayHoroscope, getMoonPhase } from '@/src/lib/horoscope';
import NatalChart from '@/src/components/NatalChart';

const categories = [
  { id: 'overview', label: 'Overview', emoji: '✦' },
  { id: 'love', label: 'Love', emoji: '💕' },
  { id: 'career', label: 'Career', emoji: '🧭' },
  { id: 'growth', label: 'Growth', emoji: '🌱' },
] as const;

export default function HoroscopeScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<typeof categories[number]['id']>('overview');
  const horoscope = getTodayHoroscope();
  const moon = getMoonPhase();

  const reading = horoscope[activeCategory];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Animated.View entering={FadeInUp.duration(500)}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.headerLabel}>Your Stars</Text>
            <Text style={styles.headerTitle}>Horoscope</Text>
          </View>
          <View style={styles.backButtonPlaceholder} />
        </View>
      </Animated.View>

      {/* Natal Chart Card */}
      <Animated.View entering={FadeInUp.duration(500).delay(100)}>
        <LinearGradient
          colors={['#1a0b2e', '#311b92', '#4a148c']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.chartCard}
        >
          <View style={styles.chartGlow} />
          <Text style={styles.chartLabel}>Your Natal Chart</Text>
          <Text style={styles.chartSub}>Tap a planet to explore its meaning</Text>
          <NatalChart size={260} />
        </LinearGradient>
      </Animated.View>

      {/* Moon Phase */}
      <Animated.View entering={FadeInUp.duration(500).delay(150)} style={styles.moonCard}>
        <View style={styles.moonRow}>
          <Text style={styles.moonEmoji}>{moon.emoji}</Text>
          <View>
            <Text style={styles.moonLabel}>Moon Phase</Text>
            <Text style={styles.moonPhase}>{moon.phase}</Text>
          </View>
        </View>
        <Text style={styles.moonMeaning}>{moon.meaning}</Text>
      </Animated.View>

      {/* Category Tabs */}
      <Animated.View entering={FadeInUp.duration(500).delay(200)}>
        <View style={styles.tabs}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setActiveCategory(cat.id)}
              style={[
                styles.tab,
                activeCategory === cat.id && styles.tabActive,
              ]}
            >
              <Text style={styles.tabEmoji}>{cat.emoji}</Text>
              <Text
                style={[
                  styles.tabLabel,
                  activeCategory === cat.id && styles.tabLabelActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {/* Reading Card */}
      <Animated.View
        entering={FadeInUp.duration(500).delay(250)}
        key={activeCategory}
      >
        <LinearGradient
          colors={theme.gradients.hero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.readingCard}
        >
          <View style={styles.readingGlow} />
          <Text style={styles.readingLabel}>
            {categories.find((c) => c.id === activeCategory)?.label} Reading
          </Text>
          <Text style={styles.readingText}>{reading}</Text>
        </LinearGradient>
      </Animated.View>

      {/* Weekly Theme */}
      <Animated.View entering={FadeInUp.duration(500).delay(300)} style={styles.themeCard}>
        <Text style={styles.themeLabel}>This Week's Theme</Text>
        <Text style={styles.themeText}>
          Your year is asking you to stop waiting for permission to take up emotional space.
          The theme is "visible growth" — not loud growth, but growth that you stop hiding.
        </Text>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 130,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
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
  headerLabel: { fontSize: 12, color: theme.colors.muted, letterSpacing: 0.5 },
  headerTitle: {
    fontFamily: theme.fonts.serif,
    fontSize: 28,
    fontWeight: '500',
    color: theme.colors.ink,
  },
  chartCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    ...theme.shadows.warmSoft,
  },
  chartGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.08)',
    right: -60,
    top: -60,
  },
  chartLabel: {
    fontSize: 11,
    letterSpacing: 1.4,
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 4,
  },
  chartSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 16,
  },
  moonCard: {
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    ...theme.shadows.warmSm,
  },
  moonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  moonEmoji: { fontSize: 24 },
  moonLabel: {
    fontSize: 10,
    letterSpacing: 1.2,
    color: '#8B72CF',
    textTransform: 'uppercase',
    fontWeight: '800',
  },
  moonPhase: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.ink,
  },
  moonMeaning: {
    fontSize: 12,
    color: theme.colors.muted,
    lineHeight: 20,
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
  },
  tabActive: {
    backgroundColor: '#8B72CF',
    borderColor: 'transparent',
    shadowColor: 'rgba(139,114,207,0.2)',
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    shadowOpacity: 1,
    elevation: 3,
  },
  tabEmoji: { fontSize: 14, marginBottom: 2 },
  tabLabel: { fontSize: 10, fontWeight: '700', color: theme.colors.muted },
  tabLabelActive: { color: '#FFFFFF' },
  readingCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    ...theme.shadows.warmSoft,
  },
  readingGlow: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.28)',
    right: -44,
    top: -50,
  },
  readingLabel: {
    fontSize: 11,
    letterSpacing: 1.4,
    color: '#8B72CF',
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 12,
    position: 'relative',
    zIndex: 10,
  },
  readingText: {
    fontSize: 14,
    color: theme.colors.ink,
    lineHeight: 24,
    fontWeight: '500',
    position: 'relative',
    zIndex: 10,
  },
  themeCard: {
    borderRadius: 24,
    padding: 16,
    backgroundColor: 'rgba(232,221,251,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(139,114,207,0.18)',
  },
  themeLabel: {
    fontSize: 11,
    letterSpacing: 1,
    color: '#8B72CF',
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 8,
  },
  themeText: {
    fontSize: 13,
    color: theme.colors.ink,
    lineHeight: 22,
  },
});
