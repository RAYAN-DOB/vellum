import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
  tone?: "light" | "dark";
};

export function SectionTitle({
  eyebrow,
  title,
  description,
  actions,
  className,
  tone = "light",
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="max-w-2xl">
        {eyebrow ? (
          <p
            className={cn(
              "text-xs font-semibold uppercase tracking-[0.18em]",
              tone === "dark" ? "text-[#d7c6a4]" : "text-[#8a7a5f]",
            )}
          >
            {eyebrow}
          </p>
        ) : null}
        <h2
          className={cn(
            "mt-2 text-2xl font-semibold tracking-normal sm:text-3xl",
            tone === "dark" ? "text-[#f8f4ea]" : "text-[#171613]",
          )}
        >
          {title}
        </h2>
        {description ? (
          <p
            className={cn(
              "mt-3 text-base leading-7",
              tone === "dark" ? "text-[#bdb4a4]" : "text-[#6b665a]",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}
