import Image from "next/image";
import { getContent, sortServices } from "@/lib/content";
import { ArrowRight, Mail, MapPin, WhatsApp } from "./icons";

const solutionLinks = [
  "Asuntos regulatorios",
  "Importaciones / exportaciones",
  "Planes de análisis",
  "Blog & FAQs",
];

export default async function Footer() {
  const year = new Date().getFullYear();
  const { services } = await getContent();
  const serviceLinks = sortServices(services).slice(0, 5).map((service) => service.title);

  return (
    <footer className="border-t border-white/10 bg-navy text-white">
      <div className="shell py-14 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.25fr_.7fr_.9fr_1fr]">
          <div>
            <a
              href="/#inicio"
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
            </a>
            <p className="mt-5 max-w-[280px] text-[13px] leading-6 text-[#9fb0c5]">
              Ingeniería de alimentos, calidad y asuntos regulatorios para la
              industria alimentaria.
            </p>
          </div>

          <div>
            <h2 className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#6cc4ff]">
              Servicios
            </h2>
            <div className="mt-4 flex flex-col gap-2.5">
              {serviceLinks.map((label) => (
                <a
                  key={label}
                  href="/#servicios"
                  className="text-[12.5px] text-[#9fb0c5] transition hover:text-white"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#6cc4ff]">
              Encuentre su solución
            </h2>
            <div className="mt-4 flex flex-col gap-2.5">
              {solutionLinks.map((label) => (
                <a
                  key={label}
                  href={label === "Blog & FAQs" ? "/blog" : "/#comercio"}
                  className="text-[12.5px] text-[#9fb0c5] transition hover:text-white"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#6cc4ff]">
              ¿Hablamos de su producto?
            </h2>
            <div className="mt-4 flex flex-col gap-3">
              <a
                href="mailto:rodrigo@kaizen.com.uy"
                className="flex items-start gap-2.5 text-[12.5px] text-[#9fb0c5] transition hover:text-white"
              >
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#6cc4ff]" />
                rodrigo@kaizen.com.uy
              </a>
              <a
                href="https://wa.me/59899082776?text=Hola%2C%20quisiera%20consultar%20por%20los%20servicios%20de%20Kaizen."
                target="_blank"
                rel="noopener"
                className="flex items-start gap-2.5 text-[12.5px] text-[#9fb0c5] transition hover:text-white"
              >
                <WhatsApp className="mt-0.5 h-4 w-4 shrink-0 text-[#6cc4ff]" />
                WhatsApp +598 99 082 776
              </a>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Av.%20Gral.%20Paz%201481%2C%20Montevideo%2C%20Uruguay"
                target="_blank"
                rel="noopener"
                className="flex items-start gap-2.5 text-[12.5px] leading-5 text-[#9fb0c5] transition hover:text-white"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#6cc4ff]" />
                Av. Gral. Paz 1481
                <br />
                Montevideo, Uruguay
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
          <a
            href="/#inicio"
            className="inline-flex w-fit items-center gap-1.5 transition hover:text-white"
          >
            Volver al inicio
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
