import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { theme } from '@/src/lib/theme';

export type MatrixSection = 'overview' | 'chakras' | 'purpose' | 'timeline';

const tabs: Array<{ key: MatrixSection; label: string }> = [
  { key: 'overview', label: 'Overview' },
  { key: 'chakras', label: 'Chakras' },
  { key: 'purpose', label: 'Purpose' },
  { key: 'timeline', label: 'Timeline' },
];

export function MatrixSectionTabs({ active, onChange }: { active: MatrixSection; onChange: (section: MatrixSection) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content}>
      {tabs.map((tab) => (
        <TouchableOpacity key={tab.key} style={[styles.tab, active === tab.key && styles.tabActive]} onPress={() => onChange(tab.key)} activeOpacity={0.86}>
          <Text style={[styles.text, active === tab.key && styles.textActive]}>{tab.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { gap: 8, paddingVertical: 12 },
  tab: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.7)', borderWidth: 1, borderColor: 'rgba(31,33,48,0.08)' },
  tabActive: { backgroundColor: theme.colors.ink, borderColor: theme.colors.ink },
  text: { color: theme.colors.muted, fontSize: 12, fontWeight: '700' },
  textActive: { color: '#FFFFFF' },
});
