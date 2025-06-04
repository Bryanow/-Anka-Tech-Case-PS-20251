# Backend - AnkaTechCase

This is a simple backend using [Fastify](https://www.fastify.io/), [Prisma ORM](https://www.prisma.io/), and MySQL for client management.

## Project Structure

```
backend/
  .env
  docker-compose.yml
  package.json
  tsconfig.json
  prisma/
    schema.prisma
    migrations/
  src/
    index.ts
    controllers/
    entities/
    models/
    routes/
    utils/
    validators/
fronend/ in progress...
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) (for running the MySQL database)

## Database Setup

The project uses a MySQL database, easily started via Docker Compose.

1. **Start the database:**

   In the project root, run:
   ```sh
   docker-compose up -d
   ```

   This will create a MySQL container accessible at `localhost:3307`.

2. **Configure environment variables:**

   The `.env` file is already set up to connect to the Docker Compose database:
   ```
   DATABASE_URL="mysql://user:password@localhost:3307/ankadb"
   ```

## Installing Dependencies

In the `backend` folder, run:

```sh
npm install
```
or
```sh
yarn install
```

## Running Migrations

Before starting the backend, run Prisma migrations to create the tables:

```sh
npx prisma migrate deploy
```

## Generating Prisma Client

If needed, generate the Prisma client:

```sh
npx prisma generate
```

## Running the Backend

To run in development mode (with auto-reload):

```sh
npx ts-node-dev src/index.ts
```

Or to build and run:

```sh
npm run build
node dist/index.js
```

The backend will be available at [http://localhost:3001](http://localhost:3001).

## Endpoints

- `POST /clients` - Create a new client
- `GET /clients` - List all clients
- `PUT /clients/:id` - Update an existing client

## Entity Structure

See the model in [`prisma/schema.prisma`](prisma/schema.prisma).

## Notes

- The `.env` file **should not be versioned** (already in `.gitignore`).
- The project uses [Zod](https://zod.dev/) for data validation.
- Prisma Client is initialized in [`src/utils/prisma.ts`](src/utils/prisma.ts).

## Useful Scripts

- `docker-compose up -d` - Start the MySQL database
- `npx prisma migrate deploy` - Apply migrations to the database
- `npx ts-node-dev src/index.ts` - Start the backend in dev mode

---

Feel free to open issues or pull requests!
