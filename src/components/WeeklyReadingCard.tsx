import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/src/lib/theme';
import { getWeeklyReading } from '@/src/lib/dailyContent';

interface Props {
  visible: boolean;
  onDismiss: () => void;
}

export default function WeeklyReadingCard({ visible, onDismiss }: Props) {
  if (!visible) return null;

  const reading = getWeeklyReading();

  return (
    <Animated.View entering={FadeInUp.duration(500)} style={styles.container}>
      <LinearGradient
        colors={theme.gradients.hero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.glow} />
        <Text style={styles.label}>This week's reflection</Text>
        <Text style={styles.title}>{reading.title}</Text>
        <Text style={styles.body}>{reading.body}</Text>
        <TouchableOpacity onPress={onDismiss} activeOpacity={0.8}>
          <Text style={styles.dismiss}>Acknowledge →</Text>
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 24,
    overflow: 'hidden',
    ...theme.shadows.warmSoft,
  },
  gradient: {
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
  },
  glow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.3)',
    right: -30,
    top: -30,
  },
  label: {
    fontSize: 11,
    letterSpacing: 1.4,
    color: '#8B72CF',
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 12,
  },
  title: {
    fontFamily: theme.fonts.serif,
    fontSize: 18,
    fontWeight: '500',
    color: theme.colors.ink,
    lineHeight: 24,
    marginBottom: 8,
  },
  body: {
    fontSize: 13,
    color: theme.colors.muted,
    lineHeight: 22,
    marginBottom: 12,
  },
  dismiss: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8B72CF',
  },
});
