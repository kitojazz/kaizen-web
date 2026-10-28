import type { Metadata } from "next";
import Blog from "@/components/Blog";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ArrowRight } from "@/components/icons";
import { getContent, getPublishedPosts } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog | Kaizen alimentos",
  description:
    "Notas sobre habilitaciones, rotulado, importaciones, calidad e inocuidad para la industria alimentaria.",
};

export default async function BlogIndexPage() {
  const content = await getContent();
  const posts = getPublishedPosts(content.posts);

  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" tabIndex={-1} className="outline-none">
        <section className="border-b border-line bg-[linear-gradient(180deg,#f4f8fd,#eaf3fc)] pb-12 pt-12 sm:pb-14 sm:pt-16">
          <div className="shell">
            <div className="eyebrow">Blog &amp; preguntas frecuentes</div>
            <h1 className="mt-4 max-w-[720px] font-display text-[clamp(42px,6vw,70px)] font-extrabold leading-[0.98] tracking-[-0.05em] text-ink">
              Notas para empezar por lo importante.
            </h1>
            <p className="mt-5 max-w-[620px] text-[15.5px] leading-7 text-body">
              Información útil para resolver dudas reales sobre habilitaciones,
              rotulado, importaciones y controles.
            </p>
          </div>
        </section>

        <section className="pb-16 pt-10 sm:pb-20 lg:pb-24">
          <div className="shell">
            <Blog posts={posts} limit={1000} showAllLink={false} />
          </div>
        </section>

        <section className="border-t border-line bg-white py-14">
          <div className="shell flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-[9.5px] font-extrabold uppercase tracking-[0.16em] text-blue-text">
                ¿Tiene una consulta puntual?
              </p>
              <h2 className="mt-2 font-display text-[clamp(26px,3vw,36px)] font-extrabold tracking-[-0.04em] text-ink">
                La revisamos con usted.
              </h2>
            </div>
            <a href="/#contacto" className="btn btn-primary">
              Hablar con Kaizen
              <ArrowRight className="h-[18px] w-[18px]" />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
