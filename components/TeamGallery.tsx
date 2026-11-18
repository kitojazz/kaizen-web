"use client";

import Image from "next/image";
import { useState } from "react";
import type { TeamGalleryImage } from "@/lib/types";
import { Pause, Play } from "@/components/icons";

export default function TeamGallery({
  images,
  names,
}: {
  images: TeamGalleryImage[];
  names: string;
}) {
  const [paused, setPaused] = useState(false);
  const gallerySizes =
    "(min-width: 1280px) 190px, (min-width: 768px) 17vw, 150px";

  if (images.length === 0) return null;

  return (
    <div className="team-panel" role="group" aria-label="Equipo de Kaizen">
      <div className="relative z-[2] pr-[46px]">
        <div className="text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-celeste">
          Un equipo que conoce su producto
        </div>
        <p className="mt-3 max-w-[360px] font-display text-[clamp(22px,2.6vw,29px)] font-extrabold leading-[1.16] tracking-[-0.03em] text-white">
          Ingeniería, calidad e inocuidad en una misma mesa.
        </p>
        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          aria-pressed={paused}
          aria-controls="team-carousel"
          aria-label={paused ? "Reproducir carrusel de fotos" : "Pausar carrusel de fotos"}
          className="absolute -top-[3px] right-0 grid h-[34px] w-[34px] place-items-center rounded-full border border-white/15 bg-white/[0.08] text-celeste backdrop-blur-md transition hover:border-celeste/40 hover:bg-white/[0.14]"
        >
          {paused ? (
            <Play className="h-[15px] w-[15px]" />
          ) : (
            <Pause className="h-[15px] w-[15px]" />
          )}
        </button>
      </div>

      <div className={`team-gallery ${paused ? "is-paused" : ""}`}>
        <div
          id="team-carousel"
          className="team-viewport"
          role="group"
          aria-roledescription="carrusel"
          aria-label="Fotos del equipo de Kaizen"
        >
          <div className="team-track">
            <div className="team-set">
              {images.map((photo) => (
                <div key={photo.id} className="team-slide">
                  <Image
                    src={photo.image}
                    alt={photo.alt}
                    fill
                    sizes={gallerySizes}
                    quality={90}
                    loading="eager"
                  />
                </div>
              ))}
            </div>
            <div className="team-set" aria-hidden="true">
              {images.map((photo) => (
                <div key={photo.id} className="team-slide">
                  <Image
                    src={photo.image}
                    alt=""
                    fill
                    sizes={gallerySizes}
                    quality={90}
                    loading="eager"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-[1]">
        <p className="text-[13px] font-bold text-white">{names}</p>
        <p className="mt-[3px] text-[11px] text-navy-soft">
          Kaizen · Montevideo, Uruguay
        </p>
      </div>
    </div>
  );
}
