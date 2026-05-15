import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { theme } from '@/src/lib/theme';

interface Props {
  streak: number;
}

export default function VisualStreakTracker({ streak }: Props) {
  const maxDots = 7;
  const dots = Array.from({ length: maxDots }, (_, i) => i < streak);

  return (
    <Animated.View entering={FadeInUp.duration(500)} style={styles.container}>
      <Text style={styles.label}>Your reflection arc</Text>
      <View style={styles.track}>
        {dots.map((active, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              active && styles.dotActive,
              i === streak - 1 && streak > 0 && styles.dotLatest,
            ]}
          >
            {active && <View style={styles.dotInner} />}
          </View>
        ))}
      </View>
      <Text style={styles.subtitle}>
        {streak === 0
          ? "Start your first reflection today."
          : streak === 1
          ? "First reflection. The arc begins."
          : streak < 4
          ? `${streak} reflections. You're building something.`
          : streak < 7
          ? `${streak} days. The pattern is forming.`
          : `${streak} days. This is who you're becoming.`}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    ...theme.shadows.warmSm,
  },
  label: {
    fontSize: 11,
    letterSpacing: 1.2,
    color: '#8B72CF',
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 12,
  },
  track: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  dot: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(31,33,48,0.06)',
  },
  dotActive: {
    backgroundColor: '#8B72CF',
  },
  dotLatest: {
    shadowColor: 'rgba(139,114,207,0.4)',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 1,
  },
  dotInner: {
    flex: 1,
    borderRadius: 4,
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.muted,
    textAlign: 'center',
  },
});
