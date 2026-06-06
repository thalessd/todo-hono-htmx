import { afterEach, describe, expect, test } from 'bun:test'

import { resolveAssets } from './assets'

const manifestPath = '/tmp/todo-hono-htmx-assets-manifest.json'

afterEach(async () => {
  await Bun.file(manifestPath)
    .delete()
    .catch(() => undefined)
})

describe('resolveAssets', () => {
  test('returns stable development asset paths without a manifest', () => {
    expect(resolveAssets({ manifestPath, mode: 'development' })).toEqual({
      css: '/assets/app.css',
      js: '/assets/app.js',
    })
  })

  test('returns stable development asset paths even when a manifest exists', async () => {
    await Bun.write(
      manifestPath,
      JSON.stringify({
        css: '/assets/app.abc123.css',
        js: '/assets/app.abc123.js',
      }),
    )

    expect(resolveAssets({ manifestPath, mode: 'development' })).toEqual({
      css: '/assets/app.css',
      js: '/assets/app.js',
    })
  })

  test('returns hashed production asset paths from a valid manifest', async () => {
    await Bun.write(
      manifestPath,
      JSON.stringify({
        css: '/assets/app.abc123.css',
        js: '/assets/app.def456.js',
      }),
    )

    expect(resolveAssets({ manifestPath, mode: 'production' })).toEqual({
      css: '/assets/app.abc123.css',
      js: '/assets/app.def456.js',
    })
  })

  test('falls back to stable paths when the production manifest is invalid', async () => {
    await Bun.write(manifestPath, JSON.stringify({ css: '/assets/app.abc123.css' }))

    expect(resolveAssets({ manifestPath, mode: 'production' })).toEqual({
      css: '/assets/app.css',
      js: '/assets/app.js',
    })
  })
})
