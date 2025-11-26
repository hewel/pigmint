# Project Overview

**Project Name:** pigmint
**Description:** A modern, blog-aware web application built with [Fresh](https://fresh.deno.dev/) (Deno's next-gen web framework). It features a distinctive "Neubrutalist" design theme ("Whalies" inspired) with pastel colors, thick borders, and playful typography. The blog system is powered by Markdown files stored locally.

**Key Technologies:**
*   **Runtime:** [Deno](https://deno.com/)
*   **Framework:** [Fresh 2.0](https://fresh.deno.dev/) (Vite-based)
*   **UI Library:** Preact
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (configured via `@tailwindcss/vite`)
*   **Markdown Processing:** `marked` + `@std/front-matter`
*   **Fonts:** Google Fonts (Chewy, Nunito)

## Architecture

The project follows the standard Fresh architecture:

*   **`routes/`**: File-system based routing.
    *   `index.tsx`: The home page, listing all blog posts.
    *   `[slug].tsx`: Dynamic route for individual blog posts.
    *   `_app.tsx`: Global application wrapper (defines `<head>`, fonts, metadata).
*   **`islands/`**: Interactive components that are hydrated on the client (e.g., `Counter.tsx` - currently unused in the main flow but available).
*   **`components/`**: Stateless UI components (e.g., `Button.tsx`).
*   **`lib/`**: Business logic and data access helpers.
    *   `posts.ts`: Handles reading, parsing, and sorting Markdown blog posts from the `posts/` directory.
*   **`posts/`**: Directory containing the Markdown content for blog entries.
*   **`assets/`**: Static assets processed by Vite/Tailwind.
    *   `styles.css`: Main stylesheet defining the Tailwind configuration, custom theme variables, and global styles.
*   **`static/`**: Public static files (images, favicon).
*   **`deno.json`**: Project configuration, import maps, and task scripts.

## Building and Running

The project uses `deno task` for management.

### Development
To start the development server with hot module replacement:
```bash
deno task dev
```
*Runs on `http://localhost:5173/` by default.*

### Production Build
To build the application for production:
```bash
deno task build
```

### Production Start
To start the production server after building:
```bash
deno task start
```

### Code Quality
To run formatting, linting, and type checking:
```bash
deno task check
```

## Development Conventions

*   **Styling:** Use Tailwind utility classes for most styling.
    *   **Theme:** The project uses a custom "Neubrutalist" theme defined in `assets/styles.css`.
    *   **Classes:** Use `border-4 border-black` for containers, `rounded-2xl` or `rounded-3xl` for softness, and specific shadow utility `shadow-[...]` for hard shadows.
    *   **Colors:** Use the custom CSS variables or utility classes: `bg-card-pink`, `bg-card-yellow`, `bg-card-blue`, `bg-card-purple`.
*   **Routing:** Create new files in `routes/` to add pages. Use `define.page` and `define.handlers` helpers.
*   **Data Fetching:** Fetch data in the `handler` (server-side) and pass it to the page component via `ctx.render()`.
*   **Markdown:** Add new posts as `.md` files in the `posts/` directory. Front matter must include `title`, `date`, and `excerpt`.
*   **Imports:** Use command `deno add`.
*   **Commit:** Auto commit with meaningful messages.

## Current Status & Roadmap

*   [x] **Setup:** Fresh project initialized.
*   [x] **Styling:** Tailwind CSS v4 integrated.
*   [x] **Theme:** "Whalies" neubrutalist theme applied.
*   [x] **Blog Engine:** Markdown file reading implemented using `@std/front-matter`.
*   [ ] **Features:** See `README.md` for the detailed roadmap (Responsive design, Dark mode, etc.).
