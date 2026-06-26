# Architecture

## Stack

- **Framework:** Fresh v2 (Deno) with Vite and Preact.
- **Styling:** Tailwind CSS v4 (see `docs/design-system.md`).
- **Markdown:** `satteri` (build-time rendering) + `@std/front-matter`.
- **Fonts:** Google Fonts (Fredoka, Nunito).

## Directory Structure

- `routes/` — File-system routing. Use `define.page` for pages.
  - `index.tsx` — Home page (lists blog posts).
  - `[slug].tsx` — Dynamic route for individual posts.
  - `_app.tsx` — Global app wrapper (`<head>`, fonts, metadata).
  - `_404.tsx` / `_500.tsx` — Custom error pages.
- `islands/` — Interactive components hydrated on the client.
- `components/` — Stateless UI components.
- `lib/` — Business logic and data access.
  - `posts.ts` — Reads, parses, and sorts Markdown posts from `posts/`.
  - `security.ts` — Input validation, escaping, rate limiting.
- `posts/` — Markdown blog entries. Frontmatter must include `title`, `date`,
  and `excerpt`.
- `assets/` — Static assets processed by Vite/Tailwind (`styles.css`).
- `static/` — Public static files (images, favicon).

## Conventions

- **Data Fetching:** Fetch in `handler` (server-side) and pass to page via
  `ctx.render()`.
- **Type Helpers:** Use `define.page()`, `define.layout()`, `define.handlers()`,
  and `define.middleware()` from `createDefine` for type safety.
- **Imports:** Use `deno.json` import map aliases (e.g., `@/`). Use `deno add`
  to manage dependencies.
- **Formatting:** Standard `deno fmt`.
- **Types:** Strict TypeScript. No `any`. Use interfaces for Props.
- **State:** Use Signals (`@preact/signals`) in islands.
- **Island Props:** Must be serializable (primitives, plain objects, arrays,
  `Uint8Array`, Preact Signals). No `Date` or custom classes.

## Error Handling

- Create `routes/_404.tsx` for "Not Found" and `routes/_500.tsx` for "Internal
  Server Error" pages (export a default Preact component).
- Use `ctx.renderNotFound()` or `throw new HttpError(404)` in handlers when a
  route matches but the resource doesn't exist.
