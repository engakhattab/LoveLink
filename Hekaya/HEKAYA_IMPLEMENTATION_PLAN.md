# Hekaya Package - Complete Implementation Plan

## Project Overview

**Package Name:** Hekaya (حكاية - "Story")  
**Tier:** Premium cinematic romantic experience  
**Position:** Tier 3 - most feature-rich and emotionally immersive package  
**Language:** Arabic-first with bilingual support  
**Architecture:** Frontend-only, config-driven, React + TypeScript + Vite + Tailwind + Framer Motion

---

## Product Vision

Hekaya transforms romantic gift-giving into an **interactive cinematic journey**. Unlike Lamsa (simple elegance) and Zekra (rich interaction), Hekaya delivers a **multi-chapter narrative experience** with:

- Playful two-stage unlock ritual
- Story chapters with photos, messages, and reflective questions
- Interactive memory constellation exploration
- Celebratory fireworks finale
- Future-oriented sealed time capsule
- Optional voice message moments
- Grand emotional closing reveal

**Core emotional arc:** Playful entry → Narrative journey → Celebratory peak → Future promise → Deep emotional close

---

## Visual Identity & Design System

### Color Palette (Based on Reference Image)

**Primary Colors:**
```css
:root {
  /* Deep Cosmic Background */
  --hekaya-bg-deep: #0a0118;           /* Nearly black purple */
  --hekaya-bg-card: #1a0f2e;           /* Deep purple card base */
  --hekaya-bg-elevated: #261644;       /* Elevated surface */
  
  /* Neon Accents */
  --hekaya-neon-primary: #d946ef;      /* Vivid magenta/purple neon */
  --hekaya-neon-glow: #c026d3;         /* Deeper magenta for glows */
  --hekaya-neon-soft: #e879f9;         /* Softer pink for highlights */
  
  /* Gold Premium Touches */
  --hekaya-gold: #fbbf24;              /* Warm gold */
  --hekaya-gold-glow: #f59e0b;         /* Deeper gold */
  
  /* Constellation/Stars */
  --hekaya-star-bright: #fef3c7;       /* Bright star yellow */
  --hekaya-star-dim: #a78bfa;          /* Dim purple star */
  
  /* Text */
  --hekaya-text-primary: #faf5ff;      /* Near white */
  --hekaya-text-secondary: #e9d5ff;    /* Light purple tint */
  --hekaya-text-muted: #c4b5fd;        /* Muted purple */
  
  /* Semantic */
  --hekaya-success: #34d399;           /* For game win states */
  --hekaya-error: #f87171;             /* For validation */
}
```

### Typography Scale

```css
/* Arabic-optimized typography */
:root {
  --hekaya-font-display: 'Tajawal', sans-serif;     /* Headers */
  --hekaya-font-body: 'Cairo', sans-serif;          /* Body text */
  --hekaya-font-accent: 'Amiri', serif;             /* Romantic quotes */
  
  /* Sizes */
  --hekaya-text-xs: 0.75rem;      /* 12px */
  --hekaya-text-sm: 0.875rem;     /* 14px */
  --hekaya-text-base: 1rem;       /* 16px */
  --hekaya-text-lg: 1.125rem;     /* 18px */
  --hekaya-text-xl: 1.25rem;      /* 20px */
  --hekaya-text-2xl: 1.5rem;      /* 24px */
  --hekaya-text-3xl: 1.875rem;    /* 30px */
  --hekaya-text-4xl: 2.25rem;     /* 36px */
  --hekaya-text-5xl: 3rem;        /* 48px */
}
```

### Motion Language

**Core Principles:**
- **Unhurried:** Longer durations than Lamsa/Zekra (600-1200ms vs 300-600ms)
- **Dramatic:** Big transforms, parallax, 3D depth
- **Smooth:** Custom cubic-bezier curves for premium feel
- **Purposeful:** Every animation serves the narrative

**Standard Easing Curves:**
```javascript
const hekayaEasing = {
  entrance: [0.34, 1.56, 0.64, 1],      // Bouncy, playful
  exit: [0.4, 0, 0.2, 1],                // Smooth deceleration
  reveal: [0.22, 1, 0.36, 1],            // Gentle reveal
  celebration: [0.68, -0.55, 0.27, 1.55] // Exaggerated bounce
};
```

### Glass Morphism System

```css
/* Card surfaces with glass effect */
.hekaya-glass {
  background: rgba(26, 15, 46, 0.6);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(217, 70, 239, 0.2);
  box-shadow: 
    0 0 30px rgba(217, 70, 239, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.hekaya-glass-elevated {
  background: rgba(38, 22, 68, 0.7);
  backdrop-filter: blur(24px) saturate(200%);
  border: 1px solid rgba(217, 70, 239, 0.3);
  box-shadow: 
    0 4px 40px rgba(217, 70, 239, 0.25),
    0 0 60px rgba(192, 38, 211, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}
```

### Neon Glow Effects

```css
/* Text glow */
.hekaya-neon-text {
  color: var(--hekaya-neon-primary);
  text-shadow: 
    0 0 10px currentColor,
    0 0 20px currentColor,
    0 0 40px currentColor;
}

/* Button/element glow */
.hekaya-neon-glow {
  box-shadow: 
    0 0 20px rgba(217, 70, 239, 0.5),
    0 0 40px rgba(192, 38, 211, 0.3),
    inset 0 0 10px rgba(217, 70, 239, 0.2);
}
```

---

## Technical Architecture

### Folder Structure

