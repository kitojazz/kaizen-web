import Link from "next/link";
import { notFound } from "next/navigation";
import {
  createFaq,
  deleteFaq,
  updateFaq,
  updateService,
} from "@/app/admin/actions";
import AdminNotice from "@/components/admin/AdminNotice";
import DeleteButton from "@/components/admin/DeleteButton";
import ImageField from "@/components/admin/ImageField";
import PageHeader from "@/components/admin/PageHeader";
import SubmitButton from "@/components/admin/SubmitButton";
import { ArrowRight, ExternalLink, Plus, Save } from "@/components/icons";
import { serviceIconOptions } from "@/components/service-icons";
import { faqsForService, getContent, sortServices } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminServiceDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { notice?: string; message?: string };
}) {
  const content = await getContent();
  const service = content.services.find((item) => item.id === params.id);
  if (!service) notFound();

  const services = sortServices(content.services);
  const faqs = faqsForService(content.faqs, service.id);
  const redirectTo = `/admin/servicios/${service.id}`;
  const highlightsText = service.highlights
    .map((item) => `${item.title} | ${item.description}`)
    .join("\n");

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Ficha de servicio"
        title={service.title}
        description="Editá el contenido completo de la ficha pública, su contenido destacado y las preguntas frecuentes."
      />

      <AdminNotice notice={searchParams?.notice} message={searchParams?.message} />

      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/admin/servicios"
          className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-[10.5px] font-bold text-ink transition hover:border-[#bdd4ea]"
        >
          Volver a servicios
        </Link>
        <Link
          href={`/servicios/${service.slug}`}
          target="_blank"
          className="inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2 text-[10.5px] font-bold text-white transition hover:bg-[#16283f]"
        >
          Ver ficha pública
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      <form
        action={updateService}
        className="rounded-[24px] border border-line bg-white p-5 sm:p-6"
      >
        <input type="hidden" name="id" value={service.id} />
        <div className="grid gap-5 lg:grid-cols-[290px_1fr]">
          <div>
            <ImageField
              name="image"
              label="Imagen del servicio"
              current={service.image}
              aspect="aspect-[16/10]"
            />
            <div className="mt-4">
              <label htmlFor="imageAlt" className="field-label">
                Texto alternativo
              </label>
              <input
                id="imageAlt"
                name="imageAlt"
                maxLength={220}
                defaultValue={service.imageAlt}
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
                defaultValue={service.title}
                className="field-input"
              />
            </div>
            <div>
              <label htmlFor="slug" className="field-label">
                Dirección web
              </label>
              <input
                id="slug"
                name="slug"
                maxLength={80}
                defaultValue={service.slug}
                className="field-input"
              />
              <p className="mt-1 text-[10px] text-muted">/servicios/{service.slug}</p>
            </div>
            <div>
              <label htmlFor="category" className="field-label">
                Categoría / pestaña
              </label>
              <select
                id="category"
                name="category"
                defaultValue={service.category}
                className="field-input"
              >
                <option value="">Sin categoría</option>
                {service.category &&
                !content.serviceCategories.some(
                  (category) => category.name === service.category,
                ) ? (
                  <option value={service.category}>{service.category} (sin catálogo)</option>
                ) : null}
                {content.serviceCategories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="icon" className="field-label">
                Icono
              </label>
              <select
                id="icon"
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
              <label htmlFor="order" className="field-label">
                Orden
              </label>
              <input
                id="order"
                name="order"
                type="number"
                min={1}
                defaultValue={service.order}
                className="field-input"
              />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-[12px] font-semibold text-ink">
                <input
                  type="checkbox"
                  name="featured"
                  defaultChecked={service.featured}
                  className="h-4 w-4"
                />
                Destacar en la portada
              </label>
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
                defaultValue={service.shortDescription}
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
                rows={3}
                maxLength={1400}
                defaultValue={service.description}
                className="field-input resize-y"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="intro" className="field-label">
                Introducción de la ficha
              </label>
              <textarea
                id="intro"
                name="intro"
                rows={2}
                defaultValue={service.intro}
                className="field-input resize-y"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="content" className="field-label">
                Contenido de la ficha
              </label>
              <textarea
                id="content"
                name="content"
                rows={12}
                defaultValue={service.content}
                placeholder={"Párrafos separados por una línea en blanco.\n\n## Título de sección\n\n- Ítem de lista\n- Otro ítem"}
                className="field-input resize-y font-mono text-[11.5px]"
              />
              <p className="mt-1 text-[10px] text-muted">
                Admite párrafos, títulos con ## o ###, listas con - y negritas con **texto**.
              </p>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="highlights" className="field-label">
                Puntos destacados
              </label>
              <textarea
                id="highlights"
                name="highlights"
                rows={4}
                defaultValue={highlightsText}
                placeholder={"Título | Descripción\nOtro título | Otra descripción"}
                className="field-input resize-y"
              />
              <p className="mt-1 text-[10px] text-muted">Uno por línea, separados con |.</p>
            </div>
            <div>
              <label htmlFor="relatedServiceId" className="field-label">
                Servicio relacionado
              </label>
              <select
                id="relatedServiceId"
                name="relatedServiceId"
                defaultValue={service.relatedServiceId ?? ""}
                className="field-input"
              >
                <option value="">Sin servicio relacionado</option>
                {services
                  .filter((item) => item.id !== service.id)
                  .map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label htmlFor="labels" className="field-label">
                Etiquetas
              </label>
              <input
                id="labels"
                name="labels"
                maxLength={180}
                defaultValue={service.labels.join(", ")}
                className="field-input"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="keywords" className="field-label">
                Palabras clave del buscador
              </label>
              <input
                id="keywords"
                name="keywords"
                maxLength={400}
                defaultValue={service.keywords}
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
                defaultValue={service.ctaLabel}
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
                defaultValue={service.ctaHref}
                className="field-input"
              />
            </div>
            <div>
              <label htmlFor="seoTitle" className="field-label">
                Título SEO
              </label>
              <input
                id="seoTitle"
                name="seoTitle"
                maxLength={200}
                defaultValue={service.seoTitle}
                className="field-input"
              />
            </div>
            <div>
              <label htmlFor="seoDescription" className="field-label">
                Descripción SEO
              </label>
              <input
                id="seoDescription"
                name="seoDescription"
                maxLength={400}
                defaultValue={service.seoDescription}
                className="field-input"
              />
            </div>
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <SubmitButton>
            <Save className="h-4 w-4" />
            Guardar ficha
          </SubmitButton>
        </div>
      </form>

      <section className="rounded-[24px] border border-line bg-white p-5 sm:p-6">
        <div>
          <h2 className="font-display text-[19px] font-extrabold tracking-[-0.03em] text-ink">
            Preguntas frecuentes de la ficha
          </h2>
          <p className="mt-1 text-[11.5px] leading-5 text-muted">
            Se muestran en la ficha pública y también aparecen en el buscador del sitio.
          </p>
        </div>

        <div className="mt-5 space-y-3">
          {faqs.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-line bg-[#f9fcff] p-5 text-[12px] text-body">
              Todavía no hay preguntas para este servicio.
            </p>
          ) : (
            faqs.map((faq) => (
              <details
                key={faq.id}
                className="rounded-2xl border border-line bg-[#f9fcff] p-4"
              >
                <summary className="cursor-pointer list-none text-[12.5px] font-bold text-ink [&::-webkit-details-marker]:hidden">
                  {faq.question}
                </summary>
                <form action={updateFaq} className="mt-3 space-y-3">
                  <input type="hidden" name="id" value={faq.id} />
                  <input type="hidden" name="redirectTo" value={redirectTo} />
                  <div>
                    <label className="field-label">Pregunta</label>
                    <input
                      name="question"
                      required
                      maxLength={300}
                      defaultValue={faq.question}
                      className="field-input"
                    />
                  </div>
                  <div>
                    <label className="field-label">Respuesta</label>
                    <textarea
                      name="answer"
                      required
                      rows={3}
                      defaultValue={faq.answer}
                      className="field-input resize-y"
                    />
                  </div>
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <label className="field-label">Orden</label>
                      <input
                        name="order"
                        type="number"
                        min={1}
                        defaultValue={faq.order}
                        className="field-input w-28"
                      />
                    </div>
                    <SubmitButton>
                      <Save className="h-4 w-4" />
                      Guardar pregunta
                    </SubmitButton>
                  </div>
                </form>
                <form action={deleteFaq} className="mt-3 border-t border-line pt-3">
                  <input type="hidden" name="id" value={faq.id} />
                  <input type="hidden" name="redirectTo" value={redirectTo} />
                  <DeleteButton
                    label="Eliminar pregunta"
                    message={`¿Eliminar la pregunta “${faq.question}”?`}
                  />
                </form>
              </details>
            ))
          )}
        </div>

        <details className="group mt-5 rounded-2xl border border-dashed border-line bg-white p-4">
          <summary className="flex cursor-pointer list-none items-center gap-2 text-[12px] font-bold text-blue-text [&::-webkit-details-marker]:hidden">
            <Plus className="h-4 w-4" />
            Agregar pregunta
          </summary>
          <form action={createFaq} className="mt-4 space-y-3">
            <input type="hidden" name="serviceId" value={service.id} />
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <div>
              <label className="field-label">Pregunta</label>
              <input
                name="question"
                required
                maxLength={300}
                placeholder="¿Qué necesita para habilitar un local?"
                className="field-input"
              />
            </div>
            <div>
              <label className="field-label">Respuesta</label>
              <textarea
                name="answer"
                required
                rows={3}
                placeholder="Respuesta breve y concreta."
                className="field-input resize-y"
              />
            </div>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <label className="field-label">Orden</label>
                <input
                  name="order"
                  type="number"
                  min={1}
                  defaultValue={faqs.length + 1}
                  className="field-input w-28"
                />
              </div>
              <SubmitButton pendingText="Agregando...">
                <Plus className="h-4 w-4" />
                Agregar pregunta
              </SubmitButton>
            </div>
          </form>
        </details>
      </section>

      <Link href="/admin/servicios" className="text-link">
        Volver a todos los servicios
        <ArrowRight />
      </Link>
    </div>
  );
}
