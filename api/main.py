"""
FastAPI application for Customer Churn Prediction.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from api.schemas import CustomerData, PredictionResponse
from api.predict import load_model, predict_churn

app = FastAPI(
    title="Customer Churn Prediction API",
    description="End-to-end ML API to predict customer churn for Telco customers.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model at startup
@app.on_event("startup")
def startup_event():
    load_model()


@app.get("/", tags=["Health"])
def root():
    return {"message": "Customer Churn Prediction API is running 🚀"}


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok", "model": "loaded"}


@app.post("/predict", response_model=PredictionResponse, tags=["Prediction"])
def predict(customer: CustomerData):
    """
    Predict whether a customer will churn.

    Returns churn probability and binary prediction.
    """
    try:
        result = predict_churn(customer)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run("api.main:app", host="0.0.0.0", port=8000, reload=True)
