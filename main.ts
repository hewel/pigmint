import { App, csp, staticFiles } from "fresh";
import { config, type State } from "./utils.ts";

export const app = new App<State>();

app.use(staticFiles());

const isProduction = isProductionRuntime();

function isProductionRuntime(): boolean {
  try {
    return Deno.env.get("DENO_DEPLOYMENT_ID") !== undefined ||
      Deno.env.get("DENO_ENV") === "production";
  } catch {
    return false;
  }
}

function allowGeneratedStyleAttributes(response: Response): void {
  // Shiki emits token colors as style attributes; CSP nonces only apply to
  // script/style elements, so keep this exception limited to style attributes.
  const headers = [
    "Content-Security-Policy",
    "Content-Security-Policy-Report-Only",
  ];

  for (const header of headers) {
    const value = response.headers.get(header);
    if (!value) continue;

    response.headers.set(
      header,
      value.replace(
        /style-src-attr 'nonce-[^']+'/g,
        "style-src-attr 'unsafe-inline'",
      ),
    );
  }
}

app.use(async (ctx) => {
  const response = await ctx.next();
  allowGeneratedStyleAttributes(response);
  return response;
});

app.use(csp({
  reportOnly: !isProduction,
  useNonce: isProduction,
  csp: [
    "script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "style-src-attr 'unsafe-inline'",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data:",
    "connect-src 'self' https://cloudflareinsights.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ],
}));

// Additional security headers middleware
app.use(async (ctx) => {
  const response = await ctx.next();

  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains",
  );
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=()",
  );

  return response;
});

app.use(async (ctx) => {
  ctx.state.config = config;
  return await ctx.next();
});

// Include file-system based routes here
app.fsRoutes();
