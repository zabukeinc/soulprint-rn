import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Alert, Linking, Platform } from 'react-native';
import { getAppConfig } from '@/src/services/backend';

const LAST_PROMPT_KEY = 'astrovy_last_update_prompt';

function compareVersions(left: string, right: string) {
  const a = left.split('.').map(Number);
  const b = right.split('.').map(Number);
  for (let index = 0; index < 3; index += 1) {
    if ((a[index] ?? 0) !== (b[index] ?? 0)) return (a[index] ?? 0) - (b[index] ?? 0);
  }
  return 0;
}

export async function checkForAppUpdate() {
  if (Platform.OS !== 'android' && Platform.OS !== 'ios') return;
  const platform = Platform.OS;
  const currentVersion = Constants.expoConfig?.version ?? '0.0.0';
  const config = await getAppConfig(platform, currentVersion);
  const updateRequired = compareVersions(currentVersion, config.minimumVersion) < 0;
  const updateAvailable = compareVersions(currentVersion, config.latestVersion) < 0;
  if (!updateRequired && !updateAvailable) return;

  const promptKey = `${platform}:${config.latestVersion}:${updateRequired ? 'required' : 'available'}`;
  const lastPrompt = await AsyncStorage.getItem(LAST_PROMPT_KEY);
  if (!updateRequired && lastPrompt === promptKey) return;
  await AsyncStorage.setItem(LAST_PROMPT_KEY, promptKey);

  Alert.alert(
    updateRequired ? 'Update Astrovy to continue' : 'A newer Astrovy is ready',
    updateRequired
      ? 'Please install the latest version to keep using Astrovy.'
      : 'The latest version includes improvements and fixes for a smoother experience.',
    [
      ...(updateRequired ? [] : [{ text: 'Later', style: 'cancel' as const }]),
      { text: 'Update now', onPress: () => { void Linking.openURL(config.storeUrl); } },
    ],
    { cancelable: !updateRequired },
  );
}
