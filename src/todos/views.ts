import { html } from 'hono/html'

import type { Todo, TodoStats } from './repository'

type TodoAppProps = {
  todos: Todo[]
  stats: TodoStats
  error?: string
}

const pluralize = (count: number, singular: string, plural: string) => {
  return `${count} ${count === 1 ? singular : plural}`
}

export const todoApp = ({ todos, stats, error }: TodoAppProps) => html`
  <section id="todo-app" class="grid gap-6 xl:grid-cols-[23rem_1fr]">
    <aside class="space-y-4">
      ${todoForm(error)}
      ${todoStats(stats)}
    </aside>

    <section class="card border border-primary/15 bg-base-100/85 shadow-xl backdrop-blur">
      <div class="card-body gap-0 p-0">
        <div class="flex flex-col gap-3 border-b border-primary/15 px-5 py-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p class="font-serif text-sm italic text-accent">Turno em memória</p>
            <h2 class="text-2xl font-black tracking-normal">Tarefas em curso</h2>
          </div>
          <span class="badge badge-primary badge-lg badge-outline">${pluralize(stats.active, 'ativa', 'ativas')}</span>
        </div>
        ${todos.length === 0 ? emptyState() : todoList(todos)}
      </div>
    </section>
  </section>
`

export const todoForm = (error?: string) => html`
  <form
    class="card border border-primary/25 bg-base-100/90 shadow-xl backdrop-blur"
    hx-post="/todos"
    hx-target="#todo-app"
    hx-swap="outerHTML"
  >
    <div class="card-body gap-4 p-5">
      <div>
        <p class="font-serif text-sm italic text-accent">Entrada rápida</p>
        <h2 class="text-2xl font-black tracking-normal">Nova tarefa</h2>
      </div>

      ${error
        ? html`<div class="alert alert-error py-2 text-sm">
            <span>${error}</span>
          </div>`
        : ''}

      <label class="form-control gap-2">
        <span class="label p-0">
          <span class="label-text font-bold text-base-content/80">Título</span>
        </span>
        <input
          name="title"
          type="text"
          maxlength="120"
          placeholder="Revisar proposta"
          class="input input-bordered bg-base-200/70 text-base-content placeholder:text-base-content/45"
        />
      </label>

      <label class="form-control gap-2">
        <span class="label p-0">
          <span class="label-text font-bold text-base-content/80">Notas</span>
        </span>
        <textarea
          name="notes"
          rows="4"
          maxlength="500"
          placeholder="Contexto, critérios ou próximos passos."
          class="textarea textarea-bordered resize-none bg-base-200/70 text-base-content placeholder:text-base-content/45"
        ></textarea>
      </label>

      <button type="submit" class="btn btn-primary btn-block">Criar tarefa</button>
    </div>
  </form>
`

export const todoStats = (stats: TodoStats) => html`
  <div class="stats stats-vertical w-full border border-primary/15 bg-base-100/85 shadow-xl backdrop-blur">
    <div class="stat">
      <div class="stat-title">Total</div>
      <div class="stat-value text-primary">${pluralize(stats.total, 'tarefa', 'tarefas')}</div>
    </div>
    <div class="stat">
      <div class="stat-title">Concluídas</div>
      <div class="stat-value text-success">${pluralize(stats.completed, 'concluída', 'concluídas')}</div>
    </div>
    <div class="stat">
      <div class="stat-title">Ativas</div>
      <div class="stat-value text-accent">${pluralize(stats.active, 'ativa', 'ativas')}</div>
    </div>
  </div>
`

export const emptyState = () => html`
  <div class="grid min-h-80 place-items-center px-5 py-12">
    <div class="max-w-md text-center">
      <div class="mx-auto mb-5 grid size-16 place-items-center rounded-full border border-dashed border-accent/45 bg-base-200/70 shadow-xl">
        <span class="font-serif text-3xl italic">0</span>
      </div>
      <h3 class="text-2xl font-black tracking-normal">Nenhuma tarefa no turno</h3>
      <p class="mt-3 text-base-content/65">
        Crie a primeira tarefa para acender o painel. Os dados ficam apenas no SQLite em memória.
      </p>
    </div>
  </div>
`

export const todoList = (todos: Todo[]) => html`
  <ul class="divide-y divide-base-content/10">
    ${todos.map((todo) => todoItem(todo))}
  </ul>
`

