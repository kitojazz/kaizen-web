import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Blog from "@/components/Blog";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ArrowRight, WhatsApp } from "@/components/icons";
import { getContent, getPublishedPosts } from "@/lib/content";
import { formatDateLong, paragraphs } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getPost(slug: string) {
  const content = await getContent();
  return content.posts.find((post) => post.slug === slug && post.published) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: "Nota no encontrada | Kaizen" };
  return {
    title: `${post.title} | Kaizen`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      images: [{ url: post.coverImage, alt: post.coverAlt }],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  const content = await getContent();
  const related = getPublishedPosts(content.posts)
    .filter((item) => item.id !== post.id)
    .slice(0, 3);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { "@type": "Organization", name: "Kaizen" },
    publisher: { "@type": "Organization", name: "Kaizen" },
  };

  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" tabIndex={-1} className="outline-none">
        <article>
          <header className="border-b border-line bg-[linear-gradient(180deg,#f4f8fd,#eaf3fc)] pb-12 pt-10 sm:pb-14 sm:pt-14">
            <div className="shell max-w-[1000px]">
              <nav aria-label="Migas de pan" className="mb-5">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.1em] text-muted transition hover:text-blue-text"
                >
                  Blog
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </nav>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-line bg-white px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-blue-text">
                  {post.tag}
                </span>
                <span className="text-[10.5px] font-semibold text-muted">
                  {formatDateLong(post.publishedAt)}
                </span>
              </div>
              <h1 className="mt-5 max-w-[880px] font-display text-[clamp(38px,5.4vw,64px)] font-extrabold leading-[1.01] tracking-[-0.05em] text-ink">
                {post.title}
              </h1>
              <p className="mt-5 max-w-[720px] text-[16px] leading-7 text-body">
                {post.excerpt}
              </p>
            </div>
          </header>

          <div className="shell max-w-[1000px] py-8 sm:py-10">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[26px] border border-line bg-[#dce9f7] shadow-[0_34px_80px_-64px_rgba(12,20,34,.55)]">
              <Image
                src={post.coverImage}
                alt={post.coverAlt}
                fill
                priority
                sizes="(min-width: 1000px) 940px, 100vw"
                className="object-cover"
              />
            </div>

            <div className="mx-auto mt-9 max-w-[720px]">
              <div className="space-y-5">
                {paragraphs(post.content).map((paragraph, index) => (
                  <p
                    key={`${post.id}-${index}`}
                    className="whitespace-pre-line text-[15.5px] leading-[1.8] text-body"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-10 rounded-[26px] border border-line bg-white p-6 shadow-card sm:p-8">
                <p className="text-[9.5px] font-extrabold uppercase tracking-[0.16em] text-blue-text">
                  ¿Quiere revisar su caso?
                </p>
                <h2 className="mt-2 font-display text-[clamp(24px,3vw,32px)] font-extrabold leading-[1.1] tracking-[-0.04em] text-ink">
                  Lo vemos con criterio técnico.
                </h2>
                <p className="mt-2 max-w-[540px] text-[13px] leading-6 text-body">
                  Cuéntenos en qué etapa está su producto o empresa y le
                  indicamos los próximos pasos.
                </p>
                <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                  <Link href="/#contacto" className="btn btn-primary btn-sm">
                    Enviar consulta
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href="https://wa.me/59899082776?text=Hola%2C%20quisiera%20consultar%20por%20los%20servicios%20de%20Kaizen."
                    target="_blank"
                    rel="noopener"
                    className="btn btn-dark btn-sm"
                  >
                    WhatsApp
                    <WhatsApp className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </article>

        {related.length > 0 ? (
          <section className="border-t border-line bg-white py-14 sm:py-16">
            <div className="shell">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="text-[9.5px] font-extrabold uppercase tracking-[0.16em] text-blue-text">
                    Seguir leyendo
                  </p>
                  <h2 className="mt-2 font-display text-[clamp(28px,3.4vw,40px)] font-extrabold tracking-[-0.045em] text-ink">
                    Más notas del blog
                  </h2>
                </div>
                <Link href="/blog" className="text-link">
                  Ver todas las notas
                  <ArrowRight />
                </Link>
              </div>
              <Blog posts={related} showAllLink={false} />
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
