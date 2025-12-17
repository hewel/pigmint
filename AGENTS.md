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

# Fresh Best Practices

This document outlines best practices for developing applications with Fresh, covering architecture, routing, component usage, data handling, and deployment.

## 1. Application Architecture

Fresh is built around an "Islands Architecture" pattern, optimizing for minimal client-side JavaScript and fast page loads.

*   **Prioritize Server-Side Rendering (SSR):** By default, Fresh pages are server-rendered, sending pure HTML to the client. This minimizes the initial JavaScript payload.
*   **Use Islands for Interactivity:** Only use interactive "islands" for components that *require* client-side interactivity. This ensures that only necessary JavaScript is sent to the browser for dynamic parts of your page, while static content remains lightweight. Islands are defined in the [`islands/`](%2Fdenoland%2Ffresh%2Fdocs%2F1.x%2Fconcepts%2Fplugins.md#L224) directory, for example, [`islands/Counter.tsx`](%2Fdenoland%2Ffresh%2Fpackages%2Finit%2Fsrc%2Finit.ts#L464) or [`islands/buy-now-button.tsx`](%2Fdenoland%2Ffresh%2Fdocs%2F1.x%2Fgetting-started%2Fadding-interactivity.md#L27). See [Islands](#denoland%2Ffresh%2Fdocs%2F1.x%2Fconcepts%2Fislands.md) and [Adding Interactivity](#denoland%2Ffresh%2Fdocs%2F1.x%2Fgetting-started%2Fadding-interactivity.md).
*   **Modular Design with [`App`](%2Fdenoland%2Ffresh%2Fpackages%2Ffresh%2Fsrc%2Fapp.ts#L168) Class:** Organize your application logic using the [`App`](%2Fdenoland%2Ffresh%2Fpackages%2Ffresh%2Fsrc%2Fapp.ts#L168) class for defining routes, applying middleware, handling errors, and composing sub-applications. This promotes modularity and maintainability, as described in [Fresh Framework Core](#fresh-framework-core) and [Core Application Architecture and Request Handling](#fresh-framework-core-core-application-architecture-and-request-handling).
*   **Centralized Configuration:** Manage your application's configuration, including plugins and middleware, using [`fresh.config.ts`](%2Fdenoland%2Ffresh%2Fdocs%2F1.x%2Fexamples%2Fwriting-tests.md#L44). This centralizes settings and allows [`dev.ts`](%2Fdenoland%2Ffresh%2Fwww%2Futils%2Fprism.ts#L36) and [`main.ts`](%2Fdenoland%2Ffresh%2Fwww%2Fdev.ts#L12) to access them consistently. See [Creating an optimized build](#denoland%2Ffresh%2Fdocs%2F1.x%2Fconcepts%2Fahead-of-time-builds.md).

## 2. Routing

Fresh uses a file-system based routing system that automatically generates routes from your project structure.

*   **Leverage File-System Routing:** Create new routes by adding files within the [`routes/`](%2Fdenoland%2Ffresh%2Fwww%2Fdev.ts#L1) directory. The file name dictates the URL path (e.g., [`routes/about.tsx`](%2Fdenoland%2Ffresh%2Fdocs%2Flatest%2Fadvanced%2Fhead.md#L50) handles [`/about`](%2Fdenoland%2Ffresh%2Fdocs%2Flatest%2Fconcepts%2Fapp.md#L31)). This provides predictable and efficient routing. See [Create a new route](#denoland%2Ffresh%2Fdocs%2F1.x%2Fgetting-started%2Fcreate-a-route.md) and [File-System Based Routing](#fresh-framework-core-file-system-based-routing).
*   **Dynamic Routes:** For paths with variable segments (e.g., [`/greet/:name`](%2Fdenoland%2Ffresh%2Fdocs%2F1.x%2Fgetting-started%2Fdynamic-routes.md#L9)), use square brackets in the file name (e.g., [`routes/greet/[name].tsx`](%2Fdenoland%2Ffresh%2Fdocs%2F1.x%2Fgetting-started%2Fdynamic-routes.md#L20)). Fresh automatically extracts parameters for use in page components. See [Dynamic Routes](#denoland%2Ffresh%2Fdocs%2F1.x%2Fgetting-started%2Fdynamic-routes.md).
*   **Custom Handlers for Logic:** Implement custom handlers ([`export const handler`](%2Fdenoland%2Ffresh%2Fwww%2Froutes%2Fraw.ts#L19)) for routes to manage HTTP methods, fetch data, or create API endpoints. Handlers can return [`Response`](%2Fdenoland%2Ffresh%2Fwww%2Froutes%2Fraw.ts#L27) objects or data for rendering page components. See [Custom Handlers](#denoland%2Ffresh%2Fdocs%2F1.x%2Fgetting-started%2Fcustom-handlers.md).
*   **Asynchronous Routes:** For simpler data fetching, define routes as [`async`](%2Fdenoland%2Ffresh%2Fwww%2Futils%2Fmarkdown.ts#L287) functions to directly fetch data and render the page component, as shown in [Data Fetching](#denoland%2Ffresh%2Fdocs%2F1.x%2Fconcepts%2Fdata-fetching.md).

```tsx
// routes/projects/[id].tsx
export default async function ProjectPage(_req, ctx: FreshContext) {
  const project = await db.projects.findOne({ id: ctx.params.id });
  if (!project) {
    return <h1>Project not found</h1>;
  }
  return <div><h1>{project.name}</h1></div>;
}
```

## 3. Components and Layout

Fresh provides special components for structuring your application's UI.

*   **App Wrapper ([`_app.tsx`](%2Fdenoland%2Ffresh%2Fwww%2Futils%2Fprism.ts#L34)):** Use [`routes/_app.tsx`](%2Fdenoland%2Ffresh%2Fpackages%2Finit%2Fsrc%2Finit.ts#L514) to define the outer HTML structure, global meta tags, or provide context to all application routes. It should contain a default export of a Preact component. See [App Wrapper](#denoland%2Ffresh%2Fdocs%2F1.x%2Fconcepts%2Fapp-wrapper.md).
*   **Layouts ([`_layout.tsx`](%2Fdenoland%2Ffresh%2Fdocs%2F1.x%2Fconcepts%2Flayouts.md#L17)):** For shared UI elements or data fetching within a specific subdirectory of routes, use [`_layout.tsx`](%2Fdenoland%2Ffresh%2Fdocs%2F1.x%2Fconcepts%2Flayouts.md#L17) files. Layouts can be nested and receive props from middleware. You can opt out of layout inheritance using [`skipInheritedLayouts: true`](%2Fdenoland%2Ffresh%2Fdocs%2F1.x%2Fconcepts%2Flayouts.md#L99) in [`RouteConfig`](%2Fdenoland%2Ffresh%2Fpackages%2Ffresh%2Fsrc%2Ftypes.ts#L5) or [`LayoutConfig`](%2Fdenoland%2Ffresh%2Fpackages%2Ffresh%2Fsrc%2Ftypes.ts#L41). See [Layouts](#denoland%2Ffresh%2Fdocs%2F1.x%2Fconcepts%2Flayouts.md).
*   **[`define`](%2Fdenoland%2Ffresh%2Fpackages%2Ffresh%2Fsrc%2Fdefine.ts#L12) Helpers for Type Safety:** Utilize [`define.page()`](%2Fdenoland%2Ffresh%2Fdocs%2Flatest%2Fadvanced%2Fdefine.md#L54), [`define.layout()`](%2Fdenoland%2Ffresh%2Fdocs%2Flatest%2Fadvanced%2Fdefine.md#L75), `define.handlers()`, and [`define.middleware()`](%2Fdenoland%2Ffresh%2Fdocs%2Flatest%2Fconcepts%2Fmiddleware.md#L39) from [`createDefine`](%2Fdenoland%2Ffresh%2Fpackages%2Ffresh%2Fsrc%2Fdefine.ts#L170) to improve type inference and code completion, especially when passing data between handlers and components. This is demonstrated in `packages/fresh/src/define.ts` and [Define Helpers](#denoland%2Ffresh%2Fdocs%2Flatest%2Fadvanced%2Fdefine.md).

## 4. Data Handling

Efficient and type-safe data handling is crucial in Fresh applications.

*   **Type-Safe Data Fetching:** Define the data type for [`PageProps`](%2Fdenoland%2Ffresh%2Fpackages%2Ffresh%2Fsrc%2Frender.ts#L52), [`Handlers`](%2Fdenoland%2Ffresh%2Fpackages%2Ffresh%2Fsrc%2Fcompat.ts#L32), and [`FreshContext`](%2Fdenoland%2Ffresh%2Fpackages%2Ffresh%2Fsrc%2Fcontext.ts#L53) to ensure type compatibility throughout your route handlers and page components. See [Data Fetching](#denoland%2Ffresh%2Fdocs%2F1.x%2Fconcepts%2Fdata-fetching.md).
*   **Form Submissions:** Leverage native HTML [`<form>`](%2Fdenoland%2Ffresh%2Fdocs%2F1.x%2Fconcepts%2Fforms.md#L3) elements for robust user input. Handle [`GET`](%2Fdenoland%2Ffresh%2Fdocs%2F1.x%2Fexamples%2Fcreating-a-crud-api.md#L67) and [`POST`](%2Fdenoland%2Ffresh%2Fdocs%2F1.x%2Fexamples%2Fcreating-a-crud-api.md#L34) requests in your route handlers, processing [`formData()`](%2Fdenoland%2Ffresh%2Fwww%2Froutes%2Findex.tsx#L40) server-side. Always validate input and protect against CSRF attacks. See [Forms](#denoland%2Ffresh%2Fdocs%2F1.x%2Fconcepts%2Fforms.md) and [Form Submissions](#denoland%2Ffresh%2Fdocs%2F1.x%2Fgetting-started%2Fform-submissions.md).
*   **Serializable Props for Islands:** When passing props to islands, ensure they are serializable (e.g., primitives, plain objects, arrays, [`Uint8Array`](%2Fdenoland%2Ffresh%2Fpackages%2Ffresh%2Fsrc%2Ffs.ts#L11), Preact Signals). Avoid complex objects like [`Date`](%2Fdenoland%2Ffresh%2Fwww%2Fcomponents%2FFooter.tsx#L25) or custom classes directly, as they are not supported. See [Islands](#denoland%2Ffresh%2Fdocs%2F1.x%2Fconcepts%2Fislands.md).
*   **Advanced Data Serialization:** For complex JavaScript data types beyond standard JSON (like [`BigInt`](%2Fdenoland%2Ffresh%2Fpackages%2Ffresh%2Fsrc%2Futils.ts#L192), [`URL`](%2Fdenoland%2Ffresh%2Fwww%2Fmain_test.ts#L53), [`Date`](%2Fdenoland%2Ffresh%2Fwww%2Fcomponents%2FFooter.tsx#L25), [`RegExp`](%2Fdenoland%2Ffresh%2Ftools%2Frelease.ts#L156), [`Uint8Array`](%2Fdenoland%2Ffresh%2Fpackages%2Ffresh%2Fsrc%2Ffs.ts#L11), [`Set`](%2Fdenoland%2Ffresh%2Ftools%2Fcheck_links.ts#L24), [`Map`](%2Fdenoland%2Ffresh%2Fpackages%2Fplugin-vite%2Ftests%2Ffixtures%2Fisland_global_name%2Fislands%2FMap.tsx#L4), circular references), Fresh's [`jsonify`](%2Fdenoland%2Ffresh%2Fpackages%2Ffresh%2Fsrc%2Fruntime%2Fclient%2Freviver.ts#L10) module provides extended [`stringify`](%2Fdenoland%2Ffresh%2Fpackages%2Ffresh%2Fsrc%2Fjsonify%2Fstringify.ts#L38) and [`parse`](%2Fdenoland%2Ffresh%2Fpackages%2Ffresh%2Fsrc%2Fjsonify%2Fparse.ts#L14) functions. This ensures reliable data transfer. See [Advanced Data Serialization](#fresh-framework-core-advanced-data-serialization).

## 5. Middleware and Plugins

Extend Fresh's functionality with middleware and plugins for various concerns.

*   **Security Middleware:** Implement core security features using Fresh's built-in middleware:
    *   [`cors()`](%2Fdenoland%2Ffresh%2Fdocs%2Flatest%2Fplugins%2Fcors.md#L5): Configure Cross-Origin Resource Sharing (CORS) headers for controlled access to resources. (See `packages/fresh/src/middlewares/cors.ts` and [Core Middleware Functionalities](#extending-fresh-with-plugins-and-middleware-core-middleware-functionalities)).
    *   [`csp()`](%2Fdenoland%2Ffresh%2Fdocs%2Flatest%2Fplugins%2Fcsp.md#L5): Enforce Content-Security-Policy (CSP) headers to mitigate XSS attacks. (See `packages/fresh/src/middlewares/csp.ts` and [Core Middleware Functionalities](#extending-fresh-with-plugins-and-middleware-core-middleware-functionalities)).
    *   [`csrf()`](%2Fdenoland%2Ffresh%2Fdocs%2Flatest%2Fplugins%2Fcsrf.md#L5): Protect against Cross-Site Request Forgery (CSRF) attacks by validating request headers. (See `packages/fresh/src/middlewares/csrf.ts` and [Core Middleware Functionalities](#extending-fresh-with-plugins-and-middleware-core-middleware-functionalities)).
*   **Utility Middleware:**
    *   [`staticFiles()`](%2Fdenoland%2Ffresh%2Fwww%2Fmain.ts#L4): Efficiently serve static assets from the [`static/`](%2Fdenoland%2Ffresh%2Fwww%2Fdev.ts#L1) directory, with support for cache busting and ETag validation. (See `packages/fresh/src/middlewares/static_files.ts` and [Core Middleware Functionalities](#extending-fresh-with-plugins-and-middleware-core-middleware-functionalities)).
    *   [`trailingSlashes()`](%2Fdenoland%2Ffresh%2Fdocs%2Flatest%2Fplugins%2Ftrailing-slashes.md#L5): Enforce a consistent URL structure (always or never trailing slashes) for better SEO and predictable routing. (See `packages/fresh/src/middlewares/trailing_slashes.ts` and [Core Middleware Functionalities](#extending-fresh-with-plugins-and-middleware-core-middleware-functionalities)).
*   **Integration with Plugins:** Leverage plugins like [`@fresh/plugin-tailwindcss`](%2Fdenoland%2Ffresh%2Fdocs%2Flatest%2Fadvanced%2Fbuilder.md#L187) for styling or [`@fresh/plugin-vite`](%2Fdenoland%2Ffresh%2Fpackages%2Finit%2Fsrc%2Finit.ts#L616) for enhanced development with HMR. See [Extending Fresh with Plugins and Middleware](#extending-fresh-with-plugins-and-middleware).

## 6. Deployment and Performance

Optimize your Fresh application for production environments.

*   **Ahead-of-Time (AOT) Builds:** Pre-optimize frontend assets by running [`deno task build`](%2Fdenoland%2Ffresh%2Fdeno.json#L9). This compresses and optimizes island code, allowing Fresh to serve them as static files for faster page loads. This creates a [`_fresh`](%2Fdenoland%2Ffresh%2Fwww%2Fdeno.json#L3) folder that should not be committed to your repository. See [Ahead-of-time builds](#denoland%2Ffresh%2Fdocs%2F1.x%2Fconcepts%2Fahead-of-time-builds.md).
*   **Deno Deploy for Edge Deployment:** Deploy your Fresh project to Deno Deploy for a globally distributed edge network and automatic deployments. Configure [`deno task build`](%2Fdenoland%2Ffresh%2Fdeno.json#L9) in the "Build command" field on Deno Deploy. See [Deployment](#denoland%2Ffresh%2Fdocs%2F1.x%2Fconcepts%2Fdeployment.md).
*   **[`DENO_DEPLOYMENT_ID`](%2Fdenoland%2Ffresh%2Fpackages%2Fbuild-id%2Fmod.ts#L17) for Caching:** When deploying to platforms like Docker, ensure [`DENO_DEPLOYMENT_ID`](%2Fdenoland%2Ffresh%2Fpackages%2Fbuild-id%2Fmod.ts#L17) is set to a unique identifier that changes with *any* file modification. This is critical for cache busting and correct application function. See [Deployment](#denoland%2Ffresh%2Fdocs%2F1.x%2Fconcepts%2Fdeployment.md).

## 7. Testing

Ensure the reliability of your Fresh application using Deno's built-in test runner.

*   **Modular Testing:** Test middlewares, app wrappers, layouts, and routes either as a whole or in isolation.
*   **Middleware Testing:** Create dummy [`App`](%2Fdenoland%2Ffresh%2Fpackages%2Ffresh%2Fsrc%2Fapp.ts#L168) instances and custom handlers to assert middleware behavior, such as state modifications or header additions. See [Testing middlewares](#denoland%2Ffresh%2Fdocs%2Flatest%2Ftesting%2Findex.md).
*   **Component Testing (App/Layout/Routes):** Use the [`App`](%2Fdenoland%2Ffresh%2Fpackages%2Ffresh%2Fsrc%2Fapp.ts#L168) pattern to render components like [`AppWrapper`](%2Fdenoland%2Ffresh%2Fdocs%2Flatest%2Ftesting%2Findex.md#L55) or layouts and assert the rendered HTML content. See [Testing app wrapper or layouts](#denoland%2Ffresh%2Fdocs%2Flatest%2Ftesting%2Findex.md) and [Testing routes and handlers](#denoland%2Ffresh%2Fdocs%2Flatest%2Ftesting%2Findex.md).
*   **Island Testing:**
    *   **Server-Side Rendering (SSR):** Test that islands render correctly on the server by asserting their initial HTML content.
    *   **Client-Side Interactivity:** For complex client-side behavior, use a full build and browser environment (e.g., via [`startTestServer`](%2Fdenoland%2Ffresh%2Fdocs%2Flatest%2Ftesting%2Findex.md#L193)) to verify interactivity. For most applications, SSR tests are sufficient. See [Testing islands](#denoland%2Ffresh%2Fdocs%2Flatest%2Ftesting%2Findex.md).

## 8. Error Handling

Customize how your application responds to errors for a better user experience.

*   **Custom Error Pages:** Create [`routes/_404.tsx`](%2Fdenoland%2Ffresh%2Fdocs%2F1.x%2Fconcepts%2Ferror-pages.md#L17) for "Not Found" errors and [`routes/_500.tsx`](%2Fdenoland%2Ffresh%2Fdocs%2F1.x%2Fconcepts%2Ferror-pages.md#L76) for "Internal Server Error" pages. These files should export a default Preact component. See [Error Pages](#denoland%2Ffresh%2Fdocs%2F1.x%2Fconcepts%2Ferror-pages.md).
*   **Manual 404 Rendering:** Use [`ctx.renderNotFound()`](%2Fdenoland%2Ffresh%2Fdocs%2F1.x%2Fconcepts%2Froutes.md#L152) in handlers to explicitly trigger the 404 page for cases where a route matches, but the resource doesn't exist. Alternatively, throw an [`HttpError(404)`](%2Fdenoland%2Ffresh%2Fwww%2Froutes%2Fdocs%2F%5B...slug%5D.tsx#L63). See [Error Pages](#denoland%2Ffresh%2Fdocs%2F1.x%2Fconcepts%2Ferror-pages.md).

```tsx
// routes/blog/[slug].tsx
import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const blogpost = await fetchBlogpost(ctx.params.slug);
    if (!blogpost) {
      return ctx.renderNotFound(); // Or throw new HttpError(404);
    }
    return ctx.render({ blogpost });
  },
};
```

## 9. Code Quality and Maintenance

*   **Adhere to Code of Conduct:** Follow the Contributor Covenant Code of Conduct for positive interactions within the community, as outlined in [Code of Conduct and Enforcement](#community-and-contribution-guidelines-code-of-conduct-and-enforcement).
*   **Pass [`deno task ok`](%2Fdenoland%2Ffresh%2Fdeno.json#L9):** Before submitting pull requests, ensure all checks pass by running [`deno task ok`](%2Fdenoland%2Ffresh%2Fdeno.json#L9) to adhere to project quality and style standards. See [Pull Request Submission Guidelines](#community-and-contribution-guidelines-pull-request-submission-guidelines).
*   **Keep Deno Up-to-Date:** Ensure you are using the minimum required Deno version (e.g., "1.43.1" or higher) for compatibility and access to the latest features. The [`@fresh/update`](%2Fdenoland%2Ffresh%2Fpackages%2Finit%2Fsrc%2Finit.ts#L569) tool will check this. See `packages/update/src/utils.ts`.
