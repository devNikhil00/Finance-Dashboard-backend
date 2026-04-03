# Finance Dashboard Backend

Backend API for a finance dashboard application with JWT authentication, role-based access control, financial record management, and MongoDB aggregation-based analytics.

This submission is intentionally scoped for assessment: the focus is clear backend design, correct business logic, reliable behavior, and well-explained engineering decisions.

## Project Overview

This project provides a secure REST API for managing financial records and generating dashboard insights for authenticated users. It supports role-based access control for `viewer`, `analyst`, and `admin` users, with user-specific data isolation through `createdBy`.

## Assessment Focus

- Prioritized readability and separation of concerns over unnecessary complexity
- Kept business rules explicit in route guards and controller logic
- Standardized API responses and centralized error handling for predictable behavior
- Added practical reliability features (validation, rate limiting, inactive-user checks)

## Features

- User registration and login with JWT
- Role-based access control for viewer, analyst, and admin
- Financial records CRUD APIs
- Filtering by type, category, and date range
- Pagination and search for records and users
- Dashboard summary analytics using MongoDB aggregation (`$facet`)
- User-specific data isolation
- Admin user-management APIs for listing users, updating roles, and updating status
- API rate limiting
- Centralized validation and error handling
- Basic automated tests

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- dotenv

## Project Structure

```text
src/
  config/      # Database configuration
  controllers/ # Business logic for auth, users, records, and dashboard
  middlewares/ # JWT auth, role protection, rate limiting, and error handling
  models/      # Mongoose schemas
  routes/      # API route definitions
  tests/       # Basic automated tests
  utils/       # Shared helpers such as asyncHandler and AppError
  app.js       # Express app setup
  server.js    # Server bootstrap
```

## Setup Instructions

1. Clone the repository

```bash
git clone <repository-url>
cd <project-folder>
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the project root

4. Start the server

```bash
npm run dev
```

For production:

```bash
npm start
```

5. Run automated tests

```bash
npm test
```

## Environment Variables

| Variable | Description |
| --- | --- |
| `PORT` | Server port |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWT tokens |

Example `.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/finance_dashboard
JWT_SECRET=replace_with_a_strong_secret
JWT_EXPIRES_IN=7d
```

## API Endpoints

### Auth

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive a JWT token

### Users (Admin only)

- `GET /api/users` - List all users
- `PATCH /api/users/:id/role` - Update user role
- `PATCH /api/users/:id/status` - Update user status

### Records

- `POST /api/records` - Create a record
- `GET /api/records` - Get records with optional filters, pagination, and search
- `PUT /api/records/:id` - Update a record
- `DELETE /api/records/:id` - Delete a record

Record filters:

- `GET /api/records?type=income`
- `GET /api/records?category=food`
- `GET /api/records?startDate=2026-04-01&endDate=2026-04-30`
- `GET /api/records?page=1&limit=10&search=salary`

### Dashboard

- `GET /api/dashboard/summary` - Dashboard totals, category summary, and recent transactions

### Access Summary

- `viewer` -> `GET /api/dashboard/summary`
- `analyst` -> `GET /api/records`, `GET /api/dashboard/summary`
- `admin` -> Full access (`/api/users`, `/api/records`, `/api/dashboard/summary`)

### Authentication Header

Use this header for protected routes:

```text
Authorization: Bearer <your_jwt_token>
```

## API Response Contract

All endpoints return a consistent response envelope:

```json
{
  "success": true,
  "message": "Human-readable message",
  "data": {}
}
```

For handled errors, the same shape is preserved with `success: false` and appropriate HTTP status codes.

## Role-Based Access Control

- `viewer`: dashboard-only access
- `analyst`: read records plus dashboard access
- `admin`: full access, including records and user management

## Ownership Policy

- Only `admin` users can create, update, or delete records
- Only `analyst` and `admin` users can read records
- Data isolation is enforced through the `createdBy` field

## Validation and Reliability

- Request validation for required fields and allowed enums
- ObjectId format checks for route params
- Centralized error mapping for validation errors, duplicate keys, and invalid identifiers
- JWT verification and inactive-user blocking
- Global API rate limiting plus stricter auth-route limiting
- Automated smoke and basic test coverage for core flows

## Key Design Decisions

### Why MongoDB

MongoDB provides flexible document storage and works well for financial records with changing shapes and aggregation needs.

### Why JWT

JWT enables stateless authentication, which is ideal for API-based backends and simplifies protected route handling.

### Why Aggregation Pipelines

MongoDB aggregation, especially `$facet`, allows dashboard totals, category summaries, and recent transactions to be computed efficiently in a single query.

## Assumptions

- Each user can access only their own records
- Admin users have elevated privileges
- No frontend is included in this project

## Tradeoffs

- Kept implementation lightweight and interview-friendly instead of introducing additional layers (for example, service/repository abstraction) that are not required for this scope
- Focused tests on critical business paths and reliability checks rather than full end-to-end suite depth
- Chose practical security defaults suitable for assignment context; production deployments should additionally include secret rotation, stronger input schemas, and expanded observability

## Quick Evaluator Checklist

- Start app: `npm run dev`
- Health check: `GET /api/health`
- Register and login to obtain JWT
- Validate RBAC:
  - `viewer`: dashboard only
  - `analyst`: records read + dashboard
  - `admin`: records write + user management
- Confirm error handling:
  - Invalid ID returns `400`
  - Missing token returns `401`
  - Unauthorized role returns `403`
  - Unknown route returns `404`
- Run tests: `npm test`

## Future Improvements

- Monthly trend analytics
- Full integration test coverage for all endpoint combinations
- Soft delete for records
- API documentation collection for Postman
