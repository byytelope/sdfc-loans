# Project Setup Guide

This monorepo contains two applications:

- **apps/client** — Next.js client
- **apps/server** — Hono.js API server

It uses **PostgreSQL** (via Docker) and **Bun** as the package manager and
runtime.

---

## Prerequisites

Make sure the following are installed on your system:

- [**Bun**](https://bun.sh)
- [**Node.js**](https://nodejs.org)
- **Docker** and **Docker Compose**

## Clone the Repository

```bash
git clone git@github.com:byytelope/sdfc-loans.git
cd sdfc-loans
```

## Setup the Database

The project uses a local Postgres container for the database. Create a file
named docker-compose.yml in the project root with the following content:

```yaml
version: "3.8"
services:
    db:
        image: postgres:latest
        container_name: sdfc-db
        environment:
            POSTGRES_USER: postgres
            POSTGRES_PASSWORD: postgres
            POSTGRES_DB: sdfc_db
        ports:
            - "5432:5432"
        volumes:
            - ./pgdata:/var/lib/postgresql/data
```

Then start the database with:

```bash
docker compose up -d
```

Your Postgres database will now be available at `localhost:5432`.

To stop it later:

```bash
docker compose down
```

## Initializing and Seeding the Database

SQL files for database initialization [init.sql](apps/server/migrations/init.sql) and data seeding [seed.sql](apps/server/migrations/seed.sql) are located in `apps/server/migrations/`.

After starting the Postgres container, you must run these files in order to first create the tables and then populate them with data.

**1. Initialize the Database Schema:** This command runs `init.sql` to create all the necessary tables.

```bash
cat apps/server/migrations/init.sql | docker exec -i sdfc-db psql -U postgres -d sdfc_db
```

**2. Initialize the Database Schema:** This command runs `seed.sql` to populate the tables with initial data (including test users).

```bash
cat apps/server/migrations/seed.sql | docker exec -i sdfc-db psql -U postgres -d sdfc_db
```

## Environment Variables

`apps/client/.env`

```bash
API_URL=http://localhost:8000
JWT_SECRET=your_jwt_secret_here
```

`apps/server/.env`

```bash
JWT_SECRET=your_jwt_secret_here
PGUSER=postgres
PGPASSWORD=postgres
PGHOST=localhost
PGPORT=5432
PGDATABASE=sdfc_db
```

## Install Dependencies and Running the Servers

Run the following command **in the project root** to install all dependencies.

```bash
bun i
```

Run the following command **in the project root** to run both the Next.js and
Hono servers.

```bash
bun dev
```

Now visit [localhost:3000](http://localhost:3000) to access the web client.

## Available Logins

After seeding, you can log in with the following credentials (or create your own accounts from [/signup](http://localhost:3000/signup)):

| Role  | Email               | Password  |
| ----- | ------------------- | --------- |
| Admin | admin@sdfc.com      | admin123  |
| User  | alice@example.com   | dababy123 |
| User  | bob@example.com     | dababy123 |
| User  | charlie@example.com | dababy123 |
