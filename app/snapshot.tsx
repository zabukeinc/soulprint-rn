import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeInUp,
  ZoomIn,
  Easing,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { theme } from '@/src/lib/theme';
import { useOnboarding } from '@/src/context/OnboardingContext';
import { getFirstMirrorReading, getMe, type FirstMirrorPayload } from '@/src/services/backend';

export default function SnapshotScreen() {
  const router = useRouter();
  const { data } = useOnboarding();
  const [profile, setProfile] = React.useState<any | null>(null);
  const [mirror, setMirror] = React.useState<FirstMirrorPayload | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  React.useEffect(() => {
    Promise.all([getMe(), getFirstMirrorReading()])
      .then(([me, firstMirror]) => {
        setProfile(me.profile);
        setMirror(firstMirror);
        setLoadError(null);
      })
      .catch(() => setLoadError('Your First Mirror could not be generated. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withRepeat(withTiming(-4, { duration: 1500 }), -1, true) }],
  }));
  const name = profile?.name ?? data.name ?? 'friend';
  const archetype = mirror?.archetype;
  const visiblePatternCards = mirror?.patternCards ?? [];
  const badges = mirror?.badges ?? [];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerLabel}>Snapshot</Text>
        <View style={styles.backButtonPlaceholder} />
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(100).duration(500)} style={styles.center}>
        <Animated.View entering={ZoomIn.delay(200).duration(300)} style={styles.iconBg}>
          <Text style={styles.icon}>✦</Text>
        </Animated.View>
        <Text style={styles.label}>First Mirror</Text>
        <Text style={styles.title}>
          {mirror?.title ?? `Hi ${name}, preparing your first Astrovy...`}
        </Text>
        <Text style={styles.desc}>
          {loadError ?? mirror?.subtitle ?? 'Generating the first read from your onboarding and birth pattern.'}
        </Text>
      </Animated.View>

      {loading ? (
        <Animated.View entering={FadeIn.duration(300)} style={styles.patternCard}>
          <Text style={styles.patternTitle}>Generating your First Mirror</Text>
          <Text style={styles.patternDesc}>Reading your onboarding, birth chart, and focus through the backend AI pipeline.</Text>
        </Animated.View>
      ) : mirror ? (
        <>
          <Animated.View
            entering={FadeInUp.delay(200).duration(500).easing(Easing.out(Easing.cubic))}
          >
            <LinearGradient
              colors={theme.gradients.firstMirror}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroCard}
            >
              <View style={styles.heroGlow} />
              <View style={styles.heroRow}>
                <Animated.View style={[styles.heroAvatar, floatStyle]}>
                  <Text style={styles.heroAvatarEmoji}>🌿</Text>
                </Animated.View>
                <View>
                  <Text style={styles.heroLabel}>Your Core Archetype</Text>
                  <Text style={styles.heroTitle}>{archetype?.name ?? 'Your Core Archetype'}</Text>
                </View>
              </View>
              <Text style={styles.heroDesc}>
                {archetype?.tagline ?? 'Your archetype is being shaped from your profile.'}
              </Text>
              <View style={styles.badges}>
                {badges.map((badge) => (
                  <View key={badge} style={styles.badge}>
                    <Text style={styles.badgeText}>{badge}</Text>
                  </View>
                ))}
              </View>
            </LinearGradient>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(300).duration(500)}>
            <Text style={styles.sectionTitle}>What this may reveal</Text>
          </Animated.View>

          <View style={styles.grid}>
            {visiblePatternCards.map((card: { title: string; desc: string }, i: number) => (
              <Animated.View
                key={card.title}
                entering={FadeInUp.delay(350 + i * 50).duration(400)}
                style={styles.patternCard}
              >
                <Text style={styles.patternTitle}>{card.title}</Text>
                <Text style={styles.patternDesc}>{card.desc}</Text>
              </Animated.View>
            ))}
          </View>
        </>
      ) : null}

      {mirror?.insight ? (
        <Animated.View entering={FadeInUp.delay(560).duration(400).easing(Easing.out(Easing.cubic))} style={styles.patternCard}>
          <Text style={styles.patternTitle}>{mirror.insight.title}</Text>
          {mirror.insight.paragraphs.map((paragraph) => (
            <Text key={paragraph} style={styles.patternDesc}>{paragraph}</Text>
          ))}
        </Animated.View>
      ) : null}

      <Animated.View entering={FadeInUp.delay(600).duration(400).easing(Easing.out(Easing.cubic))}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push('/(tabs)/today')}
        >
          <LinearGradient
            colors={theme.gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Back to Today</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(700).duration(400).easing(Easing.out(Easing.cubic))}>
        <Text style={styles.softCta}>
          {mirror?.softCta ?? 'Your free reading is always here. Go deeper anytime.'}
        </Text>
      </Animated.View>
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
  softCta: {
    fontSize: 12,
    color: theme.colors.muted,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
});
