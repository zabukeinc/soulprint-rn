import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import ProgressDots from '@/src/components/ProgressDots';
import { theme } from '@/src/lib/theme';

const mbtiOptions = [
  { type: 'INFJ', label: 'Advocate', symbol: '🧠', color: '#E8DDFB' },
  { type: 'INTJ', label: 'Architect', symbol: '🏰', color: '#DDEDDC' },
  { type: 'INFP', label: 'Mediator', symbol: '🎨', color: '#F8DCCB' },
  { type: 'ENFJ', label: 'Protagonist', symbol: '✨', color: '#F7D875' },
  { type: 'ENTJ', label: 'Commander', symbol: '🎯', color: '#DFF2EC' },
  { type: 'ENFP', label: 'Campaigner', symbol: '🎪', color: '#F4C7D2' },
  { type: 'ISTJ', label: 'Logistician', symbol: '📋', color: '#E8DDFB' },
  { type: 'ISFJ', label: 'Defender', symbol: '🛡️', color: '#DDEDDC' },
  { type: 'ESTJ', label: 'Executive', symbol: '⚡', color: '#F8DCCB' },
  { type: 'ESFJ', label: 'Provider', symbol: '🤝', color: '#DFF2EC' },
  { type: 'ISTP', label: 'Virtuoso', symbol: '🔧', color: '#E8DDFB' },
  { type: 'ISFP', label: 'Adventurer', symbol: '🌿', color: '#F7D875' },
  { type: 'ESTP', label: 'Entrepreneur', symbol: '🚀', color: '#F4C7D2' },
  { type: 'ESFP', label: 'Entertainer', symbol: '🎭', color: '#DDEDDC' },
  { type: "I'm not sure", label: 'Explore later', symbol: '❓', color: '#E8DDFB' },
];

export default function MbtiScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.stepText}>4 of 6</Text>
      </View>

      <Text style={styles.label}>Optional self-language</Text>
      <Text style={styles.title}>Do you know your MBTI?</Text>
      <Text style={styles.description}>
        If you already use MBTI, Soulprint can weave it gently into your reading.
      </Text>

      <View style={styles.grid}>
        {mbtiOptions.map((opt) => {
          const isSelected = selected === opt.type;
          return (
            <TouchableOpacity
              key={opt.type}
              onPress={() => setSelected(opt.type)}
              activeOpacity={0.85}
              style={[
                styles.card,
                isSelected && styles.cardActive,
              ]}
            >
              <Text style={styles.symbol}>{opt.symbol}</Text>
              <View style={styles.cardText}>
                <Text style={styles.type}>{opt.type}</Text>
                <Text style={styles.typeLabel}>{opt.label}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        disabled={!selected}
        onPress={() => router.push('/(onboarding)/focus-mood')}
      >
        <LinearGradient
          colors={selected ? theme.gradients.primary : ['#C4B8E0', '#A0D4D0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.button, !selected && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => router.push('/(onboarding)/focus-mood')}
      >
        <Text style={styles.skipButtonText}>Skip and test later</Text>
      </TouchableOpacity>

      <ProgressDots total={6} current={3} />
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
    gap: 10,
    marginBottom: 24,
  },
  card: {
    width: '47%',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    backgroundColor: 'rgba(255,255,255,0.72)',
    padding: 16,
    minHeight: 88,
    ...theme.shadows.warmSm,
  },
  cardActive: {
    borderColor: 'rgba(139,114,207,0.35)',
    backgroundColor: 'rgba(232,221,251,0.98)',
    shadowColor: 'rgba(139,114,207,0.2)',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    shadowOpacity: 1,
    elevation: 6,
  },
  symbol: { fontSize: 24, marginBottom: 8 },
  cardText: { marginTop: 'auto' },
  type: { fontSize: 13, fontWeight: '700', color: theme.colors.ink },
  typeLabel: { fontSize: 10, color: theme.colors.muted },
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
  buttonDisabled: { opacity: 0.5 },
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
