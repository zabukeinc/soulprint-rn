import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp, FadeIn, FadeOut } from 'react-native-reanimated';
import { useTier } from '@/src/context/TierContext';
import { useEngagement } from '@/src/hooks/useEngagement';
import { theme } from '@/src/lib/theme';

const moodEmojis: Record<string, string> = {
  Steady: '💛',
  Emotional: '🌊',
  Restless: '⚡',
  Numb: '🧊',
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
  const streak = engagement?.streak || 0;
  const reflections = engagement?.journalEntries || [];
  const moodHistory = engagement?.moodHistory || [];
  const reflectionsCount = engagement?.reflections || 0;

  const last7 = getLast7Days();

  const moodByDate: Record<string, string> = {};
  moodHistory.forEach((m) => {
    moodByDate[m.date] = m.mood;
  });

  const reflectionByDate: Record<string, { id: number; text: string; date: string; prompt: string }> = {};
  reflections.forEach((r) => {
    reflectionByDate[r.date] = r;
  });

  const recentMoods = moodHistory.slice(0, 7);
  const moodCounts: Record<string, number> = {};
  recentMoods.forEach((m) => {
    moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
  });
  const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];

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
                ? `${reflectionsCount} reflection${reflectionsCount !== 1 ? 's' : ''} saved. ${3 - reflectionsCount > 0 ? `${3 - reflectionsCount} more to unlock a deep reading.` : "You've unlocked a deep reading!"}`
                : 'Write your first journal entry on the Today page.'}
            </Text>
          </View>
        </View>
      </Animated.View>

      <View style={styles.weekSection}>
        <Animated.View entering={FadeInUp.duration(500).delay(200)}>
          <View style={styles.weekHeader}>
            <Text style={styles.weekTitle}>This week</Text>
            <Text style={styles.weekCount}>
              {reflectionsCount} reflection{reflectionsCount !== 1 ? 's' : ''}
            </Text>
          </View>
        </Animated.View>
        <View style={styles.weekGrid}>
          {last7.map((day, index) => {
            const hasReflection = !!reflectionByDate[day.date];
            const hasMood = !!moodByDate[day.date];
            const mood = moodByDate[day.date];
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
                <Text style={styles.dayName}>{day.dayName}</Text>
              </Animated.View>
            );
          })}
        </View>
      </View>

      {topMood && moodHistory.length > 1 && (
        <Animated.View entering={FadeInUp.duration(500).delay(300)} style={styles.patternCard}>
          <Text style={styles.patternLabel}>Pattern shift</Text>
          <Text style={styles.patternText}>
            You've felt <Text style={styles.patternBold}>{topMood[0]}</Text> {topMood[1]} time{topMood[1] !== 1 ? 's' : ''} recently.{' '}
            {topMood[0] === 'Steady'
              ? 'That grounded energy is something to name and trust.'
              : topMood[0] === 'Emotional'
              ? 'When feelings surface, they carry information worth noting.'
              : topMood[0] === 'Restless'
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
              <Text style={styles.reflectionsCount}>{reflections.length} saved</Text>
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
        <Animated.View entering={FadeInUp.duration(500).delay(500)} style={styles.savedCard}>
          <View style={[styles.savedIcon, { backgroundColor: '#E8DDFB' }]}>
            <Text style={styles.savedIconText}>✦</Text>
          </View>
          <View style={styles.savedText}>
            <Text style={styles.savedName}>Free Soulprint Snapshot</Text>
            <Text style={styles.savedDesc}>Your first mirror</Text>
          </View>
          <Text style={styles.savedArrow}>→</Text>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.duration(500).delay(550)}
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
              <Text style={styles.savedName}>Full Soulprint</Text>
              {!isPremium && (
                <View style={styles.lockedBadge}>
                  <Text style={styles.lockedBadgeText}>Locked</Text>
                </View>
              )}
            </View>
            <Text style={styles.savedDesc}>Complete emotional blueprint</Text>
          </View>
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
    paddingBottom: 100,
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
