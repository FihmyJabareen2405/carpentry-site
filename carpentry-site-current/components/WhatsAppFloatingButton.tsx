"use client";

import {
  SITE_NAME,
  SITE_WHATSAPP_NUMBER,
} from "@/lib/site";

import {
  createWhatsAppUrl,
} from "@/lib/whatsapp";

export default function WhatsAppFloatingButton() {
  if (!SITE_WHATSAPP_NUMBER) {
    return null;
  }

  const whatsappUrl =
    createWhatsAppUrl(
      SITE_WHATSAPP_NUMBER,
      `שלום, הגעתי דרך האתר של ${SITE_NAME} ואני מעוניין לקבל מידע על עבודת נגרות.`
    );

  if (!whatsappUrl) {
    return null;
  }

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`שליחת הודעת WhatsApp אל ${SITE_NAME}`}
      title="שלחו לנו WhatsApp"
      className="fixed bottom-5 left-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 md:bottom-7 md:left-7"
    >
      <svg
        viewBox="0 0 32 32"
        aria-hidden="true"
        className="h-8 w-8"
        fill="currentColor"
      >
        <path d="M16 3C8.82 3 3 8.61 3 15.54c0 2.44.74 4.72 2.02 6.65L3 29l7.05-1.94A13.3 13.3 0 0 0 16 28.46c7.18 0 13-5.61 13-12.92S23.18 3 16 3Zm0 23.28c-1.84 0-3.64-.48-5.21-1.39l-.37-.21-4.18 1.15 1.12-4.04-.24-.39a10.47 10.47 0 0 1-1.64-5.86C5.48 9.81 10.2 5.18 16 5.18s10.52 4.63 10.52 10.36S21.8 26.28 16 26.28Zm5.77-7.74c-.32-.16-1.87-.91-2.16-1.01-.29-.11-.5-.16-.71.16-.21.31-.82 1.01-1 1.22-.18.21-.37.24-.69.08-.31-.16-1.33-.48-2.54-1.54-.94-.83-1.57-1.85-1.75-2.16-.19-.32-.02-.49.14-.65.14-.14.32-.37.47-.55.16-.18.21-.31.32-.52.1-.21.05-.4-.03-.55-.08-.16-.71-1.7-.97-2.33-.26-.61-.52-.53-.71-.54h-.61c-.21 0-.55.08-.84.4-.29.31-1.1 1.06-1.1 2.59 0 1.54 1.13 3.02 1.29 3.23.16.21 2.22 3.36 5.39 4.71.75.32 1.34.51 1.8.66.76.24 1.45.2 2 .12.61-.09 1.87-.76 2.13-1.49.27-.73.27-1.36.19-1.49-.08-.13-.29-.21-.61-.37Z" />
      </svg>
    </a>
  );
}