import type { BlogPost, Content, Faq, Service } from "@/lib/types";
import { normalizeText } from "@/lib/utils";

const STOPWORDS = new Set([
  "de",
  "del",
  "la",
  "el",
  "los",
  "las",
  "un",
  "una",
  "unos",
  "unas",
  "y",
  "o",
  "u",
  "en",
  "para",
  "por",
  "con",
  "sin",
  "al",
  "a",
  "que",
  "mi",
  "su",
]);

const SYNONYMS: Record<string, string[]> = {
  organico: ["organico", "organica", "organicos", "organicas", "ecologico"],
  organica: ["organico", "organica", "organicos", "organicas", "ecologico"],
  organicos: ["organico", "organica", "organicos", "organicas", "ecologico"],
  organicas: ["organico", "organica", "organicos", "organicas", "ecologico"],
  gluten: ["gluten", "alergeno", "alergenos", "celiaco", "celiacos"],
  alergeno: ["alergeno", "alergenos", "gluten"],
  alergenos: ["alergeno", "alergenos", "gluten"],
  vehiculo: ["vehiculo", "vehiculos", "transporte", "camion", "camiones"],
  vehiculos: ["vehiculo", "vehiculos", "transporte", "camion", "camiones"],
  transporte: ["transporte", "vehiculo", "vehiculos"],
  latu: ["latu", "sigla"],
  sigla: ["sigla", "latu"],
  mgap: ["mgap"],
  runaev: ["runaev", "registro", "empresa"],
  msp: ["msp", "ministerio", "salud"],
  rotulo: ["rotulo", "rotulado", "etiqueta", "etiquetas"],
  rotulado: ["rotulo", "rotulado", "etiqueta", "etiquetas"],
  etiqueta: ["etiqueta", "etiquetas", "rotulo", "rotulado"],
  habilitacion: ["habilitacion", "habilitaciones", "local", "locales"],
  habilitaciones: ["habilitacion", "habilitaciones", "local", "locales"],
  registro: ["registro", "registros", "registrar", "runaev"],
  residuo: ["residuo", "residuos", "ambiente", "ambiental"],
  residuos: ["residuo", "residuos", "ambiente", "ambiental"],
  ambiente: ["ambiente", "ambiental", "residuo", "residuos"],
  inocuidad: ["inocuidad", "haccp", "bpm", "poes", "peligro", "peligros"],
  haccp: ["haccp", "inocuidad", "bpm", "poes"],
  bpm: ["bpm", "poes", "haccp", "inocuidad"],
  poes: ["poes", "bpm", "haccp", "inocuidad"],
  direccion: ["direccion", "director", "tecnica", "tecnico"],
  tecnica: ["tecnica", "tecnico", "direccion"],
  analisis: ["analisis", "laboratorio", "ensayo", "ensayos"],
  importar: ["importar", "importacion", "importaciones"],
  importacion: ["importar", "importacion", "importaciones"],
  exportar: ["exportar", "exportacion", "exportaciones"],
  exportacion: ["exportar", "exportacion", "exportaciones"],
};

export const searchChips = [
  "RUNAEV",
  "Rotulado",
  "Habilitación",
  "Orgánico",
  "Vehículos",
  "LATU",
  "Residuos",
  "HACCP",
];

export type SearchResults = {
  services: Service[];
  faqs: Faq[];
  posts: BlogPost[];
  total: number;
  query: string;
};

function tokens(value: string) {
  return normalizeText(value)
    .split(" ")
    .filter((token) => token.length > 1 && !STOPWORDS.has(token));
}

function expand(token: string) {
  return SYNONYMS[token] ?? [token];
}

function scoreText(text: string, queryTokens: string[]) {
  const words = new Set(tokens(text));
  let matched = 0;
  for (const token of queryTokens) {
    if (expand(token).some((term) => words.has(term))) matched += 1;
  }
  return matched;
}

function serviceText(service: Service) {
  return [
    service.title,
    service.category,
    service.shortDescription,
    service.description,
    service.intro,
    service.content,
    service.labels.join(" "),
    service.keywords,
    service.highlights.map((item) => `${item.title} ${item.description}`).join(" "),
  ].join(" ");
}

function faqText(faq: Faq) {
  return `${faq.question} ${faq.answer}`;
}

function postText(post: BlogPost) {
  return `${post.title} ${post.tag} ${post.excerpt} ${post.content}`;
}

export function matchesServiceQuery(service: Service, rawQuery: string) {
  const queryTokens = tokens(rawQuery);
  if (queryTokens.length === 0) return true;
  return scoreText(serviceText(service), queryTokens) > 0;
}

export function searchAll(content: Content, rawQuery: string): SearchResults {
  const query = rawQuery.trim();
  const queryTokens = tokens(query);
  if (queryTokens.length === 0) {
    return { services: [], faqs: [], posts: [], total: 0, query };
  }

  const services = content.services
    .map((service) => ({ item: service, score: scoreText(serviceText(service), queryTokens) }))
    .filter((entry) => entry.score > 0);
  const faqs = content.faqs
    .map((faq) => ({ item: faq, score: scoreText(faqText(faq), queryTokens) }))
    .filter((entry) => entry.score > 0);
  const posts = content.posts
    .filter((post) => post.published)
    .map((post) => ({ item: post, score: scoreText(postText(post), queryTokens) }))
    .filter((entry) => entry.score > 0);

  const all = [...services, ...faqs, ...posts];
  const requiresAll = queryTokens.length > 1;
  const exact = requiresAll && all.some((entry) => entry.score === queryTokens.length);

  const keep = (entry: { score: number }) =>
    exact ? entry.score === queryTokens.length : entry.score > 0;

  return {
    services: services
      .filter(keep)
      .sort((a, b) => b.score - a.score || a.item.order - b.item.order)
      .map((entry) => entry.item),
    faqs: faqs
      .filter(keep)
      .sort((a, b) => b.score - a.score || a.item.order - b.item.order)
      .map((entry) => entry.item),
    posts: posts
      .filter(keep)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.item),
    total: all.filter(keep).length,
    query,
  };
}
