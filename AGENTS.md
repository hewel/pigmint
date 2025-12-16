# Agent Instructions

## Commands
- **Lint/Format/Check:** `deno task check` (runs fmt, lint, and type checking)
- **Build:** `deno task build`
- **Dev Server:** `deno task dev`
- **Test:** `deno test -A` (Run specific test: `deno test -A tests/my_test.ts`)
  - *Note: No tests currently exist. Create `*_test.ts` files for new logic.*

## Code Style & Conventions
- **Framework:** Fresh v2 (Deno) with Vite and Preact.
- **Architecture:** `routes/` for pages (use `define.page`), `islands/` for interactive components, `components/` for stateless UI.
- **Data Fetching:** Fetch in `handler` (server-side) and pass to page via `ctx.render()`.
- **Styling:** Tailwind CSS v4. "Neubrutalist" theme (Whalies inspired).
  - Use `border-4 border-black` for containers.
  - Use `rounded-2xl` or `rounded-3xl` for softness.
  - Colors: `bg-card-pink`, `bg-card-yellow`, `bg-card-blue`, `bg-card-purple`.
- **Imports:** Use `deno.json` import map aliases (e.g., `@/`). Use `deno add` to manage dependencies.
- **Formatting:** Standard `deno fmt`.
- **Types:** Strict TypeScript. No `any`. Use interfaces for Props.
- **State:** Use Signals (`@preact/signals`) in islands.
