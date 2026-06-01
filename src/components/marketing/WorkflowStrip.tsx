const steps = [
  {
    n: "01",
    title: "Vous déposez les plans",
    body:
      "Choisissez le type de besoin, décrivez le résultat attendu et ajoutez PDF, DWG, croquis, photos ou notes.",
  },
  {
    n: "02",
    title: "Le dossier est relu",
    body:
      "Un dessinateur vérifie les fichiers, repère les informations manquantes et prépare les questions utiles.",
  },
  {
    n: "03",
    title: "Vous recevez un devis et des aperçus",
    body:
      "Les échanges, maquettes intermédiaires, corrections demandées et validations restent dans le même fil.",
  },
  {
    n: "04",
    title: "Vous téléchargez les livrables",
    body:
      "Après validation, les fichiers finaux restent disponibles dans votre espace client avec l'historique du dossier.",
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

      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <header className="max-w-2xl">
          <h2 className="display text-[clamp(2rem,4.5vw,3.5rem)]">
            De la demande au livrable,
            <br />
            <span className="italic">chaque étape est visible.</span>
          </h2>
          <p className="mt-6 text-[16px] leading-[1.7] text-graphite">
            Vellum rend le suivi concret : ce qui a été envoyé, ce qui est en
            attente, ce qui doit être validé et ce que vous pouvez télécharger.
          </p>
        </header>

        <ol className="mt-14 grid gap-px overflow-hidden rounded-[6px] border border-line-strong bg-line-strong lg:grid-cols-4">
          {steps.map(({ n, title, body }) => (
            <li
              key={n}
              className="relative flex min-h-[250px] flex-col justify-between gap-6 bg-paper p-8 sm:p-9"
            >
              <span className="font-display text-5xl leading-none text-ink">
                {n}
              </span>
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
