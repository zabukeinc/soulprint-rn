// src/design/primitives/Screen.tsx

import React from 'react'
import { View, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { colors } from '../tokens'

interface ScreenProps { children: React.ReactNode; dark?: boolean; edges?: ('top' | 'bottom' | 'left' | 'right')[] }

export function Screen({ children, dark = false, edges = ['top'] }: ScreenProps) {
  if (dark) {
    return (
      <SafeAreaView style={styles.container} edges={edges}>
        <LinearGradient colors={['#7B61FF', '#0F0F23']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
        <View style={styles.content}>{children}</View>
      </SafeAreaView>
    )
  }
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.lightBg }]} edges={edges}>
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({ container: { flex: 1 }, content: { flex: 1 } })
