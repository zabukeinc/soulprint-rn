import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { IllustrationMood } from '@/src/components/Illustrations';
import ProgressDots from '@/src/components/ProgressDots';
import { theme } from '@/src/lib/theme';

const cities = [
  { name: 'Bandung, Indonesia', flag: '🇮🇩', vibe: 'warm' },
  { name: 'Jakarta, Indonesia', flag: '🇮🇩', vibe: 'calm' },
  { name: 'Surabaya, Indonesia', flag: '🇮🇩', vibe: 'bright' },
  { name: 'Bali, Indonesia', flag: '🇮🇩', vibe: 'warm' },
  { name: 'Yogyakarta, Indonesia', flag: '🇮🇩', vibe: 'deep' },
  { name: 'New York, USA', flag: '🇺🇸', vibe: 'bright' },
  { name: 'Los Angeles, USA', flag: '🇺🇸', vibe: 'calm' },
  { name: 'London, UK', flag: '🇬🇧', vibe: 'deep' },
  { name: 'Tokyo, Japan', flag: '🇯🇵', vibe: 'calm' },
  { name: 'Sydney, Australia', flag: '🇦🇺', vibe: 'bright' },
];

export default function LocationScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(0);

  const filteredCities = cities.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );
  const selectedCity = cities[selected];

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
        <Text style={styles.stepText}>3 of 6</Text>
      </View>

      <Animated.View entering={FadeInUp.duration(500)} style={styles.heroCard}>
        <View style={styles.heroText}>
          <Text style={styles.heroLabel}>Place matters</Text>
          <Text style={styles.heroTitle}>Where were you born?</Text>
          <Text style={styles.heroDesc}>Location grounds your reading in context.</Text>
        </View>
        <IllustrationMood mood={selectedCity.vibe} />
        <View style={styles.heroGlow} />
      </Animated.View>

      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search city or country"
          placeholderTextColor={theme.colors.muted + '80'}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.selectedCard}>
        <Text style={styles.selectedFlag}>{selectedCity.flag}</Text>
        <View style={styles.selectedInfo}>
          <Text style={styles.selectedLabel}>Selected</Text>
          <Text style={styles.selectedName}>{selectedCity.name}</Text>
        </View>
        <Text style={styles.pinIcon}>📍</Text>
      </View>

      <View style={styles.list}>
        {filteredCities.map((city) => {
          const idx = cities.indexOf(city);
          const isSelected = selected === idx;
          return (
            <TouchableOpacity
              key={city.name}
              onPress={() => setSelected(idx)}
              style={[
                styles.cityItem,
                isSelected && styles.cityItemActive,
              ]}
            >
              <Text style={styles.cityFlag}>{city.flag}</Text>
              <Text style={styles.cityName}>{city.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push('/(onboarding)/mbti')}
      >
        <LinearGradient
          colors={theme.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </LinearGradient>
      </TouchableOpacity>
      <ProgressDots total={6} current={2} />
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
  stepText: { fontSize: 12, color: theme.colors.muted },
  heroCard: {
    borderRadius: 32,
    padding: 20,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    backgroundColor: '#FFFDF7',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    minHeight: 160,
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
    ...theme.shadows.warmSoft,
  },
  heroText: { flex: 1 },
  heroLabel: {
    fontSize: 11,
    letterSpacing: 1.4,
    color: '#8B72CF',
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 8,
  },
  heroTitle: {
    fontFamily: theme.fonts.serif,
    fontSize: 22,
    fontWeight: '500',
    color: theme.colors.ink,
    letterSpacing: -0.8,
    lineHeight: 26,
    marginBottom: 4,
  },
  heroDesc: { fontSize: 12, color: theme.colors.softMuted, lineHeight: 17 },
  heroGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(247,216,117,0.4)',
    right: -30,
    bottom: -40,
    opacity: 0.3,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    backgroundColor: 'rgba(255,255,255,0.74)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    ...theme.shadows.warmSm,
  },
  searchIcon: { fontSize: 16 },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.ink,
  },
  selectedCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(232,221,251,0.9)',
    borderWidth: 2,
    borderColor: 'rgba(139,114,207,0.3)',
    ...theme.shadows.warmSm,
  },
  selectedFlag: { fontSize: 24 },
  selectedInfo: { flex: 1 },
  selectedLabel: { fontSize: 12, color: theme.colors.muted, marginBottom: 2 },
  selectedName: { fontSize: 14, fontWeight: '700', color: theme.colors.ink },
  pinIcon: { fontSize: 16, color: '#8B72CF' },
  list: { gap: 8, marginBottom: 20 },
  cityItem: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    backgroundColor: 'rgba(255,255,255,0.72)',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...theme.shadows.warmSm,
  },
  cityItemActive: {
    borderColor: 'rgba(139,114,207,0.35)',
    backgroundColor: 'rgba(232,221,251,0.98)',
  },
  cityFlag: { fontSize: 20 },
  cityName: { fontSize: 14, fontWeight: '500', color: theme.colors.ink },
  button: {
    width: '100%',
    minHeight: 54,
    borderRadius: 27,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.primaryGlow,
  },
  buttonText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
});
