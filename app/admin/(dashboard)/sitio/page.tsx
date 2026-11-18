import {
  createFaq,
  deleteFaq,
  updateFaq,
  updateSettings,
} from "@/app/admin/actions";
import AdminNotice from "@/components/admin/AdminNotice";
import DeleteButton from "@/components/admin/DeleteButton";
import PageHeader from "@/components/admin/PageHeader";
import SubmitButton from "@/components/admin/SubmitButton";
import { Plus, Save } from "@/components/icons";
import { getContent, sortFaqs } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminSitePage({
  searchParams,
}: {
  searchParams?: { notice?: string; message?: string };
}) {
  const content = await getContent();
  const { settings } = content;
  const faqs = sortFaqs(content.faqs.filter((faq) => !faq.serviceId));

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Contenido"
        title="Textos del sitio"
        description="Correo de contacto, WhatsApp, textos principales y SEO de la portada. También podés administrar las preguntas frecuentes generales."
      />

      <AdminNotice notice={searchParams?.notice} message={searchParams?.message} />

      <form
        action={updateSettings}
        className="rounded-[24px] border border-line bg-white p-5 sm:p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contactEmail" className="field-label">
              Correo de contacto
            </label>
            <input
              id="contactEmail"
              name="contactEmail"
              type="email"
              required
              defaultValue={settings.contactEmail}
              className="field-input"
            />
          </div>
          <div>
            <label htmlFor="whatsappNumber" className="field-label">
              WhatsApp (solo números, con código de país)
            </label>
            <input
              id="whatsappNumber"
              name="whatsappNumber"
              required
              defaultValue={settings.whatsappNumber}
              placeholder="59899082776"
              className="field-input"
            />
          </div>
          <div>
            <label htmlFor="whatsappDisplay" className="field-label">
              WhatsApp visible
            </label>
            <input
              id="whatsappDisplay"
              name="whatsappDisplay"
              required
              defaultValue={settings.whatsappDisplay}
              placeholder="+598 99 082 776"
              className="field-input"
            />
          </div>
          <div>
            <label htmlFor="trustTitle" className="field-label">
              Título de la franja de marcas
            </label>
            <input
              id="trustTitle"
              name="trustTitle"
              required
              defaultValue={settings.trustTitle}
              className="field-input"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="contactAddress" className="field-label">
              Dirección visible en contacto y footer
            </label>
            <input
              id="contactAddress"
              name="contactAddress"
              required
              defaultValue={settings.contactAddress}
              className="field-input"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="contactAddressUrl" className="field-label">
              Enlace del mapa
            </label>
            <input
              id="contactAddressUrl"
              name="contactAddressUrl"
              defaultValue={settings.contactAddressUrl}
              className="field-input"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="contactEmailProposed" className="field-label">
              Correo propuesto (pendiente de validación, no se usa en la web)
            </label>
            <input
              id="contactEmailProposed"
              name="contactEmailProposed"
              type="email"
              defaultValue={settings.contactEmailProposed}
              className="field-input"
            />
            <p className="mt-1 text-[11px] leading-4 text-muted">
              Se guarda para revisión. El correo vigente sigue siendo el campo
              “Correo de contacto”.
            </p>
          </div>
          <div className="sm:col-span-2 border-t border-line pt-4">
            <label htmlFor="heroEyebrow" className="field-label">
              Hero: antetítulo
            </label>
            <input
              id="heroEyebrow"
              name="heroEyebrow"
              required
              defaultValue={settings.heroEyebrow}
              className="field-input"
            />
          </div>
          <div>
            <label htmlFor="heroTitle" className="field-label">
              H1 principal: línea blanca
            </label>
            <input
              id="heroTitle"
              name="heroTitle"
              required
              defaultValue={settings.heroTitle}
              className="field-input"
            />
          </div>
          <div>
            <label htmlFor="heroTitleAccent" className="field-label">
              H1 principal: línea celeste
            </label>
            <input
              id="heroTitleAccent"
              name="heroTitleAccent"
              required
              defaultValue={settings.heroTitleAccent}
              className="field-input"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="heroSubheading" className="field-label">
              H2 comercial
            </label>
            <input
              id="heroSubheading"
              name="heroSubheading"
              required
              defaultValue={settings.heroSubheading}
              className="field-input"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="heroParagraph" className="field-label">
              Hero: párrafo descriptivo
            </label>
            <textarea
              id="heroParagraph"
              name="heroParagraph"
              required
              rows={3}
              defaultValue={settings.heroParagraph}
              className="field-input resize-y"
            />
          </div>
          <div className="sm:col-span-2 border-t border-line pt-4">
            <label htmlFor="homeSeoTitle" className="field-label">
              Título SEO (portada)
            </label>
            <input
              id="homeSeoTitle"
              name="homeSeoTitle"
              required
              defaultValue={settings.homeSeoTitle}
              className="field-input"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="homeSeoDescription" className="field-label">
              Metadescripción (portada)
            </label>
            <textarea
              id="homeSeoDescription"
              name="homeSeoDescription"
              required
              rows={2}
              defaultValue={settings.homeSeoDescription}
              className="field-input resize-y"
            />
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <SubmitButton>
            <Save className="h-4 w-4" />
            Guardar textos
          </SubmitButton>
        </div>
      </form>

      <section className="rounded-[24px] border border-line bg-white p-5 sm:p-6">
        <div>
          <h2 className="font-display text-[19px] font-extrabold tracking-[-0.03em] text-ink">
            Preguntas frecuentes generales
          </h2>
          <p className="mt-1 text-[11.5px] leading-5 text-muted">
            Se muestran en la página de servicios y en el buscador. Las preguntas de cada
            ficha se editan dentro de cada servicio.
          </p>
        </div>

        <div className="mt-5 space-y-3">
          {faqs.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-line bg-[#f9fcff] p-5 text-[12px] text-body">
              Todavía no hay preguntas generales.
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
                  <input type="hidden" name="redirectTo" value="/admin/sitio" />
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
                  <input type="hidden" name="redirectTo" value="/admin/sitio" />
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
            Agregar pregunta general
          </summary>
          <form action={createFaq} className="mt-4 space-y-3">
            <input type="hidden" name="redirectTo" value="/admin/sitio" />
            <div>
              <label className="field-label">Pregunta</label>
              <input
                name="question"
                required
                maxLength={300}
                placeholder="¿Trabajan en todo el país?"
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
    </div>
  );
}
