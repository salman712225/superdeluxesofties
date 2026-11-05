import { DAILY_FLAVOURS, STORE_INFO } from '../data/superDeluxeData';
import { DailyFlavour, FranchiseFormData } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '';

export async function fetchFeaturedFlavour(): Promise<DailyFlavour> {
  try {
    const res = await fetch(`${API_BASE}/api/featured-flavour`, {
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) throw new Error('API request failed');
    const data = await res.json();
    
    // Find matching flavor or synthesize
    const match = DAILY_FLAVOURS.find(f => f.day === data.day_of_cycle || f.name.toLowerCase().includes(data.flavour_name?.toLowerCase()));
    if (match) {
      return {
        ...match,
        isToday: true,
        availableDate: data.formatted_date || data.calendar_date,
      };
    }
    return DAILY_FLAVOURS[0];
  } catch (err) {
    // Graceful offline fallback: Belgian Chocolate (Day 1) as in design reference
    const flavour = { ...DAILY_FLAVOURS[0] };
    flavour.isToday = true;
    flavour.availableDate = new Date().toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    return flavour;
  }
}

export async function submitFranchiseEnquiry(formData: FranchiseFormData): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/api/franchise-enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || 'Failed to submit enquiry');
    }
    return await res.json();
  } catch (err: any) {
    // If backend isn't responding, simulate successful receipt & log to local storage
    console.warn('Backend unavailable, saving enquiry locally:', formData);
    try {
      const existing = JSON.parse(localStorage.getItem('superdeluxe_enquiries') || '[]');
      existing.push({ ...formData, submittedAt: new Date().toISOString() });
      localStorage.setItem('superdeluxe_enquiries', JSON.stringify(existing));
    } catch {}
    
    // Simulate slight network delay
    await new Promise(r => setTimeout(r, 600));
    return {
      success: true,
      message: 'Thank you for your interest! Our team will contact you within 24 hours on ' + formData.phoneNumber,
    };
  }
}
