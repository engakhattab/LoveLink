# AGENTS.md - AI Agent Guide for Hekaya Project

**Version:** 1.0  
**Last Updated:** March 2026  
**Purpose:** Guide for AI coding agents (Codex, Claude Code, etc.) working on the Hekaya romantic gift website

---

## 🎯 PROJECT OVERVIEW

**Hekaya** is a premium, config-driven romantic gift website built with React + TypeScript + Tailwind CSS v4 + Framer Motion.

**Core Philosophy:**
- **Arabic-first** with RTL support
- **Emotional resonance** is the primary design metric
- **Config-driven** - all content comes from `hekaya.config.ts`
- **Mobile-first** - conversion focus on mid-range Android devices
- **Premium feel** - color saturation, animation quality, surface differentiation

**Tech Stack:**
- React 19 + TypeScript (strict mode)
- Tailwind CSS v4 (CSS variables, no JIT config)
- Framer Motion (all animations)
- Vite (build tool)
- Fontsource (Tajawal, Cairo, Amiri fonts)

---

## 📂 PROJECT STRUCTURE

```
Hekaya/
├── public/
│   ├── audio/              # Voice notes, music (gitignored)
│   ├── images/hekaya/      # Photos (gitignored)
│   └── fonts/              # Local font files (gitignored, using @fontsource)
├── src/
│   ├── components/
│   │   ├── hekaya/
│   │   │   ├── chapters/         # Chapter system components
│   │   │   ├── unlock/           # Heart+Date gate
│   │   │   ├── constellation/    # Memory constellation
│   │   │   ├── final/           # Final reveal message
│   │   │   └── shared/          # Hekaya-specific shared components
│   │   └── shared/              # Global shared components
│   ├── content/
│   │   ├── hekaya.config.ts     # SINGLE SOURCE OF TRUTH for content
│   │   └── fireworks.config.ts  # Fireworks display config (Phase 7)
│   ├── hooks/
│   │   └── useChapterProgress.ts # Progress tracking
│   ├── templates/hekaya/
│   │   ├── HekayaExperience.tsx  # Main orchestrator
│   │   └── HekayaFireworks.tsx   # Fireworks page (Phase 7)
│   ├── types/
│   │   └── hekaya.ts            # All TypeScript types
│   ├── style.css                # Global styles + CSS variables
│   └── main.tsx                 # Entry point
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

---

## 🔑 CORE PRINCIPLES

### 1. Config-Driven Development

**ALL content comes from `hekaya.config.ts`** - never hardcode content.

```typescript
// ❌ WRONG - Hardcoded content
<p>كل سنة وأنت حبيبتي</p>

// ✅ CORRECT - From config
<p>{config.finalReveal.message}</p>
```

**Config structure:**
- `receiverName`, `senderName` - Names
- `unlock` - Heart + Date gate config
- `chapters[]` - All chapter content
- `constellation` - Memory constellation config
- `finalReveal` - Final message config
- `theme` - Color customization

### 2. Type Safety

**Use TypeScript strictly** - no `any`, no type assertions without reason.

```typescript
// ❌ WRONG
const data: any = config.chapters

// ✅ CORRECT
import type { Chapter } from '../types/hekaya'
const chapters: Chapter[] = config.chapters
```

**All types defined in `src/types/hekaya.ts`:**
- `HekayaConfig` - Main config
- `Chapter`, `ChapterPhoto`, `QuestionMoment` - Chapter system
- `FinalRevealConfig`, `ConstellationConfig` - Feature configs
- `HekayaLocale`, `HekayaStage` - Enums
- `ChapterProgress`, `HekayaProgress` - Progress tracking

### 3. Arabic-First Design

**RTL layout is NOT an afterthought** - it's the primary design.

```typescript
// ✅ Always check locale and provide Arabic copy
const copy = locale === 'ar'
  ? { title: 'الفصول', button: 'التالي' }
  : { title: 'Chapters', button: 'Next' }

// ✅ Use proper Arabic typography
className="hekaya-font-display"  // Tajawal for headings
className="hekaya-font-body"     // Cairo for body
className="hekaya-font-accent"   // Amiri for quotes/messages
```

**Arabic text handling:**
- **NEVER modify Arabic strings** - copy exactly as provided
- **NEVER URL-encode** - keep UTF-8
- **Check line-height** - Arabic needs more space (1.8-2.0)
- **Test RTL** - verify layout doesn't break

### 4. Mobile-First Performance

**Target: Mid-range Android devices** (4 cores, 3-4GB RAM)

```typescript
// ✅ Lazy load heavy components
const MemoryConstellation = lazy(() => 
  import('./components/hekaya/constellation/MemoryConstellation')
)

