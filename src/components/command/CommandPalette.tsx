"use client";

import { Command, Search, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { commandActions } from "@/lib/workflow";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }

      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      window.setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [open]);

  const actions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return commandActions;

    return commandActions.filter((action) =>
      `${action.label} ${action.hint}`.toLowerCase().includes(normalized),
    );
  }, [query]);

  return (
    <div className="relative">
      <button
        aria-label="Ouvrir la palette de commandes"
        aria-expanded={open}
        className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-paper/15 bg-paper/5 px-3 text-[12px] font-medium text-paper transition hover:bg-paper/10"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <Command className="size-4" aria-hidden="true" />
        <span className="hidden sm:inline">Ctrl K</span>
      </button>

      {open ? (
        <>
          <button
            aria-label="Fermer la palette"
            className="fixed inset-0 z-40 cursor-default bg-transparent"
            onClick={() => setOpen(false)}
            type="button"
          />
          <div className="fixed inset-x-4 top-16 z-50 overflow-hidden rounded-[4px] border border-line-strong bg-paper text-ink shadow-[0_30px_90px_rgba(13,13,12,0.22)] sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 sm:w-[26rem]">
            <div className="flex items-center gap-3 border-b border-line px-4 py-3">
              <Search className="size-4 text-mute" aria-hidden="true" />
              <input
                aria-label="Rechercher une action Vellum"
                className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-soft"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Projet, devis, utilisateur..."
                ref={inputRef}
                value={query}
              />
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {actions.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-mute">
                  Aucun raccourci ne correspond à cette recherche.
                </div>
              ) : (
                actions.map((action) => (
                  <a
                    className="flex items-center justify-between gap-3 rounded-[3px] px-3 py-3 text-sm transition hover:bg-vellum/70"
                    href={action.href}
                    key={`${action.href}-${action.label}`}
                    onClick={() => setOpen(false)}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-line bg-vellum/70 text-graphite">
                        <Sparkles className="size-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-medium">
                          {action.label}
                        </span>
                        <span className="text-xs text-mute">{action.hint}</span>
                      </span>
                    </span>
                    <span className="caption shrink-0">ouvrir</span>
                  </a>
                ))
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
