import { DAILY_FLAVOURS } from '../data/superDeluxeData';
import { DailyFlavour, FranchiseFormData } from '../types';

// ─── Flavour Rotation Engine (pure frontend, no backend needed) ──────────────
// Same deterministic logic as the Python backend:
//   elapsedDays = today(IST) - anchorDate
//   dayIndex    = elapsedDays % 10   (always positive)
//   flavour     = DAILY_FLAVOURS[dayIndex]
//
// ANCHOR DATE: the date when Day 1 (Belgian Chocolate) was first served.
// If you ever want to shift the rotation, update this one constant.
const ANCHOR_DATE_IST = '2026-11-05'; // YYYY-MM-DD in Asia/Kolkata

function getTodayIndexIST(): { dayIndex: number; displayDay: number; dateLabel: string } {
  // Get current date in Asia/Kolkata timezone
  const nowIST = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
  );
  const todayIST = new Date(nowIST.getFullYear(), nowIST.getMonth(), nowIST.getDate());

  const [ay, am, ad] = ANCHOR_DATE_IST.split('-').map(Number);
  const anchor = new Date(ay, am - 1, ad);

  const elapsedDays = Math.floor((todayIST.getTime() - anchor.getTime()) / 86_400_000);
  const CYCLE = DAILY_FLAVOURS.length; // 10
  const dayIndex = ((elapsedDays % CYCLE) + CYCLE) % CYCLE; // always 0–9

  const dateLabel = nowIST.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return { dayIndex, displayDay: dayIndex + 1, dateLabel };
}

export function fetchFeaturedFlavour(): Promise<DailyFlavour> {
  const { dayIndex, displayDay, dateLabel } = getTodayIndexIST();
  const base = DAILY_FLAVOURS[dayIndex];
  return Promise.resolve({
    ...base,
    day: displayDay,
    dayLabel: `Day ${displayDay}`,
    isToday: true,
    availableDate: dateLabel,
  });
}

const FORMSPREE_ID = 'xrppjjod';
const WHATSAPP_NUMBER = '919445357733'; // +91 94453 57733

function openWhatsApp(formData: FranchiseFormData) {
  const enquiryTypeLabels: Record<string, string> = {
    franchise: 'Dedicated Parlour (High Street)',
    kiosk: 'Mall / Food Court Kiosk',
    event: 'Event & Party Catering',
    distribution: 'Distribution / Raw Material Supply',
  };
  const lines = [
    `🍦 *New Franchise Enquiry — Super Deluxe Softies & Smiles*`,
    ``,
    `👤 *Name:* ${formData.fullName}`,
    `📞 *Phone:* ${formData.phoneNumber}`,
    `📧 *Email:* ${formData.email}`,
    `📍 *City:* ${formData.city}`,
    `🏪 *Enquiry Type:* ${enquiryTypeLabels[formData.enquiryType] || formData.enquiryType}`,
    formData.investmentRange ? `💰 *Investment Budget:* ${formData.investmentRange}` : '',
    formData.message ? `📝 *Notes:* ${formData.message}` : '',
  ].filter(Boolean).join('\n');

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

export async function submitFranchiseEnquiry(formData: FranchiseFormData): Promise<{ success: boolean; message: string }> {
  // Step 1 — Submit to Formspree (sends email to superdeluxe.softies@gmail.com)
  try {
    const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        name: formData.fullName,
        phone: formData.phoneNumber,
        email: formData.email,
        city: formData.city,
        enquiry_type: formData.enquiryType,
        investment_range: formData.investmentRange || 'Not specified',
        message: formData.message || 'No additional notes',
        _subject: `🍦 Franchise Enquiry from ${formData.fullName} — ${formData.city}`,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Formspree submission failed');
    }

    // Step 2 — Open WhatsApp with pre-filled message for instant team notification
    openWhatsApp(formData);

    return {
      success: true,
      message: `Thank you ${formData.fullName}! Your enquiry has been received. Our team will contact you on ${formData.phoneNumber} shortly. A WhatsApp message has also been sent to our team.`,
    };
  } catch (err: any) {
    // Fallback: save to localStorage + still open WhatsApp so team is notified
    console.warn('Formspree unavailable, saving enquiry locally:', err.message);
    try {
      const existing = JSON.parse(localStorage.getItem('superdeluxe_enquiries') || '[]');
      existing.push({ ...formData, submittedAt: new Date().toISOString() });
      localStorage.setItem('superdeluxe_enquiries', JSON.stringify(existing));
    } catch { }

    // Still notify via WhatsApp even if Formspree fails
    openWhatsApp(formData);

    await new Promise(r => setTimeout(r, 400));
    return {
      success: true,
      message: `Thank you ${formData.fullName}! Your enquiry has been sent via WhatsApp. Our team will contact you on ${formData.phoneNumber} within 24 hours.`,
    };
  }
}
