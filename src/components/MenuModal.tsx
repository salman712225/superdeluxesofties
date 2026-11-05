import React, { useEffect, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { MENU_CATEGORIES, MENU_SECTIONS } from '../data/superDeluxeData';

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: string;
  language: 'en' | 'ta';
}

export const MenuModal: React.FC<MenuModalProps> = ({ isOpen, onClose, initialCategory = 'all' }) => {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => setActiveCategory(initialCategory), [initialCategory, isOpen]);
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen, onClose]);

  const visibleSections = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return MENU_SECTIONS.filter((section) => activeCategory === 'all' || section.id === activeCategory)
      .map((section) => ({ ...section, lines: section.lines.filter((line) => !query || `${line.name} ${line.price || ''} ${line.note || ''} ${section.title}`.toLowerCase().includes(query)) }))
      .filter((section) => section.lines.length > 0);
  }, [activeCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-chocolate-darker/70 p-2 backdrop-blur-sm sm:p-4" onClick={onClose}>
      <div className="flex max-h-[94vh] w-full max-w-7xl flex-col overflow-hidden rounded-[1.75rem] border border-[#EED9C4] bg-[#FFFDF9] shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-cream-border bg-gradient-to-r from-cream-100 to-cream-200 p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <img src="/images/brand/logo.png" alt="Super Deluxe" className="h-12 w-12 rounded-xl bg-white p-1 object-contain shadow-sm sm:h-14 sm:w-14" />
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[.2em] text-strawberry">Softies &amp; Smiles</span>
              <h2 className="mt-1 font-display text-2xl font-bold text-chocolate sm:text-3xl">Menu &amp; prices</h2>
              <p className="mt-1 text-xs text-chocolate-muted">Choose a treat, size, flavour and topping.</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close menu" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cream-border bg-white text-chocolate transition hover:bg-strawberry hover:text-white"><X className="h-5 w-5" /></button>
        </div>

        <div className="shrink-0 border-b border-cream-border bg-white p-3 sm:p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-xs">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-chocolate-muted" />
              <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search the menu…" aria-label="Search menu" className="w-full rounded-full border border-cream-border bg-cream-100 py-2.5 pl-10 pr-4 text-sm text-chocolate outline-none focus:border-strawberry focus:bg-white" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button type="button" onClick={() => setActiveCategory('all')} className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold ${activeCategory === 'all' ? 'bg-chocolate text-white' : 'bg-cream-100 text-chocolate hover:bg-cream-200'}`}>Full Menu</button>
              {MENU_CATEGORIES.map((category) => <button key={category.id} type="button" onClick={() => setActiveCategory(category.id)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold ${activeCategory === category.id ? 'bg-chocolate text-white' : 'bg-cream-100 text-chocolate hover:bg-cream-200'}`}>{category.name}</button>)}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#FFF9F2] p-3 sm:p-6">
          {visibleSections.length === 0 ? <div className="py-16 text-center"><span className="text-4xl">🍦</span><h3 className="mt-3 font-display text-xl font-bold text-chocolate">No menu items found</h3><p className="mt-1 text-sm text-chocolate-muted">Try another flavour or category.</p></div> : (
            <div className="space-y-7">
              {visibleSections.map((section) => (
                <section key={section.id} className="rounded-[1.6rem] border border-[#EED9C4] bg-white p-4 shadow-sm sm:p-6">
                  <div className="mb-4 flex items-center justify-between gap-4 sm:mb-5">
                    <div>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="font-display text-xl font-bold text-chocolate sm:text-2xl">{section.title}</h3>
                        {section.startingAt && <span className="rounded-full bg-[#FFF2F3] px-3 py-1 text-[11px] font-extrabold text-strawberry">From {section.startingAt}</span>}
                      </div>
                      <p className="mt-1 text-xs text-chocolate-muted sm:text-sm">{section.subtitle}</p>
                    </div>
                    <img src={section.image} alt="" loading="lazy" className="hidden h-14 w-20 shrink-0 rounded-xl bg-cream-100 object-cover sm:block" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
                    {section.lines.map((line) => (
                      <article key={line.name} className="group overflow-hidden rounded-2xl border border-[#F0E1D2] bg-[#FFFCF8] transition duration-200 hover:-translate-y-0.5 hover:border-strawberry/35 hover:shadow-md">
                        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-[#FFF5E9] p-2 sm:p-3">
                          {line.image && <img src={line.image} alt={line.name} loading="lazy" className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.03]" />}
                          {line.price && <span className="absolute right-2 top-2 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-extrabold text-strawberry shadow-sm">{line.price}</span>}
                        </div>
                        <div className="p-3 sm:p-3.5">
                          <h4 className="min-h-[2.5rem] text-xs font-extrabold leading-snug text-chocolate sm:text-sm">{line.name}</h4>
                          {line.note && <p className="mt-1 text-[10px] leading-relaxed text-chocolate-muted sm:text-[11px]">{line.note}</p>}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
          <div className="mt-5 rounded-2xl border border-[#EED9C4] bg-white p-4 text-center text-xs font-semibold text-chocolate-muted">
            Take-away charge: ₹5 (may apply). Prices and availability may change at the parlour.
          </div>
        </div>
        <div className="flex shrink-0 items-center justify-between gap-4 border-t border-cream-border bg-cream-100 px-4 py-3 text-xs font-bold text-chocolate sm:px-6">
          <span>Guduvanchery Parlour · 11 AM–11 PM</span>
          <button type="button" onClick={onClose} className="btn-primary px-5 py-2 text-xs">Done</button>
        </div>
      </div>
    </div>
  );
};
