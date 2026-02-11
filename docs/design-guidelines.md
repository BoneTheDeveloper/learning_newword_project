# VocabBuilder Design System & Guidelines

## Design Philosophy

VocabBuilder combines the effectiveness of spaced repetition with engaging, context-rich learning. Our design prioritizes clarity, motivation, and delightful micro-interactions that make vocabulary building feel like play, not work.

**Core Principles:**
- **Clarity First**: Information hierarchy follows word > definition > context > media
- **Progressive Disclosure**: Show advanced options only when needed
- **Immediate Feedback**: Every action receives visual confirmation
- **Motivation Visible**: Streaks, progress, and achievements always in view
- **Context-Rich**: Teach phrases and sentences, not isolated words

---

## Color Palette

### Primary Colors

| Color Name | Hex Code | Tailwind | Usage |
|------------|----------|----------|-------|
| Primary Blue | `#4F46E5` | `indigo-600` | Primary buttons, links, brand elements |
| Primary Dark | `#4338CA` | `indigo-700` | Primary hover states |
| Primary Light | `#818CF8` | `indigo-400` | Primary light backgrounds |

### Secondary Colors

| Color Name | Hex Code | Tailwind | Usage |
|------------|----------|----------|-------|
| Accent Teal | `#14B8A6` | `teal-500` | Success states, completion |
| Accent Purple | `#A855F7` | `purple-500` | Achievements, premium features |
| Accent Orange | `#F97316` | `orange-500` | Streaks, warnings, attention |

### Semantic Colors

| Color Name | Hex Code | Tailwind | Usage |
|------------|----------|----------|-------|
| Success | `#10B981` | `emerald-500` | Correct answers, progress |
| Error | `#EF4444` | `red-500` | Incorrect answers, errors |
| Warning | `#F59E0B` | `amber-500` | Review due, low streak |
| Info | `#3B82F6` | `blue-500` | Tips, information |

### Neutral Colors (Light Mode)

| Color Name | Hex Code | Tailwind | Usage |
|------------|----------|----------|-------|
| Background | `#FFFFFF` | `white` | Main background |
| Surface | `#F9FAFB` | `gray-50` | Card backgrounds, sections |
| Border | `#E5E7EB` | `gray-200` | Borders, dividers |
| Text Primary | `#111827` | `gray-900` | Headings, important text |
| Text Secondary | `#4B5563` | `gray-600` | Body text, descriptions |
| Text Muted | `#9CA3AF` | `gray-400` | Placeholders, disabled |

### Dark Mode Colors

| Color Name | Hex Code | Tailwind | Usage |
|------------|----------|----------|-------|
| Background | `#0F172A` | `slate-900` | Main background |
| Surface | `#1E293B` | `slate-800` | Card backgrounds |
| Border | `#334155` | `slate-700` | Borders, dividers |
| Text Primary | `#F1F5F9` | `slate-100` | Headings, important text |
| Text Secondary | `#CBD5E1` | `slate-300` | Body text, descriptions |
| Text Muted | `#64748B` | `slate-500` | Placeholders, disabled |

### SRS Response Colors

| Response | Hex Code | Tailwind | Meaning |
|----------|----------|----------|---------|
| Again | `#EF4444` | `red-500` | Forgot completely (< 1 min) |
| Hard | `#F97316` | `orange-500` | Remembered with difficulty (6 min) |
| Good | `#10B981` | `emerald-500` | Remembered correctly (10 min) |
| Easy | `#14B8A6` | `teal-500` | Knew perfectly (4 days) |

---

## Typography

### Font Families

**Primary: Plus Jakarta Sans**
- Modern, geometric sans-serif with excellent readability
- Vietnamese character support: ✓
- Google Fonts: `https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap`

**Display: Space Grotesk**
- Distinctive, personality-driven for headings
- Vietnamese character support: ✓
- Google Fonts: `https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&display=swap`

**Monospace: JetBrains Mono**
- Clean, readable for code and examples
- Google Fonts: `https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap`

