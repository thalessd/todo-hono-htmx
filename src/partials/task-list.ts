import { html } from 'hono/html'

import { taskItem } from '../components/task-item'

export const taskList = () => html`
  <div class="card border border-base-300 bg-base-100 shadow-sm">
    <div class="card-body p-0">
      <div class="flex items-center justify-between border-b border-base-300 px-5 py-4">
        <div>
          <h2 class="text-lg font-semibold">Fila de hoje</h2>
          <p class="text-sm text-base-content/55">Lista mockada para validar componentes.</p>
        </div>
        <progress class="progress progress-primary w-24" value="58" max="100"></progress>
      </div>
      <ul>
        ${taskItem({ label: 'Definir estrutura das rotas', meta: 'Projeto base', status: 'foco' })}
        ${taskItem({ label: 'Separar componentes reutilizáveis', meta: 'UI', status: 'planejada' })}
        ${taskItem({ checked: true, label: 'Instalar Tailwind e daisyUI', meta: 'Setup', status: 'feito' })}
      </ul>
    </div>
  </div>
`
