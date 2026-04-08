"""
Model training with MLflow experiment tracking.
"""

import joblib
import mlflow
import mlflow.sklearn
import logging
import pandas as pd
import numpy as np
from pathlib import Path
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, roc_auc_score, classification_report
)

from src.data.load_data import load_raw_data, load_config
from src.data.preprocess import run_preprocessing_pipeline

logging.basicConfig(level=logging.INFO, format="%(asctime)s – %(levelname)s – %(message)s")
logger = logging.getLogger(__name__)


def get_models(config: dict) -> dict:
    """Return a dict of model name → model instance."""
    lr_cfg = config["models"]["logistic_regression"]
    rf_cfg = config["models"]["random_forest"]
    xgb_cfg = config["models"]["xgboost"]

    return {
        "LogisticRegression": LogisticRegression(**lr_cfg),
        "RandomForest": RandomForestClassifier(**rf_cfg),
        "XGBoost": XGBClassifier(**xgb_cfg, eval_metric="logloss", verbosity=0),
    }


def compute_metrics(y_true, y_pred, y_prob) -> dict:
    """Compute classification metrics."""
    return {
        "accuracy":  accuracy_score(y_true, y_pred),
        "precision": precision_score(y_true, y_pred),
        "recall":    recall_score(y_true, y_pred),
        "f1_score":  f1_score(y_true, y_pred),
        "roc_auc":   roc_auc_score(y_true, y_prob),
    }


def train_and_track(X_train, X_test, y_train, y_test, config: dict) -> str:
    """
    Train all models, log metrics to MLflow, and save the best model.

    Returns:
        Name of the best model.
    """
    mlflow.set_tracking_uri(config["mlflow"]["tracking_uri"])
    mlflow.set_experiment(config["mlflow"]["experiment_name"])

    best_model_name = None
    best_auc = 0.0
    best_model = None

    models = get_models(config)

    for name, model in models.items():
        logger.info(f"🏋️  Training {name}...")
        with mlflow.start_run(run_name=name):
            # Train
            model.fit(X_train, y_train)

            # Predict
            y_pred = model.predict(X_test)
            y_prob = model.predict_proba(X_test)[:, 1]

            # Metrics
            metrics = compute_metrics(y_test, y_pred, y_prob)

            # Log to MLflow
            mlflow.log_params(model.get_params())
            mlflow.log_metrics(metrics)
            mlflow.sklearn.log_model(model, artifact_path="model")

            logger.info(
                f"  Accuracy={metrics['accuracy']:.4f} | "
                f"F1={metrics['f1_score']:.4f} | "
                f"AUC={metrics['roc_auc']:.4f}"
            )

            # Track best
            if metrics["roc_auc"] > best_auc:
                best_auc = metrics["roc_auc"]
                best_model_name = name
                best_model = model

    # Save best model
    Path(config["paths"]["models_dir"]).mkdir(parents=True, exist_ok=True)
    model_path = Path(config["paths"]["models_dir"]) / "best_model.pkl"
    joblib.dump(best_model, model_path)
    logger.info(f"🏆 Best model: {best_model_name} (AUC={best_auc:.4f})")
    logger.info(f"💾 Saved to '{model_path}'")

    return best_model_name


if __name__ == "__main__":
    config = load_config()
    df = load_raw_data()
    X_train, X_test, y_train, y_test, scaler, encoders = run_preprocessing_pipeline(df)
    best = train_and_track(X_train, X_test, y_train, y_test, config)
    print(f"\n✅ Training complete. Best model: {best}")
    print("   Run `mlflow ui` to explore experiment results.")
