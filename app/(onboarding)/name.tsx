import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import ProgressDots from '@/src/components/ProgressDots';
import { theme } from '@/src/lib/theme';
import { useOnboarding } from '@/src/context/OnboardingContext';

export default function NameScreen() {
  const router = useRouter();
  const { data, update } = useOnboarding();
  const [name, setName] = useState(data.name);
  const canContinue = name.trim().length > 0;

  const onContinue = () => {
    if (!canContinue) return;
    update({ name: name.trim() });
    router.push('/(onboarding)/birth-date');
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInUp.duration(500)} style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.stepText}>1 of 7</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(100).duration(500)}>
          <Text style={styles.label}>First things first</Text>
          <Text style={styles.title}>What should the stars call you?</Text>
          <Text style={styles.description}>
            Your name shapes how your readings speak to you.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).duration(500)} style={styles.inputCard}>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor={theme.colors.muted + '80'}
            style={styles.input}
            autoFocus
            autoCapitalize="words"
            maxLength={30}
            returnKeyType="done"
            onSubmitEditing={onContinue}
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(300).duration(500)}>
          <TouchableOpacity activeOpacity={0.85} disabled={!canContinue} onPress={onContinue}>
            <LinearGradient
              colors={canContinue ? theme.gradients.primary : ['#C4B8E0', '#A0D4D0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.button, !canContinue && styles.buttonDisabled]}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
        <ProgressDots total={7} current={0} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
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
  inputCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    backgroundColor: 'rgba(255,255,255,0.78)',
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 24,
    ...theme.shadows.warmSm,
  },
  input: {
    fontSize: 18,
    fontFamily: theme.fonts.serif,
    color: theme.colors.ink,
    paddingVertical: 14,
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
  buttonDisabled: { opacity: 0.5 },
  buttonText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
});
