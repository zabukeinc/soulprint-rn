import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Circle, Line, Polyline } from 'react-native-svg';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { theme } from '@/src/lib/theme';
import { useTier } from '@/src/context/TierContext';
import { getMirrorJourney, type MirrorJourneyPayload } from '@/src/services/backend';
import { SkeletonBlock, SkeletonCard } from '@/src/components/LoadingState';

const moodColors: Record<string, string> = {
  quiet: '#8B72CF',
  tender: '#F4A6B8',
  steady: '#16A7A0',
  restless: '#E8A87C',
};

const moodLabels: Record<string, string> = {
  quiet: 'Quiet',
  tender: 'Tender',
  steady: 'Steady',
  restless: 'Restless',
};

function JourneyGraph({ points }: { points: MirrorJourneyPayload['graph']['points'] }) {
  const width = 320;
  const height = 150;
  const padding = 18;
  const plotted = points.map((point, index) => {
    const x = padding + (index / Math.max(1, points.length - 1)) * (width - padding * 2);
    const y = height - padding - ((point.value - 1) / 3) * (height - padding * 2);
    return { ...point, x, y };
  });
  const polyline = plotted.map((point) => `${point.x},${point.y}`).join(' ');

  return (
    <View style={styles.graphWrap}>
      <Svg width="100%" viewBox={`0 0 ${width} ${height}`} height={height}>
        {[1, 2, 3, 4].map((level) => {
          const y = height - padding - ((level - 1) / 3) * (height - padding * 2);
          return <Line key={level} x1={padding} x2={width - padding} y1={y} y2={y} stroke="rgba(31,33,48,0.08)" strokeWidth={1} />;
        })}
        {plotted.length > 1 && <Polyline points={polyline} fill="none" stroke="#8B72CF" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />}
        {plotted.map((point) => (
          <Circle key={`${point.date}-${point.mood}`} cx={point.x} cy={point.y} r={5} fill={moodColors[point.mood] ?? '#8B72CF'} />
        ))}
      </Svg>
    </View>
  );
}

