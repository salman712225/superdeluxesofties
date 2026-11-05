from datetime import date
from typing import List, Optional, Literal
from pydantic import BaseModel, Field, field_validator


class FlavourItem(BaseModel):
    id: str = Field(..., description="Unique slug ID for the flavour")
    name: str = Field(..., min_length=1, description="Display name of the flavour")
    description: str = Field(..., min_length=1, description="Sensory flavour description")
    image_url: str = Field(..., min_length=1, description="Path or URL to flavour photograph")
    is_active: bool = Field(default=True, description="Active status in rotation")
    availability: Optional[str] = Field(default=None, description="Current availability note")
    tagline: Optional[str] = Field(default=None, description="Short punchy highlight")
    calories: Optional[str] = Field(default=None, description="Calorie information")
    allergens: List[str] = Field(default_factory=list, description="Allergen tags")
    tasting_notes: List[str] = Field(default_factory=list, description="Top tasting notes")


class RotationConfig(BaseModel):
    anchor_date: str = Field(..., description="Anchor date string in YYYY-MM-DD format")
    timezone: str = Field(default="Asia/Kolkata", description="IANA timezone name")
    cycle_length: int = Field(default=10, description="Number of days in rotation cycle")
    reorder_policy: Literal["immediate", "next_cycle"] = Field(
        default="immediate",
        description="Whether sequence reordering takes effect immediately or on Day 1 of next cycle"
    )


class FullRotationData(BaseModel):
    anchor_date: str
    timezone: str = "Asia/Kolkata"
    cycle_length: int = 10
    reorder_policy: Literal["immediate", "next_cycle"] = "immediate"
    pending_sequence: Optional[List[str]] = None
    flavours: List[FlavourItem]


class NextFlavourSummary(BaseModel):
    day: int
    flavour_id: str
    name: str
    image_url: str
    tagline: Optional[str] = None


class FeaturedFlavourResponse(BaseModel):
    day: int = Field(..., description="1-indexed day of the rotation (1 to 10)")
    cycle_length: int = Field(default=10, description="Total days in rotation cycle")
    flavour_id: str
    name: str
    description: str
    image_url: str
    date: str = Field(..., description="Calendar date in business timezone (YYYY-MM-DD)")
    timezone: str = Field(default="Asia/Kolkata")
    availability: Optional[str] = None
    tagline: Optional[str] = None
    calories: Optional[str] = None
    allergens: List[str] = Field(default_factory=list)
    tasting_notes: List[str] = Field(default_factory=list)
    seconds_until_next_rotation: int = Field(..., description="Seconds until midnight in business timezone")
    next_flavour: Optional[NextFlavourSummary] = None


class FlavourSequenceItem(FlavourItem):
    rotation_day: int
    is_today: bool
    scheduled_date: Optional[str] = None


class FlavoursListResponse(BaseModel):
    cycle_length: int
    current_day: int
    today_date: str
    timezone: str
    anchor_date: str
    reorder_policy: str
    flavours: List[FlavourSequenceItem]


class UpdateFlavourRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    tagline: Optional[str] = None
    availability: Optional[str] = None
    calories: Optional[str] = None
    is_active: Optional[bool] = None


class ReorderFlavoursRequest(BaseModel):
    sequence: List[str]
    policy: Optional[Literal["immediate", "next_cycle"]] = None


class UpdateRotationConfigRequest(BaseModel):
    anchor_date: Optional[str] = None
    timezone: Optional[str] = None
    reorder_policy: Optional[Literal["immediate", "next_cycle"]] = None


# --- Domain models for Categories, Products, Combos, Reviews & Enquiries ---

class CategoryModel(BaseModel):
    id: str
    name: str
    short_desc: str
    image: str
    badge: Optional[str] = None
    item_count: int


class ProductModel(BaseModel):
    id: str
    name: str
    category: str
    category_label: str
    description: str
    price: int
    original_price: Optional[int] = None
    image: str
    is_veg: bool = True
    is_bestseller: Optional[bool] = False
    badge: Optional[str] = None


class ComboModel(BaseModel):
    id: str
    name: str
    subtitle: str
    items_included: List[str]
    price: int
    original_price: Optional[int] = None
    savings: int
    image: str
    tag: str
    featured: bool = True


class ReviewModel(BaseModel):
    id: str
    author_name: str
    time_ago: str
    rating: int = 5
    text: str
    source: str = "google"
    avatar_letter: str
    avatar_bg: str
    is_verified: bool = True


class FranchiseEnquiryRequest(BaseModel):
    full_name: str = Field(..., alias="fullName")
    phone_number: str = Field(..., alias="phoneNumber")
    email: str
    city: str
    enquiry_type: str = Field(default="franchise", alias="enquiryType")
    investment_range: Optional[str] = Field(default="₹5L - ₹10L", alias="investmentRange")
    message: Optional[str] = None

    class Config:
        populate_by_name = True


class FranchiseEnquiryResponse(BaseModel):
    success: bool = True
    message: str
    enquiry_id: Optional[str] = None
