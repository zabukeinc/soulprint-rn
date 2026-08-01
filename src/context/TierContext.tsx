import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { getEntitlement } from '@/src/services/backend';

interface TierContextType {
  isPremium: boolean;
  loading: boolean;
  refreshTier: () => Promise<void>;
  toggleTier: () => void;
}

const TierContext = createContext<TierContextType>({
  isPremium: false,
  loading: false,
  refreshTier: async () => {},
  toggleTier: () => {},
});

export function TierProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [serverPremium, setServerPremium] = useState(false);
  const [previewPremium, setPreviewPremium] = useState<boolean | null>(null);
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

  const toggleTier = useCallback(() => {
    setPreviewPremium((prev) => (prev === null ? !serverPremium : !prev));
  }, [serverPremium]);

  const value = useMemo(
    () => ({
      isPremium: previewPremium ?? serverPremium,
      loading,
      refreshTier,
      toggleTier,
    }),
    [loading, previewPremium, refreshTier, serverPremium, toggleTier]
  );

  return <TierContext.Provider value={value}>{children}</TierContext.Provider>;
}

export function useTier() {
  return useContext(TierContext);
}
