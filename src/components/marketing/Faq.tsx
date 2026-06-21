"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

import { CartoucheHeader } from "@/components/atelier/CartoucheHeader";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

const ITEMS = [
  {
    ref: "Q-01",
    q: "Combien ça coûte ?",
    a: "Chaque type de projet a une fourchette indicative (voir l'estimateur ci-dessus). Le prix exact est fixé dans un devis clair, établi par le dessinateur après lecture de vos fichiers — vous ne réglez rien avant de l'avoir accepté.",
  },
  {
    ref: "Q-02",
    q: "Quels fichiers est-ce que je reçois ?",
    a: "Vos plans sont livrés en PDF (prêts à imprimer et à partager) et en DWG (fichiers natifs, réexploitables par n'importe quel bureau d'études). Les aperçus 3D sont fournis en image haute définition.",
  },
  {
    ref: "Q-03",
    q: "Et si le plan ne me convient pas ?",
    a: "Des allers-retours sont prévus : vous demandez des corrections, le dessinateur ajuste, jusqu'à validation. Le devis précise le nombre de révisions incluses — rien n'est figé tant que vous n'avez pas validé.",
  },
  {
    ref: "Q-04",
    q: "Mes fichiers restent-ils confidentiels ?",
    a: "Vos documents restent privés et cloisonnés par projet, avec des accès contrôlés. NDA sur demande. Vous gardez la main sur vos livrables.",
  },
  {
    ref: "Q-05",
    q: "Combien de temps ça prend ?",
    a: "Comptez un devis sous 48 h et une première réponse sous 24 h. Le délai de réalisation dépend du projet : il est estimé dès l'instant, puis confirmé au devis.",
  },
] as const;

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="mx-auto max-w-3xl scroll-mt-24 px-6 py-20 lg:py-24"
    >
      <CartoucheHeader
        eyebrow="§06 · Questions fréquentes"
        meta="Avant de déposer"
        title="Tout est clair avant de payer."
      />

      <div className="mt-10 border-t border-line">
        {ITEMS.map((it, i) => {
          const isOpen = open === i;
          return (
            <div key={it.ref} className="border-b border-line">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="group flex w-full items-center gap-4 py-5 text-left"
              >
                <span
                  className={cn(
                    "caption w-12 shrink-0",
                    isOpen ? "text-pine" : "text-soft",
                  )}
                >
                  {it.ref}
                </span>
                <span className="flex-1 font-display text-lg leading-snug text-ink">
                  {it.q}
                </span>
                <ChevronRight
                  className={cn(
                    "size-4 shrink-0 transition-transform duration-200",
                    isOpen ? "rotate-90 text-pine" : "text-mute",
                  )}
                  aria-hidden="true"
                />
              </button>
              <motion.div
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.22, ease: EASE }}
                className="overflow-hidden"
              >
                <p className="pb-5 pl-16 pr-6 text-[14px] leading-[1.65] text-graphite">
                  {it.a}
                </p>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
