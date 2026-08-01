import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeInUp,
  ZoomIn,
  Easing,
} from 'react-native-reanimated';
import { theme } from '@/src/lib/theme';
import { getLoveReading, submitFeedback } from '@/src/services/backend';

const insights = [
  {
    title: 'Your Attachment Style',
    emoji: '🪢',
    content: 'You lean toward secure-anxious. You want closeness deeply, but you monitor it. You\'re loyal to a fault, but you rehearse abandonment when things feel too stable.',
  },
  {
    title: 'How You Give Love',
    emoji: '💝',
    content: 'Through noticing. You remember the small things. Not grand gestures — quiet consistencies. You show love by being emotionally present even when you\'re tired.',
  },
  {
    title: 'What You Actually Need',
    emoji: '🌱',
    content: 'Emotional consistency over intensity. You don\'t need someone to prove their love dramatically. You need them to show up the same way tomorrow.',
  },
  {
    title: 'Your Love Trigger',
    emoji: '⚡',
    content: 'Silence. When someone pulls away without explanation, your mind fills in the worst version. It\'s not distrust — it\'s emotional memory trying to protect you.',
  },
  {
    title: 'Your Growth Edge',
    emoji: '🧭',
    content: 'Asking for what you need before resentment builds. You often wait until you\'re sure it\'s "worth asking" — but the asking itself is what makes it worth it.',
  },
];

export default function LoveReadingScreen() {
  const router = useRouter();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [reading, setReading] = useState<{ hero: string; insights: typeof insights } | null>(null);

  useEffect(() => {
    getLoveReading()
      .then((payload) => setReading({ hero: payload.hero, insights: payload.insights?.map((item: any) => ({
        title: item.title,
        emoji: '✦',
        content: item.body,
      })) ?? insights }))
      .catch(() => setReading(null));
  }, []);

  const visibleReading = reading ?? {
    hero: "You don't need constant attention. You need emotional consistency. A single thoughtful check-in means more to you than hours of presence. When someone remembers what you only mentioned once — that's when you feel most seen.",
    insights,
  };

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
        <Text style={styles.headerLabel}>Love Pattern</Text>
        <View style={styles.backButtonPlaceholder} />
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(100).duration(500).easing(Easing.out(Easing.cubic))}
        style={styles.center}
      >
        <Animated.View entering={ZoomIn.delay(200).duration(300)} style={styles.iconBg}>
          <Text style={styles.icon}>💕</Text>
        </Animated.View>
        <Text style={styles.label}>Love Pattern Reading</Text>
        <Text style={styles.title}>How you love, and what you need in return</Text>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(300).duration(500).easing(Easing.out(Easing.cubic))}
      >
        <LinearGradient
          colors={theme.gradients.love}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroGlow} />
          <Text style={styles.heroText}>
            {visibleReading.hero}
          </Text>
        </LinearGradient>
      </Animated.View>

      <View style={styles.insights}>
        {visibleReading.insights.map((insight, i) => (
          <Animated.View
            key={insight.title}
            entering={FadeInUp.delay(400 + i * 100).duration(500).easing(Easing.out(Easing.cubic))}
          >
            <View style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <Text style={styles.insightEmoji}>{insight.emoji}</Text>
                <Text style={styles.insightTitle}>{insight.title}</Text>
              </View>
              <Text style={styles.insightText}>{insight.content}</Text>
            </View>
          </Animated.View>
        ))}
      </View>

      {(
        <Animated.View
          entering={FadeInUp.duration(500)}
          style={styles.feedbackCard}
        >
          <Text style={styles.feedbackLabel}>Did this feel close to you?</Text>
          <View style={styles.feedbackRow}>
            {['Yes, surprisingly', 'A little', 'Not really'].map((opt, i) => (
              <Animated.View
                key={opt}
                entering={FadeIn.delay(100 + i * 80).duration(400)}
                style={{ flex: 1 }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setFeedback(opt);
                    submitFeedback({
                      targetType: 'love_reading',
                      targetId: null,
                      value: opt === 'Yes, surprisingly' ? 'accurate' : opt === 'A little' ? 'partial' : 'inaccurate',
                    }).catch(() => {});
                  }}
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
              </Animated.View>
            ))}
          </View>
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
  center: { alignItems: 'center', marginBottom: 20 },
  iconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    backgroundColor: '#F4C7D2',
    shadowColor: 'rgba(244,199,210,0.3)',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    shadowOpacity: 1,
    elevation: 6,
  },
  icon: { fontSize: 24 },
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
  heroText: {
    fontSize: 13,
    color: theme.colors.ink,
    lineHeight: 24,
    fontWeight: '500',
    position: 'relative',
    zIndex: 10,
  },
  insights: { gap: 12 },
  insightCard: {
    borderRadius: 24,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  insightEmoji: { fontSize: 16 },
  insightTitle: { fontSize: 14, fontWeight: '500', color: theme.colors.ink },
  lockedTitle: { fontSize: 14, fontWeight: '500', color: theme.colors.muted },
  insightText: { fontSize: 13, color: theme.colors.muted, lineHeight: 22 },
  feedbackCard: {
    borderRadius: 24,
    padding: 16,
    marginTop: 16,
    backgroundColor: 'rgba(221,237,220,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.06)',
  },
  feedbackLabel: {
    fontSize: 11,
    color: theme.colors.muted,
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
});
