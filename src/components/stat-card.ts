import { html } from 'hono/html'

type StatCardProps = {
  label: string
  value: string
  tone: string
}

export const statCard = ({ label, value, tone }: StatCardProps) => html`
  <article class="card border border-base-300 bg-base-100 shadow-sm">
    <div class="card-body gap-3 p-5">
      <span class="text-sm font-medium text-base-content/60">${label}</span>
      <div class="flex items-end justify-between gap-4">
        <strong class="text-3xl font-semibold tracking-normal">${value}</strong>
        <span class="badge ${tone}">hoje</span>
      </div>
    </div>
  </article>
`
