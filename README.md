Team ID : A25-CS218
Project Name : Persona Flow

# Persona Flow

Platform analisis pembelajaran berbasis AI yang memberikan insight personal dan rekomendasi untuk meningkatkan performa belajar.

## 👥 Tim Pengembang

| Nama                                       | Cohort ID   | Role                 |
| ------------------------------------------ | ----------- | -------------------- |
| Dimas Aji Narindra                         | MXXXD5Y0486 | Machine Learning, PM |
| Raiden Roro Fadilah Rahayu Sulistyaningrum | M891D5X1598 | Machine Learning     |
| Muhammad Zidane Habibie Hendriansyah       | M179D5Y1408 | Machine Learning     |
| Muhammad Raffi                             | R884D5Y1340 | Backend              |
| Ugi Riska Prasetio                         | R204D5Y1924 | Backend              |
| Daffa Kurnia Nurdiansyah                   | R129D5Y0409 | Frontend             |

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose

### Jalankan Aplikasi Pake Docker

1. **Clone repository**

   ```bash
   git clone
   cd final-capstone
   ```

2. **Start aplikasi**

   ```bash
   docker-compose up --build
   ```

3. **Akses aplikasi**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Jalankan Aplikasi Manual

### Backend Setup

1. **Masuk ke direktori backend**

   ```bash
   cd be
   ```

2. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

   atau menggunakan uv:

   ```bash
   uv sync
   ```

3. **Jalankan server**

   ```bash
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   atau menggunakan uv:

   ```bash
   uv
   ```

4. **API akan tersedia di**: `http://localhost:8000`
5. **API Documentation**: `http://localhost:8000/docs`

### Frontend Setup

1. **Masuk ke direktori frontend**

   ```bash
   cd fe
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` sesuai konfigurasi backend

4. **Jalankan development server**

   ```bash
   npm start
   ```

5. **Aplikasi akan tersedia di**: `http://localhost:3000`

## 🛠️ Commands docker

```bash
docker-compose up --build    # Start aplikasi
docker-compose down          # Stop aplikasi
docker-compose logs          # View logs
```

## 🎯 Fitur

- **Prediksi Performa**: Analisis tingkat performa belajar
- **Persona Learning**: Identifikasi tipe pembelajar (Consistent, Sprinter, Warrior)
- **Rekomendasi Personal**: Saran untuk meningkatkan efektivitas belajar
- **Benchmark**: Perbandingan dengan rata-rata learner lain

## 🔧 Tech Stack

**Backend**: FastAPI, scikit-learn, pandas, numpy
**Frontend**: React, TailwindCSS, Recharts
