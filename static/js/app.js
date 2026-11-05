/**
 * Super Deluxe Softies & Smiles — Client Application Controller
 * Matches the Reference Mockup exact workflow:
 * - 10-day flavour rotation seamlessly powers "Today's Flavour" slots
 * - Real-time calculation from /api/featured-flavour (with deterministic fallback)
 * - Mobile drawer navigation
 * - Enquiry modal & form handling
 * - Interactive carousel & strip selection
 */

document.addEventListener('DOMContentLoaded', () => {
  // State
  const state = {
    featured: null,
    flavoursList: [],
    rotationConfig: null,
  };

  init();

  async function init() {
    setupMobileNav();
    setupEnquiryModal();
    setupFlavourStripClicks();
    setupLanguageSwitcher();
    setupEmotionCards();
    await loadRotationData();
  }

  // --------------------------------------------------------------------------
  // Language Switcher (English / Tamil removebg logos)
  // --------------------------------------------------------------------------
  function setupLanguageSwitcher() {
    const btnEN = document.getElementById('btnLangEN');
    const btnTA = document.getElementById('btnLangTA');
    const headerLogo = document.getElementById('siteHeaderLogo');
    const footerLogo = document.getElementById('footerLogoImg');

    const setLanguage = (lang) => {
      if (lang === 'ta') {
        if (headerLogo) headerLogo.src = '/static/bundle/01_Brand/logo_tamil.png';
        if (footerLogo) footerLogo.src = '/static/bundle/01_Brand/logo_tamil.png';
        if (btnTA) btnTA.classList.add('active');
        if (btnEN) btnEN.classList.remove('active');
      } else {
        if (headerLogo) headerLogo.src = '/static/bundle/01_Brand/logo_english.png';
        if (footerLogo) footerLogo.src = '/static/bundle/01_Brand/logo_english.png';
        if (btnEN) btnEN.classList.add('active');
        if (btnTA) btnTA.classList.remove('active');
      }
    };

    if (btnEN) btnEN.addEventListener('click', () => setLanguage('en'));
    if (btnTA) btnTA.addEventListener('click', () => setLanguage('ta'));
  }

  // --------------------------------------------------------------------------
  // Mr. Deluxe 10 Expressions 3D Interactive Flip Cards
  // --------------------------------------------------------------------------
  function setupEmotionCards() {
    const flipCards = document.querySelectorAll('.deluxe-flip-card');
    flipCards.forEach(card => {
      card.addEventListener('click', () => {
        card.classList.toggle('flipped');
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.classList.toggle('flipped');
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // Fetch Today's Flavour from Rotation Engine
  // --------------------------------------------------------------------------
  async function loadRotationData() {
    try {
      const res = await fetch('/api/featured-flavour');
      if (res.ok) {
        state.featured = await res.json();
        renderTodayFeatures(state.featured);
      } else {
        throw new Error('API returned status ' + res.status);
      }
    } catch (err) {
      console.warn('API request failed, calculating locally in Asia/Kolkata:', err);
      fallbackLocalCalculation();
    }
  }

  function fallbackLocalCalculation() {
    const todayStr = FlavourRotation.getKolkataDateString();
    const anchorStr = '2026-10-21';
    const rot = FlavourRotation.calculateRotation(todayStr, anchorStr, 10);

    const flavours = [
      { day: 1, name: 'Belgian Chocolate', sub: 'Rich. Smooth. Irresistibly Deluxe.', desc: 'Deep, rich and indulgent. A classic you\'ll crave.', img: '/static/bundle/02_Flavour_Campaign/chocolate_x_vanilla_WEB.jpg' },
      { day: 2, name: 'Strawberry', sub: 'Fresh. Sweet. Farm-picked joy.', desc: 'Sun-ripened strawberry swirl paired with sweet coulis glaze.', img: '/static/bundle/02_Flavour_Campaign/strawberry_x_vanilla_WEB.jpg' },
      { day: 3, name: 'Alphonso Mango', sub: 'Tropical. Golden. King of softies.', desc: 'Vibrant golden Ratnagiri Alphonso mango whipped with sweet milk.', img: '/static/bundle/02_Flavour_Campaign/alphonso_mango_x_vanilla_WEB.jpg' },
      { day: 4, name: 'Black Currant', sub: 'Royal. Zesty. Deep berry elegance.', desc: 'Dramatic wild blackcurrant swirl with tangy dark berry compote.', img: '/static/bundle/02_Flavour_Campaign/blackcurrant_x_vanilla_WEB.jpg' },
      { day: 5, name: 'Butterscotch', sub: 'Caramelized. Crunchy. Praline warmth.', desc: 'Warm brown sugar and cream softie with cashew praline crunch.', img: '/static/bundle/02_Flavour_Campaign/butterscotch_x_vanilla_WEB.jpg' },
      { day: 6, name: 'Pistachio', sub: 'Roasted. Nutty. Iranian Pista.', desc: 'Rich roasted pistachio churned with aromatic green cardamom.', img: '/static/bundle/02_Flavour_Campaign/pistachio_x_vanilla_WEB.jpg' },
      { day: 7, name: 'Pineapple', sub: 'Golden. Tangy. Tropical bliss.', desc: 'Sweet and tangy golden Queen Pineapple swirl whipped with milk.', img: '/static/bundle/02_Flavour_Campaign/pineapple_x_vanilla_WEB.jpg' },
      { day: 8, name: 'Rosemilk', sub: 'Blush. Fragrant. Damask Rose.', desc: 'Nostalgic Damask rose essence folded into rich dairy cream.', img: '/static/bundle/02_Flavour_Campaign/rosemilk_x_vanilla_WEB.jpg' },
      { day: 9, name: 'Badam Kulfi', sub: 'Shahi. Saffron. Crushed almonds.', desc: 'Royal Indian dessert soft-serve with kesar and mawa cream.', img: '/static/bundle/02_Flavour_Campaign/badam_kulfi_x_vanilla_WEB.jpg' },
      { day: 10, name: 'Coffee Bean', sub: 'Bold. Dark Roast. Chikmagalur.', desc: 'Chikmagalur dark-roast espresso cream balanced with sweet vanilla.', img: '/static/bundle/02_Flavour_Campaign/coffee_bean_x_vanilla_WEB.jpg' }
    ];

    const todayFlavour = flavours[rot.dayIndex];
    state.featured = {
      day: rot.displayDay,
      name: todayFlavour.name,
      tagline: todayFlavour.sub,
      description: todayFlavour.desc,
      image_url: todayFlavour.img
    };
    renderTodayFeatures(state.featured);
  }

  // --------------------------------------------------------------------------
  // Update "Today's Flavour" placeholders across the page
  // --------------------------------------------------------------------------
  function renderTodayFeatures(feat) {
    if (!feat) return;

    // 1. Hero Right Card
    const heroName = document.getElementById('heroTodayFlavourName');
    const heroSub = document.getElementById('heroTodayFlavourSub');
    const heroImg = document.getElementById('heroTodayCupImg');

    if (heroName) heroName.textContent = feat.name;
    if (heroSub) heroSub.textContent = feat.tagline || 'Rich. Smooth. Irresistibly Deluxe.';
    if (heroImg && feat.image_url) heroImg.src = feat.image_url;

    // 2. Section 04 Banner
    const bannerName = document.getElementById('bannerTodayFlavourName');
    const bannerSub = document.getElementById('bannerTodayFlavourSub');
    const bannerImg = document.getElementById('bannerTodayFlavourImg');

    if (bannerName) bannerName.textContent = feat.name;
    if (bannerSub) bannerSub.textContent = feat.description || 'Deep, rich and indulgent. A classic you\'ll crave.';
    if (bannerImg && feat.image_url) bannerImg.src = feat.image_url;

    // 3. Section 08: 10-Days Strip Active Item
    const stripItems = document.querySelectorAll('.flavour-strip-item');
    stripItems.forEach(item => {
      const itemDay = parseInt(item.dataset.day, 10);
      if (itemDay === feat.day) {
        item.classList.add('active');
        item.style.borderColor = 'var(--sd-gold)';
        item.style.background = 'rgba(255, 255, 255, 0.22)';
      } else {
        item.classList.remove('active');
        item.style.borderColor = '';
        item.style.background = '';
      }
    });
  }

  // --------------------------------------------------------------------------
  // Flavour Strip Interactive Clicks
  // --------------------------------------------------------------------------
  function setupFlavourStripClicks() {
    const stripItems = document.querySelectorAll('.flavour-strip-item');
    stripItems.forEach(item => {
      item.addEventListener('click', () => {
        stripItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        const name = item.querySelector('.flavour-strip-name').textContent;
        const img = item.querySelector('img').src;

        // Preview in Banner
        const bannerName = document.getElementById('bannerTodayFlavourName');
        const bannerImg = document.getElementById('bannerTodayFlavourImg');
        if (bannerName) bannerName.textContent = name;
        if (bannerImg) bannerImg.src = img;
      });
    });
  }

  // --------------------------------------------------------------------------
  // Mobile Navigation Drawer
  // --------------------------------------------------------------------------
  function setupMobileNav() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNavDrawer = document.getElementById('mobileNavDrawer');

    if (mobileMenuBtn && mobileNavDrawer) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileNavDrawer.classList.toggle('open');
      });

      document.querySelectorAll('.drawer-link').forEach(link => {
        link.addEventListener('click', () => {
          mobileNavDrawer.classList.remove('open');
        });
      });
    }
  }

  // --------------------------------------------------------------------------
  // Enquiry Modal Handling
  // --------------------------------------------------------------------------
  function setupEnquiryModal() {
    const enquiryModal = document.getElementById('enquiryModal');
    const btnNavEnquire = document.getElementById('btnNavEnquire');
    const btnEnquireModalOpen = document.getElementById('btnEnquireModalOpen');
    const btnCloseEnquiryModal = document.getElementById('btnCloseEnquiryModal');
    const enquiryForm = document.getElementById('enquiryForm');
    const enquirySuccessMsg = document.getElementById('enquirySuccessMsg');

    const openModal = (e) => {
      if (e) e.preventDefault();
      if (enquiryModal) {
        enquiryModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    };

    const closeModal = () => {
      if (enquiryModal) {
        enquiryModal.classList.remove('open');
        document.body.style.overflow = '';
      }
    };

    if (btnNavEnquire) btnNavEnquire.addEventListener('click', openModal);
    if (btnEnquireModalOpen) btnEnquireModalOpen.addEventListener('click', openModal);
    if (btnCloseEnquiryModal) btnCloseEnquiryModal.addEventListener('click', closeModal);

    if (enquiryModal) {
      enquiryModal.addEventListener('click', (e) => {
        if (e.target === enquiryModal) closeModal();
      });
    }

    if (enquiryForm) {
      enquiryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (enquirySuccessMsg) {
          enquirySuccessMsg.style.display = 'block';
          enquiryForm.reset();
          setTimeout(() => {
            enquirySuccessMsg.style.display = 'none';
            closeModal();
          }, 3000);
        }
      });
    }
  }
});
