import { Book, HelpCircle, Info, Lightbulb, TrendingUp, Users, Award, Clock, Activity, Target, Zap, CheckCircle, ArrowUp, ArrowDown, Minus } from "lucide-react";

export default function UserGuide() {
  const sections = [
    {
      id: "getting-started",
      title: " Getting Started",
      icon: <Lightbulb className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500",
      content: [
        {
          subtitle: "Apa itu AI Learning Insight?",
          description: "Platform ini menganalisis pola belajar kamu menggunakan AI untuk memberikan insight personal dan rekomendasi yang actionable."
        },
        {
          subtitle: "Langkah Pertama",
          steps: [
            "Buka halaman 'AI Analysis' dari sidebar",
            "Isi form dengan data aktivitas belajar kamu",
            "Atau gunakan tombol 'Auto-Fill' untuk coba contoh data",
            "Klik 'Run Analysis' untuk mendapatkan hasil"
          ]
        }
      ]
    },
    {
      id: "understanding-fields",
      title: " Memahami Setiap Field",
      icon: <Info className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500",
      performanceFields: [
        {
          name: "Avg Minutes Per Module",
          icon: <Clock className="w-5 h-5 text-purple-600" />,
          explanation: "Rata-rata waktu yang kamu habiskan untuk menyelesaikan satu modul pembelajaran (dalam menit).",
          example: "Contoh: 25 menit = kamu biasanya belajar 25 menit per modul",
          goodRange: "Ideal: 20-40 menit (fokus optimal tanpa burnout)"
        },
        {
          name: "Consistency Score",
          icon: <Award className="w-5 h-5 text-green-600" />,
          explanation: "Seberapa konsisten kamu belajar. Skala 1-10, di mana 10 adalah sangat konsisten.",
          example: "Contoh: 7/10 = kamu belajar secara teratur dengan sedikit skip",
          goodRange: "Target: 7-10 (belajar hampir setiap hari)"
        },
        {
          name: "Total Activities",
          icon: <Activity className="w-5 h-5 text-blue-600" />,
          explanation: "Total jumlah aktivitas belajar yang sudah kamu selesaikan (video, quiz, tugas, dll).",
          example: "Contoh: 30 activities = kamu sudah menyelesaikan 30 kegiatan belajar",
          goodRange: "Target: >35 untuk hasil optimal"
        },
        {
          name: "Weekend Ratio",
          icon: <Target className="w-5 h-5 text-orange-600" />,
          explanation: "Persentase aktivitas belajar yang dilakukan di weekend (Sabtu-Minggu).",
          example: "Contoh: 0.3 = 30% aktivitas belajar kamu dilakukan di weekend",
          goodRange: "Balance: 0.2-0.4 (jangan terlalu banyak atau sedikit)"
        },
        {
          name: "Study Time Category",
          icon: <Clock className="w-5 h-5 text-indigo-600" />,
          explanation: "Kategori durasi belajar: 1 = Singkat (<15 min), 2 = Sedang (15-30 min), 3 = Lama (>30 min)",
          example: "Contoh: 2 = kamu biasanya belajar 15-30 menit per sesi",
          goodRange: "Recommended: 2-3 untuk pemahaman mendalam"
        },
        {
          name: "Total Active Days",
          icon: <Activity className="w-5 h-5 text-red-600" />,
          explanation: "Jumlah hari kamu aktif belajar dalam periode tertentu.",
          example: "Contoh: 15 days = kamu belajar selama 15 hari",
          goodRange: "Target: >20 hari per bulan untuk hasil maksimal"
        }
      ],
      clusteringFields: [
        {
          name: "Total Activities",
          icon: <Activity className="w-5 h-5 text-blue-600" />,
          explanation: "Sama seperti di Performance Features. Total jumlah aktivitas belajar yang sudah diselesaikan.",
          example: "Contoh: 30 activities = total kegiatan belajar yang sudah kamu selesaikan",
          goodRange: "Clustering akan mengelompokkan: <20 (Low), 20-35 (Medium), >35 (High)",
          note: " Harus sama dengan nilai di Performance Features"
        },
        {
          name: "Avg Minutes Per Module",
          icon: <Clock className="w-5 h-5 text-purple-600" />,
          explanation: "Sama seperti di Performance Features. Rata-rata waktu belajar per modul.",
          example: "Contoh: 25 menit = durasi rata-rata untuk satu modul",
          goodRange: "Clustering akan identifikasi: <15 (Fast), 15-30 (Moderate), >30 (Deep)",
          note: " Harus sama dengan nilai di Performance Features"
        },
        {
          name: "Consistency Score",
          icon: <Award className="w-5 h-5 text-green-600" />,
          explanation: "Sama seperti di Performance Features. Skor konsistensi belajar (1-10).",
          example: "Contoh: 7/10 = belajar teratur dengan konsistensi baik",
          goodRange: "Clustering akan kategorikan pola belajar berdasarkan konsistensi ini",
          note: " Harus sama dengan nilai di Performance Features"
        },
        {
          name: "Weekend Ratio",
          icon: <Target className="w-5 h-5 text-orange-600" />,
          explanation: "Sama seperti di Performance Features. Persentase belajar di weekend.",
          example: "Contoh: 0.3 = 30% belajar di weekend, 70% di weekday",
          goodRange: "Clustering akan analisis pola: Weekend Warrior vs Weekday Learner",
          note: " Harus sama dengan nilai di Performance Features"
        }
      ]
    },
    {
      id: "reading-results",
      title: " Membaca Hasil Analysis",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500",
      results: [
        {
          type: "Performance Score",
          range: "0-5",
          interpretation: [
            { score: "4.0 - 5.0", level: "Excellent", description: "Performa sangat baik! Terus pertahankan pola belajar kamu." },
            { score: "3.0 - 3.9", level: "Good", description: "Performa bagus, ada sedikit ruang untuk improvement." },
            { score: "2.0 - 2.9", level: "Average", description: "Performa cukup, perlu fokus pada konsistensi dan aktivitas." },
            { score: "< 2.0", level: "Needs Work", description: "Performa perlu ditingkatkan, ikuti rekomendasi yang diberikan." }
          ]
        },
        {
          type: "Student Persona",
          personas: [
            {
              name: "The Consistent",
              description: "Kamu belajar dengan pola yang stabil dan teratur. Kedisiplinan adalah kekuatan kamu.",
              strength: "Konsistensi tinggi, progress steady",
              advice: "Pertahankan ritme, mulai tackle materi advanced"
            },
            {
              name: "The Sprinter",
              description: "Kamu cepat memahami materi dan menyelesaikan banyak aktivitas dalam waktu singkat.",
              strength: "Cepat belajar, efisien",
              advice: "Pastikan pemahaman mendalam, jangan skip detail penting"
            },
            {
              name: "The Warrior",
              description: "Kamu punya semangat tinggi dan tidak takut menghadapi materi yang challenging.",
              strength: "Determinasi kuat, tackle materi sulit",
              advice: "Channel energy ke strategi belajar yang terstruktur"
            }
          ]
        }
      ]
    },
    {
      id: "understanding-progress",
      title: " Memahami Progress Bars",
      icon: <Activity className="w-6 h-6" />,
      color: "from-orange-500 to-red-500",
      progressGuide: [
        {
          color: "Green (80-100%)",
          meaning: "Excellent! Kamu sudah di level optimal untuk metrik ini."
        },
        {
          color: "Yellow (50-79%)",
          meaning: "Good! Ada ruang untuk improvement, tapi kamu on the right track."
        },
        {
          color: "Red (0-49%)",
          meaning: "Needs Attention! Fokus pada area ini untuk hasil yang lebih baik."
        }
      ]
    },
    {
      id: "using-recommendations",
      title: " Menggunakan Rekomendasi",
      icon: <Zap className="w-6 h-6" />,
      color: "from-yellow-500 to-amber-500",
      recommendations: [
        {
          priority: " High Priority",
          color: "red",
          action: "Lakukan SEGERA! Ini adalah area kritis yang perlu perbaikan langsung.",
          timeframe: "Mulai hari ini dan konsisten selama 2 minggu"
        },
        {
          priority: " Medium Priority",
          color: "yellow",
          action: "Lakukan dalam minggu ini. Area yang penting untuk improvement.",
          timeframe: "Implement dalam 1-2 minggu"
        },
        {
          priority: " Low Priority",
          color: "green",
          action: "Ini adalah optimasi. Lakukan setelah high & medium priority selesai.",
          timeframe: "Gradual improvement over time"
        }
      ]
    },
    {
      id: "benchmark-comparison",
      title: " Memahami Comparison & Benchmark",
      icon: <Users className="w-6 h-6" />,
      color: "from-indigo-500 to-purple-500",
      comparison: [
        {
          metric: "Percentile Rank",
          explanation: "Menunjukkan posisi kamu dibanding learner lain. 75% = kamu lebih baik dari 75% learner.",
          interpretation: [
            "75-100%: Top Performer ",
            "50-74%: Above Average ",
            "25-49%: Average ",
            "0-24%: Needs Improvement "
          ]
        },
        {
          metric: "Comparison with Personas",
          explanation: "Melihat performa kamu vs benchmark setiap persona dalam format yang mudah dipahami.",
          symbols: [
            " Hijau 'Lebih tinggi X%': Performa kamu LEBIH BAIK dari persona ini sebesar X%",
            " Biru 'Masih X% di bawah': Performa kamu masih di bawah X%, ikuti rekomendasi untuk improve",
            "≈ Gray 'Setara': Performa kamu mirip dengan benchmark persona ini"
          ],
          example: "Contoh: 'Lebih tinggi 15%' = Kamu 15% lebih baik dari The Consistent"
        }
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Book className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              User Guide
            </h1>
            <p className="text-gray-600 text-lg mt-2">
              Panduan lengkap untuk memahami dan menggunakan AI Learning Insight
            </p>
          </div>
        </div>
      </div>

      {/* Quick Tips Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl p-6 text-white mb-8 shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <HelpCircle className="w-6 h-6" />
          <h3 className="text-xl font-bold">Quick Tips</h3>
        </div>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>Gunakan tombol <strong>Auto-Fill</strong> untuk coba sample data</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>Fokus pada rekomendasi <strong>High Priority</strong> terlebih dahulu</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>Check <strong>Dashboard</strong> untuk lihat benchmark dan comparison</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>Run analysis secara berkala untuk track progress kamu</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span><strong>Semua data selalu positif</strong> - tidak ada angka minus yang membingungkan!</span>
          </li>
        </ul>
      </div>

      {/* Guide Sections */}
      <div className="space-y-6">
        {/* Getting Started */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-12 h-12 bg-gradient-to-r ${sections[0].color} rounded-xl flex items-center justify-center text-white shadow-md`}>
              {sections[0].icon}
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{sections[0].title}</h2>
          </div>
          
          {sections[0].content.map((item, idx) => (
            <div key={idx} className="mb-6 last:mb-0">
              <h3 className="font-bold text-gray-800 mb-3 text-lg">{item.subtitle}</h3>
              {item.description && (
                <p className="text-gray-700 mb-3">{item.description}</p>
              )}
              {item.steps && (
                <ol className="space-y-2">
                  {item.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                        {i + 1}
                      </span>
                      <span className="text-gray-700 pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          ))}
        </div>

        {/* Understanding Fields */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-12 h-12 bg-gradient-to-r ${sections[1].color} rounded-xl flex items-center justify-center text-white shadow-md`}>
              {sections[1].icon}
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{sections[1].title}</h2>
          </div>
          
          {/* Performance Features Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-800">Performance Features</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Field-field ini digunakan untuk memprediksi performa belajar kamu. Isi dengan data aktivitas belajar kamu yang sebenarnya.
            </p>
            
            <div className="space-y-6">
              {sections[1].performanceFields.map((field, idx) => (
                <div key={idx} className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      {field.icon}
                    </div>
                    <h4 className="font-bold text-gray-800 text-lg">{field.name}</h4>
                  </div>
                  <p className="text-gray-700 mb-3">{field.explanation}</p>
                  <div className="bg-white rounded-xl p-4 mb-3">
                    <p className="text-sm text-gray-600"><strong> {field.example}</strong></p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3 border border-green-200">
                    <p className="text-sm text-green-800"><strong> {field.goodRange}</strong></p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Clustering Features Section */}
          <div className="border-t-2 border-gray-200 pt-8">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-bold text-gray-800">Clustering Features</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Field-field ini digunakan untuk mengidentifikasi <strong>Student Persona</strong> kamu (The Consistent, The Sprinter, The Warrior).
            </p>
            
            {/* Important Notice */}
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-6 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl"> </span>
                </div>
                <div>
                  <h4 className="font-bold text-yellow-900 mb-2">PENTING: Konsistensi Data!</h4>
                  <p className="text-yellow-800 text-sm mb-2">
                    <strong>4 field di Clustering Features HARUS sama</strong> dengan yang kamu isi di Performance Features. 
                    Ini karena AI perlu menganalisis data yang sama dari 2 sudut pandang berbeda:
                  </p>
                  <ul className="text-yellow-800 text-sm space-y-1 ml-4">
                    <li>• Performance Features → Prediksi <strong>skor performa</strong></li>
                    <li>• Clustering Features → Identifikasi <strong>tipe learner</strong></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {sections[1].clusteringFields.map((field, idx) => (
                <div key={idx} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      {field.icon}
                    </div>
                    <h4 className="font-bold text-gray-800 text-lg">{field.name}</h4>
                  </div>
                  <p className="text-gray-700 mb-3">{field.explanation}</p>
                  <div className="bg-white rounded-xl p-4 mb-3">
                    <p className="text-sm text-gray-600"><strong> {field.example}</strong></p>
                  </div>
                  <div className="bg-purple-100 rounded-xl p-3 border border-purple-300 mb-3">
                    <p className="text-sm text-purple-800"><strong> Clustering: {field.goodRange}</strong></p>
                  </div>
                  {field.note && (
                    <div className="bg-yellow-100 rounded-xl p-3 border border-yellow-300">
                      <p className="text-sm text-yellow-900"><strong>{field.note}</strong></p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Why Same Values? */}
            <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-200">
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-indigo-600" />
                Kenapa Harus Nilai yang Sama?
              </h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <strong>Performance Features (6 field)</strong> menggunakan data lebih lengkap termasuk 
                  <span className="text-indigo-600 font-semibold"> Study Time Category</span> dan 
                  <span className="text-indigo-600 font-semibold"> Total Active Days</span> untuk prediksi skor yang akurat.
                </p>
                <p>
                  <strong>Clustering Features (4 field)</strong> fokus pada pola belajar untuk kategorisasi persona. 
                  AI akan mengelompokkan kamu berdasarkan <span className="text-purple-600 font-semibold">similarity</span> dengan learner lain.
                </p>
                <p className="text-indigo-700 font-semibold mt-3">
                  ✨ Tip: Gunakan tombol "Auto-Fill" untuk mengisi kedua form secara otomatis dengan data yang konsisten!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reading Results */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-12 h-12 bg-gradient-to-r ${sections[2].color} rounded-xl flex items-center justify-center text-white shadow-md`}>
              {sections[2].icon}
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{sections[2].title}</h2>
          </div>
          
          {/* Performance Score */}
          <div className="mb-8">
            <h3 className="font-bold text-gray-800 mb-4 text-lg">Performance Score (0-5)</h3>
            <div className="space-y-3">
              {sections[2].results[0].interpretation.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-24 flex-shrink-0">
                    <span className="text-sm font-bold text-gray-600">{item.score}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800 mb-1">{item.level}</p>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Personas */}
          <div>
            <h3 className="font-bold text-gray-800 mb-4 text-lg">Student Personas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sections[2].results[1].personas.map((persona, idx) => (
                <div key={idx} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-200">
                  <h4 className="font-bold text-indigo-800 mb-2 text-lg">{persona.name}</h4>
                  <p className="text-sm text-gray-700 mb-3">{persona.description}</p>
                  <div className="bg-white rounded-xl p-3 mb-2">
                    <p className="text-xs text-gray-600"><strong>💪 Kekuatan:</strong> {persona.strength}</p>
                  </div>
                  <div className="bg-white rounded-xl p-3">
                    <p className="text-xs text-gray-600"><strong> Saran:</strong> {persona.advice}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Bars Guide */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-12 h-12 bg-gradient-to-r ${sections[3].color} rounded-xl flex items-center justify-center text-white shadow-md`}>
              {sections[3].icon}
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{sections[3].title}</h2>
          </div>
          
          <div className="space-y-4">
            {sections[3].progressGuide.map((guide, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className={`w-16 h-4 rounded-full ${
                  guide.color.includes('Green') ? 'bg-green-500' :
                  guide.color.includes('Yellow') ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800 mb-1">{guide.color}</p>
                  <p className="text-sm text-gray-600">{guide.meaning}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations Guide */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-12 h-12 bg-gradient-to-r ${sections[4].color} rounded-xl flex items-center justify-center text-white shadow-md`}>
              {sections[4].icon}
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{sections[4].title}</h2>
          </div>
          
          <div className="space-y-4">
            {sections[4].recommendations.map((rec, idx) => (
              <div key={idx} className={`p-6 rounded-2xl border-2 ${
                rec.color === 'red' ? 'bg-red-50 border-red-200' :
                rec.color === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
                'bg-green-50 border-green-200'
              }`}>
                <h3 className="font-bold text-gray-800 mb-2 text-lg">{rec.priority}</h3>
                <p className="text-gray-700 mb-2">{rec.action}</p>
                <p className="text-sm text-gray-600"><strong>⏱️ Timeline:</strong> {rec.timeframe}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benchmark & Comparison */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-12 h-12 bg-gradient-to-r ${sections[5].color} rounded-xl flex items-center justify-center text-white shadow-md`}>
              {sections[5].icon}
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{sections[5].title}</h2>
          </div>
          
          {sections[5].comparison.map((item, idx) => (
            <div key={idx} className="mb-6 last:mb-0">
              <h3 className="font-bold text-gray-800 mb-3 text-lg">{item.metric}</h3>
              <p className="text-gray-700 mb-3">{item.explanation}</p>
              <div className="bg-gray-50 rounded-xl p-4 mb-3">
                <ul className="space-y-2">
                  {(item.interpretation || item.symbols).map((text, i) => (
                    <li key={i} className="text-gray-700 text-sm">{text}</li>
                  ))}
                </ul>
              </div>
              {item.example && (
                <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
                  <p className="text-sm text-indigo-800"><strong> {item.example}</strong></p>
                </div>
              )}
            </div>
          ))}

          {/* Visual Examples */}
          <div className="mt-6 border-t-2 border-gray-200 pt-6">
            <h3 className="font-bold text-gray-800 mb-4 text-lg">Contoh Visual Comparison</h3>
            
            {/* Example 1: Better than benchmark */}
            <div className="mb-4 bg-green-50 rounded-2xl p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <ArrowUp className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-700">Lebih tinggi 25%</span>
              </div>
              <p className="text-sm text-green-600">
                Artinya: Performa kamu <strong>25% lebih baik</strong> dari benchmark persona ini. 
                Pertahankan pola belajar kamu! 
              </p>
            </div>

            {/* Example 2: Below benchmark */}
            <div className="mb-4 bg-blue-50 rounded-2xl p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <ArrowDown className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-700">Masih 15% di bawah</span>
              </div>
              <p className="text-sm text-blue-600">
                Artinya: Performa kamu masih <strong>15% di bawah</strong> benchmark persona ini. 
                Ikuti rekomendasi untuk mencapai level mereka! 📈
              </p>
            </div>

            {/* Example 3: Similar */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Minus className="w-5 h-5 text-gray-500" />
                <span className="font-semibold text-gray-700">Setara dengan benchmark</span>
              </div>
              <p className="text-sm text-gray-600">
                Artinya: Performa kamu <strong>mirip/sama</strong> dengan benchmark persona ini. 
                Kamu sudah on track! 👍
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white text-center shadow-xl">
        <h3 className="text-2xl font-bold mb-3">Siap Mulai Analysis? </h3>
        <p className="mb-6 opacity-90">
          Sekarang kamu sudah paham cara menggunakan platform ini. Yuk mulai analyze pola belajar kamu!
        </p>
        <a 
          href="/analysis"
          className="inline-block px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:shadow-lg transition-all hover:scale-105"
        >
          Go to AI Analysis →
        </a>
      </div>
    </div>
  );
}