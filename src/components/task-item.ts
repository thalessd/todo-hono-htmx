import { html } from 'hono/html'

type TaskItemProps = {
  checked?: boolean
  label: string
  meta: string
  status: string
}

export const taskItem = ({ checked = false, label, meta, status }: TaskItemProps) => {
  const titleClass = checked ? 'text-base-content/50 line-through' : ''
  const checkedAttribute = checked ? 'checked' : ''

  return html`
    <li class="flex items-center gap-4 border-b border-base-300 px-5 py-4 last:border-b-0">
      <input type="checkbox" ${checkedAttribute} class="checkbox checkbox-primary" />
      <div class="min-w-0 flex-1">
        <p class="truncate font-medium ${titleClass}">${label}</p>
        <p class="text-sm text-base-content/55">${meta}</p>
      </div>
      <span class="badge badge-outline whitespace-nowrap">${status}</span>
    </li>
  `
}
