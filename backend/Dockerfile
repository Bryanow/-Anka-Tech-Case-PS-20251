# Usa uma imagem base do Node.js
FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos package.json e package-lock.json (ou yarn.lock)
# antes de copiar todo o código para otimizar o cache do Docker
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia todo o código da aplicação para o diretório de trabalho
COPY . .

# Gera os arquivos do Prisma Client
# Adicione --schema src/prisma/schema.prisma
RUN npx prisma generate --schema src/prisma/schema.prisma

# Constrói o projeto TypeScript
RUN npm run build

# Expõe a porta em que o Fastify irá rodar
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]