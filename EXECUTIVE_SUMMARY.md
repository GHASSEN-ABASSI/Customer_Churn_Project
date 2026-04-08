# Customer Churn Prediction – Executive Summary
**Machine Learning Project**

---

## 📊 1. EXPLORATORY DATA ANALYSIS (EDA)

### Dataset Overview
- **Source:** Telco Customer Churn (Kaggle)
- **Size:** 7,043 customers × 21 features
- **Target Variable:** Customer Churn (Binary: Yes/No)

### Key Findings

| Metric | Finding |
|---|---|
| **Churn Rate** | 26% (1,869 churned customers) – **Imbalanced dataset** |
| **Tenure Insight** | Customers with <12 months tenure have 5× higher churn rate |
| **Contract Type** | Month-to-month contracts: 42% churn vs. 3-11% for longer contracts |
| **Monthly Charges** | Higher charges correlate with higher churn probability |
| **Payment Method** | Electronic check users churn at 45% (highest) vs. 18-20% for others |
| **Services** | Customers with more bundled services have lower churn |

### Data Quality
- **Missing Values:** TotalCharges had ~11 missing values (filled with median)
- **Data Types:** 3 numerical + 15 categorical features
- **Imbalance Handling:** Stratified train/test split to preserve class distribution

---

## 🧹 2. DATA PREPROCESSING

### Cleaning Pipeline
1. **Fixed TotalCharges:** Converted from string to numeric, handled missing values
2. **Dropped customerID:** Non-predictive identifier
3. **Encoded Target:** Yes → 1, No → 0

### Feature Engineering
| New Feature | Purpose |
|---|---|
| **tenure_group** | Grouped tenure into 3 bins (New/Mid/Loyal) for interpretability |
| **avg_monthly_charge** | Average charge per month over customer lifetime |
| **service_count** | Number of active services (0-7 range) |

### Encoding & Scaling
- **Categorical Encoding:** Label Encoding applied to 15 categorical columns
- **Numerical Scaling:** StandardScaler (zero mean, unit variance)
- **Train/Test Split:** 80/20 stratified split (5,634 train, 1,409 test)

---

## 🤖 3. MODEL TRAINING & EVALUATION

### Models Trained
1. **Logistic Regression** – Baseline linear model (max_iter=1000)
2. **Random Forest** – Ensemble (n_estimators=100, max_depth=10)
3. **XGBoost** – Gradient boosting (n_estimators=200, learning_rate=0.05, max_depth=6)

### Performance Metrics Measured
- **Accuracy** – Overall correctness
- **Precision** – Positive prediction accuracy
- **Recall** – True churn detection rate
- **F1-Score** – Harmonic mean of precision & recall
- **AUC-ROC** – Overall discriminative ability (0-1 scale)

### Model Comparison

| Model | Accuracy | Precision | Recall | F1 | AUC-ROC |
|---|---|---|---|---|---|
| **Logistic Regression** | 0.80 | 0.65 | 0.50 | 0.57 | 0.84 |
| **Random Forest** | 0.82 | 0.68 | 0.57 | 0.62 | 0.87 |
| **XGBoost** ⭐🏆 | **0.83** | **0.70** | **0.61** | **0.65** | **0.89** |

---

## 🏆 4. BEST PERFORMING MODEL: XGBoost

### Why XGBoost?
✅ **Highest AUC-ROC (0.89)** – Best ability to rank churn vs. non-churn  
✅ **61% Recall** – Captures majority of actual churn cases  
✅ **70% Precision** – Reliable when predicting churn  
✅ **Gradient boosting advantage** – Handles non-linear patterns better than linear baseline  
✅ **Robust to imbalanced data** – Better balance between precision & recall vs. Logistic Regression  

### Feature Importance (Top 5)
1. **Tenure** – Strongest predictor of churn
2. **Contract Type** – Contract length critical
3. **Monthly Charges** – Price sensitivity
4. **Service Count** – Customer engagement indicator
5. **Internet Service** – Service type matters

### Business Impact
- **Detection Rate:** Identifies 61% of customers likely to churn
- **Precision:** 70% of flagged customers are true positives (actionable insights)
- **ROC-AUC 0.89:** Excellent discriminative power for production deployment

---

## 📈 5. RECOMMENDATIONS

1. **Deployment:** XGBoost model saved to `models/best_model.pkl` for FastAPI inference API
2. **Focus on high-risk segments:** Use tenure, contract, and charges as intervention triggers
3. **Monitor performance:** MLflow experiment tracking enabled at `mlruns/` directory
4. **Continuous improvement:** Retrain quarterly with new data to maintain performance
5. **Model explainability:** Feature importance analysis drives business strategy

---

## 📁 Artifacts
- **Notebooks:** `notebooks/01_EDA.ipynb`, `02_preprocessing.ipynb`, `03_model_training.ipynb`
- **Best Model:** `models/best_model.pkl`
- **MLflow Runs:** `mlruns/` directory (run `mlflow ui` to explore)
- **Processed Data:** `data/processed/churn_processed.csv`

---

**Status:** ✅ Production-Ready | **Model:** XGBoost | **AUC-ROC:** 0.89
