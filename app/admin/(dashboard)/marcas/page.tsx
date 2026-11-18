import Image from "next/image";
import {
  createBrand,
  deleteBrand,
  updateBrand,
} from "@/app/admin/actions";
import AdminNotice from "@/components/admin/AdminNotice";
import DeleteButton from "@/components/admin/DeleteButton";
import ImageField from "@/components/admin/ImageField";
import PageHeader from "@/components/admin/PageHeader";
import SubmitButton from "@/components/admin/SubmitButton";
import { Plus, Save } from "@/components/icons";
import { getContent, sortBrands } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminBrandsPage({
  searchParams,
}: {
  searchParams?: { notice?: string; message?: string };
}) {
  const content = await getContent();
  const brands = sortBrands(content.brands);

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Contenido"
        title="Marcas"
        description="Administrá las empresas que aparecen en el carrusel “Empresas que confían en Kaizen”, arriba de la sección de servicios."
      />

      <AdminNotice notice={searchParams?.notice} message={searchParams?.message} />

      <details
        id="nueva-marca"
        className="group rounded-[24px] border border-line bg-white"
      >
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6 [&::-webkit-details-marker]:hidden">
          <div>
            <h2 className="font-display text-[18px] font-extrabold tracking-[-0.03em] text-ink">
              Agregar marca
            </h2>
            <p className="mt-1 text-[11.5px] text-muted">
              Logo y nombre de la empresa que confió en Kaizen.
            </p>
          </div>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-mist text-blue transition group-open:rotate-45">
            <Plus className="h-5 w-5" />
          </span>
        </summary>

        <form action={createBrand} className="border-t border-line p-5 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
            <ImageField
              name="logo"
              label="Logo"
              required
              aspect="aspect-[16/9]"
              help="Ideal: logo horizontal en PNG con fondo transparente o blanco."
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
                  placeholder="Ej. Arcor"
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
                  defaultValue={brands.length + 1}
                  className="field-input"
                />
              </div>
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <SubmitButton pendingText="Agregando...">
              <Plus className="h-4 w-4" />
              Agregar marca
            </SubmitButton>
          </div>
        </form>
      </details>

      <div className="space-y-3">
        {brands.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-line bg-white p-8 text-center text-[12.5px] text-body">
            Todavía no hay marcas cargadas.
          </div>
        ) : (
          brands.map((brand) => (
            <article
              key={brand.id}
              className="rounded-[24px] border border-line bg-white p-4 sm:p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="relative h-[80px] w-[132px] shrink-0 overflow-hidden rounded-2xl border border-line bg-[#e8f1fa]">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    fill
                    sizes="132px"
                    className="object-contain p-2"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-[19px] font-extrabold tracking-[-0.03em] text-ink">
                      {brand.name}
                    </h2>
                    <span className="rounded-full bg-mist px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.1em] text-blue-text">
                      Orden {brand.order}
                    </span>
                  </div>
                </div>
              </div>

              <details className="mt-4 border-t border-line pt-4">
                <summary className="flex w-fit cursor-pointer list-none items-center gap-2 rounded-full border border-line bg-[#f9fcff] px-3.5 py-2 text-[10.5px] font-bold text-ink transition hover:border-[#bdd4ea] hover:bg-white [&::-webkit-details-marker]:hidden">
                  Editar marca
                </summary>

                <form action={updateBrand} className="mt-4">
                  <input type="hidden" name="id" value={brand.id} />
                  <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
                    <ImageField
                      name="logo"
                      label="Logo"
                      current={brand.logo}
                      aspect="aspect-[16/9]"
                    />
                    <div className="grid content-start gap-4 sm:grid-cols-2">
                      <div>
                        <label className="field-label" htmlFor={`name-${brand.id}`}>
                          Nombre
                        </label>
                        <input
                          id={`name-${brand.id}`}
                          name="name"
                          required
                          maxLength={120}
                          defaultValue={brand.name}
                          className="field-input"
                        />
                      </div>
                      <div>
                        <label className="field-label" htmlFor={`order-${brand.id}`}>
                          Orden
                        </label>
                        <input
                          id={`order-${brand.id}`}
                          name="order"
                          type="number"
                          min={1}
                          defaultValue={brand.order}
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

                <form action={deleteBrand} className="mt-3 border-t border-line pt-3">
                  <input type="hidden" name="id" value={brand.id} />
                  <DeleteButton
                    label="Eliminar marca"
                    message={`¿Eliminar a ${brand.name} del carrusel de marcas?`}
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
