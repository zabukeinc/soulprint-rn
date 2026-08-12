import type { TarotVisual } from '@/src/services/backend';

export type TarotSharePayload = {
  cardId: string;
  name: string;
  position: string;
  reversed: boolean;
  keywords: string;
  meaning: string;
  visual?: TarotVisual;
};

let currentPayload: TarotSharePayload | null = null;

export function setTarotSharePayload(payload: TarotSharePayload) {
  currentPayload = payload;
}

export function getTarotSharePayload() {
  return currentPayload;
}

export function clearTarotSharePayload() {
  currentPayload = null;
}
