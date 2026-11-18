import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getServiceIcon } from "@/components/service-icons";
import { ArrowRight, Search, Sparkle } from "@/components/icons";
import {
  getContent,
  getFeaturedServices,
  groupServicesByCategory,
  sortFaqs,
  sortServices,
} from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Servicios | Kaizen",
  description:
    "Ingeniería de alimentos, calidad, inocuidad, dirección técnica, registros, habilitaciones, rotulado, ambiente y residuos. Soluciones técnicas para cada etapa de su empresa.",
};

export default async function ServiciosPage() {
  const content = await getContent();
  const services = sortServices(content.services);
  const featured = getFeaturedServices(services);
  const globalFaqs = sortFaqs(content.faqs.filter((faq) => !faq.serviceId));
  const categories = groupServicesByCategory(services, content.serviceCategories);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: globalFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" tabIndex={-1} className="outline-none">
        <section className="border-b border-line bg-[linear-gradient(180deg,#f4f8fd,#eaf3fc)] pb-12 pt-10 sm:pb-16 sm:pt-14">
          <div className="shell">
            <nav aria-label="Migas de pan" className="mb-5">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.1em] text-muted transition hover:text-blue-text"
              >
                Inicio
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </nav>
            <div className="eyebrow">Servicios</div>
            <h1 className="mt-4 max-w-[760px] font-display text-[clamp(42px,6vw,70px)] font-extrabold leading-[0.98] tracking-[-0.05em] text-ink">
              Respaldo técnico para cada etapa.
            </h1>
            <p className="mt-5 max-w-[640px] text-[15.5px] leading-7 text-body">
              Soluciones para el producto, la operación y el cumplimiento de su
              empresa. Cada servicio tiene su ficha con alcance, entregables y
              preguntas frecuentes.
            </p>

            <form
              role="search"
              action="/buscar"
              method="get"
              className="mt-8 flex max-w-[620px] items-center gap-3 rounded-[18px] border border-line bg-white p-2 pl-4 shadow-card transition focus-within:border-blue/45 focus-within:shadow-[0_0_0_4px_rgba(8,117,233,.09)] sm:pl-5"
            >
              <Search className="h-5 w-5 shrink-0 text-blue" />
              <label htmlFor="services-page-search" className="sr-only">
                Buscar en servicios, preguntas frecuentes y blog
              </label>
              <input
                id="services-page-search"
                type="search"
                name="q"
                autoComplete="off"
                placeholder="Busque por ej. RUNAEV, rotulado o importar"
                className="min-w-0 flex-1 bg-transparent py-2.5 text-[14px] text-ink placeholder:text-[#93a3b6] focus:outline-none"
              />
              <button type="submit" className="btn btn-primary btn-sm shrink-0">
                Buscar
                <ArrowRight className="h-[17px] w-[17px]" />
              </button>
            </form>
          </div>
        </section>

        <section className="py-14 sm:py-16 lg:py-20">
          <div className="shell">
            <div className="max-w-[640px]">
              <div className="eyebrow">Los más consultados</div>
              <h2 className="mt-4 font-display text-[clamp(30px,4vw,44px)] font-extrabold leading-[1.04] tracking-[-0.045em] text-ink">
                Servicios prioritarios.
              </h2>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {featured.map((service) => {
                const Icon = getServiceIcon(service.icon);
                return (
                  <article
                    key={service.id}
                    className="navy-surface navy-card group relative flex flex-col gap-2 p-6"
                  >
                    <Icon className="h-7 w-7 text-celeste" />
                    <ArrowRight className="absolute right-5 top-5 h-[18px] w-[18px] text-celeste transition group-hover:translate-x-1" />
                    <h3 className="mt-2 font-display text-[21px] font-extrabold leading-6 tracking-[-0.03em] text-white">
                      {service.title}
                    </h3>
                    <p className="text-[13px] leading-6 text-navy-soft">
                      {service.shortDescription}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                      <Link
                        href={`/servicios/${service.slug}`}
                        className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.08em] text-celeste transition hover:text-white"
                      >
                        Conocer más
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href="/#contacto"
                        className="text-[11px] font-semibold text-navy-soft underline decoration-white/25 underline-offset-4 transition hover:text-celeste"
                      >
                        Solicitar asesoramiento
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-y border-line bg-white py-14 sm:py-16 lg:py-20">
          <div className="shell">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div className="max-w-[640px]">
                <div className="eyebrow">Todos los servicios</div>
                <h2 className="mt-4 font-display text-[clamp(30px,4vw,44px)] font-extrabold leading-[1.04] tracking-[-0.045em] text-ink">
                  Encuentre el que necesita.
                </h2>
              </div>
              <p className="text-[12px] font-semibold text-muted">
                {services.length} servicios con ficha propia
              </p>
            </div>

            <nav aria-label="Categorías de servicios" className="mt-8 flex flex-wrap gap-2">
              {categories.map((group, index) => (
                <a
                  key={`nav-${group.category}`}
                  href={`#categoria-${index}`}
                  className="rounded-full border border-line bg-white px-4 py-2 text-[11.5px] font-bold text-ink transition hover:border-blue/40 hover:text-blue-text"
                >
                  {group.category || "Otros servicios"} · {group.services.length}
                </a>
              ))}
            </nav>

            <div className="mt-10 space-y-12">
              {categories.map((group, index) => (
                <section
                  key={`group-${group.category}`}
                  id={`categoria-${index}`}
                  aria-labelledby={`categoria-titulo-${index}`}
                  className="scroll-mt-28"
                >
                  <div className="flex flex-wrap items-end justify-between gap-2 border-b border-line pb-4">
                    <h3
                      id={`categoria-titulo-${index}`}
                      className="font-display text-[24px] font-extrabold tracking-[-0.035em] text-ink"
                    >
                      {group.category || "Otros servicios"}
                    </h3>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
                      {group.services.length}{" "}
                      {group.services.length === 1 ? "servicio" : "servicios"}
                    </p>
                  </div>
                  <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {group.services.map((service) => {
                      const Icon = getServiceIcon(service.icon);
                      return (
                        <article
                          key={service.id}
                          className="navy-surface navy-card group flex flex-col"
                        >
                          <Link
                            href={`/servicios/${service.slug}`}
                            className="relative block h-[154px] overflow-hidden bg-navy-deep"
                          >
                            <Image
                              src={service.image}
                              alt={service.imageAlt}
                              fill
                              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                              className="object-cover transition duration-700 group-hover:scale-[1.04]"
                            />
                            <div className="service-photo-overlay absolute inset-0" />
                            <div className="navy-icon absolute bottom-4 left-4 h-11 w-11 shadow-[0_10px_24px_-16px_rgba(0,0,0,.9)]">
                              <Icon className="h-[21px] w-[21px]" />
                            </div>
                          </Link>
                          <div className="flex flex-1 flex-col p-5">
                            <h4 className="font-display text-[20px] font-extrabold leading-[1.18] tracking-[-0.03em] text-white">
                              <Link href={`/servicios/${service.slug}`} className="transition hover:text-celeste">
                                {service.title}
                              </Link>
                            </h4>
                            <p className="mt-2 flex-1 text-[13px] leading-6 text-navy-soft">
                              {service.shortDescription}
                            </p>
                            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                              <Link
                                href={`/servicios/${service.slug}`}
                                className="inline-flex items-center gap-1.5 text-[12px] font-bold text-celeste transition hover:gap-2.5"
                              >
                                Conocer más
                                <ArrowRight className="h-4 w-4" />
                              </Link>
                              <Link
                                href="/#contacto"
                                className="text-[11px] font-semibold text-navy-soft underline decoration-white/25 underline-offset-4 transition hover:text-celeste"
                              >
                                Solicitar asesoramiento
                              </Link>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>

        <section id="preguntas" className="py-14 sm:py-16 lg:py-20">
          <div className="shell max-w-[900px]">
            <div className="eyebrow">Preguntas frecuentes</div>
            <h2 className="mt-4 font-display text-[clamp(30px,4vw,44px)] font-extrabold leading-[1.04] tracking-[-0.045em] text-ink">
              Dudas que aparecen siempre.
            </h2>
            <p className="mt-4 max-w-[620px] text-[14.5px] leading-7 text-body">
              Si su consulta no está aquí, escríbanos y la revisamos con
              criterio técnico.
            </p>

            <div className="navy-surface mt-8 divide-y divide-white/10">
              {globalFaqs.map((faq) => (
                <details key={faq.id} className="group px-5 py-4 sm:px-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[14.5px] font-bold leading-6 text-white marker:hidden">
                    {faq.question}
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/15 text-celeste transition group-open:rotate-45">
                      <span className="text-[16px] leading-none">+</span>
                    </span>
                  </summary>
                  <p className="mt-3 max-w-[720px] text-[13.5px] leading-6 text-navy-soft">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>

            <div className="navy-surface mt-8 flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
              <div className="flex items-start gap-3">
                <Sparkle className="mt-0.5 h-5 w-5 shrink-0 text-celeste" />
                <p className="text-[13px] leading-6 text-navy-soft">
                  ¿No encuentra lo que busca?{" "}
                  <Link href="/buscar" className="font-bold text-celeste underline underline-offset-4">
                    Busque en todo el sitio
                  </Link>{" "}
                  o consúltenos.
                </p>
              </div>
              <Link href="/#contacto" className="btn btn-primary btn-sm">
                Hablar con Kaizen
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
