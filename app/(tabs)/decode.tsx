import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ChevronRight, Grid3X3, Hand, Heart, MoonStar, Orbit, Sparkles, Sun, Users } from 'lucide-react-native';
import { useAuth } from '@/src/context/AuthContext';
import { theme } from '@/src/lib/theme';

const readingGroups = [
  {
    title: 'Your Maps',
    description: 'The patterns that make your inner world uniquely yours.',
    features: [
      { id: 'astrovy', icon: Sparkles, title: 'Soulprint', description: 'Your emotional blueprint and deeper patterns.', access: 'Free + Premium', gradient: ['#E8DDFB', '#F8DCCB'] as const },
      { id: 'horoscope', icon: Orbit, title: 'Birth Chart', description: 'The sky pattern you were born with.', access: 'Free + Premium', gradient: ['#DCECF7', '#E8DDFB'] as const },
      { id: 'matrix-destiny', icon: Grid3X3, title: 'Matrix Destiny', description: 'Your numbers, themes, and repeating patterns.', access: 'Free + Premium', gradient: ['rgba(224,238,255,0.72)', 'rgba(239,231,252,0.8)'] as const },
    ],
  },
  {
    title: 'Today',
    description: 'A small way to meet the day you are actually having.',
    features: [
      { id: 'tarot', icon: MoonStar, title: 'Daily Tarot', description: 'A card to reflect on today.', access: 'Daily', gradient: ['#F7D875', '#F8DCCB'] as const },
      { id: 'horoscope', icon: Sun, title: 'Daily Horoscope', description: 'A daily sky note shaped around your chart.', access: 'Daily', gradient: ['#DFF2EC', '#DCECF7'] as const },
    ],
  },
  {
    title: 'Love & Connection',
    description: 'Understand closeness, rhythm, and the space between two people.',
    features: [
      { id: 'love', icon: Heart, title: 'Love Pattern', description: 'How you seek safety and closeness.', access: 'Free + Premium', gradient: ['#F4C7D2', '#E8DDFB'] as const },
      { id: 'compatibility', icon: Users, title: 'Compatibility', description: 'Quick match free. Full birth match premium.', access: 'Free + Premium', gradient: ['#DDEDDC', '#DFF2EC'] as const },
    ],
  },
  {
    title: 'Other Perspectives',
    description: 'Another lens for noticing what is already present.',
    features: [
      { id: 'palm-reading', icon: Hand, title: 'Palm Reading', description: 'A reflective reading of the lines you carry.', access: 'Free + Premium', gradient: ['#F7E8D5', '#F4E4F5'] as const },
    ],
  },
];

export default function DecodeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const initial = user?.email?.charAt(0).toUpperCase() || 'A';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeInUp.duration(500)}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerLabel}>Explore</Text>
            <Text style={styles.headerTitle}>Readings</Text>
          </View>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>{initial}</Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(500).delay(50)}>
        <Text style={styles.title}>What do you want to understand next?</Text>
        <Text style={styles.description}>
          Readings that meet you where you are. Tap what feels alive right now.
        </Text>
      </Animated.View>

      <View style={styles.groupsList}>
        {readingGroups.map((group, groupIndex) => (
          <Animated.View key={group.title} entering={FadeInUp.duration(500).delay(100 + groupIndex * 70)} style={styles.group}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionCopy}>
                <Text style={styles.sectionTitle}>{group.title}</Text>
                <Text style={styles.sectionDescription}>{group.description}</Text>
              </View>
            </View>
            <View style={styles.featuresList}>
              {group.features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <TouchableOpacity
                    key={`${group.title}-${feature.id}-${feature.title}`}
                    onPress={() => router.push(feature.title === 'Daily Horoscope' ? '/horoscope?view=daily' : `/${feature.id}`)}
                    activeOpacity={0.85}
                    style={styles.featureCard}
                  >
                    <LinearGradient colors={feature.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.featureIconBg}>
                      <Icon size={20} color={theme.colors.ink} />
                    </LinearGradient>
                    <View style={styles.featureText}>
                      <Text style={styles.featureTitle}>{feature.title}</Text>
                      <Text style={styles.featureDesc}>{feature.description}</Text>
                    </View>
                    <View style={styles.featureAction}>
                      <Text style={[styles.accessText, feature.access.includes('Premium') && styles.premiumAccessText]}>{feature.access}</Text>
                      <ChevronRight size={18} color={theme.colors.muted} />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>
        ))}
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLabel: { fontSize: 12, color: theme.colors.muted, letterSpacing: 0.5 },
  headerTitle: {
    fontFamily: theme.fonts.serif,
    fontSize: 28,
    fontWeight: '500',
    color: theme.colors.ink,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16A7A0',
    ...theme.shadows.tealGlow,
  },
  headerAvatarText: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },
  title: {
    fontFamily: theme.fonts.serif,
    fontSize: 22,
    fontWeight: '500',
    color: theme.colors.ink,
    lineHeight: 26,
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    color: theme.colors.muted,
    lineHeight: 22,
    marginBottom: 20,
  },
  groupsList: { gap: 24 },
  group: { gap: 10 },
  sectionHeader: { marginBottom: 2 },
  sectionCopy: { gap: 3 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: theme.colors.ink },
  sectionDescription: { fontSize: 12, color: theme.colors.muted, lineHeight: 18 },
  featuresList: { gap: 10 },
  featureCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    backgroundColor: 'rgba(255,255,255,0.74)',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...theme.shadows.warmSm,
  },
  featureIconBg: {
    width: 44,
    height: 44,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: { flex: 1, minWidth: 0 },
  featureTitle: { fontSize: 14, fontWeight: '500', color: theme.colors.ink, marginBottom: 2 },
  featureDesc: { fontSize: 12, color: theme.colors.muted, lineHeight: 18 },
  featureAction: { alignItems: 'flex-end', justifyContent: 'center', gap: 4, maxWidth: 92 },
  accessText: { fontSize: 10, fontWeight: '800', color: '#16A7A0', textAlign: 'right' },
  premiumAccessText: { color: '#8B72CF' },
});
