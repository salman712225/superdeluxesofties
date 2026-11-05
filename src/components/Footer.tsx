import React from 'react';
import { MessageCircle, Instagram, MapPin, Heart, ArrowUp } from 'lucide-react';
import { STORE_INFO } from '../data/superDeluxeData';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenEnquiry: () => void;
  language: 'en' | 'ta';
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacy,
  onOpenTerms,
  onOpenEnquiry,
  language,
}) => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-b from-[#3B1E17] to-[#24110C] text-[#FFF4E6] pt-16 pb-8 border-t-4 border-amber-800/40 relative overflow-hidden">
      
      {/* Decorative background ambient glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-strawberry/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="content-container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Col 1: Brand & Slogan (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <a href="#hero" className="inline-block group mb-4">
              <div className="bg-white/95 hover:bg-white p-2.5 rounded-2xl shadow-md border border-white/20 inline-flex transition-transform group-hover:scale-105">
                <img
                  src="/images/brand/logo.png"
                  alt="Super Deluxe Softies & Smiles"
                  className="h-12 sm:h-14 w-auto object-contain"
                />
              </div>
            </a>

            <p className="text-sm text-cream-300 max-w-sm font-medium leading-relaxed">
              {language === 'ta'
                ? 'உங்களை சிரிக்க வைக்கும் சாஃப்டீஸ். என்றும் நிலைக்கும் இனிமையான நினைவுகள்.'
                : 'Softies that make you smile. Memories that stay forever.'}
            </p>

            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-amber-200">
              <span>🥛 100% Pure Milk</span>
              <span>•</span>
              <span>🌿 Pure Vegetarian</span>
            </div>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href={STORE_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-strawberry text-white flex items-center justify-center transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={STORE_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-emerald-600 text-white flex items-center justify-center transition-all duration-200"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href={STORE_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-blue-600 text-white flex items-center justify-center transition-all duration-200"
                aria-label="Google Maps"
              >
                <MapPin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-display font-bold text-amber-300 uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-cream-200">
              <li>
                <a href="#menu" className="hover:text-strawberry transition-colors">Menu</a>
              </li>
              <li>
                <a href="#todays-flavour" className="hover:text-strawberry transition-colors">Today's Flavour</a>
              </li>
              <li>
                <a href="#combos" className="hover:text-strawberry transition-colors">Combos</a>
              </li>
              <li>
                <a href="#flavours-cycle" className="hover:text-strawberry transition-colors">10 Days 10 Flavours</a>
              </li>
            </ul>
          </div>

          {/* Col 3: About Us (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-display font-bold text-amber-300 uppercase tracking-wider mb-4">
              About Us
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-cream-200">
              <li>
                <a href="#story" className="hover:text-strawberry transition-colors">Our Story</a>
              </li>
              <li>
                <a href="#mr-deluxe" className="hover:text-strawberry transition-colors">Mr. Deluxe</a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenEnquiry}
                  className="hover:text-strawberry transition-colors text-left"
                >
                  Franchise Enquiry
                </button>
              </li>
              <li>
                <a href="#reviews" className="hover:text-strawberry transition-colors">Guest Reviews</a>
              </li>
            </ul>
          </div>

          {/* Col 4: Corner Mascot Illustration (3 cols) */}
          <div className="lg:col-span-3 flex flex-col items-center sm:items-end justify-center relative">
            <div className="bg-white/5 rounded-3xl p-4 border border-white/10 flex flex-col items-center text-center">
              <img
                src="/images/expressions/happy_card.jpg"
                alt="Mr. Deluxe Waving"
                className="w-24 h-24 object-cover rounded-2xl border-2 border-amber-300 shadow-lg"
              />
              <span className="text-xs font-display font-bold text-amber-300 mt-2">
                "See you at the parlour!"
              </span>
              <p className="text-[11px] text-cream-300/80 mt-0.5">
                Guduvanchery, Chennai
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream-300/70">
          <p>
            © {currentYear} Super Deluxe Softies. All Rights Reserved.
          </p>

          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={onOpenPrivacy}
              className="hover:text-white transition-colors underline-offset-4 hover:underline"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={onOpenTerms}
              className="hover:text-white transition-colors underline-offset-4 hover:underline"
            >
              Terms & Conditions
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="p-2 rounded-full bg-white/10 hover:bg-strawberry text-white transition-colors"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
