FROM node:20-slim

WORKDIR /app

# Habilitar Corepack para usar yarn
RUN corepack enable && corepack prepare yarn@1.22.22 --activate

# Copiar arquivos de dependências primeiro (para cache do Docker)
COPY package.json yarn.lock ./

# Instalar dependências usando yarn
RUN yarn install --frozen-lockfile

# Copiar resto dos arquivos
COPY . .

EXPOSE 3000

CMD ["yarn", "start"]

