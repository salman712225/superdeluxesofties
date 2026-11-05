import React, { useEffect, useState } from 'react';
import { ArrowRight, Expand, X } from 'lucide-react';
import { MENU_CATEGORIES } from '../data/superDeluxeData';

interface MenuCategoriesProps {
  onSelectCategory: (categoryId: string) => void;
  language: 'en' | 'ta';
}

const MENU_POSTERS = [
  {
    title: 'The complete menu',
    detail: 'Signature sundaes, Jelly Crush cups, toppings and combo prices.',
    image: '/images/products/menu_board_01_WEB.jpg',
    alt: 'Super Deluxe menu board showing signature sundaes, Jelly Crush cups, toppings and combo prices',
    category: 'all',
    wide: true,
  },
  {
    title: 'Cones & Dips',
    detail: 'Single or double cones, plus creamy dip cups.',
    image: '/images/products/cones_menu_WEB.jpg',
    alt: 'Super Deluxe cones and dips menu poster',
    category: 'cones',
  },
  {
    title: 'Sundaes',
    detail: 'Big scoops, generous toppings and signature favourites.',
    image: '/images/products/sundae_menu_WEB.jpg',
    alt: 'Super Deluxe sundae menu poster with flavours and prices',
    category: 'sundaes',
  },
  {
    title: 'Combos made for sharing',
    detail: 'Find your favourite pairings and see the combo prices.',
    image: '/images/products/combo_menu_WEB.jpg',
    alt: 'Super Deluxe combo menu poster with available pairings and prices',
    category: 'combos',
  },
  {
    title: 'Hot Chocolate · New Launch',
    detail: 'Thick, creamy and chocolatey. ₹49 for 90 ml.',
    image: '/images/menu-items/hot-chocolate-launch.jpg',
    alt: 'New launch Hot Chocolate, 90 ml for ₹49',
    category: 'new-launch',
  },
  {
    title: '10 days, 10 flavours',
    detail: 'A new flavour pairing to look forward to each day.',
    image: '/images/products/10_days_10_flavours_poster_WEB.jpg',
    alt: 'Super Deluxe 10 days, 10 flavours poster',
    category: 'cones',
  },
];

interface QuickFavourite { name: string; price: string; category: string; detail?: string; featured?: boolean; }

const QUICK_FAVOURITES: QuickFavourite[] = [
  { name: 'Single Flavour Cone', price: '₹25', category: 'cones' },
  { name: 'Double Flavoured Cone', price: '₹30', category: 'cones' },
  { name: '125 ml Ice Cream Cup', price: '₹35', category: 'cups' },
  { name: '250 ml Ice Cream Cup', price: '₹60', category: 'cups' },
  { name: '125 ml Dip Cup', price: '₹50', category: 'cones' },
  { name: '250 ml Dip Cup', price: '₹80', category: 'cones' },
  { name: 'Sundae', price: '₹89', category: 'sundaes', featured: true },
  { name: 'Jelly Crush Cup', price: '₹60 / ₹99', detail: '125 ml / 250 ml', category: 'jelly' },
  { name: 'Hot Chocolate', price: '₹49', detail: 'New Launch · 90 ml', category: 'new-launch' },
];

