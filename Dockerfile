# Etapa 1: Build de la aplicación
FROM node:23.0.0-alpine3.20 AS builder

WORKDIR /app

# Copia archivos de dependencias
COPY package*.json ./

# Instala todas las dependencias (incluidas devDependencies para el build)
RUN npm ci

# Copia el código fuente
COPY . .

# Construye la aplicación para producción
RUN npm run build

# Etapa 2: Imagen ligera solo con los archivos build
FROM alpine:3.20

WORKDIR /app

# Copia los archivos build desde la etapa anterior
COPY --from=builder /app/dist ./dist

# Comando que mantiene el contenedor activo
# (los archivos se copiarán al volumen compartido con nginx)
CMD ["tail", "-f", "/dev/null"]