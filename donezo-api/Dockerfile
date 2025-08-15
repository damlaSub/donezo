# Use Java 21 base image
FROM eclipse-temurin:21-jdk

# Set working directory
WORKDIR /app

# Copy Maven wrapper and project files
COPY mvnw pom.xml ./
COPY .mvn .mvn
COPY src ./src

# Give execute permission to mvnw
RUN chmod +x mvnw

# Build the project (skip tests in CI/CD)
RUN ./mvnw clean package -DskipTests

# Copy the built jar
COPY target/*.jar app.jar

# Expose port 8080
EXPOSE 8080

# Run the app
ENTRYPOINT ["java","-jar","app.jar"]
