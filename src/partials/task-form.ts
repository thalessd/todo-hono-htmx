import { html } from 'hono/html'

export const taskForm = () => html`
  <form
    class="card border border-base-300 bg-base-100 shadow-sm"
    hx-post="/partials/preview"
    hx-target="#preview-panel"
    hx-swap="innerHTML"
  >
    <div class="card-body gap-4 p-5">
      <div>
        <h2 class="card-title text-lg">Adicionar tarefa</h2>
        <p class="text-sm text-base-content/60">Formulário visual para o fluxo principal.</p>
      </div>
      <label class="form-control">
        <span class="label">
          <span class="label-text">Título</span>
        </span>
        <input name="title" type="text" placeholder="Revisar backlog" class="input input-bordered" />
      </label>
      <label class="form-control">
        <span class="label">
          <span class="label-text">Prioridade</span>
        </span>
        <select name="priority" class="select select-bordered">
          <option>Alta</option>
          <option>Média</option>
          <option>Baixa</option>
        </select>
      </label>
      <div class="card-actions justify-end">
        <button type="submit" class="btn btn-primary">Atualizar prévia</button>
      </div>
    </div>
  </form>
`
