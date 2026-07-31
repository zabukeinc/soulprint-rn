// app/(tabs)/decode.tsx

import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { Screen, Card, Badge, Eyebrow, Button } from '@/src/design/primitives'
import { colors, typography, spacing } from '@/src/design/tokens'
import { useTier } from '@/src/context/TierContext'

interface ReadingItem {
  id: string
  title: string
  subtitle: string
  href?: string
  soon?: boolean
}

const READINGS: ReadingItem[] = [
  {
    id: 'full-chart',
    title: 'Full Chart',
    subtitle: 'Your chart and the archetype it shapes.',
    href: '/soulprint',
  },
  {
    id: 'love',
    title: 'Love',
    subtitle: 'How you love and why.',
    href: '/love',
  },
  {
    id: 'compatibility',
    title: 'Compatibility',
    subtitle: 'How your signs meet.',
    href: '/compatibility',
  },
  {
    id: 'palm',
    title: 'Palm Reading',
    subtitle: 'Coming soon.',
    soon: true,
  },
]

export default function DecodeScreen() {
  const router = useRouter()
  const { isPremium } = useTier()

  return (
    <Screen>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInUp.duration(500)}>
          <View style={styles.headerRow}>
            <Eyebrow>Decode</Eyebrow>
            <Badge variant={isPremium ? 'premium' : 'free'}>
              {isPremium ? 'Premium' : 'Free'}
            </Badge>
          </View>
          <Text style={styles.headerTitle}>Readings</Text>
        </Animated.View>

        <View style={styles.list}>
          {READINGS.map((item, index) => {
            const disabled = !!item.soon
            return (
              <Animated.View
                key={item.id}
                entering={FadeInUp.duration(500).delay(80 + index * 70)}
              >
                <Card
                  variant="light"
                  padding="lg"
                  style={disabled ? styles.cardDisabled : undefined}
                  onPress={disabled ? undefined : () => item.href && router.push(item.href)}
                >
                  <View style={styles.cardHeader}>
                    <Text
                      style={[styles.cardTitle, disabled && styles.cardTitleDisabled]}
                    >
                      {item.title}
                    </Text>
                    {item.soon && <Badge variant="soon">Soon</Badge>}
                  </View>
                  <Text
                    style={[styles.cardSub, disabled && styles.cardSubDisabled]}
                  >
                    {item.subtitle}
                  </Text>
                </Card>
              </Animated.View>
            )
          })}
        </View>

        {!isPremium && (
          <Animated.View entering={FadeInUp.duration(500).delay(400)}>
            <Button
              variant="primary"
              fullWidth
              onPress={() => router.push('/pricing')}
            >
              Unlock all readings
            </Button>
          </Animated.View>
        )}
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: 130,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitle: {
    ...typography.scale.h1,
    color: colors.deepSpace,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  list: { gap: spacing.md, marginBottom: spacing.lg },
  cardDisabled: {
    opacity: 0.6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    ...typography.scale.h3,
    color: colors.deepSpace,
  },
  cardTitleDisabled: {
    color: colors.cosmicGray,
  },
  cardSub: {
    ...typography.scale.body,
    color: colors.cosmicGray,
  },
  cardSubDisabled: {
    color: colors.cosmicGray,
  },
})
