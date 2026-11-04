// Aplica las migraciones de db/migrations/*.sql que todavía no se corrieron y, una sola vez,
// importa data/content.json como contenido inicial. Es idempotente: se puede ejecutar
// en cada arranque. Uso: `node db/migrate.js` o `require("./db/migrate").migrate()`.
const fs = require("node:fs");
const path = require("node:path");
const mysql = require("mysql2/promise");
const { dbConfig } = require("./config");
const { seedInitialContent } = require("./seed");

const MIGRATIONS_DIR = path.join(__dirname, "migrations");
const LOCK_NAME = "kaizen_migrations";

async function migrate({ log = console.log } = {}) {
  const connection = await mysql.createConnection(
    dbConfig({ multipleStatements: true }),
  );

  try {
    // Evita que dos procesos migren a la vez (reinicios o preview + producción).
    const [[lock]] = await connection.query("SELECT GET_LOCK(?, 30) AS ok", [LOCK_NAME]);
    if (lock.ok !== 1) throw new Error("No se pudo obtener el lock de migraciones.");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        name VARCHAR(190) NOT NULL PRIMARY KEY,
        applied_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    const [rows] = await connection.query("SELECT name FROM schema_migrations");
    const applied = new Set(rows.map((row) => row.name));

    const files = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    for (const file of files) {
      if (applied.has(file)) continue;
      log(`[db] aplicando migración ${file}`);
      await connection.query(fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf8"));
      await connection.query("INSERT INTO schema_migrations (name) VALUES (?)", [file]);
    }

    await seedInitialContent(connection, { log });
    await connection.query("SELECT RELEASE_LOCK(?)", [LOCK_NAME]);
  } finally {
    await connection.end();
  }
}

module.exports = { migrate };

if (require.main === module) {
  migrate()
    .then(() => console.log("[db] migraciones al día"))
    .catch((error) => {
      console.error("[db] error en migraciones:", error.message);
      process.exit(1);
    });
}
