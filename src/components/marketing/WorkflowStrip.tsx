const steps = [
  {
    n: "01",
    title: "Déposer",
    body:
      "Le client raconte son besoin, joint ses documents. Vellum génère une référence projet (PRJ–YYYYMM–XXXX) et un dossier privé.",
  },
  {
    n: "02",
    title: "Qualifier",
    body:
      "Le chef de projet précise scope, priorité, confidentialité, délai. Il assigne le dessinateur, prépare le devis.",
  },
  {
    n: "03",
    title: "Produire",
    body:
      "Le dessinateur travaille sur les fichiers natifs. Il dépose aperçus, calques, versions intermédiaires.",
  },
  {
    n: "04",
    title: "Livrer",
    body:
      "Le client valide l'aperçu, le livrable final est signé et archivé. L'historique reste accessible, pas modifiable.",
  },
] as const;

export function WorkflowStrip() {
  return (
    <section
      id="workflow"
      className="relative overflow-hidden border-b border-graphite"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian/50 via-abyss to-abyss" />
      <div className="absolute inset-0 grid-subtle" />
      
      {/* Decorative line connecting steps */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-graphite to-transparent hidden lg:block" />

      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <header className="max-w-2xl mb-16">
          <p className="caption text-gold">Workflow</p>
          <h2 className="display mt-5 text-[clamp(2rem,5vw,4rem)]">
            <span className="text-paper">Quatre étapes,</span>
            <br />
            <span className="italic text-gradient">aucune zone grise.</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-silver">
            Chaque transition est explicite. Chaque acteur sait ce qu&apos;il
            doit faire — et ce qu&apos;il n&apos;a pas le droit de faire.
          </p>
        </header>

        <ol className="grid gap-6 lg:grid-cols-4">
          {steps.map(({ n, title, body }, i) => (
            <li
              key={n}
              className="group relative"
            >
              {/* Connection line to next step */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-6 h-px bg-gradient-to-r from-graphite to-gold/30 z-10" />
              )}
              
              <div className="relative h-full overflow-hidden rounded-2xl border border-graphite bg-slate/30 p-8 transition-all duration-300 hover:border-gold/30 hover:bg-slate/50">
                {/* Number highlight on hover */}
                <div className="absolute -right-4 -top-4 font-display text-[120px] leading-none text-graphite/20 group-hover:text-gold/10 transition-colors select-none">
                  {n}
                </div>
                
                <div className="relative">
                  {/* Step number badge */}
                  <div className="inline-flex items-center justify-center size-12 rounded-xl bg-obsidian border border-graphite group-hover:border-gold/30 group-hover:bg-gold/10 transition-colors mb-6">
                    <span className="font-display text-xl text-paper group-hover:text-gold transition-colors">{n}</span>
                  </div>
                  
                  {/* Arrow to next step */}
                  {i < steps.length - 1 && (
                    <span className="absolute top-3 right-0 text-dim group-hover:text-gold transition-colors hidden lg:inline">
                      →
                    </span>
                  )}
                  
                  <h3 className="font-display text-2xl text-paper mb-4">{title}</h3>
                  <p className="text-sm leading-relaxed text-silver">
                    {body}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
