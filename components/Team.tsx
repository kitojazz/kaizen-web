import Image from "next/image";
import { LinkedIn } from "@/components/icons";
import type { TeamMember } from "@/lib/types";

export default function Team({ members }: { members: TeamMember[] }) {
  return (
    <div
      className="relative flex min-h-[370px] flex-col overflow-hidden rounded-[28px] border border-[#d8e7f6] bg-[linear-gradient(145deg,#eef6ff_0%,#fbfdff_58%,#eaf3ff_100%)] p-6 shadow-[0_30px_70px_-66px_rgba(12,20,34,.55)] sm:p-7"
      role="group"
      aria-label="Equipo de Kaizen"
    >
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle,rgba(8,117,233,.16),transparent_68%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-5 right-6 h-[120px] w-[120px] bg-[url('/images/kaizen-symbol.png')] bg-contain bg-center bg-no-repeat opacity-[0.07]"
        aria-hidden="true"
      />

      <div className="relative z-10">
        <p className="text-[9.5px] font-extrabold uppercase tracking-[0.15em] text-deep">
          Un equipo que conoce su producto
        </p>
        <p className="mt-3 max-w-[380px] font-display text-[clamp(23px,2.6vw,30px)] font-extrabold leading-[1.16] tracking-[-0.035em] text-ink">
          Ingeniería, calidad e inocuidad en una misma mesa.
        </p>
      </div>

      <div className="relative z-10 mt-6 space-y-2.5">
        {members.map((member) => (
          <article
            key={member.id}
            className="flex items-start gap-3 rounded-2xl border border-white/80 bg-white/75 p-2.5 backdrop-blur-sm sm:p-3"
          >
            <div className="relative h-[62px] w-[50px] shrink-0 overflow-hidden rounded-xl bg-[#dce9f7]">
              <Image
                src={member.photo}
                alt={`${member.name}, ${member.role}`}
                fill
                sizes="50px"
                className="object-cover object-[50%_30%]"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-[12.5px] font-extrabold text-ink">{member.name}</p>
                {member.linkedin ? (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`LinkedIn de ${member.name}`}
                    className="text-blue-text transition hover:text-blue"
                  >
                    <LinkedIn className="h-3.5 w-3.5" fill="currentColor" strokeWidth={0} />
                  </a>
                ) : null}
              </div>
              <p className="text-[9.5px] font-bold uppercase tracking-[0.05em] text-blue-text">
                {member.role}
              </p>
              <p className="mt-1 line-clamp-2 text-[10.5px] leading-4 text-body">
                {member.description}
              </p>
            </div>
          </article>
        ))}
      </div>

      <p className="relative z-10 mt-4 text-[10.5px] text-muted">
        Kaizen · Montevideo, Uruguay
      </p>
    </div>
  );
}
