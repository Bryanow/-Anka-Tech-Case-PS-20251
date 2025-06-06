// src/routes/clientAsset.routes.ts
import { FastifyInstance } from "fastify"
import { ClientAssetController } from "../controllers/client-assets.controller"

export async function clientAssetRoutes(app: FastifyInstance) {
  app.post("/allocations", ClientAssetController.create)

  app.get("/clients/:clientId/allocations", ClientAssetController.listByClient)

  app.put("/allocations/:id", ClientAssetController.update)

  app.delete("/allocations/:id", ClientAssetController.delete)
}