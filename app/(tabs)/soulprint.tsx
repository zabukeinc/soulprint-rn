import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeIn, FadeOut } from 'react-native-reanimated';
import { useTier } from '@/src/context/TierContext';
import { theme } from '@/src/lib/theme';

const sections = [
  {
    id: 'emotional',
    emoji: '🌊',
    title: 'Emotional Blueprint',
    subtitle: 'How you process what you feel',
    gradient: ['#F8DCCB', '#F7D875'] as const,
    preview: 'You process intensity privately. By the time you express something, you\'ve already thought it through three times.',
    locked: false,
    content: {
      core: 'You process intensity privately. By the time you express something, you\'ve already thought it through three times. This isn\'t avoidance — it\'s your way of protecting the moment from half-formed reactions.',
      pattern: 'You tend to go quiet when overwhelmed. Not because you\'re shutting down, but because you\'re filtering. People close to you might mistake your stillness for distance.',
      insight: 'Your emotional processing is not slower than others — it\'s more thorough. You hold complexity well, but you carry it alone sometimes.',
      affirmation: 'Your depth is not a delay. It\'s a design.',
    },
  },
  {
    id: 'love',
    emoji: '💕',
    title: 'Love Pattern',
    subtitle: 'The rhythm behind closeness and safety',
    gradient: ['#F4C7D2', '#E8DDFB'] as const,
    preview: 'You don\'t need constant attention. You need emotional consistency. Silence that feels intentional worries you.',
    locked: false,
    content: {
      core: 'You don\'t need constant attention. You need emotional consistency. A single thoughtful check-in means more to you than hours of presence.',
      pattern: 'You track small behavioral shifts — not to control, but because your emotional memory is precise. You notice when the tone changes before anyone says anything.',
      insight: 'Your love language is being seen in the details. You feel most connected when someone remembers something you only mentioned once.',
      affirmation: 'You don\'t ask for much. You ask for meaning.',
    },
  },
  {
    id: 'shadow',
    emoji: '✦',
    title: 'Shadow Self',
    subtitle: 'What you hide even from your own language',
    gradient: ['#E8DDFB', '#DDEDDC'] as const,
    preview: 'You sometimes use understanding as a shield. If you can explain why someone hurt you, you don\'t have to feel the hurt.',
    locked: true,
    content: {
      core: 'You sometimes use understanding as a shield. If you can explain why someone hurt you, you don\'t have to feel the hurt. Your self-awareness can become a form of emotional armor.',
      pattern: 'You say "I understand" before you say "I\'m hurt." You compress pain into insight so it feels manageable. But understanding doesn\'t always mean processing.',
      insight: 'The part of you that doesn\'t get expressed isn\'t weak — it\'s the part that hasn\'t found safe enough ground yet.',
      affirmation: 'You are allowed to not understand. You are allowed to just feel.',
    },
  },
  {
    id: 'career',
    emoji: '🧭',
    title: 'Career Energy',
    subtitle: 'Where you thrive when work aligns with who you are',
    gradient: ['#DDEDDC', '#DFF2EC'] as const,
    preview: 'You work best when the purpose is clear and the stakes are real. Titles and structure matter less than meaning.',
    locked: true,
    content: {
      core: 'You work best when the purpose is clear and the stakes are real. Titles and structure matter less to you than meaning. You\'d rather be trusted than managed.',
      pattern: 'You can over-deliver in roles that feel aligned and quietly disengage when they don\'t. Your motivation is internal — external pressure only works temporarily.',
      insight: 'Your ideal work environment has three things: autonomy, ethical clarity, and room to think before responding. Remove any one, and you start looking elsewhere.',
      affirmation: 'You don\'t need a boss. You need a mission worth your attention.',
    },
  },
  {
    id: 'growth',
    emoji: '🌱',
    title: 'Growth Direction',
    subtitle: 'What to nurture — and what to stop performing',
    gradient: ['#F7D875', '#F8DCCB'] as const,
    preview: 'Your growth this year isn\'t about doing more. It\'s about admitting what you already know but haven\'t said yet.',
    locked: true,
    content: {
      core: 'Your growth this year isn\'t about doing more. It\'s about admitting what you already know but haven\'t said yet. The real shift comes when you stop translating your needs for other people\'s comfort.',
      pattern: 'You tend to grow in private and announce progress only when it\'s tidy. The messy middle — the part where you\'re uncertain — is where the real transformation lives.',
      insight: 'Your greatest growth periods have come after a quiet decision you didn\'t announce. Trust that pattern again.',
      affirmation: 'You don\'t have to arrive polished. Growth is supposed to be messy.',
    },
  },
  {
    id: 'theme',
    emoji: '🌙',
    title: '12-Month Theme',
    subtitle: 'The overarching direction your year wants to take',
    gradient: ['#9FD9D0', '#DDEDDC'] as const,
    preview: 'Your year is asking you to stop waiting for permission to take up emotional space.',
    locked: true,
    content: {
      core: 'Your year is asking you to stop waiting for permission to take up emotional space. The theme is "visible growth" — not loud growth, but growth that you stop hiding.',
      pattern: 'This year, the relationships that deepen will be the ones where you say the second thing — the thing after "I\'m fine." The first answer is your reflex. The second is your truth.',
      insight: 'Watch for a recurring moment this year: the pause where you almost say something and don\'t. That pause is your year\'s invitation.',
      affirmation: 'This year is not about becoming someone new. It\'s about letting someone you already are stop hiding.',
    },
  },
];

