import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AppErrorBoundary } from '@/src/components/AppErrorBoundaryFallback';
import { TierProvider } from '@/src/context/TierContext';
import { OnboardingProvider } from '@/src/context/OnboardingContext';
import { AuthProvider } from '@/src/context/AuthContext';
import { NetworkProvider } from '@/src/context/NetworkContext';
import { initObservability } from '@/src/lib/observability';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { checkForAppUpdate } from '@/src/services/appUpdate';

initObservability();

function RootLayout() {
  React.useEffect(() => {
    checkForAppUpdate().catch(() => {});
  }, []);

  return (
    <SafeAreaProvider>
      <AppErrorBoundary>
        <NetworkProvider>
          <AuthProvider>
            <TierProvider>
              <OnboardingProvider>
                <View style={styles.container}>
                  <LinearGradient
                    colors={['#F2EDE3', '#EAF5EC', '#EFEAF7']}
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  />
                  <SafeAreaView style={styles.safeArea} edges={['top']}>
                    <Stack screenOptions={{ headerShown: false }} />
                  </SafeAreaView>
                </View>
                <StatusBar style="dark" />
              </OnboardingProvider>
            </TierProvider>
          </AuthProvider>
        </NetworkProvider>
      </AppErrorBoundary>
    </SafeAreaProvider>
  );
}

export default RootLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});
