import { FastifyRequest, FastifyReply } from "fastify"
import { createClientSchema, updateClientSchema } from "../validators/ClientValidator"
import { ClientModel } from "../models/ClientModel"

export const ClientController = {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const parsed = createClientSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send(parsed.error)
    }

    try {
      const client = await ClientModel.create({ ...parsed.data, status: true })
      return reply.status(201).send(client)
    } catch (err) {
      return reply.status(500).send({ error: "Error on create client." })
    }
  },

  async list(_: FastifyRequest, reply: FastifyReply) {
    try {
      const clients = await ClientModel.findAll()
      return reply.send(clients)
    } catch (err) {
      return reply.status(500).send({ error: "Error on get clients" })
    }
  },

  async update(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const parsed = updateClientSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send(parsed.error)
    }

    const id = Number(request.params.id)

    try {
      const updated = await ClientModel.update(id, parsed.data)
      return reply.send(updated)
    } catch (err) {
      return reply.status(500).send({ error: "Error on update client." })
    }
  }
}
