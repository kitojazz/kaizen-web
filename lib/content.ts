import { randomUUID } from "node:crypto";
import type { RowDataPacket } from "mysql2/promise";
import { getPool, toIso } from "@/lib/db";
import type {
  BlogPost,
  Brand,
  Content,
  Faq,
  Hero,
  Lead,
  Service,
  ServiceCategory,
  ServiceHighlight,
  SiteSettings,
  TeamGalleryImage,
  TeamMember,
} from "@/lib/types";

type Row = RowDataPacket;

export const DEFAULT_SETTINGS: SiteSettings = {
  contactEmail: "rodrigo@kaizen.com.uy",
  whatsappNumber: "59899082776",
  whatsappDisplay: "+598 99 082 776",
  heroEyebrow: "Kaizen",
  heroTitle: "Ingeniería y consultoría",
  heroTitleAccent: "alimentaria en Uruguay",
  heroSubheading: "Que su producto llegue a góndola, sin sorpresas.",
  heroParagraph:
    "Brindamos soluciones integrales para la industria alimentaria, acompañando a su empresa en dirección técnica, habilitaciones bromatológicas, registro de productos, calidad e inocuidad alimentaria",
  homeSeoTitle: "Ingeniería y Consultoría Alimentaria en Uruguay | Kaizen",
  homeSeoDescription:
    "Consultoría alimentaria en Uruguay. Especialistas en habilitaciones bromatológicas, registro de productos, dirección técnica, calidad e inocuidad.",
  trustTitle: "Empresas que han confiado en Kaizen",
  contactAddress: "Av. Gral. Paz 1481, Montevideo",
  contactAddressUrl:
    "https://www.google.com/maps/search/?api=1&query=Av.%20Gral.%20Paz%201481%2C%20Montevideo%2C%20Uruguay",
  contactEmailProposed: "info@kaizen.com.uy",
};

export const DEFAULT_SERVICE_CATEGORIES = [
  "Habilitaciones",
  "Registro de Productos",
  "Dirección Técnica",
  "Producto y procesos",
  "Regulatorios",
];

function parseLabels(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return [];
    }
  }
  return [];
}

function parseHighlights(value: unknown): ServiceHighlight[] {
  const raw = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? (() => {
          try {
            return JSON.parse(value);
          } catch {
            return [];
          }
        })()
      : [];
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      title: String((item as Record<string, unknown>).title ?? "").trim(),
      description: String((item as Record<string, unknown>).description ?? "").trim(),
    }))
    .filter((item) => item.title || item.description);
}

function toTeam(row: Row): TeamMember {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    photo: row.photo,
    description: row.description,
    linkedin: row.linkedin || undefined,
    order: row.sort_order,
    showInHero: Boolean(row.show_in_hero),
  };
}

function toBrand(row: Row): Brand {
  return {
    id: row.id,
    name: row.name,
    logo: row.logo,
    order: row.sort_order,
  };
}

function toTeamGalleryImage(row: Row): TeamGalleryImage {
  return {
    id: row.id,
    image: row.image,
    alt: row.alt ?? "",
    order: row.sort_order,
  };
}

function toService(row: Row): Service {
  return {
    id: row.id,
    slug: row.slug ?? "",
    category: row.category ?? "",
    title: row.title,
    shortDescription: row.short_description,
    description: row.description,
    intro: row.intro ?? "",
    content: row.content ?? "",
    highlights: parseHighlights(row.highlights),
    relatedServiceId: row.related_service_id || undefined,
    image: row.image,
    imageAlt: row.image_alt,
    icon: row.icon,
    labels: parseLabels(row.labels),
    keywords: row.keywords,
    ctaLabel: row.cta_label,
    ctaHref: row.cta_href,
    featured: Boolean(row.featured),
    seoTitle: row.seo_title ?? "",
    seoDescription: row.seo_description ?? "",
    order: row.sort_order,
  };
}

