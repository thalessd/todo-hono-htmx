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

Em desenvolvimento, gere assets com nomes estáveis e inicie o servidor:

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

Para simular a execução de produção depois de gerar assets com hash:

```sh
bun run build
bun run start
```

## Comandos

```sh
bun run build
```

Gera assets de produção com hash de conteúdo e `public/assets/manifest.json`.

```sh
bun run build:dev
```

Gera assets estáveis de desenvolvimento em `/assets/app.css` e `/assets/app.js`.

```sh
bun run build:prod
```

Gera assets de produção em `/assets/app.<hash>.css` e `/assets/app.<hash>.js`.

```sh
bun run start
```

Inicia o servidor com `NODE_ENV=production`, fazendo o HTML usar os assets do manifest.

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
  assets.ts              # Resolução de assets dev/prod
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
- Em desenvolvimento, os assets usam nomes estáveis para evitar um arquivo novo a cada reload.
- Em produção, os assets usam hash no nome e podem ser servidos com cache longo. Para isso, rode o servidor com `NODE_ENV=production` ou use `bun run start`.
- O projeto não usa JSX ou arquivos `.tsx`.
- Arquivos em `public/assets/` são gerados por `bun run build:dev` ou `bun run build:prod` e não devem ser editados manualmente.
- A persistência é propositalmente temporária para manter o exemplo simples.
