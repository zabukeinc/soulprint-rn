import AsyncStorage from '@react-native-async-storage/async-storage';
import { TODAY_WIDGET_SNAPSHOT_KEY } from '@/src/services/widgetSnapshot';

const LOCAL_CACHE_KEYS = [TODAY_WIDGET_SNAPSHOT_KEY];

/** Clears derived device cache only. Auth, onboarding, and server generations stay intact. */
export async function clearLocalCache() {
  await AsyncStorage.multiRemove(LOCAL_CACHE_KEYS);
}
