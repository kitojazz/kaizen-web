import type { Metadata } from "next";
import Link from "next/link";
import Blog from "@/components/Blog";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getServiceIcon } from "@/components/service-icons";
import { ArrowRight, Search, Sparkle } from "@/components/icons";
import { getContent } from "@/lib/content";
import { searchAll, searchChips } from "@/lib/search";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Buscar | Kaizen",
  description:
    "Busque servicios, preguntas frecuentes y notas del blog de Kaizen.",
  robots: { index: false },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const raw = searchParams?.q;
  const query = typeof raw === "string" ? raw : "";
  const content = await getContent();
  const results = searchAll(content, query);
  const serviceById = new Map(
    content.services.map((service) => [service.id, service]),
  );

  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" tabIndex={-1} className="outline-none">
        <section className="border-b border-line bg-[linear-gradient(180deg,#f4f8fd,#eaf3fc)] pb-12 pt-10 sm:pb-14 sm:pt-14">
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
            <div className="eyebrow">Buscar</div>
            <h1 className="mt-4 max-w-[720px] font-display text-[clamp(38px,5.6vw,64px)] font-extrabold leading-[0.99] tracking-[-0.05em] text-ink">
              ¿Qué está buscando?
            </h1>
            <p className="mt-4 max-w-[600px] text-[15px] leading-7 text-body">
              Busque en servicios, preguntas frecuentes y notas del blog.
            </p>

            <form
              role="search"
              action="/buscar"
              method="get"
              className="mt-7 flex max-w-[680px] items-center gap-3 rounded-[18px] border border-line bg-white p-2 pl-4 shadow-card transition focus-within:border-blue/45 focus-within:shadow-[0_0_0_4px_rgba(8,117,233,.09)] sm:pl-5"
            >
              <Search className="h-5 w-5 shrink-0 text-blue" />
              <label htmlFor="global-search" className="sr-only">
                Buscar en el sitio
              </label>
              <input
                id="global-search"
                type="search"
                name="q"
                autoComplete="off"
                defaultValue={query}
                placeholder="Ej. RUNAEV, rotulado, orgánico, vehículos"
                className="min-w-0 flex-1 bg-transparent py-2.5 text-[14px] text-ink placeholder:text-[#93a3b6] focus:outline-none"
              />
              <button type="submit" className="btn btn-primary btn-sm shrink-0">
                Buscar
                <ArrowRight className="h-[17px] w-[17px]" />
              </button>
            </form>

            <div className="mt-3 flex flex-wrap items-center gap-2" aria-label="Búsquedas frecuentes">
              <span className="mr-1 text-[10.5px] font-bold tracking-[0.04em] text-muted">
                Búsquedas frecuentes
              </span>
              {searchChips.map((chip) => {
                const active = chip.toLowerCase() === query.trim().toLowerCase();
                return (
                  <Link
                    key={chip}
                    href={`/buscar?q=${encodeURIComponent(chip)}`}
                    className={`rounded-full border px-3 py-1.5 text-[10.5px] font-semibold transition ${
                      active
                        ? "border-blue/40 bg-mist text-blue-text"
                        : "border-line bg-white/60 text-[#5d6c81] hover:border-blue/35 hover:bg-mist/60 hover:text-blue-text"
                    }`}
                  >
                    {chip}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-14 lg:py-16">
          <div className="shell">
            {query.trim() === "" ? (
              <div className="navy-surface border-dashed p-8">
                <div className="flex items-start gap-3">
                  <Sparkle className="mt-0.5 h-5 w-5 shrink-0 text-celeste" />
                  <div>
                    <p className="font-display text-[20px] font-extrabold tracking-[-0.03em] text-white">
                      Escriba una palabra o elija una búsqueda frecuente.
                    </p>
                    <p className="mt-2 max-w-[560px] text-[13.5px] leading-6 text-navy-soft">
                      Por ejemplo: <strong className="font-bold text-white">RUNAEV</strong>{" "}
                      para registros, <strong className="font-bold text-white">rotulado</strong>{" "}
                      para etiquetas o <strong className="font-bold text-white">vehículos</strong>{" "}
                      para transporte y MGAP.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <p className="text-[12px] font-semibold text-muted" aria-live="polite">
                  {results.total === 0
                    ? `Sin resultados para “${query.trim()}”`
                    : `${results.total} ${
                        results.total === 1 ? "resultado" : "resultados"
                      } para “${query.trim()}”`}
                </p>

                {results.total === 0 ? (
                  <div className="navy-surface mt-4 border-dashed p-8">
                    <p className="font-display text-[20px] font-extrabold tracking-[-0.03em] text-white">
                      No encontramos coincidencias.
                    </p>
                    <p className="mt-2 max-w-[560px] text-[13.5px] leading-6 text-navy-soft">
                      Pruebe con otra palabra o{" "}
                      <Link
                        href="/#contacto"
                        className="font-bold text-celeste underline underline-offset-4"
                      >
                        escríbanos
                      </Link>{" "}
                      y lo orientamos.
                    </p>
                  </div>
                ) : null}
              </>
            )}

            {results.services.length > 0 ? (
              <div className="mt-8">
                <h2 className="text-[9.5px] font-extrabold uppercase tracking-[0.16em] text-blue-text">
                  Servicios
                </h2>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {results.services.map((service) => {
                    const Icon = getServiceIcon(service.icon);
                    return (
                      <Link
                        key={service.id}
                        href={`/servicios/${service.slug}`}
                        className="navy-surface navy-card group flex gap-4 p-5"
                      >
                        <span className="navy-icon h-11 w-11 shrink-0 rounded-[13px]">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="min-w-0">
                          <span className="block font-display text-[18px] font-extrabold leading-6 tracking-[-0.03em] text-white transition group-hover:text-celeste">
                            {service.title}
                          </span>
                          <span className="mt-1 block text-[12.5px] leading-5 text-navy-soft">
                            {service.shortDescription}
                          </span>
                        </span>
                        <ArrowRight className="ml-auto mt-1 h-4 w-4 shrink-0 text-celeste transition group-hover:translate-x-1" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {results.faqs.length > 0 ? (
              <div className="mt-10">
                <h2 className="text-[9.5px] font-extrabold uppercase tracking-[0.16em] text-blue-text">
                  Preguntas frecuentes
                </h2>
                <div className="navy-surface mt-4 divide-y divide-white/10">
                  {results.faqs.map((faq) => {
                    const service = faq.serviceId
                      ? serviceById.get(faq.serviceId)
                      : undefined;
                    return (
                      <details key={faq.id} className="group px-5 py-4">
                        <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[14px] font-bold leading-6 text-white marker:hidden">
                          <span>
                            {service ? (
                              <span className="mb-1 block text-[9px] font-extrabold uppercase tracking-[0.12em] text-navy-soft">
                                {service.title}
                              </span>
                            ) : null}
                            {faq.question}
                          </span>
                          <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/15 text-celeste transition group-open:rotate-45">
                            <span className="text-[16px] leading-none">+</span>
                          </span>
                        </summary>
                        <p className="mt-3 max-w-[720px] text-[13.5px] leading-6 text-navy-soft">
                          {faq.answer}
                        </p>
                      </details>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {results.posts.length > 0 ? (
              <div className="mt-10">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                  <h2 className="text-[9.5px] font-extrabold uppercase tracking-[0.16em] text-blue-text">
                    Notas del blog
                  </h2>
                  <Link href="/blog" className="text-link">
                    Ver todo el blog
                    <ArrowRight />
                  </Link>
                </div>
                <Blog posts={results.posts} showAllLink={false} />
              </div>
            ) : null}
          </div>
        </section>

        <section className="border-t border-line bg-white py-14">
          <div className="shell flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-[9.5px] font-extrabold uppercase tracking-[0.16em] text-blue-text">
                ¿No encontró lo que buscaba?
              </p>
              <h2 className="mt-2 font-display text-[clamp(26px,3vw,36px)] font-extrabold tracking-[-0.04em] text-ink">
                Lo revisamos con usted.
              </h2>
            </div>
            <Link href="/#contacto" className="btn btn-primary">
              Hablar con Kaizen
              <ArrowRight className="h-[18px] w-[18px]" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
