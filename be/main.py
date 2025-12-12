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

# Ensure correct order for performance ML model
PERFORMANCE_ORDER = [
    "total_activities",
    "avg_minutes_per_module",
    "consistency_score",
    "weekend_ratio",
    "study_time_category",
    "total_active_days",
]

# Ensure correct order for clustering model/scaler
CLUSTER_ORDER = [
    "total_activities",
    "avg_minutes_per_module",
    "consistency_score",
    "weekend_ratio"
]


# --------------------
# RECOMMENDATION ENGINE
# --------------------
def generate_recommendations(perf_dict: dict, cluster_dict: dict, perf_pred: float, persona: str):
    """
    Generate actionable recommendations based on performance and persona
    """
    recommendations = []
    
    # 1. Consistency-based recommendations
    consistency = float(perf_dict.get("consistency_score", 0))
    if consistency < 5:
        recommendations.append({
            "category": "Consistency",
            "priority": "high",
            "title": "Tingkatkan Konsistensi Belajar",
            "description": "Konsistensi belajar kamu masih rendah. Coba tetapkan jadwal belajar rutin setiap hari.",
            "action": "Buat jadwal belajar 30 menit setiap hari pada waktu yang sama",
            "expected_impact": "Dapat meningkatkan consistency score hingga 40%"
        })
    elif consistency < 7:
        recommendations.append({
            "category": "Consistency",
            "priority": "medium",
            "title": "Pertahankan Ritme Belajar",
            "description": "Konsistensi kamu cukup baik, tapi masih bisa ditingkatkan.",
            "action": "Tambahkan sesi review mingguan untuk memperkuat pemahaman",
            "expected_impact": "Meningkatkan retensi materi hingga 25%"
        })
    else:
        recommendations.append({
            "category": "Consistency",
            "priority": "low",
            "title": "Konsistensi Excellent!",
            "description": "Kamu sudah memiliki pola belajar yang sangat konsisten.",
            "action": "Fokus pada materi yang lebih advanced untuk tantangan baru",
            "expected_impact": "Mempercepat progress pembelajaran 30%"
        })
    
    # 2. Activity-based recommendations
    total_activities = float(perf_dict.get("total_activities", 0))
    if total_activities < 20:
        recommendations.append({
            "category": "Activity",
            "priority": "high",
            "title": "Perbanyak Latihan",
            "description": "Jumlah aktivitas belajar kamu masih minim. Semakin banyak latihan, semakin baik pemahamanmu.",
            "action": "Target minimal 3-5 aktivitas belajar per hari",
            "expected_impact": "Meningkatkan pemahaman materi hingga 50%"
        })
    elif total_activities < 35:
        recommendations.append({
            "category": "Activity",
            "priority": "medium",
            "title": "Tingkatkan Aktivitas Belajar",
            "description": "Kamu sudah aktif, tapi masih bisa lebih optimal.",
            "action": "Coba tambah 2-3 aktivitas per hari dengan fokus pada area yang lemah",
            "expected_impact": "Percepatan progress hingga 30%"
        })
    else:
        recommendations.append({
            "category": "Activity",
            "priority": "low",
            "title": "Aktivitas Sangat Baik!",
            "description": "Kamu sangat aktif dalam belajar.",
            "action": "Fokus pada kualitas daripada kuantitas, pastikan setiap aktivitas bermakna",
            "expected_impact": "Optimalisasi waktu belajar hingga 20%"
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
    
    # 5. Persona-specific recommendations
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
    
    # 6. Performance-based overall recommendation
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
    return {"message": "API OK", "status": "healthy"}


# --------------------
# GET SAMPLE DATA FOR AUTO-FILL
# --------------------
@app.get("/sample-data")
async def get_sample_data():
    """
    Return sample data untuk auto-fill di frontend
    """
    try:
        # Get centroids from KMeans model
        centroids = kmeans_model.cluster_centers_
        
        # Use first centroid as default sample - ensure all positive values
        sample_cluster = {
            "total_activities": max(round(float(centroids[0][0]), 2), 1),  # minimum 1
            "avg_minutes_per_module": max(round(float(centroids[0][1]), 2), 1),  # minimum 1
            "consistency_score": max(round(float(centroids[0][2]), 2), 1),  # minimum 1
            "weekend_ratio": max(round(float(centroids[0][3]), 2), 0.01),  # minimum 0.01
        }
        
        # Sample performance data - ensure all positive values
        sample_performance = {
            "avg_minutes_per_module": max(round(float(centroids[0][1]), 2), 1),
            "consistency_score": max(round(float(centroids[0][2]), 2), 1),
            "total_activities": max(round(float(centroids[0][0]), 2), 1),
            "weekend_ratio": max(round(float(centroids[0][3]), 2), 0.01),
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
            
            if cluster_id == 0:  # The Consistent
                sample = {
                    "cluster_id": cluster_id,
                    "persona_label": persona_label,
                    "performance": {
                        "avg_minutes_per_module": 1.07,
                        "consistency_score": 1.14,
                        "total_activities": -0.83,
                        "weekend_ratio": 0.01,
                        "study_time_category": 2,
                        "total_active_days": 15,
                    },
                    "clustering": {
                        "total_activities": 1.07,
                        "avg_minutes_per_module": -0.83,
                        "consistency_score": 1.14,
                        "weekend_ratio": 0.01,
                    }
                }
            elif cluster_id == 1:  # The Sprinter
                sample = {
                    "cluster_id": cluster_id,
                    "persona_label": persona_label,
                    "performance": {
                        "avg_minutes_per_module": 0.4,
                        "consistency_score": -0.45,
                        "total_activities": -0.4,
                        "weekend_ratio": 0.94,
                        "study_time_category": 2,
                        "total_active_days": 15,
                    },
                    "clustering": {
                        "total_activities": -0.4,
                        "avg_minutes_per_module": 0.4,
                        "consistency_score": -0.45,
                        "weekend_ratio": 0.94,
                    }
                }
            else:  # The Warrior (cluster_id == 2)
                sample = {
                    "cluster_id": cluster_id,
                    "persona_label": persona_label,
                    "performance": {
                        "avg_minutes_per_module": 0.28,
                        "consistency_score": -0.47,
                        "total_activities": -0.45,
                        "weekend_ratio": -0.83,
                        "study_time_category": 2,
                        "total_active_days": 15,
                    },
                    "clustering": {
                        "total_activities": -0.45,
                        "avg_minutes_per_module": 0.28,
                        "consistency_score": -0.47,
                        "weekend_ratio": -0.83,
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
        df = pd.DataFrame(
            [[features.dict()[col] for col in CLUSTER_ORDER]],
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
        # Parse parts
        perf = PerformanceFeatures(**body["perf"])
        cluster = ClusteringFeatures(**body["cluster"])

        # Rebuild DataFrame with correct order
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
        scaled = scaler.transform(cluster_df)
        cluster_id = int(kmeans_model.predict(scaled)[0])
        persona = persona_mapping.get(str(cluster_id), "Unknown Persona")

        # Insight messages
        persona_insight = {
            "The Consistent": [
                "Kamu memiliki pola belajar yang stabil.",
                "Kedisiplinan kamu membantu progresmu meningkat.",
                "Pertahankan ritme belajar kamu!"
            ],
            "The Sprinter": [
                "Kamu cepat memahami materi.",
                "Tingkatkan konsistensi agar makin maksimal.",
                "Metode sprint cocok untukmu."
            ],
            "The Warrior": [
                "Kamu punya semangat tinggi dalam menyelesaikan tugas.",
                "Tipe pembelajar yang cepat adaptasi di materi sulit.",
                "Terus gunakan momentum ini untuk menyelesaikan lebih banyak modul."
            ]
        }

        perf_msg = (
            "Performa belajar kamu sangat baik."
            if perf_pred > 3 else
            "Performa kamu cukup stabil."
            if perf_pred > 2 else
            "Performa perlu ditingkatkan."
        )

        # Generate actionable recommendations
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
                "total_activities": round(centroid[0], 2),
                "avg_minutes_per_module": round(centroid[1], 2),
                "consistency_score": round(centroid[2], 2),
                "weekend_ratio": round(centroid[3], 2),
            }

            persona_samples.append({
                "cluster_id": cluster_id,
                "persona_label": persona_mapping.get(str(cluster_id), "Unknown"),
                "sample_clustering_input": sample_input
            })

        # SAMPLE FOR PERFORMANCE MODEL
        perf_sample = {
            "avg_minutes_per_module": 20,
            "consistency_score": 5,
            "total_activities": 30,
            "weekend_ratio": 0.3,
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
    Get benchmark statistics across all personas for comparison
    """
    try:
        centroids = kmeans_model.cluster_centers_
        
        benchmark_data = []
        
        for cluster_id, centroid in enumerate(centroids):
            persona_label = persona_mapping.get(str(cluster_id), "Unknown")
            
            benchmark_data.append({
                "cluster_id": cluster_id,
                "persona": persona_label,
                "avg_activities": round(float(centroid[0]), 2),
                "avg_minutes_per_module": round(float(centroid[1]), 2),
                "avg_consistency": round(float(centroid[2]), 2),
                "avg_weekend_ratio": round(float(centroid[3]), 2)
            })
        
        # Calculate overall averages
        overall_avg = {
            "avg_activities": round(sum([b["avg_activities"] for b in benchmark_data]) / len(benchmark_data), 2),
            "avg_minutes_per_module": round(sum([b["avg_minutes_per_module"] for b in benchmark_data]) / len(benchmark_data), 2),
            "avg_consistency": round(sum([b["avg_consistency"] for b in benchmark_data]) / len(benchmark_data), 2),
            "avg_weekend_ratio": round(sum([b["avg_weekend_ratio"] for b in benchmark_data]) / len(benchmark_data), 2)
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
    """
    Compare user's performance with benchmark averages
    """
    try:
        # Get user's prediction
        df = pd.DataFrame([[features.dict()[col] for col in PERFORMANCE_ORDER]],
                          columns=PERFORMANCE_ORDER)
        user_perf = float(performance_model.predict(df)[0])
        
        # Get benchmark stats
        centroids = kmeans_model.cluster_centers_
        benchmark_data = []
        
        for cluster_id, centroid in enumerate(centroids):
            persona_label = persona_mapping.get(str(cluster_id), "Unknown")
            
            # Prepare benchmark features
            bench_features = {
                "total_activities": float(centroid[0]),
                "avg_minutes_per_module": float(centroid[1]),
                "consistency_score": float(centroid[2]),
                "weekend_ratio": float(centroid[3]),
                "study_time_category": features.study_time_category,
                "total_active_days": features.total_active_days
            }
            
            bench_df = pd.DataFrame([[bench_features[col] for col in PERFORMANCE_ORDER]],
                                   columns=PERFORMANCE_ORDER)
            bench_perf = float(performance_model.predict(bench_df)[0])
            
            benchmark_data.append({
                "persona": persona_label,
                "benchmark_performance": round(bench_perf, 2),
                "difference": round(user_perf - bench_perf, 2)
            })
        
        # Calculate percentile
        all_perfs = [b["benchmark_performance"] for b in benchmark_data]
        percentile = (sum(1 for p in all_perfs if p < user_perf) / len(all_perfs)) * 100
        
        # Comparison analysis
        user_data = features.dict()
        comparison_insights = []
        
        # Compare activities
        avg_activities = sum([c[0] for c in centroids]) / len(centroids)
        if user_data["total_activities"] > avg_activities * 1.2:
            comparison_insights.append("📊 Kamu 20% lebih aktif dari rata-rata learner!")
        elif user_data["total_activities"] < avg_activities * 0.8:
            comparison_insights.append("📊 Tingkatkan aktivitas belajar untuk mencapai level rata-rata")
        
        # Compare consistency
        avg_consistency = sum([c[2] for c in centroids]) / len(centroids)
        if user_data["consistency_score"] > avg_consistency * 1.2:
            comparison_insights.append("⭐ Konsistensi kamu 20% lebih baik dari average!")
        elif user_data["consistency_score"] < avg_consistency * 0.8:
            comparison_insights.append("⭐ Fokus pada konsistensi untuk hasil lebih optimal")
        
        # Compare study time
        avg_time = sum([c[1] for c in centroids]) / len(centroids)
        if user_data["avg_minutes_per_module"] > avg_time * 1.2:
            comparison_insights.append("⏱️ Waktu belajar kamu lebih mendalam dari rata-rata")
        elif user_data["avg_minutes_per_module"] < avg_time * 0.8:
            comparison_insights.append("⏱️ Pertimbangkan menambah durasi per modul")
        
        return {
            "user_performance": round(user_perf, 2),
            "percentile": round(percentile, 1),
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