import { ExternalLink } from "lucide-react";
import type { Tool } from "@/lib/data";

type Props = {
  tool: Tool;
};

export default function ToolCard({ tool }: Props) {
  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className="
        block
        bg-black
        border border-zinc-800/60
        rounded-xl
        p-5
        transition-all duration-300
        hover:scale-[1.03]
        hover:shadow-[0_0_30px_rgba(249,115,22,0.1)]
        cursor-pointer
      "
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-white font-semibold text-base leading-snug">
          {tool.title}
        </h3>
        <ExternalLink
          size={14}
          className="text-zinc-600 shrink-0 mt-0.5"
        />
      </div>
      <p className="text-zinc-500 text-sm leading-relaxed mb-3">
        {tool.description}
      </p>
      <span className="inline-block text-[11px] px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400/80 lowercase tracking-wide">
        {tool.category}
      </span>
    </a>
  );
}
