import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
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

export function TierProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [serverPremium, setServerPremium] = useState(false);
  const [loading, setLoading] = useState(false);

  const refreshTier = useCallback(async () => {
    if (!user) {
      setServerPremium(false);
      return;
    }
    setLoading(true);
    try {
      const entitlement = await getEntitlement();
      setServerPremium(entitlement.tier === 'premium' && ['active', 'grace'].includes(entitlement.status));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshTier().catch(() => {});
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
