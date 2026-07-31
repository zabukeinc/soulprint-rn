// src/design/fonts.ts

import { useFonts } from 'expo-font'
import {
  Poppins_300Light, Poppins_400Regular, Poppins_500Medium,
  Poppins_600SemiBold, Poppins_700Bold, Poppins_800ExtraBold,
} from '@expo-google-fonts/poppins'
import {
  DMSans_300Light, DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold,
} from '@expo-google-fonts/dm-sans'

export function useAstrovyFonts() {
  const [loaded, error] = useFonts({
    Poppins_300Light, Poppins_400Regular, Poppins_500Medium,
    Poppins_600SemiBold, Poppins_700Bold, Poppins_800ExtraBold,
    DMSans_300Light, DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold,
  })
  return { loaded, error }
}
