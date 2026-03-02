-- GEO Score — Fase 2: Autenticazione e abbonamenti
-- Profili utente (creati automaticamente al signup)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'agency')),
  stripe_customer_id TEXT UNIQUE,
  audit_count_today INTEGER NOT NULL DEFAULT 0,
  audit_count_reset_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS: ogni utente vede solo il proprio profilo
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Utenti leggono il proprio profilo"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Utenti aggiornano il proprio profilo"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Trigger: crea profilo automaticamente quando un utente si registra
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Trigger: aggiorna updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Abbonamenti Stripe
CREATE TABLE subscriptions (
  id TEXT PRIMARY KEY, -- Stripe subscription ID
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('pro', 'agency')),
  status TEXT NOT NULL, -- active, canceled, past_due, etc.
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_subscriptions_user ON subscriptions (user_id);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Utenti leggono i propri abbonamenti"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Collegamento audits → utente (opzionale, per storico dashboard)
ALTER TABLE audits ADD COLUMN user_id UUID REFERENCES profiles(id);
CREATE INDEX idx_audits_user ON audits (user_id, created_at DESC);

-- Policy: utenti autenticati vedono i propri audit oltre a quelli pubblici
CREATE POLICY "Utenti leggono i propri audit"
  ON audits FOR SELECT
  USING (user_id = auth.uid());
