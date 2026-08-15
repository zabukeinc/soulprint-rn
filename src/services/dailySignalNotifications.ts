import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

type NotificationsModule = typeof import('expo-notifications');

let notificationsModulePromise: Promise<NotificationsModule | null> | null = null;

async function loadNotifications(): Promise<NotificationsModule | null> {
  if (!notificationsModulePromise) {
    notificationsModulePromise = import('expo-notifications')
      .then((Notifications) => {
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldPlaySound: false,
            shouldSetBadge: false,
            shouldShowBanner: true,
            shouldShowList: true
          })
        });
        return Notifications;
      })
      .catch(() => null);
  }

  return notificationsModulePromise;
}

const notificationIdKey = 'astrovy.daily-signal.notification-id';

function parseReminderTime(value: string) {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return { hour: 9, minute: 0 };
  return { hour: Number(match[1]), minute: Number(match[2]) };
}

export async function scheduleDailySignalNotification(reminderTime: string) {
  const Notifications = await loadNotifications();
  if (!Notifications) return { enabled: false as const, reason: 'unavailable' as const };

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('daily-signal', {
      name: 'Daily Signal',
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: undefined
    });
  }

  const permissions = await Notifications.getPermissionsAsync();
  const granted = permissions.granted || permissions.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
  if (!granted) {
    const requested = await Notifications.requestPermissionsAsync();
    const requestedGranted = requested.granted || requested.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
    if (!requestedGranted) return { enabled: false as const, reason: 'permission_denied' as const };
  }

  await cancelDailySignalNotification();
  const { hour, minute } = parseReminderTime(reminderTime);
  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Your signal for today is ready',
      body: 'Open Astrovy for a quiet place to begin.',
      data: { route: '/(tabs)/today' }
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute
    }
  });
  await AsyncStorage.setItem(notificationIdKey, identifier);
  return { enabled: true as const };
}

export async function cancelDailySignalNotification() {
  const Notifications = await loadNotifications();
  const identifier = await AsyncStorage.getItem(notificationIdKey);
  if (identifier && Notifications) await Notifications.cancelScheduledNotificationAsync(identifier);
  await AsyncStorage.removeItem(notificationIdKey);
}

export async function getExpoPushRegistration() {
  try {
    const Notifications = await loadNotifications();
    if (!Notifications) return null;
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    if (!projectId) return null;
    const token = await Notifications.getExpoPushTokenAsync({ projectId });
    return { expoPushToken: token.data, platform: Platform.OS === 'ios' ? 'ios' as const : 'android' as const };
  } catch {
    return null;
  }
}
