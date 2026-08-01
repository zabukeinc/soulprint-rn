import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeInUp,
  ZoomIn,
  withRepeat,
  withTiming,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import ProgressDots from '@/src/components/ProgressDots';
import { theme } from '@/src/lib/theme';
import { useOnboarding } from '@/src/context/OnboardingContext';
import { useAuth } from '@/src/context/AuthContext';
import { submitProfile } from '@/src/services/backend';
import { ApiError } from '@/src/lib/api';

export default function GeneratingScreen() {
  const router = useRouter();
  const { data } = useOnboarding();
  const { hydrated, user, refreshMe, signOut } = useAuth();
  const stages = [
    { id: 1, text: `Reading your birth date${data.birthDate ? ` (${data.birthDate})` : ''}...`, delay: 600 },
    { id: 2, text: `Placing ${data.birthPlace?.name ?? 'your birthplace'} into the chart...`, delay: 1400 },
    { id: 3, text: 'Listening to your current focus...', delay: 2200 },
    { id: 4, text: 'Preparing your first emotional mirror...', delay: 3000 },
  ];
  const [currentStage, setCurrentStage] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rotate = useSharedValue(0);

  useEffect(() => {
    stages.forEach((stage) => {
      setTimeout(() => {
        setCurrentStage(stage.id);
      }, stage.delay);
    });

    const t = setTimeout(async () => {
      try {
        if (!hydrated) return;
        if (!user) {
          router.replace('/(auth)');
          return;
        }
        await submitProfile(data);
        await refreshMe();
        setIsComplete(true);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          await signOut();
          router.replace('/(auth)');
          return;
        }
        setError(err instanceof Error ? err.message : 'Unable to prepare your Astrovy.');
      }
    }, 4000);

    rotate.value = withRepeat(
      withTiming(360, { duration: 3000 }),
      -1,
      false
    );
    return () => clearTimeout(t);
  }, [data, hydrated, refreshMe, rotate, router, signOut, user]);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  return (
    <View style={styles.container}>
      {!isComplete ? (
        <Animated.View entering={FadeIn.duration(400)} style={styles.loadingContainer}>
          <View style={styles.center}>
            <Animated.View entering={ZoomIn.duration(300)} style={styles.iconBg}>
              <Animated.Text style={[styles.icon, spinStyle]}>✦</Animated.Text>
            </Animated.View>
            <Text style={styles.loadingLabel}>Preparing your first Astrovy</Text>
            <Text style={styles.loadingTitle}>
              We're turning your pattern into language.
            </Text>
          </View>

          <View style={styles.stages}>
            {stages.map((stage) => (
              <Animated.View
                key={stage.id}
                entering={FadeInUp.delay(stage.delay / 2).duration(500)}
                style={[
                  styles.stageRow,
                  {
                    opacity: currentStage >= stage.id ? 1 : 0.4,
                    backgroundColor:
                      currentStage >= stage.id
                        ? 'rgba(255,255,255,0.95)'
                        : 'rgba(255,255,255,0.5)',
                    borderColor:
                      currentStage >= stage.id
                        ? 'rgba(139,114,207,0.25)'
                        : 'rgba(31,33,48,0.06)',
                  },
                ]}
              >
                <View
                  style={[
                    styles.stageDot,
                    {
                      backgroundColor:
                        currentStage >= stage.id ? '#16A7A0' : 'rgba(31,33,48,0.15)',
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.stageText,
                    {
                      color:
                        currentStage >= stage.id ? theme.colors.ink : theme.colors.muted,
                    },
                  ]}
                >
                  {stage.text}
                </Text>
              </Animated.View>
            ))}
          </View>

          {error && (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => {
                  setError(null);
                  router.back();
                }}
              >
                <Text style={styles.errorAction}>Review answers</Text>
              </TouchableOpacity>
            </View>
          )}

          <ProgressDots total={7} current={6} />
        </Animated.View>
      ) : (
        <Animated.View
          entering={ZoomIn.duration(300)}
          style={styles.completeContainer}
        >
          <Animated.View entering={ZoomIn.delay(100).duration(300)} style={styles.iconBg}>
            <Text style={styles.icon}>✦</Text>
          </Animated.View>
          <Text style={styles.completeLabel}>Your Astrovy is ready</Text>
          <Text style={styles.completeTitle}>Your first reflection is ready.</Text>
          <Text style={styles.completeDesc}>
            Take a moment to see what your pattern reveals about you today.
          </Text>

          <Animated.View entering={FadeInUp.delay(200).duration(500)}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push('/(onboarding)/first-mirror')}
            >
              <LinearGradient
                colors={theme.gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>See your Astrovy</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 16,
  },
  loadingContainer: {
    flex: 1,
  },
  center: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    backgroundColor: '#8B72CF',
    shadowColor: 'rgba(139,114,207,0.3)',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 32,
    shadowOpacity: 1,
    elevation: 8,
  },
  icon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  loadingLabel: {
    fontSize: 10,
    letterSpacing: 1.4,
    color: '#8B72CF',
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 8,
  },
  loadingTitle: {
    fontFamily: theme.fonts.serif,
    fontSize: 22,
    fontWeight: '500',
    color: theme.colors.ink,
    letterSpacing: -0.6,
    lineHeight: 26,
    textAlign: 'center',
  },
  stages: {
    gap: 8,
    flex: 1,
  },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  stageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stageText: {
    fontSize: 12,
  },
  errorCard: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(184,74,98,0.25)',
  },
  errorText: {
    fontSize: 12,
    color: '#B84A62',
    lineHeight: 18,
    marginBottom: 8,
  },
  errorAction: {
    fontSize: 12,
    fontWeight: '800',
    color: '#8B72CF',
  },
  completeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeLabel: {
    fontSize: 10,
    letterSpacing: 1.4,
    color: '#8B72CF',
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 8,
    marginTop: 16,
  },
  completeTitle: {
    fontFamily: theme.fonts.serif,
    fontSize: 22,
    fontWeight: '500',
    color: theme.colors.ink,
    letterSpacing: -0.6,
    lineHeight: 26,
    marginBottom: 8,
    textAlign: 'center',
  },
  completeDesc: {
    fontSize: 12,
    color: theme.colors.muted,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 240,
    marginBottom: 24,
  },
  button: {
    width: '100%',
    minHeight: 48,
    borderRadius: 24,
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
