// Importa data/content.json a las tablas una sola vez. Queda registrado en
// schema_migrations ("seed:content.json") para no volver a pisar lo editado desde el panel.
const fs = require("node:fs");
const path = require("node:path");

const SEED_KEY = "seed:content.json";
const SEED_KEY_V2 = "seed:content.json:brands-gallery";
const SEED_KEY_V3 = "seed:content.json:service-pages";
const CONTENT_PATH = path.join(__dirname, "..", "data", "content.json");

const SERVICE_COLUMNS = `id, slug, title, short_description, description, intro, content,
  highlights, related_service_id, image, image_alt, icon, labels, keywords, cta_label,
  cta_href, featured, seo_title, seo_description, sort_order`;

function serviceValues(service) {
  return [
    service.id,
    service.slug ?? "",
    service.title,
    service.shortDescription,
    service.description,
    service.intro ?? "",
    service.content ?? "",
    JSON.stringify(service.highlights ?? []),
    service.relatedServiceId ?? null,
    service.image,
    service.imageAlt,
    service.icon,
    JSON.stringify(service.labels ?? []),
    service.keywords ?? "",
    service.ctaLabel,
    service.ctaHref,
    service.featured ? 1 : 0,
    service.seoTitle ?? "",
    service.seoDescription ?? "",
    service.order,
  ];
}

const SETTINGS_KEYS = {
  contactEmail: "contact_email",
  whatsappNumber: "whatsapp_number",
  whatsappDisplay: "whatsapp_display",
  heroEyebrow: "hero_eyebrow",
  heroTitle: "hero_title",
  heroTitleAccent: "hero_title_accent",
  heroSubheading: "hero_subheading",
  heroParagraph: "hero_paragraph",
  homeSeoTitle: "home_seo_title",
  homeSeoDescription: "home_seo_description",
  trustTitle: "trust_title",
};

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
        "INSERT IGNORE INTO hero (id, background_image, background_alt) VALUES (1, ?, ?)",
        [content.hero.backgroundImage, content.hero.backgroundAlt],
      );
      for (const [index, item] of (content.hero.supportImages ?? []).entries()) {
        await connection.query(
          "INSERT IGNORE INTO hero_support_images (id, image, alt, sort_order) VALUES (?, ?, ?, ?)",
          [item.id, item.image, item.alt, index],
        );
      }
    }

    for (const m of content.team ?? []) {
      await connection.query(
        "INSERT IGNORE INTO team_members (id, name, role, photo, description, linkedin, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [m.id, m.name, m.role, m.photo, m.description, m.linkedin ?? "", m.order],
      );
    }

    for (const s of content.services ?? []) {
      await connection.query(
        `INSERT IGNORE INTO services (${SERVICE_COLUMNS})
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        serviceValues(s),
      );
    }

    for (const p of content.posts ?? []) {
      await connection.query(
        `INSERT IGNORE INTO posts (id, slug, title, tag, excerpt, content, cover_image, cover_alt,
           published, published_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [p.id, p.slug, p.title, p.tag, p.excerpt, p.content, p.coverImage, p.coverAlt,
          p.published ? 1 : 0, toDate(p.publishedAt), toDate(p.createdAt), toDate(p.updatedAt)],
      );
    }

    for (const l of content.leads ?? []) {
      await connection.query(
        `INSERT IGNORE INTO leads (id, name, email, phone, company, service, message, status, created_at)
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

// Segundo seed: marcas del carrusel y galería de fotos del equipo. Corre una sola
// vez, con clave propia, para no pisar lo que ya se editó desde el panel.
async function seedBrandsAndGallery(connection, { log = console.log } = {}) {
  const [done] = await connection.query(
    "SELECT 1 FROM schema_migrations WHERE name = ?",
    [SEED_KEY_V2],
  );
  if (done.length) return;
  if (!fs.existsSync(CONTENT_PATH)) return;

  const content = JSON.parse(fs.readFileSync(CONTENT_PATH, "utf8"));
  log("[db] importando marcas y galería de equipo desde data/content.json");

  await connection.beginTransaction();
  try {
    for (const brand of content.brands ?? []) {
      await connection.query(
        "INSERT IGNORE INTO brands (id, name, logo, sort_order) VALUES (?, ?, ?, ?)",
        [brand.id, brand.name, brand.logo, brand.order],
      );
    }

    for (const photo of content.teamGallery ?? []) {
      await connection.query(
        "INSERT IGNORE INTO team_gallery (id, image, alt, sort_order) VALUES (?, ?, ?, ?)",
        [photo.id, photo.image, photo.alt ?? "", photo.order],
      );
    }

    await connection.query("INSERT INTO schema_migrations (name) VALUES (?)", [SEED_KEY_V2]);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  }
}

// Tercer seed: fichas individuales de servicio, preguntas frecuentes y textos
// editables del sitio. Corre una sola vez, con clave propia.
async function seedServicePages(connection, { log = console.log } = {}) {
  const [done] = await connection.query(
    "SELECT 1 FROM schema_migrations WHERE name = ?",
    [SEED_KEY_V3],
  );
  if (done.length) return;
  if (!fs.existsSync(CONTENT_PATH)) return;

  const content = JSON.parse(fs.readFileSync(CONTENT_PATH, "utf8"));
  log("[db] importando fichas de servicio, preguntas frecuentes y textos del sitio");

  await connection.beginTransaction();
  try {
    for (const service of content.services ?? []) {
      await connection.query(
        `INSERT IGNORE INTO services (${SERVICE_COLUMNS})
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        serviceValues(service),
      );
    }

    for (const faq of content.faqs ?? []) {
      await connection.query(
        `INSERT IGNORE INTO faqs (id, service_id, question, answer, sort_order)
         VALUES (?, ?, ?, ?, ?)`,
        [faq.id, faq.serviceId ?? null, faq.question, faq.answer, faq.order ?? 99],
      );
    }

    for (const [key, column] of Object.entries(SETTINGS_KEYS)) {
      const value = content.settings?.[key];
      if (typeof value !== "string") continue;
      await connection.query(
        "INSERT IGNORE INTO site_settings (setting_key, setting_value) VALUES (?, ?)",
        [column, value],
      );
    }

    await connection.query("INSERT INTO schema_migrations (name) VALUES (?)", [SEED_KEY_V3]);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  }
}

module.exports = { seedInitialContent, seedBrandsAndGallery, seedServicePages };
