To install dependencies:

```sh
bun install
```

To build the local Tailwind/daisyUI stylesheet and htmx bundle:

```sh
bun run build
```

To run:

```sh
bun run dev
```

Open http://localhost:4173

To run tests:

```sh
bun test
```

## Structure

- Hono routes return HTML with `c.html(...)`.
- Templates are TypeScript functions that use `html` from `hono/html`.
- htmx is installed as `htmx.org` and bundled into `/assets/app.js`.
- JSX is not used in this project.
