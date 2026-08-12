import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeInUp,
  ZoomIn,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { theme } from '@/src/lib/theme';
import { ApiError } from '@/src/lib/api';
import { useTier } from '@/src/context/TierContext';
import { createCompatibilityReading, type CompatibilityReading } from '@/src/services/backend';
import { searchCities, type City } from '@/src/services/cities';

const zodiacSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const monthOptions = [
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
const yearOptions = Array.from({ length: 101 }, (_, index) => currentYear - index);
const hourOptions = Array.from({ length: 24 }, (_, index) => index);
const minuteOptions = Array.from({ length: 12 }, (_, index) => index * 5);
const quickGenerationSteps = [
  {
    title: 'Reading your signs together',
    body: 'Looking at the first layer of attraction, friction, and ease.',
  },
  {
    title: 'Finding the emotional rhythm',
    body: 'Shaping a quick mirror of where the connection may flow.',
  },
  {
    title: 'Writing your quick match',
    body: 'Keeping it simple, warm, and useful.',
  },
];
const fullGenerationSteps = [
  {
    title: 'Mapping both birth signatures',
    body: 'Looking at date, place, and chart patterns side by side.',
  },
  {
    title: 'Reading emotional rhythm',
    body: 'Finding where safety, attraction, and timing meet.',
  },
  {
    title: 'Checking communication patterns',
    body: 'Noticing where the connection needs care, space, or clarity.',
  },
  {
    title: 'Writing your compatibility mirror',
    body: 'Turning the backend reading into something warm and grounded.',
  },
];
const QUICK_MIN_VISIBLE_MS = 4200;
const FULL_MIN_VISIBLE_MS = 7200;
const QUICK_SLOW_MS = 6500;
const FULL_SLOW_MS = 11000;
const PARTNER_NAME_MAX = 80;
const PLACE_QUERY_MAX = 80;
const resultSectionMeta: Record<string, { emoji: string; fallbackTitle: string }> = {
  attraction: { emoji: '🧲', fallbackTitle: 'What Draws You Together' },
  friction: { emoji: '⚡', fallbackTitle: 'Where Friction Lives' },
  growth: { emoji: '🌱', fallbackTitle: 'Growth Together' },
  repair: { emoji: '🫶', fallbackTitle: 'How Repair Works Here' },
  timing: { emoji: '⏳', fallbackTitle: 'Timing and Pacing' },
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function LoadingStepItem({ title, active }: { title: string; active: boolean }) {
  const activeValue = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    activeValue.value = withTiming(active ? 1 : 0, { duration: 260 });
  }, [active, activeValue]);

  const dotStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      activeValue.value,
      [0, 1],
      ['rgba(31,33,48,0.16)', '#16A7A0']
    ),
    opacity: 0.45 + activeValue.value * 0.55,
    transform: [{ scale: 1 + activeValue.value * 0.18 }],
  }));
  const textStyle = useAnimatedStyle(() => ({
    opacity: 0.58 + activeValue.value * 0.42,
  }));

  return (
    <View style={styles.loadingStepRow}>
      <Animated.View style={[styles.loadingStepDot, dotStyle]} />
      <Animated.Text style={[styles.loadingStepText, active && styles.loadingStepTextActive, textStyle]}>
        {title}
      </Animated.Text>
    </View>
  );
}

