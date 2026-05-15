import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import ProgressDots from '@/src/components/ProgressDots';
import { theme } from '@/src/lib/theme';

const focusOptions = [
  { id: 'love', label: 'Love', emoji: '💕' },
  { id: 'lost', label: 'Feeling lost', emoji: '🌫️' },
  { id: 'worth', label: 'Self-worth', emoji: '⭐' },
  { id: 'career', label: 'Career', emoji: '🎯' },
  { id: 'healing', label: 'Healing', emoji: '🌙' },
  { id: 'purpose', label: 'Purpose', emoji: '🌟' },
];

function FocusCard({ opt, isSelected, onPress, index }: any) {
  return (
    <Animated.View
      entering={FadeInUp.delay(index * 60).duration(500)}
      style={{ width: '47%' }}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={[
          styles.card,
          isSelected && styles.cardActive,
        ]}
      >
        <Text style={styles.emoji}>{opt.emoji}</Text>
        <Text style={styles.cardLabel}>{opt.label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function FocusMoodScreen() {
  const router = useRouter();
  const [focus, setFocus] = useState<string | null>(null);

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
        <Text style={styles.stepText}>5 of 6</Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(100).duration(500)}>
        <Text style={styles.label}>Right now</Text>
        <Text style={styles.title}>What needs understanding today?</Text>
        <Text style={styles.description}>Choose one area you want to explore.</Text>
      </Animated.View>

      <View style={styles.grid}>
        {focusOptions.map((opt, index) => {
          const isSelected = focus === opt.id;
          return (
            <FocusCard
              key={opt.id}
              opt={opt}
              isSelected={isSelected}
              onPress={() => setFocus(opt.id)}
              index={index}
            />
          );
        })}
      </View>

      <Animated.View entering={FadeInUp.delay(400).duration(500)}>
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={!focus}
          onPress={() => router.push('/(onboarding)/generating')}
        >
          <LinearGradient
            colors={focus ? theme.gradients.primary : ['#C4B8E0', '#A0D4D0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.button, !focus && styles.buttonDisabled]}
          >
            <Text style={styles.buttonText}>Create My Soulprint</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      <ProgressDots total={6} current={4} />
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
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  card: {
    width: '47%',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    backgroundColor: 'rgba(255,255,255,0.72)',
    padding: 16,
    minHeight: 100,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.warmSm,
  },
  cardActive: {
    borderColor: 'rgba(139,114,207,0.4)',
    backgroundColor: 'rgba(232,221,251,0.98)',
    shadowColor: 'rgba(139,114,207,0.15)',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    shadowOpacity: 1,
    elevation: 6,
  },
  emoji: { fontSize: 28, marginBottom: 8 },
  cardLabel: { fontSize: 13, fontWeight: '500', color: theme.colors.ink },
  button: {
    width: '100%',
    minHeight: 54,
    borderRadius: 27,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.primaryGlow,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
});
