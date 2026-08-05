import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { router } from 'expo-router';
import { authStorage, setUnauthorizedHandler, type ApiUser } from '@/src/lib/api';
import * as backend from '@/src/services/backend';

type AuthContextValue = {
  user: ApiUser | null;
  hydrated: boolean;
  profileComplete: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: (input: { password?: string; confirm?: 'DELETE' }) => Promise<void>;
  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  hydrated: false,
  profileComplete: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  deleteAccount: async () => {},
  refreshMe: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);
  const hydratedRef = useRef(false);
  hydratedRef.current = hydrated;

  const refreshMe = useCallback(async () => {
    const me = await backend.getMe();
    setUser(me.user as ApiUser);
    setProfileComplete(Boolean(me.profile?.onboardingComplete));
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const tokens = await authStorage.readTokens();
        if (!tokens) return;
        const me = await backend.getMe();
        const currentUser = me.user as ApiUser;
        setUser(currentUser);
        setProfileComplete(Boolean(me.profile?.onboardingComplete));
      } catch {
        await authStorage.writeTokens(null);
        setUser(null);
        setProfileComplete(false);
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const session = await backend.login({ email, password });
    await authStorage.writeTokens(session.tokens);
    try {
      await refreshMe();
    } catch (error) {
      await authStorage.writeTokens(null);
      setUser(null);
      setProfileComplete(false);
      throw error;
    }
  }, [refreshMe]);

  const signUp = useCallback(async (email: string, password: string) => {
    const session = await backend.register({ email, password });
    await authStorage.writeTokens(session.tokens);
    try {
      await refreshMe();
    } catch (error) {
      await authStorage.writeTokens(null);
      setUser(null);
      setProfileComplete(false);
      throw error;
    }
  }, [refreshMe]);

  const signOut = useCallback(async () => {
    await authStorage.writeTokens(null);
    setUser(null);
    setProfileComplete(false);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      if (!hydratedRef.current) return;
      signOut();
      router.replace('/(auth)');
    });
    return () => setUnauthorizedHandler(null);
  }, [signOut]);

  const deleteAccount = useCallback(async (input: { password?: string; confirm?: 'DELETE' }) => {
    await backend.deleteAccount(input);
    await authStorage.writeTokens(null);
    setUser(null);
    setProfileComplete(false);
  }, []);

  const value = useMemo(
    () => ({ user, hydrated, profileComplete, signIn, signUp, signOut, deleteAccount, refreshMe }),
    [deleteAccount, hydrated, profileComplete, refreshMe, signIn, signOut, signUp, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
