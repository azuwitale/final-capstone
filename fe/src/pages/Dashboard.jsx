import { useEffect, useState } from "react";
import {
  Activity,
  TrendingUp,
  BarChart3,
  AlertCircle,
  Users,
  Target,
  Award,
  Zap,
} from "lucide-react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

export default function Dashboard() {
  const [stats, setStats] = useState({
    systemStatus: "Online",
    lastScore: 87.2,
    totalAnalysis: 24,
  });
  const [benchmarkData, setBenchmarkData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBenchmarkData();
  }, []);

  const loadBenchmarkData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/benchmark/stats`);
      const data = await response.json();
      setBenchmarkData(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load benchmark data");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 text-lg">
          Welcome back! Here's your system overview and benchmarks
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STATISTICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 rounded-3xl text-white shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Activity className="w-6 h-6" />
            </div>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <p className="text-sm opacity-80 font-medium mb-2">System Status</p>
          <p className="text-4xl font-extrabold">{stats.systemStatus}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-8 rounded-3xl text-white shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm opacity-80 font-medium mb-2">Last Score</p>
          <p className="text-4xl font-extrabold">{stats.lastScore}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-8 rounded-3xl text-white shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <BarChart3 className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm opacity-80 font-medium mb-2">Total Analysis</p>
          <p className="text-4xl font-extrabold">{stats.totalAnalysis}</p>
        </div>
      </div>

      {/* BENCHMARK COMPARISON SECTION */}
      {loading ? (
        <div className="bg-white p-12 rounded-3xl shadow-lg border border-gray-100 mb-8">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-600">
              Loading benchmark data...
            </span>
          </div>
        </div>
      ) : benchmarkData ? (
        <>
          {/* OVERALL AVERAGE BENCHMARK */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 shadow-lg border-2 border-indigo-200 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Overall Average Benchmark
                </h2>
                <p className="text-sm text-gray-600">
                  Across all {benchmarkData.total_personas} personas
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 text-center shadow-md">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Activity className="w-7 h-7 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">
                  {benchmarkData.overall_average.avg_activities}
                </div>
                <div className="text-sm text-gray-600">Avg Activities</div>
              </div>

              <div className="bg-white rounded-2xl p-6 text-center shadow-md">
                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-7 h-7 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">
                  {benchmarkData.overall_average.avg_minutes_per_module}m
                </div>
                <div className="text-sm text-gray-600">Avg Min/Module</div>
              </div>

              <div className="bg-white rounded-2xl p-6 text-center shadow-md">
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Award className="w-7 h-7 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">
                  {benchmarkData.overall_average.avg_consistency}/10
                </div>
                <div className="text-sm text-gray-600">Avg Consistency</div>
              </div>

              <div className="bg-white rounded-2xl p-6 text-center shadow-md">
                <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="w-7 h-7 text-orange-600" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">
                  {(
                    benchmarkData.overall_average.avg_weekend_ratio * 100
                  ).toFixed(0)}
                  %
                </div>
                <div className="text-sm text-gray-600">Weekend Ratio</div>
              </div>
            </div>
          </div>

          {/* PERSONA BENCHMARK CARDS */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-7 h-7 text-indigo-600" />
              <h2 className="text-3xl font-bold text-gray-800">
                Benchmark by Persona
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {benchmarkData.benchmark_by_persona.map((persona) => (
                <div
                  key={persona.cluster_id}
                  className="bg-white rounded-3xl p-6 shadow-lg border-2 border-gray-100 hover:shadow-xl hover:border-indigo-200 transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">
                        {persona.persona}
                      </h3>
                      <span className="text-xs text-gray-500">
                        Cluster {persona.cluster_id}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-700">
                          Activities
                        </span>
                      </div>
                      <span className="font-bold text-blue-600">
                        {persona.avg_activities}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-gray-700">
                          Minutes/Module
                        </span>
                      </div>
                      <span className="font-bold text-purple-600">
                        {persona.avg_minutes_per_module}m
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-700">
                          Consistency
                        </span>
                      </div>
                      <span className="font-bold text-green-600">
                        {persona.avg_consistency}/10
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-orange-600" />
                        <span className="text-sm text-gray-700">
                          Weekend Ratio
                        </span>
                      </div>
                      <span className="font-bold text-orange-600">
                        {(persona.avg_weekend_ratio * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* HOW TO USE BENCHMARK */}
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Target className="w-6 h-6 text-indigo-600" />
              How to Use These Benchmarks
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">
                  Compare Your Stats
                </h4>
                <p className="text-sm text-gray-600">
                  Use these benchmarks to see how your learning metrics compare
                  with different persona types
                </p>
              </div>

              <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Set Your Goals</h4>
                <p className="text-sm text-gray-600">
                  Target the persona that matches your learning aspirations and
                  work towards their benchmarks
                </p>
              </div>

              <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Track Progress</h4>
                <p className="text-sm text-gray-600">
                  Monitor how you're improving relative to these benchmarks over
                  time
                </p>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
