import React, { useState } from 'react';
import { Heart, Sparkles, MessageCircle } from 'lucide-react';
import { MASCOT_EXPRESSIONS } from '../data/superDeluxeData';
import { MascotExpression } from '../types';

interface MascotShowcaseProps {
  language: 'en' | 'ta';
}

export const MascotShowcase: React.FC<MascotShowcaseProps> = ({ language }) => {
  const [selectedExpression, setSelectedExpression] = useState<MascotExpression>(MASCOT_EXPRESSIONS[0]);

  return (
    <section id="mr-deluxe" className="py-16 md:py-24 bg-white relative border-y border-[#EED9C4]/60">
      <div className="content-container">
        
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-strawberry font-display">
              {language === 'ta' ? 'எங்கள் சின்னம்' : 'OUR ICONIC MASCOT'}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-chocolate">
            {language === 'ta' ? 'வணக்கம் சொல்லுங்கள் — மிஸ்டர் டீலக்ஸ்' : 'SAY HELLO TO Mr. Deluxe'}
          </h2>

          <div className="flex justify-center mt-3 mb-4">
            <span className="squiggly-accent"></span>
          </div>

          <p className="text-chocolate-muted text-sm sm:text-base font-medium">
            {language === 'ta'
              ? 'பல உணர்வுகள், ஒரே தூய இதயம்! ஒவ்வொரு நாளும் உங்கள் முகத்தில் புன்னகையை கொண்டு வர இங்கே இருக்கிறார்.'
              : 'Many expressions, one pure heart! Churning happiness, pure milk, and cheerful smiles everyday.'}
          </p>
        </div>

        {/* Mascot Interactive Dialogue Bubble */}
        <div className="max-w-xl mx-auto mb-10 bg-gradient-to-r from-cream-100 to-cream-200 border-2 border-amber-300 rounded-3xl p-5 shadow-soft flex items-center gap-4 transition-all duration-300">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-strawberry shadow-xs shrink-0">
            <img
              src={selectedExpression.image}
              alt={selectedExpression.label}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-display font-bold text-strawberry uppercase tracking-wider">
                Mr. Deluxe says ({selectedExpression.label}):
              </span>
              <span className="text-xs">✨</span>
            </div>
            <p className="text-sm font-bold text-chocolate mt-0.5 italic">
              "{selectedExpression.quote}"
            </p>
          </div>
        </div>

        {/* 6 Expression Cards Grid (2 cols on mobile, 3 on tablet, 6 on desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {MASCOT_EXPRESSIONS.map((expr: MascotExpression) => {
            const isSelected = selectedExpression.id === expr.id;
            return (
              <div
                key={expr.id}
                onClick={() => setSelectedExpression(expr)}
                className={`group rounded-3xl p-3.5 border transition-all duration-300 flex flex-col items-center text-center cursor-pointer relative ${
                  isSelected
                    ? 'bg-cream-200 border-strawberry shadow-medium scale-102 ring-2 ring-strawberry/30'
                    : 'bg-[#FFFDF9] border-[#EED9C4] shadow-soft hover:shadow-medium hover:-translate-y-1 hover:border-strawberry/50'
                }`}
              >
                {/* Expression Image Container */}
                <div className="aspect-square w-full rounded-2xl overflow-hidden bg-cream-100 flex items-center justify-center mb-3 group-hover:bg-white transition-colors">
                  <img
                    src={expr.image}
                    alt={`Mr. Deluxe ${expr.label}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Emotion Label */}
                <h4 className="text-sm font-display font-bold text-chocolate group-hover:text-strawberry transition-colors">
                  {expr.label}
                </h4>

                <span className="text-[10px] text-chocolate-muted mt-0.5 leading-tight">
                  {expr.tag}
                </span>

                {/* Selected Indicator */}
                {isSelected && (
                  <span className="mt-2 w-2 h-2 rounded-full bg-strawberry animate-ping"></span>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
