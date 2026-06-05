# Repository Guidelines

## Project Structure & Module Organization

This is a small Bun + Hono + HTMX example app. Source code lives in `src/`.

- `src/index.ts`: Hono app setup, static assets, and routes.
- `src/layouts/`: full-page document templates.
- `src/partials/`: HTMX-oriented fragments and page sections.
- `src/components/`: small reusable HTML template helpers.
- `src/client.ts`: browser entry point that imports `htmx.org`.
- `src/styles.css`: Tailwind CSS v4 and daisyUI configuration.
- `src/index.test.ts`: Bun tests.
- `public/assets/`: generated CSS/JS output; do not edit by hand.

## Build, Test, and Development Commands

- `bun install`: install dependencies from `package.json` and `bun.lock`.
- `bun run build`: build `public/assets/app.css` and `public/assets/app.js`.
- `bun run css:build`: compile Tailwind/daisyUI only.
- `bun run js:build`: bundle `src/client.ts` and local HTMX only.
- `bun run dev`: build assets, then run Hono with hot reload on `http://localhost:4173`.
- `bun test`: run the Bun test suite.

## Coding Style & Naming Conventions

Use TypeScript only. Do not use JSX or `.tsx` files. Hono routes should return HTML through `c.html(...)`, and templates should use `html` from `hono/html`.

Use two-space indentation in Markdown examples and normal TypeScript formatting. Prefer small, focused template functions named in camelCase, such as `taskForm()` or `previewFragment()`. Keep route paths HTMX-oriented, for example `/partials/preview`.

## Testing Guidelines

Tests use `bun:test`. Keep tests near the app in `src/*.test.ts`. Verify rendered HTML behavior, route status codes, HTMX attributes, and asset references. Run `bun test` before handing off changes. Add or update tests when route paths, template structure, or generated asset references change.

## Commit & Pull Request Guidelines

No usable Git history is available in this workspace, so use concise imperative commit messages such as `Add dark daisyUI theme` or `Split HTMX partial templates`.

Pull requests should include a short summary, commands run, and screenshots for visible UI changes. Mention any changed routes, generated assets, or dependency updates.

## Security & Configuration Tips

Do not commit secrets. `.env` files are ignored; use `.env.example` for documented configuration. Generated files in `public/assets/` should come from `bun run build`.
