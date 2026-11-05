# 🍦 Super Deluxe Softies & Smiles — Modern Web Application

A complete, production-quality, visually stunning, and highly responsive web application built for **Super Deluxe Softies & Smiles**, an ice cream and dessert brand based in Guduvanchery, Chennai.

Designed and engineered based on the official brand reference mock, incorporating the 12 signature sections, genuine brand assets, transparent mascot expressions, and an integrated daily flavour rotation engine.

---

## 🌟 Brand Identity & Visual System

- **Brand Name**: Super Deluxe
- **Tagline**: Softies & Smiles
- **Mascot**: Mr. Deluxe (a cheerful superhero soft-serve character with 6 emotional expressions)
- **Theme Palette**:
  - **Vanilla Cream**: `#FFF4E6` / `#FFF9F2` (warm, inviting background)
  - **Chocolate Brown**: `#512D25` / `#2E1610` (typography & footer)
  - **Strawberry Red**: `#E51D35` (primary interactive CTAs & accents)
  - **Soft Pink**: `#F6B9C9` (delicate highlights)
  - **Mango Yellow**: `#F5C85B` (energy & trust badges)
- **Typography**:
  - Headings: `Fredoka`, `Baloo 2` (playful, rounded display)
  - Body Copy: `Nunito`, `Inter` (clean, highly legible)
  - Decorative Scripts: `Dancing Script` (artisanal flavour names)

---

## 📐 12 Website Sections (Exact Reference Hierarchy)

1. **Navigation Bar**: Desktop single-row navigation, English/Tamil language toggle, status announcement bar with live store hours, "Enquire Now" CTA, and an accessible mobile slide-out drawer with Escape-key support.
2. **Hero Section ("A Little Scoop of Happiness")**: Primary headline, "Explore Menu" and "Find Us" CTAs, centered Mr. Deluxe superhero mascot showcase with golden pedestal, and Today's Flavour feature card.
3. **Our Story ("Made with Love. Served with Smiles.")**: Two-column layout featuring real Guduvanchery parlour photography and 4 core brand values (Premium Quality, Freshly Made Daily, Kids & Family Friendly, Great Taste Great Value).
4. **Explore Our Menu**: Interactive 5-category showcase (Softies, Sundaes, Jelly Crush, Dips, Combos) with squiggly decorative lines, item count, and full interactive parlour menu search modal.
5. **Today's Flavour ("Belgian Chocolate")**: High-impact rich chocolate banner with dark cocoa styling, tasting notes, and "Try Today's Flavour" action.
6. **Meet Mr. Deluxe**: Character showcase featuring 6 distinct emotions (Happy, Winking, Caring, Surprised, Confident, Victorious) with interactive dialogue bubble.
7. **Customer Reviews ("Loved by Our Guests ❤️")**: Verified Google reviews cards with 5-star ratings and a direct link to the parlour's Google Maps review profile.
8. **Combo Offers ("Combos Made for Joy")**: Verified menu pairings (Sundae + Sundae, Softie + Dips, Jelly Crush + Sundae) showcasing verified prices and instant savings.
9. **10 Days • 10 Flavours Rotation**: Touch-friendly carousel displaying all 10 calendar rotation flavours with today's live star highlighted.
10. **Partner with Super Deluxe**: Franchise & business partnership promotional card with full interactive validation form (modal).
11. **Contact & Find Us**: Direct semantic tap-to-action cards for WhatsApp (+91 94453 57733), Email, Store Directions (Google Maps), and Instagram (@superdeluxesofties).
12. **Footer**: Rich chocolate-brown footer with quick links, about us, help, legal privacy & terms modals, dynamic copyright year, and waving mascot illustration.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 with Vite 5 & TypeScript
- **Styling**: Tailwind CSS with custom theme tokens & responsive clamp() utilities
- **Icons**: Lucide React
- **Animations**: Framer Motion & CSS hardware-accelerated transitions
- **Accessibility**: ARIA labels, semantic HTML5, keyboard navigation, reduced-motion compliance

### Backend (Python FastAPI)
- **Framework**: Python 3.10+ with FastAPI & Uvicorn
- **Validation**: Pydantic v2 schemas
- **Storage**: Local JSON atomic persistence with optional MongoDB Atlas driver
- **Timezone**: `Asia/Kolkata` deterministic calendar day calculation engine

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v18+ or v20+)
- Python (3.9+)

### 1. Frontend Development

```bash
# Install frontend dependencies
npm install

# Start Vite development server
npm run dev
# The application will be running at http://localhost:3000

# To build for production
npm run build

# To preview the production bundle
npm run preview
```

### 2. Backend API Development (Optional / Integrated)

```bash
# Install Python dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn backend.app.main:app --reload --port 8000
# API documentation available at http://localhost:8000/docs
```

---

## 🌐 Deployment Instructions

### 1. Vercel Deployment (Frontend)
The frontend is completely self-contained and ready for zero-config Vercel deployment:
1. Push this repository to GitHub or GitLab.
2. In the [Vercel Dashboard](https://vercel.com/), click **Add New Project** and select this repo.
3. Vercel will automatically detect **Vite**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. In **Environment Variables**, add:
   - `VITE_API_URL`: Your deployed FastAPI backend URL (e.g., `https://superdeluxe-api.onrender.com`), or leave blank to use the built-in offline fallback.
5. Click **Deploy**.

### 2. Render Deployment (FastAPI Backend)
1. In the [Render Dashboard](https://render.com/), create a new **Web Service**.
2. Connect your repository.
3. Configure settings:
   - **Environment**: Python
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`
4. Set Environment Variables:
   - `ALLOWED_ORIGINS`: Your Vercel frontend URL (e.g. `https://superdeluxesofties.vercel.app`)
   - `MONGODB_URI`: (Optional) MongoDB connection string for cloud database.
5. Click **Create Web Service**.

### 3. MongoDB Atlas Configuration (Optional for Cloud Database)
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Under **Database Access**, create a user with read/write permissions.
3. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere).
4. Copy the connection string and paste it into your backend `.env` or Render environment variables:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/superdeluxe?retryWrites=true&w=majority
   DATABASE_NAME=superdeluxe_db
   ```

---

## 📱 Responsive Testing Checklist

Tested across all required screen dimensions with zero layout shift or text clipping:
- [x] **320px** (Ultra-compact mobile): Clean single-column layout, compact cards, 44px+ touch targets.
- [x] **360px & 375px** (Standard mobile): Fluid typography using `clamp()`, no horizontal overflow.
- [x] **390px & 430px** (Modern smartphones): Smooth slide-out mobile drawer with escape key handling.
- [x] **600px & 768px** (Tablets): 2-to-3 column adaptive grids for menu categories, reviews, and combos.
- [x] **1024px & 1280px** (Laptops): Balanced 3-column hero layout with mascot center stage and full nav.
- [x] **1440px & 1920px** (Full HD & Ultrawide): Fluid container capped at `1240px` with balanced whitespace.

---

## 🏢 Verified Store Information

- **Brand**: Super Deluxe Softies & Smiles
- **Address**: Guduvanchery, Chennai, Tamil Nadu 603202
- **Timings**: 11:00 AM – 11:00 PM Everyday
- **WhatsApp**: [+91 94453 57733](https://wa.me/919445357733)
- **Email**: superdeluxe.softies@gmail.com
- **Instagram**: [@superdeluxesofties](https://instagram.com/superdeluxesofties)