// ✅ Optimize particle counts
const particleCount = isMobile ? 50 : 100

// ✅ Use loading="lazy" on images
<img loading="lazy" src={photo.src} alt={photo.alt} />
```

---

## 🎨 DESIGN SYSTEM

### Color Palette (CSS Variables)

**ALWAYS use CSS variables** - never hardcode colors.

```css
/* Primary palette */
--hekaya-bg-deep: #0a0118           /* Deep cosmic background */
--hekaya-bg-card: #1a0f2e           /* Card background */
--hekaya-bg-elevated: #261644       /* Elevated surfaces */

/* Neon accents */
--hekaya-neon-primary: #d946ef      /* Primary neon (magenta) */
--hekaya-neon-glow: #c026d3         /* Glow variant */
--hekaya-neon-soft: #e879f9         /* Soft variant */

/* Gold accents */
--hekaya-gold: #fbbf24              /* Primary gold */
--hekaya-gold-glow: #f59e0b         /* Gold glow */

/* Stars */
--hekaya-star-bright: #fef3c7       /* Bright stars (gold-ish) */
--hekaya-star-dim: #a78bfa          /* Dim stars (purple-ish) */

/* Text hierarchy */
--hekaya-text-primary: #faf5ff      /* Main text */
--hekaya-text-secondary: #e9d5ff    /* Secondary text */
--hekaya-text-muted: #c4b5fd        /* Muted text */

/* Semantic */
--hekaya-success: #34d399           /* Success green */
--hekaya-error: #f87171             /* Error red */
```

**Usage in Tailwind:**
```typescript
// ✅ CORRECT
className="text-[var(--hekaya-text-primary)]"
className="bg-[var(--hekaya-neon-primary)]"
className="border-[rgba(217,70,239,0.35)]"  // OK with transparency

// ❌ WRONG
className="text-[#faf5ff]"          // Don't hardcode
className="bg-purple-500"           // Don't use Tailwind colors
```

### Typography Scale

```css
--hekaya-text-xs: 0.75rem      /* 12px */
--hekaya-text-sm: 0.875rem     /* 14px */
--hekaya-text-base: 1rem       /* 16px */
--hekaya-text-lg: 1.125rem     /* 18px */
--hekaya-text-xl: 1.25rem      /* 20px */
--hekaya-text-2xl: 1.5rem      /* 24px */
--hekaya-text-3xl: 1.875rem    /* 30px */
--hekaya-text-4xl: 2.25rem     /* 36px */
--hekaya-text-5xl: 3rem        /* 48px */
```

**Font families:**
```typescript
// Use these classes, NOT inline styles
"hekaya-font-display"   // Tajawal - for headings
"hekaya-font-body"      // Cairo - for body text
"hekaya-font-accent"    // Amiri - for quotes, romantic messages
```

### Component Patterns

**GlassCard** - Glass morphism container
```typescript
import { GlassCard } from '../../shared/GlassCard'

<GlassCard tone="base">      {/* Default glass */}
<GlassCard tone="elevated">  {/* More prominent glass */}
```

**NeonButton** - Premium button component
```typescript
import { NeonButton } from '../../shared/NeonButton'

<NeonButton variant="primary" wide={true}>   {/* Purple gradient */}
<NeonButton variant="gold" wide={false}>     {/* Gold gradient */}
```

**StarField** - Animated background stars
```typescript
import { StarField } from '../../shared/StarField'

<StarField count={96} animated={true} />
```

---

## 🎭 ANIMATION GUIDELINES

### Framer Motion Patterns

**Standard easing curve:**
```typescript
// Use this everywhere for consistency
ease: [0.22, 1, 0.36, 1]  // Hekaya reveal curve
```

**Entrance animation pattern:**
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
>
```

**Stagger animation:**
```typescript
{items.map((item, index) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ 
      duration: 0.8, 
      delay: 0.6 + index * 0.4  // Stagger by 0.4s
    }}
  >
))}
```

**Infinite loop:**
```typescript
<motion.div
  animate={{ 
    y: [0, -20, 0],           // Float pattern
    opacity: [0.3, 0.7, 0.3]  // Fade pattern
  }}
  transition={{ 
    duration: 4, 
    repeat: Infinity, 
    ease: 'easeInOut' 
  }}
>
```

**Hover/Tap:**
```typescript
<motion.button
  whileHover={{ scale: 1.05, y: -2 }}
  whileTap={{ scale: 0.98 }}
>
```