```
F:\LoveLink\Hekaya\
├── public/
│   ├── images/
│   │   └── hekaya/
│   │       ├── chapters/
│   │       │   ├── chapter_1_photo_1.jpg
│   │       │   ├── chapter_1_photo_2.jpg
│   │       │   └── ...
│   │       ├── fireworks/
│   │       │   ├── celebration_1.jpg
│   │       │   └── celebration_2.jpg
│   │       └── final/
│   │           └── final_reveal.jpg
│   ├── audio/
│   │   ├── chapter_1_voice.mp3
│   │   ├── sealed_promise.mp3
│   │   └── ...
│   └── fonts/
│       ├── Tajawal/
│       ├── Cairo/
│       └── Amiri/
├── src/
│   ├── components/
│   │   ├── shared/
│   │   │   ├── GlassCard.tsx
│   │   │   ├── NeonButton.tsx
│   │   │   ├── StarField.tsx
│   │   │   └── VoicePlayer.tsx
│   │   └── hekaya/
│   │       ├── unlock/
│   │       │   ├── XOGame.tsx
│   │       │   ├── HeartDateGate.tsx
│   │       │   └── TransitionMessage.tsx
│   │       ├── chapters/
│   │       │   ├── ChapterHub.tsx
│   │       │   ├── ChapterCard.tsx
│   │       │   ├── ChapterView.tsx
│   │       │   └── QuestionMoment.tsx
│   │       ├── constellation/
│   │       │   ├── MemoryConstellation.tsx
│   │       │   ├── StarMemory.tsx
│   │       │   └── ConstellationMap.tsx
│   │       ├── fireworks/
│   │       │   ├── FireworksFinale.tsx
│   │       │   ├── FireworkBurst.tsx
│   │       │   └── FloatingMessage.tsx
│   │       ├── sealed/
│   │       │   ├── SealedEnvelope.tsx
│   │       │   └── Countdown.tsx
│   │       └── final/
│   │           └── FinalReveal.tsx
│   ├── content/
│   │   └── hekaya.config.ts
│   ├── types/
│   │   └── hekaya.ts
│   ├── hooks/
│   │   ├── useUnlockState.ts
│   │   ├── useChapterProgress.ts
│   │   └── useCountdown.ts
│   ├── utils/
│   │   ├── validation.ts
│   │   ├── dateUtils.ts
│   │   └── animations.ts
│   ├── templates/
│   │   └── hekaya/
│   │       └── HekayaExperience.tsx
│   ├── style.css
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

### State Management Architecture

**Stage Flow:**
```
locked_xo → locked_date → unlocked → finale → complete
```

**Stage State Type:**
```typescript
type HekayaStage = 
  | 'locked_xo'        // Initial X-O game
  | 'transition'       // "اشطر كتكوتة" message
  | 'locked_date'      // Heart date gate
  | 'entering'         // Welcome animation
  | 'unlocked'         // Main chapters/exploration
  | 'finale'           // Fireworks
  | 'final_reveal'     // Last floating message
  | 'complete';        // All viewed
```

**Progress Tracking:**
```typescript
interface HekayaProgress {
  chaptersViewed: number[];        // Chapter IDs viewed
  questionsAnswered: number[];     // Question IDs reflected on
  constellationExplored: boolean;  // Has visited constellation
  sealedOpened: boolean;           // Has opened time capsule
  fireworksTriggered: boolean;     // Has seen fireworks
  finalRevealed: boolean;          // Has seen final message
  completedAt?: Date;              // Completion timestamp
}
```

---

## Content Contract (TypeScript Types)

```typescript
// src/types/hekaya.ts

export type HekayaLocale = 'ar' | 'en';

export interface XOGameConfig {
  theme: 'hearts' | 'stars' | 'custom';
  playerSymbol: string;      // Default: '💜' (heart)
  opponentSymbol: string;    // Default: '⭐' (star)
  autoWinMode: boolean;      // If true, AI loses intentionally
  maxMoves: number;          // Default: 5 (ensures quick win)
}

export interface UnlockDateConfig {
  year: number;
  month: number;              // 1-12
  day: number;                // 1-31
  displayFormat?: string;     // Default: 'DD/MM/YYYY'
}

export interface TransitionMessageConfig {
  text: string;               // "اشطر كتكوتة انتي عارفه الطريق لقلبي وفزتي بيه 💜✨"
  duration: number;           // Display duration in ms (default: 3500)
}

export interface ChapterPhoto {
  src: string;                // Path to image
  alt: string;                // Arabic description
  caption?: string;           // Optional caption overlay
}

export interface QuestionMoment {
  id: string;
  question: string;           // Arabic reflective question
  position: 'start' | 'middle' | 'end'; // Where in chapter
}

export interface VoiceNote {
  src: string;                // Path to audio file
  duration?: number;          // Duration in seconds (optional)
  label?: string;             // "استمع لرسالتي" or custom
}

export interface Chapter {
  id: string;
  title: string;              // "الفصل الأول: البداية"
  dateRange?: string;         // "يناير ٢٠٢٤ - مارس ٢٠٢٤"
  narrative: string;          // Chapter introduction text
  photos: ChapterPhoto[];     // 2-4 photos per chapter
  message: string;            // Main emotional message
  voiceNote?: VoiceNote;      // Optional voice message
  question?: QuestionMoment;  // Optional reflective question
  theme?: {                   // Optional chapter-specific theme
    accentColor?: string;
    background?: string;
  };
}

export interface ConstellationConfig {
  enabled: boolean;
  title: string;              // "كوكبة ذكرياتنا"
  subtitle: string;           // "كل نجمة هي لحظة من قصتنا"
  memories: ConstellationMemory[];
}

export interface ConstellationMemory {
  id: string;
  photo: string;
  caption: string;
  x: number;                  // Position 0-100 (percentage)
  y: number;                  // Position 0-100 (percentage)
  brightness: 'dim' | 'medium' | 'bright'; // Star visual prominence
  size: 'small' | 'medium' | 'large';
}

export interface FireworksConfig {
  enabled: boolean;
  title: string;              // "احتفالنا"
  floatingMessages: string[]; // 10-15 messages that float up
  celebrationPhotos: string[]; // 2-3 photos shown during fireworks
  duration: number;           // Total duration in ms (default: 45000)
  autoTrigger: boolean;       // If true, starts automatically
}

export interface SealedEnvelopeConfig {
  enabled: boolean;
  unlockDate?: string;        // ISO date string "2026-12-25"
  unlockAfterDays?: number;   // Alternative: unlock N days after first view
  previewText: string;        // "رسالة للمستقبل 💌"
  sealedMessage: string;      // The actual message inside
  voiceNote?: VoiceNote;      // Optional voice for sealed content
}

export interface FinalRevealConfig {
  backgroundPhoto?: string;   // Optional background image
  message: string;            // Main final message
  splitLines?: string[];      // If pre-split into lines
  closingNote?: string;       // Optional additional note
  voiceNote?: VoiceNote;      // Optional final voice message
}

export interface HekayaConfig {
  // Metadata
  locale: HekayaLocale;
  receiverName: string;
  senderName: string;
  
