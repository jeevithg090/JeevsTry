import { ImageResponse } from "next/og"

export const alt = "TechCollab — freelancing, events and community in one workspace"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background: "linear-gradient(135deg, #1d4ed8 0%, #7e22ce 100%)",
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 48 }}>
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 22,
            background: "rgba(255,255,255,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 44,
            fontWeight: 700,
          }}
        >
          TC
        </div>
        <div style={{ fontSize: 48, fontWeight: 700 }}>TechCollab</div>
      </div>
      <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.1 }}>Connect. Collaborate. Create.</div>
      <div style={{ fontSize: 34, marginTop: 28, opacity: 0.9 }}>
        Freelancing, events and community for people who build with technology.
      </div>
    </div>,
    size,
  )
}