function pad(value: number) {
  return String(value).padStart(2, '0');
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function parseBirthDate(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return { year: 2000, month: 1, day: 1 };
  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
}

function parseBirthTime(value: string) {
  const match = value.match(/^(\d{2}):(\d{2})$/);
  if (!match) return { hour: 12, minute: 0 };
  return {
    hour: Number(match[1]),
    minute: Number(match[2]),
  };
}

function formatDateLabel(value: string) {
  if (!value) return 'Select birth date';
  const date = parseBirthDate(value);
  const month = monthOptions.find((option) => option.value === date.month)?.label ?? pad(date.month);
  return `${month} ${date.day}, ${date.year}`;
}

export default function CompatibilityScreen() {
  const router = useRouter();
  const { isPremium } = useTier();
  const [step, setStep] = useState<'input' | 'loading' | 'result'>('input');
  const [matchMode, setMatchMode] = useState<'full' | 'quick'>('quick');
  const [name, setName] = useState('');
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [knowsBirthTime, setKnowsBirthTime] = useState(false);
  const [dateSelectorVisible, setDateSelectorVisible] = useState(false);
  const [timeSelectorVisible, setTimeSelectorVisible] = useState(false);
  const [dateDraft, setDateDraft] = useState({ year: 2000, month: 1, day: 1 });
  const [timeDraft, setTimeDraft] = useState({ hour: 12, minute: 0 });
  const [placeQuery, setPlaceQuery] = useState('');
  const [placeResults, setPlaceResults] = useState<City[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<City | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [reading, setReading] = useState<CompatibilityReading | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [loadingElapsedMs, setLoadingElapsedMs] = useState(0);

  const progress = useSharedValue(0);
  const loadingProgressValue = useSharedValue(0);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withRepeat(withTiming(1.1, { duration: 1000 }), -1, true) }],
  }));
  const loadingProgressStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: loadingProgressValue.value }],
  }));

  useEffect(() => {
    if (isPremium) setMatchMode('full');
  }, [isPremium]);

  useEffect(() => {
    let active = true;
    if (matchMode !== 'full' || selectedPlace || placeQuery.trim().length < 2) {
      setPlaceResults([]);
      return;
    }

    const timeout = setTimeout(() => {
      searchCities(placeQuery)
        .then((results) => {
          if (active) setPlaceResults(results);
        })
        .catch(() => {
          if (active) setPlaceResults([]);
        });
    }, 250);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [matchMode, placeQuery, selectedPlace]);

  useEffect(() => {
    if (step !== 'loading') return;
    const steps = matchMode === 'full' ? fullGenerationSteps : quickGenerationSteps;
    const interval = setInterval(() => {
      setLoadingStepIndex((index) => Math.min(index + 1, steps.length - 1));
    }, matchMode === 'full' ? 1900 : 1500);

    return () => clearInterval(interval);
  }, [matchMode, step]);

  useEffect(() => {
    if (step !== 'loading') {
      setLoadingElapsedMs(0);
      return;
    }

    const startedAt = Date.now();
    const timer = setInterval(() => {
      setLoadingElapsedMs(Date.now() - startedAt);
    }, 500);

    return () => clearInterval(timer);
  }, [step]);

  useEffect(() => {
    if (step !== 'loading') {
      loadingProgressValue.value = 0;
      return;
    }
    loadingProgressValue.value = withTiming(0.92, {
      duration: matchMode === 'full' ? 18000 : 10000,
      easing: Easing.out(Easing.cubic),
    });
  }, [loadingProgressValue, matchMode, step]);

  const fullLocked = matchMode === 'full' && !isPremium;
  const canReveal = !fullLocked && name.trim().length > 0 && (
    matchMode === 'quick'
      ? Boolean(selectedSign)
      : /^\d{4}-\d{2}-\d{2}$/.test(birthDate.trim()) && Boolean(selectedPlace) && (!knowsBirthTime || /^\d{2}:\d{2}$/.test(birthTime.trim()))
  );

  const handleReveal = async () => {
    if (fullLocked) {
      router.push('/pricing');
      return;
    }
    if (canReveal) {
      setStep('loading');
      setLoadingStepIndex(0);
      setLoadingElapsedMs(0);
      setError(null);
      try {
        const request = matchMode === 'quick'
          ? createCompatibilityReading({
            partnerName: name.trim(),
            partnerSign: selectedSign?.toLowerCase(),
            fast: true,
          })
          : createCompatibilityReading({
            partnerName: name.trim(),
            partnerSign: selectedSign?.toLowerCase(),
            partnerBirthDate: birthDate.trim(),
            partnerBirthTime: knowsBirthTime ? birthTime.trim() : null,
            partnerBirthPlace: selectedPlace
              ? {
                city: selectedPlace.name,
                country: selectedPlace.country,
                timezone: selectedPlace.timezone,
                lat: selectedPlace.lat,
                lng: selectedPlace.lng,
              }
              : undefined,
            fast: true,
          });
        const [result] = await Promise.all([
          request,
          sleep(matchMode === 'full' ? FULL_MIN_VISIBLE_MS : QUICK_MIN_VISIBLE_MS),
        ]);
        loadingProgressValue.value = withTiming(1, { duration: 650, easing: Easing.out(Easing.cubic) });
        await sleep(500);
        setReading(result);
        setStep('result');
        setTimeout(() => {
          setShowResult(true);
          progress.value = withTiming(result.scores?.overall ?? 74, { duration: 1500 });
        }, 100);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Compatibility could not be created.');
        setStep('input');
      }
    }
  };

  const barStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));
  const dateDayOptions = Array.from({ length: daysInMonth(dateDraft.year, dateDraft.month) }, (_, index) => index + 1);
  const openDateSelector = () => {
    const parsed = parseBirthDate(birthDate);
    setDateDraft({
      year: parsed.year,
      month: parsed.month,
      day: Math.min(parsed.day, daysInMonth(parsed.year, parsed.month)),
    });
    setDateSelectorVisible(true);
  };
  const openTimeSelector = () => {
    setTimeDraft(parseBirthTime(birthTime));
    setTimeSelectorVisible(true);
  };
  const updateDateDraft = (next: Partial<typeof dateDraft>) => {
    setDateDraft((current) => {
      const updated = { ...current, ...next };
      return {
        ...updated,
        day: Math.min(updated.day, daysInMonth(updated.year, updated.month)),
      };
    });
  };
  const confirmDate = () => {
    setBirthDate(`${dateDraft.year}-${pad(dateDraft.month)}-${pad(dateDraft.day)}`);
    setDateSelectorVisible(false);
  };
  const confirmTime = () => {
    setBirthTime(`${pad(timeDraft.hour)}:${pad(timeDraft.minute)}`);
    setTimeSelectorVisible(false);
  };
  const resultSections = Array.isArray(reading?.sections) ? reading.sections : [];
  const premiumExtraSections = reading?.premiumDetails?.deepSections?.filter((section) => !['attraction', 'friction', 'growth'].includes(section.key)) ?? [];
  const scoreBreakdown = reading?.premiumDetails?.scoreBreakdown;
  const basis = reading?.basis ?? {};
  const fullResult = reading?.access?.level === 'full';
  const confidenceLabel = basis.confidence === 'high'
    ? 'High confidence'
    : basis.confidence === 'medium'
      ? 'Medium confidence'
      : 'Quick zodiac match';
  const loadingSteps = matchMode === 'full' ? fullGenerationSteps : quickGenerationSteps;
  const loadingStep = loadingSteps[Math.min(loadingStepIndex, loadingSteps.length - 1)];
  const loadingSlow = loadingElapsedMs > (matchMode === 'full' ? FULL_SLOW_MS : QUICK_SLOW_MS);
  const loadingTitle = loadingSlow
    ? 'Still shaping the reading carefully'
    : loadingStep.title;
  const loadingBody = loadingSlow
    ? 'Some readings take a little longer when the backend is writing with more context.'
    : loadingStep.body;

  if (step === 'loading') {
    return (
      <LinearGradient
        colors={['#FFF9F3', '#F5F7EE', '#ECE5F7']}
        style={styles.loadingContainer}
      >
        <Animated.View entering={FadeIn.duration(500)} style={styles.loadingCenter}>
          <Animated.View style={[styles.loadingIconBg, pulseStyle]}>
            <Text style={styles.loadingIcon}>✦</Text>
          </Animated.View>
          <Text style={styles.loadingLabel}>{matchMode === 'full' ? 'Full Birth Match' : 'Quick Match'}</Text>
          <Animated.View key={loadingTitle} entering={FadeInUp.duration(420)}>
            <Text style={styles.loadingTitle}>{loadingTitle}</Text>
            <Text style={styles.loadingSub}>{loadingBody}</Text>
          </Animated.View>
          <View style={styles.loadingProgressTrack}>
            <Animated.View style={[styles.loadingProgressFill, loadingProgressStyle]} />
          </View>
          <View style={styles.loadingSteps}>
            {loadingSteps.map((item, index) => (
              <LoadingStepItem key={item.title} title={item.title} active={index <= loadingStepIndex} />
            ))}
          </View>
        </Animated.View>
      </LinearGradient>
    );
  }

  if (step === 'result') {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerLabel}>Compatibility</Text>
          <View style={styles.backButtonPlaceholder} />
        </Animated.View>

        {showResult && (
          <Animated.View entering={FadeIn.duration(500)}>
            <Animated.View entering={FadeInUp.delay(100).duration(500)} style={styles.resultCenter}>
              <Text style={styles.resultLabel}>Compatibility Reading</Text>
              <Text style={styles.resultTitle}>Gy & {name}</Text>
              <Text style={styles.resultSub}>{reading?.userSign ?? 'Your sign'} · {reading?.partnerSign ?? selectedSign ?? 'Calculated sign'}</Text>
              <View style={styles.confidencePill}>
                <Text style={styles.confidenceText}>{confidenceLabel}</Text>
              </View>
            </Animated.View>

            <Animated.View
              entering={FadeInUp.delay(200).duration(500).easing(Easing.out(Easing.cubic))}
            >
              <LinearGradient
                colors={theme.gradients.compatibility}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.scoreCard}
              >
                <View style={styles.scoreGlow} />
                <Animated.View entering={ZoomIn.delay(400).duration(300)} style={styles.scoreContent}>
              <Text style={styles.scoreLabel}>Emotional Match</Text>
                  <Text style={styles.scoreValue}>{reading?.scores?.overall ?? 74}%</Text>
                  <Text style={styles.scoreSub}>{basis.matchType === 'full_birth_match' ? 'Birth chart compatibility' : 'Sun sign compatibility'}</Text>
                </Animated.View>
                <View style={styles.scoreBarBg}>
                  <Animated.View
                    style={[styles.scoreBarFill, barStyle]}
                  />
                </View>
              </LinearGradient>
            </Animated.View>

            {reading?.quickSummary && (
              <Animated.View entering={FadeInUp.delay(320).duration(500)} style={styles.quickSummaryCard}>
                <Text style={styles.quickSummaryLabel}>Free quick read</Text>
                <Text style={styles.quickSummaryTitle}>{reading.quickSummary.title}</Text>
                <Text style={styles.quickSummaryBody}>{reading.quickSummary.body}</Text>
                <Text style={styles.quickSummaryHint}>{reading.quickSummary.upgradeHint}</Text>
              </Animated.View>
            )}

            {scoreBreakdown && (
              <Animated.View entering={FadeInUp.delay(320).duration(500)} style={styles.scoreBreakdownCard}>
                <Text style={styles.scoreBreakdownLabel}>Premium depth</Text>
                <View style={styles.scoreBreakdownGrid}>
                  {Object.entries(scoreBreakdown).map(([key, value]) => (
                    <View key={key} style={styles.scoreBreakdownItem}>
                      <Text style={styles.scoreBreakdownValue}>{value}%</Text>
                      <Text style={styles.scoreBreakdownName}>{key}</Text>
                    </View>
                  ))}
                </View>
              </Animated.View>
            )}

            {resultSections.map((section, index) => {
              const meta = resultSectionMeta[section.key] ?? { emoji: '✦', fallbackTitle: section.title };
              return (
                <Animated.View
                  key={`${section.key}-${index}`}
                  entering={FadeInUp.delay(350 + index * 100).duration(500)}
                  style={[
                    styles.resultSection,
                    fullResult && section.key === 'growth' && { backgroundColor: 'rgba(221,237,220,0.5)', borderColor: 'rgba(31,33,48,0.06)' },
                  ]}
                >
                  <View style={styles.resultSectionHeader}>
                    <Text style={styles.resultSectionEmoji}>{meta.emoji}</Text>
                    <Text style={styles.resultSectionTitle}>{section.title || meta.fallbackTitle}</Text>
                  </View>
                  <Text style={styles.resultSectionText}>{section.body}</Text>
                </Animated.View>
              );
            })}

            {premiumExtraSections.map((section, index) => {
              const meta = resultSectionMeta[section.key] ?? { emoji: '✦', fallbackTitle: section.title };
              return (
                <Animated.View
                  key={`${section.key}-${index}`}
                  entering={FadeInUp.delay(650 + index * 90).duration(500)}
                  style={[styles.resultSection, styles.premiumDeepSection]}
                >
                  <View style={styles.resultSectionHeader}>
                    <Text style={styles.resultSectionEmoji}>{meta.emoji}</Text>
                    <Text style={styles.resultSectionTitle}>{section.title || meta.fallbackTitle}</Text>
                  </View>
                  <Text style={styles.resultSectionText}>{section.body}</Text>
                </Animated.View>
              );
            })}

            <Animated.View entering={FadeInUp.delay(650).duration(500)} style={[styles.resultSection, styles.quoteSection]}>
              <Text style={styles.quoteText}>
                "{reading?.quote ?? "Compatibility isn't about being the same. It's about whether you can grow in the same direction without losing yourself."}"
              </Text>
            </Animated.View>
          </Animated.View>
        )}
      </ScrollView>
    );
  }

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
      <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerLabel}>Compatibility</Text>
        <View style={styles.backButtonPlaceholder} />
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(100).duration(500)} style={styles.center}>
        <Animated.View entering={ZoomIn.delay(200).duration(300)} style={[styles.iconBg, { backgroundColor: '#DDEDDC' }]}>
          <Text style={styles.icon}>🔗</Text>
        </Animated.View>
        <Text style={styles.label}>Decode Chemistry</Text>
        <Text style={styles.title}>How do you two connect?</Text>
        <Text style={styles.desc}>
          Use birth details for a deeper match, or choose a zodiac sign when you only want a quick read.
        </Text>
      </Animated.View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Animated.View entering={FadeInUp.delay(200).duration(500)} style={styles.modeSwitch}>
        <TouchableOpacity
          style={[styles.modeButton, matchMode === 'full' && styles.modeButtonActive]}
          onPress={() => setMatchMode('full')}
          activeOpacity={0.85}
        >
          <Text style={[styles.modeText, matchMode === 'full' && styles.modeTextActive]}>Full Birth Match</Text>
          {!isPremium && <Text style={[styles.modeSubText, matchMode === 'full' && styles.modeSubTextActive]}>Premium</Text>}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, matchMode === 'quick' && styles.modeButtonActive]}
          onPress={() => setMatchMode('quick')}
          activeOpacity={0.85}
        >
          <Text style={[styles.modeText, matchMode === 'quick' && styles.modeTextActive]}>Quick Match</Text>
          <Text style={[styles.modeSubText, matchMode === 'quick' && styles.modeSubTextActive]}>Free</Text>
        </TouchableOpacity>
      </Animated.View>

      {fullLocked ? (
        <Animated.View entering={FadeInUp.delay(250).duration(500)} style={styles.lockedCard}>
          <View style={styles.lockedIconBg}>
            <Text style={styles.lockedIcon}>✦</Text>
          </View>
          <Text style={styles.lockedLabel}>Premium Reading</Text>
          <Text style={styles.lockedTitle}>Unlock Full Birth Match</Text>
          <Text style={styles.lockedBody}>
            Full Match compares birth date, place, optional birth time, and chart patterns for a deeper compatibility reading.
          </Text>
          <View style={styles.lockedList}>
            <Text style={styles.lockedItem}>• Birth chart compatibility</Text>
            <Text style={styles.lockedItem}>• Emotional, attraction, communication, and growth scores</Text>
            <Text style={styles.lockedItem}>• Deeper AI interpretation from the backend</Text>
          </View>
        </Animated.View>
      ) : (
        <>
          <Animated.View entering={FadeInUp.delay(250).duration(500)} style={styles.inputSection}>
            <Text style={styles.inputLabel}>Their name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              maxLength={PARTNER_NAME_MAX}
              placeholder="e.g. Jordan"
              placeholderTextColor={theme.colors.muted + '80'}
              style={styles.input}
            />
            <Text style={styles.characterHint}>{name.length}/{PARTNER_NAME_MAX}</Text>
          </Animated.View>

          {matchMode === 'full' ? (
            <>
          <Animated.View entering={FadeInUp.delay(320).duration(500)} style={styles.inputSection}>
            <Text style={styles.inputLabel}>Their birth date</Text>
            <TouchableOpacity
              style={[styles.selectorField, birthDate && styles.selectorFieldSelected]}
              onPress={openDateSelector}
              activeOpacity={0.85}
            >
              <View>
                <Text style={styles.selectorLabel}>Birth Date</Text>
                <Text style={[styles.selectorValue, !birthDate && styles.selectorPlaceholder]}>
                  {formatDateLabel(birthDate)}
                </Text>
              </View>
              <Text style={styles.selectorIcon}>⌄</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(380).duration(500)} style={styles.inputSection}>
            <View style={styles.inlineHeader}>
              <Text style={styles.inputLabel}>Birth time</Text>
              <TouchableOpacity
                style={[styles.smallToggle, knowsBirthTime && styles.smallToggleActive]}
                onPress={() => setKnowsBirthTime((value) => !value)}
                activeOpacity={0.85}
              >
                <Text style={[styles.smallToggleText, knowsBirthTime && styles.smallToggleTextActive]}>
                  {knowsBirthTime ? 'Known' : 'Unknown'}
                </Text>
              </TouchableOpacity>
            </View>
            {knowsBirthTime && (
              <TouchableOpacity
                style={[styles.selectorField, birthTime && styles.selectorFieldSelected]}
                onPress={openTimeSelector}
                activeOpacity={0.85}
              >
                <View>
                  <Text style={styles.selectorLabel}>Birth Time</Text>
                  <Text style={[styles.selectorValue, !birthTime && styles.selectorPlaceholder]}>
                    {birthTime || 'Select birth time'}
                  </Text>
                </View>
                <Text style={styles.selectorIcon}>⌄</Text>
              </TouchableOpacity>
            )}
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(440).duration(500)} style={styles.inputSection}>
            <Text style={styles.inputLabel}>Their birth place</Text>
            <TextInput
              value={placeQuery}
              onChangeText={(value) => {
                setPlaceQuery(value);
                setSelectedPlace(null);
              }}
              maxLength={PLACE_QUERY_MAX}
              placeholder="Search city"
              placeholderTextColor={theme.colors.muted + '80'}
              style={styles.input}
            />
            <Text style={styles.characterHint}>{placeQuery.length}/{PLACE_QUERY_MAX}</Text>
            {selectedPlace && (
              <Text style={styles.selectedPlaceText}>{selectedPlace.name}, {selectedPlace.country}</Text>
            )}
            {placeResults.length > 0 && (
              <View style={styles.cityResults}>
                {placeResults.map((city) => (
                  <TouchableOpacity
                    key={city.id}
                    style={styles.cityRow}
                    onPress={() => {
                      setSelectedPlace(city);
                      setPlaceQuery(`${city.name}, ${city.country}`);
                      setPlaceResults([]);
                    }}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.cityName}>{city.name}</Text>
                    <Text style={styles.cityMeta}>{city.country} · {city.gmt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(500).duration(500)} style={styles.inputSection}>
            <Text style={styles.inputLabel}>Zodiac fallback</Text>
            <Text style={styles.helperText}>Optional. Used only if birth details are incomplete.</Text>
            <View style={styles.signGrid}>
              {zodiacSigns.map((sign, i) => (
                <Animated.View key={sign} entering={FadeInUp.delay(520 + i * 20).duration(300)} style={{ width: '23%' }}>
                  <TouchableOpacity onPress={() => setSelectedSign(sign)} style={[styles.signBtn, selectedSign === sign && styles.signBtnActive]}>
                    <Text style={[styles.signBtnText, selectedSign === sign && styles.signBtnTextActive]}>{sign}</Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
            </>
          ) : (
            <Animated.View entering={FadeInUp.delay(350).duration(500)} style={styles.inputSection}>
              <Text style={styles.inputLabel}>Their zodiac sign</Text>
              <View style={styles.signGrid}>
                {zodiacSigns.map((sign, i) => (
                  <Animated.View
                    key={sign}
                    entering={FadeInUp.delay(400 + i * 30).duration(300)}
                    style={{ width: '23%' }}
                  >
                    <TouchableOpacity
                      onPress={() => setSelectedSign(sign)}
                      style={[
                        styles.signBtn,
                        selectedSign === sign && styles.signBtnActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.signBtnText,
                          selectedSign === sign && styles.signBtnTextActive,
                        ]}
                      >
                        {sign}
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </View>
            </Animated.View>
          )}
        </>
      )}

      <Animated.View entering={FadeInUp.delay(700).duration(500)}>
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={!canReveal && !fullLocked}
          onPress={handleReveal}
        >
          <LinearGradient
            colors={canReveal || fullLocked ? theme.gradients.primary : ['#C4B8E0', '#A0D4D0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.button, !canReveal && !fullLocked && styles.buttonDisabled]}
          >
            <Text style={styles.buttonText}>{fullLocked ? 'Unlock Full Match' : matchMode === 'quick' ? 'Reveal Quick Match' : 'Reveal Full Match'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
      </ScrollView>

      <Modal transparent visible={dateSelectorVisible} animationType="fade" onRequestClose={() => setDateSelectorVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.selectorSheet}>
            <View style={styles.selectorSheetHeader}>
              <View>
                <Text style={styles.sheetLabel}>Full Birth Match</Text>
                <Text style={styles.sheetTitle}>Select birth date</Text>
              </View>
              <TouchableOpacity style={styles.sheetClose} onPress={() => setDateSelectorVisible(false)} activeOpacity={0.85}>
                <Text style={styles.sheetCloseText}>×</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.pickerColumns}>
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Month</Text>
                <ScrollView style={styles.pickerList} showsVerticalScrollIndicator={false}>
                  {monthOptions.map((month) => (
                    <TouchableOpacity
                      key={month.value}
                      style={[styles.pickerOption, dateDraft.month === month.value && styles.pickerOptionActive]}
                      onPress={() => updateDateDraft({ month: month.value })}
                      activeOpacity={0.85}
                    >
                      <Text style={[styles.pickerOptionText, dateDraft.month === month.value && styles.pickerOptionTextActive]}>{month.label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Day</Text>
                <ScrollView style={styles.pickerList} showsVerticalScrollIndicator={false}>
                  {dateDayOptions.map((day) => (
                    <TouchableOpacity
                      key={day}
                      style={[styles.pickerOption, dateDraft.day === day && styles.pickerOptionActive]}
                      onPress={() => updateDateDraft({ day })}
                      activeOpacity={0.85}
                    >
                      <Text style={[styles.pickerOptionText, dateDraft.day === day && styles.pickerOptionTextActive]}>{day}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Year</Text>
                <ScrollView style={styles.pickerList} showsVerticalScrollIndicator={false}>
                  {yearOptions.map((year) => (
                    <TouchableOpacity
                      key={year}
                      style={[styles.pickerOption, dateDraft.year === year && styles.pickerOptionActive]}
                      onPress={() => updateDateDraft({ year })}
                      activeOpacity={0.85}
                    >
                      <Text style={[styles.pickerOptionText, dateDraft.year === year && styles.pickerOptionTextActive]}>{year}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <TouchableOpacity style={styles.sheetAction} onPress={confirmDate} activeOpacity={0.85}>
              <LinearGradient colors={theme.gradients.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.sheetActionGradient}>
                <Text style={styles.sheetActionText}>Use {formatDateLabel(`${dateDraft.year}-${pad(dateDraft.month)}-${pad(dateDraft.day)}`)}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={timeSelectorVisible} animationType="fade" onRequestClose={() => setTimeSelectorVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.selectorSheet}>
            <View style={styles.selectorSheetHeader}>
              <View>
                <Text style={styles.sheetLabel}>Full Birth Match</Text>
                <Text style={styles.sheetTitle}>Select birth time</Text>
              </View>
              <TouchableOpacity style={styles.sheetClose} onPress={() => setTimeSelectorVisible(false)} activeOpacity={0.85}>
                <Text style={styles.sheetCloseText}>×</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.timePreview}>
              <Text style={styles.timePreviewText}>{pad(timeDraft.hour)}:{pad(timeDraft.minute)}</Text>
            </View>
            <View style={styles.pickerColumns}>
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Hour</Text>
                <ScrollView style={styles.pickerList} showsVerticalScrollIndicator={false}>
                  {hourOptions.map((hour) => (
                    <TouchableOpacity
                      key={hour}
                      style={[styles.pickerOption, timeDraft.hour === hour && styles.pickerOptionActive]}
                      onPress={() => setTimeDraft((current) => ({ ...current, hour }))}
                      activeOpacity={0.85}
                    >
                      <Text style={[styles.pickerOptionText, timeDraft.hour === hour && styles.pickerOptionTextActive]}>{pad(hour)}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Minute</Text>
                <ScrollView style={styles.pickerList} showsVerticalScrollIndicator={false}>
                  {minuteOptions.map((minute) => (
                    <TouchableOpacity
                      key={minute}
                      style={[styles.pickerOption, timeDraft.minute === minute && styles.pickerOptionActive]}
                      onPress={() => setTimeDraft((current) => ({ ...current, minute }))}
                      activeOpacity={0.85}
                    >
                      <Text style={[styles.pickerOptionText, timeDraft.minute === minute && styles.pickerOptionTextActive]}>{pad(minute)}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <TouchableOpacity style={styles.sheetAction} onPress={confirmTime} activeOpacity={0.85}>
              <LinearGradient colors={theme.gradients.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.sheetActionGradient}>
                <Text style={styles.sheetActionText}>Use {pad(timeDraft.hour)}:{pad(timeDraft.minute)}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  loadingCenter: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    padding: 20,
  },
  loadingIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#8B72CF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: 'rgba(139,114,207,0.25)',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    shadowOpacity: 1,
    elevation: 6,
  },
  loadingIcon: { fontSize: 24, color: '#FFFFFF' },
  loadingLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.3,
    color: '#8B72CF',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  loadingTitle: {
    fontFamily: theme.fonts.serif,
    fontSize: 22,
    fontWeight: '500',
    color: theme.colors.ink,
    lineHeight: 27,
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingSub: {
    minHeight: 42,
    fontSize: 13,
    color: theme.colors.muted,
    lineHeight: 21,
    textAlign: 'center',
  },
  loadingProgressTrack: {
    width: '100%',
    height: 8,
    borderRadius: 999,
    marginTop: 18,
    marginBottom: 16,
    backgroundColor: 'rgba(31,33,48,0.08)',
    overflow: 'hidden',
  },
  loadingProgressFill: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#8B72CF',
    transformOrigin: 'left',
  },
  loadingSteps: {
    width: '100%',
    gap: 9,
    padding: 14,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.64)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.06)',
  },
  loadingStepRow: {
    minHeight: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  loadingStepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(31,33,48,0.16)',
  },
  loadingStepText: {
    flex: 1,
    fontSize: 12,
    color: theme.colors.muted,
    lineHeight: 17,
  },
  loadingStepTextActive: {
    color: theme.colors.ink,
    fontWeight: '700',
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
  backButtonPlaceholder: { width: 40 },
  headerLabel: { fontSize: 12, color: theme.colors.muted },
  center: { alignItems: 'center', marginBottom: 24 },
  iconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: 'rgba(22,167,160,0.2)',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    shadowOpacity: 1,
    elevation: 6,
  },
  icon: { fontSize: 24 },
  label: {
    fontSize: 11,
    letterSpacing: 1.4,
    color: '#8B72CF',
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 4,
  },
  title: {
    fontFamily: theme.fonts.serif,
    fontSize: 24,
    fontWeight: '500',
    color: theme.colors.ink,
    lineHeight: 28,
    textAlign: 'center',
    marginBottom: 4,
  },
  desc: {
    fontSize: 13,
    color: theme.colors.muted,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 260,
    marginTop: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#B84A62',
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 12,
  },
  modeSwitch: {
    flexDirection: 'row',
    gap: 8,
    padding: 4,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    marginBottom: 18,
  },
  modeButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  modeButtonActive: {
    backgroundColor: '#8B72CF',
  },
  modeText: { fontSize: 12, fontWeight: '800', color: theme.colors.muted, textAlign: 'center' },
  modeTextActive: { color: '#FFFFFF' },
  modeSubText: { fontSize: 10, fontWeight: '700', color: theme.colors.muted, marginTop: 2 },
  modeSubTextActive: { color: 'rgba(255,255,255,0.78)' },
  lockedCard: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(139,114,207,0.16)',
    alignItems: 'center',
    ...theme.shadows.warmSoft,
  },
  lockedIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    backgroundColor: 'rgba(139,114,207,0.14)',
  },
  lockedIcon: { fontSize: 18, color: '#8B72CF' },
  lockedLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: '#8B72CF',
    marginBottom: 4,
  },
  lockedTitle: {
    fontFamily: theme.fonts.serif,
    fontSize: 21,
    fontWeight: '500',
    color: theme.colors.ink,
    textAlign: 'center',
    marginBottom: 8,
  },
  lockedBody: {
    fontSize: 12,
    color: theme.colors.muted,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 12,
  },
  lockedList: {
    width: '100%',
    gap: 6,
    padding: 12,
    borderRadius: 18,
    backgroundColor: 'rgba(232,221,251,0.36)',
  },
  lockedItem: { fontSize: 11, color: theme.colors.muted, lineHeight: 17 },
  inputSection: { marginBottom: 20 },
  inputLabel: { fontSize: 12, fontWeight: '700', color: theme.colors.ink, marginBottom: 8 },
  characterHint: {
    fontSize: 10,
    color: theme.colors.muted,
    textAlign: 'right',
    marginTop: 6,
  },
  inlineHeader: {
    minHeight: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  smallToggle: {
    minWidth: 88,
    minHeight: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.76)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
  },
  smallToggleActive: {
    backgroundColor: '#16A7A0',
    borderColor: 'transparent',
  },
  smallToggleText: { fontSize: 11, fontWeight: '800', color: theme.colors.muted },
  smallToggleTextActive: { color: '#FFFFFF' },
  helperText: { fontSize: 11, color: theme.colors.muted, lineHeight: 16, marginTop: -4, marginBottom: 10 },
  input: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    fontSize: 14,
    color: theme.colors.ink,
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
  },
  selectorField: {
    minHeight: 58,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectorFieldSelected: {
    borderColor: 'rgba(22,167,160,0.28)',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  selectorLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#8B72CF',
    marginBottom: 4,
  },
  selectorValue: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.ink,
  },
  selectorPlaceholder: {
    color: theme.colors.muted,
    fontWeight: '600',
  },
  selectorIcon: {
    fontSize: 18,
    color: theme.colors.muted,
    marginLeft: 12,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(31,33,48,0.36)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  selectorSheet: {
    maxHeight: '78%',
    borderRadius: 28,
    padding: 18,
    backgroundColor: '#FFF9F3',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    ...theme.shadows.warmSoft,
  },
  selectorSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sheetLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8B72CF',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  sheetTitle: {
    fontFamily: theme.fonts.serif,
    fontSize: 20,
    fontWeight: '500',
    color: theme.colors.ink,
  },
  sheetClose: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
  },
  sheetCloseText: {
    fontSize: 22,
    color: theme.colors.muted,
    lineHeight: 24,
  },
  pickerColumns: {
    flexDirection: 'row',
    gap: 10,
  },
  pickerColumn: {
    flex: 1,
  },
  pickerLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.muted,
    marginBottom: 8,
    textAlign: 'center',
  },
  pickerList: {
    maxHeight: 220,
  },
  pickerOption: {
    minHeight: 38,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.06)',
  },
  pickerOptionActive: {
    backgroundColor: '#8B72CF',
    borderColor: 'transparent',
  },
  pickerOptionText: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.ink,
  },
  pickerOptionTextActive: {
    color: '#FFFFFF',
  },
  timePreview: {
    minHeight: 58,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(232,221,251,0.52)',
    borderWidth: 1,
    borderColor: 'rgba(139,114,207,0.16)',
    marginBottom: 14,
  },
  timePreviewText: {
    fontFamily: theme.fonts.serif,
    fontSize: 28,
    fontWeight: '500',
    color: theme.colors.ink,
  },
  sheetAction: {
    marginTop: 16,
  },
  sheetActionGradient: {
    minHeight: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  sheetActionText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  selectedPlaceText: {
    fontSize: 11,
    color: '#16A7A0',
    fontWeight: '800',
    marginTop: 8,
  },
  cityResults: {
    marginTop: 8,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
  },
  cityRow: {
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(31,33,48,0.06)',
  },
  cityName: { fontSize: 13, fontWeight: '800', color: theme.colors.ink },
  cityMeta: { fontSize: 11, color: theme.colors.muted, marginTop: 2 },
  signGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  signBtn: {
    width: '100%',
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
  },
  signBtnActive: {
    backgroundColor: '#8B72CF',
    borderColor: 'transparent',
  },
  signBtnText: { fontSize: 11, fontWeight: '700', color: theme.colors.muted },
  signBtnTextActive: { color: '#FFFFFF' },
  button: {
    width: '100%',
    minHeight: 48,
    borderRadius: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.primaryGlow,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
  resultCenter: { alignItems: 'center', marginBottom: 20 },
  resultLabel: {
    fontSize: 11,
    letterSpacing: 1.4,
    color: '#8B72CF',
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 8,
  },
  resultTitle: {
    fontFamily: theme.fonts.serif,
    fontSize: 24,
    fontWeight: '500',
    color: theme.colors.ink,
    lineHeight: 28,
    marginBottom: 4,
  },
  resultSub: { fontSize: 12, color: theme.colors.muted },
  confidencePill: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(232,221,251,0.48)',
    borderWidth: 1,
    borderColor: 'rgba(139,114,207,0.12)',
  },
  confidenceText: { fontSize: 11, fontWeight: '800', color: '#8B72CF' },
  scoreCard: {
    borderRadius: theme.radius.lg,
    padding: 20,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    ...theme.shadows.warmSoft,
  },
  scoreGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.5)',
    right: -30,
    top: -30,
    opacity: 0.2,
  },
  scoreContent: { alignItems: 'center', marginBottom: 16, position: 'relative', zIndex: 10 },
  scoreLabel: {
    fontSize: 11,
    letterSpacing: 1,
    color: '#8B72CF',
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 8,
  },
  scoreValue: {
    fontFamily: theme.fonts.serif,
    fontSize: 40,
    fontWeight: '500',
    color: theme.colors.ink,
    lineHeight: 44,
    marginBottom: 4,
  },
  scoreSub: { fontSize: 12, color: theme.colors.muted },
  scoreBarBg: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(31,33,48,0.06)',
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#8B72CF',
  },
  resultSection: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.11)',
  },
  resultSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  resultSectionEmoji: { fontSize: 16 },
  resultSectionTitle: { fontSize: 14, fontWeight: '800', color: theme.colors.ink },
  resultSectionText: { fontSize: 13, color: '#5E6072', lineHeight: 23 },
  quickSummaryCard: {
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
  },
  quickSummaryLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    color: '#8B72CF',
    marginBottom: 5,
  },
  quickSummaryTitle: {
    fontFamily: theme.fonts.serif,
    fontSize: 18,
    fontWeight: '500',
    color: theme.colors.ink,
    marginBottom: 6,
  },
  quickSummaryBody: { fontSize: 12, color: theme.colors.muted, lineHeight: 20, marginBottom: 10 },
  quickSummaryHint: { fontSize: 11, fontWeight: '700', color: '#7A63BD', lineHeight: 17 },
  scoreBreakdownCard: {
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    backgroundColor: 'rgba(232,221,251,0.42)',
    borderWidth: 1,
    borderColor: 'rgba(139,114,207,0.18)',
  },
  scoreBreakdownLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    color: '#8B72CF',
    marginBottom: 10,
  },
  scoreBreakdownGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  scoreBreakdownItem: {
    width: '48%',
    borderRadius: 16,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.62)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.06)',
  },
  scoreBreakdownValue: { fontSize: 18, fontWeight: '800', color: theme.colors.ink, marginBottom: 2 },
  scoreBreakdownName: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.muted,
    textTransform: 'capitalize',
  },
  premiumDeepSection: {
    backgroundColor: '#FFFDF8',
    borderColor: 'rgba(139,114,207,0.28)',
    shadowColor: 'rgba(31,33,48,0.08)',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    shadowOpacity: 1,
    elevation: 2,
  },
  quoteSection: {
    backgroundColor: 'rgba(232,221,251,0.58)',
    borderColor: 'rgba(139,114,207,0.24)',
  },
  quoteText: {
    fontSize: 13,
    color: theme.colors.ink,
    lineHeight: 22,
    fontWeight: '500',
    fontStyle: 'italic',
  },
});
