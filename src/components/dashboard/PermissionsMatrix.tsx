import { AlertTriangle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { mockPermissionMatrix } from "@/lib/mock-data";

export function PermissionsMatrix() {
  return (
    <div className="grid gap-6">
      <Card className="border-amber-200 bg-amber-50 shadow-none">
        <CardContent className="flex gap-3 p-5">
          <AlertTriangle
            className="mt-0.5 size-5 shrink-0 text-amber-700"
            aria-hidden="true"
          />
          <p className="text-sm leading-6 text-amber-900">
            Matrice mockee : elle documente l&apos;intention produit mais ne securise
            rien sans backend, auth, permissions serveur et journalisation.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Matrice de permissions V1</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-[760px] w-full border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr className="text-neutral-500">
                <th className="border-b border-neutral-200 px-3 py-3 font-semibold">
                  Role
                </th>
                <th className="border-b border-neutral-200 px-3 py-3 font-semibold">
                  Projet
                </th>
                <th className="border-b border-neutral-200 px-3 py-3 font-semibold">
                  Demande
                </th>
                <th className="border-b border-neutral-200 px-3 py-3 font-semibold">
                  Livrable
                </th>
                <th className="border-b border-neutral-200 px-3 py-3 font-semibold">
                  Fichiers
                </th>
              </tr>
            </thead>
            <tbody>
              {mockPermissionMatrix.map((row) => (
                <tr key={row.role}>
                  <td className="border-b border-neutral-100 px-3 py-4 font-semibold text-neutral-950">
                    {row.role}
                  </td>
                  <td className="border-b border-neutral-100 px-3 py-4 text-neutral-600">
                    {row.project}
                  </td>
                  <td className="border-b border-neutral-100 px-3 py-4 text-neutral-600">
                    {row.request}
                  </td>
                  <td className="border-b border-neutral-100 px-3 py-4 text-neutral-600">
                    {row.deliverable}
                  </td>
                  <td className="border-b border-neutral-100 px-3 py-4 text-neutral-600">
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
