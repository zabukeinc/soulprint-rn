import React, { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, G, Line, Path, Polygon, Text as SvgText } from 'react-native-svg';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { getMatrixDestiny, getMatrixDestinyAi, type MatrixDestinyResponse, type MatrixDestinyAiState } from '@/src/services/backend';
import { SkeletonCard } from '@/src/components/LoadingState';
import { theme } from '@/src/lib/theme';

const premiumKeys = ['career_money', 'karmic_shadow', 'current_year', 'relationships', 'action_plan'];
const MAX_AI_POLL_ATTEMPTS = 18;

const positionLabels: Record<string, string> = {
  relationship_line_a: 'Emotional rhythm',
  relationship_line_b: 'Shared safety',
  money_line_a: 'Work instinct',
  money_line_b: 'Value exchange',
  karmic_tail_a: 'Old pattern',
  karmic_tail_b: 'Pressure point',
  karmic_tail_c: 'Release point'
};

function humanPositionLabel(position: string) {
  return positionLabels[position] ?? position.replace(/_/g, ' ');
}

function ArcanaCard({ label, item }: { label: string; item: { number: number; name: string; keywords: readonly string[] } }) {
  return (
    <View style={styles.arcanaCard}>
      <Text style={styles.arcanaLabel}>{label}</Text>
      <View style={styles.arcanaNumber}><Text style={styles.arcanaNumberText}>{item.number}</Text></View>
      <Text style={styles.arcanaName}>{item.name}</Text>
      <Text style={styles.arcanaKeywords}>{item.keywords.slice(0, 2).join(' · ')}</Text>
    </View>
  );
}

