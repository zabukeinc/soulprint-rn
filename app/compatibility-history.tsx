import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { theme } from '@/src/lib/theme';
import { listCompatibilityReadings, type CompatibilityReading } from '@/src/services/backend';
import { SkeletonCard } from '@/src/components/LoadingState';

function formatDate(value?: string | null) {
  if (!value) return 'Saved reading';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Saved reading' : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function CompatibilityHistoryScreen() {
  const router = useRouter();
  const [readings, setReadings] = useState<CompatibilityReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listCompatibilityReadings({ limit: 50 })
      .then((payload) => setReadings(payload.data))
      .catch((err) => setError(err instanceof Error ? err.message : 'Compatibility history could not be loaded.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerLabel}>Compatibility</Text>
          <Text style={styles.headerTitle}>History</Text>
        </View>
      </View>

      <Text style={styles.intro}>Your saved matches stay here. Revisit any of them whenever you like.</Text>

      {loading ? (
        <>
          <SkeletonCard height={120} lines={3} />
          <SkeletonCard height={120} lines={3} style={{ marginTop: 12 }} />
        </>
      ) : error ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>History unavailable</Text>
          <Text style={styles.emptyText}>{error}</Text>
        </View>
      ) : readings.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No saved matches yet</Text>
          <Text style={styles.emptyText}>Your first compatibility reading will appear here.</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace('/compatibility')}>
            <Text style={styles.primaryButtonText}>Create a match</Text>
          </TouchableOpacity>
        </View>
      ) : (
        readings.map((reading, index) => {
          const full = reading.matchType === 'full_birth_match';
          return (
            <Animated.View key={reading.id} entering={FadeInUp.delay(index * 50).duration(350)}>
              <TouchableOpacity style={styles.readingCard} onPress={() => router.push({ pathname: '/compatibility', params: { readingId: reading.id } })} activeOpacity={0.85}>
                <View style={styles.cardTopline}>
                  <Text style={styles.cardDate}>{formatDate(reading.createdAt)}</Text>
                  <Text style={[styles.modePill, full ? styles.premiumPill : styles.quickPill]}>{full ? 'Premium' : 'Quick'}</Text>
                </View>
                <Text style={styles.cardTitle}>{reading.partnerName || 'Unnamed match'}</Text>
                <Text style={styles.cardMeta}>{reading.userSign} + {reading.partnerSign} · {reading.scores?.overall ?? '-'}% overall</Text>
                <Text style={styles.cardQuote} numberOfLines={2}>{reading.quote}</Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  content: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 40, paddingBottom: 130 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 18 },
  backButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.78)', borderWidth: 1, borderColor: 'rgba(31,33,48,0.08)' },
  backIcon: { fontSize: 18, color: theme.colors.ink },
  headerLabel: { fontSize: 12, color: theme.colors.muted },
  headerTitle: { fontFamily: theme.fonts.serif, fontSize: 28, fontWeight: '500', color: theme.colors.ink },
  intro: { fontSize: 13, color: theme.colors.muted, lineHeight: 20, marginBottom: 16 },
  readingCard: { borderRadius: 20, padding: 16, backgroundColor: 'rgba(255,255,255,0.82)', borderWidth: 1, borderColor: 'rgba(31,33,48,0.08)', marginBottom: 10 },
  cardTopline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardDate: { fontSize: 10, color: theme.colors.muted, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: '800' },
  modePill: { borderRadius: 999, paddingHorizontal: 9, paddingVertical: 4, fontSize: 10, fontWeight: '800', overflow: 'hidden' },
  premiumPill: { color: '#6D4BAA', backgroundColor: 'rgba(139,114,207,0.16)' },
  quickPill: { color: '#26776F', backgroundColor: 'rgba(159,217,208,0.28)' },
  cardTitle: { fontFamily: theme.fonts.serif, fontSize: 21, color: theme.colors.ink, marginTop: 12 },
  cardMeta: { fontSize: 12, color: theme.colors.muted, marginTop: 4 },
  cardQuote: { fontSize: 13, color: theme.colors.ink, lineHeight: 20, marginTop: 12 },
  emptyCard: { borderRadius: 20, padding: 18, backgroundColor: 'rgba(255,255,255,0.78)', borderWidth: 1, borderColor: 'rgba(31,33,48,0.08)' },
  emptyTitle: { fontSize: 16, color: theme.colors.ink, fontWeight: '800' },
  emptyText: { fontSize: 13, color: theme.colors.muted, lineHeight: 20, marginTop: 6 },
  primaryButton: { marginTop: 16, alignSelf: 'flex-start', borderRadius: 18, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: theme.colors.ink },
  primaryButtonText: { color: theme.colors.white, fontSize: 12, fontWeight: '800' },
});
