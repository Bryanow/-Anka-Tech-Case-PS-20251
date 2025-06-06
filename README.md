# AnkaTechCase - Client and Financial Asset Management
Project developed as part of the Anka Tech hiring process.  
The application manages **clients** and their **financial asset allocations**, providing both a backend API and a frontend interface, all developed in **TypeScript** and containerized via **Docker**.

👉 [GitHub Repository](https://github.com/Bryanow/-Anka-Tech-Case-PS-20251.git)


## Project Structure
AnkaTechCase/
├── backend/
│   ├── .env
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── package.json
│   ├── tsconfig.json
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── src/
│       ├── app.ts # Main entry point for Fastify
│       ├── controllers/
│       ├── entities/
│       ├── models/
│       ├── routes/
│       ├── utils/
│       └── validators/
├── frontend/
│   ├── package.json
│   ├── next.config.js
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   └── components/
│   └── tsconfig.json
└── README.md # This README file

## Prerequisites

-   [Node.js](https://nodejs.org/) (v18+ recommended)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   [Docker](https://www.docker.com/) (for running the MySQL database and backend service)

## Database & Backend Setup (Docker Compose)

The project uses a MySQL database and the backend service, both easily managed via Docker Compose.

1.  **Navigate to the `backend` directory:**
    ```sh
    cd backend
    ```
    *Ensure you are in the directory containing `docker-compose.yml` and `Dockerfile` for the backend.*

2.  **Build and start the database and backend services:**
    ```sh
    docker-compose up --build -d
    ```
    This command will:
    * Build the `backend` Docker image using the `Dockerfile` located in the current directory (`backend/`).
    * Start the MySQL container, accessible internally by the backend service at `db:3306`.
    * Start the `backend` service, exposing port `3000` from the container to port `3000` on your host machine (`localhost:3000`).

3.  **Database URL Configuration:**
    For the backend service running inside Docker Compose, the `DATABASE_URL` environment variable is defined in `docker-compose.yml` as `mysql://root:root@db:3306/ankadb`, using the internal service name `db`.

    *If you are running the backend application locally (outside Docker Compose), your `.env` file in the `backend` directory should contain:*
    ```
    DATABASE_URL="mysql://user:password@localhost:3307/ankadb"
    ```
    *(This assumes your `db` service in Docker Compose maps its internal port 3306 to 3307 on your host, allowing local connections).*

## Backend Installation & Operations

These steps apply if you are working directly within the `backend` directory (e.g., for local development without Docker Compose for the backend service, or for running Prisma commands).

1.  **Install dependencies:**
    ```sh
    npm install
    ```
2.  **Run Migrations:**
    Before starting the backend, apply Prisma migrations to create the tables in your database:
    ```sh
    npx prisma migrate deploy
    ```
3.  **Generate Prisma Client:**
    If needed (e.g., after schema changes), generate the Prisma client:
    ```sh
    npx prisma generate
    ```
4.  **Run the Backend:**
    * **Development Mode (with auto-reload):**
        ```sh
        npx ts-node-dev src/app.ts
        ```
    * **Build and Run (Production-like):**
        First, ensure your `package.json` in the `backend` directory has a `build` script (e.g., `"build": "tsc"`):
        ```json
        // package.json (in backend/)
        {
          "scripts": {
            "build": "tsc",
            "start": "node dist/app.js",
            // ... other scripts
          }
        }
        ```
        Then run:
        ```sh
        npm run build
        node dist/app.js
        ```
    The backend will be available at [http://localhost:3000](http://localhost:3000).

## Frontend Setup (Next.js)

1.  **Navigate to the `frontend` directory:**
    ```sh
    cd ../frontend
    ```
2.  **Install dependencies:**
    ```sh
    npm install
    ```
3.  **Start the Frontend Development Server:**
    ```sh
    npm run dev
    ```
    The frontend will typically be available at [http://localhost:3000](http://localhost:3000).

4.  **Access the Clients Page:**
    To view the client list, navigate to [http://localhost:3000/clients](http://localhost:3000/clients) in your browser.
    * **Important:** Ensure the API endpoint in your `frontend/src/app/clients/page.tsx` matches your backend configuration (e.g., `http://localhost:3000/clients` if no `/api` prefix is used in the backend).

## Endpoints (Backend)

-   `POST /clients` - Create a new client
-   `GET /clients` - List all clients
-   `PUT /clients/:id` - Update an existing client

## Entity Structure

See the model in [`backend/prisma/schema.prisma`](backend/prisma/schema.prisma).

## Notes

-   The `.env` file **should not be versioned** (already in `.gitignore`).
-   The project uses [Zod](https://zod.dev/) for data validation.
-   Prisma Client is initialized in [`backend/src/utils/prisma.ts`](backend/src/utils/prisma.ts).
-   The frontend uses [ShadCN](https://ui.shadcn.com/) for UI components, [React Query](https://tanstack.com/query/latest) for data fetching, and [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for form handling.

## Useful Scripts

-   **Start All Services (from `AnkaTechCase/backend`):** `docker-compose up -d`
-   **Stop All Services (from `AnkaTechCase/backend`):** `docker-compose down`
-   **Apply Migrations (from `AnkaTechCase/backend`):** `npx prisma migrate deploy`
-   **Start Backend in Dev Mode (from `AnkaTechCase/backend`):** `npx ts-node-dev src/app.ts`
-   **Start Frontend in Dev Mode (from `AnkaTechCase/frontend`):** `npm run dev`

---

Feel free to open issues or pull requests!