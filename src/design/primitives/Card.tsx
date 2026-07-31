// src/design/primitives/Card.tsx

import React from 'react'
import { Pressable, View, StyleSheet, ViewStyle } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { colors, spacing, radii, shadows } from '../tokens'

type CardVariant = 'light' | 'dark' | 'gradient' | 'soft'

interface CardProps {
  variant?: CardVariant
  children: React.ReactNode
  padding?: keyof typeof spacing
  radius?: keyof typeof radii
  shadow?: keyof typeof shadows
  onPress?: () => void
  style?: ViewStyle
}

const variantConfig: Record<CardVariant, { bg?: string; gradient?: string[]; border?: string }> = {
  light:    { bg: colors.white, border: 'rgba(123,97,255,0.12)' },
  dark:     { bg: colors.deepSpace },
  gradient: { gradient: ['#A78BFF', '#7B61FF'] },
  soft:     { bg: colors.lightBg, border: 'rgba(123,97,255,0.10)' },
}

export function Card({ variant = 'light', children, padding = 'lg', radius = 'xl', shadow = 'card', onPress, style }: CardProps) {
  const config = variantConfig[variant]
  const baseStyle = {
    borderRadius: radii[radius],
    padding: spacing[padding],
    ...(config.border && { borderWidth: 1, borderColor: config.border }),
    ...shadows[shadow],
  }

  if (config.gradient) {
    const content = (
      <LinearGradient colors={config.gradient as [string, string]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[baseStyle, style]}>
        {children}
      </LinearGradient>
    )
    if (onPress) return <Pressable onPress={onPress}>{content}</Pressable>
    return content
  }

  if (onPress) {
    return <Pressable onPress={onPress} style={[baseStyle, { backgroundColor: config.bg }, style]}>{children}</Pressable>
  }
  return <View style={[baseStyle, { backgroundColor: config.bg }, style]}>{children}</View>
}
