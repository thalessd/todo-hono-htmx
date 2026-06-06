import { Database } from 'bun:sqlite'

export type Todo = {
  id: number
  title: string
  notes: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

type TodoRow = {
  id: number
  title: string
  notes: string
  completed: number
  created_at: string
  updated_at: string
}

export type TodoStats = {
  total: number
  active: number
  completed: number
}

const db = new Database(':memory:')

db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    notes TEXT NOT NULL DEFAULT '',
    completed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`)

const toTodo = (row: TodoRow): Todo => ({
  id: row.id,
  title: row.title,
  notes: row.notes,
  completed: row.completed === 1,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

const listStatement = db.query<TodoRow, []>(`
  SELECT id, title, notes, completed, created_at, updated_at
  FROM todos
  ORDER BY completed ASC, id DESC
`)

const findStatement = db.query<TodoRow, [number]>(`
  SELECT id, title, notes, completed, created_at, updated_at
  FROM todos
  WHERE id = ?
`)

const createStatement = db.query<{ id: number }, [string, string]>(`
  INSERT INTO todos (title, notes)
  VALUES (?, ?)
  RETURNING id
`)

const updateStatement = db.query<TodoRow, [string, string, number]>(`
  UPDATE todos
  SET title = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
  WHERE id = ?
  RETURNING id, title, notes, completed, created_at, updated_at
`)

const toggleStatement = db.query<TodoRow, [number]>(`
  UPDATE todos
  SET completed = CASE completed WHEN 1 THEN 0 ELSE 1 END,
      updated_at = CURRENT_TIMESTAMP
  WHERE id = ?
  RETURNING id, title, notes, completed, created_at, updated_at
`)

const deleteStatement = db.query<{ id: number }, [number]>(`
  DELETE FROM todos
  WHERE id = ?
  RETURNING id
`)

const statsStatement = db.query<{ total: number; completed: number }, []>(`
  SELECT
    COUNT(*) AS total,
    COALESCE(SUM(completed), 0) AS completed
  FROM todos
`)

export const listTodos = (): Todo[] => listStatement.all().map(toTodo)

export const getTodo = (id: number): Todo | undefined => {
  const row = findStatement.get(id)
  return row ? toTodo(row) : undefined
}

export const createTodo = (title: string, notes: string): Todo => {
  const result = createStatement.get(title, notes)

  if (!result) {
    throw new Error('Failed to create todo')
  }

  const todo = getTodo(result.id)

  if (!todo) {
    throw new Error('Failed to read created todo')
  }

  return todo
}

export const updateTodo = (id: number, title: string, notes: string): Todo | undefined => {
  const row = updateStatement.get(title, notes, id)
  return row ? toTodo(row) : undefined
}

export const toggleTodo = (id: number): Todo | undefined => {
  const row = toggleStatement.get(id)
  return row ? toTodo(row) : undefined
}

export const deleteTodo = (id: number): boolean => Boolean(deleteStatement.get(id))

export const getTodoStats = (): TodoStats => {
  const row = statsStatement.get() ?? { total: 0, completed: 0 }

  return {
    total: row.total,
    completed: row.completed,
    active: row.total - row.completed,
  }
}

export const resetTodos = () => {
  db.exec('DELETE FROM todos; DELETE FROM sqlite_sequence WHERE name = "todos";')
}
