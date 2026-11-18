import Image from "next/image";
import {
  createGalleryImage,
  deleteGalleryImage,
  updateGalleryImage,
} from "@/app/admin/actions";
import AdminNotice from "@/components/admin/AdminNotice";
import DeleteButton from "@/components/admin/DeleteButton";
import ImageField from "@/components/admin/ImageField";
import PageHeader from "@/components/admin/PageHeader";
import SubmitButton from "@/components/admin/SubmitButton";
import { Plus, Save } from "@/components/icons";
import { getContent, sortTeamGallery } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams?: { notice?: string; message?: string };
}) {
  const content = await getContent();
  const images = sortTeamGallery(content.teamGallery);

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Contenido"
        title="Galería del equipo"
        description="Administrá las fotografías del carrusel que aparece en la sección “El equipo detrás de Kaizen” de la portada."
      />

      <AdminNotice notice={searchParams?.notice} message={searchParams?.message} />

      <details
        id="nueva-foto"
        className="group rounded-[24px] border border-line bg-white"
      >
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6 [&::-webkit-details-marker]:hidden">
          <div>
            <h2 className="font-display text-[18px] font-extrabold tracking-[-0.03em] text-ink">
              Agregar fotografía
            </h2>
            <p className="mt-1 text-[11.5px] text-muted">
              Fotos verticales del equipo para la galería en movimiento.
            </p>
          </div>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-mist text-blue transition group-open:rotate-45">
            <Plus className="h-5 w-5" />
          </span>
        </summary>

        <form action={createGalleryImage} className="border-t border-line p-5 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
            <ImageField
              name="image"
              label="Fotografía"
              required
              aspect="aspect-[4/5]"
              help="Ideal: foto vertical del equipo, alta resolución."
            />
            <div className="grid content-start gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="alt" className="field-label">
                  Descripción (opcional)
                </label>
                <input
                  id="alt"
                  name="alt"
                  maxLength={300}
                  placeholder="Ej. Bruno en una auditoría de planta"
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
                  defaultValue={images.length + 1}
                  className="field-input"
                />
              </div>
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <SubmitButton pendingText="Agregando...">
              <Plus className="h-4 w-4" />
              Agregar fotografía
            </SubmitButton>
          </div>
        </form>
      </details>

      <div className="space-y-3">
        {images.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-line bg-white p-8 text-center text-[12.5px] text-body">
            Todavía no hay fotografías cargadas.
          </div>
        ) : (
          images.map((item) => (
            <article
              key={item.id}
              className="rounded-[24px] border border-line bg-white p-4 sm:p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="relative h-[140px] w-[112px] shrink-0 overflow-hidden rounded-2xl bg-[#e8f1fa]">
                  <Image
                    src={item.image}
                    alt={item.alt || "Fotografía del equipo de Kaizen"}
                    fill
                    sizes="112px"
                    className="object-cover object-[50%_32%]"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-[19px] font-extrabold tracking-[-0.03em] text-ink">
                      Fotografía {item.order}
                    </h2>
                    <span className="rounded-full bg-mist px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.1em] text-blue-text">
                      Orden {item.order}
                    </span>
                  </div>
                  <p className="mt-2 text-[12px] leading-5 text-body">
                    {item.alt || "Sin descripción."}
                  </p>
                </div>
              </div>

              <details className="mt-4 border-t border-line pt-4">
                <summary className="flex w-fit cursor-pointer list-none items-center gap-2 rounded-full border border-line bg-[#f9fcff] px-3.5 py-2 text-[10.5px] font-bold text-ink transition hover:border-[#bdd4ea] hover:bg-white [&::-webkit-details-marker]:hidden">
                  Editar fotografía
                </summary>

                <form action={updateGalleryImage} className="mt-4">
                  <input type="hidden" name="id" value={item.id} />
                  <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
                    <ImageField
                      name="image"
                      label="Fotografía"
                      current={item.image}
                      aspect="aspect-[4/5]"
                    />
                    <div className="grid content-start gap-4 sm:grid-cols-2">
                      <div>
                        <label className="field-label" htmlFor={`alt-${item.id}`}>
                          Descripción (opcional)
                        </label>
                        <input
                          id={`alt-${item.id}`}
                          name="alt"
                          maxLength={300}
                          defaultValue={item.alt}
                          placeholder="Ej. Bruno en una auditoría de planta"
                          className="field-input"
                        />
                      </div>
                      <div>
                        <label className="field-label" htmlFor={`order-${item.id}`}>
                          Orden
                        </label>
                        <input
                          id={`order-${item.id}`}
                          name="order"
                          type="number"
                          min={1}
                          defaultValue={item.order}
                          className="field-input"
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

                <form action={deleteGalleryImage} className="mt-3 border-t border-line pt-3">
                  <input type="hidden" name="id" value={item.id} />
                  <DeleteButton
                    label="Eliminar fotografía"
                    message="¿Eliminar esta fotografía de la galería del equipo?"
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
