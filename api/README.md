# FastAPI Backend

This service exposes the demo fixture data through a small REST API for the two-service architecture mode.

## Endpoints

- `GET /health`
- `GET /api/v1/entities`
- `GET /api/v1/entities/{id}`
- `GET /api/v1/ownership?entity=<id>`
- `GET /api/v1/insights?entity=<id>`
- `GET /api/v1/scenarios?entity=<id>`

## Local Run

```bash
pip install -r api/requirements.txt
uvicorn api.main:app --reload
```

By default the service reads fixtures from `public/demo-data`. Override that with `FIXTURES_DIR` when needed.

