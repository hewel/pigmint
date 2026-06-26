# Commands

- **Dependencies:** `deno add *` or `deno add npm:*` for npm packages
- **Lint/Format/Check:** `deno task check` (runs fmt, lint, and type checking)
- **Build:** `deno task build`
- **Dev Server:** `deno task dev` (runs on `http://localhost:5173/` by default)
- **Start (production):** `deno task start` (run after `deno task build`)
- **Test:** `deno test -A` (specific test: `deno test -A tests/my_test.ts`)
  - _Note: Create `*_test.ts` files for new logic._
