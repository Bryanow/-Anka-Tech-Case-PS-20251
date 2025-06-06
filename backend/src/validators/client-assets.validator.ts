import { z } from "zod"

export const createClientAssetSchema = z.object({
  clientId: z.number().int().positive("Client ID must be a positive integer"),
  assetId: z.number().int().positive("Asset ID must be a positive integer"),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
})

export const updateClientAssetSchema = z.object({
  quantity: z.number().int().positive("Quantity must be a positive integer").optional(),
})
