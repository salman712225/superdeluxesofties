import React, { useRef } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, Calendar, CheckCircle2 } from 'lucide-react';
import { DAILY_FLAVOURS } from '../data/superDeluxeData';
import { DailyFlavour } from '../types';

interface FlavourCarouselProps {
  currentFlavour: DailyFlavour;
  onSelectFlavour: (flavour: DailyFlavour) => void;
  language: 'en' | 'ta';
}

export const FlavourCarousel: React.FC<FlavourCarouselProps> = ({
  currentFlavour,
  onSelectFlavour,
  language,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="flavours-cycle" className="py-16 md:py-24 bg-[#14233c] text-white relative overflow-hidden">
      {/* Background Subtle Sparkles */}
      <div className="absolute top-10 left-10 text-white/10 text-6xl pointer-events-none select-none">
        ✨
      </div>
      <div className="absolute bottom-10 right-10 text-white/10 text-7xl pointer-events-none select-none">
        🍨
      </div>

      <div className="content-container relative z-10">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-300 font-display flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-300" />
                <span>DAILY ROTATION ENGINE</span>
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white">
              {language === 'ta' ? '10 நாட்கள் • 10 சுவைகள்' : '10 DAYS • 10 FLAVOURS'}
            </h2>

            <p className="text-blue-200 text-sm sm:text-base font-medium mt-1">
              {language === 'ta' ? 'தினமும் புதிதாக ஒன்று.' : 'Something new. Every single day.'}
            </p>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Scroll left"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Scroll right"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Track */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {DAILY_FLAVOURS.map((item: DailyFlavour) => {
            const isToday = currentFlavour.day === item.day;
            return (
              <div
                key={item.day}
                onClick={() => onSelectFlavour(item)}
                className={`snap-start shrink-0 w-[190px] sm:w-[220px] rounded-3xl p-4 sm:p-5 flex flex-col justify-between cursor-pointer transition-all duration-300 relative group ${
                  isToday
                    ? 'bg-gradient-to-b from-[#FFFDF9] to-[#FFF4E6] text-chocolate ring-4 ring-strawberry shadow-2xl scale-102'
                    : 'bg-white/10 hover:bg-white/15 text-white border border-white/15 hover:border-white/30'
                }`}
              >
                {/* Top Badge: Today or Day X */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      isToday
                        ? 'bg-strawberry text-white font-display'
                        : 'bg-white/15 text-blue-100'
                    }`}
                  >
                    {isToday ? "★ TODAY'S STAR" : item.dayLabel}
                  </span>
                  {isToday && (
                    <span className="w-2.5 h-2.5 rounded-full bg-strawberry animate-ping"></span>
                  )}
                </div>

                {/* Product Poster / Visual */}
                <div className="aspect-[4/5] w-full rounded-2xl overflow-hidden bg-white/5 flex items-center justify-center mb-4 p-2 relative group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={item.cardImage}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-xl"
                    loading="lazy"
                  />
                </div>

                {/* Flavor Name */}
                <div>
                  <h3 className={`text-base sm:text-lg font-display font-bold leading-tight ${
                    isToday ? 'text-chocolate' : 'text-white'
                  }`}>
                    {language === 'ta' && item.tamilName ? item.tamilName : item.name}
                  </h3>
                  <p className={`text-xs mt-1 line-clamp-2 leading-relaxed ${
                    isToday ? 'text-chocolate-muted' : 'text-blue-200'
                  }`}>
                    {item.tagline}
                  </p>
                </div>

                {/* Bottom Click to View */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className={`text-[11px] font-bold ${isToday ? 'text-strawberry' : 'text-amber-300'}`}>
                    {isToday ? 'Serving Now' : 'Click to preview'}
                  </span>
                  <span className="text-xs">→</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Row */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <a
            href="#todays-flavour"
            className="btn-primary text-sm py-3 px-8 shadow-glow-red"
          >
            <span>Check Today's Flavour →</span>
          </a>
          <span className="text-xs text-blue-200/80">
            Churned fresh at 11:00 AM everyday in Guduvanchery
          </span>
        </div>

      </div>
    </section>
  );
};
