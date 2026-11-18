import {
  createServiceCategory,
  deleteServiceCategory,
  updateServiceCategory,
} from "@/app/admin/actions";
import AdminNotice from "@/components/admin/AdminNotice";
import DeleteButton from "@/components/admin/DeleteButton";
import PageHeader from "@/components/admin/PageHeader";
import SubmitButton from "@/components/admin/SubmitButton";
import { Plus, Save } from "@/components/icons";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams?: { notice?: string; message?: string };
}) {
  const content = await getContent();
  const categories = [...content.serviceCategories].sort(
    (a, b) => a.order - b.order || a.name.localeCompare(b.name),
  );
  const countFor = (name: string) =>
    content.services.filter((service) => service.category === name).length;

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Contenido"
        title="Categorías de servicios"
        description="Definí las pestañas de la sección de servicios y el orden en que aparecen. Los cambios se reflejan en el sitio y en los formularios del panel."
      />

      <AdminNotice notice={searchParams?.notice} message={searchParams?.message} />

      <details id="nueva-categoria" className="group rounded-[24px] border border-line bg-white">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6 [&::-webkit-details-marker]:hidden">
          <div>
            <h2 className="font-display text-[18px] font-extrabold tracking-[-0.03em] text-ink">
              Agregar categoría
            </h2>
            <p className="mt-1 text-[11.5px] text-muted">
              El nombre debe coincidir con el que se asigna en cada servicio.
            </p>
          </div>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-mist text-blue transition group-open:rotate-45">
            <Plus className="h-5 w-5" />
          </span>
        </summary>

        <form action={createServiceCategory} className="border-t border-line p-5 sm:p-6">
          <div className="grid content-start gap-4 sm:grid-cols-[1fr_140px]">
            <div>
              <label htmlFor="name" className="field-label">
                Nombre <span className="text-blue-text">*</span>
              </label>
              <input
                id="name"
                name="name"
                required
                maxLength={80}
                placeholder="Ej. Regulatorios"
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
                defaultValue={categories.length + 1}
                className="field-input"
              />
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <SubmitButton pendingText="Agregando...">
              <Plus className="h-4 w-4" />
              Agregar categoría
            </SubmitButton>
          </div>
        </form>
      </details>

      <div className="space-y-3">
        {categories.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-line bg-white p-8 text-center text-[12.5px] text-body">
            Todavía no hay categorías cargadas.
          </div>
        ) : (
          categories.map((category) => {
            const services = countFor(category.name);
            return (
              <article
                key={category.id}
                className="rounded-[24px] border border-line bg-white p-4 sm:p-5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-[19px] font-extrabold tracking-[-0.03em] text-ink">
                    {category.name}
                  </h2>
                  <span className="rounded-full bg-mist px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.1em] text-blue-text">
                    Orden {category.order}
                  </span>
                  <span className="rounded-full bg-[#f3f7fb] px-2.5 py-1 text-[10px] font-semibold text-muted">
                    {services} {services === 1 ? "servicio" : "servicios"}
                  </span>
                </div>

                <details className="mt-4 border-t border-line pt-4">
                  <summary className="flex w-fit cursor-pointer list-none items-center gap-2 rounded-full border border-line bg-[#f9fcff] px-3.5 py-2 text-[10.5px] font-bold text-ink transition hover:border-[#bdd4ea] hover:bg-white [&::-webkit-details-marker]:hidden">
                    Editar categoría
                  </summary>

                  <form action={updateServiceCategory} className="mt-4">
                    <input type="hidden" name="id" value={category.id} />
                    <div className="grid content-start gap-4 sm:grid-cols-[1fr_140px]">
                      <div>
                        <label className="field-label" htmlFor={`name-${category.id}`}>
                          Nombre
                        </label>
                        <input
                          id={`name-${category.id}`}
                          name="name"
                          required
                          maxLength={80}
                          defaultValue={category.name}
                          className="field-input"
                        />
                      </div>
                      <div>
                        <label className="field-label" htmlFor={`order-${category.id}`}>
                          Orden
                        </label>
                        <input
                          id={`order-${category.id}`}
                          name="order"
                          type="number"
                          min={1}
                          defaultValue={category.order}
                          className="field-input"
                        />
                      </div>
                    </div>
                    {services > 0 ? (
                      <p className="mt-3 text-[11.5px] leading-5 text-muted">
                        Si cambia el nombre, los {services} servicios asignados se actualizan
                        automáticamente.
                      </p>
                    ) : null}
                    <div className="mt-4 flex justify-end">
                      <SubmitButton>
                        <Save className="h-4 w-4" />
                        Guardar cambios
                      </SubmitButton>
                    </div>
                  </form>

                  <form action={deleteServiceCategory} className="mt-3 border-t border-line pt-3">
                    <input type="hidden" name="id" value={category.id} />
                    <DeleteButton
                      label="Eliminar categoría"
                      message={
                        services > 0
                          ? `¿Eliminar ${category.name}? Los ${services} servicios asignados quedarán sin categoría.`
                          : `¿Eliminar la categoría ${category.name}?`
                      }
                    />
                  </form>
                </details>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
