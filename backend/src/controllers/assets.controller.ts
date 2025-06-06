// src/controllers/asset.controller.ts
import { FastifyRequest, FastifyReply } from "fastify"

export const AssetController = {
  async listFixedAssets(_: FastifyRequest, reply: FastifyReply) {
    try {
      const fixedAssets = [
        { id: 1, name: "Ação XYZ", value: 50.25 },
        { id: 2, name: "Fundo ABC", value: 120.00 },
        { id: 3, name: "CDB DEF", value: 105.50 },
        { id: 4, name: "Tesouro Direto Selic", value: 10.50 },
        { id: 5, name: "Bitcoin", value: 60000.00 },
      ]
      return reply.send(fixedAssets)
    } catch (err) {
      return reply.status(500).send({ error: "Error on getting fixed assets." })
    }
  }
}