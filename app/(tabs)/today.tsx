import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInDown, FadeOut, FadeOutUp, Easing } from 'react-native-reanimated';
import { useEngagement } from '@/src/hooks/useEngagement';
import { theme } from '@/src/lib/theme';
import { useTier } from '@/src/context/TierContext';
import VisualStreakTracker from '@/src/components/VisualStreakTracker';
import PatternAlertCard from '@/src/components/PatternAlertCard';
import WeeklyReadingCard from '@/src/components/WeeklyReadingCard';

function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getTimeEmoji() {
  const hour = new Date().getHours();
  if (hour < 6) return '🌙';
  if (hour < 12) return '☀️';
  if (hour < 17) return '🌤';
  if (hour < 21) return '🌆';
  return '🌙';
}

const moods = [
  { id: 'steady', emoji: '💛', label: 'Steady' },
  { id: 'tender', emoji: '🌊', label: 'Tender' },
  { id: 'restless', emoji: '⚡', label: 'Restless' },
  { id: 'quiet', emoji: '🧊', label: 'Quiet' },
];

const moodResponses: Record<string, string> = {
  steady: "You're grounded today. A good day to reflect on what's working — and trust it.",
  tender: "Your feelings are close to the surface. That's not a flaw — it's information.",
  restless: "Something wants your attention. Don't chase the answer — sit with the question.",
  quiet: "Quietness is still a signal. Your body may be asking for rest, not distraction.",
};

