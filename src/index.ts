import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'

import { appPage } from './layouts/app-page'
import { previewFragment } from './partials/preview'

const app = new Hono()

app.use('/assets/*', serveStatic({ root: './public' }))

app.get('/', (c) => {
  return c.html(appPage())
})

app.post('/partials/preview', (c) => {
  return c.html(previewFragment())
})

export default app
