"use client";

import { Command, Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { commandActions } from "@/lib/workflow";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const actions = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return commandActions;
    }

    return commandActions.filter((action) =>
      `${action.label} ${action.hint}`.toLowerCase().includes(normalized),
    );
  }, [query]);

  return (
    <div className="relative">
      <button
        aria-expanded={open}
        className="inline-flex h-10 items-center gap-2 rounded-full border border-[#d8d0bf] bg-[#fbfaf6]/80 px-3 text-sm font-medium text-[#5e594d] shadow-sm transition hover:bg-white hover:text-[#171613]"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <Command className="size-4" aria-hidden="true" />
        <span className="hidden sm:inline">Ctrl K</span>
      </button>

      {open ? (
        <div className="absolute right-0 top-12 z-40 w-[min(23rem,calc(100vw-2rem))] overflow-hidden rounded-[24px] border border-[#34312b] bg-[#10100e]/96 text-[#f7f3ea] shadow-[0_30px_100px_rgba(0,0,0,0.38)] backdrop-blur-xl">
          <div className="flex items-center gap-3 border-b border-[#f7f3ea]/10 px-4 py-3">
            <Search className="size-4 text-[#d7c6a4]" aria-hidden="true" />
            <input
              aria-label="Rechercher une action"
              className="min-w-0 flex-1 bg-transparent text-sm text-[#f7f3ea] outline-none placeholder:text-[#8f8777]"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Projet, devis, manager..."
              value={query}
            />
          </div>
          <div className="max-h-80 overflow-y-auto p-2">
            {actions.map((action) => (
              <a
                className="flex items-center justify-between gap-3 rounded-[18px] px-3 py-3 text-sm transition hover:bg-[#f7f3ea]/8"
                href={action.href}
                key={action.href}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f7f3ea]/10 text-[#d7c6a4]">
                    <Sparkles className="size-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{action.label}</span>
                    <span className="text-xs text-[#9d9485]">{action.hint}</span>
                  </span>
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#7d7465]">
                  ouvrir
                </span>
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
