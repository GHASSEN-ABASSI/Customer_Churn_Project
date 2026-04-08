"""
Feature engineering for Customer Churn Prediction.
"""

import pandas as pd
import numpy as np
import logging

logger = logging.getLogger(__name__)


def add_tenure_group(df: pd.DataFrame) -> pd.DataFrame:
    """Group tenure into bins: New / Mid / Loyal."""
    df = df.copy()
    df["tenure_group"] = pd.cut(
        df["tenure"],
        bins=[0, 12, 36, 72],
        labels=["New (0-12m)", "Mid (1-3y)", "Loyal (3y+)"],
    )
    logger.info("✅ Added 'tenure_group' feature")
    return df


def add_charges_per_month(df: pd.DataFrame) -> pd.DataFrame:
    """Add average monthly charges over lifetime."""
    df = df.copy()
    df["avg_monthly_charge"] = df.apply(
        lambda row: row["TotalCharges"] / row["tenure"] if row["tenure"] > 0 else row["MonthlyCharges"],
        axis=1,
    )
    logger.info("✅ Added 'avg_monthly_charge' feature")
    return df


def add_service_count(df: pd.DataFrame) -> pd.DataFrame:
    """Count number of active services per customer."""
    service_cols = [
        "PhoneService", "OnlineSecurity", "OnlineBackup",
        "DeviceProtection", "TechSupport", "StreamingTV", "StreamingMovies",
    ]
    df = df.copy()
    df["service_count"] = df[service_cols].apply(
        lambda row: sum(v == "Yes" for v in row), axis=1
    )
    logger.info("✅ Added 'service_count' feature")
    return df


def run_feature_engineering(df: pd.DataFrame) -> pd.DataFrame:
    """Run all feature engineering steps."""
    logger.info("🔄 Running feature engineering...")
    df = add_tenure_group(df)
    df = add_charges_per_month(df)
    df = add_service_count(df)
    logger.info(f"✅ Feature engineering done: {df.shape[1]} total columns")
    return df
