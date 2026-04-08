"""
Data preprocessing pipeline for Customer Churn Prediction.
"""

import pandas as pd
import numpy as np
import logging
import joblib
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from pathlib import Path

from src.data.load_data import load_config

logging.basicConfig(level=logging.INFO, format="%(asctime)s – %(levelname)s – %(message)s")
logger = logging.getLogger(__name__)


def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Clean the raw Telco dataset:
    - Fix TotalCharges (stored as string with spaces)
    - Drop customerID
    - Encode target variable
    """
    df = df.copy()

    # Fix TotalCharges: coerce spaces to NaN and fill with median
    df["TotalCharges"] = pd.to_numeric(df["TotalCharges"], errors="coerce")
    missing_count = df["TotalCharges"].isnull().sum()
    if missing_count > 0:
        median_val = df["TotalCharges"].median()
        df["TotalCharges"].fillna(median_val, inplace=True)
        logger.info(f"  → Filled {missing_count} missing TotalCharges with median ({median_val:.2f})")

    # Drop customerID (not a predictive feature)
    if "customerID" in df.columns:
        df.drop(columns=["customerID"], inplace=True)
        logger.info("  → Dropped 'customerID' column")

    # Encode target: Yes → 1, No → 0
    df["Churn"] = df["Churn"].map({"Yes": 1, "No": 0})
    logger.info("  → Encoded target: Yes=1, No=0")

    logger.info(f"✅ Data cleaning complete: {df.shape[0]} rows × {df.shape[1]} columns")
    return df


def encode_features(df: pd.DataFrame, encoders: dict = None) -> tuple[pd.DataFrame, dict]:
    """
    Encode categorical features using Label Encoding.
    If encoders are provided, use them. Otherwise, fit new ones.
    """
    df = df.copy()
    config = load_config()
    cat_cols = config["data"]["categorical_columns"]
    
    new_encoders = {}
    for col in cat_cols:
        if col in df.columns:
            if encoders and col in encoders:
                le = encoders[col]
                # Handle possible unseen labels by mapping them to a default or handling error
                df[col] = df[col].astype(str).map(lambda x: x if x in le.classes_ else le.classes_[0])
                df[col] = le.transform(df[col])
            else:
                le = LabelEncoder()
                df[col] = le.fit_transform(df[col].astype(str))
                new_encoders[col] = le

    logger.info(f"✅ Encoded {len(cat_cols)} categorical columns")
    return df, new_encoders


def split_data(df: pd.DataFrame):
    """
    Split features and target, then train/test split.

    Returns:
        X_train, X_test, y_train, y_test
    """
    config = load_config()
    target = config["data"]["target_column"]
    test_size = config["data"]["test_size"]
    random_state = config["data"]["random_state"]

    X = df.drop(columns=[target])
    y = df[target]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state, stratify=y
    )

    logger.info(f"✅ Split: Train={X_train.shape[0]}, Test={X_test.shape[0]}")
    return X_train, X_test, y_train, y_test


def scale_features(X_train, X_test):
    """
    Apply StandardScaler to numerical features.

    Returns:
        X_train_scaled, X_test_scaled, scaler
    """
    config = load_config()
    num_cols = config["data"]["numerical_columns"]

    scaler = StandardScaler()
    X_train = X_train.copy()
    X_test = X_test.copy()

    X_train[num_cols] = scaler.fit_transform(X_train[num_cols])
    X_test[num_cols] = scaler.transform(X_test[num_cols])

    logger.info("✅ Features scaled with StandardScaler")
    return X_train, X_test, scaler


def run_preprocessing_pipeline(df: pd.DataFrame):
    """
    Full preprocessing pipeline: clean → encode → split → scale.

    Returns:
        X_train, X_test, y_train, y_test, scaler, encoders
    """
    logger.info("🔄 Starting preprocessing pipeline...")
    df = clean_data(df)
    df, encoders = encode_features(df)

    # Save processed data
    Path("data/processed").mkdir(parents=True, exist_ok=True)
    config = load_config()
    df.to_csv(config["paths"]["processed_data"], index=False)
    logger.info(f"💾 Saved processed data to '{config['paths']['processed_data']}'")

    X_train, X_test, y_train, y_test = split_data(df)
    X_train, X_test, scaler = scale_features(X_train, X_test)

    # Save preprocessing objects
    models_dir = Path(config["paths"]["models_dir"])
    models_dir.mkdir(parents=True, exist_ok=True)
    joblib.dump(scaler, models_dir / "scaler.pkl")
    joblib.dump(encoders, models_dir / "encoders.pkl")
    logger.info(f"💾 Saved scaler and encoders to '{models_dir}'")

    logger.info("✅ Preprocessing pipeline complete!")
    return X_train, X_test, y_train, y_test, scaler, encoders
