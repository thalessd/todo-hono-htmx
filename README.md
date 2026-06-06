# TODO Hono HTMX

Este repositório é um código de exemplo para demonstrar uma TODO List server-rendered usando Bun, Hono, HTMX, SQLite em memória, Tailwind CSS e daisyUI.

O objetivo é mostrar como essas tecnologias podem trabalhar juntas em um projeto pequeno, sem SPA, sem JSX e sem persistência real em arquivo. Este projeto não é uma base pronta para produção.

## Tecnologias

- **Bun**: runtime, package manager, bundler e test runner.
- **Bun SQLite**: banco SQLite em memória via `bun:sqlite`.
- **Hono**: servidor HTTP e rotas.
- **HTMX**: interações no navegador por atributos HTML e respostas HTML parciais.
- **Tailwind CSS v4**: geração do CSS.
- **daisyUI**: componentes de interface e tema visual.
- **TypeScript**: tipagem do código, incluindo tipos de Bun e `typed-htmx`.

## Funcionalidades

- Criar tarefas com título e notas.
- Listar tarefas a partir do SQLite em memória.
- Marcar e desmarcar tarefas como concluídas.
- Editar tarefas em uma modal renderizada pelo servidor.
- Excluir tarefas.
- Atualizar a interface com HTMX, recebendo HTML parcial em vez de JSON.

Como o banco usa `:memory:`, todos os dados são perdidos quando o servidor reinicia.

## Requisitos

- Bun instalado.

Instale as dependências:

```sh
bun install
```

## Como Rodar

Gere os assets locais e inicie o servidor:

```sh
bun run dev
```

Por padrão, o servidor usa:

```text
http://localhost:3000
```

Também é possível definir outra porta:

```sh
PORT=3001 bun run dev
```

## Comandos

```sh
bun run build
```

Gera o CSS do Tailwind/daisyUI e o bundle local do HTMX.

```sh
bun run typecheck
```

Executa a checagem de tipos com `tsc --noEmit`.

```sh
bun test
```

Executa a suíte de testes com `bun:test`.

## Estrutura

```text
src/
  client.ts              # Entrada do bundle do navegador; importa htmx.org
  index.ts               # App Hono e rotas HTML/HTMX
  server.ts              # Entry point do servidor Bun
  styles.css             # Tailwind CSS v4 e tema daisyUI
  layouts/
    app-page.ts          # Documento HTML completo
  todos/
    repository.ts        # Acesso ao SQLite em memória
    views.ts             # Partials e componentes HTML server-rendered
  index.test.ts          # Testes do app e das rotas
```

## Observações

- As rotas retornam HTML com `c.html(...)`.
- Os templates usam `html` de `hono/html`.
- O HTMX é instalado como `htmx.org` e empacotado em `/assets/app.js`.
- O projeto não usa JSX ou arquivos `.tsx`.
- Arquivos em `public/assets/` são gerados por `bun run build` e não devem ser editados manualmente.
- A persistência é propositalmente temporária para manter o exemplo simples.
