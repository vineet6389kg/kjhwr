from datetime import date, timedelta
import os
import requests
import pandas as pd

BASE_URL = "https://data.elexon.co.uk/bmrs/api/v1/datasets"
CACHE_DIR = "cache"
os.makedirs(CACHE_DIR, exist_ok=True)


def _get_json(endpoint: str, params: dict) -> list:
    """Call an Elexon 'stream' endpoint and return a list of records."""
    resp = requests.get(f"{BASE_URL}/{endpoint}/stream", params=params, timeout=60)
    resp.raise_for_status()  # raises an error if status is 4xx/5xx
    return resp.json()


def fetch_actual() -> pd.DataFrame:
    """Actual WIND generation for January 2026 (30-min resolution)."""
    cache_file = f"{CACHE_DIR}/actual.csv"
    if os.path.exists(cache_file):
        return pd.read_csv(cache_file, parse_dates=["startTime"])

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
    df.to_csv(cache_file, index=False)
    return df


def fetch_forecast() -> pd.DataFrame:
    """All WIND forecasts published from 31 Dec 2025 to 31 Jan 2026."""
    cache_file = f"{CACHE_DIR}/forecast.csv"
    if os.path.exists(cache_file):
        return pd.read_csv(cache_file, parse_dates=["startTime", "publishTime"])

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
    df.to_csv(cache_file, index=False)
    return df