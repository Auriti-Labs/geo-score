import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";
import { SCORE_BANDS } from "@/lib/constants";
import type { ScoreBand } from "@/types/audit";

export const runtime = "edge";
export const alt = "GEO Score Report";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("audits")
    .select("url, score, band")
    .eq("id", id)
    .single();

  const score = data?.score ?? 0;
  const band = (data?.band ?? "critical") as ScoreBand;
  const url = data?.url ?? "sito sconosciuto";
  const bandInfo = SCORE_BANDS[band];

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "#3b82f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              fontWeight: "bold",
              color: "white",
            }}
          >
            G
          </div>
          <span style={{ fontSize: "28px", fontWeight: "bold", color: "white" }}>
            GEO Score
          </span>
        </div>

        {/* Punteggio grande */}
        <div
          style={{
            fontSize: "120px",
            fontWeight: "bold",
            color: bandInfo.color,
            lineHeight: 1,
          }}
        >
          {score}
        </div>
        <div
          style={{
            fontSize: "32px",
            color: "#94a3b8",
            marginTop: "8px",
          }}
        >
          / 100
        </div>

        {/* Banda */}
        <div
          style={{
            marginTop: "24px",
            padding: "8px 24px",
            borderRadius: "9999px",
            background: bandInfo.color + "22",
            color: bandInfo.color,
            fontSize: "24px",
            fontWeight: "600",
          }}
        >
          {bandInfo.label}
        </div>

        {/* URL */}
        <p
          style={{
            fontSize: "20px",
            color: "#64748b",
            marginTop: "24px",
            maxWidth: "800px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
        </p>
      </div>
    ),
    { ...size },
  );
}
