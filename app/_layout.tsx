// app/_layout.tsx

import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ProfileProvider } from '@/src/context/ProfileContext'
import { TierProvider } from '@/src/context/TierContext'
import { useAstrovyFonts } from '@/src/design/fonts'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { colors } from '@/src/design/tokens'

export default function RootLayout() {
  const { loaded, error } = useAstrovyFonts()

  if (!loaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.royalViolet} size="large" />
      </View>
    )
  }

  return (
    <SafeAreaProvider>
      <ProfileProvider>
        <TierProvider>
          <Stack screenOptions={{ headerShown: false }} />
          <StatusBar style="dark" />
        </TierProvider>
      </ProfileProvider>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.lightBg,
  },
})
