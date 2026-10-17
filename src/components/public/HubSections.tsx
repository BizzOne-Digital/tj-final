import type { HubBlock } from "@/lib/hub-sections";

function levelClass(level: number) {
  if (level === 2) return "font-display text-2xl font-bold uppercase text-ice-white";
  if (level === 3) return "font-display text-xl font-bold uppercase text-electric-blue";
  return "font-display text-base font-semibold uppercase text-ice-white";
}

function Block({ block, depth = 0 }: { block: HubBlock; depth?: number }) {
  const level = block.level ?? (depth === 0 ? 2 : 3);
  return (
    <section id={block.id} className="scroll-mt-28 border-b border-white/10 pb-8 last:border-0">
      <h2 className={`${levelClass(level)} ${depth > 0 ? "mt-6" : ""}`}>{block.title}</h2>
      {block.body ? <p className="mt-3 text-cool-grey">{block.body}</p> : null}
      {block.html ? (
        <div
          className="prose prose-invert mt-3 max-w-none text-cool-grey prose-a:text-electric-blue"
          dangerouslySetInnerHTML={{ __html: block.html }}
        />
      ) : null}
      {block.children?.map((child) => (
        <div key={child.id} className="mt-4 pl-0 sm:pl-4">
          <Block block={child} depth={depth + 1} />
        </div>
      ))}
    </section>
  );
}

export function HubSections({ blocks }: { blocks: HubBlock[] }) {
  return (
    <div className="min-w-0">
      <nav
        className="mb-10 flex max-w-full gap-2 overflow-x-auto pb-2 text-xs font-semibold uppercase tracking-wide"
        aria-label="On this page"
      >
        {blocks.map((b) => (
          <a
            key={b.id}
            href={`#${b.id}`}
            className="shrink-0 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-cool-grey transition hover:border-electric-blue/40 hover:text-ice-white"
          >
            {b.title.replace(/ Season$/, "")}
          </a>
        ))}
      </nav>
      <div className="space-y-2">
        {blocks.map((block) => (
          <Block key={block.id} block={block} />
        ))}
      </div>
    </div>
  );
}
