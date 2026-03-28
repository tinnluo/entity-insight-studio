from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routers.entities import router as entities_router
from api.routers.insights import router as insights_router
from api.routers.ownership import router as ownership_router
from api.routers.scenarios import router as scenarios_router


app = FastAPI(title="Entity Insight Studio API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.include_router(entities_router)
app.include_router(ownership_router)
app.include_router(insights_router)
app.include_router(scenarios_router)


@app.get("/health", tags=["health"])
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}

