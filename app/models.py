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

    @field_validator("id", "name", "description", "image_url")
    @classmethod
    def not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Field cannot be empty or whitespace only")
        return v.strip()


class RotationConfig(BaseModel):
    anchor_date: str = Field(..., description="Anchor date string in YYYY-MM-DD format")
    timezone: str = Field(default="Asia/Kolkata", description="IANA timezone name")
    cycle_length: int = Field(default=10, description="Number of days in rotation cycle")
    reorder_policy: Literal["immediate", "next_cycle"] = Field(
        default="immediate",
        description="Whether sequence reordering takes effect immediately or on Day 1 of next cycle"
    )

    @field_validator("anchor_date")
    @classmethod
    def validate_anchor_date(cls, v: str) -> str:
        try:
            parts = v.strip().split("-")
            if len(parts) != 3:
                raise ValueError
            date(int(parts[0]), int(parts[1]), int(parts[2]))
        except Exception:
            raise ValueError(f"anchor_date '{v}' must be a valid ISO date string 'YYYY-MM-DD'")
        return v.strip()


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
    rotation_day: int = Field(..., description="1 to 10 sequence number")
    is_today: bool = Field(..., description="True if this flavour is featured today")
    scheduled_date: Optional[str] = Field(default=None, description="Date when this day occurs in current cycle")


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
    is_active: Optional[bool] = None
    availability: Optional[str] = None
    tagline: Optional[str] = None
    calories: Optional[str] = None
    allergens: Optional[List[str]] = None
    tasting_notes: Optional[List[str]] = None


class ReorderFlavoursRequest(BaseModel):
    sequence: List[str] = Field(..., description="Ordered list of 10 active flavour IDs")
    policy: Optional[Literal["immediate", "next_cycle"]] = None


class UpdateRotationConfigRequest(BaseModel):
    anchor_date: Optional[str] = None
    timezone: Optional[str] = None
    reorder_policy: Optional[Literal["immediate", "next_cycle"]] = None
