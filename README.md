# Fresh project

Your new Fresh project is ready to go. You can follow the Fresh "Getting
Started" guide here: https://fresh.deno.dev/docs/getting-started

### Usage

Make sure to install Deno:
https://docs.deno.com/runtime/getting_started/installation

Then start the project in development mode:

```
deno task dev
```

This will watch the project directory and restart as necessary.

## Project Roadmap: Modern Blog

### 1. Core Architecture

- [x] **Styling Engine:** Integrate **Tailwind CSS** for rapid, modern UI
      development.
- [x] **Content Management:** Implement a Markdown-based system for blog posts.
  - [x] **Advanced Rendering:** Use `marked` to parse Markdown to lexer then
        render to preact components and rehype-highlight for syntax
        highlighting.
- [ ] **Markdown Parsing Enhancements:**
  - [ ] Replace `react-markdown` with a more efficient parser.

### 2. UI/UX Features

- [x] **Responsive Design:** Mobile-first layout ensuring readability on all
      devices.
- [x] **Dark/Light Mode:** System-aware theme toggling with manual override.
- [x] **Modern Typography:** Clean, accessible font stack.
- [x] **Animations:** Subtle view transitions and hover effects.
- [x] **Tags & Categories UI:** Mobile-friendly filtering options.

### 3. Functional Features

- [x] **Landing Page:** Hero section, followed by a grid of recent posts.
- [x] **Article View:** Distraction-free reading experience with:
  - Syntax highlighting for code blocks.
  - Estimated reading time.
  - Author bio section.
- [x] **Tags & Categories:** Filter posts by topic.
- [x] **SEO:** Dynamic meta tags and Open Graph images.
- [ ] **Date Formatting:** Use date-fns for consistent and localized date display.
