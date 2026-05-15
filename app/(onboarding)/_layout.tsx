import React from 'react';
import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="welcome" />
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
