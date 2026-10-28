import { updateHero } from "@/app/admin/actions";
import AdminNotice from "@/components/admin/AdminNotice";
import ImageField from "@/components/admin/ImageField";
import PageHeader from "@/components/admin/PageHeader";
import SubmitButton from "@/components/admin/SubmitButton";
import { Save } from "@/components/icons";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminHeroPage({
  searchParams,
}: {
  searchParams?: { notice?: string; message?: string };
}) {
  const content = await getContent();
  const { hero } = content;
  const supports = Array.from({ length: 3 }, (_, index) => hero.supportImages[index]);

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Contenido"
        title="Hero principal"
        description="Cambiá la imagen de fondo de la primera sección y las imágenes de apoyo que acompañan el mensaje principal."
      />

      <AdminNotice notice={searchParams?.notice} message={searchParams?.message} />

      <form
        action={updateHero}
        className="rounded-[24px] border border-line bg-white p-5 sm:p-6"
      >
        <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
          <div>
            <ImageField
              name="backgroundImage"
              label="Imagen de fondo del hero"
              current={hero.backgroundImage}
              required
              aspect="aspect-[16/9]"
              help="Recomendado: 2200 × 1240 px o superior, horizontal. Se convierte a WebP automáticamente."
            />
            <div className="mt-4">
              <label htmlFor="backgroundAlt" className="field-label">
                Texto alternativo
              </label>
              <input
                id="backgroundAlt"
                name="backgroundAlt"
                maxLength={220}
                defaultValue={hero.backgroundAlt}
                placeholder="Descripción de la imagen para accesibilidad"
                className="field-input"
              />
              <p className="mt-1.5 text-[10.5px] leading-4 text-muted">
                Describí lo que se ve en la imagen, no el mensaje comercial.
              </p>
            </div>
          </div>

          <aside className="rounded-2xl border border-line bg-[#f8fbfe] p-4">
            <h2 className="text-[12px] font-extrabold uppercase tracking-[0.1em] text-ink">
              Cómo se ve
            </h2>
            <ul className="mt-3 space-y-2.5 text-[11px] leading-5 text-body">
              <li>La imagen ocupa todo el panel principal con un overlay oscuro.</li>
              <li>El texto y los botones se muestran sobre la zona izquierda.</li>
              <li>Evitá poner detalles importantes en el extremo izquierdo.</li>
              <li>Las imágenes de apoyo se muestran debajo del mensaje principal.</li>
            </ul>
          </aside>
        </div>

        <div className="mt-8 border-t border-line pt-6">
          <div>
            <h2 className="font-display text-[19px] font-extrabold tracking-[-0.03em] text-ink">
              Imágenes de apoyo
            </h2>
            <p className="mt-1 text-[11.5px] leading-5 text-muted">
              Hasta tres imágenes para el grupo visual del hero. Podés reemplazarlas o quitarlas.
            </p>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {supports.map((support, index) => (
              <div key={index} className="rounded-2xl border border-line bg-[#f9fcff] p-3.5">
                <ImageField
                  name={`supportImage${index}`}
                  label={`Imagen ${index + 1}`}
                  current={support?.image ?? ""}
                  allowRemove
                  aspect="aspect-[4/3]"
                  help="Recomendado: 1200 px de ancho."
                />
                <div className="mt-3">
                  <label htmlFor={`supportAlt${index}`} className="field-label">
                    Texto alternativo
                  </label>
                  <input
                    id={`supportAlt${index}`}
                    name={`supportAlt${index}`}
                    maxLength={200}
                    defaultValue={support?.alt ?? ""}
                    placeholder="Descripción de la imagen"
                    className="field-input"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <SubmitButton>
            <Save className="h-4 w-4" />
            Guardar hero
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
