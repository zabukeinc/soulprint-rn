// src/design/primitives/Eyebrow.tsx

import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors, typography, spacing } from '../tokens'

interface EyebrowProps {
  children: React.ReactNode
  color?: string
  showLine?: boolean
}

export function Eyebrow({ children, color, showLine = true }: EyebrowProps) {
  return (
    <View style={styles.container}>
      {showLine && <View style={[styles.line, { backgroundColor: color || colors.royalViolet }]} />}
      <Text style={[styles.text, { color: color || colors.royalViolet }]}>{children}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  line: { width: 24, height: 2, borderRadius: 2 },
  text: { ...typography.scale.eyebrow, textTransform: 'uppercase' },
})
