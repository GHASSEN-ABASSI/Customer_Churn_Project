"""
Model evaluation utilities.
"""

import pandas as pd
import logging
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, roc_auc_score, classification_report
)

logger = logging.getLogger(__name__)


def evaluate_model(model, X_test, y_test, model_name: str = "Model") -> dict:
    """
    Evaluate a trained model and print a full report.

    Returns:
        dict of metrics
    """
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]

    metrics = {
        "accuracy":  round(accuracy_score(y_test, y_pred), 4),
        "precision": round(precision_score(y_test, y_pred), 4),
        "recall":    round(recall_score(y_test, y_pred), 4),
        "f1_score":  round(f1_score(y_test, y_pred), 4),
        "roc_auc":   round(roc_auc_score(y_test, y_prob), 4),
    }

    print(f"\n{'='*50}")
    print(f"  📊 {model_name} – Evaluation Report")
    print(f"{'='*50}")
    for k, v in metrics.items():
        print(f"  {k:<12}: {v:.4f}")
    print(f"\n{classification_report(y_test, y_pred, target_names=['No Churn', 'Churn'])}")

    return metrics


def compare_models(results: dict) -> pd.DataFrame:
    """
    Compare multiple model results as a DataFrame.

    Args:
        results: {model_name: metrics_dict}

    Returns:
        Sorted DataFrame by ROC AUC.
    """
    df = pd.DataFrame(results).T
    df = df.sort_values("roc_auc", ascending=False)

    print("\n📊 Model Comparison:")
    print(df.to_string())
    return df
