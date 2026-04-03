# Finance Dashboard Backend

Backend API for a finance dashboard application with JWT authentication, role-based access control, financial record management, and MongoDB aggregation-based analytics.

## Project Overview

This project provides a secure REST API for managing financial records and generating dashboard insights for authenticated users. It supports role-based access control for `viewer`, `analyst`, and `admin` users, with user-specific data isolation through `createdBy`.

## Features

- User registration and login with JWT
- Role-based access control for viewer, analyst, and admin
- Financial records CRUD APIs
- Filtering by type, category, and date range
- Dashboard summary analytics using MongoDB aggregation (`$facet`)
- User-specific data isolation
- Admin user-management APIs for listing users, updating roles, and updating status
- Centralized validation and error handling

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
  middlewares/ # JWT auth, role protection, and error handling
  models/      # Mongoose schemas
  routes/      # API route definitions
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

- `POST /api/auth/register`
- `POST /api/auth/login`

### Users (Admin only)

- `GET /api/users`
- `PATCH /api/users/:id/role`
- `PATCH /api/users/:id/status`

### Records

- `POST /api/records`
- `GET /api/records`
- `PUT /api/records/:id`
- `DELETE /api/records/:id`

### Dashboard

- `GET /api/dashboard/summary`

## Role-Based Access Control

- `viewer`: read-only access to records
- `analyst`: read access to records plus dashboard access
- `admin`: full access, including records and user management

## Ownership Policy

- Only `admin` users can create, update, or delete records
- All users can read only their own records
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

- Pagination for records and users
- Search and sorting for record lists
- Monthly trend analytics
- Unit and integration tests

