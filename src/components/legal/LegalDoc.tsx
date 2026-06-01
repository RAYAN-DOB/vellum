import type { ReactNode } from "react";

export type LegalSection = {
  heading: string;
  body: ReactNode;
};

type LegalDocProps = {
  eyebrow: string;
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
};

/**
 * Shared layout for static legal pages (mentions légales, confidentialité,
 * conditions). Pure presentation — keeps the three documents visually
 * consistent with the rest of the public site.
 */
export function LegalDoc({
  eyebrow,
  title,
  updated,
  intro,
  sections,
}: LegalDocProps) {
  return (
    <article className="relative">
      <p className="caption">{eyebrow}</p>
      <h1 className="display mt-4 text-[clamp(2.25rem,5vw,3.5rem)] text-ink">
        {title}
      </h1>
      <p className="mt-4 text-[13px] text-mute">Dernière mise à jour : {updated}</p>
      <p className="mt-8 max-w-2xl text-[16px] leading-[1.75] text-graphite">
        {intro}
      </p>

      <div className="mt-12 space-y-10 border-t border-line pt-10">
        {sections.map((section, index) => (
          <section key={section.heading}>
            <h2 className="font-display text-2xl leading-tight text-ink">
              <span className="caption mr-3 align-middle text-mute">
                {String(index + 1).padStart(2, "0")}
              </span>
              {section.heading}
            </h2>
            <div className="mt-4 max-w-2xl space-y-3 text-[15px] leading-[1.75] text-graphite [&_a]:text-sienna [&_a]:underline [&_a]:underline-offset-2 [&_li]:ml-1 [&_strong]:font-medium [&_strong]:text-ink [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
              {section.body}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
