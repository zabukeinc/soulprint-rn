// app/share-card.tsx

import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Screen } from '@/src/design/primitives/Screen'
import { Button } from '@/src/design/primitives/Button'
import { Card } from '@/src/design/primitives/Card'
import { Eyebrow } from '@/src/design/primitives/Eyebrow'
import { colors, typography, spacing } from '@/src/design/tokens'

export default function ShareCardScreen() {
  const router = useRouter()

  return (
    <Screen>
      <View style={styles.container}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backIcon}>{"<"}</Text>
        </Pressable>

        <Eyebrow>Share</Eyebrow>

        <Card variant="gradient" padding="lg" style={styles.shareCard}>
          <Text style={styles.cardLabel}>Your Love Pattern</Text>
          <Text style={styles.cardQuote}>
            You do not need constant attention. You need emotional consistency.
          </Text>
          <View style={styles.cardFooter}>
            <Text style={styles.cardBrand}>Astrovy</Text>
            <Text style={styles.cardTagline}>Map your cosmos</Text>
          </View>
        </Card>

        <Button fullWidth size="lg" onPress={() => router.push('/snapshot')}>
          Share
        </Button>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxxl },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  backIcon: { fontSize: 16, color: colors.deepSpace },
  shareCard: {
    aspectRatio: 1,
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  cardLabel: {
    ...typography.scale.caption,
    fontWeight: typography.weights.semibold,
    color: colors.white,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  cardQuote: {
    ...typography.scale.h3,
    color: colors.white,
    textAlign: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardBrand: { ...typography.scale.caption, color: colors.pastelLilac },
  cardTagline: { ...typography.scale.caption, color: colors.pastelLilac },
})
