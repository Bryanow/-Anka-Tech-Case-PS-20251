import { prisma } from "../utils/prisma"
import { ClientEntity } from "../entities/Client"

export class ClientModel {
  static async create(data: Omit<ClientEntity, "id" | "createdAt">) {
    return await prisma.client.create({ data })
  }

  static async findAll() {
    return await prisma.client.findMany()
  }

  static async findById(id: number) { // Adicione este método
    return await prisma.client.findUnique({
      where: { id },
    })
  }

  static async update(id: number, data: Partial<Omit<ClientEntity, "id" | "createdAt">>) {
    return await prisma.client.update({
      where: { id },
      data
    })
  }
}
