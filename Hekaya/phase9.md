# Phase 9 — Sealed Envelope & Voice Player

## Objective

Build the **future-promise layer** of Hekaya:

- a premium `SealedEnvelope` experience for the “رسالة للمستقبل” moment
- a live `Countdown` for locked envelope states
- a reusable `VoicePlayer` that replaces raw native `<audio>` usage

This phase exists to add the **future-oriented promise beat** in the Hekaya emotional arc.

Current arc in the implementation plan:

1. playful entry
2. chapter journey
3. celebratory peak
4. future promise
5. deep emotional close

Phase 8 already delivered the deep emotional close via `FinalReveal`. Phase 9 adds the missing **future promise** layer before that close.

**User feeling target:** intimate, ceremonial, patient, premium, and slightly suspenseful. The envelope should feel like a promise being protected until the right time.

---

## What Phase 9 Actually Is in This Repo

Do not infer Phase 9 from old assumptions.

`HEKAYA_IMPLEMENTATION_PLAN.md` clearly defines Phase 9 as:

- `Sealed Envelope & Voice Notes`

Not constellation.

This matters because:

- `src/components/hekaya/constellation/MemoryConstellation.tsx` already exists
- `src/components/hekaya/final/FinalReveal.tsx` already exists and is wired
- the missing implementation work is the **sealed envelope flow** plus the **shared voice player**

---

## Project Context

### What Already Exists

The current Hekaya codebase already has:

- `HeartDateGate` as the unlock ritual
- chapter hub and chapter cards
- chapter detail flow with reflective questions
- in-chapter X-O lock for `chapter_3`
- `FinalReveal` integrated into `HekayaExperience`
- `MemoryConstellation.tsx` implemented as an isolated component
- `sealedEnvelope` data already present in `src/content/hekaya.config.ts`
- `SealedEnvelopeConfig` already present in `src/types/hekaya.ts`

### What Phase 8 Already Implemented

Phase 8 is already reflected in the current source code:

- `src/components/hekaya/final/FinalReveal.tsx` exists
- `src/templates/hekaya/HekayaExperience.tsx` already renders stage `'final_reveal'`
- `src/components/hekaya/chapters/ChapterHub.tsx` already exposes a “Final Message” navigation button

### Current Gaps Before Phase 9

These are the real missing pieces:

- there is **no** `src/components/hekaya/sealed/SealedEnvelope.tsx`
- there is **no** `src/components/hekaya/sealed/Countdown.tsx`
- there is **no** `src/components/shared/VoicePlayer.tsx`
- `ChapterView.tsx` still uses raw native `<audio>`
- `FinalReveal.tsx` still uses raw native `<audio>`
- `HekayaStage` does **not** include `'sealed_envelope'`
- `ChapterHub.tsx` does **not** expose a sealed-envelope button
- `HekayaExperience.tsx` does **not** route to a sealed-envelope stage

### Where Phase 9 Fits in the Current Flow

The current live flow in code is:

1. `locked_heart`
2. `entering`
3. `unlocked`
4. `final_reveal`

Phase 9 should extend that to:

1. `locked_heart`
2. `entering`
3. `unlocked`
4. `sealed_envelope`
5. `final_reveal`

`complete` can remain in the type union if it already exists, but do not build new Phase 9 behavior around it.

### Scope Decision for This Phase

Keep Phase 9 **targeted**.

Do:

- add the sealed envelope route and UI
- add the countdown
- add the shared voice player
- replace native audio usage in chapter/final components

Do not do in Phase 9:

- wire `MemoryConstellation` into the journey
- redesign the chapter system
- replace the external fireworks link flow
- refactor `useChapterProgress` into a global app-progress system

### Assumption to Use

If `config.sealedEnvelope.unlockDate` and `config.sealedEnvelope.unlockAfterDays` are both provided, **prefer `unlockDate`** and treat `unlockAfterDays` as fallback only.

This should be documented inline in code comments because the type currently allows both.

---

## Files to Create or Update

## 1. `src/components/shared/VoicePlayer.tsx`

**Action:** Create

**Why:** Phase 9 explicitly requires a reusable Hekaya-themed voice player, and the current app still uses raw `<audio>` elements in multiple places.

