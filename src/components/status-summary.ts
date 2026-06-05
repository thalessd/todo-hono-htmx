import { html } from 'hono/html'

import { statCard } from './stat-card'

export const statusSummary = () => html`
  <div class="grid gap-4 md:grid-cols-3">
    ${statCard({ label: 'Abertas', value: '08', tone: 'badge-info' })}
    ${statCard({ label: 'Em foco', value: '03', tone: 'badge-warning' })}
    ${statCard({ label: 'Finalizadas', value: '14', tone: 'badge-success' })}
  </div>
`
