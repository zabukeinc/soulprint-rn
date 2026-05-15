import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { theme } from '@/src/lib/theme';

const zodiacSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

export default function CompatibilityScreen() {
  const router = useRouter();
  const [step, setStep] = useState<'input' | 'loading' | 'result'>('input');
  const [name, setName] = useState('');
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const progress = useSharedValue(0);

  const handleReveal = () => {
    if (name.trim() && selectedSign) {
      setStep('loading');
      setTimeout(() => {
        setStep('result');
        setTimeout(() => {
          setShowResult(true);
          progress.value = withTiming(74, { duration: 1500 });
        }, 100);
      }, 1800);
    }
  };

  const barStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  if (step === 'loading') {
    return (
      <View style={styles.loadingContainer}>
        <Animated.View entering={FadeIn} style={styles.loadingCenter}>
          <View style={styles.loadingIconBg}>
            <Text style={styles.loadingIcon}>✦</Text>
          </View>
          <Text style={styles.loadingTitle}>Reading the space between you...</Text>
          <Text style={styles.loadingSub}>This takes feeling, not just logic</Text>
        </Animated.View>
      </View>
    );
  }

  if (step === 'result') {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerLabel}>Compatibility</Text>
          <View style={styles.backButtonPlaceholder} />
        </View>

        {showResult && (
          <Animated.View entering={FadeIn.duration(500)}>
            <View style={styles.resultCenter}>
              <Text style={styles.resultLabel}>Compatibility Reading</Text>
              <Text style={styles.resultTitle}>Gy & {name}</Text>
              <Text style={styles.resultSub}>Aquarius Sun · {selectedSign}</Text>
            </View>

            <LinearGradient
              colors={theme.gradients.compatibility}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.scoreCard}
            >
              <View style={styles.scoreGlow} />
              <View style={styles.scoreContent}>
                <Text style={styles.scoreLabel}>Emotional Match</Text>
                <Text style={styles.scoreValue}>74%</Text>
                <Text style={styles.scoreSub}>Strong potential with room to grow</Text>
              </View>
              <View style={styles.scoreBarBg}>
                <Animated.View
                  style={[styles.scoreBarFill, barStyle]}
                />
              </View>
            </LinearGradient>

            <View style={styles.resultSection}>
              <View style={styles.resultSectionHeader}>
                <Text style={styles.resultSectionEmoji}>🧲</Text>
                <Text style={styles.resultSectionTitle}>What Draws You Together</Text>
              </View>
              <Text style={styles.resultSectionText}>
                {name} brings energy that challenges your caution. You'll feel pulled toward their certainty, and they'll feel grounded by your depth. The attraction isn't just surface — it's two different kinds of intensity finding a rhythm.
              </Text>
            </View>

            <View style={styles.resultSection}>
              <View style={styles.resultSectionHeader}>
                <Text style={styles.resultSectionEmoji}>⚡</Text>
                <Text style={styles.resultSectionTitle}>Where Friction Lives</Text>
              </View>
              <Text style={styles.resultSectionText}>
                You process before you respond. They react and then reflect. This timing difference can feel like indifference to you, and like withholding to them. Naming this gap early prevents it from becoming resentment.
              </Text>
            </View>

            <View style={[styles.resultSection, { backgroundColor: 'rgba(221,237,220,0.5)', borderColor: 'rgba(31,33,48,0.06)' }]}>
              <View style={styles.resultSectionHeader}>
                <Text style={styles.resultSectionEmoji}>🌱</Text>
                <Text style={styles.resultSectionTitle}>Growth Together</Text>
              </View>
              <Text style={styles.resultSectionText}>
                The best version of this connection isn't about avoiding friction — it's about not going silent when it arrives. If you can both say the hard thing early, this becomes a relationship that deepens with time instead of just continuing.
              </Text>
            </View>

            <View style={[styles.resultSection, { backgroundColor: 'rgba(232,221,251,0.4)', borderColor: 'rgba(139,114,207,0.15)' }]}>
              <Text style={styles.quoteText}>
                "Compatibility isn't about being the same. It's about whether you can grow in the same direction without losing yourself."
              </Text>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerLabel}>Compatibility</Text>
        <View style={styles.backButtonPlaceholder} />
      </View>

      <View style={styles.center}>
        <View style={[styles.iconBg, { backgroundColor: '#DDEDDC' }]}>
          <Text style={styles.icon}>🔗</Text>
        </View>
        <Text style={styles.label}>Decode Chemistry</Text>
        <Text style={styles.title}>How do you two connect?</Text>
        <Text style={styles.desc}>
          Enter their name and zodiac sign. We'll show you what happens when your patterns meet theirs.
        </Text>
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>Their name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. Jordan"
          placeholderTextColor={theme.colors.muted + '80'}
          style={styles.input}
        />
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>Their zodiac sign</Text>
        <View style={styles.signGrid}>
          {zodiacSigns.map((sign) => (
            <TouchableOpacity
              key={sign}
              onPress={() => setSelectedSign(sign)}
              style={[
                styles.signBtn,
                selectedSign === sign && styles.signBtnActive,
              ]}
            >
              <Text
                style={[
                  styles.signBtnText,
                  selectedSign === sign && styles.signBtnTextActive,
                ]}
              >
                {sign}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        disabled={!name.trim() || !selectedSign}
        onPress={handleReveal}
      >
        <LinearGradient
          colors={name.trim() && selectedSign ? theme.gradients.primary : ['#C4B8E0', '#A0D4D0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.button, (!name.trim() || !selectedSign) && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>Reveal Compatibility</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  loadingCenter: { alignItems: 'center' },
  loadingIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#8B72CF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: 'rgba(139,114,207,0.25)',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    shadowOpacity: 1,
    elevation: 6,
  },
  loadingIcon: { fontSize: 24, color: '#FFFFFF' },
  loadingTitle: {
    fontFamily: theme.fonts.serif,
    fontSize: 18,
    fontWeight: '500',
    color: theme.colors.ink,
    marginBottom: 4,
    textAlign: 'center',
  },
  loadingSub: { fontSize: 12, color: theme.colors.muted, textAlign: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
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
  backButtonPlaceholder: { width: 40 },
  headerLabel: { fontSize: 12, color: theme.colors.muted },
  center: { alignItems: 'center', marginBottom: 24 },
  iconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: 'rgba(22,167,160,0.2)',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    shadowOpacity: 1,
    elevation: 6,
  },
  icon: { fontSize: 24 },
  label: {
    fontSize: 11,
    letterSpacing: 1.4,
    color: '#8B72CF',
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 4,
  },
  title: {
    fontFamily: theme.fonts.serif,
    fontSize: 24,
    fontWeight: '500',
    color: theme.colors.ink,
    lineHeight: 28,
    textAlign: 'center',
    marginBottom: 4,
  },
  desc: {
    fontSize: 13,
    color: theme.colors.muted,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 260,
    marginTop: 8,
  },
  inputSection: { marginBottom: 20 },
  inputLabel: { fontSize: 12, fontWeight: '700', color: theme.colors.ink, marginBottom: 8 },
  input: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    fontSize: 14,
    color: theme.colors.ink,
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
  },
  signGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  signBtn: {
    width: '23%',
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
  },
  signBtnActive: {
    backgroundColor: '#8B72CF',
    borderColor: 'transparent',
  },
  signBtnText: { fontSize: 11, fontWeight: '700', color: theme.colors.muted },
  signBtnTextActive: { color: '#FFFFFF' },
  button: {
    width: '100%',
    minHeight: 48,
    borderRadius: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.primaryGlow,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
  resultCenter: { alignItems: 'center', marginBottom: 20 },
  resultLabel: {
    fontSize: 11,
    letterSpacing: 1.4,
    color: '#8B72CF',
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 8,
  },
  resultTitle: {
    fontFamily: theme.fonts.serif,
    fontSize: 24,
    fontWeight: '500',
    color: theme.colors.ink,
    lineHeight: 28,
    marginBottom: 4,
  },
  resultSub: { fontSize: 12, color: theme.colors.muted },
  scoreCard: {
    borderRadius: theme.radius.lg,
    padding: 20,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    ...theme.shadows.warmSoft,
  },
  scoreGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.5)',
    right: -30,
    top: -30,
    opacity: 0.2,
  },
  scoreContent: { alignItems: 'center', marginBottom: 16, position: 'relative', zIndex: 10 },
  scoreLabel: {
    fontSize: 11,
    letterSpacing: 1,
    color: '#8B72CF',
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 8,
  },
  scoreValue: {
    fontFamily: theme.fonts.serif,
    fontSize: 40,
    fontWeight: '500',
    color: theme.colors.ink,
    lineHeight: 44,
    marginBottom: 4,
  },
  scoreSub: { fontSize: 12, color: theme.colors.muted },
  scoreBarBg: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(31,33,48,0.06)',
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#8B72CF',
  },
  resultSection: {
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
  },
  resultSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  resultSectionEmoji: { fontSize: 16 },
  resultSectionTitle: { fontSize: 14, fontWeight: '500', color: theme.colors.ink },
  resultSectionText: { fontSize: 13, color: theme.colors.muted, lineHeight: 22 },
  quoteText: {
    fontSize: 13,
    color: theme.colors.ink,
    lineHeight: 22,
    fontWeight: '500',
    fontStyle: 'italic',
  },
});
