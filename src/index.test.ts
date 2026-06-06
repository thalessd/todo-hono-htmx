import { beforeEach, describe, expect, test } from 'bun:test'

import app from './index'
import { resetTodos } from './todos/repository'

const submitForm = (fields: Record<string, string>) => {
  const form = new FormData()

  for (const [key, value] of Object.entries(fields)) {
    form.append(key, value)
  }

  return form
}

describe('todo app shell', () => {
  beforeEach(() => {
    resetTodos()
  })

  test('renders an empty todo app with local assets and htmx containers', async () => {
    const response = await app.request('/')
    const html = await response.text()

    expect(response.status).toBe(200)
    expect(response.headers.get('content-type') ?? '').toContain('text/html')
    expect(html).toContain('<!DOCTYPE html>')
    expect(html).toContain('data-theme="todo-editorial"')
    expect(html).toContain('Mesa de tarefas')
    expect(html).toContain('href="/assets/app.css"')
    expect(html).toContain('src="/assets/app.js"')
    expect(html).toContain('id="todo-app"')
    expect(html).toContain('id="modal-root"')
    expect(html).toContain('hx-post="/todos"')
    expect(html).toContain('hx-target="#todo-app"')
    expect(html).toContain('Nenhuma tarefa no quadro')
    expect(html).not.toContain('cdn.jsdelivr.net')
  })

  test('creates a todo from form data and escapes user content', async () => {
    const response = await app.request('/todos', {
      method: 'POST',
      body: submitForm({
        title: '<Revisar backlog>',
        notes: 'Confirmar & priorizar entregas',
      }),
    })
    const html = await response.text()

    expect(response.status).toBe(200)
    expect(html).toContain('&lt;Revisar backlog&gt;')
    expect(html).toContain('Confirmar &amp; priorizar entregas')
    expect(html).toContain('1 tarefa')
    expect(html).toContain('0 concluídas')
    expect(html).toContain('hx-patch="/todos/1/toggle"')
    expect(html).toContain('hx-get="/todos/1/edit"')
    expect(html).toContain('hx-get="/todos/1/delete"')
    expect(html).toContain('hx-target="#modal-root"')
    expect(html).not.toContain('hx-confirm=')
    expect(html).not.toContain('<Revisar backlog>')
  })

  test('rejects a blank title and keeps the empty list', async () => {
    const response = await app.request('/todos', {
      method: 'POST',
      body: submitForm({
        title: '   ',
        notes: 'Sem título',
      }),
    })
    const html = await response.text()

    expect(response.status).toBe(400)
    expect(html).toContain('Informe um título para criar a tarefa.')
    expect(html).toContain('Nenhuma tarefa no quadro')
    expect(html).not.toContain('Sem título')
  })

  test('toggles a todo between active and completed', async () => {
    await app.request('/todos', {
      method: 'POST',
      body: submitForm({ title: 'Fechar release', notes: '' }),
    })

    const response = await app.request('/todos/1/toggle', { method: 'PATCH' })
    const html = await response.text()

    expect(response.status).toBe(200)
    expect(html).toContain('Fechar release')
    expect(html).toContain('checked')
    expect(html).toContain('Concluída')
    expect(html).toContain('1 concluída')
    expect(html).toContain('0 ativas')
  })

  test('returns a daisyUI modal for editing a todo', async () => {
    await app.request('/todos', {
      method: 'POST',
      body: submitForm({ title: 'Escrever notas', notes: 'Contexto inicial' }),
    })

    const response = await app.request('/todos/1/edit')
    const html = await response.text()

    expect(response.status).toBe(200)
    expect(html).toContain('class="modal modal-open"')
    expect(html).toContain('Editar tarefa')
    expect(html).toContain('value="Escrever notas"')
    expect(html).toContain('Contexto inicial')
    expect(html).toContain('hx-put="/todos/1"')
    expect(html).toContain('hx-target="#todo-app"')
    expect(html).toContain('data-testid="edit-todo-fields"')
    expect(html).toContain('class="input input-bordered w-full"')
    expect(html).toContain('class="textarea textarea-bordered h-36 w-full resize-none"')
  })

  test('updates a todo and returns an out-of-band modal clear', async () => {
    await app.request('/todos', {
      method: 'POST',
      body: submitForm({ title: 'Rascunho', notes: 'Antes' }),
    })

    const response = await app.request('/todos/1', {
      method: 'PUT',
      body: submitForm({ title: 'Plano final', notes: 'Depois' }),
    })
    const html = await response.text()

    expect(response.status).toBe(200)
    expect(html).toContain('Plano final')
    expect(html).toContain('Depois')
    expect(html).not.toContain('Rascunho')
    expect(html).toContain('id="modal-root" hx-swap-oob="innerHTML"')
  })

  test('returns a daisyUI modal for confirming todo deletion', async () => {
    await app.request('/todos', {
      method: 'POST',
      body: submitForm({ title: 'Excluir com calma', notes: 'Validar modal' }),
    })

    const response = await app.request('/todos/1/delete')
    const html = await response.text()

    expect(response.status).toBe(200)
    expect(html).toContain('class="modal modal-open"')
    expect(html).toContain('Excluir tarefa')
    expect(html).toContain('Excluir com calma')
    expect(html).toContain('Esta ação não pode ser desfeita.')
    expect(html).toContain('hx-delete="/todos/1"')
    expect(html).toContain('hx-target="#todo-app"')
    expect(html).toContain('hx-swap="outerHTML"')
    expect(html).not.toContain('hx-confirm=')
  })

  test('deletes a todo and returns to the empty state', async () => {
    await app.request('/todos', {
      method: 'POST',
      body: submitForm({ title: 'Remover depois', notes: '' }),
    })

    const response = await app.request('/todos/1', { method: 'DELETE' })
    const html = await response.text()

    expect(response.status).toBe(200)
    expect(html).toContain('Nenhuma tarefa no quadro')
    expect(html).not.toContain('Remover depois')
    expect(html).toContain('0 tarefas')
  })

  test('returns 404 for missing todos', async () => {
    const toggleResponse = await app.request('/todos/404/toggle', { method: 'PATCH' })
    const editResponse = await app.request('/todos/404/edit')
    const deleteModalResponse = await app.request('/todos/404/delete')
    const updateResponse = await app.request('/todos/404', {
      method: 'PUT',
      body: submitForm({ title: 'Ausente', notes: '' }),
    })
    const deleteResponse = await app.request('/todos/404', { method: 'DELETE' })

    expect(toggleResponse.status).toBe(404)
    expect(editResponse.status).toBe(404)
    expect(deleteModalResponse.status).toBe(404)
    expect(updateResponse.status).toBe(404)
    expect(deleteResponse.status).toBe(404)
  })
})
