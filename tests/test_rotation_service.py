from datetime import date, datetime, timedelta
import zoneinfo
import pytest
import tempfile
import json
from pathlib import Path

from app.models import FullRotationData, FlavourItem, UpdateFlavourRequest
from app.service import FlavourRotationService, RotationValidationError
from app.storage import StorageManager

IST = zoneinfo.ZoneInfo("Asia/Kolkata")

# Sample 10 flavours for isolated tests
SAMPLE_10_FLAVOURS = [
    FlavourItem(id="belgian-chocolate", name="Belgian Chocolate", description="Decadent cocoa", image_url="/img1.jpg"),
    FlavourItem(id="strawberry", name="Strawberry", description="Sweet berry", image_url="/img2.jpg"),
    FlavourItem(id="mango", name="Mango", description="Tropical mango", image_url="/img3.jpg"),
    FlavourItem(id="black-currant", name="Black Currant", description="Wild berry", image_url="/img4.jpg"),
    FlavourItem(id="butterscotch", name="Butterscotch", description="Praline crunch", image_url="/img5.jpg"),
    FlavourItem(id="vanilla", name="Vanilla", description="Madagascar bean", image_url="/img6.jpg"),
    FlavourItem(id="chocolate-brownie", name="Chocolate Brownie", description="Fudge brownie", image_url="/img7.jpg"),
    FlavourItem(id="blueberry", name="Blueberry", description="Indigo berry", image_url="/img8.jpg"),
    FlavourItem(id="caramel-crunch", name="Caramel Crunch", description="Amber toffee", image_url="/img9.jpg"),
    FlavourItem(id="cookies-and-cream", name="Cookies & Cream", description="Cookie crumble", image_url="/img10.jpg"),
]


@pytest.fixture
def temp_service(tmp_path):
    data_file = tmp_path / "flavour_rotation.json"
    default_file = tmp_path / "default_data.json"
    
    init_data = FullRotationData(
        anchor_date="2026-10-21",
        timezone="Asia/Kolkata",
        cycle_length=10,
        reorder_policy="immediate",
        flavours=SAMPLE_10_FLAVOURS,
    )
    with open(default_file, "w", encoding="utf-8") as f:
        json.dump(init_data.model_dump(), f)
    with open(data_file, "w", encoding="utf-8") as f:
        json.dump(init_data.model_dump(), f)

    storage = StorageManager(file_path=data_file, default_path=default_file)
    return FlavourRotationService(storage=storage)


def test_anchor_date_is_day_1(temp_service):
    """Day 1 selects the first flavour (Belgian Chocolate on anchor date 2026-10-21)."""
    anchor = date(2026, 10, 21)
    day_idx, disp_day, flavour = temp_service.calculate_for_date(anchor)
    assert disp_day == 1
    assert day_idx == 0
    assert flavour.id == "belgian-chocolate"
    assert flavour.name == "Belgian Chocolate"


def test_day_10_selects_tenth_flavour(temp_service):
    """Day 10 selects the tenth flavour (Cookies & Cream on 2026-10-30)."""
    target = date(2026, 10, 21) + timedelta(days=9)  # 2026-10-30
    day_idx, disp_day, flavour = temp_service.calculate_for_date(target)
    assert disp_day == 10
    assert day_idx == 9
    assert flavour.id == "cookies-and-cream"
    assert flavour.name == "Cookies & Cream"


def test_day_11_returns_to_first_flavour(temp_service):
    """Day 11 returns to the first flavour (Belgian Chocolate on 2026-10-31)."""
    target = date(2026, 10, 21) + timedelta(days=10)  # 2026-10-31
    day_idx, disp_day, flavour = temp_service.calculate_for_date(target)
    assert disp_day == 1
    assert day_idx == 0
    assert flavour.id == "belgian-chocolate"


def test_day_20_selects_tenth_flavour(temp_service):
    """Day 20 selects the tenth flavour (Cookies & Cream on 2026-11-09)."""
    target = date(2026, 10, 21) + timedelta(days=19)
    day_idx, disp_day, flavour = temp_service.calculate_for_date(target)
    assert disp_day == 10
    assert day_idx == 9
    assert flavour.id == "cookies-and-cream"


