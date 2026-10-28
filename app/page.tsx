import Image from "next/image";
import Blog from "@/components/Blog";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Services from "@/components/Services";
import Team from "@/components/Team";
import {
  ArrowRight,
  Building,
  Download,
  Mail,
  MapPin,
  Phone,
  Play,
  ShieldCheck,
  Sparkle,
  Upload,
  WhatsApp,
} from "@/components/icons";
import { getContent, getPublishedPosts, sortServices, sortTeam } from "@/lib/content";

export const dynamic = "force-dynamic";

const marketOptions = [
  {
    title: "Mercado nacional",
    description: "Quiero producir o vender un alimento en Uruguay.",
    icon: Building,
  },
  {
    title: "Importaciones",
    description: "Quiero traer un producto y comercializarlo aquí.",
    icon: Download,
  },
  {
    title: "Exportaciones",
    description: "Quiero llevar mi producto a otro mercado.",
    icon: Upload,
  },
];

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

const contactItems = [
  {
    label: "Correo",
    value: "rodrigo@kaizen.com.uy",
    href: "mailto:rodrigo@kaizen.com.uy",
    icon: Mail,
  },
  {
    label: "WhatsApp",
    value: "+598 99 082 776",
    href: "https://wa.me/59899082776?text=Hola%2C%20quisiera%20consultar%20por%20los%20servicios%20de%20Kaizen.",
    icon: Phone,
  },
  {
    label: "Oficina",
    value: "Av. Gral. Paz 1481, Montevideo",
    href: "https://www.google.com/maps/search/?api=1&query=Av.%20Gral.%20Paz%201481%2C%20Montevideo%2C%20Uruguay",
    icon: MapPin,
  },
];

