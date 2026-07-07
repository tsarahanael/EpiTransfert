FROM maven:3.9.16-eclipse-temurin-21-alpine AS build

WORKDIR /src

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests


FROM eclipse-temurin:21.0.11_10-jre-ubi10-minimal

WORKDIR /app

ENV LANGUAGE='en_US:en'

COPY --from=build --chown=185 /src/target/*.jar /app/app.jar

EXPOSE 8080
USER 185

ENTRYPOINT ["java", "-jar", "/app/app.jar"]