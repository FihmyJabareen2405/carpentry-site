"use client";

import { useEffect, useRef, useState } from "react";

const INTRO_SESSION_KEY = "carpentry-intro-seen";

export default function IntroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    try {
      const alreadySeen =
        window.sessionStorage.getItem(INTRO_SESSION_KEY) === "1";

      if (!alreadySeen) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    if (!visible) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        // Autoplay can be blocked by a browser; the overlay still
        // provides a Skip button so the visitor is never trapped.
      });
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [visible]);

  function finishIntro() {
    if (closing) return;

    try {
      window.sessionStorage.setItem(INTRO_SESSION_KEY, "1");
    } catch {
      // Continue even if storage is unavailable.
    }

    setClosing(true);

    window.setTimeout(() => {
      setVisible(false);
      setClosing(false);
    }, 650);
  }

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black transition-opacity duration-700 ${
        closing ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      aria-label="סרטון פתיחה"
    >
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        src="/videos/intro-video.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={finishIntro}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/15" />

      <button
        type="button"
        onClick={finishIntro}
        className="absolute left-5 top-5 z-10 rounded-full border border-white/35 bg-black/35 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition hover:bg-black/55 sm:left-8 sm:top-8"
      >
        דלג
      </button>

      <div className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center px-6 sm:bottom-12">
        <div className="rounded-full bg-black/30 px-5 py-2 text-center text-xs text-white/85 backdrop-blur-md sm:text-sm">
          נגריית עימאד אקרם
        </div>
      </div>
    </div>
  );
}
