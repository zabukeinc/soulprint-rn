import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Platform, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { requireNativeModule } from 'expo';
import type { ProductSubscription, ProductSubscriptionAndroid, Purchase, PurchaseIOS } from 'expo-iap';
import Animated, {
  FadeInUp,
  FadeIn,
  FadeOutUp,
  ZoomIn,
  Layout,
  Easing,
} from 'react-native-reanimated';
import { theme } from '@/src/lib/theme';
import { useAuth } from '@/src/context/AuthContext';
import { useTier } from '@/src/context/TierContext';
import { DEFAULT_LEGAL_INFO, getEntitlement, getLegalInfo, getProducts, type Entitlement, type LegalInfo, type PremiumProduct, verifyAppleIapPurchase, verifyGoogleIapPurchase } from '@/src/services/backend';

const features = {
  monthly: [
    'Full birth chart and planetary interpretations',
    '22-Arcana Matrix Destiny map and deeper reading',
    'Daily three-card tarot spread',
    'Full compatibility and relationship insights',
    'Detailed palm reading with recommendations',
    'Premium Mirror patterns and personalized readings',
  ],
  annually: [
    'Full birth chart and planetary interpretations',
    '22-Arcana Matrix Destiny map and deeper reading',
    'Daily three-card tarot spread',
    'Full compatibility and relationship insights',
    'Detailed palm reading with recommendations',
    'Premium Mirror patterns and personalized readings',
    '12-month theme guidance',
  ],
};

function hasIapNativeModule() {
  try {
    requireNativeModule('ExpoIap');
    return true;
  } catch {
    return false;
  }
}

function IapUnavailableScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>
      <View style={styles.center}>
        <Text style={styles.title}>Go deeper</Text>
        <Text style={styles.subtitle}>Premium plans are ready for the store version of Astrovy.</Text>
      </View>
      <View style={styles.storeUnavailableCard}>
        <Text style={styles.storeUnavailableTitle}>Premium checkout is not available here yet</Text>
        <Text style={styles.storeUnavailableText}>
          You are using a preview app without store billing. Install a development or store build to start a subscription securely through the App Store or Google Play.
        </Text>
      </View>
    </ScrollView>
  );
}

export default function PricingScreen() {
  const [iapAvailable] = useState(hasIapNativeModule);
  if (!iapAvailable) return <IapUnavailableScreen />;
  return <NativePricingScreen />;
}

