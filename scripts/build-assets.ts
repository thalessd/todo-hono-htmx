import { createHash } from 'node:crypto'
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

type AssetMode = 'development' | 'production'

const assetsDir = './public/assets'
const tempDir = `/tmp/todo-hono-htmx-assets-${process.pid}`
const mode = parseMode(Bun.argv)

const run = (cmd: string[]) => {
  const result = Bun.spawnSync({
    cmd,
    stdout: 'inherit',
    stderr: 'inherit',
  })

  if (result.exitCode !== 0) {
    throw new Error(`Command failed: ${cmd.join(' ')}`)
  }
}

function parseMode(argv: string[]): AssetMode {
  if (argv.includes('--production')) {
    return 'production'
  }

  if (argv.includes('--development')) {
    return 'development'
  }

  return 'development'
}

const hashFile = async (path: string) => {
  const content = await readFile(path)
  return createHash('sha256').update(content).digest('hex').slice(0, 12)
}

const cleanGeneratedProductionAssets = async () => {
  await mkdir(assetsDir, { recursive: true })

  const entries = await readdir(assetsDir).catch(() => [])
  const generatedAssetPattern = /^app\.[a-f0-9]{8,}\.(css|js)$/

  await Promise.all(
    entries.map(async (entry) => {
      if (generatedAssetPattern.test(entry) || entry === 'manifest.json') {
        await rm(join(assetsDir, entry), { force: true })
      }
    }),
  )
}

const buildCss = (outfile: string, minify: boolean) => {
  const command = ['./node_modules/.bin/tailwindcss', '-i', './src/styles.css', '-o', outfile]

  if (minify) {
    command.push('--minify')
  }

  run(command)
}

const buildJs = (outfile: string, minify: boolean) => {
  const command = ['bun', 'build', './src/client.ts', '--outfile', outfile, '--target', 'browser']

  if (minify) {
    command.push('--minify')
  }

  run(command)
}

const buildDevelopmentAssets = async () => {
  await cleanGeneratedProductionAssets()
  buildCss(`${assetsDir}/app.css`, false)
  buildJs(`${assetsDir}/app.js`, false)
}

const buildProductionAssets = async () => {
  await cleanGeneratedProductionAssets()
  await rm(tempDir, { force: true, recursive: true })
  await mkdir(tempDir, { recursive: true })

  const tempCss = `${tempDir}/app.css`
  const tempJs = `${tempDir}/app.js`

  try {
    buildCss(tempCss, true)
    buildJs(tempJs, true)

    const cssHash = await hashFile(tempCss)
    const jsHash = await hashFile(tempJs)
    const cssFile = `app.${cssHash}.css`
    const jsFile = `app.${jsHash}.js`

    await Bun.write(`${assetsDir}/${cssFile}`, Bun.file(tempCss))
    await Bun.write(`${assetsDir}/${jsFile}`, Bun.file(tempJs))
    await writeFile(
      `${assetsDir}/manifest.json`,
      JSON.stringify(
        {
          css: `/assets/${cssFile}`,
          js: `/assets/${jsFile}`,
        },
        null,
        2,
      ),
    )
  } finally {
    await rm(tempDir, { force: true, recursive: true })
  }
}

if (mode === 'production') {
  await buildProductionAssets()
} else {
  await buildDevelopmentAssets()
}
