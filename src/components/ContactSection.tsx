import React from 'react';
import { MessageCircle, Mail, MapPin, Instagram, Clock, ExternalLink, Phone } from 'lucide-react';
import { STORE_INFO } from '../data/superDeluxeData';

interface ContactSectionProps {
  language: 'en' | 'ta';
}

export const ContactSection: React.FC<ContactSectionProps> = ({ language }) => {
  const contacts = [
    {
      id: 'whatsapp',
      icon: MessageCircle,
      title: 'WhatsApp Only',
      value: STORE_INFO.phoneDisplay,
      href: STORE_INFO.whatsappUrl,
      btnLabel: 'Send Message',
      badge: 'Fast Reply',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-400',
      iconBg: 'bg-emerald-500 text-white',
    },
    {
      id: 'email',
      icon: Mail,
      title: 'Email',
      value: STORE_INFO.email,
      href: `mailto:${STORE_INFO.email}`,
      btnLabel: 'Send Email',
      badge: 'Official',
      color: 'bg-red-50 text-red-700 border-red-200 hover:border-red-400',
      iconBg: 'bg-red-500 text-white',
    },
    {
      id: 'maps',
      icon: MapPin,
      title: 'Visit Us',
      value: 'SUPER DELUXE Softies (View on Maps)',
      href: STORE_INFO.mapsUrl,
      btnLabel: 'Get Directions',
      badge: 'Guduvanchery',
      color: 'bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-400',
      iconBg: 'bg-blue-600 text-white',
    },
    {
      id: 'instagram',
      icon: Instagram,
      title: 'Instagram',
      value: STORE_INFO.instagram,
      href: STORE_INFO.instagramUrl,
      btnLabel: 'Follow Us',
      badge: '@superdeluxe',
      color: 'bg-pink-50 text-pink-700 border-pink-200 hover:border-pink-400',
      iconBg: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white',
    },
  ];

  return (
    <section id="contact" className="py-16 md:py-24 bg-white border-t border-[#EED9C4]/60 relative">
      <div className="content-container">
        
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-strawberry font-display">
              {language === 'ta' ? 'தொடர்பு கொள்ள' : 'GET IN TOUCH'}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-chocolate">
            {language === 'ta' ? 'எங்களை சந்திக்கவும்' : 'All Contact Details & Location'}
          </h2>

          <div className="flex justify-center mt-3 mb-4">
            <span className="squiggly-accent"></span>
          </div>

          <p className="text-chocolate-muted text-sm sm:text-base font-medium">
            {language === 'ta'
              ? 'கூடுவாஞ்சேரி கிளையில் எங்களை நேரில் சந்திக்கவும் அல்லது வாட்ஸ்அப்பில் தொடர்பு கொள்ளவும்.'
              : 'Have a sweet craving, question, or party order? Reach out through our official channels.'}
          </p>
        </div>

        {/* 4 Contact Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {contacts.map((c) => {
            const IconComponent = c.icon;
            return (
              <a
                key={c.id}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group rounded-3xl p-6 border-2 transition-all duration-300 flex flex-col justify-between shadow-soft hover:shadow-medium hover:-translate-y-1.5 ${c.color}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs ${c.iconBg}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-white/90 border border-current shadow-2xs uppercase">
                      {c.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-display font-bold text-chocolate mb-1">
                    {c.title}
                  </h3>
                  <p className="text-xs font-semibold break-words opacity-90 line-clamp-2">
                    {c.value}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-current/15 flex items-center justify-between text-xs font-bold">
                  <span>{c.btnLabel}</span>
                  <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </a>
            );
          })}
        </div>

        {/* Location & Timings Detail Box */}
        <div className="mt-12 bg-cream-100 rounded-3xl p-6 sm:p-8 border border-cream-border flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white border border-cream-border flex items-center justify-center text-strawberry shadow-xs shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <h4 className="text-base font-display font-bold text-chocolate">
                  Store Hours: 11:00 AM – 11:00 PM (Everyday)
                </h4>
              </div>
              <p className="text-xs text-chocolate-muted mt-1 max-w-xl">
                SUPER DELUXE Softies, Guduvanchery, Chennai, Tamil Nadu 603202. Churning fresh pure-milk soft-serve cones, sundaes & dips all day long.
              </p>
            </div>
          </div>

          <a
            href={STORE_INFO.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-xs py-3 px-6 shrink-0 shadow-md"
          >
            <MapPin className="w-4 h-4" />
            <span>Open in Google Maps</span>
          </a>
        </div>

      </div>
    </section>
  );
};