### Type Scale

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `display-2xl` | 60px | 700 | 1.1 | Hero headings, landing |
| `display-xl` | 48px | 700 | 1.1 | Page headings |
| `display-lg` | 36px | 600 | 1.2 | Section headings |
| `display-md` | 30px | 600 | 1.3 | Card headings |
| `heading-xl` | 24px | 600 | 1.3 | Subsections |
| `heading-lg` | 20px | 600 | 1.4 | Card titles |
| `heading-md` | 18px | 500 | 1.4 | List headings |
| `body-lg` | 18px | 400 | 1.6 | Important body text |
| `body` | 16px | 400 | 1.6 | Default body text |
| `body-sm` | 14px | 400 | 1.5 | Secondary text |
| `caption` | 12px | 400 | 1.5 | Labels, captions |

### Font Family Usage

```css
/* Display Font - Headings */
.font-display { font-family: 'Space Grotesk', sans-serif; }

/* Body Font - Content */
.font-body { font-family: 'Plus Jakarta Sans', sans-serif; }

/* Monospace - Code, examples */
.font-mono { font-family: 'JetBrains Mono', monospace; }
```

---

## Spacing Scale

Base unit: 4px (following Tailwind's spacing scale)

| Token | Value | Usage |
|-------|-------|-------|
| `spacing-0` | 0px | None |
| `spacing-1` | 4px | Tight spacing |
| `spacing-2` | 8px | Compact spacing |
| `spacing-3` | 12px | Default spacing |
| `spacing-4` | 16px | Comfortable spacing |
| `spacing-5` | 20px | Section spacing |
| `spacing-6` | 24px | Large spacing |
| `spacing-8` | 32px | XL spacing |
| `spacing-10` | 40px | XXL spacing |
| `spacing-12` | 48px | Section gaps |
| `spacing-16` | 64px | Hero spacing |

### Common Spacing Patterns

- **Card padding**: `spacing-6` (24px)
- **Button padding**: `spacing-3` (12px) horizontal, `spacing-2` (8px) vertical
- **Section gap**: `spacing-12` (48px)
- **Grid gap**: `spacing-6` (24px)
- **Form input padding**: `spacing-3` (12px)

---

## Components

### Buttons

#### Primary Button
```css
background: #4F46E5 (indigo-600)
color: white
padding: 12px 24px
border-radius: 8px
font-weight: 600
font-size: 16px
hover: #4338CA (indigo-700)
active: scale(0.98)
```

#### Secondary Button
```css
background: transparent
color: #4F46E5 (indigo-600)
border: 2px solid #E5E7EB (gray-200)
padding: 12px 24px
border-radius: 8px
font-weight: 600
font-size: 16px
hover: background #F9FAFB (gray-50)
```

#### SRS Response Buttons
- **Again**: Red gradient (`bg-gradient-to-r from-red-500 to-red-600`)
- **Hard**: Orange gradient (`bg-gradient-to-r from-orange-500 to-orange-600`)
- **Good**: Emerald gradient (`bg-gradient-to-r from-emerald-500 to-emerald-600`)
- **Easy**: Teal gradient (`bg-gradient-to-r from-teal-500 to-teal-600`)

### Cards

#### Vocabulary Card
```css
background: white (light) / slate-800 (dark)
border: 1px solid #E5E7EB (light) / slate-700 (dark)
border-radius: 12px
padding: 24px
shadow: 0 1px 3px rgba(0,0,0,0.1)
hover: shadow-lg, transform translateY(-2px)
transition: all 150ms ease
```

#### Flashcard Card
```css
aspect-ratio: 4/3
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
border-radius: 16px
padding: 32px
display: flex
align-items: center
justify-content: center
cursor: pointer
```

### Inputs

#### Text Input
```css
background: white (light) / slate-900 (dark)
border: 2px solid #E5E7EB (light) / slate-700 (dark)
border-radius: 8px
padding: 12px 16px
font-size: 16px
focus: border-indigo-500, ring-2 ring-indigo-200
```

#### Seed Word Input (Enhanced)
```css
background: white (light) / slate-800 (dark)
border: 2px dashed #E5E7EB (light) / slate-600 (dark)
border-radius: 12px
padding: 16px
min-height: 120px
placeholder: "Enter topic, paste text, or describe what you want to learn..."
```

### Badges

#### Difficulty Badge
- **Easy**: `bg-emerald-100 text-emerald-700` (light), `bg-emerald-500/20 text-emerald-300` (dark)
- **Medium**: `bg-amber-100 text-amber-700` (light), `bg-amber-500/20 text-amber-300` (dark)
- **Hard**: `bg-red-100 text-red-700` (light), `bg-red-500/20 text-red-300` (dark)

#### Status Badge
- **New**: `bg-blue-100 text-blue-700`
- **Learning**: `bg-purple-100 text-purple-700`
- **Mastered**: `bg-teal-100 text-teal-700`
- **Review Due**: `bg-orange-100 text-orange-700`

### Progress Indicators

#### Linear Progress Bar
```css
height: 8px
background: #E5E7EB (light) / slate-700 (dark)
border-radius: 4px
overflow: hidden
fill: linear-gradient(90deg, #4F46E5, #A855F7)
```

#### Circular Progress
```css
size: 64px
stroke-width: 4
stroke: #E5E7EB (light) / slate-700 (dark)
progress: linear-gradient(90deg, #4F46E5, #A855F7)
```

---

## Dark Mode

### Implementation Strategy

Use `dark:` variant from Tailwind CSS with class-based dark mode:

```html
<html class="dark">
```

### Dark Mode Overrides

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Background | `bg-white` | `dark:bg-slate-900` |
| Surface | `bg-gray-50` | `dark:bg-slate-800` |
| Text Primary | `text-gray-900` | `dark:text-slate-100` |
| Text Secondary | `text-gray-600` | `dark:text-slate-300` |
| Border | `border-gray-200` | `dark:border-slate-700` |
| Card Shadow | `shadow-sm` | `dark:shadow-none dark:border` |

### Dark Mode Best Practices

1. **Contrast First**: Ensure 4.5:1 contrast ratio for all text
2. **Reduce Pure Black**: Use slate-900 (#0F172A) instead of #000000
3. **Elevate Surfaces**: Use slate-800 for cards to create depth
4. **Softer Borders**: Use slate-700 for subtle separation
5. **Adjust Opacity**: Use white with opacity for overlays

---

## Layout & Responsive Design

### Breakpoints

| Breakpoint | Min Width | Target Devices |
|------------|-----------|----------------|
| `sm` | 640px | Large phones, landscape |
| `md` | 768px | Tablets, small laptops |
| `lg` | 1024px | Desktops |
| `xl` | 1280px | Large desktops |
| `2xl` | 1536px | Extra large screens |

### Container Widths

| Container | Max Width | Usage |
|-----------|-----------|-------|
| `container-sm` | 640px | Narrow content, forms |
| `container-md` | 768px | Medium content |
| `container-lg` | 1024px | Standard pages |
| `container-xl` | 1280px | Wide content, dashboard |

### Grid Systems

#### 2-Column Grid (Cards)
```html
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
  <!-- Cards -->
</div>
```

#### 3-Column Grid (Vocabulary Selection)
```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- Cards -->
</div>
```

#### 4-Column Grid (Collections)
```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  <!-- Cards -->
</div>
```

---

## Accessibility

### WCAG 2.1 AA Compliance

#### Color Contrast
- Normal text: Minimum 4.5:1
- Large text (18px+): Minimum 3:1
- Interactive elements: Minimum 3:1

#### Touch Targets
- Minimum size: 44x44px (mobile)
- Spacing: 8px between adjacent targets

#### Keyboard Navigation
- Tab order follows visual layout
- Focus indicators visible (2px solid indigo-500)
- Skip links available for main content

#### Screen Reader Support
- Alt text for all images
- aria-label for icon-only buttons
- aria-live for dynamic content
- Semantic HTML elements

#### Focus Management
- Modal traps focus within dialog
- Focus returns to trigger after close
- No keyboard traps

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Animations & Micro-interactions

### Animation Durations

| Interaction | Duration | Easing |
|-------------|----------|--------|
| Button hover | 150ms | ease-out |
| Card lift | 200ms | ease-out |
| Modal fade | 200ms | ease-in-out |
| Page transition | 300ms | ease-in-out |
| SRS card flip | 400ms | ease-in-out |

### Animation Properties

```css
/* Transform-based (GPU accelerated) */
transform: translateY(-2px)
transform: scale(1.02)
opacity: 0.95

/* Avoid animating */
width, height, margin, padding
```

### Micro-interactions

1. **Button Press**: Scale to 0.98 on active
2. **Card Hover**: Lift by 2px, shadow increase
3. **Success Checkmark**: Draw animation (300ms)
4. **Streak Counter**: Pulse on increment
5. **Progress Fill**: Animate from 0 to target
6. **Flashcard Flip**: 3D rotation (400ms)

---

## Icon System

### Icon Library: Lucide React

- Consistent 24x24 viewBox
- Stroke width: 2 (default)
- Color: inherit from text color

### Common Icons

| Icon | Usage |
|------|-------|
| `Flame` | Streak counter |
| `BookOpen` | Learning |
| `Brain` | Memory, SRS |
| `CheckCircle` | Success, completed |
| `XCircle` | Error, incorrect |
| `Star` | Favorites, achievements |
| `TrendingUp` | Progress |
| `Clock` | Review time |
| `Shuffle` | Random practice |
| `Settings` | Settings |

### Icon Sizes

| Size | Tailwind | Usage |
|------|----------|-------|
| XS | `w-4 h-4` | Inline icons |
| SM | `w-5 h-5` | Button icons |
| MD | `w-6 h-6` | Default icons |
| LG | `w-8 h-8` | Feature icons |
| XL | `w-12 h-12` | Hero icons |

---

## Effects & Visual Enhancements

### Gradients

#### Primary Gradient
```css
background: linear-gradient(135deg, #4F46E5 0%, #A855F7 100%);
```

#### Success Gradient
```css
background: linear-gradient(135deg, #10B981 0%, #14B8A6 100%);
```

#### Hero Gradient (Landing)
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Shadows

| Shadow | Usage |
|--------|-------|
| `shadow-sm` | Cards default |
| `shadow-md` | Buttons, hover |
| `shadow-lg` | Dropdowns, modals |
| `shadow-xl` | Popovers |
| `shadow-2xl` | Hero CTA |

### Backdrop Blur

```css
backdrop-filter: blur(12px);
background: rgba(255, 255, 255, 0.8); /* Light */
background: rgba(15, 23, 42, 0.8);  /* Dark */
```

### Glassmorphism

```css
background: rgba(255, 255, 255, 0.1);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.2);
```

---

## Data Visualization

### Progress Charts

#### Study Streak Heatmap
- 7x5 grid (35 days)
- Color scale: gray → teal → indigo → purple
- Tooltip on hover showing date and words learned

#### Retention Rate
- Donut chart showing mastered vs learning
- Center shows percentage
- Color-coded by SRS stage

#### Words Learned Timeline
- Line chart with 7-day moving average
- X-axis: dates
- Y-axis: words learned
- Gradient fill under line

### Statistics Cards

| Metric | Icon | Format |
|--------|------|--------|
| Total Words | BookOpen | Number (e.g., 1,234) |
| Streak Days | Flame | Number + flame |
| Reviews Today | Clock | Number / target |
| Retention Rate | TrendingUp | Percentage |

---

## Form Patterns

### Input Groups

```html
<div class="space-y-4">
  <!-- Label -->
  <label class="block text-sm font-medium text-gray-700">
    Label Text
  </label>

  <!-- Input -->
  <input type="text" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />

  <!-- Hint -->
  <p class="text-sm text-gray-500">
    Helper text goes here
  </p>
</div>
```

### Error States

```css
input.error {
  border-color: #EF4444;
  background-color: #FEF2F2;
}

.error-message {
  color: #EF4444;
  font-size: 14px;
  margin-top: 4px;
}
```

### Validation Feedback

- **Success**: Green checkmark icon, green border
- **Error**: Red X icon, red border, error message
- **Loading**: Spinner icon, input disabled

---

## Responsive Patterns

### Mobile-First Navigation

#### Mobile (< 768px)
- Bottom tab bar (fixed)
- 4-5 primary destinations
- Icons only, labels on active
- 60px height

#### Desktop (≥ 768px)
- Top navigation bar
- Logo left, links center, actions right
- 64px height

### Responsive Grids

#### Cards
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns
- Large desktop: 4 columns

#### Flashcards
- Mobile: Full width, centered
- Tablet: 2 columns
- Desktop: 3 columns

---

## Loading States

### Skeleton Screens

```css
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### Spinner

```css
.spinner {
  border: 3px solid #E5E7EB;
  border-top-color: #4F46E5;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

---

## Tailwind Configuration

### Custom Colors

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        srs: {
          again: '#EF4444',
          hard: '#F97316',
          good: '#10B981',
          easy: '#14B8A6',
        }
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
    },
  },
  darkMode: 'class',
}
```

---

## Implementation Guidelines

### 1. Component Structure

```html
<div class="component-name">
  <div class="component-name__header">
    <!-- Header content -->
  </div>

  <div class="component-name__body">
    <!-- Main content -->
  </div>

  <div class="component-name__footer">
    <!-- Footer content -->
  </div>
