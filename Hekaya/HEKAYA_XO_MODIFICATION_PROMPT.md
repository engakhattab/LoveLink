# Hekaya Phase 5 Modification: X-O Game as Chapter Lock

## Context

You are working on the Hekaya package (premium romantic gift website). Phase 5 (Question Moments) has been completed. We need to restructure the unlock system based on new product decisions.

## Current State (What Needs to Change)

**Original Design:**
- Two-stage main unlock: X-O Game → Transition Message → Heart Date Gate
- User must win X-O game, then enter correct date to access the experience

**New Design:**
- Single-stage main unlock: Heart Date Gate only (ceremonial unlock)
- X-O Game moves inside the experience as a **Chapter 3 lock mechanism**
- Chapter 3 requires winning the X-O game before revealing its content

## Why This Change?

The two-stage unlock felt too long and reduced anticipation. The new design:
- Makes entry faster and more elegant (just the heart + date ritual)
- Transforms X-O into a **story mechanic** rather than a barrier
- Creates a unique unlock moment within the narrative journey
- Better fits the "Hekaya" (story) concept - chapters can have different unlock methods

## Required Modifications

### 1. Type Definitions (`src/types/hekaya.ts`)

**Remove from main unlock types:**
```typescript
// DELETE or comment out XOGameConfig from main unlock
// It's no longer part of the primary unlock system
```

**Add to Chapter type:**
```typescript
export interface Chapter {
  id: string;
  title: string;
  dateRange?: string;
  narrative: string;
  photos: ChapterPhoto[];
  message: string;
  voiceNote?: VoiceNote;
  question?: QuestionMoment;
  theme?: {
    accentColor?: string;
    background?: string;
  };
  
  // NEW: Optional X-O game lock for this chapter
  xoGameLock?: {
    enabled: boolean;
    theme: 'hearts' | 'stars' | 'custom';
    playerSymbol: string;      // Default: '💜'
    opponentSymbol: string;    // Default: '⭐'
    autoWinMode: boolean;      // AI loses intentionally
    maxMoves: number;          // Default: 5
    introMessage: string;      // Message before game starts
    transitionMessage: string; // Message after winning
    transitionDuration: number; // Duration in ms (default: 3500)
  };
}
```

**Update main unlock config type:**
```typescript
export interface HekayaConfig {
  // ... existing fields
  
  // SIMPLIFIED: Remove xoGame from here
  // Remove transitionMessage from here (now in chapter lock)
  
  // Keep only:
  unlock: {
    type: 'ceremonial_heart';  // Fixed - no X-O option
    unlockDate: UnlockDateConfig;
    longPressRequired?: boolean;  // Optional: require 2s long-press on heart
    ceremonyMessage?: string;     // Optional intro message
  };
  
  // ... rest of config
}
```

**Update progress tracking:**
```typescript
export interface ChapterProgress {
  chapterId: string;
  viewed: boolean;
  viewedAt?: Date;
  xoGameCompleted?: boolean;  // NEW: For chapters with X-O lock
  xoGameCompletedAt?: Date;
}

export interface HekayaProgress {
  chaptersViewed: number[];
  chapterProgress: ChapterProgress[];  // More detailed tracking
  questionsAnswered: number[];
  constellationExplored: boolean;
  sealedOpened: boolean;
  fireworksTriggered: boolean;
  finalRevealed: boolean;
  completedAt?: Date;
}
```

### 2. Config File (`src/content/hekaya.config.ts`)

