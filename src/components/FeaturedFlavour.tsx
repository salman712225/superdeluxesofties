import React from 'react';
import { ArrowRight, Sparkles, Clock, MapPin, Heart } from 'lucide-react';
import { STORE_INFO } from '../data/superDeluxeData';
import { DailyFlavour } from '../types';

interface FeaturedFlavourProps {
  flavour: DailyFlavour;
  onTryToday: () => void;
  language: 'en' | 'ta';
}

export const FeaturedFlavour: React.FC<FeaturedFlavourProps> = ({
  flavour,
  onTryToday,
  language,
}) => {
  return (
    <section id="todays-flavour" className="py-16 md:py-24 bg-[#FFF9F2] relative">
      <div className="content-container">
        
        {/* Main Chocolate Feature Card Container */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#3B1E17] via-[#512D25] to-[#2E1610] text-white shadow-floating border-4 border-amber-900/30">
          {/* Subtle Ambient Chocolate Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 p-8 sm:p-12 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Column: Flavour Copy & Details */}
              <div className="lg:col-span-6 flex flex-col items-start text-left">
                {/* Badge Row */}
                <div className="flex flex-wrap items-center gap-2.5 mb-4">
                  <span className="badge-pill bg-strawberry text-white text-xs font-bold shadow-md">
                    {language === 'ta' ? 'இன்றைய சிறப்பு சுவை' : "TODAY'S FLAVOUR"}
                  </span>
                  <span className="text-xs font-bold text-amber-200/90 bg-white/10 backdrop-blur-xs px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Day {flavour.day} of 10-Day Rotation</span>
                  </span>
                </div>

                {/* Main Script Headline */}
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-script font-bold text-[#FFF9F2] tracking-wide leading-tight">
                  {language === 'ta' && flavour.tamilName ? flavour.tamilName : flavour.name}
                </h2>

                <p className="mt-3 text-lg sm:text-xl font-display text-amber-200 font-semibold">
                  {flavour.tagline}
                </p>

                <p className="mt-4 text-sm sm:text-base text-cream-200/90 max-w-lg leading-relaxed font-medium">
                  {flavour.description}
                </p>

                {/* Highlights */}
                <div className="mt-6 flex flex-wrap gap-4 text-xs font-bold text-amber-100">
                  <div className="flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-xl border border-white/10">
                    <span>🍫</span>
                    <span>European Dark Cocoa</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-xl border border-white/10">
                    <span>🥛</span>
                    <span>100% Pure Cow Milk</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-xl border border-white/10">
                    <span>✨</span>
                    <span>Only ₹49 / Scoop</span>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={onTryToday}
                    className="btn-primary text-base py-3.5 px-8 shadow-glow-red group"
                    id="try-todays-flavour-btn"
                  >
                    <span>{language === 'ta' ? 'இன்றே சுவைக்க →' : "Try Today's Flavour →"}</span>
                  </button>

                  <a
                    href={STORE_INFO.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-amber-200 hover:text-white transition-colors py-2 px-3 rounded-full hover:bg-white/10"
                  >
                    <MapPin className="w-3.5 h-3.5 text-strawberry" />
                    <span>Get Directions to Store</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Large Chocolate Product Image with Decorative Cutouts */}
              <div className="lg:col-span-6 flex justify-center relative">
                <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden p-4 flex items-center justify-center">
                  
                  {/* Subtle radial back glow */}
                  <div className="absolute inset-4 rounded-full bg-amber-500/20 filter blur-2xl"></div>

                  <img
                    src={flavour.cardImage || '/images/flavours/chocolate_x_vanilla_WEB.jpg'}
                    alt={flavour.name}
                    className="relative z-10 w-full h-full object-contain rounded-2xl drop-shadow-2xl transition-transform duration-500 hover:scale-105"
                  />

                  {/* Pure Milk Guarantee Floating Badge */}
                  <div className="absolute bottom-6 left-6 z-20 bg-white/95 backdrop-blur-md text-chocolate rounded-2xl py-2 px-4 shadow-xl border border-cream-border flex items-center gap-2">
                    <span className="text-xl">🍦</span>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-strawberry">Artisanal Soft-Serve</p>
                      <p className="text-xs font-display font-bold">Churned Every Morning</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