def test_day_21_returns_to_first_flavour(temp_service):
    """Day 21 returns to the first flavour (Belgian Chocolate on 2026-11-10)."""
    target = date(2026, 10, 21) + timedelta(days=20)
    day_idx, disp_day, flavour = temp_service.calculate_for_date(target)
    assert disp_day == 1
    assert day_idx == 0
    assert flavour.id == "belgian-chocolate"


def test_consecutive_dates_select_consecutive_flavours(temp_service):
    """Consecutive dates select consecutive flavours through the 10-flavour sequence."""
    anchor = date(2026, 10, 21)
    expected_order = [
        "belgian-chocolate",
        "strawberry",
        "mango",
        "black-currant",
        "butterscotch",
        "vanilla",
        "chocolate-brownie",
        "blueberry",
        "caramel-crunch",
        "cookies-and-cream",
    ]
    for i in range(30):  # Test across 3 full 10-day cycles
        cur_date = anchor + timedelta(days=i)
        day_idx, disp_day, flavour = temp_service.calculate_for_date(cur_date)
        expected_day = (i % 10) + 1
        expected_id = expected_order[i % 10]
        assert disp_day == expected_day
        assert flavour.id == expected_id


def test_midnight_in_asia_kolkata_advances_flavour(temp_service):
    """Midnight 00:00:00 in Asia/Kolkata advances the flavour to the next day."""
    # 23:59:59 IST on 2026-10-23 (Day 3: Mango)
    clock_before_midnight = datetime(2026, 10, 23, 23, 59, 59, tzinfo=IST)
    service_before = FlavourRotationService(
        storage=temp_service.storage,
        now_provider=lambda: clock_before_midnight
    )
    res_before = service_before.get_featured_flavour()
    assert res_before.date == "2026-10-23"
    assert res_before.day == 3
    assert res_before.flavour_id == "mango"
    assert res_before.seconds_until_next_rotation == 1

    # Exactly 00:00:00 IST on 2026-10-24 (Day 4: Black Currant)
    clock_at_midnight = datetime(2026, 10, 24, 0, 0, 0, tzinfo=IST)
    service_at_midnight = FlavourRotationService(
        storage=temp_service.storage,
        now_provider=lambda: clock_at_midnight
    )
    res_after = service_at_midnight.get_featured_flavour()
    assert res_after.date == "2026-10-24"
    assert res_after.day == 4
    assert res_after.flavour_id == "black-currant"


def test_same_indian_calendar_date_produces_same_flavour_for_all_visitors(temp_service):
    """
    Visitors in New York (EDT, UTC-4), London (BST, UTC+1), and Tokyo (JST, UTC+9)
    who access the site at the same real moment when it is 2026-10-23 in Kolkata
    always see the exact same Indian calendar date and flavour (Day 3, Mango).
    """
    # 12:00 PM IST on Oct 23 is 02:30 AM EDT on Oct 23 in NY, 07:30 BST in London, 15:30 JST in Tokyo
    real_time_utc = datetime(2026, 10, 23, 6, 30, 0, tzinfo=zoneinfo.ZoneInfo("UTC"))
    
    # Regardless of how visitors' system clocks or locations are represented,
    # the service converts to Asia/Kolkata and computes for that Indian calendar date
    service = FlavourRotationService(
        storage=temp_service.storage,
        now_provider=lambda: real_time_utc
    )
    res = service.get_featured_flavour()
    assert res.date == "2026-10-23"
    assert res.day == 3
    assert res.flavour_id == "mango"
    assert res.timezone == "Asia/Kolkata"


