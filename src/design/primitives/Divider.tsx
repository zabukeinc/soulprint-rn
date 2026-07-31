// src/design/primitives/Divider.tsx

import React from 'react'
import { View, StyleSheet } from 'react-native'
import { colors, spacing } from '../tokens'

interface DividerProps { marginVertical?: keyof typeof spacing }

export function Divider({ marginVertical = 'md' }: DividerProps) {
  return <View style={[styles.line, { marginVertical: spacing[marginVertical] }]} />
}

const styles = StyleSheet.create({ line: { height: 1, backgroundColor: 'rgba(123,97,255,0.10)' } })
