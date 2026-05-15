import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInUp,
  FadeIn,
  FadeOut,
  FadeOutUp,
  SlideInRight,
  SlideOutLeft,
  ZoomIn,
  Layout,
  Easing,
} from 'react-native-reanimated';
import { theme } from '@/src/lib/theme';

const features = {
  monthly: [
    'Complete emotional blueprint',
    'Love, career & growth patterns',
    'Shadow self exploration',
    'Weekly personalized insights',
  ],
  annually: [
    'Complete emotional blueprint',
    'Love, career & growth patterns',
    'Shadow self exploration',
    '12-month theme guidance',
    'Weekly personalized insights',
    'Priority support',
  ],
};

export default function PricingScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<'monthly' | 'annually'>('annually');

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeIn.duration(400)}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.duration(500)}
        style={styles.center}
      >
        <Text style={styles.title}>Choose your journey</Text>
        <Text style={styles.subtitle}>Go deeper into your emotional blueprint</Text>
      </Animated.View>

      {/* Toggle — flattened structure, text sits directly on the gradient or bg */}
      <View style={styles.toggle}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setSelected('monthly')}
          style={styles.toggleBtnBase}
        >
          {selected === 'monthly' ? (
            <LinearGradient
              colors={theme.gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.toggleGradient}
            >
              <Text style={styles.toggleTextActive}>Monthly</Text>
            </LinearGradient>
          ) : (
            <View style={styles.toggleInactive}>
              <Text style={styles.toggleText}>Monthly</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setSelected('annually')}
          style={styles.toggleBtnBase}
        >
          {selected === 'annually' ? (
            <LinearGradient
              colors={theme.gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.toggleGradient}
            >
              <Text style={styles.toggleTextActive}>Annually</Text>
              <View style={styles.saveBadge}>
                <Text style={styles.saveBadgeText}>Save!</Text>
              </View>
            </LinearGradient>
          ) : (
            <View style={styles.toggleInactive}>
              <Text style={styles.toggleText}>Annually</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* AnimatePresence-like content switch */}
      <Animated.View
        key={selected}
        entering={FadeInUp.duration(300).easing(Easing.out(Easing.cubic))}
        exiting={FadeOutUp.duration(200)}
        layout={Layout.easing(Easing.out(Easing.cubic)).duration(300)}
        style={styles.planWrapper}
      >
        <LinearGradient
          colors={theme.gradients.hero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.planCard}
        >
          <View style={styles.planGlow} />
          <View style={styles.planHeader}>
            <View>
              <Text style={styles.planLabel}>Selected plan</Text>
              <Text style={styles.planName}>{selected}</Text>
            </View>
            <View style={styles.planPriceBox}>
              <Text style={styles.planPrice}>${selected === 'monthly' ? '9' : '6'}</Text>
              <Text style={styles.planPriceSub}>per month</Text>
            </View>
          </View>

          {selected === 'annually' && (
            <Animated.View
              entering={ZoomIn.duration(300)}
              style={styles.yearlyInfo}
            >
              <Text style={styles.yearlyText}>
                <Text style={styles.yearlyBold}>$72 billed yearly</Text>
                <Text style={styles.yearlyMuted}> (Save $36)</Text>
              </Text>
            </Animated.View>
          )}

          <View style={styles.cancelRow}>
            <View style={styles.cancelDot} />
            <Text style={styles.cancelText}>Cancel anytime</Text>
          </View>
        </LinearGradient>

        <View style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>What you unlock:</Text>
          {features[selected].map((item, i) => (
            <Animated.View
              key={`${selected}-${item}`}
              entering={FadeInUp.delay(i * 80).duration(400)}
              style={styles.featureRow}
            >
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>{item}</Text>
            </Animated.View>
          ))}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(200).duration(500)}>
        <TouchableOpacity activeOpacity={0.85}>
          <LinearGradient
            colors={theme.gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaButton}
          >
            <Text style={styles.ctaText}>Start my journey</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(300).duration(500)}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.secondaryCta}>Continue with free snapshot</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 24,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.76)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...theme.shadows.warmSoft,
  },
  backIcon: { fontSize: 16, color: theme.colors.ink },
  center: { alignItems: 'center', marginBottom: 16 },
  title: {
    fontFamily: theme.fonts.serif,
    fontSize: 22,
    fontWeight: '500',
    color: theme.colors.ink,
    lineHeight: 26,
    marginBottom: 4,
  },
  subtitle: { fontSize: 11, color: theme.colors.muted },
  toggle: {
    flexDirection: 'row',
    borderRadius: 24,
    padding: 4,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    marginBottom: 20,
  },
  toggleBtnBase: {
    flex: 1,
    borderRadius: 20,
  },
  toggleGradient: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    position: 'relative',
    minHeight: 40,
  },
  toggleInactive: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  toggleText: { fontSize: 12, fontWeight: '500', color: theme.colors.muted },
  toggleTextActive: { fontSize: 12, fontWeight: '500', color: '#FFFFFF' },
  saveBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: '#F4C7D2',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    shadowColor: 'rgba(244,199,210,0.5)',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 1,
    elevation: 3,
  },
  saveBadgeText: { fontSize: 8, fontWeight: '800', color: '#8B72CF' },
  planWrapper: {},
  planCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    minHeight: 180,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    ...theme.shadows.warmSoft,
  },
  planGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.3)',
    right: -30,
    top: -30,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  planLabel: {
    fontSize: 10,
    color: theme.colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  planName: {
    fontFamily: theme.fonts.serif,
    fontSize: 24,
    fontWeight: '500',
    color: theme.colors.ink,
    textTransform: 'capitalize',
  },
  planPriceBox: { alignItems: 'flex-end' },
  planPrice: {
    fontFamily: theme.fonts.serif,
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.ink,
  },
  planPriceSub: { fontSize: 10, color: theme.colors.muted },
  yearlyInfo: {
    borderRadius: 12,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.6)',
    marginBottom: 12,
  },
  yearlyText: { fontSize: 11, color: theme.colors.ink },
  yearlyBold: { fontWeight: '700' },
  yearlyMuted: { color: theme.colors.muted },
  cancelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cancelDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#16A7A0' },
  cancelText: { fontSize: 11, color: theme.colors.muted },
  featuresCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    ...theme.shadows.warmSm,
  },
  featuresTitle: {
    fontSize: 11,
    fontWeight: '500',
    color: theme.colors.ink,
    marginBottom: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  featureDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#16A7A0' },
  featureText: { fontSize: 12, color: theme.colors.muted },
  ctaButton: {
    width: '100%',
    minHeight: 48,
    borderRadius: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    ...theme.shadows.primaryGlow,
  },
  ctaText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
  secondaryCta: {
    fontSize: 12,
    color: theme.colors.muted,
    fontWeight: '500',
    textAlign: 'center',
    paddingVertical: 12,
  },
});
