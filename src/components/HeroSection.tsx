import React from 'react';
import { ArrowRight, MapPin, Sparkles, Heart } from 'lucide-react';
import { STORE_INFO } from '../data/superDeluxeData';
import { DailyFlavour } from '../types';

interface HeroSectionProps {
  todayFlavour: DailyFlavour;
  onExploreMenu: () => void;
  onSelectFlavour: (flavour: DailyFlavour) => void;
  language: 'en' | 'ta';
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  todayFlavour,
  onExploreMenu,
  onSelectFlavour,
  language,
}) => {
  return (
    <section id="hero" className="relative overflow-hidden pt-6 pb-14 md:pt-10 md:pb-20 bg-gradient-to-b from-[#FFF9F2] via-[#FFF4E6] to-[#FFF9F2]">
      {/* Decorative background swirls and sparkles */}
      <div className="absolute top-10 left-4 text-strawberry/15 pointer-events-none select-none text-4xl animate-pulse-subtle">
        ✨
      </div>
      <div className="absolute bottom-16 right-8 text-mango/20 pointer-events-none select-none text-5xl">
        🍨
      </div>
      <div className="absolute top-1/2 left-[-60px] w-48 h-48 rounded-full bg-strawberry-pink/20 blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/4 right-[-40px] w-64 h-64 rounded-full bg-mango-light/40 blur-3xl pointer-events-none"></div>

      <div className="content-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
          
          {/* ========================================================
              LEFT COLUMN: HERO COPY & CALLS TO ACTION
              ======================================================== */}
          <div className="lg:col-span-5 text-center lg:text-left flex flex-col items-center lg:items-start">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-strawberry-light/80 border border-strawberry/20 text-strawberry text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? '100% தூய பால் ஐஸ்கிரீம்' : '100% Pure Milk • Churned Fresh Daily'}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-chocolate leading-[1.08] tracking-tight">
              {language === 'ta' ? (
                <>
                  மகிழ்ச்சியின்<br />
                  <span className="text-strawberry">ஒரு சிறிய</span><br />
                  ஸ்கூப்.
                </>
              ) : (
                <>
                  A Little<br />
                  <span className="text-strawberry">Scoop of</span><br />
                  Happiness.
                </>
              )}
            </h1>

            <p className="mt-4 sm:mt-5 text-base sm:text-lg text-chocolate-muted max-w-md font-medium leading-relaxed">
              {language === 'ta'
                ? 'க்ரீமி சாஃப்டீஸ். மகிழ்ச்சியான புன்னகைகள். இனிய நாட்களுக்கும் நினைவுகளுக்கும் உருவாக்கப்பட்டது.'
                : 'Creamy softies. Happy smiles. Made for good days and sweeter memories.'}
            </p>

            <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={onExploreMenu}
                className="btn-primary text-base py-3 px-6 sm:px-7 shadow-glow-red group"
                id="hero-explore-menu-btn"
              >
                <span>{language === 'ta' ? 'மெனுவை பார்க்க' : 'Explore Menu'}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href="#contact"
                className="btn-secondary text-base py-3 px-6"
                id="hero-find-us-btn"
              >
                <MapPin className="w-4 h-4 text-strawberry" />
                <span>{language === 'ta' ? 'இருப்பிடம்' : 'Find Us'}</span>
              </a>
            </div>

            {/* Quick Micro Badges */}
            <div className="mt-8 flex items-center justify-center lg:justify-start gap-4 text-xs font-bold text-chocolate/80">
              <div className="flex items-center gap-1.5 bg-white/80 py-1.5 px-3 rounded-full border border-cream-border shadow-2xs">
                <span>🥛</span>
                <span>Real Cow Milk</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 py-1.5 px-3 rounded-full border border-cream-border shadow-2xs">
                <span>🌿</span>
                <span>100% Pure Veg</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 py-1.5 px-3 rounded-full border border-cream-border shadow-2xs">
                <span>⭐</span>
                <span>From ₹39</span>
              </div>
            </div>
          </div>

          {/* ========================================================
              CENTER COLUMN: MR. DELUXE MASCOT
              ======================================================== */}
          <div className="lg:col-span-3 flex justify-center order-first lg:order-none my-2 lg:my-0">
            <div className="relative group cursor-pointer max-w-[240px] sm:max-w-[270px] w-full">
              {/* Ambient Warm Pedestal Glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-mango/40 via-amber-200/30 to-transparent rounded-[2.8rem] filter blur-xl scale-95 transition-transform group-hover:scale-105 pointer-events-none"></div>

              {/* Framed Mascot Showcase Card */}
              <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-sky-400 to-blue-600 shadow-floating border-4 border-amber-300 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl">
                <img
                  src="/images/mascot/mr_deluxe_superhero.png"
                  alt="Mr. Deluxe Superhero Mascot"
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="eager"
                />

                {/* Overlaid Mascot Badge */}
                <div className="absolute bottom-3 inset-x-3 bg-white/95 backdrop-blur-md rounded-2xl py-1.5 px-3 shadow-md flex items-center justify-center gap-1.5 border border-cream-border">
                  <Heart className="w-3.5 h-3.5 text-strawberry fill-strawberry" />
                  <span className="text-xs font-display font-bold text-chocolate">Mr. Deluxe</span>
                  <span className="text-[10px] text-strawberry font-bold">• Super Hero</span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN: TODAY'S FLAVOUR HERO CARD
              ======================================================== */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="w-full max-w-sm bg-gradient-to-br from-[#FFF4E6] to-[#FFFDF9] rounded-3xl p-6 sm:p-7 border border-[#EED9C4] shadow-medium relative group hover:shadow-floating transition-all duration-300">
              {/* Top Row: Badge & Date */}
              <div className="flex items-center justify-between mb-3">
                <span className="badge-pill bg-strawberry text-white text-[11px] font-bold shadow-xs">
                  {language === 'ta' ? 'இன்றைய சிறப்பு சுவை' : "TODAY'S FLAVOUR"}
                </span>
                <span className="text-[11px] font-bold text-chocolate-muted bg-white/90 px-2.5 py-0.5 rounded-full border border-cream-border">
                  Day {todayFlavour.day} of 10
                </span>
              </div>

              {/* Flavor Title & Script Subtitle */}
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-chocolate leading-tight">
                {language === 'ta' && todayFlavour.tamilName ? todayFlavour.tamilName : todayFlavour.name}
              </h2>

              <p className="font-script text-xl sm:text-2xl text-chocolate-light font-bold mt-0.5">
                {todayFlavour.tagline || 'Rich. Smooth. Irresistibly Deluxe.'}
              </p>

              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => onSelectFlavour(todayFlavour)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-chocolate hover:text-strawberry border-b-2 border-chocolate hover:border-strawberry pb-0.5 transition-colors"
                >
                  <span>{language === 'ta' ? 'இன்றே சுவைக்க' : 'Try Today'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Product Visual Container with rich chocolate softie cup */}
              <div className="relative mt-4 aspect-square max-h-[220px] mx-auto flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-t from-chocolate-dark/5 to-transparent">
                <img
                  src={todayFlavour.cardImage || '/images/flavours/chocolate_x_vanilla_WEB.jpg'}
                  alt={todayFlavour.name}
                  className="w-full h-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
                />

                {/* Floating Price Pill */}
                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs text-chocolate font-display font-bold text-xs py-1 px-3 rounded-full shadow-md border border-cream-border">
                  From ₹49
                </div>
              </div>

              {/* Carousel Pagination Dots */}
              <div className="mt-5 flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      const target = (todayFlavour.day === d) ? todayFlavour : undefined;
                      if (target) onSelectFlavour(target);
                    }}
                    className={`h-2 rounded-full transition-all duration-200 ${
                      todayFlavour.day === d
                        ? 'w-6 bg-strawberry'
                        : 'w-2 bg-[#EED9C4] hover:bg-chocolate/40'
                    }`}
                    aria-label={`Go to day ${d}`}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
