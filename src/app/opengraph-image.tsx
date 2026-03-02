import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "GEO Score — Misura la visibilità AI del tuo sito";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
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
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "#3b82f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              fontWeight: "bold",
              color: "white",
            }}
          >
            G
          </div>
          <span
            style={{
              fontSize: "48px",
              fontWeight: "bold",
              color: "white",
            }}
          >
            GEO Score
          </span>
        </div>
        <p
          style={{
            fontSize: "28px",
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: "800px",
          }}
        >
          Misura la visibilità AI del tuo sito web
        </p>
        <p
          style={{
            fontSize: "20px",
            color: "#64748b",
            marginTop: "16px",
          }}
        >
          ChatGPT • Perplexity • Claude • Gemini
        </p>
      </div>
    ),
    { ...size },
  );
}
