import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '@/src/context/AuthContext';

export default function AuthLayout() {
  const { hydrated, user, profileComplete } = useAuth();

  if (!hydrated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (user) return <Redirect href={profileComplete ? '/(tabs)/today' : '/(onboarding)/welcome'} />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
