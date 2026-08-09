import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import Animated, { FadeInUp, FadeIn, FadeOut } from 'react-native-reanimated';
import { useTier } from '@/src/context/TierContext';
import { useEngagement } from '@/src/hooks/useEngagement';
import { theme } from '@/src/lib/theme';
import { InlineRefreshing, SkeletonBlock, SkeletonCard } from '@/src/components/LoadingState';

const moodEmojis: Record<string, string> = {
  steady: '💛',
  tender: '🌊',
  restless: '⚡',
  quiet: '🧊',
};

function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en', { weekday: 'short' });
    const dayNum = d.getDate();
    days.push({ date: dateStr, dayName, dayNum });
  }
  return days;
}

export default function MirrorScreen() {
  const router = useRouter();
  const { isPremium } = useTier();
  const engagement = useEngagement();
  const mirror = engagement.mirrorPayload;
  const streak = mirror?.streak ?? engagement?.streak ?? 0;
  const reflections = mirror?.recentEntries ?? engagement?.journalEntries ?? [];
  const moodHistory = engagement?.moodHistory || [];
  const reflectionsCount = mirror?.reflections ?? engagement?.reflections ?? 0;
  const reflectionsToUnlock = mirror?.reflectionsToUnlock ?? Math.max(0, 3 - reflectionsCount);
  const insightSummary = mirror?.insightSummary;
  const patternCards = mirror?.patternCards ?? [];
  const refreshEngagement = engagement.refresh;

  useFocusEffect(
    useCallback(() => {
      refreshEngagement?.().catch(() => {});
    }, [refreshEngagement])
  );

  const last7 = mirror?.weeklyArc?.days ?? getLast7Days().map((day) => ({
    date: day.date,
    dayLetter: day.dayName.charAt(0),
    checkedIn: false,
    mood: null,
    journaled: false,
    intensity: 0,
  }));

  const moodByDate: Record<string, string> = {};
  moodHistory.forEach((m) => {
    moodByDate[m.date] = m.mood;
  });

  const reflectionByDate: Record<string, { id: string; text: string; date: string; prompt: string }> = {};
  reflections.forEach((r) => {
    reflectionByDate[r.date] = r;
  });

  const recentMoods = moodHistory.slice(0, 7);
  const moodCounts: Record<string, number> = {};
  recentMoods.forEach((m) => {
    moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
  });
  const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];

  if (!engagement.loaded && engagement.loading) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.headerLabel}>Growth</Text>
            <Text style={styles.headerTitle}>Mirror</Text>
          </View>
        </View>
        <Text style={styles.description}>
          Your patterns, reflected back. This is where you see what's shifting.
        </Text>
        <SkeletonCard height={150} lines={3} />
        <SkeletonCard height={132} lines={2} style={{ marginTop: 16 }} />
        <View style={[styles.weekGrid, { marginTop: 18, marginBottom: 20 }]}>
          {Array.from({ length: 7 }).map((_, index) => (
            <View key={index} style={styles.dayCol}>
              <SkeletonBlock height={42} radius={14} style={{ width: '100%' }} />
              <SkeletonBlock width={16} height={8} radius={4} />
            </View>
          ))}
        </View>
        <SkeletonCard height={118} lines={2} />
        <SkeletonCard height={118} lines={2} style={{ marginTop: 12 }} />
        <SkeletonCard height={92} lines={1} style={{ marginTop: 18 }} />
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeInUp.duration(500)}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerLabel}>Growth</Text>
            <Text style={styles.headerTitle}>Mirror</Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(500).delay(50)}>
        <Text style={styles.description}>
          Your patterns, reflected back. This is where you see what's shifting.
        </Text>
      </Animated.View>

      {engagement.refreshing && (
        <InlineRefreshing label="Updating Mirror..." />
      )}

      <Animated.View entering={FadeInUp.duration(500).delay(80)} style={styles.insightCard}>
        <Text style={styles.insightLabel}>Current Pattern</Text>
        <Text style={styles.insightTitle}>{insightSummary?.title ?? 'Your pattern is forming'}</Text>
        <Text style={styles.insightBody}>
          {insightSummary?.body ?? 'Check in and write a short reflection so Mirror can start showing your emotional pattern clearly.'}
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(500).delay(100)}>
        <View
          style={[
            styles.streakCard,
            {
              backgroundColor:
                streak > 1
                  ? 'rgba(247,216,117,0.25)'
                  : '#FFFDF7',
            },
          ]}
        >
          <View style={styles.streakGlow} />
          <View style={styles.streakContent}>
            <Text style={styles.streakLabel}>
              {streak > 1 ? `${streak}-day streak` : 'Your reflection arc'}
            </Text>
            <Text style={styles.streakTitle}>
              {streak > 2
                ? "You're building something real."
                : streak > 0
                ? 'Every reflection counts.'
                : 'Start your first reflection today.'}
            </Text>
            <Text style={styles.streakDesc}>
              {reflectionsCount > 0
                ? `${reflectionsCount} reflection${reflectionsCount !== 1 ? 's' : ''} saved. ${reflectionsToUnlock > 0 ? `${reflectionsToUnlock} more to unlock a deep reading.` : "You've unlocked a deep reading!"}`
                : 'Write your first journal entry on the Today page.'}
            </Text>
          </View>
        </View>
      </Animated.View>

      <View style={styles.weekSection}>
        <Animated.View entering={FadeInUp.duration(500).delay(200)}>
          <View style={styles.weekHeader}>
            <Text style={styles.weekTitle}>Weekly arc</Text>
            <Text style={styles.weekCount}>
              {mirror?.weeklyArc ? `${mirror.weeklyArc.completionRate}% checked in` : `${reflectionsCount} reflection${reflectionsCount !== 1 ? 's' : ''}`}
            </Text>
          </View>
        </Animated.View>
        <View style={styles.weekGrid}>
          {last7.map((day, index) => {
            const hasReflection = !!reflectionByDate[day.date];
            const hasMood = !!day.mood || !!moodByDate[day.date];
            const mood = day.mood ?? moodByDate[day.date];
            return (
              <Animated.View
                key={day.date}
                entering={FadeInUp.duration(500).delay(250 + index * 40)}
                style={styles.dayCol}
              >
                <View
                  style={[
                    styles.dayBox,
                    {
                      backgroundColor: hasReflection
                        ? '#8B72CF'
                        : hasMood
                        ? 'rgba(22,167,160,0.15)'
                        : 'rgba(31,33,48,0.04)',
                      borderWidth: hasReflection ? 0 : 1,
                      borderColor: 'rgba(31,33,48,0.06)',
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: hasReflection ? '#FFFFFF' : hasMood ? theme.colors.ink : theme.colors.muted + '4D',
                    }}
                  >
                    {hasReflection ? '✓' : hasMood ? moodEmojis[mood] || '·' : '·'}
                  </Text>
                </View>
                <Text style={styles.dayName}>{day.dayLetter}</Text>
              </Animated.View>
            );
          })}
        </View>
      </View>

      {patternCards.length > 0 && (
        <View style={styles.patternGrid}>
          {patternCards.map((card, index) => (
            <Animated.View key={card.key} entering={FadeInUp.duration(500).delay(260 + index * 60)} style={styles.patternInsightCard}>
              <Text style={styles.patternInsightLabel}>{card.title}</Text>
              <Text style={styles.patternInsightValue}>{card.value}</Text>
              <Text style={styles.patternInsightBody}>{card.body}</Text>
              {card.premiumDepth && (
                <View style={styles.premiumDepthBadge}>
                  <Text style={styles.premiumDepthText}>Premium depth</Text>
                </View>
              )}
            </Animated.View>
          ))}
        </View>
      )}

      {topMood && moodHistory.length > 1 && (
        <Animated.View entering={FadeInUp.duration(500).delay(300)} style={styles.patternCard}>
          <Text style={styles.patternLabel}>Pattern shift</Text>
          <Text style={styles.patternText}>
            You've felt <Text style={styles.patternBold}>{topMood[0]}</Text> {topMood[1]} time{topMood[1] !== 1 ? 's' : ''} recently.{' '}
            {topMood[0] === 'steady'
              ? 'That grounded energy is something to name and trust.'
              : topMood[0] === 'tender'
              ? 'When feelings surface, they carry information worth noting.'
              : topMood[0] === 'restless'
              ? 'Something is asking for your attention. Sit with it before chasing it.'
              : 'Numbness is a signal too. Your body may be asking for rest.'}
          </Text>
        </Animated.View>
      )}

      {reflections.length > 0 && (
        <>
          <Animated.View entering={FadeInUp.duration(500).delay(350)}>
            <View style={styles.reflectionsHeader}>
              <Text style={styles.reflectionsTitle}>Your reflections</Text>
              <TouchableOpacity activeOpacity={0.85} onPress={() => router.push('/journey')}>
                <Text style={styles.viewHistoryText}>View journey</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
          <View style={styles.reflectionsList}>
            {reflections.slice(0, 5).map((entry, index) => (
              <Animated.View
                key={entry.id}
                entering={FadeInUp.duration(500).delay(400 + index * 80)}
                style={styles.reflectionCard}
              >
                <View style={styles.reflectionIcon}>
                  <Text style={styles.reflectionIconText}>📝</Text>
                </View>
                <View style={styles.reflectionText}>
                  <View style={styles.reflectionHeader}>
                    <Text style={styles.reflectionPrompt} numberOfLines={1}>
                      {entry.prompt}
                    </Text>
                    <View style={styles.youBadge}>
                      <Text style={styles.youBadgeText}>You</Text>
                    </View>
                  </View>
                  <Text style={styles.reflectionBody} numberOfLines={2}>
                    {entry.text}
                  </Text>
                  <Text style={styles.reflectionDate}>{entry.date}</Text>
                </View>
              </Animated.View>
            ))}
          </View>
        </>
      )}

      <Animated.View entering={FadeInUp.duration(500).delay(450)}>
        <View style={styles.savedHeader}>
          <Text style={styles.savedTitle}>Saved</Text>
        </View>
      </Animated.View>

      <View style={styles.savedList}>
        <Animated.View entering={FadeInUp.duration(500).delay(500)}>
          <TouchableOpacity activeOpacity={0.85} onPress={() => router.push('/snapshot')} style={styles.savedCard}>
          <View style={[styles.savedIcon, { backgroundColor: '#E8DDFB' }]}>
            <Text style={styles.savedIconText}>✦</Text>
          </View>
          <View style={styles.savedText}>
            <Text style={styles.savedName}>Free Astrovy Snapshot</Text>
            <Text style={styles.savedDesc}>Your first mirror</Text>
          </View>
          <Text style={styles.savedArrow}>→</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.duration(500).delay(550)}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push(isPremium ? '/(tabs)/astrovy' : '/pricing')}
            style={[
            styles.savedCard,
            {
              backgroundColor: isPremium ? 'rgba(255,255,255,0.9)' : 'rgba(232,221,251,0.4)',
              borderColor: isPremium ? 'rgba(31,33,48,0.08)' : 'rgba(139,114,207,0.18)',
              opacity: isPremium ? 1 : 0.65,
            },
          ]}
          >
          <View
            style={[
              styles.savedIcon,
              { backgroundColor: 'rgba(232,221,251,0.6)' },
            ]}
          >
            <Text style={styles.savedIconText}>{isPremium ? '✦' : '🔒'}</Text>
          </View>
          <View style={styles.savedText}>
            <View style={styles.savedHeaderRow}>
              <Text style={styles.savedName}>Full Astrovy</Text>
              {!isPremium && (
                <View style={styles.lockedBadge}>
                  <Text style={styles.lockedBadgeText}>Locked</Text>
                </View>
              )}
            </View>
            <Text style={styles.savedDesc}>Complete emotional blueprint</Text>
          </View>
          <Text style={styles.savedArrow}>→</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {!isPremium && (
        <Animated.View entering={FadeInUp.duration(500).delay(600)}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/pricing')}
          >
            <View style={styles.unlockBtn}>
              <Text style={styles.unlockBtnText}>✦ Unlock your full Mirror</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}

      <Animated.View entering={FadeInUp.duration(500).delay(650)} style={styles.footerCard}>
        <Text style={styles.footerText}>
          <Text style={styles.footerBold}>Your mirror grows with you.</Text> Every reflection adds depth to how the app reads your pattern.
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
    paddingTop: 40,
    paddingBottom: 130,
  },
  header: { marginBottom: 4 },
  headerLabel: { fontSize: 12, color: theme.colors.muted, letterSpacing: 0.5 },
  headerTitle: {
    fontFamily: theme.fonts.serif,
    fontSize: 28,
    fontWeight: '500',
    color: theme.colors.ink,
  },
  description: {
    fontSize: 13,
    color: theme.colors.muted,
    lineHeight: 22,
    marginBottom: 20,
  },
  insightCard: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    ...theme.shadows.warmSm,
  },
  insightLabel: {
    fontSize: 10,
    letterSpacing: 1.1,
    color: '#16A7A0',
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 8,
  },
  insightTitle: {
    fontFamily: theme.fonts.serif,
    fontSize: 22,
    fontWeight: '500',
    color: theme.colors.ink,
    lineHeight: 26,
    marginBottom: 8,
  },
  insightBody: {
    fontSize: 13,
    color: theme.colors.muted,
    lineHeight: 21,
  },
  streakCard: {
    borderRadius: theme.radius.lg,
    padding: 20,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    ...theme.shadows.warmSoft,
  },
  streakGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.5)',
    right: -20,
    top: -20,
    opacity: 0.2,
  },
  streakContent: { position: 'relative', zIndex: 10 },
  streakLabel: {
    fontSize: 11,
    letterSpacing: 1.4,
    color: '#8B72CF',
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 8,
  },
  streakTitle: {
    fontFamily: theme.fonts.serif,
    fontSize: 22,
    fontWeight: '500',
    color: theme.colors.ink,
    lineHeight: 26,
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  streakDesc: { fontSize: 12, color: theme.colors.softMuted },
  weekSection: { marginBottom: 20 },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  weekTitle: { fontSize: 14, fontWeight: '700', color: theme.colors.ink },
  weekCount: { fontSize: 12, color: theme.colors.muted },
  weekGrid: { flexDirection: 'row', gap: 8 },
  dayCol: { flex: 1, alignItems: 'center', gap: 6 },
  dayBox: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayName: { fontSize: 10, color: theme.colors.muted },
  patternGrid: {
    gap: 10,
    marginBottom: 16,
  },
  patternInsightCard: {
    borderRadius: 22,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.74)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.07)',
    ...theme.shadows.warmSm,
  },
  patternInsightLabel: {
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#8B72CF',
    fontWeight: '800',
    marginBottom: 5,
  },
  patternInsightValue: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.ink,
    marginBottom: 6,
  },
  patternInsightBody: {
    fontSize: 12,
    color: theme.colors.muted,
    lineHeight: 19,
  },
  premiumDepthBadge: {
    alignSelf: 'flex-start',
    marginTop: 10,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(139,114,207,0.12)',
  },
  premiumDepthText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8B72CF',
  },
  patternCard: {
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(221,237,220,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.06)',
  },
  patternLabel: {
    fontSize: 11,
    letterSpacing: 1,
    color: '#16A7A0',
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 4,
  },
  patternText: { fontSize: 13, color: theme.colors.ink, lineHeight: 22 },
  patternBold: { fontWeight: '500' },
  reflectionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reflectionsTitle: { fontSize: 14, fontWeight: '700', color: theme.colors.ink },
  reflectionsCount: { fontSize: 12, color: theme.colors.muted },
  viewHistoryText: { fontSize: 12, color: '#8B72CF', fontWeight: '800' },
  reflectionsList: { gap: 10, marginBottom: 16 },
  reflectionCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(22,167,160,0.12)',
    backgroundColor: 'rgba(221,237,220,0.2)',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    ...theme.shadows.warmSm,
  },
  reflectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#DDEDDC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reflectionIconText: { fontSize: 14 },
  reflectionText: { flex: 1, minWidth: 0 },
  reflectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  reflectionPrompt: { fontSize: 13, fontWeight: '500', color: theme.colors.ink, flex: 1 },
  youBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: 'rgba(22,167,160,0.1)',
  },
  youBadgeText: { fontSize: 10, fontWeight: '800', color: '#16A7A0' },
  reflectionBody: { fontSize: 12, color: theme.colors.ink + 'B3', lineHeight: 18 },
  reflectionDate: { fontSize: 10, color: theme.colors.muted + '99', marginTop: 4 },
  savedHeader: { marginBottom: 12 },
  savedTitle: { fontSize: 14, fontWeight: '700', color: theme.colors.ink },
  savedList: { gap: 10, marginBottom: 16 },
  savedCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    backgroundColor: 'rgba(255,255,255,0.74)',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...theme.shadows.warmSm,
  },
  savedIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedIconText: { fontSize: 14 },
  savedText: { flex: 1, minWidth: 0 },
  savedName: { fontSize: 14, fontWeight: '500', color: theme.colors.ink, marginBottom: 2 },
  savedDesc: { fontSize: 11, color: theme.colors.muted },
  savedArrow: { fontSize: 16, color: theme.colors.muted },
  savedHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lockedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.52)',
    borderWidth: 1,
    borderColor: 'rgba(139,114,207,0.18)',
  },
  lockedBadgeText: { fontSize: 10, fontWeight: '800', color: '#7A63BD' },
  unlockBtn: {
    width: '100%',
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#8B72CF',
    ...theme.shadows.primaryGlow,
  },
  unlockBtnText: { fontSize: 14, fontWeight: '500', color: '#FFFFFF' },
  footerCard: {
    borderRadius: theme.radius.lg,
    padding: 20,
    backgroundColor: 'rgba(232,221,251,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
  },
  footerText: { fontSize: 12, color: theme.colors.muted, textAlign: 'center' },
  footerBold: { fontWeight: '500', color: theme.colors.ink },
});
