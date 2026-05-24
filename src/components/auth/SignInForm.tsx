"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight, Loader2 } from "lucide-react";

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
      className="group inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-ink px-4 text-[14px] font-medium text-paper transition hover:bg-iron-hover disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Connexion…
        </>
      ) : (
        <>
          Se connecter
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </>
      )}
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
          className="rounded-[3px] border border-crimson/30 bg-crimson/5 px-3 py-2 text-[13px] text-crimson"
        >
          {state.error}
        </p>
      ) : null}

      <SubmitButton />

      <p className="text-center text-[13px] text-mute">
        Pas encore de compte ?{" "}
        <a
          className="draft-link cursor-pointer font-medium text-ink"
          href="/register"
        >
          Créer un compte client
        </a>
      </p>
    </form>
  );
}
