import React from 'react';
import { Redirect, Tabs } from 'expo-router';
import BottomNav from '@/src/components/BottomNav';
import { usePathname, useRouter } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '@/src/context/AuthContext';

const tabRoutes = ['today', 'astrovy', 'decode', 'mirror', 'profile'];

function CustomBottomTabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const currentScreen = pathname.replace('/', '') || 'today';

  return (
    <BottomNav
      currentScreen={currentScreen}
      onNavigate={(screen) => {
        router.navigate(`/(tabs)/${screen}`);
      }}
    />
  );
}

export default function TabsLayout() {
  const { hydrated, user, profileComplete } = useAuth();

  if (!hydrated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!user) return <Redirect href="/(auth)" />;
  if (!profileComplete) return <Redirect href="/(onboarding)/welcome" />;

  return (
    <Tabs
      tabBar={() => <CustomBottomTabBar />}
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Tabs.Screen name="today" />
      <Tabs.Screen name="astrovy" />
      <Tabs.Screen name="decode" />
      <Tabs.Screen name="mirror" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
