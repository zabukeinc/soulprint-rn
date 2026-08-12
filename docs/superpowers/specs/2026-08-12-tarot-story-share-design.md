# Tarot Story Share Card

## Goal

Make the tarot share experience feel like part of the current Astrovy tarot product by using the real tarot artwork, preserving the already-fetched interpretation, and producing a readable 9:16 story card.

## Scope

- Replace the current emoji and dark-gradient share card with the existing tarot artwork visual language.
- Reuse the selected tarot result already loaded by the tarot screen.
- Show card name, position, reversed state, keywords, and one concise interpretation quote.
- Show premium interpretation content when the selected result is premium, without exposing the full reading.
- Add a native device share action using the rendered share card.
- Keep a screenshot/save fallback if native sharing is unavailable.

## Data Flow

1. The tarot screen selects a drawn card.
2. The selected card's visual and interpretation are placed in a short-lived in-app share payload keyed by the card draw.
3. The share screen reads that payload and renders the story card.
4. No new backend request or AI generation is made.
5. If the payload is unavailable, the screen falls back to the deterministic card metadata and CDN artwork lookup where available.

Long interpretation text and private profile context must not be placed in URL query parameters. The share payload is display-only and must not become a persistent journal or analytics record.

## Visual Design

- Fixed 9:16 composition suitable for Instagram Stories and similar destinations.
- Artwork is the primary visual, occupying roughly the upper half of the card.
- Use the same palette, border, aura, typography, and reversed treatment as `TarotArtworkCard`.
- Keep the quote short enough to remain readable at story scale.
- Use restrained Astrovy branding in the footer.
- Remove the hardcoded archetype label because it is not derived from the selected card.

## Interaction

- Primary action: `Share` opens the native share sheet with the rendered image.
- Secondary action: `Save image` or screenshot fallback when native sharing is unavailable.
- `Close` returns to the tarot reading without redrawing or refetching.

## Quality and Safety

- Artwork loading has a visible fallback symbol and never leaves an empty card.
- Missing interpretation falls back to the selected tier's existing card meaning.
- The share screen never calls the AI provider.
- The share image must not include email, birth details, journal text, or other profile data.
- Verify free single-card, premium three-card, upright, reversed, missing-artwork, and offline cases.

## Out of Scope

- Multi-card composite story layouts.
- Editing the shared quote.
- Server-side share image generation.
- New AI prompts or tarot engine changes.
