# Task Management API

A robust Task Management REST API built with Node.js, Express, PostgreSQL, and Redis. This application provides user authentication and task management capabilities with caching for improved performance.

## Features

- **User Authentication**: Secure registration and login using JWT and bcrypt.
- **Task Management**: Create, read, update, and delete tasks.
- **Database**: Persistent storage using PostgreSQL with Sequelize ORM.
- **Caching**: Redis integration for caching task data to reduce database load (Default TTL: 60s).
- **Security**:
    -   Password hashing.
    -   Protected routes.
    -   **Rate Limiting**: Login attempts are limited to 10 per minute.
    -   **Short-lived Sessions**: Tokens and cache expire in 60 seconds by default for enhanced security.
-   **Input Validation**: Robust data validation using Zod schemas.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)

## Installation

1.  **Clone the repository:**

    ```bash
    git clone <https://github.com/Gaurav215Rawat/Task-Management.git>
    cd Task-Management
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

## Configuration

1.  **Create a `.env` file** in the root directory. You can use the example below as a template:

    ```env
    PORT=3000
    DATABASE_URL=postgres://<username>:<password>@localhost:5432/<database_name>
    REDIS_HOST=127.0.0.1
    REDIS_PORT=6379
    REDIS_PASSWORD=<your_redis_password>
    JWT_SECRET=<your_jwt_secret>
    NODE_ENV=development
    
    # Expiration Settings (Defaults to 60s if not set)
    JWT_EXPIRES_IN=60s
    CACHE_TTL=60
    ```

    *Note: Ensure your PostgreSQL database is created and accessible via the `DATABASE_URL`.*

## Database Setup

This project uses Sequelize for database management.

1.  **Run Migrations:**

    To create the necessary tables in your database, run:

    ```bash
    npx sequelize-cli db:migrate
    ```

    *Alternatively, you can use the npm script:*

    ```bash
    npm run sequelize db:migrate
    ```

## Running the Application

1.  **Development Mode:**

    Starts the server with `nodemon` for auto-reloading during development.

    ```bash
    npm run dev
    ```

2.  **Production Mode:**

    Starts the server using `node`.

    ```bash
    npm start
    ```

    The server will start on the port specified in your `.env` file (default: 3000).

## API Endpoints

### Testing with Postman

A Postman collection is included in the repository to help you test the API endpoints easily.

1.  **Open Postman**.
2.  **Click "Import"** in the top left corner.
3.  **Drag and drop** the `Task Management.postman_collection.json` file (located in the root directory) into the import window.
4.  **Configure Environment**:
    -   The collection may use variables like `{{base_url}}` (e.g., `http://localhost:3000`) or `{{token}}`.
    -   Ensure you update these variables in Postman or replace them with your actual values.

### Authentication

-   **POST /auth/register**
    -   Register a new user.
    -   Body: `{ "name": "John Doe", "email": "john@example.com", "password": "password123" }`
    -   *Validation*: Name (min 3), Email (valid), Password (min 6).

-   **POST /auth/login**
    -   Login and receive a JWT token.
    -   Body: `{ "email": "john@example.com", "password": "password123" }`
    -   *Rate Limit*: Max 10 attempts per 5 minutes per IP.

-   **POST /auth/logout**
    -   Logout the user.
    -   **Requires Authentication**: Bearer token in header.

### Tasks

*All task endpoints require a valid JWT token in the `Authorization` header (Bearer token).*

-   **POST /tasks**
    -   Create a new task.
    -   Body: `{ "title": "Buy groceries", "description": "Milk, Bread, Eggs" }`
    -   *Validation*: Title is required.

-   **GET /tasks**
    -   Get all tasks for the authenticated user.

-   **PUT /tasks/:id**
    -   Update a task by ID.
    -   Body: `{ "status": "in_progress" }`
    -   *Validation*: Status must be one of `pending`, `in_progress`, `completed`.

-   **DELETE /tasks/:id**
    -   Delete a task by ID.

## Project Structure

```
.
├── src
│   ├── config          # Database and Redis configuration
│   ├── controllers     # Request handlers
│   ├── middlewares     # Auth, Rate Limiting, and Validation middlewares
│   ├── migrations      # Database migrations
│   ├── models          # Sequelize models (User, Task)
│   ├── routes          # API route definitions
│   ├── services        # Business logic (if applicable)
│   ├── utils           # Utility functions (Validations, JWT)
│   └── app.js          # App entry point
├── .env                # Environment variables
├── package.json        # Project dependencies and scripts
└── README.md           # Project documentation
```
