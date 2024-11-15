# Utiliza una imagen base de Node.js
FROM node:23.0.0-alpine3.20

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia el package.json y el package-lock.json al contenedor
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto de los archivos del proyecto al contenedor
COPY . .

# Construye la aplicación para producción
RUN npm run build

# Expone el puerto en el que la aplicación se ejecutará
EXPOSE 4173

# Comando para ejecutar la aplicación
CMD ["npm", "run", "preview"]