import React from 'react';
import { X, ShieldCheck, FileText } from 'lucide-react';
import { STORE_INFO } from '../data/superDeluxeData';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'privacy' | 'terms';
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({
  isOpen,
  onClose,
  mode,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-chocolate-darker/60 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#FFFDF9] w-full max-w-2xl rounded-[2rem] shadow-2xl border-2 border-[#EED9C4] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-cream-100 border-b border-cream-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            {mode === 'privacy' ? (
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            ) : (
              <FileText className="w-6 h-6 text-strawberry" />
            )}
            <h3 className="text-xl font-display font-bold text-chocolate">
              {mode === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-strawberry hover:text-white text-chocolate flex items-center justify-center transition-colors shadow-xs"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[65vh] text-xs leading-relaxed text-chocolate/80 space-y-4">
          {mode === 'privacy' ? (
            <>
              <p>
                <strong>Last Updated:</strong> October 2026
              </p>
              <p>
                Super Deluxe Softies & Smiles ("we", "our", or "us") respects your privacy. This Privacy Policy outlines our procedures concerning the collection, use, and disclosure of details when you use our website or visit our parlour.
              </p>
              <h4 className="text-sm font-bold text-chocolate font-display pt-2">
                1. Information We Collect
              </h4>
              <p>
                We only collect voluntary information that you provide to us, such as your name, email, phone number, and city when submitting a franchise enquiry or requesting menu details.
              </p>
              <h4 className="text-sm font-bold text-chocolate font-display pt-2">
                2. How We Use Your Information
              </h4>
              <p>
                We use collected information solely to process business enquiries, reply to questions, and provide customer support. We will never sell, lease, or distribute your private contact details to third parties for marketing purposes.
              </p>
              <h4 className="text-sm font-bold text-chocolate font-display pt-2">
                3. Contact Us
              </h4>
              <p>
                For questions regarding this policy, contact us at{' '}
                <a href={`mailto:${STORE_INFO.email}`} className="text-strawberry underline">
                  {STORE_INFO.email}
                </a>{' '}
                or visit our store at {STORE_INFO.address}.
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>Last Updated:</strong> October 2026
              </p>
              <p>
                Welcome to Super Deluxe Softies & Smiles. By accessing our website or visiting our store, you agree to comply with and be bound by the following terms and conditions of use.
              </p>
              <h4 className="text-sm font-bold text-chocolate font-display pt-2">
                1. Product Availability & Pricing
              </h4>
              <p>
                All items and daily flavour rotations are churned on-site and subject to seasonal availability. Prices displayed in Indian Rupees (₹) are inclusive of all applicable taxes and subject to change without prior notice.
              </p>
              <h4 className="text-sm font-bold text-chocolate font-display pt-2">
                2. Intellectual Property
              </h4>
              <p>
                The trademark "Super Deluxe Softies & Smiles", "Mr. Deluxe" mascot illustrations, logo assets, design layout, and graphics are the exclusive property of Super Deluxe. Unauthorized reproduction is strictly prohibited.
              </p>
              <h4 className="text-sm font-bold text-chocolate font-display pt-2">
                3. Store Timings
              </h4>
              <p>
                Our standard store hours are 11:00 AM to 11:00 PM, subject to festival adjustments and local government guidelines.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-cream-100 border-t border-cream-border flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="btn-primary text-xs py-2 px-6"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
