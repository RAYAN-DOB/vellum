import { AlertTriangle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { mockPermissionMatrix } from "@/lib/mock-data";

export function PermissionsMatrix() {
  return (
    <div className="grid gap-6">
      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Ressources",
            text: "Projet, demande, document, message, apercu, devis et livrable.",
          },
          {
            title: "Controle cible",
            text: "Role global, role projet, assignation, NDA et etat de ressource.",
          },
          {
            title: "V1 actuelle",
            text: "Affichage front uniquement. Les controles serveur arriveront en V2.",
          },
        ].map((item) => (
          <Card key={item.title}>
            <CardContent className="p-5">
              <p className="font-semibold text-[#171613]">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-[#6b665a]">{item.text}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card className="border-[#e4c887] bg-[#fbf2dd] shadow-none">
        <CardContent className="flex gap-3 p-5">
          <AlertTriangle
            className="mt-0.5 size-5 shrink-0 text-[#8a5b15]"
            aria-hidden="true"
          />
          <p className="text-sm leading-6 text-[#7a5213]">
            Cette matrice explique le modele de droits vise. Elle ne securise
            rien en V1 : les vrais controles devront etre faits cote serveur avec
            auth, permissions projet et journalisation.
          </p>
        </CardContent>
      </Card>

      <Card className="min-w-0 overflow-hidden">
        <CardHeader>
          <CardTitle>Qui pourra faire quoi en V2 ?</CardTitle>
        </CardHeader>
        <CardContent className="min-w-0 overflow-x-auto">
          <table className="min-w-[760px] w-full border-separate border-spacing-0 text-left text-sm">
            <thead className="bg-[#eee8dc]">
              <tr className="text-[#6b665a]">
                <th className="border-b border-[#d8d0bf] px-3 py-3 font-semibold">
                  Role
                </th>
                <th className="border-b border-[#d8d0bf] px-3 py-3 font-semibold">
                  Projet
                </th>
                <th className="border-b border-[#d8d0bf] px-3 py-3 font-semibold">
                  Demande
                </th>
                <th className="border-b border-[#d8d0bf] px-3 py-3 font-semibold">
                  Livrable
                </th>
                <th className="border-b border-[#d8d0bf] px-3 py-3 font-semibold">
                  Fichiers
                </th>
              </tr>
            </thead>
            <tbody>
              {mockPermissionMatrix.map((row) => (
                <tr className="transition hover:bg-[#f4f1ea]" key={row.role}>
                  <td className="border-b border-[#eee8dc] px-3 py-4 font-semibold text-[#171613]">
                    {row.role}
                  </td>
                  <td className="border-b border-[#eee8dc] px-3 py-4 text-[#6b665a]">
                    {row.project}
                  </td>
                  <td className="border-b border-[#eee8dc] px-3 py-4 text-[#6b665a]">
                    {row.request}
                  </td>
                  <td className="border-b border-[#eee8dc] px-3 py-4 text-[#6b665a]">
                    {row.deliverable}
                  </td>
                  <td className="border-b border-[#eee8dc] px-3 py-4 text-[#6b665a]">
                    {row.file}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
