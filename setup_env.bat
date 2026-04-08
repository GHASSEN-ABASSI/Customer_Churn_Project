@echo off
echo.
echo ============================================================
echo   Customer Churn Prediction - Environment Setup
echo ============================================================
echo.

echo [1/4] Creating virtual environment...
python -m venv venv
echo Done.

echo.
echo [2/4] Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo [3/4] Installing dependencies...
pip install -r requirements.txt

echo.
echo [4/4] Creating necessary folders...
if not exist "models" mkdir models
if not exist "data\processed" mkdir data\processed
if not exist "reports\figures" mkdir reports\figures
if not exist "notebooks" mkdir notebooks

echo.
echo ============================================================
echo   Setup complete!
echo.
echo   Next steps:
echo   1. Place your dataset in: data\raw\WA_Fn-UseC_-Telco-Customer-Churn.csv
echo      Download from: https://www.kaggle.com/datasets/blastchar/telco-customer-churn
echo.
echo   2. Train the model:
echo      python src\models\train.py
echo.
echo   3. Launch MLflow UI:
echo      mlflow ui
echo.
echo   4. Start the API:
echo      uvicorn api.main:app --reload
echo ============================================================
pause