export default function SoulprintScreen() {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { isPremium } = useTier();

  const toggleSection = (id: string, isLocked: boolean) => {
    if (isLocked && !isPremium) return;
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeInUp.duration(500)}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerLabel}>Your identity map</Text>
            <Text style={styles.headerTitle}>Gy's Soulprint</Text>
          </View>
          <View style={styles.headerIcon}>
            <Text style={styles.headerIconText}>✦</Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(500).delay(50)}>
        <Text style={styles.intro}>
          We see you, Gy. Here's what your emotional blueprint looks like — the patterns that shape how you connect, decide, and grow.
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(500).delay(100)}>
        <LinearGradient
          colors={theme.gradients.hero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroGlow} />
          <Text style={styles.heroLabel}>Core Archetype</Text>
          <Text style={styles.heroTitle}>The Quiet Strategist</Text>
          <Text style={styles.heroDesc}>
            You process deeply, move carefully, and often understand the room before you explain yourself.
          </Text>
          <View style={styles.heroBadges}>
            {['Aquarius Sun', 'Life Path 7', 'Love Focus'].map((badge) => (
              <View key={badge} style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>{badge}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(500).delay(200)}>
        <View style={styles.blueprintHeader}>
          <Text style={styles.blueprintTitle}>Your Blueprint</Text>
          <Text style={styles.blueprintSub}>
            {isPremium ? 'Tap to explore' : '2 of 6 unlocked'}
          </Text>
        </View>
      </Animated.View>

      <View style={styles.sections}>
        {sections.map((section, index) => {
          const isExpanded = expandedId === section.id;
          const isLocked = section.locked && !isPremium;

          return (
            <Animated.View
              key={section.id}
              entering={FadeInUp.duration(500).delay(250 + index * 80)}
            >
              <View>
                <TouchableOpacity
                  onPress={() => toggleSection(section.id, section.locked)}
                  activeOpacity={0.85}
                  style={[
                    styles.sectionBtn,
                    {
                      backgroundColor: isLocked
                        ? 'rgba(232,221,251,0.5)'
                        : isExpanded
                        ? 'rgba(255,255,255,0.9)'
                        : 'rgba(255,255,255,0.74)',
                      borderColor: isLocked
                        ? 'rgba(139,114,207,0.15)'
                        : isExpanded
                        ? 'rgba(139,114,207,0.18)'
                        : 'rgba(31,33,48,0.08)',
                      opacity: isLocked ? 0.65 : 1,
                    },
                  ]}
                >
                  <View style={styles.sectionRow}>
                    <LinearGradient
                      colors={section.gradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.sectionIconBg}
                    >
                      <Text style={styles.sectionIcon}>
                        {isLocked ? '🔒' : section.emoji}
                      </Text>
                    </LinearGradient>
                    <View style={styles.sectionText}>
                      <Text style={styles.sectionTitle}>{section.title}</Text>
                      {isLocked ? (
                        <Text style={styles.sectionPreview}>
                          Unlock with Premium to reveal this pattern.
                        </Text>
                      ) : !isExpanded ? (
                        <Text style={styles.sectionPreview} numberOfLines={1}>
                          {section.preview}
                        </Text>
                      ) : (
                        <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>
                      )}
                    </View>
                    {isLocked ? (
                      <View style={styles.lockedBadge}>
                        <Text style={styles.lockedBadgeText}>Locked</Text>
                      </View>
                    ) : (
                      <Text style={styles.expandArrow}>{isExpanded ? '▾' : '▸'}</Text>
                    )}
                  </View>
                </TouchableOpacity>

                {isExpanded && !isLocked && (
                  <Animated.View entering={FadeInUp.duration(300)} exiting={FadeOut.duration(200)} style={styles.expandedContent}>
                    <View style={styles.detailCard}>
                      <Text style={styles.detailLabel}>Core Pattern</Text>
                      <Text style={styles.detailText}>{section.content.core}</Text>
                    </View>
                    <View style={[styles.detailCard, { backgroundColor: 'rgba(255,255,255,0.72)' }]}>
                      <Text style={[styles.detailLabel, { color: theme.colors.muted }]}>How It Shows</Text>
                      <Text style={[styles.detailText, { color: theme.colors.muted }]}>{section.content.pattern}</Text>
                    </View>
                    <View style={[styles.detailCard, { backgroundColor: 'rgba(232,221,251,0.4)', borderColor: 'rgba(139,114,207,0.12)' }]}>
                      <Text style={styles.detailLabel}>Hidden Insight</Text>
                      <Text style={styles.detailText}>{section.content.insight}</Text>
                    </View>
                    <View style={[styles.detailCard, { backgroundColor: 'rgba(221,237,220,0.5)', borderColor: 'rgba(31,33,48,0.06)' }]}>
                      <Text style={[styles.detailLabel, { color: '#16A7A0' }]}>Your Affirmation</Text>
                      <Text style={[styles.detailText, { fontWeight: '500', fontStyle: 'italic' }]}>
                        "{section.content.affirmation}"
                      </Text>
                    </View>
                  </Animated.View>
                )}
              </View>
            </Animated.View>
          );
        })}
      </View>

      {!isPremium && (
        <Animated.View entering={FadeInUp.duration(500).delay(750)}>
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
              <Text style={styles.unlockBtnText}>✦ Unlock your full Soulprint</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      )}

      <Animated.View entering={FadeInUp.duration(500).delay(800)}>
        <TouchableOpacity onPress={() => router.push('/snapshot')}>
          <Text style={styles.snapshotLink}>View Free Snapshot</Text>
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
    paddingTop: 40,
    paddingBottom: 130,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  headerLabel: { fontSize: 12, color: theme.colors.muted, letterSpacing: 0.5 },
  headerTitle: {
    fontFamily: theme.fonts.serif,
    fontSize: 28,
    fontWeight: '500',
    color: theme.colors.ink,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.76)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    ...theme.shadows.warmSoft,
  },
  headerIconText: { fontSize: 18 },
  intro: {
    fontSize: 13,
    color: theme.colors.muted,
    lineHeight: 22,
    marginBottom: 20,
  },
  heroCard: {
    borderRadius: theme.radius.lg,
    padding: 20,
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    ...theme.shadows.warmSoft,
  },
  heroGlow: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.28)',
    right: -44,
    top: -50,
  },
  heroLabel: {
    fontSize: 11,
    letterSpacing: 1.4,
    color: '#8B72CF',
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 8,
    position: 'relative',
    zIndex: 10,
  },
  heroTitle: {
    fontFamily: theme.fonts.serif,
    fontSize: 28,
    fontWeight: '500',
    color: theme.colors.ink,
    lineHeight: 32,
    letterSpacing: -0.8,
    marginBottom: 8,
    position: 'relative',
    zIndex: 10,
  },
  heroDesc: {
    fontSize: 14,
    color: theme.colors.muted,
    marginBottom: 16,
    position: 'relative',
    zIndex: 10,
  },
  heroBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    position: 'relative',
    zIndex: 10,
  },
  heroBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.56)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
  },
  heroBadgeText: { fontSize: 12, fontWeight: '700', color: '#6C5F99' },
  blueprintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  blueprintTitle: { fontSize: 14, fontWeight: '700', color: theme.colors.ink },
  blueprintSub: { fontSize: 12, color: theme.colors.muted },
  sections: { gap: 12 },
  sectionBtn: {
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
  },
  sectionRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sectionIconBg: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionIcon: { fontSize: 18 },
  sectionText: { flex: 1, minWidth: 0 },
  sectionTitle: { fontSize: 14, fontWeight: '500', color: theme.colors.ink },
  sectionPreview: {
    fontSize: 12,
    color: theme.colors.muted,
    lineHeight: 18,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: '#8B72CF',
    fontWeight: '800',
  },
  lockedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.52)',
    borderWidth: 1,
    borderColor: 'rgba(139,114,207,0.18)',
  },
  lockedBadgeText: { fontSize: 10, fontWeight: '800', color: '#7A63BD' },
  expandArrow: { fontSize: 12, color: theme.colors.muted },
  expandedContent: {
    paddingTop: 8,
    paddingBottom: 4,
    paddingHorizontal: 4,
    gap: 8,
  },
  detailCard: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.06)',
  },
  detailLabel: {
    fontSize: 11,
    letterSpacing: 1,
    color: '#8B72CF',
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 4,
  },
  detailText: { fontSize: 13, color: theme.colors.ink, lineHeight: 22 },
  unlockBtn: {
    width: '100%',
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
    ...theme.shadows.primaryGlow,
  },
  unlockBtnText: { fontSize: 14, fontWeight: '500', color: '#FFFFFF' },
  snapshotLink: {
    fontSize: 14,
    fontWeight: '800',
    color: '#8B72CF',
    textAlign: 'center',
    paddingVertical: 12,
  },
});
