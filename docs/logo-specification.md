# VocabBuilder Logo Design Specification

## Overview

**Logo Name**: VocabBuilder
**Logo Type**: Wordmark + Icon
**Style**: Modern, Clean, Approachable, Educational

---

## Design Concept

### Primary Concept: Knowledge Growth

The logo represents the journey of vocabulary building through:
- **Book**: Foundation of learning and knowledge
- **Brain/Neural Network**: Cognitive development and memory
- **Growth/Upward Motion**: Progress and improvement
- **Connection**: Links between words and understanding

### Visual Metaphor

An open book with neural network connections flowing upward, transforming into leaves or growth elements. This symbolizes how vocabulary grows organically in the mind through contextual learning.

---

## Logo Specifications

### Primary Logo (Horizontal)

#### Dimensions
- **Width**: 200px
- **Height**: 48px
- **Aspect Ratio**: 25:6

#### Components
1. **Icon**: Left side, 48x48px
2. **Wordmark**: Right side, "VocabBuilder" text
3. **Spacing**: 12px between icon and wordmark

#### Icon Design
- **Shape**: Stylized book with neural network patterns
- **Grid**: 24x24 base grid, scaled to 48x48px
- **Stroke**: 2px stroke width (4px when scaled)
- **Corners**: Rounded corners (4px radius)

#### Wordmark
- **Font**: Space Grotesk Bold
- **Size**: 28px
- **Weight**: 700 (Bold)
- **Color**: #111827 (gray-900)
- **Kerning**: -0.02em (slightly tight)
- **Capitalization**: CamelCase (VocabBuilder)

### Icon Only (Square)

#### Dimensions
- **Size**: 64x64px (scalable)
- **Grid**: 24x24 base grid
- **Padding**: 4px on all sides

#### Usage
- App icons (iOS, Android)
- Favicon (16x16px, 32x32px)
- Social media avatars
- Touchpoints (mobile)

### Secondary Logo (Stacked)

#### Dimensions
- **Width**: 120px
- **Height**: 80px
- **Layout**: Icon centered above wordmark

#### Components
1. **Icon**: Top center, 48x48px
2. **Wordmark**: Below icon, centered
3. **Tagline**: Below wordmark (optional), "Learn vocabulary that sticks"

---

## Color Specifications

### Primary Color Palette

| Component | Color Name | Hex Code | RGB |
|-----------|-----------|----------|-----|
| **Gradient Start** | Indigo 600 | #4F46E5 | 79, 70, 229 |
| **Gradient End** | Purple 500 | #A855F7 | 168, 85, 247 |
| **Text Primary** | Gray 900 | #111827 | 17, 24, 39 |

### Gradient Definition

```css
/* Linear gradient, 135 degrees */
background: linear-gradient(135deg, #4F46E5 0%, #A855F7 100%);
```

### Dark Mode Colors

| Component | Color Name | Hex Code | RGB |
|-----------|-----------|----------|-----|
| **Gradient Start** | Indigo 500 | #6366F1 | 99, 102, 241 |
| **Gradient End** | Purple 400 | #A855F7 | 168, 85, 247 |
| **Text Primary** | Slate 100 | #F1F5F9 | 241, 245, 249 |

### Single Color Variations

