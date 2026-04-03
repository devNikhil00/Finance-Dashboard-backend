# Finance Dashboard Backend

Backend API for a finance dashboard application with JWT authentication, role-based access control, financial record management, and MongoDB aggregation-based analytics.

## Project Overview

This project provides a secure REST API for managing financial records and generating dashboard insights for authenticated users. It supports role-based access control for `viewer`, `analyst`, and `admin` users, with user-specific data isolation through `createdBy`.

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
cd finance-dashboard-backend
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

## Role-Based Access Control

- `viewer`: dashboard-only access
- `analyst`: read records plus dashboard access
- `admin`: full access, including records and user management

## Ownership Policy

- Only `admin` users can create, update, or delete records
- Only `analyst` and `admin` users can read records
- Data isolation is enforced through the `createdBy` field

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

## Future Improvements

- Monthly trend analytics
- Full integration test coverage for all endpoint combinations
- Soft delete for records
- API documentation collection for Postman
