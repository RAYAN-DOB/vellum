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
      className="group relative inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-gold via-gold to-gold-deep px-4 text-sm font-semibold text-void transition-all hover:shadow-[0_0_30px_rgba(245,166,35,0.3)] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Connexion…
        </>
      ) : (
        <>
          <span className="relative z-10">Se connecter</span>
          <ArrowRight
            className="relative z-10 size-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
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
        rightSlot={
          <a
            href="/forgot-password"
            className="text-xs font-normal normal-case tracking-normal text-dim transition-colors hover:text-gold"
          >
            Oublié ?
          </a>
        }
      />

      {state.error ? (
        <p
          role="alert"
          className="rounded-lg border border-crimson/30 bg-crimson/10 px-4 py-3 text-sm text-crimson"
        >
          {state.error}
        </p>
      ) : null}

      <SubmitButton />

      <p className="text-center text-sm text-silver">
        Pas encore de compte ?{" "}
        <a
          className="font-medium text-gold transition-colors hover:text-gold-soft link-underline"
          href="/register"
        >
          Créer un compte client
        </a>
      </p>
    </form>
  );
}
