// src/components/PatternAlertCard.tsx

import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { Card } from '@/src/design/primitives/Card'
import { Eyebrow } from '@/src/design/primitives/Eyebrow'
import { moodAlerts } from '@/src/lib/dailyContent'
import { colors, typography, spacing } from '@/src/design/tokens'

interface Props {
  mood: string | null
}

export default function PatternAlertCard({ mood }: Props) {
  if (!mood || !moodAlerts[mood]) return null

  return (
    <Animated.View entering={FadeInUp.duration(500)}>
      <Card variant="soft" padding="lg" style={styles.container}>
        <Eyebrow color={colors.royalViolet}>{"\u2726"} Pattern</Eyebrow>
        <Text style={styles.text}>{moodAlerts[mood]}</Text>
      </Card>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  text: {
    ...typography.scale.body,
    color: colors.deepSpace,
    lineHeight: 22,
  },
})
