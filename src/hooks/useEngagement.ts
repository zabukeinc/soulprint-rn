import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getWeeklyReadingIndex } from '@/src/lib/dailyContent';

const STORAGE_KEY = 'soulprint_engagement';

interface JournalEntry {
  id: number;
  text: string;
  date: string;
  prompt: string;
}

interface MoodEntry {
  mood: string;
  date: string;
  time: string;
}

interface TarotDraw {
  cardId: string;
  reversed: boolean;
  position: 'past' | 'present' | 'future';
  date: string;
}

interface EngagementState {
  streak: number;
  lastCheckIn: string | null;
  journalEntries: JournalEntry[];
  moodHistory: MoodEntry[];
  unlockedReadings: string[];
  reflections: number;
  lastWeeklyReadingDate: string | null;
  dismissedWeeklyReading: boolean;
  // Tarot
  tarotDrawsToday: number;
  lastTarotDate: string | null;
  todayTarotCards: TarotDraw[];
}

const DEFAULT_STATE: EngagementState = {
  streak: 0,
  lastCheckIn: null,
  journalEntries: [],
  moodHistory: [],
  unlockedReadings: [],
  reflections: 0,
  lastWeeklyReadingDate: null,
  dismissedWeeklyReading: false,
  tarotDrawsToday: 0,
  lastTarotDate: null,
  todayTarotCards: [],
};

function getToday() {
  return new Date().toISOString().split('T')[0];
}

function getYesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

async function loadState(): Promise<EngagementState> {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (saved) return { ...DEFAULT_STATE, ...JSON.parse(saved) };
  } catch {}
  return { ...DEFAULT_STATE };
}

async function saveState(state: EngagementState) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function useEngagement() {
  const [state, setState] = useState<EngagementState>(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadState().then((s) => {
      setState(s);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded) {
      saveState(state);
    }
  }, [state, loaded]);

  const checkInToday = useCallback(() => {
    const today = getToday();
    if (state.lastCheckIn === today) return state;

    let newStreak = state.streak;
    if (state.lastCheckIn === getYesterday()) {
      newStreak = state.streak + 1;
    } else if (state.lastCheckIn !== today) {
      newStreak = 1;
    }

    const newState = { ...state, streak: newStreak, lastCheckIn: today };
    setState(newState);
    return newState;
  }, [state]);

  const addJournalEntry = useCallback((text: string) => {
    const entry: JournalEntry = {
      id: Date.now(),
      text,
      date: getToday(),
      prompt: 'What do I need but avoid asking for?',
    };
    const newState = {
      ...state,
      journalEntries: [entry, ...state.journalEntries],
      reflections: state.reflections + 1,
    };
    setState(newState);
    return newState;
  }, [state]);

  const addMood = useCallback((mood: string) => {
    const entry: MoodEntry = {
      mood,
      date: getToday(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    const newState = {
      ...state,
      moodHistory: [entry, ...state.moodHistory],
    };
    setState(newState);
    return newState;
  }, [state]);

  const unlockReading = useCallback((readingId: string) => {
    if (state.unlockedReadings.includes(readingId)) return state;
    const newState = {
      ...state,
      unlockedReadings: [...state.unlockedReadings, readingId],
    };
    setState(newState);
    return newState;
  }, [state]);

  const canUnlock = useCallback((requiredReflections = 3) => {
    return state.reflections >= requiredReflections;
  }, [state.reflections]);

  const reflectionsNeeded = useCallback((required = 3) => {
    return Math.max(0, required - state.reflections);
  }, [state.reflections]);

  const clearAllData = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch {}
    setState({ ...DEFAULT_STATE });
  }, []);

  const drawTarotCard = useCallback(
    (cardId: string, reversed: boolean, position: 'past' | 'present' | 'future') => {
      const today = getToday();
      const draw: TarotDraw = { cardId, reversed, position, date: today };

      setState((prev) => {
        const isNewDay = prev.lastTarotDate !== today;
        return {
          ...prev,
          lastTarotDate: today,
          tarotDrawsToday: isNewDay ? 1 : prev.tarotDrawsToday + 1,
          todayTarotCards: isNewDay
            ? [draw]
            : [...prev.todayTarotCards, draw],
        };
      });
    },
    []
  );

  const canDrawTarot = useCallback(
    (isPremium: boolean) => {
      const today = getToday();
      const isNewDay = state.lastTarotDate !== today;
      const drawsToday = isNewDay ? 0 : state.tarotDrawsToday;
      const limit = isPremium ? 3 : 1;
      return drawsToday < limit;
    },
    [state.lastTarotDate, state.tarotDrawsToday]
  );

  const getTarotDrawsRemaining = useCallback(
    (isPremium: boolean) => {
      const today = getToday();
      const isNewDay = state.lastTarotDate !== today;
      const drawsToday = isNewDay ? 0 : state.tarotDrawsToday;
      const limit = isPremium ? 3 : 1;
      return Math.max(0, limit - drawsToday);
    },
    [state.lastTarotDate, state.tarotDrawsToday]
  );

  const getConsecutiveMood = useCallback(() => {
    if (state.moodHistory.length < 3) return null;
    const recent = state.moodHistory.slice(0, 3);
    const firstMood = recent[0].mood;
    const allSame = recent.every((m) => m.mood === firstMood);
    return allSame ? firstMood : null;
  }, [state.moodHistory]);

  const getWeeklyReadingStatus = useCallback(() => {
    const weekStart = getWeeklyReadingIndex().toString();
    const isNewWeek = state.lastWeeklyReadingDate !== weekStart;
    return { isNewWeek, weekStart };
  }, [state.lastWeeklyReadingDate]);

  const markWeeklyReadingSeen = useCallback(() => {
    const weekStart = getWeeklyReadingIndex().toString();
    setState((prev) => ({ ...prev, lastWeeklyReadingDate: weekStart, dismissedWeeklyReading: false }));
  }, []);

  const dismissWeeklyReading = useCallback(() => {
    setState((prev) => ({ ...prev, dismissedWeeklyReading: true }));
  }, []);

  const getStreakDays = useCallback(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en', { weekday: 'short' }).charAt(0);
      const hadCheckIn = state.moodHistory.some((m) => m.date === dateStr);
      days.push({ date: dateStr, day: dayName, active: hadCheckIn });
    }
    return days;
  }, [state.moodHistory]);

  return {
    ...state,
    checkInToday,
    addJournalEntry,
    addMood,
    unlockReading,
    canUnlock,
    reflectionsNeeded,
    getStreakDays,
    clearAllData,
    getConsecutiveMood,
    getWeeklyReadingStatus,
    markWeeklyReadingSeen,
    dismissWeeklyReading,
    drawTarotCard,
    canDrawTarot,
    getTarotDrawsRemaining,
  };
}
