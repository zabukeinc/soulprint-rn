// app/(onboarding)/generating.tsx

import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import { Screen } from '@/src/design/primitives/Screen'
import { Button } from '@/src/design/primitives/Button'
import { StarField } from '@/src/design/primitives/StarField'
import { colors, typography, spacing } from '@/src/design/tokens'

const STAGES = [
  { delay: 0, text: 'Reading your chart...' },
  { delay: 800, text: 'Mapping your patterns...' },
  { delay: 1600, text: 'Finding your archetype...' },
  { delay: 2400, text: 'Almost there...' },
]

export default function GeneratingScreen() {
  const router = useRouter()
  const [stage, setStage] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    STAGES.forEach((s, i) => {
      timers.push(setTimeout(() => setStage(i), s.delay))
    })
    timers.push(setTimeout(() => setDone(true), 3200))
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <Screen dark>
      <StarField />
      <View style={styles.container}>
        <View style={styles.stageArea}>
          {STAGES.map((s, i) => (
            stage >= i && (
              <Animated.View key={i} entering={FadeIn.duration(400)} exiting={FadeOut.duration(200)}>
                <Text style={[styles.stageText, i === stage ? styles.stageActive : styles.stageInactive]}>
                  {s.text}
                </Text>
              </Animated.View>
            )
          ))}
        </View>

        {done && (
          <Animated.View entering={FadeIn.duration(400)}>
            <Button fullWidth size="lg" onPress={() => router.push('/(onboarding)/first-mirror')}>
              See what the stars say
            </Button>
          </Animated.View>
        )}
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: spacing.xxxl, paddingBottom: spacing.xxxl },
  stageArea: { flex: 1, justifyContent: 'center', gap: spacing.md },
  stageText: { ...typography.scale.h3, textAlign: 'center' },
  stageActive: { color: colors.white },
  stageInactive: { color: colors.softLavender, opacity: 0.4 },
})