**Update unlock section:**
```typescript
export const hekayaConfig: HekayaConfig = {
  locale: 'ar',
  receiverName: 'حبيبتي',
  senderName: 'حبيبك',
  
  // SIMPLIFIED UNLOCK - Heart + Date only
  unlock: {
    type: 'ceremonial_heart',
    unlockDate: {
      year: 2024,
      month: 1,
      day: 14
    },
    longPressRequired: true,  // Requires 2-second long-press for ceremony
    ceremonyMessage: 'الحكاية دي مخبية جوا قلبي ليك... ضعي إيدك على القلب ده واوعديني تفتكري اليوم ده للأبد 💜'
  },
  
  // ... other config
  
  chapters: [
    // Chapter 1 - normal
    {
      id: 'chapter_1',
      title: 'الفصل الأول: البداية',
      // ... normal chapter config
    },
    
    // Chapter 2 - normal
    {
      id: 'chapter_2',
      title: 'الفصل التاني: أول مغامرة',
      // ... normal chapter config
    },
    
    // Chapter 3 - LOCKED WITH X-O GAME
    {
      id: 'chapter_3',
      title: 'الفصل التالت: لما الحياة صعبت',
      dateRange: 'يوليو ٢٠٢٤ - سبتمبر ٢٠٢٤',
      
      // X-O GAME LOCK CONFIGURATION
      xoGameLock: {
        enabled: true,
        theme: 'hearts',
        playerSymbol: '💜',
        opponentSymbol: '⭐',
        autoWinMode: true,
        maxMoves: 5,
        introMessage: 'الفصل ده مختلف شوية...\nمش هتقدري تقرأيه إلا لما تثبتي إنك شاطرة 💜\nيلا نلعب؟',
        transitionMessage: 'اشطر كتكوتة انتي عارفه الطريق لقلبي وفزتي بيه 💜✨',
        transitionDuration: 3500
      },
      
      narrative: 'مش كل الأوقات كانت حلوة... كان فيه أيام صعبة وتحديات كبيرة. بس انتي وقفتي جنبي وأنا وقفت جنبك.',
      photos: [
        // ... photos
      ],
      message: 'الحب الحقيقي مش في الأيام السهلة... ده في الأيام اللي بنختار فيها إننا نكمل مع بعض رغم كل حاجة.',
      question: {
        id: 'q3',
        question: 'ايه الذكرى اللي مستحيل تنساها؟',
        position: 'end'
      }
    },
    
    // Chapters 4, 5, etc. - normal
  ]
}
```

### 3. Component Modifications

#### A. Main Unlock - Remove X-O, Keep Only Heart Gate

**File: `src/components/hekaya/unlock/HeartDateGate.tsx`**

This component should become the **sole unlock mechanism**. Modifications needed:

**Add optional ceremony step before date input:**

```typescript
interface HeartDateGateProps {
  unlockDate: UnlockDateConfig;
  ceremonyMessage?: string;
  longPressRequired?: boolean;
  onUnlock: () => void;
  locale: HekayaLocale;
}

// Component should have stages:
type GateStage = 'ceremony' | 'date_input' | 'unlocking';

// If longPressRequired=true:
// 1. Show large heart icon with ceremony message
// 2. User must long-press (2s) on heart
// 3. Heart pulses/beats during press
// 4. On successful long-press, transition to date dials
// 5. On correct date, unlock with firework burst
```

