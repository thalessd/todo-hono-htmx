import { describe, expect, test } from 'bun:test'

import app from './index'

describe('app shell', () => {
  test('renders the static component showcase page', async () => {
    const response = await app.request('/')
    const html = await response.text()

    expect(response.status).toBe(200)
    expect(response.headers.get('content-type') ?? '').toContain('text/html')
    expect(html).toContain('<!DOCTYPE html>')
    expect(html).toContain('data-theme="dark"')
    expect(html).toContain('Painel de tarefas')
    expect(html).toContain('href="/assets/app.css"')
    expect(html).toContain('src="/assets/app.js"')
    expect(html).not.toContain('cdn.jsdelivr.net')
    expect(html).not.toContain('htmx.org@2.0.10')
    expect(html).toContain('hx-post="/partials/preview"')
    expect(html).toContain('hx-target="#preview-panel"')
    expect(html).toContain('class="card')
    expect(html).toContain('class="btn btn-primary')
  })

  test('returns an htmx preview fragment', async () => {
    const response = await app.request('/partials/preview', {
      method: 'POST',
    })
    const html = await response.text()

    expect(response.status).toBe(200)
    expect(response.headers.get('content-type') ?? '').toContain('text/html')
    expect(html).toContain('Prévia atualizada')
    expect(html).toContain('class="alert alert-success')
    expect(html).not.toContain('<!DOCTYPE html>')
  })
})
