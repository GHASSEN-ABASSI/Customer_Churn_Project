"""
Visualization utilities for EDA and model evaluation.
"""

import matplotlib.pyplot as plt
import matplotlib
matplotlib.use("Agg")  # Non-interactive backend
import seaborn as sns
import pandas as pd
import numpy as np
from pathlib import Path
from sklearn.metrics import (
    confusion_matrix, roc_curve, auc, ConfusionMatrixDisplay
)

# ── Style ─────────────────────────────────────────────────────────
sns.set_theme(style="darkgrid", palette="muted")
PALETTE = {"No": "#4CAF50", "Yes": "#F44336"}
SAVE_DIR = Path("reports/figures")
SAVE_DIR.mkdir(parents=True, exist_ok=True)


def save(fig, name: str):
    path = SAVE_DIR / f"{name}.png"
    fig.savefig(path, dpi=150, bbox_inches="tight")
    print(f"💾 Saved: {path}")
    plt.close(fig)


# ── EDA Plots ─────────────────────────────────────────────────────

def plot_churn_distribution(df: pd.DataFrame):
    """Bar chart of churn vs no-churn counts."""
    fig, ax = plt.subplots(figsize=(6, 4))
    counts = df["Churn"].value_counts()
    bars = ax.bar(["No Churn", "Churn"], counts.values,
                  color=["#4CAF50", "#F44336"], edgecolor="white", linewidth=0.8)
    for bar, count in zip(bars, counts.values):
        ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 30,
                f"{count}\n({count/len(df):.1%})", ha="center", fontsize=11, fontweight="bold")
    ax.set_title("Churn Distribution", fontsize=14, fontweight="bold")
    ax.set_ylabel("Number of Customers")
    ax.set_ylim(0, counts.max() * 1.2)
    sns.despine()
    save(fig, "01_churn_distribution")


def plot_numeric_distributions(df: pd.DataFrame):
    """Histograms for numeric features split by churn."""
    num_cols = ["tenure", "MonthlyCharges", "TotalCharges"]
    fig, axes = plt.subplots(1, 3, figsize=(15, 4))
    for ax, col in zip(axes, num_cols):
        for label, color in [("No", "#4CAF50"), ("Yes", "#F44336")]:
            subset = df[df["Churn"] == label][col]
            ax.hist(subset, bins=30, alpha=0.6, color=color, label=label, edgecolor="none")
        ax.set_title(col, fontsize=12, fontweight="bold")
        ax.legend(title="Churn")
    fig.suptitle("Numeric Feature Distributions by Churn", fontsize=14, fontweight="bold")
    plt.tight_layout()
    save(fig, "02_numeric_distributions")


def plot_categorical_churn_rates(df: pd.DataFrame):
    """Churn rate per categorical feature."""
    cat_cols = ["Contract", "InternetService", "PaymentMethod", "gender", "Partner"]
    fig, axes = plt.subplots(1, len(cat_cols), figsize=(20, 4))
    for ax, col in zip(axes, cat_cols):
        rates = df.groupby(col)["Churn"].apply(lambda x: (x == "Yes").mean()).sort_values()
        rates.plot(kind="barh", ax=ax, color="#5C6BC0", edgecolor="none")
        ax.set_title(col, fontsize=11, fontweight="bold")
        ax.set_xlabel("Churn Rate")
        ax.set_xlim(0, 1)
    fig.suptitle("Churn Rate by Category", fontsize=14, fontweight="bold")
    plt.tight_layout()
    save(fig, "03_categorical_churn_rates")


def plot_correlation_heatmap(df: pd.DataFrame):
    """Correlation heatmap of numeric features."""
    num_df = df[["tenure", "MonthlyCharges", "TotalCharges"]].copy()
    fig, ax = plt.subplots(figsize=(6, 4))
    sns.heatmap(num_df.corr(), annot=True, fmt=".2f", cmap="coolwarm",
                linewidths=0.5, ax=ax, vmin=-1, vmax=1)
    ax.set_title("Correlation Heatmap", fontsize=14, fontweight="bold")
    save(fig, "04_correlation_heatmap")


# ── Model Evaluation Plots ─────────────────────────────────────────

def plot_confusion_matrix(y_true, y_pred, model_name: str = "Model"):
    """Styled confusion matrix."""
    cm = confusion_matrix(y_true, y_pred)
    fig, ax = plt.subplots(figsize=(5, 4))
    disp = ConfusionMatrixDisplay(cm, display_labels=["No Churn", "Churn"])
    disp.plot(ax=ax, cmap="Blues", colorbar=False)
    ax.set_title(f"Confusion Matrix – {model_name}", fontsize=13, fontweight="bold")
    save(fig, f"cm_{model_name.lower().replace(' ', '_')}")


def plot_roc_curves(models_results: dict):
    """
    Plot ROC curves for multiple models.
    models_results: {model_name: (y_true, y_prob)}
    """
    fig, ax = plt.subplots(figsize=(7, 5))
    colors = ["#5C6BC0", "#EF5350", "#66BB6A", "#FFA726"]
    for (name, (y_true, y_prob)), color in zip(models_results.items(), colors):
        fpr, tpr, _ = roc_curve(y_true, y_prob)
        roc_auc = auc(fpr, tpr)
        ax.plot(fpr, tpr, label=f"{name} (AUC={roc_auc:.3f})", color=color, linewidth=2)
    ax.plot([0, 1], [0, 1], "k--", linewidth=1)
    ax.set_xlabel("False Positive Rate")
    ax.set_ylabel("True Positive Rate")
    ax.set_title("ROC Curves – Model Comparison", fontsize=14, fontweight="bold")
    ax.legend(loc="lower right")
    sns.despine()
    save(fig, "roc_curves_comparison")


def plot_feature_importance(model, feature_names: list, model_name: str = "Model", top_n: int = 15):
    """Bar chart of feature importances (for tree models)."""
    if not hasattr(model, "feature_importances_"):
        print(f"⚠️ {model_name} has no feature_importances_ attribute.")
        return
    importances = pd.Series(model.feature_importances_, index=feature_names)
    importances = importances.sort_values(ascending=True).tail(top_n)
    fig, ax = plt.subplots(figsize=(8, 6))
    importances.plot(kind="barh", ax=ax, color="#5C6BC0", edgecolor="none")
    ax.set_title(f"Top {top_n} Feature Importances – {model_name}", fontsize=13, fontweight="bold")
    ax.set_xlabel("Importance Score")
    sns.despine()
    save(fig, f"feature_importance_{model_name.lower().replace(' ', '_')}")
