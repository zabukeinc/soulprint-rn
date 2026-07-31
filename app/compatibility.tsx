// app/compatibility.tsx

import React, { useMemo, useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { Screen } from '@/src/design/primitives'
import { Card } from '@/src/design/primitives'
import { Input } from '@/src/design/primitives'
import { Button } from '@/src/design/primitives'
import { Badge } from '@/src/design/primitives'
import { Eyebrow } from '@/src/design/primitives'
import { colors, typography, spacing, radii, shadows } from '@/src/design/tokens'
import { useProfile } from '@/src/context/ProfileContext'
import {
  calculateNatalChart,
  calculateCompatibility,
  getZodiacSign,
  getZodiacInfo,
  ZodiacSign,
  CompatibilityResult,
} from '@/src/lib/astrology'

const ALL_SIGNS: ZodiacSign[] = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
]

export default function CompatibilityScreen() {
  const router = useRouter()
  const { profile } = useProfile()
  const [partnerName, setPartnerName] = useState('')
  const [partnerSign, setPartnerSign] = useState<ZodiacSign | null>(null)
  const [revealed, setRevealed] = useState(false)

  const userSign = useMemo<ZodiacSign | null>(() => {
    if (!profile?.birth?.date) return null
    const [, m, d] = profile.birth.date.split('-').map(Number)
    return getZodiacSign(m, d)
  }, [profile])

  const result = useMemo<CompatibilityResult | null>(() => {
    if (!userSign || !partnerSign) return null
    return calculateCompatibility(userSign, partnerSign)
  }, [userSign, partnerSign])

  const userSignInfo = userSign ? getZodiacInfo(userSign) : null
  const partnerSignInfo = partnerSign ? getZodiacInfo(partnerSign) : null
  const canReveal = !!partnerSign && !!userSign

  const handleReveal = () => {
    if (canReveal) setRevealed(true)
  }

  const ScoreRow = ({ label, score }: { label: string; score: number }) => (
    <View style={styles.scoreRow}>
      <Text style={styles.scoreLabel}>{label}</Text>
      <View style={styles.scoreBarBg}>
        <View style={[styles.scoreBarFill, { width: `${score}%` }]} />
      </View>
      <Text style={styles.scoreValue}>{score}%</Text>
    </View>
  )

  return (
    <Screen>
      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()} hitSlop={8}>
            <Text style={styles.backIcon}>{'<'}</Text>
          </Pressable>
          <View style={styles.headerCenter}>
            <Eyebrow color={colors.royalViolet} showLine={false}>
              Compatibility
            </Eyebrow>
            <Text style={styles.headerTitle}>How your signs meet.</Text>
          </View>
          <View style={styles.backPlaceholder} />
        </View>

        {/* Inputs */}
        <Animated.View entering={FadeInUp.duration(500).delay(50)} style={styles.inputSection}>
          <Text style={styles.inputLabel}>Their name (optional)</Text>
          <Input
            value={partnerName}
            onChangeText={setPartnerName}
            placeholder="e.g. Jordan"
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(500).delay(100)} style={styles.inputSection}>
          <Text style={styles.inputLabel}>Their sign</Text>
          <View style={styles.signGrid}>
            {ALL_SIGNS.map((sign) => {
              const info = getZodiacInfo(sign)
              const selected = partnerSign === sign
              return (
                <Pressable
                  key={sign}
                  onPress={() => setPartnerSign(sign)}
                  style={[styles.signBtn, selected && styles.signBtnActive]}
                >
                  <Text style={styles.signSymbol}>{info.symbol}</Text>
                  <Text
                    style={[styles.signBtnText, selected && styles.signBtnTextActive]}
                  >
                    {info.name}
                  </Text>
                </Pressable>
              )
            })}
          </View>
        </Animated.View>

        {!revealed && (
          <Animated.View entering={FadeInUp.duration(500).delay(150)}>
            <Button onPress={handleReveal} size="lg" fullWidth disabled={!canReveal}>
              Reveal
            </Button>
            {!canReveal && userSign && (
              <Text style={styles.hint}>Pick their sign to reveal.</Text>
            )}
            {!userSign && (
              <Text style={styles.hint}>Add your birth date to unlock compatibility.</Text>
            )}
          </Animated.View>
        )}

        {/* Result */}
        {revealed && result && (
          <View style={styles.resultSection}>
            <Animated.View entering={FadeInUp.duration(500)} style={styles.resultHeader}>
              <Eyebrow color={colors.royalViolet} showLine={false}>
                Compatibility Reading
              </Eyebrow>
              <Text style={styles.resultTitle}>
                {partnerName.trim() || 'You'} & {userSignInfo?.name}
              </Text>
              <Text style={styles.resultSub}>
                {userSignInfo?.name} Sun \u00B7 {partnerSignInfo?.name} Sun
              </Text>
            </Animated.View>

            {/* Overall score card */}
            <Animated.View entering={FadeInUp.duration(500).delay(50)}>
              <Card variant="gradient" padding="lg" style={styles.scoreCard}>
                <Eyebrow color={colors.white}>Overall match</Eyebrow>
                <Text style={styles.scoreBig}>{result.overallScore}%</Text>
                <Text style={styles.scoreSummary}>{result.summary}</Text>
                <View style={styles.scoresGroup}>
                  <View style={styles.scoreLine}>
                    <Text style={styles.scoreLineLabel}>Love</Text>
                    <Text style={styles.scoreLineValue}>{result.loveScore}%</Text>
                  </View>
                  <View style={styles.scoreLine}>
                    <Text style={styles.scoreLineLabel}>Communication</Text>
                    <Text style={styles.scoreLineValue}>{result.communicationScore}%</Text>
                  </View>
                  <View style={styles.scoreLine}>
                    <Text style={styles.scoreLineLabel}>Friendship</Text>
                    <Text style={styles.scoreLineValue}>{result.friendshipScore}%</Text>
                  </View>
                </View>
              </Card>
            </Animated.View>

            {/* Detailed bars */}
            <Animated.View entering={FadeInUp.duration(500).delay(100)}>
              <Card variant="light" padding="lg" style={styles.detailCard}>
                <ScoreRow label="Love" score={result.loveScore} />
                <ScoreRow label="Communication" score={result.communicationScore} />
                <ScoreRow label="Friendship" score={result.friendshipScore} />
                <ScoreRow label="Overall" score={result.overallScore} />
              </Card>
            </Animated.View>

            {/* Strengths */}
            <Animated.View entering={FadeInUp.duration(500).delay(150)}>
              <Card variant="light" padding="lg" style={styles.detailCard}>
                <View style={styles.detailHeader}>
                  <Text style={styles.detailEmoji}>{'\u{1F50E}'}</Text>
                  <Eyebrow color={colors.royalViolet} showLine={false}>
                    Strengths
                  </Eyebrow>
                </View>
                {result.strengths.map((s) => (
                  <View key={s} style={styles.listItem}>
                    <Text style={styles.listDot}>{'\u2022'}</Text>
                    <Text style={styles.listText}>{s}</Text>
                  </View>
                ))}
              </Card>
            </Animated.View>

            {/* Challenges */}
            <Animated.View entering={FadeInUp.duration(500).delay(200)}>
              <Card variant="light" padding="lg" style={styles.detailCard}>
                <View style={styles.detailHeader}>
                  <Text style={styles.detailEmoji}>{'\u26A1'}</Text>
                  <Eyebrow color={colors.royalViolet} showLine={false}>
                    Challenges
                  </Eyebrow>
                </View>
                {result.challenges.map((c) => (
                  <View key={c} style={styles.listItem}>
                    <Text style={styles.listDot}>{'\u2022'}</Text>
                    <Text style={styles.listText}>{c}</Text>
                  </View>
                ))}
              </Card>
            </Animated.View>

            {/* Advice */}
            <Animated.View entering={FadeInUp.duration(500).delay(250)}>
              <Card variant="soft" padding="lg" style={styles.adviceCard}>
                <Badge variant="astrology">Advice</Badge>
                <Text style={styles.adviceText}>{result.advice}</Text>
              </Card>
            </Animated.View>
          </View>
        )}
      </Animated.ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: 130,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(123,97,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  backIcon: { fontSize: 18, color: colors.deepSpace, fontWeight: '700' },
  backPlaceholder: { width: 40 },
  headerCenter: { alignItems: 'center', flex: 1 },
  headerTitle: {
    ...typography.scale.h3,
    color: colors.deepSpace,
  },
  inputSection: { marginBottom: spacing.md },
  inputLabel: {
    ...typography.scale.caption,
    fontWeight: typography.weights.bold,
    color: colors.deepSpace,
    marginBottom: spacing.xs,
  },
  signGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  signBtn: {
    width: '23%',
    paddingVertical: spacing.sm,
    borderRadius: radii.lg,
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(123,97,255,0.12)',
  },
  signBtnActive: {
    backgroundColor: colors.royalViolet,
    borderColor: 'transparent',
  },
  signSymbol: { fontSize: 16, marginBottom: 2 },
  signBtnText: {
    ...typography.scale.caption,
    fontWeight: typography.weights.bold,
    color: colors.cosmicGray,
  },
  signBtnTextActive: { color: colors.white },
  hint: {
    ...typography.scale.caption,
    color: colors.cosmicGray,
    textAlign: 'center',
    marginTop: spacing.sm + 2,
  },
  resultSection: { marginTop: spacing.md },
  resultHeader: { alignItems: 'center', marginBottom: spacing.md },
  resultTitle: {
    ...typography.scale.h2,
    color: colors.deepSpace,
    marginBottom: spacing.xs,
  },
  resultSub: {
    ...typography.scale.caption,
    color: colors.cosmicGray,
  },
  scoreCard: { marginBottom: spacing.md },
  scoreBig: {
    ...typography.scale.h1,
    color: colors.white,
    marginVertical: spacing.xs,
  },
  scoreSummary: {
    ...typography.scale.body,
    color: colors.pastelLilac,
    marginBottom: spacing.md,
  },
  scoresGroup: { gap: spacing.xs },
  scoreLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scoreLineLabel: {
    ...typography.scale.caption,
    color: colors.pastelLilac,
  },
  scoreLineValue: {
    ...typography.scale.caption,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },
  detailCard: { marginBottom: spacing.md },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm + 2,
  },
  scoreLabel: {
    ...typography.scale.caption,
    fontWeight: typography.weights.semibold,
    color: colors.deepSpace,
    width: 90,
  },
  scoreBarBg: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(123,97,255,0.10)',
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: colors.royalViolet,
  },
  scoreValue: {
    ...typography.scale.caption,
    fontWeight: typography.weights.bold,
    color: colors.royalViolet,
    width: 40,
    textAlign: 'right',
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  detailEmoji: { fontSize: 16 },
  listItem: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  listDot: {
    ...typography.scale.body,
    color: colors.royalViolet,
    fontWeight: typography.weights.bold,
  },
  listText: {
    ...typography.scale.caption,
    color: colors.deepSpace,
    flex: 1,
    lineHeight: 20,
  },
  adviceCard: {},
  adviceText: {
    ...typography.scale.body,
    color: colors.deepSpace,
    marginTop: spacing.sm + 2,
    fontStyle: 'italic',
  },
})
