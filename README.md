# 📊 Customer Churn Prediction – End-to-End Machine Learning Project

![Python](https://img.shields.io/badge/Python-3.10-blue?logo=python)
![scikit-learn](https://img.shields.io/badge/scikit--learn-latest-orange?logo=scikit-learn)
![MLflow](https://img.shields.io/badge/MLflow-tracking-blue?logo=mlflow)
![FastAPI](https://img.shields.io/badge/FastAPI-backend-green?logo=fastapi)
![Docker](https://img.shields.io/badge/Docker-containerized-blue?logo=docker)

---

## 📌 Project Overview

This project aims to build a complete **end-to-end Machine Learning pipeline** to predict customer churn.

> **Customer churn** occurs when a customer stops using a company's service.  
> Predicting churn helps companies reduce revenue loss and improve customer retention strategies.

This project follows a **production-ready ML architecture** including:

- ✅ Data preprocessing & Exploratory Data Analysis (EDA)
- ✅ Model training & evaluation
- ✅ MLflow experiment tracking
- ✅ FastAPI backend deployment
- ✅ Docker containerization
- ✅ Frontend integration

---

## 📂 Dataset Information

| Property         | Value                                   |
|------------------|-----------------------------------------|
| **Dataset**      | Telco Customer Churn                    |
| **Source**       | [Kaggle](https://www.kaggle.com/datasets/blastchar/telco-customer-churn) |
| **Rows**         | 7,043 customers                         |
| **Features**     | 21 columns                              |
| **Target**       | `Churn` (Yes / No)                      |

The dataset contains customer **demographic information**, **services subscribed**, **billing information**, and **contract details**.

---

## 📁 Project Structure

```
customer-churn-prediction/
├── README.md
├── requirements.txt
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── config/
│   └── config.yaml           # Centralized configuration
├── data/
│   ├── raw/                  # Raw Kaggle dataset
│   └── processed/            # Cleaned & engineered features
├── notebooks/
│   ├── 01_EDA.ipynb          # Exploratory Data Analysis
│   ├── 02_preprocessing.ipynb
│   └── 03_model_training.ipynb
├── src/
│   ├── data/
│   │   ├── load_data.py      # Data loading utilities
│   │   └── preprocess.py     # Cleaning & encoding
│   ├── features/
│   │   └── feature_engineering.py
│   ├── models/
│   │   ├── train.py          # Model training + MLflow logging
│   │   └── evaluate.py       # Metrics & plots
│   └── visualization/
│       └── plots.py
├── api/
│   ├── main.py               # FastAPI application
│   ├── schemas.py            # Pydantic request/response models
│   └── predict.py            # Prediction logic
└── models/                   # Saved trained models (.pkl)
```

---

## 🎯 Project Objectives

1. 🧹 Perform **data cleaning** and **feature engineering**
2. 📊 Conduct thorough **Exploratory Data Analysis**
3. 🤖 Train and evaluate **ML classification models**
4. 📈 Track experiments using **MLflow**
5. 🚀 Deploy the model using **FastAPI**
6. 🐳 Containerize the application with **Docker**

---

## 🛠️ Technologies Used

| Category         | Tool/Library               |
|------------------|----------------------------|
| Language         | Python 3.10                |
| Data Processing  | Pandas, NumPy              |
| Visualization    | Matplotlib, Seaborn        |
| ML Framework     | Scikit-learn               |
| Experiment Track | MLflow                     |
| API              | FastAPI, Uvicorn           |
| Containerization | Docker, Docker Compose     |

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/customer-churn-prediction.git
cd customer-churn-prediction
```

### 2. Create a virtual environment
```bash
python -m venv venv
venv\Scripts\activate      # Windows
# source venv/bin/activate  # Linux/Mac
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Add the dataset
Download the Telco Customer Churn dataset from Kaggle and place it in:
```
data/raw/WA_Fn-UseC_-Telco-Customer-Churn.csv
```

### 5. Run the training pipeline
```bash
python src/models/train.py
```

### 6. Launch MLflow UI
```bash
mlflow ui
# Open http://localhost:5000
```

### 7. Start the FastAPI server
```bash
uvicorn api.main:app --reload
# Docs: http://localhost:8000/docs
```

### 8. Run with Docker
```bash
docker-compose up --build
```

---

## 📅 Weekly Deliverables

| Week | Goal                              | Status |
|------|-----------------------------------|--------|
| 1    | Repository setup + Dataset        | ✅ Done |
| 2    | Data cleaning & EDA               | 🔄 In Progress |
| 3    | Model training & evaluation       | ⏳ Planned |
| 4    | MLflow integration                | ⏳ Planned |
| 5    | FastAPI implementation            | ⏳ Planned |
| 6    | Docker deployment                 | ⏳ Planned |

---

## 📈 Results (to be updated)

| Model               | Accuracy | Precision | Recall | F1-Score | AUC-ROC |
|---------------------|----------|-----------|--------|----------|---------|
| Logistic Regression | –        | –         | –      | –        | –       |
| Random Forest       | –        | –         | –      | –        | –       |
| XGBoost             | –        | –         | –      | –        | –       |

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

This project is licensed under the MIT License.
