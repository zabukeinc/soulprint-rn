// src/design/primitives/Button.tsx

import React from 'react'
import { Pressable, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { colors, typography, spacing, radii, shadows } from '../tokens'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'dark'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  children: React.ReactNode
  onPress?: () => void
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
  fullWidth?: boolean
  style?: ViewStyle
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const variantStyles: Record<ButtonVariant, { bg: string; text: string; border?: string }> = {
  primary:   { bg: colors.royalViolet, text: colors.white },
  secondary: { bg: colors.lightBg, text: colors.royalViolet, border: colors.pastelLilac },
  ghost:     { bg: 'transparent', text: colors.deepSpace, border: 'rgba(15,15,35,0.15)' },
  dark:      { bg: colors.deepSpace, text: colors.white },
}

const sizeStyles: Record<ButtonSize, { paddingVertical: number; paddingHorizontal: number; fontSize: number }> = {
  sm: { paddingVertical: 8, paddingHorizontal: 20, fontSize: 12 },
  md: { paddingVertical: 12, paddingHorizontal: 28, fontSize: 14 },
  lg: { paddingVertical: 16, paddingHorizontal: 36, fontSize: 16 },
}

export function Button({
  variant = 'primary', size = 'md', children, onPress,
  disabled = false, loading = false, icon, fullWidth = false, style,
}: ButtonProps) {
  const scale = useSharedValue(1)
  const vs = variantStyles[variant]
  const ss = sizeStyles[size]

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }))

  const handlePressIn = () => { scale.value = withSpring(0.97, { damping: 15, stiffness: 300 }) }
  const handlePressOut = () => { scale.value = withSpring(1, { damping: 15, stiffness: 300 }) }

  const showShadow = variant === 'primary' && !disabled && !loading

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[
        styles.base,
        { backgroundColor: vs.bg, paddingVertical: ss.paddingVertical, paddingHorizontal: ss.paddingHorizontal, opacity: disabled ? 0.5 : 1 },
        vs.border && { borderWidth: 1.5, borderColor: vs.border },
        showShadow && shadows.ctaPrimary,
        fullWidth && { width: '100%' },
        animatedStyle,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={vs.text} size="small" />
      ) : (
        <>
          {icon}
          <Text style={[styles.text, { color: vs.text, fontSize: ss.fontSize }]}>{children}</Text>
        </>
      )}
    </AnimatedPressable>
  )
}

const styles = StyleSheet.create({
  base: { borderRadius: radii.full, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  text: { fontFamily: typography.families.heading, fontWeight: typography.weights.semibold, letterSpacing: 0.14 },
})
