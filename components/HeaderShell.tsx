"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Close, Menu, Search } from "./icons";

const links = [
  { href: "/servicios", label: "Servicios" },
  { href: "/servicios/habilitacion-de-locales", label: "Habilitaciones" },
  { href: "/servicios/registro-de-productos", label: "Registro de productos" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#blog", label: "Blog" },
  { href: "#contacto", label: "Contacto" },
];

export default function HeaderShell({
  email,
  whatsapp,
  whatsappDisplay,
}: {
  email: string;
  whatsapp: string;
  whatsappDisplay: string;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const prefix = pathname === "/" ? "" : "/";
  const blogHref = pathname === "/" ? "#blog" : "/blog";

  const resolveHref = (href: string) => {
    if (href.startsWith("/")) return href;
    if (href === "#blog") return blogHref;
    return `${prefix}${href}`;
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 h-[76px] border-b border-line/80 backdrop-blur-xl transition-shadow duration-200 ${
        scrolled || open
          ? "bg-white/90 shadow-[0_10px_34px_-28px_rgba(12,20,34,.38)]"
          : "bg-white/75"
      }`}
    >
      <div className="shell flex h-full !px-4 items-center justify-between gap-3 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:!px-8 lg:gap-4">
        <a
          href="/"
          className="flex w-fit items-center gap-2.5 justify-self-start"
          aria-label="Kaizen, ir al inicio"
        >
          <Image
            src="/images/kaizen-symbol.png"
            alt=""
            width={40}
            height={40}
            priority
            className="h-9 w-9 object-contain sm:h-10 sm:w-10"
          />
          <span className="font-display text-[21px] font-extrabold tracking-[-0.05em] text-ink">
            Kaizen
          </span>
        </a>

        <nav
          className="hidden items-center gap-5 justify-self-center lg:flex xl:gap-7"
          aria-label="Navegación principal"
        >
          {links.map((link) => (
            <a key={link.href} href={resolveHref(link.href)} className="nav-link">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 justify-self-end lg:gap-2.5">
          <Link
            href="/buscar"
            aria-label="Buscar en el sitio"
            className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white text-ink transition hover:border-blue/40 hover:text-blue-text"
          >
            <Search className="h-[18px] w-[18px]" />
          </Link>
          <a
            href={`${prefix}#contacto`}
            className="btn btn-dark btn-sm hidden xl:inline-flex"
          >
            Agendar diagnóstico
            <ArrowUpRight className="h-4 w-4" />
          </a>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink transition hover:border-blue/40 hover:text-blue-text lg:hidden"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <Close className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-navigation"
          className="absolute inset-x-0 top-full border-b border-line bg-white px-5 pb-6 pt-3 shadow-[0_24px_50px_-30px_rgba(12,20,34,.5)] lg:hidden"
        >
          <nav aria-label="Navegación móvil" className="flex flex-col">
            {links.map((link) => (
              <a
                key={link.href}
                href={resolveHref(link.href)}
                className="border-b border-line/70 py-3.5 text-[15px] font-semibold text-ink transition hover:text-blue-text"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/buscar"
              className="flex items-center gap-2 border-b border-line/70 py-3.5 text-[15px] font-semibold text-ink transition hover:text-blue-text"
              onClick={() => setOpen(false)}
            >
              <Search className="h-4 w-4" />
              Buscar en el sitio
            </Link>
          </nav>
          <a
            href={`${prefix}#contacto`}
            className="btn btn-primary mt-5 w-full"
            onClick={() => setOpen(false)}
          >
            Agendar diagnóstico
            <ArrowUpRight className="h-[18px] w-[18px]" />
          </a>
          <div className="mt-5 flex flex-col gap-1 text-[12px] text-body">
            <a className="py-1 transition hover:text-blue-text" href={`mailto:${email}`}>
              {email}
            </a>
            <a
              className="py-1 transition hover:text-blue-text"
              href={whatsapp}
              target="_blank"
              rel="noopener"
            >
              WhatsApp {whatsappDisplay}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
