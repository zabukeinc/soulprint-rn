import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { City } from '@/src/data/cities.mock';

export type OnboardingData = {
  name: string;
  birthDate: string | null; // 'YYYY-MM-DD'
  birthTime: string | null; // 'HH:mm'
  birthPlace: City | null;
  mbti: string | null;
  focusMood: string | null;
};

const EMPTY: OnboardingData = {
  name: '',
  birthDate: null,
  birthTime: null,
  birthPlace: null,
  mbti: null,
  focusMood: null,
};

const STORAGE_KEY = 'astrovy_onboarding';

type OnboardingContextValue = {
  data: OnboardingData;
  hydrated: boolean;
  update: (patch: Partial<OnboardingData>) => void;
  clear: () => Promise<void>;
};

const OnboardingContext = createContext<OnboardingContextValue>({
  data: EMPTY,
  hydrated: false,
  update: () => {},
  clear: async () => {},
});

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<OnboardingData>(EMPTY);
  const [hydrated, setHydrated] = useState(false);
  const hydratedRef = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setData({ ...EMPTY, ...JSON.parse(raw) });
      } catch {
        // corrupted payload — start fresh
      } finally {
        hydratedRef.current = true;
        setHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (hydratedRef.current) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)).catch(() => {});
    }
  }, [data]);

  const update = (patch: Partial<OnboardingData>) =>
    setData((d) => ({ ...d, ...patch }));

  const clear = async () => {
    setData(EMPTY);
    await AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  };

  return (
    <OnboardingContext.Provider value={{ data, hydrated, update, clear }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  return useContext(OnboardingContext);
}
