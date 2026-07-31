// src/components/WeeklyReadingCard.tsx

import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { Card } from '@/src/design/primitives/Card'
import { Button } from '@/src/design/primitives/Button'
import { Eyebrow } from '@/src/design/primitives/Eyebrow'
import { getWeeklyReading } from '@/src/lib/dailyContent'
import { colors, typography, spacing } from '@/src/design/tokens'

interface Props {
  visible: boolean
  onDismiss: () => void
}

export default function WeeklyReadingCard({ visible, onDismiss }: Props) {
  if (!visible) return null

  const reading = getWeeklyReading()

  return (
    <Animated.View entering={FadeInUp.duration(500)}>
      <Card variant="dark" padding="lg" style={styles.container}>
        <Eyebrow color={colors.softLavender}>This week</Eyebrow>
        <Text style={styles.title}>{reading.title}</Text>
        <Text style={styles.body}>{reading.body}</Text>
        <Button variant="ghost" size="sm" onPress={onDismiss}>
          Got it
        </Button>
      </Card>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  title: {
    ...typography.scale.h3,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  body: {
    ...typography.scale.body,
    color: colors.softLavender,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
})