</div>
```

### 2. State Classes

```html
<button class="btn btn--primary btn--loading">
  Loading...
</button>
```

### 3. Responsive Classes

```html
<!-- Mobile: text-sm, Desktop: text-base -->
<h1 class="text-sm md:text-base lg:text-lg">
  Responsive Heading
</h1>
```

### 4. Dark Mode Classes

```html
<div class="bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100">
  Adaptive content
</div>
```

---

## Brand Elements

### Logo Guidelines

**Wordmark**: "VocabBuilder"
- Font: Space Grotesk Bold
- Color: Primary Indigo (#4F46E5)
- Style: Clean, modern, approachable

**Icon** (to be generated):
- Abstract book + brain concept
- Gradient: Indigo to purple
- Style: Minimal, geometric
- Size: Scalable vector

### Tagline

"Learn vocabulary that sticks"

### Voice & Tone

- **Encouraging**: Celebrate progress, not perfection
- **Clear**: Simple language, avoid jargon
- **Friendly**: Casual but professional
- **Motivating**: Focus on growth, not failure

---

## Anti-Patterns to Avoid

❌ **Don't:**
- Use emojis as icons (use SVG icons from Lucide)
- Create layouts that shift on hover
- Use pure black (#000000) in dark mode
- Hide important features behind multiple clicks
- Overuse gradients and shadows
- Make text too small on mobile (< 16px)
- Use low contrast colors in light mode
- Skip focus states for keyboard navigation
- Create horizontal scroll on mobile
- Use animations longer than 300ms for interactions

✓ **Do:**
- Use consistent icon sizes (24x24 base)
- Provide immediate visual feedback
- Test color contrast ratios
- Follow mobile-first approach
- Keep loading states minimal
- Use semantic HTML
- Make touch targets minimum 44x44px
- Respect prefers-reduced-motion
- Test on real devices
- Use transform/opacity for animations

---

## Resources

### Design Inspiration
- Duolingo: Gamification, streak mechanics
- Anki: SRS algorithm, card simplicity
- Memrise: Context-rich learning, mnemonics
- Notion: Clean typography, spacing

### Tools & Libraries
- **Icons**: Lucide React (https://lucide.dev)
- **Fonts**: Google Fonts
- **Colors**: Coolors (https://coolors.co)
- **Contrast Checker**: WebAIM (https://webaim.org/resources/contrastchecker/)

### Documentation
- Tailwind CSS: https://tailwindcss.com/docs
- shadcn/ui: https://ui.shadcn.com
- WCAG 2.1: https://www.w3.org/WAI/WCAG21/quickref/

---

## Version History

- **v1.0** (2026-02-08): Initial design system for VocabBuilder MVP
