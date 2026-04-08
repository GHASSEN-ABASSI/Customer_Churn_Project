"""Quick setup validation script."""
import pandas as pd
import sklearn
import mlflow
import fastapi
import xgboost

# Load dataset
df = pd.read_csv("data/raw/WA_Fn-UseC_-Telco-Customer-Churn.csv")

print("=" * 50)
print("  Setup Validation")
print("=" * 50)
print(f"  pandas     : {pd.__version__}")
print(f"  sklearn    : {sklearn.__version__}")
print(f"  mlflow     : {mlflow.__version__}")
print(f"  fastapi    : {fastapi.__version__}")
print(f"  xgboost    : {xgboost.__version__}")
print("=" * 50)
print(f"  Dataset shape   : {df.shape}")
print(f"  Columns         : {df.shape[1]}")
print(f"  Churn=Yes       : {(df['Churn']=='Yes').sum()} ({(df['Churn']=='Yes').mean():.1%})")
print(f"  Churn=No        : {(df['Churn']=='No').sum()} ({(df['Churn']=='No').mean():.1%})")
print(f"  Missing values  : {df.isnull().sum().sum()}")
print("=" * 50)
print("  ALL CHECKS PASSED!")
