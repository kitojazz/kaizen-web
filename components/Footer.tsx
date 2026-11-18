import Image from "next/image";
import Link from "next/link";
import { getContent, sortServices } from "@/lib/content";
import { whatsappHref } from "@/lib/utils";
import { ArrowRight, Mail, MapPin, WhatsApp } from "./icons";

const SOLUTION_SERVICE_IDS = [
  "service-habilitacion-locales",
  "service-registro-productos",
  "service-ambiente-residuos",
];

const WHATSAPP_MESSAGE =
  "Hola, quisiera consultar por los servicios de Kaizen.";

export default async function Footer() {
  const year = new Date().getFullYear();
  const { services, settings } = await getContent();
  const serviceLinks = sortServices(services)
    .slice(0, 5)
    .map((service) => ({ label: service.title, href: `/servicios/${service.slug}` }));
  const solutionLinks = SOLUTION_SERVICE_IDS.flatMap((id) => {
    const service = services.find((item) => item.id === id);
    return service
      ? [{ label: service.title, href: `/servicios/${service.slug}` }]
      : [];
  });
  solutionLinks.push({ label: "Blog & preguntas frecuentes", href: "/blog" });
  const whatsapp = whatsappHref(settings.whatsappNumber, WHATSAPP_MESSAGE);

  return (
    <footer className="border-t border-white/10 bg-navy text-white">
      <div className="shell py-14 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.15fr_.8fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              aria-label="Kaizen, volver al inicio"
              className="inline-flex rounded-xl bg-white px-4 py-2"
            >
              <Image
                src="/images/kaizen-logo.png"
                alt="Kaizen"
                width={128}
                height={36}
                className="h-8 w-auto"
              />
            </Link>
            <p className="mt-5 max-w-[280px] text-[13px] leading-6 text-[#9fb0c5]">
              Ingeniería de alimentos, calidad y asuntos regulatorios para la
              industria alimentaria.
            </p>
          </div>

          <div>
            <h2 className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#6cc4ff]">
              Servicios
            </h2>
            <div className="mt-4 flex flex-col gap-2.5">
              {serviceLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[12.5px] text-[#9fb0c5] transition hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#6cc4ff]">
              Encuentre su solución
            </h2>
            <div className="mt-4 flex flex-col gap-2.5">
              {solutionLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[12.5px] text-[#9fb0c5] transition hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#6cc4ff]">
              ¿Hablamos de su producto?
            </h2>
            <div className="mt-4 flex flex-col gap-3">
              <a
                href={`mailto:${settings.contactEmail}`}
                className="flex items-start gap-2.5 text-[12.5px] text-[#9fb0c5] transition hover:text-white"
              >
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#6cc4ff]" />
                {settings.contactEmail}
              </a>
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener"
                className="flex items-start gap-2.5 text-[12.5px] text-[#9fb0c5] transition hover:text-white"
              >
                <WhatsApp className="mt-0.5 h-4 w-4 shrink-0 text-[#6cc4ff]" />
                WhatsApp {settings.whatsappDisplay}
              </a>
              <a
                href={settings.contactAddressUrl}
                target="_blank"
                rel="noopener"
                className="flex items-start gap-2.5 text-[12.5px] leading-5 text-[#9fb0c5] transition hover:text-white"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#6cc4ff]" />
                {settings.contactAddress}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="shell flex flex-col gap-3 py-5 text-[11px] text-[#8193aa] sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {year} Kaizen · Ingeniería y gestión para la industria alimentaria.
          </span>
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-1.5 transition hover:text-white"
          >
            Volver al inicio
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
