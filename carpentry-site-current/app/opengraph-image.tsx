import { ImageResponse } from "next/og";

export const alt =
  "נגריית עימאד אקרם - נגרות בהתאמה אישית";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #1c1917 0%, #292524 65%, #44403c 100%)",
          color: "white",
          position: "relative",
        }}
      >
        {/* קו דקורטיבי עליון */}
        <div
          style={{
            position: "absolute",
            top: 70,
            left: 70,
            right: 70,
            height: 1,
            background: "rgba(255,255,255,0.12)",
          }}
        />

        {/* קו דקורטיבי תחתון */}
        <div
          style={{
            position: "absolute",
            bottom: 70,
            left: 70,
            right: 70,
            height: 1,
            background: "rgba(255,255,255,0.12)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          {/* Logo */}
          <div
            style={{
              width: 110,
              height: 110,
              borderRadius: 26,
              background: "#d97706",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 38,
              fontWeight: 800,
              marginBottom: 40,
            }}
          >
            EA
          </div>

          {/* Business name */}
          <div
            style={{
              display: "flex",
              fontSize: 68,
              fontWeight: 800,
              letterSpacing: -2,
            }}
          >
            EMAD AKRAM
          </div>

          {/* Tagline */}
          <div
            style={{
              display: "flex",
              marginTop: 20,
              fontSize: 30,
              opacity: 0.8,
            }}
          >
            CUSTOM CARPENTRY
          </div>

          {/* Accent */}
          <div
            style={{
              marginTop: 45,
              width: 90,
              height: 5,
              borderRadius: 20,
              background: "#d97706",
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}