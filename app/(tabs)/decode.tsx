import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Star, Heart, Users, Hand, Grid3X3 } from 'lucide-react-native';
import { useTier } from '@/src/context/TierContext';
import { theme } from '@/src/lib/theme';

const features = [
  {
    id: 'astrovy',
    icon: Star,
    title: 'Full Astrovy',
    description: 'Your complete emotional blueprint.',
    gradient: ['#E8DDFB', '#F8DCCB'] as const,
  },
  {
    id: 'love',
    icon: Heart,
    title: 'Love Pattern',
    description: 'How you seek safety and closeness.',
    gradient: ['#F4C7D2', '#E8DDFB'] as const,
  },
  {
    id: 'compatibility',
    icon: Users,
    title: 'Compatibility',
    description: 'Quick match free. Full birth match premium.',
    gradient: ['#DDEDDC', '#DFF2EC'] as const,
  },
  {
    id: 'palm',
    icon: Hand,
    title: 'Palm Reading',
    description: 'Coming soon, privacy-first.',
    gradient: ['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.8)'] as const,
    soon: true,
  },
  {
    id: 'matrix-destiny',
    icon: Grid3X3,
    title: 'Matrix Destiny',
    description: 'Your numbers, patterns, and life themes.',
    gradient: ['rgba(224,238,255,0.72)', 'rgba(239,231,252,0.8)'] as const,
  },
];

export default function DecodeScreen() {
  const router = useRouter();
  const { isPremium } = useTier();

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
            <Text style={styles.headerAvatarText}>G</Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(500).delay(50)}>
        <Text style={styles.title}>What do you want to understand next?</Text>
        <Text style={styles.description}>
          Readings that meet you where you are. Tap what feels alive right now.
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(500).delay(100)}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Available Readings</Text>
          <View
            style={[
              styles.tierBadge,
              { backgroundColor: isPremium ? 'rgba(22,167,160,0.12)' : 'rgba(139,114,207,0.12)' },
            ]}
          >
            <Text
              style={[
                styles.tierBadgeText,
                { color: isPremium ? '#16A7A0' : '#7A63BD' },
              ]}
            >
              {isPremium ? 'Unlocked' : 'Free'}
            </Text>
          </View>
        </View>
      </Animated.View>

      <View style={styles.featuresList}>
        {features.map((feature, index) => {
          const Icon = feature.icon;

          if (feature.soon) {
            return (
              <Animated.View
                key={feature.id}
                entering={FadeInUp.duration(500).delay(150 + index * 80)}
                style={styles.soonFeature}
              >
                <LinearGradient
                  colors={feature.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.featureIconBg}
                >
                  <Icon size={20} color={theme.colors.muted} />
                </LinearGradient>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDesc}>{feature.description}</Text>
                </View>
                <View style={styles.soonBadge}>
                  <Text style={styles.soonBadgeText}>Soon</Text>
                </View>
              </Animated.View>
            );
          }

          return (
            <Animated.View
              key={feature.id}
              entering={FadeInUp.duration(500).delay(150 + index * 80)}
            >
              <TouchableOpacity
                onPress={() => router.push(`/${feature.id}`)}
                activeOpacity={0.85}
                style={styles.featureCard}
              >
                <LinearGradient
                  colors={feature.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.featureIconBg}
                >
                  <Icon size={20} color={theme.colors.ink} />
                </LinearGradient>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDesc}>{feature.description}</Text>
                </View>
                <Text style={styles.openText}>Open →</Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>

      {!isPremium && (
        <Animated.View entering={FadeInUp.duration(500).delay(500)}>
          <TouchableOpacity onPress={() => router.push('/pricing')} activeOpacity={0.85}>
            <Text style={styles.upgradeLink}>Upgrade for weekly readings →</Text>
          </TouchableOpacity>
        </Animated.View>
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: theme.colors.ink },
  tierBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tierBadgeText: { fontSize: 11, fontWeight: '700' },
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
  soonFeature: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    backgroundColor: 'rgba(255,255,255,0.5)',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    opacity: 0.75,
  },
  featureIconBg: {
    width: 44,
    height: 44,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: { flex: 1 },
  featureTitle: { fontSize: 14, fontWeight: '500', color: theme.colors.ink, marginBottom: 2 },
  featureDesc: { fontSize: 12, color: theme.colors.muted, lineHeight: 18 },
  openText: { fontSize: 12, fontWeight: '800', color: '#16A7A0' },
  soonBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.52)',
  },
  soonBadgeText: { fontSize: 11, fontWeight: '700', color: theme.colors.muted },
  upgradeLink: {
    fontSize: 14,
    fontWeight: '800',
    color: '#8B72CF',
    textAlign: 'center',
    paddingVertical: 16,
    marginTop: 8,
  },
});