function toServiceCategory(row: Row): ServiceCategory {
  return {
    id: row.id,
    name: row.name,
    order: row.sort_order,
  };
}

function toFaq(row: Row): Faq {
  return {
    id: row.id,
    serviceId: row.service_id || undefined,
    question: row.question,
    answer: row.answer,
    order: row.sort_order,
  };
}

function toSettings(rows: Row[]): SiteSettings {
  const values = new Map(rows.map((row) => [row.setting_key as string, row.setting_value as string]));
  const read = (key: string, fallback: string) => values.get(key) ?? fallback;
  return {
    contactEmail: read("contact_email", DEFAULT_SETTINGS.contactEmail),
    whatsappNumber: read("whatsapp_number", DEFAULT_SETTINGS.whatsappNumber),
    whatsappDisplay: read("whatsapp_display", DEFAULT_SETTINGS.whatsappDisplay),
    heroEyebrow: read("hero_eyebrow", DEFAULT_SETTINGS.heroEyebrow),
    heroTitle: read("hero_title", DEFAULT_SETTINGS.heroTitle),
    heroTitleAccent: read("hero_title_accent", DEFAULT_SETTINGS.heroTitleAccent),
    heroSubheading: read("hero_subheading", DEFAULT_SETTINGS.heroSubheading),
    heroParagraph: read("hero_paragraph", DEFAULT_SETTINGS.heroParagraph),
    homeSeoTitle: read("home_seo_title", DEFAULT_SETTINGS.homeSeoTitle),
    homeSeoDescription: read("home_seo_description", DEFAULT_SETTINGS.homeSeoDescription),
    trustTitle: read("trust_title", DEFAULT_SETTINGS.trustTitle),
    contactAddress: read("contact_address", DEFAULT_SETTINGS.contactAddress),
    contactAddressUrl: read("contact_address_url", DEFAULT_SETTINGS.contactAddressUrl),
    contactEmailProposed: read(
      "contact_email_proposed",
      DEFAULT_SETTINGS.contactEmailProposed,
    ),
  };
}

function toPost(row: Row): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    tag: row.tag,
    excerpt: row.excerpt,
    content: row.content,
    coverImage: row.cover_image,
    coverAlt: row.cover_alt,
    published: Boolean(row.published),
    publishedAt: toIso(row.published_at),
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}

function toLead(row: Row): Lead {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    company: row.company,
    service: row.service,
    message: row.message,
    createdAt: toIso(row.created_at),
    status: row.status === "read" ? "read" : "new",
  };
}

export async function getContent(): Promise<Content> {
  const pool = getPool();
  const [
    [heroRows],
    [supportRows],
    [teamRows],
    [brandRows],
    [galleryRows],
    [postRows],
    [serviceRows],
    [categoryRows],
    [faqRows],
    [settingRows],
    [leadRows],
  ] = await Promise.all([
    pool.query<Row[]>("SELECT * FROM hero WHERE id = 1"),
    pool.query<Row[]>("SELECT * FROM hero_support_images ORDER BY sort_order, id"),
    pool.query<Row[]>("SELECT * FROM team_members ORDER BY sort_order, name"),
    pool.query<Row[]>("SELECT * FROM brands ORDER BY sort_order, name"),
    pool.query<Row[]>("SELECT * FROM team_gallery ORDER BY sort_order, id"),
    pool.query<Row[]>("SELECT * FROM posts ORDER BY published_at DESC, title"),
    pool.query<Row[]>("SELECT * FROM services ORDER BY sort_order, title"),
    pool.query<Row[]>("SELECT * FROM service_categories ORDER BY sort_order, name"),
    pool.query<Row[]>("SELECT * FROM faqs ORDER BY sort_order, question"),
    pool.query<Row[]>("SELECT * FROM site_settings"),
    pool.query<Row[]>("SELECT * FROM leads ORDER BY created_at DESC"),
  ]);

  const heroRow = heroRows[0];
  const hero: Hero = {
    backgroundImage: heroRow?.background_image ?? "",
    backgroundAlt: heroRow?.background_alt ?? "",
    supportImages: supportRows.map((row) => ({
      id: row.id,
      image: row.image,
      alt: row.alt,
    })),
  };

  return {
    hero,
    team: teamRows.map(toTeam),
    brands: brandRows.map(toBrand),
    teamGallery: galleryRows.map(toTeamGalleryImage),
    posts: postRows.map(toPost),
    services: serviceRows.map(toService),
    serviceCategories: categoryRows.map(toServiceCategory),
    faqs: faqRows.map(toFaq),
    settings: toSettings(settingRows),
    leads: leadRows.map(toLead),
  };
}

