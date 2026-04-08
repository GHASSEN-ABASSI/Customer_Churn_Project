"""
Pydantic schemas for FastAPI request/response validation.
"""

from pydantic import BaseModel, Field
from typing import Literal


class CustomerData(BaseModel):
    """Input schema – mirrors the Telco dataset features (minus customerID)."""

    gender: Literal["Male", "Female"] = Field(..., example="Male")
    SeniorCitizen: int = Field(..., ge=0, le=1, example=0)
    Partner: Literal["Yes", "No"] = Field(..., example="Yes")
    Dependents: Literal["Yes", "No"] = Field(..., example="No")
    tenure: int = Field(..., ge=0, le=100, example=12)
    PhoneService: Literal["Yes", "No"] = Field(..., example="Yes")
    MultipleLines: Literal["Yes", "No", "No phone service"] = Field(..., example="No")
    InternetService: Literal["DSL", "Fiber optic", "No"] = Field(..., example="DSL")
    OnlineSecurity: Literal["Yes", "No", "No internet service"] = Field(..., example="No")
    OnlineBackup: Literal["Yes", "No", "No internet service"] = Field(..., example="Yes")
    DeviceProtection: Literal["Yes", "No", "No internet service"] = Field(..., example="No")
    TechSupport: Literal["Yes", "No", "No internet service"] = Field(..., example="No")
    StreamingTV: Literal["Yes", "No", "No internet service"] = Field(..., example="No")
    StreamingMovies: Literal["Yes", "No", "No internet service"] = Field(..., example="No")
    Contract: Literal["Month-to-month", "One year", "Two year"] = Field(..., example="Month-to-month")
    PaperlessBilling: Literal["Yes", "No"] = Field(..., example="Yes")
    PaymentMethod: Literal[
        "Electronic check",
        "Mailed check",
        "Bank transfer (automatic)",
        "Credit card (automatic)",
    ] = Field(..., example="Electronic check")
    MonthlyCharges: float = Field(..., ge=0, example=65.0)
    TotalCharges: float = Field(..., ge=0, example=780.0)

    class Config:
        json_schema_extra = {
            "example": {
                "gender": "Male",
                "SeniorCitizen": 0,
                "Partner": "Yes",
                "Dependents": "No",
                "tenure": 12,
                "PhoneService": "Yes",
                "MultipleLines": "No",
                "InternetService": "DSL",
                "OnlineSecurity": "No",
                "OnlineBackup": "Yes",
                "DeviceProtection": "No",
                "TechSupport": "No",
                "StreamingTV": "No",
                "StreamingMovies": "No",
                "Contract": "Month-to-month",
                "PaperlessBilling": "Yes",
                "PaymentMethod": "Electronic check",
                "MonthlyCharges": 65.0,
                "TotalCharges": 780.0,
            }
        }


class PredictionResponse(BaseModel):
    """Output schema for prediction results."""

    churn_prediction: int = Field(..., description="1 = Churn, 0 = No Churn")
    churn_label: str = Field(..., description="'Churn' or 'No Churn'")
    churn_probability: float = Field(..., description="Probability of churning (0.0 – 1.0)")
    risk_level: str = Field(..., description="'Low', 'Medium', or 'High'")