  // Unlock system
  xoGame: XOGameConfig;
  unlockDate: UnlockDateConfig;
  transitionMessage: TransitionMessageConfig;
  
  // Content structure
  introLine?: string;         // Optional intro before chapters
  chapters: Chapter[];        // 4-6 chapters recommended
  
  // Interactive features
  constellation: ConstellationConfig;
  fireworks: FireworksConfig;
  sealedEnvelope: SealedEnvelopeConfig;
  finalReveal: FinalRevealConfig;
  
  // Global settings
  theme?: {
    customAccent?: string;    // Override neon color
    customGold?: string;      // Override gold accent
  };
  
  // Reflective questions (global pool)
  reflectiveQuestions?: string[]; // 5 questions for question moments
}

// Validation schemas
export interface HekayaValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateHekayaConfig(config: HekayaConfig): HekayaValidation {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Required fields
  if (!config.receiverName) errors.push('Receiver name is required');
  if (!config.senderName) errors.push('Sender name is required');
  if (!config.unlockDate) errors.push('Unlock date is required');
  
  // Date validation
  const { year, month, day } = config.unlockDate;
  const date = new Date(year, month - 1, day);
  if (isNaN(date.getTime())) {
    errors.push('Invalid unlock date');
  }
  
  // Chapter validation
  if (!config.chapters || config.chapters.length === 0) {
    errors.push('At least 1 chapter is required');
  }
  
  config.chapters.forEach((chapter, idx) => {
    if (!chapter.title) errors.push(`Chapter ${idx + 1}: title is required`);
    if (!chapter.photos || chapter.photos.length < 2) {
      errors.push(`Chapter ${idx + 1}: at least 2 photos required`);
    }
    if (chapter.photos.length > 4) {
      warnings.push(`Chapter ${idx + 1}: more than 4 photos may feel overwhelming`);
    }
    if (!chapter.message) errors.push(`Chapter ${idx + 1}: message is required`);
  });
  
  // Constellation validation
  if (config.constellation.enabled) {
    if (!config.constellation.memories || config.constellation.memories.length === 0) {
      errors.push('Constellation enabled but no memories provided');
    }
  }
  
  // Fireworks validation
  if (config.fireworks.enabled) {
    if (!config.fireworks.floatingMessages || config.fireworks.floatingMessages.length < 5) {
      warnings.push('Fireworks: at least 10 floating messages recommended');
    }
  }
  
  // Sealed envelope validation
  if (config.sealedEnvelope.enabled) {
    if (!config.sealedEnvelope.unlockDate && !config.sealedEnvelope.unlockAfterDays) {
      errors.push('Sealed envelope: must specify unlockDate OR unlockAfterDays');
    }
    if (!config.sealedEnvelope.sealedMessage) {
      errors.push('Sealed envelope: message is required');
    }
  }
  
