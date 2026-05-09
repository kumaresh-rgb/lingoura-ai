---
name: Lumina English
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#464555'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#767586'
  outline-variant: '#c7c4d7'
  surface-tint: '#4849da'
  primary: '#4343d5'
  on-primary: '#ffffff'
  primary-container: '#5d5fef'
  on-primary-container: '#faf7ff'
  inverse-primary: '#c1c1ff'
  secondary: '#5557a0'
  on-secondary: '#ffffff'
  secondary-container: '#aeafff'
  on-secondary-container: '#3e3f87'
  tertiary: '#006277'
  on-tertiary: '#ffffff'
  tertiary-container: '#007c96'
  on-tertiary-container: '#edfaff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c1c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2e2bc2'
  secondary-fixed: '#e1dfff'
  secondary-fixed-dim: '#c1c1ff'
  on-secondary-fixed: '#0f0d5a'
  on-secondary-fixed-variant: '#3d3e87'
  tertiary-fixed: '#b4ebff'
  tertiary-fixed-dim: '#75d3f1'
  on-tertiary-fixed: '#001f27'
  on-tertiary-fixed-variant: '#004e5f'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  h1:
    fontFamily: Manrope
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  h3:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Lexend
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.05em
  button:
    fontFamily: Lexend
    fontSize: 16px
    fontWeight: '500'
    lineHeight: '1.0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  container-max: 1200px
  gutter: 24px
---

## Brand & Style

The design system is anchored in a "Personal Tutor" philosophy—a balance of professional authority and encouraging warmth. It utilizes a refined **Minimalism** blended with subtle **Glassmorphism** to evoke a sense of modern intelligence and AI integration. 

The aesthetic is characterized by high-density whitespace, soft-focus background elements, and a serene atmosphere that reduces cognitive load during the learning process. The interface should feel like a premium, quiet workspace where the AI acts as a gentle guide rather than a rigid machine.

## Colors

The palette centers on "Intelligence Blue" and "Encouragement Purple." The primary colors are used primarily for interactive elements and progress indicators, while the background remains a crisp, neutral slate to maintain professionalism.

Gradients are used sparingly to highlight AI-driven features, suggesting a fluid and adaptive technology. In dark mode, the "clean whites" transition to a deep navy-charcoal, ensuring that the soft blue and purple accents maintain high legibility and a soothing glow.

## Typography

This design system utilizes **Manrope** for the majority of the interface to provide a modern, balanced, and highly readable foundation. Its geometric yet friendly curves reinforce the professional-tutor feel. 

**Lexend** is employed for functional labels and interactive components (like buttons and chips) because of its specific design for readability and educational contexts. This distinction helps users mentally separate content (Manrope) from controls (Lexend). Headlines should favor tighter tracking and bold weights to command attention without feeling aggressive.

## Layout & Spacing

The layout philosophy follows a **Fixed-Fluid Hybrid Grid**. Content is housed within a 12-column grid system with generous gutters to maintain a "clean" feel. 

Spacing is governed by an 8px linear scale. Large-scale vertical rhythm (40px+) is used to separate distinct learning modules, while tighter spacing (12px-24px) is reserved for elements within a single card or component. Use asymmetrical padding on cards—larger top/bottom padding than left/right—to create a sophisticated, editorial appearance.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Ambient Shadows**. Instead of traditional heavy shadows, this design system uses "tinted glows"—very soft, diffused shadows that take on a tiny percentage of the primary blue or purple hue.

1.  **Level 0 (Base):** Neutral background color.
2.  **Level 1 (Cards):** White (or dark navy) surfaces with a 1px subtle border (#E2E8F0) and a soft ambient shadow.
3.  **Level 2 (Active/Hover):** Glassmorphic overlays with a 12px backdrop blur and a more pronounced primary-tinted glow.
4.  **Level 3 (Modals):** High-contrast surfaces that appear to float significantly above the grid, utilizing a dark-tinted overlay for the background.

## Shapes

The shape language is defined by the **2xl** standard (1.5rem / 24px) for all primary cards and container elements. This high degree of roundedness communicates friendliness and approachability.

Secondary elements like buttons and input fields use a slightly smaller radius (12px-16px) to maintain a crisp look, while chips and status indicators use fully pill-shaped (rounded-full) corners to distinguish them as modular, interactive atoms.

## Components

### Cards
The primary container. Cards should have a 1px border (#E2E8F0) and 24px internal padding. In AI-suggested content, use a subtle top-border gradient of blue to purple.

### Buttons
Primary buttons utilize the `primary_gradient` with white text and a soft shadow that mirrors the button color. Secondary buttons are ghost-styled with a 2px blue border.

### Chips & Tags
Used for vocabulary categories or difficulty levels. These are pill-shaped with a low-opacity background tint of the primary color (e.g., 10% opacity blue) and high-contrast text.

### Input Fields
Clean, minimal fields with a 2px bottom border that transforms into a full 2xl rounded container upon focus. Use Lexend for placeholder text to keep it distinct from user input.

### Progress Indicators
Thin, rounded bars using the `primary_gradient`. For "personal tutor" feedback, use a floating "Avatar Bubble" component that features a glassmorphic background and the Manrope Medium typeface for conversational text.

### Learning Modules
Specific to this system, "Flashcard" components should utilize a vertical flip animation with a high-blur backdrop effect on the "hidden" side to maintain the glassmorphic theme.