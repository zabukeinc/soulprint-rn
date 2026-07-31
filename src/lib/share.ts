// src/lib/share.ts

import { captureRef } from 'react-native-view-shot'
import * as Sharing from 'expo-sharing'
import { Platform, View } from 'react-native'

export async function captureAndShare(viewRef: React.RefObject<View>, message: string): Promise<{ ok: boolean; error: string | null }> {
  try {
    const uri = await captureRef(viewRef, {
      format: 'png',
      quality: 1,
      result: 'tmpfile',
    })

    if (!uri) {
      return { ok: false, error: 'Capture failed' }
    }

    const mimeType = 'image/png'
    const dialogTitle = 'Share'

    if (Platform.OS === 'web') {
      window.open(uri, '_blank')
      return { ok: true, error: null }
    }

    await Sharing.shareAsync(uri, {
      dialogTitle,
      mimeType,
    })

    return { ok: true, error: null }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export function buildShareMessage(type: 'tarot' | 'horoscope' | 'archetype' | 'compatibility' | 'snapshot', data: Record<string, string | number>): string {
  switch (type) {
    case 'tarot':
      return `My card today\n${data.cardName} \u2014 ${data.meaning}\n\nGet your reading on Astrovy`
    case 'horoscope':
      return `My horoscope today\n${data.zodiac} \u2014 ${data.category}: ${data.reading}\n\nMap your cosmos on Astrovy`
    case 'archetype':
      return `My archetype\nI'm ${data.name} \u2014 ${data.tagline}\n\nDiscover yours on Astrovy`
    case 'compatibility':
      return `Our compatibility\n${data.userSign} \u00D7 ${data.partnerSign} \u2014 ${data.score}% match\n\nCheck yours on Astrovy`
    case 'snapshot':
      return `My Astrovy snapshot\n${data.zodiac} Sun \u00B7 Life Path ${data.lifePath} \u00B7 ${data.archetype}\n\nMap your cosmos on Astrovy`
  }
}
