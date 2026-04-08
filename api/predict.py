"""
Prediction logic – loads the trained model and runs inference.
"""

import joblib
import pandas as pd
import logging
from pathlib import Path

from api.schemas import CustomerData, PredictionResponse
from src.data.load_data import load_config
from src.data.preprocess import encode_features

logger = logging.getLogger(__name__)
_model = None
_scaler = None
_encoders = None


def load_model():
    """Load the trained model and preprocessing objects from disk."""
    global _model, _scaler, _encoders
    config = load_config()
    models_dir = Path(config["paths"]["models_dir"])
    model_path = config["api"]["model_path"]
    scaler_path = models_dir / "scaler.pkl"
    encoders_path = models_dir / "encoders.pkl"

    if not Path(model_path).exists():
        raise FileNotFoundError(f"Model not found at '{model_path}'. Run src/models/train.py first.")

    _model = joblib.load(model_path)
    logger.info(f"✅ Model loaded from '{model_path}'")

    if scaler_path.exists():
        _scaler = joblib.load(scaler_path)
        logger.info(f"✅ Scaler loaded from '{scaler_path}'")
    
    if encoders_path.exists():
        _encoders = joblib.load(encoders_path)
        logger.info(f"✅ Encoders loaded from '{encoders_path}'")


def predict_churn(customer: CustomerData) -> PredictionResponse:
    """
    Run churn prediction on a single customer.

    Args:
        customer: CustomerData pydantic model.

    Returns:
        PredictionResponse with prediction, probability, and risk level.
    """
    if _model is None:
        load_model()

    # Convert to DataFrame
    data = customer.model_dump()
    df = pd.DataFrame([data])
    config = load_config()
    num_cols = config["data"]["numerical_columns"]

    # Encode categorical features using saved encoders
    df, _ = encode_features(df, encoders=_encoders)

    # Scale numerical features using saved scaler
    if _scaler:
        df[num_cols] = _scaler.transform(df[num_cols])

    # Predict
    prediction = int(_model.predict(df)[0])
    probability = float(_model.predict_proba(df)[0][1])

    # Risk level
    if probability < 0.35:
        risk = "Low"
    elif probability < 0.65:
        risk = "Medium"
    else:
        risk = "High"

    return PredictionResponse(
        churn_prediction=prediction,
        churn_label="Churn" if prediction == 1 else "No Churn",
        churn_probability=round(probability, 4),
        risk_level=risk,
    )
