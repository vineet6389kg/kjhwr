from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from services.elexon import fetch_actual, fetch_forecast
from services.processor import build_comparison, to_records, DEFAULT_DECISION_HOUR
from services.metrics import calculate_metrics

app = FastAPI(title="Wind Forecast Analytics API")

# CORS lets the React app (a different address) call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "ok", "message": "Wind Forecast Analytics API"}


@app.get("/forecast")
def forecast():
    return to_records(fetch_forecast())


@app.get("/actual")
def actual():
    return to_records(fetch_actual())


@app.get("/comparison")
def comparison(decisionHour: int = Query(DEFAULT_DECISION_HOUR, ge=0, le=23)):
    return to_records(build_comparison(decisionHour))


@app.get("/metrics")
def metrics(decisionHour: int = Query(DEFAULT_DECISION_HOUR, ge=0, le=23)):
    return calculate_metrics(build_comparison(decisionHour))


@app.get("/latest")
def latest(decisionHour: int = Query(DEFAULT_DECISION_HOUR, ge=0, le=23)):
    df = build_comparison(decisionHour)
    if df.empty:
        return {}
    return to_records(df.tail(1))[0]