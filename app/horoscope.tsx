import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { theme } from '@/src/lib/theme';
import { useTier } from '@/src/context/TierContext';
import { getTodayHoroscope, getMoonPhase } from '@/src/lib/horoscope';
import { getDailyHoroscope, getMe, getNatalChart, type BirthChartReport } from '@/src/services/backend';
import NatalChart from '@/src/components/NatalChart';
import { SkeletonBlock, SkeletonCard, SkeletonPillRow } from '@/src/components/LoadingState';

const reportTabs = [
  { id: 'planets', label: 'Planets' },
  { id: 'houses', label: 'Houses' },
  { id: 'aspects', label: 'Aspects' },
  { id: 'report', label: 'Report' },
] as const;

const dailyCategories = [
  { id: 'overview', label: 'Overview' },
  { id: 'love', label: 'Love' },
  { id: 'career', label: 'Career' },
  { id: 'growth', label: 'Growth' },
] as const;

type ReportTab = typeof reportTabs[number]['id'];
type DailyCategory = typeof dailyCategories[number]['id'];

function titleCase(value?: string | null) {
  if (!value) return 'Unknown';
  return value.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function formatDegree(value?: number | null) {
  if (typeof value !== 'number') return '-';
  return `${value.toFixed(1)}°`;
}

function LockedPanel({ title }: { title: string }) {
  return (
    <View style={styles.lockedPanel}>
      <Text style={styles.lockedIcon}>✦</Text>
      <View style={styles.lockedCopy}>
        <Text style={styles.lockedTitle}>{title}</Text>
        <Text style={styles.lockedText}>Premium unlocks the full chart layer for this section.</Text>
      </View>
    </View>
  );
}

function PremiumPreviewPanel({ title }: { title: string }) {
  return (
    <View style={styles.previewPanel}>
      <Text style={styles.previewLabel}>Premium Preview</Text>
      <Text style={styles.previewTitle}>{title}</Text>
      <Text style={styles.previewText}>
        The backend account is still free, so this preview shows the full-report layout. Real premium will fill this with calculated chart content.
      </Text>
    </View>
  );
}

export default function HoroscopeScreen() {
  const router = useRouter();
  const { isPremium: previewPremium } = useTier();
  const fallbackHoroscope = getTodayHoroscope();
  const fallbackMoon = getMoonPhase();
  const [activeTab, setActiveTab] = useState<ReportTab>('planets');
  const [activeDaily, setActiveDaily] = useState<DailyCategory>('overview');
  const [dailyReading, setDailyReading] = useState<any | null>(null);
  const [birthChart, setBirthChart] = useState<BirthChartReport | null>(null);
  const [me, setMe] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    getNatalChart({ fast: true })
      .then((chart) => {
        if (!active) return;
        setBirthChart(chart);
        setLoading(false);
      })
      .catch(() => {
        if (active) {
          setBirthChart(null);
          setLoading(false);
        }
      });

    getDailyHoroscope()
      .then((reading) => {
        if (active) setDailyReading(reading);
      })
      .catch(() => {});

    getMe()
      .then((profile) => {
        if (active) setMe(profile);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [previewPremium]);

  const premium = previewPremium || birthChart?.access.level === 'full';
  const backendPremium = birthChart?.access.level === 'full';
  const bigThree = birthChart?.summary.bigThree;
  const moonReading = dailyReading?.moonPhase ?? fallbackMoon;
  const dailyText = dailyReading?.categories?.[activeDaily] ?? fallbackHoroscope[activeDaily];
  const chartPlanets = birthChart?.chartWheel?.planets?.map((planet) => ({
    ...planet,
    degree: planet.longitude,
    sign: planet.signLabel ?? titleCase(planet.sign),
    meaning: `${titleCase(planet.planet)} in ${planet.signLabel ?? titleCase(planet.sign)}`,
  })) ?? birthChart?.planets;
  const houses = birthChart?.chartWheel?.houseCusps ?? [];
  const visibleAspects = birthChart?.aspects ?? [];
  const reportSections = birthChart?.reportSections ?? [];
  const premiumSynthesis = birthChart?.premiumSynthesis;

  const signatureStats = useMemo(() => {
    const element = birthChart?.summary.dominantElement;
    const modality = birthChart?.summary.dominantModality;
    return [
      { label: 'Element', value: titleCase(element?.key), meta: `${element?.count ?? 0} placements` },
      { label: 'Modality', value: titleCase(modality?.key), meta: `${modality?.count ?? 0} placements` },
      { label: 'Access', value: premium ? 'Full' : 'Summary', meta: backendPremium ? 'Premium report' : premium ? 'Premium preview' : 'Free chart' },
    ];
  }, [backendPremium, birthChart, premium]);

  if (loading && !birthChart && !dailyReading) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.headerLabel}>Birth Chart</Text>
            <Text style={styles.headerTitle}>Your Sky</Text>
          </View>
          <View style={styles.accessBadge}>
            <Text style={styles.accessText}>...</Text>
          </View>
        </View>
        <SkeletonCard height={360} lines={2} />
        <View style={styles.bigThreeRow}>
          {[0, 1, 2].map((item) => (
            <SkeletonCard key={item} compact height={96} lines={1} style={{ flex: 1 }} />
          ))}
        </View>
        <SkeletonCard height={168} lines={3} />
        <SkeletonPillRow count={4} />
        <SkeletonCard height={220} lines={5} style={{ marginTop: 16 }} />
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
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.headerLabel}>Birth Chart</Text>
            <Text style={styles.headerTitle}>{me?.profile?.name ?? 'Your Sky'}</Text>
          </View>
          <View style={styles.accessBadge}>
            <Text style={styles.accessText}>{premium ? 'Full' : 'Free'}</Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(500).delay(80)}>
        <LinearGradient
          colors={['#221238', '#45306F', '#183F4C']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.chartCard}
        >
          <Text style={styles.chartLabel}>Natal Wheel</Text>
          <Text style={styles.chartSignature}>
            {birthChart?.summary.chartSignature ?? 'Chart data unavailable. Pull to retry from the backend.'}
          </Text>
          <NatalChart
            size={286}
            planets={chartPlanets}
            centerLabel={bigThree?.sun?.signLabel ? `${bigThree.sun.signLabel} Sun` : undefined}
            centerMeta={me?.astro?.lifePath ? `Life Path ${me.astro.lifePath}` : undefined}
          />
        </LinearGradient>
      </Animated.View>

      <View style={styles.bigThreeRow}>
        {[
          {
            label: 'Sun',
            sign: bigThree?.sun?.signLabel,
            meta: bigThree?.sun?.house ? `House ${bigThree.sun.house}` : '-',
          },
          {
            label: 'Moon',
            sign: bigThree?.moon?.signLabel,
            meta: bigThree?.moon?.house ? `House ${bigThree.moon.house}` : '-',
          },
          {
            label: 'Rising',
            sign: bigThree?.rising?.signLabel,
            meta: formatDegree(bigThree?.rising?.degree),
          },
        ].map((item, index) => (
          <Animated.View key={item.label} entering={FadeInUp.duration(500).delay(120 + index * 50)} style={{ flex: 1 }}>
            <View style={styles.bigCard}>
              <Text style={styles.bigLabel}>{item.label}</Text>
              <Text style={styles.bigSign}>{item.sign ?? '...'}</Text>
              <Text style={styles.bigMeta}>{item.meta}</Text>
            </View>
          </Animated.View>
        ))}
      </View>

      <Animated.View entering={FadeInUp.duration(500).delay(220)} style={styles.signatureCard}>
        <Text style={styles.sectionLabel}>Chart Signature</Text>
        <Text style={styles.signatureText}>{birthChart?.summary.shortInterpretation ?? 'We could not load your backend chart summary yet.'}</Text>
        <View style={styles.statRow}>
          {signatureStats.map((stat) => (
            <View key={stat.label} style={styles.statItem}>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statMeta}>{stat.meta}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(500).delay(260)}>
        <View style={styles.reportTabs}>
          {reportTabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={[styles.reportTab, activeTab === tab.id && styles.reportTabActive]}
            >
              <Text style={[styles.reportTabText, activeTab === tab.id && styles.reportTabTextActive]}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(500).delay(300)} key={activeTab}>
        <View style={styles.panel}>
          {activeTab === 'planets' && (
            <>
              {birthChart?.planets?.map((planet) => (
                <View key={planet.planet} style={styles.rowItem}>
                  <View>
                    <Text style={styles.rowTitle}>{titleCase(planet.planet)} in {planet.signLabel}</Text>
                    <Text style={styles.rowMeta}>
                      {formatDegree(planet.signDegree)} · {planet.house ? `House ${planet.house}` : 'No house'} · {planet.retrograde ? 'Retrograde' : 'Direct'}
                    </Text>
                  </View>
                  <Text style={styles.rowPill}>{titleCase(planet.element)}</Text>
                  {premium && !!planet.interpretation && <Text style={styles.rowBody}>{planet.interpretation}</Text>}
                </View>
              ))}
            </>
          )}

          {activeTab === 'houses' && (
            <>
              {houses.map((house) => (
                <View key={house.house} style={styles.rowItem}>
                  <Text style={styles.rowTitle}>House {house.house}</Text>
                  <Text style={styles.rowMeta}>{house.signLabel} cusp · {formatDegree(house.cusp)}</Text>
                </View>
              ))}
            </>
          )}

          {activeTab === 'aspects' && (
            premium ? (
              visibleAspects.length ? (
                visibleAspects.map((aspect, index) => (
                  <View key={`${aspect.planets.join('-')}-${index}`} style={styles.rowItem}>
                    <Text style={styles.rowTitle}>{aspect.planets.map(titleCase).join(' + ')} {titleCase(aspect.aspect)}</Text>
                    <Text style={styles.rowMeta}>{aspect.tone} · orb {formatDegree(aspect.orb)}</Text>
                    <Text style={styles.rowBody}>{aspect.interpretation}</Text>
                  </View>
                ))
              ) : (
                <PremiumPreviewPanel title="Aspect interpretations will appear here." />
              )
            ) : (
              <LockedPanel title="Aspects are part of the full birth chart report." />
            )
          )}

          {activeTab === 'report' && (
            premium ? (
              <>
                {birthChart?.chartPatterns?.length || reportSections.length ? (
                  <>
                    {premiumSynthesis && (
                      <>
                        <View style={styles.premiumSectionHeader}>
                          <Text style={styles.premiumSectionLabel}>Premium synthesis</Text>
                          <Text style={styles.premiumSectionTitle}>How the pieces work together</Text>
                        </View>
                        <View style={styles.premiumInsightCard}>
                          <Text style={styles.rowTitle}>Chart ruler</Text>
                          <Text style={styles.rowMeta}>
                            {premiumSynthesis.chartRuler.planet ? `${titleCase(premiumSynthesis.chartRuler.planet)} in ${premiumSynthesis.chartRuler.signLabel}` : 'Rising sign needed'}
                            {premiumSynthesis.chartRuler.house ? ` · House ${premiumSynthesis.chartRuler.house}` : ''}
                          </Text>
                          <Text style={styles.rowBody}>{premiumSynthesis.chartRuler.meaning}</Text>
                        </View>
                        <View style={styles.premiumInsightCard}>
                          <Text style={styles.rowTitle}>Relationship signature</Text>
                          <Text style={styles.rowMeta}>Venus {premiumSynthesis.relationshipSignature.venus} · Mars {premiumSynthesis.relationshipSignature.mars}</Text>
                          <Text style={styles.rowBody}>{premiumSynthesis.relationshipSignature.summary}</Text>
                        </View>
                        <View style={styles.premiumInsightCard}>
                          <Text style={styles.rowTitle}>Vocation signature</Text>
                          <Text style={styles.rowMeta}>Midheaven {premiumSynthesis.vocationSignature.midheaven}</Text>
                          <Text style={styles.rowBody}>{premiumSynthesis.vocationSignature.summary}</Text>
                        </View>
                        <View style={styles.premiumInsightCard}>
                          <Text style={styles.rowTitle}>Aspect balance</Text>
                          <Text style={styles.rowMeta}>{premiumSynthesis.aspectBalance.flowCount} flowing · {premiumSynthesis.aspectBalance.tensionCount} activating</Text>
                          <Text style={styles.rowBody}>{premiumSynthesis.aspectBalance.summary}</Text>
                        </View>
                        <View style={styles.promptCard}>
                          <Text style={styles.rowTitle}>Integration prompts</Text>
                          {premiumSynthesis.integrationPrompts.map((prompt, index) => (
                            <Text key={`prompt-${index}`} style={styles.promptText}>{index + 1}. {prompt}</Text>
                          ))}
                        </View>
                      </>
                    )}
                    {birthChart?.chartPatterns?.map((pattern, index) => (
                      <View key={`${pattern.type}-${index}`} style={styles.patternCard}>
                        <Text style={styles.rowTitle}>{pattern.title}</Text>
                        <Text style={styles.rowBody}>{pattern.description}</Text>
                      </View>
                    ))}
                    {reportSections.map((section) => (
                      <View key={section.key} style={styles.rowItem}>
                        <Text style={styles.rowTitle}>{section.title}</Text>
                        <Text style={styles.rowBody}>{section.body}</Text>
                      </View>
                    ))}
                  </>
                ) : (
                  <PremiumPreviewPanel title="Full narrative report will appear here." />
                )}
              </>
            ) : (
              <LockedPanel title="The detailed report unlocks chart patterns and deeper interpretation." />
            )
          )}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(500).delay(340)} style={styles.moonCard}>
        <View style={styles.moonRow}>
          <Text style={styles.moonEmoji}>{moonReading.emoji === 'moon' ? '☽' : moonReading.emoji}</Text>
          <View>
            <Text style={styles.sectionLabel}>Today's Moon</Text>
            <Text style={styles.moonPhase}>{moonReading.name ?? moonReading.phase}</Text>
          </View>
        </View>
        <Text style={styles.moonMeaning}>{moonReading.meaning}</Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(500).delay(380)}>
        <View style={styles.dailyTabs}>
          {dailyCategories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setActiveDaily(cat.id)}
              style={[styles.dailyTab, activeDaily === cat.id && styles.dailyTabActive]}
            >
              <Text style={[styles.dailyTabText, activeDaily === cat.id && styles.dailyTabTextActive]}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <LinearGradient colors={theme.gradients.hero} style={styles.readingCard}>
          <Text style={styles.sectionLabel}>Daily Horoscope</Text>
          <Text style={styles.readingText}>{dailyText}</Text>
        </LinearGradient>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 130,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
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
  headerLabel: { fontSize: 12, color: theme.colors.muted },
  headerTitle: {
    fontFamily: theme.fonts.serif,
    fontSize: 28,
    fontWeight: '500',
    color: theme.colors.ink,
  },
  accessBadge: {
    minWidth: 54,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  accessText: { color: theme.colors.white, fontSize: 11, fontWeight: '800' },
  chartCard: {
    borderRadius: 26,
    padding: 18,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    ...theme.shadows.warmSoft,
  },
  chartLabel: {
    fontSize: 10,
    letterSpacing: 1.2,
    color: 'rgba(255,255,255,0.68)',
    textTransform: 'uppercase',
    fontWeight: '800',
  },
  chartSignature: {
    fontSize: 15,
    color: theme.colors.white,
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 12,
  },
  bigThreeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  bigCard: {
    minHeight: 96,
    borderRadius: 18,
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    ...theme.shadows.warmSm,
  },
  bigLabel: { fontSize: 10, color: theme.colors.muted, fontWeight: '800', textTransform: 'uppercase' },
  bigSign: { fontSize: 15, color: theme.colors.ink, fontWeight: '700', marginTop: 8 },
  bigMeta: { fontSize: 11, color: theme.colors.softMuted, marginTop: 4 },
  signatureCard: {
    borderRadius: 22,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    marginBottom: 14,
    ...theme.shadows.warmSm,
  },
  sectionLabel: {
    fontSize: 10,
    letterSpacing: 1.1,
    color: theme.colors.lavenderStrong,
    textTransform: 'uppercase',
    fontWeight: '800',
  },
  signatureText: { fontSize: 14, color: theme.colors.ink, lineHeight: 22, marginTop: 8 },
  statRow: { flexDirection: 'row', gap: 8, marginTop: 14 },
  statItem: {
    flex: 1,
    borderRadius: 14,
    padding: 10,
    backgroundColor: 'rgba(232,221,251,0.42)',
  },
  statLabel: { fontSize: 9, color: theme.colors.muted, fontWeight: '800', textTransform: 'uppercase' },
  statValue: { fontSize: 12, color: theme.colors.ink, fontWeight: '800', marginTop: 5 },
  statMeta: { fontSize: 9, color: theme.colors.softMuted, marginTop: 2 },
  reportTabs: {
    flexDirection: 'row',
    gap: 7,
    marginBottom: 12,
  },
  reportTab: {
    flex: 1,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
  },
  reportTabActive: { backgroundColor: theme.colors.ink, borderColor: theme.colors.ink },
  reportTabText: { fontSize: 11, fontWeight: '800', color: theme.colors.muted },
  reportTabTextActive: { color: theme.colors.white },
  panel: {
    borderRadius: 22,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    marginBottom: 14,
    ...theme.shadows.warmSm,
  },
  rowItem: {
    borderRadius: 16,
    padding: 13,
    backgroundColor: 'rgba(251,247,240,0.9)',
    marginBottom: 8,
  },
  rowTitle: { fontSize: 13, color: theme.colors.ink, fontWeight: '800' },
  rowMeta: { fontSize: 11, color: theme.colors.muted, marginTop: 4 },
  rowPill: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(159,217,208,0.38)',
    color: theme.colors.ink,
    fontSize: 10,
    fontWeight: '800',
    overflow: 'hidden',
  },
  rowBody: { fontSize: 12, color: theme.colors.muted, lineHeight: 19, marginTop: 8 },
  patternCard: {
    borderRadius: 16,
    padding: 13,
    backgroundColor: 'rgba(232,221,251,0.48)',
    marginBottom: 8,
  },
  premiumSectionHeader: { marginBottom: 8, paddingHorizontal: 2 },
  premiumSectionLabel: { fontSize: 10, letterSpacing: 1.1, color: '#8B72CF', textTransform: 'uppercase', fontWeight: '800' },
  premiumSectionTitle: { fontSize: 17, color: theme.colors.ink, fontWeight: '800', marginTop: 4 },
  premiumInsightCard: { borderRadius: 16, padding: 13, backgroundColor: 'rgba(159,217,208,0.18)', marginBottom: 8, borderWidth: 1, borderColor: 'rgba(72,132,125,0.16)' },
  promptCard: { borderRadius: 16, padding: 13, backgroundColor: 'rgba(139,114,207,0.12)', marginBottom: 8, borderWidth: 1, borderColor: 'rgba(139,114,207,0.18)' },
  promptText: { fontSize: 12, color: theme.colors.muted, lineHeight: 19, marginTop: 8 },
  lockedPanel: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    borderRadius: 18,
    padding: 16,
    backgroundColor: 'rgba(31,33,48,0.05)',
  },
  lockedIcon: { fontSize: 22, color: theme.colors.lavenderStrong },
  lockedCopy: { flex: 1 },
  lockedTitle: { fontSize: 13, color: theme.colors.ink, fontWeight: '800' },
  lockedText: { fontSize: 12, color: theme.colors.muted, lineHeight: 18, marginTop: 4 },
  previewPanel: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: 'rgba(139,114,207,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(139,114,207,0.18)',
  },
  previewLabel: {
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#8B72CF',
    fontWeight: '800',
    marginBottom: 6,
  },
  previewTitle: { fontSize: 14, color: theme.colors.ink, fontWeight: '800', marginBottom: 5 },
  previewText: { fontSize: 12, color: theme.colors.muted, lineHeight: 18 },
  moonCard: {
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    ...theme.shadows.warmSm,
  },
  moonRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  moonEmoji: { fontSize: 24 },
  moonPhase: { fontSize: 14, fontWeight: '700', color: theme.colors.ink, marginTop: 2 },
  moonMeaning: { fontSize: 12, color: theme.colors.muted, lineHeight: 20 },
  dailyTabs: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  dailyTab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
  },
  dailyTabActive: { backgroundColor: theme.colors.lavenderStrong, borderColor: theme.colors.lavenderStrong },
  dailyTabText: { fontSize: 11, fontWeight: '800', color: theme.colors.muted },
  dailyTabTextActive: { color: theme.colors.white },
  readingCard: {
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    ...theme.shadows.warmSm,
  },
  readingText: { fontSize: 14, color: theme.colors.ink, lineHeight: 23, marginTop: 9, fontWeight: '500' },
});
