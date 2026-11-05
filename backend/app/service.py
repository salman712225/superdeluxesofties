from datetime import date, datetime, timedelta
import zoneinfo
from typing import Callable, List, Optional, Tuple

try:
    from backend.app.models import (
        FullRotationData,
        FlavourItem,
        FeaturedFlavourResponse,
        FlavourSequenceItem,
        FlavoursListResponse,
        NextFlavourSummary,
        RotationConfig,
        UpdateFlavourRequest,
    )
    from backend.app.storage import StorageManager
except ImportError:
    from app.models import (
        FullRotationData,
        FlavourItem,
        FeaturedFlavourResponse,
        FlavourSequenceItem,
        FlavoursListResponse,
        NextFlavourSummary,
        RotationConfig,
        UpdateFlavourRequest,
    )
    from app.storage import StorageManager


class RotationValidationError(ValueError):
    """Raised when rotation configuration or sequence validation fails."""
    pass


class FlavourRotationService:
    def __init__(
        self,
        storage: Optional[StorageManager] = None,
        now_provider: Optional[Callable[[], datetime]] = None,
    ):
        self.storage = storage or StorageManager()
        self._now_provider = now_provider

    def get_now(self, tz_name: str = "Asia/Kolkata") -> datetime:
        if self._now_provider:
            dt = self._now_provider()
            # If naive datetime provided, attach timezone
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=zoneinfo.ZoneInfo(tz_name))
            else:
                dt = dt.astimezone(zoneinfo.ZoneInfo(tz_name))
            return dt
        return datetime.now(zoneinfo.ZoneInfo(tz_name))

    def get_data(self) -> FullRotationData:
        return self.storage.load_data()

    def get_anchor_date(self) -> date:
        data = self.get_data()
        parts = data.anchor_date.split("-")
        return date(int(parts[0]), int(parts[1]), int(parts[2]))

    def get_timezone(self) -> str:
        return self.get_data().timezone

    def get_cycle_length(self) -> int:
        return self.get_data().cycle_length

    def get_active_flavours(self, data: Optional[FullRotationData] = None) -> List[FlavourItem]:
        if data is None:
            data = self.get_data()
        active = [f for f in data.flavours if f.is_active]
        return active

    def validate_configuration(self, data: FullRotationData) -> None:
        """
        Validates:
        1. Cycle length matches active flavour count (exactly 10).
        2. Unique IDs.
        3. Valid anchor date format.
        4. Valid timezone.
        """
        active = [f for f in data.flavours if f.is_active]
        if len(active) != data.cycle_length:
            raise RotationValidationError(
                f"Configuration requires exactly {data.cycle_length} active flavours, but found {len(active)}."
            )

        ids = [f.id for f in active]
        if len(ids) != len(set(ids)):
            raise RotationValidationError("Flavour IDs must be unique across the sequence.")

        for f in active:
            if not f.name or not f.name.strip():
                raise RotationValidationError(f"Flavour '{f.id}' has an empty name.")
            if not f.description or not f.description.strip():
                raise RotationValidationError(f"Flavour '{f.id}' has an empty description.")
            if not f.image_url or not f.image_url.strip():
                raise RotationValidationError(f"Flavour '{f.id}' has an empty image URL.")

        try:
            zoneinfo.ZoneInfo(data.timezone)
        except Exception:
            raise RotationValidationError(f"Invalid timezone: {data.timezone}")

        try:
            parts = data.anchor_date.split("-")
            date(int(parts[0]), int(parts[1]), int(parts[2]))
        except Exception:
            raise RotationValidationError(f"Invalid anchor date: {data.anchor_date}")

    def calculate_for_date(
        self,
        target_date: date,
        data: Optional[FullRotationData] = None
    ) -> Tuple[int, int, FlavourItem]:
        """
        Pure deterministic rotation calculation:
        elapsedDays = daysBetween(target_date, anchorDate)
        dayIndex = elapsedDays % cycle_length (positive modulo in range 0..9)
        displayDay = dayIndex + 1 (1 to 10)
        flavour = activeFlavours[dayIndex]
        """
        if data is None:
            data = self.get_data()

        active = self.get_active_flavours(data)
        if len(active) != data.cycle_length:
            raise RotationValidationError(
                f"Active flavours count ({len(active)}) does not match cycle length ({data.cycle_length})."
            )

        anchor = self.get_anchor_date()
        elapsed_days = (target_date - anchor).days
        day_index = elapsed_days % data.cycle_length
        display_day = day_index + 1
        flavour = active[day_index]

        return day_index, display_day, flavour

    def get_featured_flavour(self) -> FeaturedFlavourResponse:
        data = self.get_data()
        tz_name = data.timezone
        now_dt = self.get_now(tz_name)
        today_date = now_dt.date()

        # Handle pending sequence promotion if policy is "next_cycle" and today is Day 1
        if data.reorder_policy == "next_cycle" and data.pending_sequence:
            day_idx, disp_day, _ = self.calculate_for_date(today_date, data)
            if disp_day == 1:
                # Apply pending sequence
                self._apply_pending_sequence(data)
                data = self.get_data()

        day_index, display_day, flavour = self.calculate_for_date(today_date, data)
        active = self.get_active_flavours(data)

        # Seconds until midnight in business timezone
        next_midnight = datetime(
            now_dt.year, now_dt.month, now_dt.day, tzinfo=zoneinfo.ZoneInfo(tz_name)
        ) + timedelta(days=1)
        seconds_until_next = max(0, int((next_midnight - now_dt).total_seconds()))

        # Next flavour
        next_index = (day_index + 1) % data.cycle_length
        next_day = next_index + 1
        next_item = active[next_index]
        next_flavour_summary = NextFlavourSummary(
            day=next_day,
            flavour_id=next_item.id,
            name=next_item.name,
            image_url=next_item.image_url,
            tagline=next_item.tagline,
        )

        return FeaturedFlavourResponse(
            day=display_day,
            cycle_length=data.cycle_length,
            flavour_id=flavour.id,
            name=flavour.name,
            description=flavour.description,
            image_url=flavour.image_url,
            date=today_date.isoformat(),
            timezone=tz_name,
            availability=flavour.availability,
            tagline=flavour.tagline,
            calories=flavour.calories,
            allergens=flavour.allergens,
            tasting_notes=flavour.tasting_notes,
            seconds_until_next_rotation=seconds_until_next,
            next_flavour=next_flavour_summary,
        )

    def get_all_flavours_sequence(self) -> FlavoursListResponse:
        data = self.get_data()
        tz_name = data.timezone
        now_dt = self.get_now(tz_name)
        today_date = now_dt.date()

        day_index, display_day, _ = self.calculate_for_date(today_date, data)
        active = self.get_active_flavours(data)

        # Start date of the current 10-day cycle
        cycle_start_date = today_date - timedelta(days=day_index)

        flavours_seq: List[FlavourSequenceItem] = []
        for i, f in enumerate(active):
            rot_day = i + 1
            is_today = (rot_day == display_day)
            scheduled_date = (cycle_start_date + timedelta(days=i)).isoformat()
            flavours_seq.append(
                FlavourSequenceItem(
                    id=f.id,
                    name=f.name,
                    description=f.description,
                    image_url=f.image_url,
                    is_active=f.is_active,
                    availability=f.availability,
                    tagline=f.tagline,
                    calories=f.calories,
                    allergens=f.allergens,
                    tasting_notes=f.tasting_notes,
                    rotation_day=rot_day,
                    is_today=is_today,
                    scheduled_date=scheduled_date,
                )
            )

        return FlavoursListResponse(
            cycle_length=data.cycle_length,
            current_day=display_day,
            today_date=today_date.isoformat(),
            timezone=tz_name,
            anchor_date=data.anchor_date,
            reorder_policy=data.reorder_policy,
            flavours=flavours_seq,
        )

    def preview_date(self, target_date_str: str) -> dict:
        try:
            parts = target_date_str.split("-")
            t_date = date(int(parts[0]), int(parts[1]), int(parts[2]))
        except Exception:
            raise RotationValidationError(f"Invalid date format: {target_date_str}. Expected YYYY-MM-DD.")

        data = self.get_data()
        day_index, display_day, flavour = self.calculate_for_date(t_date, data)

        return {
            "day": display_day,
            "cycle_length": data.cycle_length,
            "flavour_id": flavour.id,
            "name": flavour.name,
            "description": flavour.description,
            "image_url": flavour.image_url,
            "date": t_date.isoformat(),
            "timezone": data.timezone,
            "availability": flavour.availability,
            "tagline": flavour.tagline,
            "calories": flavour.calories,
            "allergens": flavour.allergens,
            "tasting_notes": flavour.tasting_notes,
        }

    def update_flavour_details(self, flavour_id: str, updates: UpdateFlavourRequest) -> FlavourItem:
        data = self.get_data()
        target = next((f for f in data.flavours if f.id == flavour_id), None)
        if not target:
            raise RotationValidationError(f"Flavour with ID '{flavour_id}' not found.")

        # If toggling is_active, check that active count stays exactly cycle_length
        if updates.is_active is not None and updates.is_active != target.is_active:
            current_active = sum(1 for f in data.flavours if f.is_active)
            new_active = current_active + (1 if updates.is_active else -1)
            if new_active != data.cycle_length:
                raise RotationValidationError(
                    f"Cannot set active to {updates.is_active}. Rotation sequence must maintain "
                    f"exactly {data.cycle_length} active flavours (would become {new_active})."
                )
            target.is_active = updates.is_active

        if updates.name is not None:
            if not updates.name.strip():
                raise RotationValidationError("Flavour name cannot be empty.")
            target.name = updates.name.strip()

        if updates.description is not None:
            if not updates.description.strip():
                raise RotationValidationError("Flavour description cannot be empty.")
            target.description = updates.description.strip()

        if updates.image_url is not None:
            if not updates.image_url.strip():
                raise RotationValidationError("Image URL cannot be empty.")
            target.image_url = updates.image_url.strip()

        if updates.availability is not None:
            target.availability = updates.availability.strip() if updates.availability else None

        if updates.tagline is not None:
            target.tagline = updates.tagline.strip() if updates.tagline else None

        if updates.calories is not None:
            target.calories = updates.calories.strip() if updates.calories else None

        if updates.allergens is not None:
            target.allergens = updates.allergens

        if updates.tasting_notes is not None:
            target.tasting_notes = updates.tasting_notes

        self.validate_configuration(data)
        self.storage.save_data(data)
        return target

    def reorder_sequence(self, sequence_ids: List[str], policy: Optional[str] = None) -> FullRotationData:
        data = self.get_data()
        policy = policy or data.reorder_policy

        # Validate that sequence_ids has exactly cycle_length elements and contains valid IDs
        if len(sequence_ids) != data.cycle_length:
            raise RotationValidationError(
                f"Reorder sequence must contain exactly {data.cycle_length} flavour IDs (received {len(sequence_ids)})."
            )

        if len(sequence_ids) != len(set(sequence_ids)):
            raise RotationValidationError("Reorder sequence cannot contain duplicate flavour IDs.")

        id_map = {f.id: f for f in data.flavours}
        for fid in sequence_ids:
            if fid not in id_map:
                raise RotationValidationError(f"Unknown flavour ID '{fid}' in reorder sequence.")

        if policy == "next_cycle":
            data.reorder_policy = "next_cycle"
            data.pending_sequence = sequence_ids
            self.storage.save_data(data)
            return data

        # Policy == "immediate"
        # Re-arrange active flavours to match sequence_ids
        reordered = [id_map[fid] for fid in sequence_ids]
        # Append any inactive flavours at the end
        inactive = [f for f in data.flavours if not f.is_active and f.id not in sequence_ids]
        data.flavours = reordered + inactive
        data.reorder_policy = "immediate"
        data.pending_sequence = None

        self.validate_configuration(data)
        self.storage.save_data(data)
        return data

    def _apply_pending_sequence(self, data: FullRotationData) -> None:
        if not data.pending_sequence:
            return
        id_map = {f.id: f for f in data.flavours}
        reordered = [id_map[fid] for fid in data.pending_sequence if fid in id_map]
        if len(reordered) == data.cycle_length:
            inactive = [f for f in data.flavours if f.id not in data.pending_sequence]
            data.flavours = reordered + inactive
            data.pending_sequence = None
            self.storage.save_data(data)

    def update_rotation_config(
        self,
        anchor_date: Optional[str] = None,
        timezone: Optional[str] = None,
        reorder_policy: Optional[str] = None,
    ) -> RotationConfig:
        data = self.get_data()

        if anchor_date is not None:
            try:
                parts = anchor_date.strip().split("-")
                date(int(parts[0]), int(parts[1]), int(parts[2]))
                data.anchor_date = anchor_date.strip()
            except Exception:
                raise RotationValidationError(f"Invalid anchor date '{anchor_date}'. Must be YYYY-MM-DD.")

        if timezone is not None:
            try:
                zoneinfo.ZoneInfo(timezone.strip())
                data.timezone = timezone.strip()
            except Exception:
                raise RotationValidationError(f"Invalid timezone '{timezone}'.")

        if reorder_policy is not None:
            if reorder_policy not in ("immediate", "next_cycle"):
                raise RotationValidationError("reorder_policy must be 'immediate' or 'next_cycle'.")
            data.reorder_policy = reorder_policy

        self.validate_configuration(data)
        self.storage.save_data(data)

        return RotationConfig(
            anchor_date=data.anchor_date,
            timezone=data.timezone,
            cycle_length=data.cycle_length,
            reorder_policy=data.reorder_policy,
        )

    def reset_to_defaults(self) -> FullRotationData:
        return self.storage.reset_to_defaults()
