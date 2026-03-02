-- GEO Score MVP — Schema iniziale
-- Risultati audit (pubblicamente leggibili per pagina /audit/[id])
CREATE TABLE audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  url_normalized TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  band TEXT NOT NULL CHECK (band IN ('critical', 'foundation', 'good', 'excellent')),
  checks JSONB NOT NULL,
  recommendations TEXT[] NOT NULL DEFAULT '{}',
  http_status INTEGER NOT NULL DEFAULT 0,
  page_size INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT audits_url_normalized_idx UNIQUE (url_normalized, created_at)
);

-- Indice per dedup veloce (ultimo audit per URL)
CREATE INDEX idx_audits_url_recent ON audits (url_normalized, created_at DESC);

-- Email raccolte (email gate per report PDF)
CREATE TABLE emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  audit_id UUID REFERENCES audits(id),
  source TEXT NOT NULL DEFAULT 'report_download',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT emails_unique_per_audit UNIQUE (email, audit_id)
);

CREATE INDEX idx_emails_email ON emails (email);

-- Tracking utilizzo (analytics interno)
CREATE TABLE usage_events (
  id BIGSERIAL PRIMARY KEY,
  event_type TEXT NOT NULL,
  audit_id UUID REFERENCES audits(id),
  metadata JSONB DEFAULT '{}',
  ip_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_usage_events_type ON usage_events (event_type, created_at DESC);

-- RLS: audits leggibili da tutti, scrivibili solo da service_role
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Audits leggibili pubblicamente" ON audits FOR SELECT USING (true);

-- RLS: emails accessibili solo da service_role (mai dal client)
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;

-- RLS: usage_events accessibili solo da service_role
ALTER TABLE usage_events ENABLE ROW LEVEL SECURITY;
