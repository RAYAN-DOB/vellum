# Vellum — Money engine (funnel business)

Refonte du parcours business client → dessinateur, en conservant le backend
existant (Supabase, Auth, RLS, migrations). Esthétique Atelier. Tout ce qui
touche à l'argent est **configurable** et le paiement est **simulé** (prêt à
brancher Stripe).

## Funnel

Landing → **Estimation instantanée** → Dépôt (**score de brief** + estimation
live) → Devis (**page conversion** : acompte/total, upsells, « après paiement »)
→ **Checkout** (mock, Stripe-ready) → Workspace projet (onglets + ProjectTracker)
→ Cockpit dessinateur (modèles de devis, réponses rapides) →
**Admin revenue cockpit**.

## Routes ajoutées

| Route | Rôle | Description |
|---|---|---|
| `/#estimer` (landing) | public | Estimateur instantané (configurateur live) |
| `/client/devis/[quoteId]` | client | Page devis conversion (QuoteSheet) |
| `/checkout/confirmation` | client | Paiement (mock, accepte le devis via RLS) |
| `/checkout/success` | client | Confirmation premium |

## Composants / libs clés

- `lib/estimator.ts` — heuristique de prix indicative (pure, transparente).
- `lib/business-config.ts` — **source de vérité argent** : `depositPolicy`,
  `COMMISSION_RATE`, `QUOTE_VALIDITY_DAYS`, `UPSELLS`, `formatEuro`.
- `lib/brief-score.ts` + `components/intake/BriefQualityMeter.tsx`.
- `lib/payments.ts` — assemble le `CheckoutBreakdown` + **seam Stripe**.
- `lib/designer-presets.ts` — modèles de devis + réponses rapides.
- `lib/emails.ts` — templates transactionnels (mock, Resend-ready).
- `components/quotes/QuoteSheet.tsx` — la « planche » devis (PriceRail sticky).
- `components/project/ProjectWorkspaceTabs.tsx` — onglets projet.
- `components/admin/AdminRevenueCockpit.tsx` + `components/charts/MiniCharts.tsx`
  (graphiques SVG maison, pas de dépendance).

## Règles business par défaut (toutes configurables dans `business-config.ts`)

- Devise : **EUR**. Commission Vellum : **15 %**. Devis valable **14 jours**.
- Acompte : < 150 € → **paiement total** ; 150–500 € → **30 %** ; > 500 € →
  **40 %** ; urgent → **50 %**.
- Upsells : livraison 48 h (+35 %, min 49 €), 24 h (+60 %, min 99 €), fichiers
  source (+39 €), PDF print (+29 €), révision supp. (+49 €), appel (+39 €), pack
  livraison (+99 €).

## Ce qui est MOCK / à brancher plus tard

1. **Stripe** — le checkout est simulé. `lib/payments.ts` expose
   `STRIPE_READY` + `mockCheckoutUrl`. Pour brancher : `STRIPE_SECRET_KEY` +
   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, remplacer le mock par une Stripe
   Checkout Session (server action / route), ajouter un webhook
   `checkout.session.completed` pour marquer le devis payé + persister les
   upsells choisis. Aujourd'hui « Payer » accepte le devis (statut `accepted`,
   protégé RLS) — pas de débit réel.
2. **Resend / emails** — `lib/emails.ts` fournit les templates ; rien n'est
   envoyé. Brancher : `RESEND_API_KEY` + appel `resend.emails.send(...)` aux
   bons moments (devis envoyé, paiement, livraison, rappel).
3. **Upsells & paiements persistés** — non stockés en base pour l'instant. Si
   besoin : migration `0007+` avec policies RLS dédiées (table `payments`,
   `quote_upsells`). Ne pas modifier les migrations existantes.

## Vérifs

```bash
npm run lint
npm run build
```

Statut au dernier commit : **build vert** (lint 0, 0 erreur TS).
