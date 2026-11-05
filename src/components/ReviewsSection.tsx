import React from 'react';
import { Star, ExternalLink, Heart, CheckCircle2 } from 'lucide-react';
import { CUSTOMER_REVIEWS, STORE_INFO } from '../data/superDeluxeData';
import { CustomerReview } from '../types';

interface ReviewsSectionProps {
  language: 'en' | 'ta';
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ language }) => {
  return (
    <section id="reviews" className="py-16 md:py-24 bg-[#FFF9F2] relative">
      <div className="content-container">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-strawberry font-display flex items-center gap-1.5">
              <span>REAL GOOGLE REVIEWS</span>
              <span className="text-emerald-500 font-bold">• 4.9 ★ Rating</span>
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-chocolate flex items-center justify-center gap-2">
            <span>{language === 'ta' ? 'வாடிக்கையாளர்களின் அன்பு' : 'LOVED BY OUR GUESTS'}</span>
            <span className="text-strawberry">❤️</span>
          </h2>

          <div className="flex justify-center mt-3 mb-4">
            <span className="squiggly-accent"></span>
          </div>

          <p className="text-chocolate-muted text-sm sm:text-base font-medium">
            {language === 'ta'
              ? 'கூடுவாஞ்சேரி சூப்பர் டீலக்ஸ் சாஃப்டீஸ் பற்றிய எங்கள் அன்பான விருந்தினர்களின் உண்மையான கருத்துக்கள்.'
              : 'Real, unedited feedback from our sweet guests at our Guduvanchery parlour.'}
          </p>
        </div>

        {/* Reviews Cards Grid (1 col on mobile, 2 on tablet, 3 on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CUSTOMER_REVIEWS.slice(0, 3).map((rev: CustomerReview) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-6 border border-[#EED9C4] shadow-soft hover:shadow-medium transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Author Info & Avatar */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full text-white font-bold text-sm flex items-center justify-center shadow-xs"
                      style={{ backgroundColor: rev.avatarBg }}
                    >
                      {rev.avatarLetter}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-chocolate leading-tight flex items-center gap-1">
                        <span>{rev.authorName}</span>
                        {rev.isVerified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 inline fill-blue-50" />
                        )}
                      </h4>
                      <p className="text-[11px] text-chocolate-muted">{rev.timeAgo}</p>
                    </div>
                  </div>

                  {/* Google G icon */}
                  <div className="w-6 h-6 rounded-full bg-cream-100 flex items-center justify-center text-xs font-bold text-blue-600 border border-cream-border">
                    G
                  </div>
                </div>

                {/* 5 Gold Stars */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>

                {/* Review Body */}
                <p className="text-xs sm:text-sm text-chocolate/90 leading-relaxed font-medium">
                  "{rev.text}"
                </p>
              </div>

              {/* Bottom tag */}
              <div className="mt-5 pt-3 border-t border-cream-border/60 flex items-center justify-between text-[11px] text-chocolate-muted font-bold">
                <span>Verified Google Review</span>
                <span className="text-emerald-600">★★★★★</span>
              </div>
            </div>
          ))}
        </div>

        {/* View All Reviews on Google Link */}
        <div className="mt-10 text-center">
          <a
            href={STORE_INFO.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold text-chocolate hover:text-strawberry py-2.5 px-6 rounded-full bg-white border border-[#EED9C4] shadow-soft hover:shadow-md transition-all group"
          >
            <span className="text-blue-600 font-extrabold font-sans">G</span>
            <span>View All Reviews on Google</span>
            <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

      </div>
    </section>
  );
};
