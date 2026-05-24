"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

import { signInAction } from "@/lib/actions/auth";
import { AuthInput } from "@/components/auth/AuthInput";

type Props = { redirectTo?: string };

const initialState = {} as { error?: string; success?: string };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[3px] bg-[#f7f3ea] px-4 text-sm font-semibold text-[#171613] shadow-[0_18px_40px_rgba(248,243,234,0.18)] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : null}
      {pending ? "Connexion…" : "Se connecter"}
    </button>
  );
}

export function SignInForm({ redirectTo }: Props) {
  const [state, formAction] = useActionState(signInAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="redirect" value={redirectTo ?? ""} />
      <AuthInput
        label="Email professionnel"
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="vous@entreprise.com"
      />
      <AuthInput
        label="Mot de passe"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        placeholder="••••••••"
      />

      {state.error ? (
        <p
          role="alert"
          className="rounded-[3px] border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-200"
        >
          {state.error}
        </p>
      ) : null}

      <SubmitButton />

      <p className="text-center text-xs text-[#8f8777]">
        Pas encore de compte ?{" "}
        <a className="text-[#f7f3ea] underline-offset-4 hover:underline" href="/register">
          Créer un compte client
        </a>
      </p>
    </form>
  );
}
