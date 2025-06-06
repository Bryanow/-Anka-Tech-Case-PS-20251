// src/models/ClientAssetModel.ts
import { prisma } from "../utils/prisma"
import { ClientAssetEntity } from "../entities/ClientAssets"

export class ClientAssetModel {
  /**
   * Create a new active asset to  clinet.
   * @param data data of the alocation (clientId, assetId, quantity).
   * @returns Created alocation.
   */
  static async create(data: Omit<ClientAssetEntity, "id" | "client" | "asset">) {
    return await prisma.clientAsset.create({ data })
  }

  /**
   * List all alocations for a especific client.
   * Have deatils of the clients and his assets.
   * @param clientId Clinet ID.
   * @returns Alocation list.
   */
  static async findByClientId(clientId: number) {
    return await prisma.clientAsset.findMany({
      where: { clientId },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        asset: {
          select: {
            id: true,
            name: true,
            value: true,
          },
        },
      },
    })
  }

  /**
   * Update the quantity of a single alocation.
   * @param id The id of the actual updating alocation.
   * @param data Data to be updated (ex: quantity).
   * @returns Updated alocation.
   */
  static async update(id: number, data: Partial<Omit<ClientAssetEntity, "id" | "client" | "asset">>) {
    return await prisma.clientAsset.update({
      where: { id },
      data,
    })
  }

  /**
   * Find alocation by Id.
   * @param id Alocation ID.
   * @returns Find if have the alocation.
   */
  static async findById(id: number) {
    return await prisma.clientAsset.findUnique({
      where: { id },
    })
  }

  /**
   * Delete an alocation.
   * @param id Id of the alocation to be deleted.
   * @returns Deleted alocation.
   */
  static async delete(id: number) {
    return await prisma.clientAsset.delete({
      where: { id },
    })
  }
}