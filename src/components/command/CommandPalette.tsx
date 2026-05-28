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
        className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-graphite bg-slate/50 px-3 text-xs font-medium text-silver transition-colors hover:border-silver/30 hover:bg-slate hover:text-paper"
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
            className="fixed inset-0 z-40 cursor-default bg-void/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            type="button"
          />
          <div className="fixed inset-x-4 top-20 z-50 overflow-hidden rounded-2xl border border-graphite bg-obsidian/95 text-paper shadow-[0_25px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-14 sm:w-[28rem]">
            {/* Top glow line */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
            
            <div className="flex items-center gap-3 border-b border-graphite px-4 py-4">
              <Search className="size-4 text-dim" aria-hidden="true" />
              <input
                aria-label="Rechercher une action Vellum"
                className="min-w-0 flex-1 bg-transparent text-sm text-paper outline-none placeholder:text-dim"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Projet, devis, utilisateur..."
                ref={inputRef}
                value={query}
              />
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {actions.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-dim">
                  Aucun raccourci ne correspond à cette recherche.
                </div>
              ) : (
                actions.map((action) => (
                  <a
                    className="flex items-center justify-between gap-3 rounded-xl px-3 py-3 text-sm transition-colors hover:bg-slate/50"
                    href={action.href}
                    key={`${action.href}-${action.label}`}
                    onClick={() => setOpen(false)}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-graphite bg-slate/50 text-gold">
                        <Sparkles className="size-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-paper">
                          {action.label}
                        </span>
                        <span className="text-xs text-dim">{action.hint}</span>
                      </span>
                    </span>
                    <span className="caption text-gold shrink-0">ouvrir</span>
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
