import React from 'react';
import { Tabs } from 'expo-router';
import BottomNav from '@/src/components/BottomNav';
import { usePathname, useRouter } from 'expo-router';

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
