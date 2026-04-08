"""
Data loading utilities for Customer Churn Prediction.
"""

import pandas as pd
import yaml
import logging
from pathlib import Path

logging.basicConfig(level=logging.INFO, format="%(asctime)s – %(levelname)s – %(message)s")
logger = logging.getLogger(__name__)


def load_config(config_path: str = "config/config.yaml") -> dict:
    """Load the project configuration from YAML file."""
    with open(config_path, "r") as f:
        config = yaml.safe_load(f)
    return config


def load_raw_data(filepath: str = None) -> pd.DataFrame:
    """
    Load the raw Telco Customer Churn dataset.

    Args:
        filepath: Path to the CSV file. Uses config default if None.

    Returns:
        Raw DataFrame.
    """
    if filepath is None:
        config = load_config()
        filepath = config["paths"]["raw_data"]

    path = Path(filepath)
    if not path.exists():
        raise FileNotFoundError(
            f"Dataset not found at '{filepath}'.\n"
            "Please download it from Kaggle:\n"
            "https://www.kaggle.com/datasets/blastchar/telco-customer-churn\n"
            "and place it in data/raw/"
        )

    df = pd.read_csv(filepath)
    logger.info(f"✅ Loaded dataset: {df.shape[0]} rows × {df.shape[1]} columns")
    return df


def get_data_summary(df: pd.DataFrame) -> None:
    """Print a summary of the dataset."""
    print("=" * 60)
    print("📊 DATASET SUMMARY")
    print("=" * 60)
    print(f"Shape          : {df.shape}")
    print(f"Missing values : {df.isnull().sum().sum()}")
    print(f"Duplicates     : {df.duplicated().sum()}")
    print(f"\nTarget distribution:\n{df['Churn'].value_counts()}")
    print(f"\nChurn rate     : {df['Churn'].value_counts(normalize=True)['Yes']:.2%}")
    print("=" * 60)


if __name__ == "__main__":
    df = load_raw_data()
    get_data_summary(df)
