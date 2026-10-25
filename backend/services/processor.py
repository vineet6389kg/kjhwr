import pandas as pd
from .elexon import fetch_actual, fetch_forecast

# Assumption: the day-ahead decision is made at 12:00 UTC on the day BEFORE delivery.
DEFAULT_DECISION_HOUR = 12


def build_comparison(decision_hour: int = DEFAULT_DECISION_HOUR) -> pd.DataFrame:
    actual = fetch_actual().rename(columns={"generation": "actualGeneration"})
    forecast = fetch_forecast().rename(columns={"generation": "forecastGeneration"})

    # 1. Decision cutoff for each target time = (target day - 1 day) at decision_hour
    forecast["cutoff"] = (
        forecast["startTime"].dt.normalize()
        - pd.Timedelta(days=1)
        + pd.Timedelta(hours=decision_hour)
    )

    # 2. Keep only forecasts that were available before the cutoff
    usable = forecast[forecast["publishTime"] <= forecast["cutoff"]]

    # 3. For each startTime keep the LATEST usable forecast
    usable = usable.sort_values("publishTime").groupby("startTime").tail(1)

    # 4. Attach the actual value for the same startTime
    df = usable.merge(actual, on="startTime", how="inner")

    # 5. Error = forecast - actual
    df["error"] = df["forecastGeneration"] - df["actualGeneration"]

    return df[["startTime", "publishTime", "forecastGeneration",
               "actualGeneration", "error"]].sort_values("startTime").reset_index(drop=True)


def to_records(df: pd.DataFrame) -> list:
    """DataFrame -> list of dicts with ISO date strings (JSON friendly)."""
    out = df.copy()
    for col in ("startTime", "publishTime"):
        if col in out:
            out[col] = out[col].dt.strftime("%Y-%m-%dT%H:%M:%SZ")
    return out.to_dict(orient="records")