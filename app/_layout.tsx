import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TierProvider } from '@/src/context/TierContext';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <TierProvider>
        <View style={styles.container}>
          <LinearGradient
            colors={['#F2EDE3', '#EAF5EC', '#EFEAF7']}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Stack screenOptions={{ headerShown: false }} />
          </LinearGradient>
        </View>
        <StatusBar style="dark" />
      </TierProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
});
