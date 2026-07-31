// src/design/primitives/Input.tsx

import React from 'react'
import { TextInput, StyleSheet } from 'react-native'
import { colors, typography, spacing, radii } from '../tokens'

interface InputProps {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  multiline?: boolean
  numberOfLines?: number
}

export function Input({ value, onChangeText, placeholder, multiline = false, numberOfLines = 1 }: InputProps) {
  return (
    <TextInput
      style={[styles.base, multiline && styles.multiline]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.cosmicGray + '80'}
      multiline={multiline}
      numberOfLines={numberOfLines}
      textAlignVertical={multiline ? 'top' : 'center'}
    />
  )
}

const styles = StyleSheet.create({
  base: { ...typography.scale.body, color: colors.deepSpace, backgroundColor: colors.lightBg, borderRadius: radii.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 2, borderWidth: 1, borderColor: 'rgba(123,97,255,0.10)' },
  multiline: { minHeight: 60 },
})
