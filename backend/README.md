# Task Management Portal — Backend API

Production-ready REST API backend for the Task Management Portal built with **Node.js**, **Express.js**, **MongoDB**, and **Mongoose**.

## Tech Stack

- Node.js
- Express.js
- MongoDB & Mongoose
- dotenv
- cors
- morgan
- express-validator
- JWT Authentication
- bcryptjs

## Project Structure

```
backend/
├── src/
│   ├── index.js                 # Server entry point
│   ├── app.js                   # Express app configuration
│   ├── constants.js             # Shared constants
│   ├── db/
│   │   └── index.js             # MongoDB connection
│   ├── models/
│   │   ├── user.model.js        # User schema
│   │   └── task.model.js        # Task schema
│   ├── controllers/
│   │   ├── auth.controller.js   # Auth handlers
│   │   └── task.controller.js   # Task handlers
│   ├── routes/
│   │   ├── auth.routes.js       # Auth routes
│   │   └── task.routes.js       # Task routes
│   ├── middlewares/
│   │   ├── auth.middleware.js   # JWT protection
│   │   ├── error.middleware.js  # Centralized error handling
│   │   ├── validate.middleware.js
│   │   └── validators/
│   │       ├── auth.validator.js
│   │       └── task.validator.js
│   └── utils/
│       ├── ApiError.js
│       ├── ApiResponse.js
│       ├── asyncHandler.js
│       ├── formatUser.js
│       └── formatTask.js
├── .env.example
└── package.json
```

## Setup Instructions

### 1. Prerequisites

- Node.js 18+
- MongoDB running locally or a MongoDB Atlas connection string

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Environment Configuration

Copy the example environment file and update values:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: `8000`) |
| `MONGODB_URI` | MongoDB connection URI |
| `ACCESS_TOKEN_SECRET` | Secret key for JWT signing |
| `ACCESS_TOKEN_EXPIRY` | JWT expiry (e.g. `7d`, `1h`) |
| `CORS_ORIGIN` | Allowed frontend origin (e.g. `http://localhost:5173`) |

### 4. Run the Server

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

Health check: `GET http://localhost:8000/api/health`

### 5. Connect the Frontend

In the frontend folder, create `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

Then start the frontend dev server.

---

## API Documentation

Base URL: `http://localhost:8000/api`

All protected routes require:

```
Authorization: Bearer <token>
```

### Authentication

#### Register User

```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response `201`:**

```json
{
  "token": "jwt-token",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "...",
    "bio": "Hello! I am a new user."
  }
}
```

#### Login User

```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response `200`:** Same shape as register.

#### Get Profile

```http
GET /auth/profile
Authorization: Bearer <token>
```

#### Update Profile

```http
PUT /auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "bio": "Product manager",
  "password": "newpassword123"
}
```

---

### Task Management

#### Create Task

```http
POST /tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Design login page",
  "description": "Create responsive login UI with validation and error states.",
  "status": "pending",
  "priority": "high",
  "dueDate": "2026-06-30"
}
```

#### Get All Tasks

Supports search, pagination, sorting, and filtering.

```http
GET /tasks?page=1&limit=10&search=login&status=completed&sort=createdAt
Authorization: Bearer <token>
```

| Query Param | Description |
|-------------|-------------|
| `page` | Page number (default: `1`) |
| `limit` | Items per page (default: `10`) |
| `search` | Search by title or description |
| `status` | Filter: `pending`, `in progress`, `completed`, or `all` |
| `priority` | Filter: `low`, `medium`, `high`, or `all` |
| `sort` | Sort field (`createdAt`, `dueDate`, `priority`); prefix with `-` for desc |
| `sortBy` | Alternative sort field (frontend compatible) |
| `sortOrder` | `asc` or `desc` |

**Response `200`:**

```json
{
  "tasks": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalTasks": 25,
    "totalPages": 3
  },
  "stats": {
    "total": 25,
    "pending": 10,
    "inProgress": 8,
    "completed": 7
  }
}
```

#### Dashboard Statistics

```http
GET /tasks/stats
Authorization: Bearer <token>
```

**Response `200`:**

```json
{
  "totalTasks": 25,
  "pendingTasks": 10,
  "inProgressTasks": 8,
  "completedTasks": 7
}
```

#### Get Single Task

```http
GET /tasks/:id
Authorization: Bearer <token>
```

#### Update Task

```http
PUT /tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "status": "in progress"
}
```

#### Mark Task Complete

```http
PATCH /tasks/:id/complete
Authorization: Bearer <token>
```

#### Delete Task

```http
DELETE /tasks/:id
Authorization: Bearer <token>
```

**Response `200`:**

```json
{
  "success": true
}
```

---

## Validation Rules

| Field | Rule |
|-------|------|
| `title` | Required |
| `description` | Required, minimum 20 characters |
| `status` | Must be `pending`, `in progress`, or `completed` |
| `priority` | Must be `low`, `medium`, or `high` |
| `email` | Valid email format |
| `password` | Minimum 6 characters |

## Error Responses

```json
{
  "success": false,
  "message": "Description must be at least 20 characters",
  "errors": []
}
```

Common status codes:

- `400` — Validation error
- `401` — Unauthorized
- `404` — Resource not found
- `409` — Conflict (e.g. email already registered)
- `500` — Internal server error

---

## Architecture Highlights

- **MVC pattern** — routes, controllers, and models are separated
- **Async/await** with reusable `asyncHandler`
- **Centralized error handling** via `error.middleware.js`
- **JWT authentication** with Bearer token support
- **Password hashing** using bcryptjs
- **Input validation** using express-validator
- **Request logging** using morgan
- **Environment-based configuration** using dotenv

---

## Suggested Git Commits

1. Initial backend setup
2. Added MongoDB connection
3. Implemented authentication
4. Implemented task CRUD APIs
5. Added search pagination filtering
6. Added dashboard statistics
7. Added validation and error handling
8. Updated documentation

---

## License

ISC
