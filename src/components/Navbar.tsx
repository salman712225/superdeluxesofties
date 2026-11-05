import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, MapPin, MessageCircle, Sparkles, Globe } from 'lucide-react';
import { STORE_INFO } from '../data/superDeluxeData';

interface NavbarProps {
  onOpenEnquiry: () => void;
  onOpenMenuModal: (category?: string) => void;
  language: 'en' | 'ta';
  setLanguage: (lang: 'en' | 'ta') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenEnquiry,
  onOpenMenuModal,
  language,
  setLanguage,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: language === 'ta' ? 'முகப்பு' : 'Home', href: '#hero' },
    { label: language === 'ta' ? 'மெனு' : 'Menu', href: '#menu' },
    { label: language === 'ta' ? 'இன்றைய சுவை' : "Today's Flavour", href: '#todays-flavour' },
    { label: language === 'ta' ? 'காம்போஸ்' : 'Combos', href: '#combos' },
    { label: language === 'ta' ? 'எங்கள் கதை' : 'About Us', href: '#story' },
    { label: language === 'ta' ? 'மிஸ்டர் டீலக்ஸ்' : 'Mr. Deluxe', href: '#mr-deluxe' },
    { label: language === 'ta' ? 'இருப்பிடம்' : 'Find Us', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top Announcement Bar */}
      <div className="bg-[#512D25] text-[#FFF4E6] text-xs font-semibold py-1.5 px-4 border-b border-[#3B1E17]/40">
        <div className="content-container flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="tracking-wide text-xs">
              <strong className="text-amber-300">OPEN TODAY:</strong> 11:00 AM – 11:00 PM Everyday
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <a
              href={STORE_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#FFF4E6] hover:text-emerald-400 transition-colors"
              aria-label="Contact on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp: +91 94453 57733</span>
            </a>
            <span className="hidden sm:inline text-amber-200/50">•</span>
            <a
              href={STORE_INFO.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-[#FFF4E6] hover:text-amber-300 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Guduvanchery, Chennai</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FFFDF9]/95 backdrop-blur-md shadow-md py-2.5 border-b border-[#EED9C4]'
            : 'bg-[#FFF9F2] py-3.5 border-b border-transparent'
        }`}
        aria-label="Main Navigation"
      >
        <div className="content-container flex items-center justify-between gap-4">
          {/* Brand Logo & Lang Switcher */}
          <div className="flex items-center gap-3">
            <a href="#hero" className="flex items-center gap-2 group" aria-label="Super Deluxe Home">
              <img
                src={language === 'ta' ? '/images/brand/logo_ta.png' : '/images/brand/logo.png'}
                alt="Super Deluxe Softies & Smiles"
                className="h-11 sm:h-12 md:h-14 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              />
            </a>

            {/* Language Toggle Pill */}
            <div className="hidden sm:flex items-center bg-[#FFF4E6] border border-[#EED9C4] rounded-full p-0.5 text-xs font-bold text-chocolate">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-full transition-colors ${
                  language === 'en'
                    ? 'bg-[#512D25] text-white shadow-xs'
                    : 'text-[#705D55] hover:text-chocolate'
                }`}
                aria-label="Switch to English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('ta')}
                className={`px-2.5 py-1 rounded-full transition-colors ${
                  language === 'ta'
                    ? 'bg-[#512D25] text-white shadow-xs'
                    : 'text-[#705D55] hover:text-chocolate'
                }`}
                aria-label="Switch to Tamil"
              >
                தமிழ்
              </button>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[15px] font-bold text-chocolate hover:text-strawberry transition-colors duration-150 relative py-1 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-strawberry transition-all duration-200 group-hover:w-full rounded-full"></span>
              </a>
            ))}
          </div>

          {/* Nav Right CTAs */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onOpenEnquiry}
              className="btn-primary text-sm py-2 px-4 sm:px-5 font-display tracking-wide"
              id="nav-enquire-btn"
            >
              <span>{language === 'ta' ? 'விசாரிக்க' : 'Enquire Now'}</span>
              <MessageCircle className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-[#FFF4E6] text-chocolate hover:bg-strawberry/10 hover:text-strawberry transition-colors border border-[#EED9C4]"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Backdrop & Menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-chocolate-dark/50 backdrop-blur-xs transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-[#FFFDF9] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-5 border-b border-[#EED9C4]">
                <img
                  src={language === 'ta' ? '/images/brand/logo_ta.png' : '/images/brand/logo.png'}
                  alt="Super Deluxe Logo"
                  className="h-10 w-auto"
                />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-cream-200 text-chocolate transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Language Switcher in Drawer */}
              <div className="mt-4 flex items-center justify-between bg-cream-200 p-2 rounded-xl">
                <span className="text-xs font-bold text-chocolate flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-strawberry" />
                  Language / மொழி
                </span>
                <div className="flex bg-white rounded-lg p-0.5 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1 rounded-md text-xs font-bold ${
                      language === 'en' ? 'bg-[#512D25] text-white' : 'text-chocolate'
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('ta')}
                    className={`px-3 py-1 rounded-md text-xs font-bold ${
                      language === 'ta' ? 'bg-[#512D25] text-white' : 'text-chocolate'
                    }`}
                  >
                    தமிழ்
                  </button>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="mt-6 flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-3 px-3 rounded-xl text-base font-bold text-chocolate hover:bg-cream-200 hover:text-strawberry transition-colors flex items-center justify-between"
                  >
                    <span>{link.label}</span>
                    <span className="text-strawberry font-mono text-sm">→</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="pt-6 border-t border-[#EED9C4] flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenEnquiry();
                }}
                className="btn-primary w-full justify-center text-sm py-3 font-display"
              >
                <span>{language === 'ta' ? 'உரிமை வினவல்' : 'Franchise Enquiry'}</span>
                <Sparkles className="w-4 h-4" />
              </button>

              <a
                href={STORE_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full justify-center text-sm py-2.5 border-emerald-600 text-emerald-800 hover:bg-emerald-50"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Chat on WhatsApp</span>
              </a>

              <p className="text-center text-xs text-chocolate-muted mt-2">
                Open Daily: 11:00 AM – 11:00 PM • Guduvanchery
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
