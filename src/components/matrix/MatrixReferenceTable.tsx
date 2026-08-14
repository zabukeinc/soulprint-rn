import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '@/src/lib/theme';
import type { MatrixChakra, MatrixDestinyResponse } from '@/src/services/backend';

export function MatrixReferenceTable({
  matrix,
  chakras,
  premium,
  onUpgrade,
}: {
  matrix: MatrixDestinyResponse['matrix'];
  chakras: MatrixChakra[];
  premium: boolean;
  onUpgrade: () => void;
}) {
  const visibleRows = premium ? chakras : chakras.slice(0, 3);
  return (
    <View style={styles.wrap}>
      <Text style={styles.eyebrow}>PERSONAL CALCULATION</Text>
      <Text style={styles.title}>Health card</Text>
      <Text style={styles.intro}>A compact view of the energies that shape your personal map.</Text>
      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={[styles.headerText, styles.nameColumn]}>Chakra name</Text>
          <Text style={styles.headerText}>Physical</Text>
          <Text style={styles.headerText}>Energy</Text>
          <Text style={styles.headerText}>Emotions</Text>
        </View>
        {visibleRows.map((chakra, index) => (
          <View key={chakra.name} style={[styles.row, index % 2 === 1 && styles.altRow]}>
            <View style={[styles.colorStripe, { backgroundColor: chakra.color }]} />
            <View style={styles.nameColumn}>
              <Text style={styles.name}>{chakra.name}</Text>
              <Text style={styles.subtitle}>{chakra.subtitle}</Text>
            </View>
            <Text style={styles.value}>{chakra.physical}</Text>
            <Text style={styles.value}>{chakra.energy}</Text>
            <Text style={styles.value}>{chakra.emotions}</Text>
          </View>
        ))}
        <View style={styles.resultRow}>
          <View style={styles.colorStripe} />
          <View style={styles.nameColumn}>
            <Text style={styles.name}>Core pattern</Text>
            <Text style={styles.subtitle}>Soul center</Text>
          </View>
          <Text style={styles.value}>{matrix.center.number}</Text>
          <Text style={styles.value}>{matrix.purpose.number}</Text>
          <Text style={styles.value}>{matrix.currentYear.number}</Text>
        </View>
      </View>
      {!premium && (
        <TouchableOpacity style={styles.lockedFooter} onPress={onUpgrade} activeOpacity={0.86}>
          <Text style={styles.lockedText}>Unlock the complete health card</Text>
          <Text style={styles.lockedArrow}>→</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 18, padding: 16, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.82)', borderWidth: 1, borderColor: 'rgba(31,33,48,0.08)' },
  eyebrow: { color: '#7A63BD', fontSize: 10, fontWeight: '800', letterSpacing: 1.1 },
  title: { color: theme.colors.ink, fontFamily: theme.fonts.serif, fontSize: 24, marginTop: 5 },
  intro: { color: theme.colors.muted, fontSize: 12, lineHeight: 18, marginTop: 6 },
  table: { marginTop: 14, borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(31,33,48,0.08)' },
  headerRow: { minHeight: 42, flexDirection: 'row', alignItems: 'center', paddingRight: 8, backgroundColor: 'rgba(247,242,234,0.86)' },
  headerText: { width: 42, color: theme.colors.muted, fontSize: 9, fontWeight: '800', textAlign: 'center' },
  nameColumn: { flex: 1, alignItems: 'flex-start', paddingLeft: 10 },
  row: { minHeight: 58, flexDirection: 'row', alignItems: 'center', paddingRight: 8, backgroundColor: 'rgba(255,255,255,0.82)' },
  altRow: { backgroundColor: 'rgba(232,221,251,0.28)' },
  resultRow: { minHeight: 58, flexDirection: 'row', alignItems: 'center', paddingRight: 8, backgroundColor: 'rgba(247,242,234,0.86)' },
  colorStripe: { width: 5, height: '100%', marginRight: 4, backgroundColor: 'rgba(31,33,48,0.18)' },
  name: { color: theme.colors.ink, fontSize: 11, fontWeight: '800' },
  subtitle: { color: theme.colors.muted, fontSize: 9, lineHeight: 12, marginTop: 2 },
  value: { width: 42, color: theme.colors.ink, fontSize: 15, fontWeight: '800', textAlign: 'center' },
  lockedFooter: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginTop: 12, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 17, backgroundColor: theme.colors.ink },
  lockedText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
  lockedArrow: { color: '#FFFFFF', fontSize: 15, marginLeft: 6 },
});
