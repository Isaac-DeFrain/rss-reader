# Copilot Instructions for RSS Reader

## Project Overview
TypeScript + Vite web app with two separate entry points:

- a minimalist landing page (`index.html` + `src/main.ts`)
- an RSS feed reader (`reader.html` + `src/reader.ts`).

## Architecture

### Entry Points
- **Landing Page**: `index.html` → `src/main.ts` (PageController class)
- **RSS Reader**: `reader.html` → `src/reader.ts` (RSSReader class)

Both pages share theme toggle functionality but are independent applications.

### Key Patterns

**Class-Based UI Controllers**: Each page uses a single class (`PageController`, `RSSReader`) that:
- Caches DOM element references in the constructor using `getElementById()` with type assertions
- Calls `init()` to attach event listeners
- Private methods for feature logic (theme handling, feed fetching, DOM updates)

**Theme Management** (shared pattern):
- CSS custom properties: `--bg-gradient-1`, `--bg-gradient-2`, `--bg-card`, `--text-primary`, etc.
- Dark mode toggled via `dark-mode` class on `<html>` element
- Persists to `localStorage` with key `'theme'` (values: `'dark'` | `'light'`)
- Falls back to system preference using `window.matchMedia('(prefers-color-scheme: dark)')`
- Theme button shows 🌙 in light mode, ☀️ in dark mode

**RSS Feed Fetching** (`src/reader.ts`):
- Uses CORS proxy: `https://api.allorigins.win/get?url={encoded_url}`
- Parses XML with `DOMParser` into strongly-typed `RSSFeed` and `RSSItem` interfaces
- Displays up to 20 items, truncates descriptions at 200 characters
- Always escapes HTML using the `escapeHtml()` helper (create div, set textContent, read innerHTML)

## Build & Development

```bash
npm run dev      # Start Vite dev server on http://localhost:3000, auto-opens in browser
npm run build    # TypeScript compilation + Vite minification (terser) → dist/
npm run preview  # Preview production build locally
```

**Dev Configuration**: `vite.config.ts` - root: `.`, port: 3000, auto-open enabled

## Code Style & Conventions

- **TypeScript Strict Mode**: No `any` types; use interfaces for data shapes
- **Type Assertions**: Use `as HTMLButtonElement` for DOM element queries rather than type guards
- **Error Handling**: Catch errors and display user-friendly messages via `showMessage()` (see `reader.ts`)
- **HTML Escaping**: Always use the `escapeHtml()` function to prevent XSS when displaying user-provided content
- **Event Listeners**: Attach via `addEventListener()` in `init()`, prefer arrow functions for `this` binding
- **Null Checks**: DOM queries return null if not found; check before use (e.g., `if (this.button) { ... }`)

## Key Files & Responsibilities

- `index.html`: Landing page structure (theme button, hero section)
- `reader.html`: RSS reader UI (input field, load button, feeds list, theme button)
- `src/main.ts`: PageController - minimal; only handles theme toggling on landing page
- `src/reader.ts`: RSSReader - complex; handles feed fetching, parsing, display, theme, and error states
- `tsconfig.json`: Strict TypeScript settings
- `package.json`: Scripts point to `index.html` as root; production build output is `dist/`

## Important Notes

- **No external UI libraries**: All styling is inline CSS or external stylesheets; UI is vanilla DOM manipulation
- **No backend**: RSS fetching is entirely client-side via CORS proxy
- **Static deployment**: `dist/` folder contains all assets; ready for GitHub Pages, Netlify, Vercel
- **Error boundaries**: Feed parsing and fetching errors are caught and displayed as user messages, not logged to console
