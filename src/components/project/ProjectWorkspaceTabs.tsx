"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

export type WorkspaceTab = {
  id: string;
  label: string;
  icon?: ReactNode;
  content: ReactNode;
  badge?: number;
};

/**
 * Project workspace tabs — organises a project's sections (aperçu, fichiers,
 * messages, activité…) into a calm drafting tab strip. All panels stay mounted
 * and inactive ones are hidden, so live subscriptions (realtime chat) survive
 * tab switches. The active tab carries a sliding pine datum underline.
 */
export function ProjectWorkspaceTabs({
  tabs,
  defaultTab,
}: {
  tabs: WorkspaceTab[];
  defaultTab?: string;
}) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id);

  return (
    <div>
      <div
        role="tablist"
        aria-label="Sections du projet"
        className="flex flex-wrap gap-0.5 border-b border-line"
      >
        {tabs.map((tab) => {
          const on = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setActive(tab.id)}
              className={cn(
                "relative inline-flex cursor-pointer items-center gap-2 rounded-t-[3px] px-3.5 py-2.5 text-[13px] font-medium transition-colors",
                on ? "text-ink" : "text-mute hover:text-graphite",
              )}
            >
              {tab.icon ? (
                <span aria-hidden="true" className="inline-flex [&_svg]:size-4">
                  {tab.icon}
                </span>
              ) : null}
              {tab.label}
              {typeof tab.badge === "number" && tab.badge > 0 ? (
                <span className="ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-pine px-1 text-[10px] font-semibold text-paper">
                  {tab.badge}
                </span>
              ) : null}
              {on ? (
                reduce ? (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-px h-0.5 bg-pine"
                  />
                ) : (
                  <motion.span
                    layoutId="ws-tab-underline"
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-px h-0.5 bg-pine"
                    transition={{ type: "spring", stiffness: 320, damping: 30 }}
                  />
                )
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="pt-6">
        {tabs.map((tab) => {
          const on = tab.id === active;
          return (
            <motion.div
              key={tab.id}
              role="tabpanel"
              hidden={!on}
              initial={false}
              animate={reduce ? undefined : { opacity: on ? 1 : 0, y: on ? 0 : 6 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {tab.content}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
