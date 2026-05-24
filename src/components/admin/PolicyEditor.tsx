"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { updateAppPolicyAction } from "@/lib/actions/admin";
import type { AppPolicyRow } from "@/types/database";

type Props = { policies: AppPolicyRow[] };

const initialState = {} as { error?: string; success?: string };

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? <Loader2 className="size-3.5 animate-spin" /> : null}
      Enregistrer
    </Button>
  );
}

function PolicyCard({ policy }: { policy: AppPolicyRow }) {
  const [state, formAction] = useActionState(updateAppPolicyAction, initialState);

  return (
    <form
      action={formAction}
      className="rounded-[6px] border border-[#d8d0bf] bg-white/95 p-4"
    >
      <input type="hidden" name="id" value={policy.id} />
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-medium text-[#171613]">{policy.label}</p>
          <code className="text-[11px] text-[#6b665a]">{policy.key}</code>
          {policy.description ? (
            <p className="mt-1 text-xs text-[#6b665a]">{policy.description}</p>
          ) : null}
        </div>
      </div>
      <label className="mt-3 block">
        <span className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-[#8a7a5f]">
          Valeur JSON
        </span>
        <textarea
          name="value"
          rows={3}
          defaultValue={JSON.stringify(policy.value, null, 2)}
          className="block w-full rounded-[3px] border border-[#d8d0bf] bg-white px-3 py-2 font-mono text-xs text-[#171613] outline-none focus:border-[#171613] focus:ring-2 focus:ring-[#171613]/15"
        />
      </label>
      {state.error ? (
        <p className="mt-2 text-xs text-red-700">{state.error}</p>
      ) : null}
      {state.success ? (
        <p className="mt-2 text-xs text-emerald-700">{state.success}</p>
      ) : null}
      <div className="mt-3 flex justify-end">
        <Submit />
      </div>
    </form>
  );
}

export function PolicyEditor({ policies }: Props) {
  return (
    <div className="space-y-3">
      {policies.map((policy) => (
        <PolicyCard key={policy.id} policy={policy} />
      ))}
    </div>
  );
}
