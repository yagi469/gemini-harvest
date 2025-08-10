# Use an official OpenJDK runtime as a parent image
FROM eclipse-temurin:17-jre-jammy

# Set the working directory in the container
WORKDIR /app

# Copy the fat jar into the container
# The JAR_FILE_PATH argument is set by the build command
ARG JAR_FILE_PATH=target/harvest-app-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE_PATH} app.jar

# Make port 8081 available to the world outside this container
EXPOSE 8081

# Run the jar file
ENTRYPOINT ["java", "-jar", "app.jar"]
