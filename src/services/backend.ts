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

export type LegalInfo = {
  appName: string;
  privacyUrl: string;
  termsUrl: string;
  supportEmail: string;
  accountDeletion: {
    method: 'DELETE';
    path: string;
    requiresAuthentication: boolean;
    confirmation: string;
  };
  subscriptions: {
    appleManageUrl: string;
    googleManageUrl: string;
    note: string;
  };
};

export const DEFAULT_LEGAL_INFO: LegalInfo = {
  appName: 'Astrovy',
  privacyUrl: 'https://astrovy.space/privacy',
  termsUrl: 'https://astrovy.space/terms',
  supportEmail: 'admin@astrovy.space',
  accountDeletion: {
    method: 'DELETE',
    path: '/v1/users/me',
    requiresAuthentication: true,
    confirmation: 'Password confirmation is required for password accounts.',
  },
  subscriptions: {
    appleManageUrl: 'https://apps.apple.com/account/subscriptions',
    googleManageUrl: 'https://play.google.com/store/account/subscriptions',
    note: 'Deleting an account does not cancel App Store or Google Play subscriptions.',
  },
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
  retention?: {
    completionScore: number;
    completedCount: number;
    totalCount: number;
    summary: string;
    nextAction: {
      key: 'check_in' | 'journal' | 'tarot' | 'complete';
      title: string;
      body: string;
      cta: string;
      route: string;
      completed: boolean;
    };
    steps: Array<{
      key: 'check_in' | 'journal' | 'tarot';
      title: string;
      body: string;
      cta: string;
      route: string;
      completed: boolean;
    }>;
  };
  energies?: Array<{ label: string; value: number }>;
  horoscope?: {
    moonPhase?: { name?: string; illumination?: number; meaning?: string };
    primaryAspect?: { transit?: string; natal?: string; aspect?: string; tone?: string };
    todaySignal?: {
      signal?: { title?: string; sub?: string };
      insight?: string;
      move?: string;
      attribution?: string;
    };
    calculation?: { engine?: string };
  };
  generation?: Record<string, any>;
  tier: 'free' | 'premium';
};

export type TodayWidgetSnapshot = {
  date: string;
  userName: string;
  todaySignal: {
    title: string;
    subtitle: string;
  };
  insight: string;
  bestMove: string;
  streak: number;
  checkedInToday: boolean;
  tier: 'free' | 'premium';
  source: string;
  updatedAt: string;
};

export type ContentJobStatus = {
  id: string | null;
  scope: 'onboarding' | 'first_mirror' | 'daily' | 'profile';
  feature: 'first_mirror' | 'today' | 'birth_chart_report' | 'love_reading';
  contentDate: string;
  status: 'not_started' | 'queued' | 'generating' | 'ready' | 'failed';
  attempts: number;
  sourceCacheKey: string | null;
  errorCode: string | null;
  errorMessage: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  updatedAt: string | null;
};

export type ContentPrewarmStatus = {
  scope: 'onboarding' | 'first_mirror' | 'daily' | 'profile';
  jobs: ContentJobStatus[];
  summary: {
    total: number;
    ready: number;
    generating: number;
    failed: number;
  };
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
  insightSummary?: {
    title: string;
    body: string;
    tone: 'reflective' | 'active' | 'soft' | string;
  };
  patternCards?: Array<{
    key: 'dominant_mood' | 'recurring_theme' | 'growth_cue' | string;
    title: string;
    value: string;
    body: string;
    premiumDepth?: boolean;
  }>;
  weeklyArc?: {
    completionRate: number;
    checkedInDays: number;
    journaledDays: number;
    days: Array<{
      date: string;
      dayLetter: string;
      checkedIn: boolean;
      mood: string | null;
      journaled: boolean;
      intensity: number;
    }>;
  };
  recentEntries: JournalEntry[];
  savedReadings: Array<{ key: string; title: string; unlocked: boolean }>;
  astro: any | null;
};

