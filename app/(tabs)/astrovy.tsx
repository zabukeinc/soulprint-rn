import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeIn, FadeOut } from 'react-native-reanimated';
import { useTier } from '@/src/context/TierContext';
import { theme } from '@/src/lib/theme';
import { getAstrovyReading, getMe } from '@/src/services/backend';

const sections = [
  {
    id: 'emotional',
    emoji: '🌊',
    title: 'Emotional Blueprint',
    subtitle: 'How you process what you feel',
    gradient: ['#F8DCCB', '#F7D875'] as const,
    preview: 'You process intensity privately. By the time you express something, you\'ve already thought it through three times.',
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
    content: {
      core: 'Your year is asking you to stop waiting for permission to take up emotional space. The theme is "visible growth" — not loud growth, but growth that you stop hiding.',
      pattern: 'This year, the relationships that deepen will be the ones where you say the second thing — the thing after "I\'m fine." The first answer is your reflex. The second is your truth.',
      insight: 'Watch for a recurring moment this year: the pause where you almost say something and don\'t. That pause is your year\'s invitation.',
      affirmation: 'This year is not about becoming someone new. It\'s about letting someone you already are stop hiding.',
    },
  },
];

export default function AstrovyScreen() {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { isPremium } = useTier();
  const [profile, setProfile] = useState<any | null>(null);
  const [astro, setAstro] = useState<any | null>(null);
  const [reading, setReading] = useState<any | null>(null);

  useEffect(() => {
    Promise.all([getMe(), getAstrovyReading()])
      .then(([me, astrovy]) => {
        setProfile(me.profile);
        setAstro(me.astro);
        setReading(astrovy);
      })
      .catch(() => {});
  }, []);

  const visibleSections = useMemo(() => {
    const backendSections = reading?.sections;
    if (!Array.isArray(backendSections)) return sections;
    return backendSections.map((section: any, index: number) => {
      const fallback = sections[index] ?? sections[0];
      return {
        ...fallback,
        id: String(section.key ?? fallback.id),
        title: String(section.title ?? fallback.title),
        preview: String(section.core ?? fallback.preview),
        content: {
          core: String(section.core ?? fallback.content.core),
          pattern: String(section.pattern ?? fallback.content.pattern),
          insight: String(section.insight ?? fallback.content.insight),
          affirmation: String(section.affirmation ?? fallback.content.affirmation),
        },
      };
    });
  }, [reading]);

  const name = profile?.name ?? 'You';
  const archetype = astro?.archetype?.name ?? reading?.archetype?.name ?? 'Your Core Archetype';
  const sunSign = astro?.sunSign ? `${astro.sunSign[0].toUpperCase()}${astro.sunSign.slice(1)} Sun` : 'Sun Sign';
  const lifePath = astro?.lifePath ? `Life Path ${astro.lifePath}` : 'Life Path';
  const focus = profile?.focus ? `${profile.focus} focus` : 'Focus';
  const emotionalSection = visibleSections[0];
  const loveSection = visibleSections[1];
  const growthSection = visibleSections[4] ?? visibleSections[2];
  const freeSnapshot = [
    {
      label: 'Core Pattern',
      title: emotionalSection?.title ?? 'Emotional Blueprint',
      body: emotionalSection?.content.core ?? 'Your emotional blueprint is syncing from the backend.',
    },
    {
      label: 'Connection Style',
      title: loveSection?.title ?? 'Love Pattern',
      body: loveSection?.preview ?? 'Your connection pattern will appear here once your Soulprint is ready.',
    },
    {
      label: 'Next Growth Edge',
      title: growthSection?.title ?? 'Growth Direction',
      body: growthSection?.preview ?? 'Your growth direction will appear here once your Soulprint is ready.',
    },
  ];
  const unlockMap = visibleSections.map((section, index) => ({
    section,
    state: index === 0 ? 'Open' : index === 1 ? 'Preview' : 'Premium',
  }));

  const toggleSection = (id: string) => {
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
            <Text style={styles.headerTitle}>{name}'s Astrovy</Text>
          </View>
          <View style={styles.headerIcon}>
            <Text style={styles.headerIconText}>✦</Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(500).delay(50)}>
        <Text style={styles.intro}>
          We see you, {name}. Here's what your emotional blueprint looks like — the patterns that shape how you connect, decide, and grow.
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
          <Text style={styles.heroTitle}>{archetype}</Text>
          <Text style={styles.heroDesc}>
            {astro?.archetype?.tagline ?? 'You process deeply, move carefully, and often understand the room before you explain yourself.'}
          </Text>
          <View style={styles.heroBadges}>
            {[sunSign, lifePath, focus].map((badge) => (
              <View key={badge} style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>{badge}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>
      </Animated.View>

      {isPremium ? (
        <>
          <Animated.View entering={FadeInUp.duration(500).delay(200)}>
            <View style={styles.blueprintHeader}>
              <Text style={styles.blueprintTitle}>Your Blueprint</Text>
              <Text style={styles.blueprintSub}>Tap to explore</Text>
            </View>
          </Animated.View>

          <View style={styles.sections}>
            {visibleSections.map((section, index) => {
              const isExpanded = expandedId === section.id;

              return (
                <Animated.View
                  key={section.id}
                  entering={FadeInUp.duration(500).delay(250 + index * 80)}
                >
                  <View>
                    <TouchableOpacity
                      onPress={() => toggleSection(section.id)}
                      activeOpacity={0.85}
                      style={[
                        styles.sectionBtn,
                        {
                          backgroundColor: isExpanded
                            ? 'rgba(255,255,255,0.9)'
                            : 'rgba(255,255,255,0.74)',
                          borderColor: isExpanded
                            ? 'rgba(139,114,207,0.18)'
                            : 'rgba(31,33,48,0.08)',
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
                          <Text style={styles.sectionIcon}>{section.emoji}</Text>
                        </LinearGradient>
                        <View style={styles.sectionText}>
                          <Text style={styles.sectionTitle}>{section.title}</Text>
                          {!isExpanded ? (
                            <Text style={styles.sectionPreview} numberOfLines={1}>
                              {section.preview}
                            </Text>
                          ) : (
                            <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>
                          )}
                        </View>
                        <Text style={styles.expandArrow}>{isExpanded ? '▾' : '▸'}</Text>
                      </View>
                    </TouchableOpacity>

                    {isExpanded && (
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
        </>
      ) : (
        <Animated.View entering={FadeInUp.duration(500).delay(750)}>
          <View style={styles.blueprintHeader}>
            <Text style={styles.blueprintTitle}>Soul Snapshot</Text>
            <Text style={styles.blueprintSub}>Free reading</Text>
          </View>

          <View style={styles.snapshotCard}>
            <Text style={styles.snapshotEyebrow}>What is open now</Text>
            <Text style={styles.snapshotTitle}>A complete first look at your Soulprint</Text>
            <Text style={styles.snapshotBody}>
              Your free Soul page gives you the essentials without cutting off the reading. Premium unlocks the deeper pattern work, hidden insight, and affirmation layers.
            </Text>
          </View>

          <View style={styles.snapshotGrid}>
            {freeSnapshot.map((item, index) => (
              <Animated.View key={item.label} entering={FadeInUp.duration(450).delay(820 + index * 70)} style={styles.snapshotInsightCard}>
                <Text style={styles.snapshotInsightLabel}>{item.label}</Text>
                <Text style={styles.snapshotInsightTitle}>{item.title}</Text>
                <Text style={styles.snapshotInsightBody}>{item.body}</Text>
              </Animated.View>
            ))}
          </View>

          <View style={styles.unlockCard}>
            <View style={styles.unlockHeader}>
              <View>
                <Text style={styles.unlockTitle}>Full Blueprint Map</Text>
                <Text style={styles.unlockSub}>What premium expands</Text>
              </View>
              <Text style={styles.unlockBadge}>6 layers</Text>
            </View>

            {unlockMap.map(({ section, state }) => (
              <View key={section.id} style={styles.unlockRow}>
                <LinearGradient
                  colors={section.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.unlockIcon}
                >
                  <Text style={styles.unlockIconText}>{section.emoji}</Text>
                </LinearGradient>
                <View style={styles.unlockCopy}>
                  <Text style={styles.unlockRowTitle}>{section.title}</Text>
                  <Text style={styles.unlockRowSub}>{state === 'Open' ? section.preview : section.subtitle}</Text>
                </View>
                <View style={[styles.unlockPill, state === 'Premium' && styles.unlockPillPremium]}>
                  <Text style={[styles.unlockPillText, state === 'Premium' && styles.unlockPillTextPremium]}>{state}</Text>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity onPress={() => router.push('/pricing')} activeOpacity={0.85}>
            <Text style={styles.goDeeperLink}>Go deeper with Premium →</Text>
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
  snapshotCard: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    ...theme.shadows.warmSm,
  },
  snapshotEyebrow: {
    fontSize: 10,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    color: '#8B72CF',
    fontWeight: '800',
    marginBottom: 8,
  },
  snapshotTitle: {
    fontFamily: theme.fonts.serif,
    fontSize: 21,
    color: theme.colors.ink,
    fontWeight: '500',
    lineHeight: 25,
    marginBottom: 8,
  },
  snapshotBody: {
    fontSize: 13,
    color: theme.colors.muted,
    lineHeight: 21,
  },
  snapshotGrid: { gap: 10, marginBottom: 14 },
  snapshotInsightCard: {
    borderRadius: 22,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.07)',
  },
  snapshotInsightLabel: {
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#16A7A0',
    fontWeight: '800',
    marginBottom: 6,
  },
  snapshotInsightTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.ink,
    marginBottom: 6,
  },
  snapshotInsightBody: {
    fontSize: 13,
    color: theme.colors.muted,
    lineHeight: 20,
  },
  unlockCard: {
    borderRadius: 24,
    padding: 14,
    backgroundColor: 'rgba(232,221,251,0.34)',
    borderWidth: 1,
    borderColor: 'rgba(139,114,207,0.14)',
    gap: 8,
  },
  unlockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingBottom: 4,
  },
  unlockTitle: { fontSize: 14, fontWeight: '800', color: theme.colors.ink },
  unlockSub: { fontSize: 12, color: theme.colors.muted, marginTop: 2 },
  unlockBadge: {
    overflow: 'hidden',
    fontSize: 12,
    fontWeight: '800',
    color: '#8B72CF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.72)',
  },
  unlockRow: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.74)',
  },
  unlockIcon: {
    width: 36,
    height: 36,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unlockIconText: { fontSize: 16 },
  unlockCopy: { flex: 1, minWidth: 0 },
  unlockRowTitle: { fontSize: 13, fontWeight: '800', color: theme.colors.ink },
  unlockRowSub: { fontSize: 11, color: theme.colors.muted, lineHeight: 16, marginTop: 2 },
  unlockPill: {
    minWidth: 58,
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: 'rgba(221,237,220,0.8)',
  },
  unlockPillPremium: {
    backgroundColor: 'rgba(139,114,207,0.12)',
  },
  unlockPillText: { fontSize: 10, fontWeight: '800', color: '#16A7A0' },
  unlockPillTextPremium: {
    color: '#8B72CF',
  },
  goDeeperLink: {
    fontSize: 14,
    fontWeight: '800',
    color: '#8B72CF',
    textAlign: 'center',
    paddingVertical: 16,
    marginTop: 8,
  },
  snapshotLink: {
    fontSize: 14,
    fontWeight: '800',
    color: '#8B72CF',
    textAlign: 'center',
    paddingVertical: 12,
  },
});