### Animation Performance

```typescript
// ✅ GOOD - Animate transform properties
animate={{ y: 20, scale: 1.1 }}

// ❌ BAD - Animate layout properties (causes reflow)
animate={{ height: '100%', marginTop: 20 }}
```

**Particle limits:**
- Desktop: max 200 particles
- Mobile: max 50-100 particles
- Use `navigator.hardwareConcurrency` to detect

---

## 💾 STATE MANAGEMENT

### Progress Tracking

**Use `useChapterProgress` hook** - handles localStorage persistence.

```typescript
import { useChapterProgress } from '../../hooks/useChapterProgress'

const {
  progress,                    // Array of ChapterProgress
  viewedChapterIds,            // Array of viewed chapter IDs
  reflectedQuestionIds,        // Array of reflected question IDs
  completionPercent,           // 0-100
  continueChapterId,           // Next unviewed chapter ID
  markChapterViewed,           // (chapterId: string) => void
  markXOGameCompleted,         // (chapterId: string) => void
  markQuestionReflected,       // (questionId: string) => void
  resetProgress,               // () => void (dev only)
  getChapterProgress,          // (chapterId: string) => ChapterProgress | undefined
  isChapterViewed,             // (chapterId: string) => boolean
  isXOGameCompleted,           // (chapterId: string) => boolean
  isQuestionReflected,         // (questionId: string) => boolean
} = useChapterProgress(config.chapters)
```

**Storage key:** `hekaya_chapter_progress`

**Data structure:**
```typescript
{
  chapterProgress: [
    {
      chapterId: 'chapter_1',
      viewed: true,
      viewedAt: '2024-03-14T10:30:00.000Z',
      xoGameCompleted: false
    }
  ],
  reflectedQuestionIds: ['q1', 'q2']
}
```

### Stage Management

**HekayaStage** - Main experience state machine
```typescript
type HekayaStage =
  | 'locked_heart'    // Heart + Date gate
  | 'entering'        // Welcome animation
  | 'unlocked'        // Main experience (chapters, hub)
  | 'final_reveal'    // Final message
  | 'complete'        // Journey complete

const [stage, setStage] = useState<HekayaStage>('locked_heart')
```

**Stage transitions:**
```
locked_heart → entering (2s delay) → unlocked
unlocked → final_reveal (user clicks button) → unlocked (close)
```

---

## 📝 CODE STYLE GUIDE

### File Structure

```typescript
// 1. Imports (grouped)
import { motion } from 'framer-motion'           // External
import { useState } from 'react'                 // React
import type { Config } from '../types'           // Types
import { Component } from '../components'        // Internal

// 2. Constants (outside component)
const PARTICLES = Array.from({ length: 18 }, ...)

// 3. Interfaces/Types
interface ComponentProps {
  config: Config
  onComplete: () => void
}

// 4. Component
export function Component({ config, onComplete }: ComponentProps) {
  // 4a. State/Refs
  const [state, setState] = useState(...)
  const ref = useRef(...)
  
  // 4b. Derived values
  const items = useMemo(() => ..., [deps])
  
  // 4c. Effects
  useEffect(() => { ... }, [deps])
  
  // 4d. Handlers
  const handleClick = () => { ... }
  
  // 4e. Early returns (loading, error states)
  if (loading) return <Spinner />
  
  // 4f. Render
  return (...)
}

// 5. Sub-components (if small and local)
function SubComponent() { ... }

// 6. Default export (if needed)
export default Component
```

### Naming Conventions

```typescript
// Components: PascalCase
function ChapterView() {}

// Hooks: camelCase with 'use' prefix
function useChapterProgress() {}

// Props interfaces: ComponentNameProps
interface ChapterViewProps {}

// Constants: SCREAMING_SNAKE_CASE
const MAX_PARTICLES = 100

// Variables/functions: camelCase
const chapterCount = 5
const handleClick = () => {}

// Types: PascalCase
type HekayaStage = 'locked' | 'unlocked'
```

### Import Paths

```typescript
// ✅ CORRECT - Relative paths
import { GlassCard } from '../../shared/GlassCard'
import type { Chapter } from '../../../types/hekaya'

// ❌ WRONG - Absolute imports (not configured)
import { GlassCard } from '@/shared/GlassCard'
```

---

## 🔍 COMMON PATTERNS

### Locale-Based Copy

**ALWAYS provide both Arabic and English:**

