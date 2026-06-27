# Security

## Implemented Protections

1. **Markdown HTML Boundary** — Owner-authored posts render at build time in
   `scripts/gen_content.ts`; CSP in `main.ts` limits script execution.
2. **Safe Theme Init** — `islands/ThemeInitializer.tsx` uses direct DOM
   manipulation instead of `innerHTML`.
3. **CSP Headers** — Comprehensive Content-Security-Policy set in `main.ts`
   middleware.
4. **GitHub API Auth** — Optional `GITHUB_TOKEN` env var in `lib/github.ts`
   (raises rate limit from 60 to 5000 req/hr).
5. **Path Traversal** — `validateSlug()` in `lib/security.ts`, used by
   `routes/[slug].tsx`.
6. **Output Encoding** — `escapeHtml()` and `sanitizeMetaContent()` in
   `lib/security.ts`, used by `components/SEO.tsx`.
7. **XML Sanitization** — `escapeXml()` in `lib/security.ts`, used by
   `scripts/gen_content.ts`.
8. **GitHub Repo Validation** — `validateGitHubRepo()` in `lib/security.ts`.
9. **Security Headers** — `X-Content-Type-Options`, `X-Frame-Options`,
   `X-XSS-Protection`, `Referrer-Policy` set in `main.ts` middleware.
10. **Rate Limiting** — `RateLimiter` class in `lib/security.ts` (in-memory,
    per-identifier).

## Environment

Set `GITHUB_TOKEN` to increase GitHub API rate limits:

```bash
export GITHUB_TOKEN="your_github_personal_access_token"
```

Required permission: `public_repo` (no additional scopes needed).

## Testing

```bash
deno task test
```

Covers: XSS protection, input validation, path traversal, XML escaping, GitHub
repo format validation.
