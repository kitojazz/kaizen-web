import Image from "next/image";
import type { Brand } from "@/lib/types";

export default function TrustBand({
  brands,
  title = "Empresas que han confiado en Kaizen",
}: {
  brands: Brand[];
  title?: string;
}) {
  if (brands.length === 0) return null;

  return (
    <section
      aria-label={title}
      className="overflow-hidden border-y border-line bg-white py-9 sm:py-10"
    >
      <div className="shell">
        <div className="trust-carousel">
          <h2 className="text-center font-display text-[18px] font-bold leading-tight tracking-[-0.02em] text-ink sm:text-[20px]">
            {title}
          </h2>
          <div className="trust-marquee">
            <div className="trust-track">
              <div className="trust-group">
                {brands.map((brand) => (
                  <div key={brand.id} className="trust-logo">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      sizes="162px"
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
              <div className="trust-group" aria-hidden="true">
                {brands.map((brand) => (
                  <div key={brand.id} className="trust-logo">
                    <Image
                      src={brand.logo}
                      alt=""
                      fill
                      sizes="162px"
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
