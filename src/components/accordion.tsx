"use client";

import { RichText } from "@/components/rich-text";
import { plainText } from "@/lib/rich-text";
import { useState } from "react";

export type AccordionItem = { title: string; content: React.ReactNode };

export function Accordion({ items, defaultOpen = 0 }: { items: AccordionItem[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);

  return (
    <div className="divide-y divide-slate-200 overflow-hidden rounded-3xl border border-slate-200 bg-white">
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div key={item.title}>
            <div className="flex items-center gap-4 px-6 py-5">
              <span className="min-w-0 flex-1 font-bold text-cpe-navy"><RichText value={item.title} /></span>
              <button
              type="button"
              aria-label={`${isOpen ? "Cerrar" : "Abrir"}: ${plainText(item.title)}`}
              onClick={() => setOpen(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full transition hover:bg-cpe-bg/60"
            >
              <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full bg-cpe-bg text-cpe-coral transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} aria-hidden>
                +
              </span>
              </button>
            </div>
            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden">
                <div className="px-6 pb-6 text-sm leading-6 text-slate-600">{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