function NativePricingScreen() {
  // Load the native billing module only after the native-module guard passes.
  // This keeps Expo Go from crashing while still allowing dev/store builds to use IAP.
  const { getAvailablePurchases, useIAP } = require('expo-iap') as typeof import('expo-iap');
  const router = useRouter();
  const { user, refreshMe } = useAuth();
  const { refreshTier } = useTier();
  const [selected, setSelected] = useState<'monthly' | 'annually'>('annually');
  const [serverProducts, setServerProducts] = useState<PremiumProduct[] | null>(null);
  const [serverFeatures, setServerFeatures] = useState<string[] | null>(null);
  const [legalInfo, setLegalInfo] = useState<LegalInfo>(DEFAULT_LEGAL_INFO);
  const [checkingRestore, setCheckingRestore] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const productIds = serverProducts?.map((product) => product.id).filter(Boolean) ?? [];

  const syncPremiumAccess = async () => {
    await Promise.all([refreshTier(), refreshMe()]);
  };

  const finishVerifiedPurchase = async (purchase: Purchase): Promise<Entitlement | null> => {
    const productId = purchase.productId;
    if (!productId) return null;

    if (Platform.OS === 'ios') {
      const iosPurchase = purchase as PurchaseIOS;
      const signedTransactionInfo = iosPurchase.purchaseToken;
      if (!iosPurchase.transactionId || !signedTransactionInfo) return null;

      const entitlement = await verifyAppleIapPurchase({
        productId,
        transactionId: iosPurchase.transactionId,
        signedTransactionInfo,
      });
      await iap.finishTransaction({ purchase, isConsumable: false });
      return entitlement;
    }

    const purchaseToken = purchase.purchaseToken;
    if (!purchaseToken) return null;

    const entitlement = await verifyGoogleIapPurchase({ productId, purchaseToken });
    await iap.finishTransaction({ purchase, isConsumable: false });
    return entitlement;
  };

  const iap = useIAP({
    onPurchaseSuccess: (purchase) => {
      setPurchasing(true);
      setStatusMessage('Confirming your premium access...');
      finishVerifiedPurchase(purchase)
        .then(async (entitlement) => {
          await syncPremiumAccess();
          const active = entitlement?.tier === 'premium' && ['active', 'grace'].includes(entitlement.status);
          setStatusMessage(active ? 'Premium is active on this account.' : 'Purchase was checked, but no active premium entitlement was found.');
        })
        .catch(() => {
          setStatusMessage('Your payment is complete. Premium is still activating; keep this app open or tap Restore purchases in a moment.');
        })
        .finally(() => setPurchasing(false));
    },
    onPurchaseError: () => {
      setPurchasing(false);
      setStatusMessage(`Purchase was not completed. Please try again when ${storeName} is ready.`);
    },
  });

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

  useEffect(() => {
    if (!iap.connected || productIds.length === 0) return;
    iap.fetchProducts({ skus: productIds, type: 'subs' }).catch(() => {
      setStatusMessage(`Could not load ${storeName} prices yet. Plan details are still available.`);
    });
  }, [iap.connected, productIds.join('|')]);

  const selectedProduct = serverProducts?.find((product) =>
    selected === 'monthly' ? product.period === 'monthly' : product.period === 'annual'
  );
  const storeProduct = iap.subscriptions.find((product) => product.id === selectedProduct?.id);
  const selectedPrice = storeProduct?.displayPrice ?? `$${selectedProduct?.price ?? (selected === 'monthly' ? '9' : '72')}`;
  const displayFeatures = selectedProduct?.features ?? serverFeatures ?? features[selected];
  const monthlyEquivalent = selected === 'annually' && storeProduct?.price
    ? (() => {
      try {
        return new Intl.NumberFormat(undefined, { style: 'currency', currency: storeProduct.currency, maximumFractionDigits: 2 }).format(storeProduct.price / 12);
      } catch {
        return selectedProduct?.monthlyEquivalent ? `$${selectedProduct.monthlyEquivalent}` : null;
      }
    })()
    : null;
  const manageSubscriptionUrl = Platform.OS === 'ios'
    ? legalInfo.subscriptions.appleManageUrl
    : legalInfo.subscriptions.googleManageUrl;
  const storeName = Platform.OS === 'ios' ? 'App Store' : 'Google Play';

  const openExternal = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) throw new Error('Unsupported URL');
      await Linking.openURL(url);
    } catch {
      Alert.alert('Could not open link', url);
    }
  };

  const googleOfferToken = (product: ProductSubscription | undefined) => {
    if (product?.platform !== 'android') return null;
    return (product as ProductSubscriptionAndroid).subscriptionOfferDetailsAndroid?.[0]?.offerToken ?? null;
  };

  const handlePurchase = async () => {
    if (!user) {
      setStatusMessage('Please log in before starting premium.');
      return;
    }
    if (!selectedProduct?.id) {
      setStatusMessage('Premium product is not ready yet. Please try again.');
      return;
    }
    if (!iap.connected) {
      setStatusMessage(`${storeName} billing is not available in this build. Use a signed development or store build.`);
      return;
    }

    setPurchasing(true);
    setStatusMessage(`Opening ${storeName} checkout...`);
    try {
      if (Platform.OS === 'ios') {
        await iap.requestPurchase({
          type: 'subs',
          request: { ios: { sku: selectedProduct.id } },
        });
      } else {
        const offerToken = googleOfferToken(storeProduct);
        await iap.requestPurchase({
          type: 'subs',
          request: {
            android: {
              skus: [selectedProduct.id],
              obfuscatedAccountIdAndroid: user.id,
              ...(offerToken ? { subscriptionOffers: [{ sku: selectedProduct.id, offerToken }] } : {}),
            },
          },
        });
      }
    } catch {
      setPurchasing(false);
      setStatusMessage(`Could not open ${storeName} checkout. Please try again from a signed store build.`);
    }
  };

  const handleRestore = async () => {
    setCheckingRestore(true);
    setStatusMessage(null);
    try {
      if (iap.connected) {
        const purchases = await getAvailablePurchases();
        const verified = await Promise.all(
          purchases
            .filter((purchase) => Boolean(purchase.purchaseToken))
            .map((purchase) => finishVerifiedPurchase(purchase))
        );
        if (verified.some((entitlement) => entitlement?.tier === 'premium' && ['active', 'grace'].includes(entitlement.status))) {
          await syncPremiumAccess();
          setStatusMessage(`Premium access was restored from ${storeName}.`);
          return;
        }
      }
      const entitlement = await getEntitlement();
      await syncPremiumAccess();
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
              <Text style={styles.planName}>{selectedProduct?.displayName ?? (selected === 'annually' ? 'Annual' : 'Monthly')}</Text>
            </View>
            <View style={styles.planPriceBox}>
              <Text style={styles.planPrice}>{selectedPrice}</Text>
              <Text style={styles.planPriceSub}>{selected === 'annually' ? 'billed yearly' : 'billed monthly'}</Text>
            </View>
          </View>

          {selectedProduct && (
            <Animated.View
              entering={ZoomIn.duration(300)}
              style={styles.yearlyInfo}
            >
              <Text style={styles.yearlyText}>
                <Text style={styles.yearlyBold}>{selectedProduct.billingLabel}</Text>
                {monthlyEquivalent && <Text style={styles.yearlyText}> About {monthlyEquivalent}/month.</Text>}
              </Text>
            </Animated.View>
          )}

          <View style={styles.cancelRow}>
            <View style={styles.cancelDot} />
            <Text style={styles.cancelText}>Renews automatically. Cancel anytime in {storeName}.</Text>
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
        <TouchableOpacity activeOpacity={0.85} onPress={handlePurchase} disabled={purchasing}>
          <LinearGradient
            colors={theme.gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaButton}
          >
            {purchasing ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.ctaText}>Go deeper</Text>}
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
  storeUnavailableCard: {
    borderRadius: 20,
    padding: 18,
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    ...theme.shadows.warmSm,
  },
  storeUnavailableTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.ink,
    marginBottom: 8,
  },
  storeUnavailableText: {
    fontSize: 13,
    color: theme.colors.muted,
    lineHeight: 21,
  },
  secondaryCta: {
    fontSize: 12,
    color: theme.colors.muted,
    fontWeight: '500',
    textAlign: 'center',
    paddingVertical: 12,
  },
});
