import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeInUp,
} from 'react-native-reanimated';
import { IllustrationLogo } from '@/src/components/Illustrations';
import { theme } from '@/src/lib/theme';
import { useOnboarding } from '@/src/context/OnboardingContext';

export default function WelcomeScreen() {
  const router = useRouter();
  const { clear, hydrated } = useOnboarding();
  useEffect(() => {
    if (hydrated) clear(); // restart resets answers; gated to avoid hydration race
  }, [hydrated]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.inner}>
        <Animated.View entering={FadeInUp.duration(600)}>
          <IllustrationLogo />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(100).duration(500)} style={styles.textCenter}>
          <Text style={styles.subtitle}>Welcome to your inner map</Text>
          <Text style={styles.title}>Astrovy</Text>
          <Text style={styles.description}>
            A gentle space to understand your patterns, your emotional rhythm, and the parts of yourself that are still learning how to be heard.
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(300).duration(500)}
          style={styles.card}
        >
          <Text style={styles.cardTitle}>Before we begin</Text>
          <Text style={styles.cardText}>
            We will ask a few simple questions to shape your first reading. Nothing here is about judging you. It is about helping the app speak to you more personally.
          </Text>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInUp.delay(500).duration(500)}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push('/(onboarding)/name')}
        >
          <LinearGradient
            colors={theme.gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Begin gently</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 24,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
  },
  textCenter: {
    alignItems: 'center',
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 11,
    letterSpacing: 1.4,
    color: '#8B72CF',
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 12,
  },
  title: {
    fontFamily: theme.fonts.serif,
    fontSize: 42,
    fontWeight: '500',
    color: theme.colors.ink,
    letterSpacing: -1.5,
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: theme.colors.muted,
    lineHeight: 23,
    textAlign: 'center',
    maxWidth: 280,
  },
  card: {
    borderRadius: theme.radius.lg,
    padding: 20,
    marginBottom: 32,
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    ...theme.shadows.warmSoft,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.ink,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 12,
    color: theme.colors.softMuted,
    lineHeight: 17,
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
