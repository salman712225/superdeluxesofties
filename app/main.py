import os
from pathlib import Path
from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.models import (
    FeaturedFlavourResponse,
    FlavoursListResponse,
    RotationConfig,
    UpdateFlavourRequest,
    ReorderFlavoursRequest,
    UpdateRotationConfigRequest,
)
from app.service import FlavourRotationService, RotationValidationError

BASE_DIR = Path(__file__).resolve().parent.parent
STATIC_DIR = BASE_DIR / "static"

app = FastAPI(
    title="Super Deluxe Softies & Smiles — Automatic Flavour Rotation API",
    version="1.0.0",
    description="Deterministic calendar date-based soft-serve flavour rotation engine in Asia/Kolkata timezone.",
)

# Enable CORS for local testing and web clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Service instance
rotation_service = FlavourRotationService()


@app.get("/api/health")
def health():
    now_dt = rotation_service.get_now()
    return {
        "status": "healthy",
        "current_time_ist": now_dt.isoformat(),
        "timezone": "Asia/Kolkata",
    }


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
    """Returns the current rotation configuration (anchor date, timezone, cycle length, reorder policy)."""
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


@app.post("/api/admin/flavour/{flavour_id}")
def update_flavour(flavour_id: str, updates: UpdateFlavourRequest):
    """Admin endpoint to update flavour properties (name, description, image, active, etc.)."""
    try:
        updated = rotation_service.update_flavour_details(flavour_id, updates)
        return {"status": "success", "flavour": updated}
    except RotationValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@app.post("/api/admin/reorder")
def reorder_flavours(req: ReorderFlavoursRequest):
    """Admin endpoint to reorder the 10 flavours with rotation policy enforcement."""
    try:
        updated_data = rotation_service.reorder_sequence(req.sequence, req.policy)
        return {
            "status": "success",
            "message": f"Flavours reordered successfully under '{updated_data.reorder_policy}' policy.",
            "sequence": [f.id for f in updated_data.flavours if f.is_active],
        }
    except RotationValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@app.post("/api/admin/rotation-config")
def update_config(req: UpdateRotationConfigRequest):
    """Admin endpoint to configure anchor date, timezone, or reorder policy."""
    try:
        updated_config = rotation_service.update_rotation_config(
            anchor_date=req.anchor_date,
            timezone=req.timezone,
            reorder_policy=req.reorder_policy,
        )
        return {"status": "success", "config": updated_config}
    except RotationValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@app.post("/api/admin/reset-defaults")
def reset_defaults():
    """Resets rotation configuration and flavour items to original default values."""
    try:
        rotation_service.reset_to_defaults()
        return {"status": "success", "message": "Successfully restored default rotation and flavours."}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


# Mount static directory
if STATIC_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")


@app.get("/")
def read_root():
    index_file = STATIC_DIR / "index.html"
    if index_file.exists():
        return FileResponse(str(index_file))
    return {"message": "Super Deluxe Softies & Smiles Flavour Rotation API is running."}
