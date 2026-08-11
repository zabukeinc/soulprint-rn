import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { theme } from '@/src/lib/theme';
import type { TarotVisual } from '@/src/services/backend';

type TarotArtworkCardProps = {
  name: string;
  reversed: boolean;
  keywords: string;
  visual?: TarotVisual;
  fallbackSymbol?: string;
};

const fallbackVisual: TarotVisual = {
  imageKey: 'tarot/fallback',
  hasArtwork: false,
  imageUrl: null,
  symbol: '✦',
  arcana: 'symbolic',
  suit: 'astrovy',
  rank: null,
  palette: {
    background: ['#E7DDFC', '#DCF0E3'],
    accent: '#8B72CF',
    ink: '#1F2130',
    aura: '#F8DCCB',
  },
  visualPrompt: '',
};

export function TarotArtworkCard({ name, reversed, keywords, visual, fallbackSymbol }: TarotArtworkCardProps) {
  const artwork = visual ?? fallbackVisual;
  const palette = artwork.palette ?? fallbackVisual.palette;
  const symbol = visual?.symbol || fallbackSymbol || fallbackVisual.symbol;
  const label = artwork.rank ? `${artwork.rank} · ${artwork.suit}` : artwork.suit;

  return (
    <LinearGradient
      colors={palette.background}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.shell, { borderColor: `${palette.accent}40` }]}
    >
      <View style={[styles.auraLarge, { backgroundColor: `${palette.aura}8A` }]} />
      <View style={[styles.auraSmall, { backgroundColor: `${palette.accent}22` }]} />
      <View style={[styles.innerBorder, { borderColor: `${palette.accent}55` }]}>
        <View style={styles.topRail}>
          <Text style={[styles.arcana, { color: palette.accent }]}>{artwork.arcana}</Text>
          {reversed && (
            <View style={[styles.reversedBadge, { backgroundColor: `${palette.accent}1F` }]}>
              <Text style={[styles.reversedText, { color: palette.accent }]}>Reversed</Text>
            </View>
          )}
        </View>

        {artwork.hasArtwork && artwork.imageUrl ? (
          <View style={[styles.artworkFrame, { borderColor: `${palette.accent}4D` }]}>
            <Image
              source={artwork.imageUrl}
              style={[styles.artworkImage, reversed && styles.artworkImageReversed]}
              contentFit="cover"
              transition={300}
              cachePolicy="memory-disk"
            />
            <View style={[styles.artworkBorder, { borderColor: `${palette.accent}55` }]} />
          </View>
        ) : (
          <View style={[styles.symbolFrame, { borderColor: `${palette.accent}4D`, backgroundColor: `${palette.aura}40` }]}>
            <Text style={[styles.symbol, { color: palette.ink }]}>{symbol}</Text>
            <View style={[styles.symbolUnderline, { backgroundColor: palette.accent }]} />
          </View>
        )}

        <View style={styles.caption}>
          <Text style={[styles.name, { color: palette.ink }]} numberOfLines={2}>
            {name}
          </Text>
          <Text style={[styles.keywords, { color: `${palette.ink}A6` }]} numberOfLines={2}>
            {keywords || label}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  shell: {
    minHeight: 310,
    borderRadius: 26,
    padding: 12,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    ...theme.shadows.warmSoft,
  },
  auraLarge: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    right: -52,
    top: -44,
  },
  auraSmall: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    left: -42,
    bottom: -32,
  },
  innerBorder: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  topRail: {
    minHeight: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  arcana: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  reversedBadge: {
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  reversedText: {
    fontSize: 10,
    fontWeight: '900',
  },
  symbolFrame: {
    alignSelf: 'center',
    width: 156,
    height: 156,
    borderRadius: 78,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  artworkFrame: {
    alignSelf: 'center',
    width: 200,
    height: 300,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginVertical: 16,
  },
  artworkImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  artworkImageReversed: {
    transform: [{ rotate: '180deg' }],
  },
  artworkBorder: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: 4,
    bottom: 4,
    borderRadius: 12,
    borderWidth: 1,
    pointerEvents: 'none',
  },
  symbol: {
    fontSize: 72,
    lineHeight: 82,
  },
  symbolUnderline: {
    width: 42,
    height: 3,
    borderRadius: 999,
    marginTop: 6,
    opacity: 0.72,
  },
  caption: {
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontFamily: theme.fonts.serif,
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
  },
  keywords: {
    fontSize: 12,
    lineHeight: 17,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