For single-color applications (embossing, foil stamping, single-color printing):
- **Primary**: Indigo 600 (#4F46E5)
- **Alternative**: Gray 900 (#111827)
- **Reversed**: White (#FFFFFF) on dark backgrounds

---

## Icon Design Details

### Visual Elements

1. **Book Base**
   - Open book shape, bottom curve
   - Left and right pages
   - Center spine line

2. **Neural Network**
   - 5-6 connection nodes
   - Lines connecting nodes to book edges
   - Nodes sized 4-6px

3. **Growth Elements** (optional variations)
   - Small leaf shapes at top of connections
   - Ascending line pattern
   - Subtle arrow pointing up-right

### Stroke Specifications
- **Weight**: 2px (on 24x24 grid)
- **Caps**: Round
- **Joins**: Round
- **Color**: Gradient (indigo to purple)

### File Formats
- **SVG**: Vector, scalable (primary)
- **PNG**: Raster, 64x64px, 128x128px, 512x512px
- **ICO**: Windows favicon, 16x16px, 32x32px, 48x48px

---

## Typography

### Wordmark Font

**Font Family**: Space Grotesk
- **Designer**: Hispanalytics (Google Fonts)
- **Style**: Geometric Sans-Serif
- **Character**: Modern, friendly, distinctive

**Weights**:
- Bold (700): Primary wordmark
- SemiBold (600): Taglines
- Medium (500): Secondary text

**Why Space Grotesk**:
- Modern, geometric feel
- Excellent readability
- Vietnamese character support ✓
- Distinctive personality (not generic)
- Works well in digital interfaces

### Character Spacing
- **Primary**: -0.02em (slightly tight)
- **Tagline**: 0.02em (slightly loose)

---

## Usage Guidelines

### Minimum Size

| Application | Minimum Size |
|-------------|--------------|
| Digital (screen) | 24px height |
| Print (high quality) | 0.5" (13mm) width |
| Print (newsprint) | 1" (25mm) width |
| Promotional items | 0.75" (19mm) width |

### Clear Space

Maintain clear space around the logo equal to:
- **Height of the "V" in VocabBuilder** on all sides
- **Minimum**: 12px on all sides

### Backgrounds

**Allowed**:
- White (#FFFFFF)
- Light gray (#F9FAFB)
- Gradient (135deg, #4F46E5 to #A855F7) with white logo
- Dark backgrounds with white logo variant

**Not Allowed**:
- Busy patterns
- Competing gradients
- Clashing colors (low contrast)

---

## Logo Variations

### 1. Full Color (Primary)
- Gradient icon
- Gray-900 text
- Use on white/light backgrounds

### 2. Dark Mode
- Gradient icon (lighter variant)
- White/slate-100 text
- Use on dark backgrounds

### 3. Single Color
- Indigo-600 icon
- Indigo-600 text
- Use for single-color applications

### 4. Monochrome
- Gray-900 icon
- Gray-900 text
- Use for black and white printing

### 5. Reversed
- White icon
- White text
- Use on dark/colored backgrounds

---

## Icon Construction (SVG)

### Path Data

```svg
<svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Book Base -->
  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="url(#gradient)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="url(#gradient)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>

  <!-- Neural Network Connections -->
  <circle cx="8" cy="8" r="1.5" fill="url(#gradient)"/>
  <circle cx="12" cy="6" r="1.5" fill="url(#gradient)"/>
  <circle cx="16" cy="8" r="1.5" fill="url(#gradient)"/>
  <circle cx="10" cy="12" r="1.5" fill="url(#gradient)"/>
  <circle cx="14" cy="12" r="1.5" fill="url(#gradient)"/>

  <!-- Connection Lines -->
  <path d="M8 8L12 6" stroke="url(#gradient)" stroke-width="1.5"/>
  <path d="M12 6L16 8" stroke="url(#gradient)" stroke-width="1.5"/>
  <path d="M8 8L10 12" stroke="url(#gradient)" stroke-width="1.5"/>
  <path d="M16 8L14 12" stroke="url(#gradient)" stroke-width="1.5"/>
  <path d="M10 12L14 12" stroke="url(#gradient)" stroke-width="1.5"/>

  <!-- Gradient Definition -->
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4F46E5"/>
      <stop offset="100%" stop-color="#A855F7"/>
    </linearGradient>
  </defs>
</svg>
```

---

## Animation Guidelines

### Subtle Motion (Digital Applications)

**Hover Effect**:
- Scale: 1.05 (5% increase)
- Duration: 150ms
- Easing: ease-out
- Transform: scale from center

**Loading Animation** (optional):
- Pulse effect on neural nodes
- Duration: 2s
- Infinite loop
- Opacity: 0.5 to 1.0

**Note**: Keep animations minimal and professional. No excessive motion.

---

## Application Examples

### Website Header
- **Size**: 40px height
- **Layout**: Horizontal (icon + wordmark)
- **Link**: Home page

### Mobile App Icon
- **Size**: 1024x1024px (source)
- **Format**: PNG with transparency
- **Background**: Gradient background
- **Icon**: White logo variant centered

### Email Signature
- **Size**: 48px height
- **Layout**: Horizontal
- **Color**: Full color or single color

### Social Media
- **LinkedIn**: 300x300px
- **Twitter**: 400x400px
- **Facebook**: 180x180px
- **Format**: PNG or JPG

---

## File Delivery

### Required Files

**Vector**:
- `vocabbuilder-logo.svg` (primary, full color)
- `vocabbuilder-icon.svg` (icon only)

**Raster**:
- `vocabbuilder-logo@2x.png` (400x96px, 2x retina)
- `vocabbuilder-icon-64.png` (64x64px)
- `vocabbuilder-icon-128.png` (128x128px)
- `vocabbuilder-icon-256.png` (256x256px)
- `vocabbuilder-icon-512.png` (512x512px)

**Favicon**:
- `favicon.ico` (multi-size: 16, 32, 48)

**Dark Mode**:
- `vocabbuilder-logo-dark.svg` (for dark backgrounds)
- `vocabbuilder-logo-dark@2x.png`

---

## Brand Integration

### Logo + Tagline

**Primary Tagline**: "Learn vocabulary that sticks"

**Usage**:
- Landing pages (below logo)
- Marketing materials
- Social media bios

**Not For**:
- App icons (no space)
- Small sizes (unreadable)

### Co-branding

When pairing with other logos:
- Maintain equal visual weight
- Use clear space divider
- Ensure color harmony
- Size logos proportionally

---

## Quality Assurance

### Checklist

- [ ] SVG validates without errors
- [ ] Gradients render correctly
- [ ] Text is readable at minimum size
- [ ] Clear space maintained
- [ ] Colors meet contrast requirements (WCAG AA)
- [ ] Files are optimized (SVG minified, PNG compressed)
- [ ] All variations exported
- [ ] Tested on light and dark backgrounds
- [ ] Animation is smooth (if applicable)

---

## Do's and Don'ts

### DO ✓
- Use approved file formats
- Maintain aspect ratio
- Ensure sufficient contrast
- Use appropriate size for medium
- Keep clear space around logo
- Use on clean, simple backgrounds

### DON'T ✗
- Stretch or distort logo
- Change colors arbitrarily
- Add drop shadows or effects
- Rotate or tilt logo
- Crowd logo with other elements
- Use on busy/clashing backgrounds
- Create unapproved variations

---

## Future Considerations

### Scalability
- Logo designed for scalability from 16px to large format
- Vector format ensures quality at any size
- Consider animated logo for video content

### Evolution
- Logo allows for subtle refinements
- Core concept (book + network) remains consistent
- Gradient can be updated with brand evolution

### Accessibility
- High contrast options available
- Works with screen readers (alt text)
- Respects prefers-reduced-motion

---

## Contact

For logo usage questions or requests:
- Design Team: design@vocabbuilder.com
- Brand Guidelines: See `/docs/design-guidelines.md`
- Asset Repository: `/assets/logo/`

---

**Version**: 1.0
**Last Updated**: 2026-02-08
**Designer**: UI/UX Design System
**Status**: Approved for Production
