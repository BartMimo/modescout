# ModeScout — MVP

Mobile-first marktplaats voor onafhankelijke Nederlandse modemerken.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS
- Supabase (Postgres + Auth + Storage)
- Stripe Connect (Express, Separate Charges & Transfers)
- Vercel (hosting)

## Setup

### 1. Installeer

```bash
npm install
```

### 2. Environment variables

```bash
cp .env.example .env.local
```

### 3. Supabase

1. Maak een project aan op [supabase.com](https://supabase.com)
2. Voer het schema uit: `supabase/migrations/001_initial_schema.sql` in de SQL Editor
3. Voer het seed-script uit: `supabase/seed.sql` (pas de `owner_id` aan naar een echte user)
4. Kopieer de URL en keys naar `.env.local`

### 4. Stripe

1. Maak een account op [stripe.com](https://stripe.com)
2. Activeer Stripe Connect: Settings → Connect
3. Kopieer de test keys naar `.env.local`
4. Webhook lokaal: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

### 5. Starten

```bash
npm run dev
```

## Environment variables

| Variabele | Omschrijving |
|-----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_test_...`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (`pk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret (`whsec_...`) |
| `NEXT_PUBLIC_APP_URL` | App URL (bijv. `http://localhost:3000`) |

## Admin account aanmaken

Maak een account aan via `/registreren`, dan in Supabase SQL Editor:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'jouw@email.nl';
```

## Betaalflow

1. Koper bestelt → PaymentIntent op platform-account
2. Koper betaalt via iDEAL (Stripe Payment Element)
3. Webhook `payment_intent.succeeded` → Transfer per merk (85%)
4. 15% commissie blijft op platform-account
