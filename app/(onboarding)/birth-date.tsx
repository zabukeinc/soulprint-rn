import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';
import SoftMascot from '@/src/components/SoftMascot';
import ProgressDots from '@/src/components/ProgressDots';
import { theme } from '@/src/lib/theme';
import { useOnboarding } from '@/src/context/OnboardingContext';

const months = [
  { value: 1, label: 'Jan' },
  { value: 2, label: 'Feb' },
  { value: 3, label: 'Mar' },
  { value: 4, label: 'Apr' },
  { value: 5, label: 'May' },
  { value: 6, label: 'Jun' },
  { value: 7, label: 'Jul' },
  { value: 8, label: 'Aug' },
  { value: 9, label: 'Sep' },
  { value: 10, label: 'Oct' },
  { value: 11, label: 'Nov' },
  { value: 12, label: 'Dec' },
];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 101 }, (_, i) => currentYear - i);

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function pad(value: number) {
  return String(value).padStart(2, '0');
}

export default function BirthDateScreen() {
  const router = useRouter();
  const { update } = useOnboarding();
  const [day, setDay] = useState(27);
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(2000);

  const days = Array.from({ length: daysInMonth(year, month) }, (_, i) => i + 1);
  const selectedMonth = months.find((item) => item.value === month)?.label ?? pad(month);
  const selectedDate = `${selectedMonth} ${day}, ${year}`;

  useEffect(() => {
    setDay((current) => Math.min(current, daysInMonth(year, month)));
  }, [month, year]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeInUp.duration(500)} style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.stepText}>2 of 7</Text>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.duration(500)}
        style={styles.heroCard}
      >
        <View style={styles.heroText}>
          <Text style={styles.heroLabel}>Your first layer</Text>
          <Text style={styles.heroTitle}>When did your story begin?</Text>
          <Text style={styles.heroDesc}>
            Your birth date helps us read your solar pattern.
          </Text>
        </View>
        <SoftMascot mood="curious" size="small" />
        <View style={styles.heroGlow} />
      </Animated.View>

      <View style={styles.pickers}>
        <Animated.View entering={FadeInUp.delay(100).duration(500)} style={styles.pickerCol}>
          <Text style={styles.pickerLabel}>Day</Text>
          <ScrollView style={styles.picker} showsVerticalScrollIndicator={false}>
            {days.map((d) => (
              <TouchableOpacity
                key={d}
                onPress={() => setDay(d)}
                style={[styles.pickerItem, day === d && styles.pickerItemActive]}
              >
                <Text style={[styles.pickerItemText, day === d && styles.pickerItemTextActive]}>
                  {d}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
        <Animated.View entering={FadeInUp.delay(200).duration(500)} style={styles.pickerCol}>
          <Text style={styles.pickerLabel}>Month</Text>
          <ScrollView style={styles.picker} showsVerticalScrollIndicator={false}>
            {months.map((m) => (
              <TouchableOpacity
                key={m.value}
                onPress={() => setMonth(m.value)}
                style={[styles.pickerItem, month === m.value && styles.pickerItemActive]}
              >
                <Text style={[styles.pickerItemText, month === m.value && styles.pickerItemTextActive]}>
                  {m.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
        <Animated.View entering={FadeInUp.delay(300).duration(500)} style={styles.pickerCol}>
          <Text style={styles.pickerLabel}>Year</Text>
          <ScrollView style={styles.picker} showsVerticalScrollIndicator={false}>
            {years.map((y) => (
              <TouchableOpacity
                key={y}
                onPress={() => setYear(y)}
                style={[styles.pickerItem, year === y && styles.pickerItemActive]}
              >
                <Text style={[styles.pickerItemText, year === y && styles.pickerItemTextActive]}>
                  {y}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      </View>

      <Animated.View
        key={selectedDate}
        entering={ZoomIn.duration(300)}
        style={styles.selectedDateCard}
      >
        <Text style={styles.selectedDateLabel}>Selected date</Text>
        <Text style={styles.selectedDateValue}>{selectedDate}</Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(400).duration(500)}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => {
            update({
              birthDate: `${year}-${pad(month)}-${pad(day)}`,
            });
            router.push('/(onboarding)/birth-time');
          }}
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
      <ProgressDots total={7} current={1} />
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
  heroCard: {
    borderRadius: 32,
    padding: 20,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    backgroundColor: '#FFFDF7',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    minHeight: 140,
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
    ...theme.shadows.warmSoft,
  },
  heroText: { flex: 1 },
  heroLabel: {
    fontSize: 11,
    letterSpacing: 1.4,
    color: '#8B72CF',
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 8,
  },
  heroTitle: {
    fontFamily: theme.fonts.serif,
    fontSize: 22,
    fontWeight: '500',
    color: theme.colors.ink,
    letterSpacing: -0.8,
    lineHeight: 26,
    marginBottom: 4,
  },
  heroDesc: {
    fontSize: 12,
    color: theme.colors.softMuted,
    lineHeight: 17,
  },
  heroGlow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(247,216,117,0.4)',
    right: -20,
    bottom: -30,
    opacity: 0.3,
  },
  pickers: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    height: 200,
  },
  pickerCol: {
    flex: 1,
  },
  pickerLabel: {
    fontSize: 10,
    color: theme.colors.muted,
    marginBottom: 8,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  picker: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
  },
  pickerItem: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  pickerItemActive: {
    backgroundColor: 'rgba(139,114,207,0.1)',
  },
  pickerItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.ink,
  },
  pickerItemTextActive: {
    color: '#8B72CF',
    fontWeight: '700',
  },
  selectedDateCard: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: 'rgba(232,221,251,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(139,114,207,0.2)',
  },
  selectedDateLabel: {
    fontSize: 11,
    color: theme.colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  selectedDateValue: {
    fontFamily: theme.fonts.serif,
    fontSize: 24,
    fontWeight: '500',
    color: theme.colors.ink,
  },
  button: {
    width: '100%',
    minHeight: 54,
    borderRadius: 27,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.primaryGlow,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
