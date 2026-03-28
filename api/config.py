from __future__ import annotations

import os
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_FIXTURES_DIR = REPO_ROOT / "public" / "demo-data"


def get_fixtures_dir() -> Path:
    return Path(os.getenv("FIXTURES_DIR", DEFAULT_FIXTURES_DIR)).resolve()