export const todoItem = (todo: Todo) => {
  const checked = todo.completed ? 'checked' : ''
  const titleClass = todo.completed ? 'line-through decoration-2 opacity-55' : ''
  const statusClass = todo.completed ? 'badge-success' : 'badge-warning'
  const statusLabel = todo.completed ? 'Concluída' : 'Ativa'

  return html`
    <li id="todo-${todo.id}" class="group grid gap-4 px-5 py-5 transition-colors hover:bg-base-200/35 md:grid-cols-[auto_1fr_auto] md:items-start">
      <input
        aria-label="Alternar conclusão"
        type="checkbox"
        class="checkbox checkbox-primary mt-1"
        ${checked}
        hx-patch="/todos/${todo.id}/toggle"
        hx-target="#todo-app"
        hx-swap="outerHTML"
      />

      <div class="min-w-0">
        <div class="flex flex-wrap items-center gap-2">
          <h3 class="break-words text-xl font-black tracking-normal ${titleClass}">${todo.title}</h3>
          <span class="badge ${statusClass} badge-outline">${statusLabel}</span>
        </div>
        ${todo.notes
          ? html`<p class="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-base-content/65">${todo.notes}</p>`
          : html`<p class="mt-2 text-sm italic text-base-content/45">Sem notas adicionais.</p>`}
      </div>

      <div class="flex gap-2 md:justify-end">
        <button
          type="button"
          class="btn btn-sm btn-ghost"
          hx-get="/todos/${todo.id}/edit"
          hx-target="#modal-root"
          hx-swap="innerHTML"
        >
          Editar
        </button>
        <button
          type="button"
          class="btn btn-sm btn-error btn-outline"
          hx-get="/todos/${todo.id}/delete"
          hx-target="#modal-root"
          hx-swap="innerHTML"
        >
          Excluir
        </button>
      </div>
    </li>
  `
}

export const editTodoModal = (todo: Todo, error?: string) => html`
  <div class="modal modal-open">
    <div class="modal-box border border-primary/20 bg-base-100 shadow-xl">
      <h2 class="text-2xl font-black tracking-normal">Editar tarefa</h2>
      <p class="mt-1 text-sm text-base-content/60">Ajuste o título e as notas desta tarefa.</p>

      ${error
        ? html`<div class="alert alert-error mt-4 py-2 text-sm">
            <span>${error}</span>
          </div>`
        : ''}

      <form class="mt-6" hx-put="/todos/${todo.id}" hx-target="#todo-app" hx-swap="outerHTML">
        <div data-testid="edit-todo-fields" class="grid gap-5">
          <div class="grid gap-2">
            <label for="edit-title-${todo.id}" class="text-sm font-bold text-base-content/70">Título</label>
            <input
              id="edit-title-${todo.id}"
              name="title"
              type="text"
              maxlength="120"
              value="${todo.title}"
              class="input input-bordered w-full"
            />
          </div>

          <div class="grid gap-2">
            <label for="edit-notes-${todo.id}" class="text-sm font-bold text-base-content/70">Notas</label>
            <textarea
              id="edit-notes-${todo.id}"
              name="notes"
              rows="6"
              maxlength="500"
              class="textarea textarea-bordered h-36 w-full resize-none"
            >${todo.notes}</textarea>
          </div>
        </div>

        <div class="modal-action mt-6">
          <button type="button" class="btn btn-ghost" onclick="document.getElementById('modal-root').innerHTML = ''">
            Cancelar
          </button>
          <button type="submit" class="btn btn-primary">Salvar alterações</button>
        </div>
      </form>
    </div>
    <div class="modal-backdrop" onclick="document.getElementById('modal-root').innerHTML = ''"></div>
  </div>
`

export const deleteTodoModal = (todo: Todo) => html`
  <div class="modal modal-open">
    <div class="modal-box max-w-lg border border-error/25 bg-base-100 shadow-xl">
      <div class="mb-5 inline-flex rounded-full bg-error/10 px-3 py-1 text-sm font-bold text-error">Ação destrutiva</div>
      <h2 class="text-2xl font-black tracking-normal">Excluir tarefa</h2>
      <p class="mt-2 text-sm leading-6 text-base-content/65">
        Você está prestes a excluir <strong>${todo.title}</strong>. Esta ação não pode ser desfeita.
      </p>

      ${todo.notes
        ? html`<div class="mt-5 rounded-md border border-base-content/10 bg-base-200/70 p-4 text-sm text-base-content/70">
            <p class="line-clamp-3 whitespace-pre-wrap break-words">${todo.notes}</p>
          </div>`
        : ''}

      <div class="modal-action mt-6">
        <button type="button" class="btn btn-ghost" onclick="document.getElementById('modal-root').innerHTML = ''">
          Cancelar
        </button>
        <button
          type="button"
          class="btn btn-error"
          hx-delete="/todos/${todo.id}"
          hx-target="#todo-app"
          hx-swap="outerHTML"
        >
          Excluir definitivamente
        </button>
      </div>
    </div>
    <div class="modal-backdrop" onclick="document.getElementById('modal-root').innerHTML = ''"></div>
  </div>
`

export const clearModal = () => html`<div id="modal-root" hx-swap-oob="innerHTML"></div>`
