import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { TierProvider } from '@/src/context/TierContext';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <TierProvider>
        <View style={styles.container}>
          {/* Background gradient covers full screen, including under notch */}
          <LinearGradient
            colors={['#F2EDE3', '#EAF5EC', '#EFEAF7']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          {/* Content is inset below the notch */}
          <SafeAreaView style={styles.safeArea} edges={['top']}>
            <Stack screenOptions={{ headerShown: false }} />
          </SafeAreaView>
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
  safeArea: {
    flex: 1,
  },
});
