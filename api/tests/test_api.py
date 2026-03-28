from __future__ import annotations

from fastapi.testclient import TestClient

from api.main import app


client = TestClient(app)


def test_healthcheck() -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_entities_endpoint_returns_fixture_records() -> None:
    response = client.get("/api/v1/entities")

    assert response.status_code == 200
    payload = response.json()
    assert len(payload) >= 5
    assert payload[0]["id"] == "aster-grid-holdings"
    assert "kpis" in payload[0]


def test_entity_detail_endpoint_returns_entity() -> None:
    response = client.get("/api/v1/entities/aster-grid-holdings")

    assert response.status_code == 200
    assert response.json()["slug"] == "aster-grid-holdings"


def test_insights_endpoint_returns_overview_payload() -> None:
    response = client.get("/api/v1/insights", params={"entity": "aster-grid-holdings"})

    assert response.status_code == 200
    payload = response.json()
    assert payload["entity"]["id"] == "aster-grid-holdings"
    assert payload["ownershipSummary"]["ownerCount"] >= 1
    assert len(payload["assets"]) >= 1


def test_ownership_endpoint_returns_graph_payload() -> None:
    response = client.get("/api/v1/ownership", params={"entity": "aster-grid-holdings"})

    assert response.status_code == 200
    payload = response.json()
    assert payload["totalRecords"] == len(payload["data"])
    assert payload["data"][0]["rootId"] == "aster-grid-holdings"


def test_scenarios_endpoint_returns_series_payload() -> None:
    response = client.get("/api/v1/scenarios", params={"entity": "aster-grid-holdings"})

    assert response.status_code == 200
    payload = response.json()
    assert payload["entity"]["id"] == "aster-grid-holdings"
    assert payload["points"][0]["year"] == 2024


def test_unknown_entity_returns_404() -> None:
    response = client.get("/api/v1/entities/not-a-real-entity")

    assert response.status_code == 404
    assert response.json()["detail"] == 'Unknown entity "not-a-real-entity"'

