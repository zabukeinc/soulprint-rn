import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeIn, FadeOut } from 'react-native-reanimated';
import { Star, Heart, Users, Hand, Lock } from 'lucide-react-native';
import { useTier } from '@/src/context/TierContext';
import { theme } from '@/src/lib/theme';

const features = [
  {
    id: 'soulprint',
    icon: Star,
    title: 'Full Soulprint',
    description: 'Your complete emotional blueprint.',
    price: '$9',
    gradient: ['#E8DDFB', '#F8DCCB'] as const,
  },
  {
    id: 'love',
    icon: Heart,
    title: 'Love Pattern',
    description: 'How you seek safety and closeness.',
    price: '$7',
    gradient: ['#F4C7D2', '#E8DDFB'] as const,
  },
  {
    id: 'compatibility',
    icon: Users,
    title: 'Compatibility',
    description: 'Decode chemistry with someone.',
    price: '$9',
    gradient: ['#DDEDDC', '#DFF2EC'] as const,
  },
  {
    id: 'palm',
    icon: Hand,
    title: 'Palm Reading',
    description: 'Coming soon, privacy-first.',
    price: 'Soon',
    gradient: ['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.8)'] as const,
    locked: true,
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
            <Text style={styles.headerTitle}>Decode</Text>
          </View>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>G</Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(500).delay(50)}>
        <Text style={styles.title}>What do you want to understand next?</Text>
        <Text style={styles.description}>
          {isPremium
            ? 'All readings are unlocked. Choose what feels most alive right now.'
            : 'Unlock deeper readings when a question keeps returning.'}
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
              {isPremium ? 'Unlocked' : 'Premium'}
            </Text>
          </View>
        </View>
      </Animated.View>

      <View style={styles.featuresList}>
        {features.map((feature, index) => {
          const Icon = feature.icon;
          const isLocked = feature.locked || (!isPremium && feature.id !== 'soulprint');

          if (feature.locked) {
            return (
              <Animated.View
                key={feature.id}
                entering={FadeInUp.duration(500).delay(150 + index * 80)}
                style={styles.lockedFeature}
              >
                <LinearGradient
                  colors={feature.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.featureIconBg}
                >
                  <Text style={styles.featureIconText}>🔒</Text>
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

          if (isLocked) {
            return (
              <Animated.View
                key={feature.id}
                entering={FadeInUp.duration(500).delay(150 + index * 80)}
              >
                <TouchableOpacity
                  onPress={() => router.push('/pricing')}
                  activeOpacity={0.85}
                  style={styles.lockedFeature}
                >
                  <LinearGradient
                    colors={feature.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.featureIconBg}
                  >
                    <Lock size={18} color="#7A63BD" />
                  </LinearGradient>
                  <View style={styles.featureText}>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDesc}>{feature.description}</Text>
                  </View>
                  <View style={styles.priceBadge}>
                    <Text style={styles.priceBadgeText}>{feature.price}</Text>
                  </View>
                </TouchableOpacity>
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
                <Text style={styles.openText}>Open</Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>

      {!isPremium && (
        <Animated.View entering={FadeInUp.duration(500).delay(500)}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/pricing')}
          >
            <LinearGradient
              colors={theme.gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.unlockBtn}
            >
              <Text style={styles.unlockBtnText}>✦ Unlock all readings</Text>
            </LinearGradient>
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
    paddingBottom: 100,
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
  lockedFeature: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(139,114,207,0.15)',
    backgroundColor: 'rgba(232,221,251,0.5)',
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
  featureIconText: { fontSize: 18 },
  featureText: { flex: 1 },
  featureTitle: { fontSize: 14, fontWeight: '500', color: theme.colors.ink, marginBottom: 2 },
  featureDesc: { fontSize: 12, color: theme.colors.muted, lineHeight: 18 },
  openText: { fontSize: 12, fontWeight: '800', color: '#16A7A0' },
  priceBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.52)',
    borderWidth: 1,
    borderColor: 'rgba(139,114,207,0.18)',
  },
  priceBadgeText: { fontSize: 11, fontWeight: '700', color: '#7A63BD' },
  soonBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.52)',
  },
  soonBadgeText: { fontSize: 11, fontWeight: '700', color: theme.colors.muted },
  unlockBtn: {
    width: '100%',
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
    ...theme.shadows.primaryGlow,
  },
  unlockBtnText: { fontSize: 14, fontWeight: '500', color: '#FFFFFF' },
});
