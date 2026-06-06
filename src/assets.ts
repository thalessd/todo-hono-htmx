import { readFileSync } from 'node:fs'

export type AssetPaths = {
  css: string
  js: string
}

type AssetMode = 'development' | 'production'

type ResolveAssetsOptions = {
  manifestPath?: string
  mode?: AssetMode
}

const fallbackAssets: AssetPaths = {
  css: '/assets/app.css',
  js: '/assets/app.js',
}

const isAssetManifest = (value: unknown): value is AssetPaths => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Record<string, unknown>

  return typeof candidate.css === 'string' && typeof candidate.js === 'string'
}

export const resolveAssets = ({
  manifestPath = Bun.env.ASSET_MANIFEST_PATH ?? './public/assets/manifest.json',
  mode = Bun.env.NODE_ENV === 'production' ? 'production' : 'development',
}: ResolveAssetsOptions = {}): AssetPaths => {
  if (mode !== 'production') {
    return fallbackAssets
  }

  try {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as unknown

    if (!isAssetManifest(manifest)) {
      return fallbackAssets
    }

    return manifest
  } catch {
    return fallbackAssets
  }
}

export const isHashedAssetPath = (path: string) => {
  return /^\/assets\/app\.[a-f0-9]{8,}\.(css|js)$/.test(path)
}
