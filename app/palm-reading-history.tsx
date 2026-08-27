import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ArrowLeft, Hand, Sparkles } from 'lucide-react-native';
import { deletePalmReading, listPalmReadings, type PalmReading } from '@/src/services/backend';
import { SkeletonCard } from '@/src/components/LoadingState';
import { theme } from '@/src/lib/theme';

function formatDate(value?: string) {
  if (!value) return 'Saved reading';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Saved reading' : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function PalmReadingHistoryScreen() {
  const router = useRouter();
  const [readings, setReadings] = useState<PalmReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listPalmReadings({ limit: 50 })
      .then((payload) => setReadings(payload.data))
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : 'Your saved readings could not be loaded.'))
      .finally(() => setLoading(false));
  }, []);

  function removeReading(reading: PalmReading) {
    if (!reading.id) return;
    Alert.alert('Remove this reading?', 'This saved reflection will be deleted from your history.', [
      { text: 'Keep it', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          try {
            await deletePalmReading(reading.id!);
            setReadings((current) => current.filter((item) => item.id !== reading.id));
          } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : 'This reading could not be removed.');
          }
        },
      },
    ]);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityLabel="Go back">
          <ArrowLeft size={20} color={theme.colors.ink} />
        </TouchableOpacity>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>PALM READING</Text>
          <Text style={styles.title}>Your history</Text>
        </View>
        <View style={styles.headerIcon}><Hand size={19} color="#8B72CF" /></View>
      </View>

      <Text style={styles.intro}>Your saved reflections stay here. Revisit them whenever a past pattern feels worth noticing again.</Text>

      {loading ? (
        <><SkeletonCard height={142} lines={4} /><SkeletonCard height={142} lines={4} style={{ marginTop: 12 }} /></>
      ) : error ? (
        <View style={styles.emptyCard}><Text style={styles.emptyTitle}>History unavailable</Text><Text style={styles.emptyText}>{error}</Text></View>
      ) : readings.length === 0 ? (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIcon}><Hand size={24} color="#8B72CF" /></View>
          <Text style={styles.emptyTitle}>No saved palms yet</Text>
          <Text style={styles.emptyText}>Your first reflection will appear here after you choose a photo and read it.</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace('/palm-reading')}><Text style={styles.primaryButtonText}>Read your palm</Text></TouchableOpacity>
        </View>
      ) : (
        readings.map((reading, index) => (
          <Animated.View key={reading.id} entering={FadeInUp.delay(index * 50).duration(350)}>
            <TouchableOpacity style={styles.readingCard} onPress={() => router.push({ pathname: '/palm-reading', params: { readingId: reading.id } })} activeOpacity={0.85}>
              <View style={styles.cardTopline}><Text style={styles.cardDate}>{formatDate(reading.generatedAt)}</Text><Text style={styles.handPill}>{reading.hand === 'left' ? 'Left hand' : 'Right hand'}</Text></View>
              <View style={styles.cardTitleRow}><Sparkles size={17} color="#8B72CF" /><Text style={styles.cardTitle}>A reflection to return to</Text></View>
              <Text style={styles.cardSummary} numberOfLines={3}>{reading.summary}</Text>
              <View style={styles.cardActions}><Text style={styles.cardLink}>Open reading →</Text><TouchableOpacity onPress={() => removeReading(reading)}><Text style={styles.removeLink}>Remove</Text></TouchableOpacity></View>
            </TouchableOpacity>
          </Animated.View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  content: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 34, paddingBottom: 130 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  backButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.8)', alignItems: 'center', justifyContent: 'center' },
  headerCopy: { flex: 1, marginLeft: 12 },
  eyebrow: { fontSize: 10, letterSpacing: 1.5, fontWeight: '800', color: '#8B72CF', marginBottom: 4 },
  title: { fontFamily: theme.fonts.serif, fontSize: 28, color: theme.colors.ink },
  headerIcon: { width: 42, height: 42, borderRadius: 16, backgroundColor: '#F0E9FC', alignItems: 'center', justifyContent: 'center' },
  intro: { fontSize: 13, lineHeight: 20, color: theme.colors.muted, marginBottom: 17 },
  readingCard: { borderRadius: 22, padding: 17, backgroundColor: 'rgba(255,255,255,0.84)', borderWidth: 1, borderColor: 'rgba(31,33,48,0.08)', marginBottom: 11, ...theme.shadows.warmSm },
  cardTopline: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardDate: { fontSize: 10, letterSpacing: 0.8, fontWeight: '800', color: theme.colors.muted, textTransform: 'uppercase' },
  handPill: { fontSize: 10, fontWeight: '800', color: '#765CB8', backgroundColor: '#F0E9FC', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 12 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 15 },
  cardTitle: { fontFamily: theme.fonts.serif, fontSize: 19, color: theme.colors.ink },
  cardSummary: { fontSize: 13, lineHeight: 20, color: theme.colors.ink, marginTop: 8 },
  cardLink: { fontSize: 12, fontWeight: '800', color: '#8B72CF', marginTop: 13 },
  cardActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  removeLink: { fontSize: 12, fontWeight: '700', color: '#A13C46', marginTop: 13 },
  emptyCard: { borderRadius: 22, padding: 20, backgroundColor: 'rgba(255,255,255,0.8)', borderWidth: 1, borderColor: 'rgba(31,33,48,0.08)' },
  emptyIcon: { width: 52, height: 52, borderRadius: 18, backgroundColor: '#F0E9FC', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  emptyTitle: { fontSize: 17, fontWeight: '800', color: theme.colors.ink },
  emptyText: { fontSize: 13, lineHeight: 20, color: theme.colors.muted, marginTop: 6 },
  primaryButton: { marginTop: 17, alignSelf: 'flex-start', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 11, backgroundColor: theme.colors.ink },
  primaryButtonText: { color: theme.colors.white, fontSize: 12, fontWeight: '800' },
});
