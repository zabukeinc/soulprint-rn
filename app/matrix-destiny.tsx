import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { getMatrixDestiny, getMatrixDestinyAi, type MatrixDestinyResponse, type MatrixDestinyAiState } from '@/src/services/backend';
import { SkeletonCard } from '@/src/components/LoadingState';
import { theme } from '@/src/lib/theme';

const premiumKeys = ['career_money', 'karmic_shadow', 'current_year', 'relationships', 'action_plan'];
const MAX_AI_POLL_ATTEMPTS = 18;

function ArcanaCard({ label, item }: { label: string; item: { number: number; name: string; keywords: readonly string[] } }) {
  return (
    <View style={styles.arcanaCard}>
      <Text style={styles.arcanaLabel}>{label}</Text>
      <View style={styles.arcanaNumber}><Text style={styles.arcanaNumberText}>{item.number}</Text></View>
      <Text style={styles.arcanaName}>{item.name}</Text>
      <Text style={styles.arcanaKeywords}>{item.keywords.slice(0, 2).join(' · ')}</Text>
    </View>
  );
}

export default function MatrixDestinyScreen() {
  const router = useRouter();
  const [reading, setReading] = useState<MatrixDestinyResponse | null>(null);
  const [ai, setAi] = useState<MatrixDestinyAiState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getMatrixDestiny()
      .then((result) => {
        if (!active) return;
        setReading(result);
        setAi(result.ai);
      })
      .catch((reason) => {
        if (active) setError(reason instanceof Error ? reason.message : 'Matrix Destiny could not be opened.');
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!reading || reading.access.tier !== 'premium' || ai?.status === 'ready' || ai?.status === 'failed') return;
    let active = true;
    let attempts = 0;
    const poll = async () => {
      try {
        const result = await getMatrixDestinyAi();
        if (!active) return;
        setAi(result);
        attempts += 1;
        if (!['ready', 'failed'].includes(result.status) && attempts < MAX_AI_POLL_ATTEMPTS) {
          setTimeout(poll, Math.min(4000, 1200 + attempts * 250));
        } else if (!['ready', 'failed'].includes(result.status)) {
          setAi({ status: 'failed', generatedAt: null, sections: [], message: 'This is taking longer than expected. Your matrix is still available above.' });
        }
      } catch {
        if (active && attempts < 3) setTimeout(poll, 2500);
        else if (active) setAi({ status: 'failed', generatedAt: null, sections: [], message: 'We could not finish the deeper reading. Your matrix is still available above.' });
      }
    };
    const timer = setTimeout(poll, 700);
    return () => { active = false; clearTimeout(timer); };
  }, [ai?.status, reading]);

  if (error) {
    return <View style={styles.center}><Text style={styles.errorTitle}>Your matrix is not ready</Text><Text style={styles.errorBody}>{error}</Text><TouchableOpacity onPress={() => router.back()}><Text style={styles.link}>Go back</Text></TouchableOpacity></View>;
  }

  if (!reading) {
    return <ScrollView style={styles.container} contentContainerStyle={styles.content}><SkeletonCard height={170} lines={3} /><SkeletonCard height={150} lines={3} style={{ marginTop: 14 }} /><SkeletonCard height={150} lines={3} style={{ marginTop: 14 }} /></ScrollView>;
  }

  const { matrix } = reading;
  const readySections = new Map((ai?.sections ?? []).map((section) => [section.key, section]));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Animated.View entering={FadeInUp.duration(450)} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}><Text style={styles.backIcon}>←</Text></TouchableOpacity>
        <Text style={styles.headerLabel}>Matrix Destiny</Text>
        <View style={styles.backButtonPlaceholder} />
      </Animated.View>
      <Animated.View entering={FadeInUp.delay(80).duration(450)}>
        <Text style={styles.eyebrow}>{reading.profile.name}'s 22-Arcana map</Text>
        <Text style={styles.title}>Patterns you can meet with more choice.</Text>
        <Text style={styles.summary}>{reading.summary}</Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(150).duration(450)} style={styles.matrixCard}>
        <ArcanaCard label="Center" item={matrix.center} />
        <View style={styles.arcanaGrid}>
          <ArcanaCard label="Purpose" item={matrix.purpose} />
          <ArcanaCard label="Talent" item={matrix.talent} />
          <ArcanaCard label="Current year" item={matrix.currentYear} />
        </View>
        <Text style={styles.lineTitle}>Relationships</Text>
        <View style={styles.lineRow}>{matrix.relationshipLine.map((item) => <ArcanaCard key={item.position} label="Arcana" item={item} />)}</View>
        <Text style={styles.lineTitle}>Career and money</Text>
        <View style={styles.lineRow}>{matrix.moneyLine.map((item) => <ArcanaCard key={item.position} label="Arcana" item={item} />)}</View>
        <Text style={styles.lineTitle}>Karmic tail</Text>
        <View style={styles.lineRow}>{matrix.karmicTail.map((item) => <ArcanaCard key={item.position} label="Arcana" item={item} />)}</View>
      </Animated.View>

      {reading.access.tier === 'premium' && <>
        <Text style={styles.premiumHeading}>A deeper reading for you</Text>
        {premiumKeys.map((key, index) => {
          const section = readySections.get(key);
          if (!section) return <SkeletonCard key={key} height={150} lines={4} style={{ marginTop: 12 }} />;
          return <Animated.View key={key} entering={FadeInUp.delay(220 + index * 60).duration(400)} style={styles.sectionCard}><Text style={styles.sectionTitle}>{section.title}</Text><Text style={styles.sectionBody}>{section.body}</Text>{section.actions.map((action) => <Text key={action} style={styles.action}>• {action}</Text>)}</Animated.View>;
        })}
        {ai?.status === 'failed' && <>
          <Text style={styles.status}>{ai.message ?? 'Your deeper reading could not finish yet. Your matrix is still available above.'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => router.replace('/matrix-destiny')}><Text style={styles.retryText}>Try again</Text></TouchableOpacity>
        </>}
      </>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }, content: { paddingHorizontal: 20, paddingTop: 38, paddingBottom: 120 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  headerLabel: { fontSize: 12, color: theme.colors.muted, letterSpacing: 1, textTransform: 'uppercase' },
  backButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.7)', alignItems: 'center', justifyContent: 'center' },
  backButtonPlaceholder: { width: 38 }, backIcon: { fontSize: 22, color: theme.colors.ink },
  eyebrow: { fontSize: 12, color: '#7A63BD', fontWeight: '700', letterSpacing: 0.6 },
  title: { fontFamily: theme.fonts.serif, fontSize: 27, lineHeight: 33, color: theme.colors.ink, marginTop: 7 },
  summary: { fontSize: 14, lineHeight: 22, color: theme.colors.muted, marginTop: 10 },
  matrixCard: { marginTop: 22, padding: 16, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.7)', borderWidth: 1, borderColor: 'rgba(31,33,48,0.08)' },
  arcanaGrid: { flexDirection: 'row', gap: 8, marginTop: 10 }, arcanaCard: { flex: 1, padding: 10, borderRadius: 16, backgroundColor: 'rgba(232,221,251,0.42)', minHeight: 98 },
  arcanaLabel: { fontSize: 10, color: theme.colors.muted, textTransform: 'uppercase', letterSpacing: 0.5 }, arcanaNumber: { marginTop: 7, width: 28, height: 28, borderRadius: 14, backgroundColor: '#7A63BD', alignItems: 'center', justifyContent: 'center' }, arcanaNumberText: { color: '#fff', fontWeight: '800' }, arcanaName: { fontSize: 12, fontWeight: '700', color: theme.colors.ink, marginTop: 6 }, arcanaKeywords: { fontSize: 10, color: theme.colors.muted, marginTop: 3 },
  lineTitle: { fontSize: 12, fontWeight: '800', color: theme.colors.ink, marginTop: 18, marginBottom: 8 }, lineRow: { flexDirection: 'row', gap: 8 },
  premiumHeading: { fontFamily: theme.fonts.serif, fontSize: 22, color: theme.colors.ink, marginTop: 28, marginBottom: 4 },
  sectionCard: { padding: 17, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.72)', borderWidth: 1, borderColor: 'rgba(31,33,48,0.08)', marginTop: 12 }, sectionTitle: { fontSize: 15, fontWeight: '800', color: theme.colors.ink }, sectionBody: { fontSize: 13, lineHeight: 21, color: theme.colors.muted, marginTop: 8 }, action: { fontSize: 12, lineHeight: 19, color: theme.colors.ink, marginTop: 7 }, status: { fontSize: 12, color: theme.colors.muted, marginTop: 14 }, retryButton: { alignSelf: 'flex-start', marginTop: 12, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 16, backgroundColor: '#7A63BD' }, retryText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' }, center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 }, errorTitle: { fontFamily: theme.fonts.serif, fontSize: 24, color: theme.colors.ink }, errorBody: { color: theme.colors.muted, textAlign: 'center', marginTop: 10 }, link: { color: '#7A63BD', fontWeight: '700', marginTop: 18 }
});
