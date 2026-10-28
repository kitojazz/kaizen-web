"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  ImageIcon,
  Inbox,
  Layers,
  LayoutDashboard,
  Users,
} from "@/components/icons";

const links = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard },
  { href: "/admin/equipo", label: "Equipo", icon: Users },
  { href: "/admin/hero", label: "Hero", icon: ImageIcon },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/servicios", label: "Servicios", icon: Layers },
  { href: "/admin/mensajes", label: "Mensajes", icon: Inbox },
];

export default function AdminNav({
  unread = 0,
  mobile = false,
}: {
  unread?: number;
  mobile?: boolean;
}) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegación del panel"
      className={
        mobile
          ? "flex gap-2 overflow-x-auto px-3 py-3"
          : "flex flex-col gap-1.5 px-3"
      }
    >
      {links.map((link) => {
        const Icon = link.icon;
        const active =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex shrink-0 items-center gap-2.5 rounded-xl text-[12.5px] font-semibold transition ${
              mobile ? "px-3 py-2" : "px-3.5 py-2.5"
            } ${
              active
                ? "bg-white/12 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,.08)]"
                : "text-[#9fb1c8] hover:bg-white/[0.06] hover:text-white"
            }`}
            aria-current={active ? "page" : undefined}
          >
            <Icon className="h-[18px] w-[18px]" />
            <span>{link.label}</span>
            {link.href === "/admin/mensajes" && unread > 0 ? (
              <span className="ml-auto grid min-w-5 place-items-center rounded-full bg-[#7ccbff] px-1.5 py-0.5 text-[9px] font-extrabold text-navy">
                {unread}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
