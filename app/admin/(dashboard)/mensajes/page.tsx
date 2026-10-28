import Link from "next/link";
import { deleteLead, toggleLeadStatus } from "@/app/admin/actions";
import AdminNotice from "@/components/admin/AdminNotice";
import DeleteButton from "@/components/admin/DeleteButton";
import PageHeader from "@/components/admin/PageHeader";
import SubmitButton from "@/components/admin/SubmitButton";
import { CheckCircle, Inbox, Mail, Phone } from "@/components/icons";
import { getContent } from "@/lib/content";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams?: { notice?: string; message?: string };
}) {
  const content = await getContent();
  const leads = [...content.leads].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const unread = leads.filter((lead) => lead.status === "new").length;

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Contacto"
        title="Mensajes recibidos"
        description="Todas las consultas enviadas desde el formulario del sitio quedan guardadas acá, incluso si además se derivan por correo o WhatsApp."
        action={
          <div className="flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2.5 text-[10.5px] font-bold text-body">
            <span className={`h-2 w-2 rounded-full ${unread ? "bg-blue" : "bg-[#b9c9da]"}`} />
            {unread} sin leer · {leads.length} en total
          </div>
        }
      />

      <AdminNotice notice={searchParams?.notice} message={searchParams?.message} />

      {leads.length === 0 ? (
        <div className="rounded-[26px] border border-dashed border-line bg-white p-10 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-mist text-blue">
            <Inbox className="h-7 w-7" />
          </span>
          <h2 className="mt-4 font-display text-[20px] font-extrabold tracking-[-0.03em] text-ink">
            La bandeja está vacía
          </h2>
          <p className="mx-auto mt-1.5 max-w-[420px] text-[12px] leading-5 text-body">
            Cuando alguien complete el formulario de contacto del sitio, la consulta va a aparecer acá.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <article
              key={lead.id}
              className={`rounded-[24px] border bg-white p-5 sm:p-6 ${
                lead.status === "new" ? "border-[#b9d7f3]" : "border-line"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${
                      lead.status === "new"
                        ? "bg-mist text-blue"
                        : "bg-[#f3f6f9] text-[#71849a]"
                    }`}
                  >
                    <Mail className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-[18px] font-extrabold tracking-[-0.03em] text-ink">
                        {lead.name}
                      </h2>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[8.5px] font-extrabold uppercase tracking-[0.1em] ${
                          lead.status === "new"
                            ? "bg-mist text-blue-text"
                            : "bg-[#f2f5f8] text-[#64748b]"
                        }`}
                      >
                        {lead.status === "new" ? "Nuevo" : "Leído"}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[10.5px] text-muted">
                      {formatDateTime(lead.createdAt)}
                      {lead.company ? ` · ${lead.company}` : ""}
                    </p>
                  </div>
                </div>
                {lead.service ? (
                  <span className="rounded-full border border-line bg-[#f9fcff] px-3 py-1.5 text-[9.5px] font-bold text-body">
                    {lead.service}
                  </span>
                ) : null}
              </div>

              <div className="mt-4 grid gap-3 rounded-2xl border border-line bg-[#f9fcff] p-4 sm:grid-cols-2">
                <a
                  href={`mailto:${lead.email}`}
                  className="flex min-w-0 items-center gap-2 text-[11.5px] font-semibold text-body transition hover:text-blue-text"
                >
                  <Mail className="h-4 w-4 shrink-0 text-blue" />
                  <span className="truncate">{lead.email}</span>
                </a>
                {lead.phone ? (
                  <a
                    href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`}
                    className="flex min-w-0 items-center gap-2 text-[11.5px] font-semibold text-body transition hover:text-blue-text"
                  >
                    <Phone className="h-4 w-4 shrink-0 text-blue" />
                    <span className="truncate">{lead.phone}</span>
                  </a>
                ) : (
                  <span className="text-[11px] text-muted">Sin teléfono informado</span>
                )}
              </div>

              <p className="mt-4 whitespace-pre-line text-[13px] leading-6 text-body">
                {lead.message}
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                <div className="flex flex-wrap gap-2">
                  <form action={toggleLeadStatus}>
                    <input type="hidden" name="id" value={lead.id} />
                    <SubmitButton
                      className="inline-flex items-center gap-2 rounded-full border border-line bg-[#f9fcff] px-3.5 py-2 text-[10.5px] font-bold text-ink transition hover:border-[#bdd4ea] hover:bg-white disabled:opacity-50"
                      pendingText="Actualizando..."
                    >
                      <CheckCircle className="h-4 w-4" />
                      {lead.status === "new" ? "Marcar como leído" : "Marcar como nuevo"}
                    </SubmitButton>
                  </form>
                  <Link
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `Hola ${lead.name}, te escribimos de Kaizen por tu consulta.`,
                    )}`}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-2 text-[10.5px] font-bold text-body transition hover:border-[#bdd4ea] hover:text-blue-text"
                  >
                    <Phone className="h-4 w-4" />
                    Responder
                  </Link>
                </div>
                <form action={deleteLead}>
                  <input type="hidden" name="id" value={lead.id} />
                  <DeleteButton
                    label="Eliminar mensaje"
                    message={`¿Eliminar el mensaje de ${lead.name}?`}
                  />
                </form>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
