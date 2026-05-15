import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp, FadeIn, FadeOut } from 'react-native-reanimated';
import { useTier } from '@/src/context/TierContext';
import { theme } from '@/src/lib/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { isPremium, toggleTier } = useTier();

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
            <Text style={styles.profileAvatarText}>G</Text>
          </View>
          <View>
            <Text style={styles.profileName}>Gy</Text>
            <Text style={styles.profileMeta}>
              Aquarius Sun · Life Path 7 · Deep tone
            </Text>
          </View>
        </View>
        <View style={styles.badges}>
          <View style={[styles.badge, { backgroundColor: '#F8DCCB' }]}>
            <Text style={styles.badgeText}>Love focus</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: '#DDEDDC' }]}>
            <Text style={styles.badgeText}>Bandung</Text>
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
          <TouchableOpacity onPress={toggleTier} style={styles.tierToggle}>
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

        <Animated.View entering={FadeInUp.duration(500).delay(240)} style={styles.settingRow}>
          <View>
            <Text style={styles.settingTitle}>Deep Tone</Text>
            <Text style={styles.settingDesc}>
              Warm, direct, reflective
            </Text>
          </View>
          <Text style={styles.settingValue}>Active</Text>
        </Animated.View>

        <View style={styles.divider} />

        <Animated.View entering={FadeInUp.duration(500).delay(280)} style={styles.settingRow}>
          <TouchableOpacity
            style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
            onPress={() => router.push('/pricing')}
            activeOpacity={0.85}
          >
            <View>
              <Text style={styles.settingTitle}>Subscription</Text>
              <Text style={styles.settingDesc}>Manage your plan</Text>
            </View>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.divider} />

        <Animated.View entering={FadeInUp.duration(500).delay(320)} style={styles.settingRow}>
          <View>
            <Text style={styles.settingTitle}>Privacy</Text>
            <Text style={styles.settingDesc}>
              Export or delete data
            </Text>
          </View>
          <Text style={styles.settingArrow}>→</Text>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInUp.duration(500).delay(400)} style={styles.privacyCard}>
        <Text style={styles.privacyIcon}>🛡️</Text>
        <View>
          <Text style={styles.privacyTitle}>Privacy First</Text>
          <Text style={styles.privacyDesc}>Your data is never sold. Ever.</Text>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(500).delay(450)}>
        <TouchableOpacity style={styles.deleteBtn}>
          <Text style={styles.deleteText}>Delete Account</Text>
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
    paddingTop: 40,
    paddingBottom: 100,
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
  deleteBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  deleteText: { fontSize: 14, fontWeight: '500', color: '#F4C7D2' },
});
