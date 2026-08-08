import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  FadeIn,
  FadeInUp,
  ZoomIn,
  withRepeat,
  withTiming,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  Easing,
} from 'react-native-reanimated';
import ProgressDots from '@/src/components/ProgressDots';
import { theme } from '@/src/lib/theme';
import { useOnboarding } from '@/src/context/OnboardingContext';
import { useAuth } from '@/src/context/AuthContext';
import { getContentStatus, prewarmContent, submitProfile, type ContentJobStatus } from '@/src/services/backend';
import { ApiError } from '@/src/lib/api';

type StageState = 'waiting' | 'active' | 'ready' | 'failed';

const FIRST_MIRROR_SLOW_MS = 20000;
const FIRST_MIRROR_TIMEOUT_MS = 130000;
const POLL_INTERVAL_MS = 1500;
const MIN_VISIBLE_MS = 2600;

const visualStages = [
  {
    id: 'details',
    title: 'Listening to your details',
    body: 'Your birth time, place, and focus are settling into the map.',
  },
  {
    id: 'pattern',
    title: 'Mapping your inner weather',
    body: 'We are looking for the emotional thread beneath the facts.',
  },
  {
    id: 'mirror',
    title: 'Writing your first mirror',
    body: 'Your profile is becoming language that feels personal, not generic.',
  },
  {
    id: 'deeper',
    title: 'Preparing what comes next',
    body: 'Your daily signal and deeper readings will be ready after this first reveal.',
  },
] as const;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function stageDotColor(state: StageState) {
  if (state === 'ready') return '#16A7A0';
  if (state === 'failed') return '#B84A62';
  if (state === 'active') return '#8B72CF';
  return 'rgba(31,33,48,0.15)';
}

function visualStageIndex(input: { firstMirrorReady: boolean; elapsedMs: number }) {
  if (input.firstMirrorReady) return visualStages.length - 1;
  if (input.elapsedMs > 16000) return 2;
  if (input.elapsedMs > 6500) return 1;
  return 0;
}

