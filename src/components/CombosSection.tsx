import React from 'react';
import { ArrowRight, Sparkles, Tag, Plus } from 'lucide-react';
import { COMBOS_LIST } from '../data/superDeluxeData';
import { ComboItem } from '../types';

interface CombosSectionProps {
  onSelectCombo: (combo: ComboItem) => void;
  onViewAllCombos: () => void;
  language: 'en' | 'ta';
}

export const CombosSection: React.FC<CombosSectionProps> = ({
  onSelectCombo,
  onViewAllCombos,
  language,
}) => {
  return (
    <section id="combos" className="py-16 md:py-24 bg-white border-y border-[#EED9C4]/60 relative">
      <div className="content-container">
        
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-strawberry font-display">
              {language === 'ta' ? 'இணைந்த மகிழ்ச்சி' : 'BETTER TOGETHER'}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-chocolate">
            {language === 'ta' ? 'புன்னகை சேர்க்கும் காம்போஸ்' : 'Combos Made for Joy'}
          </h2>

          <div className="flex justify-center mt-3 mb-4">
            <span className="squiggly-accent"></span>
          </div>

          <p className="text-chocolate-muted text-sm sm:text-base font-medium">
            {language === 'ta'
              ? 'ஒன்றாக சுவைத்தால் இன்னும் இனிமை! குடும்பத்தினருடனும் நண்பர்களுடனும் பகிர்ந்து மகிழுங்கள்.'
              : 'Pair your favourite softies, loaded sundaes, and crunchy dips for double the delight.'}
          </p>
        </div>

        {/* 6 Combo Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {COMBOS_LIST.map((combo: ComboItem) => (
            <div
              key={combo.id}
              onClick={() => onSelectCombo(combo)}
              className="group bg-[#FFFDF9] rounded-3xl p-6 border-2 border-[#EED9C4] hover:border-strawberry/60 shadow-soft hover:shadow-floating hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer relative overflow-hidden"
            >
              {/* Savings Badge */}
              <div className="absolute top-4 right-4 z-10">
                <span className="badge-pill bg-strawberry text-white text-xs font-bold shadow-xs">
                  {combo.tag}
                </span>
              </div>

              <div>
                {/* Visual Area */}
                <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-cream-100 flex items-center justify-center p-3 mb-5 group-hover:bg-cream-200 transition-colors">
                  <img
                    src={combo.image}
                    alt={combo.name}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-108"
                    loading="lazy"
                  />
                </div>

                {/* Combo Title */}
                <h3 className="text-xl sm:text-2xl font-display font-bold text-chocolate group-hover:text-strawberry transition-colors">
                  {combo.name}
                </h3>
                <p className="text-xs font-bold text-chocolate-light mt-0.5 uppercase tracking-wider">
                  {combo.subtitle}
                </p>

                {/* Included Items Checklist */}
                <div className="mt-4 space-y-1.5 text-xs text-chocolate-muted font-medium">
                  {combo.itemsIncluded.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-strawberry"></span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing & CTA Row */}
              <div className="mt-6 pt-4 border-t border-cream-border flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-display font-bold text-chocolate">
                      ₹{combo.price}
                    </span>
                    {combo.originalPrice && (
                      <span className="text-xs text-chocolate-muted line-through font-semibold">
                        ₹{combo.originalPrice}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold block">
                    Instant savings of ₹{combo.savings}
                  </span>
                </div>

                <button
                  type="button"
                  className="w-10 h-10 rounded-full bg-cream-200 group-hover:bg-strawberry group-hover:text-white text-chocolate flex items-center justify-center transition-all duration-300 shadow-xs"
                  aria-label={`Select ${combo.name}`}
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Combos Action */}
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={onViewAllCombos}
            className="inline-flex items-center gap-2 text-sm font-bold text-chocolate hover:text-strawberry py-2.5 px-6 rounded-full bg-cream-100 hover:bg-cream-200 border border-cream-border transition-colors group"
          >
            <span>View All Combos</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

      </div>
    </section>
  );
};
