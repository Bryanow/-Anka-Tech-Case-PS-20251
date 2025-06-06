// src/routes/asset.routes.ts
import { FastifyInstance } from "fastify"
import { AssetController } from "../controllers/assets.controller"

export async function assetRoutes(app: FastifyInstance) {
  app.get("/assets", AssetController.listFixedAssets)
}