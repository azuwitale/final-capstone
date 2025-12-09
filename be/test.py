import joblib
import pandas as pd

model = joblib.load("models/performance_predictor_model.pkl")

data = pd.DataFrame([{
    "total_activities": 20,
    "avg_minutes_per_module": 15,
    "consistency_score": 0.8,
    "weekend_ratio": 0.3,
    "study_time_category": 2,
    "total_active_days": 10
}])

# Prediksi
pred = model.predict(data)[0]

print("Prediksi Performa", pred)
