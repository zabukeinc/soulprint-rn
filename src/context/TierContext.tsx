import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { useAuth } from '@/src/context/AuthContext';
import { getEntitlement } from '@/src/services/backend';

interface TierContextType {
  isPremium: boolean;
  loading: boolean;
  refreshTier: () => Promise<void>;
}

const TierContext = createContext<TierContextType>({
  isPremium: false,
  loading: false,
  refreshTier: async () => {},
});

const FOREGROUND_REFRESH_COOLDOWN_MS = 60_000;

export function TierProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [serverPremium, setServerPremium] = useState(false);
  const [loading, setLoading] = useState(false);
  const refreshPromiseRef = useRef<Promise<void> | null>(null);
  const lastRefreshAtRef = useRef(0);
  const appStateRef = useRef(AppState.currentState);

  const refreshTier = useCallback(async () => {
    if (!user) {
      setServerPremium(false);
      lastRefreshAtRef.current = 0;
      return;
    }

    if (refreshPromiseRef.current) return refreshPromiseRef.current;

    const refresh = (async () => {
      setLoading(true);
      try {
        const entitlement = await getEntitlement();
        setServerPremium(entitlement.tier === 'premium' && ['active', 'grace'].includes(entitlement.status));
        lastRefreshAtRef.current = Date.now();
      } finally {
        setLoading(false);
        refreshPromiseRef.current = null;
      }
    })();

    refreshPromiseRef.current = refresh;
    return refresh;
  }, [user]);

  useEffect(() => {
    refreshTier().catch(() => {});
  }, [refreshTier]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      const becameActive = /inactive|background/.test(appStateRef.current) && nextState === 'active';
      appStateRef.current = nextState;

      if (becameActive && Date.now() - lastRefreshAtRef.current >= FOREGROUND_REFRESH_COOLDOWN_MS) {
        refreshTier().catch(() => {});
      }
    });

    return () => subscription.remove();
  }, [refreshTier]);

  const value = useMemo(
    () => ({
      isPremium: serverPremium,
      loading,
      refreshTier,
    }),
    [loading, refreshTier, serverPremium]
  );

  return <TierContext.Provider value={value}>{children}</TierContext.Provider>;
}

export function useTier() {
  return useContext(TierContext);
}
