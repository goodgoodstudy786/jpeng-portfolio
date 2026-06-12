import { createServer } from "vite"

async function startDev() {
  const server = await createServer({
    configFile: false,
    root: ".",
    server: { port: 3000, host: true },
  })
  await server.listen()
  console.log("Dev server running at http://localhost:3000")
}

startDev().catch(e => {
  console.error(e)
  process.exit(1)
})