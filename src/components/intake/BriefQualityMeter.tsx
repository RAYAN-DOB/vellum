"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * BriefQualityMeter — a sober gauge that scores the client's brief live and
 * nudges them toward a precise request (fewer vague briefs → more reliable
 * quotes). Styled for the dark deposit aside (paper text on ink); pass a
 * className to place it.
 */
export function BriefQualityMeter({
  score,
  label,
  tips,
  className,
}: {
  score: number;
  label: string;
  tips: string[];
  className?: string;
}) {
  return (
    <div className={cn(className)}>
      <div className="flex items-baseline justify-between">
        <span className="caption text-paper/45">Qualité du brief</span>
        <span className="font-mono text-[12px] text-paper/85">
          {score}/100 · {label}
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-paper/10">
        <motion.div
          className="h-full rounded-full bg-[#2f7d56]"
          initial={false}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.5, ease: EASE }}
        />
      </div>
      {tips.length > 0 ? (
        <ul className="mt-3 space-y-1.5">
          {tips.map((tip) => (
            <li
              key={tip}
              className="flex items-start gap-2 text-[12px] leading-5 text-paper/60"
            >
              <span
                aria-hidden="true"
                className="mt-[7px] size-1 shrink-0 rounded-full bg-[#2f7d56]"
              />
              {tip}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-[12px] leading-5 text-[#9ec9b4]">
          Brief complet — prêt à être analysé par un dessinateur.
        </p>
      )}
    </div>
  );
}
