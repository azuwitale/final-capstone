from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import joblib
import json
import pandas as pd
from schema.user_features import (
    ClusteringFeatures,
    PerformanceFeatures,
    PerformancePrediction,
    PersonaPrediction
)

# --------------------
# UTILITY FUNCTIONS BUAT DATA TRANSFORMATION
# --------------------
def transform_zscore_to_readable(zscore_value, feature_name):
    """
    Ubah z-score values ke value yang gampang dibaca
    """
    feature_ranges = {
        "completion_velocity": {"mean": 0.75, "std": 0.2, "min": 0.1, "max": 1.0, "type": "float"},
        "avg_minutes_per_module": {"mean": 20, "std": 8, "min": 5, "max": 45, "type": "float"},
        "login_gap_std": {"mean": 2.5, "std": 1.0, "min": 0.5, "max": 7.0, "type": "float"},
        "weekend_ratio": {"mean": 0.3, "std": 0.2, "min": 0.0, "max": 1.0, "type": "float"},
        "night_study_ratio": {"mean": 0.25, "std": 0.15, "min": 0.0, "max": 0.8, "type": "float"}
    }
    
    if feature_name not in feature_ranges:
        return round(zscore_value, 2)
    
    range_info = feature_ranges[feature_name]
    
    readable_value = range_info["mean"] + (zscore_value * range_info["std"])
    readable_value = max(range_info["min"], min(range_info["max"], readable_value))
    
    if range_info["type"] == "int":
        return int(round(readable_value))
    
    return round(readable_value, 2)

def transform_readable_to_zscore(readable_value, feature_name):
    """
    Ubah Value Dari User ke z-score buat input model
    """
    feature_ranges = {
        "completion_velocity": {"mean": 0.75, "std": 0.2},
        "avg_minutes_per_module": {"mean": 20, "std": 8},
        "login_gap_std": {"mean": 2.5, "std": 1.0},
        "weekend_ratio": {"mean": 0.3, "std": 0.2},
        "night_study_ratio": {"mean": 0.25, "std": 0.15}
    }
    
    if feature_name not in feature_ranges:
        return readable_value
    
    range_info = feature_ranges[feature_name]
    
    # Convert readable value to z-score: zscore = (value - mean) / std
    zscore = (readable_value - range_info["mean"]) / range_info["std"]
    
    return zscore


def transform_centroid_to_readable(centroid):
    """
    Transform a full centroid (z-scores) to readable values
    """
    feature_names = ["completion_velocity", "avg_minutes_per_module", "login_gap_std", "weekend_ratio", "night_study_ratio"]
    
    readable_centroid = {}
    for i, feature_name in enumerate(feature_names):
        readable_centroid[feature_name] = transform_zscore_to_readable(centroid[i], feature_name)
    
    return readable_centroid


def transform_readable_features_to_zscore(features_dict):
    """
    Ubah readable feature dict ke z-scores buat model input
    """
    zscore_features = {}
    for feature_name, value in features_dict.items():
        zscore_features[feature_name] = transform_readable_to_zscore(value, feature_name)
    
    return zscore_features

app = FastAPI(
    title="Persona Flow Insight API",
    version="1.0.0"
)

# --------------------
# CORS
# --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------
# LOAD MODELS
# --------------------
try:
    performance_model = joblib.load("models/performance_predictor_model.pkl")
    kmeans_model = joblib.load("models/kmeans_persona_model.pkl")
    scaler = joblib.load("models/scaler_clustering.pkl")

    with open("models/persona_mapping.json", "r") as f:
        persona_mapping = json.load(f)

except Exception as e:
    raise RuntimeError(f"Failed to load models: {str(e)}")

# Buat Urutin Inputan ke performance ML model
PERFORMANCE_ORDER = [
    "completion_velocity",
    "avg_minutes_per_module",
    "login_gap_std",
    "weekend_ratio",
    "night_study_ratio",
    "study_time_category",
    "total_active_days",
]

#  Buat Urutin Inputan ke clustering model/scaler
CLUSTER_ORDER = [
    "completion_velocity",
    "avg_minutes_per_module",
    "login_gap_std",
    "weekend_ratio",
    "night_study_ratio"
]


