import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Redirect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useAuth } from '@/src/context/AuthContext';
import { ApiError } from '@/src/lib/api';
import { theme } from '@/src/lib/theme';

export default function AuthScreen() {
  const { user, hydrated, profileComplete, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (hydrated && user) {
    return <Redirect href={profileComplete ? '/(tabs)/today' : '/(onboarding)/welcome'} />;
  }

  const canSubmit =
    email.trim().length > 3 &&
    password.length >= 8;

  const submit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      if (mode === 'login') {
        await signIn(email.trim(), password);
      } else {
        await signUp(email.trim(), password);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to continue. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Animated.View entering={FadeInUp.duration(500)} style={styles.header}>
          <Text style={styles.label}>Astrovy Account</Text>
          <Text style={styles.title}>{mode === 'login' ? 'Welcome back' : 'Create your space'}</Text>
          <Text style={styles.description}>
            Your readings, chart, journals, tarot draws, and mirror history sync through the Soulprint backend.
          </Text>
        </Animated.View>

        <View style={styles.card}>
          <View style={styles.switcher}>
            {(['register', 'login'] as const).map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => {
                  setMode(item);
                  setError(null);
                }}
                style={[styles.switchButton, mode === item && styles.switchButtonActive]}
              >
                <Text style={[styles.switchText, mode === item && styles.switchTextActive]}>
                  {item === 'register' ? 'Register' : 'Log in'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={theme.colors.muted + '80'}
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={theme.colors.muted + '80'}
            style={styles.input}
            secureTextEntry
          />
          {mode === 'register' && (
            <Text style={styles.formHint}>You’ll add your name and birth details in onboarding.</Text>
          )}
          {error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity activeOpacity={0.85} disabled={!canSubmit || submitting} onPress={submit}>
            <LinearGradient
              colors={canSubmit && !submitting ? theme.gradients.primary : ['#C4B8E0', '#A0D4D0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.button, (!canSubmit || submitting) && styles.buttonDisabled]}
            >
              <Text style={styles.buttonText}>{submitting ? 'Connecting...' : mode === 'login' ? 'Log in' : 'Create account'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 24,
    justifyContent: 'center',
  },
  header: { alignItems: 'center', marginBottom: 20 },
  label: {
    fontSize: 11,
    letterSpacing: 1.4,
    color: '#8B72CF',
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 10,
  },
  title: {
    fontFamily: theme.fonts.serif,
    fontSize: 32,
    fontWeight: '500',
    color: theme.colors.ink,
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    color: theme.colors.muted,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 310,
  },
  card: {
    borderRadius: 24,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    ...theme.shadows.warmSoft,
  },
  switcher: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 18,
    backgroundColor: 'rgba(31,33,48,0.06)',
    marginBottom: 14,
  },
  switchButton: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
  },
  switchButtonActive: { backgroundColor: '#FFFFFF' },
  switchText: { fontSize: 12, fontWeight: '700', color: theme.colors.muted },
  switchTextActive: { color: theme.colors.ink },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14,
    color: theme.colors.ink,
    marginBottom: 10,
  },
  formHint: { fontSize: 12, color: theme.colors.muted, lineHeight: 18, marginBottom: 10 },
  error: { fontSize: 12, color: '#B84A62', lineHeight: 18, marginBottom: 10 },
  button: {
    width: '100%',
    minHeight: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.primaryGlow,
  },
  buttonDisabled: { opacity: 0.55 },
  buttonText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
});