function MatrixDiagram({ matrix }: { matrix: MatrixDestinyResponse['matrix']; expanded?: boolean }) {
  const nodes = [
    { key: 'top', item: matrix.purpose, x: 180, y: 47, radius: 30, fill: '#8E46A8', text: '#FFFFFF' },
    { key: 'right', item: matrix.currentYear, x: 313, y: 195, radius: 30, fill: '#F04B4B', text: '#FFFFFF' },
    { key: 'bottom', item: matrix.karmicTail[2], x: 180, y: 343, radius: 30, fill: '#F04B4B', text: '#FFFFFF' },
    { key: 'left', item: matrix.talent, x: 47, y: 195, radius: 30, fill: '#8E46A8', text: '#FFFFFF' },
    { key: 'center', item: matrix.center, x: 180, y: 195, radius: 26, fill: '#F6DC31', text: '#1F2130' },
    { key: 'topInnerA', item: matrix.purpose, x: 180, y: 91, radius: 16, fill: '#516AF1', text: '#FFFFFF' },
    { key: 'topInnerB', item: matrix.talent, x: 180, y: 124, radius: 13, fill: '#46C8D8', text: '#FFFFFF' },
    { key: 'leftInnerA', item: matrix.relationshipLine[0], x: 88, y: 195, radius: 16, fill: '#516AF1', text: '#FFFFFF' },
    { key: 'leftInnerB', item: matrix.relationshipLine[1], x: 119, y: 195, radius: 13, fill: '#46C8D8', text: '#FFFFFF' },
    { key: 'rightInnerA', item: matrix.moneyLine[0], x: 241, y: 195, radius: 13, fill: '#FFFFFF', text: '#1F2130' },
    { key: 'rightInnerB', item: matrix.moneyLine[1], x: 272, y: 195, radius: 13, fill: '#FFFFFF', text: '#1F2130' },
    { key: 'lowerLeft', item: matrix.karmicTail[0], x: 106, y: 274, radius: 16, fill: '#FFFFFF', text: '#1F2130' },
    { key: 'lowerRight', item: matrix.karmicTail[1], x: 254, y: 274, radius: 16, fill: '#FFFFFF', text: '#1F2130' },
    { key: 'lowerCenter', item: matrix.karmicTail[2], x: 180, y: 296, radius: 14, fill: '#F5A52C', text: '#FFFFFF' }
  ];
  const lines = [
    [180, 47, 180, 169, 'rgba(31,33,48,0.7)', 1.2], [47, 195, 154, 195, 'rgba(31,33,48,0.7)', 1.2], [206, 195, 313, 195, 'rgba(31,33,48,0.7)', 1.2], [180, 221, 180, 343, 'rgba(31,33,48,0.7)', 1.2],
    [74, 88, 286, 302, 'rgba(31,33,48,0.9)', 1.6], [74, 302, 286, 88, 'rgba(31,33,48,0.9)', 1.6],
    [84, 108, 276, 108, 'rgba(31,33,48,0.9)', 1.6], [84, 282, 276, 282, 'rgba(31,33,48,0.9)', 1.6],
    [180, 195, 112, 118, '#8E46A8', 2.2], [180, 195, 248, 118, '#F04B4B', 2.2], [180, 195, 255, 274, '#8E46A8', 2.2],
    [215, 242, 275, 222, 'rgba(31,33,48,0.55)', 1, '4 5']
  ] as const;
  const ageLabels = [['20 years', 180, 10], ['30 years', 344, 101], ['40 years', 349, 195], ['50 years', 344, 304], ['60 years', 180, 386], ['70 years', 16, 304], ['0 years', 11, 195], ['10 years', 16, 101]] as const;

  return (
    <View style={styles.diagramWrap}>
      <Svg width="100%" height="100%" viewBox="0 0 360 390" preserveAspectRatio="xMidYMid meet">
        <G transform="scale(1 0.86)">
        <Polygon points="180,12 305,80 330,195 305,310 180,378 55,310 30,195 55,80" fill="none" stroke="rgba(31,33,48,0.48)" strokeWidth={1.2} />
        <Polygon points="84,100 276,100 276,290 84,290" fill="none" stroke="rgba(31,33,48,0.7)" strokeWidth={1.5} />
        {ageLabels.map(([label, x, y]) => <SvgText key={label} x={x} y={y} fill="rgba(31,33,48,0.58)" fontSize="8" fontWeight="700" textAnchor="middle">{label}</SvgText>)}
        {lines.map(([x1, y1, x2, y2, stroke, strokeWidth, dash], index) => <Line key={`matrix-line-${index}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={dash} strokeLinecap="round" />)}
        <Path d="M 102 274 L 180 195 L 258 116" fill="none" stroke="#F7F2EA" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M 102 116 L 180 195 L 258 274" fill="none" stroke="#F7F2EA" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M 102 274 L 180 195 L 258 116" fill="none" stroke="#F04B4B" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M 102 116 L 180 195 L 258 274" fill="none" stroke="#8E46A8" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
        <Polygon points="258,116 246,119 253,128" fill="#F04B4B" />
        <Polygon points="102,274 114,271 107,262" fill="#F04B4B" />
        <Polygon points="102,116 114,119 107,128" fill="#8E46A8" />
        <Polygon points="258,274 246,271 253,262" fill="#8E46A8" />
        <Path d="M 218 243 C 241 235 258 218 278 201" fill="none" stroke="#F7F2EA" strokeWidth={5} strokeLinecap="round" />
        <Path d="M 218 243 C 241 235 258 218 278 201" fill="none" stroke="#9D7BEA" strokeWidth={1.7} strokeDasharray="4 5" strokeLinecap="round" />
        <SvgText x="245" y="234" fill="#9D7BEA" fontSize="15" fontWeight="800" textAnchor="middle">$</SvgText>
        <SvgText x="220" y="139" fill="#F04B4B" fontSize="8" fontWeight="700" textAnchor="middle" transform="rotate(-43 220 139)">female generation</SvgText>
        <SvgText x="140" y="139" fill="#8E46A8" fontSize="8" fontWeight="700" textAnchor="middle" transform="rotate(43 140 139)">male generation</SvgText>
        {nodes.map((node) => <Circle key={`matrix-node-${node.key}`} cx={node.x} cy={node.y} r={node.radius} fill={node.fill} stroke={node.fill === '#FFFFFF' ? 'rgba(31,33,48,0.9)' : node.fill} strokeWidth={node.fill === '#FFFFFF' ? 1.6 : 1} />)}
        {nodes.map((node) => <SvgText key={`matrix-number-${node.key}`} x={node.x} y={node.y + (node.radius > 20 ? 9 : 4)} fill={node.text} fontSize={node.radius > 20 ? 25 : 11} fontWeight="800" textAnchor="middle">{node.item.number}</SvgText>)}
        </G>
      </Svg>
    </View>
  );
}

function ReadingStatus({ status }: { status: MatrixDestinyAiState['status'] }) {
  if (status === 'ready') return <View style={styles.readyPill}><View style={styles.readyDot} /><Text style={styles.readyText}>Your deeper reading is ready</Text></View>;
  return <View style={styles.generatingPill}><View style={styles.generatingDot} /><Text style={styles.generatingText}>Your deeper reading is unfolding</Text></View>;
}

function PatternTable({ matrix }: { matrix: MatrixDestinyResponse['matrix'] }) {
  const rows = [
    { name: 'Center', meaning: 'Core pattern', values: [matrix.center, matrix.center, matrix.center] },
    { name: 'Purpose', meaning: 'Life direction', values: [matrix.purpose, matrix.purpose, matrix.currentYear] },
    { name: 'Talent', meaning: 'Natural resource', values: [matrix.talent, matrix.talent, matrix.purpose] },
    { name: 'Relationships', meaning: 'Connection pattern', values: [matrix.relationshipLine[0], matrix.relationshipLine[1], matrix.center] },
    { name: 'Career & money', meaning: 'Value exchange', values: [matrix.moneyLine[0], matrix.moneyLine[1], matrix.currentYear] },
    { name: 'Karmic tail', meaning: 'Growth edge', values: [matrix.karmicTail[0], matrix.karmicTail[1], matrix.karmicTail[2]] },
    { name: 'Current year', meaning: 'Present focus', values: [matrix.currentYear, matrix.currentYear, matrix.purpose] }
  ];

  return (
    <View style={styles.patternTable}>
      <View style={styles.tableHeader}><Text style={[styles.tableHeaderText, styles.tableNameColumn]}>Pattern</Text><Text style={styles.tableHeaderText}>Core</Text><Text style={styles.tableHeaderText}>Support</Text><Text style={styles.tableHeaderText}>Focus</Text></View>
      {rows.map((row, index) => <View key={row.name} style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt]}><View style={styles.tableNameColumn}><Text style={styles.tableName}>{row.name}</Text><Text style={styles.tableMeaning}>{row.meaning}</Text></View>{row.values.map((item, valueIndex) => <View key={`${row.name}-${valueIndex}`} style={styles.tableValue}><Text style={styles.tableValueNumber}>{item.number}</Text></View>)}</View>)}
    </View>
  );
}

export default function MatrixDestinyScreen() {
  const router = useRouter();
  const [reading, setReading] = useState<MatrixDestinyResponse | null>(null);
  const [ai, setAi] = useState<MatrixDestinyAiState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [diagramOpen, setDiagramOpen] = useState(false);
  const pollAttempts = useRef(0);

  useEffect(() => {
    let active = true;
    getMatrixDestiny()
      .then((result) => {
        if (!active) return;
        setReading(result);
        setAi(result.ai);
      })
      .catch((reason) => {
        if (active) setError(reason instanceof Error ? reason.message : 'Matrix Destiny could not be opened.');
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!reading || reading.access.tier !== 'premium' || ai?.status === 'ready' || ai?.status === 'failed') return;
    let active = true;
    const poll = async () => {
      try {
        const result = await getMatrixDestinyAi();
        if (!active) return;
        setAi(result);
        pollAttempts.current += 1;
        if (!['ready', 'failed'].includes(result.status) && pollAttempts.current < MAX_AI_POLL_ATTEMPTS) {
          setTimeout(poll, Math.min(4000, 1200 + pollAttempts.current * 250));
        } else if (!['ready', 'failed'].includes(result.status)) {
          setAi({ status: 'failed', generatedAt: null, sections: [], message: 'This is taking longer than expected. Your matrix is still available above.' });
        }
      } catch {
        if (active && pollAttempts.current < 3) {
          pollAttempts.current += 1;
          setTimeout(poll, 2500);
        }
        else if (active) setAi({ status: 'failed', generatedAt: null, sections: [], message: 'We could not finish the deeper reading. Your matrix is still available above.' });
      }
    };
    pollAttempts.current = 0;
    const timer = setTimeout(poll, 700);
    return () => { active = false; clearTimeout(timer); };
  }, [reading?.access.tier]);

  if (error) {
    return <View style={styles.center}><Text style={styles.errorTitle}>Your matrix is not ready</Text><Text style={styles.errorBody}>{error}</Text><TouchableOpacity onPress={() => router.back()}><Text style={styles.link}>Go back</Text></TouchableOpacity></View>;
  }

  if (!reading) {
    return <ScrollView style={styles.container} contentContainerStyle={styles.content}><SkeletonCard height={170} lines={3} /><SkeletonCard height={150} lines={3} style={{ marginTop: 14 }} /><SkeletonCard height={150} lines={3} style={{ marginTop: 14 }} /></ScrollView>;
  }

  const { matrix } = reading;
  const readySections = new Map((ai?.sections ?? []).map((section) => [section.key, section]));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Animated.View entering={FadeInUp.duration(450)} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}><Text style={styles.backIcon}>←</Text></TouchableOpacity>
        <Text style={styles.headerLabel}>Matrix Destiny</Text>
        <View style={styles.backButtonPlaceholder} />
      </Animated.View>
      <Animated.View entering={FadeInUp.delay(80).duration(450)}>
        <Text style={styles.eyebrow}>22-ARCANA DESTINY MAP</Text>
        <Text style={styles.title}>{reading.profile.name}, this is the pattern you are learning to shape.</Text>
        <Text style={styles.summary}>{reading.summary}</Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(150).duration(450)} style={styles.heroCard}>
        <LinearGradient colors={theme.gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroGradient}>
          <Text style={styles.heroKicker}>YOUR CENTER</Text>
          <View style={styles.centerRow}>
            <View style={styles.centerNumber}><Text style={styles.centerNumberText}>{matrix.center.number}</Text></View>
            <View style={styles.centerCopy}>
              <Text style={styles.centerName}>{matrix.center.name}</Text>
              <Text style={styles.centerKeywords}>{matrix.center.keywords.join(' · ')}</Text>
            </View>
          </View>
          <Text style={styles.centerNote}>The quality you return to when you have room to choose.</Text>
        </LinearGradient>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(220).duration(450)} style={styles.mapCard}>
        <View style={styles.cardHeadingRow}><View><Text style={styles.cardEyebrow}>THE MAP AT A GLANCE</Text><Text style={styles.cardTitle}>Four directions to notice</Text></View><Text style={styles.arcanaCount}>22 ARCANA</Text></View>
        <TouchableOpacity activeOpacity={0.92} onPress={() => setDiagramOpen(true)} accessibilityRole="button" accessibilityLabel="Open full Matrix Destiny diagram">
          <MatrixDiagram matrix={matrix} />
          <View style={styles.diagramHint}><Text style={styles.diagramHintText}>Tap to explore the full map</Text><Text style={styles.diagramHintArrow}>↗</Text></View>
        </TouchableOpacity>
        <View style={styles.arcanaGrid}>
          <ArcanaCard label="Purpose" item={matrix.purpose} />
          <ArcanaCard label="Talent" item={matrix.talent} />
          <ArcanaCard label="This year" item={matrix.currentYear} />
        </View>
        <Text style={styles.lineTitle}>Relationship line</Text>
        <View style={styles.lineRow}>{matrix.relationshipLine.map((item) => <ArcanaCard key={`relationship-${item.position}`} label={humanPositionLabel(item.position)} item={item} />)}</View>
        <Text style={styles.lineTitle}>Career and money line</Text>
        <View style={styles.lineRow}>{matrix.moneyLine.map((item) => <ArcanaCard key={`money-${item.position}`} label={humanPositionLabel(item.position)} item={item} />)}</View>
        <Text style={styles.lineTitle}>Karmic tail</Text>
        <View style={styles.lineRow}>{matrix.karmicTail.map((item) => <ArcanaCard key={`karmic-${item.position}`} label={humanPositionLabel(item.position)} item={item} />)}</View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(290).duration(450)} style={styles.reflectionCard}>
        <Text style={styles.cardEyebrow}>A SMALL REFLECTION</Text>
        <Text style={styles.reflectionTitle}>Where is this pattern already asking for a gentler choice?</Text>
        <Text style={styles.reflectionBody}>Use the map as a mirror, not a verdict. The most useful meaning is the one that helps you notice what is happening now.</Text>
      </Animated.View>

      {reading.access.tier !== 'premium' && <Animated.View entering={FadeInUp.delay(350).duration(450)} style={styles.unlockCard}>
        <LinearGradient colors={theme.gradients.love} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.unlockGradient}>
          <Text style={styles.cardEyebrow}>WHEN YOU ARE READY</Text>
          <Text style={styles.unlockTitle}>Let the pattern become a practice.</Text>
          <Text style={styles.unlockBody}>Premium opens a fuller reading across career, shadow patterns, relationships, the current year, and a 30-day action plan.</Text>
          <TouchableOpacity style={styles.unlockButton} onPress={() => router.push('/pricing')}><Text style={styles.unlockButtonText}>Explore the deeper reading</Text><Text style={styles.unlockArrow}>→</Text></TouchableOpacity>
        </LinearGradient>
      </Animated.View>}

      {reading.access.tier === 'premium' && <>
        <View style={styles.premiumHeadingRow}><View><Text style={styles.cardEyebrow}>YOUR PRIVATE READING</Text><Text style={styles.premiumHeading}>A deeper reading for you</Text></View><ReadingStatus status={ai?.status ?? 'generating'} /></View>
        {premiumKeys.map((key, index) => {
          const section = readySections.get(key);
          if (!section) return <SkeletonCard key={key} height={150} lines={4} style={{ marginTop: 12 }} />;
          return <Animated.View key={key} entering={FadeInUp.delay(350 + index * 70).duration(400)} style={[styles.sectionCard, index === 0 && styles.sectionCardFeatured]}><View style={styles.sectionIndex}><Text style={styles.sectionIndexText}>{String(index + 1).padStart(2, '0')}</Text></View><Text style={styles.sectionTitle}>{section.title}</Text><Text style={styles.sectionBody}>{section.body}</Text><View style={styles.actionBlock}><Text style={styles.actionLabel}>TRY THIS</Text>{section.actions.map((action, actionIndex) => <Text key={`${key}-action-${actionIndex}`} style={styles.action}>{action}</Text>)}</View></Animated.View>;
        })}
        {ai?.status === 'failed' && <>
          <Text style={styles.status}>{ai.message ?? 'Your deeper reading could not finish yet. Your matrix is still available above.'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => router.replace('/matrix-destiny')}><Text style={styles.retryText}>Try again</Text></TouchableOpacity>
        </>}
      </>}

      <Modal visible={diagramOpen} animationType="fade" transparent onRequestClose={() => setDiagramOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.diagramModal}>
            <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled contentOffset={{ x: 0, y: 0 }} contentContainerStyle={styles.modalScrollContent}>
              <View style={styles.modalHeader}><View><Text style={styles.modalEyebrow}>PERSONAL CALCULATION</Text><Text style={styles.modalTitle}>{reading.profile.name}'s Matrix map</Text></View><Pressable onPress={() => setDiagramOpen(false)} style={styles.closeButton} accessibilityRole="button" accessibilityLabel="Close diagram"><Text style={styles.closeButtonText}>×</Text></Pressable></View>
              <Text style={styles.modalSectionTitle}>Personal map</Text>
              <Text style={styles.modalIntro}>Your center sits at the heart of the map. The surrounding points show direction, connection, value, and growth patterns.</Text>
              <View style={styles.expandedDiagram}><MatrixDiagram matrix={matrix} expanded /></View>
              <View style={styles.modalLegend}><View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: theme.colors.ink }]} /><Text style={styles.legendText}>Core pattern</Text></View><View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: theme.colors.lavenderStrong }]} /><Text style={styles.legendText}>Life direction</Text></View><View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: theme.colors.peach }]} /><Text style={styles.legendText}>Growth edge</Text></View></View>
              <Text style={styles.modalSectionTitle}>Pattern card</Text>
              <Text style={styles.modalIntro}>The values behind your personal map.</Text>
              <PatternTable matrix={matrix} />
              <TouchableOpacity style={styles.doneButton} onPress={() => setDiagramOpen(false)}><Text style={styles.doneButtonText}>Back to my reading</Text></TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }, content: { paddingHorizontal: 20, paddingTop: 38, paddingBottom: 120 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  headerLabel: { fontSize: 12, color: theme.colors.muted, letterSpacing: 1, textTransform: 'uppercase' },
  backButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.7)', alignItems: 'center', justifyContent: 'center' },
  backButtonPlaceholder: { width: 38 }, backIcon: { fontSize: 22, color: theme.colors.ink },
  eyebrow: { fontSize: 10, color: '#7A63BD', fontWeight: '800', letterSpacing: 1.2 },
  title: { fontFamily: theme.fonts.serif, fontSize: 27, lineHeight: 34, color: theme.colors.ink, marginTop: 8 },
  summary: { fontSize: 14, lineHeight: 22, color: theme.colors.muted, marginTop: 10 },
  heroCard: { marginTop: 22, borderRadius: 26, overflow: 'hidden', ...theme.shadows.warmSoft }, heroGradient: { padding: 20 }, heroKicker: { fontSize: 10, color: '#6C5F99', fontWeight: '800', letterSpacing: 1.1 }, centerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 14 }, centerNumber: { width: 66, height: 66, borderRadius: 33, backgroundColor: theme.colors.ink, alignItems: 'center', justifyContent: 'center' }, centerNumberText: { color: theme.colors.white, fontFamily: theme.fonts.serif, fontSize: 28 }, centerCopy: { marginLeft: 14, flex: 1 }, centerName: { fontFamily: theme.fonts.serif, fontSize: 24, color: theme.colors.ink }, centerKeywords: { color: '#6C5F99', fontSize: 12, marginTop: 4 }, centerNote: { color: theme.colors.ink, fontSize: 12, lineHeight: 18, marginTop: 18, maxWidth: 260 },
  mapCard: { marginTop: 16, padding: 17, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.78)', borderWidth: 1, borderColor: 'rgba(31,33,48,0.08)' }, cardHeadingRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }, cardEyebrow: { fontSize: 10, color: '#7A63BD', fontWeight: '800', letterSpacing: 1 }, cardTitle: { fontFamily: theme.fonts.serif, fontSize: 20, color: theme.colors.ink, marginTop: 5 }, arcanaCount: { fontSize: 9, color: theme.colors.softMuted, fontWeight: '800', letterSpacing: 0.7, marginTop: 3 },
  diagramWrap: { width: '100%', aspectRatio: 1, marginTop: 14, position: 'relative', overflow: 'hidden', backgroundColor: 'rgba(247,242,234,0.58)', borderRadius: 19, borderWidth: 1, borderColor: 'rgba(31,33,48,0.05)' }, diagramNode: { position: 'absolute', width: 76, alignItems: 'center', transform: [{ translateX: -38 }, { translateY: -10 }] }, diagramNumber: { fontSize: 10, fontWeight: '800', color: theme.colors.ink }, diagramCenterNumber: { color: theme.colors.white, fontSize: 14 }, diagramLabel: { color: theme.colors.muted, fontSize: 8, marginTop: 5, textAlign: 'center' }, diagramLabelExpanded: { fontSize: 9 }, diagramHint: { position: 'absolute', right: 12, bottom: 10, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 9, paddingVertical: 6, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.86)' }, diagramHintText: { color: '#6C5F99', fontSize: 9, fontWeight: '700' }, diagramHintArrow: { color: '#6C5F99', fontSize: 13, marginLeft: 5 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(31,33,48,0.48)', justifyContent: 'center', padding: 10 }, diagramModal: { width: '100%', maxHeight: '92%', borderRadius: 28, backgroundColor: theme.colors.bgSoft, overflow: 'hidden' }, modalScrollContent: { padding: 18, paddingTop: 20, paddingBottom: 20 }, modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }, modalEyebrow: { fontSize: 11, color: theme.colors.ink, fontWeight: '800', letterSpacing: 1.1 }, modalTitle: { fontFamily: theme.fonts.serif, fontSize: 25, color: theme.colors.ink, marginTop: 7 }, closeButton: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(31,33,48,0.07)' }, closeButtonText: { color: theme.colors.ink, fontSize: 24, lineHeight: 25, fontWeight: '300' }, modalSectionTitle: { fontFamily: theme.fonts.serif, fontSize: 20, color: theme.colors.ink, marginTop: 20 }, modalIntro: { color: theme.colors.muted, fontSize: 12, lineHeight: 18, marginTop: 7 }, patternTable: { marginTop: 12, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(31,33,48,0.08)' }, tableHeader: { minHeight: 38, flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.ink, paddingHorizontal: 10 }, tableHeaderText: { width: 47, color: 'rgba(255,255,255,0.78)', fontSize: 9, fontWeight: '800', textAlign: 'center', letterSpacing: 0.3 }, tableNameColumn: { flex: 1, alignItems: 'flex-start', textAlign: 'left' }, tableRow: { minHeight: 53, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, backgroundColor: 'rgba(255,255,255,0.78)' }, tableRowAlt: { backgroundColor: 'rgba(232,221,251,0.3)' }, tableName: { color: theme.colors.ink, fontSize: 11, fontWeight: '800' }, tableMeaning: { color: theme.colors.muted, fontSize: 9, marginTop: 3 }, tableValue: { width: 47, alignItems: 'center' }, tableValueNumber: { color: theme.colors.ink, fontSize: 17, fontWeight: '700' }, expandedDiagram: { marginTop: 13, width: '100%', aspectRatio: 1 }, modalLegend: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 10 }, legendItem: { flexDirection: 'row', alignItems: 'center' }, legendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 5 }, legendText: { color: theme.colors.muted, fontSize: 10 }, doneButton: { alignItems: 'center', justifyContent: 'center', minHeight: 44, borderRadius: 17, backgroundColor: theme.colors.ink, marginTop: 15 }, doneButtonText: { color: theme.colors.white, fontSize: 12, fontWeight: '800' },
  arcanaGrid: { flexDirection: 'row', gap: 8, marginTop: 15 }, arcanaCard: { flex: 1, padding: 10, borderRadius: 16, backgroundColor: 'rgba(232,221,251,0.48)', minHeight: 98 }, arcanaLabel: { fontSize: 9, color: theme.colors.muted, textTransform: 'uppercase', letterSpacing: 0.5 }, arcanaNumber: { marginTop: 7, width: 28, height: 28, borderRadius: 14, backgroundColor: '#7A63BD', alignItems: 'center', justifyContent: 'center' }, arcanaNumberText: { color: '#fff', fontWeight: '800' }, arcanaName: { fontSize: 12, fontWeight: '700', color: theme.colors.ink, marginTop: 6 }, arcanaKeywords: { fontSize: 10, color: theme.colors.muted, marginTop: 3 },
  lineTitle: { fontSize: 11, fontWeight: '800', color: theme.colors.ink, marginTop: 18, marginBottom: 8 }, lineRow: { flexDirection: 'row', gap: 8 },
  reflectionCard: { marginTop: 16, padding: 18, borderRadius: 22, backgroundColor: 'rgba(221,237,220,0.62)', borderWidth: 1, borderColor: 'rgba(22,167,160,0.12)' }, reflectionTitle: { fontFamily: theme.fonts.serif, fontSize: 19, lineHeight: 25, color: theme.colors.ink, marginTop: 8 }, reflectionBody: { color: theme.colors.muted, fontSize: 12, lineHeight: 18, marginTop: 8 },
  unlockCard: { marginTop: 16, borderRadius: 23, overflow: 'hidden' }, unlockGradient: { padding: 18 }, unlockTitle: { fontFamily: theme.fonts.serif, fontSize: 21, lineHeight: 27, color: theme.colors.ink, marginTop: 8 }, unlockBody: { color: theme.colors.muted, fontSize: 12, lineHeight: 18, marginTop: 8 }, unlockButton: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', marginTop: 15, paddingHorizontal: 13, paddingVertical: 10, borderRadius: 99, backgroundColor: theme.colors.ink }, unlockButtonText: { color: theme.colors.white, fontSize: 11, fontWeight: '800' }, unlockArrow: { color: theme.colors.white, fontSize: 15, marginLeft: 7 },
  premiumHeadingRow: { alignItems: 'flex-start', marginTop: 29, marginBottom: 2 }, premiumHeading: { fontFamily: theme.fonts.serif, fontSize: 23, color: theme.colors.ink, marginTop: 6 }, readyPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(22,167,160,0.1)', borderRadius: 99, paddingHorizontal: 9, paddingVertical: 7, marginTop: 9 }, readyDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: theme.colors.teal, marginRight: 5 }, readyText: { color: theme.colors.teal, fontSize: 9, fontWeight: '800' }, generatingPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(122,99,189,0.1)', borderRadius: 99, paddingHorizontal: 9, paddingVertical: 7, marginTop: 9 }, generatingDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#7A63BD', marginRight: 5 }, generatingText: { color: '#6C5F99', fontSize: 9, fontWeight: '800' },
  sectionCard: { padding: 18, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.82)', borderWidth: 1, borderColor: 'rgba(31,33,48,0.08)', marginTop: 12 }, sectionCardFeatured: { backgroundColor: 'rgba(232,221,251,0.55)', borderColor: 'rgba(122,99,189,0.2)' }, sectionIndex: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(122,99,189,0.12)', alignItems: 'center', justifyContent: 'center', marginBottom: 11 }, sectionIndexText: { color: '#6C5F99', fontSize: 10, fontWeight: '800' }, sectionTitle: { fontFamily: theme.fonts.serif, fontSize: 20, color: theme.colors.ink }, sectionBody: { fontSize: 13, lineHeight: 21, color: theme.colors.muted, marginTop: 9 }, actionBlock: { marginTop: 15, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(31,33,48,0.08)' }, actionLabel: { color: '#7A63BD', fontSize: 9, fontWeight: '800', letterSpacing: 1 }, action: { fontSize: 12, lineHeight: 19, color: theme.colors.ink, marginTop: 7 }, status: { fontSize: 12, lineHeight: 18, color: theme.colors.muted, marginTop: 14 }, retryButton: { alignSelf: 'flex-start', marginTop: 12, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 16, backgroundColor: '#7A63BD' }, retryText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' }, center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 }, errorTitle: { fontFamily: theme.fonts.serif, fontSize: 24, color: theme.colors.ink }, errorBody: { color: theme.colors.muted, textAlign: 'center', marginTop: 10 }, link: { color: '#7A63BD', fontWeight: '700', marginTop: 18 }
});