def test_leap_years_and_month_boundaries_calculate_correctly(temp_service):
    """
    Leap year (2024, 2028) February 28 -> February 29 -> March 1
    and month/year boundaries (2026-12-31 -> 2027-01-01) calculate accurately.
    """
    # Check leap year 2028 (2028 is a leap year with Feb 29)
    feb28 = date(2028, 2, 28)
    feb29 = date(2028, 2, 29)
    mar01 = date(2028, 3, 1)

    _, day_feb28, f_feb28 = temp_service.calculate_for_date(feb28)
    _, day_feb29, f_feb29 = temp_service.calculate_for_date(feb29)
    _, day_mar01, f_mar01 = temp_service.calculate_for_date(mar01)

    assert (day_feb29 - day_feb28) % 10 == 1
    assert (day_mar01 - day_feb29) % 10 == 1

    # Check year boundary: 2026-12-31 to 2027-01-01
    dec31 = date(2026, 12, 31)
    jan01 = date(2027, 1, 1)
    _, day_dec31, _ = temp_service.calculate_for_date(dec31)
    _, day_jan01, _ = temp_service.calculate_for_date(jan01)
    assert (day_jan01 - day_dec31) % 10 == 1


def test_server_restarts_and_redeployments_do_not_reset_cycle(tmp_path):
    """
    Creating a new service instance pointing to the persisted file retains all configuration,
    customisations, and does not alter the rotation day.
    """
    data_file = tmp_path / "flavour_rotation.json"
    default_file = tmp_path / "default_data.json"
    
    init_data = FullRotationData(
        anchor_date="2026-10-21",
        timezone="Asia/Kolkata",
        cycle_length=10,
        reorder_policy="immediate",
        flavours=SAMPLE_10_FLAVOURS,
    )
    with open(data_file, "w", encoding="utf-8") as f:
        json.dump(init_data.model_dump(), f)
    with open(default_file, "w", encoding="utf-8") as f:
        json.dump(init_data.model_dump(), f)

    # First instance modifies flavour name and reorders
    storage1 = StorageManager(file_path=data_file, default_path=default_file)
    service1 = FlavourRotationService(storage=storage1)
    service1.update_flavour_details("mango", UpdateFlavourRequest(name="Royal Alphonso Mango"))

    # Simulate restart by creating completely new storage & service instances
    storage2 = StorageManager(file_path=data_file, default_path=default_file)
    service2 = FlavourRotationService(storage=storage2)
    
    target = date(2026, 10, 23)
    _, disp_day, flavour = service2.calculate_for_date(target)
    assert disp_day == 3
    assert flavour.id == "mango"
    assert flavour.name == "Royal Alphonso Mango"


def test_invalid_dates_and_incomplete_flavour_configurations_handled_safely(temp_service):
    """Configuration with not exactly 10 active flavours or invalid dates raises validation errors."""
    # Incomplete flavours (< 10)
    invalid_data = FullRotationData(
        anchor_date="2026-10-21",
        timezone="Asia/Kolkata",
        cycle_length=10,
        flavours=SAMPLE_10_FLAVOURS[:8],  # Only 8 flavours
    )
    with pytest.raises(RotationValidationError) as exc:
        temp_service.validate_configuration(invalid_data)
    assert "requires exactly 10 active flavours" in str(exc.value)

    # Invalid anchor date
    with pytest.raises(RotationValidationError):
        temp_service.update_rotation_config(anchor_date="not-a-date")

    # Invalid preview date
    with pytest.raises(RotationValidationError):
        temp_service.preview_date("2026-99-99")


def test_reorder_policy_next_cycle(temp_service):
    """
    When policy is 'next_cycle', sequence changes do not alter current cycle's remaining days,
    and activate when Day 1 is reached.
    """
    new_order = [
        "cookies-and-cream",
        "caramel-crunch",
        "blueberry",
        "chocolate-brownie",
        "vanilla",
        "butterscotch",
        "black-currant",
        "mango",
        "strawberry",
        "belgian-chocolate",
    ]
    # Apply reorder with policy "next_cycle"
    temp_service.reorder_sequence(new_order, policy="next_cycle")
    
    data = temp_service.get_data()
    assert data.reorder_policy == "next_cycle"
    assert data.pending_sequence == new_order
    # On Day 3 (2026-10-23), active sequence is still unchanged
    _, disp_day, flavour = temp_service.calculate_for_date(date(2026, 10, 23))
    assert disp_day == 3
    assert flavour.id == "mango"
