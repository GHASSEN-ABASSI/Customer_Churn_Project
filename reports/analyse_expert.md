# Analyse et Plan de Présentation : Projet Machine Learning Churn

Ce document contient l'analyse technique de votre projet, les points d'amélioration, et un plan détaillé pour présenter votre travail à votre enseignant.

## 1. Analyse Technique du Projet

### ✅ Points Forts
- **Structure professionnelle** : L'arborescence (`src`, `api`, `config`, `data`) respecte les standards de l'industrie (Cookiecutter Data Science).
- **Traçabilité avec MLflow** : L'utilisation de MLflow pour comparer les modèles (Logistic Regression, RandomForest, XGBoost) est un excellent point pour un projet académique.
- **Conteneurisation** : Docker et Docker Compose simplifient énormément le déploiement et la reproductibilité.
- **Validation des données** : L'utilisation de Pydantic dans l'API garantit que les entrées sont correctes.

### ❌ Problèmes à Corriger (Critiques)
Il y a un problème majeur de cohérence entre l'entraînement et l'inférence (API) :

1. **Persistance des Encoders/Scalers** : Dans `src/data/preprocess.py`, vous utilisez `LabelEncoder` et `StandardScaler`, mais vous ne sauvegardez pas l'état de ces outils.
   - **Risque** : L'API ré-entraîne un `LabelEncoder` sur une seule ligne de données, ce qui faussera complètement les prédictions (ex: 'Male' pourrait devenir 1 au lieu de 0).
   - **Solution** : Sauvegarder l'objet `scaler` et les `encoders` dans le dossier `models/` avec `joblib`.
2. **Absence de Scaling dans l'API** : Le script `api/predict.py` oublie d'appliquer le `StandardScaler` utilisé pendant l'entraînement. Sans cela, les variables numériques (tenure, charges) ne seront pas à la bonne échelle pour le modèle (ex: le modèle attend un chiffre entre -1 et 1, mais reçoit 72).
3. **Absence de Dossier de Tests** : Bien que vous ayez `test_setup.py`, il manque un vrai dossier `tests/` avec des tests unitaires (ex: `pytest`).

---

## 2. Plan de Présentation (Pas à Pas)

Voici comment structurer votre présentation pour "épater" votre enseignant :

### Étape 1 : Le Problème Métier (Le Churn)
- Expliquez ce qu'est le churn (désabonnement).
- Pourquoi c'est important ? (Coût d'acquisition > Coût de rétention).
- L'objectif : Prédire quel client va partir pour agir proactivement.

### Étape 2 : Exploration et Nettoyage (EDA)
- Montrez le notebook `01_EDA.ipynb`.
- Points clés : Déséquilibre des classes (plus de "No" que de "Yes"), corrélation entre `tenure` et `Churn`.
- Nettoyage : Gestion des `TotalCharges` (conversion string → float) et suppression de `customerID`.

### Étape 3 : Pipeline ML & Expérimentation
- Montrez `src/models/train.py`.
- Expliquez le choix des modèles.
- **Montrez MLflow** : Lancez l'interface et comparez les métriques (Recall, AUC).
- *Astuce expert* : Expliquez que dans le cas du churn, le **Recall** est plus important que l'Accuracy.

### Étape 4 : Déploiement & Industrialisation
- Montrez le `Dockerfile` et le `docker-compose.yml`.
- Expliquez l'avantage : "Cela tourne sur n'importe quel serveur avec une seule commande".
- Démo FastAPI : Ouvrez la page Swagger UI (`/docs`).

---

## 3. Guide d'Exécution et Tests

### Exécution Globale
```bash
# Lancer tout l'écosystème
docker-compose up --build
```
- API : `http://localhost:8000/docs`
- MLflow : `http://localhost:5000`

### Outils de Test
1. **Tests Unitaires avec Pytest** : Indispensable pour vérifier que le code ne casse pas lors des modifications.
2. **Swagger UI** : Pour tester manuellement les prédictions.
3. **MLflow UI** : Pour vérifier que le modèle est performant.
