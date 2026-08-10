import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@/src/lib/theme';
import { setObservabilityTag } from '@/src/lib/observability';

type NetworkContextValue = {
  hydrated: boolean;
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
  isOffline: boolean;
  type: NetInfoState['type'] | 'unknown';
  lastChangedAt: number | null;
};

const DEFAULT_NETWORK_STATE: NetworkContextValue = {
  hydrated: false,
  isConnected: null,
  isInternetReachable: null,
  isOffline: false,
  type: 'unknown',
  lastChangedAt: null,
};

const NetworkContext = createContext<NetworkContextValue>(DEFAULT_NETWORK_STATE);

function toNetworkState(state: NetInfoState, lastChangedAt: number | null): NetworkContextValue {
  const offline = state.isConnected === false || state.isInternetReachable === false;
  return {
    hydrated: true,
    isConnected: state.isConnected,
    isInternetReachable: state.isInternetReachable,
    isOffline: offline,
    type: state.type,
    lastChangedAt,
  };
}

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState<NetworkContextValue>(DEFAULT_NETWORK_STATE);

  useEffect(() => {
    let previousOffline = value.isOffline;
    const unsubscribe = NetInfo.addEventListener((state) => {
      const nextOffline = state.isConnected === false || state.isInternetReachable === false;
      const changed = previousOffline !== nextOffline;
      previousOffline = nextOffline;
      setObservabilityTag('network.status', nextOffline ? 'offline' : 'online');
      setValue(toNetworkState(state, changed ? Date.now() : null));
    });

    NetInfo.fetch().then((state) => {
      const next = toNetworkState(state, Date.now());
      previousOffline = next.isOffline;
      setObservabilityTag('network.status', next.isOffline ? 'offline' : 'online');
      setValue(next);
    }).catch(() => {});

    return unsubscribe;
  }, []);

  const memoValue = useMemo(() => value, [value]);

  return (
    <NetworkContext.Provider value={memoValue}>
      {children}
      <OfflineBanner />
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  return useContext(NetworkContext);
}

export function OfflineBanner() {
  const { hydrated, isOffline } = useNetwork();
  if (!hydrated || !isOffline) return null;

  return (
    <View pointerEvents="none" style={styles.banner}>
      <Text style={styles.bannerTitle}>You are offline</Text>
      <Text style={styles.bannerText}>Saved content stays visible. New readings will retry when the connection returns.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 18,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(31,33,48,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    ...theme.shadows.warmSoft,
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  bannerText: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 17,
    color: 'rgba(255,255,255,0.78)',
  },
});
