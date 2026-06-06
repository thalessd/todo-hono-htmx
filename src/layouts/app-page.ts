import { html } from 'hono/html'

import type { Todo, TodoStats } from '../todos/repository'
import { todoApp } from '../todos/views'

type AppPageProps = {
  todos: Todo[]
  stats: TodoStats
}

export const appPage = ({ todos, stats }: AppPageProps) => html`<!DOCTYPE html>
  <html lang="pt-BR" data-theme="night">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Mesa de tarefas</title>
      <link rel="stylesheet" href="/assets/app.css" />
      <script type="module" src="/assets/app.js"></script>
    </head>
    <body class="min-h-screen bg-base-200 text-base-content">
      <main class="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <header class="grid gap-6 border-b border-primary/20 pb-7 lg:grid-cols-[1fr_auto] lg:items-end">
          <div class="max-w-4xl">
            <p class="font-serif text-lg italic text-accent">Sala noturna · SQLite em memória + HTMX</p>
            <h1 class="mt-2 text-5xl font-black leading-none tracking-normal text-base-content sm:text-7xl">
              Mesa de tarefas
            </h1>
            <p class="mt-4 max-w-2xl text-base leading-7 text-base-content/70">
              Um painel escuro e direto para capturar, revisar e concluir tarefas sem estado no navegador.
            </p>
          </div>
          <div class="flex flex-wrap gap-2 lg:justify-end">
            <span class="badge badge-primary badge-lg border-primary/40">Bun SQLite</span>
            <span class="badge badge-secondary badge-lg border-secondary/40">Hono</span>
            <span class="badge badge-accent badge-lg border-accent/40">HTMX</span>
          </div>
        </header>

        ${todoApp({ todos, stats })}
      </main>
      <div id="modal-root"></div>
    </body>
  </html>`
