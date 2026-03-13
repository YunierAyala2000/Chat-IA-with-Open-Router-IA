---
name: web-design-guidelines
description: Review UI code for Web Interface Guidelines compliance with Tailwind CSS best practices. Use when asked to "review my UI", "check accessibility", "audit design", "review UX", "check my site against best practices", or "review my Tailwind code". Checks for semantic HTML, accessibility, responsive design, Tailwind CSS usage correctness, and visual design quality.
metadata:
  author: vercel
  version: "2.0.0"
  argument-hint: <file-or-pattern>
---

# Web Interface Guidelines + Tailwind CSS Audit

Review files for compliance with Web Interface Guidelines **and** Tailwind CSS best practices.

---

## How It Works

1. Fetch the latest base guidelines from the source URL below.
2. Read the specified files (or prompt user for files/pattern).
3. Check against all rules from the fetched guidelines **plus** the Tailwind CSS rules defined in this file.
4. Output findings in the terse `file:line` format, grouped by category.

---

## Guidelines Source

Fetch fresh base guidelines before each review:

```
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

Use WebFetch to retrieve the latest rules. The fetched content contains core rules and output format instructions. Apply those rules first, then apply the Tailwind-specific rules below.

---

## Tailwind CSS Audit Rules

Apply these rules to every file reviewed, in addition to the fetched base guidelines.

### TW-01 — Setup & Configuration

| Rule    | Check                                                                                         |
| ------- | --------------------------------------------------------------------------------------------- |
| TW-01-A | CDN script present for plain HTML? (`cdn.tailwindcss.com`)                                    |
| TW-01-B | No `@import "tailwindcss"` in component files (belongs in global CSS only)                    |
| TW-01-C | Custom design tokens defined in `tailwind.config` under `theme.extend` (not hardcoded inline) |
| TW-01-D | `darkMode` strategy declared (`'class'` or `'media'`) if dark styles exist                    |

### TW-02 — Class Usage

| Rule    | Check                                                                                          |
| ------- | ---------------------------------------------------------------------------------------------- |
| TW-02-A | No raw `<style>` blocks or `style=""` attributes for properties Tailwind can express           |
| TW-02-B | No `@apply` directives in component or page files                                              |
| TW-02-C | Arbitrary values (`w-[742px]`, `bg-[#abc]`) used only when no default scale value fits         |
| TW-02-D | No duplicate or conflicting utility classes on the same element (e.g., `text-sm text-lg`)      |
| TW-02-E | Spacing uses Tailwind scale (multiples of 4px: `p-4`, `gap-6`, etc.) — not random pixel values |

### TW-03 — Responsive Design

| Rule    | Check                                                                                                   |
| ------- | ------------------------------------------------------------------------------------------------------- |
| TW-03-A | All responsive behavior uses breakpoint prefixes (`sm:`, `md:`, `lg:`, `xl:`) — no inline media queries |
| TW-03-B | Mobile-first approach: base classes target mobile, larger breakpoints override upward                   |
| TW-03-C | No fixed pixel widths on containers at small breakpoints (use `w-full` or `max-w-*`)                    |
| TW-03-D | Images use `w-full` or responsive sizing, never fixed width without a breakpoint override               |

### TW-04 — Dark Mode

| Rule    | Check                                                                                        |
| ------- | -------------------------------------------------------------------------------------------- |
| TW-04-A | Dark mode variants (`dark:`) applied to backgrounds, text, borders, and surfaces             |
| TW-04-B | No hardcoded hex colors in `bg-[]` or `text-[]` that bypass the dark mode system             |
| TW-04-C | Contrast ratio ≥ 4.5:1 for normal text and ≥ 3:1 for large text in both light and dark modes |

### TW-05 — Interactive States

| Rule    | Check                                                                                                     |
| ------- | --------------------------------------------------------------------------------------------------------- |
| TW-05-A | Every `<button>`, `<a>`, and clickable element has `hover:` styles                                        |
| TW-05-B | Every interactive element has `focus-visible:` styles (not just `focus:`) for keyboard navigation         |
| TW-05-C | `active:` scale or color feedback on buttons (`active:scale-95`)                                          |
| TW-05-D | Disabled state styled with `disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none` |
| TW-05-E | No `outline-none` without a replacement `focus-visible:ring-*` style                                      |

### TW-06 — Typography

| Rule    | Check                                                                                                                     |
| ------- | ------------------------------------------------------------------------------------------------------------------------- |
| TW-06-A | No generic/system font families (Arial, Helvetica, system-ui, Roboto, Inter) unless explicitly required                   |
| TW-06-B | Font loaded from Google Fonts or a custom source — not relied on from system stack                                        |
| TW-06-C | Type scale uses Tailwind steps (`text-sm`, `text-base`, `text-xl`, `text-4xl`) — no arbitrary px values for standard text |
| TW-06-D | Line height set explicitly on body text (`leading-relaxed` or `leading-normal`) — never left at browser default           |
| TW-06-E | Heading hierarchy is correct (h1 → h2 → h3) and corresponding size classes reinforce the visual hierarchy                 |

### TW-07 — Color & Contrast

| Rule    | Check                                                                                                                 |
| ------- | --------------------------------------------------------------------------------------------------------------------- |
| TW-07-A | Color palette defined as tokens in `tailwind.config theme.extend.colors` — not scattered arbitrary values             |
| TW-07-B | No purple-gradient-on-white default scheme (`from-violet-500 to-purple-600` on white bg) without strong justification |
| TW-07-C | Text on colored backgrounds uses contrasting color utility (`text-white` on dark, `text-zinc-900` on light)           |
| TW-07-D | Decorative elements use `aria-hidden="true"` and do not affect color contrast calculations                            |

### TW-08 — Layout & Composition

| Rule    | Check                                                                                  |
| ------- | -------------------------------------------------------------------------------------- |
| TW-08-A | `flex` containers have explicit `items-*` and `justify-*` — no implicit centering      |
| TW-08-B | `grid` containers have explicit `grid-cols-*` and `gap-*`                              |
| TW-08-C | No `absolute` positioning without a `relative` ancestor                                |
| TW-08-D | Z-index uses Tailwind scale (`z-10`, `z-20`, `z-50`) — no arbitrary `z-[999]` stacking |
| TW-08-E | Overflow controlled on scroll containers (`overflow-hidden`, `overflow-y-auto`)        |

### TW-09 — Animations & Motion

| Rule    | Check                                                                                                 |
| ------- | ----------------------------------------------------------------------------------------------------- |
| TW-09-A | All transitions use `transition-*` + `duration-*` + `ease-*` Tailwind classes                         |
| TW-09-B | Custom keyframe animations defined in `tailwind.config theme.extend.keyframes` — not in raw `<style>` |
| TW-09-C | `prefers-reduced-motion` respected: animations wrapped in `motion-safe:` variant                      |
| TW-09-D | No `animation: none` that strips motion for all users — use `motion-reduce:` instead                  |

### TW-10 — Accessibility (Tailwind-specific)

| Rule    | Check                                                                                            |
| ------- | ------------------------------------------------------------------------------------------------ |
| TW-10-A | `sr-only` used for visually hidden but screen-reader-accessible text (labels, icon descriptions) |
| TW-10-B | `not-sr-only` to reveal sr-only content on focus for skip links                                  |
| TW-10-C | Icon-only buttons have either `aria-label` or a `<span class="sr-only">` child                   |
| TW-10-D | Color alone never conveys meaning — always paired with text or icon                              |
| TW-10-E | Form inputs have associated `<label>` elements (not just placeholder text)                       |

### TW-11 — Performance

| Rule    | Check                                                                                                         |
| ------- | ------------------------------------------------------------------------------------------------------------- |
| TW-11-A | No unused large image files inlined as base64 in class values                                                 |
| TW-11-B | `backdrop-blur-*` used sparingly (expensive on mobile)                                                        |
| TW-11-C | `animate-*` classes on elements not visible in the initial viewport wrapped in `IntersectionObserver` trigger |

---

## Mobile Design Rules with Tailwind CSS

These rules apply specifically when the reviewed file targets mobile screens (viewport width < 768px), is part of a mobile-first project, or is a React Native Web / PWA interface. Apply all TW-01–TW-11 rules above **plus** these mobile-specific rules.

### MOB-01 — Viewport & Safe Areas

| Rule     | Check                                                                                                |
| -------- | ---------------------------------------------------------------------------------------------------- |
| MOB-01-A | `<meta name="viewport" content="width=device-width, initial-scale=1">` present in `<head>`           |
| MOB-01-B | Top safe area respected: `pt-safe` or `pt-[env(safe-area-inset-top)]` on fixed/sticky headers        |
| MOB-01-C | Bottom safe area respected: `pb-safe` or `pb-[env(safe-area-inset-bottom)]` on bottom bars and CTAs  |
| MOB-01-D | No horizontal scroll on any screen: root container uses `overflow-x-hidden` or `w-screen max-w-full` |
| MOB-01-E | Content never touches screen edges: minimum horizontal padding `px-4` (16px) on all content areas    |

### MOB-02 — Touch Targets

| Rule     | Check                                                                                              |
| -------- | -------------------------------------------------------------------------------------------------- |
| MOB-02-A | All interactive elements ≥ 44×44px touch target: verify `min-h-11 min-w-11` (`44px`) or equivalent |
| MOB-02-B | Tap targets have adequate spacing between them: gap ≥ `gap-2` (8px) minimum, `gap-3` preferred     |
| MOB-02-C | No overlapping clickable areas without explicit `z-*` separation                                   |
| MOB-02-D | Form inputs minimum height `h-12` (48px) — not `h-8` or `h-9` which are too small for touch        |
| MOB-02-E | Checkboxes and radio buttons minimum `w-5 h-5` (20px), preferably `w-6 h-6` (24px)                 |

### MOB-03 — Mobile Layout Patterns

| Rule     | Check                                                                                                                                                       |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MOB-03-A | Single-column layout on mobile (`flex flex-col` or `grid grid-cols-1`) — no multi-column at base breakpoint unless intentional (e.g., 2-col grid for cards) |
| MOB-03-B | Bottom navigation bar present on multi-section apps: `fixed bottom-0 w-full` with safe area padding                                                         |
| MOB-03-C | Bottom nav max 5 items — more than 5 items should use a "More" menu overflow                                                                                |
| MOB-03-D | Modals and drawers use `fixed inset-0` overlay + `rounded-t-3xl` bottom sheets or `rounded-2xl` centered modals                                             |
| MOB-03-E | Bottom sheets have a drag handle: `w-10 h-1.5 bg-zinc-300 rounded-full mx-auto mt-3 mb-4`                                                                   |
| MOB-03-F | Floating Action Button (FAB) positioned `fixed bottom-6 right-5` with safe area awareness                                                                   |
| MOB-03-G | Sticky headers use `sticky top-0 z-40 bg-white/90 backdrop-blur-md` (or dark equivalent)                                                                    |

### MOB-04 — Mobile Typography

| Rule     | Check                                                                                                |
| -------- | ---------------------------------------------------------------------------------------------------- |
| MOB-04-A | Minimum body font size `text-sm` (14px) — never `text-xs` (12px) for paragraph text                  |
| MOB-04-B | Display/hero headings capped at `text-3xl` (30px) to `text-4xl` (36px) on mobile to prevent overflow |
| MOB-04-C | `leading-relaxed` or `leading-normal` on all paragraph text for comfortable mobile reading           |
| MOB-04-D | `truncate` or `line-clamp-*` applied to long text in list rows to prevent overflow                   |
| MOB-04-E | No text smaller than `text-xs` (12px) — fails readability on small screens                           |
| MOB-04-F | Letter spacing for headings: `tracking-tight` on large headings, `tracking-normal` on body           |

### MOB-05 — Mobile Spacing Scale

| Rule     | Check                                                                                                     |
| -------- | --------------------------------------------------------------------------------------------------------- |
| MOB-05-A | Section vertical spacing between major sections: `py-8` (32px) to `py-12` (48px) — not `py-16`+ on mobile |
| MOB-05-B | Card inner padding: `p-4` (16px) minimum, `p-5` (20px) comfortable — not `p-2` or `p-3`                   |
| MOB-05-C | List item row height: `h-14` (56px) to `h-16` (64px) for comfortable thumb reach                          |
| MOB-05-D | Header/navbar height: `h-14` (56px) standard, `h-12` (48px) compact — not less                            |
| MOB-05-E | Bottom tab bar height: `h-16` (64px) + safe area — not shorter                                            |
| MOB-05-F | Stack of action buttons: `gap-3` (12px) minimum between vertical button stack                             |

### MOB-06 — Mobile Navigation

| Rule     | Check                                                                                                |
| -------- | ---------------------------------------------------------------------------------------------------- |
| MOB-06-A | Back button always present on detail/inner screens (top-left, `w-10 h-10` touch target)              |
| MOB-06-B | Active tab in bottom nav visually distinct: accent color + label visible, not just icon color change |
| MOB-06-C | Drawer/sidebar `w-72` (288px) maximum — wider drawers cover too much content                         |
| MOB-06-D | Overlay behind drawer/modal: `fixed inset-0 bg-black/50 z-40` — not skipped                          |
| MOB-06-E | No hover-only menus — all navigation reachable by tap                                                |
| MOB-06-F | Search bar accessible from the top of list/feed screens — not hidden in a menu                       |

### MOB-07 — Mobile Forms

| Rule     | Check                                                                                                                                   |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| MOB-07-A | Inputs use appropriate `inputmode` attribute: `inputmode="email"`, `inputmode="numeric"`, `inputmode="tel"` to trigger correct keyboard |
| MOB-07-B | Password inputs have `type="password"` with a show/hide toggle (eye icon, `w-5 h-5`, `absolute right-4`)                                |
| MOB-07-C | Submit CTA is full-width `w-full` at mobile breakpoint — not a small inline button                                                      |
| MOB-07-D | Error messages appear inline below the field (`mt-1 text-sm text-red-500`) — not only in a top banner                                   |
| MOB-07-E | Autofill supported: `autocomplete` attribute set on name, email, phone, and password fields                                             |
| MOB-07-F | Labels above inputs (not only placeholders) — placeholders disappear on focus and fail accessibility                                    |

### MOB-08 — Mobile Visual Design

| Rule     | Check                                                                                                                                                                |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MOB-08-A | Corner radius consistent: define one or two radius values in `tailwind.config` and apply everywhere — no mixing `rounded-md` and `rounded-2xl` on similar components |
| MOB-08-B | Images use `object-cover` with explicit `aspect-*` ratio class — no distorted images                                                                                 |
| MOB-08-C | Avatar images: always `rounded-full` with explicit `w-*` and `h-*` (equal values)                                                                                    |
| MOB-08-D | Skeleton loaders match exact shape of real content: same `rounded-*`, `w-*`, `h-*` classes                                                                           |
| MOB-08-E | Cards have consistent elevation: all cards at same level use same `shadow-*` value                                                                                   |
| MOB-08-F | Gradient overlays on images use `bg-gradient-to-b from-transparent to-black/70` — avoid sharp color stops                                                            |
| MOB-08-G | Status bar area (top ~44px) has legible text: use `text-white` on dark hero images, `text-zinc-900` on light                                                         |

### MOB-09 — Mobile Scroll & Overflow

| Rule     | Check                                                                                                                        |
| -------- | ---------------------------------------------------------------------------------------------------------------------------- |
| MOB-09-A | Horizontal scroll sections use `overflow-x-auto` with `-webkit-overflow-scrolling: touch` (via `[style]` or Tailwind plugin) |
| MOB-09-B | Horizontal scroll cards use `snap-x snap-mandatory` + `snap-start` on children for smooth snapping                           |
| MOB-09-C | Main scroll container uses `overflow-y-auto` with `overscroll-y-contain` to prevent scroll chaining                          |
| MOB-09-D | No `overflow-hidden` on the `<body>` while a scroll container is active (breaks pull-to-refresh)                             |
| MOB-09-E | Long lists (> 20 items) implement virtualization or pagination — not rendered all at once                                    |

### MOB-10 — Mobile Performance & PWA

| Rule     | Check                                                                                                                     |
| -------- | ------------------------------------------------------------------------------------------------------------------------- |
| MOB-10-A | Images have `loading="lazy"` on all below-fold images                                                                     |
| MOB-10-B | `will-change: transform` (via `will-change-transform`) only on actively animating elements — removed after animation ends |
| MOB-10-C | No `position: fixed` elements inside `transform` parents (breaks stacking context on iOS Safari)                          |
| MOB-10-D | `backdrop-filter` / `backdrop-blur-*` limited to 1–2 elements per screen (GPU intensive on mobile)                        |
| MOB-10-E | Fonts preloaded with `<link rel="preload">` for display fonts to prevent FOUT on mobile networks                          |
| MOB-10-F | PWA manifest (`manifest.json`) present if app is installable, with correct icon sizes                                     |

---

## Mobile Audit Output Format

When auditing a mobile-targeted file, prefix mobile findings with `MOB-` category:

```
src/components/BottomNav.tsx:15   [MOB-02-A]  error    Tab button 36×36px — below 44×44px minimum touch target
src/pages/Home.tsx:8              [MOB-01-E]  warning  Content section missing horizontal padding (px-4 minimum)
src/components/Input.tsx:3        [MOB-07-A]  warning  Email input missing inputmode="email" attribute
src/components/Card.tsx:20        [MOB-08-B]  error    Image missing object-cover and aspect-ratio class
src/pages/Profile.tsx:44          [MOB-04-A]  warning  Paragraph uses text-xs — minimum is text-sm for mobile body text
src/components/Modal.tsx:7        [MOB-03-D]  error    Modal overlay missing — no fixed inset-0 backdrop found
```

---

## Mobile Design Reference — Tailwind Quick Cheatsheet

Use this as a reference when composing fixes or generating mobile-optimized components.

### Spacing & Sizing Grid

```
Touch targets:    min-h-11 min-w-11  (44px minimum)
Input height:     h-12               (48px)
Row height:       h-14 to h-16       (56–64px)
Header height:    h-14               (56px)
Bottom nav:       h-16 + pb-safe     (64px + safe area)
Card padding:     p-4 to p-5         (16–20px)
Content gutters:  px-4 to px-5       (16–20px)
Section spacing:  py-8 to py-10      (32–40px)
```

### Corner Radius Scale for Mobile

```
Small elements (badges, chips):   rounded-full or rounded-md
Inputs, buttons:                  rounded-xl  (12px)
Cards, surfaces:                  rounded-2xl (16px)
Large cards, modals:              rounded-3xl (24px)
Bottom sheets:                    rounded-t-3xl (top corners only)
Avatars:                          rounded-full (always)
```

### Color Palette Examples

**Dark theme (OLED-friendly)**

```js
// tailwind.config theme.extend.colors
dark: {
  bg:      '#09090b',  // zinc-950
  surface: '#18181b',  // zinc-900
  border:  '#27272a',  // zinc-800
  text:    '#fafafa',  // zinc-50
  muted:   '#71717a',  // zinc-500
  accent:  '#f59e0b',  // amber-400
}
```

**Light theme (clean minimal)**

```js
light: {
  bg:      '#ffffff',
  surface: '#f4f4f5',  // zinc-100
  border:  '#e4e4e7',  // zinc-200
  text:    '#18181b',  // zinc-900
  muted:   '#a1a1aa',  // zinc-400
  accent:  '#6366f1',  // indigo-500
}
```

### Navigation Bar Pattern

```html
<!-- Top Nav -->
<header
  class="sticky top-0 z-40 flex h-14 items-center border-b border-zinc-100 bg-white/90 px-4 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90"
>
  <button
    class="flex h-10 w-10 items-center justify-center rounded-full transition-all hover:bg-zinc-100 active:scale-95 dark:hover:bg-zinc-800"
  >
    <!-- back icon -->
  </button>
  <h1 class="flex-1 truncate px-2 text-center text-[17px] font-semibold text-zinc-900 dark:text-zinc-50">Page Title</h1>
  <div class="h-10 w-10"></div>
  <!-- balance spacer -->
</header>

<!-- Bottom Tab Bar -->
<nav
  class="pb-safe fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t border-zinc-100 bg-white/90 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/90"
>
  <button
    class="hover:text-accent aria-[current=page]:text-accent flex min-h-11 min-w-11 flex-col items-center justify-center gap-0.5 px-3 text-zinc-400 transition-all active:scale-95 dark:text-zinc-500"
  >
    <!-- icon + label -->
  </button>
</nav>
```

### Card Pattern

```html
<!-- Standard card -->
<div class="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"></div>

<!-- Elevated card -->
<div class="rounded-3xl bg-white p-5 shadow-xl dark:bg-zinc-900"></div>

<!-- Glass card -->
<div class="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md"></div>
```

### Primary CTA Button

```html
<button
  class="flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-zinc-900 text-base font-semibold text-white transition-all duration-150 hover:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
>
  Button Label
</button>
```

### Form Input

```html
<div class="flex flex-col gap-1.5">
  <label for="email" class="text-sm font-medium text-zinc-700 dark:text-zinc-300"> Email </label>
  <input
    id="email"
    type="email"
    inputmode="email"
    autocomplete="email"
    placeholder="you@example.com"
    class="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-base text-zinc-900 transition-all duration-150 placeholder:text-zinc-400 focus:border-transparent focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
  />
  <p class="mt-1 hidden text-sm text-red-500" role="alert">Error message here</p>
</div>
```

Group findings by category. For each issue:

```
file:line  [CATEGORY-CODE]  severity  description
```

Severity levels: `error` (breaks functionality or accessibility), `warning` (violates best practice), `info` (improvement opportunity).

### Example output

```
src/components/Button.tsx:12   [TW-05-A]  error    Button missing hover: styles
src/components/Card.tsx:8      [TW-02-B]  warning  @apply used in component file — use utility classes directly
src/pages/Home.tsx:34          [TW-03-A]  warning  Inline media query found — use Tailwind breakpoint prefix instead
src/pages/Home.tsx:67          [TW-06-A]  warning  Font family "Arial" detected — replace with a characterful alternative
src/components/Modal.tsx:22    [TW-10-C]  error    Icon-only button missing aria-label or sr-only text
src/styles/globals.css:5       [TW-09-B]  warning  Custom @keyframes in CSS file — move to tailwind.config
```

After listing all findings, provide a **Summary** section:

```
## Summary
Files reviewed: X
Total issues: N (E errors, W warnings, I info)

Top issues to fix:
1. [most critical issue]
2. [second most critical]
3. [third most critical]
```

---

## Cross-Platform Design Rules — Desktop & Mobile with Tailwind CSS

These rules apply to every component and page that must work correctly on **both desktop (≥1024px) and mobile (<768px)**. A component is considered cross-platform compliant only when it passes all rules below without layout breakage, readability issues, or interaction failures at any viewport width.

The goal is **one codebase, two equally polished experiences** — not a degraded mobile fallback of a desktop design, nor a blown-up mobile layout on desktop.

---

### XP-01 — Responsive Breakpoint Strategy

| Rule    | Check                                                                                                                                                  |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| XP-01-A | Mobile-first: base classes define the mobile layout; `md:` and `lg:` override for larger screens                                                       |
| XP-01-B | No single-breakpoint-only components: every component tested at `<640px`, `768px`, `1024px`, `1280px`                                                  |
| XP-01-C | Breakpoint reference used consistently: `sm` (640px) tablet-portrait, `md` (768px) tablet-landscape, `lg` (1024px) desktop, `xl` (1280px) wide desktop |
| XP-01-D | Container max-width capped: `max-w-screen-xl mx-auto` or `max-w-7xl mx-auto` — content never stretches full-width on ultrawide screens                 |
| XP-01-E | No hardcoded `width: 375px` or `width: 1440px` — use percentage, `w-full`, or `max-w-*`                                                                |

### XP-02 — Layout Adaptation

| Rule    | Check                                                                                                                  |
| ------- | ---------------------------------------------------------------------------------------------------------------------- |
| XP-02-A | Single-column on mobile → multi-column on desktop: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`                    |
| XP-02-B | Sidebar pattern: hidden on mobile (offcanvas/drawer), visible as fixed column on desktop: `hidden lg:flex lg:w-64`     |
| XP-02-C | Bottom navigation (mobile) ↔ top/side navigation (desktop): `lg:hidden` on bottom nav, `hidden lg:flex` on desktop nav |
| XP-02-D | Full-bleed sections on mobile (`-mx-4`) become contained (`max-w-*`) on desktop                                        |
| XP-02-E | Stacked CTAs on mobile (`flex flex-col gap-3`) → inline on desktop (`md:flex-row`)                                     |
| XP-02-F | Hero sections: full-viewport-height on desktop (`lg:min-h-screen`), auto-height on mobile                              |
| XP-02-G | Tables: horizontal scroll container on mobile (`overflow-x-auto`), full display on desktop                             |

### XP-03 — Typography Scaling

| Rule    | Check                                                                                                                       |
| ------- | --------------------------------------------------------------------------------------------------------------------------- |
| XP-03-A | Display headings scale up on desktop: `text-3xl md:text-4xl lg:text-6xl` — not fixed at mobile size                         |
| XP-03-B | Body text consistent at `text-base` (16px) on both platforms — not reduced on mobile                                        |
| XP-03-C | Line length capped on desktop: `max-w-prose` or `max-w-2xl` on paragraph containers to prevent lines >75 chars              |
| XP-03-D | Font size never changes via JS or media queries outside Tailwind — all scaling through responsive classes                   |
| XP-03-E | `text-balance` on headings (`text-balance` arbitrary or plugin) to prevent awkward single-word last lines on both viewports |

### XP-04 — Spacing Adaptation

| Rule    | Check                                                                                       |
| ------- | ------------------------------------------------------------------------------------------- |
| XP-04-A | Section padding scales: `py-10 md:py-16 lg:py-24` — not fixed at one size                   |
| XP-04-B | Content gutters scale: `px-4 md:px-6 lg:px-8` — tighter on mobile, more generous on desktop |
| XP-04-C | Card grids gap scales: `gap-3 md:gap-4 lg:gap-6`                                            |
| XP-04-D | No negative margins (`-mx-*`, `-my-*`) without a corresponding reset at a larger breakpoint |

### XP-05 — Navigation Patterns

| Rule    | Check                                                                                                                                              |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| XP-05-A | Mobile: hamburger menu or bottom tabs. Desktop: horizontal nav bar or sidebar — both present in the same component with correct visibility classes |
| XP-05-B | Mobile menu overlay uses `fixed inset-0 z-50` — does not push/shift page content                                                                   |
| XP-05-C | Desktop nav links have `hover:` and `focus-visible:` styles; mobile nav items have `active:` and adequate touch targets                            |
| XP-05-D | Dropdown menus: hover-triggered on desktop (`group-hover:`), tap-triggered on mobile (JS toggle + `aria-expanded`)                                 |
| XP-05-E | Skip-to-content link present (`sr-only focus:not-sr-only`) for keyboard and screen reader users on both platforms                                  |

### XP-06 — Interactive Components

| Rule    | Check                                                                                                                                              |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| XP-06-A | Buttons: `hover:` styles on desktop; `active:scale-[0.97]` press feedback on mobile — both applied simultaneously (not mutually exclusive)         |
| XP-06-B | Modals: centered dialog on desktop (`max-w-lg mx-auto`); bottom sheet on mobile (`fixed bottom-0 rounded-t-3xl w-full`) — use breakpoint to switch |
| XP-06-C | Tooltips: `hover:` triggered on desktop; `focus:` / long-press alternative on mobile                                                               |
| XP-06-D | Drag interactions: mouse drag on desktop + touch drag on mobile — use pointer events (`onPointerDown`) not mouse-only events                       |
| XP-06-E | Hover cards / popovers hidden on mobile (`:hover` doesn't exist on touch) — replaced with tap-to-expand or inline disclosure                       |
| XP-06-F | Custom scrollbars styled only on desktop (`md:[&::-webkit-scrollbar]:w-2`) — mobile uses native scrollbar                                          |

### XP-07 — Images & Media

| Rule    | Check                                                                                                                       |
| ------- | --------------------------------------------------------------------------------------------------------------------------- |
| XP-07-A | `<img>` uses `sizes` attribute with responsive values: `sizes="(max-width: 768px) 100vw, 50vw"`                             |
| XP-07-B | Hero images: `aspect-[16/9] md:aspect-auto md:h-screen object-cover` — short on mobile, full on desktop                     |
| XP-07-C | Avatars and thumbnails scale: `w-10 h-10 md:w-12 md:h-12`                                                                   |
| XP-07-D | Decorative blobs/gradients sized relatively: `w-64 h-64 md:w-96 md:h-96` — not fixed at large sizes that overflow on mobile |
| XP-07-E | `loading="lazy"` on all below-fold images on both platforms                                                                 |

### XP-08 — Forms

| Rule    | Check                                                                                                  |
| ------- | ------------------------------------------------------------------------------------------------------ |
| XP-08-A | Single-column form on mobile; optional two-column layout on desktop: `grid grid-cols-1 md:grid-cols-2` |
| XP-08-B | Input widths: `w-full` on mobile; can be constrained `max-w-sm` on desktop in multi-column layouts     |
| XP-08-C | Submit button: `w-full` on mobile → `w-auto min-w-[160px]` on desktop (`md:w-auto`)                    |
| XP-08-D | `inputmode` attributes present for correct mobile keyboard — irrelevant but harmless on desktop        |
| XP-08-E | Label-input association via `for`/`id` — required on both platforms for accessibility                  |

### XP-09 — Shadows, Borders & Depth

| Rule    | Check                                                                                                                   |
| ------- | ----------------------------------------------------------------------------------------------------------------------- |
| XP-09-A | Cards on mobile use `shadow-sm` or `shadow-md`; on desktop can use `shadow-lg` or `shadow-xl` (`md:shadow-xl`)          |
| XP-09-B | Hover shadow elevation on desktop only: `md:hover:shadow-2xl md:hover:-translate-y-1 transition-all`                    |
| XP-09-C | Border-based separation preferred on mobile (less GPU paint); shadow-based on desktop `border md:border-0 md:shadow-md` |
| XP-09-D | `backdrop-blur-*` only where GPU budget allows: test on mid-range mobile device before applying                         |

### XP-10 — Animations & Motion

| Rule    | Check                                                                                                                                                                    |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| XP-10-A | Page-load animations play on both platforms — not gated to desktop only                                                                                                  |
| XP-10-B | Hover animations (`group-hover:`, `hover:`) automatically inactive on touch devices — no explicit disable needed, but don't rely on them as the sole feedback mechanism  |
| XP-10-C | Scroll-triggered animations work on both via `IntersectionObserver` — no `scroll` event listeners that don't fire on momentum scroll (iOS)                               |
| XP-10-D | Animation duration appropriate: `duration-200` to `duration-300` for interactions, `duration-500` to `duration-700` for page transitions — same values on both platforms |
| XP-10-E | `motion-safe:` variant wraps all non-essential animations — respects user preference on both OS                                                                          |

---

## Cross-Platform Component Patterns

Ready-to-use Tailwind patterns that work on both desktop and mobile without modification.

### Responsive Navigation (Hamburger → Horizontal)

```html
<nav
  class="sticky top-0 z-40 border-b border-zinc-100 bg-white/90 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90"
>
  <div class="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
    <div class="flex h-14 items-center justify-between md:h-16">
      <!-- Logo -->
      <a href="/" class="text-lg font-bold text-zinc-900 transition-opacity hover:opacity-80 dark:text-zinc-50">
        Brand
      </a>

      <!-- Desktop links (hidden on mobile) -->
      <div class="hidden items-center gap-6 md:flex">
        <a
          href="#"
          class="rounded text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          Link
        </a>
      </div>

      <!-- Desktop CTA (hidden on mobile) -->
      <div class="hidden items-center gap-3 md:flex">
        <button
          class="h-9 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition-all hover:bg-zinc-700 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-95 dark:bg-zinc-50 dark:text-zinc-900"
        >
          Get Started
        </button>
      </div>

      <!-- Mobile hamburger (hidden on desktop) -->
      <button
        class="flex h-10 w-10 items-center justify-center rounded-lg transition-all hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:outline-none active:scale-95 md:hidden dark:hover:bg-zinc-800"
        aria-label="Open menu"
        aria-expanded="false"
      >
        <!-- icon -->
      </button>
    </div>
  </div>
</nav>
```

### Responsive Hero Section

```html
<section class="relative overflow-hidden px-4 py-16 md:px-6 md:py-24 lg:px-8 lg:py-32">
  <div class="mx-auto max-w-7xl">
    <div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
      <!-- Text column -->
      <div class="text-center lg:text-left">
        <h1
          class="text-4xl leading-none font-black tracking-tight text-balance text-zinc-900 md:text-5xl lg:text-6xl xl:text-7xl dark:text-zinc-50"
        >
          Headline Text
        </h1>
        <p class="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-600 md:text-xl lg:mx-0 dark:text-zinc-400">
          Supporting copy goes here.
        </p>
        <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
          <button
            class="h-12 rounded-xl bg-zinc-900 px-6 text-base font-semibold text-white transition-all duration-150 hover:bg-zinc-700 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.97] md:h-13 md:rounded-2xl dark:bg-zinc-50 dark:text-zinc-900"
          >
            Primary CTA
          </button>
          <button
            class="h-12 rounded-xl border-2 border-zinc-200 px-6 text-base font-semibold text-zinc-900 transition-all duration-150 hover:border-zinc-400 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.97] md:h-13 md:rounded-2xl dark:border-zinc-700 dark:text-zinc-50"
          >
            Secondary CTA
          </button>
        </div>
      </div>

      <!-- Visual column -->
      <div
        class="relative aspect-square w-full overflow-hidden rounded-3xl bg-zinc-100 md:aspect-[4/3] lg:aspect-square dark:bg-zinc-800"
      >
        <img src="..." alt="Hero visual" class="h-full w-full object-cover" loading="eager" />
      </div>
    </div>
  </div>
</section>
```

### Responsive Card Grid

```html
<!-- 1 col mobile → 2 col tablet → 3 col desktop → 4 col wide -->
<div
  class="mx-auto grid max-w-7xl grid-cols-1 gap-3 px-4 sm:grid-cols-2 md:gap-4 md:px-6 lg:grid-cols-3 lg:gap-6 lg:px-8 xl:grid-cols-4"
>
  <!-- Card -->
  <article
    class="group overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm transition-all duration-300 md:hover:-translate-y-1 md:hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
  >
    <!-- Image -->
    <div class="aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
      <img
        src="..."
        alt=""
        class="h-full w-full object-cover transition-transform duration-500 md:group-hover:scale-105"
        loading="lazy"
      />
    </div>
    <!-- Content -->
    <div class="p-4 md:p-5">
      <span class="text-xs font-semibold tracking-wider text-indigo-600 uppercase dark:text-indigo-400">
        Category
      </span>
      <h3 class="mt-1.5 line-clamp-2 text-base leading-snug font-semibold text-zinc-900 md:text-lg dark:text-zinc-50">
        Card Title
      </h3>
      <p class="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">Card description text.</p>
    </div>
  </article>
</div>
```

### Responsive Modal (Bottom Sheet → Centered Dialog)

```html
<!-- Overlay -->
<div class="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm md:items-center md:p-4">
  <!-- Panel: bottom sheet on mobile, centered dialog on desktop -->
  <div
    class="max-h-[90dvh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl md:max-w-lg md:rounded-3xl dark:bg-zinc-900"
  >
    <!-- Drag handle (mobile only) -->
    <div class="flex justify-center pt-3 pb-1 md:hidden">
      <div class="h-1.5 w-10 rounded-full bg-zinc-300 dark:bg-zinc-600"></div>
    </div>

    <!-- Header -->
    <div class="flex items-center justify-between px-5 pt-4 pb-3 md:pt-5">
      <h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Modal Title</h2>
      <button
        class="flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition-all hover:bg-zinc-100 active:scale-95 dark:hover:bg-zinc-800"
        aria-label="Close"
      >
        ✕
      </button>
    </div>

    <!-- Body -->
    <div class="px-5 pb-5 text-sm leading-relaxed text-zinc-600 md:pb-6 dark:text-zinc-400">
      Modal content goes here.
    </div>

    <!-- Footer -->
    <div
      class="pb-safe flex flex-col gap-3 border-t border-zinc-100 px-5 pt-4 pb-5 sm:flex-row md:pb-6 dark:border-zinc-800"
    >
      <button
        class="h-11 w-full rounded-xl bg-zinc-900 text-sm font-semibold text-white transition-all hover:bg-zinc-700 active:scale-[0.97] sm:w-auto sm:flex-1 dark:bg-zinc-50 dark:text-zinc-900"
      >
        Confirm
      </button>
      <button
        class="h-11 w-full rounded-xl border border-zinc-200 text-sm font-medium text-zinc-700 transition-all hover:bg-zinc-50 active:scale-[0.97] sm:w-auto sm:flex-1 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
      >
        Cancel
      </button>
    </div>
  </div>
</div>
```

### Responsive Sidebar Layout

```html
<div class="flex min-h-screen">
  <!-- Sidebar: drawer on mobile, fixed column on desktop -->
  <aside
    id="sidebar"
    class="fixed inset-y-0 left-0 z-50 w-72 -translate-x-full transform overflow-y-auto border-r border-zinc-100 bg-white transition-transform duration-300 ease-out lg:relative lg:flex lg:translate-x-0 lg:flex-col dark:border-zinc-800 dark:bg-zinc-900"
  >
    <!-- Sidebar content -->
  </aside>

  <!-- Overlay (mobile only) -->
  <div id="sidebar-overlay" class="fixed inset-0 z-40 hidden bg-black/50 lg:hidden" aria-hidden="true"></div>

  <!-- Main content -->
  <div class="flex min-w-0 flex-1 flex-col px-4 py-6 md:px-6 lg:px-8">
    <!-- Page content -->
  </div>
</div>
```

### Responsive Data Table

```html
<!-- Mobile: horizontal scroll. Desktop: full table -->
<div class="w-full overflow-x-auto rounded-2xl border border-zinc-100 dark:border-zinc-800">
  <table class="min-w-full divide-y divide-zinc-100 dark:divide-zinc-800">
    <thead class="bg-zinc-50 dark:bg-zinc-900/50">
      <tr>
        <th
          class="px-4 py-3 text-left text-xs font-semibold tracking-wider whitespace-nowrap text-zinc-500 uppercase md:px-6 dark:text-zinc-400"
        >
          Column
        </th>
      </tr>
    </thead>
    <tbody class="divide-y divide-zinc-50 bg-white dark:divide-zinc-800/50 dark:bg-zinc-900">
      <tr class="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
        <td class="px-4 py-3 text-sm whitespace-nowrap text-zinc-900 md:px-6 md:py-4 dark:text-zinc-100">Cell data</td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## Cross-Platform Audit Checklist

When reviewing any component for cross-platform compliance, verify:

```
[ ] Renders correctly at 375px (iPhone SE), 390px (iPhone 14), 768px (iPad), 1280px (laptop), 1920px (desktop)
[ ] No horizontal overflow at any width (use browser DevTools device emulation)
[ ] Touch targets ≥ 44×44px on mobile elements
[ ] Hover interactions have tap/press equivalents on mobile
[ ] Navigation adapts: hamburger/bottom-nav on mobile ↔ full nav on desktop
[ ] Modals adapt: bottom sheet on mobile ↔ centered dialog on desktop
[ ] Typography scales up on desktop (not fixed at mobile size)
[ ] Spacing scales up on desktop (sections breathe more on larger screens)
[ ] Images use correct aspect ratios and object-fit at each breakpoint
[ ] Dark mode works on both platforms
[ ] Content max-width is capped (no 2000px-wide text lines on ultrawide)
[ ] Forms: single-column mobile, optional multi-column desktop
[ ] Animations use pointer-events-aware variants (hover: inactive on touch)
[ ] `motion-safe:` wraps all non-essential animations
```

If the user asks to "fix" or "auto-fix" the issues (not just review), apply corrections directly:

- Replace raw CSS with equivalent Tailwind classes
- Add missing `hover:` / `focus-visible:` / `active:` states
- Add `sr-only` spans to icon-only buttons
- Replace `@apply` with inline utility classes
- Move custom keyframes to `tailwind.config`
- Add `motion-safe:` wrapper to animations

When auto-fixing, show a diff-style summary of changes made per file.

---

## Usage

When a user provides a file or pattern argument:

1. Fetch base guidelines from the source URL above.
2. Read the specified files.
3. Apply all base rules from the fetched guidelines.
4. Apply all Tailwind CSS rules (TW-01 through TW-11) from this file.
5. Output findings grouped by category using the format above.
6. Provide the Summary section.
7. Ask if the user wants to enter Auto-Fix Mode.

If no files are specified, ask the user which files or glob pattern to review.
