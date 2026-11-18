const fs = require("node:fs");
const path = require("node:path");
const mysql = require("mysql2/promise");
const { dbConfig } = require("./config");

const TABLES = [
  {
    name: "hero",
    columns: ["id", "background_image", "background_alt"],
    order: ["id"],
  },
  {
    name: "hero_support_images",
    columns: ["id", "image", "alt", "sort_order"],
    order: ["sort_order", "id"],
  },
  {
    name: "site_settings",
    columns: ["setting_key", "setting_value"],
    order: ["setting_key"],
  },
  {
    name: "team_members",
    columns: ["id", "name", "role", "photo", "description", "linkedin", "show_in_hero", "sort_order"],
    order: ["sort_order", "id"],
  },
  {
    name: "team_gallery",
    columns: ["id", "image", "alt", "sort_order"],
    order: ["sort_order", "id"],
  },
  {
    name: "brands",
    columns: ["id", "name", "logo", "sort_order"],
    order: ["sort_order", "id"],
  },
  {
    name: "service_categories",
    columns: ["id", "name", "sort_order"],
    order: ["sort_order", "id"],
  },
  {
    name: "services",
    columns: [
      "id", "slug", "category", "title", "short_description", "intro", "description",
      "content", "highlights", "related_service_id", "image", "image_alt", "icon",
      "labels", "keywords", "cta_label", "cta_href", "featured", "seo_title",
      "seo_description", "sort_order",
    ],
    order: ["sort_order", "id"],
  },
  {
    name: "faqs",
    columns: ["id", "service_id", "question", "answer", "sort_order"],
    order: ["sort_order", "id"],
  },
  {
    name: "posts",
    columns: [
      "id", "slug", "title", "tag", "excerpt", "content", "cover_image", "cover_alt",
      "published", "published_at", "created_at", "updated_at",
    ],
    order: ["id"],
  },
];

const DEFAULT_FILE = path.join(__dirname, "promotion", "kaizen-content.sql");
const LOCK_NAME = "kaizen_content_promotion";

function identifier(value) {
  return `\`${value}\``;
}

function escapeValue(connection, value) {
  if (value !== null && typeof value === "object") {
    return connection.escape(JSON.stringify(value));
  }
  return connection.escape(value);
}

async function exportContent(file) {
  const connection = await mysql.createConnection(dbConfig());
  const lines = [];

  try {
    for (const table of TABLES) {
      const columns = table.columns.map(identifier).join(", ");
      const order = table.order.map(identifier).join(", ");
      const [rows] = await connection.query(
        `SELECT ${columns} FROM ${identifier(table.name)} ORDER BY ${order}`,
      );

      for (const row of rows) {
        const values = table.columns
          .map((column) => escapeValue(connection, row[column]))
          .join(", ");
        lines.push(
          `INSERT IGNORE INTO ${identifier(table.name)} (${columns}) VALUES (${values});`,
        );
      }
    }
  } finally {
    await connection.end();
  }

  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${lines.join("\n")}\n`, "utf8");
  console.log(`[content] ${lines.length} filas exportadas a ${file}`);
}

async function importContent(file) {
  const sql = fs.readFileSync(file, "utf8");
  const connection = await mysql.createConnection(dbConfig({ multipleStatements: true }));

  try {
    const [[lock]] = await connection.query("SELECT GET_LOCK(?, 30) AS ok", [LOCK_NAME]);
    if (lock.ok !== 1) throw new Error("No se pudo obtener el lock de promoción de contenido.");

    await connection.query("START TRANSACTION");
    try {
      await connection.query(sql);
      await connection.query("COMMIT");
    } catch (error) {
      await connection.query("ROLLBACK");
      throw error;
    } finally {
      await connection.query("SELECT RELEASE_LOCK(?)", [LOCK_NAME]);
    }

    console.log(`[content] importado ${file}`);
  } finally {
    await connection.end();
  }
}

async function main() {
  const mode = process.argv[2];
  const file = process.argv[3] || DEFAULT_FILE;

  if (mode === "export") return exportContent(file);
  if (mode === "import") return importContent(file);
  throw new Error("Uso: node db/promote-content.js export|import [archivo.sql]");
}

main().catch((error) => {
  console.error("[content]", error.message);
  process.exit(1);
});
