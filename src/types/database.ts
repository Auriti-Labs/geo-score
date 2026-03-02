// Tipi Supabase per le tabelle del database

import type { AuditChecks, ScoreBand } from "./audit";

export type UserPlan = "free" | "pro" | "agency";

export interface ProfileRow {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  plan: UserPlan;
  stripe_customer_id: string | null;
  audit_count_today: number;
  audit_count_reset_at: string;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionRow {
  id: string;
  user_id: string;
  plan: "pro" | "agency";
  status: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
}

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
  user_id: string | null;
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
      profiles: {
        Row: ProfileRow;
        Insert: Omit<ProfileRow, "created_at" | "updated_at">;
        Update: Partial<Omit<ProfileRow, "id" | "created_at">>;
      };
      subscriptions: {
        Row: SubscriptionRow;
        Insert: Omit<SubscriptionRow, "created_at">;
        Update: Partial<Omit<SubscriptionRow, "id" | "created_at">>;
      };
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
