import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, Modal, TextInput, View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp, FadeIn, FadeOut } from 'react-native-reanimated';
import { useTier } from '@/src/context/TierContext';
import { useEngagement } from '@/src/hooks/useEngagement';
import { useAuth } from '@/src/context/AuthContext';
import { DEFAULT_LEGAL_INFO, getLegalInfo, getMe, type LegalInfo } from '@/src/services/backend';
import { ApiError, type ApiUser } from '@/src/lib/api';
import { theme } from '@/src/lib/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { isPremium, loading: tierLoading, toggleTier } = useTier();
  const { signOut, deleteAccount } = useAuth();
  const engagement = useEngagement();
  const [account, setAccount] = useState<ApiUser | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [astro, setAstro] = useState<any | null>(null);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [deleteSecret, setDeleteSecret] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [legalInfo, setLegalInfo] = useState<LegalInfo>(DEFAULT_LEGAL_INFO);

  useEffect(() => {
    getMe()
      .then((me) => {
        setAccount(me.user as ApiUser);
        setProfile(me.profile);
        setAstro(me.astro);
      })
      .catch(() => {});

    getLegalInfo()
      .then(setLegalInfo)
      .catch(() => {});
  }, []);

  const name = profile?.name ?? 'You';
  const initial = name.charAt(0).toUpperCase() || 'A';
  const sunSign = astro?.sunSign ? `${astro.sunSign[0].toUpperCase()}${astro.sunSign.slice(1)} Sun` : 'Sun Sign';
  const lifePath = astro?.lifePath ? `Life Path ${astro.lifePath}` : 'Life Path';
  const birthCity = profile?.birthPlace?.city ?? 'Birth place';
  const hasPasswordAccount = account?.hasPassword !== false;
  const deleteInputLabel = hasPasswordAccount ? 'Password' : 'Type DELETE';
  const canDelete = hasPasswordAccount ? deleteSecret.length > 0 : deleteSecret === 'DELETE';

  const openDeleteAccount = () => {
    setDeleteSecret('');
    setDeleteError(null);
    setDeleteVisible(true);
  };

  const openExternal = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) throw new Error('Unsupported URL');
      await Linking.openURL(url);
    } catch {
      Alert.alert('Could not open link', url);
    }
  };

  const openSupport = () => {
    openExternal(`mailto:${legalInfo.supportEmail}?subject=Astrovy%20Support`);
  };

  const confirmDeleteAccount = async () => {
    if (!canDelete || deleting) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteAccount(hasPasswordAccount ? { password: deleteSecret } : { confirm: 'DELETE' });
      await engagement?.clearAllData?.();
      setDeleteVisible(false);
      router.replace('/(auth)');
    } catch (error) {
      setDeleteError(error instanceof ApiError ? error.message : 'Account could not be deleted. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sign out', 'This clears your local session on this device.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        onPress: async () => {
          await engagement?.clearAllData?.();
          await signOut();
          router.replace('/(auth)');
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeInUp.duration(500)}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerLabel}>Settings</Text>
            <Text style={styles.headerTitle}>Profile</Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(500).delay(50)} style={styles.profileCard}>
        <View style={styles.profileRow}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>{initial}</Text>
          </View>
          <View>
            <Text style={styles.profileName}>{name}</Text>
            <Text style={styles.profileMeta}>
              {sunSign} · {lifePath}
            </Text>
          </View>
        </View>
        <View style={styles.badges}>
          <View style={[styles.badge, { backgroundColor: '#F8DCCB' }]}>
            <Text style={styles.badgeText}>{profile?.focus ?? 'Focus'}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: '#DDEDDC' }]}>
            <Text style={styles.badgeText}>{birthCity}</Text>
          </View>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: isPremium
                  ? 'rgba(22,167,160,0.15)'
                  : 'rgba(139,114,207,0.12)',
              },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: isPremium ? '#16A7A0' : '#7A63BD' },
              ]}
            >
              {isPremium ? '✦ Premium' : 'Free'}
            </Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(500).delay(100)} style={[styles.tierCard, {
        backgroundColor: isPremium
          ? 'rgba(22,167,160,0.1)'
          : 'rgba(255,255,255,0.78)',
        borderColor: isPremium
          ? 'rgba(22,167,160,0.2)'
          : 'rgba(31,33,48,0.08)',
      }]}>
        <View style={styles.tierRow}>
          <View>
            <Text style={styles.tierTitle}>
              {isPremium ? '✦ Premium Unlocked' : 'Preview Mode'}
            </Text>
            <Text style={styles.tierDesc}>
              {isPremium
                ? 'All features unlocked. See the full experience.'
                : 'Viewing as a free user. Switch to see premium.'}
            </Text>
          </View>
          <TouchableOpacity disabled={tierLoading} onPress={() => { void toggleTier(); }} style={styles.tierToggle}>
            <View
              style={[
                styles.toggleTrack,
                { backgroundColor: isPremium ? '#16A7A0' : '#8B72CF' },
              ]}
            >
              <View
                style={[
                  styles.toggleKnob,
                  { transform: [{ translateX: isPremium ? 18 : 0 }] },
                ]}
              />
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(500).delay(150)}>
        <Text style={styles.sectionLabel}>Preferences</Text>
      </Animated.View>

      <View style={styles.settingsCard}>
        <Animated.View entering={FadeInUp.duration(500).delay(200)} style={styles.settingRow}>
          <View>
            <Text style={styles.settingTitle}>Daily Signal</Text>
            <Text style={styles.settingDesc}>
              Personal insight every day
            </Text>
          </View>
          <View style={[styles.toggleTrack, { backgroundColor: '#16A7A0' }]}>
            <View style={[styles.toggleKnob, { transform: [{ translateX: 18 }] }]} />
          </View>
        </Animated.View>

        <View style={styles.divider} />

        <Animated.View entering={FadeInUp.duration(500).delay(280)}>
          <TouchableOpacity
            style={styles.settingRowButton}
            onPress={() => {
              void openExternal(legalInfo.privacyUrl);
            }}
            activeOpacity={0.85}
          >
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>Privacy Policy</Text>
              <Text style={styles.settingDesc}>How Astrovy handles your data</Text>
            </View>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.divider} />

        <Animated.View entering={FadeInUp.duration(500).delay(320)}>
          <TouchableOpacity
            style={styles.settingRowButton}
            onPress={() => {
              void openExternal(legalInfo.termsUrl);
            }}
            activeOpacity={0.85}
          >
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>Terms of Use</Text>
              <Text style={styles.settingDesc}>Rules for using Astrovy</Text>
            </View>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.divider} />

        <Animated.View entering={FadeInUp.duration(500).delay(360)} style={styles.settingRow}>
          <TouchableOpacity
            style={styles.settingRowInnerButton}
            onPress={() => router.push('/pricing')}
            activeOpacity={0.85}
          >
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>Subscription</Text>
              <Text style={styles.settingDesc}>Manage your plan</Text>
            </View>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.divider} />

        <Animated.View entering={FadeInUp.duration(500).delay(400)}>
          <TouchableOpacity style={styles.settingRowButton} onPress={openSupport} activeOpacity={0.85}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>Support</Text>
              <Text style={styles.settingDesc}>{legalInfo.supportEmail}</Text>
            </View>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.divider} />

        <Animated.View entering={FadeInUp.duration(500).delay(440)} style={styles.settingRow}>
          <View style={styles.settingTextCol}>
            <Text style={styles.settingTitle}>About Astrovy</Text>
            <Text style={styles.settingDesc}>Version 1.0 · Built with care</Text>
          </View>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInUp.duration(500).delay(480)} style={styles.privacyCard}>
        <Text style={styles.privacyIcon}>🛡️</Text>
        <View>
          <Text style={styles.privacyTitle}>Privacy First</Text>
          <Text style={styles.privacyDesc}>Your data is never sold. Delete your account anytime.</Text>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(500).delay(520)}>
        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Text style={styles.deleteText}>Sign Out</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(500).delay(560)}>
        <TouchableOpacity style={styles.deleteBtn} onPress={openDeleteAccount}>
          <Text style={styles.deleteAccountText}>Delete Account</Text>
        </TouchableOpacity>
      </Animated.View>

      <Modal visible={deleteVisible} transparent animationType="fade" onRequestClose={() => setDeleteVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.deleteModal}>
            <Text style={styles.modalLabel}>Account deletion</Text>
            <Text style={styles.modalTitle}>Delete your Astrovy account?</Text>
            <Text style={styles.modalBody}>
              This permanently deletes your account, profile, birth chart, journals, check-ins, tarot draws, and saved readings from the backend.
            </Text>
            <Text style={styles.modalBody}>
              Deleting your account does not cancel an active App Store or Google Play subscription. Manage cancellation in your store account.
            </Text>
            <TextInput
              value={deleteSecret}
              onChangeText={(value) => {
                setDeleteSecret(value);
                setDeleteError(null);
              }}
              placeholder={deleteInputLabel}
              placeholderTextColor={theme.colors.muted + '80'}
              style={styles.deleteInput}
              secureTextEntry={hasPasswordAccount}
              autoCapitalize="none"
            />
            {deleteError && <Text style={styles.deleteError}>{deleteError}</Text>}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelDeleteBtn}
                disabled={deleting}
                onPress={() => setDeleteVisible(false)}
              >
                <Text style={styles.cancelDeleteText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmDeleteBtn, (!canDelete || deleting) && styles.disabledDangerBtn]}
                disabled={!canDelete || deleting}
                onPress={confirmDeleteAccount}
              >
                {deleting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.confirmDeleteText}>Delete</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 130,
  },
  header: { marginBottom: 20 },
  headerLabel: { fontSize: 12, color: theme.colors.muted, letterSpacing: 0.5 },
  headerTitle: {
    fontFamily: theme.fonts.serif,
    fontSize: 28,
    fontWeight: '500',
    color: theme.colors.ink,
  },
  profileCard: {
    borderRadius: theme.radius.lg,
    padding: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    ...theme.shadows.warmSoft,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16A7A0',
    ...theme.shadows.tealGlow,
  },
  profileAvatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  profileName: {
    fontFamily: theme.fonts.serif,
    fontSize: 20,
    fontWeight: '500',
    color: theme.colors.ink,
    marginBottom: 2,
  },
  profileMeta: { fontSize: 13, color: theme.colors.muted },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: { fontSize: 12, fontWeight: '700', color: '#6C5F99' },
  tierCard: {
    borderRadius: 24,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  tierRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tierTitle: { fontSize: 14, fontWeight: '500', color: theme.colors.ink, marginBottom: 2 },
  tierDesc: { fontSize: 12, color: theme.colors.muted },
  tierToggle: {
    width: 44,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleTrack: {
    width: 44,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  sectionLabel: {
    fontSize: 11,
    color: theme.colors.muted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  settingsCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    backgroundColor: 'rgba(255,255,255,0.74)',
    marginBottom: 16,
    ...theme.shadows.warmSm,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  settingRowButton: {
    minHeight: 64,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingRowInnerButton: {
    flex: 1,
    minHeight: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingTextCol: { flex: 1, paddingRight: 12 },
  settingTitle: { fontSize: 14, fontWeight: '500', color: theme.colors.ink, marginBottom: 2 },
  settingDesc: { fontSize: 12, color: theme.colors.muted },
  settingValue: { fontSize: 12, color: theme.colors.muted },
  settingArrow: { fontSize: 16, color: theme.colors.muted },
  divider: {
    height: 1,
    backgroundColor: 'rgba(31,33,48,0.07)',
    marginHorizontal: 16,
  },
  privacyCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    backgroundColor: 'rgba(221,237,220,0.3)',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  privacyIcon: { fontSize: 18 },
  privacyTitle: { fontSize: 14, fontWeight: '500', color: theme.colors.ink, marginBottom: 2 },
  privacyDesc: { fontSize: 12, color: theme.colors.muted },
  signOutBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  deleteText: { fontSize: 14, fontWeight: '500', color: '#F4C7D2' },
  deleteBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  deleteAccountText: { fontSize: 14, fontWeight: '700', color: '#B84A62' },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(31,33,48,0.42)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  deleteModal: {
    width: '100%',
    borderRadius: 24,
    padding: 18,
    backgroundColor: theme.colors.bgSoft,
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    ...theme.shadows.warm,
  },
  modalLabel: {
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: '#B84A62',
    fontWeight: '800',
    marginBottom: 8,
  },
  modalTitle: {
    fontFamily: theme.fonts.serif,
    fontSize: 22,
    color: theme.colors.ink,
    fontWeight: '500',
    marginBottom: 10,
  },
  modalBody: {
    fontSize: 12,
    color: theme.colors.muted,
    lineHeight: 19,
    marginBottom: 8,
  },
  deleteInput: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.12)',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14,
    color: theme.colors.ink,
    marginTop: 8,
  },
  deleteError: { fontSize: 12, color: '#B84A62', lineHeight: 18, marginTop: 8 },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 16 },
  cancelDeleteBtn: {
    flex: 1,
    minHeight: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(31,33,48,0.07)',
  },
  cancelDeleteText: { fontSize: 13, fontWeight: '800', color: theme.colors.ink },
  confirmDeleteBtn: {
    flex: 1,
    minHeight: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B84A62',
  },
  disabledDangerBtn: { opacity: 0.45 },
  confirmDeleteText: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },
});
