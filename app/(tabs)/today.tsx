// app/(tabs)/today.tsx

import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { Screen } from '@/src/design/primitives/Screen'
import { Card } from '@/src/design/primitives/Card'
import { Chip } from '@/src/design/primitives/Chip'
import { Button } from '@/src/design/primitives/Button'
import { Eyebrow } from '@/src/design/primitives/Eyebrow'
import { Divider } from '@/src/design/primitives/Divider'
import { Input } from '@/src/design/primitives/Input'
import { useEngagement } from '@/src/hooks/useEngagement'
import { useTier } from '@/src/context/TierContext'
import { useProfile } from '@/src/context/ProfileContext'
import { calculateLifePath, getZodiacSign, getZodiacInfo } from '@/src/lib/astrology'
import { getTodaySignal, getTodayInsight, getTodayMove } from '@/src/lib/dailyContent'
import PatternAlertCard from '@/src/components/PatternAlertCard'
import WeeklyReadingCard from '@/src/components/WeeklyReadingCard'
import { colors, typography, spacing, radii } from '@/src/design/tokens'

const MOODS = [
  { emoji: '\uD83D\uDC9B', label: 'Steady' },
  { emoji: '\uD83C\uDF0A', label: 'Tender' },
  { emoji: '\u26A1', label: 'Restless' },
  { emoji: '\uD83E\uDDCA', label: 'Quiet' },
]

const MOOD_RESPONSES: Record<string, string> = {
  Steady: 'Grounded today. Trust what\u2019s working.',
  Tender: 'Feelings close to the surface. That\u2019s information, not a flaw.',
  Restless: 'Something wants your attention. Sit with the question.',
  Quiet: 'Quiet is still a signal. Your body may need rest, not distraction.',
}

const JOURNAL_PROMPTS = [
  'What do I need but avoid asking for?',
  'What pattern keeps showing up that I keep ignoring?',
  'If I were honest with myself right now, what would I say?',
  'What am I performing today that I don\u2019t actually want to do?',
  'What would I do differently if I wasn\u2019t afraid of being seen?',
  'What emotion have I been sitting on all week?',
  'What would the person I\u2019m becoming do right now?',
]

function getGreeting() {
  const h = new Date().getHours()
  if (h < 6) return 'Still awake?'
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  if (h < 21) return 'Good evening'
  return 'Still awake?'
}

function getDayIndex() {
  return (new Date().getDate() + new Date().getMonth()) % 7
}