export type MirrorJourneyPayload = {
  access: {
    tier: 'free' | 'premium';
    level: 'basic' | 'full';
    lockedSections: string[];
  };
  range: '7d' | '30d' | '90d';
  summary: {
    provider: 'static' | 'openai' | 'alibaba';
    model: string;
    templateVersion: string;
    title: string;
    body: string;
  };
  graph: {
    kind: 'mood_journey';
    points: Array<{ date: string; mood: string; value: number }>;
  };
  timeline: Array<JournalEntry & { mood: string | null }>;
  reflectionStats: {
    total: number;
    journaledDays: number;
    checkInDays: number;
    consistency: number;
  };
  moodDistribution: Array<{ mood: string; count: number; percentage: number }> | null;
  themeCards: Array<{ key: string; title: string; body: string }> | null;
  premiumInsights: { rangeLabel: string; body: string } | null;
  generation?: {
    summary: {
      status: 'basic' | 'generating' | 'ready';
      source?: 'backend' | 'cache' | 'generated';
      provider?: 'static' | 'openai' | 'alibaba';
      model?: string;
      promptId?: string;
      promptVersion?: string;
      cacheKey?: string;
      pollAfterMs?: number;
      quality?: Record<string, any>;
    };
  };
};

export type FirstMirrorPayload = {
  label: string;
  title: string;
  subtitle: string;
  archetype: { name?: string; tagline?: string };
  badges: string[];
  patternCards: Array<{ title: string; desc: string }>;
  insight: { title: string; paragraphs: string[] };
  softCta: string;
  generation: {
    provider: 'static' | 'openai' | 'alibaba';
    model: string;
    promptId: string;
    promptVersion: string;
    cacheKey: string | null;
    source?: string;
    status?: string;
    quality?: Record<string, any>;
  };
  feedback?: FeedbackState | null;
};

export type FeedbackState = {
  targetType: string;
  targetId: string | null;
  value: string;
  submittedAt: string;
};

export type TarotDraw = {
  id: string;
  cardId: string;
  name: string;
  emoji: string;
  suit: string;
  visual?: TarotVisual;
  reversed: boolean;
  position: 'past' | 'present' | 'future';
  keywords: unknown;
  meaning: string;
  interpretation: {
    meaning?: string;
    reflectionPrompt?: string;
    action?: string;
    shadowNote?: string;
    source?: string;
  } | null;
  date: string;
};

