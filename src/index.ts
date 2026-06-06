import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { html } from 'hono/html'

import { isHashedAssetPath, resolveAssets } from './assets'
import { appPage } from './layouts/app-page'
import {
  createTodo,
  deleteTodo,
  getTodo,
  getTodoStats,
  listTodos,
  toggleTodo,
  updateTodo,
} from './todos/repository'
import { clearModal, deleteTodoModal, editTodoModal, todoApp } from './todos/views'

const app = new Hono()

app.use(
  '/assets/*',
  serveStatic({
    root: './public',
    onFound: (_path, c) => {
      if (isHashedAssetPath(c.req.path)) {
        c.header('Cache-Control', 'public, immutable, max-age=31536000')
        return
      }

      c.header('Cache-Control', 'no-cache')
    },
  }),
)

const readTodoForm = async (request: Request) => {
  const form = await request.formData()
  const title = String(form.get('title') ?? '').trim()
  const notes = String(form.get('notes') ?? '').trim()

  return { title, notes }
}

const renderTodoApp = (error?: string) => {
  return todoApp({
    todos: listTodos(),
    stats: getTodoStats(),
    error,
  })
}

const parseId = (value: string) => {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : undefined
}

app.get('/', (c) => {
  return c.html(
    appPage({
      assets: resolveAssets(),
      todos: listTodos(),
      stats: getTodoStats(),
    }),
  )
})

app.post('/todos', async (c) => {
  const { title, notes } = await readTodoForm(c.req.raw)

  if (!title) {
    return c.html(renderTodoApp('Informe um título para criar a tarefa.'), 400)
  }

  createTodo(title, notes)

  return c.html(renderTodoApp())
})

app.patch('/todos/:id/toggle', (c) => {
  const id = parseId(c.req.param('id'))

  if (!id || !toggleTodo(id)) {
    return c.text('Tarefa não encontrada', 404)
  }

  return c.html(renderTodoApp())
})

app.get('/todos/:id/edit', (c) => {
  const id = parseId(c.req.param('id'))
  const todo = id ? getTodo(id) : undefined

  if (!todo) {
    return c.text('Tarefa não encontrada', 404)
  }

  return c.html(editTodoModal(todo))
})

app.get('/todos/:id/delete', (c) => {
  const id = parseId(c.req.param('id'))
  const todo = id ? getTodo(id) : undefined

  if (!todo) {
    return c.text('Tarefa não encontrada', 404)
  }

  return c.html(deleteTodoModal(todo))
})

app.put('/todos/:id', async (c) => {
  const id = parseId(c.req.param('id'))
  const todo = id ? getTodo(id) : undefined

  if (!id || !todo) {
    return c.text('Tarefa não encontrada', 404)
  }

  const { title, notes } = await readTodoForm(c.req.raw)

  if (!title) {
    return c.html(editTodoModal(todo, 'Informe um título para salvar a tarefa.'), 400)
  }

  updateTodo(id, title, notes)

  return c.html(html`${renderTodoApp()}${clearModal()}`)
})

app.delete('/todos/:id', (c) => {
  const id = parseId(c.req.param('id'))

  if (!id || !deleteTodo(id)) {
    return c.text('Tarefa não encontrada', 404)
  }

  return c.html(html`${renderTodoApp()}${clearModal()}`)
})

export default app
