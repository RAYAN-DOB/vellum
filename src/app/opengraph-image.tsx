import { ImageResponse } from "next/og";

export const alt = "Vellum - Le calque commun de vos plans techniques";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#faf9f5",
          color: "#0d0d0c",
          display: "flex",
          padding: 72,
          fontFamily: "serif",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 54,
                height: 54,
                background: "#0d0d0c",
                color: "#faf9f5",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 36,
              }}
            >
              V
            </div>
            <div style={{ fontSize: 34 }}>Vellum</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: 78,
                lineHeight: 0.95,
                letterSpacing: -2,
              }}
            >
              <div>Le calque commun</div>
              <div>de vos plans</div>
              <div>techniques.</div>
            </div>
            <div style={{ marginTop: 28, fontSize: 24, color: "#2b2a26" }}>
              Dépôt, qualification, devis, production et livrables dans un seul fil.
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
