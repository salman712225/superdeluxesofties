import React, { useState } from 'react';
import { X, Send, Sparkles, CheckCircle2, AlertCircle, Building2 } from 'lucide-react';
import { FranchiseFormData } from '../types';
import { submitFranchiseEnquiry } from '../services/api';

interface FranchiseModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'ta';
}

export const FranchiseModal: React.FC<FranchiseModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [formData, setFormData] = useState<FranchiseFormData>({
    fullName: '',
    phoneNumber: '',
    email: '',
    city: '',
    enquiryType: 'franchise',
    investmentRange: '₹5L - ₹10L',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverMessage, setServerMessage] = useState('');

  // Lock body scroll
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setIsSuccess(false);
      setErrors({});
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Please enter your full name';
    if (!formData.phoneNumber.trim()) {
      errs.phoneNumber = 'Phone number is required';
    } else if (!/^[0-9+\s-]{10,14}$/.test(formData.phoneNumber.trim())) {
      errs.phoneNumber = 'Please enter a valid phone number (min 10 digits)';
    }
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email';
    }
    if (!formData.city.trim()) errs.city = 'Please enter your city / preferred location';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await submitFranchiseEnquiry(formData);
      setIsSuccess(true);
      setServerMessage(res.message);
    } catch (err: any) {
      setErrors({ form: err.message || 'Failed to submit enquiry. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-chocolate-darker/60 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#FFFDF9] w-full max-w-xl rounded-[2rem] shadow-2xl border-2 border-[#EED9C4] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-6 bg-gradient-to-r from-cream-100 to-cream-200 border-b border-cream-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-strawberry text-white flex items-center justify-center shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-chocolate">
                Franchise & Partnership Enquiry
              </h3>
              <p className="text-xs text-chocolate-muted">
                Super Deluxe Softies & Smiles Brand Expansion
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-strawberry hover:text-white text-chocolate flex items-center justify-center transition-colors shadow-xs border border-cream-border"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[75vh]">
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-display font-bold text-chocolate">
                Enquiry Received!
              </h4>
              <p className="text-sm text-chocolate-muted mt-2 max-w-md mx-auto font-medium">
                {serverMessage ||
                  'Thank you for your interest in Super Deluxe Softies. Our business development team will contact you shortly.'}
              </p>
              <div className="mt-6 p-4 rounded-2xl bg-cream-100 border border-cream-border text-xs text-chocolate-light font-medium text-left max-w-sm mx-auto">
                <p className="font-bold text-chocolate mb-1">Next steps:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Detailed franchise kit shared on email</li>
                  <li>Direct phone consultation with our operations team</li>
                  <li>Visit our flagship Guduvanchery store for product tasting</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="btn-primary mt-6 text-sm py-2.5 px-7"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.form && (
                <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2 border border-red-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errors.form}</span>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-chocolate uppercase tracking-wider mb-1">
                  Full Name <span className="text-strawberry">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Rajesh Kumar"
                  className={`w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-white border ${
                    errors.fullName ? 'border-red-500 bg-red-50/20' : 'border-cream-border'
                  } focus:outline-none focus:border-strawberry text-chocolate`}
                />
                {errors.fullName && <p className="text-[11px] text-red-500 mt-0.5">{errors.fullName}</p>}
              </div>

              {/* Phone and Email Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-chocolate uppercase tracking-wider mb-1">
                    Phone / WhatsApp <span className="text-strawberry">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="+91 98765 43210"
                    className={`w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-white border ${
                      errors.phoneNumber ? 'border-red-500 bg-red-50/20' : 'border-cream-border'
                    } focus:outline-none focus:border-strawberry text-chocolate`}
                  />
                  {errors.phoneNumber && (
                    <p className="text-[11px] text-red-500 mt-0.5">{errors.phoneNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-chocolate uppercase tracking-wider mb-1">
                    Email Address <span className="text-strawberry">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="rajesh@example.com"
                    className={`w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-white border ${
                      errors.email ? 'border-red-500 bg-red-50/20' : 'border-cream-border'
                    } focus:outline-none focus:border-strawberry text-chocolate`}
                  />
                  {errors.email && <p className="text-[11px] text-red-500 mt-0.5">{errors.email}</p>}
                </div>
              </div>

              {/* City and Enquiry Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-chocolate uppercase tracking-wider mb-1">
                    Target City / Location <span className="text-strawberry">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Tambaram, Chennai"
                    className={`w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-white border ${
                      errors.city ? 'border-red-500 bg-red-50/20' : 'border-cream-border'
                    } focus:outline-none focus:border-strawberry text-chocolate`}
                  />
                  {errors.city && <p className="text-[11px] text-red-500 mt-0.5">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-chocolate uppercase tracking-wider mb-1">
                    Enquiry Format
                  </label>
                  <select
                    value={formData.enquiryType}
                    onChange={(e: any) => setFormData({ ...formData, enquiryType: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-white border border-cream-border focus:outline-none focus:border-strawberry text-chocolate"
                  >
                    <option value="franchise">Dedicated Parlour (High Street)</option>
                    <option value="kiosk">Mall / Food Court Kiosk</option>
                    <option value="event">Event & Party Catering</option>
                    <option value="distribution">Distribution / Raw Material Supply</option>
                  </select>
                </div>
              </div>

              {/* Investment Budget */}
              <div>
                <label className="block text-xs font-bold text-chocolate uppercase tracking-wider mb-1">
                  Estimated Investment Budget
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['₹5L - ₹10L', '₹10L - ₹20L', '₹20L+'].map((range) => (
                    <button
                      key={range}
                      type="button"
                      onClick={() => setFormData({ ...formData, investmentRange: range })}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                        formData.investmentRange === range
                          ? 'bg-chocolate text-white border-chocolate'
                          : 'bg-white text-chocolate border-cream-border hover:bg-cream-100'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Message */}
              <div>
                <label className="block text-xs font-bold text-chocolate uppercase tracking-wider mb-1">
                  Additional Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your property status, experience, or timeline..."
                  className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-white border border-cream-border focus:outline-none focus:border-strawberry text-chocolate resize-none"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full justify-center text-sm py-3 font-display"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Submitting Enquiry...</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span>Submit Franchise Enquiry</span>
                      <Send className="w-4 h-4" />
                    </span>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-chocolate-muted text-center">
                Your contact details are encrypted and kept strictly confidential.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
