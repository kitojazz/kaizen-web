import Image from "next/image";
import {
  createTeamMember,
  deleteTeamMember,
  updateTeamMember,
} from "@/app/admin/actions";
import AdminNotice from "@/components/admin/AdminNotice";
import DeleteButton from "@/components/admin/DeleteButton";
import ImageField from "@/components/admin/ImageField";
import PageHeader from "@/components/admin/PageHeader";
import SubmitButton from "@/components/admin/SubmitButton";
import { Plus, Save } from "@/components/icons";
import { getContent, sortTeam } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage({
  searchParams,
}: {
  searchParams?: { notice?: string; message?: string };
}) {
  const content = await getContent();
  const team = sortTeam(content.team);

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Contenido"
        title="Equipo"
        description="Administrá los integrantes que aparecen en la sección “Un equipo que conoce su producto”, en el hero y en la presentación pública."
      />

      <AdminNotice notice={searchParams?.notice} message={searchParams?.message} />

      <details
        id="nuevo-integrante"
        className="group rounded-[24px] border border-line bg-white"
      >
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6 [&::-webkit-details-marker]:hidden">
          <div>
            <h2 className="font-display text-[18px] font-extrabold tracking-[-0.03em] text-ink">
              Agregar integrante
            </h2>
            <p className="mt-1 text-[11.5px] text-muted">
              Nombre, cargo, foto y rol dentro de las auditorías y procesos.
            </p>
          </div>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-mist text-blue transition group-open:rotate-45">
            <Plus className="h-5 w-5" />
          </span>
        </summary>

        <form
          action={createTeamMember}
          className="border-t border-line p-5 sm:p-6"
        >
          <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
            <ImageField
              name="photo"
              label="Fotografía"
              required
              aspect="aspect-[4/5]"
              help="Ideal: retrato vertical, alta resolución y fondo consistente."
            />
            <div className="grid content-start gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="field-label">
                  Nombre <span className="text-blue-text">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  maxLength={120}
                  placeholder="Nombre y apellido"
                  className="field-input"
                />
              </div>
              <div>
                <label htmlFor="role" className="field-label">
                  Cargo <span className="text-blue-text">*</span>
                </label>
                <input
                  id="role"
                  name="role"
                  required
                  maxLength={160}
                  placeholder="Ej. Calidad e inocuidad"
                  className="field-input"
                />
              </div>
              <div>
                <label htmlFor="order" className="field-label">
                  Orden
                </label>
                <input
                  id="order"
                  name="order"
                  type="number"
                  min={1}
                  defaultValue={team.length + 1}
                  className="field-input"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="linkedin" className="field-label">
                  LinkedIn
                </label>
                <input
                  id="linkedin"
                  name="linkedin"
                  type="url"
                  maxLength={300}
                  placeholder="https://www.linkedin.com/in/..."
                  className="field-input"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="description" className="field-label">
                  Descripción o rol <span className="text-blue-text">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  maxLength={1200}
                  placeholder="Qué aporta al equipo y cómo participa en las auditorías y procesos."
                  className="field-input resize-y"
                />
              </div>
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <SubmitButton pendingText="Agregando...">
              <Plus className="h-4 w-4" />
              Agregar integrante
            </SubmitButton>
          </div>
        </form>
      </details>

      <div className="space-y-3">
        {team.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-line bg-white p-8 text-center text-[12.5px] text-body">
            Todavía no hay integrantes cargados.
          </div>
        ) : (
          team.map((member) => (
            <article
              key={member.id}
              className="rounded-[24px] border border-line bg-white p-4 sm:p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="relative h-[112px] w-[90px] shrink-0 overflow-hidden rounded-2xl bg-[#e8f1fa]">
                  <Image
                    src={member.photo}
                    alt={`${member.name}, ${member.role}`}
                    fill
                    sizes="90px"
                    className="object-cover object-[50%_30%]"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-[19px] font-extrabold tracking-[-0.03em] text-ink">
                      {member.name}
                    </h2>
                    <span className="rounded-full bg-mist px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.1em] text-blue-text">
                      Orden {member.order}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11.5px] font-bold text-blue-text">
                    {member.role}
                  </p>
                  <p className="mt-2 text-[12px] leading-5 text-body">
                    {member.description}
                  </p>
                </div>
              </div>

              <details className="mt-4 border-t border-line pt-4">
                <summary className="flex w-fit cursor-pointer list-none items-center gap-2 rounded-full border border-line bg-[#f9fcff] px-3.5 py-2 text-[10.5px] font-bold text-ink transition hover:border-[#bdd4ea] hover:bg-white [&::-webkit-details-marker]:hidden">
                  Editar integrante
                </summary>

                <form action={updateTeamMember} className="mt-4">
                  <input type="hidden" name="id" value={member.id} />
                  <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
                    <ImageField
                      name="photo"
                      label="Fotografía"
                      current={member.photo}
                      aspect="aspect-[4/5]"
                    />
                    <div className="grid content-start gap-4 sm:grid-cols-2">
                      <div>
                        <label className="field-label" htmlFor={`name-${member.id}`}>
                          Nombre
                        </label>
                        <input
                          id={`name-${member.id}`}
                          name="name"
                          required
                          maxLength={120}
                          defaultValue={member.name}
                          className="field-input"
                        />
                      </div>
                      <div>
                        <label className="field-label" htmlFor={`role-${member.id}`}>
                          Cargo
                        </label>
                        <input
                          id={`role-${member.id}`}
                          name="role"
                          required
                          maxLength={160}
                          defaultValue={member.role}
                          className="field-input"
                        />
                      </div>
                      <div>
                        <label className="field-label" htmlFor={`order-${member.id}`}>
                          Orden
                        </label>
                        <input
                          id={`order-${member.id}`}
                          name="order"
                          type="number"
                          min={1}
                          defaultValue={member.order}
                          className="field-input"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="field-label" htmlFor={`linkedin-${member.id}`}>
                          LinkedIn
                        </label>
                        <input
                          id={`linkedin-${member.id}`}
                          name="linkedin"
                          type="url"
                          maxLength={300}
                          defaultValue={member.linkedin ?? ""}
                          placeholder="https://www.linkedin.com/in/..."
                          className="field-input"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label
                          className="field-label"
                          htmlFor={`description-${member.id}`}
                        >
                          Descripción o rol
                        </label>
                        <textarea
                          id={`description-${member.id}`}
                          name="description"
                          required
                          rows={4}
                          maxLength={1200}
                          defaultValue={member.description}
                          className="field-input resize-y"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <SubmitButton>
                      <Save className="h-4 w-4" />
                      Guardar cambios
                    </SubmitButton>
                  </div>
                </form>

                <form action={deleteTeamMember} className="mt-3 border-t border-line pt-3">
                  <input type="hidden" name="id" value={member.id} />
                  <DeleteButton
                    label="Eliminar integrante"
                    message={`¿Eliminar a ${member.name} del equipo?`}
                  />
                </form>
              </details>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
