#!/bin/sh

# This script is no longer needed for debugging.
# We will now directly execute the application with command-line arguments.

exec java -jar harvest-app-0.0.1-SNAPSHOT.jar \
     --server.port=${PORT} \
     --spring.datasource.url=${SPRING_DATASOURCE_URL} \
     --spring.datasource.username=${SPRING_DATASOURCE_USERNAME} \
     --spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}
