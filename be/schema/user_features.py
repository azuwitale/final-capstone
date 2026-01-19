from pydantic import BaseModel

class UserFeatures(BaseModel):
    total_courses: float
    completed_courses: float
    total_learning_hours: float
    quiz_average: float
    login_frequency: float

class PerformanceFeatures(BaseModel):
    completion_velocity: float
    avg_minutes_per_module: float
    login_gap_std: float
    weekend_ratio: float
    night_study_ratio: float
    study_time_category: float
    total_active_days: float

  
class ClusteringFeatures(BaseModel):
    completion_velocity: float
    avg_minutes_per_module: float
    login_gap_std: float
    weekend_ratio: float
    night_study_ratio: float

class PerformancePrediction(BaseModel):
    predicted_performance: float

class PersonaPrediction(BaseModel):
    cluster: int
    persona: str