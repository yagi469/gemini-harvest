# --- Build Stage ---
# Use an official Maven image to build the application
FROM maven:3.9.6-eclipse-temurin-17 AS build

# Set the working directory
WORKDIR /app

# Copy the POM file and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the rest of the application source code
COPY src ./src

# ★★★★★ ここを修正 ★★★★★
# Package the application AND ensure it is an executable "fat" JAR
RUN mvn package -DskipTests spring-boot:repackage

# --- Run Stage ---
# Use a slim JRE image for the final application
FROM eclipse-temurin:17-jre-jammy

# Set the working directory
WORKDIR /app

# Copy the built JAR from the build stage
COPY --from=build /app/target/harvest-app-0.0.1-SNAPSHOT.jar app.jar

# Expose the application port
EXPOSE 8081

# Set the entrypoint to run the application
# (デバッグ用のENTRYPOINTは、問題が解決したら元に戻してもOKです)
ENTRYPOINT ["java", "-Dserver.port=${PORT}", "-Dspring.datasource.url=${JAKARTA_PERSISTENCE_JDBC_URL}", "-Dspring.datasource.username=${JAKARTA_PERSISTENCE_JDBC_USER}", "-Dspring.datasource.password=${JAKARTA_PERSISTENCE_JDBC_PASSWORD}", "-jar", "app.jar"]
