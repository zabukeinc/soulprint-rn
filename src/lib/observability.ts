import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

type ReportApiErrorInput = {
  path: string;
  method?: string;
  status?: number;
  code?: string;
  message: string;
  category?: string;
};

const environment = process.env.EXPO_PUBLIC_APP_ENV ?? (__DEV__ ? 'development' : 'production');
const appVersion = `${Constants.expoConfig?.slug ?? 'astrovy-rn'}@${Constants.expoConfig?.version ?? '0.0.0'}`;
const eventEndpoint = `${getApiBaseUrl()}/client-events`;
const tokenKey = 'astrovy_auth_tokens';
let currentNetworkStatus = 'unknown';

export const observability = {
  enabled: true,
};

function getApiBaseUrl() {
  const configured = process.env.EXPO_PUBLIC_API_URL;
  if (configured) return configured.replace(/\/$/, '');

  const hostUri = Constants.expoConfig?.hostUri ?? Constants.expoGoConfig?.debuggerHost;
  const host = hostUri?.split(':')[0];
  if (host) return `http://${host}:3111/v1`;

  return 'http://127.0.0.1:3111/v1';
}

function scrubString(value: string) {
  return value
    .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, 'Bearer [Filtered]')
    .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, '[email]')
    .replace(/purchaseToken["':=\s]+[A-Za-z0-9._-]+/gi, 'purchaseToken=[Filtered]');
}

function compactMetadata(data?: Record<string, unknown>) {
  if (!data) return undefined;
  return Object.fromEntries(
    Object.entries(data)
      .filter(([key]) => !['requestBody', 'responseBody', 'birthProfile', 'journal', 'prompt', 'purchaseToken'].includes(key))
      .slice(0, 12)
      .map(([key, value]) => {
        if (typeof value === 'string') return [key, scrubString(value).slice(0, 300)];
        if (typeof value === 'number' || typeof value === 'boolean' || value === null) return [key, value];
        return [key, JSON.stringify(value).slice(0, 300)];
      })
  );
}

export function initObservability() {}

export function setObservabilityUser(user: { id?: string | null } | null) {
  void user;
}

export function setObservabilityTag(key: string, value: string) {
  if (key === 'network.status') currentNetworkStatus = value;
}

export function addObservabilityBreadcrumb(message: string, data?: Record<string, unknown>) {
  if (__DEV__) console.info('[app-breadcrumb]', scrubString(message), compactMetadata(data));
}

export function captureAppException(error: unknown, context?: Record<string, unknown>) {
  if (__DEV__) {
    console.warn('[app-error]', error, context);
  }
  const message = error instanceof Error ? error.message : 'Unhandled app error';
  void sendClientEvent({
    level: 'fatal',
    category: 'ui',
    message,
    metadata: {
      ...compactMetadata(context),
      errorName: error instanceof Error ? error.name : 'UnknownError',
      networkStatus: currentNetworkStatus,
    },
  });
}

export function captureApiError(input: ReportApiErrorInput) {
  const shouldReport =
    input.category === 'timeout' ||
    input.category === 'network' ||
    (typeof input.status === 'number' && input.status >= 500);

  if (__DEV__) {
    console.warn('[api-client-error]', input);
  }
  if (!shouldReport) return;

  void sendClientEvent({
    level: 'error',
    category: input.category === 'timeout' || input.category === 'network' ? input.category : 'api',
    message: input.message,
    code: input.code,
    status: input.status,
    apiPath: input.path,
    metadata: {
      method: input.method ?? 'GET',
      networkStatus: currentNetworkStatus,
    },
  });
}

async function sendClientEvent(input: {
  level: 'info' | 'warning' | 'error' | 'fatal';
  category: 'api' | 'network' | 'timeout' | 'ui' | 'iap' | 'auth' | 'unknown';
  message: string;
  code?: string;
  status?: number;
  apiPath?: string;
  route?: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    const accessToken = await readAccessToken();
    await fetch(eventEndpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({
        ...input,
        message: scrubString(input.message).slice(0, 500),
        appVersion,
        platform: Platform.OS,
        device: Constants.deviceName ?? undefined,
        metadata: compactMetadata({
          environment,
          ...input.metadata,
        }),
      }),
    });
  } catch {
    // Logging must never break the user flow.
  }
}

async function readAccessToken() {
  try {
    const raw = await SecureStore.getItemAsync(tokenKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { accessToken?: string };
    return parsed.accessToken ?? null;
  } catch {
    return null;
  }
}
