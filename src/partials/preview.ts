import { html } from 'hono/html'

export const emptyPreview = () => html`
  <div class="alert alert-info items-start rounded-md">
    <span class="mt-1 h-2.5 w-2.5 rounded-full bg-info-content"></span>
    <div>
      <h2 class="font-semibold">Prévia htmx</h2>
      <p class="text-sm">Envie o formulário para trocar este conteúdo sem recarregar a página.</p>
    </div>
  </div>
`

export const previewFragment = () => html`
  <div class="alert alert-success items-start rounded-md">
    <span class="mt-1 h-2.5 w-2.5 rounded-full bg-success-content"></span>
    <div>
      <h3 class="font-semibold">Prévia atualizada</h3>
      <p class="text-sm">
        Este painel veio de um fragmento HTML servido pelo Hono e trocado pelo htmx.
      </p>
    </div>
  </div>
`
