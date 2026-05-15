import React, { createContext, useContext, useState } from 'react';

interface TierContextType {
  isPremium: boolean;
  toggleTier: () => void;
}

const TierContext = createContext<TierContextType>({
  isPremium: false,
  toggleTier: () => {},
});

export function TierProvider({ children }: { children: React.ReactNode }) {
  const [isPremium, setIsPremium] = useState(false);
  const toggleTier = () => setIsPremium((prev) => !prev);

  return (
    <TierContext.Provider value={{ isPremium, toggleTier }}>
      {children}
    </TierContext.Provider>
  );
}

export function useTier() {
  return useContext(TierContext);
}
