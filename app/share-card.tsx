import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInUp, Easing } from 'react-native-reanimated';
import { Download } from 'lucide-react-native';
import { theme } from '@/src/lib/theme';

export default function ShareCardScreen() {
  const router = useRouter();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerLabel}>Share Preview</Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(100).duration(400)}>
        <Text style={styles.label}>Make it yours</Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(200).duration(400)}>
        <Text style={styles.title}>Share the part that felt true.</Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(300).duration(400)}>
        <Text style={styles.description}>Save this as a soft identity card.</Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(400)} style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardLabel}>Your Love Pattern</Text>
        </View>
        <Text style={styles.cardQuote}>
          You do not need constant attention. You need emotional consistency.
        </Text>
        <View style={styles.cardFooter}>
          <Text style={styles.cardBrand}>Soulprint</Text>
          <Text style={styles.cardTagline}>Decode your emotional blueprint.</Text>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(500).duration(400).easing(Easing.out(Easing.cubic))} style={{ marginBottom: 12 }}>
        <TouchableOpacity activeOpacity={0.85} style={styles.downloadBtn}>
          <LinearGradient
            colors={theme.gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.downloadGradient}
          >
            <Download size={18} color="#FFFFFF" />
            <Text style={styles.downloadText}>Download Card</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(600).duration(400).easing(Easing.out(Easing.cubic))}>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.push('/snapshot')}
        >
          <Text style={styles.secondaryBtnText}>Choose Another Insight</Text>
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
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.76)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.warmSoft,
  },
  backIcon: { fontSize: 18, color: theme.colors.ink },
  headerLabel: { fontSize: 12, color: theme.colors.muted },
  label: {
    fontSize: 11,
    letterSpacing: 1.4,
    color: '#8B72CF',
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 8,
  },
  title: {
    fontFamily: theme.fonts.serif,
    fontSize: 34,
    fontWeight: '500',
    color: theme.colors.ink,
    lineHeight: 36,
    letterSpacing: -1.2,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: theme.colors.muted,
    lineHeight: 23,
    marginBottom: 20,
  },
  card: {
    aspectRatio: 1,
    borderRadius: 32,
    padding: 24,
    marginBottom: 20,
    justifyContent: 'space-between',
    backgroundColor: '#E8DDFB',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    ...theme.shadows.warmSoft,
  },
  cardHeader: {},
  cardLabel: {
    fontSize: 12,
    letterSpacing: 1.2,
    color: '#6C5F99',
    textTransform: 'uppercase',
    fontWeight: '800',
  },
  cardQuote: {
    fontFamily: theme.fonts.serif,
    fontSize: 25,
    fontWeight: '500',
    color: theme.colors.ink,
    lineHeight: 28,
    letterSpacing: -0.8,
    textAlign: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardBrand: { fontSize: 12, color: theme.colors.muted },
  cardTagline: { fontSize: 12, color: theme.colors.muted },
  downloadBtn: { marginBottom: 12 },
  downloadGradient: {
    width: '100%',
    minHeight: 54,
    borderRadius: 27,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...theme.shadows.primaryGlow,
  },
  downloadText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
  secondaryBtn: {
    width: '100%',
    minHeight: 54,
    borderRadius: 27,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.68)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
  },
  secondaryBtnText: { fontSize: 14, fontWeight: '800', color: theme.colors.ink },
});
