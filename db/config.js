// Configuración de conexión compartida por la app (lib/db.ts) y los scripts de migración.
// Variables: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD (y DB_SSL=true si el servidor lo exige).

function dbConfig(extra = {}) {
  const missing = ["DB_HOST", "DB_NAME", "DB_USER"].filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Faltan variables de entorno de base de datos: ${missing.join(", ")}.`);
  }

  return {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD ?? "",
    charset: "utf8mb4",
    timezone: "Z",
    dateStrings: true,
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
    ...extra,
  };
}

module.exports = { dbConfig };