export type TarotVisual = {
  imageKey: string;
  hasArtwork: boolean;
  imageUrl: string | null;
  symbol: string;
  arcana: 'major' | 'minor' | string;
  suit: string;
  rank: string | null;
  palette: {
    background: [string, string];
    accent: string;
    ink: string;
    aura: string;
  };
  visualPrompt: string;
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

export type BirthChartReport = {
  access: {
    tier: 'free' | 'premium';
    level: 'summary' | 'full';
    lockedSections: string[];
  };
  summary: {
    bigThree: {
      sun: { planet: string; sign: string; signLabel: string; house: number | null } | null;
      moon: { planet: string; sign: string; signLabel: string; house: number | null } | null;
      rising: { point: string; sign: string; signLabel: string; degree?: number } | null;
    };
    dominantElement: { key: string; count: number; distribution: Record<string, number> };
    dominantModality: { key: string; count: number; distribution: Record<string, number> };
    chartSignature: string;
    shortInterpretation: string;
  };
  chartWheel?: {
    zodiac: Array<{ sign: string; signLabel: string; symbol: string; startLongitude: number; endLongitude: number }>;
    houseCusps: Array<{ house: number | null; system: string; cusp: number; sign: string; signLabel: string }>;
    axes: Record<string, { point: string; longitude: number; sign: string; signLabel: string; signDegree: number }>;
    planets: Array<{
      planet: string;
      symbol?: string;
      longitude: number;
      degree?: number;
      sign: string;
      signLabel?: string;
      signDegree: number;
      house?: number | null;
      retrograde?: boolean;
    }>;
  };
  planets: Array<{
    planet: string;
    symbol?: string;
    degree: number;
    eclipticLongitude?: number;
    sign: string;
    signLabel?: string;
    signDegree?: number;
    house?: number | null;
    houseSystem?: string | null;
    retrograde?: boolean;
    meaning?: string;
    element?: string;
    modality?: string;
    interpretation?: string;
  }>;
  ascendant: any | null;
  midheaven: any | null;
  houses: any | null;
  calculation: any | null;
  aspects?: Array<{ planets: string[]; aspect: string; angle: number; orb: number; tone: string; interpretation: string }>;
  chartPatterns?: Array<{ type: string; title: string; description: string }>;
  reportSections?: Array<{ key: string; title: string; body: string }>;
};

export type CompatibilityReading = {
  id: string;
  access: {
    tier: 'free' | 'premium';
    level: 'quick' | 'full';
    lockedModes: string[];
  };
  userSign: string;
  partnerSign: string;
  partnerName: string | null;
  partnerBirthDate: string | null;
  partnerBirthPlace: ProfilePayload['profile']['birthPlace'] | null;
  basis: Record<string, any>;
  scores: Record<string, number>;
  sections: Array<{ key: string; title: string; body: string }>;
  quote: string;
  quickSummary: { title: string; body: string; upgradeHint: string } | null;
  premiumDetails: {
    scoreBreakdown: {
      emotional: number;
      attraction: number;
      communication: number;
      growth: number;
    };
    chartBasis: Record<string, any>;
    deepSections: Array<{ key: string; title: string; body: string }>;
  } | null;
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

export function register(input: { email: string; password: string }) {
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

export function getLegalInfo() {
  return apiRequest<LegalInfo>('/legal', { auth: false });
}

export function deleteAccount(input: { password?: string; confirm?: 'DELETE' }) {
  return apiRequest<void>('/users/me', {
    method: 'DELETE',
    body: input,
  });
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

export function setEntitlementPreview(tier: 'free' | 'premium') {
  return apiRequest<Entitlement>('/entitlements/me/preview', {
    method: 'PATCH',
    body: { tier },
  });
}

export function verifyGoogleIapPurchase(input: { purchaseToken: string; productId: string }) {
  return apiRequest<Entitlement>('/iap/google/verify', {
    method: 'POST',
    body: input,
  });
}

export function getProducts() {
  return apiRequest<{ products: Array<Record<string, any>>; features: string[] }>('/products');
}

export function getToday(options: { fast?: boolean } = {}) {
  return apiRequest<TodayPayload>(options.fast ? '/today?mode=fast' : '/today');
}

export function getTodayWidget() {
  return apiRequest<TodayWidgetSnapshot>('/widgets/today');
}

export function prewarmContent(scope: ContentPrewarmStatus['scope'] = 'daily', options: { wait?: boolean } = {}) {
  const wait = options.wait ? '&wait=true' : '';
  return apiRequest<ContentPrewarmStatus>(`/content/prewarm?scope=${encodeURIComponent(scope)}${wait}`, {
    method: 'POST',
  });
}

export function getContentStatus(scope: ContentPrewarmStatus['scope'] = 'daily') {
  return apiRequest<ContentPrewarmStatus>(`/content/status?scope=${encodeURIComponent(scope)}`);
}

export function getMirror() {
  return apiRequest<MirrorPayload>('/mirror');
}

export function getMirrorJourney(range: '7d' | '30d' | '90d' = '30d') {
  return apiRequest<MirrorJourneyPayload>(`/mirror/journey?range=${encodeURIComponent(range)}`);
}

function localDateKey() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function createCheckIn(mood: string) {
  return apiRequest<{ checkIn: { date: string; mood: string; createdAt: string }; streak: number; moodResponse: unknown; patternAlert: unknown }>(
    '/check-ins',
    {
      method: 'POST',
      body: { mood },
      idempotencyKey: `check-in-${localDateKey()}`,
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

export function getFirstMirrorReading(options: { fast?: boolean } = {}) {
  return apiRequest<FirstMirrorPayload>(options.fast ? '/readings/first-mirror?mode=fast' : '/readings/first-mirror');
}

export function getLoveReading(options: { fast?: boolean } = {}) {
  return apiRequest<any>(options.fast ? '/readings/love?mode=fast' : '/readings/love');
}

export function getDailyHoroscope() {
  return apiRequest<any>('/horoscope/daily');
}

export function getNatalChart(options: { fast?: boolean } = {}) {
  return apiRequest<BirthChartReport>(options.fast ? '/natal-chart?mode=fast' : '/natal-chart');
}

export function createCompatibilityReading(input: {
  partnerName?: string;
  partnerSign?: string;
  partnerBirthDate?: string;
  partnerBirthTime?: string | null;
  partnerBirthPlace?: ProfilePayload['profile']['birthPlace'];
}) {
  return apiRequest<CompatibilityReading>('/compatibility/readings', {
    method: 'POST',
    body: input,
  });
}

export function submitFeedback(input: {
  targetType: 'first_mirror' | 'love_reading' | 'daily_reading' | 'tarot_draw' | 'birth_chart_report' | 'compatibility_reading' | 'mirror_journey';
  targetId: string | null;
  value: 'accurate' | 'partial' | 'inaccurate' | 'yes' | 'somewhat' | 'no';
}) {
  return apiRequest<{ feedback: FeedbackState }>('/feedback', { method: 'POST', body: input });
}
