# 🚀 Guide de Démo : Présentation du Projet Churn

Ce fichier contient les étapes exactes à suivre pour faire une démonstration complète et professionnelle devant votre enseignant.

---

## 🏗️ 1. Préparation (Avant que l'enseignant n'arrive)
Assurez-vous que les dépendances sont installées et que le modèle est entraîné.
```bash
# Activation de l'environnement (si pas déjà fait)
.\venv\Scripts\activate

# Entraînement initial pour générer les modèles et scalers
python src/models/train.py
```

---

## 📊 2. Démo MLflow (La partie "Science des Données")
Montrez comment vous gérez vos expériences.
1. **Lancer MLflow :**
   ```bash
   mlflow ui
   ```
2. **Action :** Ouvrez `http://localhost:5000` dans le navigateur.
3. **À dire :** *"Ici, je compare mes différents modèles (LogReg, XGBoost). On peut voir que le modèle LogisticRegression a le meilleur AUC-ROC. Chaque entraînement est tracé avec ses hyperparamètres et ses métriques."*

---

## 🧪 3. Démo des Tests Automatisés (La partie "Ingénierie")
Montrez que votre code est robuste et testé.
1. **Lancer les tests :**
   ```bash
   python -m pytest tests/test_api.py -v
   ```
2. **Action :** Laissez les 3 points verts ou le message "PASSED" s'afficher.
3. **À dire :** *"Avant de déployer, j'exécute une suite de tests unitaires pour vérifier que l'API répond correctement et que le modèle de prédiction est bien chargé sans erreur."*

---

## ⚡ 4. Démo API FastAPI (La partie "Déploiement")
Montrez l'application en action.
1. **Lancer l'API :**
   ```bash
   python -m uvicorn api.main:app --reload
   ```
2. **Action :** Ouvrez `http://localhost:8000/docs`.
3. **Tester une prédiction :**
   - Cliquez sur **POST /predict** -> **Try it out**.
   - Utilisez l'exemple par défaut ou changez `tenure: 1` et `Contract: Month-to-month`.
   - Cliquez sur **Execute**.
4. **À dire :** *"L'API est documentée avec Swagger. Elle reçoit des données client en JSON, applique le même prétraitement que pendant l'entraînement (scaling et encoding), et renvoie une probabilité de départ ainsi qu'un niveau de risque (High/Medium/Low)."*

---

## 🐳 5. Démo Docker (La partie "DevOps")
Montrez que le projet est portable.
1. **Lancer tout le système :**
   ```bash
   docker-compose up --build
   ```
2. **À dire :** *"Enfin, tout le projet est conteneurisé. Avec une seule commande Docker, je peux déployer l'API et le serveur de tracking MLflow sur n'importe quel serveur en quelques secondes."*

---

## 💡 Astuces pour réussir
- **Restez calme :** Si une commande échoue, lisez l'erreur, c'est souvent un petit détail.
- **Le Recall :** Si on vous demande pourquoi avoir choisi tel modèle, dites : *"Pour le Churn, je privilégie le **Recall** car rater un client qui va partir coûte plus cher à l'entreprise que de cibler par erreur un client fidèle."*
