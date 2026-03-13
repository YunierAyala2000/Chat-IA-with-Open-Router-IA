---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality using Tailwind CSS. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples include websites, landing pages, dashboards, React components, HTML/CSS layouts, or when styling/beautifying any web UI). Generates creative, polished code and UI design that avoids generic AI aesthetics. Always uses Tailwind CSS utility classes as the primary styling method.
license: Complete terms in LICENSE.txt
---

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. **Always implement real working code using Tailwind CSS as the primary styling framework**, with exceptional attention to aesthetic details and creative choices.

The user provides frontend requirements: a component, page, application, or interface to build. They may include context about the purpose, audience, or technical constraints.

---

## Mandatory: Tailwind CSS Usage

**ALWAYS style with Tailwind CSS utility classes.** Never write raw CSS unless strictly unavoidable (e.g., a custom animation keyframe or a CSS variable that Tailwind cannot express). Follow these rules without exception:

### Setup

- For plain HTML: include the Tailwind CDN script — `<script src="https://cdn.tailwindcss.com"></script>` — and extend the theme inline via `tailwind.config` when needed.
- For React/Next.js/Vue: assume Tailwind is already installed and configured. Import nothing extra; use utility classes directly.
- For custom design tokens (colors, fonts, spacing), extend `tailwind.config` under `theme.extend` rather than writing custom CSS.

### Class Usage Rules

1. **Use utility classes for everything**: layout (`flex`, `grid`, `gap-*`), spacing (`p-*`, `m-*`), typography (`text-*`, `font-*`, `tracking-*`, `leading-*`), colors (`bg-*`, `text-*`, `border-*`), effects (`shadow-*`, `ring-*`, `backdrop-blur-*`), and transitions (`transition-*`, `duration-*`, `ease-*`).
2. **Responsive design**: use breakpoint prefixes (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) for all responsive behavior — never inline media queries in CSS.
3. **Dark mode**: use the `dark:` variant for dark-mode styles when a dark theme is required.
4. **State variants**: use `hover:`, `focus:`, `active:`, `focus-visible:`, `group-hover:`, `peer-*` for interactive states.
5. **Animations**: use built-in Tailwind animations (`animate-spin`, `animate-pulse`, `animate-bounce`, `animate-fade-in`) and extend with `@keyframes` inside `tailwind.config` for custom animations. Apply staggered delays with `[animation-delay:Xms]` arbitrary values.
6. **Arbitrary values**: use bracket notation (`w-[742px]`, `bg-[#1a1a2e]`, `grid-cols-[1fr_2fr]`) only when a design-specific value is not in the default scale.
7. **Do NOT use `@apply`** in components or pages — it defeats the purpose of utility-first styling and reduces readability for AI-assisted code.

### Tailwind-Specific Design Patterns

- **Gradient backgrounds**: `bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900` — compose gradients entirely with Tailwind.
- **Glass morphism**: `backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl`.
- **Cards with depth**: `shadow-2xl ring-1 ring-black/5 rounded-3xl`.
- **Decorative blobs**: use absolutely positioned `div` elements with `rounded-full blur-3xl opacity-30 bg-*` classes.
- **Custom scrollbar**: extend via `tailwind-scrollbar` plugin or use `[&::-webkit-scrollbar]:w-2` arbitrary selectors.

---

## Design Thinking

Before writing a single line of code, reason through the following and commit to a **BOLD aesthetic direction**:

1. **Purpose** — What problem does this interface solve? Who uses it? What emotional response should it trigger?
2. **Tone** — Pick ONE extreme and own it fully:
   - Brutally minimal · Maximalist chaos · Retro-futuristic · Organic/natural
   - Luxury/refined · Playful/toy-like · Editorial/magazine · Brutalist/raw
   - Art deco/geometric · Soft/pastel · Industrial/utilitarian · Cyberpunk/neon
   - Glassmorphism · Neumorphism · Claymorphism · Bento grid
3. **Constraints** — Framework (React, Vue, plain HTML), accessibility requirements (ARIA labels, contrast ratios), performance targets.
4. **The one unforgettable thing** — Identify the single visual or interactive detail that will make this interface memorable. Build everything else to support it.

**CRITICAL RULE**: Commit to the direction before coding. Do not hedge between styles. Bold maximalism and refined minimalism both work — intentionality is everything.

### Implementation checklist before delivering code

