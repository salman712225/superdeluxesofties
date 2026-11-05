import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StorySection } from './components/StorySection';
import { MenuCategories } from './components/MenuCategories';
import { FeaturedFlavour } from './components/FeaturedFlavour';
import { MascotShowcase } from './components/MascotShowcase';
import { ReviewsSection } from './components/ReviewsSection';
import { CombosSection } from './components/CombosSection';
import { FlavourCarousel } from './components/FlavourCarousel';
import { FranchiseSection } from './components/FranchiseSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

import { MenuModal } from './components/MenuModal';
import { FranchiseModal } from './components/FranchiseModal';
import { PrivacyModal } from './components/PrivacyModal';

import { DAILY_FLAVOURS } from './data/superDeluxeData';
import { DailyFlavour, ComboItem } from './types';
import { fetchFeaturedFlavour } from './services/api';

export function App() {
  const [language, setLanguage] = useState<'en' | 'ta'>('en');
  const [todayFlavour, setTodayFlavour] = useState<DailyFlavour>(DAILY_FLAVOURS[0]);

  // Modal states
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [menuModalInitialCategory, setMenuModalInitialCategory] = useState<string>('all');
  const [isFranchiseModalOpen, setIsFranchiseModalOpen] = useState(false);
  const [legalModalMode, setLegalModalMode] = useState<'privacy' | 'terms' | null>(null);

  useEffect(() => {
    // Fetch live rotation engine featured flavour
    fetchFeaturedFlavour().then((flavour) => {
      if (flavour) setTodayFlavour(flavour);
    });
  }, []);

  const handleOpenMenuModal = (category: string = 'all') => {
    setMenuModalInitialCategory(category);
    setIsMenuModalOpen(true);
  };

  const handleSelectCombo = (combo: ComboItem) => {
    setMenuModalInitialCategory('combos');
    setIsMenuModalOpen(true);
  };

  const handleSelectFlavour = (flavour: DailyFlavour) => {
    setTodayFlavour(flavour);
    // Smooth scroll to today's flavour section
    const el = document.getElementById('todays-flavour');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F2] text-[#251714]">
      {/* 01: Navigation Bar */}
      <Navbar
        language={language}
        setLanguage={setLanguage}
        onOpenEnquiry={() => setIsFranchiseModalOpen(true)}
        onOpenMenuModal={handleOpenMenuModal}
      />

      <main className="flex-1">
        {/* 02: Hero Section ("A Little Scoop of Happiness") */}
        <HeroSection
          todayFlavour={todayFlavour}
          onExploreMenu={() => handleOpenMenuModal('all')}
          onSelectFlavour={handleSelectFlavour}
          language={language}
        />

        {/* 03: Our Story ("Made with Love. Served with Smiles.") */}
        <StorySection language={language} />

        {/* 04: Explore Our Menu (Softies, Sundaes, Jelly Crush, Dips, Combos) */}
        <MenuCategories
          onSelectCategory={handleOpenMenuModal}
          language={language}
        />

        {/* 05: Today's Flavour (Belgian Chocolate Dramatic Banner) */}
        <FeaturedFlavour
          flavour={todayFlavour}
          onTryToday={() => handleOpenMenuModal('cones')}
          language={language}
        />

        {/* 06: Meet Mr. Deluxe (6 Emotional Expressions) */}
        <MascotShowcase language={language} />

        {/* 07: Customer Reviews ("Loved by Our Guests ❤️") */}
        <ReviewsSection language={language} />

        {/* 08: Combos Section ("Combos Made for Joy") */}
        <CombosSection
          onSelectCombo={handleSelectCombo}
          onViewAllCombos={() => handleOpenMenuModal('combos')}
          language={language}
        />

        {/* 09: 10 Days • 10 Flavours Rotation Carousel */}
        <FlavourCarousel
          currentFlavour={todayFlavour}
          onSelectFlavour={handleSelectFlavour}
          language={language}
        />

        {/* 10: Partner with Super Deluxe (Franchise Section) */}
        <FranchiseSection
          onOpenEnquiryModal={() => setIsFranchiseModalOpen(true)}
          language={language}
        />

        {/* 11: Contact and Find Us (Location, Maps & Socials) */}
        <ContactSection language={language} />
      </main>

      {/* 12: Footer */}
      <Footer
        language={language}
        onOpenPrivacy={() => setLegalModalMode('privacy')}
        onOpenTerms={() => setLegalModalMode('terms')}
        onOpenEnquiry={() => setIsFranchiseModalOpen(true)}
      />

      {/* Interactive Modals */}
      <MenuModal
        isOpen={isMenuModalOpen}
        onClose={() => setIsMenuModalOpen(false)}
        initialCategory={menuModalInitialCategory}
        language={language}
      />

      <FranchiseModal
        isOpen={isFranchiseModalOpen}
        onClose={() => setIsFranchiseModalOpen(false)}
        language={language}
      />

      <PrivacyModal
        isOpen={legalModalMode !== null}
        onClose={() => setLegalModalMode(null)}
        mode={legalModalMode || 'privacy'}
      />
    </div>
  );
}

export default App;
