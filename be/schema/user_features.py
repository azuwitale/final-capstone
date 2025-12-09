from pydantic import BaseModel

class UserFeatures(BaseModel):
    total_courses: float
    completed_courses: float
    total_learning_hours: float
    quiz_average: float
    login_frequency: float

class PerformanceFeatures(BaseModel):
    avg_minutes_per_module: float
    consistency_score: float
    total_activities: float
    weekend_ratio: float
    study_time_category: float
    total_active_days: float

  
class ClusteringFeatures(BaseModel):
    avg_minutes_per_module: float
    consistency_score: float
    total_activities: float
    weekend_ratio: float

class PerformancePrediction(BaseModel):
    predicted_performance: float

class PersonaPrediction(BaseModel):
    cluster: int
    persona: str