export default function GeneratingScreen() {
  const router = useRouter();
  const { data } = useOnboarding();
  const { hydrated, user, refreshMe } = useAuth();
  const userId = user?.id;
  const dataRef = useRef(data);
  const refreshMeRef = useRef(refreshMe);
  const startedRef = useRef(false);
  const [jobs, setJobs] = useState<ContentJobStatus[]>([]);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [firstMirrorReady, setFirstMirrorReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pulse = useSharedValue(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    dataRef.current = data;
    refreshMeRef.current = refreshMe;
  }, [data, refreshMe]);

  useEffect(() => {
    let cancelled = false;
    const mountedAt = Date.now();
    const elapsedTimer = setInterval(() => {
      if (!cancelled) setElapsedMs(Date.now() - mountedAt);
    }, 500);

    const runGeneration = async () => {
      const startedAt = Date.now();
      try {
        if (!hydrated) return;
        if (startedRef.current) return;
        if (!userId) {
          router.replace('/(auth)');
          return;
        }
        startedRef.current = true;
        setError(null);
        setFirstMirrorReady(false);
        setJobs([]);

        await submitProfile(dataRef.current);
        if (cancelled) return;
        await refreshMeRef.current();

        if (cancelled) return;
        const initialStatus = await prewarmContent('first_mirror');
        if (cancelled) return;
        setJobs(initialStatus.jobs);

        const deadline = Date.now() + FIRST_MIRROR_TIMEOUT_MS;
        let latest = initialStatus;

        while (!cancelled) {
          const firstMirror = latest.jobs.find((job) => job.feature === 'first_mirror');
          if (firstMirror?.status === 'ready') {
            setFirstMirrorReady(true);
            progress.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) });
            const remaining = MIN_VISIBLE_MS - (Date.now() - startedAt);
            if (remaining > 0) await sleep(remaining);
            if (!cancelled) {
              prewarmContent('profile').catch(() => {});
              router.replace('/(onboarding)/first-mirror');
            }
            return;
          }
          if (firstMirror?.status === 'failed') {
            throw new Error(firstMirror.errorMessage ?? 'First Mirror generation failed.');
          }
          if (Date.now() > deadline) {
            throw new Error('Your First Mirror is taking longer than expected. Please try again.');
          }

          await sleep(POLL_INTERVAL_MS);
          latest = await getContentStatus('first_mirror');
          if (!cancelled) setJobs(latest.jobs);
        }
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) return;
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Unable to prepare your Astrovy.');
      }
    };

    runGeneration();

    progress.value = withTiming(0.92, { duration: 42000, easing: Easing.out(Easing.cubic) });
    pulse.value = withRepeat(
      withTiming(1, { duration: 1700, easing: Easing.inOut(Easing.cubic) }),
      -1,
      true
    );
    return () => {
      cancelled = true;
      clearInterval(elapsedTimer);
    };
  }, [hydrated, progress, pulse, router, userId]);

  const firstMirrorJob = jobs.find((job) => job.feature === 'first_mirror');
  const currentStage = visualStageIndex({ firstMirrorReady: firstMirrorReady || firstMirrorJob?.status === 'ready', elapsedMs });
  const stages = visualStages.map((stage, index) => ({
    ...stage,
    state: firstMirrorJob?.status === 'failed'
      ? index < currentStage ? 'ready' as const : index === currentStage ? 'failed' as const : 'waiting' as const
      : index < currentStage
        ? 'ready' as const
        : index === currentStage
          ? 'active' as const
          : 'waiting' as const,
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0, 1], [0.72, 1]),
    transform: [{ scale: interpolate(pulse.value, [0, 1], [0.94, 1.08]) }],
  }));
  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0, 1], [0.18, 0.38]),
    transform: [{ scale: interpolate(pulse.value, [0, 1], [0.84, 1.22]) }],
  }));
  const progressStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: progress.value }],
  }));
  const loadingTitle = firstMirrorReady
    ? 'Your first mirror is ready.'
    : elapsedMs > FIRST_MIRROR_SLOW_MS
      ? 'Still shaping the words carefully.'
      : 'We are turning your pattern into language.';

  return (
    <View style={styles.container}>
        <Animated.View entering={FadeIn.duration(400)} style={styles.loadingContainer}>
          <View style={styles.center}>
            <Animated.View entering={ZoomIn.duration(300)} style={styles.iconBg}>
              <Animated.View style={[styles.iconGlow, glowStyle]} />
              <Animated.Text style={[styles.icon, pulseStyle]}>✦</Animated.Text>
            </Animated.View>
            <Text style={styles.loadingLabel}>Preparing your first Astrovy</Text>
            <Text style={styles.loadingTitle}>
              {loadingTitle}
            </Text>
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressFill, progressStyle]} />
            </View>
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
                >
                  {stage.state === 'active' && <Animated.View style={[styles.stagePulse, pulseStyle]} />}
                </View>
                <View style={styles.stageCopy}>
                  <Text
                    style={[
                      styles.stageTitle,
                      {
                        color:
                          stage.state !== 'waiting' ? theme.colors.ink : theme.colors.muted,
                      },
                    ]}
                  >
                    {stage.title}
                  </Text>
                  <Text style={styles.stageBody}>{stage.body}</Text>
                </View>
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
    overflow: 'hidden',
  },
  iconGlow: {
    position: 'absolute',
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(255,255,255,0.72)',
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
    maxWidth: 320,
  },
  progressTrack: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    marginTop: 22,
    overflow: 'hidden',
    backgroundColor: 'rgba(139,114,207,0.12)',
  },
  progressFill: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#8B72CF',
    transformOrigin: 'left',
  },
  stages: {
    gap: 10,
    flex: 1,
  },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
  },
  stageDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  stagePulse: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(139,114,207,0.24)',
  },
  stageCopy: {
    flex: 1,
  },
  stageTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 4,
  },
  stageBody: {
    fontSize: 11,
    color: theme.colors.muted,
    lineHeight: 17,
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
