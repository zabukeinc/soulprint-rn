import React from 'react';
import { ActivityIndicator, StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { theme } from '@/src/lib/theme';

export function LoadingPage({
  title = 'Loading your signal',
  body = 'Fetching your latest reading from the backend.',
}: {
  title?: string;
  body?: string;
}) {
  return (
    <View style={styles.page}>
      <View style={styles.card}>
        <ActivityIndicator color="#8B72CF" size="small" />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>
        <View style={styles.skeletonStack}>
          <View style={[styles.skeleton, { width: '88%' }]} />
          <View style={[styles.skeleton, { width: '72%' }]} />
          <View style={[styles.skeleton, { width: '54%' }]} />
        </View>
      </View>
    </View>
  );
}

export function InlineRefreshing({ label = 'Updating from backend...' }: { label?: string }) {
  return (
    <View style={styles.inline}>
      <ActivityIndicator color="#8B72CF" size="small" />
      <Text style={styles.inlineText}>{label}</Text>
    </View>
  );
}

export function SkeletonBlock({
  width = '100%',
  height = 14,
  radius = 8,
  style,
}: {
  width?: ViewStyle['width'];
  height?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius: radius,
        },
        style,
      ]}
    />
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <View style={styles.skeletonTextStack}>
      {Array.from({ length: lines }).map((_, index) => (
        <SkeletonBlock
          key={index}
          width={index === lines - 1 ? '58%' : index % 2 ? '76%' : '92%'}
          height={11}
          radius={6}
        />
      ))}
    </View>
  );
}

export function SkeletonCard({
  height = 140,
  lines = 3,
  compact = false,
  style,
}: {
  height?: number;
  lines?: number;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.skeletonCard, { minHeight: height, padding: compact ? 14 : 18 }, style]}>
      <View style={styles.skeletonCardTop}>
        <SkeletonBlock width={compact ? 38 : 48} height={compact ? 38 : 48} radius={compact ? 19 : 24} />
        <View style={{ flex: 1 }}>
          <SkeletonBlock width="44%" height={10} radius={5} />
          <SkeletonBlock width="68%" height={18} radius={9} style={{ marginTop: 10 }} />
        </View>
      </View>
      <SkeletonText lines={lines} />
    </View>
  );
}

export function SkeletonPillRow({ count = 3 }: { count?: number }) {
  return (
    <View style={styles.skeletonPillRow}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonBlock key={index} style={{ flex: 1 }} height={38} radius={19} />
      ))}
    </View>
  );
}

export function ErrorStateCard({
  title = 'Could not load this yet',
  body = 'Check your connection and try again.',
  actionLabel = 'Try again',
  onRetry,
  style,
}: {
  title?: string;
  body?: string;
  actionLabel?: string;
  onRetry?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.errorCard, style]}>
      <Text style={styles.errorTitle}>{title}</Text>
      <Text style={styles.errorBody}>{body}</Text>
      {onRetry && (
        <TouchableOpacity activeOpacity={0.85} onPress={onRetry} style={styles.retryButton}>
          <Text style={styles.retryText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 28,
    padding: 22,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    ...theme.shadows.warmSoft,
  },
  title: {
    marginTop: 14,
    fontFamily: theme.fonts.serif,
    fontSize: 22,
    fontWeight: '500',
    color: theme.colors.ink,
    textAlign: 'center',
  },
  body: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 20,
    color: theme.colors.muted,
    textAlign: 'center',
  },
  skeletonStack: {
    width: '100%',
    gap: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  skeleton: {
    backgroundColor: 'rgba(139,114,207,0.12)',
  },
  skeletonCard: {
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.74)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.07)',
    ...theme.shadows.warmSm,
  },
  skeletonCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 18,
  },
  skeletonTextStack: {
    gap: 10,
  },
  skeletonPillRow: {
    flexDirection: 'row',
    gap: 8,
  },
  inline: {
    minHeight: 34,
    borderRadius: 17,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(232,221,251,0.42)',
    borderWidth: 1,
    borderColor: 'rgba(139,114,207,0.12)',
  },
  inlineText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8B72CF',
  },
  errorCard: {
    borderRadius: 24,
    padding: 18,
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(184,74,98,0.18)',
    ...theme.shadows.warmSm,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.ink,
  },
  errorBody: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 20,
    color: theme.colors.muted,
  },
  retryButton: {
    marginTop: 14,
    minHeight: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.ink,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
