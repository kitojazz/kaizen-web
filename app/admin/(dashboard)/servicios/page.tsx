import Image from "next/image";
import {
  createService,
  deleteService,
  updateService,
} from "@/app/admin/actions";
import AdminNotice from "@/components/admin/AdminNotice";
import DeleteButton from "@/components/admin/DeleteButton";
import ImageField from "@/components/admin/ImageField";
import PageHeader from "@/components/admin/PageHeader";
import SubmitButton from "@/components/admin/SubmitButton";
import { Plus, Save } from "@/components/icons";
import { getServiceIcon, serviceIconOptions } from "@/components/service-icons";
import { getContent, sortServices } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage({
  searchParams,
}: {
  searchParams?: { notice?: string; message?: string };
}) {
  const content = await getContent();
  const services = sortServices(content.services);

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Contenido"
        title="Servicios"
        description="Agregá, editá o eliminá los servicios que aparecen en el sitio. Cada tarjeta puede tener imagen, icono, descripciones y botón de acción."
      />

      <AdminNotice notice={searchParams?.notice} message={searchParams?.message} />

      <details className="group rounded-[24px] border border-line bg-white">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6 [&::-webkit-details-marker]:hidden">
          <div>
            <h2 className="font-display text-[18px] font-extrabold tracking-[-0.03em] text-ink">
              Agregar servicio
            </h2>
            <p className="mt-1 text-[11.5px] text-muted">
              Completá la información que verá el cliente en la web.
            </p>
          </div>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-mist text-blue transition group-open:rotate-45">
            <Plus className="h-5 w-5" />
          </span>
        </summary>

        <form action={createService} className="border-t border-line p-5 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[290px_1fr]">
            <div>
              <ImageField
                name="image"
                label="Imagen del servicio"
                required
                aspect="aspect-[16/10]"
                help="Recomendado: 1600 px de ancho. Se optimiza a WebP."
              />
              <div className="mt-4">
                <label htmlFor="imageAlt" className="field-label">
                  Texto alternativo
                </label>
                <input
                  id="imageAlt"
                  name="imageAlt"
                  maxLength={220}
                  placeholder="Descripción de la imagen"
                  className="field-input"
                />
              </div>
            </div>

            <div className="grid content-start gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="title" className="field-label">
                  Título <span className="text-blue-text">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  required
                  maxLength={140}
                  placeholder="Ej. Rotulado de alimentos"
                  className="field-input"
                />
              </div>
              <div>
                <label htmlFor="icon" className="field-label">
                  Icono
                </label>
                <select id="icon" name="icon" className="field-input">
                  {serviceIconOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
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
                  defaultValue={services.length + 1}
                  className="field-input"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="shortDescription" className="field-label">
                  Descripción corta <span className="text-blue-text">*</span>
                </label>
                <textarea
                  id="shortDescription"
                  name="shortDescription"
                  required
                  rows={2}
                  maxLength={400}
                  placeholder="Resumen que se muestra en la tarjeta."
                  className="field-input resize-y"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="description" className="field-label">
                  Descripción detallada <span className="text-blue-text">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  maxLength={1400}
                  placeholder="Alcance completo del servicio."
                  className="field-input resize-y"
                />
              </div>
              <div>
                <label htmlFor="labels" className="field-label">
                  Etiquetas
                </label>
                <input
                  id="labels"
                  name="labels"
                  maxLength={180}
                  placeholder="RUNAEV, Importar"
                  className="field-input"
                />
                <p className="mt-1 text-[10px] text-muted">Separadas por coma.</p>
              </div>
              <div>
                <label htmlFor="keywords" className="field-label">
                  Palabras clave del buscador
                </label>
                <input
                  id="keywords"
                  name="keywords"
                  maxLength={400}
                  placeholder="rotulado etiqueta nutricional"
                  className="field-input"
                />
              </div>
              <div>
                <label htmlFor="ctaLabel" className="field-label">
                  Texto del botón
                </label>
                <input
                  id="ctaLabel"
                  name="ctaLabel"
                  maxLength={60}
                  defaultValue="Consultar"
                  className="field-input"
                />
              </div>
              <div>
                <label htmlFor="ctaHref" className="field-label">
                  Destino del botón
                </label>
                <input
                  id="ctaHref"
                  name="ctaHref"
                  maxLength={240}
                  defaultValue="#contacto"
                  className="field-input"
                />
              </div>
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <SubmitButton pendingText="Agregando...">
              <Plus className="h-4 w-4" />
              Agregar servicio
            </SubmitButton>
          </div>
        </form>
      </details>

      <div className="space-y-3">
        {services.map((service) => {
          const Icon = getServiceIcon(service.icon);
          return (
            <article
              key={service.id}
              className="rounded-[24px] border border-line bg-white p-4 sm:p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-2xl bg-[#e8f1fa] sm:w-[185px]">
                  <Image
                    src={service.image}
                    alt=""
                    fill
                    sizes="185px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-mist text-blue">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="rounded-full bg-mist px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.1em] text-blue-text">
                      Orden {service.order}
                    </span>
                  </div>
                  <h2 className="mt-2 font-display text-[20px] font-extrabold leading-[1.2] tracking-[-0.03em] text-ink">
                    {service.title}
                  </h2>
                  <p className="mt-1.5 text-[12px] leading-5 text-body">
                    {service.shortDescription}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {service.labels.map((label) => (
                      <span
                        key={label}
                        className="rounded-full border border-line px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.06em] text-muted"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <details className="mt-4 border-t border-line pt-4">
                <summary className="flex w-fit cursor-pointer list-none items-center gap-2 rounded-full border border-line bg-[#f9fcff] px-3.5 py-2 text-[10.5px] font-bold text-ink transition hover:border-[#bdd4ea] hover:bg-white [&::-webkit-details-marker]:hidden">
                  Editar servicio
                </summary>

                <form action={updateService} className="mt-4">
                  <input type="hidden" name="id" value={service.id} />
                  <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
                    <div>
                      <ImageField
                        name="image"
                        label="Imagen"
                        current={service.image}
                        aspect="aspect-[16/10]"
                      />
                      <div className="mt-4">
                        <label
                          htmlFor={`imageAlt-${service.id}`}
                          className="field-label"
                        >
                          Texto alternativo
                        </label>
                        <input
                          id={`imageAlt-${service.id}`}
                          name="imageAlt"
                          maxLength={220}
                          defaultValue={service.imageAlt}
                          className="field-input"
                        />
                      </div>
                    </div>

                    <div className="grid content-start gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label
                          htmlFor={`title-${service.id}`}
                          className="field-label"
                        >
                          Título
                        </label>
                        <input
                          id={`title-${service.id}`}
                          name="title"
                          required
                          maxLength={140}
                          defaultValue={service.title}
                          className="field-input"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`icon-${service.id}`}
                          className="field-label"
                        >
                          Icono
                        </label>
                        <select
                          id={`icon-${service.id}`}
                          name="icon"
                          defaultValue={service.icon}
                          className="field-input"
                        >
                          {serviceIconOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor={`order-${service.id}`}
                          className="field-label"
                        >
                          Orden
                        </label>
                        <input
                          id={`order-${service.id}`}
                          name="order"
                          type="number"
                          min={1}
                          defaultValue={service.order}
                          className="field-input"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label
                          htmlFor={`shortDescription-${service.id}`}
                          className="field-label"
                        >
                          Descripción corta
                        </label>
                        <textarea
                          id={`shortDescription-${service.id}`}
                          name="shortDescription"
                          required
                          rows={2}
                          maxLength={400}
                          defaultValue={service.shortDescription}
                          className="field-input resize-y"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label
                          htmlFor={`description-${service.id}`}
                          className="field-label"
                        >
                          Descripción detallada
                        </label>
                        <textarea
                          id={`description-${service.id}`}
                          name="description"
                          required
                          rows={4}
                          maxLength={1400}
                          defaultValue={service.description}
                          className="field-input resize-y"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`labels-${service.id}`}
                          className="field-label"
                        >
                          Etiquetas
                        </label>
                        <input
                          id={`labels-${service.id}`}
                          name="labels"
                          maxLength={180}
                          defaultValue={service.labels.join(", ")}
                          className="field-input"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`keywords-${service.id}`}
                          className="field-label"
                        >
                          Palabras clave
                        </label>
                        <input
                          id={`keywords-${service.id}`}
                          name="keywords"
                          maxLength={400}
                          defaultValue={service.keywords}
                          className="field-input"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`ctaLabel-${service.id}`}
                          className="field-label"
                        >
                          Texto del botón
                        </label>
                        <input
                          id={`ctaLabel-${service.id}`}
                          name="ctaLabel"
                          maxLength={60}
                          defaultValue={service.ctaLabel}
                          className="field-input"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`ctaHref-${service.id}`}
                          className="field-label"
                        >
                          Destino del botón
                        </label>
                        <input
                          id={`ctaHref-${service.id}`}
                          name="ctaHref"
                          maxLength={240}
                          defaultValue={service.ctaHref}
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

                <form
                  action={deleteService}
                  className="mt-3 border-t border-line pt-3"
                >
                  <input type="hidden" name="id" value={service.id} />
                  <DeleteButton
                    label="Eliminar servicio"
                    message={`¿Eliminar el servicio “${service.title}”?`}
                  />
                </form>
              </details>
            </article>
          );
        })}
      </div>
    </div>
  );
}
