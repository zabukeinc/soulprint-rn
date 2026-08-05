import AsyncStorage from '@react-native-async-storage/async-storage';
import type { TodayPayload, TodayWidgetSnapshot } from '@/src/services/backend';

export const TODAY_WIDGET_SNAPSHOT_KEY = 'astrovy_today_widget_snapshot';

function textOrFallback(value: unknown, fallback: string) {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

export function widgetSnapshotFromToday(today: TodayPayload): TodayWidgetSnapshot {
  const signal = today.dailyReading.signal ?? today.horoscope?.todaySignal?.signal ?? {};
  return {
    date: today.date,
    userName: today.user.name,
    todaySignal: {
      title: textOrFallback(signal.title, 'Today rewards attention.'),
      subtitle: textOrFallback(signal.sub, 'Notice the pattern before reacting.'),
    },
    insight: textOrFallback(today.dailyReading.insight ?? today.horoscope?.todaySignal?.insight, 'A small honest pause can change the shape of the day.'),
    bestMove: textOrFallback(today.dailyReading.move ?? today.horoscope?.todaySignal?.move, 'Choose one grounded action and let that be enough.'),
    streak: today.streak,
    checkedInToday: today.checkedInToday,
    tier: today.tier,
    source: String(today.generation?.dailyReading?.source ?? 'engine'),
    updatedAt: new Date().toISOString(),
  };
}

export async function cacheTodayWidgetSnapshot(snapshot: TodayWidgetSnapshot) {
  await AsyncStorage.setItem(TODAY_WIDGET_SNAPSHOT_KEY, JSON.stringify(snapshot));
}

export async function readTodayWidgetSnapshot() {
  const raw = await AsyncStorage.getItem(TODAY_WIDGET_SNAPSHOT_KEY);
  return raw ? (JSON.parse(raw) as TodayWidgetSnapshot) : null;
}
