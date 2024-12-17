# Шаг 1: Сборка фронтенда
FROM node:18-alpine AS build-frontend
WORKDIR /app
COPY FRONT/package*.json ./
RUN npm install
COPY FRONT/ ./
RUN npm run build

# Шаг 2: Сборка бэкенда
FROM gradle:7.6-jdk17 AS build-backend
WORKDIR /app
COPY BACK/task-back/ ./  

# Копируем собранный фронтенд в ресурсы бэкенда
COPY --from=build-frontend /app/build ./src/main/resources/static

# Собираем Spring Boot проект
RUN chmod +x ./gradlew
RUN ./gradlew build -x test

# Шаг 3: Финальный образ
FROM openjdk:17 AS runtime
WORKDIR /app
COPY --from=build-backend /app/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
