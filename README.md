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
- **Docker** and **Docker Compose**

## Clone the Repository

```bash
git clone <repo-url>
cd <repo-name>
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

Your Postgres database will now be available at localhost:5432.

To stop it later:

```bash
docker compose down
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
