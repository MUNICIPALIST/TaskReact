# Шаг 1: Используем официальное Node.js изображение
FROM node:18 as build

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем package.json и package-lock.json в контейнер
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код приложения в контейнер
COPY . .

# Сборка React-приложения
RUN npm run build

# Шаг 2: Используем минимальное изображение Nginx для продакшена
FROM nginx:alpine

# Копируем собранное приложение из предыдущего этапа в папку Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Открываем порт 80 для доступа
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
