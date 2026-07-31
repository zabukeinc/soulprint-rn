// src/design/primitives/Chip.tsx

import React from 'react'
import { Pressable, Text, StyleSheet } from 'react-native'
import { colors, typography, spacing, radii } from '../tokens'

interface ChipProps { label: string; emoji?: string; selected: boolean; onPress: () => void }

export function Chip({ label, emoji, selected, onPress }: ChipProps) {
  return (
    <Pressable onPress={onPress} style={[styles.base, selected && styles.selected]}>
      {emoji && <Text style={styles.emoji}>{emoji}</Text>}
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: { flex: 1, paddingVertical: spacing.sm, borderRadius: radii.lg, alignItems: 'center', backgroundColor: colors.white, borderWidth: 1, borderColor: 'rgba(123,97,255,0.12)' },
  selected: { backgroundColor: colors.royalViolet, borderColor: 'transparent' },
  emoji: { fontSize: 18, marginBottom: 2 },
  label: { ...typography.scale.caption, fontWeight: typography.weights.bold, color: colors.cosmicGray },
  labelSelected: { color: colors.white },
})
