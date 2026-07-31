// src/design/primitives/Badge.tsx

import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors, typography, spacing, radii } from '../tokens'

type BadgeVariant = 'new' | 'premium' | 'pro' | 'astrology' | 'live' | 'beta' | 'soon' | 'free'

interface BadgeProps { variant: BadgeVariant; children: React.ReactNode }

const variants: Record<BadgeVariant, { bg: string; text: string; border?: string }> = {
  new:       { bg: colors.lightBg, text: colors.royalViolet, border: colors.pastelLilac },
  premium:   { bg: colors.royalViolet, text: colors.white },
  pro:       { bg: colors.deepSpace, text: colors.white },
  astrology: { bg: colors.pastelLilac, text: colors.deepSpace },
  live:      { bg: '#E8FFF4', text: '#14863E', border: '#BBF7D0' },
  beta:      { bg: '#FFF7E6', text: '#B45309', border: '#FDE68A' },
  soon:      { bg: 'rgba(15,15,35,0.06)', text: colors.cosmicGray },
  free:      { bg: colors.lightBg, text: colors.royalViolet, border: colors.pastelLilac },
}

export function Badge({ variant, children }: BadgeProps) {
  const v = variants[variant]
  return (
    <View style={[styles.base, { backgroundColor: v.bg, borderWidth: v.border ? 1 : 0, borderColor: v.border }]}>
      <Text style={[styles.text, { color: v.text }]}>{children}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  base: { paddingHorizontal: spacing.sm + 2, paddingVertical: 5, borderRadius: radii.full, alignSelf: 'flex-start' },
  text: { ...typography.scale.caption, fontWeight: typography.weights.semibold },
})
