import { prisma } from "../utils/prisma"
import { ClientEntity } from "../entities/ClientEntity"

export class ClientModel {
  static async create(data: Omit<ClientEntity, "id" | "createdAt">) {
    return await prisma.client.create({ data })
  }

  static async findAll() {
    return await prisma.client.findMany()
  }

  static async update(id: number, data: Partial<Omit<ClientEntity, "id" | "createdAt">>) {
    return await prisma.client.update({
      where: { id },
      data
    })
  }
}
