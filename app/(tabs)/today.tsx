import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInUp, FadeInDown, FadeOut, FadeOutUp } from 'react-native-reanimated';
import { useEngagement } from '@/src/hooks/useEngagement';
import { theme } from '@/src/lib/theme';

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

function getDayIndex() {
  return (new Date().getDate() + new Date().getMonth()) % 7;
}

const moods = [
  { emoji: '💛', label: 'Steady' },
  { emoji: '🌊', label: 'Emotional' },
  { emoji: '⚡', label: 'Restless' },
  { emoji: '🧊', label: 'Numb' },
];

const moodResponses: Record<string, string> = {
  Steady: "You're grounded today. A good day to reflect on what's working — and trust it.",
  Emotional: "Your feelings are close to the surface. That's not a flaw — it's information.",
  Restless: "Something wants your attention. Don't chase the answer — sit with the question.",
  Numb: "Numbness is still a signal. Your body may be asking for rest, not distraction.",
};

const dailySignals = [
  { title: "Your mind wants clarity, but your heart needs emotional evidence.", sub: "A calm day for naming what you usually keep private." },
  { title: "The thing you're avoiding mentioning is the thing that needs saying.", sub: "Directness serves you better than politeness today." },
  { title: "You've been holding space for others. Today, hold some for yourself.", sub: "Your energy is a resource — check if you're running low." },
  { title: "A small decision today carries more weight than you think.", sub: "Pay attention to the quiet pull, not the loud push." },
  { title: "Your pattern of over-giving looks like kindness, but it's self-erasure.", sub: "Notice where you say yes when you mean maybe." },
  { title: "Today rewards stillness more than action.", sub: "You don't have to respond to everything immediately." },
  { title: "Someone's reaction to you isn't about you. It's about their pattern.", sub: "A good day to observe without absorbing." },
];

const dailyInsights = [
  '"The pattern you keep avoiding addressing is the one running your decisions."',
  '"You don\'t need more information. You need more honesty with yourself."',
  '"Your comfort zone isn\'t safe — it\'s just familiar."',
  '"The way you process silence says more about you than the way you process noise."',
  '"What you\'re afraid to say is what someone needs to hear."',
  '"Rest is not the opposite of productivity. It\'s the foundation."',
  '"You keep waiting for permission that only you can give."',
];

const dailyMoves = [
  { move: 'Say the thing before it becomes resentment.', label: 'Best Move' },
  { move: 'Ask for what you need without apologizing.', label: 'Best Move' },
  { move: 'Let one expectation go that isn\'t yours.', label: 'Best Move' },
  { move: 'Name the feeling instead of analyzing it.', label: 'Best Move' },
  { move: 'Choose one boundary and hold it gently.', label: 'Best Move' },
  { move: 'Respond, don\'t react. The pause is the power.', label: 'Best Move' },
  { move: 'Write down the thing you keep replaying.', label: 'Best Move' },
];

const journalPrompts = [
  'What do I need but avoid asking for?',
  'What pattern keeps showing up that I keep ignoring?',
  'If I were honest with myself right now, what would I say?',
  'What am I performing today that I don\'t actually want to do?',
  'What would I do differently if I wasn\'t afraid of being seen?',
  'What emotion have I been sitting on all week?',
  'What would the person I\'m becoming do right now?',
];

