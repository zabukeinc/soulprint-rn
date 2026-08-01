import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import ProgressDots from '@/src/components/ProgressDots';
import { theme } from '@/src/lib/theme';
import { searchCities, type City } from '@/src/services/cities';
import { useOnboarding } from '@/src/context/OnboardingContext';

function formatCoords(c: City) {
  const lat = `${Math.abs(c.lat).toFixed(2)}°${c.lat >= 0 ? 'N' : 'S'}`;
  const lng = `${Math.abs(c.lng).toFixed(2)}°${c.lng >= 0 ? 'E' : 'W'}`;
  return `${lat}, ${lng}`;
}

export default function LocationScreen() {
  const router = useRouter();
  const { data, update } = useOnboarding();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<City[]>([]);
  const [selected, setSelected] = useState<City | null>(data.birthPlace);

  useEffect(() => {
    const t = setTimeout(async () => {
      setResults(await searchCities(query));
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const onSelect = (city: City) => setSelected(city);

  const onContinue = () => {
    if (!selected) return;
    update({ birthPlace: selected });
    router.push('/(onboarding)/mbti');
  };

  const showIdle = query.trim().length < 2;
  const showEmpty = !showIdle && results.length === 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Animated.View entering={FadeInUp.duration(500)} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.stepText}>4 of 7</Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(100).duration(500)}>
        <Text style={styles.label}>Place matters</Text>
        <Text style={styles.title}>Where were you born?</Text>
        <Text style={styles.description}>We use it to anchor your chart.</Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(200).duration(500)} style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search your birth city"
          placeholderTextColor={theme.colors.muted + '80'}
          style={styles.searchInput}
          autoCapitalize="words"
          autoCorrect={false}
        />
      </Animated.View>

      {showIdle && !selected && (
        <Text style={styles.hint}>Start typing your birth city.</Text>
      )}
      {showEmpty && (
        <Text style={styles.hint}>No matches — try a nearby larger city.</Text>
      )}

      <View style={styles.list}>
        {results.map((city, index) => {
          const isSelected = selected?.id === city.id;
          return (
            <Animated.View key={city.id} entering={FadeInUp.delay(index * 40).duration(400)}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => onSelect(city)}
                style={[styles.cityItem, isSelected && styles.cityItemActive]}
              >
                <Text style={styles.pinIcon}>{isSelected ? '📍' : '·'}</Text>
                <View style={styles.cityInfo}>
                  <Text style={styles.cityName}>
                    {city.name}, {city.country}
                  </Text>
                  <Text style={styles.cityMeta}>{formatCoords(city)}</Text>
                </View>
                <View style={styles.gmtChip}>
                  <Text style={styles.gmtChipText}>{city.gmt}</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>

      {selected && (
        <Animated.View entering={FadeInUp.duration(400)} style={styles.selectedCard}>
          <Text style={styles.selectedPin}>📍</Text>
          <View style={styles.cityInfo}>
            <Text style={styles.selectedLabel}>Selected</Text>
            <Text style={styles.selectedName}>
              {selected.name}, {selected.country}
            </Text>
          </View>
          <View style={styles.gmtChip}>
            <Text style={styles.gmtChipText}>{selected.gmt}</Text>
          </View>
        </Animated.View>
      )}

      <Animated.View entering={FadeInUp.delay(300).duration(500)}>
        <TouchableOpacity activeOpacity={0.85} disabled={!selected} onPress={onContinue}>
          <LinearGradient
            colors={selected ? theme.gradients.primary : ['#C4B8E0', '#A0D4D0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.button, !selected && styles.buttonDisabled]}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
      <ProgressDots total={7} current={3} />
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
  label: {
    fontSize: 11,
    letterSpacing: 1.4,
    color: '#8B72CF',
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 12,
  },
  title: {
    fontFamily: theme.fonts.serif,
    fontSize: 28,
    fontWeight: '500',
    color: theme.colors.ink,
    letterSpacing: -1.2,
    lineHeight: 32,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: theme.colors.muted,
    lineHeight: 23,
    marginBottom: 20,
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
  searchInput: { flex: 1, fontSize: 14, color: theme.colors.ink },
  hint: {
    fontSize: 12,
    color: theme.colors.muted,
    textAlign: 'center',
    marginBottom: 16,
  },
  list: { gap: 8, marginBottom: 12 },
  cityItem: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    backgroundColor: 'rgba(255,255,255,0.72)',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...theme.shadows.warmSm,
  },
  cityItemActive: {
    borderColor: 'rgba(139,114,207,0.35)',
    backgroundColor: 'rgba(232,221,251,0.98)',
  },
  pinIcon: { fontSize: 14, color: '#8B72CF', width: 18, textAlign: 'center' },
  cityInfo: { flex: 1 },
  cityName: { fontSize: 14, fontWeight: '600', color: theme.colors.ink },
  cityMeta: { fontSize: 11, color: theme.colors.muted, marginTop: 2 },
  gmtChip: {
    borderRadius: 8,
    backgroundColor: 'rgba(139,114,207,0.14)',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  gmtChipText: { fontSize: 10, fontWeight: '700', color: '#6C5F99' },
  selectedCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(232,221,251,0.9)',
    borderWidth: 2,
    borderColor: 'rgba(139,114,207,0.3)',
    ...theme.shadows.warmSm,
  },
  selectedPin: { fontSize: 18 },
  selectedLabel: { fontSize: 12, color: theme.colors.muted, marginBottom: 2 },
  selectedName: { fontSize: 14, fontWeight: '700', color: theme.colors.ink },
  button: {
    width: '100%',
    minHeight: 54,
    borderRadius: 27,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.primaryGlow,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
});
