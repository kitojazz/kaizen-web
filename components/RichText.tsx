import type { ReactNode } from "react";

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("**")) {
      nodes.push(
        <strong key={`${keyPrefix}-strong-${index}`} className="font-bold text-ink">
          {token.slice(2, -2)}
        </strong>,
      );
    } else {
      const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
      if (link) {
        const external = /^https?:\/\//.test(link[2]);
        nodes.push(
          <a
            key={`${keyPrefix}-link-${index}`}
            href={link[2]}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener" : undefined}
            className="font-semibold text-blue-text underline underline-offset-4"
          >
            {link[1]}
          </a>,
        );
      } else {
        nodes.push(token);
      }
    }
    lastIndex = pattern.lastIndex;
    index += 1;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

export default function RichText({
  content,
  className = "space-y-5",
}: {
  content: string;
  className?: string;
}) {
  const blocks = content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className={className}>
      {blocks.map((block, blockIndex) => {
        const key = `block-${blockIndex}`;
        const lines = block.split("\n").map((line) => line.trim());

        if (lines.length > 0 && lines.every((line) => line.startsWith("- "))) {
          return (
            <ul key={key} className="list-disc space-y-2 pl-5 text-[15px] leading-[1.75] text-body">
              {lines.map((line, lineIndex) => (
                <li key={`${key}-${lineIndex}`}>
                  {renderInline(line.slice(2), `${key}-${lineIndex}`)}
                </li>
              ))}
            </ul>
          );
        }

        if (lines.length > 0 && lines.every((line) => /^\d+\.\s/.test(line))) {
          return (
            <ol
              key={key}
              className="list-decimal space-y-2 pl-5 text-[15px] leading-[1.75] text-body"
            >
              {lines.map((line, lineIndex) => (
                <li key={`${key}-${lineIndex}`}>
                  {renderInline(line.replace(/^\d+\.\s/, ""), `${key}-${lineIndex}`)}
                </li>
              ))}
            </ol>
          );
        }

        if (block.startsWith("### ")) {
          return (
            <h4
              key={key}
              className="pt-2 font-display text-[19px] font-extrabold tracking-[-0.03em] text-ink"
            >
              {renderInline(block.slice(4), key)}
            </h4>
          );
        }

        if (block.startsWith("## ")) {
          return (
            <h3
              key={key}
              className="pt-2 font-display text-[24px] font-extrabold tracking-[-0.035em] text-ink"
            >
              {renderInline(block.slice(3), key)}
            </h3>
          );
        }

        if (block.startsWith("> ")) {
          return (
            <blockquote
              key={key}
              className="border-l-2 border-blue/40 pl-4 text-[15px] italic leading-[1.75] text-body"
            >
              {renderInline(block.replace(/^>\s?/gm, ""), key)}
            </blockquote>
          );
        }

        return (
          <p key={key} className="text-[15px] leading-[1.8] text-body">
            {renderInline(block.replace(/\n/g, " "), key)}
          </p>
        );
      })}
    </div>
  );
}