**What this file must do:**

- render a custom glass/neon audio player
- expose play/pause
- show current time and total duration
- show a progress track with seek support
- work in Arabic and English
- handle missing metadata duration gracefully
- never autoplay
- be reusable in:
  - `ChapterView.tsx`
  - `FinalReveal.tsx`
  - `SealedEnvelope.tsx`

**Important constraints:**

- keep the component self-contained
- use a real hidden `<audio>` element and sync state from it
- use CSS variables, not hardcoded Tailwind color names
- keep touch targets large enough for mobile

**Recommended props:**

```ts
interface VoicePlayerProps {
  src: string
  label?: string
  duration?: number
  locale: HekayaLocale
  className?: string
}
```

---

## 2. `src/components/hekaya/sealed/Countdown.tsx`

**Action:** Create

**Why:** Locked envelope states need a live countdown when a concrete unlock date can be resolved.

**What this file must do:**

- accept a concrete `targetDate: Date`
- update every second
- display days / hours / minutes / seconds
- format numerals in Arabic when locale is `'ar'`
- call `onComplete` once when countdown reaches zero
- animate the zero transition with a subtle celebration pulse

**Important constraints:**

- do not use external countdown libraries
- clear the interval on unmount
- do not drift into negative values
- do not fire `onComplete` repeatedly

**Recommended props:**

```ts
interface CountdownProps {
  targetDate: Date
  locale: HekayaLocale
  onComplete?: () => void
}
```

---

## 3. `src/components/hekaya/sealed/SealedEnvelope.tsx`

**Action:** Create

**Why:** This is the main Phase 9 feature.

**What this file must do:**

- render the sealed-envelope route as a full-screen Hekaya stage
- persist the first time the user visits the envelope route
- support both unlock modes:
  - fixed date via `unlockDate`
  - elapsed days via `unlockAfterDays`
- show a locked envelope visual before unlock
- show countdown if a concrete target date exists
- once unlocked, show a dramatic “breaking seal” transition
- reveal the sealed message in elegant staggered blocks
- optionally render the new shared `VoicePlayer`
- expose a close button to return to the hub

**Important constraints:**

- do not use raw `<audio>`
- do not store this inside `useChapterProgress`
- manage its own localStorage key
- keep stage behavior self-contained and reversible

**Recommended props:**

```ts
interface SealedEnvelopeProps {
  config: SealedEnvelopeConfig
  locale: HekayaLocale
  onClose: () => void
}
```

**Recommended storage contract:**

```ts
const SEALED_STORAGE_KEY = 'hekaya_sealed_envelope_progress'

interface StoredSealedEnvelopeProgress {
  firstViewedAt?: string
  openedAt?: string
}
```

---

## 4. `src/types/hekaya.ts`

**Action:** Update

**What to change:**

- add `'sealed_envelope'` to `HekayaStage`
- add a strongly typed hub-destination union instead of loose strings

**Recommended addition:**

```ts
export type HekayaHubDestination = 'sealed-envelope' | 'final-message'

export type HekayaStage =
  | 'locked_heart'
  | 'entering'
  | 'unlocked'
  | 'sealed_envelope'
  | 'final_reveal'
  | 'complete'
```

**Important note:**

- do not redesign `SealedEnvelopeConfig`; the current shape is sufficient for Phase 9

---

## 5. `src/templates/hekaya/HekayaExperience.tsx`

**Action:** Update

**Why:** This is the main orchestrator and must route the new stage.

**What to change:**

- import `SealedEnvelope`
- import `HekayaHubDestination` type if you add it in `types/hekaya.ts`
- extend `handleNavigate`
- render `SealedEnvelope` when stage is `'sealed_envelope'`
- pass `config.sealedEnvelope` into it
- keep return path identical to FinalReveal: close returns to `'unlocked'`

**Important constraints:**

- keep `activeChapterId` cleared when navigating into sealed/final overlays
- do not remove the current final reveal flow
- do not refactor the existing unlock/chapter orchestration beyond what Phase 9 needs

---

## 6. `src/components/hekaya/chapters/ChapterHub.tsx`

**Action:** Update

**Why:** This is where the user should access the new feature after completing the story chapters.

