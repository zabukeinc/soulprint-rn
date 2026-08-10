# AI and Spiritual Content Disclaimer Plan

Last updated: 2026-08-09

## Is This Needed?

Yes. The app uses astrology, tarot, compatibility, journaling, and AI-generated personal readings. Even if the product is positioned as reflection or entertainment, some users may treat the output as life, relationship, health, or financial advice.

## Weakest Assumption

The dangerous assumption is that warm copy cannot create real-world reliance. A user can still over-trust a reading if the app sounds confident and personal.

## Recommended Tone

Use short, calm disclaimers. Do not make the product feel clinical or scary.

## Suggested Copy

### Onboarding Consent

`Astrovy offers reflective astrology and tarot insights for self-exploration. It is not medical, legal, financial, or emergency advice.`

### Reading Footer

`Use this as a mirror, not a verdict. Your choices stay yours.`

### Compatibility Footer

`Compatibility readings are reflective guidance, not a fixed prediction about a relationship.`

### Crisis Boundary

`Astrovy is not built for crisis support. If you may be in danger or need urgent help, contact local emergency services or a trusted professional.`

Do not show crisis copy on every screen. Put it in Terms, Help, and Account/Settings unless the app later adds mood-risk detection.

## Implementation Checklist

- [ ] Add onboarding consent copy.
- [ ] Add a small reading footer to tarot, mirror, birth chart, compatibility, horoscope, and weekly reading pages.
- [ ] Add the same disclaimers to Terms of Service.
- [ ] Ensure AI prompts tell the model not to provide medical, legal, financial, emergency, or deterministic claims.
- [ ] Ensure generated content avoids phrases like “you must,” “this will happen,” or “your partner definitely.”

## Prompt Guardrail

Add this instruction to every AI prompt registry entry:

```text
Write as reflective guidance for self-exploration. Do not present the reading as medical, legal, financial, emergency, or deterministic advice. Avoid diagnosis, crisis counseling, guarantees, or instructions that pressure the user into major life decisions.
```
