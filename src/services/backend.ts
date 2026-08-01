import { apiRequest, type SessionPayload } from '@/src/lib/api';
import type { City } from '@/src/data/cities.mock';
import type { OnboardingData } from '@/src/context/OnboardingContext';

export type Entitlement = {
  tier: 'free' | 'premium';
  status: string;
  productId: string | null;
  expiresAt: string | null;
  willRenew: boolean;
};

export type TodayPayload = {
  date: string;
  user: { name: string };
  streak: number;
  checkedInToday: boolean;
  todayMood: string | null;
  moodResponse: { title?: string; body?: string } | string | null;
  journal: { prompt: string; lastEntry: JournalEntry | null };
  patternAlert: { mood: string; message: string } | null;
  weeklyReading: Record<string, any>;
  dailyReading: {
    signal?: { title?: string; sub?: string };
    insight?: string;
    move?: string;
    attribution?: string;
  };
  energies?: Array<{ label: string; value: number }>;
  generation?: Record<string, any>;
  tier: 'free' | 'premium';
};

export type JournalEntry = {
  id: string;
  date: string;
  text: string;
  prompt: string;
  createdAt: string;
};

export type MirrorPayload = {
  streak: number;
  reflections: number;
  reflectionsToUnlock: number;
  days: Array<{
    date: string;
    dayLetter: string;
    checkedIn: boolean;
    mood: string | null;
    journaled: boolean;
  }>;
  moodPattern: { topMood: string; count: number; window: number; advice: string } | null;
  recentEntries: JournalEntry[];
  savedReadings: Array<{ key: string; title: string; unlocked: boolean }>;
  astro: any | null;
};

export type TarotDraw = {
  id: string;
  cardId: string;
  name: string;
  emoji: string;
  suit: string;
  reversed: boolean;
  position: 'past' | 'present' | 'future';
  keywords: unknown;
  meaning: string;
  date: string;
};

export type TarotState = {
  draws: TarotDraw[];
  drawsRemaining: number;
  limit: number;
  resetsAt?: string;
};

export type ProfilePayload = {
  profile: {
    name: string;
    birthDate: string;
    birthTime: string | null;
    birthPlace: {
      city: string;
      country: string;
      timezone: string;
      lat: number;
      lng: number;
    };
    mbti: string | null;
    focus: string;
    onboardingComplete: boolean;
  };
  astro: any;
};

type BackendCity = {
  id?: string;
  name?: string;
  city?: string;
  country: string;
  timezone: string;
  lat: number;
  lng: number;
  gmt?: string;
  source?: string;
};

const focusMap: Record<string, string> = {
  worth: 'self-worth',
};

function displayGmt(timezone: string) {
  try {
    const parts = new Intl.DateTimeFormat('en', {
      timeZone: timezone,
      timeZoneName: 'shortOffset',
    }).formatToParts(new Date());
    return parts.find((part) => part.type === 'timeZoneName')?.value.replace('GMT', 'GMT') ?? timezone;
  } catch {
    return timezone;
  }
}

function normalizeCity(city: BackendCity): City {
  const name = city.name ?? city.city ?? '';
  return {
    id: city.id ?? `${name}-${city.country}-${city.lat}-${city.lng}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name,
    country: city.country,
    lat: city.lat,
    lng: city.lng,
    timezone: city.timezone,
    gmt: city.gmt ?? displayGmt(city.timezone),
  };
}

export function register(input: { name: string; email: string; password: string }) {
  return apiRequest<SessionPayload>('/auth/register', {
    method: 'POST',
    body: input,
    auth: false,
  });
}

export function login(input: { email: string; password: string }) {
  return apiRequest<SessionPayload>('/auth/login', {
    method: 'POST',
    body: input,
    auth: false,
  });
}

export function getMe() {
  return apiRequest<{ user: unknown; profile: ProfilePayload['profile'] | null; astro: any | null; entitlement: Entitlement }>('/users/me');
}

export function submitProfile(data: OnboardingData) {
  if (!data.birthDate || !data.birthPlace || !data.focusMood) {
    throw new Error('Please complete onboarding before generating your Astrovy.');
  }

  return apiRequest<ProfilePayload>('/profiles', {
    method: 'POST',
    body: {
      name: data.name,
      birthDate: data.birthDate,
      birthTime: data.birthTime,
      birthPlace: {
        city: data.birthPlace.name,
        country: data.birthPlace.country,
        timezone: data.birthPlace.timezone,
        lat: data.birthPlace.lat,
        lng: data.birthPlace.lng,
      },
      mbti: data.mbti,
      focus: focusMap[data.focusMood] ?? data.focusMood,
    },
  });
}

export function searchBackendCities(query: string) {
  return apiRequest<{ data?: BackendCity[]; cities?: BackendCity[]; results?: BackendCity[] }>(
    `/cities?q=${encodeURIComponent(query)}&limit=8`,
    { auth: false }
  ).then((response) => ({
    data: (response.data ?? response.cities ?? response.results ?? []).map(normalizeCity),
  }));
}

export function getEntitlement() {
  return apiRequest<Entitlement>('/entitlements/me');
}

export function getProducts() {
  return apiRequest<{ products: Array<Record<string, any>>; features: string[] }>('/products');
}

export function getToday() {
  return apiRequest<TodayPayload>('/today');
}

export function getMirror() {
  return apiRequest<MirrorPayload>('/mirror');
}

export function createCheckIn(mood: string) {
  return apiRequest<{ checkIn: { date: string; mood: string; createdAt: string }; streak: number; moodResponse: unknown; patternAlert: unknown }>(
    '/check-ins',
    {
      method: 'POST',
      body: { mood },
      idempotencyKey: `check-in-${new Date().toISOString().slice(0, 10)}`,
    }
  );
}

export function createJournalEntry(text: string, prompt: string) {
  return apiRequest<{ entry: JournalEntry; reflections: number }>('/journal-entries', {
    method: 'POST',
    body: { text, prompt },
  });
}

export function listJournalEntries() {
  return apiRequest<{ data: JournalEntry[]; nextCursor: string | null }>('/journal-entries?limit=20');
}

export function getTarotToday() {
  return apiRequest<TarotState>('/tarot/draws/today');
}

export function createTarotDraw(spread: 'single' | 'three') {
  return apiRequest<TarotState>('/tarot/draws', {
    method: 'POST',
    body: { spread },
    idempotencyKey: `tarot-${spread}-${new Date().toISOString().slice(0, 10)}`,
  });
}

export function getAstrovyReading() {
  return apiRequest<any>('/readings/astrovy');
}

export function getLoveReading() {
  return apiRequest<any>('/readings/love');
}

export function getDailyHoroscope() {
  return apiRequest<any>('/horoscope/daily');
}

export function getNatalChart() {
  return apiRequest<any>('/natal-chart');
}

export function createCompatibilityReading(input: {
  partnerName?: string;
  partnerSign: string;
  partnerBirthDate?: string;
  partnerBirthPlace?: ProfilePayload['profile']['birthPlace'];
}) {
  return apiRequest<any>('/compatibility/readings', {
    method: 'POST',
    body: input,
  });
}

export function submitFeedback(input: {
  targetType: 'first_mirror' | 'love_reading' | 'daily_reading' | 'tarot_draw';
  targetId: string | null;
  value: 'accurate' | 'partial' | 'inaccurate' | 'yes' | 'somewhat' | 'no';
}) {
  return apiRequest<void>('/feedback', { method: 'POST', body: input });
}
