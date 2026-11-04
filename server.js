const { createServer } = require("node:http");
const next = require("next");
const { migrate } = require("./db/migrate");

const port = Number(process.env.PORT) || 3000;
const hostname = process.env.HOST || "0.0.0.0";

const app = next({ dev: false, hostname, port });
const handle = app.getRequestHandler();

async function main() {
  // Deja la base al día (migraciones + contenido inicial) antes de atender pedidos.
  await migrate();
  await app.prepare();
  createServer((req, res) => handle(req, res)).listen(port, hostname, () => {
    console.log(`Kaizen escuchando en http://${hostname}:${port}`);
  });
}

main().catch((error) => {
  console.error("No se pudo iniciar Kaizen:", error);
  process.exit(1);
});
