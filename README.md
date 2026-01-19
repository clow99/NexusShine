# NexusShine
Next.js app for OHSA washroom cleaning compliance across multiple sites.

NexusShine manages cleaning tasks, inspections, and related entities (branches, locations, bathrooms, users) with schedules and tracking. It also supports iPad-based cleaning record displays posted outside washrooms.

The app exposes a set of REST-like API endpoints for CRUD operations and uses a relational database (via Prisma) to persist data such as users, branches, locations, bathrooms, and tasks.

## Features

- **Branch & Location Management** – Create and manage branches and their associated locations.
- **Bathroom Management** – Track bathrooms by location, including metadata and status.
- **Task Management** – Define and update cleaning tasks and assign them to locations/bathrooms.
- **Inspections & Cleaning** – Trigger inspections, reminders, and cleaning operations via dedicated endpoints.
- **User Management** – Manage users and roles; some operations require admin privileges.
- **Settings & Theme** – Adjust application settings and theme via API.
- **Authentication** – NextAuth-based authentication endpoints under `/api/auth`.

## Tech Stack

- **Framework**: Next.js 16
- **Language**: JavaScript / React 19
- **Auth**: NextAuth with `@auth/prisma-adapter`
- **ORM**: Prisma (`@prisma/client`)
- **Database**: MySQL (via `mysql2`)
- **Styling**: Tailwind CSS 4
- **Email**: Nodemailer, Resend
- **Utilities**: Axios, date-fns, bcryptjs

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm
- A running MySQL-compatible database
- A valid `DATABASE_URL` connection string

### Installation

```bash
# Clone the repository
git clone https://github.com/clow99/NexusShine.git
cd NexusShine

# Install dependencies
npm install
```

### Environment Variables

Use `env.local.example` as a reference and create your own `.env.local` file in the project root:

```env
# Database connection string (required)
DATABASE_URL="mysql://user:password@localhost:3306/mydb"

# Add any other variables from env.local.example here
# NEXTAUTH_SECRET="your-nextauth-secret"
# NEXTAUTH_URL="http://localhost:3000"
# EMAIL_PROVIDER_API_KEY="your-email-key"
```

Do not commit `.env.local` or any real secrets to version control.

### Database Setup (Prisma)

After configuring `DATABASE_URL`, initialize and sync the database schema:

```bash
# Generate Prisma client (if needed)
npx prisma generate

# Push schema to the database
npx prisma db push

# Optional: open Prisma Studio to inspect data
npx prisma studio
```

### Run Locally

```bash
# Start the development server
npm run dev

# Build for production
npm run build

# Start the production server
npm run start
```

By default, the app will be available at `http://localhost:3000`.

## Project Structure

A simplified view of the main structure:

```bash
.
├─ src/
│  ├─ app/
│  │  ├─ api/
│  │  │  ├─ auth/
│  │  │  │  └─ [...nextauth]/route.js
│  │  │  ├─ bathrooms/route.js
│  │  │  ├─ branches/route.js
│  │  │  ├─ clean/route.js
│  │  │  ├─ inspection/
│  │  │  │  ├─ route.js
│  │  │  │  ├─ clear/route.js
│  │  │  │  └─ remind/route.js
│  │  │  ├─ locations/route.js
│  │  │  ├─ settings/route.js
│  │  │  ├─ tasks/route.js
│  │  │  ├─ theme/route.js
│  │  │  ├─ users/route.js
│  │  │  └─ validate/route.js
│  │  └─ (app pages and layouts)
├─ public/
├─ docs/
├─ env.local.example
└─ README.md
```

## Routes

High-level API route overview:

| Path                        | Methods                  | Description                        |
|-----------------------------|--------------------------|------------------------------------|
| `/api/auth/:...nextauth`   | GET                      | Authentication routes (NextAuth).  |
| `/api/bathrooms`           | GET, POST, PATCH, DELETE | Manage bathrooms.                  |
| `/api/branches`            | GET, POST, PATCH, DELETE | Manage branches.                   |
| `/api/clean`               | POST                     | Trigger cleaning operations.       |
| `/api/inspection`          | POST                     | Handle inspections.                |
| `/api/inspection/clear`    | POST                     | Clear inspection status.           |
| `/api/inspection/remind`   | POST                     | Send inspection reminders.         |
| `/api/locations`           | GET, POST, PATCH, DELETE | Manage locations.                  |
| `/api/settings`            | GET, PATCH               | Manage application settings.       |
| `/api/tasks`               | GET, POST, PATCH, DELETE | Manage tasks.                      |
| `/api/theme`               | PATCH                    | Change application theme.          |
| `/api/users`               | GET, POST, PATCH, DELETE | Manage users.                      |
| `/api/validate`            | POST                     | Validate user codes.               |

## API Endpoints

### Auth

- `GET /api/auth/:...nextauth` – NextAuth handler for login, callbacks, sessions, etc.

### Users

- `GET /api/users` – List users.
- `POST /api/users` – Create a new user.
- `PATCH /api/users` – Update an existing user.
- `DELETE /api/users` – Delete a user.

Admin privileges are required for some operations.

### Branches

- `GET /api/branches` – List branches.
- `POST /api/branches` – Create a branch.
- `PATCH /api/branches` – Update a branch.
- `DELETE /api/branches` – Delete a branch.

### Locations

- `GET /api/locations` – List locations.
- `POST /api/locations` – Create a location.
- `PATCH /api/locations` – Update a location.
- `DELETE /api/locations` – Delete a location.

### Bathrooms

- `GET /api/bathrooms` – List bathrooms.
- `POST /api/bathrooms` – Create a bathroom.
- `PATCH /api/bathrooms` – Update a bathroom.
- `DELETE /api/bathrooms` – Delete a bathroom.

### Tasks

- `GET /api/tasks` – List tasks.
- `POST /api/tasks` – Create a task.
- `PATCH /api/tasks` – Update a task.
- `DELETE /api/tasks` – Delete a task.

### Inspections & Cleaning

- `POST /api/clean` – Trigger cleaning-related logic.
- `POST /api/inspection` – Create or process an inspection.
- `POST /api/inspection/clear` – Clear inspection status.
- `POST /api/inspection/remind` – Send inspection reminders.

### Settings & Theme

- `GET /api/settings` – Get application settings.
- `PATCH /api/settings` – Update settings.
- `PATCH /api/theme` – Change the application theme (restricted to predefined themes).

### Validation

- `POST /api/validate` – Validate user codes or tokens.

## Security Notes

- Never commit `.env.local` or any real secrets (database passwords, API keys, NextAuth secrets) to the repository.
- Ensure `DATABASE_URL` points to a secure database instance with appropriate access controls.
- Admin-only endpoints should be protected via authentication and authorization checks.
- When deploying, set `NEXTAUTH_SECRET` and any email provider keys as environment variables in your hosting platform.

## Development

Common npm scripts:

```bash
# Run dev server
npm run dev

# Lint the codebase
npm run lint

# Run tests
npm test

# Smoke test (lint + basic tests)
npm run smoke

# Build for production
npm run build

# Start production server
npm start
```

## Docker

A `.dockerignore` file is present. If you add a `Dockerfile`, a typical workflow would be:

```bash
# Build image
docker build -t nexusshine .

# Run container
docker run -p 3000:3000 --env-file .env.local nexusshine
```

Adjust image name, ports, and env handling to match your actual Docker setup.

## License

If this project is intended to be open source, add a `LICENSE` file at the repository root and mention the license here (e.g., MIT, Apache-2.0).