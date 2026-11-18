import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import RichText from "@/components/RichText";
import { getServiceIcon } from "@/components/service-icons";
import {
  ArrowRight,
  CheckCircle,
  Mail,
  Sparkle,
  WhatsApp,
} from "@/components/icons";
import {
  faqsForService,
  getContent,
  sortServices,
} from "@/lib/content";
import { whatsappHref } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getService(slug: string) {
  const content = await getContent();
  const service = content.services.find((item) => item.slug === slug) ?? null;
  return { content, service };
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { service } = await getService(params.slug);
  if (!service) return { title: "Servicio no encontrado | Kaizen" };
  const description = service.seoDescription || service.shortDescription;
  return {
    title: service.seoTitle || `${service.title} | Kaizen`,
    description,
    openGraph: {
      title: service.seoTitle || service.title,
      description,
      type: "article",
      images: [{ url: service.image, alt: service.imageAlt }],
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: { slug: string };
}) {
  const { content, service } = await getService(params.slug);
  if (!service) notFound();

  const { settings } = content;
  const faqs = faqsForService(content.faqs, service.id);
  const related =
    content.services.find((item) => item.id === service.relatedServiceId) ?? null;
  const others = sortServices(content.services)
    .filter((item) => item.id !== service.id && item.id !== related?.id)
    .slice(0, 3);
  const Icon = getServiceIcon(service.icon);
  const whatsapp = whatsappHref(
    settings.whatsappNumber,
    `Hola, quisiera consultar por ${service.title}.`,
  );

  const serviceSchema = {
    "@type": "Service",
    name: service.title,
    description: service.seoDescription || service.shortDescription,
    serviceType: service.title,
    areaServed: "UY",
    provider: { "@type": "Organization", name: "Kaizen" },
    url: `https://kaizen.com.uy/servicios/${service.slug}`,
    image: `https://kaizen.com.uy${service.image}`,
  };

  const faqSchema =
    faqs.length > 0
      ? {
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }
      : null;

  const schema = faqSchema
    ? { "@context": "https://schema.org", "@graph": [serviceSchema, faqSchema] }
    : { "@context": "https://schema.org", ...serviceSchema };

  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" tabIndex={-1} className="outline-none">
        <section className="border-b border-line bg-[linear-gradient(180deg,#f4f8fd,#eaf3fc)] pb-12 pt-10 sm:pb-14 sm:pt-14">
          <div className="shell">
            <nav aria-label="Migas de pan" className="mb-5 flex flex-wrap items-center gap-2 text-[10.5px] font-extrabold uppercase tracking-[0.1em] text-muted">
              <Link href="/" className="transition hover:text-blue-text">
                Inicio
              </Link>
              <ArrowRight className="h-3 w-3" />
              <Link href="/servicios" className="transition hover:text-blue-text">
                Servicios
              </Link>
              <ArrowRight className="h-3 w-3" />
              <span className="text-ink/70">{service.title}</span>
            </nav>

            <div className="grid items-center gap-9 lg:grid-cols-[1.05fr_.95fr] lg:gap-14">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="grid h-11 w-11 place-items-center rounded-[14px] border border-line bg-white text-blue shadow-card">
                    <Icon className="h-[21px] w-[21px]" />
                  </span>
                  {service.labels.map((label) => (
                    <span
                      key={label}
                      className="rounded-full border border-line bg-white px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-blue-text"
                    >
                      {label}
                    </span>
                  ))}
                </div>
                <h1 className="mt-5 max-w-[720px] font-display text-[clamp(38px,5.4vw,62px)] font-extrabold leading-[1] tracking-[-0.05em] text-ink">
                  {service.title}
                </h1>
                <p className="mt-5 max-w-[620px] text-[15.5px] leading-7 text-body">
                  {service.intro || service.shortDescription}
                </p>
                <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
                  <Link href="/#contacto" className="btn btn-primary">
                    Consultar por este servicio
                    <ArrowRight className="h-[18px] w-[18px]" />
                  </Link>
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener"
                    className="btn btn-dark"
                  >
                    WhatsApp
                    <WhatsApp className="h-[18px] w-[18px]" />
                  </a>
                </div>
              </div>

              <div className="relative aspect-[4/3] overflow-hidden rounded-[26px] border border-line bg-[#dce9f7] shadow-[0_34px_80px_-64px_rgba(12,20,34,.55)]">
                <Image
                  src={service.image}
                  alt={service.imageAlt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 540px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-12 lg:py-16">
          <div className="shell">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-14">
              <div>
                <RichText content={service.content || service.description} />

                {faqs.length > 0 ? (
                  <div className="mt-12">
                    <div className="eyebrow">Preguntas frecuentes</div>
                    <h2 className="mt-3 font-display text-[clamp(26px,3.2vw,36px)] font-extrabold leading-[1.08] tracking-[-0.04em] text-ink">
                      Sobre {service.title.toLowerCase()}.
                    </h2>
                    <div className="navy-surface mt-6 divide-y divide-white/10">
                      {faqs.map((faq) => (
                        <details key={faq.id} className="group px-5 py-4">
                          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[14px] font-bold leading-6 text-white marker:hidden">
                            {faq.question}
                            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/15 text-celeste transition group-open:rotate-45">
                              <span className="text-[16px] leading-none">+</span>
                            </span>
                          </summary>
                          <p className="mt-3 max-w-[680px] text-[13.5px] leading-6 text-navy-soft">
                            {faq.answer}
                          </p>
                        </details>
                      ))}
                    </div>
                  </div>
                ) : null}

                {related ? (
                  <div className="mt-12">
                    <div className="eyebrow">También puede interesarle</div>
                    <Link
                      href={`/servicios/${related.slug}`}
                      className="navy-surface navy-card group mt-4 flex items-center gap-4 p-5"
                    >
                      <span className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-navy-deep">
                        <Image
                          src={related.image}
                          alt={related.imageAlt}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-display text-[18px] font-extrabold leading-6 tracking-[-0.03em] text-white transition group-hover:text-celeste">
                          {related.title}
                        </span>
                        <span className="mt-1 block text-[12.5px] leading-5 text-navy-soft">
                          {related.shortDescription}
                        </span>
                      </span>
                      <ArrowRight className="ml-auto h-5 w-5 shrink-0 text-celeste transition group-hover:translate-x-1" />
                    </Link>
                  </div>
                ) : null}
              </div>

              <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
                {service.highlights.length > 0 ? (
                  <div className="navy-surface p-5">
                    <p className="text-[9.5px] font-extrabold uppercase tracking-[0.15em] text-celeste">
                      Qué incluye
                    </p>
                    <ul className="mt-4 space-y-3">
                      {service.highlights.map((highlight) => (
                        <li key={highlight.title} className="flex gap-2.5">
                          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-celeste" />
                          <span>
                            <span className="block text-[12.5px] font-bold leading-5 text-white">
                              {highlight.title}
                            </span>
                            {highlight.description ? (
                              <span className="mt-0.5 block text-[11.5px] leading-5 text-navy-soft">
                                {highlight.description}
                              </span>
                            ) : null}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="navy-surface p-5">
                  <Sparkle className="h-6 w-6 text-celeste" />
                  <h2 className="mt-3 font-display text-[20px] font-extrabold leading-[1.15] tracking-[-0.03em]">
                    ¿Revisamos su caso?
                  </h2>
                  <p className="mt-2 text-[12px] leading-5 text-navy-soft">
                    Cuéntenos en qué etapa está y le indicamos los próximos
                    pasos.
                  </p>
                  <div className="mt-4 flex flex-col gap-2">
                    <Link href="/#contacto" className="btn btn-primary btn-sm w-full">
                      Enviar consulta
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <a
                      href={whatsapp}
                      target="_blank"
                      rel="noopener"
                      className="btn btn-ghost btn-sm w-full"
                    >
                      WhatsApp
                      <WhatsApp className="h-4 w-4" />
                    </a>
                  </div>
                  <div className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4 text-[11.5px] text-navy-soft">
                    <a
                      href={`mailto:${settings.contactEmail}`}
                      className="inline-flex items-center gap-2 transition hover:text-white"
                    >
                      <Mail className="h-4 w-4 text-celeste" />
                      {settings.contactEmail}
                    </a>
                    <span className="inline-flex items-center gap-2">
                      <WhatsApp className="h-4 w-4 text-celeste" />
                      {settings.whatsappDisplay}
                    </span>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {others.length > 0 ? (
          <section className="border-t border-line bg-white py-14 sm:py-16">
            <div className="shell">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <div className="eyebrow">Seguir explorando</div>
                  <h2 className="mt-3 font-display text-[clamp(26px,3.4vw,40px)] font-extrabold tracking-[-0.045em] text-ink">
                    Otros servicios.
                  </h2>
                </div>
                <Link href="/servicios" className="text-link">
                  Ver todos los servicios
                  <ArrowRight />
                </Link>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {others.map((item) => {
                  const OtherIcon = getServiceIcon(item.icon);
                  return (
                      <Link
                        key={item.id}
                        href={`/servicios/${item.slug}`}
                        className="navy-surface navy-card group flex flex-col gap-2 p-5"
                      >
                        <OtherIcon className="h-6 w-6 text-celeste" />
                        <h3 className="mt-1 font-display text-[18px] font-extrabold leading-6 tracking-[-0.03em] text-white transition group-hover:text-celeste">
                          {item.title}
                        </h3>
                        <p className="text-[12.5px] leading-5 text-navy-soft">
                          {item.shortDescription}
                        </p>
                      </Link>
                  );
                })}
              </div>
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
