"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { TeamMember } from "@/lib/types";
import { LinkedIn } from "./icons";

export default function TeamCards({ team }: { team: TeamMember[] }) {
  const [activeMember, setActiveMember] = useState(0);
  const cardsRef = useRef<HTMLDivElement>(null);

  if (team.length === 0) return null;

  const memberStep = () => {
    const card = cardsRef.current?.querySelector<HTMLElement>("[data-team-card]");
    return card ? card.offsetWidth + 12 : 1;
  };

  const handleCardsScroll = () => {
    const scroller = cardsRef.current;
    if (!scroller) return;
    setActiveMember(Math.max(0, Math.round(scroller.scrollLeft / memberStep())));
  };

  const goToMember = (index: number) => {
    cardsRef.current?.scrollTo({
      left: index * memberStep(),
      behavior: "smooth",
    });
  };

  const activeMemberIndex = Math.min(activeMember, team.length - 1);

  return (
    <>
      <div
        ref={cardsRef}
        onScroll={handleCardsScroll}
        role="group"
        aria-label="Integrantes del equipo"
        className="mobile-carousel mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 scroll-smooth sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-4"
      >
        {team.map((member) => (
          <article
            key={member.id}
            data-team-card
            className="navy-surface navy-card group flex h-full w-[82%] max-w-[340px] shrink-0 snap-start flex-col sm:w-auto sm:max-w-none"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-navy-deep">
              <Image
                src={member.photo}
                alt={member.name}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover object-[50%_30%] transition duration-700 ease-out group-hover:scale-[1.04]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07101a]/55 via-transparent to-transparent" />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="font-display text-[18px] font-extrabold leading-[1.2] tracking-[-0.03em] text-white">
                {member.name}
              </h3>
              <p className="mt-1.5 text-[12px] font-semibold leading-5 text-hero-muted">
                {member.role}
              </p>
              <p className="team-card-copy mt-2.5 text-[11.5px] leading-[1.55] text-hero-muted/80">
                {member.description}
              </p>
              {member.linkedin ? (
                <div className="mt-auto pt-4">
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-celeste transition duration-300 hover:gap-2.5 hover:text-white"
                  >
                    <LinkedIn className="h-4 w-4" />
                    LinkedIn
                  </a>
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </div>

      {team.length > 1 && (
        <div className="mt-3 flex justify-center gap-2 sm:hidden" aria-label="Indicadores del equipo">
          {team.map((member, index) => (
            <button
              key={member.id}
              type="button"
              aria-label={`Ir a ${member.name}`}
              aria-current={activeMemberIndex === index}
              onClick={() => goToMember(index)}
              className={`h-2 rounded-full transition-all ${
                activeMemberIndex === index ? "w-6 bg-blue" : "w-2 bg-[#b9c8da]"
              }`}
            />
          ))}
        </div>
      )}
    </>
  );
}
