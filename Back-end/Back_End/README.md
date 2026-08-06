# GPSD Backend - Spring Boot Application

A complete Spring Boot backend application for the GPSD (2nd Year Software Project) with User management, REST APIs, and comprehensive error handling.

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Project Architecture](#project-architecture)

## Prerequisites

- **Java 21** or higher
- **Gradle 8.0** or higher
- **MySQL 8.0** or higher
- **Git**

## Project Structure

```
src/
├── main/
│   ├── java/
│   │   └── com/example/back_end/
│   │       ├── BackEndApplication.java       # Main Spring Boot application
│   │       ├── config/                       # Configuration classes
│   │       │   └── SecurityConfig.java       # Security & Password Encoder
│   │       ├── controller/                   # REST Controllers
│   │       │   └── UserController.java       # User API endpoints
│   │       ├── service/                      # Business Logic
│   │       │   └── UserService.java          # User service
│   │       ├── repository/                   # Data Access Layer
│   │       │   └── UserRepository.java       # User repository
│   │       ├── entity/                       # JPA Entities
│   │       │   └── User.java                 # User entity
│   │       ├── dto/                          # Data Transfer Objects
│   │       │   ├── UserDTO.java              # User response DTO
│   │       │   └── UserCreateDTO.java        # User request DTO
│   │       └── exception/                    # Exception Handling
│   │           ├── ResourceNotFoundException.java
│   │           ├── DuplicateResourceException.java
│   │           ├── ErrorResponse.java
│   │           └── GlobalExceptionHandler.java
│   └── resources/
│       └── application.properties             # Application configuration
└── test/
    └── java/
        └── com/example/back_end/
            ├── UserServiceTest.java           # Unit tests
            └── UserControllerTest.java        # Integration tests
```

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Back-end/Back_End
```

### 2. Create MySQL Database
```sql
CREATE DATABASE gpsd_project;
USE gpsd_project;
```

### 3. Update Database Configuration

Edit `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/gpsd_project
spring.datasource.username=root
spring.datasource.password=your_password
```

### 4. Install Dependencies

The Gradle build will automatically download all dependencies defined in `build.gradle`.

## Configuration

### Application Properties

**File:** `src/main/resources/application.properties`

```properties
# Application Name
spring.application.name=Back_End

# MySQL Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/gpsd_project
spring.datasource.username=root
spring.datasource.password=password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update          # Creates/Updates tables automatically
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.properties.hibernate.format_sql=true

# Server Configuration
server.port=8080

# Logging Configuration
logging.level.root=INFO
logging.level.com.example.back_end=DEBUG
```

**Configuration Options:**
- `ddl-auto=update`: Automatically creates/updates schema
- `ddl-auto=create-drop`: Creates schema, drops on shutdown (dev only)
- `ddl-auto=validate`: Only validates schema (production)
- `ddl-auto=none`: No automatic schema handling

## Running the Application

### Using Gradle (Recommended)

```bash
./gradlew bootRun
```

### Using Java Command

```bash
./gradlew build
java -jar build/libs/Back_End-0.0.1-SNAPSHOT.jar
```

### Application will start at:
```
http://localhost:8080
```

## API Endpoints

### User Management

#### 1. Create User
```
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response: 201 CREATED
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "isActive": true,
  "createdAt": "2024-07-08 10:30:00",
  "updatedAt": "2024-07-08 10:30:00"
}
```

#### 2. Get User by ID
```
GET /api/users/{id}

Response: 200 OK
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "isActive": true,
  "createdAt": "2024-07-08 10:30:00",
  "updatedAt": "2024-07-08 10:30:00"
}
```

#### 3. Get User by Email
```
GET /api/users/email/{email}

Response: 200 OK
```

#### 4. Get All Active Users
```
GET /api/users

Response: 200 OK
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "isActive": true,
    "createdAt": "2024-07-08 10:30:00",
    "updatedAt": "2024-07-08 10:30:00"
  }
]
```

#### 5. Update User
```
PUT /api/users/{id}
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "newpassword123"
}

Response: 200 OK
```

#### 6. Delete User
```
DELETE /api/users/{id}

Response: 204 NO CONTENT
```

#### 7. Deactivate User
```
PATCH /api/users/{id}/deactivate

