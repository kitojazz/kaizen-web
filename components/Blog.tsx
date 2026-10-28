import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/types";
import { formatDateLong } from "@/lib/utils";
import { ArrowRight } from "./icons";

export default function Blog({
  posts,
  limit = 6,
  showAllLink = true,
}: {
  posts: BlogPost[];
  limit?: number;
  showAllLink?: boolean;
}) {
  const visible = posts.slice(0, limit);

  if (visible.length === 0) {
    return (
      <div className="mt-9 rounded-[24px] border border-dashed border-line bg-white p-8 text-center text-[13px] text-body">
        Todavía no hay artículos publicados.
      </div>
    );
  }

  return (
    <>
      <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((post) => (
          <article
            key={post.id}
            className="card-hover group flex flex-col overflow-hidden rounded-[22px] border border-line bg-white"
          >
            <Link
              href={`/blog/${post.slug}`}
              className="flex h-full flex-col focus-visible:outline-none"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-[#dce9f7]">
                <Image
                  src={post.coverImage}
                  alt={post.coverAlt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                />
                <div className="post-photo-overlay absolute inset-0" />
                <span className="absolute left-4 top-4 rounded-full bg-white/95 px-2.5 py-1 text-[8.5px] font-extrabold uppercase tracking-[0.12em] text-[#526176] shadow-sm backdrop-blur-md">
                  {post.tag}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-muted">
                  {formatDateLong(post.publishedAt)}
                </p>
                <h3 className="mt-2 font-display text-[19px] font-extrabold leading-[1.2] tracking-[-0.03em] text-ink">
                  {post.title}
                </h3>
                <p className="mt-2 flex-1 text-[12.5px] leading-6 text-body">
                  {post.excerpt}
                </p>
                <span className="mt-5 inline-flex w-fit items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.06em] text-blue-text transition group-hover:gap-2.5">
                  Leer nota
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </article>
        ))}
      </div>

      {showAllLink && posts.length > 0 ? (
        <div className="mt-6 flex justify-center">
          <Link href="/blog" className="btn btn-dark btn-sm">
            Ver todos los artículos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : null}
    </>
  );
}
