"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { Service } from "@/lib/types";
import { getServiceIcon } from "./service-icons";
import {
  ArrowRight,
  CalendarCheck,
  GraduationCap,
  Search,
  Users,
} from "./icons";

const chips = ["RUNAEV", "Rotulado", "Importar", "Residuos", "Orgánico", "HACCP"];

const miniServices = [
  {
    title: "Planes de análisis",
    description: "Qué analizar, con qué frecuencia y cómo hacer el seguimiento.",
    icon: CalendarCheck,
  },
  {
    title: "Dirección técnica",
    description: "Acompañamiento permanente y representación ante organismos.",
    icon: Users,
  },
  {
    title: "Capacitaciones",
    description: "Formación aplicada a los procesos y documentos de su empresa.",
    icon: GraduationCap,
  },
];

export default function Services({ services }: { services: Service[] }) {
  const [query, setQuery] = useState("");
  const [activeChip, setActiveChip] = useState("");

  const normalizedQuery = query.trim().toLowerCase();

  const filteredServices = useMemo(() => {
    if (!normalizedQuery) return services;
    return services.filter((service) =>
      `${service.title} ${service.shortDescription} ${service.description} ${service.labels.join(" ")} ${service.keywords}`
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [normalizedQuery, services]);

  const handleChip = (chip: string) => {
    const next = activeChip === chip ? "" : chip;
    setActiveChip(next);
    setQuery(next);
  };

  return (
    <section
      id="servicios"
      aria-labelledby="services-title"
      className="py-16 sm:py-20 lg:py-24"
    >
      <div className="shell">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
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
          <a href="#contacto" className="text-link pb-1">
            Ver todos los servicios
            <ArrowRight />
          </a>
        </div>

        <form
          role="search"
          className="mt-9 flex items-center gap-3 rounded-[18px] border border-line bg-white p-2 pl-4 shadow-card transition focus-within:border-blue/45 focus-within:shadow-[0_0_0_4px_rgba(8,117,233,.09)] sm:pl-5"
          onSubmit={(event) => event.preventDefault()}
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
          <button type="submit" className="btn btn-primary btn-sm hidden xs:inline-flex">
            Buscar
            <ArrowRight className="h-[17px] w-[17px]" />
          </button>
        </form>

        <div className="mt-3 flex flex-wrap items-center gap-2" role="group" aria-label="Búsquedas frecuentes">
          <span className="mr-1 text-[10.5px] font-bold tracking-[0.04em] text-muted">
            Búsquedas frecuentes
          </span>
          {chips.map((chip) => (
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
              : `${services.length} servicios y 3 especialidades`}
          </p>
        </div>

        {filteredServices.length === 0 && (
          <div className="mb-5 rounded-2xl border border-dashed border-line bg-white p-5 text-[14px] text-body">
            No encontramos una coincidencia exacta. Pruebe con otra palabra o{" "}
            <a href="#contacto" className="font-bold text-blue-text underline underline-offset-4">
              escríbanos
            </a>{" "}
            y lo orientamos.
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => {
            const Icon = getServiceIcon(service.icon);
            const external = service.ctaHref.startsWith("http");
            return (
              <article
                key={service.id}
                className="card-hover group flex flex-col overflow-hidden rounded-[22px] border border-line bg-white"
              >
                <div className="relative h-[154px] overflow-hidden bg-[#dce9f7]">
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
                        className="rounded-full border border-white/25 bg-navy/55 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.13em] text-white backdrop-blur-md"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                  <div className="absolute bottom-4 left-4 grid h-11 w-11 place-items-center rounded-[14px] border border-white/70 bg-mist text-blue shadow-[0_10px_24px_-16px_rgba(12,20,34,.55)]">
                    <Icon className="h-[21px] w-[21px]" />
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-[20px] font-extrabold leading-[1.18] tracking-[-0.03em] text-ink">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-[13.5px] leading-[1.65] text-body">
                    {service.shortDescription}
                  </p>
                  <details className="mt-3 text-[11.5px] leading-5 text-body">
                    <summary className="w-fit cursor-pointer font-bold text-blue-text marker:text-blue-text">
                      Ver alcance
                    </summary>
                    <p className="mt-2 border-l-2 border-mist pl-3">{service.description}</p>
                  </details>
                  <a
                    href={service.ctaHref}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener" : undefined}
                    className="mt-5 inline-flex w-fit items-center gap-1.5 text-[12px] font-bold text-blue-text transition hover:gap-2.5"
                  >
                    {service.ctaLabel}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {miniServices.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="flex gap-3.5 rounded-2xl border border-line bg-white/70 p-4"
              >
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-blue" />
                <div>
                  <h3 className="text-[13.5px] font-bold leading-5 text-ink">
                    <a href="#contacto" className="transition hover:text-blue-text">
                      {service.title}
                    </a>
                  </h3>
                  <p className="mt-1 text-[11.5px] leading-5 text-body">
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
