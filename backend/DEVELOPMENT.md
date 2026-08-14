# GPSD Backend Development Guide

## Quick Start

### 1. Prerequisites
- Java 21+
- Gradle 8.0+
- MySQL 8.0+

### 2. Database Setup
```bash
# Create database
mysql -u root -p
CREATE DATABASE gpsd_project;
EXIT;
```

### 3. Configure Application
Edit `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/gpsd_project
spring.datasource.username=root
spring.datasource.password=your_password
```

### 4. Run Application
```bash
./gradlew bootRun
```

Server runs at: `http://localhost:8080`

## Docker Setup (Alternative)

### Run with Docker Compose
```bash
docker-compose up -d
```

This automatically sets up:
- MySQL database
- Spring Boot application
- Network connectivity

### Stop Services
```bash
docker-compose down
```

## Development Workflow

### Build Project
```bash
./gradlew build
```

### Run Tests
```bash
./gradlew test
```

### Run Specific Tests
```bash
./gradlew test --tests UserServiceTest
```

### Clean Build
```bash
./gradlew clean build
```

### Run with Development Tools
```bash
./gradlew bootRun
# Enables hot reload on code changes
```

## Project Features

### Implemented
✅ User Management (CRUD)
✅ REST API endpoints
✅ Database persistence with JPA
✅ Password encryption with BCrypt
✅ Input validation
✅ Global exception handling
✅ Logging configuration
✅ Unit and integration tests
✅ Docker support

### To Add
- [ ] JWT Authentication
- [ ] Role-based access control
- [ ] Pagination
- [ ] API documentation (Swagger)
- [ ] Caching
- [ ] Email notifications

## Testing API Endpoints

### Using cURL

#### Create User
```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Get All Users
```bash
curl -X GET http://localhost:8080/api/users
```

#### Get User by ID
```bash
curl -X GET http://localhost:8080/api/users/1
```

#### Update User
```bash
curl -X PUT http://localhost:8080/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "newpassword123"
  }'
```

#### Delete User
```bash
curl -X DELETE http://localhost:8080/api/users/1
```

### Using Postman
1. Import the provided Postman collection (if available)
2. Set base URL to `http://localhost:8080`
3. Create requests for each endpoint
4. Test with various payloads

## Common Issues

### Issue: Connection Refused to MySQL
**Solution:**
- Check MySQL is running
- Verify connection details in `application.properties`
- Ensure database `gpsd_project` exists

### Issue: Port 8080 Already in Use
**Solution:**
```bash
# Change port in application.properties
server.port=8081
```

### Issue: Build Failures
**Solution:**
```bash
./gradlew clean build --refresh-dependencies
```

## Code Organization

### Packages
- **entity** - JPA entities
- **repository** - Data access layer
- **service** - Business logic
- **controller** - REST endpoints
- **dto** - Data transfer objects
- **exception** - Custom exceptions
- **config** - Spring configuration

### Naming Conventions
- Controllers: `*Controller`
- Services: `*Service`
- Repositories: `*Repository`
- DTOs: `*DTO`
- Entities: Plain class names

## Best Practices

1. **Always validate input** - Use @Valid annotations
2. **Use DTOs** - Don't expose entities directly
3. **Log properly** - Use @Slf4j and log levels
4. **Handle exceptions** - Use global exception handler
5. **Write tests** - Maintain good test coverage
6. **Document APIs** - Add JavaDoc and comments
7. **Use transactions** - Mark service methods with @Transactional

## Next Steps

1. Implement authentication/authorization
2. Add API documentation with Swagger
3. Implement pagination and filtering
4. Add caching layer
5. Set up CI/CD pipeline
6. Deploy to cloud platform

## Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA Guide](https://spring.io/projects/spring-data-jpa)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Gradle Documentation](https://gradle.org/guides/)
