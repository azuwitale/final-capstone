import { useState, useEffect } from "react";
import {
  AlertCircle,
  TrendingUp,
  Users,
  Lightbulb,
  Loader2,
  Sparkles,
  RefreshCw,
  Target,
  Clock,
  Activity,
  Award,
  CheckCircle,
  ArrowRight,
  Zap,
  Trophy,
  Calendar,
  Brain,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

export default function Analysis() {
  const [perfInput, setPerfInput] = useState({
    completion_velocity: "",
    avg_minutes_per_module: "",
    login_gap_std: "",
    weekend_ratio: "",
    night_study_ratio: "",
    study_time_category: "",
    total_active_days: "",
  });

  const [clusterInput, setClusterInput] = useState({
    completion_velocity: "",
    avg_minutes_per_module: "",
    login_gap_std: "",
    weekend_ratio: "",
    night_study_ratio: "",
  });

  const [performanceData, setPerformanceData] = useState(null);
  const [personaData, setPersonaData] = useState(null);
  const [insightData, setInsightData] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingSample, setLoadingSample] = useState(false);
  const [error, setError] = useState(null);
  const [personaSamples, setPersonaSamples] = useState([]);

  useEffect(() => {
    loadPersonaSamples();
  }, []);

  const loadPersonaSamples = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/persona-samples`);
      const data = await response.json();
      setPersonaSamples(data.samples);
    } catch (err) {
      console.error("Failed to load persona samples:", err);
    }
  };

  const handleChange = (e, setter) => {
    setter((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const loadSampleData = async () => {
    setLoadingSample(true);
    try {
      const response = await fetch(`${API_BASE_URL}/sample-data`);
      const data = await response.json();

      setPerfInput(data.performance);
      setClusterInput(data.clustering);

      setError(null);
    } catch (err) {
      setError(
        "Failed to load sample data. Please check if backend is running.",
      );
    } finally {
      setLoadingSample(false);
    }
  };

  const loadPersonaSample = (sample) => {
    setPerfInput(sample.performance);
    setClusterInput(sample.clustering);
    setError(null);
  };

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);

    try {
      const perf = await fetch(`${API_BASE_URL}/predict/performance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(perfInput),
      }).then((res) => res.json());

      const persona = await fetch(`${API_BASE_URL}/predict/persona`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clusterInput),
      }).then((res) => res.json());

      const insight = await fetch(`${API_BASE_URL}/predict/insight`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          perf: perfInput,
          cluster: clusterInput,
        }),
      }).then((res) => res.json());

      const comparison = await fetch(`${API_BASE_URL}/compare/performance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(perfInput),
      }).then((res) => res.json());

      setPerformanceData(perf);
      setPersonaData(persona);
      setInsightData(insight);
      setComparisonData(comparison);
    } catch {
      setError(
        "Failed to connect to API. Please make sure the backend is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Calculate progress percentages for visual indicators
  const getProgressData = () => {
    if (!perfInput.login_gap_std || !perfInput.completion_velocity) return null;

    return {
      completion: Math.min(
        (Number(perfInput.completion_velocity) / 1.0) * 100,
        100,
      ),
      consistency: Math.max(
        0,
        Math.min(((7.0 - Number(perfInput.login_gap_std)) / 7.0) * 100, 100),
      ),
      studyTime: Math.min(
        (Number(perfInput.avg_minutes_per_module) / 60) * 100,
        100,
      ),
      activeDays: Math.min(
        (Number(perfInput.total_active_days) / 30) * 100,
        100,
      ),
      nightStudy: Number(perfInput.night_study_ratio) * 100,
    };
  };

  const progressData = getProgressData();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
          AI Analysis
        </h1>
        <p className="text-gray-600 text-lg">
          Analyze student performance and learning patterns with AI
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* AUTO-FILL BUTTONS */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={loadSampleData}
          disabled={loadingSample}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loadingSample ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Auto-Fill Sample Data
            </>
          )}
        </button>

        {personaSamples.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {personaSamples.map((sample) => (
              <button
                key={sample.cluster_id}
                onClick={() => loadPersonaSample(sample)}
                className="px-4 py-3 rounded-xl bg-white border-2 border-gray-200 text-gray-700 font-medium shadow-sm hover:shadow-md hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                {sample.persona_label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* VISUAL PROGRESS INDICATORS */}
      {progressData && (
        <div className="mb-8 bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Target className="w-6 h-6 text-indigo-600" />
            Learning Progress Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Completion Velocity */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-gray-800">
                    Completion Velocity
                  </span>
                </div>
                <span className="text-2xl font-bold text-blue-600">
                  {(Number(perfInput.completion_velocity) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="relative w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progressData.completion}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                {progressData.completion >= 80
                  ? "Excellent completion rate!"
                  : progressData.completion >= 50
                    ? "Good progress, keep it up!"
                    : "Focus on completing more tasks"}
              </p>
            </div>

            {/* Login Consistency (Lower gap = better) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-gray-800">
                    Login Consistency
                  </span>
                </div>
                <span className="text-2xl font-bold text-green-600">
                  {Number(perfInput.login_gap_std).toFixed(1)}
                </span>
              </div>
              <div className="relative w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progressData.consistency}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                {progressData.consistency >= 80
                  ? "Very consistent login pattern!"
                  : progressData.consistency >= 50
                    ? "Good consistency!"
                    : "Work on regular login habits"}
              </p>
            </div>

            {/* Study Time per Module */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-gray-800">
                    Avg Minutes/Module
                  </span>
                </div>
                <span className="text-2xl font-bold text-purple-600">
                  {perfInput.avg_minutes_per_module}m
                </span>
              </div>
              <div className="relative w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progressData.studyTime}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                {progressData.studyTime >= 80
                  ? "Deep learning approach!"
                  : progressData.studyTime >= 50
                    ? "Balanced study time"
                    : "Quick learner or needs more focus?"}
              </p>
            </div>

            {/* Night Study Ratio */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                  <span className="font-semibold text-gray-800">
                    Night Study Ratio
                  </span>
                </div>
                <span className="text-2xl font-bold text-orange-600">
                  {(Number(perfInput.night_study_ratio) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="relative w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progressData.nightStudy}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                {progressData.nightStudy >= 60
                  ? "Night owl learner!"
                  : progressData.nightStudy >= 30
                    ? "Balanced schedule"
                    : "Day time focused!"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* INPUT FORM */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              Performance Features
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(perfInput).map((key) => {
              const fieldLabels = {
                completion_velocity: "Completion Velocity (0-1)",
                avg_minutes_per_module: "Avg Minutes per Module",
                login_gap_std: "Login Gap Std (days)",
                weekend_ratio: "Weekend Study Ratio (0-1)",
                night_study_ratio: "Night Study Ratio (0-1)",
                study_time_category: "Study Time Category (1-3)",
                total_active_days: "Total Active Days",
              };

              return (
                <div key={key} className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {fieldLabels[key] || key.replaceAll("_", " ")}
                  </label>
                  <input
                    name={key}
                    value={perfInput[key]}
                    onChange={(e) => handleChange(e, setPerfInput)}
                    placeholder={`Enter ${fieldLabels[key] || key.replaceAll("_", " ")}`}
                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    type="number"
                    step="0.01"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              Clustering Features
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(clusterInput).map((key) => {
              const fieldLabels = {
                completion_velocity: "Completion Velocity (0-1)",
                avg_minutes_per_module: "Avg Minutes per Module",
                login_gap_std: "Login Gap Std (days)",
                weekend_ratio: "Weekend Study Ratio (0-1)",
                night_study_ratio: "Night Study Ratio (0-1)",
              };

              return (
                <div key={key} className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {fieldLabels[key] || key.replaceAll("_", " ")}
                  </label>
                  <input
                    name={key}
                    value={clusterInput[key]}
                    onChange={(e) => handleChange(e, setClusterInput)}
                    placeholder={`Enter ${fieldLabels[key] || key.replaceAll("_", " ")}`}
                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    type="number"
                    step="0.01"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <button
        onClick={runAnalysis}
        disabled={loading}
        className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-3"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing Analysis...
          </>
        ) : (
          <>
            <Lightbulb className="w-5 h-5" />
            Run Analysis
          </>
        )}
      </button>

      {/* RESULT CARDS */}
      {performanceData && personaData && insightData && (
        <div className="mt-12 space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Analysis Results
          </h2>

          {/* STRAVA-STYLE INSIGHT CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Card 1: Performance Intelligence */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl p-6 border-2 border-slate-200 hover:shadow-xl transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  Performance Intelligence
                </h3>
              </div>

              <p className="text-gray-700 mb-4 leading-relaxed">
                {performanceData.predicted_performance > 3.5
                  ? "Outstanding performance with consistent high-quality learning patterns. You're excelling across all metrics."
                  : performanceData.predicted_performance > 2.5
                    ? "Solid performance showing good learning habits. There's room to push yourself to the next level."
                    : "Your learning journey is just beginning. Focus on building consistent study habits for better results."}
              </p>

              <div className="bg-white rounded-2xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    Performance Score
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    {performanceData.predicted_performance.toFixed(2)}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000"
                    style={{
                      width: `${
                        (performanceData.predicted_performance / 5) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors group-hover:shadow-lg">
                View Details
              </button>
            </div>

            {/* Card 2: Learner Persona */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-100 rounded-3xl p-6 border-2 border-emerald-200 hover:shadow-xl transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  Learner Persona
                </h3>
              </div>

              <div className="mb-4">
                <div className="bg-white rounded-2xl p-4 mb-3">
                  <div className="text-3xl font-extrabold text-emerald-600 mb-2">
                    {personaData.persona}
                  </div>
                  <div className="text-sm text-gray-600">
                    Cluster ID: {personaData.cluster}
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  {personaData.persona === "The Consistent"
                    ? "You demonstrate remarkable consistency in your learning patterns, building a solid foundation through regular practice."
                    : personaData.persona === "The Sprinter"
                      ? "You're a fast learner who quickly grasps new concepts. Your speed is impressive, focus on depth for even better results."
                      : personaData.persona === "The Warrior"
                        ? "You tackle challenges head-on with high energy and determination. Your persistence in difficult materials sets you apart."
                        : "Your unique learning style shows potential for growth across multiple dimensions."}
                </p>
              </div>

              <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-colors group-hover:shadow-lg">
                Explore Persona
              </button>
            </div>

            {/* Card 3: Key Insight */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-3xl p-6 border-2 border-amber-200 hover:shadow-xl transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-amber-600 rounded-2xl flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Key Insight</h3>
              </div>

              <div className="bg-white rounded-2xl p-4 mb-4">
                <p className="text-gray-700 font-medium leading-relaxed">
                  {insightData.insights?.performance_based ||
                    "No insights available"}
                </p>
              </div>

              <div className="space-y-2 mb-4">
                {perfInput.login_gap_std && (
                  <div className="flex items-center gap-2 text-sm">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        Number(perfInput.login_gap_std) <= 1.5
                          ? "bg-green-500"
                          : Number(perfInput.login_gap_std) <= 2.5
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    ></div>
                    <span className="text-gray-600">
                      Login Consistency:{" "}
                      <span className="font-semibold">
                        {Number(perfInput.login_gap_std) <= 1.5
                          ? "Excellent"
                          : Number(perfInput.login_gap_std) <= 2.5
                            ? "Good"
                            : "Needs Work"}
                      </span>
                    </span>
                  </div>
                )}
                {perfInput.completion_velocity && (
                  <div className="flex items-center gap-2 text-sm">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        Number(perfInput.completion_velocity) >= 0.8
                          ? "bg-green-500"
                          : Number(perfInput.completion_velocity) >= 0.6
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    ></div>
                    <span className="text-gray-600">
                      Completion Rate:{" "}
                      <span className="font-semibold">
                        {Number(perfInput.completion_velocity) >= 0.8
                          ? "High"
                          : Number(perfInput.completion_velocity) >= 0.6
                            ? "Medium"
                            : "Low"}
                      </span>
                    </span>
                  </div>
                )}
              </div>

              <button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-xl transition-colors group-hover:shadow-lg">
                Deep Dive
              </button>
            </div>
          </div>

          {/* STRAVA-STYLE STAT HIGHLIGHTS */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Trophy className="w-6 h-6 text-yellow-600" />
              Your Learning Stats
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Activity className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">
                  {(Number(perfInput.completion_velocity) * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">Completion Rate</div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-8 h-8 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">
                  {perfInput.avg_minutes_per_module}
                </div>
                <div className="text-sm text-gray-600">Avg Min/Module</div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Award className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">
                  {Number(perfInput.login_gap_std).toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">Login Gap (days)</div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-8 h-8 text-orange-600" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">
                  {perfInput.total_active_days}
                </div>
                <div className="text-sm text-gray-600">Active Days</div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Brain className="w-8 h-8 text-indigo-600" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">
                  {(Number(perfInput.night_study_ratio) * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">Night Study</div>
              </div>
            </div>
          </div>

          {/* Persona Insights - Updated Style */}
          {insightData.insights?.persona_based &&
            Array.isArray(insightData.insights.persona_based) && (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-3xl shadow-lg border-2 border-indigo-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-indigo-600" />
                  Personalized Insights
                </h3>
                <div className="space-y-4">
                  {insightData.insights.persona_based.map((insight, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-2xl p-5 border border-indigo-100 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-lg shadow-lg">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 font-medium pt-2 flex-1">
                          {insight}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* COMPARISON WITH BENCHMARKS */}
          {comparisonData && (
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="w-7 h-7 text-yellow-600" />
                <h3 className="text-2xl font-bold text-gray-800">
                  Performance Comparison
                </h3>
              </div>

              {/* Percentile Score */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90 mb-1">
                      Your Percentile Rank
                    </p>
                    <p className="text-5xl font-extrabold mb-2">
                      {comparisonData.percentile}%
                    </p>
                    <p className="text-lg font-semibold opacity-95">
                      {comparisonData.performance_level}
                    </p>
                  </div>
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Trophy className="w-12 h-12" />
                  </div>
                </div>
              </div>

              {/* Comparison Insights */}
              {comparisonData.comparison_insights &&
                comparisonData.comparison_insights.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-800 mb-4">
                      Quick Insights
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {comparisonData.comparison_insights.map(
                        (insight, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100"
                          >
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                              <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                            <p className="text-sm text-gray-700 font-medium">
                              {insight}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

              {/* Comparison with Each Persona */}
              <div>
                <h4 className="font-bold text-gray-800 mb-4">
                  Comparison vs Each Persona
                </h4>
                <div className="space-y-3">
                  {comparisonData.benchmark_comparison.map((bench, index) => {
                    const userScore = comparisonData.user_performance;
                    const benchScore = bench.benchmark_performance;
                    const difference = bench.difference;
                    const EPSILON = 0.01;

                    const diff = userScore - benchScore;

                    const isEqual = Math.abs(diff) < EPSILON;
                    const isHigher = diff > EPSILON;

                    // Calculate percentage difference for better understanding
                    const percentDiff =
                      benchScore !== 0 ? (difference / benchScore) * 100 : 0;

                    return (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                              <Users className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-800">
                                {bench.persona}
                              </p>
                              <p className="text-xs text-gray-500">
                                Benchmark Score: {benchScore.toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-xs text-gray-500 mb-1">
                              Your Score
                            </p>
                            <p className="text-xl font-bold text-gray-800">
                              {userScore.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {/* Visual Status */}
                        <div className="flex items-center justify-between">
                          {isEqual ? (
                            <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl flex-1">
                              <Minus className="w-5 h-5 text-gray-500" />
                              <span className="font-semibold text-gray-700">
                                Setara dengan benchmark
                              </span>
                            </div>
                          ) : isHigher ? (
                            <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-xl flex-1 border border-green-200">
                              <ArrowUp className="w-5 h-5 text-green-600" />
                              <div className="flex-1">
                                <span className="font-semibold text-green-700">
                                  Lebih tinggi{" "}
                                  {Math.abs(percentDiff).toFixed(0)}%
                                </span>
                                <p className="text-xs text-green-600">
                                  Kamu lebih baik dari {bench.persona}!
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl flex-1 border border-blue-200">
                              <ArrowDown className="w-5 h-5 text-blue-600" />
                              <div className="flex-1">
                                <span className="font-semibold text-blue-700">
                                  Masih {Math.abs(percentDiff).toFixed(0)}% di
                                  bawah
                                </span>
                                <p className="text-xs text-blue-600">
                                  Ikuti rekomendasi untuk mencapai level ini
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Performance Level Badge */}
              <div className="mt-6 p-6 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl border-2 border-yellow-200">
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-yellow-600" />
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Your Performance Level
                    </p>
                    <p className="text-2xl font-bold text-gray-800">
                      {comparisonData.performance_level}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ACTIONABLE RECOMMENDATIONS */}
          {insightData.recommendations &&
            insightData.recommendations.length > 0 && (
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <Zap className="w-7 h-7 text-yellow-600" />
                  <h3 className="text-2xl font-bold text-gray-800">
                    Rekomendasi Actionable
                  </h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Ikuti rekomendasi di bawah untuk meningkatkan performa belajar
                  kamu
                </p>

                <div className="space-y-4">
                  {insightData.recommendations.map((rec, index) => {
                    const priorityColors = {
                      high: "from-red-50 to-orange-50 border-red-200",
                      medium: "from-yellow-50 to-amber-50 border-yellow-200",
                      low: "from-green-50 to-emerald-50 border-green-200",
                    };

                    const priorityBadgeColors = {
                      high: "bg-red-100 text-red-700",
                      medium: "bg-yellow-100 text-yellow-700",
                      low: "bg-green-100 text-green-700",
                    };

                    const categoryIcons = {
                      "Completion Rate": <Award className="w-5 h-5" />,
                      Consistency: <Activity className="w-5 h-5" />,
                      "Study Time": <Clock className="w-5 h-5" />,
                      Schedule: <Target className="w-5 h-5" />,
                      Persona: <Users className="w-5 h-5" />,
                      Overall: <TrendingUp className="w-5 h-5" />,
                    };

                    return (
                      <div
                        key={index}
                        className={`bg-gradient-to-r ${
                          priorityColors[rec.priority]
                        } border-2 rounded-2xl p-6 hover:shadow-lg transition-all`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                              {categoryIcons[rec.category] || (
                                <Lightbulb className="w-5 h-5" />
                              )}
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-gray-800">
                                {rec.title}
                              </h4>
                              <span className="text-xs text-gray-500">
                                {rec.category}
                              </span>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              priorityBadgeColors[rec.priority]
                            }`}
                          >
                            {rec.priority === "high"
                              ? "High Priority"
                              : rec.priority === "medium"
                                ? "Medium"
                                : "Low Priority"}
                          </span>
                        </div>

                        <p className="text-gray-700 mb-4">{rec.description}</p>

                        <div className="bg-white/60 rounded-xl p-4 mb-3 border border-gray-200">
                          <div className="flex items-start gap-2">
                            <ArrowRight className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-semibold text-gray-800 mb-1">
                                Action Plan:
                              </p>
                              <p className="text-gray-700">{rec.action}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-gray-600">
                            <span className="font-semibold text-gray-800">
                              Expected Impact:
                            </span>{" "}
                            {rec.expected_impact}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Summary */}
                <div className="mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-2xl">
                  <div className="flex items-center gap-3 mb-3">
                    <Sparkles className="w-6 h-6" />
                    <h4 className="text-lg font-bold">Quick Summary</h4>
                  </div>
                  <p className="text-sm opacity-90">
                    Kamu mendapat {insightData.recommendations.length}{" "}
                    rekomendasi personalized. Fokus pada{" "}
                    {
                      insightData.recommendations.filter(
                        (r) => r.priority === "high",
                      ).length
                    }{" "}
                    rekomendasi prioritas tinggi untuk hasil maksimal dalam 2-4
                    minggu ke depan! 🚀
                  </p>
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
}