Response: 200 OK
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "isActive": false,
  "createdAt": "2024-07-08 10:30:00",
  "updatedAt": "2024-07-08 10:30:00"
}
```

### Error Responses

#### 404 Not Found
```json
{
  "status": 404,
  "message": "User not found with ID: 999",
  "error": "Resource Not Found",
  "timestamp": "2024-07-08 10:35:00",
  "details": null
}
```

#### 409 Conflict (Duplicate Email)
```json
{
  "status": 409,
  "message": "User with email john@example.com already exists",
  "error": "Duplicate Resource",
  "timestamp": "2024-07-08 10:35:00",
  "details": null
}
```

#### 400 Bad Request (Validation Error)
```json
{
  "status": 400,
  "message": "Validation failed",
  "error": "Validation Error",
  "timestamp": "2024-07-08 10:35:00",
  "details": {
    "email": "Email should be valid",
    "password": "Password must be at least 6 characters"
  }
}
```

## Testing

### Run All Tests
```bash
./gradlew test
```

### Run Specific Test Class
```bash
./gradlew test --tests UserServiceTest
./gradlew test --tests UserControllerTest
```

### Run with Coverage
```bash
./gradlew test jacocoTestReport
```

### Test Files

1. **UserServiceTest** - Unit tests for UserService
   - Tests user creation, retrieval, update, deletion
   - Tests exception handling
   - Uses mocking for repository layer

2. **UserControllerTest** - Integration tests for API endpoints
   - Tests HTTP requests/responses
   - Tests status codes
   - Tests JSON serialization

## Project Architecture

### Layered Architecture

```
┌─────────────────────────────┐
│   REST Controller Layer      │ (UserController)
│   - HTTP Request Handling    │
│   - Request Validation       │
│   - Response Mapping         │
└─────────────────────────────┘
           ↓
┌─────────────────────────────┐
│   Service Layer             │ (UserService)
│   - Business Logic          │
│   - Transaction Management  │
│   - Error Handling          │
└─────────────────────────────┘
           ↓
┌─────────────────────────────┐
│   Repository Layer          │ (UserRepository)
│   - Database Operations     │
│   - JPA Query Methods       │
│   - CRUD Operations         │
└─────────────────────────────┘
           ↓
┌─────────────────────────────┐
│   Database Layer            │
│   - MySQL Database          │
│   - Tables & Relationships  │
└─────────────────────────────┘
```

### Key Technologies

- **Spring Boot 4.1.0** - Web framework
- **Spring Data JPA** - Database access
- **Spring Security** - Password encoding
- **MySQL Connector** - Database driver
- **Lombok** - Reduce boilerplate code
- **Jakarta Validation** - Input validation
- **JUnit 5** - Testing framework
- **Mockito** - Mocking framework

### Design Patterns Used

1. **MVC Pattern** - Separation of concerns
2. **Repository Pattern** - Data access abstraction
3. **Service Locator Pattern** - Service injection
4. **DTO Pattern** - Data transfer between layers
5. **Exception Handling Pattern** - Global error handling

## Dependencies

**Main Dependencies:**
- `spring-boot-starter-data-jpa` - Database access
- `spring-boot-starter-security` - Security features
- `spring-boot-starter-web` - Web development
- `spring-boot-starter-validation` - Input validation
- `mysql-connector-j` - MySQL driver
- `lombok` - Code generation

**Test Dependencies:**
- `spring-boot-starter-test` - Testing utilities
- `spring-security-test` - Security testing

## Contributing

### Before Pushing Code
1. Run tests: `./gradlew test`
2. Build project: `./gradlew build`
3. Check for errors: `./gradlew check`

### Code Style
- Use Lombok annotations to reduce boilerplate
- Follow Spring naming conventions
- Write meaningful commit messages

## Troubleshooting

### Database Connection Issues
```
Error: Access denied for user 'root'@'localhost'
Solution: Check username/password in application.properties
```

### Port Already in Use
```
Error: Address already in use: PORT 8080
Solution: Change port in application.properties or kill process using port 8080
```

### Build Failures
```
Solution: Run ./gradlew clean build
```

## Future Enhancements

- [ ] JWT Authentication
- [ ] Role-Based Access Control (RBAC)
- [ ] Email verification
- [ ] Password reset functionality
- [ ] API Documentation (Swagger/OpenAPI)
- [ ] Caching (Redis)
- [ ] Pagination and Filtering
- [ ] Audit logging

## License

This project is part of the GPSD 2nd Year Software Project.

## Support

For issues or questions, please refer to the project documentation or contact the development team.
