# Tarot Story Share Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the tarot share screen with an artwork-first 9:16 card that reuses the selected tarot result and supports native sharing without another backend or AI request.

**Architecture:** The tarot screen will serialize only the selected display payload into a short-lived in-app store before navigation. The share screen will read that payload, render the existing `TarotArtworkCard` visual language in a fixed story composition, and use React Native's built-in `Share` API. URL parameters remain limited to a fallback card identity and display state.

**Tech Stack:** Expo SDK 54, React Native, Expo Router, `expo-image`, `expo-linear-gradient`, existing tarot artwork metadata, native `Share` API.

---

### Task 1: Add the short-lived share payload boundary

**Files:**
- Create: `src/lib/tarotShare.ts`
- Modify: `app/tarot.tsx`
- Modify: `app/share-tarot.tsx`

- [x] **Step 1: Define a display-only payload and in-memory store.**

  The payload includes card ID, position, reversed state, name, keywords, artwork visual, and the already-generated interpretation fields. It must not include email, birth data, journal content, or authentication tokens.

- [x] **Step 2: Pass the selected card into the store before navigation.**

  `handleShare` stores the selected card's resolved display data, then navigates with only `cardId`, `reversed`, and `position` fallback parameters.

- [x] **Step 3: Read the payload in the share screen.**

  Prefer the in-memory payload. If it is missing, use the existing deterministic card metadata and the selected tier-independent free meaning as a safe fallback.

### Task 2: Rebuild the story composition

**Files:**
- Modify: `app/share-tarot.tsx`

- [x] **Step 1: Replace emoji/dark gradient styling with the tarot artwork visual system.**

  Use the selected visual palette and `expo-image` artwork when available, with a symbol fallback when it is not. Preserve reversed artwork rotation and a visible reversed badge.

- [x] **Step 2: Render concise, tier-aware content.**

  Show position, card name, keywords, and one short quote. Prefer the generated interpretation meaning; fall back to the card meaning. Do not expose the full long reading on the story card.

- [x] **Step 3: Remove the hardcoded archetype.**

  Branding remains limited to Astrovy and `astrovy.space`.

### Task 3: Add native sharing and fallback behavior

**Files:**
- Modify: `app/share-tarot.tsx`

- [x] **Step 1: Add a `Share` action using the platform share sheet.**

  Share a concise text fallback containing the card name, position, and Astrovy URL. Keep the card visually ready for screenshot sharing because React Native's built-in API does not export a rendered view as an image by itself.

- [x] **Step 2: Keep close navigation deterministic.**

  Closing returns to the tarot screen without redrawing, refetching, or changing the daily draw quota.

### Task 4: Verify the release behavior

**Files:**
- No new dependencies.

- [x] **Step 1: Run mobile TypeScript validation.**

  Run `npx tsc --noEmit` from the mobile repository and expect exit code 0.

- [ ] **Step 2: Manually verify the critical matrix on Android.**

  Verify free single-card, premium three-card, upright, reversed, artwork-loaded, missing-artwork fallback, close, and native share paths. Confirm no network request occurs when opening the share screen.

- [x] **Step 3: Review the diff.**

  Confirm only the tarot share implementation and its focused helper changed; do not stage existing `.idea` changes.
