// src/components/BottomNav.tsx

import React from 'react'
import { View, Pressable, Text, StyleSheet } from 'react-native'
import { Sun, Star, BookOpen, Moon, User } from 'lucide-react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors, typography, spacing, radii, shadows } from '@/src/design/tokens'

interface BottomNavProps {
  currentScreen: string
  onNavigate: (screen: string) => void
}

const TABS = [
  { id: 'today',     icon: Sun,      label: 'Today' },
  { id: 'soulprint', icon: Star,     label: 'Astro' },
  { id: 'decode',    icon: BookOpen, label: 'Decode' },
  { id: 'mirror',    icon: Moon,     label: 'Mirror' },
  { id: 'profile',   icon: User,     label: 'Profile' },
]

export default function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
      <View style={styles.nav}>
        {TABS.map((tab) => {
          const Icon = tab.icon
          const active = currentScreen === tab.id
          return (
            <Pressable
              key={tab.id}
              onPress={() => onNavigate(tab.id)}
              style={styles.tab}
            >
              <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
                <Icon size={20} color={active ? colors.white : colors.cosmicGray} />
              </View>
              <Text style={[styles.label, active && styles.labelActive]}>{tab.label}</Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radii.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    ...shadows.card,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: colors.royalViolet,
  },
  label: {
    ...typography.scale.caption,
    fontSize: 10,
    color: colors.cosmicGray,
  },
  labelActive: {
    color: colors.royalViolet,
    fontWeight: typography.weights.semibold,
  },
})
