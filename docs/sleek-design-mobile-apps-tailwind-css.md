---
name: sleek-design-mobile-apps-tailwind
description: Use when the user wants to design a mobile app, create screens, build UI, or interact with their Sleek projects. Covers high-level requests ("design an app that does X") and specific ones ("list my projects", "create a new project", "screenshot that screen"). Always applies Tailwind CSS design language, spacing scale, and utility-class conventions when describing and generating mobile interfaces.
compatibility: Requires SLEEK_API_KEY environment variable. Network access limited to https://sleek.design only.
metadata:
  requires-env: SLEEK_API_KEY
  allowed-hosts: https://sleek.design
---

# Designing with Sleek + Tailwind CSS Design Language

[![Design mobile apps in minutes](https://raw.githubusercontent.com/sleekdotdesign/agent-skills/main/assets/hero.png)](https://sleek.design)

## Overview

[sleek.design](https://sleek.design) is an AI-powered mobile app design tool. You interact with it via a REST API at `/api/v1/*` to create projects, describe what you want built in plain language, and get back rendered screens. All communication is standard HTTP with bearer token auth.

**Base URL**: `https://sleek.design`
**Auth**: `Authorization: Bearer $SLEEK_API_KEY` on every `/api/v1/*` request
**Content-Type**: `application/json` (requests and responses)
**CORS**: Enabled on all `/api/v1/*` endpoints

---

## Mandatory: Tailwind CSS Design Language for Mobile

When composing `message.text` descriptions sent to Sleek, **always describe the interface using Tailwind CSS design vocabulary and principles**. This ensures consistency, precision, and high design quality in the generated screens. The descriptions you write are design specifications — treat them as such.

### Why Tailwind vocabulary matters

Sleek's AI interprets natural language. Using precise Tailwind-inspired terms (spacing scale, color tokens, layout primitives) produces better, more consistent results than vague descriptions like "make it look nice".

---

## Mobile Design Thinking — Do this BEFORE sending any message to Sleek

Before crafting a `message.text`, reason through the following:

### 1. Commit to an aesthetic direction

Pick ONE style and own it fully. Do not mix aesthetics arbitrarily:

| Style               | Description                                                                  |
| ------------------- | ---------------------------------------------------------------------------- |
| **Clean minimal**   | White/neutral bg, generous padding, subtle shadows, one accent color         |
| **Dark luxury**     | Deep bg (`slate-950`, `zinc-900`), gold/amber accent, refined typography     |
| **Vibrant playful** | Saturated colors, rounded corners (`rounded-3xl`), bold display font         |
| **Glassmorphism**   | Frosted panels, transparent overlays, blur effects, light borders            |
| **Neumorphism**     | Soft embossed surfaces, low-contrast shadows, monochromatic palette          |
| **Brutalist**       | Raw black/white, stark borders, bold compressed type, no decorative elements |
| **Gradient mesh**   | Multi-color gradient background, floating color blobs, neon accents          |
| **Editorial**       | Strong typographic hierarchy, large headlines, photo-driven layouts          |

### 2. Define the screen anatomy

Every mobile screen has these zones — describe all that apply:

- **Status bar area** — inset-safe, non-interactive (24px / `h-6`)
- **Navigation bar / header** — back button, title, actions (48–56px / `h-12` to `h-14`)
- **Content area** — scrollable body, padding `px-4` to `px-6` (`16–24px`)
- **Bottom navigation / tab bar** — persistent, safe-area aware (`pb-safe` / `pb-8`)
- **Floating action button (FAB)** — `fixed bottom-6 right-6`, `rounded-full`, `shadow-xl`

### 3. Choose a type scale

Specify the font pairing and scale:

```
Display / Hero:   32–48px, font-weight 700–900, tracking-tight
Section titles:   20–24px, font-weight 600–700
Body text:        14–16px, font-weight 400–500, leading-relaxed
Caption / meta:   11–13px, font-weight 400, text-muted
```

**Never describe fonts as "Arial", "Roboto", or "system font".** Always specify a characterful pairing. Examples:

- _Sora + DM Sans_ — modern, clean app feel
- _Clash Display + Satoshi_ — contemporary geometric
- _Cabinet Grotesk + Manrope_ — friendly rounded
- _Playfair Display + Lato_ — editorial luxury
- _Space Mono + Inter_ — developer/tech utilitarian

### 4. Establish the color palette (Tailwind tokens)

Describe colors using Tailwind scale names so the design stays cohesive:

```
Background:    zinc-950 / slate-900 / stone-50 / white
Surface/card:  zinc-900 / white / zinc-50
Border:        zinc-800 / zinc-200 / white/10
Primary text:  zinc-100 / zinc-900
Secondary text:zinc-400 / zinc-500
Accent:        violet-500 / amber-400 / emerald-400 / rose-500
Destructive:   red-500
Success:       emerald-500
```

---

## Tailwind-Inspired Design Patterns for Mobile

Use these patterns in your `message.text` descriptions. Reference them by name and describe the exact visual result you want.

### Layout & Spacing

- Use **4px base grid** — all spacing in multiples of 4. Describe as: "16px padding on sides", "24px between sections", "8px gap between items".
- **Full-bleed sections**: no horizontal padding on the container, image/color extends edge to edge.
- **Content gutters**: `px-4` (16px) for compact, `px-6` (24px) for comfortable, `px-8` (32px) for airy.
- **Card padding**: `p-4` (16px) standard, `p-6` (24px) generous.
- **Stack gap**: `gap-3` (12px) tight list, `gap-4` (16px) standard, `gap-6` (24px) breathable.

### Cards & Surfaces

- **Default card**: white bg, `rounded-2xl` (16px), `shadow-sm`, `border border-zinc-100`
- **Elevated card**: `rounded-3xl` (24px), `shadow-xl`, no border
- **Glass card**: `bg-white/10`, `backdrop-blur-md`, `border border-white/20`, `rounded-2xl`
- **Dark surface card**: `bg-zinc-900`, `rounded-2xl`, `border border-zinc-800`
- **Gradient card**: diagonal gradient from one color to another, `rounded-2xl`, white text

### Buttons

- **Primary CTA**: full-width, `rounded-2xl` or `rounded-full`, height 52px (`h-13`), accent bg, semibold label
- **Secondary**: outline style, `border-2`, accent color border and text, same shape as primary
- **Icon button**: 44×44px minimum touch target (`min-h-11 min-w-11`), `rounded-xl` or `rounded-full`
- **Destructive**: `bg-red-500`, white label
- **Ghost/text**: no bg, no border, accent-colored label, underline on press

> **Touch target rule**: No interactive element smaller than 44×44px. Always mention this in descriptions.

### Lists & Feeds

- **Row item**: `h-16` (64px) standard, `px-4`, left icon + title + meta + right chevron
- **Media row**: thumbnail `w-12 h-12` `rounded-xl`, title + subtitle stacked, `gap-3`
- **Card feed**: vertical stack, `gap-4`, each card `rounded-2xl`
- **Grid feed**: `grid-cols-2`, `gap-3`, square cards `aspect-square rounded-xl`
- **Horizontal scroll**: single row, `gap-3`, card `w-64` fixed width, peek next card

### Forms & Inputs

- **Text input**: `h-12` (48px), `rounded-xl`, `border border-zinc-200`, `px-4`, placeholder in zinc-400
- **Floating label input**: label animates up on focus, no border-bottom style (full border)
- **Search bar**: `rounded-full`, search icon left, `bg-zinc-100` or `bg-zinc-900/50`, `h-11`
- **Toggle / switch**: 52×32px, smooth animated track, accent color on active
- **Checkbox**: 20×20px, `rounded-md`, accent fill on checked
- **Select / dropdown**: same height as input, chevron icon right

### Navigation Patterns

- **Bottom tab bar**: 5 tabs max, icon + label, active tab accent color, `h-16` + safe area, `bg-white/90 backdrop-blur-md` or solid surface
- **Top navigation**: `h-14`, back arrow left, centered title (semibold 17px), optional action icons right
- **Floating tab bar**: `rounded-full`, `shadow-2xl`, `mx-4 mb-6`, glassmorphic or solid
- **Side drawer**: slides from left, `w-72` (288px), full height, dark overlay behind
- **Modal bottom sheet**: slides up from bottom, `rounded-t-3xl`, drag handle `w-10 h-1 bg-zinc-300 rounded-full mx-auto mt-3`

### Visual Details & Decoration

- **Section divider**: full-width `h-px bg-zinc-100` or `bg-zinc-800`
- **Badge / chip**: `h-6 px-2.5`, `rounded-full`, `text-xs font-medium`
- **Status indicator dot**: `w-2 h-2 rounded-full bg-emerald-400`
- **Avatar**: `rounded-full`, sizes: `w-8 h-8` small, `w-10 h-10` standard, `w-16 h-16` profile
- **Skeleton loader**: `bg-zinc-200 animate-pulse rounded-xl` matching the shape of real content
- **Empty state**: centered illustration/icon, heading, description text, optional CTA button
- **Hero gradient overlay**: `bg-gradient-to-b from-transparent to-black/70` over image

### Animations & Micro-interactions

Describe these explicitly in the `message.text` to request them from Sleek:

- **Page enter**: cards fade + slide up with staggered delay (each 50ms later)
- **Button press**: scale down to 96% on press, spring back on release
- **Tab switch**: content slides in from direction of the selected tab
- **Pull to refresh**: spinner at top, content drops down on trigger
- **Swipe to delete**: item slides left revealing red delete action
- **Scroll header**: header condenses/blurs as user scrolls down

---

## Composing High-Quality Sleek Messages

When you write `message.text`, follow this structure to get the best results:

### Template

```
Screen: [screen name]
Style: [aesthetic direction, font pairing, color palette tokens]
Layout: [describe zones, spacing values, grid structure]
Components: [list each UI element with Tailwind-inspired specs]
Colors: [background, surface, text, accent using Tailwind token names]
Typography: [font names, sizes in px, weights]
Special details: [animations, shadows, gradients, textures]
```

### Example — Fitness App Home Screen

```
Screen: Home Dashboard
Style: Dark luxury. Font pairing: Cabinet Grotesk (headings) + Manrope (body).
Background: zinc-950. Surface cards: zinc-900 with zinc-800 border.
Accent: emerald-400 for active/progress elements.

Layout: Safe-area top padding. Header row with avatar (w-10 h-10 rounded-full)
left, "Good morning, Alex" greeting center-aligned, notification bell icon right.
Content padding px-5. Sections gap-6.

Components:
- Hero progress ring card: rounded-3xl bg-zinc-900 p-6. Large circular progress
  indicator (emerald-400 stroke, 120px diameter). "2,450 steps" in 32px bold
  emerald-400, "of 10,000 daily goal" in 13px zinc-400 below.
- Stats row: 3 cards in a grid-cols-3 gap-3. Each card rounded-2xl bg-zinc-900
  p-4. Icon top, value in 20px bold zinc-100, label in 12px zinc-500.
- Recent workouts section: title "Recent" in 18px semibold zinc-100.
  Vertical stack gap-3. Each row: h-16 flex items-center gap-4.
  Left square thumbnail 48x48 rounded-xl bg-gradient. Title + duration stacked.
  Right: chevron in zinc-600.
- Bottom tab bar: floating rounded-full mx-4 mb-8 bg-zinc-900/90 backdrop-blur-md
  shadow-2xl. 4 tabs: Home (active, emerald-400), Workouts, Stats, Profile.

Special: Cards slide up with staggered fade-in on load. Active tab icon pulses
gently. Progress ring animates from 0 to value on screen enter.
```

### Example — E-commerce Product Screen

```
Screen: Product Detail
Style: Clean minimal with editorial feel. Font: Cormorant Garamond (product name,
large 40px) + Jost (body, meta). Background: stone-50. Accent: amber-600.

Layout: Full-bleed hero image top (aspect-[3/4]). Content sheet overlaps image
bottom, rounded-t-3xl bg-stone-50, mt-[-32px] relative. px-5 pt-6. Safe-area
bottom padding.

Components:
- Hero image: full-width, aspect-ratio 3:4, object-cover. Floating back button
  top-left (w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md).
  Wishlist icon top-right same style.
- Product name: 36px Cormorant Garamond bold, zinc-900, leading-none, mt-4.
- Price row: "€129.00" in 24px Jost semibold amber-600. "€180.00" strikethrough
  in 16px zinc-400. "28% OFF" badge rounded-full bg-amber-100 text-amber-700
  text-xs font-semibold px-2.5 py-0.5.
- Rating row: 5 stars (amber-400 filled), "(128 reviews)" zinc-500 14px.
- Description: 15px Jost zinc-600 leading-relaxed, 3 lines collapsed with
  "Read more" amber-600 link.
- Size selector: horizontal scroll, each size option w-12 h-12 rounded-xl
  border-2. Active: border-zinc-900 bg-zinc-900 text-white.
- Add to cart CTA: fixed bottom, safe-area aware, full-width rounded-2xl h-14
  bg-zinc-900 text-white text-base font-semibold. Left: shopping bag icon.

Special: Hero image has subtle parallax on scroll. CTA button scales 0.97 on press.
```

---

## Screen-Type Checklists

Use these checklists to ensure completeness when describing a screen type.

### Onboarding screens

- [ ] Progress indicator (dots or steps bar at top)
- [ ] Illustration or hero visual (full-width or centered)
- [ ] Headline (large, bold) + short supporting text
- [ ] Primary CTA button (full-width, bottom)
- [ ] Secondary action ("Skip" or "Sign in" link, subdued)
- [ ] Safe-area padding top and bottom

### Authentication (Login / Register)

- [ ] App logo or wordmark centered at top
- [ ] Form inputs with clear labels (not just placeholders)
- [ ] Password input with show/hide toggle icon
- [ ] Primary submit button (full-width)
- [ ] Social auth options (Google, Apple) with brand-correct buttons
- [ ] Switch between Login/Register link
- [ ] Forgot password link

### Home / Dashboard

- [ ] Personalized greeting or user avatar in header
- [ ] Summary / hero metric or progress indicator
- [ ] Quick action buttons or shortcuts
- [ ] Recent activity list or feed
- [ ] Bottom tab bar with correct active state

### List / Feed screens

- [ ] Search bar or filter chips at top
- [ ] Consistent row/card height and padding
- [ ] Empty state design (no content yet)
- [ ] Loading skeleton on initial load
- [ ] Pull-to-refresh interaction described

### Detail screens

- [ ] Clear back navigation
- [ ] Hero image or media area
- [ ] Structured content hierarchy (title > meta > body)
- [ ] Primary action button (fixed or in header)
- [ ] Related items section at bottom

### Settings

- [ ] Grouped sections with section headers
- [ ] Row items: label left, control right (toggle/chevron/value)
- [ ] Destructive actions (Sign out, Delete) in red at bottom
- [ ] Version/build info footer

---

## Prerequisites: API Key

Create API keys at **https://sleek.design/dashboard/api-keys**. The full key value is shown only once at creation — store it in the `SLEEK_API_KEY` environment variable.

**Required plan**: Pro+ (API access is gated)

### Key scopes

| Scope             | What it unlocks              |
| ----------------- | ---------------------------- |
| `projects:read`   | List / get projects          |
| `projects:write`  | Create / delete projects     |
| `components:read` | List components in a project |
| `chats:read`      | Get chat run status          |
| `chats:write`     | Send chat messages           |
| `screenshots`     | Render component screenshots |

Create a key with only the scopes needed for the task.

---

## Security & Privacy

- **Single host**: All requests go exclusively to `https://sleek.design`. No data is sent to third parties.
- **HTTPS only**: All communication uses HTTPS. The API key is transmitted only in the `Authorization` header to Sleek endpoints.
- **Minimal scopes**: Create API keys with only the scopes required for the task. Prefer short-lived or revocable keys.
- **Image URLs**: When using `imageUrls` in chat messages, those URLs are fetched by Sleek's servers. Avoid passing URLs that contain sensitive content.

---

## Handling high-level requests

When the user says something like "design a fitness tracking app" or "build me a settings screen":

1. **Create a project** if one doesn't exist yet (ask the user for a name, or derive one from the request)
2. **Send a chat message** describing what to build — you can use the user's words directly as `message.text`; Sleek's AI interprets natural language
3. **Follow the screenshot delivery rule** below to show the result

You do not need to decompose the request into screens first. Send the full intent as a single message and let Sleek decide what screens to create.

---

## Screenshot delivery rule

**After every chat run that produces `screen_created` or `screen_updated` operations, always take screenshots and show them to the user.** Never silently complete a chat run without delivering the visuals.

**When screens are created for the first time on a project** (i.e. the run includes `screen_created` operations), deliver:

1. One screenshot per newly created screen (individual `componentIds: [screenId]`)
2. One combined screenshot of all screens in the project (`componentIds: [all screen ids]`)

**When only existing screens are updated**, deliver one screenshot per affected screen.

Use `background: "transparent"` for all screenshots unless the user explicitly requests otherwise.

---

## Quick Reference — All Endpoints

| Method   | Path                                    | Scope             | Description       |
| -------- | --------------------------------------- | ----------------- | ----------------- |
| `GET`    | `/api/v1/projects`                      | `projects:read`   | List projects     |
| `POST`   | `/api/v1/projects`                      | `projects:write`  | Create project    |
| `GET`    | `/api/v1/projects/:id`                  | `projects:read`   | Get project       |
| `DELETE` | `/api/v1/projects/:id`                  | `projects:write`  | Delete project    |
| `GET`    | `/api/v1/projects/:id/components`       | `components:read` | List components   |
| `POST`   | `/api/v1/projects/:id/chat/messages`    | `chats:write`     | Send chat message |
| `GET`    | `/api/v1/projects/:id/chat/runs/:runId` | `chats:read`      | Poll run status   |
| `POST`   | `/api/v1/screenshots`                   | `screenshots`     | Render screenshot |

All IDs are stable string identifiers.

---

## Endpoints

### Projects

#### List projects

```http
GET /api/v1/projects?limit=50&offset=0
Authorization: Bearer $SLEEK_API_KEY
```

Response `200`:

```json
{
  "data": [
    {
      "id": "proj_abc",
      "name": "My App",
      "slug": "my-app",
      "createdAt": "2026-01-01T00:00:00Z",
      "updatedAt": "..."
    }
  ],
  "pagination": { "total": 12, "limit": 50, "offset": 0 }
}
```

#### Create project

```http
POST /api/v1/projects
Authorization: Bearer $SLEEK_API_KEY
Content-Type: application/json

{ "name": "My New App" }
```

Response `201` — same shape as a single project.

#### Get / Delete project

```http
GET    /api/v1/projects/:projectId
DELETE /api/v1/projects/:projectId   → 204 No Content
```

---

### Components

#### List components

```http
GET /api/v1/projects/:projectId/components?limit=50&offset=0
Authorization: Bearer $SLEEK_API_KEY
```

Response `200`:

```json
{
  "data": [
    {
      "id": "cmp_xyz",
      "name": "Hero Section",
      "activeVersion": 3,
      "versions": [{ "id": "ver_001", "version": 1, "createdAt": "..." }],
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "pagination": { "total": 5, "limit": 50, "offset": 0 }
}
```

---

### Chat — Send Message

This is the core action: describe what you want in `message.text` and the AI creates or modifies screens.

```http
POST /api/v1/projects/:projectId/chat/messages?wait=false
Authorization: Bearer $SLEEK_API_KEY
Content-Type: application/json
idempotency-key: <optional, max 255 chars>

{
  "message": { "text": "Add a pricing section with three tiers" },
  "imageUrls": ["https://example.com/ref.png"],
  "target": { "screenId": "scr_abc" }
}
```

| Field                    | Required | Notes                                         |
| ------------------------ | -------- | --------------------------------------------- |
| `message.text`           | Yes      | 1+ chars, trimmed                             |
| `imageUrls`              | No       | HTTPS URLs only; included as visual context   |
| `target.screenId`        | No       | Edit a specific screen; omit to let AI decide |
| `?wait=true/false`       | No       | Sync wait mode (default: false)               |
| `idempotency-key` header | No       | Replay-safe re-sends                          |

#### Response — async (default, `wait=false`)

Status `202 Accepted`. `result` and `error` are absent until the run reaches a terminal state.

```json
{
  "data": {
    "runId": "run_111",
    "status": "queued",
    "statusUrl": "/api/v1/projects/proj_abc/chat/runs/run_111"
  }
}
```

#### Response — sync (`wait=true`)

Blocks up to **300 seconds**. Returns `200` when completed, `202` if timed out.

```json
{
  "data": {
    "runId": "run_111",
    "status": "completed",
    "statusUrl": "...",
    "result": {
      "assistantText": "I added a pricing section with...",
      "operations": [
        {
          "type": "screen_created",
          "screenId": "scr_xyz",
          "screenName": "Pricing"
        },
        { "type": "screen_updated", "screenId": "scr_abc" },
        { "type": "theme_updated" }
      ]
    }
  }
}
```

---

### Chat — Poll Run Status

Use this after async send to check progress.

```http
GET /api/v1/projects/:projectId/chat/runs/:runId
Authorization: Bearer $SLEEK_API_KEY
```

Response — same shape as send message `data` object:

```json
{
  "data": {
    "runId": "run_111",
    "status": "queued",
    "statusUrl": "..."
  }
}
```

When completed successfully, `result` is present:

```json
{
  "data": {
    "runId": "run_111",
    "status": "completed",
    "statusUrl": "...",
    "result": {
      "assistantText": "...",
      "operations": [...]
    }
  }
}
```

When failed, `error` is present:

```json
{
  "data": {
    "runId": "run_111",
    "status": "failed",
    "statusUrl": "...",
    "error": { "code": "execution_failed", "message": "..." }
  }
}
```

**Run status lifecycle**: `queued` → `running` → `completed | failed`

---

### Screenshots

Takes a snapshot of one or more rendered components.

```http
POST /api/v1/screenshots
Authorization: Bearer $SLEEK_API_KEY
Content-Type: application/json

{
  "componentIds": ["cmp_xyz", "cmp_abc"],
  "projectId": "proj_abc",
  "format": "png",
  "scale": 2,
  "gap": 40,
  "padding": 40,
  "background": "transparent"
}
```

| Field           | Default       | Notes                                                                |
| --------------- | ------------- | -------------------------------------------------------------------- |
| `format`        | `png`         | `png` or `webp`                                                      |
| `scale`         | `2`           | 1–3 (device pixel ratio)                                             |
| `gap`           | `40`          | Pixels between components                                            |
| `padding`       | `40`          | Uniform padding on all sides                                         |
| `paddingX`      | _(optional)_  | Horizontal padding; overrides `padding` for left/right when provided |
| `paddingY`      | _(optional)_  | Vertical padding; overrides `padding` for top/bottom when provided   |
| `paddingTop`    | _(optional)_  | Top padding; overrides `paddingY` when provided                      |
| `paddingRight`  | _(optional)_  | Right padding; overrides `paddingX` when provided                    |
| `paddingBottom` | _(optional)_  | Bottom padding; overrides `paddingY` when provided                   |
| `paddingLeft`   | _(optional)_  | Left padding; overrides `paddingX` when provided                     |
| `background`    | `transparent` | Any CSS color (hex, named, `transparent`)                            |
| `showDots`      | `false`       | Overlay a subtle dot grid on the background                          |

Padding resolves with a cascade: per-side → axis → uniform. For example, `paddingTop` falls back to `paddingY`, which falls back to `padding`. So `{ "padding": 20, "paddingX": 10, "paddingLeft": 5 }` gives top/bottom 20px, right 10px, left 5px.

When `showDots` is `true`, a dot pattern is drawn over the background color. The dots automatically adapt to the background: dark backgrounds get light dots, light backgrounds get dark dots. This has no effect when `background` is `"transparent"`.

Always use `"background": "transparent"` unless the user explicitly requests a specific background color.

Response: raw binary `image/png` or `image/webp` with `Content-Disposition: attachment`.

---

## Error Shapes

```json
{ "code": "UNAUTHORIZED", "message": "..." }
```

| HTTP | Code                    | When                                   |
| ---- | ----------------------- | -------------------------------------- |
| 401  | `UNAUTHORIZED`          | Missing/invalid/expired API key        |
| 403  | `FORBIDDEN`             | Valid key, wrong scope or plan         |
| 404  | `NOT_FOUND`             | Resource doesn't exist                 |
| 400  | `BAD_REQUEST`           | Validation failure                     |
| 409  | `CONFLICT`              | Another run is active for this project |
| 500  | `INTERNAL_SERVER_ERROR` | Server error                           |

Chat run-level errors (inside `data.error`):

| Code               | Meaning                          |
| ------------------ | -------------------------------- |
| `out_of_credits`   | Organization has no credits left |
| `execution_failed` | AI execution error               |

---

## Flows

### Flow 1: Create project and generate a UI (async + polling)

```
1. POST /api/v1/projects                              → get projectId
2. POST /api/v1/projects/:id/chat/messages            → get runId (202)
3. Poll GET /api/v1/projects/:id/chat/runs/:runId
   until status == "completed" or "failed"
4. Collect screenIds from result.operations
   (screen_created and screen_updated entries)
5. Screenshot each affected screen individually
6. If any screen_created: also screenshot all project screens combined
7. Show all screenshots to the user
```

**Polling recommendation**: start at 2s interval, back off to 5s after 10s, give up after 5 minutes.

### Flow 2: Sync mode (simple, blocking)

Best for short tasks or when latency is acceptable.

```
1. POST /api/v1/projects/:id/chat/messages?wait=true
   → blocks up to 300s
   → 200 if completed, 202 if timed out
2. If 202, fall back to Flow 1 polling with the returned runId
3. On completion, screenshot and show affected screens (see screenshot delivery rule)
```

### Flow 3: Edit a specific screen

```
1. GET /api/v1/projects/:id/components         → find screenId
2. POST /api/v1/projects/:id/chat/messages
   body: { message: { text: "..." }, target: { screenId: "scr_xyz" } }
3. Poll or wait as above
4. Screenshot the updated screen and show it to the user
```

### Flow 4: Idempotent message (safe retries)

Add `idempotency-key` header on the send request. If the network drops and you retry with the same key, the server returns the existing run rather than creating a duplicate. The key must be ≤255 chars.

```
POST /api/v1/projects/:id/chat/messages
idempotency-key: my-unique-request-id-abc123
```

### Flow 5: One run at a time (conflict handling)

Only one active run is allowed per project. If you send a message while one is running, you get `409 CONFLICT`. Wait for the active run to complete before sending the next message.

```
409 response → poll existing run → completed → send next message
```

---

## Pagination

All list endpoints accept `limit` (1–100, default 50) and `offset` (≥0). The response always includes `pagination.total` so you can page through all results.

```http
GET /api/v1/projects?limit=10&offset=20
```

---

## Common Mistakes

| Mistake                                             | Fix                                                                             |
| --------------------------------------------------- | ------------------------------------------------------------------------------- |
| Sending to `/api/v1` without `Authorization` header | Add `Authorization: Bearer $SLEEK_API_KEY` to every request                     |
| Using wrong scope                                   | Check key's scopes match the endpoint (e.g. `chats:write` for sending messages) |
| Sending next message before run completes           | Poll until `completed`/`failed` before next send                                |
| Using `wait=true` on long generations               | It blocks 300s max; have a fallback to polling for `202` response               |
| HTTP URLs in `imageUrls`                            | Only HTTPS URLs are accepted                                                    |
| Assuming `result` is present on `202`               | `result` is absent until status is `completed`                                  |