  // Final reveal validation
  if (!config.finalReveal.message) {
    errors.push('Final reveal message is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}
```

---

## Phased Implementation Plan

### Phase 1: Foundation & Theme System
**Duration:** 2-3 hours  
**Goal:** Set up project structure and design system

**Tasks:**
1. Initialize Vite + React + TypeScript project
2. Install dependencies:
   ```bash
   npm install framer-motion
   npm install -D tailwindcss postcss autoprefixer
   npm install date-fns # for date handling
   ```
3. Create `src/style.css` with full CSS custom property system
4. Set up font loading (Tajawal, Cairo, Amiri)
5. Create `src/types/hekaya.ts` with all TypeScript types
6. Create base shared components:
   - `GlassCard.tsx` - Glass morphism container
   - `NeonButton.tsx` - Glowing button component
   - `StarField.tsx` - Animated background stars
7. Create `src/content/hekaya.config.ts` with dummy data structure

**Acceptance Criteria:**
- ✅ Project runs with `npm run dev`
- ✅ CSS variables accessible in DevTools
- ✅ Fonts load correctly
- ✅ GlassCard renders with proper glass effect
- ✅ StarField shows animated stars on dark background
- ✅ TypeScript types compile without errors

**Deliverables:**
- Working Vite project
- Complete type definitions
- Base component library
- Theme system

---

### Phase 2: X-O Game Unlock
**Duration:** 3-4 hours  
**Goal:** Implement the playful tic-tac-toe unlock game

**Tasks:**
1. Create `src/components/hekaya/unlock/XOGame.tsx`
2. Implement game logic:
   - 3x3 grid with neon purple borders
   - Player chooses Heart (💜) or Star (⭐) as symbol
   - AI opponent with intentional "easy win" logic (loses in 3-5 moves max)
   - Animated symbol placement with bounce effect
   - Win detection with celebration animation
3. Create win state animation:
   - Winning line glows with neon effect
   - Confetti particle burst (purple/gold)
   - "فزتي! 🎉" message with scale-in animation
4. Style according to reference image:
   - Dark purple cards for symbol selection
   - Neon glow on hover
   - Glass morphism on game board
5. Add sound effects (optional):
   - Symbol placement click
   - Win celebration sound

**Component Structure:**
```typescript
interface XOGameProps {
  config: XOGameConfig;
  onWin: () => void;
  locale: HekayaLocale;
}

// State management
type CellValue = null | 'player' | 'opponent';
type Board = CellValue[][];
type GameState = 'choosing' | 'playing' | 'won' | 'lost';
```

**Acceptance Criteria:**
- ✅ Game board renders with proper neon styling
- ✅ Symbol selection works smoothly
- ✅ AI makes moves and intentionally loses
- ✅ Win detection is accurate
- ✅ Win animation plays correctly
- ✅ Calls `onWin()` callback when player wins
- ✅ Responsive on mobile (touch-friendly cells)

**Deliverables:**
- Complete X-O game component
- AI opponent logic
- Win state celebration
- Mobile-optimized layout

---

### Phase 3: Transition Message & Date Gate
**Duration:** 2-3 hours  
**Goal:** Implement the transition and second unlock stage

**Tasks:**
1. Create `src/components/hekaya/unlock/TransitionMessage.tsx`
   - Full-screen overlay with glass card
   - Arabic message with emojis: "اشطر كتكوتة انتي عارفه الطريق لقلبي وفزتي بيه 💜✨"
   - Heart particle animation around text
   - Auto-dismiss after 3500ms with fade-out
   
2. Create `src/components/hekaya/unlock/HeartDateGate.tsx`
   - Reuse Zekra's heart dial design but with Hekaya theme
   - Deep purple background instead of dark romantic
   - Neon purple glow on interactive elements
   - Date input with Arabic numerals support
   - Validation with smooth error state
   - Success animation with firework burst
   
3. Create unlock flow orchestration:
   ```typescript
   locked_xo → (win) → transition → locked_date → (correct date) → entering
   ```

**Component Structure:**
```typescript
interface TransitionMessageProps {
  message: string;
  duration: number;
  onComplete: () => void;
}

interface HeartDateGateProps {
  unlockDate: UnlockDateConfig;
  onUnlock: () => void;
  locale: HekayaLocale;
}
```

**Acceptance Criteria:**
- ✅ Transition message displays after X-O win
- ✅ Auto-dismisses after configured duration
- ✅ Heart date gate appears smoothly
- ✅ Date validation works correctly
- ✅ Unlock triggers on correct date
- ✅ Error states are clear and gentle
- ✅ Arabic numerals supported if locale is 'ar'

**Deliverables:**
- Transition message component
- Date gate component
- Unlock flow state machine

---

### Phase 4: Chapter System Foundation
**Duration:** 4-5 hours  
**Goal:** Build the core chapter navigation and viewing system

**Tasks:**
1. Create `src/hooks/useChapterProgress.ts`
   - Track which chapters viewed
   - Store progress in localStorage
   - Calculate completion percentage
   
2. Create `src/components/hekaya/chapters/ChapterHub.tsx`
   - Book-like chapter menu/navigation
   - Shows all chapters as cards
   - Visual progress indicator (viewed vs not viewed)
   - "Continue where you left off" smart suggestion
   
3. Create `src/components/hekaya/chapters/ChapterCard.tsx`
   - Individual chapter card in hub
   - Preview: chapter number, title, date range
   - Locked/unlocked state visual
   - Tap to open chapter
   
4. Create `src/components/hekaya/chapters/ChapterView.tsx`
   - Full chapter viewing experience
   - Section sequence:
     - Title card entry animation
     - Date range subtitle
     - Narrative text (intro paragraph)
     - Photo gallery (2-4 photos with captions)
     - Main message card
     - Optional voice player
     - Optional question moment
   - Navigation: back to hub, next chapter, previous chapter
   - Mark as viewed on completion

**Component Structure:**
```typescript
interface ChapterHubProps {
  chapters: Chapter[];
  progress: number[];
  onSelectChapter: (id: string) => void;
}

interface ChapterViewProps {
  chapter: Chapter;
  onComplete: () => void;
  onBack: () => void;
  locale: HekayaLocale;
}
```

**Acceptance Criteria:**
- ✅ Chapter hub displays all chapters correctly
- ✅ Can navigate to any chapter
- ✅ Chapter view renders all content sections
- ✅ Photos display with captions
- ✅ Progress tracking persists across sessions
- ✅ Back navigation works smoothly
- ✅ RTL layout for Arabic content

**Deliverables:**
- Chapter hub navigation
- Chapter viewing system
- Progress tracking hook
- Photo gallery component

---

### Phase 5: Question Moments
**Duration:** 2-3 hours  
**Goal:** Add reflective question cards within chapters

**Tasks:**
1. Create `src/components/hekaya/chapters/QuestionMoment.tsx`
   - Appears inline during chapter flow
   - Visual design: 
     - Sealed envelope/card metaphor
     - "لحظة تأمل 💭" header
     - Question text in elegant typography
     - Reflection placeholder (no input needed)
     - "تأملت ✓" button to acknowledge
   - Animation: gentle reveal with glow effect
   
2. Integrate into ChapterView:
   - Position based on `question.position` (start/middle/end)
   - Pause chapter progression until acknowledged
   - Mark question as "reflected on" in progress
   
3. Create question pool in config:
   ```typescript
   reflectiveQuestions: [
     "ايه اللحظة اللي عرفت فيها إني بحبك؟",
     "ايه أكتر حاجة بتحبها في ضحكتك؟",
     "ايه الذكرى اللي مستحيل أنساها؟",
     "ليه اخترتك انت بالذات؟",
     "ايه وعدي ليك للمستقبل؟"
   ]
   ```

**Component Structure:**
```typescript
interface QuestionMomentProps {
  question: string;
  onAcknowledge: () => void;
}
```

**Acceptance Criteria:**
- ✅ Question card renders with elegant design
- ✅ Positioned correctly in chapter flow
- ✅ Acknowledge button works
- ✅ Progress tracking includes questions
- ✅ Typography is readable and beautiful

**Deliverables:**
- Question moment component
- Integration with chapter system
- Progress tracking for questions

---

### Phase 6: Memory Constellation
**Duration:** 5-6 hours  
**Goal:** Build the interactive star map memory explorer

**Tasks:**
1. Create `src/components/hekaya/constellation/MemoryConstellation.tsx`
   - Full-screen night sky background
   - Starfield with twinkling animation
   - Memory stars positioned at configured coordinates
   - Pan/zoom support (optional but nice)
   - Close button returns to chapter hub
   
2. Create `src/components/hekaya/constellation/StarMemory.tsx`
   - Individual star with glow pulse
   - Size and brightness from config
   - Tap to reveal memory
   - Reveals photo + caption in modal overlay
   - Close modal returns to constellation
   
3. Create `src/components/hekaya/constellation/ConstellationMap.tsx`
   - SVG connection lines between stars (constellation pattern)
   - Animate line drawing as stars are discovered
   - "N/M memories discovered" counter
   
4. Add constellation button in chapter hub:
   - Appears after first chapter viewed
   - "اكتشف كوكبتنا ✨" with star icon
   - Unlocks constellation view

**Component Structure:**
```typescript
interface MemoryConstellationProps {
  memories: ConstellationMemory[];
  onClose: () => void;
}

interface StarMemoryProps {
  memory: ConstellationMemory;
  discovered: boolean;
  onTap: (id: string) => void;
}
```

**Technical Notes:**
- Use CSS transforms for star positioning
- SVG for constellation lines
- Framer Motion for star reveal animations
- Intersection Observer for progressive star appearance

**Acceptance Criteria:**
- ✅ Constellation renders all stars correctly
- ✅ Stars positioned at configured coordinates
- ✅ Tap reveals photo + caption
- ✅ Modal overlays work smoothly
- ✅ Connection lines draw between stars
- ✅ Discovery counter updates
- ✅ Performance is smooth with 15-25 stars

**Deliverables:**
- Full constellation system
- Star memory component
- Connection line visualization
- Discovery tracking

---

### Phase 7: Fireworks Finale
**Duration:** 4-5 hours  
**Goal:** Create the celebratory fireworks experience

**Tasks:**
1. Create `src/components/hekaya/fireworks/FireworksFinale.tsx`
   - Full-screen dark teal/purple gradient background
   - Ambient particle system (slow floating particles)
   - Firework burst system triggered by:
     - User tap anywhere on screen
     - Auto-bursts every 3-5 seconds if no tap
   - Duration: 45 seconds total
   - "إغلاق" button at bottom after 10 seconds
   
2. Create `src/components/hekaya/fireworks/FireworkBurst.tsx`
   - Physics-based particle explosion
   - Radial burst from tap point
   - Particles: mix of colors (neon purple, gold, pink)
   - Gravity and fade-out effect
   - Sound effect on burst (optional)
   
3. Create `src/components/hekaya/fireworks/FloatingMessage.tsx`
   - Messages float from bottom to top
   - Appear randomly spaced in time
   - Semi-transparent glass cards
   - Mix of different message types:
     - Romantic declarations
     - Relationship milestones
     - Promises
     - Inside jokes
   - Photos interspersed between messages
   
4. Unlock logic:
   - Fireworks button appears in chapter hub after ALL chapters viewed
   - "احتفل معايا 🎆" button
   - Can be replayed after first view

**Component Structure:**
```typescript
interface FireworksFinaleProps {
  config: FireworksConfig;
  onComplete: () => void;
}

interface FireworkBurstProps {
  x: number;        // Screen position
  y: number;
  color: string;
  particleCount?: number;
}

interface FloatingMessageProps {
  message: string;
  delay: number;    // Delay before appearing
  duration: number; // Time to float to top
}
```

**Technical Implementation:**
- Canvas or CSS-based fireworks (CSS preferred for simplicity)
- Framer Motion for message animations
- Random timing with seeded distribution for natural feel

**Acceptance Criteria:**
- ✅ Fireworks trigger on tap
- ✅ Auto-bursts create continuous celebration
- ✅ Messages float up with smooth animation
- ✅ Photos appear between messages
- ✅ Close button works
- ✅ Performance is smooth (60fps)
- ✅ Matches reference image aesthetic

**Deliverables:**
- Complete fireworks system
- Particle burst mechanics
- Floating message system
- Integration with chapter completion

---

### Phase 8: Final Floating Message
**Duration:** 2-3 hours  
**Goal:** Create the grand emotional closing reveal

**Tasks:**
1. Create `src/components/hekaya/final/FinalReveal.tsx`
   - Reuse Zekra's floating message concept but Hekaya-themed
   - Full-screen modal overlay
   - Deep purple gradient background
   - Optional background photo with overlay
   - Message text with elegant typography
   - Optional voice player at bottom
   - "إغلاق" button
   
2. Trigger logic:
   - Appears immediately after fireworks complete
   - Can also be accessed from chapter hub once unlocked
   - Marked in progress when viewed
   
3. Animation sequence:
   - Fade in background (500ms)
   - Scale in message card (800ms with gentle bounce)
   - Stagger in message lines if pre-split (200ms delay each)
   - Voice player fades in last (if present)

**Component Structure:**
```typescript
interface FinalRevealProps {
  config: FinalRevealConfig;
  onClose: () => void;
}
```

**Acceptance Criteria:**
- ✅ Renders with Hekaya visual theme
- ✅ Message displays beautifully
- ✅ Voice player works if configured
- ✅ Background photo displays correctly
- ✅ Animation sequence is smooth
- ✅ Close button returns to hub

**Deliverables:**
- Final reveal component
- Voice integration
- Animation polish

---

### Phase 9: Sealed Envelope & Voice Notes
**Duration:** 3-4 hours  
**Goal:** Add time capsule and voice message features

**Tasks:**
1. Create `src/components/hekaya/sealed/SealedEnvelope.tsx`
   - Locked state:
     - Sealed envelope visual
     - "مختوم حتى [date]" or "يُفتح بعد [N] أيام"
     - Countdown timer if date-based
   - Unlocked state:
     - Breaking seal animation
     - Message reveal with dramatic entrance
     - Optional voice player
   - First view timestamp tracking in localStorage
   
2. Create `src/components/hekaya/sealed/Countdown.tsx`
   - Live countdown: days, hours, minutes, seconds
   - Arabic numerals if locale is 'ar'
   - Updates every second
   - Animates to zero with celebration
   
3. Create `src/components/shared/VoicePlayer.tsx`
   - Custom audio player with Hekaya theme
   - Play/pause button with neon glow
   - Progress bar with purple accent
   - Time display (current/total)
   - Works for chapter voices, sealed envelope, final reveal
   
4. Unlock logic:
   ```typescript
   // Date-based unlock
   if (config.sealedEnvelope.unlockDate) {
     const now = new Date();
     const unlockDate = new Date(config.sealedEnvelope.unlockDate);
     isUnlocked = now >= unlockDate;
   }
   
   // Duration-based unlock
   if (config.sealedEnvelope.unlockAfterDays) {
     const firstViewDate = getFirstViewDate(); // from localStorage
     const daysPassed = daysSince(firstViewDate);
     isUnlocked = daysPassed >= config.sealedEnvelope.unlockAfterDays;
   }
   ```

**Component Structure:**
```typescript
interface SealedEnvelopeProps {
  config: SealedEnvelopeConfig;
  firstViewDate: Date;
  locale: HekayaLocale;
}

interface VoicePlayerProps {
  src: string;
  label?: string;
  duration?: number;
}
```

**Acceptance Criteria:**
- ✅ Sealed envelope shows locked state correctly
- ✅ Countdown updates in real-time
- ✅ Unlock detection works (both date and duration modes)
- ✅ Breaking seal animation is dramatic
- ✅ Voice player works reliably
- ✅ First view timestamp persists
- ✅ Arabic numerals display correctly

**Deliverables:**
- Sealed envelope component
- Countdown timer
- Voice player component
- Unlock logic and state persistence

---

### Phase 10: Integration & Polish
**Duration:** 4-5 hours  
**Goal:** Wire everything together and add final touches

**Tasks:**
1. Create `src/templates/hekaya/HekayaExperience.tsx`
   - Master orchestration component
   - Stage management (locked_xo → final_reveal)
   - Progress persistence
   - Route chapters, constellation, fireworks, envelope, final
   
2. Update `src/App.tsx`
   - Load hekaya.config.ts
   - Validate config on mount
   - Render HekayaExperience or error state
   
3. Add global features:
   - Ambient background music toggle (optional)
   - Settings gear icon:
     - Reduce motion option
     - Mute sounds
     - Language toggle
   - Progress reset (dev mode only)
   
4. Performance optimizations:
   - Lazy load chapter images
   - Reduce particle counts on low-end devices
   - Optimize fireworks performance
   - Code splitting for phases
   
5. Final polish:
   - Smooth transitions between all stages
   - Loading states for images/audio
   - Error boundaries for graceful failures
   - Empty state messages if config missing
   - Success confetti on complete journey
   
6. Testing checklist:
   - Test full flow: X-O → Date → Chapters → Constellation → Fireworks → Final
   - Test on mobile devices (iOS + Android)
   - Test RTL layout thoroughly
   - Test voice notes on different browsers
   - Test sealed envelope both unlock modes
   - Test with minimal config (4 chapters, no voice)
   - Test with maximal config (6 chapters, all features)
   - Test error states (invalid date, missing photos, etc.)

**Acceptance Criteria:**
- ✅ Complete end-to-end flow works
- ✅ All stages transition smoothly
- ✅ Progress persists across sessions
- ✅ Mobile experience is polished
- ✅ Performance is smooth (60fps)
- ✅ Config validation catches errors
- ✅ Error states are helpful
- ✅ RTL works perfectly
- ✅ Voice notes play reliably
- ✅ No console errors

**Deliverables:**
- Complete integrated experience
- Performance optimizations
- Error handling
- Full test coverage

---

## Sample Configuration File

```typescript
// src/content/hekaya.config.ts

import { HekayaConfig } from '../types/hekaya';

export const hekayaConfig: HekayaConfig = {
  // Metadata
  locale: 'ar',
  receiverName: 'حبيبتي',
  senderName: 'حبيبك',
  
  // Unlock system
  xoGame: {
    theme: 'hearts',
    playerSymbol: '💜',
    opponentSymbol: '⭐',
    autoWinMode: true,
    maxMoves: 5
  },
  
  unlockDate: {
    year: 2024,
    month: 1,
    day: 14
  },
  
  transitionMessage: {
    text: 'اشطر كتكوتة انتي عارفه الطريق لقلبي وفزتي بيه 💜✨',
    duration: 3500
  },
  
  // Introduction
  introLine: 'دي مش مجرد صفحة... دي حكايتنا كاملة 💜',
  
  // Chapters
  chapters: [
    {
      id: 'chapter_1',
      title: 'الفصل الأول: البداية',
      dateRange: 'يناير ٢٠٢٤ - مارس ٢٠٢٤',
      narrative: 'في البداية كان فيه نظرة واحدة... ونظرة تانية... وكل مرة قلبي كان بيدق أقوى. كنت عارف من أول يوم إنك مش زي أي حد تاني.',
      photos: [
        {
          src: '/images/hekaya/chapters/chapter_1_photo_1.jpg',
          alt: 'أول صورة ليكي',
          caption: 'اللحظة اللي عرفت فيها'
        },
        {
          src: '/images/hekaya/chapters/chapter_1_photo_2.jpg',
          alt: 'أول خروجة سوا',
          caption: 'أول مرة نطلع سوا'
        },
        {
          src: '/images/hekaya/chapters/chapter_1_photo_3.jpg',
          alt: 'ضحكتك',
          caption: 'أول مرة أشوف ضحكتك دي'
        }
      ],
      message: 'من اليوم ده وأنا عارف إن حياتي اتغيرت للأبد. انتي مش بس حبيبتي... انتي البيت اللي قلبي لقاه.',
      voiceNote: {
        src: '/audio/chapter_1_voice.mp3',
        label: 'اسمع صوتي وأنا بحكيلك'
      },
      question: {
        id: 'q1',
        question: 'ايه اللحظة اللي عرفت فيها إني بحبك؟',
        position: 'end'
      }
    },
    
    {
      id: 'chapter_2',
      title: 'الفصل التاني: أول مغامرة',
      dateRange: 'أبريل ٢٠٢٤ - يونيو ٢٠٢٤',
      narrative: 'لما قررنا نسافر لأول مرة سوا، كنت خايف نتخانق... بس اكتشفت إنك شريكتي الحقيقية في كل حاجة.',
      photos: [
        {
          src: '/images/hekaya/chapters/chapter_2_photo_1.jpg',
          alt: 'في المطار',
          caption: 'رحلتنا الأولى'
        },
        {
          src: '/images/hekaya/chapters/chapter_2_photo_2.jpg',
          alt: 'على البحر',
          caption: 'اللحظة دي مش هنساها'
        },
        {
          src: '/images/hekaya/chapters/chapter_2_photo_3.jpg',
          alt: 'غروب الشمس',
          caption: 'أحلى غروب في حياتي'
        }
      ],
      message: 'الرحلة دي علمتني إن معاكي أي مكان بيبقى بيت، وأي لحظة بتبقى ذكرى.',
      question: {
        id: 'q2',
        question: 'ايه أكتر حاجة بتحبها فينا لما نكون سوا؟',
        position: 'middle'
      }
    },
    
    {
      id: 'chapter_3',
      title: 'الفصل التالت: لما الحياة صعبت',
      dateRange: 'يوليو ٢٠٢٤ - سبتمبر ٢٠٢٤',
      narrative: 'مش كل الأوقات كانت حلوة... كان فيه أيام صعبة وتحديات كبيرة. بس انتي وقفتي جنبي وأنا وقفت جنبك.',
      photos: [
        {
          src: '/images/hekaya/chapters/chapter_3_photo_1.jpg',
          alt: 'في الأيام الصعبة',
          caption: 'لما احتجناك بعض'
        },
        {
          src: '/images/hekaya/chapters/chapter_3_photo_2.jpg',
          alt: 'دعمك ليا',
          caption: 'كنتي السند'
        },
        {
          src: '/images/hekaya/chapters/chapter_3_photo_3.jpg',
          alt: 'الفرحة بعد الصعوبة',
          caption: 'وفي الآخر انتصرنا'
        }
      ],
      message: 'الحب الحقيقي مش في الأيام السهلة... ده في الأيام اللي بنختار فيها إننا نكمل مع بعض رغم كل حاجة.',
      question: {
        id: 'q3',
        question: 'ايه الذكرى اللي مستحيل تنساها؟',
        position: 'end'
      }
    },
    
    {
      id: 'chapter_4',
      title: 'الفصل الرابع: لحظاتنا المفضلة',
      dateRange: 'أكتوبر ٢٠٢٤ - ديسمبر ٢٠٢٤',
      narrative: 'اللحظات البسيطة هي اللي بتفرق... فنجان قهوة، ضحكة مفاجئة، حضن طويل. كل لحظة صغيرة معاكي هي كنز.',
      photos: [
        {
          src: '/images/hekaya/chapters/chapter_4_photo_1.jpg',
          alt: 'قهوة الصبح',
          caption: 'أحلى بداية يوم'
        },
        {
          src: '/images/hekaya/chapters/chapter_4_photo_2.jpg',
          alt: 'ضحكة مجنونة',
          caption: 'لما نضحك على أي حاجة'
        },
        {
          src: '/images/hekaya/chapters/chapter_4_photo_3.jpg',
          alt: 'ليلة هادية',
          caption: 'السكون معاكي له طعم تاني'
        },
        {
          src: '/images/hekaya/chapters/chapter_4_photo_4.jpg',
          alt: 'نص الليل',
          caption: 'كلامنا لحد الفجر'
        }
      ],
      message: 'مش محتاج حاجات كبيرة عشان أكون سعيد... محتاج بس اللحظات دي معاكي تفضل للأبد.',
      question: {
        id: 'q4',
        question: 'ليه اخترتك انت بالذات؟',
        position: 'start'
      }
    },
    
    {
      id: 'chapter_5',
      title: 'الفصل الخامس: للأبد يبدأ دلوقتي',
      dateRange: 'يناير ٢٠٢٥ - والمستقبل كله',
      narrative: 'الحكاية لسه في بدايتها... كل يوم جديد هو فصل جديد في قصة حبنا. وأنا واثق إن أحلى الفصول لسه جاية.',
      photos: [
        {
          src: '/images/hekaya/chapters/chapter_5_photo_1.jpg',
          alt: 'نظرتنا للمستقبل',
          caption: 'عينك في عيني'
        },
        {
          src: '/images/hekaya/chapters/chapter_5_photo_2.jpg',
          alt: 'وعد',
          caption: 'وعدي ليكي'
        },
        {
          src: '/images/hekaya/chapters/chapter_5_photo_3.jpg',
          alt: 'للأبد',
          caption: 'الحكاية مش هتخلص'
        }
      ],
      message: 'مش عارف المستقبل فيه إيه... بس عارف إن أنا عايز أعيشه معاكي. كل يوم، كل لحظة، للأبد.',
      voiceNote: {
        src: '/audio/chapter_5_voice.mp3',
        label: 'وعدي ليكي'
      },
      question: {
        id: 'q5',
        question: 'ايه حلمك الكبير لينا؟',
        position: 'end'
      }
    }
  ],
  
  // Memory Constellation
  constellation: {
    enabled: true,
    title: 'كوكبة ذكرياتنا',
    subtitle: 'كل نجمة هي لحظة من قصتنا ✨',
    memories: [
      {
        id: 'star_1',
        photo: '/images/hekaya/chapters/chapter_1_photo_1.jpg',
        caption: 'أول نظرة',
        x: 20,
        y: 30,
        brightness: 'bright',
        size: 'large'
      },
      {
        id: 'star_2',
        photo: '/images/hekaya/chapters/chapter_1_photo_2.jpg',
        caption: 'أول خروجة',
        x: 35,
        y: 25,
        brightness: 'bright',
        size: 'medium'
      },
      {
        id: 'star_3',
        photo: '/images/hekaya/chapters/chapter_2_photo_1.jpg',
        caption: 'أول سفر',
        x: 50,
        y: 40,
        brightness: 'bright',
        size: 'large'
      },
      {
        id: 'star_4',
        photo: '/images/hekaya/chapters/chapter_2_photo_3.jpg',
        caption: 'غروب ما ينسى',
        x: 65,
        y: 35,
        brightness: 'medium',
        size: 'medium'
      },
      {
        id: 'star_5',
        photo: '/images/hekaya/chapters/chapter_3_photo_2.jpg',
        caption: 'كنتي السند',
        x: 45,
        y: 60,
        brightness: 'bright',
        size: 'large'
      },
      {
        id: 'star_6',
        photo: '/images/hekaya/chapters/chapter_4_photo_1.jpg',
        caption: 'قهوة الصبح',
        x: 30,
        y: 70,
        brightness: 'dim',
        size: 'small'
      },
      {
        id: 'star_7',
        photo: '/images/hekaya/chapters/chapter_4_photo_4.jpg',
        caption: 'كلام لحد الفجر',
        x: 70,
        y: 65,
        brightness: 'medium',
        size: 'medium'
      },
      {
        id: 'star_8',
        photo: '/images/hekaya/chapters/chapter_5_photo_2.jpg',
        caption: 'وعدي',
        x: 80,
        y: 50,
        brightness: 'bright',
        size: 'large'
      }
    ]
  },
  
  // Fireworks Finale
  fireworks: {
    enabled: true,
    title: 'احتفالنا 🎆',
    floatingMessages: [
      'بحبك أكتر من أي كلمة ممكن أقولها',
      'انتي السبب اللي بيخليني أصحى كل يوم مبتسم',
      'كل لحظة معاكي هي هدية',
      'مش عارف أعمل إيه من غيرك',
      'حبك غير معنى الحياة بالنسبالي',
      'انتي مش بس حبيبتي... انتي كل حاجة',
      'وعدك إني هفضل جنبك مهما حصل',
      'حياتنا سوا لسه في بدايتها',
      'كل يوم معاكي أحلى من اللي قبله',
      'للأبد مش كفاية لحبي ليكي',
      'شكراً إنك اخترتيني',
      'انتي الحلم اللي بقى حقيقة',
      'مش هسيبك أبداً',
      'حبك هو أجمل قرار في حياتي',
      'للأبد وأكتر 💜'
    ],
    celebrationPhotos: [
      '/images/hekaya/fireworks/celebration_1.jpg',
      '/images/hekaya/fireworks/celebration_2.jpg'
    ],
    duration: 45000,
    autoTrigger: false
  },
  
  // Sealed Envelope
  sealedEnvelope: {
    enabled: true,
    unlockDate: '2026-12-25', // Christmas example
    previewText: 'رسالة للمستقبل 💌',
    sealedMessage: 'لما تقرأي الرسالة دي، يا رب نكون عديناه سنة كاملة سوا مليانة حب وسعادة. وعدي ليكي إن السنة الجاية هتكون أحلى... والسنة اللي بعدها أحلى... وكل سنة هفضل بحبك أكتر.\n\nمستني اليوم اللي أقولك فيه حاجة مهمة جداً... بس لسه مش وقتها. صبري عليا شوية يا قلبي 💍\n\nبحبك للأبد،\nحبيبك',
    voiceNote: {
      src: '/audio/sealed_promise.mp3',
      label: 'اسمع وعدي'
    }
  },
  
  // Final Reveal
  finalReveal: {
    backgroundPhoto: '/images/hekaya/final/final_reveal.jpg',
    message: 'دي مش مجرد صفحة على الإنترنت...\n\nدي حكايتنا.\n\nكل صورة، كل كلمة، كل لحظة.\n\nكل حاجة هنا هي جزء من قصة حب حقيقية.\n\nقصة لسه بتتكتب.\n\nوأنا مش عايز أكتبها مع حد غيرك.\n\nبحبك يا أجمل حاجة حصلتلي في الدنيا.\n\nللأبد وأكتر. 💜',
    splitLines: [
      'دي مش مجرد صفحة على الإنترنت...',
      'دي حكايتنا.',
      'كل صورة، كل كلمة، كل لحظة.',
      'كل حاجة هنا هي جزء من قصة حب حقيقية.',
      'قصة لسه بتتكتب.',
      'وأنا مش عايز أكتبها مع حد غيرك.',
      'بحبك يا أجمل حاجة حصلتلي في الدنيا.',
      'للأبد وأكتر. 💜'
    ],
    closingNote: '— حبيبك، للأبد',
    voiceNote: {
      src: '/audio/final_voice.mp3',
      label: 'اسمع آخر رسالة'
    }
  },
  
  // Global reflective questions
  reflectiveQuestions: [
    'ايه اللحظة اللي عرفت فيها إني بحبك؟',
    'ايه أكتر حاجة بتحبها فينا لما نكون سوا؟',
    'ايه الذكرى اللي مستحيل تنساها؟',
    'ليه اخترتك انت بالذات؟',
    'ايه حلمك الكبير لينا؟'
  ]
};
```

---

## Testing Strategy

### Unit Testing
- Individual component rendering
- State management hooks
- Validation functions
- Date utilities

### Integration Testing
- Unlock flow (X-O → Transition → Date)
- Chapter progression
- Progress persistence
- Config loading

### E2E Testing
- Complete user journey
- Mobile responsiveness
- RTL layout
- Voice playback
- Error states

### Performance Testing
- Fireworks particle count limits
- Image lazy loading
- Animation frame rates
- Memory usage on long sessions

### Accessibility Testing
- Keyboard navigation
- Screen reader support
- Touch target sizes
- Color contrast ratios

---

## Deployment Checklist

- [ ] Config validation passes
- [ ] All images optimized (WebP format)
- [ ] Audio files compressed (MP3, <500KB each)
- [ ] Fonts subset for Arabic characters
- [ ] Build size under 2MB
- [ ] Lighthouse score >90
- [ ] Mobile Safari tested
- [ ] Chrome Android tested
- [ ] RTL thoroughly reviewed
- [ ] Error boundaries in place
- [ ] 404 fallback configured
- [ ] HTTPS enforced
- [ ] Meta tags for sharing
- [ ] Favicon set

---

## Success Metrics

**Technical:**
- Load time <3s on 3G
- First contentful paint <1.5s
- 60fps animations
- Zero console errors
- 100% TypeScript coverage

**Product:**
- Complete journey takes 8-15 minutes
- Emotional impact is high
- Replayability (want to revisit)
- Shareability (want to show others)
- Distinct premium feel vs Zekra

---

## Future Enhancements (Post-Launch)

- Photo download feature
- Share individual memories
- Certificate generation (constellation map)
- Custom music upload
- Video support in chapters
- AR constellation viewer
- Print version generator
- Multi-language support beyond AR/EN

---

## Notes for Implementation Agent

**Critical Success Factors:**
1. **Respect the emotional arc** - Every technical decision should serve the feeling
2. **Mobile-first** - Most users will view on phones
3. **RTL perfection** - Arabic layout must be flawless
4. **Performance matters** - Premium feel requires smooth animations
5. **Config-driven** - Every customer detail comes from config, not code

**Common Pitfalls to Avoid:**
- Don't over-engineer - Keep it frontend-only as designed
- Don't skip validation - Config errors should fail gracefully
- Don't ignore RTL edge cases - Arrow directions, animation directions
- Don't assume fast networks - Optimize for 3G
- Don't forget accessibility - Keyboard and screen readers matter

**When in Doubt:**
- Prioritize emotion over features
- Choose performance over complexity
- Follow Zekra patterns as reference
- Test on real devices, not just emulators
- Ask for clarification rather than assume

---

## End of Implementation Plan

**Total Estimated Time:** 30-35 hours across 10 phases

**Recommended Approach:**
- Implement phases sequentially
- Test each phase before moving to next
- Keep AbdElrahman in review loop after Phase 2, 4, 7, and 10
- Deploy Phase 10 only after full acceptance

**Contact for Questions:**
- Share progress screenshots after each phase
- Flag any config structure questions early
- Confirm visual interpretations with reference to theme image

---

*This plan is living documentation. Update as implementation reveals new requirements.*

---

**Version:** 1.0  
**Created:** March 15, 2026  
**For:** Hekaya Package Development  
**By:** Claude (Senior Product Engineer)
