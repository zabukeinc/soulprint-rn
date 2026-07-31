// src/design/primitives/StarField.tsx

import React from 'react'
import { View, StyleSheet } from 'react-native'
import { colors } from '../tokens'

interface StarFieldProps { opacity?: number }

const STARS = [
  { x: '10%', y: '15%', size: 2, color: colors.pastelLilac, opacity: 0.8 },
  { x: '80%', y: '20%', size: 1.5, color: colors.softLavender, opacity: 0.6 },
  { x: '65%', y: '75%', size: 2, color: colors.pastelLilac, opacity: 0.7 },
  { x: '30%', y: '80%', size: 1.5, color: colors.royalViolet, opacity: 0.5 },
  { x: '90%', y: '60%', size: 2.5, color: colors.pastelLilac, opacity: 0.4 },
  { x: '45%', y: '35%', size: 1.5, color: colors.softLavender, opacity: 0.5 },
  { x: '15%', y: '50%', size: 1, color: colors.royalViolet, opacity: 0.3 },
  { x: '75%', y: '40%', size: 1.5, color: colors.pastelLilac, opacity: 0.6 },
]

export function StarField({ opacity = 1 }: StarFieldProps) {
  return (
    <View style={[StyleSheet.absoluteFill, { opacity }]} pointerEvents="none">
      {STARS.map((star, i) => (
        <View
          key={i}
          style={[
            styles.star,
            { left: star.x as any, top: star.y as any, width: star.size, height: star.size, backgroundColor: star.color, opacity: star.opacity },
          ]}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  star: { position: 'absolute', borderRadius: 50 },
})
