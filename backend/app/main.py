import os
from pathlib import Path
from typing import List, Optional
from datetime import datetime
import uuid

from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

try:
    from backend.app.models import (
        FeaturedFlavourResponse,
        FlavoursListResponse,
        RotationConfig,
        UpdateFlavourRequest,
        ReorderFlavoursRequest,
        UpdateRotationConfigRequest,
        CategoryModel,
        ProductModel,
        ComboModel,
        ReviewModel,
        FranchiseEnquiryRequest,
        FranchiseEnquiryResponse,
    )
    from backend.app.service import FlavourRotationService, RotationValidationError
except ImportError:
    from app.models import (
        FeaturedFlavourResponse,
        FlavoursListResponse,
        RotationConfig,
        UpdateFlavourRequest,
        ReorderFlavoursRequest,
        UpdateRotationConfigRequest,
        CategoryModel,
        ProductModel,
        ComboModel,
        ReviewModel,
        FranchiseEnquiryRequest,
        FranchiseEnquiryResponse,
    )
    from app.service import FlavourRotationService, RotationValidationError

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DIST_DIR = BASE_DIR / "dist"
STATIC_DIR = BASE_DIR / "static"

app = FastAPI(
    title="Super Deluxe Softies & Smiles — API Engine",
    version="2.0.0",
    description="Unified API for 10-day soft-serve rotation, menu items, combos, customer reviews, and franchise management.",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Service instance
rotation_service = FlavourRotationService()

# In-memory store for franchise enquiries (optionally persisted or backed by MongoDB Atlas)
ENQUIRIES_DB = []


@app.get("/api/health")
def health():
    now_dt = rotation_service.get_now()
    return {
        "status": "healthy",
        "current_time_ist": now_dt.isoformat(),
        "timezone": "Asia/Kolkata",
        "brand": "Super Deluxe Softies & Smiles",
    }


# ============================================================================
# ROTATION & FLAVOURS ENDPOINTS
# ============================================================================

@app.get("/api/featured-flavour", response_model=FeaturedFlavourResponse)
def get_featured_flavour():
    """Returns today's automatically calculated featured flavour in Asia/Kolkata."""
    try:
        return rotation_service.get_featured_flavour()
    except RotationValidationError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@app.get("/api/flavours", response_model=FlavoursListResponse)
def get_flavours():
    """Returns the complete 10-day flavour rotation sequence with today's flavour flagged."""
    try:
        return rotation_service.get_all_flavours_sequence()
    except RotationValidationError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@app.get("/api/rotation-config", response_model=RotationConfig)
def get_rotation_config():
    """Returns the current rotation configuration."""
    data = rotation_service.get_data()
    return RotationConfig(
        anchor_date=data.anchor_date,
        timezone=data.timezone,
        cycle_length=data.cycle_length,
        reorder_policy=data.reorder_policy,
    )


@app.get("/api/preview")
def preview_date(date: str = Query(..., description="Target date in YYYY-MM-DD format")):
    """Calculates what flavour is featured on any specific calendar date."""
    try:
        return rotation_service.preview_date(date)
    except RotationValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


# ============================================================================
# MENU, COMBOS & REVIEWS ENDPOINTS
# ============================================================================

CATEGORIES_DATA = [
    {
        "id": "softies",
        "name": "Softies",
        "short_desc": "Creamy classics that never fail.",
        "image": "/images/products/vanilla_softie_cone_WEB.jpg",
        "badge": "Pure Cream",
        "item_count": 8,
    },
    {
        "id": "sundaes",
        "name": "Sundaes",
        "short_desc": "Layers of joy in every bite.",
        "image": "/images/products/sundaes_card_WEB.jpg",
        "badge": "Fan Favourite",
        "item_count": 6,
    },
    {
        "id": "jelly",
        "name": "Jelly Crush",
        "short_desc": "Fun, fruity & full of crush.",
        "image": "/images/products/jelly_crush_card_WEB.jpg",
        "badge": "Kids Love It",
        "item_count": 4,
    },
    {
        "id": "dips",
        "name": "Dips",
        "short_desc": "Dip it. Top it. Love it.",
        "image": "/images/products/chocolate_dip_cone_WEB.jpg",
        "badge": "Crunch Magic",
        "item_count": 5,
    },
    {
        "id": "combos",
        "name": "Combos",
        "short_desc": "Perfect together, better together.",
        "image": "/images/products/combo_menu_WEB.jpg",
        "badge": "Save ₹29",
        "item_count": 4,
    },
]

PRODUCTS_DATA = [
    {
        "id": "prod-1",
        "name": "Belgian Chocolate Softie",
        "category": "softies",
        "category_label": "Softies",
        "description": "Deep, decadent, velvety Belgian dark cocoa churned with 100% farm-fresh cow milk.",
        "price": 49,
        "original_price": 60,
        "image": "/images/products/prod_belgian_chocolate_swirl.jpg",
        "is_veg": True,
        "is_bestseller": True,
        "badge": "Today's Star",
    },
    {
        "id": "prod-2",
        "name": "Classic Creamy French Vanilla",
        "category": "softies",
        "category_label": "Softies",
        "description": "Our signature Madagascar vanilla swirl served on a golden waffle cone with pure creamy finish.",
        "price": 39,
        "image": "/images/products/vanilla_softie_cone_WEB.jpg",
        "is_veg": True,
        "is_bestseller": True,
    },
    {
        "id": "prod-5",
        "name": "Chocolate Brownie Loaded Sundae",
        "category": "sundaes",
        "category_label": "Sundaes",
        "description": "Gooey Dutch chocolate fudge brownie cubes, vanilla softie peak, warm chocolate drizzle & crunchy roasted nuts.",
        "price": 89,
        "original_price": 110,
        "image": "/images/products/chocolate_brownie_sundae_WEB.jpg",
        "is_veg": True,
        "is_bestseller": True,
        "badge": "Super Deluxe Signature",
    },
    {
        "id": "prod-8",
        "name": "Lotus Biscoff Caramel Sundae",
        "category": "sundaes",
        "category_label": "Sundaes",
        "description": "Belgian Lotus Biscoff speculoos spread, crunchy cookie crumble & salted golden caramel.",
        "price": 99,
        "original_price": 125,
        "image": "/images/products/prod_sundae_biscoff.png",
        "is_veg": True,
        "is_bestseller": True,
        "badge": "Chef Special",
    },
    {
        "id": "prod-9",
        "name": "Blackcurrant Jelly Crush Cup",
        "category": "jelly",
        "category_label": "Jelly Crush",
        "description": "Fruity blackcurrant jelly cubes, refreshing soda burst, crowned with chilled vanilla soft-serve.",
        "price": 79,
        "original_price": 95,
        "image": "/images/products/category_jelly_crush.jpg",
        "is_veg": True,
        "is_bestseller": True,
    },
    {
        "id": "prod-11",
        "name": "Belgian Dark Chocolate Hard Dip Cone",
        "category": "dips",
        "category_label": "Dips",
        "description": "Warm, glossy Belgian chocolate dip that instantly hardens into a crisp crackling chocolate shell.",
        "price": 59,
        "original_price": 75,
        "image": "/images/products/chocolate_dip_cone_WEB.jpg",
        "is_veg": True,
        "is_bestseller": True,
    },
]

COMBOS_DATA = [
    {
        "id": "combo-1",
        "name": "Sundae + Sundae",
        "subtitle": "Double Happiness Pack",
        "items_included": ["Chocolate Brownie Sundae", "Butterscotch Crunch Sundae"],
        "price": 149,
        "original_price": 178,
        "savings": 29,
        "image": "/images/products/sundaes_card_WEB.jpg",
        "tag": "Save ₹29",
        "featured": True,
    },
    {
        "id": "combo-2",
        "name": "Softie + Dips",
        "subtitle": "Crunch & Swirl Duo",
        "items_included": ["Signature French Vanilla Cone", "Belgian Chocolate Hard Dip Cone"],
        "price": 69,
        "original_price": 98,
        "savings": 29,
        "image": "/images/products/chocolate_dip_cone_WEB.jpg",
        "tag": "Save ₹29",
        "featured": True,
    },
    {
        "id": "combo-3",
        "name": "Jelly Crush + Sundae",
        "subtitle": "Fruity & Decadent Joy",
        "items_included": ["Blackcurrant Jelly Crush Cup", "Lotus Biscoff / Brownie Sundae"],
        "price": 169,
        "original_price": 189,
        "savings": 20,
        "image": "/images/products/category_jelly_crush.jpg",
        "tag": "Save ₹20",
        "featured": True,
    },
]

REVIEWS_DATA = [
    {
        "id": "rev-1",
        "author_name": "Karthikeyan Kumar",
        "time_ago": "a day ago",
        "rating": 5,
        "text": "Great value for money! The taste and portion size were spot on. Highly recommend.",
        "source": "google",
        "avatar_letter": "K",
        "avatar_bg": "#E51D35",
        "is_verified": True,
    },
    {
        "id": "rev-2",
        "author_name": "Assad Khan",
        "time_ago": "2 months ago",
        "rating": 5,
        "text": "Definitely delicious. Lovely flavours 😋✨ Also its affordable.",
        "source": "google",
        "avatar_letter": "A",
        "avatar_bg": "#174FA3",
        "is_verified": True,
    },
    {
        "id": "rev-3",
        "author_name": "Kiruthik Raj",
        "time_ago": "3 months ago",
        "rating": 5,
        "text": "Wonderful experience having their sundae's. Unique taste in each flavour. Highly recommend.",
        "source": "google",
        "avatar_letter": "K",
        "avatar_bg": "#4E8832",
        "is_verified": True,
    },
]


@app.get("/api/categories", response_model=List[CategoryModel])
def get_categories():
    """Returns official menu categories."""
    return [CategoryModel(**c) for c in CATEGORIES_DATA]


@app.get("/api/products", response_model=List[ProductModel])
def get_products(category: Optional[str] = None):
    """Returns products, optionally filtered by category."""
    if category and category != "all":
        filtered = [p for p in PRODUCTS_DATA if p["category"] == category]
        return [ProductModel(**p) for p in filtered]
    return [ProductModel(**p) for p in PRODUCTS_DATA]


@app.get("/api/combos", response_model=List[ComboModel])
def get_combos():
    """Returns combo packages and verified savings."""
    return [ComboModel(**c) for c in COMBOS_DATA]


@app.get("/api/reviews", response_model=List[ReviewModel])
def get_reviews():
    """Returns verified customer reviews from Google Maps."""
    return [ReviewModel(**r) for r in REVIEWS_DATA]


@app.post("/api/franchise-enquiries", response_model=FranchiseEnquiryResponse)
def submit_franchise_enquiry(req: FranchiseEnquiryRequest):
    """Submits a verified franchise / partnership inquiry."""
    enquiry_id = f"FRN-{uuid.uuid4().hex[:8].upper()}"
    record = {
        "id": enquiry_id,
        "full_name": req.full_name,
        "phone_number": req.phone_number,
        "email": req.email,
        "city": req.city,
        "enquiry_type": req.enquiry_type,
        "investment_range": req.investment_range,
        "message": req.message,
        "timestamp": datetime.now().isoformat(),
    }
    ENQUIRIES_DB.append(record)
    return FranchiseEnquiryResponse(
        success=True,
        message=f"Thank you {req.full_name}! Your enquiry ({enquiry_id}) has been received. Our team will contact you shortly.",
        enquiry_id=enquiry_id,
    )


# Serve built frontend if dist exists
if DIST_DIR.exists():
    app.mount("/assets", StaticFiles(directory=str(DIST_DIR / "assets")), name="assets")
    if (DIST_DIR / "images").exists():
        app.mount("/images", StaticFiles(directory=str(DIST_DIR / "images")), name="images")

    @app.get("/{full_path:path}")
    def serve_frontend(full_path: str):
        file_path = DIST_DIR / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(str(file_path))
        index_file = DIST_DIR / "index.html"
        if index_file.exists():
            return FileResponse(str(index_file))
        return {"message": "Super Deluxe API is active."}
