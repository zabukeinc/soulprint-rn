import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Camera, Check, Hand, Image as ImageIcon, ShieldCheck, Sparkles } from 'lucide-react-native';
import { createPalmReading, getPalmReading, getPalmReadingById, type PalmReading } from '@/src/services/backend';
import { ApiError } from '@/src/lib/api';
import { theme } from '@/src/lib/theme';

type HandSide = 'left' | 'right';
type PendingImage = {
  data: string;
  uri: string;
  width: number;
  height: number;
};

function dataUrlFor(asset: ImagePicker.ImagePickerAsset) {
  if (!asset.base64) return null;
  const mime = asset.mimeType === 'image/png' ? 'image/png' : 'image/jpeg';
  return `data:${mime};base64,${asset.base64}`;
}

function conciseSummary(value: string) {
  const firstSentence = value.split(/[.!?]/)[0]?.trim() ?? value.trim();
  return `${firstSentence}${firstSentence.endsWith('.') ? '' : '.'}`.slice(0, 190);
}

export default function PalmReadingScreen() {
  const router = useRouter();
  const { readingId } = useLocalSearchParams<{ readingId?: string }>();
  const [reading, setReading] = useState<PalmReading | null>(null);
  const [hand, setHand] = useState<HandSide>('right');
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [pendingImage, setPendingImage] = useState<PendingImage | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (readingId ? getPalmReadingById(readingId) : getPalmReading())
      .then((result) => {
        setReading(result);
        if (result.hand) setHand(result.hand);
      })
      .catch(() => {
        // The capture flow remains usable when there is no previous result.
      });
  }, [readingId]);

  async function chooseImage(source: 'camera' | 'library') {
    setError(null);
    const permission = source === 'camera'
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        source === 'camera' ? 'Camera access needed' : 'Photo access needed',
        'Allow access in Settings so Astrovy can read the palm you choose.',
      );
      return;
    }

    const result = source === 'camera'
      ? await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.65,
        base64: true,
      })
      : await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.65,
        base64: true,
      });

    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    const imageData = dataUrlFor(asset);
    if (!imageData) {
      setError('That photo could not be prepared. Please choose another image.');
      return;
    }

    setReading(null);
    setPreviewUri(asset.uri);
    setPendingImage({ data: imageData, uri: asset.uri, width: asset.width, height: asset.height });
  }

  async function submitReading() {
    if (!pendingImage || busy) return;
    setError(null);
    setBusy(true);
    try {
      const next = await createPalmReading({
        hand,
        imageData: pendingImage.data,
        imageWidth: pendingImage.width,
        imageHeight: pendingImage.height,
        quality: 0.85,
      });
      setReading(next);
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : 'Your palm could not be read right now. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  const ready = reading?.status === 'ready';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityLabel="Go back">
          <ArrowLeft size={20} color={theme.colors.ink} />
        </TouchableOpacity>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>REFLECTIVE READING</Text>
          <Text style={styles.title}>Palm Reading</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/palm-reading-history')} style={styles.historyButton}>
          <Text style={styles.historyButtonText}>History</Text>
        </TouchableOpacity>
        <View style={styles.headerIcon}><Hand size={20} color="#8B72CF" /></View>
      </View>

      <View style={styles.hero}>
        <Text style={styles.heroTitle}>{ready ? 'Your palm, seen with care.' : 'A quieter way to check in with yourself.'}</Text>
        <Text style={styles.heroBody}>
          {ready ? 'Keep this reading as a gentle prompt for reflection, not a fixed prediction.' : 'Take a clear photo in soft daylight. We will look for symbolic patterns in the lines and shape.'}
        </Text>
      </View>

      {!ready && (
        <>
          <View style={styles.handRow}>
            <Text style={styles.sectionLabel}>Which hand are you sharing?</Text>
            <View style={styles.segmented}>
              {(['left', 'right'] as HandSide[]).map((side) => (
                <TouchableOpacity key={side} onPress={() => setHand(side)} style={[styles.segment, hand === side && styles.segmentActive]}>
                  <Text style={[styles.segmentText, hand === side && styles.segmentTextActive]}>{side[0].toUpperCase() + side.slice(1)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.captureCard}>
            {previewUri ? <Image source={{ uri: previewUri }} style={styles.preview} /> : <View style={styles.captureIcon}><Hand size={42} color="#8B72CF" /></View>}
            <Text style={styles.captureTitle}>{busy ? 'Taking a closer look…' : 'Choose a clear palm photo'}</Text>
            <Text style={styles.captureBody}>Keep the full palm in frame, fingers relaxed, with the lines visible.</Text>
            {busy ? (
              <View style={styles.loadingPlaceholder}>
                <View style={styles.skeletonLineShort} />
                <View style={styles.skeletonLine} />
                <View style={styles.skeletonLineMedium} />
                <View style={styles.loadingRow}><ActivityIndicator color="#8B72CF" /><Text style={styles.loadingText}>Your reflection is taking shape</Text></View>
              </View>
            ) : pendingImage ? (
              <View style={styles.actionRow}>
                <TouchableOpacity onPress={submitReading} style={styles.primaryButton} activeOpacity={0.85}>
                  <Sparkles size={18} color="#FFFFFF" /><Text style={styles.primaryButtonText}>Read my palm</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setPendingImage(null); setPreviewUri(null); }} style={styles.secondaryButton} activeOpacity={0.85}>
                  <ImageIcon size={18} color="#8B72CF" /><Text style={styles.secondaryButtonText}>Choose a different photo</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.actionRow}>
                <TouchableOpacity onPress={() => chooseImage('camera')} style={styles.primaryButton} activeOpacity={0.85}>
                  <Camera size={18} color="#FFFFFF" /><Text style={styles.primaryButtonText}>Take photo</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => chooseImage('library')} style={styles.secondaryButton} activeOpacity={0.85}>
                  <ImageIcon size={18} color="#8B72CF" /><Text style={styles.secondaryButtonText}>Choose photo</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </>
      )}

      {error && <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View>}

      {ready && reading && (
        <View style={styles.resultStack}>
          <LinearGradient colors={['#EAE1FB', '#E5F5F0']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.resultHero}>
            <View style={styles.resultHeroTop}>
              <View style={styles.resultBadge}><Check size={15} color="#168E86" /><Text style={styles.resultBadgeText}>{reading.access.tier === 'premium' ? 'Full reading unlocked' : 'Your reflection is ready'}</Text></View>
              <Text style={styles.resultHand}>{reading.hand === 'left' ? 'LEFT HAND' : 'RIGHT HAND'}</Text>
            </View>
            {previewUri && <Image source={{ uri: previewUri }} style={styles.resultImage} />}
            <Text style={styles.resultHeroEyebrow}>A MOMENT TO NOTICE</Text>
            <Text style={styles.resultHeroTitle}>Your lines hold a pattern worth listening to.</Text>
          </LinearGradient>
          <View style={styles.summaryCard}>
            <Text style={styles.cardEyebrow}>YOUR PALM IN THIS MOMENT</Text>
            <Text style={styles.summary}>{conciseSummary(reading.summary ?? 'Your visible lines offer a gentle moment to notice your current rhythm.')}</Text>
            <View style={styles.summaryRule} />
            <Text style={styles.summaryHint}>Let this be a prompt for reflection, not a fixed answer.</Text>
          </View>
          {reading.details ? (
            <View style={styles.detailsCard}>
              <View style={styles.cardHeadingRow}><Sparkles size={17} color="#8B72CF" /><View><Text style={styles.cardTitle}>The lines that stand out</Text><Text style={styles.cardSubtitle}>Five gentle lenses for your current chapter</Text></View></View>
              {[
                ['Marriage line', reading.details.marriageLine],
                ['Love line', reading.details.loveLine],
                ['Head line', reading.details.headLine],
                ['Life line', reading.details.lifeLine],
                ['Money line', reading.details.moneyLine],
              ].map(([label, body], index) => <View key={label} style={[styles.detailRow, index === 0 && styles.detailRowFirst]}><View style={[styles.detailAccent, { backgroundColor: ['#E487A4', '#D85C87', '#4CAFC0', '#16A7A0', '#E9A83A'][index] }]} /><View style={styles.detailContent}><Text style={styles.detailLabel}>{label}</Text><Text style={styles.detailBody}>{body || 'This line was not clear enough to read carefully from this photo.'}</Text></View></View>)}
            </View>
          ) : (
            <View style={styles.lockedCard}><Text style={styles.lockedTitle}>Want the fuller picture?</Text><Text style={styles.lockedBody}>Premium opens the line-by-line reflection and hand-shape notes.</Text><TouchableOpacity onPress={() => router.push('/pricing')}><Text style={styles.lockedLink}>Explore premium →</Text></TouchableOpacity></View>
          )}
          <View style={styles.disclaimer}><ShieldCheck size={15} color={theme.colors.muted} /><Text style={styles.disclaimerText}>{reading.disclaimer}</Text></View>
          <TouchableOpacity onPress={() => { setReading(null); setPreviewUri(null); setPendingImage(null); }} style={styles.newReadingButton}><Text style={styles.newReadingText}>Read another palm</Text></TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 34, paddingBottom: 120 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 22 },
  backButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.8)', alignItems: 'center', justifyContent: 'center' },
  headerCopy: { flex: 1, marginLeft: 12 },
  historyButton: { paddingHorizontal: 10, paddingVertical: 8, marginRight: 8, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.75)' },
  historyButtonText: { fontSize: 11, fontWeight: '800', color: '#765CB8' },
  eyebrow: { fontSize: 10, letterSpacing: 1.6, fontWeight: '800', color: '#8B72CF', marginBottom: 4 },
  title: { fontFamily: theme.fonts.serif, fontSize: 28, color: theme.colors.ink },
  headerIcon: { width: 42, height: 42, borderRadius: 16, backgroundColor: '#F0E9FC', alignItems: 'center', justifyContent: 'center' },
  hero: { borderRadius: 24, padding: 20, backgroundColor: '#F0E9FC', marginBottom: 20 },
  heroTitle: { fontFamily: theme.fonts.serif, fontSize: 22, lineHeight: 28, color: theme.colors.ink, marginBottom: 8 },
  heroBody: { fontSize: 13, lineHeight: 20, color: theme.colors.muted },
  handRow: { marginBottom: 14 },
  sectionLabel: { fontSize: 13, fontWeight: '800', color: theme.colors.ink, marginBottom: 9 },
  segmented: { flexDirection: 'row', padding: 4, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.75)' },
  segment: { flex: 1, paddingVertical: 11, borderRadius: 12, alignItems: 'center' },
  segmentActive: { backgroundColor: '#8B72CF' },
  segmentText: { fontSize: 13, fontWeight: '700', color: theme.colors.muted },
  segmentTextActive: { color: '#FFFFFF' },
  captureCard: { borderRadius: 24, borderWidth: 1, borderColor: 'rgba(31,33,48,0.08)', backgroundColor: 'rgba(255,255,255,0.8)', padding: 20, alignItems: 'center', ...theme.shadows.warmSm },
  captureIcon: { width: 94, height: 94, borderRadius: 47, backgroundColor: '#F2ECFC', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  preview: { width: 120, height: 150, borderRadius: 18, marginBottom: 16 },
  captureTitle: { fontSize: 16, fontWeight: '800', color: theme.colors.ink, textAlign: 'center' },
  captureBody: { fontSize: 12, lineHeight: 18, color: theme.colors.muted, textAlign: 'center', marginTop: 7, marginBottom: 18 },
  actionRow: { width: '100%', gap: 9 },
  primaryButton: { minHeight: 48, borderRadius: 16, backgroundColor: '#8B72CF', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  secondaryButton: { minHeight: 48, borderRadius: 16, backgroundColor: '#F5F0FC', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  secondaryButtonText: { color: '#765CB8', fontSize: 13, fontWeight: '800' },
  loadingRow: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 9 },
  loadingText: { fontSize: 13, color: theme.colors.muted },
  loadingPlaceholder: { width: '100%', gap: 9, marginTop: 4 },
  skeletonLineShort: { height: 12, width: '42%', borderRadius: 6, backgroundColor: '#EAE3F7' },
  skeletonLine: { height: 12, width: '100%', borderRadius: 6, backgroundColor: '#EAE3F7' },
  skeletonLineMedium: { height: 12, width: '76%', borderRadius: 6, backgroundColor: '#EAE3F7' },
  errorBox: { marginTop: 14, borderRadius: 14, backgroundColor: '#FFF0F0', padding: 13 },
  errorText: { color: '#A13C46', fontSize: 12, lineHeight: 18 },
  resultStack: { gap: 14 },
  resultHero: { borderRadius: 24, padding: 18, overflow: 'hidden' },
  resultHeroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  resultBadge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 11, paddingVertical: 7, borderRadius: 14, backgroundColor: '#E5F6F1' },
  resultBadgeText: { color: '#168E86', fontSize: 11, fontWeight: '800' },
  resultHand: { fontSize: 10, letterSpacing: 1.2, fontWeight: '800', color: '#765CB8' },
  resultImage: { width: '100%', height: 220, borderRadius: 18, marginBottom: 16 },
  resultHeroEyebrow: { fontSize: 10, letterSpacing: 1.4, fontWeight: '800', color: '#765CB8', marginBottom: 7 },
  resultHeroTitle: { fontFamily: theme.fonts.serif, fontSize: 23, lineHeight: 29, color: theme.colors.ink },
  summaryCard: { borderRadius: 22, padding: 20, backgroundColor: '#FFFDFC', borderWidth: 1, borderColor: 'rgba(31,33,48,0.08)' },
  cardEyebrow: { fontSize: 10, letterSpacing: 1.3, fontWeight: '800', color: '#8B72CF', marginBottom: 10 },
  summary: { fontFamily: theme.fonts.serif, fontSize: 20, lineHeight: 28, color: theme.colors.ink },
  summaryRule: { height: 1, backgroundColor: 'rgba(31,33,48,0.08)', marginVertical: 15 },
  summaryHint: { fontSize: 12, lineHeight: 18, color: theme.colors.muted },
  detailsCard: { borderRadius: 22, padding: 18, backgroundColor: 'rgba(255,255,255,0.82)', borderWidth: 1, borderColor: 'rgba(31,33,48,0.08)' },
  cardHeadingRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 7, marginBottom: 12 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: theme.colors.ink },
  cardSubtitle: { fontSize: 11, lineHeight: 16, color: theme.colors.muted, marginTop: 3 },
  detailRow: { flexDirection: 'row', paddingVertical: 13, borderTopWidth: 1, borderTopColor: 'rgba(31,33,48,0.07)' },
  detailRowFirst: { borderTopWidth: 0 },
  detailAccent: { width: 4, borderRadius: 3, marginRight: 11, minHeight: 48 },
  detailContent: { flex: 1 },
  detailLabel: { fontSize: 11, fontWeight: '800', color: '#8B72CF', textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 4 },
  detailBody: { fontSize: 13, lineHeight: 20, color: theme.colors.ink },
  lockedCard: { borderRadius: 22, padding: 18, backgroundColor: '#FFF4E8' },
  lockedTitle: { fontSize: 15, fontWeight: '800', color: theme.colors.ink, marginBottom: 6 },
  lockedBody: { fontSize: 13, lineHeight: 19, color: theme.colors.muted, marginBottom: 10 },
  lockedLink: { fontSize: 13, fontWeight: '800', color: '#8B72CF' },
  disclaimer: { flexDirection: 'row', gap: 7, alignItems: 'flex-start', paddingHorizontal: 3 },
  disclaimerText: { flex: 1, fontSize: 11, lineHeight: 16, color: theme.colors.muted },
  newReadingButton: { minHeight: 48, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(139,114,207,0.35)', alignItems: 'center', justifyContent: 'center' },
  newReadingText: { fontSize: 13, fontWeight: '800', color: '#765CB8' },
});