**What to change:**

- make `onNavigate` typed to `'sealed-envelope' | 'final-message'`
- add a `sealedEnvelopeEnabled` prop
- when all chapters are complete and the sealed envelope is enabled:
  - show a new sealed-envelope CTA
  - keep the current fireworks button
  - keep the current final message button

**Button order once chapters are complete:**

1. Fireworks
2. Sealed Envelope
3. Final Message

This order reflects the emotional arc without removing existing Phase 8 access.

**Important constraints:**

- do not remove the current fireworks CTA
- do not gate Final Message behind the sealed envelope in this phase
- use existing motion/button patterns from this file

---

## 7. `src/components/hekaya/chapters/ChapterView.tsx`

**Action:** Update

**Why:** Chapter voice notes should use the shared Hekaya voice player instead of native browser audio controls.

**What to change:**

- replace the native `<audio controls>` block with `<VoicePlayer />`
- keep current label and section placement
- keep the rest of the chapter flow unchanged

---

## 8. `src/components/hekaya/final/FinalReveal.tsx`

**Action:** Update

**Why:** FinalReveal should also consume the shared `VoicePlayer`.

**What to change:**

- replace the native `<audio controls>` block with `<VoicePlayer />`
- keep current timing, card layout, and staggered copy reveal
- do not rewrite FinalReveal animation sequencing in Phase 9

---

## 9. `src/style.css`

**Action:** Update

**Why:** The shared `VoicePlayer` will likely need one small reusable slider style.

**What to add:**

- a minimal `.hekaya-range` class for range-track / thumb styling
- optional helper classes only if truly needed for countdown cells

**Important constraint:**

- keep CSS additions small and component-driven
- do not refactor existing theme tokens

---

## 10. Files That Should Not Change in Phase 9

Unless you discover a real compile issue, do not modify these:

- `src/content/hekaya.config.ts`
- `src/components/hekaya/constellation/MemoryConstellation.tsx`
- `src/App.tsx`
- `src/components/hekaya/unlock/HeartDateGate.tsx`

---

## Core Implementation Details

## 1. Stage and Navigation Wiring

Use a typed navigation destination instead of loose strings.

```ts
export type HekayaHubDestination = 'sealed-envelope' | 'final-message'
```

`HekayaExperience.tsx` should use:

```ts
const handleNavigate = (destination: HekayaHubDestination) => {
  if (destination === 'sealed-envelope') {
    setStage('sealed_envelope')
    setActiveChapterId(null)
    return
  }

  if (destination === 'final-message') {
    setStage('final_reveal')
    setActiveChapterId(null)
  }
}
```

Render order in `HekayaExperience.tsx`:

```tsx
{stage === 'sealed_envelope' ? (
  <SealedEnvelope
    config={config.sealedEnvelope}
    locale={config.locale}
    onClose={() => {
      setStage('unlocked')
      setActiveChapterId(null)
    }}
  />
) : null}

{stage === 'final_reveal' ? (
  <FinalReveal
    config={config.finalReveal}
    locale={config.locale}
    onComplete={() => {
      setStage('unlocked')
      setActiveChapterId(null)
    }}
  />
) : null}
```

Place the sealed-envelope stage block **before** the final-reveal block for readability.

---

## 2. VoicePlayer Contract and Behavior

Create `VoicePlayer.tsx` with a real hidden audio element plus a custom visual shell.

### Required state

```ts
const audioRef = useRef<HTMLAudioElement | null>(null)

const [isPlaying, setIsPlaying] = useState(false)
const [currentTime, setCurrentTime] = useState(0)
const [resolvedDuration, setResolvedDuration] = useState(duration ?? 0)
const [isReady, setIsReady] = useState(false)
```

### Required event synchronization

Register listeners on mount:

- `loadedmetadata`
- `timeupdate`
- `ended`
- `play`
- `pause`

Pseudo-implementation:

