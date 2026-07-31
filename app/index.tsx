// app/index.tsx

import { Redirect } from 'expo-router'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { useProfile } from '@/src/context/ProfileContext'
import { colors } from '@/src/design/tokens'

export default function Index() {
  const { hasProfile, hydrated } = useProfile()

  if (!hydrated) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.royalViolet} size="large" />
      </View>
    )
  }

  if (hasProfile) {
    return <Redirect href="/(tabs)/today" />
  }

  return <Redirect href="/(onboarding)/welcome" />
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.lightBg,
  },
})