export async function saveHero(hero: Hero) {
  const connection = await getPool().getConnection();
  try {
    await connection.beginTransaction();
    await connection.query(
      `INSERT INTO hero (id, background_image, background_alt) VALUES (1, ?, ?)
       ON DUPLICATE KEY UPDATE background_image = VALUES(background_image),
         background_alt = VALUES(background_alt)`,
      [hero.backgroundImage, hero.backgroundAlt],
    );
    await connection.query("DELETE FROM hero_support_images");
    for (let index = 0; index < hero.supportImages.length; index += 1) {
      const item = hero.supportImages[index];
      await connection.query(
        "INSERT INTO hero_support_images (id, image, alt, sort_order) VALUES (?, ?, ?, ?)",
        [item.id, item.image, item.alt, index],
      );
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function saveTeamMember(member: TeamMember) {
  await getPool().query(
    `INSERT INTO team_members (id, name, role, photo, description, linkedin, sort_order, show_in_hero)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE name = VALUES(name), role = VALUES(role), photo = VALUES(photo),
       description = VALUES(description), linkedin = VALUES(linkedin),
       sort_order = VALUES(sort_order), show_in_hero = VALUES(show_in_hero)`,
    [
      member.id,
      member.name,
      member.role,
      member.photo,
      member.description,
      member.linkedin ?? "",
      member.order,
      member.showInHero ? 1 : 0,
    ],
  );
}

export async function deleteTeamMember(id: string) {
  await getPool().query("DELETE FROM team_members WHERE id = ?", [id]);
}

export async function saveBrand(brand: Brand) {
  await getPool().query(
    `INSERT INTO brands (id, name, logo, sort_order)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE name = VALUES(name), logo = VALUES(logo),
       sort_order = VALUES(sort_order)`,
    [brand.id, brand.name, brand.logo, brand.order],
  );
}

export async function deleteBrand(id: string) {
  await getPool().query("DELETE FROM brands WHERE id = ?", [id]);
}

export async function saveTeamGalleryImage(image: TeamGalleryImage) {
  await getPool().query(
    `INSERT INTO team_gallery (id, image, alt, sort_order)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE image = VALUES(image), alt = VALUES(alt),
       sort_order = VALUES(sort_order)`,
    [image.id, image.image, image.alt, image.order],
  );
}

export async function deleteTeamGalleryImage(id: string) {
  await getPool().query("DELETE FROM team_gallery WHERE id = ?", [id]);
}

export async function saveService(service: Service) {
  await getPool().query(
    `INSERT INTO services (id, slug, category, title, short_description, description, intro, content,
       highlights, related_service_id, image, image_alt, icon, labels, keywords, cta_label,
       cta_href, featured, seo_title, seo_description, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE slug = VALUES(slug), category = VALUES(category), title = VALUES(title),
       short_description = VALUES(short_description), description = VALUES(description),
       intro = VALUES(intro), content = VALUES(content), highlights = VALUES(highlights),
       related_service_id = VALUES(related_service_id), image = VALUES(image),
       image_alt = VALUES(image_alt), icon = VALUES(icon), labels = VALUES(labels),
       keywords = VALUES(keywords), cta_label = VALUES(cta_label),
       cta_href = VALUES(cta_href), featured = VALUES(featured),
       seo_title = VALUES(seo_title), seo_description = VALUES(seo_description),
       sort_order = VALUES(sort_order)`,
    [
      service.id,
      service.slug,
      service.category,
      service.title,
      service.shortDescription,
      service.description,
      service.intro,
      service.content,
      JSON.stringify(service.highlights),
      service.relatedServiceId ?? null,
      service.image,
      service.imageAlt,
      service.icon,
      JSON.stringify(service.labels),
      service.keywords,
      service.ctaLabel,
      service.ctaHref,
      service.featured ? 1 : 0,
      service.seoTitle,
      service.seoDescription,
      service.order,
    ],
  );
}

export async function deleteService(id: string) {
  await getPool().query("DELETE FROM services WHERE id = ?", [id]);
}

export async function saveServiceCategory(
  category: ServiceCategory,
  previousName?: string,
) {
  const connection = await getPool().getConnection();
  try {
    await connection.beginTransaction();
    await connection.query(
      `INSERT INTO service_categories (id, name, sort_order) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name), sort_order = VALUES(sort_order)`,
      [category.id, category.name, category.order],
    );
    if (previousName && previousName !== category.name) {
      await connection.query(
        "UPDATE services SET category = ? WHERE category = ?",
        [category.name, previousName],
      );
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function deleteServiceCategory(id: string) {
  const connection = await getPool().getConnection();
  try {
    await connection.beginTransaction();
    const [rows] = await connection.query<Row[]>(
      "SELECT name FROM service_categories WHERE id = ?",
      [id],
    );
    const name = rows[0]?.name;
    if (name) {
      await connection.query("UPDATE services SET category = '' WHERE category = ?", [name]);
    }
    await connection.query("DELETE FROM service_categories WHERE id = ?", [id]);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function saveFaq(faq: Faq) {
  await getPool().query(
    `INSERT INTO faqs (id, service_id, question, answer, sort_order)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE service_id = VALUES(service_id),
       question = VALUES(question), answer = VALUES(answer),
       sort_order = VALUES(sort_order)`,
    [faq.id, faq.serviceId ?? null, faq.question, faq.answer, faq.order],
  );
}

export async function deleteFaq(id: string) {
  await getPool().query("DELETE FROM faqs WHERE id = ?", [id]);
}

export async function saveSettings(settings: SiteSettings) {
  const entries: [string, string][] = [
    ["contact_email", settings.contactEmail],
    ["whatsapp_number", settings.whatsappNumber],
    ["whatsapp_display", settings.whatsappDisplay],
    ["hero_eyebrow", settings.heroEyebrow],
    ["hero_title", settings.heroTitle],
    ["hero_title_accent", settings.heroTitleAccent],
    ["hero_subheading", settings.heroSubheading],
    ["hero_paragraph", settings.heroParagraph],
    ["home_seo_title", settings.homeSeoTitle],
    ["home_seo_description", settings.homeSeoDescription],
    ["trust_title", settings.trustTitle],
    ["contact_address", settings.contactAddress],
    ["contact_address_url", settings.contactAddressUrl],
    ["contact_email_proposed", settings.contactEmailProposed],
  ];

  const connection = await getPool().getConnection();
  try {
    await connection.beginTransaction();
    for (const [key, value] of entries) {
      await connection.query(
        `INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
        [key, value],
      );
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function savePost(post: BlogPost) {
  await getPool().query(
    `INSERT INTO posts (id, slug, title, tag, excerpt, content, cover_image, cover_alt,
       published, published_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE slug = VALUES(slug), title = VALUES(title), tag = VALUES(tag),
       excerpt = VALUES(excerpt), content = VALUES(content),
       cover_image = VALUES(cover_image), cover_alt = VALUES(cover_alt),
       published = VALUES(published), published_at = VALUES(published_at),
       updated_at = VALUES(updated_at)`,
    [
      post.id,
      post.slug,
      post.title,
      post.tag,
      post.excerpt,
      post.content,
      post.coverImage,
      post.coverAlt,
      post.published ? 1 : 0,
      new Date(post.publishedAt),
      new Date(post.createdAt),
      new Date(post.updatedAt),
    ],
  );
}

export async function deletePost(id: string) {
  await getPool().query("DELETE FROM posts WHERE id = ?", [id]);
}

export async function createLead(
  data: Omit<Lead, "id" | "createdAt" | "status">,
): Promise<Lead> {
  const lead: Lead = {
    ...data,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    status: "new",
  };
  await getPool().query(
    `INSERT INTO leads (id, name, email, phone, company, service, message, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'new', ?)`,
    [
      lead.id,
      lead.name,
      lead.email,
      lead.phone,
      lead.company,
      lead.service,
      lead.message,
      new Date(lead.createdAt),
    ],
  );
  return lead;
}

export async function toggleLead(id: string) {
  await getPool().query(
    "UPDATE leads SET status = IF(status = 'new', 'read', 'new') WHERE id = ?",
    [id],
  );
}

export async function deleteLead(id: string) {
  await getPool().query("DELETE FROM leads WHERE id = ?", [id]);
}

export async function slugExists(slug: string, exceptId?: string) {
  const [rows] = await getPool().query<RowDataPacket[]>(
    "SELECT 1 FROM posts WHERE slug = ? AND id <> ? LIMIT 1",
    [slug, exceptId ?? ""],
  );
  return rows.length > 0;
}

export async function serviceSlugExists(slug: string, exceptId?: string) {
  const [rows] = await getPool().query<RowDataPacket[]>(
    "SELECT 1 FROM services WHERE slug = ? AND id <> ? LIMIT 1",
    [slug, exceptId ?? ""],
  );
  return rows.length > 0;
}

export function sortTeam(team: TeamMember[]) {
  return [...team].sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
}

export function sortBrands(brands: Brand[]) {
  return [...brands].sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
}

export function sortTeamGallery(images: TeamGalleryImage[]) {
  return [...images].sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
}

export function sortServices(services: Service[]) {
  return [...services].sort(
    (a, b) => a.order - b.order || a.title.localeCompare(b.title),
  );
}

export function sortPosts(posts: BlogPost[]) {
  return [...posts].sort((a, b) => {
    const left = new Date(a.publishedAt).getTime();
    const right = new Date(b.publishedAt).getTime();
    return right - left || a.title.localeCompare(b.title);
  });
}

export function getPublishedPosts(posts: BlogPost[]) {
  return sortPosts(posts.filter((post) => post.published));
}

export function sortFaqs(faqs: Faq[]) {
  return [...faqs].sort((a, b) => a.order - b.order || a.question.localeCompare(b.question));
}

export function faqsForService(faqs: Faq[], serviceId: string) {
  return sortFaqs(faqs.filter((faq) => faq.serviceId === serviceId));
}

export function getFeaturedServices(services: Service[]) {
  const featured = sortServices(services.filter((service) => service.featured));
  return featured.length > 0 ? featured.slice(0, 3) : sortServices(services).slice(0, 3);
}

export function groupServicesByCategory(
  services: Service[],
  categories: ServiceCategory[] = DEFAULT_SERVICE_CATEGORIES.map((name, index) => ({
    id: `category-default-${index + 1}`,
    name,
    order: index + 1,
  })),
) {
  const ordered = sortServices(services);
  const names = categories.map((category) => category.name);
  const groups = [
    ...categories.map((category) => ({
      category: category.name,
      services: ordered.filter((service) => service.category === category.name),
    })),
    ...Array.from(new Set(ordered.map((service) => service.category)))
      .filter((category) => category && !names.includes(category))
      .sort((a, b) => a.localeCompare(b))
      .map((category) => ({
        category,
        services: ordered.filter((service) => service.category === category),
      })),
  ].filter((group) => group.services.length > 0);

  const uncategorized = ordered.filter((service) => !service.category);
  if (uncategorized.length > 0) groups.push({ category: "", services: uncategorized });
  return groups;
}