```ts
useEffect(() => {
  const audio = audioRef.current
  if (!audio) return

  const handleLoadedMetadata = () => {
    setResolvedDuration(audio.duration || duration || 0)
    setIsReady(true)
  }

  const handleTimeUpdate = () => {
    setCurrentTime(audio.currentTime)
  }

  const handlePlay = () => setIsPlaying(true)
  const handlePause = () => setIsPlaying(false)
  const handleEnded = () => {
    setIsPlaying(false)
    setCurrentTime(audio.duration || 0)
  }

  audio.addEventListener('loadedmetadata', handleLoadedMetadata)
  audio.addEventListener('timeupdate', handleTimeUpdate)
  audio.addEventListener('play', handlePlay)
  audio.addEventListener('pause', handlePause)
  audio.addEventListener('ended', handleEnded)

  return () => {
    audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
    audio.removeEventListener('timeupdate', handleTimeUpdate)
    audio.removeEventListener('play', handlePlay)
    audio.removeEventListener('pause', handlePause)
    audio.removeEventListener('ended', handleEnded)
  }
}, [duration, src])
```

### Toggle handler

```ts
const handleTogglePlayback = async () => {
  const audio = audioRef.current
  if (!audio) return

  try {
    if (audio.paused) {
      await audio.play()
    } else {
      audio.pause()
    }
  } catch {
    setIsPlaying(false)
  }
}
```

### Seek handler

Use a range input so mobile and keyboard behavior are straightforward:

```ts
const handleSeek = (event: ChangeEvent<HTMLInputElement>) => {
  const audio = audioRef.current
  if (!audio) return

  const nextTime = Number(event.target.value)
  audio.currentTime = nextTime
  setCurrentTime(nextTime)
}
```

### Time formatting

Use `mm:ss` for both locales.

For Arabic locale, convert digits with `Intl.NumberFormat('ar-EG')`.

```ts
function formatTime(totalSeconds: number, locale: HekayaLocale) {
  const safe = Number.isFinite(totalSeconds) ? Math.max(0, Math.floor(totalSeconds)) : 0
  const minutes = Math.floor(safe / 60)
  const seconds = safe % 60

  const raw = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`

  if (locale !== 'ar') return raw

  return raw.replace(/\d/g, (digit) =>
    new Intl.NumberFormat('ar-EG', { useGrouping: false }).format(Number(digit)),
  )
}
```

### Render structure

The visual shell should be:

- `GlassCard`-like visual treatment, but local to this component
- play/pause button on the leading edge
- label above or inline
- range track in the middle
- time at the bottom/right depending on locale

Do not nest `GlassCard` inside `VoicePlayer` if it causes double-card padding in parent containers. A compact internal shell is preferred.

---

## 3. Countdown Contract and Behavior

### Time-left shape

```ts
interface CountdownParts {
  totalMs: number
  days: number
  hours: number
  minutes: number
  seconds: number
  isComplete: boolean
}
```

### Helper

```ts
function getCountdownParts(targetDate: Date, now = new Date()): CountdownParts {
  const diff = Math.max(0, targetDate.getTime() - now.getTime())

  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)

  return {
    totalMs: diff,
    days,
    hours,
    minutes,
    seconds,
    isComplete: diff === 0,
  }
}
```

### Required behavior

- initialize from `targetDate`
- update once per second
- when `isComplete` becomes true for the first time:
  - stop interval
  - call `onComplete?.()`
  - pulse the countdown cells

### Arabic numerals

Use:

```ts
function formatDigits(value: number, locale: HekayaLocale, minDigits = 2) {
  if (locale === 'ar') {
    return new Intl.NumberFormat('ar-EG', {
      minimumIntegerDigits: minDigits,
      useGrouping: false,
    }).format(value)
  }

  return value.toString().padStart(minDigits, '0')
}
```

---

## 4. SealedEnvelope State Model

Use an internal UI state that separates “eligible to open” from “already opened”.

```ts
type EnvelopeStage = 'locked' | 'ready' | 'opening' | 'opened'
```

### Data to derive on mount

```ts
interface StoredSealedEnvelopeProgress {
  firstViewedAt?: string
  openedAt?: string
}
```

On mount:

1. read storage from `SEALED_STORAGE_KEY`
2. if `firstViewedAt` is missing, create it with `new Date().toISOString()`
3. parse `openedAt` if present
4. compute the active target date
5. set the initial stage:
   - `'opened'` if `openedAt` exists
   - `'ready'` if unlocked and not yet opened
   - `'locked'` otherwise

### Target-date resolution

```ts
function resolveEnvelopeTargetDate(
  config: SealedEnvelopeConfig,
  firstViewedAt: Date,
): Date | null {
  if (config.unlockDate) {
    return new Date(config.unlockDate)
  }

  if (typeof config.unlockAfterDays === 'number') {
    return new Date(firstViewedAt.getTime() + config.unlockAfterDays * 86400000)
  }

  return null
}
```

### Unlock resolution

```ts
function isEnvelopeUnlocked(targetDate: Date | null, now = new Date()) {
  if (!targetDate) return true
  return now.getTime() >= targetDate.getTime()
}
```

### Opening handler

```ts
const handleOpenEnvelope = () => {
  if (!unlocked) return

  setStage('opening')

  window.setTimeout(() => {
    setStage('opened')

    const openedAt = new Date().toISOString()
    persistProgress({ firstViewedAt: firstViewedAt.toISOString(), openedAt })
  }, 900)
}
```

### Message splitting

For sealed content, split by paragraph blocks, not single lines:

```ts
const paragraphs = config.sealedMessage
  .split(/\n{2,}/)
  .map((part) => part.trim())
  .filter(Boolean)
