"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight, Loader2 } from "lucide-react";

import { AuthInput } from "@/components/auth/AuthInput";
import { requestPasswordResetAction } from "@/lib/actions/auth";

const initialState = {} as { error?: string; success?: string };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="group inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-ink px-4 text-[14px] font-medium text-paper transition hover:bg-iron-hover disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Envoi…
        </>
      ) : (
        <>
          Envoyer le lien
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </>
      )}
    </button>
  );
}

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(
    requestPasswordResetAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <AuthInput
        label="Email du compte"
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="vous@entreprise.com"
        hint="Vous recevrez un lien de réinitialisation valable 1 heure."
      />

      {state.error ? (
        <p
          role="alert"
          className="rounded-[3px] border border-crimson/30 bg-crimson/5 px-3 py-2 text-[13px] text-crimson"
        >
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p
          role="status"
          className="rounded-[3px] border border-moss/30 bg-moss/5 px-3 py-2 text-[13px] text-moss"
        >
          {state.success}
        </p>
      ) : null}

      <SubmitButton />

      <p className="text-center text-[13px] text-mute">
        <a
          className="draft-link cursor-pointer font-medium text-ink"
          href="/login"
        >
          ← Retour à la connexion
        </a>
      </p>
    </form>
  );
}
