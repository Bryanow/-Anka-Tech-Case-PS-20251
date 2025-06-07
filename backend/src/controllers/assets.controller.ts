import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const AssetController = {
  /**
   * Handles the listing of assets from the database.
   * Retrieves all assets from the database via Prisma.
   */
  list: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const assets = await prisma.asset.findMany(); // <-- BUSQUE OS ATIVOS DO BANCO DE DADOS
      return reply.status(200).send(assets);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return reply
        .status(500)
        .send({ message: "Error fetching assets", error: errorMessage });
    }
  },
};
