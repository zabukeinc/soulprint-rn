import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '@/src/lib/theme';
import type { MatrixTimelineMark } from '@/src/services/backend';

export function MatrixTimeline({ marks, currentAge, selectedAge, onSelect }: { marks: MatrixTimelineMark[]; currentAge: number; selectedAge: number; onSelect: (mark: MatrixTimelineMark) => void }) {
  if (!marks.length) {
    return <View style={styles.wrap}><Text style={styles.eyebrow}>LIFE CYCLE</Text><Text style={styles.title}>Your age timeline</Text><Text style={styles.intro}>Your timeline will appear after the latest Matrix calculation is available.</Text></View>;
  }
  const active = marks.reduce((closest, mark) => Math.abs(mark.age - selectedAge) < Math.abs(closest.age - selectedAge) ? mark : closest, marks[0]);
  return (
    <View style={styles.wrap}>
      <View style={styles.headingRow}>
        <View><Text style={styles.eyebrow}>LIFE CYCLE</Text><Text style={styles.title}>Your age timeline</Text></View>
        <View style={styles.agePill}><Text style={styles.ageText}>{currentAge} years</Text></View>
      </View>
      <Text style={styles.intro}>Tap a period to see the arcana that colours that chapter.</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.timeline}>
        {marks.map((mark) => {
          const selected = mark === active;
          return <TouchableOpacity key={`${mark.age}-${mark.label}`} onPress={() => onSelect(mark)} style={styles.mark} activeOpacity={0.86}>
            <View style={[styles.dot, selected && styles.dotSelected, mark.age <= currentAge && styles.dotPast]}><Text style={[styles.dotText, selected && styles.dotTextSelected]}>{mark.arcana.number}</Text></View>
            <Text style={[styles.markLabel, selected && styles.markLabelSelected]}>{Math.round(mark.age)}y</Text>
          </TouchableOpacity>;
        })}
      </ScrollView>
      {active && <TouchableOpacity style={styles.activeCard} onPress={() => onSelect(active)} activeOpacity={0.86}>
        <View style={styles.activeNumber}><Text style={styles.activeNumberText}>{active.arcana.number}</Text></View>
        <View style={styles.activeCopy}><Text style={styles.activeLabel}>{active.label}</Text><Text style={styles.activeName}>{active.arcana.name}</Text><Text style={styles.activeKeywords}>{active.arcana.keywords.join(' · ')}</Text></View>
        <Text style={styles.arrow}>→</Text>
      </TouchableOpacity>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 16, padding: 17, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.78)', borderWidth: 1, borderColor: 'rgba(31,33,48,0.08)' },
  headingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  eyebrow: { color: '#7A63BD', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  title: { color: theme.colors.ink, fontFamily: theme.fonts.serif, fontSize: 21, marginTop: 5 },
  agePill: { paddingHorizontal: 9, paddingVertical: 7, borderRadius: 14, backgroundColor: 'rgba(232,221,251,0.55)' },
  ageText: { color: '#6C5F99', fontSize: 10, fontWeight: '800' },
  intro: { color: theme.colors.muted, fontSize: 12, lineHeight: 18, marginTop: 8 },
  timeline: { gap: 15, paddingVertical: 18, paddingHorizontal: 3 },
  mark: { alignItems: 'center', minWidth: 38 },
  dot: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(232,221,251,0.72)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(122,99,189,0.14)' },
  dotPast: { backgroundColor: 'rgba(221,237,220,0.9)', borderColor: 'rgba(22,167,160,0.18)' },
  dotSelected: { width: 38, height: 38, borderRadius: 19, backgroundColor: theme.colors.ink, borderColor: theme.colors.ink },
  dotText: { color: '#6C5F99', fontSize: 11, fontWeight: '800' },
  dotTextSelected: { color: '#FFFFFF', fontSize: 13 },
  markLabel: { color: theme.colors.muted, fontSize: 10, marginTop: 5 },
  markLabelSelected: { color: theme.colors.ink, fontWeight: '800' },
  activeCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 17, backgroundColor: 'rgba(247,242,234,0.86)', borderWidth: 1, borderColor: 'rgba(31,33,48,0.07)' },
  activeNumber: { width: 43, height: 43, borderRadius: 22, backgroundColor: '#7A63BD', alignItems: 'center', justifyContent: 'center' },
  activeNumberText: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
  activeCopy: { flex: 1, marginLeft: 11 },
  activeLabel: { color: theme.colors.muted, fontSize: 10 },
  activeName: { color: theme.colors.ink, fontFamily: theme.fonts.serif, fontSize: 17, marginTop: 2 },
  activeKeywords: { color: theme.colors.muted, fontSize: 10, marginTop: 2 },
  arrow: { color: theme.colors.ink, fontSize: 20, marginLeft: 8 },
});
