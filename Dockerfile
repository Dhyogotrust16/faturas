# Usar Node.js 18 Alpine
FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código da aplicação
COPY . .

# Criar diretórios necessários
RUN mkdir -p database uploads

# Expor porta
EXPOSE 5000

# Comando para iniciar a aplicação
CMD ["node", "backend/server.js"]
