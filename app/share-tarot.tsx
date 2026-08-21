import React, { useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import { LinearGradient } from 'expo-linear-gradient';
import { TAROT_CARDS } from '@/src/lib/tarot';
import { clearTarotSharePayload, getTarotSharePayload } from '@/src/lib/tarotShare';
import { theme } from '@/src/lib/theme';

const FALLBACK_PALETTE = {
  background: ['#E7DDFC', '#DCF0E3'] as [string, string],
  accent: '#8B72CF',
  ink: '#1F2130',
  aura: '#F8DCCB',
};

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function compactShareMeaning(value: string, maxLength = 145) {
  const normalized = value.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) return normalized;

  const firstSentence = normalized.match(/^.+?[.!?](?:\s|$)/)?.[0]?.trim();
  if (firstSentence && firstSentence.length <= maxLength) return firstSentence;

  const boundary = normalized.slice(0, maxLength).lastIndexOf(' ');
  return `${normalized.slice(0, boundary > 0 ? boundary : maxLength).trim()}.`;
}

export default function ShareTarotScreen() {
  const router = useRouter();
  const cardRef = useRef<View>(null);
  const [sharing, setSharing] = useState(false);
  const { cardId, reversed, position } = useLocalSearchParams<{
    cardId: string;
    reversed: string;
    position: string;
  }>();

  const payload = getTarotSharePayload();
  const card = useMemo(() => TAROT_CARDS.find((item) => item.id === cardId), [cardId]);
  const isReversed = payload?.reversed ?? reversed === '1';

  if (!card && !payload) return null;

  const name = payload?.name ?? card?.name ?? cardId ?? 'Tarot card';
  const keywords = payload?.keywords ?? (card ? (isReversed ? card.keywords.reversed : card.keywords.upright) : '');
  const meaning = payload?.meaning ?? (card ? card.meaning.free : 'A message to reflect on today.');
  const shareMeaning = compactShareMeaning(meaning);
  const visual = payload?.visual;
  const palette = visual?.palette ?? FALLBACK_PALETTE;
  const positionLabel = titleCase(payload?.position ?? position ?? 'reading');
  const shareText = `${name} · ${positionLabel}${isReversed ? ' · Reversed' : ''}\n${meaning}\n\nastrovy.space`;

  const close = () => {
    clearTarotSharePayload();
    router.back();
  };

  const shareStory = async () => {
    if (sharing) return;
    setSharing(true);
    try {
      if (cardRef.current && await Sharing.isAvailableAsync()) {
        const uri = await captureRef(cardRef, { format: 'png', quality: 1 });
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: 'Share your Astrovy tarot card',
          UTI: 'public.png',
        });
        return;
      }
      await Share.share({ message: shareText });
    } finally {
      setSharing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View ref={cardRef} collapsable={false} style={styles.cardWrapper}>
        <LinearGradient
          colors={palette.background}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View style={[styles.auraLarge, { backgroundColor: `${palette.aura}A6` }]} />
          <View style={[styles.auraSmall, { backgroundColor: `${palette.accent}24` }]} />
          <View style={[styles.innerBorder, { borderColor: `${palette.accent}55` }]}>
            <View style={styles.header}>
              <Text style={[styles.brand, { color: palette.accent }]}>ASTROVY TAROT</Text>
              <Text style={[styles.position, { color: palette.accent }]}>
                {positionLabel.toUpperCase()}{isReversed ? ' · REVERSED' : ''}
              </Text>
            </View>

            <View style={[styles.artworkFrame, { borderColor: `${palette.accent}55` }]}>
              {visual?.hasArtwork && visual.imageUrl ? (
                <Image
                  source={visual.imageUrl}
                  style={[styles.artwork, isReversed && styles.reversedArtwork]}
                  contentFit="cover"
                  cachePolicy="memory-disk"
                />
              ) : (
                <View style={[styles.symbolFallback, { backgroundColor: `${palette.aura}70` }]}>
                  <Text style={[styles.symbol, { color: palette.ink }]}>{visual?.symbol ?? card?.emoji ?? '✦'}</Text>
                </View>
              )}
              <View style={[styles.artworkBorder, { borderColor: `${palette.accent}66` }]} />
            </View>

            <View style={styles.identity}>
              <Text style={[styles.cardName, { color: palette.ink }]}>{name}</Text>
              <Text style={[styles.keywords, { color: `${palette.ink}A8` }]}>{keywords}</Text>
            </View>

            <View style={[styles.quotePanel, { borderColor: `${palette.accent}35`, backgroundColor: `${palette.aura}45` }]}>
              <Text style={[styles.quoteMark, { color: palette.accent }]}>“</Text>
              <Text style={[styles.meaning, { color: palette.ink }]} numberOfLines={4}>{shareMeaning}</Text>
            </View>

            <View style={styles.footer}>
              <View style={[styles.footerLine, { backgroundColor: palette.accent }]} />
              <Text style={[styles.footerBrand, { color: `${palette.ink}90` }]}>astrovy.space</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.shareButton} onPress={shareStory} disabled={sharing} activeOpacity={0.85}>
          {sharing ? <ActivityIndicator color={theme.colors.ink} /> : <Text style={styles.shareText}>Share this card</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeButton} onPress={close} activeOpacity={0.8}>
          <Text style={styles.closeText}>Back to tarot</Text>
        </TouchableOpacity>
        <Text style={styles.hint}>Your private profile details stay out of the shared card.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F0E9', alignItems: 'center', justifyContent: 'center', padding: 16 },
  cardWrapper: { width: '100%', maxWidth: 420, aspectRatio: 9 / 16, borderRadius: 24, overflow: 'hidden', elevation: 12, shadowColor: '#1F2130', shadowOffset: { width: 0, height: 18 }, shadowRadius: 28, shadowOpacity: 0.22 },
  card: { flex: 1, padding: 12 },
  innerBorder: { flex: 1, borderWidth: 1, borderRadius: 18, padding: 18, overflow: 'hidden', justifyContent: 'space-between' },
  auraLarge: { position: 'absolute', width: 260, height: 260, borderRadius: 130, right: -86, top: -72 },
  auraSmall: { position: 'absolute', width: 180, height: 180, borderRadius: 90, left: -72, bottom: -48 },
  header: { alignItems: 'center', gap: 8 },
  brand: { fontSize: 10, fontWeight: '900', letterSpacing: 2.6 },
  position: { fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  artworkFrame: { alignSelf: 'center', width: '67%', aspectRatio: 2 / 3, borderRadius: 15, borderWidth: 1, overflow: 'hidden', marginVertical: 12 },
  artwork: { width: '100%', height: '100%' },
  reversedArtwork: { transform: [{ rotate: '180deg' }] },
  artworkBorder: { position: 'absolute', top: 5, left: 5, right: 5, bottom: 5, borderRadius: 11, borderWidth: 1 },
  symbolFallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  symbol: { fontSize: 72 },
  identity: { alignItems: 'center', gap: 5 },
  cardName: { fontFamily: theme.fonts.serif, fontSize: 28, fontWeight: '500', textAlign: 'center' },
  keywords: { fontSize: 10, lineHeight: 15, fontStyle: 'italic', textAlign: 'center' },
  quotePanel: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, flexDirection: 'row', alignItems: 'flex-start', gap: 5 },
  quoteMark: { fontFamily: theme.fonts.serif, fontSize: 28, lineHeight: 24 },
  meaning: { flex: 1, fontSize: 11, lineHeight: 16, textAlign: 'center' },
  footer: { alignItems: 'center', gap: 7 },
  footerLine: { width: 32, height: 2, borderRadius: 2, opacity: 0.6 },
  footerBrand: { fontSize: 9, letterSpacing: 1.5, fontWeight: '700' },
  actions: { width: '100%', maxWidth: 420, alignItems: 'center', gap: 9, marginTop: 16 },
  shareButton: { minWidth: 190, minHeight: 46, paddingHorizontal: 24, borderRadius: 23, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(31,33,48,0.12)' },
  shareText: { fontSize: 14, fontWeight: '800', color: theme.colors.ink },
  closeButton: { paddingHorizontal: 18, paddingVertical: 8 },
  closeText: { fontSize: 13, fontWeight: '700', color: theme.colors.muted },
  hint: { fontSize: 10, color: theme.colors.muted, textAlign: 'center' },
});
