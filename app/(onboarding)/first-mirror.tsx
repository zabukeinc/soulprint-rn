import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInUp,
  FadeIn,
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { theme } from '@/src/lib/theme';
import { useOnboarding } from '@/src/context/OnboardingContext';
import { getFirstMirrorReading, getMe, submitFeedback, type FirstMirrorPayload } from '@/src/services/backend';
import { LoadingPage } from '@/src/components/LoadingState';

export default function FirstMirrorScreen() {
  const router = useRouter();
  const { data } = useOnboarding();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [mirror, setMirror] = useState<FirstMirrorPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const floatY = useSharedValue(0);
  useEffect(() => {
    floatY.value = withRepeat(
      withTiming(-4, { duration: 1500 }),
      -1,
      true
    );

    Promise.all([getMe(), getFirstMirrorReading({ fast: true })])
      .then(([me, firstMirror]) => {
        setProfile(me.profile);
        setMirror(firstMirror);
        setLoadError(null);
      })
      .catch(() => setLoadError('Your First Mirror could not be generated. Please try again.'))
      .finally(() => setLoading(false));
  }, []);
  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));
  const name = profile?.name ?? data.name ?? 'friend';
  const archetype = mirror?.archetype;
  const visiblePatternCards = mirror?.patternCards ?? [];
  const badges = mirror?.badges ?? [];
  const feedbackValue = feedback ?? mirror?.feedback?.value ?? null;

  if (loading && !mirror) {
    return (
      <LoadingPage
        title="Generating First Mirror"
        body="Gathering the patterns in your story and shaping them into a first reflection."
      />
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeInUp.duration(600)} style={styles.center}>
        <Animated.View entering={ZoomIn.duration(300)} style={styles.iconBg}>
          <Text style={styles.icon}>✦</Text>
        </Animated.View>
        <Text style={styles.label}>First Mirror</Text>
        <Text style={styles.title}>
          {mirror?.title ?? (loadError ? 'First Mirror unavailable' : `Hi ${name}, preparing your first Astrovy...`)}
        </Text>
        <Text style={styles.desc}>
          {loadError ?? mirror?.subtitle ?? 'Generating the first read from your onboarding and birth pattern.'}
        </Text>
      </Animated.View>

      {loading ? (
        <Animated.View entering={FadeIn.duration(300)} style={styles.insightCard}>
          <Text style={styles.insightTitle}>Generating your First Mirror</Text>
          <Text style={styles.insightText}>Gathering the patterns in your story and shaping them into a first reflection.</Text>
        </Animated.View>
      ) : mirror ? (
        <>
          <Animated.View
            entering={FadeInUp.delay(100).duration(500)}
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
          </Animated.View>

          <Text style={styles.sectionTitle}>What this may reveal</Text>
          <View style={styles.grid}>
            {visiblePatternCards.map((card: { title: string; desc: string }, i: number) => (
              <Animated.View
                key={card.title}
                entering={FadeInUp.delay(200 + i * 50).duration(500)}
                style={styles.patternCard}
              >
                <Text style={styles.patternTitle}>{card.title}</Text>
                <Text style={styles.patternDesc}>{card.desc}</Text>
              </Animated.View>
            ))}
          </View>

          <Animated.View entering={FadeInUp.delay(400).duration(500)} style={styles.insightCard}>
            <Text style={styles.insightTitle}>{mirror.insight.title}</Text>
            {mirror.insight.paragraphs.map((paragraph) => (
              <Text key={paragraph} style={styles.insightText}>{paragraph}</Text>
            ))}
          </Animated.View>
        </>
      ) : null}

      <View style={styles.feedbackSection}>
        {feedbackValue ? (
          <View style={styles.feedbackThanks}>
            <Text style={styles.feedbackThanksTitle}>Thanks for the signal.</Text>
            <Text style={styles.feedbackThanksText}>
              Future readings will use this to tune the tone and specificity.
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.feedbackLabel}>Did this feel close to you?</Text>
            <View style={styles.feedbackRow}>
              {['Yes, surprisingly', 'A little', 'Not really'].map((opt) => {
                const value = opt === 'Yes, surprisingly' ? 'accurate' : opt === 'A little' ? 'partial' : 'inaccurate';
                return (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => {
                      setFeedback(value);
                      submitFeedback({
                        targetType: 'first_mirror',
                        targetId: null,
                        value,
                      }).catch(() => setFeedback(null));
                    }}
                    style={styles.feedbackBtn}
                  >
                    <Text style={styles.feedbackBtnText}>{opt}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}
      </View>

      <Animated.View entering={FadeInUp.delay(500).duration(500)}>
        <Text style={styles.softCta}>
          {mirror?.softCta ?? 'Your full blueprint lives in the Astrovy tab — go deeper whenever you are ready.'}
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(600).duration(500)}>
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
      </Animated.View>
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
  feedbackThanks: {
    borderRadius: 20,
    padding: 14,
    backgroundColor: 'rgba(221,237,220,0.62)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.06)',
  },
  feedbackThanksTitle: { fontSize: 12, fontWeight: '700', color: theme.colors.ink, textAlign: 'center' },
  feedbackThanksText: { fontSize: 11, color: theme.colors.muted, lineHeight: 17, textAlign: 'center', marginTop: 4 },
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
  softCta: {
    fontSize: 12,
    color: theme.colors.muted,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
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
