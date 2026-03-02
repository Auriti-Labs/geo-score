// Tipi Supabase per le tabelle del database

import type { AuditChecks, ScoreBand } from "./audit";

export interface AuditRow {
  id: string;
  url: string;
  url_normalized: string;
  score: number;
  band: ScoreBand;
  checks: AuditChecks;
  recommendations: string[];
  http_status: number;
  page_size: number;
  created_at: string;
}

export interface EmailRow {
  id: string;
  email: string;
  audit_id: string | null;
  source: "report_download" | "newsletter";
  created_at: string;
}

export interface UsageEventRow {
  id: number;
  event_type:
    | "audit_requested"
    | "audit_completed"
    | "email_collected"
    | "report_downloaded"
    | "share_clicked";
  audit_id: string | null;
  metadata: Record<string, unknown>;
  ip_hash: string | null;
  created_at: string;
}

// Helper per tipizzare le tabelle Supabase
export interface Database {
  public: {
    Tables: {
      audits: {
        Row: AuditRow;
        Insert: Omit<AuditRow, "id" | "created_at">;
        Update: Partial<Omit<AuditRow, "id" | "created_at">>;
      };
      emails: {
        Row: EmailRow;
        Insert: Omit<EmailRow, "id" | "created_at">;
        Update: Partial<Omit<EmailRow, "id" | "created_at">>;
      };
      usage_events: {
        Row: UsageEventRow;
        Insert: Omit<UsageEventRow, "id" | "created_at">;
        Update: Partial<Omit<UsageEventRow, "id" | "created_at">>;
      };
    };
  };
}