export const MenuCategories: React.FC<MenuCategoriesProps> = ({ onSelectCategory, language }) => {
  const [selectedPoster, setSelectedPoster] = useState<(typeof MENU_POSTERS)[number] | null>(null);

  useEffect(() => {
    if (!selectedPoster) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedPoster(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedPoster]);

  return (
    <section id="menu" className="relative bg-[#FFF9F2] py-16 md:py-24">
      <div className="content-container">
        <div className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
          <span className="text-xs font-extrabold uppercase tracking-[.2em] text-strawberry">
            {language === 'ta' ? 'எங்கள் மெனு' : 'THE SUPER DELUXE MENU'}
          </span>
          <h2 className="mt-2 text-3xl font-bold text-chocolate sm:text-4xl md:text-5xl">
            {language === 'ta' ? 'உங்கள் அடுத்த விருப்பத்தைத் தேர்ந்தெடுங்கள்' : 'Find your next favourite'}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-relaxed text-chocolate-muted sm:text-base">
            Browse the menu boards for flavours and prices, or open a category to explore the treats.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {MENU_CATEGORIES.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => onSelectCategory(category.id)}
                className="rounded-full border border-[#EED9C4] bg-white px-4 py-2 text-xs font-bold text-chocolate shadow-sm transition hover:border-strawberry hover:text-strawberry"
              >
                {category.name} <span className="ml-1 text-chocolate-muted">→</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => onSelectCategory('all')}
              className="rounded-full bg-strawberry px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#C9162C]"
            >
              Full menu &amp; prices <span className="ml-1">→</span>
            </button>
          </div>
        </div>

        <div className="mb-10 overflow-hidden rounded-[1.75rem] bg-gradient-to-r from-[#071A50] via-[#102D7B] to-[#1646A5] p-5 text-white shadow-floating sm:p-8">
          <span className="text-[11px] font-extrabold uppercase tracking-[.24em] text-[#FFD34F]">Favourites</span>
          <h3 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Simple choices. Serious cravings.</h3>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
            {QUICK_FAVOURITES.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => onSelectCategory(item.category)}
                aria-label={`Explore ${item.name}, ${item.price}`}
                className={`min-h-[112px] rounded-2xl border px-4 py-4 text-left transition duration-200 hover:-translate-y-1 hover:shadow-lg sm:rounded-3xl sm:px-6 sm:py-5 ${item.featured ? 'border-strawberry bg-strawberry text-white' : 'border-white/15 bg-white/[.08] hover:bg-white/[.14]'}`}
              >
                <span className="block text-sm font-extrabold leading-snug sm:text-base">{item.name}</span>
                <span className={`mt-3 block text-2xl font-black sm:text-3xl ${item.featured ? 'text-white' : 'text-[#FFD34F]'}`}>{item.price}</span>
                {'detail' in item && <span className="mt-1 block text-xs text-white/70">{item.detail}</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {MENU_POSTERS.map((poster, index) => (
            <article
              key={poster.title}
              className={`group overflow-hidden rounded-[1.6rem] border border-[#EED9C4] bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-floating ${index === 0 ? 'sm:col-span-2' : ''}`}
            >
              <button
                type="button"
                onClick={() => setSelectedPoster(poster)}
                className={`relative block w-full overflow-hidden bg-[#FFF9F2] text-left ${poster.wide ? 'aspect-[3/2]' : 'aspect-[4/3]'}`}
                aria-label={`View ${poster.title} poster larger`}
              >
                <img src={poster.image} alt={poster.alt} loading={index < 2 ? 'eager' : 'lazy'} className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.015]" />
                <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-chocolate shadow-md">
                  <Expand className="h-3.5 w-3.5" /> View poster
                </span>
              </button>
              <div className="flex items-center justify-between gap-3 p-4 sm:p-5">
                <div>
                  <h3 className="font-display text-lg font-bold text-chocolate">{poster.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-chocolate-muted">{poster.detail}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectCategory(poster.category)}
                  aria-label={`Explore ${poster.title}`}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream-100 text-chocolate transition group-hover:bg-strawberry group-hover:text-white"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-5 text-center text-[11px] font-medium text-chocolate-muted">
          Menu boards open larger when tapped. Prices and availability may change at the parlour.
        </p>
      </div>

      {selectedPoster && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[#1d0f20]/90 p-3 backdrop-blur-sm sm:p-6"
          onClick={() => setSelectedPoster(null)}
          role="presentation"
        >
          <div className="relative flex max-h-full max-w-6xl flex-col items-center" onClick={(event) => event.stopPropagation()}>
            <button type="button" onClick={() => setSelectedPoster(null)} aria-label="Close poster" className="mb-3 self-end rounded-full bg-white p-2 text-chocolate shadow-lg hover:bg-strawberry hover:text-white">
              <X className="h-5 w-5" />
            </button>
            <img src={selectedPoster.image.replace('_WEB.jpg', '_ORIGINAL.png')} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = selectedPoster.image; }} alt={selectedPoster.alt} className="max-h-[82vh] max-w-full rounded-xl object-contain shadow-2xl" />
            <p className="mt-3 text-center text-sm font-bold text-white">{selectedPoster.title}</p>
          </div>
        </div>
      )}
    </section>
  );
};
