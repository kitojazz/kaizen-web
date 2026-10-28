import Link from "next/link";
import AdminNotice from "@/components/admin/AdminNotice";
import PageHeader from "@/components/admin/PageHeader";
import {
  ArrowRight,
  FileText,
  ImageIcon,
  Inbox,
  Layers,
  Users,
} from "@/components/icons";
import { getContent } from "@/lib/content";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams?: { notice?: string; message?: string };
}) {
  const content = await getContent();
  const unread = content.leads.filter((lead) => lead.status === "new");
  const published = content.posts.filter((post) => post.published);

  const stats = [
    {
      label: "Integrantes",
      value: content.team.length,
      detail: "En la sección Nosotros",
      href: "/admin/equipo",
      icon: Users,
    },
    {
      label: "Artículos",
      value: content.posts.length,
      detail: `${published.length} publicados`,
      href: "/admin/blog",
      icon: FileText,
    },
    {
      label: "Servicios",
      value: content.services.length,
      detail: "Visibles en el sitio",
      href: "/admin/servicios",
      icon: Layers,
    },
    {
      label: "Mensajes nuevos",
      value: unread.length,
      detail: `${content.leads.length} recibidos en total`,
      href: "/admin/mensajes",
      icon: Inbox,
    },
  ];

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Panel general"
        title="Todo el sitio, en un solo lugar"
        description="Administrá el equipo, las imágenes principales, los artículos, los servicios y las consultas recibidas desde el formulario."
      />

      <AdminNotice notice={searchParams?.notice} message={searchParams?.message} />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group rounded-[22px] border border-line bg-white p-5 transition hover:-translate-y-1 hover:border-[#bdd4ea] hover:shadow-[0_24px_46px_-38px_rgba(12,20,34,.45)]"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-mist text-blue">
                  <Icon className="h-5 w-5" />
                </span>
                <ArrowRight className="h-4 w-4 text-[#9aabbe] transition group-hover:translate-x-1 group-hover:text-blue-text" />
              </div>
              <p className="mt-5 font-display text-[34px] font-extrabold leading-none tracking-[-0.05em] text-ink">
                {stat.value}
              </p>
              <p className="mt-2 text-[12px] font-bold text-ink">{stat.label}</p>
              <p className="mt-0.5 text-[10.5px] text-muted">{stat.detail}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
        <section className="rounded-[24px] border border-line bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-[19px] font-extrabold tracking-[-0.03em] text-ink">
                Últimas consultas
              </h2>
              <p className="mt-1 text-[11.5px] text-muted">
                Mensajes guardados desde el formulario de contacto.
              </p>
            </div>
            <Link href="/admin/mensajes" className="text-link">
              Ver bandeja
              <ArrowRight />
            </Link>
          </div>

          <div className="mt-5 divide-y divide-line">
            {content.leads.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-line bg-[#f9fcff] p-6 text-center">
                <Inbox className="mx-auto h-7 w-7 text-[#93a8bf]" />
                <p className="mt-2 text-[12px] font-semibold text-body">
                  Todavía no hay mensajes recibidos.
                </p>
              </div>
            ) : (
              content.leads.slice(0, 4).map((lead) => (
                <div key={lead.id} className="flex gap-3 py-3.5 first:pt-0 last:pb-0">
                  <span
                    className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                      lead.status === "new" ? "bg-blue" : "bg-[#c4d1df]"
                    }`}
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <p className="text-[12.5px] font-bold text-ink">{lead.name}</p>
                      <span className="text-[9.5px] text-muted">
                        {formatDateTime(lead.createdAt)}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-[10.5px] text-muted">
                      {lead.service || "Consulta general"} · {lead.email}
                    </p>
                    <p className="mt-1 line-clamp-2 text-[11.5px] leading-5 text-body">
                      {lead.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <Link
            href="/admin/hero"
            className="group flex items-start gap-4 rounded-[22px] border border-line bg-navy p-5 text-white transition hover:border-[#28425f]"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/10 text-[#7ccbff]">
              <ImageIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[12.5px] font-bold">Imagen principal del hero</p>
              <p className="mt-1 text-[10.5px] leading-5 text-[#a9bbcf]">
                Cambiá la foto de fondo y las imágenes de apoyo de la primera sección.
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#7ccbff]">
                Editar hero
                <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
          <Link
            href="/admin/equipo"
            className="group flex items-start gap-4 rounded-[22px] border border-line bg-white p-5 transition hover:border-[#bdd4ea]"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-mist text-blue">
              <Users className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[12.5px] font-bold text-ink">Equipo Kaizen</p>
              <p className="mt-1 text-[10.5px] leading-5 text-body">
                Actualizá fotos, cargos y descripciones del equipo.
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-blue-text">
                Gestionar equipo
                <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
