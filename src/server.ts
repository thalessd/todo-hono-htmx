import app from './index'

export default {
  port: Number(Bun.env.PORT ?? 3000),
  fetch: app.fetch,
}