export default function JourneyScreen() {
  const router = useRouter();
  const { isPremium: previewPremium } = useTier();
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [journey, setJourney] = useState<MirrorJourneyPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isPremium = previewPremium || journey?.access.tier === 'premium';

  useEffect(() => {
    setLoading(true);
    setError(null);
    getMirrorJourney(range)
      .then(setJourney)
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load your journey.'))
      .finally(() => setLoading(false));
  }, [range]);

  const latestMood = useMemo(() => journey?.graph.points.at(-1)?.mood ?? null, [journey?.graph.points]);
  const previewMoodDistribution = useMemo(() => {
    if (!journey) return null;
    if (journey.moodDistribution) return journey.moodDistribution;
    const counts = journey.graph.points.reduce<Record<string, number>>((memo, point) => {
      memo[point.mood] = (memo[point.mood] ?? 0) + 1;
      return memo;
    }, {});
    const total = Math.max(1, journey.graph.points.length);
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([mood, count]) => ({ mood, count, percentage: Math.round((count / total) * 100) }));
  }, [journey]);
  const previewThemeCards = useMemo(() => {
    if (!journey) return null;
    return journey.themeCards ?? [{
      key: 'preview_theme',
      title: 'Pattern Preview',
      body: journey.summary.body,
    }];
  }, [journey]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerLabel}>Mirror</Text>
          <Text style={styles.headerTitle}>Journey</Text>
        </View>
      </View>

      <View style={styles.rangeTabs}>
        {(['7d', '30d', '90d'] as const).map((item) => (
          <TouchableOpacity key={item} onPress={() => setRange(item)} style={[styles.rangeTab, range === item && styles.rangeTabActive]}>
            <Text style={[styles.rangeText, range === item && styles.rangeTextActive]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <>
          <SkeletonCard height={132} lines={2} />
          <SkeletonCard height={220} lines={2} style={{ marginTop: 12 }} />
          <SkeletonCard height={150} lines={3} style={{ marginTop: 12 }} />
          <View style={styles.timelineList}>
            {[0, 1, 2].map((item) => (
              <SkeletonBlock key={item} height={82} radius={22} />
            ))}
          </View>
        </>
      ) : error || !journey ? (
        <View style={styles.loadingCard}>
          <Text style={styles.errorTitle}>Journey unavailable</Text>
          <Text style={styles.loadingText}>{error ?? 'Unable to load your journey.'}</Text>
        </View>
      ) : (
        <>
          <Animated.View entering={FadeInUp.duration(450)} style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Backend summary</Text>
            <Text style={styles.summaryTitle}>{journey.summary.title}</Text>
            <Text style={styles.summaryBody}>{journey.summary.body}</Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.duration(450).delay(80)} style={styles.graphCard}>
            <View style={styles.graphHeader}>
              <View>
                <Text style={styles.sectionTitle}>Emotional graph</Text>
                <Text style={styles.sectionSub}>{journey.reflectionStats.checkInDays} check-ins · {journey.reflectionStats.total} reflections</Text>
              </View>
              {!!latestMood && <Text style={styles.latestMood}>{moodLabels[latestMood] ?? latestMood}</Text>}
            </View>
            {journey.graph.points.length ? <JourneyGraph points={journey.graph.points} /> : <Text style={styles.emptyText}>Check in on Today to start the graph.</Text>}
          </Animated.View>

          {isPremium && previewMoodDistribution && (
            <Animated.View entering={FadeInUp.duration(450).delay(140)} style={styles.distributionCard}>
              <Text style={styles.sectionTitle}>Mood distribution</Text>
              {previewMoodDistribution.map((item) => (
                <View key={item.mood} style={styles.distributionRow}>
                  <Text style={styles.distributionMood}>{moodLabels[item.mood] ?? item.mood}</Text>
                  <View style={styles.distributionBar}>
                    <View style={[styles.distributionFill, { width: `${item.percentage}%`, backgroundColor: moodColors[item.mood] ?? '#8B72CF' }]} />
                  </View>
                  <Text style={styles.distributionPct}>{item.percentage}%</Text>
                </View>
              ))}
            </Animated.View>
          )}

          {!isPremium && (
            <TouchableOpacity activeOpacity={0.85} onPress={() => router.push('/pricing')} style={styles.lockedCard}>
              <Text style={styles.lockedTitle}>Premium journey unlocks deeper graph detail</Text>
              <Text style={styles.lockedBody}>Mood distribution, recurring themes, and longer-range synthesis are ready on premium.</Text>
            </TouchableOpacity>
          )}

          {isPremium && previewThemeCards?.map((card, index) => (
            <Animated.View key={card.key} entering={FadeInUp.duration(450).delay(180 + index * 50)} style={styles.themeCard}>
              <Text style={styles.summaryLabel}>Recurring theme</Text>
              <Text style={styles.themeTitle}>{card.title}</Text>
              <Text style={styles.themeBody}>{card.body}</Text>
            </Animated.View>
          ))}

          <View style={styles.timelineHeader}>
            <Text style={styles.sectionTitle}>Reflection history</Text>
            <Text style={styles.sectionSub}>{journey.timeline.length} shown</Text>
          </View>
          <View style={styles.timelineList}>
            {journey.timeline.map((entry, index) => (
              <Animated.View key={entry.id} entering={FadeInUp.duration(450).delay(220 + index * 40)} style={styles.timelineCard}>
                <View style={[styles.timelineDot, { backgroundColor: entry.mood ? moodColors[entry.mood] ?? '#8B72CF' : '#DDEDDC' }]} />
                <View style={styles.timelineText}>
                  <Text style={styles.timelinePrompt} numberOfLines={1}>{entry.prompt}</Text>
                  <Text style={styles.timelineBody} numberOfLines={3}>{entry.text}</Text>
                  <Text style={styles.timelineDate}>{entry.date}{entry.mood ? ` · ${moodLabels[entry.mood] ?? entry.mood}` : ''}</Text>
                </View>
              </Animated.View>
            ))}
            {!journey.timeline.length && <Text style={styles.emptyText}>Your reflections will appear here after you journal.</Text>}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 40, paddingBottom: 130 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 18 },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.76)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
  },
  backIcon: { fontSize: 18, color: theme.colors.ink },
  headerLabel: { fontSize: 12, color: theme.colors.muted },
  headerTitle: { fontFamily: theme.fonts.serif, fontSize: 28, fontWeight: '500', color: theme.colors.ink },
  rangeTabs: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  rangeTab: { flex: 1, minHeight: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.66)', borderWidth: 1, borderColor: 'rgba(31,33,48,0.08)' },
  rangeTabActive: { backgroundColor: '#8B72CF', borderColor: '#8B72CF' },
  rangeText: { fontSize: 12, fontWeight: '800', color: theme.colors.muted },
  rangeTextActive: { color: '#FFFFFF' },
  loadingCard: { borderRadius: 24, padding: 24, alignItems: 'center', gap: 10, backgroundColor: 'rgba(255,255,255,0.72)' },
  errorTitle: { fontSize: 14, fontWeight: '800', color: theme.colors.ink },
  loadingText: { fontSize: 13, color: theme.colors.muted },
  summaryCard: { borderRadius: 24, padding: 18, marginBottom: 12, backgroundColor: 'rgba(255,255,255,0.82)', borderWidth: 1, borderColor: 'rgba(31,33,48,0.08)', ...theme.shadows.warmSm },
  summaryLabel: { fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: '#16A7A0', fontWeight: '800', marginBottom: 8 },
  summaryTitle: { fontFamily: theme.fonts.serif, fontSize: 22, lineHeight: 26, fontWeight: '500', color: theme.colors.ink, marginBottom: 8 },
  summaryBody: { fontSize: 13, color: theme.colors.muted, lineHeight: 21 },
  graphCard: { borderRadius: 24, padding: 16, marginBottom: 12, backgroundColor: 'rgba(232,221,251,0.34)', borderWidth: 1, borderColor: 'rgba(139,114,207,0.14)' },
  graphHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: theme.colors.ink },
  sectionSub: { fontSize: 11, color: theme.colors.muted, marginTop: 2 },
  latestMood: { overflow: 'hidden', fontSize: 11, fontWeight: '800', color: '#8B72CF', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.72)' },
  graphWrap: { borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.5)', overflow: 'hidden' },
  distributionCard: { borderRadius: 24, padding: 16, gap: 10, marginBottom: 12, backgroundColor: 'rgba(255,255,255,0.78)', borderWidth: 1, borderColor: 'rgba(31,33,48,0.08)' },
  distributionRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  distributionMood: { width: 64, fontSize: 12, fontWeight: '700', color: theme.colors.ink },
  distributionBar: { flex: 1, height: 8, borderRadius: 4, backgroundColor: 'rgba(31,33,48,0.06)', overflow: 'hidden' },
  distributionFill: { height: '100%', borderRadius: 4 },
  distributionPct: { width: 34, fontSize: 11, color: theme.colors.muted, textAlign: 'right' },
  lockedCard: { borderRadius: 22, padding: 16, marginBottom: 12, backgroundColor: 'rgba(139,114,207,0.12)', borderWidth: 1, borderColor: 'rgba(139,114,207,0.18)' },
  lockedTitle: { fontSize: 14, fontWeight: '800', color: theme.colors.ink, marginBottom: 4 },
  lockedBody: { fontSize: 12, color: theme.colors.muted, lineHeight: 19 },
  themeCard: { borderRadius: 22, padding: 16, marginBottom: 12, backgroundColor: 'rgba(221,237,220,0.38)', borderWidth: 1, borderColor: 'rgba(31,33,48,0.06)' },
  themeTitle: { fontSize: 15, fontWeight: '800', color: theme.colors.ink, marginBottom: 5 },
  themeBody: { fontSize: 12, color: theme.colors.muted, lineHeight: 19 },
  timelineHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, marginBottom: 10 },
  timelineList: { gap: 10 },
  timelineCard: { borderRadius: 20, padding: 14, flexDirection: 'row', gap: 10, backgroundColor: 'rgba(255,255,255,0.74)', borderWidth: 1, borderColor: 'rgba(31,33,48,0.07)' },
  timelineDot: { width: 12, height: 12, borderRadius: 6, marginTop: 4 },
  timelineText: { flex: 1, minWidth: 0 },
  timelinePrompt: { fontSize: 12, fontWeight: '800', color: theme.colors.ink, marginBottom: 4 },
  timelineBody: { fontSize: 12, color: theme.colors.muted, lineHeight: 19 },
  timelineDate: { fontSize: 10, color: theme.colors.muted, marginTop: 5 },
  emptyText: { fontSize: 12, color: theme.colors.muted, lineHeight: 19 },
});
