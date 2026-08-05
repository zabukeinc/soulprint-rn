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
import { getContentStatus, prewarmContent, submitProfile, type ContentJobStatus } from '@/src/services/backend';
import { ApiError } from '@/src/lib/api';

type StageState = 'waiting' | 'active' | 'ready' | 'failed';

const FIRST_MIRROR_TIMEOUT_MS = 45000;
const POLL_INTERVAL_MS = 1500;
const MIN_VISIBLE_MS = 2600;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function jobState(job?: ContentJobStatus | null): StageState {
  if (!job || job.status === 'not_started') return 'waiting';
  if (job.status === 'ready') return 'ready';
  if (job.status === 'failed') return 'failed';
  return 'active';
}

function stageDotColor(state: StageState) {
  if (state === 'ready') return '#16A7A0';
  if (state === 'failed') return '#B84A62';
  if (state === 'active') return '#8B72CF';
  return 'rgba(31,33,48,0.15)';
}

export default function GeneratingScreen() {
  const router = useRouter();
  const { data } = useOnboarding();
  const { hydrated, user, refreshMe } = useAuth();
  const [profileReady, setProfileReady] = useState(false);
  const [jobs, setJobs] = useState<ContentJobStatus[]>([]);
  const [activeStep, setActiveStep] = useState<'profile' | 'prewarm' | 'first_mirror' | 'background'>('profile');
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rotate = useSharedValue(0);

  useEffect(() => {
    let cancelled = false;

    const runGeneration = async () => {
      const startedAt = Date.now();
      try {
        if (!hydrated) return;
        if (!user) {
          router.replace('/(auth)');
          return;
        }
        setError(null);
        setActiveStep('profile');
        setIsComplete(false);
        setProfileReady(false);
        setJobs([]);

        await submitProfile(data);
        if (cancelled) return;
        setProfileReady(true);
        await refreshMe();

        if (cancelled) return;
        setActiveStep('prewarm');
        const initialStatus = await prewarmContent('onboarding');
        if (cancelled) return;
        setJobs(initialStatus.jobs);
        setActiveStep('first_mirror');

        const deadline = Date.now() + FIRST_MIRROR_TIMEOUT_MS;
        let latest = initialStatus;

        while (!cancelled) {
          const firstMirror = latest.jobs.find((job) => job.feature === 'first_mirror');
          if (firstMirror?.status === 'ready') {
            setActiveStep('background');
            const remaining = MIN_VISIBLE_MS - (Date.now() - startedAt);
            if (remaining > 0) await sleep(remaining);
            if (!cancelled) setIsComplete(true);
            return;
          }
          if (firstMirror?.status === 'failed') {
            throw new Error(firstMirror.errorMessage ?? 'First Mirror generation failed.');
          }
          if (Date.now() > deadline) {
            throw new Error('Your First Mirror is taking longer than expected. Please try again.');
          }

          await sleep(POLL_INTERVAL_MS);
          latest = await getContentStatus('onboarding');
          if (!cancelled) setJobs(latest.jobs);
        }
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) return;
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Unable to prepare your Astrovy.');
      }
    };

    runGeneration();

    rotate.value = withRepeat(
      withTiming(360, { duration: 3000 }),
      -1,
      false
    );
    return () => {
      cancelled = true;
    };
  }, [data, hydrated, refreshMe, rotate, router, user]);

  const firstMirrorJob = jobs.find((job) => job.feature === 'first_mirror');
  const backgroundJobs = jobs.filter((job) => job.feature !== 'first_mirror');
  const readyBackgroundJobs = backgroundJobs.filter((job) => job.status === 'ready').length;
  const stages = [
    {
      id: 'profile',
      text: profileReady
        ? `Birth profile saved for ${data.birthPlace?.name ?? 'your birthplace'}.`
        : `Saving your birth date${data.birthDate ? ` (${data.birthDate})` : ''} and birthplace...`,
      state: profileReady ? 'ready' : activeStep === 'profile' ? 'active' : 'waiting',
    },
    {
      id: 'prewarm',
      text: jobs.length > 0 ? 'Backend generation jobs started.' : 'Starting the backend generation pipeline...',
      state: jobs.length > 0 ? 'ready' : activeStep === 'prewarm' ? 'active' : 'waiting',
    },
    {
      id: 'first_mirror',
      text: firstMirrorJob?.status === 'ready'
        ? 'First Mirror generated and cached.'
        : firstMirrorJob?.status === 'failed'
          ? 'First Mirror needs retry.'
          : 'Generating your First Mirror...',
      state: jobState(firstMirrorJob) === 'waiting' && activeStep === 'first_mirror' ? 'active' : jobState(firstMirrorJob),
    },
    {
      id: 'background',
      text: backgroundJobs.length
        ? `Warming deeper readings in the background (${readyBackgroundJobs}/${backgroundJobs.length}).`
        : 'Preparing deeper readings in the background...',
      state: activeStep === 'background'
        ? 'active'
        : backgroundJobs.length > 0 && readyBackgroundJobs === backgroundJobs.length
          ? 'ready'
          : backgroundJobs.length > 0
            ? 'active'
            : 'waiting',
    },
  ] satisfies Array<{ id: string; text: string; state: StageState }>;

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
                entering={FadeInUp.duration(500)}
                style={[
                  styles.stageRow,
                  {
                    opacity: stage.state !== 'waiting' ? 1 : 0.4,
                    backgroundColor:
                      stage.state !== 'waiting'
                        ? 'rgba(255,255,255,0.95)'
                        : 'rgba(255,255,255,0.5)',
                    borderColor:
                      stage.state !== 'waiting'
                        ? 'rgba(139,114,207,0.25)'
                        : 'rgba(31,33,48,0.06)',
                  },
                ]}
              >
                <View
                  style={[
                    styles.stageDot,
                    { backgroundColor: stageDotColor(stage.state) },
                  ]}
                />
                <Text
                  style={[
                    styles.stageText,
                    {
                      color:
                        stage.state !== 'waiting' ? theme.colors.ink : theme.colors.muted,
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
