# Use a imagem oficial do Bun como base (com prefixo do Docker Hub para compatibilidade com Podman/Docker)
FROM docker.io/oven/bun:alpine AS builder
WORKDIR /app

# Copia arquivos de dependência
COPY package.json bun.lock ./

# Instala todas as dependências (incluindo devDependencies para build do Tailwind/CSS)
RUN bun install --frozen-lockfile

# Copia o restante do código fonte
COPY . .

# Compila os assets de produção (CSS/JS)
RUN bun run build

# Limpa dependências de desenvolvimento para reduzir o tamanho da imagem final
RUN rm -rf node_modules && bun install --frozen-lockfile --production

# Imagem final de execução
FROM docker.io/oven/bun:alpine AS runner
WORKDIR /app

# Copia dependências de produção, assets gerados e código fonte
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./package.json

# Expõe a porta padrão
EXPOSE 3000

# Variáveis de ambiente padrão
ENV PORT=3000
ENV NODE_ENV=production

# Comando para iniciar o servidor
CMD ["bun", "run", "start"]
