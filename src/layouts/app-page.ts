import { html } from 'hono/html'

import { dashboard } from '../partials/dashboard'

export const appPage = () => html`<!DOCTYPE html>
  <html lang="pt-BR" data-theme="dark">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Painel de tarefas</title>
      <link rel="stylesheet" href="/assets/app.css" />
      <script type="module" src="/assets/app.js"></script>
    </head>
    <body class="min-h-screen bg-base-200 text-base-content">
      <div class="min-h-screen">
        <header class="border-b border-base-300 bg-base-100">
          <nav class="navbar mx-auto max-w-6xl px-4">
            <div class="flex-1">
              <a class="btn btn-ghost px-2 text-xl font-semibold">Painel de tarefas</a>
            </div>
            <div class="flex-none gap-2">
              <span class="badge badge-primary badge-outline hidden sm:inline-flex">Hono</span>
              <span class="badge badge-secondary badge-outline hidden sm:inline-flex">htmx</span>
              <button class="btn btn-primary btn-sm">Nova tarefa</button>
            </div>
          </nav>
        </header>
        ${dashboard()}
      </div>
    </body>
  </html>`
