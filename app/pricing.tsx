import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Platform, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInUp,
  FadeIn,
  FadeOutUp,
  ZoomIn,
  Layout,
  Easing,
} from 'react-native-reanimated';
import { theme } from '@/src/lib/theme';
import { DEFAULT_LEGAL_INFO, getEntitlement, getLegalInfo, getProducts, type LegalInfo } from '@/src/services/backend';

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
  const [serverProducts, setServerProducts] = useState<Array<Record<string, any>> | null>(null);
  const [serverFeatures, setServerFeatures] = useState<string[] | null>(null);
  const [legalInfo, setLegalInfo] = useState<LegalInfo>(DEFAULT_LEGAL_INFO);
  const [checkingRestore, setCheckingRestore] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    getProducts()
      .then((payload) => {
        setServerProducts(payload.products);
        setServerFeatures(payload.features);
      })
      .catch(() => {});

    getLegalInfo()
      .then(setLegalInfo)
      .catch(() => {});
  }, []);

  const selectedProduct = serverProducts?.find((product) =>
    selected === 'monthly' ? product.period === 'monthly' : product.period === 'annual'
  );
  const displayFeatures = serverFeatures ?? features[selected];
  const manageSubscriptionUrl = Platform.OS === 'ios'
    ? legalInfo.subscriptions.appleManageUrl
    : legalInfo.subscriptions.googleManageUrl;

  const openExternal = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) throw new Error('Unsupported URL');
      await Linking.openURL(url);
    } catch {
      Alert.alert('Could not open link', url);
    }
  };

  const handlePurchase = () => {
    setStatusMessage('Purchases are not enabled in this build yet. Apple and Google verification endpoints are ready on the backend, but the store SDK still needs to be connected.');
  };

  const handleRestore = async () => {
    setCheckingRestore(true);
    setStatusMessage(null);
    try {
      const entitlement = await getEntitlement();
      const active = entitlement.tier === 'premium' && ['active', 'grace'].includes(entitlement.status);
      setStatusMessage(active ? 'Premium access is active on this account.' : 'No active premium entitlement was found on this account yet.');
    } catch {
      setStatusMessage('Could not check your entitlement. Please try again when your connection is stable.');
    } finally {
      setCheckingRestore(false);
    }
  };

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
        <Text style={styles.title}>Go deeper</Text>
        <Text style={styles.subtitle}>Weekly readings, relationship tools, and your full year ahead.</Text>
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
              <Text style={styles.planPrice}>${selectedProduct?.monthlyEquivalent ?? selectedProduct?.price ?? (selected === 'monthly' ? '9' : '6')}</Text>
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
          {displayFeatures.map((item, i) => (
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
        <TouchableOpacity activeOpacity={0.85} onPress={handlePurchase}>
          <LinearGradient
            colors={theme.gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaButton}
          >
            <Text style={styles.ctaText}>Go deeper</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(250).duration(500)} style={styles.purchaseActions}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleRestore}
          disabled={checkingRestore}
          activeOpacity={0.85}
        >
          {checkingRestore ? <ActivityIndicator color={theme.colors.ink} /> : <Text style={styles.secondaryButtonText}>Restore purchases</Text>}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => {
            void openExternal(manageSubscriptionUrl);
          }}
          activeOpacity={0.85}
        >
          <Text style={styles.secondaryButtonText}>Manage subscription</Text>
        </TouchableOpacity>
      </Animated.View>

      {statusMessage && (
        <Animated.View entering={FadeInUp.duration(250)} style={styles.statusBox}>
          <Text style={styles.statusText}>{statusMessage}</Text>
        </Animated.View>
      )}

      <Animated.View entering={FadeInUp.delay(300).duration(500)}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.secondaryCta}>Stay with my free reading</Text>
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
  purchaseActions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  secondaryButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 22,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
  },
  secondaryButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.ink,
    textAlign: 'center',
  },
  statusBox: {
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
    backgroundColor: 'rgba(221,237,220,0.34)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
  },
  statusText: {
    fontSize: 12,
    color: theme.colors.muted,
    lineHeight: 18,
    textAlign: 'center',
  },
  secondaryCta: {
    fontSize: 12,
    color: theme.colors.muted,
    fontWeight: '500',
    textAlign: 'center',
    paddingVertical: 12,
  },
});
