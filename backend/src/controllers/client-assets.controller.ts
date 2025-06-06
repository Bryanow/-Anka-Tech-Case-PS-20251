// src/controllers/clientAsset.controller.ts
import { FastifyRequest, FastifyReply } from "fastify"
import { createClientAssetSchema, updateClientAssetSchema } from "../validators/client-assets.validator"
import { ClientAssetModel } from "../models/client-assets.model"
import { ClientModel } from "../models/client.model"
import { prisma } from "../utils/prisma"


export const ClientAssetController = {

  async create(request: FastifyRequest, reply: FastifyReply) {
    const parsed = createClientAssetSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send(parsed.error)
    }

    const { clientId, assetId, quantity } = parsed.data

    try {
      const clientExists = await ClientModel.findById(clientId)
      if (!clientExists) {
        return reply.status(404).send({ error: "Client not found." })
      }

      const assetExists = await prisma.asset.findUnique({ where: { id: assetId } })
      if (!assetExists) {
        return reply.status(404).send({ error: "Asset not found." })
      }


      const clientAsset = await ClientAssetModel.create({ clientId, assetId, quantity })
      return reply.status(201).send(clientAsset)
    } catch (err) {
      console.error(err)
      return reply.status(500).send({ error: "Error on creating client asset allocation." })
    }
  },

  async listByClient(request: FastifyRequest<{ Params: { clientId: string } }>, reply: FastifyReply) {
    const clientId = Number(request.params.clientId)

    if (isNaN(clientId) || clientId <= 0) {
      return reply.status(400).send({ error: "Invalid client ID." })
    }

    try {
      const clientExists = await ClientModel.findById(clientId)
      if (!clientExists) {
        return reply.status(404).send({ error: "Client not found." })
      }

      const clientAssets = await ClientAssetModel.findByClientId(clientId)
      return reply.send(clientAssets)
    } catch (err) {
      console.error(err)
      return reply.status(500).send({ error: "Error on getting client asset allocations." })
    }
  },

  async update(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const parsed = updateClientAssetSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send(parsed.error)
    }

    const id = Number(request.params.id)
    if (isNaN(id) || id <= 0) {
      return reply.status(400).send({ error: "Invalid allocation ID." })
    }

    try {
      const allocationExists = await ClientAssetModel.findById(id)
      if (!allocationExists) {
        return reply.status(404).send({ error: "Asset allocation not found." })
      }

      const updated = await ClientAssetModel.update(id, parsed.data)
      return reply.send(updated)
    } catch (err) {
      console.error(err)
      return reply.status(500).send({ error: "Error on updating client asset allocation." })
    }
  },

  async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const id = Number(request.params.id)
    if (isNaN(id) || id <= 0) {
      return reply.status(400).send({ error: "Invalid allocation ID." })
    }

    try {
      const allocationExists = await ClientAssetModel.findById(id)
      if (!allocationExists) {
        return reply.status(404).send({ error: "Asset allocation not found." })
      }

      await ClientAssetModel.delete(id)
      return reply.status(204).send()
    } catch (err) {
      console.error(err)
      return reply.status(500).send({ error: "Error on deleting client asset allocation." })
    }
  }
}