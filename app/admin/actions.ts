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
import {
  deleteBrand as removeBrand,
  deleteFaq as removeFaq,
  deleteLead as removeLead,
  deletePost as removePost,
  deleteService as removeService,
  deleteServiceCategory as removeServiceCategory,
  deleteTeamMember as removeTeamMember,
  deleteTeamGalleryImage as removeTeamGalleryImage,
  getContent,
  saveBrand,
  saveFaq,
  savePost,
  saveHero,
  saveService,
  saveServiceCategory,
  saveSettings,
  saveTeamGalleryImage,
  saveTeamMember,
  serviceSlugExists,
  slugExists,
  toggleLead,
} from "@/lib/content";
import { rateLimit, resetRateLimit } from "@/lib/rate-limit";
import { saveImageFile } from "@/lib/uploads";
import { slugify } from "@/lib/utils";
import type {
  BlogPost,
  Brand,
  HeroSupportImage,
  Service,
  ServiceCategory,
  ServiceHighlight,
  TeamGalleryImage,
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

function parseHighlights(value: string): ServiceHighlight[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, ...rest] = line.split("|");
      return { title: title.trim(), description: rest.join("|").trim() };
    })
    .filter((item) => item.title || item.description);
}

function adminPath(value: string, fallback: string) {
  return value.startsWith("/admin") ? value : fallback;
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
    const linkedin = text(data, "linkedin");
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
      linkedin,
      order: numberValue(data, "order", 99),
      showInHero: data.get("showInHero") === "on",
    };

    await saveTeamMember(member);
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
    const linkedin = text(data, "linkedin");
    const uploaded = await saveImageFile(data.get("photo"), {
      folder: "team",
      width: 1400,
      quality: 84,
    });
    const photo = uploaded || text(data, "currentPhoto");
    if (!photo) throw new Error("El integrante necesita una fotografía.");

    const existing = current.team.find((member) => member.id === id)!;
    await saveTeamMember({
      ...existing,
      name,
      role,
      description,
      linkedin,
      photo,
      order: numberValue(data, "order", existing.order),
      showInHero: data.get("showInHero") === "on",
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
  await removeTeamMember(id);
  redirectWith("/admin/equipo", "success", "Integrante eliminado.");
}

export async function createBrand(data: FormData) {
  assertAdmin();
  let error = "";

  try {
    const name = requireValue(text(data, "name"), "nombre");
    const logo = await saveImageFile(data.get("logo"), {
      folder: "brands",
      width: 600,
      quality: 88,
    });
    if (!logo) throw new Error("Seleccioná el logo de la marca.");

    const brand: Brand = {
      id: randomUUID(),
      name,
      logo,
      order: numberValue(data, "order", 99),
    };

    await saveBrand(brand);
  } catch (caught) {
    error = errorMessage(caught);
  }

  if (error) redirectWith("/admin/marcas", "error", error);
  redirectWith("/admin/marcas", "success", "Marca agregada.");
}

export async function updateBrand(data: FormData) {
  assertAdmin();
  let error = "";

  try {
    const id = requireValue(text(data, "id"), "marca");
    const current = await getContent();
    const existing = current.brands.find((brand) => brand.id === id);
    if (!existing) throw new Error("La marca ya no existe.");

    const name = requireValue(text(data, "name"), "nombre");
    const uploaded = await saveImageFile(data.get("logo"), {
      folder: "brands",
      width: 600,
      quality: 88,
    });
    const logo = uploaded || text(data, "currentLogo");
    if (!logo) throw new Error("La marca necesita un logo.");

    await saveBrand({
      ...existing,
      name,
      logo,
      order: numberValue(data, "order", existing.order),
    });
  } catch (caught) {
    error = errorMessage(caught);
  }

  if (error) redirectWith("/admin/marcas", "error", error);
  redirectWith("/admin/marcas", "success", "Marca actualizada.");
}

export async function deleteBrand(data: FormData) {
  assertAdmin();
  const id = text(data, "id");
  await removeBrand(id);
  redirectWith("/admin/marcas", "success", "Marca eliminada.");
}

export async function createGalleryImage(data: FormData) {
  assertAdmin();
  let error = "";

  try {
    const image = await saveImageFile(data.get("image"), {
      folder: "team-gallery",
      width: 900,
      quality: 82,
    });
    if (!image) throw new Error("Seleccioná una fotografía para la galería.");

    const item: TeamGalleryImage = {
      id: randomUUID(),
      image,
      alt: text(data, "alt"),
      order: numberValue(data, "order", 99),
    };

    await saveTeamGalleryImage(item);
  } catch (caught) {
    error = errorMessage(caught);
  }

  if (error) redirectWith("/admin/galeria", "error", error);
  redirectWith("/admin/galeria", "success", "Fotografía agregada.");
}

export async function updateGalleryImage(data: FormData) {
  assertAdmin();
  let error = "";

  try {
    const id = requireValue(text(data, "id"), "fotografía");
    const current = await getContent();
    const existing = current.teamGallery.find((item) => item.id === id);
    if (!existing) throw new Error("La fotografía ya no existe.");

    const uploaded = await saveImageFile(data.get("image"), {
      folder: "team-gallery",
      width: 900,
      quality: 82,
    });
    const image = uploaded || text(data, "currentImage");
    if (!image) throw new Error("La fotografía necesita una imagen.");

    await saveTeamGalleryImage({
      ...existing,
      image,
      alt: text(data, "alt"),
      order: numberValue(data, "order", existing.order),
    });
  } catch (caught) {
    error = errorMessage(caught);
  }

  if (error) redirectWith("/admin/galeria", "error", error);
  redirectWith("/admin/galeria", "success", "Fotografía actualizada.");
}

export async function deleteGalleryImage(data: FormData) {
  assertAdmin();
  const id = text(data, "id");
  await removeTeamGalleryImage(id);
  redirectWith("/admin/galeria", "success", "Fotografía eliminada.");
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
    for (let index = 0; index < 6; index += 1) {
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

    await saveHero({
      backgroundImage,
      backgroundAlt: text(data, "backgroundAlt") || "Imagen principal de Kaizen",
      supportImages,
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

    const requestedSlug = slugify(text(data, "slug") || title);
    let slug = requestedSlug || `nota-${Date.now()}`;
    let suffix = 2;
    while (await slugExists(slug)) {
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

    await savePost(post);
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
    while (await slugExists(slug, existing.id)) {
      slug = `${requestedSlug}-${suffix}`;
      suffix += 1;
    }

    await savePost({
      ...existing,
      slug,
      title,
      tag,
      excerpt,
      content: contentText,
      coverImage,
      coverAlt: text(data, "coverAlt") || title,
      published: data.get("published") === "on",
      publishedAt: parseDate(text(data, "publishedAt"), existing.publishedAt),
      updatedAt: new Date().toISOString(),
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
  await removePost(id);
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

    const requestedSlug = slugify(text(data, "slug") || title) || `servicio-${Date.now()}`;
    let slug = requestedSlug;
    let suffix = 2;
    while (await serviceSlugExists(slug)) {
      slug = `${requestedSlug}-${suffix}`;
      suffix += 1;
    }

    const service: Service = {
      id: randomUUID(),
      slug,
      category: text(data, "category"),
      title,
      shortDescription,
      description,
      intro: text(data, "intro"),
      content: text(data, "content"),
      highlights: parseHighlights(text(data, "highlights")),
      relatedServiceId: text(data, "relatedServiceId") || undefined,
      image,
      imageAlt: text(data, "imageAlt") || title,
      icon: text(data, "icon") || "flask",
      labels: listValue(data, "labels"),
      keywords: text(data, "keywords"),
      ctaLabel: text(data, "ctaLabel") || "Consultar",
      ctaHref: safeHref(text(data, "ctaHref") || "#contacto"),
      featured: data.get("featured") === "on",
      seoTitle: text(data, "seoTitle"),
      seoDescription: text(data, "seoDescription"),
      order: numberValue(data, "order", 99),
    };

    await saveService(service);
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
    const existing = current.services.find((service) => service.id === id);
    if (!existing) throw new Error("El servicio ya no existe.");

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

    const requestedSlug =
      slugify(text(data, "slug") || title) || existing.slug || `servicio-${Date.now()}`;
    let slug = requestedSlug;
    let suffix = 2;
    while (await serviceSlugExists(slug, existing.id)) {
      slug = `${requestedSlug}-${suffix}`;
      suffix += 1;
    }

    await saveService({
      ...existing,
      slug,
      category: text(data, "category"),
      title,
      shortDescription,
      description,
      intro: text(data, "intro"),
      content: text(data, "content"),
      highlights: parseHighlights(text(data, "highlights")),
      relatedServiceId: text(data, "relatedServiceId") || undefined,
      image,
      imageAlt: text(data, "imageAlt") || title,
      icon: text(data, "icon") || existing.icon,
      labels: listValue(data, "labels"),
      keywords: text(data, "keywords"),
      ctaLabel: text(data, "ctaLabel") || "Consultar",
      ctaHref: safeHref(text(data, "ctaHref") || "#contacto"),
      featured: data.get("featured") === "on",
      seoTitle: text(data, "seoTitle"),
      seoDescription: text(data, "seoDescription"),
      order: numberValue(data, "order", existing.order),
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
  await removeService(id);
  redirectWith("/admin/servicios", "success", "Servicio eliminado.");
}

export async function createServiceCategory(data: FormData) {
  assertAdmin();
  let error = "";

  try {
    const name = requireValue(text(data, "name"), "nombre");
    const category: ServiceCategory = {
      id: randomUUID(),
      name,
      order: numberValue(data, "order", 99),
    };
    await saveServiceCategory(category);
  } catch (caught) {
    error = errorMessage(caught);
  }

  if (error) redirectWith("/admin/categorias", "error", error);
  redirectWith("/admin/categorias", "success", "Categoría agregada.");
}

export async function updateServiceCategory(data: FormData) {
  assertAdmin();
  let error = "";

  try {
    const id = requireValue(text(data, "id"), "categoría");
    const current = await getContent();
    const existing = current.serviceCategories.find((category) => category.id === id);
    if (!existing) throw new Error("La categoría ya no existe.");

    const name = requireValue(text(data, "name"), "nombre");
    await saveServiceCategory(
      {
        ...existing,
        name,
        order: numberValue(data, "order", existing.order),
      },
      existing.name,
    );
  } catch (caught) {
    error = errorMessage(caught);
  }

  if (error) redirectWith("/admin/categorias", "error", error);
  redirectWith("/admin/categorias", "success", "Categoría actualizada.");
}

export async function deleteServiceCategory(data: FormData) {
  assertAdmin();
  let error = "";
  let affected = 0;

  try {
    const id = requireValue(text(data, "id"), "categoría");
    const current = await getContent();
    const existing = current.serviceCategories.find((category) => category.id === id);
    if (!existing) throw new Error("La categoría ya no existe.");
    affected = current.services.filter((service) => service.category === existing.name).length;
    await removeServiceCategory(id);
  } catch (caught) {
    error = errorMessage(caught);
  }

  if (error) redirectWith("/admin/categorias", "error", error);
  redirectWith(
    "/admin/categorias",
    "success",
    affected > 0
      ? `Categoría eliminada. ${affected} servicios quedaron sin categoría.`
      : "Categoría eliminada.",
  );
}

export async function createFaq(data: FormData) {
  assertAdmin();
  let error = "";
  const serviceId = text(data, "serviceId");
  const back = adminPath(text(data, "redirectTo"), "/admin/servicios");

  try {
    const question = requireValue(text(data, "question"), "pregunta");
    const answer = requireValue(text(data, "answer"), "respuesta");
    await saveFaq({
      id: randomUUID(),
      serviceId: serviceId || undefined,
      question,
      answer,
      order: numberValue(data, "order", 99),
    });
  } catch (caught) {
    error = errorMessage(caught);
  }

  if (error) redirectWith(back, "error", error);
  redirectWith(back, "success", "Pregunta agregada.");
}

export async function updateFaq(data: FormData) {
  assertAdmin();
  let error = "";
  const back = adminPath(text(data, "redirectTo"), "/admin/servicios");

  try {
    const id = requireValue(text(data, "id"), "pregunta");
    const current = await getContent();
    const existing = current.faqs.find((faq) => faq.id === id);
    if (!existing) throw new Error("La pregunta ya no existe.");

    await saveFaq({
      ...existing,
      question: requireValue(text(data, "question"), "pregunta"),
      answer: requireValue(text(data, "answer"), "respuesta"),
      order: numberValue(data, "order", existing.order),
    });
  } catch (caught) {
    error = errorMessage(caught);
  }

  if (error) redirectWith(back, "error", error);
  redirectWith(back, "success", "Pregunta actualizada.");
}

export async function deleteFaq(data: FormData) {
  assertAdmin();
  const id = text(data, "id");
  await removeFaq(id);
  redirectWith(
    adminPath(text(data, "redirectTo"), "/admin/servicios"),
    "success",
    "Pregunta eliminada.",
  );
}

export async function updateSettings(data: FormData) {
  assertAdmin();
  let error = "";

  try {
    await saveSettings({
      contactEmail: requireValue(text(data, "contactEmail"), "correo"),
      whatsappNumber: requireValue(text(data, "whatsappNumber"), "número de WhatsApp"),
      whatsappDisplay: requireValue(text(data, "whatsappDisplay"), "número visible"),
      heroEyebrow: requireValue(text(data, "heroEyebrow"), "antetítulo del hero"),
      heroTitle: requireValue(text(data, "heroTitle"), "H1 principal"),
      heroTitleAccent: requireValue(text(data, "heroTitleAccent"), "H1 principal destacado"),
      heroSubheading: requireValue(text(data, "heroSubheading"), "H2 comercial"),
      heroParagraph: requireValue(text(data, "heroParagraph"), "párrafo del hero"),
      homeSeoTitle: requireValue(text(data, "homeSeoTitle"), "título SEO"),
      homeSeoDescription: requireValue(text(data, "homeSeoDescription"), "metadescripción"),
      trustTitle: requireValue(text(data, "trustTitle"), "título de la franja de marcas"),
      contactAddress:
        text(data, "contactAddress") || "Av. Gral. Paz 1481, Montevideo",
      contactAddressUrl: safeHref(
        text(data, "contactAddressUrl") ||
          "https://www.google.com/maps/search/?api=1&query=Av.%20Gral.%20Paz%201481%2C%20Montevideo%2C%20Uruguay",
      ),
      contactEmailProposed: text(data, "contactEmailProposed"),
    });
  } catch (caught) {
    error = errorMessage(caught);
  }

  if (error) redirectWith("/admin/sitio", "error", error);
  redirectWith("/admin/sitio", "success", "Textos del sitio actualizados.");
}

export async function toggleLeadStatus(data: FormData) {
  assertAdmin();
  const id = text(data, "id");
  await toggleLead(id);
  redirectWith("/admin/mensajes", "success", "Estado del mensaje actualizado.");
}

export async function deleteLead(data: FormData) {
  assertAdmin();
  const id = text(data, "id");
  await removeLead(id);
  redirectWith("/admin/mensajes", "success", "Mensaje eliminado.");
}
