import Constants from 'expo-constants';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { captureApiError } from '@/src/lib/observability';

const TOKEN_KEY = 'astrovy_auth_tokens';
const DEFAULT_TIMEOUT_MS = 20_000;

export type TokenPair = {
  accessToken: string;
  accessTokenExpiresIn: number;
  refreshToken: string;
  refreshTokenExpiresIn: number;
};

export type ApiUser = {
  id: string;
  email: string;
  hasPassword: boolean;
  linkedProviders: string[];
  createdAt?: string;
};

export type SessionPayload = {
  user: ApiUser;
  tokens: TokenPair;
};

type RequestOptions = Omit<RequestInit, 'body' | 'headers'> & {
  body?: unknown;
  auth?: boolean;
  idempotencyKey?: string;
  timeoutMs?: number;
  reportErrors?: boolean;
};

export class ApiError extends Error {
  code: string;
  status: number;
  category: 'auth' | 'network' | 'offline' | 'premium' | 'quota' | 'server' | 'timeout' | 'validation' | 'unknown';
  details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown, category: ApiError['category'] = 'unknown') {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.category = category;
    this.details = details;
  }
}

function getApiBaseUrl() {
  const configured = process.env.EXPO_PUBLIC_API_URL;
  if (configured) {
    const normalized = configured.replace(/\/$/, '');
    // 10.0.2.2 is Android-emulator-only. iOS Simulator reaches the host through loopback.
    if (Platform.OS === 'ios' && normalized.includes('10.0.2.2')) {
      return normalized.replace('10.0.2.2', '127.0.0.1');
    }
    return normalized;
  }

  const hostUri = Constants.expoConfig?.hostUri ?? Constants.expoGoConfig?.debuggerHost;
  const host = hostUri?.split(':')[0];
  if (host) return `http://${host}:3111/v1`;

  return 'http://127.0.0.1:3111/v1';
}

export const apiConfig = {
  baseUrl: getApiBaseUrl(),
};

if (__DEV__) console.info('[api-config] base URL:', apiConfig.baseUrl);

async function readTokens(): Promise<TokenPair | null> {
  const raw = await SecureStore.getItemAsync(TOKEN_KEY);
  return raw ? (JSON.parse(raw) as TokenPair) : null;
}

async function writeTokens(tokens: TokenPair | null) {
  if (!tokens) {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    return;
  }
  await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(tokens));
}

function timezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) return undefined as T;
  const text = await response.text();
  const payload = text ? safeJsonParse(text) : null;
  if (!response.ok) {
    const error = payload?.error;
    const category = categorizeStatus(response.status, error?.code);
    throw new ApiError(
      response.status,
      error?.code ?? 'REQUEST_FAILED',
      friendlyApiMessage(response.status, error?.code, error?.message, error?.details),
      error?.details,
      category
    );
  }
  return payload as T;
}

function safeJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function categorizeStatus(status: number, code?: string): ApiError['category'] {
  if (status === 401) return 'auth';
  if (status === 403 && code === 'PREMIUM_REQUIRED') return 'premium';
  if (status === 429 || code === 'FEATURE_QUOTA_EXCEEDED') return 'quota';
  if ([400, 422].includes(status)) return 'validation';
  if (status >= 500) return 'server';
  return 'unknown';
}

function friendlyApiMessage(status: number, code?: string, fallback?: string, details?: unknown) {
  const passwordMessage = (details as { fields?: { password?: string[] } } | undefined)?.fields?.password?.[0];
  if (code === 'VALIDATION_ERROR' && passwordMessage) return passwordMessage;
  if (status === 401) return 'Your session expired. Please log in again.';
  if (status === 403 && code === 'PREMIUM_REQUIRED') return fallback ?? 'This reading needs premium access.';
  if (status === 429) return fallback ?? 'You have reached today\'s limit. Try again after the reset.';
  if (status >= 500) return 'Astrovy is having trouble connecting. Please try again.';
  return fallback ?? 'Request failed. Please try again.';
}

function isAbortError(error: unknown) {
  return error instanceof Error && error.name === 'AbortError';
}

function isNetworkError(error: unknown) {
  return error instanceof TypeError || (error instanceof Error && /network|fetch/i.test(error.message));
}

async function rawRequest<T>(path: string, options: RequestOptions, tokens: TokenPair | null) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? DEFAULT_TIMEOUT_MS);
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Timezone': timezone(),
  };

  if (options.idempotencyKey) headers['Idempotency-Key'] = options.idempotencyKey;
  if (options.auth !== false && tokens?.accessToken) {
    headers.Authorization = `Bearer ${tokens.accessToken}`;
  }

  try {
    const response = await fetch(`${apiConfig.baseUrl}${path}`, {
      ...options,
      headers,
      signal: options.signal ?? controller.signal,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });

    return parseResponse<T>(response);
  } catch (error) {
    if (isAbortError(error)) {
      throw new ApiError(0, 'REQUEST_TIMEOUT', 'This is taking longer than expected. Please try again.', undefined, 'timeout');
    }
    if (isNetworkError(error)) {
      throw new ApiError(0, 'NETWORK_UNAVAILABLE', 'You seem to be offline. Check your connection and try again.', undefined, 'network');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

let refreshPromise: Promise<TokenPair | null> | null = null;

async function refreshAccessToken(tokens: TokenPair | null) {
  if (!tokens?.refreshToken) return null;
  if (!refreshPromise) {
    refreshPromise = rawRequest<SessionPayload>('/auth/refresh', {
      method: 'POST',
      auth: false,
      body: { refreshToken: tokens.refreshToken },
      reportErrors: false,
    }, null)
      .then(async (session) => {
        await writeTokens(session.tokens);
        return session.tokens;
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  let tokens = await readTokens();
  try {
    return await rawRequest<T>(path, options, tokens);
  } catch (error) {
    if (
      options.auth !== false &&
      error instanceof ApiError &&
      error.status === 401 &&
      path !== '/auth/refresh'
    ) {
      const refreshed = await refreshAccessToken(tokens);
      if (refreshed) {
        tokens = refreshed;
        try {
          return await rawRequest<T>(path, options, tokens);
        } catch (retryError) {
          error = retryError;
        }
      }
    }

    if (error instanceof ApiError && options.reportErrors !== false) {
      captureApiError({
        path,
        method: options.method,
        status: error.status,
        code: error.code,
        message: error.message,
        category: error.category,
      });
    }
    if (
      options.auth !== false &&
      error instanceof ApiError &&
      error.status === 401
    ) {
      unauthorizedHandler?.();
    }
    throw error;
  }
}

let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(fn: (() => void) | null) {
  unauthorizedHandler = fn;
}

export const authStorage = {
  readTokens,
  writeTokens,
};
