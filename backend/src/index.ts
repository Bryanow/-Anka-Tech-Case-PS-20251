import Fastify from "fastify"
import { clientRoutes } from "./routes/client.route"

const app = Fastify({ logger: true })

app.register(clientRoutes)

app.listen({ port: 3001, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`🚀 Backend started in ${address}`)
})