export default async function Home() {
  const content = await getContent();
  const team = sortTeam(content.team);
  const services = sortServices(content.services);
  const posts = getPublishedPosts(content.posts);
  const { hero } = content;
  const teamNames = team.slice(0, 3).map((member) => member.name).join(" · ");
  const serviceOptions = [...services.map((service) => service.title), "Otro"];

  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Kaizen",
    description:
      "Ingeniería de alimentos, calidad, inocuidad y asuntos regulatorios para la industria alimentaria.",
    email: "rodrigo@kaizen.com.uy",
    telephone: "+59899082776",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. Gral. Paz 1481",
      addressLocality: "Montevideo",
      addressCountry: "UY",
    },
    areaServed: "UY",
    knowsAbout: [
      "Ingeniería de alimentos",
      "Calidad",
      "Inocuidad alimentaria",
      "Asuntos regulatorios",
      "Rotulado",
      "Importaciones",
      "Exportaciones",
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
              <div className="noise absolute inset-0 opacity-20 mix-blend-soft-light" />

              <div className="relative z-10 flex min-h-[560px] flex-col p-6 sm:min-h-[620px] sm:p-9 lg:min-h-[660px] lg:p-12 xl:p-14">
                <div className="grid flex-1 items-center gap-10 lg:grid-cols-[1.1fr_.9fr] lg:gap-14">
                  <div className="max-w-[640px]">
                    <div className="eyebrow eyebrow-light">Kaizen alimentos</div>

                    <h1
                      id="hero-title"
                      className="mt-5 max-w-[680px] font-display text-[clamp(42px,5.5vw,64px)] font-extrabold leading-[0.98] tracking-[-0.045em] text-white"
                    >
                      Que su producto llegue a góndola,{" "}
                      <span className="text-[#7ccbff]">sin sorpresas.</span>
                    </h1>

                    <p className="mt-5 max-w-[560px] text-[16px] leading-7 text-hero-muted sm:text-[17px] sm:leading-8">
                      Ingeniería de alimentos, calidad, inocuidad y asuntos
                      regulatorios. Acompañamos a su empresa desde el producto y
                      el proceso hasta su habilitación, registro y
                      comercialización.
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                      <a
                        href="#contacto"
                        className="btn btn-primary w-full sm:w-auto"
                      >
                        Agendar diagnóstico
                        <ArrowRight className="h-[18px] w-[18px]" />
                      </a>
                      <a
                        href="#servicios"
                        className="btn btn-ghost w-full sm:w-auto"
                      >
                        Ver servicios
                        <ArrowRight className="h-[18px] w-[18px]" />
                      </a>
                    </div>
                  </div>

                  <div className="hidden h-full items-end justify-end lg:flex">
                    <div className="w-[270px] rounded-[24px] border border-white/20 bg-[#0b1422]/55 p-5 backdrop-blur-md">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-extrabold uppercase tracking-[0.17em] text-[#7ccbff]">
                          Ficha técnica
                        </span>
                        <span className="grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-white/10 text-[#7ccbff]">
                          <ShieldCheck className="h-4 w-4" />
                        </span>
                      </div>
                      <p className="mt-4 font-display text-[18px] font-extrabold leading-[1.25] tracking-[-0.025em] text-white">
                        Producto, proceso y cumplimiento en una misma mesa.
                      </p>
                      <div className="mt-5 space-y-2.5">
                        {steps.map((step, index) => (
                          <div
                            key={step.title}
                            className="flex items-center justify-between gap-3 border-t border-white/10 pt-2.5"
                          >
                            <span className="text-[11px] text-white/80">
                              {step.title}
                            </span>
                            <span className="font-display text-[9px] font-extrabold tracking-[0.12em] text-[#7ccbff]">
                              0{index + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-5 border-t border-white/15 pt-6 md:mt-10 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      {hero.supportImages.slice(0, 3).map((image, index) => (
                        <Image
                          key={image.id}
                          src={image.image}
                          alt={image.alt}
                          width={40}
                          height={40}
                          className={`h-10 w-10 rounded-full border-2 border-white/80 object-cover ${
                            index === 0 ? "" : "-ml-3"
                          }`}
                        />
                      ))}
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-white sm:text-[12.5px]">
                        Un equipo que conoce su producto.
                      </p>
                      <p className="mt-0.5 text-[11px] text-hero-muted">
                        {teamNames ? `${teamNames} · Montevideo, Uruguay` : "Montevideo, Uruguay"}
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
                      <span className="mt-0.5 block text-[8.5px] font-extrabold uppercase tracking-[0.13em] text-hero-muted">
                        Nuestro proceso · 3 pasos
                      </span>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          aria-label="Empresas que confían en Kaizen"
          className="border-y border-line bg-white/80"
        >
          <div className="shell flex flex-col items-center justify-center gap-5 py-6 sm:flex-row sm:gap-10">
            <span className="text-[9.5px] font-extrabold uppercase tracking-[0.16em] text-muted">
              Empresas que confían en Kaizen
            </span>
            <div className="flex flex-wrap items-center justify-center gap-8 font-display text-[20px] font-extrabold tracking-[-0.04em] text-[#7c8ca3] sm:gap-12 sm:text-[24px]">
              <span>Arcor</span>
              <span>Nestlé</span>
              <span>Nespresso</span>
            </div>
          </div>
        </section>

        <Services services={services} />

        <section
          id="comercio"
          aria-labelledby="commerce-title"
          className="relative overflow-hidden bg-navy py-16 text-white lg:py-20"
        >
          <div
            className="pointer-events-none absolute -right-40 -top-40 h-[540px] w-[540px] rounded-full bg-[radial-gradient(circle,rgba(0,159,245,.22),transparent_68%)]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.09)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(circle_at_82%_0%,#000,transparent_62%)]"
            aria-hidden="true"
          />
          <div className="shell relative">
            <div className="max-w-[720px]">
              <div className="eyebrow eyebrow-light">
                Comercio y acceso a mercados
              </div>
              <h2
                id="commerce-title"
                className="mt-4 font-display text-[clamp(34px,4.2vw,52px)] font-extrabold leading-[1.04] tracking-[-0.045em]"
              >
                Su próximo mercado empieza con una evaluación técnica.
              </h2>
              <p className="mt-4 max-w-[620px] text-[15px] leading-7 text-[#b9c8da]">
                Ya sea para producir, importar o exportar, revisamos los
                requisitos antes de que el producto esté en camino.
              </p>
            </div>

            <div className="mt-9 grid gap-3.5 md:grid-cols-3">
              {marketOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <a
                    key={option.title}
                    href="#contacto"
                    className="group relative flex flex-col gap-2 rounded-[18px] border border-white/[0.13] bg-white/[0.045] p-6 transition hover:-translate-y-1 hover:border-[#7ccbff]/40 hover:bg-white/[0.08]"
                  >
                    <Icon className="h-7 w-7 text-[#7ccbff]" />
                    <ArrowRight className="absolute right-5 top-5 h-[18px] w-[18px] text-[#7ccbff] opacity-70 transition group-hover:translate-x-1 group-hover:opacity-100" />
                    <h3 className="mt-2 font-display text-[20px] font-extrabold leading-6 tracking-[-0.025em]">
                      {option.title}
                    </h3>
                    <p className="text-[12.5px] leading-5 text-[#aebfd3]">
                      {option.description}
                    </p>
                  </a>
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
            <div className="max-w-[620px]">
              <div className="eyebrow">Cómo trabajamos</div>
              <h2
                id="process-title"
                className="mt-4 font-display text-[clamp(36px,4.4vw,54px)] font-extrabold leading-[1.02] tracking-[-0.045em] text-ink"
              >
                Tres pasos, sin vueltas.
              </h2>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {steps.map((step, index) => (
                <article
                  key={step.title}
                  className="border-t-2 border-line pt-5"
                >
                  <div className="font-display text-[48px] font-extrabold leading-none tracking-[-0.06em] text-[#6f91b2]">
                    0{index + 1}
                  </div>
                  <h3 className="mt-4 font-display text-[21px] font-extrabold tracking-[-0.03em] text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[13.5px] leading-6 text-body">
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
          <div className="shell grid items-center gap-10 lg:grid-cols-[1.04fr_.96fr] lg:gap-16">
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
                Conozca al equipo
                <ArrowRight />
              </a>
            </div>

            <Team members={team} />
          </div>
        </section>

        <section
          id="blog"
          aria-labelledby="blog-title"
          className="pb-16 sm:pb-20 lg:pb-24"
        >
          <div className="shell">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
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
              <a href="#contacto" className="text-link pb-1">
                Consultar por un tema
                <ArrowRight />
              </a>
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
            <div className="rounded-[30px] border border-line bg-white p-5 shadow-[0_30px_70px_-66px_rgba(12,20,34,.55)] sm:p-8 lg:p-10">
              <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-14">
                <div>
                  <div className="eyebrow">Contacto</div>
                  <h2
                    id="contact-title"
                    className="mt-4 max-w-[430px] font-display text-[clamp(36px,4.4vw,52px)] font-extrabold leading-[1.02] tracking-[-0.045em] text-ink"
                  >
                    ¿Hablamos de su producto?
                  </h2>
                  <p className="mt-4 max-w-[430px] text-[14.5px] leading-7 text-body">
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
                          className="group flex items-center gap-3 rounded-2xl border border-line bg-[#f9fcff] px-4 py-3 transition hover:border-blue/30 hover:bg-white"
                        >
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-mist text-blue">
                            <Icon className="h-[18px] w-[18px]" />
                          </span>
                          <span>
                            <span className="block text-[9px] font-extrabold uppercase tracking-[0.12em] text-muted">
                              {item.label}
                            </span>
                            <span className="mt-0.5 block text-[12.5px] font-semibold text-ink transition group-hover:text-blue-text">
                              {item.value}
                            </span>
                          </span>
                        </a>
                      );
                    })}
                  </div>

                  <a
                    href="https://wa.me/59899082776?text=Hola%2C%20quisiera%20consultar%20por%20los%20servicios%20de%20Kaizen."
                    target="_blank"
                    rel="noopener"
                    className="btn btn-primary btn-sm mt-5"
                  >
                    Escribir por WhatsApp
                    <WhatsApp className="h-[17px] w-[17px]" />
                  </a>

                  <div className="mt-7 flex items-start gap-3 rounded-2xl border border-line/80 bg-pale/70 p-4">
                    <Sparkle className="mt-0.5 h-5 w-5 shrink-0 text-blue" />
                    <p className="text-[11.5px] leading-5 text-body">
                      <strong className="font-bold text-ink">
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
        href="https://wa.me/59899082776?text=Hola%2C%20quisiera%20consultar%20por%20los%20servicios%20de%20Kaizen."
        target="_blank"
        rel="noopener"
        aria-label="Escribir a Kaizen por WhatsApp"
        className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#0b7a3b] text-white shadow-[0_16px_34px_-14px_rgba(11,122,59,.8)] transition hover:-translate-y-1 hover:bg-[#096331] sm:bottom-6 sm:right-6"
      >
        <WhatsApp className="h-7 w-7" />
      </a>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}