```

Animate paragraph reveals with a gentle stagger:

- first paragraph delay: `0.45s`
- stagger step: `0.22s`

This should feel different from `FinalReveal`, which is more cinematic and line-based.

---

## 5. SealedEnvelope UI Requirements

## Locked state

Must include:

- title using `config.previewText`
- sealed envelope visual
- lock copy:
  - Arabic date mode: `مختوم حتى [formatted date]`
  - Arabic duration mode: `يُفتح بعد [N] يوم من أول زيارة`
  - English equivalents
- countdown if `targetDate` is available
- close button back to the hub

Recommended visual:

- centered elevated card
- envelope body in deep plum glass
- circular wax seal accent in gold
- subtle floating dust/stars, but fewer than FinalReveal

## Ready state

Must include:

- unlocked headline:
  - Arabic: `حان وقت الرسالة`
  - English: `The Letter Is Ready`
- open CTA
- brief hint telling the user this is a message from the future

## Opening state

Must include:

- dramatic seal-break animation
- envelope lid/flap motion or seal burst
- no user interaction during the 900ms opening sequence

Do not overbuild this with canvas or SVG. Use regular `motion.div` elements and layered spans.

## Opened state

Must include:

- message paragraphs revealed with stagger
- optional `VoicePlayer`
- back/close CTA

Optional sub-copy:

- Arabic: `وعد محفوظ لوقته المناسب`
- English: `A promise saved for the right moment`

---

## Exact Integration Guidance

## `src/types/hekaya.ts`

Add:

```ts
export type HekayaHubDestination = 'sealed-envelope' | 'final-message'
```

Update:

```ts
export type HekayaStage =
  | 'locked_heart'
  | 'entering'
  | 'unlocked'
  | 'sealed_envelope'
  | 'final_reveal'
  | 'complete'
```

## `src/templates/hekaya/HekayaExperience.tsx`

Add imports:

```ts
import { SealedEnvelope } from '../../components/hekaya/sealed/SealedEnvelope'
import type { HekayaConfig, HekayaHubDestination, HekayaStage } from '../../types/hekaya'
```

Update handler:

```ts
const handleNavigate = (destination: HekayaHubDestination) => {
  if (destination === 'sealed-envelope') {
    setStage('sealed_envelope')
    setActiveChapterId(null)
    return
  }

  if (destination === 'final-message') {
    setStage('final_reveal')
    setActiveChapterId(null)
  }
}
```

Add stage render:

```tsx
{stage === 'sealed_envelope' ? (
  <SealedEnvelope
    config={config.sealedEnvelope}
    locale={config.locale}
    onClose={() => {
      setStage('unlocked')
      setActiveChapterId(null)
    }}
  />
) : null}
```

Update `ChapterHub` props:

```tsx
<ChapterHub
  chapters={config.chapters}
  progress={progress}
  locale={config.locale}
  finalCelebrationUrl={config.finalCelebrationUrl}
  sealedEnvelopeEnabled={config.sealedEnvelope.enabled}
  onSelectChapter={setActiveChapterId}
  onResetProgress={resetProgress}
  onNavigate={handleNavigate}
