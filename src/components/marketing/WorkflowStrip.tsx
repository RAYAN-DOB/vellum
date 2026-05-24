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
      className="relative overflow-hidden border-b border-line bg-vellum"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid-paper opacity-50"
      />

      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <header className="max-w-2xl">
          <p className="caption">Workflow</p>
          <h2 className="display mt-5 text-[clamp(2rem,4.5vw,3.5rem)]">
            Quatre étapes,
            <br />
            <span className="italic">aucune zone grise.</span>
          </h2>
          <p className="mt-6 text-[16px] leading-[1.7] text-graphite">
            Chaque transition est explicite. Chaque acteur sait ce qu&apos;il
            doit faire — et ce qu&apos;il n&apos;a pas le droit de faire.
          </p>
        </header>

        <ol className="mt-16 grid gap-px overflow-hidden rounded-[4px] border border-line-strong bg-line-strong lg:grid-cols-4">
          {steps.map(({ n, title, body }, i) => (
            <li
              key={n}
              className="relative flex flex-col gap-6 bg-paper p-8 sm:p-10"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-display text-5xl leading-none text-ink">
                  {n}
                </span>
                {i < steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="caption hidden lg:inline"
                  >
                    →
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-display text-2xl text-ink">{title}</h3>
                <p className="mt-3 text-[14px] leading-[1.65] text-mute">
                  {body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
