"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { matchesServiceQuery, searchChips } from "@/lib/search";
import type { Service } from "@/lib/types";
import { getServiceIcon } from "./service-icons";
import {
  ArrowRight,
  CalendarCheck,
  GraduationCap,
  Search,
  Users,
} from "./icons";

const miniServices = [
  {
    title: "Planes de análisis",
    description: "Qué analizar, con qué frecuencia y cómo hacer el seguimiento.",
    href: "/servicios/calidad",
    icon: CalendarCheck,
  },
  {
    title: "Dirección técnica",
    description: "Acompañamiento permanente y representación ante organismos.",
    href: "/servicios/direccion-tecnica",
    icon: Users,
  },
  {
    title: "Capacitaciones",
    description: "Formación aplicada a los procesos y documentos de su empresa.",
    href: "/#contacto",
    icon: GraduationCap,
  },
];

export default function Services({ services }: { services: Service[] }) {
  const [query, setQuery] = useState("");
  const [activeChip, setActiveChip] = useState("");
  const [activeService, setActiveService] = useState(0);
  const servicesRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const normalizedQuery = query.trim();

  const filteredServices = useMemo(() => {
    if (!normalizedQuery) return services;
    return services.filter((service) => matchesServiceQuery(service, normalizedQuery));
  }, [normalizedQuery, services]);

  const handleChip = (chip: string) => {
    const next = activeChip === chip ? "" : chip;
    setActiveChip(next);
    setQuery(next);
  };

  const serviceStep = () => {
    const card = servicesRef.current?.querySelector<HTMLElement>("[data-service-card]");
    return card ? card.offsetWidth + 12 : 1;
  };

  const handleServiceScroll = () => {
    const scroller = servicesRef.current;
    if (!scroller) return;
    setActiveService(Math.max(0, Math.round(scroller.scrollLeft / serviceStep())));
  };

  const goToService = (index: number) => {
    servicesRef.current?.scrollTo({
      left: index * serviceStep(),
      behavior: "smooth",
    });
  };

  const activeServiceIndex = Math.min(
    activeService,
    Math.max(filteredServices.length - 1, 0),
  );

  return (
    <section
      id="servicios"
      aria-labelledby="services-title"
      className="py-16 sm:py-20 lg:py-24"
    >
      <div className="shell">
        <div className="section-head flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-[640px]">
            <div className="eyebrow">Servicios</div>
            <h2
              id="services-title"
              className="mt-4 font-display text-[clamp(36px,4.4vw,54px)] font-extrabold leading-[1.02] tracking-[-0.045em] text-ink"
            >
              Respaldo técnico para cada etapa.
            </h2>
            <p className="mt-4 max-w-[560px] text-[15px] leading-7 text-body">
              Soluciones para el producto, la operación y el cumplimiento de su
              empresa. Busque por trámite, producto o necesidad.
            </p>
          </div>
          <Link href="/servicios" className="text-link pb-1">
            Ver todos los servicios
            <ArrowRight />
          </Link>
        </div>

        <form
          role="search"
          className="mt-9 flex items-center gap-3 rounded-[18px] border border-line bg-white p-2 pl-4 shadow-card transition focus-within:border-blue/45 focus-within:shadow-[0_0_0_4px_rgba(8,117,233,.09)] sm:pl-5"
          onSubmit={(event) => {
            event.preventDefault();
            const value = query.trim();
            router.push(value ? `/buscar?q=${encodeURIComponent(value)}` : "/buscar");
          }}
        >
          <Search className="h-5 w-5 shrink-0 text-blue" />
          <label htmlFor="service-search" className="sr-only">
            Buscar servicios y trámites
          </label>
          <input
            id="service-search"
            type="search"
            autoComplete="off"
            placeholder="Busque por ej. RUNAEV, rotulado o importar"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveChip("");
            }}
            className="min-w-0 flex-1 bg-transparent py-2.5 text-[14px] text-ink placeholder:text-[#93a3b6] focus:outline-none"
          />
          <button type="submit" className="btn btn-primary btn-sm shrink-0">
            Buscar
            <ArrowRight className="h-[17px] w-[17px]" />
          </button>
        </form>

        <div className="mt-3 flex flex-wrap items-center gap-2" role="group" aria-label="Búsquedas frecuentes">
          <span className="mr-1 text-[10.5px] font-bold tracking-[0.04em] text-muted">
            Búsquedas frecuentes
          </span>
          {searchChips.map((chip) => (
            <button
              key={chip}
              type="button"
              aria-pressed={activeChip === chip}
              onClick={() => handleChip(chip)}
              className={`rounded-full border px-3 py-1.5 text-[10.5px] font-semibold transition ${
                activeChip === chip
                  ? "border-blue/40 bg-mist text-blue-text"
                  : "border-line bg-transparent text-[#5d6c81] hover:border-blue/35 hover:bg-mist/60 hover:text-blue-text"
              }`}
            >
              {chip}
            </button>
          ))}
        </div>

        <div className="mt-5 flex min-h-5 items-center justify-between gap-4">
          <p className="text-[11.5px] font-semibold text-muted" aria-live="polite">
            {normalizedQuery
              ? `${filteredServices.length} ${
                  filteredServices.length === 1 ? "servicio encontrado" : "servicios encontrados"
                }`
              : `${services.length} servicios con ficha propia`}
          </p>
        </div>

        {filteredServices.length === 0 && (
          <div className="navy-surface mb-5 border-dashed p-5 text-[14px] text-navy-soft">
            No encontramos una coincidencia exacta en esta sección.{" "}
            <Link
              href={`/buscar?q=${encodeURIComponent(normalizedQuery)}`}
              className="font-bold text-celeste underline underline-offset-4"
            >
              Buscar en todo el sitio
            </Link>{" "}
            o{" "}
            <a href="#contacto" className="font-bold text-celeste underline underline-offset-4">
              escríbanos
            </a>{" "}
            y lo orientamos.
          </div>
        )}

        <div
          ref={servicesRef}
          onScroll={handleServiceScroll}
          role="group"
          aria-label="Servicios destacados"
          className="mobile-carousel mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 scroll-smooth md:grid md:grid-cols-2 md:overflow-visible md:pb-0 lg:grid-cols-3"
        >
          {filteredServices.map((service) => {
            const Icon = getServiceIcon(service.icon);
            const href = `/servicios/${service.slug}`;
            return (
              <article
                key={service.id}
                data-service-card
                className="navy-surface navy-card group flex w-[82%] max-w-[360px] shrink-0 snap-start flex-col md:w-auto md:max-w-none"
              >
                <Link href={href} className="relative block h-[154px] overflow-hidden bg-navy-deep">
                  <Image
                    src={service.image}
                    alt={service.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="service-photo-overlay absolute inset-0" />
                  <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
                    {service.labels.map((label) => (
                      <span
                        key={label}
                        className="rounded-full border border-white/25 bg-navy/65 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.13em] text-white backdrop-blur-md"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                  <div className="navy-icon absolute bottom-4 left-4 h-11 w-11 shadow-[0_10px_24px_-16px_rgba(0,0,0,.9)]">
                    <Icon className="h-[21px] w-[21px]" />
                  </div>
                </Link>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-[20px] font-extrabold leading-[1.18] tracking-[-0.03em] text-white">
                    <Link href={href} className="transition hover:text-celeste">
                      {service.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-[13.5px] leading-[1.65] text-navy-soft">
                    {service.shortDescription}
                  </p>
                  <details className="mt-3 text-[11.5px] leading-5 text-navy-soft">
                    <summary className="w-fit cursor-pointer font-bold text-celeste marker:text-celeste">
                      Ver alcance
                    </summary>
                    <p className="mt-2 border-l-2 border-white/15 pl-3">{service.description}</p>
                  </details>
                  <Link
                    href={href}
                    className="mt-5 inline-flex w-fit items-center gap-1.5 text-[12px] font-bold text-celeste transition hover:gap-2.5"
                  >
                    Ver ficha completa
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {filteredServices.length > 1 && (
          <div className="mt-3 flex justify-center gap-2 md:hidden" aria-label="Indicadores de servicios">
            {filteredServices.map((service, index) => (
              <button
                key={service.id}
                type="button"
                aria-label={`Ir al servicio ${index + 1}: ${service.title}`}
                aria-current={activeServiceIndex === index}
                onClick={() => goToService(index)}
                className={`h-2 rounded-full transition-all ${
                  activeServiceIndex === index ? "w-6 bg-blue" : "w-2 bg-[#b9c8da]"
                }`}
              />
            ))}
          </div>
        )}

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {miniServices.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="navy-surface flex gap-3.5 p-4"
              >
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-celeste" />
                <div>
                  <h3 className="text-[13.5px] font-bold leading-5 text-white">
                    <Link href={service.href} className="transition hover:text-celeste">
                      {service.title}
                    </Link>
                  </h3>
                  <p className="mt-1 text-[11.5px] leading-5 text-navy-soft">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
