import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { theme } from '@/src/lib/theme';
import { moodAlerts } from '@/src/lib/dailyContent';

interface Props {
  mood: string | null;
}

export default function PatternAlertCard({ mood }: Props) {
  if (!mood || !moodAlerts[mood]) return null;

  return (
    <Animated.View entering={FadeInUp.duration(500)} style={styles.container}>
      <View style={styles.iconRow}>
        <Text style={styles.icon}>🌊</Text>
        <Text style={styles.label}>Pattern emerging</Text>
      </View>
      <Text style={styles.text}>{moodAlerts[mood]}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(248,220,203,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(248,220,203,0.6)',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  icon: { fontSize: 16 },
  label: {
    fontSize: 11,
    letterSpacing: 1,
    color: '#C48B5E',
    textTransform: 'uppercase',
    fontWeight: '800',
  },
  text: {
    fontSize: 13,
    color: theme.colors.ink,
    lineHeight: 22,
  },
});