```typescript
const copy = locale === 'ar'
  ? {
      title: 'العنوان',
      button: 'التالي',
      hint: 'نصيحة مفيدة',
    }
  : {
      title: 'Title',
      button: 'Next',
      hint: 'Helpful hint',
    }

return <h1>{copy.title}</h1>
```

### Conditional Rendering

```typescript
// ✅ GOOD - Explicit null check
{config.voiceNote ? (
  <audio src={config.voiceNote.src} controls />
) : null}

// ✅ GOOD - Boolean short-circuit
{isVisible && <Component />}

// ❌ BAD - Might render '0' or 'false'
{items.length && <List items={items} />}

// ✅ CORRECT
{items.length > 0 && <List items={items} />}
```

### Event Handlers

```typescript
// ✅ GOOD - Arrow function in props
<button onClick={() => handleClick(id)}>

// ✅ GOOD - Direct reference if no args
<button onClick={handleClick}>

// ❌ BAD - Calling immediately
<button onClick={handleClick(id)}>  // Calls on render!
```

---

## 🚨 COMMON PITFALLS

### 1. Arabic Text Corruption

**SYMPTOM:** Arabic text shows as `&#1583;&#1610;...` or `%D8%AF%D9%8A...`

**CAUSE:** File encoding issue or URL encoding

**FIX:**
```typescript
// ✅ Keep as UTF-8
const message = 'دي حكايتنا'

// ❌ Don't do this
const message = decodeURIComponent('%D8%AF%D9%8A')
```

**PREVENTION:**
- Save files as UTF-8
- Never manually encode Arabic strings
- Copy-paste Arabic text exactly as provided

### 2. Animation Stutter

**SYMPTOM:** Choppy animations on mobile

**CAUSE:** Animating layout properties or too many particles

**FIX:**
```typescript
// ✅ GOOD - Transform properties
animate={{ y: 20, scale: 1.1, opacity: 0.5 }}

// ❌ BAD - Layout properties
animate={{ height: '100%', marginTop: 20 }}

// ✅ GOOD - Limit particles on mobile
const particleCount = isMobile ? 50 : 100
```

### 3. Type Errors with Config

**SYMPTOM:** `Property 'x' does not exist on type 'never'`

**CAUSE:** Not importing types correctly

**FIX:**
```typescript
// ✅ CORRECT
import type { Chapter } from '../../../types/hekaya'

const chapter: Chapter = config.chapters[0]

// ❌ WRONG
const chapter = config.chapters[0]  // Type inference fails
```

### 4. RTL Layout Breaks

**SYMPTOM:** Layout flips incorrectly or arrows point wrong direction

**CAUSE:** Not considering RTL in flex/grid

**FIX:**
```typescript
// ✅ GOOD - Use logical properties
className="ms-4"  // margin-inline-start (auto RTL)

// ❌ BAD - Physical properties
className="ml-4"  // margin-left (breaks in RTL)

// ✅ GOOD - RTL-aware icons
{locale === 'ar' ? '←' : '→'}  // Flip arrow direction
```

### 5. Missing Null Checks

**SYMPTOM:** `Cannot read property 'x' of undefined`

**CAUSE:** Assuming config properties always exist

**FIX:**
```typescript
// ✅ GOOD - Optional chaining
{config.voiceNote?.label}

// ✅ GOOD - Nullish coalescing
const lines = config.splitLines ?? config.message.split('\n')

// ❌ BAD - Assuming exists
{config.voiceNote.label}  // Crashes if undefined
```

---

## ✅ TESTING CHECKLIST

Before marking work complete, verify:

### TypeScript
- [ ] `npm run build` succeeds with no errors
- [ ] No `any` types used
- [ ] All props have interfaces
- [ ] Imports use `type` keyword for types

### Functionality
- [ ] Feature works end-to-end
- [ ] Navigation flows correctly
- [ ] State persists in localStorage
- [ ] Config changes reflect immediately

### Visual/UX
- [ ] Responsive (320px - 1920px)
- [ ] Animations smooth (60fps desktop, 30fps mobile)
- [ ] Colors use CSS variables
- [ ] Fonts use Hekaya font classes
- [ ] Touch targets ≥44x44px on mobile

### RTL/Arabic
- [ ] Arabic text displays correctly (not corrupted)
- [ ] Layout works in RTL mode
- [ ] Text alignment correct (right for Arabic)
- [ ] Line height sufficient for Arabic (≥1.8)

### Performance
- [ ] Images lazy loaded
- [ ] Heavy components lazy loaded
- [ ] Particle counts reasonable
- [ ] No console errors/warnings
- [ ] No memory leaks (check DevTools)

