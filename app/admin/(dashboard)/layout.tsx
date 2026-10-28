import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import AdminNav from "@/components/admin/AdminNav";
import { ExternalLink, LogOut } from "@/components/icons";
import { logoutAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Panel de administración | Kaizen",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = requireAdmin();
  const content = await getContent();
  const unread = content.leads.filter((lead) => lead.status === "new").length;

  return (
    <div className="min-h-screen bg-[#f3f7fc] lg:flex">
      <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 flex-col bg-navy lg:flex">
        <div className="border-b border-white/10 px-6 py-6">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white">
              <Image
                src="/images/kaizen-symbol.png"
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
            </span>
            <span>
              <span className="block font-display text-[19px] font-extrabold tracking-[-0.04em] text-white">
                Kaizen
              </span>
              <span className="mt-0.5 block text-[8px] font-extrabold uppercase tracking-[0.2em] text-[#7ccbff]">
                Administración
              </span>
            </span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-5">
          <p className="px-6 pb-2 text-[8.5px] font-extrabold uppercase tracking-[0.17em] text-[#6f829a]">
            Contenido del sitio
          </p>
          <AdminNav unread={unread} />
        </div>

        <div className="border-t border-white/10 p-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[11.5px] font-semibold text-[#9fb1c8] transition hover:bg-white/[0.06] hover:text-white"
          >
            <ExternalLink className="h-4 w-4" />
            Ver sitio público
          </Link>
          <div className="mt-2 rounded-2xl bg-white/[0.055] p-3">
            <p className="truncate px-1 text-[10px] font-semibold text-[#9fb1c8]">
              {session.email}
            </p>
            <form action={logoutAction} className="mt-2">
              <button
                type="submit"
                className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-[11px] font-bold text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-40 bg-navy px-4 py-3 lg:hidden">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-white">
                <Image
                  src="/images/kaizen-symbol.png"
                  alt=""
                  width={26}
                  height={26}
                  className="h-6 w-6 object-contain"
                />
              </span>
              <span>
                <span className="block font-display text-[16px] font-extrabold text-white">
                  Kaizen
                </span>
                <span className="block text-[7px] font-extrabold uppercase tracking-[0.18em] text-[#7ccbff]">
                  Administración
                </span>
              </span>
            </Link>
            <div className="flex items-center gap-1">
              <Link
                href="/"
                target="_blank"
                aria-label="Ver sitio público"
                className="grid h-9 w-9 place-items-center rounded-full text-white/75 transition hover:bg-white/10 hover:text-white"
              >
                <ExternalLink className="h-[18px] w-[18px]" />
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  aria-label="Cerrar sesión"
                  className="grid h-9 w-9 place-items-center rounded-full text-white/75 transition hover:bg-white/10 hover:text-white"
                >
                  <LogOut className="h-[18px] w-[18px]" />
                </button>
              </form>
            </div>
          </div>
        </header>
        <div className="border-b border-white/10 bg-navy lg:hidden">
          <AdminNav unread={unread} mobile />
        </div>

        <main className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
