import React, { useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { natalPlanets, zodiacSigns } from '@/src/lib/horoscope';

const SIGN_COLORS: Record<string, string> = {
  Fire: '#E8A87C',
  Earth: '#A8C8A0',
  Air: '#8B72CF',
  Water: '#9FD9D0',
};

function polarToCartesian(centerX: number, centerY: number, radius: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleRad),
    y: centerY + radius * Math.sin(angleRad),
  };
}

interface Props {
  size?: number;
}

export default function NatalChart({ size = 280 }: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const chartSize = Math.min(size, screenWidth - 80);
  const center = chartSize / 2;
  const outerRadius = chartSize / 2 - 8;
  const innerRadius = outerRadius * 0.68;
  const planetRadius = outerRadius * 0.82;

  const [selectedPlanet, setSelectedPlanet] = useState<typeof natalPlanets[0] | null>(null);

  return (
    <View style={styles.wrapper}>
      <View style={[styles.chartContainer, { width: chartSize, height: chartSize }]}>
        {/* Zodiac ring segments */}
        {zodiacSigns.map((sign, i) => {
          const startAngle = sign.start;
          const endAngle = sign.start + 30;
          // Draw segment using a trick: thin wedge as a rotated line
          return (
            <View
              key={sign.name}
              style={[
                styles.segment,
                {
                  width: outerRadius - innerRadius,
                  height: 2,
                  backgroundColor: sign.color + '40',
                  position: 'absolute',
                  left: center,
                  top: center - 1,
                  transform: [
                    { translateX: -(outerRadius - innerRadius) / 2 },
                    { rotate: `${startAngle}deg` },
                    { translateX: (outerRadius + innerRadius) / 2 },
                  ],
                },
              ]}
            />
          );
        })}

        {/* Outer circle */}
        <View
          style={[
            styles.circle,
            {
              width: outerRadius * 2,
              height: outerRadius * 2,
              borderRadius: outerRadius,
              left: center - outerRadius,
              top: center - outerRadius,
            },
          ]}
        />

        {/* Inner circle */}
        <View
          style={[
            styles.circle,
            styles.innerCircle,
            {
              width: innerRadius * 2,
              height: innerRadius * 2,
              borderRadius: innerRadius,
              left: center - innerRadius,
              top: center - innerRadius,
            },
          ]}
        />

        {/* Center info */}
        <View style={[styles.centerInfo, { left: center - innerRadius + 8, top: center - innerRadius + 8, width: (innerRadius - 8) * 2, height: (innerRadius - 8) * 2 }]}>
          <Text style={styles.centerSign}>♒</Text>
          <Text style={styles.centerLabel}>Aquarius Sun</Text>
          <Text style={styles.centerMeta}>Life Path 7</Text>
        </View>

        {/* Zodiac sign labels on outer ring */}
        {zodiacSigns.map((sign) => {
          const pos = polarToCartesian(center, center, outerRadius + 14, sign.start + 15);
          return (
            <Text
              key={sign.name}
              style={[
                styles.signLabel,
                {
                  position: 'absolute',
                  left: pos.x - 10,
                  top: pos.y - 7,
                  color: sign.color,
                },
              ]}
            >
              {sign.symbol}
            </Text>
          );
        })}

        {/* House dividing lines */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = i * 30;
          const inner = polarToCartesian(center, center, innerRadius, angle);
          const outer = polarToCartesian(center, center, outerRadius, angle);
          return (
            <View
              key={`line-${i}`}
              style={{
                position: 'absolute',
                width: 1,
                height: outerRadius - innerRadius,
                backgroundColor: 'rgba(255,255,255,0.15)',
                left: inner.x,
                top: inner.y,
                transform: [
                  { translateX: -0.5 },
                  { rotate: `${angle + 90}deg` },
                  { translateY: -(outerRadius - innerRadius) / 2 },
                ],
              }}
            />
          );
        })}

        {/* Planets */}
        {natalPlanets.map((planet) => {
          const pos = polarToCartesian(center, center, planetRadius, planet.degree);
          const isSelected = selectedPlanet?.name === planet.name;
          return (
            <View
              key={planet.name}
              style={{
                position: 'absolute',
                left: pos.x - 14,
                top: pos.y - 14,
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: isSelected ? '#FFFFFF' : 'rgba(31,33,48,0.85)',
                borderWidth: 1.5,
                borderColor: isSelected ? '#8B72CF' : 'rgba(255,255,255,0.2)',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 4,
                shadowOpacity: 0.3,
                elevation: 3,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: isSelected ? '#8B72CF' : '#FFFFFF',
                  fontWeight: '700',
                }}
                onPress={() => setSelectedPlanet(isSelected ? null : planet)}
              >
                {planet.symbol}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Selected planet info */}
      {selectedPlanet && (
        <View style={styles.planetInfo}>
          <Text style={styles.planetInfoTitle}>
            {selectedPlanet.name} in {selectedPlanet.sign} · House {selectedPlanet.house}
          </Text>
          <Text style={styles.planetInfoText}>{selectedPlanet.meaning}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  chartContainer: {
    position: 'relative',
  },
  circle: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  innerCircle: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.2)',
  },
  segment: {
    height: 2,
  },
  signLabel: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    width: 20,
  },
  centerInfo: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  centerSign: {
    fontSize: 24,
    marginBottom: 2,
  },
  centerLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  centerMeta: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  planetInfo: {
    marginTop: 16,
    borderRadius: 20,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    width: '100%',
  },
  planetInfoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  planetInfoText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
  },
});
