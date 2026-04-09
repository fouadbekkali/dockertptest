# 1. Khtar l'image dyal Node.js
FROM node:18

# 2. Dossier dyal l'khma l-dakhel f l'container
WORKDIR /app

# 3. Copier package.json bach n-installiw l'maktabat
COPY package*.json ./
RUN npm install

# 4. Copier l'code dyal l'backend kamel
COPY . .

# 5. L'port li khdam fih l'backend
EXPOSE 8002

# 6. L'commande bach y-demarri l'serveur
CMD ["node", "server.js"]