import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Blog from "@/components/Blog";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Services from "@/components/Services";
import TeamCards from "@/components/TeamCards";
import TeamGallery from "@/components/TeamGallery";
import TrustBand from "@/components/TrustBand";
import { getServiceIcon } from "@/components/service-icons";
import {
  ArrowRight,
  Mail,
  MapPin,
  Phone,
  Play,
  Sparkle,
  WhatsApp,
  WhatsAppBrand,
} from "@/components/icons";
import {
  getContent,
  getFeaturedServices,
  getPublishedPosts,
  sortBrands,
  sortServices,
  sortTeam,
  sortTeamGallery,
} from "@/lib/content";
import { whatsappHref } from "@/lib/utils";

export const dynamic = "force-dynamic";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://kaizen.com.uy").replace(/\/$/, "");
const SITE_CANONICAL = `${SITE_URL}/`;

const WHATSAPP_MESSAGE =
  "Hola, quisiera consultar por los servicios de Kaizen.";

const steps = [
  {
    title: "Diagnóstico",
    description:
      "Relevamos su situación y definimos los requisitos, prioridades y alcance del trabajo.",
  },
  {
    title: "Implementación",
    description:
      "Desarrollamos las soluciones técnicas, la documentación y las gestiones acordadas.",
  },
  {
    title: "Seguimiento",
    description:
      "Acompañamos la operación, las observaciones y la actualización de sus obligaciones.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getContent();

  return {
    metadataBase: new URL(SITE_CANONICAL),
    title: settings.homeSeoTitle,
    description: settings.homeSeoDescription,
    alternates: { canonical: SITE_CANONICAL },
    openGraph: {
      title: settings.homeSeoTitle,
      description: settings.homeSeoDescription,
      url: SITE_CANONICAL,
      siteName: "Kaizen",
      locale: "es_UY",
      type: "website",
    },
  };
}

export default async function Home() {
  const content = await getContent();
  const { hero, settings } = content;
  const team = sortTeam(content.team);
  const services = sortServices(content.services);
  const featured = getFeaturedServices(services);
  const brands = sortBrands(content.brands);
  const gallery = sortTeamGallery(content.teamGallery);
  const posts = getPublishedPosts(content.posts);
  const teamNames = team
    .slice(0, 4)
    .map((member) => member.name.split(" ")[0])
    .join(" · ");
  const heroTeam = team.filter((member) => member.showInHero);
  const heroNames = (heroTeam.length > 0 ? heroTeam : team.slice(0, 4))
    .map((member) => member.name.split(" ")[0])
    .join(" · ");
  const heroPeople =
    heroTeam.length > 0
      ? heroTeam.map((member) => ({
          id: member.id,
          image: member.photo,
          alt: `${member.name}, ${member.role}`,
        }))
      : hero.supportImages.map((image) => ({
          id: image.id,
          image: image.image,
          alt: image.alt,
        }));
  const serviceOptions = [...services.map((service) => service.title), "Otro"];
  const whatsapp = whatsappHref(settings.whatsappNumber, WHATSAPP_MESSAGE);

  const contactItems = [
    {
      label: "Correo",
      value: settings.contactEmail,
      href: `mailto:${settings.contactEmail}`,
      icon: Mail,
    },
    {
      label: "WhatsApp",
      value: settings.whatsappDisplay,
      href: whatsapp,
      icon: Phone,
    },
    {
      label: "Oficina",
      value: settings.contactAddress,
      href: settings.contactAddressUrl,
      icon: MapPin,
    },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Kaizen",
    description: settings.homeSeoDescription,
    email: settings.contactEmail,
    telephone: settings.whatsappNumber,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.contactAddress,
      addressLocality: "Montevideo",
      addressCountry: "UY",
    },
    areaServed: "UY",
    knowsAbout: [
      "Ingeniería de alimentos",
      "Calidad",
      "Inocuidad alimentaria",
      "Dirección técnica",
      "Registro de productos",
      "Habilitación de locales",
      "Rotulado",
      "Ambiente y residuos",
      "LATU/SIGLA",
      "MGAP",
    ],
  };

  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>

      <Header />

      <main id="contenido" tabIndex={-1} className="outline-none">
        <section
          id="inicio"
          aria-labelledby="hero-title"
          className="relative pb-16 pt-6 sm:pb-20 sm:pt-8 lg:pb-24 lg:pt-10"
        >
          <div
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] bg-[radial-gradient(ellipse_at_75%_0%,rgba(8,117,233,.13),transparent_62%)]"
            aria-hidden="true"
          />
          <div className="shell">
            <div className="relative isolate overflow-hidden rounded-[32px] border border-white/10 bg-navy shadow-hero">
              <Image
                src={hero.backgroundImage}
                alt={hero.backgroundAlt}
                fill
                priority
                quality={85}
                sizes="(min-width: 1280px) 1200px, 1400px"
                className="object-cover object-[58%_center]"
              />
              <div className="hero-card-overlay absolute inset-0" />
              <div className="noise absolute inset-0 opacity-15 mix-blend-soft-light" />

              <div className="relative z-10 flex min-h-[560px] flex-col p-6 sm:min-h-[620px] sm:p-9 lg:min-h-[660px] lg:p-12 xl:p-14">
                <div className="grid flex-1 items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-10">
                  <div className="max-w-[640px]">
                    <div className="eyebrow eyebrow-light">{settings.heroEyebrow}</div>

                    <h1
                      id="hero-title"
                      className="mt-5 max-w-[680px] font-display text-[26px] font-extrabold leading-[1.02] tracking-[-0.045em] text-white sm:text-[clamp(34px,5vw,42px)] lg:text-[clamp(34px,3.6vw,48px)]"
                    >
                      <span className="block">{settings.heroTitle}</span>
                      <span className="block text-celeste">{settings.heroTitleAccent}</span>
                    </h1>

                    <h2
                      id="hero-subheading"
                      className="mt-4 max-w-[620px] font-display text-[clamp(19px,2.3vw,27px)] font-bold leading-[1.2] tracking-[-0.025em] text-hero-muted"
                    >
                      {settings.heroSubheading}
                    </h2>

                    <p className="mt-4 max-w-[560px] text-[16px] leading-7 text-hero-muted sm:text-[17px] sm:leading-8">
                      {settings.heroParagraph}
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                      <a
                        href="#contacto"
                        className="btn btn-primary w-full sm:w-auto"
                      >
                        Agendar diagnóstico
                        <ArrowRight className="h-[18px] w-[18px]" />
                      </a>
                      <Link href="/servicios" className="btn btn-ghost w-full sm:w-auto">
                        Ver servicios
                        <ArrowRight className="h-[18px] w-[18px]" />
                      </Link>
                    </div>
                  </div>

                  <div className="hidden h-full items-end justify-end lg:flex">
                    <div className="w-full max-w-[560px] rounded-[28px] border border-white/20 bg-[#0b1422]/60 p-8 backdrop-blur-md xl:p-9">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-celeste">
                          Servicios prioritarios
                        </span>
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 bg-white/10 text-celeste">
                          <Sparkle className="h-5 w-5" />
                        </span>
                      </div>
                      <p className="mt-5 font-display text-[24px] font-extrabold leading-[1.18] tracking-[-0.03em] text-white xl:text-[26px]">
                        Habilitaciones, registros y dirección técnica.
                      </p>
                      <div className="mt-6 space-y-3">
                        {featured.map((service, index) => (
                          <Link
                            key={service.id}
                            href={`/servicios/${service.slug}`}
                            className="group flex items-center justify-between gap-4 rounded-[16px] border border-white/10 bg-white/[0.05] px-5 py-4 transition hover:border-celeste/50 hover:bg-white/[0.1]"
                          >
                            <span className="text-[15px] font-semibold leading-6 text-white/90 transition group-hover:translate-x-0.5 group-hover:text-white xl:text-[16px]">
                              {service.title}
                            </span>
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15 bg-white/10 font-display text-[12px] font-extrabold tracking-[0.08em] text-celeste transition group-hover:border-celeste/60">
                              0{index + 1}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-5 border-t border-white/15 pt-6 md:mt-10 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex max-w-[190px] flex-wrap items-center gap-y-1 sm:max-w-none">
                      {heroPeople.slice(0, 4).map((image, index) => (
                        <Image
                          key={image.id}
                          src={image.image}
                          alt={image.alt}
                          width={44}
                          height={44}
                          className={`h-11 w-11 shrink-0 rounded-full bg-white object-cover object-[50%_25%] ring-2 ring-white ${
                            index === 0 ? "" : "-ml-2 sm:-ml-3"
                          }`}
                        />
                      ))}
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-white sm:text-[12.5px]">
                        Un equipo que conoce su producto.
                      </p>
                      <p className="mt-0.5 text-[11px] text-hero-muted">
                        {heroNames
                          ? `${heroNames} · Montevideo, Uruguay`
                          : "Montevideo, Uruguay"}
                      </p>
                    </div>
                  </div>

                  <a
                    href="#proceso"
                    className="group inline-flex w-fit items-center gap-3.5 rounded-full border border-white/20 bg-white/[0.07] py-2 pl-2 pr-5 backdrop-blur-md transition hover:bg-white/[0.12]"
                  >
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-blue shadow-lg transition group-hover:scale-105">
                      <Play className="ml-0.5 h-[18px] w-[18px]" />
                    </span>
                    <span>
                      <span className="block text-[12px] font-bold text-white">
                        Ver cómo trabajamos
                      </span>
                      <span className="mt-0.5 block text-[10px] font-extrabold uppercase tracking-[0.11em] text-hero-muted">
                        Nuestro proceso · 3 pasos
                      </span>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <TrustBand brands={brands} title={settings.trustTitle} />

        <Services services={services} />

        <section
          id="prioritarios"
          aria-labelledby="priority-title"
          className="relative isolate overflow-hidden bg-pale py-16 lg:py-20"
        >
          <div
            className="pointer-events-none absolute -right-40 -top-40 h-[540px] w-[540px] rounded-full bg-[radial-gradient(circle,rgba(8,117,233,.14),transparent_68%)]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(11,20,34,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(11,20,34,.05)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(circle_at_82%_0%,#000,transparent_62%)]"
            aria-hidden="true"
          />
          <div className="shell relative">
            <div className="max-w-[720px]">
              <div className="eyebrow">Servicios prioritarios</div>
              <h2
                id="priority-title"
                className="mt-4 font-display text-[clamp(34px,4.2vw,52px)] font-extrabold leading-[1.04] tracking-[-0.045em] text-ink"
              >
                Habilitaciones, registros y dirección técnica.
              </h2>
              <p className="mt-4 max-w-[620px] text-[15px] leading-7 text-body">
                Los tres servicios que más nos piden, con ficha propia y
                acompañamiento de principio a fin.
              </p>
            </div>

            <div className="mt-9 grid gap-3.5 md:grid-cols-3">
              {featured.map((service) => {
                const Icon = getServiceIcon(service.icon);
                return (
                  <article
                    key={service.id}
                    className="navy-surface navy-card group relative flex flex-col gap-2 p-6"
                  >
                    <Icon className="h-7 w-7 text-celeste" />
                    <ArrowRight className="absolute right-5 top-5 h-[18px] w-[18px] text-celeste opacity-70 transition group-hover:translate-x-1 group-hover:opacity-100" />
                    <h3 className="mt-2 font-display text-[20px] font-extrabold leading-6 tracking-[-0.025em] text-white">
                      {service.title}
                    </h3>
                    <p className="text-[12.5px] leading-5 text-navy-soft">
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
                        className="text-[11px] font-semibold text-navy-soft underline decoration-white/25 underline-offset-4 transition hover:text-white"
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

        <section
          id="proceso"
          aria-labelledby="process-title"
          className="py-16 sm:py-20 lg:py-24"
        >
          <div className="shell">
            <div className="section-head max-w-[620px]">
              <div className="eyebrow">Cómo trabajamos</div>
              <h2
                id="process-title"
                className="mt-4 font-display text-[clamp(36px,4.4vw,54px)] font-extrabold leading-[1.02] tracking-[-0.045em] text-ink"
              >
                Tres pasos, sin vueltas.
              </h2>
            </div>

            <div className="mt-10 grid auto-rows-fr gap-4 md:grid-cols-3">
              {steps.map((step, index) => (
                <article
                  key={step.title}
                  className="navy-surface navy-card group flex h-full min-h-[220px] flex-col p-6 sm:p-7"
                >
                  <div
                    className="font-display text-[clamp(42px,4vw,56px)] font-extrabold leading-none tracking-[-0.06em] text-celeste"
                    aria-hidden="true"
                  >
                    0{index + 1}
                  </div>
                  <h3 className="mt-5 font-display text-[21px] font-extrabold leading-tight tracking-[-0.03em] text-white">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[13.5px] leading-6 text-navy-soft">
                    {step.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="nosotros"
          aria-labelledby="about-title"
          className="pb-16 sm:pb-20 lg:pb-24"
        >
          <div className="shell">
            <div className="grid items-center gap-10 lg:grid-cols-[1.04fr_.96fr] lg:gap-16">
              <div>
                <div className="eyebrow">Nosotros</div>
                <h2
                  id="about-title"
                  className="mt-4 max-w-[560px] font-display text-[clamp(36px,4.4vw,54px)] font-extrabold leading-[1.02] tracking-[-0.045em] text-ink"
                >
                  El equipo detrás de Kaizen.
                </h2>
                <p className="mt-5 max-w-[540px] text-[15px] leading-7 text-body">
                  Trabajamos con industrias, elaboradores, importadores y
                  distribuidores de alimentos. Integramos el conocimiento del
                  producto con la gestión técnica, documental y regulatoria.
                </p>
                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Áreas de trabajo">
                  {["Producto", "Proceso", "Cumplimiento"].map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-line bg-white px-3 py-1.5 text-[10.5px] font-bold tracking-[0.03em] text-[#5a6a80]"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
                <a href="#contacto" className="text-link mt-6">
                  Hable con el equipo
                  <ArrowRight />
                </a>
              </div>

              <TeamGallery images={gallery} names={teamNames} />
            </div>

            <div className="mt-12">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                  <p className="text-[9.5px] font-extrabold uppercase tracking-[0.16em] text-blue-text">
                    Las personas
                  </p>
                  <h3 className="mt-2 font-display text-[clamp(24px,3vw,34px)] font-extrabold tracking-[-0.04em] text-ink">
                    Quién está detrás de cada proyecto.
                  </h3>
                </div>
                <a href="#contacto" className="text-link pb-1">
                  Coordinar una reunión
                  <ArrowRight />
                </a>
              </div>
              <TeamCards team={team} />
            </div>
          </div>
        </section>

        <section
          id="blog"
          aria-labelledby="blog-title"
          className="pb-16 sm:pb-20 lg:pb-24"
        >
          <div className="shell">
            <div className="section-head flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-[640px]">
                <div className="eyebrow">Blog &amp; preguntas frecuentes</div>
                <h2
                  id="blog-title"
                  className="mt-4 font-display text-[clamp(36px,4.4vw,54px)] font-extrabold leading-[1.02] tracking-[-0.045em] text-ink"
                >
                  Notas para empezar por lo importante.
                </h2>
                <p className="mt-4 max-w-[560px] text-[15px] leading-7 text-body">
                  Información útil para resolver dudas reales sobre
                  habilitaciones, rotulado, importaciones y controles.
                </p>
              </div>
              <Link href="/servicios#preguntas" className="text-link pb-1">
                Ver preguntas frecuentes
                <ArrowRight />
              </Link>
            </div>

            <Blog posts={posts} />
          </div>
        </section>

        <section
          id="contacto"
          aria-labelledby="contact-title"
          className="border-t border-line bg-[linear-gradient(180deg,#f4f8fd,#eaf3fc)] py-16 sm:py-20 lg:py-24"
        >
          <div className="shell">
            <div className="navy-surface rounded-[26px] p-5 sm:p-8 lg:p-10">
              <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-14">
                <div>
                  <div className="eyebrow eyebrow-light">Contacto</div>
                  <h2
                    id="contact-title"
                    className="mt-4 max-w-[430px] font-display text-[clamp(36px,4.4vw,52px)] font-extrabold leading-[1.02] tracking-[-0.045em] text-white"
                  >
                    ¿Hablamos de su producto?
                  </h2>
                  <p className="mt-4 max-w-[430px] text-[14.5px] leading-7 text-navy-soft">
                    Cuéntenos en qué etapa está y le respondemos con los
                    próximos pasos.
                  </p>

                  <div className="mt-7 flex flex-col gap-2.5">
                    {contactItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <a
                          key={item.label}
                          href={item.href}
                          target={item.href.startsWith("http") ? "_blank" : undefined}
                          rel={item.href.startsWith("http") ? "noopener" : undefined}
                          className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 transition hover:border-celeste/40 hover:bg-white/[0.09]"
                        >
                          <span className="navy-icon h-9 w-9 shrink-0 rounded-xl">
                            <Icon className="h-[18px] w-[18px]" />
                          </span>
                          <span>
                            <span className="block text-[9px] font-extrabold uppercase tracking-[0.12em] text-navy-soft">
                              {item.label}
                            </span>
                            <span className="mt-0.5 block text-[12.5px] font-semibold text-white transition group-hover:text-celeste">
                              {item.value}
                            </span>
                          </span>
                        </a>
                      );
                    })}
                  </div>

                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener"
                    className="btn btn-primary btn-sm mt-5"
                  >
                    Escribir por WhatsApp
                    <WhatsApp className="h-[17px] w-[17px]" />
                  </a>

                  <div className="mt-7 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <Sparkle className="mt-0.5 h-5 w-5 shrink-0 text-celeste" />
                    <p className="text-[11.5px] leading-5 text-navy-soft">
                      <strong className="font-bold text-white">
                        Primera conversación técnica.
                      </strong>{" "}
                      Revisamos su caso y le indicamos qué información necesitamos
                      para avanzar.
                    </p>
                  </div>
                </div>

                <ContactForm serviceOptions={serviceOptions} />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <a
        href={whatsapp}
        target="_blank"
        rel="noopener"
        aria-label="Escribir a Kaizen por WhatsApp"
        className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#0b7a3b] text-white shadow-[0_16px_34px_-14px_rgba(11,122,59,.8)] transition hover:-translate-y-1 hover:bg-[#096331] sm:bottom-6 sm:right-6"
      >
        <WhatsAppBrand className="h-8 w-8" />
      </a>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}
