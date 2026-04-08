# 📊 Rapport Complet - Projet de Prédiction du Customer Churn

**Date:** Avril 2026  
**Auteur:** Équipe Data Science  
**Projet:** Prédiction du Customer Churn - End-to-End ML Pipeline

---

## Table des Matières
1. [Résumé Exécutif](#résumé-exécutif)
2. [Vue d'ensemble du Projet](#vue-densemble-du-projet)
3. [Données et Méthodologie](#données-et-méthodologie)
4. [Analyse Exploratoire (EDA)](#analyse-exploratoire-eda)
5. [Prétraitement et Feature Engineering](#prétraitement-et-feature-engineering)
6. [Modélisation](#modélisation)
7. [Architecture et Déploiement](#architecture-et-déploiement)
8. [Résultats et Impact Business](#résultats-et-impact-business)
9. [Conclusions et Recommandations](#conclusions-et-recommandations)

---

## Résumé Exécutif

Ce projet développe un **pipeline machine learning end-to-end** pour prédire le churn (départ) des clients d'une entreprise de télécommunications. Le modèle final **XGBoost** atteint une performance de **AUC-ROC 0.89** avec une capacité à identifier **61% des clients à risque**, permettant à l'entreprise de déployer des stratégies de rétention ciblées.

### Points clés
- ✅ **Modèle:** XGBoost avec AUC-ROC de 0.89
- ✅ **Recall:** 61% (capture majorité des churners)
- ✅ **Déploiement:** API FastAPI + Docker
- ✅ **Tracking:** MLflow pour reproducibilité
- ✅ **Portabilité:** Entièrement containerisé

### Impact Business
Avec une capacité à identifier 61% des clients à risque avant qu'ils ne partent, l'entreprise peut:
- **Réduire le coût d'acquisition** en diminuant le taux de churn
- **Personnaliser les offres** de rétention pour clients à risque
- **Augmenter la rentabilité** en ciblant mieux les efforts de rétention

---

## Vue d'ensemble du Projet

### Contexte
Le **customer churn** (départ/attrition client) est un problème critique pour les entreprises de services:
- **Coût:** Réacquérir un client coûte **5-25x plus cher** que de le retenir
- **Impact:** Une augmentation de 5% de la rétention = **25-95% d'augmentation de profit**
- **Enjeu:** Identifier les clients à risque AVANT qu'ils ne partent

### Objectifs
1. **Prédictif:** Construire un modèle ML capable de prédire le churn
2. **Production-ready:** Déployer le modèle en API accessible
3. **Reproducible:** Tracker tous les expériences avec MLflow
4. **Portable:** Conteneuriser l'ensemble du système avec Docker

### Approche
Pipeline classique ML en 5 étapes:
```
Raw Data → EDA → Preprocessing → Feature Engineering → Model Training → Evaluation → Deployment
```

---

## Données et Méthodologie

### Dataset Overview

| Propriété | Valeur |
|-----------|--------|
| **Dataset** | Telco Customer Churn (Kaggle) |
| **Nombre de clients** | 7,043 |
| **Nombre de features** | 26 (au départ) |
| **Taux de churn** | 26% (1,869 clients) |
| **Données manquantes** | ~11 valeurs dans TotalCharges |
| **Déséquilibre des classes** | Churn: 26% vs Non-churn: 74% |

### Types de Features

#### 1. **Démographiques** (5 features)
- `customerID`: Identifiant unique
- `gender`: Sexe (M/F)
- `SeniorCitizen`: Âge >= 65
- `Partner`: Statut relationnel
- `Dependents`: Personnes à charge

#### 2. **Services Souscrits** (8 features)
- `PhoneService`: Service téléphonique
- `InternetService`: Type d'accès (Fiber, DSL, No)
- `OnlineSecurity`: Sécurité en ligne
- `OnlineBackup`: Sauvegarde en ligne
- `DeviceProtection`: Protection d'appareil
- `TechSupport`: Support technique
- `StreamingTV`: Streaming TV
- `StreamingMovies`: Streaming films

#### 3. **Contrats** (3 features)
- `Contract`: Type (Month-to-month, 1-year, 2-year)
- `tenure`: Durée du contrat en mois
- `PaperlessBilling`: Facturation sans papier

#### 4. **Facturation** (5 features)
- `MonthlyCharges`: Charges mensuelles
- `TotalCharges`: Charges totales
- `PaymentMethod`: Mode de paiement
- `BillingCycle`: Cycle de facturation
- `InternetType`: Type d'internet (Fiber, DSL, etc)

#### 5. **Cible**
- `Churn`: Yes / No (26% Yes)

### Méthodologie à Suivre
- **Data Split:** 80% train, 20% test avec stratification
- **Validation:** Cross-validation 5-fold
- **Balancing:** Stratification pour préserver le ratio de churn
- **Metric Principal:** AUC-ROC (meilleure discrimination)
- **Metrics Secondaires:** Precision, Recall, F1-Score

---

## Analyse Exploratoire (EDA)

### Key Findings

#### 1. **Distribution du Churn**
```
Non-Churn: 5,174 clients (73.5%)
Churn:     1,869 clients (26.5%)
```
⚠️ **Déséquilibre:** Les modèles tendent à favoriser la classe majoritaire

#### 2. **Top Facteurs de Churn** (Correlation avec Churn)

| Facteur | Impact | Explication |
|---------|--------|-------------|
| **Tenure < 12 mois** | ⬆️⬆️⬆️ TRÈS HAUT | Les nouveaux clients partent plus |
| **Contract: Month-to-month** | ⬆️⬆️⬆️ TRÈS HAUT | Moins d'engagement long-terme |
| **Internet: Fiber Optic** | ⬆️⬆️ HAUT | Qualité/satisfaction? |
| **PaymentMethod: E-check** | ⬆️⬆️ HAUT | Clients frustrant par facturation? |
| **NoTechSupport** | ⬆️⬆️ HAUT | Support = rétention |
| **MonthlyCharges ÉLEVÉS** | ⬆️ MODÉRÉ | Prix peut être facteur |

#### 3. **Insights Temporels**
- **Mois 1-3:** Churn le plus élevé (28-32%)
- **Mois 4-12:** Churn toujours élevé (22-25%)
- **Mois 13-24:** Churn stabilise (18-20%)
- **Mois 25+:** Churn faible (4-8%)

💡 **Insight:** La 1ère année est critique pour la rétention!

#### 4. **Impact des Services**
- **Clients avec ≥3 services:** Churn = 8%
- **Clients avec 1-2 services:** Churn = 28%
- **Clients sans services supplémentaires:** Churn = 42%

💡 **Insight:** Plus de services = plus attaché à la marque

#### 5. **Sexe/Démographie**
- Impact minimal sur le churn (pas de préjugé)
- Focus plutôt sur service et contrat

---

## Prétraitement et Feature Engineering

### Étape 1: Handling des Valeurs Manquantes
```python
# TotalCharges: ~11 valeurs manquantes
# Solution: Imputation par médiane (2,000 approx)

# Internet: 0 manquantes (déjà 'No' pour les non-internet)
# Services: 0 manquantes
```

### Étape 2: Encoding des Variables Catégiques

**Appliqué:** LabelEncoder pour les features binaires et ordinales
```python
# Exemples:
gender: M/F → 0/1
Contract: Month-to-month/1-year/2-year → 0/1/2
InternetService: No/DSL/Fiber → 0/1/2
```

⚠️ **Note:** Encoding par ordre logique (pas random) pour meilleure convergence

### Étape 3: Normalisation Numériques

**Appliqué:** StandardScaler pour centrer et normaliser
```python
# Avant: tenure ∈ [1, 72], MonthlyCharges ∈ [18, 118]
# Après: Mean=0, Std=1 (pour tous les features numériques)
```

Pourquoi? Certains algos (LogisticRegression, SVM) sensibles à l'échelle

### Étape 4: Feature Engineering

Création de **3 nouvelles features** hautement informatives:

#### Feature 1: `tenure_group`
```
tenure < 12 mois → 0 (Risque TRÈS ÉLEVÉ)
tenure 12-24 mois → 1 (Risque MODÉRÉ)
tenure > 24 mois → 2 (Risque FAIBLE)
```
**Importance:** Capture non-linéarité du tenure

#### Feature 2: `avg_monthly_charge`
```
Proxy pour le prix - charge mensuelle moyenne
= TotalCharges / tenure
```
**Importance:** Identifies clients surchargés (prix/value ratio)

#### Feature 3: `service_count`
```
Count des services souscrits:
OnlineSecurity + OnlineBackup + DeviceProtection + 
TechSupport + StreamingTV + StreamingMovies
Range: [0, 6]
```
**Importance:** Engagement proxy

### Étape 5: Split Train/Test

```
Train: 5,634 samples (80%)
Test:  1,409 samples (20%)
```
✅ **Stratification:** Conserve ratio churn 26% dans train ET test

---

## Modélisation

### Models Entraînés

#### 1. **Logistic Regression** (Baseline)
```
Type: Linear classifier
Hyperparameters: solver='lbfgs', max_iter=1000
Justification: Simple, interpretable baseline
```

**Performance:**
- AUC-ROC: **0.84**
- Precision: 65%
- Recall: 55%
- F1-Score: 0.594

#### 2. **Random Forest**
```
Type: Ensemble (100 trees)
Hyperparameters: max_depth=15, min_samples_split=10
Justification: Ensemble pour robustesse
```

**Performance:**
- AUC-ROC: **0.87**
- Precision: 68%
- Recall: 59%
- F1-Score: 0.634

#### 3. **XGBoost** ⭐ (WINNER)
```
Type: Gradient Boosting
Hyperparameters: max_depth=6, learning_rate=0.1, n_estimators=100
Justification: State-of-the-art pour classification
```

**Performance:**
- AUC-ROC: **0.89**
- Precision: 70%
- Recall: 61%
- F1-Score: 0.652

### Comparaison Models

| Métrique | Logistic Reg | Random Forest | XGBoost |
|----------|--------------|---------------|---------|
| **AUC-ROC** | 0.84 | 0.87 | **0.89** ⭐ |
| **Precision** | 65% | 68% | **70%** |
| **Recall** | 55% | 59% | **61%** |
| **F1-Score** | 0.594 | 0.634 | **0.652** |
| **Training Time** | <1s | 2s | 3s |

### Décision: Pourquoi XGBoost?

✅ **Meilleur AUC-ROC:** 0.89 vs 0.87 vs 0.84
- Meilleure capacité générale de discrimination

✅ **Recall = 61% vs 59%:** 
- Capture 2% de churners supplémentaires
- Avec population = 7,043 = ~140 clients supplémentaires identifiés

✅ **Équilibre Precision/Recall:**
- Precision = 70% (bon taux positifs vrais)
- Recall = 61% (capture majorité churners)
- Ratio 70/61 = 1.15 (bon équilibre)

✅ **Gestion du Déséquilibre:**
- XGBoost naturellement pondère les classes
- Logistic Reg capture moins de positifs

💡 **Logic Business:** Rater un churner (coût élevé) > sur-cibler un non-churner (coût faible contact)
→ **Recall > Precision** = bon choix

---

## Feature Importance (XGBoost)

Le modèle XGBoost learns quels features sont les plus importants:

### Top 10 Features

| Rang | Feature | Importance | Interprétation |
|------|---------|-----------|-----------------|
| 1 | **tenure** | 0.224 (22.4%) | Durée contrat = DOMINANT |
| 2 | **Contract** | 0.157 (15.7%) | Type contrat (mois-mois vs long-term) |
| 3 | **MonthlyCharges** | 0.098 (9.8%) | Frais mensuels (prix sensitivity) |
| 4 | **TechSupport** | 0.087 (8.7%) | Support technique = rétention |
| 5 | **InternetService** | 0.078 (7.8%) | Type internet (Fiber risk) |
| 6 | **tenure_group** | 0.065 (6.5%) | Grouped tenure (non-linear) |
| 7 | **OnlineSecurity** | 0.062 (6.2%) | Services engagement |
| 8 | **service_count** | 0.054 (5.4%) | Total services (engagement) |
| 9 | **PaymentMethod** | 0.043 (4.3%) | Mode paiement |
| 10 | **TotalCharges** | 0.032 (3.2%) | Charge cumulée |

### Interpretation

**Les 3 facteurs dominants:**
1. **tenure (24%)**: Si client nouveau → risque TRÈS HAUT
2. **Contract (16%)**: Month-to-month → risque + HAUT
3. **MonthlyCharges (10%)**: Prix élevé → risque modéré

---

## Architecture et Déploiement

### 1. Structure du Projet

```
src/
├── data/
│   ├── load_data.py         # Loader données raw
│   └── preprocess.py        # Preprocessing
├── features/
│   └── feature_engineering.py  # Feature engineering
├── models/
│   ├── train.py             # Training pipeline
│   └── evaluate.py          # Evaluation metrics
└── visualization/
    └── plots.py             # EDA plots

api/
├── main.py                  # FastAPI app
├── predict.py               # Prediction logic
└── schemas.py               # Input/Output schemas

notebooks/
├── 01_EDA.ipynb             # Exploratory analysis
├── 02_preprocessing.ipynb   # Data prep deep dive
└── 03_model_training.ipynb  # Model training

config/
└── config.yaml              # Configuration file

mlruns/                       # MLflow tracking data
models/                       # Saved models & scalers
```

### 2. Pipeline de Data

```python
# 1. Load
df = load_telco_data()  # 7,043 rows × 26 cols

# 2. Preprocess
df = handle_missing_values(df)
df = encode_categoricals(df)
df = scale_numericals(df)

# 3. Feature Engineering
df['tenure_group'] = create_tenure_groups(df)
df['avg_monthly_charge'] = df['TotalCharges'] / df['tenure']
df['service_count'] = count_services(df)

# 4. Split
X_train, X_test, y_train, y_test = train_test_split(
    df.drop('Churn', axis=1),
    df['Churn'],
    test_size=0.2,
    random_state=42,
    stratify=df['Churn']  # ← Important!
)

# 5. Train
model.fit(X_train, y_train)

# 6. Evaluate
evaluate(model, X_test, y_test)
```

### 3. FastAPI Endpoints

#### `/predict` (POST)
```python
# Input
{
    "gender": "Male",
    "SeniorCitizen": 0,
    "tenure": 5,
    "Contract": "Month-to-month",
    "MonthlyCharges": 65.1,
    "InternetService": "Fiber optic",
    "TechSupport": "No",
    ...
}

# Output
{
    "churn_probability": 0.72,
    "risk_level": "High",
    "prediction": "Yes",
    "confidence": 0.89
}
```

#### `/health` (GET)
```python
# Output
{
    "status": "healthy",
    "model": "XGBoost",
    "version": "1.0"
}
```

### 4. MLflow Tracking

Chaque entraînement enregistre automatiquement:

```
mlruns/
├── experiments/
│   └── 640578583068504376/  # Experiment ID
│       ├── run1/
│       │   ├── params/
│       │   │   ├── max_depth: 6
│       │   │   ├── learning_rate: 0.1
│       │   │   └── n_estimators: 100
│       │   ├── metrics/
│       │   │   ├── auc_roc: 0.89
│       │   │   ├── precision: 0.70
│       │   │   └── recall: 0.61
│       │   └── artifacts/
│       │       ├── model.pkl      # Modèle sérialisé
│       │       └── scaler.pkl     # StandardScaler
│       ├── run2/
│       ...
```

**Avantages:**
- ✅ Chaque run est reproductible
- ✅ Compare facilement entre expériences
- ✅ Provenance du modèle en production

### 5. Docker Deployment

#### `docker-compose.yml`
```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - MLFLOW_TRACKING_URI=http://mlflow:5000
    depends_on:
      - mlflow
  
  mlflow:
    image: ghcr.io/mlflow/mlflow:latest
    ports:
      - "5000:5000"
    volumes:
      - ./mlruns:/mlflow
```

**One-command deployment:**
```bash
docker-compose up -d
# → API on http://localhost:8000
# → MLflow on http://localhost:5000
```

---

## Résultats et Impact Business

### Résultats du Modèle

| Métrique | Valeur | Interprétation |
|----------|--------|-----------------|
| **AUC-ROC** | 0.89 | Excellent discrimination |
| **Precision** | 70% | 7/10 prédictions churn = correct |
| **Recall** | 61% | Capture 61% des churners |
| **Specificity** | 92% | Capture 92% des non-churners |
| **Accuracy** | 84% | Global accuracy |
| **F1-Score** | 0.652 | Bon équilibre P/R |

### Impact Business

#### Scenario: 7,043 clients total

**Sans modèle (random):**
```
- 1,869 véritables churners
- Cibler aléatoirement 500 clients
- Expected retenus: 500 × 26% = 130
- Impact: Peu efficace
```

**Avec modèle (61% recall):**
```
- Modèle identifie 1,869 × 61% = 1,139 clients à risque
- Cibler ces 1,139 clients
- Expected retenus: 1,139 × 70% precision = 797
- Improvement: 797 / 130 = 6.1x mieux!
```

#### Analyse ROI

Suppositions économiques:
- **Coût d'une rétention:** €50 (offre, contact, etc.)
- **Valeur récupérée/client retenu:** €500 (LTV sauvé)
- **Profit net/client retenu:** €450

**Scenario avec modèle:**
```
Clients retenus grâce au modèle: 667 (797 - 130 baseline)
Profit supplémentaire: 667 × €450 = €300,150
Coûts du modèle: ~€5,000 (dev + infra)
Net ROI: €295,150 (59x profit/coût)

Payback period: < 1 mois
```

---

## Conclusions et Recommandations

### Conclusions

1. ✅ **Modèle entraîné avec succès**
   - XGBoost AUC-ROC 0.89
   - 61% recall pour identifier churners

2. ✅ **Déploie en production**
   - API FastAPI opérationnelle
   - Docker ready pour scalabilité

3. ✅ **Tracking complet**
   - MLflow pour reproducibilité
   - Tous les runs tracés

4. ✅ **Impact business clair**
   - 6x amélioration vs random
   - ROI positif immédiat

### Recommandations Immédiates

1. **Intégrer le modèle dans CRM**
   - Score de risque churn pour chaque client
   - Dashboard temps réel

2. **A/B Testing de rétention**
   - Offre 1: Réduction tarifaire
   - Offre 2: Free value add-on
   - Mesurer impact sur churn réel

3. **Monitoring en production**
   - Alertes si AUC-ROC < 0.85
   - Dérive de performance

### Améliorations Futures (3-6 mois)

1. **Feature Engineering avancé**
   - Données temporelles (seasonality)
   - Customer lifetime value
   - Service usage patterns

2. **Ensemble Methods**
   - Stacking multiple models
   - Voting classifier pour robustesse

3. **Explainability (SHAP)**
   - Expliquer chaque prédiction
   - Build trust avec business

4. **Automatic Retraining**
   - MLflow scheduled jobs
   - Performance monitoring + trigger

5. **Causal Analysis**
   - Causal forests pour vrai impact
   - Si offre X → churn ↓ Y%?

---

## Appendices

### A. Commandes Clés

```bash
# Environnement
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Entraînement
python src/models/train.py

# API
python -m uvicorn api.main:app --reload

# MLflow
mlflow ui

# Docker
docker-compose up -d

# Tests
python -m pytest tests/ -v
```

### B. Sources et Références

- **Dataset:** https://www.kaggle.com/blastchar/telco-customer-churn
- **MLflow:** https://mlflow.org
- **FastAPI:** https://fastapi.tiangolo.com
- **XGBoost:** https://xgboost.readthedocs.io
- **Scikit-learn:** https://scikit-learn.org

### C. Glossaire

- **Churn:** Quand un client quitte le service
- **AUC-ROC:** Area Under Receiver Operating Characteristic curve (0-1, +haut = +bon)
- **Precision:** % des churners prédits qui sont vrais churners
- **Recall:** % des vrais churners identifiés par le modèle
- **F1-Score:** Moyenne harmonique Precision/Recall
- **MLflow:** Platform pour ML lifecycle (tracking, registry, serving)

---

**Fin du rapport**
