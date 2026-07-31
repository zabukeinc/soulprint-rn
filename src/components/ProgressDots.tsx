// src/components/ProgressDots.tsx

import React from 'react'
import { View, StyleSheet } from 'react-native'
import { colors, spacing } from '@/src/design/tokens'

interface ProgressDotsProps {
  total: number
  current: number
}

export default function ProgressDots({ total, current }: ProgressDotsProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i < current && styles.activeDot,
          ]}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(123,97,255,0.15)',
  },
  activeDot: {
    backgroundColor: colors.royalViolet,
    width: 24,
  },
})