/>
```

## `src/components/hekaya/chapters/ChapterHub.tsx`

Update props:

```ts
interface ChapterHubProps {
  chapters: Chapter[]
  progress: ChapterProgress[]
  locale: HekayaLocale
  finalCelebrationUrl: string
  sealedEnvelopeEnabled?: boolean
  onSelectChapter: (id: string) => void
  onResetProgress?: () => void
  onNavigate?: (destination: HekayaHubDestination) => void
}
```

Add localized copy:

```ts
const sealedCopy =
  locale === 'ar'
    ? {
        button: '💌 الرسالة المختومة',
        hint: 'وعد محفوظ لوقت مناسب',
      }
    : {
        button: '💌 Sealed Letter',
        hint: 'A promise saved for the right time',
      }
```

Render it inside the completed-actions section:

```tsx
{sealedEnvelopeEnabled ? (
  <motion.button
    type="button"
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.96 }}
    onClick={() => onNavigate?.('sealed-envelope')}
    className="rounded-2xl border border-[rgba(251,191,36,0.45)] bg-[linear-gradient(140deg,rgba(54,31,78,0.96),rgba(27,14,48,0.96))] px-10 py-4 text-xl font-bold text-[var(--hekaya-text-primary)] shadow-[0_12px_30px_rgba(251,191,36,0.18)] transition hover:shadow-[0_16px_36px_rgba(251,191,36,0.24)] sm:px-12 sm:py-5 sm:text-2xl"
  >
    {sealedCopy.button}
  </motion.button>
) : null}
```

Update hint text so it mentions all visible actions.

## `src/components/hekaya/chapters/ChapterView.tsx`

Replace:

```tsx
<audio controls preload="none" src={chapter.voiceNote.src} className="w-full" />
```

With:

```tsx
<VoicePlayer
  src={chapter.voiceNote.src}
  label={chapter.voiceNote.label}
  duration={chapter.voiceNote.duration}
  locale={locale}
/>
```

## `src/components/hekaya/final/FinalReveal.tsx`

Replace:

```tsx
<audio controls preload="none" src={voiceNote.src} className="w-full" />
```

With:

```tsx
<VoicePlayer
  src={voiceNote.src}
  label={voiceNote.label}
  duration={voiceNote.duration}
  locale={locale}
/>
```

---

## Testing Checklist

## Desktop

- [ ] Complete all chapters and confirm the hub now shows three actions: fireworks, sealed envelope, final message
- [ ] Click the sealed-envelope CTA and confirm the app routes to the new stage
- [ ] If the envelope is still locked, confirm the lock copy and countdown render correctly
- [ ] If the envelope is unlocked, confirm the “open envelope” action starts the seal-break animation
- [ ] Confirm the sealed message paragraphs reveal in order
- [ ] Confirm the close button returns to the chapter hub
- [ ] Confirm `VoicePlayer` works in:
  - chapter voice note
  - final reveal voice note
  - sealed envelope voice note

## Mobile

- [ ] Test on a narrow width around `360px`
- [ ] Voice-player controls are tappable and not cramped
- [ ] Countdown cells remain readable on small screens
- [ ] Envelope layout does not overflow horizontally
- [ ] Close/open CTAs remain at least `44x44`

## Edge Cases

- [ ] `unlockDate` present and already in the past
- [ ] `unlockDate` present and still in the future
- [ ] `unlockAfterDays` mode with no prior localStorage
- [ ] `unlockAfterDays` mode after refreshing the page
- [ ] `voiceNote` missing from `sealedEnvelope`
- [ ] `voiceNote` missing from `chapter.voiceNote`
- [ ] `voiceNote` missing from `finalReveal`
- [ ] `sealedMessage` contains multiple paragraph breaks
- [ ] `targetDate` already passed on first render

## Build / Lint / Console

- [ ] `npm run build` succeeds
- [ ] No TypeScript errors
- [ ] No React warnings in console
- [ ] No audio promise rejection noise left uncaught in console
- [ ] No memory leak from intervals or event listeners
- [ ] Do not invent a lint step if the project has no lint script

---

## Acceptance Criteria

- [ ] `src/components/shared/VoicePlayer.tsx` exists and is used instead of native `<audio>` in chapter/final sealed contexts
- [ ] `src/components/hekaya/sealed/Countdown.tsx` exists and updates every second
- [ ] `src/components/hekaya/sealed/SealedEnvelope.tsx` exists and supports locked + ready + opening + opened states
- [ ] The first envelope visit timestamp is persisted in localStorage
- [ ] Date-based unlock works
- [ ] Duration-based unlock works
- [ ] Arabic numerals render correctly in countdown/timers when locale is `'ar'`
- [ ] `HekayaStage` includes `'sealed_envelope'`
- [ ] `HekayaExperience.tsx` routes `sealed-envelope` correctly
- [ ] `ChapterHub.tsx` shows the new envelope CTA when all chapters are complete and `config.sealedEnvelope.enabled === true`
- [ ] The existing fireworks CTA still works
- [ ] The existing final message CTA still works
- [ ] The sealed-envelope route closes back to the hub cleanly
- [ ] No unrelated refactors were introduced

---

## Common Pitfalls to Avoid

## 1. Expanding Scope into Constellation

Wrong:

- wiring `MemoryConstellation` into the journey during Phase 9

Correct:

- leave constellation alone
- build only sealed envelope + countdown + shared voice player + exact integrations

## 2. Using Raw `<audio>` Again

Wrong:

```tsx
<audio controls src={voiceNote.src} />
```

Correct:

```tsx
<VoicePlayer
  src={voiceNote.src}
  label={voiceNote.label}
  duration={voiceNote.duration}
  locale={locale}
