// app/(onboarding)/welcome.tsx

import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { Screen } from '@/src/design/primitives/Screen'
import { Button } from '@/src/design/primitives/Button'
import { Eyebrow } from '@/src/design/primitives/Eyebrow'
import { colors, typography, spacing } from '@/src/design/tokens'

export default function WelcomeScreen() {
  const router = useRouter()

  return (
    <Screen>
      <View style={styles.container}>
        <Animated.View entering={FadeInUp.duration(600)} style={styles.content}>
          <Eyebrow>Your personal cosmos</Eyebrow>
          <Text style={styles.title}>Astrovy</Text>
          <Text style={styles.description}>
            Mapped from the moment you arrived.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).duration(500)}>
          <Button fullWidth size="lg" onPress={() => router.push('/(onboarding)/birth-date')}>
            Continue
          </Button>
        </Animated.View>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xxxl,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    ...typography.scale.display,
    fontSize: 64,
    color: colors.deepSpace,
    marginBottom: spacing.md,
  },
  description: {
    ...typography.scale.bodyLarge,
    color: colors.cosmicGray,
  },
})