# --------------------
# RECOMMENDATION ENGINE
# --------------------
def generate_recommendations(perf_dict: dict, cluster_dict: dict, perf_pred: float, persona: str):
    """
    Generate actionable recommendations based on performance and persona
    """
    recommendations = []
    
    # 1. Completion velocity recommendations
    completion_velocity = float(perf_dict.get("completion_velocity", 0))
    if completion_velocity < 0.5:
        recommendations.append({
            "category": "Completion Rate",
            "priority": "high",
            "title": "Tingkatkan Kecepatan Penyelesaian",
            "description": "Kecepatan penyelesaian tugas masih rendah. Fokus pada efisiensi belajar.",
            "action": "Buat target harian untuk menyelesaikan minimal 2-3 modul per hari",
            "expected_impact": "Dapat meningkatkan completion velocity hingga 40%"
        })
    elif completion_velocity < 0.75:
        recommendations.append({
            "category": "Completion Rate",
            "priority": "medium",
            "title": "Optimalkan Kecepatan Belajar",
            "description": "Kecepatan penyelesaian cukup baik, tapi masih bisa ditingkatkan.",
            "action": "Gunakan teknik time-blocking untuk fokus penuh pada setiap sesi",
            "expected_impact": "Meningkatkan efisiensi hingga 25%"
        })
    else:
        recommendations.append({
            "category": "Completion Rate",
            "priority": "low",
            "title": "Kecepatan Penyelesaian Excellent!",
            "description": "Kamu sangat efisien dalam menyelesaikan materi.",
            "action": "Fokus pada materi yang lebih challenging untuk growth",
            "expected_impact": "Mempercepat progress pembelajaran 30%"
        })
    
    # 2. Login gap consistency recommendations
    login_gap_std = float(perf_dict.get("login_gap_std", 0))
    if login_gap_std > 3:
        recommendations.append({
            "category": "Consistency",
            "priority": "high",
            "title": "Tingkatkan Konsistensi Login",
            "description": "Pola login kamu tidak teratur. Konsistensi adalah kunci pembelajaran efektif.",
            "action": "Tetapkan waktu belajar rutin setiap hari pada jam yang sama",
            "expected_impact": "Dapat meningkatkan retensi materi hingga 50%"
        })
    elif login_gap_std > 2:
        recommendations.append({
            "category": "Consistency",
            "priority": "medium",
            "title": "Stabilkan Pola Belajar",
            "description": "Konsistensi login cukup baik, tapi masih bisa lebih stabil.",
            "action": "Buat reminder harian dan stick to schedule",
            "expected_impact": "Meningkatkan konsistensi hingga 30%"
        })
    else:
        recommendations.append({
            "category": "Consistency",
            "priority": "low",
            "title": "Konsistensi Login Sangat Baik!",
            "description": "Pola login kamu sangat teratur dan konsisten.",
            "action": "Pertahankan rutinitas ini dan fokus pada kualitas sesi belajar",
            "expected_impact": "Mempertahankan momentum pembelajaran optimal"
        })
    
    # 3. Study time recommendations
    avg_minutes = float(perf_dict.get("avg_minutes_per_module", 0))
    if avg_minutes < 15:
        recommendations.append({
            "category": "Study Time",
            "priority": "high",
            "title": "Tambah Durasi Belajar",
            "description": "Waktu belajar per modul terlalu singkat untuk pemahaman mendalam.",
            "action": "Tingkatkan durasi belajar menjadi minimal 20-30 menit per modul",
            "expected_impact": "Meningkatkan pemahaman materi hingga 60%"
        })
    elif avg_minutes < 25:
        recommendations.append({
            "category": "Study Time",
            "priority": "medium",
            "title": "Optimalkan Waktu Belajar",
            "description": "Durasi belajar sudah cukup, tapi bisa lebih efektif.",
            "action": "Gunakan teknik Pomodoro: 25 menit fokus + 5 menit istirahat",
            "expected_impact": "Meningkatkan fokus dan retensi hingga 35%"
        })
    elif avg_minutes > 45:
        recommendations.append({
            "category": "Study Time",
            "priority": "medium",
            "title": "Perhatikan Efisiensi Belajar",
            "description": "Durasi belajar cukup lama, pastikan tetap efektif.",
            "action": "Break down materi menjadi bagian kecil dan ambil break teratur",
            "expected_impact": "Mencegah burnout dan meningkatkan produktivitas 25%"
        })
    else:
        recommendations.append({
            "category": "Study Time",
            "priority": "low",
            "title": "Durasi Belajar Ideal!",
            "description": "Waktu belajar kamu sudah optimal.",
            "action": "Pertahankan pola ini dan fokus pada variasi metode belajar",
            "expected_impact": "Mempertahankan performa optimal"
        })
    
    # 4. Weekend learning recommendations
    weekend_ratio = float(cluster_dict.get("weekend_ratio", 0))
    if weekend_ratio < 0.2:
        recommendations.append({
            "category": "Schedule",
            "priority": "medium",
            "title": "Manfaatkan Waktu Weekend",
            "description": "Kamu jarang belajar di weekend. Weekend bisa jadi waktu efektif untuk review.",
            "action": "Alokasikan 1-2 jam di weekend untuk review materi mingguan",
            "expected_impact": "Meningkatkan retensi materi hingga 30%"
        })
    elif weekend_ratio > 0.5:
        recommendations.append({
            "category": "Schedule",
            "priority": "low",
            "title": "Balance Weekend & Weekday",
            "description": "Kamu lebih banyak belajar di weekend.",
            "action": "Seimbangkan dengan aktivitas weekday untuk konsistensi lebih baik",
            "expected_impact": "Meningkatkan konsistensi harian 20%"
        })
    
    # 5. Night study recommendations
    night_study_ratio = float(cluster_dict.get("night_study_ratio", 0))
    if night_study_ratio > 0.5:
        recommendations.append({
            "category": "Schedule",
            "priority": "medium",
            "title": "Pertimbangkan Waktu Belajar Optimal",
            "description": "Kamu sering belajar malam hari. Pertimbangkan waktu yang lebih optimal.",
            "action": "Coba shift sebagian sesi ke pagi atau siang untuk energi lebih baik",
            "expected_impact": "Meningkatkan fokus dan retensi hingga 25%"
        })
    elif night_study_ratio < 0.1:
        recommendations.append({
            "category": "Schedule",
            "priority": "low",
            "title": "Pola Waktu Belajar Baik",
            "description": "Kamu belajar di waktu yang optimal untuk fokus.",
            "action": "Pertahankan pola ini dan manfaatkan peak energy hours",
            "expected_impact": "Mempertahankan produktivitas optimal"
        })
    
    # 6. Persona-specific recommendations
    if persona == "The Consistent":
        recommendations.append({
            "category": "Persona",
            "priority": "low",
            "title": "Leverage Konsistensi Kamu",
            "description": "Sebagai consistent learner, kamu punya fondasi yang kuat.",
            "action": "Mulai tackle materi advanced dan jadi mentor untuk teman",
            "expected_impact": "Memperdalam pemahaman melalui teaching 40%"
        })
    elif persona == "The Sprinter":
        recommendations.append({
            "category": "Persona",
            "priority": "medium",
            "title": "Balance Speed dengan Depth",
            "description": "Kamu cepat memahami, tapi pastikan tidak skip detail penting.",
            "action": "Tambahkan sesi review untuk memastikan pemahaman mendalam",
            "expected_impact": "Meningkatkan retensi jangka panjang 35%"
        })
    elif persona == "The Warrior":
        recommendations.append({
            "category": "Persona",
            "priority": "medium",
            "title": "Channel Energy ke Strategi",
            "description": "Semangat tinggi perlu diarahkan dengan strategi yang tepat.",
            "action": "Fokus pada materi yang challenging dan buat study plan terstruktur",
            "expected_impact": "Maksimalkan hasil belajar hingga 45%"
        })
    
    # 7. Performance-based overall recommendation
    if perf_pred < 2.5:
        recommendations.append({
            "category": "Overall",
            "priority": "high",
            "title": "Action Plan untuk Improvement",
            "description": "Performa kamu perlu ditingkatkan secara menyeluruh.",
            "action": "Fokus pada 2-3 rekomendasi prioritas tinggi di atas, lakukan selama 2 minggu",
            "expected_impact": "Peningkatan performa hingga 50% dalam 1 bulan"
        })
    elif perf_pred < 3.5:
        recommendations.append({
            "category": "Overall",
            "priority": "medium",
            "title": "Push ke Level Selanjutnya",
            "description": "Performa sudah cukup baik, saatnya naik level.",
            "action": "Pilih 1-2 area untuk improvement dan konsisten lakukan 3 minggu",
            "expected_impact": "Mencapai performa excellent dalam 1 bulan"
        })
    else:
        recommendations.append({
            "category": "Overall",
            "priority": "low",
            "title": "Maintain Excellence",
            "description": "Performa kamu sudah sangat baik!",
            "action": "Fokus pada continuous improvement dan explore materi advanced",
            "expected_impact": "Menjadi top performer dan role model"
        })
    
    # Sort by priority
    priority_order = {"high": 0, "medium": 1, "low": 2}
    recommendations.sort(key=lambda x: priority_order[x["priority"]])
    
    return recommendations


