import { html } from 'hono/html'

import { statusSummary } from '../components/status-summary'
import { emptyPreview } from './preview'
import { taskForm } from './task-form'
import { taskList } from './task-list'

export const dashboard = () => html`
  <main class="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[1fr_21rem]">
    <section class="space-y-6">
      <div class="rounded-md border border-base-300 bg-base-100 p-5 shadow-sm">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="text-sm font-medium uppercase tracking-normal text-base-content/55">Exemplo inicial</p>
            <h1 class="mt-1 text-3xl font-semibold tracking-normal">Organize o próximo ciclo</h1>
          </div>
          <div class="flex flex-wrap gap-2">
            <span class="badge badge-neutral">Tailwind CSS</span>
            <span class="badge badge-accent">daisyUI</span>
            <span class="badge badge-info">Bun</span>
          </div>
        </div>
      </div>

      ${statusSummary()}

      <section class="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        ${taskForm()}
        ${taskList()}
      </section>
    </section>

    <aside class="space-y-6">
      <div id="preview-panel" class="rounded-md border border-base-300 bg-base-100 p-5 shadow-sm">
        ${emptyPreview()}
      </div>

      <div class="card border border-base-300 bg-base-100 shadow-sm">
        <div class="card-body gap-4 p-5">
          <h2 class="card-title text-lg">Componentes cobertos</h2>
          <div class="flex flex-wrap gap-2">
            <span class="badge">navbar</span>
            <span class="badge">card</span>
            <span class="badge">input</span>
            <span class="badge">select</span>
            <span class="badge">alert</span>
            <span class="badge">badge</span>
          </div>
          <div class="divider my-0"></div>
          <button class="btn btn-outline btn-block">Ação secundária</button>
        </div>
      </div>
    </aside>
  </main>
`
