// backend/src/routes/client.routes.ts
import { FastifyInstance } from "fastify"
import { ClientController } from "../controllers/client.controller"

export async function clientRoutes(app: FastifyInstance) {
  app.post("/clients", ClientController.create)
  app.get("/clients", ClientController.list)
  app.get("/clients/:id", ClientController.findById)
  app.put("/clients/:id", ClientController.update)
}