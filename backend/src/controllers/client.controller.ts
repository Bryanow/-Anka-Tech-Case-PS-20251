import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Zod schema for client creation payload validation
const createClientSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(50, { message: "Name must not be longer than 50 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  status: z.boolean(),
});

// Zod schema for client update payload validation
const updateClientSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(50, { message: "Name must not be longer than 50 characters." })
    .optional(),
  email: z.string().email({ message: "Invalid email address." }).optional(),
  status: z.boolean().optional(),
});

export const ClientController = {
  /**
   * Handles the creation of a new client.
   * Validates the request body using Zod and saves to the database via Prisma.
   */
  create: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { name, email, status } = createClientSchema.parse(request.body); // Validate request body

      const newClient = await prisma.client.create({
        data: {
          name,
          email,
          status,
        },
      });

      return reply.status(201).send(newClient);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        return reply
          .status(400)
          .send({ message: "Validation error", issues: error.errors });
      }
      // Handle other potential database errors
      return reply.status(500).send({
        message: "Error creating client",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },

  /**
   * Handles the listing of all clients.
   * Retrieves all clients from the database via Prisma.
   */
  list: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const clients = await prisma.client.findMany();
      return reply.status(200).send(clients);
    } catch (error) {
      return reply.status(500).send({
        message: "Error finding clients",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },

  /**
   * Handles the update of an existing client.
   * Validates the request body and URL parameters, then updates the client in the database via Prisma.
   */
  update: async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string }; // Get ID from URL parameters
    let parsedId: number;

    try {
      parsedId = parseInt(id);
      if (isNaN(parsedId)) {
        return reply
          .status(400)
          .send({ message: "Invalid client ID provided." });
      }

      const updatedData = updateClientSchema.parse(request.body); // Validate request body

      const updatedClient = await prisma.client.update({
        where: { id: parsedId },
        data: updatedData, // Use the validated data
      });

      return reply.status(200).send(updatedClient);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply
          .status(400)
          .send({ message: "Validation error", issues: error.errors });
      } else if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as any).code === "P2025"
      ) {
        // Prisma error for record not found
        return reply.status(404).send({ message: "Client not found." });
      }
      return reply
        .status(500)
        .send({
          message: "Error updating client",
          error: error instanceof Error ? error.message : String(error),
        });
    }
  },

  /**
   * Handles the retrieval of a single client by ID.
   */
  findById: async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string }; // Get ID from URL parameters
    let parsedId: number;

    try {
      parsedId = parseInt(id);
      if (isNaN(parsedId)) {
        return reply
          .status(400)
          .send({ message: "Invalid client ID provided." });
      }

      const client = await prisma.client.findUnique({
        where: { id: parsedId },
      });

      if (!client) {
        return reply.status(404).send({ message: "Client not found." });
      }

      return reply.status(200).send(client);
    } catch (error) {
      return reply.status(500).send({
        message: "Error finding client",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },
};