@app.get("/")
async def root():
    return {"message": "BE JALAN WOK", "status": "success"}


# --------------------
# GET SAMPLE DATA FOR AUTO-FILL
# --------------------
@app.get("/sample-data")
async def get_sample_data():
    """
    Return sample data untuk auto-fill di frontend
    """
    try:
        # Ambil Dari KMeans model
        centroids = kmeans_model.cluster_centers_
        
        # Ubah Biar Gampang di baca menusa
        centroids = kmeans_model.cluster_centers_
        readable_centroid = transform_centroid_to_readable(centroids[0])
        
        sample_cluster = {
            "completion_velocity": readable_centroid["completion_velocity"],
            "avg_minutes_per_module": readable_centroid["avg_minutes_per_module"],
            "login_gap_std": readable_centroid["login_gap_std"],
            "weekend_ratio": readable_centroid["weekend_ratio"],
            "night_study_ratio": readable_centroid["night_study_ratio"],
        }
        
        # Sample performance data pake value yang gampang dibaca
        sample_performance = {
            "completion_velocity": readable_centroid["completion_velocity"],
            "avg_minutes_per_module": readable_centroid["avg_minutes_per_module"],
            "login_gap_std": readable_centroid["login_gap_std"],
            "weekend_ratio": readable_centroid["weekend_ratio"],
            "night_study_ratio": readable_centroid["night_study_ratio"],
            "study_time_category": 2,
            "total_active_days": 15,
        }
        
        return {
            "performance": sample_performance,
            "clustering": sample_cluster,
            "message": "Sample data for auto-fill"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --------------------
# GET ALL PERSONA SAMPLES
# --------------------
@app.get("/persona-samples")
async def get_persona_samples():
    """
    Return semua sample data untuk setiap persona
    """
    try:
        centroids = kmeans_model.cluster_centers_.tolist()
        
        samples = []
        for cluster_id, centroid in enumerate(centroids):
            persona_label = persona_mapping.get(str(cluster_id), "Unknown")
            
            # Ubah z-scores ke value yang gampang dibaca
            readable_centroid = transform_centroid_to_readable(centroid)
            
            sample = {
                "cluster_id": cluster_id,
                "persona_label": persona_label,
                "performance": {
                    "completion_velocity": readable_centroid["completion_velocity"],
                    "avg_minutes_per_module": readable_centroid["avg_minutes_per_module"],
                    "login_gap_std": readable_centroid["login_gap_std"],
                    "weekend_ratio": readable_centroid["weekend_ratio"],
                    "night_study_ratio": readable_centroid["night_study_ratio"],
                    "study_time_category": 2,
                    "total_active_days": 15,
                },
                "clustering": {
                    "completion_velocity": readable_centroid["completion_velocity"],
                    "avg_minutes_per_module": readable_centroid["avg_minutes_per_module"],
                    "login_gap_std": readable_centroid["login_gap_std"],
                    "weekend_ratio": readable_centroid["weekend_ratio"],
                    "night_study_ratio": readable_centroid["night_study_ratio"],
                }
            }
            samples.append(sample)
        
        return {
            "samples": samples,
            "total_personas": len(samples)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --------------------
# PERFORMANCE PREDICTION
# --------------------
@app.post("/predict/performance", response_model=PerformancePrediction)
async def predict_performance(features: PerformanceFeatures):
    try:
        df = pd.DataFrame([[features.dict()[col] for col in PERFORMANCE_ORDER]],
                          columns=PERFORMANCE_ORDER)

        pred = performance_model.predict(df)[0]

        return PerformancePrediction(predicted_performance=float(pred))

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --------------------
# PERSONA (CLUSTERING)
# --------------------
@app.post("/predict/persona", response_model=PersonaPrediction)
async def predict_persona(features: ClusteringFeatures):
    try:
        # Ubah Input Dari User ke z-scores buat model
        readable_features = features.dict()
        zscore_features = transform_readable_features_to_zscore(readable_features)
        
        df = pd.DataFrame(
            [[zscore_features[col] for col in CLUSTER_ORDER]],
            columns=CLUSTER_ORDER
        )

        scaled = scaler.transform(df)
        cluster = int(kmeans_model.predict(scaled)[0])
        persona = persona_mapping.get(str(cluster), "Unknown Persona")

        return PersonaPrediction(cluster=cluster, persona=persona)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --------------------
# INSIGHT (PERFORMANCE + PERSONA)
# --------------------
@app.post("/predict/insight")
async def predict_insight(body: dict):
    try:
        perf = PerformanceFeatures(**body["perf"])
        cluster = ClusteringFeatures(**body["cluster"])

        # Urutin DataFrame 
        perf_df = pd.DataFrame(
            [[perf.dict()[col] for col in PERFORMANCE_ORDER]],
            columns=PERFORMANCE_ORDER
        )

        cluster_df = pd.DataFrame(
            [[cluster.dict()[col] for col in CLUSTER_ORDER]],
            columns=CLUSTER_ORDER
        )

        # Predictions
        perf_pred = float(performance_model.predict(perf_df)[0])
        
        # Ubah clustering Dari User ke z-scores buat model
        readable_cluster_features = cluster.dict()
        zscore_cluster_features = transform_readable_features_to_zscore(readable_cluster_features)
        
        cluster_df_zscore = pd.DataFrame(
            [[zscore_cluster_features[col] for col in CLUSTER_ORDER]],
            columns=CLUSTER_ORDER
        )
        
        scaled = scaler.transform(cluster_df_zscore)
        cluster_id = int(kmeans_model.predict(scaled)[0])
        persona = persona_mapping.get(str(cluster_id), "Unknown Persona")

        # Insight messages
        persona_insight = {
            "The Consistent": [
                "Kamu memiliki pola belajar yang sangat stabil dan teratur.",
                "Kedisiplinan kamu adalah kekuatan utama dalam pembelajaran.",
                "Konsistensi tinggi kamu menghasilkan progress yang steady dan berkelanjutan."
            ],
            "The Sprinter": [
                "Kamu cepat memahami materi dan efisien dalam belajar.",
                "Kemampuan sprint kamu bagus, tapi konsistensi bisa ditingkatkan.",
                "Metode pembelajaran cepat cocok dengan gaya belajar kamu."
            ],
            "The Warrior": [
                "Kamu punya semangat tinggi dan dedikasi kuat dalam belajar.",
                "Tipe pembelajar yang gigih dan tidak mudah menyerah pada materi sulit.",
                "Effort tinggi kamu akan membuahkan hasil jika diimbangi dengan konsistensi."
            ]
        }

        perf_msg = (
            "Performa belajar kamu sangat baik."
            if perf_pred > 3 else
            "Performa kamu cukup stabil."
            if perf_pred > 2 else
            "Performa perlu ditingkatkan."
        )

        recommendations = generate_recommendations(
            perf_dict=perf.dict(),
            cluster_dict=cluster.dict(),
            perf_pred=perf_pred,
            persona=persona
        )

        return {
            "predicted_performance": perf_pred,
            "persona_cluster": cluster_id,
            "persona_label": persona,
            "insights": {
                "persona_based": persona_insight.get(persona, ["Belum ada insight."]),
                "performance_based": perf_msg,
            },
            "recommendations": recommendations
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --------------------
# AUTO-GENERATE TEST DATA FOR ALL PERSONAS
# --------------------
@app.get("/debug/generate-test-data")
async def generate_test_data():
    """
    Generate sample input otomatis untuk mengetes semua persona.
    Nilai diambil dari centroid model KMeans agar hasil cluster akurat.
    """
    try:
        centroids = kmeans_model.cluster_centers_.tolist()

        persona_samples = []

        for cluster_id, centroid in enumerate(centroids):
            sample_input = {
                "completion_velocity": round(centroid[0], 2),
                "avg_minutes_per_module": round(centroid[1], 2),
                "login_gap_std": round(centroid[2], 2),
                "weekend_ratio": round(centroid[3], 2),
                "night_study_ratio": round(centroid[4], 2),
            }

            persona_samples.append({
                "cluster_id": cluster_id,
                "persona_label": persona_mapping.get(str(cluster_id), "Unknown"),
                "sample_clustering_input": sample_input
            })

        # SAMPLE FOR PERFORMANCE MODEL
        perf_sample = {
            "completion_velocity": 0.75,
            "avg_minutes_per_module": 20,
            "login_gap_std": 2.5,
            "weekend_ratio": 0.3,
            "night_study_ratio": 0.25,
            "study_time_category": 2,
            "total_active_days": 15,
        }

        return {
            "persona_samples": persona_samples,
            "default_performance_input": perf_sample,
            "order_info": {
                "performance_order": PERFORMANCE_ORDER,
                "cluster_order": CLUSTER_ORDER
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --------------------
# HEALTH CHECK
# --------------------
@app.get("/health")
async def health_check():
    """
    Check if all models are loaded properly
    """
    try:
        return {
            "status": "healthy",
            "models": {
                "performance_model": "loaded",
                "kmeans_model": "loaded",
                "scaler": "loaded",
                "persona_mapping": "loaded"
            },
            "total_personas": len(persona_mapping),
            "cluster_features": CLUSTER_ORDER,
            "performance_features": PERFORMANCE_ORDER
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --------------------
# BENCHMARK & COMPARISON
# --------------------
@app.get("/benchmark/stats")
async def get_benchmark_stats():
    """
    dapetin bencmark dari semua persona
    """
    try:
        centroids = kmeans_model.cluster_centers_
        
        benchmark_data = []
        
        for cluster_id, centroid in enumerate(centroids):
            persona_label = persona_mapping.get(str(cluster_id), "Unknown")
            readable_centroid = transform_centroid_to_readable(centroid)
            
            benchmark_data.append({
                "cluster_id": cluster_id,
                "persona": persona_label,
                "avg_completion_velocity": readable_centroid["completion_velocity"],
                "avg_minutes_per_module": readable_centroid["avg_minutes_per_module"],
                "avg_login_gap_std": readable_centroid["login_gap_std"],
                "avg_weekend_ratio": readable_centroid["weekend_ratio"],
                "avg_night_study_ratio": readable_centroid["night_study_ratio"]
            })
        
        # Itung overall averages
        overall_avg = {
            "avg_completion_velocity": round(sum([b["avg_completion_velocity"] for b in benchmark_data]) / len(benchmark_data), 2),
            "avg_minutes_per_module": round(sum([b["avg_minutes_per_module"] for b in benchmark_data]) / len(benchmark_data), 2),
            "avg_login_gap_std": round(sum([b["avg_login_gap_std"] for b in benchmark_data]) / len(benchmark_data), 2),
            "avg_weekend_ratio": round(sum([b["avg_weekend_ratio"] for b in benchmark_data]) / len(benchmark_data), 2),
            "avg_night_study_ratio": round(sum([b["avg_night_study_ratio"] for b in benchmark_data]) / len(benchmark_data), 2)
        }
        
        return {
            "benchmark_by_persona": benchmark_data,
            "overall_average": overall_avg,
            "total_personas": len(benchmark_data)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/compare/performance")
async def compare_performance(features: PerformanceFeatures):
    try:
        # USER PERFORMANCE
        user_df = pd.DataFrame(
            [[features.dict()[col] for col in PERFORMANCE_ORDER]],
            columns=PERFORMANCE_ORDER
        )
        user_perf = float(performance_model.predict(user_df)[0])

        # BENCHMARK DARI CENTROIDS (ML)
        centroids = kmeans_model.cluster_centers_
        benchmark_data = []
        readable_centroids = []

        for cluster_id, centroid in enumerate(centroids):
            persona_label = persona_mapping.get(str(cluster_id), "Unknown")
            readable = transform_centroid_to_readable(centroid)
            readable_centroids.append(readable)

            bench_features = {
                "completion_velocity": readable["completion_velocity"],
                "avg_minutes_per_module": readable["avg_minutes_per_module"],
                "login_gap_std": readable["login_gap_std"],
                "weekend_ratio": readable["weekend_ratio"],
                "night_study_ratio": readable["night_study_ratio"],
                "study_time_category": features.study_time_category,
                "total_active_days": features.total_active_days
            }

            bench_df = pd.DataFrame(
                [[bench_features[col] for col in PERFORMANCE_ORDER]],
                columns=PERFORMANCE_ORDER
            )

            bench_perf = float(performance_model.predict(bench_df)[0])

            benchmark_data.append({
                "persona": persona_label,
                "benchmark_performance": round(bench_perf, 2),
                "difference": round(user_perf - bench_perf, 2)
            })

        # PERCENTILE
        all_perfs = [b["benchmark_performance"] for b in benchmark_data]
        percentile = (
            sum(1 for p in all_perfs if p < user_perf) / len(all_perfs)
        ) * 100

        # DYNAMIC AVERAGES Dari (ML)
        avg_completion_velocity = sum(c["completion_velocity"] for c in readable_centroids) / len(readable_centroids)
        avg_login_gap_std = sum(c["login_gap_std"] for c in readable_centroids) / len(readable_centroids)
        avg_time = sum(c["avg_minutes_per_module"] for c in readable_centroids) / len(readable_centroids)

        # INSIGHTS
        comparison_insights = []
        user_data = features.dict()

        if user_data["completion_velocity"] > avg_completion_velocity * 1.2:
            comparison_insights.append("Kecepatan penyelesaian kamu di atas rata-rata learner.")
        elif user_data["completion_velocity"] < avg_completion_velocity * 0.8:
            comparison_insights.append("Tingkatkan kecepatan penyelesaian untuk mencapai rata-rata.")

        if user_data["login_gap_std"] < avg_login_gap_std * 0.8:
            comparison_insights.append("Konsistensi login kamu sangat baik, di atas rata-rata.")
        elif user_data["login_gap_std"] > avg_login_gap_std * 1.2:
            comparison_insights.append("Fokus meningkatkan konsistensi login harian.")

        if user_data["avg_minutes_per_module"] > avg_time * 1.2:
            comparison_insights.append("Durasi belajar kamu lebih mendalam dari rata-rata.")
        elif user_data["avg_minutes_per_module"] < avg_time * 0.8:
            comparison_insights.append("Pertimbangkan menambah durasi belajar per modul.")

        return {
            "user_performance": round(user_perf, 2),
            "percentile": round(percentile, 1),
            "benchmark_source": "kmeans_centroids",
            "benchmark_comparison": benchmark_data,
            "comparison_insights": comparison_insights,
            "performance_level": (
                "Top Performer" if percentile >= 75 else
                "Above Average" if percentile >= 50 else
                "Average" if percentile >= 25 else
                "Needs Improvement"
            )
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/debug/model-features")
async def debug_model_features():
    try:
        perf_features = getattr(performance_model, 'feature_names_in_', 'Not available')
        cluster_features = getattr(kmeans_model, 'feature_names_in_', 'Not available')
        scaler_features = getattr(scaler, 'feature_names_in_', 'Not available')
        
        return {
            "performance_model_features": perf_features.tolist() if hasattr(perf_features, 'tolist') else str(perf_features),
            "kmeans_model_features": cluster_features.tolist() if hasattr(cluster_features, 'tolist') else str(cluster_features),
            "scaler_features": scaler_features.tolist() if hasattr(scaler_features, 'tolist') else str(scaler_features)
        }
    except Exception as e:
        return {"error tot": str(e)}
