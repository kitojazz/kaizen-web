"use server";

import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  assertAdmin,
  endSession,
  startSession,
  validateCredentials,
} from "@/lib/auth";
import { getContent, updateContent } from "@/lib/content";
import { rateLimit, resetRateLimit } from "@/lib/rate-limit";
import { saveImageFile } from "@/lib/uploads";
import { slugify } from "@/lib/utils";
import type {
  BlogPost,
  HeroSupportImage,
  Lead,
  Service,
  TeamMember,
} from "@/lib/types";

type NoticeKind = "success" | "error";

function text(data: FormData, key: string) {
  return String(data.get(key) ?? "").trim();
}

function numberValue(data: FormData, key: string, fallback = 0) {
  const value = Number(text(data, key));
  return Number.isFinite(value) ? value : fallback;
}

function listValue(data: FormData, key: string) {
  return text(data, key)
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function requireValue(value: string, label: string) {
  if (!value) throw new Error(`Completá el campo ${label}.`);
  return value;
}

function parseDate(value: string, fallback = new Date().toISOString()) {
  if (!value) return fallback;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date.toISOString();
}

function safeHref(value: string) {
  const href = value.trim();
  if (
    href.startsWith("#") ||
    href.startsWith("/") ||
    href.startsWith("https://") ||
    href.startsWith("http://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  ) {
    return href;
  }
  return "#contacto";
}

function redirectWith(path: string, kind: NoticeKind, message: string): never {
  redirect(`${path}?notice=${kind}&message=${encodeURIComponent(message)}`);
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Ocurrió un error inesperado.";
}

function clientIp() {
  const forwarded = headers().get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "local";
}

export async function loginAction(data: FormData) {
  const email = text(data, "email");
  const password = String(data.get("password") ?? "");
  const key = `login:${clientIp()}`;
  const limit = rateLimit(key, 6, 10 * 60_000);

  if (!limit.allowed) {
    redirectWith(
      "/admin/login",
      "error",
      "Demasiados intentos. Esperá unos minutos antes de volver a probar.",
    );
  }

  if (!email || !password) {
    redirectWith("/admin/login", "error", "Ingresá tu correo y contraseña.");
  }

  if (!validateCredentials(email, password)) {
    redirectWith(
      "/admin/login",
      "error",
      "Las credenciales no son correctas.",
    );
  }

  resetRateLimit(key);
  await startSession(email);
  redirect("/admin");
}

export async function logoutAction() {
  endSession();
  redirect("/admin/login?notice=success&message=Sesi%C3%B3n%20cerrada");
}

export async function createTeamMember(data: FormData) {
  assertAdmin();
  let error = "";

  try {
    const name = requireValue(text(data, "name"), "nombre");
    const role = requireValue(text(data, "role"), "cargo");
    const description = requireValue(text(data, "description"), "descripción");
    const photo = await saveImageFile(data.get("photo"), {
      folder: "team",
      width: 1400,
      quality: 84,
    });
    if (!photo) throw new Error("Seleccioná una fotografía para el integrante.");

    const member: TeamMember = {
      id: randomUUID(),
      name,
      role,
      photo,
      description,
      order: numberValue(data, "order", 99),
    };

    await updateContent((content) => {
      content.team.push(member);
      return content;
    });
  } catch (caught) {
    error = errorMessage(caught);
  }

  if (error) redirectWith("/admin/equipo", "error", error);
  redirectWith("/admin/equipo", "success", "Integrante agregado.");
}

export async function updateTeamMember(data: FormData) {
  assertAdmin();
  let error = "";

  try {
    const id = requireValue(text(data, "id"), "integrante");
    const current = await getContent();
    if (!current.team.some((member) => member.id === id)) {
      throw new Error("El integrante ya no existe.");
    }

    const name = requireValue(text(data, "name"), "nombre");
    const role = requireValue(text(data, "role"), "cargo");
    const description = requireValue(text(data, "description"), "descripción");
    const uploaded = await saveImageFile(data.get("photo"), {
      folder: "team",
      width: 1400,
      quality: 84,
    });
    const photo = uploaded || text(data, "currentPhoto");
    if (!photo) throw new Error("El integrante necesita una fotografía.");

    await updateContent((content) => {
      content.team = content.team.map((member) =>
        member.id === id
          ? {
              ...member,
              name,
              role,
              description,
              photo,
              order: numberValue(data, "order", member.order),
            }
          : member,
      );
      return content;
    });
  } catch (caught) {
    error = errorMessage(caught);
  }

  if (error) redirectWith("/admin/equipo", "error", error);
  redirectWith("/admin/equipo", "success", "Integrante actualizado.");
}

export async function deleteTeamMember(data: FormData) {
  assertAdmin();
  const id = text(data, "id");
  await updateContent((content) => {
    content.team = content.team.filter((member) => member.id !== id);
    return content;
  });
  redirectWith("/admin/equipo", "success", "Integrante eliminado.");
}

export async function updateHero(data: FormData) {
  assertAdmin();
  let error = "";

  try {
    const current = await getContent();
    const uploadedBackground = await saveImageFile(data.get("backgroundImage"), {
      folder: "hero",
      width: 2200,
      quality: 84,
    });
    const backgroundImage =
      uploadedBackground || text(data, "currentBackgroundImage");
    if (!backgroundImage) throw new Error("Seleccioná la imagen de fondo del hero.");

    const supportImages: HeroSupportImage[] = [];
    for (let index = 0; index < 3; index += 1) {
      const uploaded = await saveImageFile(data.get(`supportImage${index}`), {
        folder: "hero",
        width: 1200,
        quality: 84,
      });
      const image = uploaded || text(data, `currentSupportImage${index}`);
      if (!image) continue;
      supportImages.push({
        id:
          current.hero.supportImages[index]?.id || `hero-support-${index + 1}`,
        image,
        alt:
          text(data, `supportAlt${index}`) ||
          "Imagen de apoyo de la sección principal",
      });
    }

    await updateContent((content) => {
      content.hero = {
        backgroundImage,
        backgroundAlt:
          text(data, "backgroundAlt") ||
          "Imagen principal de Kaizen alimentos",
        supportImages,
      };
      return content;
    });
  } catch (caught) {
    error = errorMessage(caught);
  }

  if (error) redirectWith("/admin/hero", "error", error);
  redirectWith("/admin/hero", "success", "Hero actualizado.");
}

export async function createPost(data: FormData) {
  assertAdmin();
  let error = "";

  try {
    const title = requireValue(text(data, "title"), "título");
    const tag = requireValue(text(data, "tag"), "categoría");
    const excerpt = requireValue(text(data, "excerpt"), "bajada");
    const contentText = requireValue(text(data, "content"), "contenido");
    const coverImage = await saveImageFile(data.get("coverImage"), {
      folder: "blog",
      width: 1600,
      quality: 82,
    });
    if (!coverImage) throw new Error("Seleccioná una imagen de portada.");

    const current = await getContent();
    const requestedSlug = slugify(text(data, "slug") || title);
    let slug = requestedSlug || `nota-${Date.now()}`;
    let suffix = 2;
    while (current.posts.some((post) => post.slug === slug)) {
      slug = `${requestedSlug}-${suffix}`;
      suffix += 1;
    }

    const now = new Date().toISOString();
    const post: BlogPost = {
      id: randomUUID(),
      slug,
      title,
      tag,
      excerpt,
      content: contentText,
      coverImage,
      coverAlt: text(data, "coverAlt") || title,
      published: data.get("published") === "on",
      publishedAt: parseDate(text(data, "publishedAt"), now),
      createdAt: now,
      updatedAt: now,
    };

    await updateContent((content) => {
      content.posts.push(post);
      return content;
    });
  } catch (caught) {
    error = errorMessage(caught);
  }

  if (error) redirectWith("/admin/blog", "error", error);
  redirectWith("/admin/blog", "success", "Artículo creado.");
}

export async function updatePost(data: FormData) {
  assertAdmin();
  let error = "";

  try {
    const id = requireValue(text(data, "id"), "artículo");
    const current = await getContent();
    const existing = current.posts.find((post) => post.id === id);
    if (!existing) throw new Error("El artículo ya no existe.");

    const title = requireValue(text(data, "title"), "título");
    const tag = requireValue(text(data, "tag"), "categoría");
    const excerpt = requireValue(text(data, "excerpt"), "bajada");
    const contentText = requireValue(text(data, "content"), "contenido");
    const uploaded = await saveImageFile(data.get("coverImage"), {
      folder: "blog",
      width: 1600,
      quality: 82,
    });
    const coverImage = uploaded || text(data, "currentCoverImage");
    if (!coverImage) throw new Error("El artículo necesita una portada.");

    const requestedSlug = slugify(text(data, "slug") || title) || existing.slug;
    let slug = requestedSlug;
    let suffix = 2;
    while (
      current.posts.some((post) => post.slug === slug && post.id !== existing.id)
    ) {
      slug = `${requestedSlug}-${suffix}`;
      suffix += 1;
    }

    await updateContent((content) => {
      content.posts = content.posts.map((post) =>
        post.id === id
          ? {
              ...post,
              slug,
              title,
              tag,
              excerpt,
              content: contentText,
              coverImage,
              coverAlt: text(data, "coverAlt") || title,
              published: data.get("published") === "on",
              publishedAt: parseDate(
                text(data, "publishedAt"),
                post.publishedAt,
              ),
              updatedAt: new Date().toISOString(),
            }
          : post,
      );
      return content;
    });
  } catch (caught) {
    error = errorMessage(caught);
  }

  if (error) redirectWith("/admin/blog", "error", error);
  redirectWith("/admin/blog", "success", "Artículo actualizado.");
}

export async function deletePost(data: FormData) {
  assertAdmin();
  const id = text(data, "id");
  await updateContent((content) => {
    content.posts = content.posts.filter((post) => post.id !== id);
    return content;
  });
  redirectWith("/admin/blog", "success", "Artículo eliminado.");
}

export async function createService(data: FormData) {
  assertAdmin();
  let error = "";

  try {
    const title = requireValue(text(data, "title"), "título");
    const shortDescription = requireValue(
      text(data, "shortDescription"),
      "descripción corta",
    );
    const description = requireValue(
      text(data, "description"),
      "descripción detallada",
    );
    const image = await saveImageFile(data.get("image"), {
      folder: "services",
      width: 1600,
      quality: 82,
    });
    if (!image) throw new Error("Seleccioná una imagen para el servicio.");

    const service: Service = {
      id: randomUUID(),
      title,
      shortDescription,
      description,
      image,
      imageAlt: text(data, "imageAlt") || title,
      icon: text(data, "icon") || "flask",
      labels: listValue(data, "labels"),
      keywords: text(data, "keywords"),
      ctaLabel: text(data, "ctaLabel") || "Consultar",
      ctaHref: safeHref(text(data, "ctaHref") || "#contacto"),
      order: numberValue(data, "order", 99),
    };

    await updateContent((content) => {
      content.services.push(service);
      return content;
    });
  } catch (caught) {
    error = errorMessage(caught);
  }

  if (error) redirectWith("/admin/servicios", "error", error);
  redirectWith("/admin/servicios", "success", "Servicio agregado.");
}

export async function updateService(data: FormData) {
  assertAdmin();
  let error = "";

  try {
    const id = requireValue(text(data, "id"), "servicio");
    const current = await getContent();
    if (!current.services.some((service) => service.id === id)) {
      throw new Error("El servicio ya no existe.");
    }

    const title = requireValue(text(data, "title"), "título");
    const shortDescription = requireValue(
      text(data, "shortDescription"),
      "descripción corta",
    );
    const description = requireValue(
      text(data, "description"),
      "descripción detallada",
    );
    const uploaded = await saveImageFile(data.get("image"), {
      folder: "services",
      width: 1600,
      quality: 82,
    });
    const image = uploaded || text(data, "currentImage");
    if (!image) throw new Error("El servicio necesita una imagen.");

    await updateContent((content) => {
      content.services = content.services.map((service) =>
        service.id === id
          ? {
              ...service,
              title,
              shortDescription,
              description,
              image,
              imageAlt: text(data, "imageAlt") || title,
              icon: text(data, "icon") || service.icon,
              labels: listValue(data, "labels"),
              keywords: text(data, "keywords"),
              ctaLabel: text(data, "ctaLabel") || "Consultar",
              ctaHref: safeHref(text(data, "ctaHref") || "#contacto"),
              order: numberValue(data, "order", service.order),
            }
          : service,
      );
      return content;
    });
  } catch (caught) {
    error = errorMessage(caught);
  }

  if (error) redirectWith("/admin/servicios", "error", error);
  redirectWith("/admin/servicios", "success", "Servicio actualizado.");
}

export async function deleteService(data: FormData) {
  assertAdmin();
  const id = text(data, "id");
  await updateContent((content) => {
    content.services = content.services.filter((service) => service.id !== id);
    return content;
  });
  redirectWith("/admin/servicios", "success", "Servicio eliminado.");
}

export async function toggleLeadStatus(data: FormData) {
  assertAdmin();
  const id = text(data, "id");
  await updateContent((content) => {
    content.leads = content.leads.map((lead) =>
      lead.id === id
        ? ({ ...lead, status: lead.status === "new" ? "read" : "new" } as Lead)
        : lead,
    );
    return content;
  });
  redirectWith("/admin/mensajes", "success", "Estado del mensaje actualizado.");
}

export async function deleteLead(data: FormData) {
  assertAdmin();
  const id = text(data, "id");
  await updateContent((content) => {
    content.leads = content.leads.filter((lead) => lead.id !== id);
    return content;
  });
  redirectWith("/admin/mensajes", "success", "Mensaje eliminado.");
}
