from datetime import date, timedelta
from pathlib import Path
import os
import tempfile
import requests
import pandas as pd

BASE_URL = "https://data.elexon.co.uk/bmrs/api/v1/datasets"

# 1) Committed snapshot of the January 2026 data. Read-only, ships with the app.
DATA_DIR = Path(__file__).resolve().parent.parent / "data"
# 2) Writable fallback for fresh downloads. Vercel only allows writing to /tmp.
CACHE_DIR = Path(os.environ.get("CACHE_DIR", tempfile.gettempdir())) / "wind-cache"


def _find_cached(name: str):
    """Return the path of a cached CSV if it exists in either folder, else None."""
    for folder in (DATA_DIR, CACHE_DIR):
        path = folder / name
        if path.exists():
            return path
    return None


def _save_cache(df: pd.DataFrame, name: str) -> None:
    """Try to save a CSV for next time. Failing is fine: caching is only an optimisation."""
    try:
        CACHE_DIR.mkdir(parents=True, exist_ok=True)
        df.to_csv(CACHE_DIR / name, index=False)
    except OSError:
        pass


def _get_json(endpoint: str, params: dict) -> list:
    """Call an Elexon 'stream' endpoint and return a list of records."""
    resp = requests.get(f"{BASE_URL}/{endpoint}/stream", params=params, timeout=60)
    resp.raise_for_status()
    return resp.json()


def fetch_actual() -> pd.DataFrame:
    """Actual WIND generation for January 2026 (30-min resolution)."""
    cached = _find_cached("actual.csv")
    if cached:
        return pd.read_csv(cached, parse_dates=["startTime"])

    rows = []
    day = date(2026, 1, 1)
    while day <= date(2026, 1, 31):
        end = min(day + timedelta(days=6), date(2026, 1, 31))  # 7-day chunks
        rows += _get_json("FUELHH", {
            "settlementDateFrom": day.isoformat(),
            "settlementDateTo": end.isoformat(),
            "fuelType": "WIND",
        })
        day = end + timedelta(days=1)

    df = pd.DataFrame(rows)
    df = df[df["fuelType"] == "WIND"]
    df["startTime"] = pd.to_datetime(df["startTime"], utc=True)
    df = df[["startTime", "generation"]].drop_duplicates("startTime").sort_values("startTime")
    _save_cache(df, "actual.csv")
    return df


def fetch_forecast() -> pd.DataFrame:
    """All WIND forecasts published from 31 Dec 2025 to 31 Jan 2026."""
    cached = _find_cached("forecast.csv")
    if cached:
        return pd.read_csv(cached, parse_dates=["startTime", "publishTime"])

    rows = []
    day = date(2025, 12, 31)   # forecasts for 1 Jan are published on 31 Dec
    while day <= date(2026, 1, 31):
        end = min(day + timedelta(days=6), date(2026, 1, 31))
        rows += _get_json("WINDFOR", {
            "publishDateTimeFrom": f"{day.isoformat()}T00:00:00Z",
            "publishDateTimeTo": f"{end.isoformat()}T23:59:59Z",
        })
        day = end + timedelta(days=1)

    df = pd.DataFrame(rows)
    df["startTime"] = pd.to_datetime(df["startTime"], utc=True)
    df["publishTime"] = pd.to_datetime(df["publishTime"], utc=True)
    df = df[["startTime", "publishTime", "generation"]].drop_duplicates()
    df = df[(df["startTime"] >= "2026-01-01") & (df["startTime"] < "2026-02-01")]
    _save_cache(df, "forecast.csv")
    return df