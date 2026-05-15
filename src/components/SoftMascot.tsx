import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

interface SoftMascotProps {
  mood?: 'gentle' | 'curious' | 'happy';
  size?: 'small' | 'medium' | 'large';
}

const sizeMap = {
  small: { head: 48, body: 38, font: 10 },
  medium: { head: 60, body: 46, font: 12 },
  large: { head: 80, body: 60, font: 14 },
};

export default function SoftMascot({ mood = 'gentle', size = 'medium' }: SoftMascotProps) {
  const sizes = sizeMap[size];
  const eyeY = mood === 'curious' ? '32%' : mood === 'happy' ? '38%' : '35%';
  const eyeSize = mood === 'curious' ? 12 : 10;

  const floatStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withRepeat(
            withTiming(-4, { duration: 1500 }),
            -1,
            true
          ),
        },
      ],
    };
  });

  return (
    <Animated.View style={[{ alignItems: 'center' }, floatStyle]}>
      <View
        style={[
          styles.head,
          {
            width: sizes.head,
            height: sizes.head * 0.8,
            borderRadius: sizes.head * 0.35,
          },
        ]}
      >
        <Text style={[styles.eye, { top: eyeY as any, left: sizes.head * 0.2, fontSize: eyeSize }]}>
          ◠
        </Text>
        <Text style={[styles.eye, { top: eyeY as any, right: sizes.head * 0.2, fontSize: eyeSize }]}>
          ◠
        </Text>
      </View>
      <View
        style={[
          styles.body,
          {
            width: sizes.body,
            height: sizes.body * 0.82,
            borderRadius: sizes.body * 0.35,
            marginTop: 4,
          },
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  head: {
    backgroundColor: '#FFF7EC',
    borderWidth: 2,
    borderColor: 'rgba(31,33,48,0.08)',
    shadowColor: 'rgba(99,82,60,0.06)',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    shadowOpacity: 1,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  eye: {
    position: 'absolute',
    color: '#1F2130',
  },
  body: {
    backgroundColor: '#F7D875',
  },
});
