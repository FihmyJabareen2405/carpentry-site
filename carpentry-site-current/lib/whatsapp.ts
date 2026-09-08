export function normalizeWhatsAppPhone(
  phone: string
) {
  let cleaned = phone.replace(/\D/g, "");

  if (cleaned.startsWith("00")) {
    cleaned = cleaned.slice(2);
  }

  if (cleaned.startsWith("0")) {
    cleaned = `972${cleaned.slice(1)}`;
  }

  return cleaned;
}

export function createWhatsAppUrl(
  phone: string,
  message?: string
) {
  const normalizedPhone =
    normalizeWhatsAppPhone(phone);

  if (!normalizedPhone) {
    return null;
  }

  const baseUrl =
    `https://wa.me/${normalizedPhone}`;

  if (!message) {
    return baseUrl;
  }

  return `${baseUrl}?text=${encodeURIComponent(
    message
  )}`;
}