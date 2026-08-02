import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiRequest } from '@/src/lib/api';
import * as backend from '@/src/services/backend';
import type { JournalEntry, MirrorPayload, TarotDraw, TodayPayload } from '@/src/services/backend';

type TarotPosition = 'past' | 'present' | 'future';

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function fallbackStreakDays() {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    return {
      date: date.toISOString().slice(0, 10),
      day: date.toLocaleDateString('en', { weekday: 'short' }).charAt(0),
      active: false,
    };
  });
}

function toMoodHistory(mirror: MirrorPayload | null) {
  return (
    mirror?.days
      .filter((day) => day.mood)
      .map((day) => ({
        mood: day.mood as string,
        date: day.date,
        time: '',
      }))
      .reverse() ?? []
  );
}

function normalizeTarot(draw: TarotDraw) {
  return {
    cardId: draw.cardId,
    reversed: draw.reversed,
    position: draw.position as TarotPosition,
    date: draw.date,
    backend: draw,
  };
}

export function useEngagement() {
  const [today, setToday] = useState<TodayPayload | null>(null);
  const [mirror, setMirror] = useState<MirrorPayload | null>(null);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [tarotState, setTarotState] = useState<backend.TarotState | null>(null);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    const [todayPayload, mirrorPayload, journalPayload, tarotPayload] = await Promise.all([
      backend.getToday(),
      backend.getMirror(),
      backend.listJournalEntries(),
      backend.getTarotToday(),
    ]);
    setToday(todayPayload);
    setMirror(mirrorPayload);
    setJournalEntries(journalPayload.data);
    setTarotState(tarotPayload);
    setLoaded(true);
  }, []);

  useEffect(() => {
    refresh().catch(() => setLoaded(true));
  }, [refresh]);

  const addMood = useCallback(
    async (mood: string) => {
      const result = await backend.createCheckIn(mood);
      setToday((prev) =>
        prev
          ? {
              ...prev,
              checkedInToday: true,
              todayMood: result.checkIn.mood,
              streak: result.streak,
              moodResponse: result.moodResponse as TodayPayload['moodResponse'],
              patternAlert: result.patternAlert as TodayPayload['patternAlert'],
            }
          : prev
      );
      await refresh().catch(() => {});
      return result;
    },
    [refresh]
  );

  const checkInToday = useCallback(async () => {
    if (today?.checkedInToday) return today;
    return addMood(today?.todayMood ?? 'steady');
  }, [addMood, today]);

  const addJournalEntry = useCallback(
    async (text: string, prompt = today?.journal.prompt ?? 'What do I need but avoid asking for?') => {
      const result = await backend.createJournalEntry(text, prompt);
      setJournalEntries((prev) => [result.entry, ...prev]);
      setMirror((prev) => (prev ? { ...prev, reflections: result.reflections } : prev));
      await refresh().catch(() => {});
      return result;
    },
    [refresh, today?.journal.prompt]
  );

  const clearAllData = useCallback(async () => {
    setToday(null);
    setMirror(null);
    setJournalEntries([]);
    setTarotState(null);
  }, []);

  const drawTarotCard = useCallback(async () => {
    const result = await backend.createTarotDraw('single');
    setTarotState(result);
    return result;
  }, []);

  const drawTarotSpread = useCallback(async () => {
    const result = await backend.createTarotDraw('three');
    setTarotState(result);
    return result;
  }, []);

  const canDrawTarot = useCallback(
    (_isPremium: boolean) => (tarotState?.drawsRemaining ?? 1) > 0,
    [tarotState?.drawsRemaining]
  );

  const getTarotDrawsRemaining = useCallback(
    (_isPremium: boolean) => tarotState?.drawsRemaining ?? 1,
    [tarotState?.drawsRemaining]
  );

  const getConsecutiveMood = useCallback(() => mirror?.moodPattern?.topMood ?? null, [mirror?.moodPattern?.topMood]);

  const getWeeklyReadingStatus = useCallback(() => {
    const reading = today?.weeklyReading;
    return { isNewWeek: Boolean(reading?.isNew), weekStart: String(reading?.id ?? todayIso()) };
  }, [today?.weeklyReading]);

  const markWeeklyReadingSeen = useCallback(() => {}, []);

  const dismissWeeklyReading = useCallback(async () => {
    const id = today?.weeklyReading?.id;
    if (!id) return;
    await apiRequest<void>(`/readings/weekly/${id}/dismiss`, { method: 'POST' });
    await refresh().catch(() => {});
  }, [refresh, today?.weeklyReading]);

  const getStreakDays = useCallback(() => {
    if (!mirror?.days) return fallbackStreakDays();
    return mirror.days.map((day) => ({
      date: day.date,
      day: day.dayLetter,
      active: day.checkedIn,
    }));
  }, [mirror?.days]);

  const moodHistory = useMemo(() => toMoodHistory(mirror), [mirror]);
  const todayTarotCards = useMemo(() => tarotState?.draws.map(normalizeTarot) ?? [], [tarotState?.draws]);

  return {
    loaded,
    streak: today?.streak ?? mirror?.streak ?? 0,
    lastCheckIn: today?.checkedInToday ? today.date : null,
    journalEntries,
    moodHistory,
    unlockedReadings: mirror?.savedReadings.filter((reading) => reading.unlocked).map((reading) => reading.key) ?? [],
    reflections: mirror?.reflections ?? journalEntries.length,
    lastWeeklyReadingDate: today?.weeklyReading?.id ?? null,
    dismissedWeeklyReading: Boolean(today?.weeklyReading?.dismissed),
    tarotDrawsToday: todayTarotCards.length,
    lastTarotDate: todayTarotCards.length ? todayIso() : null,
    todayTarotCards,
    todayPayload: today,
    mirrorPayload: mirror,
    tarotPayload: tarotState,
    checkInToday,
    addJournalEntry,
    addMood,
    unlockReading: () => {},
    canUnlock: (requiredReflections = 3) => (mirror?.reflections ?? journalEntries.length) >= requiredReflections,
    reflectionsNeeded: (required = 3) => Math.max(0, required - (mirror?.reflections ?? journalEntries.length)),
    getStreakDays,
    clearAllData,
    getConsecutiveMood,
    getWeeklyReadingStatus,
    markWeeklyReadingSeen,
    dismissWeeklyReading,
    drawTarotCard,
    drawTarotSpread,
    canDrawTarot,
    getTarotDrawsRemaining,
  };
}