export default function TodayScreen() {
  const router = useRouter()
  const engagement = useEngagement()
  const { isPremium } = useTier()
  const { profile } = useProfile()
  const dayIdx = getDayIndex()

  const [selectedMood, setSelectedMood] = useState<string | null>(
    engagement?.moodHistory?.[0]?.mood || null
  )
  const [expandedJournal, setExpandedJournal] = useState(false)
  const [journalText, setJournalText] = useState('')
  const [journalSaved, setJournalSaved] = useState(false)

  useEffect(() => {
    if (engagement) engagement.checkInToday()
  }, [])

  const signal = getTodaySignal()
  const insight = getTodayInsight()
  const move = getTodayMove()
  const prompt = JOURNAL_PROMPTS[dayIdx]
  const streak = engagement?.streak || 0

  const personalization = useMemo(() => {
    if (!profile?.birth?.date) return ''
    const [y, m, d] = profile.birth.date.split('-').map(Number)
    const sign = getZodiacSign(m, d)
    const lp = calculateLifePath(y, m, d)
    const zi = getZodiacInfo(sign)
    return `\u2014 for ${zi.name} Sun, Life Path ${lp}`
  }, [profile])

  const consecutiveMood = engagement?.getConsecutiveMood?.() || null
  const weeklyStatus = engagement?.getWeeklyReadingStatus?.()
  const showWeeklyCard = weeklyStatus?.isNewWeek && !engagement?.dismissedWeeklyReading

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood)
    engagement?.addMood(mood)
  }

  const handleSaveJournal = () => {
    if (journalText.trim() && engagement) {
      engagement.addJournalEntry(journalText, prompt)
      setJournalSaved(true)
    }
  }

  return (
    <Screen>
      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Header */}
        <Animated.View entering={FadeInUp.duration(500)}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.name}>{profile?.name || 'Friend'}</Text>
            </View>
            {streak > 0 && (
              <View style={styles.streakBadge}>
                <Text style={styles.streakEmoji}>{"\uD83D\uDD25"}</Text>
                <Text style={styles.streakNum}>{streak}</Text>
              </View>
            )}
          </View>
        </Animated.View>

        {/* 2. Mood check-in */}
        <Animated.View entering={FadeInUp.duration(500).delay(50)}>
          <Text style={styles.moodQuestion}>How's today feeling?</Text>
        </Animated.View>
        <View style={styles.moodRow}>
          {MOODS.map((mood, i) => (
            <Animated.View key={mood.label} entering={FadeInUp.duration(500).delay(100 + i * 60)} style={{ flex: 1 }}>
              <Chip
                label={mood.label}
                emoji={mood.emoji}
                selected={selectedMood === mood.label}
                onPress={() => handleMoodSelect(mood.label)}
              />
            </Animated.View>
          ))}
        </View>
        {selectedMood && MOOD_RESPONSES[selectedMood] && (
          <Animated.View entering={FadeInUp.duration(400)}>
            <Text style={styles.moodResponse}>{MOOD_RESPONSES[selectedMood]}</Text>
          </Animated.View>
        )}

        {/* 3. Daily reading (merged card) */}
        <Animated.View entering={FadeInUp.duration(500).delay(200)}>
          <Card variant="gradient" padding="lg" style={styles.dailyCard}>
            <Eyebrow color={colors.white}>Today</Eyebrow>
            <Text style={styles.signalTitle}>{signal.title}</Text>
            <Text style={styles.signalSub}>{signal.sub}</Text>
            <Divider marginVertical="md" />
            <Text style={styles.insightText}>"{insight}"</Text>
            <Divider marginVertical="md" />
            <Text style={styles.moveLabel}>Try this</Text>
            <Text style={styles.moveText}>{move}</Text>
            {personalization ? <Text style={styles.personalization}>{personalization}</Text> : null}
          </Card>
        </Animated.View>

        {/* 4. Journal */}
        <Animated.View entering={FadeInUp.duration(500).delay(250)}>
          {expandedJournal ? (
            <Card variant="light" padding="lg">
              <Text style={styles.journalPrompt}>{prompt}</Text>
              {journalSaved ? (
                <View style={styles.journalSaved}>
                  <Text style={styles.journalSavedTitle}>{"\u2713"} Saved</Text>
                  <Text style={styles.journalSavedSub}>Kept safe, just for you.</Text>
                </View>
              ) : (
                <>
                  <Input
                    value={journalText}
                    onChangeText={setJournalText}
                    placeholder="Write freely..."
                    multiline
                  />
                  <View style={styles.journalFooter}>
                    <Text style={styles.journalHint}>Kept only for you</Text>
                    <Button size="sm" onPress={handleSaveJournal} disabled={!journalText.trim()}>
                      Save
                    </Button>
                  </View>
                </>
              )}
            </Card>
          ) : (
            <Card variant="light" padding="lg" onPress={() => setExpandedJournal(true)}>
              <Eyebrow>Reflect</Eyebrow>
              <Text style={styles.journalPreview}>{prompt}</Text>
            </Card>
          )}
        </Animated.View>

        {/* 5. Pattern alert (conditional) */}
        {consecutiveMood && (
          <Animated.View entering={FadeInUp.duration(400)}>
            <PatternAlertCard mood={consecutiveMood} />
          </Animated.View>
        )}

        {/* 6. Weekly reading (conditional) */}
        {showWeeklyCard && (
          <Animated.View entering={FadeInUp.duration(400)}>
            <WeeklyReadingCard
              visible={true}
              onDismiss={() => engagement?.dismissWeeklyReading?.()}
            />
          </Animated.View>
        )}

        {/* 7. Quick explore */}
        <Animated.View entering={FadeInUp.duration(500).delay(300)}>
          <Eyebrow>Explore</Eyebrow>
          <View style={styles.exploreRow}>
            <Card variant="soft" padding="md" style={styles.exploreCard} onPress={() => router.push('/tarot')}>
              <Text style={styles.exploreTitle}>Tarot</Text>
              <Text style={styles.exploreSub}>
                {engagement?.canDrawTarot?.(isPremium)
                  ? isPremium
                    ? `${engagement?.getTarotDrawsRemaining?.(isPremium)} draws left`
                    : 'Your card is waiting'
                  : 'Return tomorrow'}
              </Text>
            </Card>
            <Card variant="soft" padding="md" style={styles.exploreCard} onPress={() => router.push('/horoscope')}>
              <Text style={styles.exploreTitle}>Horoscope</Text>
              <Text style={styles.exploreSub}>Today's reading</Text>
            </Card>
          </View>
        </Animated.View>
      </Animated.ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xxl, paddingBottom: 130 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  greeting: { ...typography.scale.caption, color: colors.cosmicGray },
  name: { ...typography.scale.h1, color: colors.deepSpace },
  streakBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16, backgroundColor: 'rgba(123,97,255,0.12)' },
  streakEmoji: { fontSize: 12 },
  streakNum: { ...typography.scale.caption, fontWeight: typography.weights.bold, color: colors.royalViolet },
  moodQuestion: { ...typography.scale.body, fontWeight: typography.weights.medium, color: colors.deepSpace, marginBottom: spacing.sm },
  moodRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  moodResponse: { ...typography.scale.caption, color: colors.deepSpace, backgroundColor: 'rgba(123,97,255,0.08)', borderRadius: radii.lg, padding: spacing.md, marginBottom: spacing.md },
  dailyCard: { marginBottom: spacing.md },
  signalTitle: { ...typography.scale.h3, color: colors.white, marginTop: spacing.sm, marginBottom: spacing.xs },
  signalSub: { ...typography.scale.body, color: colors.pastelLilac },
  insightText: { ...typography.scale.body, color: colors.white, fontStyle: 'italic' },
  moveLabel: { ...typography.scale.caption, fontWeight: typography.weights.semibold, color: colors.pastelLilac, marginBottom: 4 },
  moveText: { ...typography.scale.body, color: colors.white },
  personalization: { ...typography.scale.caption, color: colors.pastelLilac, opacity: 0.7, marginTop: spacing.sm },
  journalPrompt: { ...typography.scale.body, color: colors.deepSpace, marginBottom: spacing.sm, fontWeight: typography.weights.medium },
  journalPreview: { ...typography.scale.body, color: colors.cosmicGray },
  journalSaved: { paddingVertical: spacing.lg, alignItems: 'center' },
  journalSavedTitle: { ...typography.scale.h3, color: colors.deepSpace, marginBottom: 4 },
  journalSavedSub: { ...typography.scale.caption, color: colors.cosmicGray },
  journalFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm },
  journalHint: { ...typography.scale.caption, color: colors.cosmicGray },
  exploreRow: { flexDirection: 'row', gap: spacing.sm },
  exploreCard: { flex: 1 },
  exploreTitle: { ...typography.scale.body, fontWeight: typography.weights.semibold, color: colors.deepSpace, marginBottom: 4 },
  exploreSub: { ...typography.scale.caption, color: colors.cosmicGray },
})
