// Importa data/content.json a las tablas una sola vez. Queda registrado en
// schema_migrations ("seed:content.json") para no volver a pisar lo editado desde el panel.
const fs = require("node:fs");
const path = require("node:path");

const SEED_KEY = "seed:content.json";
const CONTENT_PATH = path.join(__dirname, "..", "data", "content.json");

function toDate(value, fallback = new Date()) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date;
}

async function seedInitialContent(connection, { log = console.log } = {}) {
  const [done] = await connection.query(
    "SELECT 1 FROM schema_migrations WHERE name = ?",
    [SEED_KEY],
  );
  if (done.length) return;
  if (!fs.existsSync(CONTENT_PATH)) return;

  const content = JSON.parse(fs.readFileSync(CONTENT_PATH, "utf8"));
  log("[db] importando contenido inicial desde data/content.json");

  await connection.beginTransaction();
  try {
    if (content.hero) {
      await connection.query(
        "INSERT INTO hero (id, background_image, background_alt) VALUES (1, ?, ?)",
        [content.hero.backgroundImage, content.hero.backgroundAlt],
      );
      for (const [index, item] of (content.hero.supportImages ?? []).entries()) {
        await connection.query(
          "INSERT INTO hero_support_images (id, image, alt, sort_order) VALUES (?, ?, ?, ?)",
          [item.id, item.image, item.alt, index],
        );
      }
    }

    for (const m of content.team ?? []) {
      await connection.query(
        "INSERT INTO team_members (id, name, role, photo, description, linkedin, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [m.id, m.name, m.role, m.photo, m.description, m.linkedin ?? "", m.order],
      );
    }

    for (const s of content.services ?? []) {
      await connection.query(
        `INSERT INTO services (id, title, short_description, description, image, image_alt,
           icon, labels, keywords, cta_label, cta_href, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [s.id, s.title, s.shortDescription, s.description, s.image, s.imageAlt, s.icon,
          JSON.stringify(s.labels ?? []), s.keywords ?? "", s.ctaLabel, s.ctaHref, s.order],
      );
    }

    for (const p of content.posts ?? []) {
      await connection.query(
        `INSERT INTO posts (id, slug, title, tag, excerpt, content, cover_image, cover_alt,
           published, published_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [p.id, p.slug, p.title, p.tag, p.excerpt, p.content, p.coverImage, p.coverAlt,
          p.published ? 1 : 0, toDate(p.publishedAt), toDate(p.createdAt), toDate(p.updatedAt)],
      );
    }

    for (const l of content.leads ?? []) {
      await connection.query(
        `INSERT INTO leads (id, name, email, phone, company, service, message, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [l.id, l.name, l.email, l.phone ?? "", l.company ?? "", l.service ?? "", l.message,
          l.status === "read" ? "read" : "new", toDate(l.createdAt)],
      );
    }

    await connection.query("INSERT INTO schema_migrations (name) VALUES (?)", [SEED_KEY]);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  }
}

module.exports = { seedInitialContent };
