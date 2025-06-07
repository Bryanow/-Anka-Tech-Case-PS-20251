import { FastifyInstance } from "fastify";
import { ClientAssetController } from "../controllers/client-assets.controller";

export async function clientAssetRoutes(app: FastifyInstance) {
  // Route to create a new client asset allocation (POST /client-assets)
  app.post("/client-assets", ClientAssetController.create);
  // Route to list assets allocated to a specific client (GET /clients/:id/allocations)
  app.get("/clients/:id/allocations", ClientAssetController.listByClient);
  // Route to update a client asset allocation (PUT /client-assets/:id)
  app.put("/client-assets/:id", ClientAssetController.update); // Assuming you want update route too
  // Route to delete a client asset allocation by its ID (DELETE /client-assets/:id)
  app.delete("/client-assets/:id", ClientAssetController.delete);
}