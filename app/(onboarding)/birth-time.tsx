import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import ProgressDots from '@/src/components/ProgressDots';
import { theme } from '@/src/lib/theme';

export default function BirthTimeScreen() {
  const router = useRouter();
  const [time, setTime] = useState('23:59');

  // Simplified time picker using hour/minute selectors
  const [hour, setHour] = useState(23);
  const [minute, setMinute] = useState(59);

  const updateTime = (h: number, m: number) => {
    setHour(h);
    setMinute(m);
    setTime(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeInUp.duration(500)} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.stepText}>2 of 6</Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(100).duration(500)}>
        <Text style={styles.label}>Optional depth</Text>
        <Text style={styles.title}>Do you know your birth time?</Text>
        <Text style={styles.description}>
          Birth time helps us understand your emotional timing.
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(200).duration(500)} style={styles.timeCard}>
        <Text style={styles.timeLabel}>Birth Time</Text>
        <View style={styles.timeDisplay}>
          <Text style={styles.timeValue}>{time}</Text>
        </View>
        <View style={styles.timePickers}>
          <ScrollView style={styles.timeScroll} showsVerticalScrollIndicator={false}>
            {Array.from({ length: 24 }, (_, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => updateTime(i, minute)}
                style={[styles.timeItem, hour === i && styles.timeItemActive]}
              >
                <Text style={[styles.timeItemText, hour === i && styles.timeItemTextActive]}>
                  {i.toString().padStart(2, '0')}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text style={styles.timeColon}>:</Text>
          <ScrollView style={styles.timeScroll} showsVerticalScrollIndicator={false}>
            {Array.from({ length: 60 }, (_, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => updateTime(hour, i)}
                style={[styles.timeItem, minute === i && styles.timeItemActive]}
              >
                <Text style={[styles.timeItemText, minute === i && styles.timeItemTextActive]}>
                  {i.toString().padStart(2, '0')}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(300).duration(500)} style={styles.tipCard}>
        <Text style={styles.tipEmoji}>💡</Text>
        <View style={styles.tipText}>
          <Text style={styles.tipTitle}>Not sure?</Text>
          <Text style={styles.tipDesc}>
            You can skip this and update later. Your reading works without it.
          </Text>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(400).duration(500)}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push('/(onboarding)/location')}
        >
          <LinearGradient
            colors={theme.gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(500).duration(500)}>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => router.push('/(onboarding)/location')}
        >
          <Text style={styles.skipButtonText}>Skip for now</Text>
        </TouchableOpacity>
      </Animated.View>

      <ProgressDots total={6} current={1} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.76)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.warmSoft,
  },
  backIcon: { fontSize: 18, color: theme.colors.ink },
  stepText: { fontSize: 12, color: theme.colors.muted },
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
    fontSize: 28,
    fontWeight: '500',
    color: theme.colors.ink,
    letterSpacing: -1.2,
    lineHeight: 32,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: theme.colors.muted,
    lineHeight: 23,
    marginBottom: 24,
  },
  timeCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    ...theme.shadows.warmSm,
  },
  timeLabel: { fontSize: 12, color: theme.colors.muted, marginBottom: 8 },
  timeDisplay: {
    alignItems: 'center',
    marginBottom: 12,
  },
  timeValue: {
    fontSize: 32,
    fontWeight: '600',
    color: theme.colors.ink,
    fontVariant: ['tabular-nums'],
  },
  timePickers: {
    flexDirection: 'row',
    height: 150,
    alignItems: 'center',
  },
  timeScroll: {
    flex: 1,
    backgroundColor: 'rgba(31,33,48,0.03)',
    borderRadius: 12,
  },
  timeItem: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  timeItemActive: {
    backgroundColor: 'rgba(139,114,207,0.1)',
  },
  timeItemText: {
    fontSize: 16,
    color: theme.colors.muted,
  },
  timeItemTextActive: {
    color: '#8B72CF',
    fontWeight: '700',
  },
  timeColon: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.ink,
    paddingHorizontal: 8,
  },
  tipCard: {
    borderRadius: 24,
    padding: 16,
    marginBottom: 24,
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    ...theme.shadows.warmSm,
  },
  tipEmoji: { fontSize: 24 },
  tipText: { flex: 1 },
  tipTitle: { fontSize: 14, fontWeight: '500', color: theme.colors.ink, marginBottom: 4 },
  tipDesc: { fontSize: 12, color: theme.colors.softMuted, lineHeight: 17 },
  button: {
    width: '100%',
    minHeight: 54,
    borderRadius: 27,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    ...theme.shadows.primaryGlow,
  },
  buttonText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
  skipButton: {
    width: '100%',
    minHeight: 54,
    borderRadius: 27,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.68)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    marginBottom: 16,
  },
  skipButtonText: { fontSize: 14, fontWeight: '800', color: theme.colors.ink },
});
