import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'astrovy_auth_tokens';

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
};

export class ApiError extends Error {
  code: string;
  status: number;
  details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function getApiBaseUrl() {
  const configured = process.env.EXPO_PUBLIC_API_URL;
  if (configured) return configured.replace(/\/$/, '');

  const hostUri = Constants.expoConfig?.hostUri ?? Constants.expoGoConfig?.debuggerHost;
  const host = hostUri?.split(':')[0];
  if (host) return `http://${host}:3111/v1`;

  return 'http://127.0.0.1:3111/v1';
}

export const apiConfig = {
  baseUrl: getApiBaseUrl(),
};

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
  const payload = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const error = payload?.error;
    throw new ApiError(
      response.status,
      error?.code ?? 'REQUEST_FAILED',
      error?.message ?? 'Request failed.',
      error?.details
    );
  }
  return payload as T;
}

async function rawRequest<T>(path: string, options: RequestOptions, tokens: TokenPair | null) {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Timezone': timezone(),
  };

  if (options.idempotencyKey) headers['Idempotency-Key'] = options.idempotencyKey;
  if (options.auth !== false && tokens?.accessToken) {
    headers.Authorization = `Bearer ${tokens.accessToken}`;
  }

  const response = await fetch(`${apiConfig.baseUrl}${path}`, {
    ...options,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  return parseResponse<T>(response);
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const tokens = await readTokens();
  try {
    return await rawRequest<T>(path, options, tokens);
  } catch (error) {
    if (
      options.auth === false ||
      !(error instanceof ApiError) ||
      error.status !== 401 ||
      !tokens?.refreshToken
    ) {
      throw error;
    }

    const refreshed = await rawRequest<SessionPayload>(
      '/auth/refresh',
      { method: 'POST', body: { refreshToken: tokens.refreshToken }, auth: false },
      null
    );
    await writeTokens(refreshed.tokens);
    return rawRequest<T>(path, options, refreshed.tokens);
  }
}

export const authStorage = {
  readTokens,
  writeTokens,
};
