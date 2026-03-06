-- Indice composto per rate limiting anonimi per IP
-- Copre la query: WHERE ip_hash = ? AND event_type = ? AND created_at >= ?
CREATE INDEX IF NOT EXISTS idx_usage_events_ip_rate
  ON usage_events (ip_hash, event_type, created_at);

-- Indice per idempotenza webhook Stripe
-- Copre la query: WHERE event_type = 'stripe_webhook' AND metadata->>'stripe_event_id' = ?
CREATE INDEX IF NOT EXISTS idx_usage_events_stripe_idempotency
  ON usage_events (event_type, (metadata->>'stripe_event_id'))
  WHERE event_type = 'stripe_webhook';

-- Indice per dedup audit recenti per URL normalizzato
-- Copre la query: WHERE url_normalized = ? AND created_at >= ?
CREATE INDEX IF NOT EXISTS idx_audits_url_normalized_recent
  ON audits (url_normalized, created_at DESC);
