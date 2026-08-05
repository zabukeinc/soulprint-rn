import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  interpolate,
} from 'react-native-reanimated';

export function IllustrationPanel({
  children,
  style = {},
}: {
  children: React.ReactNode;
  style?: any;
}) {
  return (
    <View
      style={[
        styles.panel,
        {
          minHeight: 182,
          ...style,
        },
      ]}
    >
      <View style={styles.panelGlow} />
      <View style={{ flex: 1, position: 'relative', zIndex: 10 }}>{children}</View>
    </View>
  );
}

export function IllustrationCharacter({ mood = 'gentle' }: { mood?: string }) {
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
    <Animated.View style={[styles.characterContainer, floatStyle]}>
      <View style={styles.characterHead}>
        <Text style={[styles.characterEye, { top: '35%', left: 20 }]}>◠</Text>
        <Text style={[styles.characterEye, { top: '35%', right: 20 }]}>◠</Text>
      </View>
      <View style={styles.characterBody}>
        <View style={styles.characterArmLeft} />
        <View style={styles.characterArmRight} />
      </View>
      <Text style={styles.characterSparkle}>✦</Text>
    </Animated.View>
  );
}

export function IllustrationLogo() {
  return (
    <Image
      source={require('../../assets/Logo.png')}
      style={styles.logo}
      resizeMode="contain"
    />
  );
}

export function IllustrationBlob({ children }: { children?: React.ReactNode }) {
  return (
    <Animated.View style={[styles.blobContainer, { borderRadius: 60 }]}>
      <View style={styles.blobInner}>{children}</View>
    </Animated.View>
  );
}

export function IllustrationCelestial() {
  return (
    <View style={styles.celestialContainer}>
      <View style={styles.celestialOuter} />
      <View style={styles.celestialMiddle} />
      <View style={styles.celestialInner} />
      <Text style={styles.celestialSparkle}>✦</Text>
    </View>
  );
}

export function IllustrationMood({ mood }: { mood: string }) {
  const colors: Record<string, string[]> = {
    calm: ['#DDEDDC', '#DFF2EC'],
    warm: ['#F8DCCB', '#F7D875'],
    deep: ['#E8DDFB', '#F4C7D2'],
    bright: ['#F7D875', '#DDEDDC'],
  };

  const [c1, c2] = colors[mood] || colors.calm;

  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withRepeat(
            withSequence(
              withTiming(1.05, { duration: 1500 }),
              withTiming(1, { duration: 1500 })
            ),
            -1,
            true
          ),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.moodOrb,
        {
          backgroundColor: c1,
          shadowColor: 'rgba(99,82,60,0.15)',
          shadowOffset: { width: 0, height: 12 },
          shadowRadius: 30,
          shadowOpacity: 1,
          elevation: 8,
        },
        pulseStyle,
      ]}
    >
      <View style={[styles.moodOrbInner, { backgroundColor: c2 + '4D' }]} />
    </Animated.View>
  );
}

// We need Text imported for JSX
import { Text } from 'react-native';

const styles = StyleSheet.create({
  panel: {
    borderRadius: 32,
    padding: 20,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    backgroundColor: '#FFFDF7',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    shadowColor: 'rgba(99,82,60,0.09)',
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 30,
    shadowOpacity: 1,
    elevation: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  panelGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(247,216,117,0.3)',
    right: -32,
    bottom: -42,
  },
  characterContainer: {
    alignItems: 'center',
    width: 80,
    height: 90,
    position: 'relative',
  },
  characterHead: {
    width: 60,
    height: 48,
    borderRadius: 22,
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
  characterEye: {
    position: 'absolute',
    fontSize: 10,
    color: '#1F2130',
  },
  characterBody: {
    width: 46,
    height: 38,
    borderRadius: 20,
    backgroundColor: '#F7D875',
    marginTop: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  characterArmLeft: {
    position: 'absolute',
    width: 16,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFF7EC',
    top: '28%',
    left: -12,
    transform: [{ rotate: '-25deg' }],
  },
  characterArmRight: {
    position: 'absolute',
    width: 16,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFF7EC',
    top: '28%',
    right: -12,
    transform: [{ rotate: '25deg' }],
  },
  characterSparkle: {
    position: 'absolute',
    top: -4,
    right: 8,
    fontSize: 18,
    color: '#8B72CF',
  },
  logo: {
    width: 142,
    height: 142,
    alignSelf: 'center',
    marginBottom: 24,
  },
  blobContainer: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    overflow: 'hidden',
    backgroundColor: '#E8DDFB',
    shadowColor: 'rgba(99,82,60,0.09)',
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 30,
    shadowOpacity: 1,
    elevation: 8,
  },
  blobInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  celestialContainer: {
    width: 100,
    height: 100,
    position: 'relative',
    alignSelf: 'center',
  },
  celestialOuter: {
    position: 'absolute',
    inset: 0,
    borderRadius: 50,
    backgroundColor: '#F7D875',
    opacity: 0.6,
  },
  celestialMiddle: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    top: 20,
    left: 20,
    backgroundColor: '#E8DDFB',
  },
  celestialInner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    bottom: 10,
    right: 10,
    backgroundColor: '#DDEDDC',
  },
  celestialSparkle: {
    position: 'absolute',
    top: 8,
    right: 12,
    fontSize: 20,
    color: '#8B72CF',
  },
  moodOrb: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  moodOrbInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
});