/>
```

## 3. Storing Envelope Progress in `useChapterProgress`

Wrong:

- overloading chapter-progress storage with envelope-specific timestamps

Correct:

- keep envelope persistence in its own localStorage key
- keep chapter progress logic untouched

## 4. Forgetting the Current Phase 8 Integration

Wrong:

- removing or rewriting the existing `final_reveal` stage

Correct:

- insert `sealed_envelope` alongside the existing final flow
- preserve current final-reveal access

## 5. Failing to Prefer `unlockDate`

Wrong:

- mixing both unlock strategies simultaneously

Correct:

- if both exist, prefer `unlockDate`
- document that choice inline

## 6. Breaking Arabic Rendering

Wrong:

- introducing escaped or corrupted Arabic text
- saving strings in non-UTF-8 form

Correct:

- keep Arabic as real UTF-8 text
- verify rendered copy visually after implementation

## 7. Countdown Event Spam

Wrong:

- firing `onComplete` every second after the countdown reaches zero

Correct:

- guard `onComplete` with a ref or state so it runs once

---

## Code Style Guidance

- Follow the existing import order used in current Hekaya files:
  - external libs
  - React
  - type imports
  - internal component imports
- Reuse existing shared components and motion patterns:
  - `GlassCard`
  - `NeonButton`
  - `StarField` only if truly needed
- Match the current reveal easing already used in Hekaya:
  - `[0.22, 1, 0.36, 1]`
- Use existing CSS variables:
  - `--hekaya-text-primary`
  - `--hekaya-text-secondary`
  - `--hekaya-neon-primary`
  - `--hekaya-gold`
- Preserve the current stage-driven approach in `HekayaExperience.tsx`
- Use actual UTF-8 Arabic strings
- Avoid unrelated refactors
- Keep Phase 9 changes localized to the files listed above
- If you add any helper functions, keep them close to the component unless they are reused in multiple files

---

## Final Success Summary

When Phase 9 is done, Hekaya will have a complete “future promise” layer:

- the user can open a sealed envelope experience from the completed chapter hub
- the envelope correctly handles date-based and duration-based unlock rules
- the first-view timestamp persists
- all voice-note surfaces use one shared premium Hekaya voice player

Implementation-complete report:

> Phase 9 complete. SealedEnvelope, Countdown, and shared VoicePlayer were implemented and integrated into the current Hekaya flow. Chapter and final voice notes now use the shared player, sealed-envelope routing works from the hub, and locked/unlocked envelope states persist correctly.
