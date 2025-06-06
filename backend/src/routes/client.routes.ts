import { FastifyInstance } from "fastify"
import { ClientController } from "../controllers/client.controller"

export async function clientRoutes(app: FastifyInstance) {
  app.post("/clients", ClientController.create)
  app.get("/clients", ClientController.list)
  app.put("/clients/:id", ClientController.update)
}
