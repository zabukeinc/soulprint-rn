import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '@/src/context/AuthContext';

export default function OnboardingLayout() {
  const { hydrated, user } = useAuth();

  if (!hydrated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!user) return <Redirect href="/(auth)" />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="name" />
      <Stack.Screen name="birth-date" />
      <Stack.Screen name="birth-time" />
      <Stack.Screen name="location" />
      <Stack.Screen name="mbti" />
      <Stack.Screen name="focus-mood" />
      <Stack.Screen name="generating" />
      <Stack.Screen name="first-mirror" />
    </Stack>
  );
}
