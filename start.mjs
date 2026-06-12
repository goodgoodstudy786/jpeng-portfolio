import { createServer } from "vite";
async function start() {
  const server = await createServer({
    configFile: false,
    root: ".",
    server: { port: 3000, host: true },
    optimizeDeps: { disabled: true },
    esbuild: false,
  });
  await server.listen();
  console.log("Dev running on http://localhost:3000");
}
start();