- [ ] Tailwind CDN or config is present and correct.
- [ ] All styles use Tailwind classes (zero raw CSS blocks in `<style>` tags unless absolutely necessary).
- [ ] Responsive breakpoints are applied (`sm:`, `md:`, `lg:`).
- [ ] At least one entrance animation or transition is present.
- [ ] Color palette is defined in `tailwind.config` `theme.extend.colors` if custom.
- [ ] Custom fonts are loaded (Google Fonts `@import` in a `<style>` tag is acceptable) and applied via `font-['FontName']` arbitrary class or `tailwind.config`.
- [ ] Interactive states (`hover:`, `focus:`, `active:`) are applied to all clickable elements.
- [ ] Dark/light theme is handled if requested.

---

## Frontend Aesthetics Guidelines

### Typography

- **Load from Google Fonts** — never use system fonts (Arial, Helvetica, system-ui) or overused defaults (Inter, Roboto).
- **Pair two fonts**: a distinctive display/heading font + a refined body font. Examples of characterful pairings:
  - _Playfair Display_ + _DM Sans_ (editorial luxury)
  - _Bebas Neue_ + _Lato_ (bold industrial)
  - _Fraunces_ + _Nunito_ (organic warm)
  - _Syne_ + _Epilogue_ (contemporary geometric)
  - _Cormorant Garamond_ + _Jost_ (refined minimal)
- Apply with Tailwind: `font-['Playfair_Display']` (arbitrary class) or register in `tailwind.config theme.extend.fontFamily`.
- Use `tracking-tight`, `tracking-widest`, `leading-none`, `leading-relaxed` intentionally to reinforce the typographic mood.

### Color & Theme

- Define a palette of 4–6 custom tokens in `tailwind.config theme.extend.colors`.
- Use one dominant background color, one or two primary content colors, and one sharp accent.
- Avoid clichéd combos: no purple gradient on white (#7c3aed / white), no teal on dark gray without strong justification.
- Example palette approach for a dark luxury theme:
  ```js
  colors: {
    brand: {
      bg:      '#0d0d0d',
      surface: '#1a1a1a',
      border:  '#2e2e2e',
      text:    '#f0ece4',
      accent:  '#c8a96e',
    }
  }
  ```

### Motion & Interactions

- Add at least one **page-load entrance animation** using `@keyframes` in `tailwind.config` + `animate-*` classes with staggered `[animation-delay:Xms]` arbitrary values.
- Use `transition-all duration-300 ease-out` (or similar) on every interactive element.
- Hover states should be surprising and satisfying — not just opacity changes. Consider: scale (`hover:scale-105`), translate (`hover:-translate-y-1`), color swap, underline reveal, border glow (`hover:ring-2 hover:ring-accent`).
- Scroll-triggered reveals: use `IntersectionObserver` in JS to toggle a Tailwind class like `opacity-0 translate-y-6` → `opacity-100 translate-y-0 transition-all duration-700`.

### Spatial Composition

- Break the grid intentionally: overlap elements with `absolute`/`relative` positioning + negative margins or `z-*` layers.
- Use asymmetry: `grid-cols-[1fr_2fr]` or `grid-cols-[3fr_1fr]` instead of always `grid-cols-2`.
- Diagonal flow: clip-path with `[clip-path:'polygon(0_0,100%_0,100%_85%,0_100%)']` for section dividers.
- Generous whitespace OR controlled density — never the ambiguous middle ground.

### Backgrounds & Visual Depth

- Never use a plain solid color as the only background treatment.
- **Go-to Tailwind techniques**:
  - Gradient mesh: multiple blurred `div` blobs (`rounded-full blur-3xl opacity-20`) in a `relative overflow-hidden` container.
  - Noise texture: add a `<canvas>` or SVG filter for grain — apply via `mix-blend-overlay opacity-10`.
  - Geometric pattern: use `bg-[url("data:image/svg+xml,...")]` with a repeating SVG pattern.
  - Layered borders: `ring-1 ring-white/10 border border-white/5` for subtle depth.
  - Dramatic shadows: `shadow-[0_32px_64px_rgba(0,0,0,0.5)]` with arbitrary values.

---

## Absolute Prohibitions

- **NEVER** write inline `style=""` attributes for anything Tailwind can express.
- **NEVER** use generic font stacks: Arial, Helvetica, system-ui, Roboto, Inter (unless the user explicitly asks).
- **NEVER** use purple-gradient-on-white as a default color scheme.
- **NEVER** produce cookie-cutter layouts: centered card on white background, standard nav + hero + features grid without a strong twist.
- **NEVER** omit interactive states — every button, link, and card must have `hover:` and `focus:` styles.
- **NEVER** generate two designs that feel the same. Vary theme, font pairing, layout structure, and color palette every time.
- **NEVER** use `@apply` in component or page files.

---

Interpret every request creatively. Make unexpected choices that feel genuinely designed for the specific context. The output must look like it was crafted by a skilled human designer who deeply understands both Tailwind CSS and visual design — not generated by a template.
