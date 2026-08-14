import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '@/src/lib/theme';
import type { MatrixArcanaPosition } from '@/src/services/backend';

export type MatrixDetail = {
  title: string;
  subtitle?: string;
  item: MatrixArcanaPosition;
  description: string;
  locked?: boolean;
};

export function MatrixDetailSheet({
  detail,
  visible,
  onClose,
  onUpgrade,
}: {
  detail: MatrixDetail | null;
  visible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}) {
  if (!detail) return null;
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.dismissArea} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <View style={styles.headerCopy}>
              <Text style={styles.eyebrow}>{detail.subtitle ?? 'MATRIX OF FATE'}</Text>
              <Text style={styles.title}>{detail.title}</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose} accessibilityRole="button" accessibilityLabel="Close detail">
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.arcanaRow}>
              <View style={styles.arcanaCircle}><Text style={styles.arcanaNumber}>{detail.item.number}</Text></View>
              <View style={styles.arcanaCopy}>
                <Text style={styles.arcanaName}>{detail.item.name}</Text>
                <Text style={styles.keywords}>{detail.item.keywords.join(' · ')}</Text>
              </View>
            </View>
            {detail.locked ? (
              <View style={styles.lockedCard}>
                <Text style={styles.lockedEyebrow}>PREMIUM READING</Text>
                <Text style={styles.lockedTitle}>See what this pattern can become.</Text>
                <Text style={styles.lockedBody}>Premium opens the fuller meaning, practical guidance, and relationship between this point and the rest of your map.</Text>
                <TouchableOpacity style={styles.upgradeButton} onPress={onUpgrade} activeOpacity={0.86}>
                  <Text style={styles.upgradeText}>Explore Premium</Text>
                  <Text style={styles.upgradeArrow}>→</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.description}>{detail.description}</Text>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(31,33,48,0.38)' },
  dismissArea: { flex: 1 },
  sheet: { maxHeight: '76%', borderTopLeftRadius: 28, borderTopRightRadius: 28, backgroundColor: theme.colors.bgSoft, paddingTop: 10, ...theme.shadows.warmSoft },
  handle: { width: 42, height: 4, borderRadius: 2, alignSelf: 'center', backgroundColor: 'rgba(31,33,48,0.18)' },
  header: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 20, paddingTop: 15 },
  headerCopy: { flex: 1, paddingRight: 12 },
  eyebrow: { color: '#7A63BD', fontSize: 10, fontWeight: '800', letterSpacing: 1.1 },
  title: { color: theme.colors.ink, fontFamily: theme.fonts.serif, fontSize: 25, marginTop: 6 },
  closeButton: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(31,33,48,0.07)' },
  closeText: { color: theme.colors.ink, fontSize: 24, lineHeight: 25, fontWeight: '300' },
  content: { padding: 20, paddingTop: 18, paddingBottom: 32 },
  arcanaRow: { flexDirection: 'row', alignItems: 'center' },
  arcanaCircle: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#7A63BD', alignItems: 'center', justifyContent: 'center' },
  arcanaNumber: { color: '#FFFFFF', fontSize: 24, fontWeight: '800' },
  arcanaCopy: { flex: 1, marginLeft: 13 },
  arcanaName: { color: theme.colors.ink, fontFamily: theme.fonts.serif, fontSize: 21 },
  keywords: { color: theme.colors.muted, fontSize: 11, marginTop: 3 },
  description: { color: theme.colors.muted, fontSize: 14, lineHeight: 22, marginTop: 20 },
  lockedCard: { marginTop: 20, padding: 17, borderRadius: 20, backgroundColor: 'rgba(232,221,251,0.58)', borderWidth: 1, borderColor: 'rgba(122,99,189,0.15)' },
  lockedEyebrow: { color: '#7A63BD', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  lockedTitle: { color: theme.colors.ink, fontFamily: theme.fonts.serif, fontSize: 20, marginTop: 8 },
  lockedBody: { color: theme.colors.muted, fontSize: 12, lineHeight: 18, marginTop: 8 },
  upgradeButton: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', marginTop: 15, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18, backgroundColor: theme.colors.ink },
  upgradeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  upgradeArrow: { color: '#FFFFFF', fontSize: 16, marginLeft: 7 },
});
