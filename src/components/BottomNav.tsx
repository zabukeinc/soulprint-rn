import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Sparkles, BookOpen, Heart, User } from 'lucide-react-native';
import { theme } from '@/src/lib/theme';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const tabs = [
  { id: 'today', label: 'Today', icon: Home },
  { id: 'astrovy', label: 'Soul', icon: Sparkles },
  { id: 'decode', label: 'Decode', icon: BookOpen },
  { id: 'mirror', label: 'Mirror', icon: Heart },
  { id: 'profile', label: 'Profile', icon: User },
];

interface BottomNavProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

export default function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Math.max(insets.bottom, 8),
          shadowColor: 'rgba(99,82,60,0.13)',
          shadowOffset: { width: 0, height: 12 },
          shadowRadius: 36,
          shadowOpacity: 1,
          elevation: 10,
        },
      ]}
    >
      <View style={styles.inner}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentScreen === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.8}
              onPress={() => onNavigate(tab.id)}
              style={styles.tab}
            >
              <View
                style={[
                  styles.iconBg,
                  {
                    backgroundColor: isActive
                      ? 'transparent'
                      : 'transparent',
                    borderWidth: isActive ? 0 : 1,
                    borderColor: isActive ? 'transparent' : 'rgba(31,33,48,0.12)',
                  },
                ]}
              >
                {isActive ? (
                  <View style={styles.activeIconBg}>
                    <Icon size={14} color="#FFFFFF" />
                  </View>
                ) : (
                  <Icon size={14} color={theme.colors.softMuted} />
                )}
              </View>
              <Text
                style={[
                  styles.label,
                  { color: isActive ? theme.colors.ink : theme.colors.softMuted },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    right: 16,
    zIndex: 40,
    borderRadius: 26,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
  },
  inner: {
    height: 68,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: 4,
  },
  iconBg: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconBg: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B72CF',
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
  },
});
