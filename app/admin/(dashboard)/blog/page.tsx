import Image from "next/image";
import Link from "next/link";
import {
  createPost,
  deletePost,
  updatePost,
} from "@/app/admin/actions";
import AdminNotice from "@/components/admin/AdminNotice";
import DeleteButton from "@/components/admin/DeleteButton";
import ImageField from "@/components/admin/ImageField";
import PageHeader from "@/components/admin/PageHeader";
import SubmitButton from "@/components/admin/SubmitButton";
import { ExternalLink, Plus, Save } from "@/components/icons";
import { getContent, sortPosts } from "@/lib/content";
import { formatDateLong, toDatetimeLocal } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams?: { notice?: string; message?: string };
}) {
  const content = await getContent();
  const posts = sortPosts(content.posts);
  const now = toDatetimeLocal(new Date().toISOString());

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Contenido"
        title="Blog"
        description="Creá y editá artículos con portada propia. Lo que publiques se refleja automáticamente en el sitio y en la página de cada nota."
      />

      <AdminNotice notice={searchParams?.notice} message={searchParams?.message} />

      <details className="group rounded-[24px] border border-line bg-white">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6 [&::-webkit-details-marker]:hidden">
          <div>
            <h2 className="font-display text-[18px] font-extrabold tracking-[-0.03em] text-ink">
              Nuevo artículo
            </h2>
            <p className="mt-1 text-[11.5px] text-muted">
              Título, categoría, bajada, contenido y portada.
            </p>
          </div>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-mist text-blue transition group-open:rotate-45">
            <Plus className="h-5 w-5" />
          </span>
        </summary>

        <form action={createPost} className="border-t border-line p-5 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
            <div>
              <ImageField
                name="coverImage"
                label="Imagen de portada"
                required
                aspect="aspect-[16/9]"
                help="Recomendado: 1600 × 900 px. Se optimiza a WebP."
              />
              <div className="mt-4">
                <label htmlFor="coverAlt" className="field-label">
                  Texto alternativo de la portada
                </label>
                <input
                  id="coverAlt"
                  name="coverAlt"
                  maxLength={220}
                  placeholder="Ej. Fachada de un local de Starbucks"
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
                  maxLength={180}
                  placeholder="Título del artículo"
                  className="field-input"
                />
              </div>
              <div>
                <label htmlFor="tag" className="field-label">
                  Categoría <span className="text-blue-text">*</span>
                </label>
                <input
                  id="tag"
                  name="tag"
                  required
                  maxLength={80}
                  placeholder="Ej. Rotulado"
                  className="field-input"
                />
              </div>
              <div>
                <label htmlFor="slug" className="field-label">
                  URL amigable
                </label>
                <input
                  id="slug"
                  name="slug"
                  maxLength={120}
                  placeholder="Se genera desde el título"
                  className="field-input"
                />
              </div>
              <div>
                <label htmlFor="publishedAt" className="field-label">
                  Fecha de publicación
                </label>
                <input
                  id="publishedAt"
                  name="publishedAt"
                  type="datetime-local"
                  defaultValue={now}
                  className="field-input"
                />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex cursor-pointer items-center gap-2.5 text-[12px] font-semibold text-ink">
                  <input
                    type="checkbox"
                    name="published"
                    defaultChecked
                    className="h-4 w-4 rounded border-line accent-[#0875e9]"
                  />
                  Publicar en el sitio
                </label>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="excerpt" className="field-label">
                  Bajada / descripción corta <span className="text-blue-text">*</span>
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  required
                  rows={2}
                  maxLength={500}
                  placeholder="Resumen que se muestra en la tarjeta del blog."
                  className="field-input resize-y"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="content" className="field-label">
                  Contenido completo <span className="text-blue-text">*</span>
                </label>
                <textarea
                  id="content"
                  name="content"
                  required
                  rows={11}
                  placeholder="Escribí el artículo. Separá los párrafos con una línea en blanco."
                  className="field-input resize-y"
                />
                <p className="mt-1.5 text-[10.5px] leading-4 text-muted">
                  Formato limpio: cada bloque separado por una línea en blanco se muestra como párrafo.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <SubmitButton pendingText="Creando...">
              <Plus className="h-4 w-4" />
              Crear artículo
            </SubmitButton>
          </div>
        </form>
      </details>

      <div className="space-y-3">
        {posts.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-line bg-white p-8 text-center text-[12.5px] text-body">
            Todavía no hay artículos.
          </div>
        ) : (
          posts.map((post) => (
            <article
              key={post.id}
              className="rounded-[24px] border border-line bg-white p-4 sm:p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden rounded-2xl bg-[#e8f1fa] sm:w-[190px]">
                  <Image
                    src={post.coverImage}
                    alt=""
                    fill
                    sizes="190px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-mist px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.1em] text-blue-text">
                      {post.tag}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.1em] ${
                        post.published
                          ? "bg-[#eaf8ef] text-[#166534]"
                          : "bg-[#f1f4f8] text-[#64748b]"
                      }`}
                    >
                      {post.published ? "Publicado" : "Borrador"}
                    </span>
                    <span className="text-[9.5px] text-muted">
                      {formatDateLong(post.publishedAt)}
                    </span>
                  </div>
                  <h2 className="mt-2 font-display text-[20px] font-extrabold leading-[1.2] tracking-[-0.03em] text-ink">
                    {post.title}
                  </h2>
                  <p className="mt-1.5 text-[12px] leading-5 text-body">
                    {post.excerpt}
                  </p>
                  <p className="mt-2 truncate text-[10px] text-muted">
                    /blog/{post.slug}
                  </p>
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  className="inline-flex w-fit items-center gap-1.5 rounded-full border border-line px-3 py-2 text-[10px] font-bold text-body transition hover:border-[#bdd4ea] hover:text-blue-text"
                >
                  Ver nota
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>

              <details className="mt-4 border-t border-line pt-4">
                <summary className="flex w-fit cursor-pointer list-none items-center gap-2 rounded-full border border-line bg-[#f9fcff] px-3.5 py-2 text-[10.5px] font-bold text-ink transition hover:border-[#bdd4ea] hover:bg-white [&::-webkit-details-marker]:hidden">
                  Editar artículo
                </summary>

                <form action={updatePost} className="mt-4">
                  <input type="hidden" name="id" value={post.id} />
                  <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
                    <div>
                      <ImageField
                        name="coverImage"
                        label="Imagen de portada"
                        current={post.coverImage}
                        aspect="aspect-[16/9]"
                      />
                      <div className="mt-4">
                        <label
                          htmlFor={`coverAlt-${post.id}`}
                          className="field-label"
                        >
                          Texto alternativo
                        </label>
                        <input
                          id={`coverAlt-${post.id}`}
                          name="coverAlt"
                          maxLength={220}
                          defaultValue={post.coverAlt}
                          className="field-input"
                        />
                      </div>
                    </div>

                    <div className="grid content-start gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label
                          htmlFor={`title-${post.id}`}
                          className="field-label"
                        >
                          Título
                        </label>
                        <input
                          id={`title-${post.id}`}
                          name="title"
                          required
                          maxLength={180}
                          defaultValue={post.title}
                          className="field-input"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`tag-${post.id}`}
                          className="field-label"
                        >
                          Categoría
                        </label>
                        <input
                          id={`tag-${post.id}`}
                          name="tag"
                          required
                          maxLength={80}
                          defaultValue={post.tag}
                          className="field-input"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`slug-${post.id}`}
                          className="field-label"
                        >
                          URL amigable
                        </label>
                        <input
                          id={`slug-${post.id}`}
                          name="slug"
                          maxLength={120}
                          defaultValue={post.slug}
                          className="field-input"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`publishedAt-${post.id}`}
                          className="field-label"
                        >
                          Fecha de publicación
                        </label>
                        <input
                          id={`publishedAt-${post.id}`}
                          name="publishedAt"
                          type="datetime-local"
                          defaultValue={toDatetimeLocal(post.publishedAt)}
                          className="field-input"
                        />
                      </div>
                      <div className="flex items-end pb-2">
                        <label className="flex cursor-pointer items-center gap-2.5 text-[12px] font-semibold text-ink">
                          <input
                            type="checkbox"
                            name="published"
                            defaultChecked={post.published}
                            className="h-4 w-4 rounded border-line accent-[#0875e9]"
                          />
                          Publicar en el sitio
                        </label>
                      </div>
                      <div className="sm:col-span-2">
                        <label
                          htmlFor={`excerpt-${post.id}`}
                          className="field-label"
                        >
                          Bajada / descripción corta
                        </label>
                        <textarea
                          id={`excerpt-${post.id}`}
                          name="excerpt"
                          required
                          rows={2}
                          maxLength={500}
                          defaultValue={post.excerpt}
                          className="field-input resize-y"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label
                          htmlFor={`content-${post.id}`}
                          className="field-label"
                        >
                          Contenido completo
                        </label>
                        <textarea
                          id={`content-${post.id}`}
                          name="content"
                          required
                          rows={11}
                          defaultValue={post.content}
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

                <form action={deletePost} className="mt-3 border-t border-line pt-3">
                  <input type="hidden" name="id" value={post.id} />
                  <DeleteButton
                    label="Eliminar artículo"
                    message={`¿Eliminar “${post.title}”? Esta acción no se puede deshacer.`}
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