### Accessibility
- [ ] Keyboard navigation works
- [ ] Interactive elements have aria-labels
- [ ] Color contrast sufficient
- [ ] Focus indicators visible

---

## 🔧 DEBUGGING TIPS

### Console Errors

**"Module not found"**
```bash
# Check import path is correct
# Hekaya uses relative imports, not aliases
import { X } from '../../shared/X'  # ✅
import { X } from '@/shared/X'      # ❌
```

**"Type 'X' is not assignable to type 'Y'"**
```typescript
// Import the correct type
import type { Chapter } from '../../../types/hekaya'

// Use type assertion only if absolutely necessary
const chapter = config.chapters[0] as Chapter
```

**"Cannot read property 'x' of undefined"**
```typescript
// Add null checks
{config.voiceNote?.src}

// Or provide fallback
const src = config.voiceNote?.src ?? ''
```

### Visual Issues

**Colors wrong / Layout broken**
```bash
# Check if CSS variables are used
# Search for hardcoded colors:
grep -r "#[0-9a-f]" src/components/

# Should use:
className="text-[var(--hekaya-text-primary)]"
```

**Arabic text corrupted**
```bash
# Check file encoding
file -I src/components/hekaya/file.tsx
# Should show: charset=utf-8

# If not, re-save as UTF-8
```

**Animations not working**
```typescript
// Check Framer Motion import
import { motion } from 'framer-motion'

// Ensure element is <motion.div>, not <div>
<motion.div animate={...}>
```

---

## 📦 DEPLOYMENT CHECKLIST

Before production build:

### Code Cleanup
- [ ] Remove all `console.log` (except error logging)
- [ ] Remove commented code
- [ ] Remove unused imports
- [ ] Remove dev-only features (reset button)

### Optimization
- [ ] Images optimized (WebP, lazy load)
- [ ] Heavy components lazy loaded
- [ ] Bundle size <2MB
- [ ] Lighthouse Performance >90

### Security
- [ ] No API keys in code
- [ ] No sensitive data in config
- [ ] CSP headers configured
- [ ] HTTPS enforced

### Meta/SEO
- [ ] `index.html` has proper title
- [ ] Meta description set
- [ ] OG tags configured
- [ ] Favicon present

---

## 🎓 LEARNING RESOURCES

### Framer Motion
- Docs: https://www.framer.com/motion/
- Key concepts: `motion.div`, `animate`, `transition`, `variants`

### Tailwind CSS v4
- Migration guide: https://tailwindcss.com/docs/v4-beta
- CSS variables: Use `var(--name)` in arbitrary values

### TypeScript
- Strict mode: All options enabled in `tsconfig.json`
- Use `type` imports for types only

### Arabic Typography
- Line height: 1.8-2.0 (higher than English)
- Font feature settings: `'calt' 1, 'liga' 1, 'kern' 1`
- Text rendering: `optimizeLegibility`

---

## 📞 SUPPORT

### When Stuck

1. **Check existing code** - Look for similar patterns
2. **Check types** - `src/types/hekaya.ts` has all interfaces
3. **Check config** - `hekaya.config.ts` has all content
4. **Check this file** - AGENTS.md has most answers

### Common Questions

**Q: Where does content come from?**  
A: `src/content/hekaya.config.ts` - ALL content is config-driven

**Q: How do I add a new component?**  
A: Follow file structure, import types, use existing patterns

**Q: Arabic text not working?**  
A: Check file is UTF-8, use `hekaya-font-*` classes, test RTL

**Q: Animations choppy?**  
A: Reduce particle count, use transform properties only

**Q: TypeScript errors?**  
A: Import types from `../types/hekaya`, check interface matches

---

## ✨ SUCCESS CRITERIA

**You're doing it right when:**
- ✅ No TypeScript errors
- ✅ No console warnings
- ✅ Arabic text displays correctly
- ✅ Mobile responsive works
- ✅ Animations are smooth
- ✅ Code follows existing patterns
- ✅ Config changes reflect immediately
- ✅ Features work end-to-end

**You're done when:**
- ✅ All acceptance criteria met
- ✅ Testing checklist complete
- ✅ No known bugs
- ✅ Code reviewed (self-check this guide)
- ✅ Ready for user testing

---

**VERSION HISTORY:**
- v1.0 (March 2026) - Initial version covering Phases 1-8

---

**Remember:** Quality over speed. Take time to understand the patterns, follow the conventions, and test thoroughly. Hekaya is a premium product - the code should reflect that. 💜✨
