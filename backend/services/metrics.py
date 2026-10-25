import numpy as np
import pandas as pd


def calculate_metrics(df: pd.DataFrame) -> dict:
    if df.empty:
        return {"totalRecords": 0}

    err = df["error"]
    actual = df["actualGeneration"]

    # MAPE: skip rows where actual is 0 (can't divide by zero)
    nonzero = actual != 0
    mape = (err[nonzero].abs() / actual[nonzero]).mean() * 100

    return {
        "mae": float(err.abs().mean()),             # average size of error
        "rmse": float(np.sqrt((err ** 2).mean())),  # like MAE but punishes big errors
        "mape": float(mape),                        # error as % of actual
        "bias": float(err.mean()),                  # + = over-forecasting, - = under
        "maxError": float(err.max()),
        "minError": float(err.min()),
        "avgForecast": float(df["forecastGeneration"].mean()),
        "avgActual": float(actual.mean()),
        "totalRecords": int(len(df)),
    }