**Visual enhancements for Hekaya theme:**
- Use deep purple background (#0a0118)
- Neon magenta glow on interactive elements (#d946ef)
- Glass morphism on card surfaces
- Dramatic animation on unlock success

**Remove/Delete:**
- `XOGame.tsx` from unlock folder (will be recreated in chapters folder)
- `TransitionMessage.tsx` from unlock folder (will be recreated in chapters folder)

#### B. Create Chapter-Specific X-O Game

**New File: `src/components/hekaya/chapters/ChapterXOGame.tsx`**

This is a **recontextualized** version of the X-O game, designed to appear within a chapter view:

```typescript
interface ChapterXOGameProps {
  config: Chapter['xoGameLock'];
  onWin: () => void;
  locale: HekayaLocale;
}

// Component structure:
// 1. Intro screen with config.introMessage
//    - "الفصل ده مختلف شوية..."
//    - Start Game button
//
// 2. Game board (3x3 grid)
//    - Player symbol: config.playerSymbol (💜)
//    - Opponent symbol: config.opponentSymbol (⭐)
//    - Auto-win logic: AI loses intentionally in maxMoves
//    - Neon purple styling
//    - Glass card surface
//
// 3. Win state
//    - Winning line glows
//    - Confetti/particle burst
//    - "فزتي! 🎉" message
//
// 4. Transition message
//    - Full-screen overlay
//    - config.transitionMessage
//    - Heart particles around text
//    - Auto-dismiss after config.transitionDuration (default: 3500ms)
//    - Calls onWin() after dismissing
```

**Game Logic Requirements:**
- 3x3 tic-tac-toe board
- Player always starts first
- AI opponent uses "intentional loss" algorithm:
  - Makes random valid moves
  - Avoids blocking player's winning moves
  - Ensures player wins within maxMoves (default: 5)
- Win detection for rows, columns, diagonals
- Animated symbol placement with bounce effect

**Styling:**
- Match Hekaya theme (deep purple, neon magenta)
- NOT full-screen (fits within chapter view context)
- Glass morphism on game board
- Neon glow on cells on hover/tap
- Smooth animations (Framer Motion)

#### C. Update Chapter View Component

**File: `src/components/hekaya/chapters/ChapterView.tsx`**

Add logic to check for X-O lock before showing chapter content:

```typescript
interface ChapterViewProps {
  chapter: Chapter;
  chapterProgress: ChapterProgress;  // From state
  onComplete: () => void;
  onXOGameComplete: (chapterId: string) => void;  // NEW
  onBack: () => void;
  locale: HekayaLocale;
}

// Rendering logic:
function ChapterView({ chapter, chapterProgress, ... }) {
  const [stage, setStage] = useState<'locked' | 'unlocked'>(() => {
    // Check if chapter has X-O lock
    if (chapter.xoGameLock?.enabled) {
      // Check if user has already completed the game
      return chapterProgress.xoGameCompleted ? 'unlocked' : 'locked';
    }
    return 'unlocked';  // No lock, show content immediately
  });
  
  if (stage === 'locked' && chapter.xoGameLock?.enabled) {
    return (
      <ChapterXOGame
        config={chapter.xoGameLock}
        onWin={() => {
          onXOGameComplete(chapter.id);  // Update progress
          setStage('unlocked');          // Show chapter content
        }}
        locale={locale}
      />
    );
  }
  
  // Normal chapter content rendering
  return (
    <div>
      {/* Title card */}
      {/* Photos */}
      {/* Message */}
      {/* Voice note */}
      {/* Question moment */}
    </div>
  );
}
```

#### D. Update Chapter Hub Logic

**File: `src/components/hekaya/chapters/ChapterHub.tsx`**

Add logic to enforce sequential access (Chapters 1 & 2 must be completed before Chapter 3 appears):

```typescript
interface ChapterHubProps {
  chapters: Chapter[];
  progress: ChapterProgress[];
  onSelectChapter: (id: string) => void;
}

function ChapterHub({ chapters, progress, onSelectChapter }) {
  // Calculate which chapters are accessible
  const getAccessibleChapters = () => {
    return chapters.map((chapter, index) => {
      // Chapter 1 & 2: Always accessible
      if (index < 2) {
        return { ...chapter, accessible: true, locked: false };
      }
      
      // Chapter 3: Requires Chapters 1 & 2 to be viewed
      if (chapter.id === 'chapter_3') {
        const chapter1Viewed = progress.find(p => p.chapterId === 'chapter_1')?.viewed;
        const chapter2Viewed = progress.find(p => p.chapterId === 'chapter_2')?.viewed;
        const accessible = chapter1Viewed && chapter2Viewed;
        
        return {
          ...chapter,
          accessible,
          locked: !accessible,
          lockReason: !accessible ? 'أكمل الفصل الأول والتاني الأول' : undefined
        };
      }
      
      // Chapters 4+: Normal sequential logic
      const previousChapterViewed = progress.find(p => p.chapterId === chapters[index - 1].id)?.viewed;
      return {
        ...chapter,
        accessible: previousChapterViewed,
        locked: !previousChapterViewed
      };
    });
  };
  
  const accessibleChapters = getAccessibleChapters();
  
  return (
    <div className="chapter-hub">
      {accessibleChapters.map((chapter) => (
        <ChapterCard
          key={chapter.id}
          chapter={chapter}
          progress={progress.find(p => p.chapterId === chapter.id)}
          locked={chapter.locked}
          lockReason={chapter.lockReason}
          onClick={() => {
            if (chapter.accessible) {
              onSelectChapter(chapter.id);
            }
          }}
        />
      ))}
    </div>
  );
}
```

**Visual indicators:**
- Locked chapters show lock icon 🔒
- Chapter 3 shows game icon 🎮 when accessible but not completed
- Chapter 3 shows checkmark ✓ after X-O game is won

### 4. State Management Updates

**File: `src/hooks/useChapterProgress.ts`**

Update to track X-O game completion separately:

```typescript
export function useChapterProgress() {
  const [progress, setProgress] = useState<ChapterProgress[]>(() => {
    const stored = localStorage.getItem('hekaya_chapter_progress');
    return stored ? JSON.parse(stored) : [];
  });
  
  const markChapterViewed = (chapterId: string) => {
    setProgress(prev => {
      const existing = prev.find(p => p.chapterId === chapterId);
      if (existing) {
        return prev.map(p => 
          p.chapterId === chapterId
            ? { ...p, viewed: true, viewedAt: new Date() }
            : p
        );
      }
      return [...prev, {
        chapterId,
        viewed: true,
        viewedAt: new Date(),
        xoGameCompleted: false
      }];
    });
  };
  
  // NEW: Mark X-O game as completed for a chapter
  const markXOGameCompleted = (chapterId: string) => {
    setProgress(prev => {
      const existing = prev.find(p => p.chapterId === chapterId);
      if (existing) {
        return prev.map(p =>
          p.chapterId === chapterId
            ? { ...p, xoGameCompleted: true, xoGameCompletedAt: new Date() }
            : p
        );
      }
      return [...prev, {
        chapterId,
        viewed: false,
        xoGameCompleted: true,
        xoGameCompletedAt: new Date()
      }];
    });
  };
  
  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('hekaya_chapter_progress', JSON.stringify(progress));
  }, [progress]);
  
  return {
    progress,
    markChapterViewed,
    markXOGameCompleted,
    getChapterProgress: (chapterId: string) => 
      progress.find(p => p.chapterId === chapterId)
  };
}
```

### 5. Main Experience Orchestrator

**File: `src/templates/hekaya/HekayaExperience.tsx`**

Update stage management to remove X-O from main unlock:

```typescript
type HekayaStage = 
  | 'locked_heart'      // Heart + Date gate (was: locked_xo)
  | 'entering'          // Welcome animation
  | 'unlocked'          // Main chapters/exploration
  | 'finale'            // Fireworks
  | 'final_reveal'      // Last floating message
  | 'complete';

function HekayaExperience({ config }: { config: HekayaConfig }) {
  const [stage, setStage] = useState<HekayaStage>('locked_heart');
  const { progress, markChapterViewed, markXOGameCompleted } = useChapterProgress();
  
  // Stage rendering
  if (stage === 'locked_heart') {
    return (
      <HeartDateGate
        unlockDate={config.unlock.unlockDate}
        ceremonyMessage={config.unlock.ceremonyMessage}
        longPressRequired={config.unlock.longPressRequired}
        onUnlock={() => setStage('entering')}
        locale={config.locale}
      />
    );
  }
  
  if (stage === 'entering') {
    return (
      <WelcomeAnimation
        onComplete={() => setStage('unlocked')}
      />
    );
  }
  
  if (stage === 'unlocked') {
    return (
      <div>
        <ChapterHub
          chapters={config.chapters}
          progress={progress}
          onSelectChapter={(id) => {/* Navigate to chapter */}}
        />
        
        {/* Render selected chapter */}
        {selectedChapter && (
          <ChapterView
            chapter={selectedChapter}
            chapterProgress={progress.find(p => p.chapterId === selectedChapter.id)}
            onComplete={() => markChapterViewed(selectedChapter.id)}
            onXOGameComplete={(id) => markXOGameCompleted(id)}
            onBack={() => {/* Back to hub */}}
            locale={config.locale}
          />
        )}
      </div>
    );
  }
  
  // ... other stages (finale, final_reveal)
}
```

## Implementation Checklist

### Phase 1: Type Updates (30 minutes)
- [ ] Update `Chapter` interface to include `xoGameLock` field
- [ ] Simplify main unlock types (remove X-O)
- [ ] Update `ChapterProgress` interface
- [ ] Update `HekayaConfig` unlock section
- [ ] Ensure TypeScript compiles without errors

### Phase 2: Config Updates (15 minutes)
- [ ] Update `hekaya.config.ts` unlock section
- [ ] Add `xoGameLock` to Chapter 3
- [ ] Remove X-O config from main unlock
- [ ] Test config validation

### Phase 3: Component Restructuring (2 hours)
- [ ] Enhance `HeartDateGate.tsx` with ceremony step
- [ ] Create new `ChapterXOGame.tsx` component
- [ ] Implement X-O game logic (AI opponent, win detection)
- [ ] Add intro/transition message screens
- [ ] Style with Hekaya theme (purple, neon, glass)

### Phase 4: Chapter View Integration (1 hour)
- [ ] Update `ChapterView.tsx` to check for X-O lock
- [ ] Implement locked/unlocked stage logic
- [ ] Connect to progress tracking
- [ ] Test X-O → content transition

### Phase 5: Hub Logic (1 hour)
- [ ] Update `ChapterHub.tsx` sequential access logic
- [ ] Ensure Chapters 1 & 2 must be completed before 3 appears
- [ ] Add visual indicators (lock icon, game icon)
- [ ] Test chapter progression flow

### Phase 6: State Management (30 minutes)
- [ ] Update `useChapterProgress` hook
- [ ] Add `markXOGameCompleted` function
- [ ] Test localStorage persistence
- [ ] Verify progress tracking accuracy

### Phase 7: Integration & Testing (1 hour)
- [ ] Update `HekayaExperience.tsx` orchestrator
- [ ] Remove X-O from main unlock flow
- [ ] Test complete flow: Heart unlock → Chapters 1, 2 → Chapter 3 (X-O) → Continue
- [ ] Test X-O game win/loss scenarios
- [ ] Test progress persistence across page refreshes
- [ ] Verify RTL layout for Arabic content
- [ ] Test on mobile devices

## Acceptance Criteria

### Main Unlock
✅ Heart + Date gate is the only unlock mechanism  
✅ Optional long-press ceremony works smoothly  
✅ Ceremony message displays correctly  
✅ Unlock animation is dramatic and premium  
✅ No X-O game at this stage  

### Chapter 3 Lock
✅ Chapter 3 requires Chapters 1 & 2 to be viewed first  
✅ Chapter 3 shows game icon when accessible  
✅ X-O game displays intro message correctly  
✅ Game board renders with Hekaya theme  
✅ AI opponent loses intentionally within 5 moves  
✅ Win detection is accurate  
✅ Transition message displays after winning  
✅ Chapter 3 content appears after game completion  
✅ Progress persists (no need to replay game)  

### User Experience
✅ Flow feels natural: Unlock → Chapter 1 → Chapter 2 → X-O Game → Chapter 3  
✅ X-O game fits within chapter context (not full-screen)  
✅ Animations are smooth (60fps)  
✅ Mobile experience is polished  
✅ RTL layout works correctly  
✅ Error states are handled gracefully  

## Testing Scenarios

### Scenario 1: New User
1. User arrives, sees Heart + Date gate
2. Long-presses heart (optional ceremony)
3. Enters correct date
4. Unlocks → Welcome animation → Chapter Hub
5. Views Chapter 1 → completes
6. Views Chapter 2 → completes
7. Chapter 3 now appears with game icon
8. Taps Chapter 3 → sees X-O intro message
9. Plays X-O game → wins
10. Sees transition message "اشطر كتكوتة..."
11. Chapter 3 content appears
12. Can navigate back to hub
13. Chapter 3 is now accessible without replaying game

### Scenario 2: Returning User (Already Viewed Chapters 1 & 2)
1. Returns to site (already unlocked)
2. Chapter Hub shows Chapters 1, 2 (viewed), 3 (game icon)
3. Taps Chapter 3 → plays X-O → wins
4. Chapter 3 unlocks permanently
5. Progress persists

### Scenario 3: Attempting Chapter 3 Early
1. New user unlocks
2. Only Chapters 1 & 2 visible
3. Chapter 3 is hidden until 1 & 2 are viewed
4. After viewing 1 & 2, Chapter 3 appears

## Visual Design Notes

### Heart + Date Gate
- Full-screen dark purple background (#0a0118)
- Large centered heart icon (if long-press enabled)
- Neon magenta glow on heart (#d946ef)
- Pulse animation during long-press
- Date dials with glass morphism
- Firework burst on successful unlock

### Chapter 3 X-O Game
- NOT full-screen (appears within ChapterView)
- Glass card container
- 3x3 grid with neon purple borders
- Cells: hover/tap → neon glow
- Symbols: 💜 (player) vs ⭐ (opponent)
- Win state: glowing line + confetti
- Transition message: full-width card with heart particles

## Code Quality Standards

- TypeScript strict mode
- No `any` types
- Proper error boundaries
- Accessible (keyboard navigation, ARIA labels)
- Responsive (mobile-first)
- RTL-aware (Arabic layout)
- Performance optimized (lazy loading, code splitting)
- Clean console (no errors/warnings)

## Final Notes

This modification transforms the X-O game from a barrier into a **narrative mechanic**. Chapter 3's theme ("When Life Got Hard") makes sense for a challenge - the player must "prove" themselves to unlock this emotionally deeper chapter.

The new flow is:
1. **Elegant entry** - Ceremonial heart unlock
2. **Story progression** - Chapters 1 & 2 set context
3. **Playful challenge** - X-O game as earned privilege
4. **Emotional payoff** - Chapter 3 content after winning

This creates better pacing and emotional resonance than front-loading the game at the entrance.

Good luck with implementation! 🚀
