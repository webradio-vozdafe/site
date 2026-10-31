/**
 * Utility functions for centralizing WhatsApp link generation across the entire app.
 * All WhatsApp links dynamically use the phone configured in the Studio Control Panel
 * ('Configurações & Backup' -> 'WhatsApp Oficial do Estúdio' / stationSettings.whatsapp).
 */

export function getCleanWhatsAppNumber(rawNumber?: string): string {
  let digits = (rawNumber || '').replace(/\D/g, '');
  if (!digits) {
    return '5511987654321';
  }
  // If the number has 10 or 11 digits (Brazilian DDD + phone without country code 55), prepend 55
  if ((digits.length === 10 || digits.length === 11) && !digits.startsWith('55')) {
    digits = `55${digits}`;
  }
  return digits;
}

export function buildWhatsAppUrl(whatsappNumber?: string, message?: string): string {
  const cleanNumber = getCleanWhatsAppNumber(whatsappNumber);
  const baseUrl = `https://wa.me/${cleanNumber}`;
  return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl;
}
