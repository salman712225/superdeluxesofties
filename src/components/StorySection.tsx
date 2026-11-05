import React from 'react';
import { Sparkles, Milk, Users, Award, MapPin } from 'lucide-react';
import { STORE_INFO } from '../data/superDeluxeData';

interface StorySectionProps {
  language: 'en' | 'ta';
}

export const StorySection: React.FC<StorySectionProps> = ({ language }) => {
  const values = [
    {
      icon: Award,
      title: language === 'ta' ? 'உயர் தரம்' : 'Premium Quality',
      desc: language === 'ta' ? 'தூய பால், பிரீமியம் பொருட்கள்' : '100% farm-fresh cow milk & fine European cocoa',
    },
    {
      icon: Milk,
      title: language === 'ta' ? 'தினமும் புதியது' : 'Freshly Made Daily',
      desc: language === 'ta' ? 'ஒவ்வொரு நாளும் புதிய சுழற்சி' : 'Churned fresh on-site in small artisan batches',
    },
    {
      icon: Users,
      title: language === 'ta' ? 'குடும்பங்கள் விரும்பும்' : 'Kids & Family Friendly',
      desc: language === 'ta' ? 'அனைவருக்கும் மகிழ்ச்சியான சூழல்' : 'Joyful parlour atmosphere beloved by all generations',
    },
    {
      icon: Sparkles,
      title: language === 'ta' ? 'சிறந்த சுவை & விலை' : 'Great Taste, Great Value',
      desc: language === 'ta' ? 'மலிவு விலையில் பெருமகிழ்ச்சி' : 'Gourmet artisanal treats starting from just ₹39',
    },
  ];

  return (
    <section id="story" className="py-16 md:py-24 bg-white border-y border-[#EED9C4]/60 relative">
      <div className="content-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left: Real Storefront Photo with interactive location tag */}
          <div className="lg:col-span-5 relative group">
            <div className="relative overflow-hidden rounded-3xl shadow-medium border-4 border-cream-200">
              <img
                src="/images/storefront/storefront.jpg"
                alt="Super Deluxe Softies Parlour Storefront"
                className="w-full h-[360px] sm:h-[420px] md:h-[460px] object-cover object-center transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />

              {/* Gradient overlay on bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-chocolate-darker/80 via-transparent to-transparent"></div>

              {/* Verified Storefront Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-lg border border-cream-border flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-chocolate">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>SUPER DELUXE PARLOUR</span>
                  </div>
                  <p className="text-[11px] text-chocolate-muted mt-0.5">
                    Guduvanchery, Chennai • Open 11 AM - 11 PM
                  </p>
                </div>
                <a
                  href={STORE_INFO.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-strawberry hover:bg-strawberry-hover text-white text-xs font-bold py-2 px-3 rounded-xl flex items-center gap-1 transition-colors shadow-xs"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Visit</span>
                </a>
              </div>
            </div>

            {/* Corner Decorative Accent */}
            <div className="absolute -top-3 -left-3 bg-mango text-chocolate text-xs font-display font-bold py-1.5 px-3.5 rounded-full shadow-md border-2 border-white">
              ★ 100% Real Milk
            </div>
          </div>

          {/* Right: Story Headline, Copy & 4 Brand Values */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-strawberry font-display">
                {language === 'ta' ? 'எங்கள் கதை' : 'OUR STORY'}
              </span>
              <span className="squiggly-accent"></span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-chocolate leading-tight">
              {language === 'ta' ? (
                <>அன்போடு செய்து,<br />புன்னகையோடு வழங்குகிறோம்.</>
              ) : (
                <>Made with Love.<br />Served with Smiles.</>
              )}
            </h2>

            <p className="mt-4 sm:mt-5 text-base sm:text-lg text-chocolate-muted leading-relaxed font-medium">
              {language === 'ta'
                ? 'சூப்பர் டீலக்ஸ் சாஃப்டீஸில், உங்கள் அன்றாட தருணங்களில் மகிழ்ச்சியைக் கொண்டுவர ஒவ்வொரு ஸ்கூப்பும் மிகுந்த அக்கறையுடன் தயாரிக்கப்படுகிறது. கிளாசிக் சாஃப்டீஸ் முதல் சுவையான சண்டேக்கள் வரை, மகிழ்ச்சியை எளிதாக்குகிறோம்.'
                : 'At Super Deluxe Softies, every scoop is crafted with care to bring joy to your everyday moments. From classic softies to exciting treats, we make happiness simple, one scoop at a time.'}
            </p>

            {/* 4 Brand Values Grid */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {values.map((val, idx) => {
                const IconComponent = val.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-cream-100 hover:bg-cream-200 transition-colors border border-cream-border group"
                  >
                    <div className="p-2.5 rounded-xl bg-white text-strawberry shadow-xs border border-cream-border group-hover:scale-110 transition-transform">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-chocolate font-display">
                        {val.title}
                      </h4>
                      <p className="text-xs text-chocolate-muted mt-0.5 leading-snug">
                        {val.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pure Milk Guarantee Quote */}
            <div className="mt-7 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-center gap-3">
              <span className="text-2xl">🥛</span>
              <p className="text-xs sm:text-sm font-bold text-[#512D25]">
                {STORE_INFO.pureMilkPledge}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
