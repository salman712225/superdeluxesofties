from fastapi.testclient import TestClient
import pytest
from app.main import app

client = TestClient(app)


def test_health_endpoint():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["timezone"] == "Asia/Kolkata"


def test_get_featured_flavour():
    res = client.get("/api/featured-flavour")
    assert res.status_code == 200
    data = res.json()
    assert "day" in data
    assert 1 <= data["day"] <= 10
    assert data["cycle_length"] == 10
    assert "flavour_id" in data
    assert "name" in data
    assert "description" in data
    assert "image_url" in data
    assert data["timezone"] == "Asia/Kolkata"
    assert "seconds_until_next_rotation" in data
    assert "next_flavour" in data


def test_get_flavours_sequence():
    res = client.get("/api/flavours")
    assert res.status_code == 200
    data = res.json()
    assert data["cycle_length"] == 10
    assert len(data["flavours"]) == 10
    
    # Exactly one flavour has is_today == True
    today_count = sum(1 for f in data["flavours"] if f["is_today"])
    assert today_count == 1

    # Rotation days are 1..10 in order
    days = [f["rotation_day"] for f in data["flavours"]]
    assert days == list(range(1, 11))


def test_preview_endpoint():
    # Anchor date is 2026-10-21 -> Day 1 (Belgian Chocolate)
    res1 = client.get("/api/preview?date=2026-10-21")
    assert res1.status_code == 200
    data1 = res1.json()
    assert data1["day"] == 1
    assert data1["flavour_id"] == "belgian-chocolate"

    # Day 11 is 2026-10-31 -> loops to Day 1
    res11 = client.get("/api/preview?date=2026-10-31")
    assert res11.status_code == 200
    assert res11.json()["day"] == 1
    assert res11.json()["flavour_id"] == "belgian-chocolate"

    # Invalid date format
    res_bad = client.get("/api/preview?date=invalid-date")
    assert res_bad.status_code == 400


def test_admin_update_flavour():
    # Update description of vanilla
    res = client.post(
        "/api/admin/flavour/vanilla",
        json={"tagline": "Purest Bourbon Aroma"}
    )
    assert res.status_code == 200
    assert res.json()["status"] == "success"

    # Verify update in flavours list
    res_list = client.get("/api/flavours")
    vanilla_item = next(f for f in res_list.json()["flavours"] if f["id"] == "vanilla")
    assert vanilla_item["tagline"] == "Purest Bourbon Aroma"


def test_admin_rejects_empty_flavour_name():
    res = client.post(
        "/api/admin/flavour/vanilla",
        json={"name": "   "}
    )
    assert res.status_code == 400
    assert "empty" in res.json()["detail"].lower()
