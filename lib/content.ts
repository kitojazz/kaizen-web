import { randomUUID } from "node:crypto";
import type { RowDataPacket } from "mysql2/promise";
import { getPool, toIso } from "@/lib/db";
import type {
  BlogPost,
  Content,
  Hero,
  Lead,
  Service,
  TeamMember,
} from "@/lib/types";

type Row = RowDataPacket;

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

function toTeam(row: Row): TeamMember {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    photo: row.photo,
    description: row.description,
    linkedin: row.linkedin || undefined,
    order: row.sort_order,
  };
}

function toService(row: Row): Service {
  return {
    id: row.id,
    title: row.title,
    shortDescription: row.short_description,
    description: row.description,
    image: row.image,
    imageAlt: row.image_alt,
    icon: row.icon,
    labels: parseLabels(row.labels),
    keywords: row.keywords,
    ctaLabel: row.cta_label,
    ctaHref: row.cta_href,
    order: row.sort_order,
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
  const [[heroRows], [supportRows], [teamRows], [postRows], [serviceRows], [leadRows]] =
    await Promise.all([
      pool.query<Row[]>("SELECT * FROM hero WHERE id = 1"),
      pool.query<Row[]>("SELECT * FROM hero_support_images ORDER BY sort_order, id"),
      pool.query<Row[]>("SELECT * FROM team_members ORDER BY sort_order, name"),
      pool.query<Row[]>("SELECT * FROM posts ORDER BY published_at DESC, title"),
      pool.query<Row[]>("SELECT * FROM services ORDER BY sort_order, title"),
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
    posts: postRows.map(toPost),
    services: serviceRows.map(toService),
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
    `INSERT INTO team_members (id, name, role, photo, description, linkedin, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE name = VALUES(name), role = VALUES(role), photo = VALUES(photo),
       description = VALUES(description), linkedin = VALUES(linkedin),
       sort_order = VALUES(sort_order)`,
    [
      member.id,
      member.name,
      member.role,
      member.photo,
      member.description,
      member.linkedin ?? "",
      member.order,
    ],
  );
}

export async function deleteTeamMember(id: string) {
  await getPool().query("DELETE FROM team_members WHERE id = ?", [id]);
}

export async function saveService(service: Service) {
  await getPool().query(
    `INSERT INTO services (id, title, short_description, description, image, image_alt,
       icon, labels, keywords, cta_label, cta_href, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE title = VALUES(title),
       short_description = VALUES(short_description), description = VALUES(description),
       image = VALUES(image), image_alt = VALUES(image_alt), icon = VALUES(icon),
       labels = VALUES(labels), keywords = VALUES(keywords), cta_label = VALUES(cta_label),
       cta_href = VALUES(cta_href), sort_order = VALUES(sort_order)`,
    [
      service.id,
      service.title,
      service.shortDescription,
      service.description,
      service.image,
      service.imageAlt,
      service.icon,
      JSON.stringify(service.labels),
      service.keywords,
      service.ctaLabel,
      service.ctaHref,
      service.order,
    ],
  );
}

export async function deleteService(id: string) {
  await getPool().query("DELETE FROM services WHERE id = ?", [id]);
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

export function sortTeam(team: TeamMember[]) {
  return [...team].sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
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
