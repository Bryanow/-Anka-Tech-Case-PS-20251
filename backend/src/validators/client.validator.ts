import { z } from "zod"

export const createClientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format")
})

export const updateClientSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  status: z.boolean().optional()
})