export default function TodayScreen() {
  const router = useRouter();
  const engagement = useEngagement();
  const { isPremium } = useTier();

  const [selectedMood, setSelectedMood] = useState<string | null>(
    engagement?.moodHistory?.[0]?.mood || null
  );
  const [expandedJournal, setExpandedJournal] = useState(false);
  const [journalText, setJournalText] = useState('');
  const [journalSaved, setJournalSaved] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const dailyReading = engagement.todayPayload?.dailyReading;
  const signal = dailyReading?.signal ?? {
    title: 'Preparing your signal',
    sub: 'Your backend reading will appear here after sync.',
  };
  const insight = dailyReading?.insight ?? 'Your first insight is being prepared.';
  const move = dailyReading?.move ?? 'Return to your breath and choose one honest action.';
  const attribution = dailyReading?.attribution ?? '';
  const prompt = engagement.todayPayload?.journal.prompt ?? 'What do I need but avoid asking for?';
  const streak = engagement?.streak || 0;
  const lastReflection = engagement?.journalEntries?.[0];
  const energies = engagement.todayPayload?.energies ?? [
    { label: 'Calm', value: 0.72 },
    { label: 'Direct', value: 0.85 },
    { label: 'Testing', value: 0.4 },
  ];

  const handleMoodSelect = async (mood: string) => {
    setSelectedMood(mood);
    try {
      await engagement.addMood(mood);
    } catch (error) {
      setToastMessage(error instanceof Error ? error.message : 'Mood could not be saved.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleSaveJournal = async () => {
    if (journalText.trim() && engagement) {
      await engagement.addJournalEntry(journalText, prompt);
      setJournalSaved(true);
      setToastMessage('Reflection saved.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const consecutiveMood = engagement?.getConsecutiveMood?.() || null;
  const weeklyStatus = engagement?.getWeeklyReadingStatus?.();
  const showWeeklyCard = weeklyStatus?.isNewWeek && !engagement?.dismissedWeeklyReading;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {showToast && (
        <Animated.View
          entering={FadeInDown.duration(300).easing(Easing.out(Easing.cubic))}
          exiting={FadeOutUp.duration(250)}
          style={styles.toast}
        >
          <LinearGradient
            colors={theme.gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.toastInner}
          >
            <View style={styles.toastIconBg}>
              <Text style={styles.toastCheck}>✓</Text>
            </View>
            <Text style={styles.toastText}>{toastMessage}</Text>
          </LinearGradient>
        </Animated.View>
      )}

      <Animated.View entering={FadeInUp.duration(500).delay(0)}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getTimeGreeting()} {getTimeEmoji()}</Text>
            <Text style={styles.name}>{engagement.todayPayload?.user.name ?? 'You'}</Text>
          </View>
          <View style={styles.headerRight}>
            {streak > 0 && (
              <View style={styles.streakBadge}>
                <Text style={styles.streakEmoji}>🔥</Text>
                <Text style={styles.streakNum}>{streak}</Text>
              </View>
            )}
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>G</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(500).delay(50)}>
        <Text style={styles.moodQuestion}>How are you feeling right now?</Text>
      </Animated.View>

      <View style={styles.moodRow}>
        {moods.map((mood, index) => (
          <Animated.View
            key={mood.label}
            entering={FadeInUp.duration(500).delay(100 + index * 60)}
            style={{ flex: 1 }}
          >
            <TouchableOpacity
              onPress={() => handleMoodSelect(mood.id)}
              style={[
                styles.moodBtn,
                selectedMood === mood.id && styles.moodBtnActive,
              ]}
            >
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              <Text
                style={[
                  styles.moodLabel,
                  selectedMood === mood.id && styles.moodLabelActive,
                ]}
              >
                {mood.label}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      {selectedMood && (
        <Animated.View entering={FadeInUp.duration(400)} style={styles.moodResponse}>
          <Text style={styles.moodResponseText}>{moodResponses[selectedMood]}</Text>
        </Animated.View>
      )}

      <VisualStreakTracker streak={streak} />

      {consecutiveMood && (
        <PatternAlertCard mood={consecutiveMood} />
      )}

      {showWeeklyCard && (
        <WeeklyReadingCard
          visible={true}
          reading={engagement.todayPayload?.weeklyReading}
          onDismiss={() => engagement?.dismissWeeklyReading?.()}
        />
      )}

      <Animated.View entering={FadeInUp.duration(500).delay(200)}>
        <LinearGradient
          colors={theme.gradients.hero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.signalCard}
        >
          <View style={styles.signalGlow} />
          <Text style={styles.signalLabel}>Today's Signal</Text>
          <Text style={styles.signalTitle}>{signal.title}</Text>
          <Text style={styles.signalSub}>{signal.sub}</Text>
        </LinearGradient>
      </Animated.View>

      <View style={styles.weekSection}>
        <Animated.View entering={FadeInUp.duration(500).delay(250)}>
          <View style={styles.weekHeader}>
            <Text style={styles.weekTitle}>This week</Text>
            <View style={styles.weekDays}>
              {engagement?.getStreakDays?.()?.map((day, i) => (
                <View key={i} style={styles.dayCol}>
                  <View
                    style={[
                      styles.dayBox,
                      {
                        backgroundColor: day.active
                          ? '#8B72CF'
                          : 'rgba(31,33,48,0.06)',
                      },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: '700',
                        color: day.active ? '#FFFFFF' : theme.colors.softMuted,
                      }}
                    >
                      {day.day}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>
        <View style={styles.energyRow}>
          {energies.map((item, index) => (
            <Animated.View
              key={item.label}
              entering={FadeInUp.duration(500).delay(300 + index * 80)}
              style={{ flex: 1 }}
            >
              <View style={styles.energyCard}>
                <View style={styles.energyBarBg}>
                  <View
                    style={[
                      styles.energyBarFill,
                      { width: `${Math.round(item.value * 100)}%`, backgroundColor: ['#8B72CF', '#E8A87C', '#F4C7D2'][index % 3] },
                    ]}
                  />
                </View>
                <Text style={styles.energyLabel}>{item.label}</Text>
                <Text style={styles.energySub}>{index === 0 ? 'emotional weather' : index === 1 ? 'best move' : 'avoid'}</Text>
              </View>
            </Animated.View>
          ))}
        </View>
      </View>

      {lastReflection && !expandedJournal && (
        <Animated.View entering={FadeInUp.duration(500).delay(350)} style={styles.lastReflection}>
          <Text style={styles.lastReflectionLabel}>Last reflection</Text>
          <Text style={styles.lastReflectionText}>"{lastReflection.text}"</Text>
          <Text style={styles.lastReflectionDate}>{lastReflection.date}</Text>
        </Animated.View>
      )}

      <View style={styles.insightSection}>
        <Animated.View entering={FadeInUp.duration(500).delay(400)}>
          <Text style={styles.insightLabel}>One Insight For You</Text>
        </Animated.View>
        <Animated.View entering={FadeInUp.duration(500).delay(450)}>
          <View style={styles.insightCard}>
            <Text style={styles.insightText}>{insight}</Text>
            {!!attribution && <Text style={styles.insightSub}>— {attribution}</Text>}
          </View>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInUp.duration(500).delay(500)}>
        <TouchableOpacity
          style={styles.journalCard}
          onPress={() => { if (!expandedJournal) setExpandedJournal(true); }}
          activeOpacity={0.85}
        >
          <View style={styles.journalHeader}>
            <Text style={styles.journalTitle}>Journal Prompt</Text>
            {!expandedJournal && <Text style={styles.journalArrow}>▾</Text>}
          </View>
          {!expandedJournal && (
            <Text style={styles.journalPreview}>{prompt}</Text>
          )}
        </TouchableOpacity>
      </Animated.View>

      {expandedJournal && (
        <Animated.View entering={FadeInUp.duration(300)} exiting={FadeOut.duration(200)} style={styles.journalExpanded}>
          <Text style={styles.journalPrompt}>{prompt}</Text>
          {journalSaved ? (
            <View style={styles.journalSaved}>
              <Text style={styles.journalSavedTitle}>✓ Saved</Text>
              <Text style={styles.journalSavedSub}>Your reflection is safe here.</Text>
            </View>
          ) : (
            <>
              <TextInput
                style={styles.journalInput}
                multiline
                numberOfLines={3}
                placeholder="Start typing your reflection..."
                placeholderTextColor={theme.colors.muted + '80'}
                value={journalText}
                onChangeText={setJournalText}
              />
              <View style={styles.journalFooter}>
                <Text style={styles.journalHint}>Saved only for you</Text>
                <TouchableOpacity
                  onPress={handleSaveJournal}
                  disabled={!journalText.trim()}
                  style={[
                    styles.saveBtn,
                    !journalText.trim() && { backgroundColor: 'rgba(139,114,207,0.3)' },
                  ]}
                >
                  <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Animated.View>
      )}

      <Animated.View entering={FadeInUp.duration(500).delay(550)}>
        <View style={styles.moveCard}>
          <Text style={styles.moveLabel}>Best Move</Text>
          <Text style={styles.moveText}>{move}</Text>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(500).delay(600)}>
        <TouchableOpacity
          style={styles.tarotLink}
          onPress={() => router.push('/tarot')}
          activeOpacity={0.85}
        >
          <View style={styles.tarotIconBg}>
            <Text style={styles.tarotIconText}>🃏</Text>
          </View>
          <View style={styles.tarotText}>
            <Text style={styles.tarotTitle}>Daily Tarot</Text>
            <Text style={styles.tarotSub}>
              {engagement?.canDrawTarot?.(isPremium)
                ? isPremium
                  ? `3-card spread · ${engagement?.getTarotDrawsRemaining?.(isPremium)} left today`
                  : '1 free card today'
                : 'Come back tomorrow'}
            </Text>
          </View>
          <Text style={styles.tarotArrow}>→</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(500).delay(650)}>
        <TouchableOpacity
          style={styles.horoscopeLink}
          onPress={() => router.push('/horoscope')}
          activeOpacity={0.85}
        >
          <View style={styles.horoscopeIcon}>
            <Text style={styles.horoscopeIconText}>✦</Text>
          </View>
          <View style={styles.horoscopeText}>
            <Text style={styles.horoscopeTitle}>Your Horoscope</Text>
            <Text style={styles.horoscopeSub}>Daily stars + natal chart</Text>
          </View>
          <Text style={styles.horoscopeArrow}>→</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(500).delay(700)}>
        <TouchableOpacity
          style={styles.astrovyLink}
          onPress={() => router.push('/(tabs)/astrovy')}
          activeOpacity={0.85}
        >
          <View style={styles.astrovyIcon}>
            <Text style={styles.astrovyIconText}>✦</Text>
          </View>
          <View style={styles.astrovyText}>
            <Text style={styles.astrovyTitle}>View your Astrovy</Text>
            <Text style={styles.astrovySub}>Your complete emotional blueprint</Text>
          </View>
          <Text style={styles.astrovyArrow}>→</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 130,
  },
  toast: {
    position: 'absolute',
    top: 56,
    left: 20,
    right: 20,
    zIndex: 100,
  },
  toastInner: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: 'rgba(139,114,207,0.3)',
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 30,
    shadowOpacity: 1,
    elevation: 10,
  },
  toastIconBg: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastCheck: { fontSize: 14, color: '#FFFFFF', fontWeight: '700' },
  toastText: { fontSize: 13, color: '#FFFFFF', fontWeight: '500', flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: { fontSize: 12, color: theme.colors.muted },
  name: {
    fontFamily: theme.fonts.serif,
    fontSize: 28,
    fontWeight: '500',
    color: theme.colors.ink,
  },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: 'rgba(247,216,117,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(247,216,117,0.4)',
  },
  streakEmoji: { fontSize: 12 },
  streakNum: { fontSize: 11, fontWeight: '700', color: theme.colors.ink },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16A7A0',
    shadowColor: 'rgba(22,167,160,0.22)',
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 28,
    shadowOpacity: 1,
    elevation: 6,
  },
  avatarText: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },
  moodQuestion: { fontSize: 13, fontWeight: '500', color: theme.colors.ink, marginBottom: 8 },
  moodRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  moodBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
  },
  moodBtnActive: {
    backgroundColor: '#8B72CF',
    borderColor: 'transparent',
    shadowColor: 'rgba(139,114,207,0.2)',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    shadowOpacity: 1,
    elevation: 4,
  },
  moodEmoji: { fontSize: 18, marginBottom: 2 },
  moodLabel: { fontSize: 10, fontWeight: '700', color: theme.colors.muted },
  moodLabelActive: { color: '#FFFFFF' },
  moodResponse: {
    borderRadius: 20,
    padding: 12,
    marginBottom: 16,
    backgroundColor: 'rgba(139,114,207,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(139,114,207,0.15)',
  },
  moodResponseText: { fontSize: 12, color: theme.colors.ink, lineHeight: 20 },
  signalCard: {
    borderRadius: theme.radius.lg,
    padding: 20,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    ...theme.shadows.warmSoft,
  },
  signalGlow: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.28)',
    right: -44,
    top: -50,
  },
  signalLabel: {
    fontSize: 11,
    letterSpacing: 1.4,
    color: '#8B72CF',
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 12,
    position: 'relative',
    zIndex: 10,
  },
  signalTitle: {
    fontFamily: theme.fonts.serif,
    fontSize: 22,
    fontWeight: '500',
    color: theme.colors.ink,
    lineHeight: 26,
    letterSpacing: -0.4,
    marginBottom: 8,
    position: 'relative',
    zIndex: 10,
  },
  signalSub: {
    fontSize: 12,
    color: theme.colors.softMuted,
    position: 'relative',
    zIndex: 10,
  },
  weekSection: { marginBottom: 16 },
  weekHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  weekTitle: { fontSize: 13, fontWeight: '700', color: theme.colors.ink },
  weekDays: { flexDirection: 'row', gap: 4 },
  dayCol: { alignItems: 'center' },
  dayBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  energyRow: { flexDirection: 'row', gap: 8 },
  energyCard: {
    flex: 1,
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    ...theme.shadows.warmSm,
  },
  energyBarBg: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(31,33,48,0.06)',
    marginBottom: 8,
    overflow: 'hidden',
  },
  energyBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  energyLabel: { fontSize: 13, fontWeight: '700', color: theme.colors.ink, marginBottom: 2 },
  energySub: { fontSize: 10, color: theme.colors.muted },
  lastReflection: {
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
    backgroundColor: 'rgba(221,237,220,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.06)',
  },
  lastReflectionLabel: {
    fontSize: 10,
    letterSpacing: 1,
    color: '#16A7A0',
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 4,
  },
  lastReflectionText: { fontSize: 12, color: theme.colors.ink, lineHeight: 20 },
  lastReflectionDate: { fontSize: 10, color: theme.colors.muted, marginTop: 4 },
  insightSection: { marginBottom: 12 },
  insightLabel: {
    fontSize: 11,
    letterSpacing: 1,
    color: '#8B72CF',
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 8,
  },
  insightCard: {
    borderRadius: 24,
    padding: 16,
    backgroundColor: 'rgba(232,221,251,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(139,114,207,0.18)',
  },
  insightText: { fontSize: 13, color: theme.colors.ink, lineHeight: 22, fontWeight: '500' },
  insightSub: { fontSize: 11, color: theme.colors.muted, marginTop: 4 },
  journalCard: {
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.74)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    ...theme.shadows.warmSm,
  },
  journalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  journalTitle: { fontSize: 14, fontWeight: '500', color: theme.colors.ink },
  journalArrow: { fontSize: 12, color: theme.colors.muted },
  journalPreview: { fontSize: 13, color: theme.colors.muted, marginTop: 4 },
  journalExpanded: {
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(139,114,207,0.15)',
    ...theme.shadows.warmSm,
  },
  journalPrompt: { fontSize: 14, fontWeight: '500', color: theme.colors.ink, marginBottom: 8 },
  journalInput: {
    fontSize: 13,
    color: theme.colors.ink,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  journalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  journalHint: { fontSize: 11, color: theme.colors.muted },
  saveBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#8B72CF',
  },
  saveBtnText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
  journalSaved: { paddingVertical: 16, alignItems: 'center' },
  journalSavedTitle: { fontSize: 14, fontWeight: '500', color: theme.colors.ink, marginBottom: 4 },
  journalSavedSub: { fontSize: 12, color: theme.colors.muted },
  moveCard: {
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.74)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    ...theme.shadows.warmSm,
  },
  moveLabel: { fontSize: 14, fontWeight: '500', color: theme.colors.ink, marginBottom: 2 },
  moveText: { fontSize: 13, color: theme.colors.muted },
  tarotLink: {
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: 'rgba(255,255,255,0.74)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    marginBottom: 12,
    ...theme.shadows.warmSm,
  },
  tarotIconBg: {
    width: 44,
    height: 44,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8DDFB',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.06)',
  },
  tarotIconText: { fontSize: 18 },
  tarotText: { flex: 1 },
  tarotTitle: { fontSize: 14, fontWeight: '500', color: theme.colors.ink },
  tarotSub: { fontSize: 12, color: theme.colors.muted },
  tarotArrow: { fontSize: 16, color: theme.colors.muted },
  horoscopeLink: {
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: 'rgba(255,255,255,0.74)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    marginBottom: 12,
    ...theme.shadows.warmSm,
  },
  horoscopeIcon: {
    width: 44,
    height: 44,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7D875',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.06)',
  },
  horoscopeIconText: { fontSize: 18 },
  horoscopeText: { flex: 1 },
  horoscopeTitle: { fontSize: 14, fontWeight: '500', color: theme.colors.ink },
  horoscopeSub: { fontSize: 12, color: theme.colors.muted },
  horoscopeArrow: { fontSize: 16, color: theme.colors.muted },
  astrovyLink: {
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: 'rgba(255,255,255,0.74)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    ...theme.shadows.warmSm,
  },
  astrovyIcon: {
    width: 44,
    height: 44,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8DDFB',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.06)',
  },
  astrovyIconText: { fontSize: 18 },
  astrovyText: { flex: 1 },
  astrovyTitle: { fontSize: 14, fontWeight: '500', color: theme.colors.ink },
  astrovySub: { fontSize: 12, color: theme.colors.muted },
  astrovyArrow: { fontSize: 16, color: theme.colors.muted },
});
