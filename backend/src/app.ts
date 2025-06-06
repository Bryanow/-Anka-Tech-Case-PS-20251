// src/server.ts (ou app.ts)
import fastify from "fastify"
import cors from "@fastify/cors" // Certifique-se de ter o CORS instalado e configurado
import { clientRoutes } from "./routes/client.routes"
import { assetRoutes } from "./routes/assets.routes"
import { clientAssetRoutes } from "./routes/client-assets.routes"

const app = fastify({ logger: true })

async function start() {
  try {
    await app.register(cors, {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
    })
    
    await app.register(clientRoutes)
    await app.register(assetRoutes)
    await app.register(clientAssetRoutes)

    await app.listen({ port: 3000, host: "0.0.0.0" })
    console.log("Server listening on port 3000")
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()