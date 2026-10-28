import type { ReactNode } from "react";

export default function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 border-b border-line pb-6 sm:flex-row sm:items-end">
      <div>
        {eyebrow ? (
          <p className="text-[9.5px] font-extrabold uppercase tracking-[0.17em] text-blue-text">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-1.5 font-display text-[clamp(28px,3.4vw,38px)] font-extrabold leading-[1.05] tracking-[-0.04em] text-ink">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-[680px] text-[13px] leading-6 text-body">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
