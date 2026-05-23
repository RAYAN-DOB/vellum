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
            text: "Affichage front uniquement. Rien n'est securise cote serveur.",
          },
        ].map((item) => (
          <Card key={item.title}>
            <CardContent className="p-5">
              <p className="font-semibold text-slate-950">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card className="border-amber-200 bg-amber-50 shadow-none">
        <CardContent className="flex gap-3 p-5">
          <AlertTriangle
            className="mt-0.5 size-5 shrink-0 text-amber-700"
            aria-hidden="true"
          />
          <p className="text-sm leading-6 text-amber-900">
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
            <thead className="bg-slate-50">
              <tr className="text-slate-500">
                <th className="border-b border-slate-200 px-3 py-3 font-semibold">
                  Role
                </th>
                <th className="border-b border-slate-200 px-3 py-3 font-semibold">
                  Projet
                </th>
                <th className="border-b border-slate-200 px-3 py-3 font-semibold">
                  Demande
                </th>
                <th className="border-b border-slate-200 px-3 py-3 font-semibold">
                  Livrable
                </th>
                <th className="border-b border-slate-200 px-3 py-3 font-semibold">
                  Fichiers
                </th>
              </tr>
            </thead>
            <tbody>
              {mockPermissionMatrix.map((row) => (
                <tr className="transition hover:bg-blue-50/40" key={row.role}>
                  <td className="border-b border-slate-100 px-3 py-4 font-semibold text-slate-950">
                    {row.role}
                  </td>
                  <td className="border-b border-slate-100 px-3 py-4 text-slate-600">
                    {row.project}
                  </td>
                  <td className="border-b border-slate-100 px-3 py-4 text-slate-600">
                    {row.request}
                  </td>
                  <td className="border-b border-slate-100 px-3 py-4 text-slate-600">
                    {row.deliverable}
                  </td>
                  <td className="border-b border-slate-100 px-3 py-4 text-slate-600">
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