export default function TodayScreen() {
  const router = useRouter();
  const engagement = useEngagement();
  const dayIdx = getDayIndex();

  const [selectedMood, setSelectedMood] = useState<string | null>(
    engagement?.moodHistory?.[0]?.mood || null
  );
  const [expandedJournal, setExpandedJournal] = useState(false);
  const [journalText, setJournalText] = useState('');
  const [journalSaved, setJournalSaved] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (engagement) engagement.checkInToday();
  }, []);

  const signal = dailySignals[dayIdx];
  const insight = dailyInsights[dayIdx];
  const move = dailyMoves[dayIdx];
  const prompt = journalPrompts[dayIdx];
  const streak = engagement?.streak || 0;
  const lastReflection = engagement?.journalEntries?.[0];
  const reflectionsCount = engagement?.reflections || 0;

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    if (engagement) engagement.addMood(mood);
  };

  const handleSaveJournal = () => {
    if (journalText.trim() && engagement) {
      engagement.addJournalEntry(journalText);
      setJournalSaved(true);
      const newCount = engagement.reflections + 1;
      if (newCount >= 3) {
        setToastMessage('Reflection saved — you unlocked a deep reading!');
      } else {
        setToastMessage(`${3 - newCount} more reflection${3 - newCount !== 1 ? 's' : ''} to unlock your next reading`);
      }
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {showToast && (
        <Animated.View entering={FadeInDown.duration(250)} exiting={FadeOutUp.duration(250)} style={styles.toast}>
          <LinearGradient
            colors={theme.gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.toastInner}
          >
            <Text style={styles.toastCheck}>✓</Text>
            <Text style={styles.toastText}>{toastMessage}</Text>
          </LinearGradient>
        </Animated.View>
      )}

      <Animated.View entering={FadeInUp.duration(500).delay(0)}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getTimeGreeting()} {getTimeEmoji()}</Text>
            <Text style={styles.name}>Gy</Text>
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
              onPress={() => handleMoodSelect(mood.label)}
              style={[
                styles.moodBtn,
                selectedMood === mood.label && styles.moodBtnActive,
              ]}
            >
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              <Text
                style={[
                  styles.moodLabel,
                  selectedMood === mood.label && styles.moodLabelActive,
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
          {[
            { label: 'Calm', sub: 'emotional weather', width: '72%' as const, colors: ['#8B72CF', '#16A7A0'] as const },
            { label: 'Direct', sub: 'best move', width: '85%' as const, colors: ['#E8A87C', '#F7D875'] as const },
            { label: 'Testing', sub: 'avoid', width: '40%' as const, colors: ['#F4C7D2', '#8B72CF'] as const },
          ].map((item, index) => (
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
                      { width: item.width, backgroundColor: item.colors[0] },
                    ]}
                  />
                </View>
                <Text style={styles.energyLabel}>{item.label}</Text>
                <Text style={styles.energySub}>{item.sub}</Text>
              </View>
            </Animated.View>
          ))}
        </View>
      </View>

      {streak > 1 && (
        <Animated.View entering={FadeInUp.duration(500).delay(400)} style={styles.streakCard}>
          <Text style={styles.streakCardEmoji}>🔥</Text>
          <View style={styles.streakCardText}>
            <Text style={styles.streakCardTitle}>{streak}-day reflection streak</Text>
            <Text style={styles.streakCardSub}>
              You're building something real. Keep going.
            </Text>
          </View>
        </Animated.View>
      )}

      {lastReflection && !expandedJournal && (
        <Animated.View entering={FadeInUp.duration(500).delay(450)} style={styles.lastReflection}>
          <Text style={styles.lastReflectionLabel}>Last reflection</Text>
          <Text style={styles.lastReflectionText}>"{lastReflection.text}"</Text>
          <Text style={styles.lastReflectionDate}>{lastReflection.date}</Text>
        </Animated.View>
      )}

      <View style={styles.insightSection}>
        <Animated.View entering={FadeInUp.duration(500).delay(500)}>
          <Text style={styles.insightLabel}>One Insight For You</Text>
        </Animated.View>
        <Animated.View entering={FadeInUp.duration(500).delay(550)}>
          <View style={styles.insightCard}>
            <Text style={styles.insightText}>{insight}</Text>
            <Text style={styles.insightSub}>— for Aquarius Sun, Life Path 7</Text>
          </View>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInUp.duration(500).delay(600)}>
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
              <Text style={styles.journalSavedSub}>
                {engagement?.reflections >= 3
                  ? "You've unlocked a deep reading!"
                  : `${3 - reflectionsCount} more reflection${3 - reflectionsCount !== 1 ? 's' : ''} to unlock your next reading`
                }
              </Text>
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

      <Animated.View entering={FadeInUp.duration(500).delay(650)}>
        <View style={styles.moveCard}>
          <Text style={styles.moveLabel}>{move.label}</Text>
          <Text style={styles.moveText}>{move.move}</Text>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(500).delay(700)}>
        <TouchableOpacity
          style={styles.soulprintLink}
          onPress={() => router.push('/(tabs)/soulprint')}
          activeOpacity={0.85}
        >
          <View style={styles.soulprintIcon}>
            <Text style={styles.soulprintIconText}>✦</Text>
          </View>
          <View style={styles.soulprintText}>
            <Text style={styles.soulprintTitle}>View your Soulprint</Text>
            <Text style={styles.soulprintSub}>Your complete emotional blueprint</Text>
          </View>
          <Text style={styles.soulprintArrow}>→</Text>
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
    paddingBottom: 100,
  },
  toast: { marginBottom: 16 },
  toastInner: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: 'rgba(139,114,207,0.25)',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    shadowOpacity: 1,
    elevation: 6,
  },
  toastCheck: { fontSize: 18, color: '#FFFFFF' },
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
  streakCard: {
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(247,216,117,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(247,216,117,0.3)',
  },
  streakCardEmoji: { fontSize: 20 },
  streakCardText: { flex: 1 },
  streakCardTitle: { fontSize: 13, fontWeight: '500', color: theme.colors.ink },
  streakCardSub: { fontSize: 11, color: theme.colors.muted },
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
  soulprintLink: {
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
  soulprintIcon: {
    width: 44,
    height: 44,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8DDFB',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.06)',
  },
  soulprintIconText: { fontSize: 18 },
  soulprintText: { flex: 1 },
  soulprintTitle: { fontSize: 14, fontWeight: '500', color: theme.colors.ink },
  soulprintSub: { fontSize: 12, color: theme.colors.muted },
  soulprintArrow: { fontSize: 16, color: theme.colors.muted },
});
