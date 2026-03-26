# 🤖 Wall Painting Robot – Coverage Path Planning System

A full-stack application that simulates an autonomous robot painting a wall while avoiding obstacles using optimized path planning algorithms.

---

## 🚀 Live Demo

* 🌐 Frontend: https://frontend-robot.onrender.com
* ⚙️ Backend API: https://wall-painting-robot-edx3.onrender.com

---

## 🎥 Video Walkthrough

Watch the project walkthrough here:  
👉 https://drive.google.com/file/d/1Uzl1W3E_aVDP2LsKnYrjV5Faqidu-SaU/view?usp=sharing

## 📌 Features

### 🧠 Path Planning

* Complete wall coverage (no missed cells)
* Obstacle avoidance
* Optimized traversal (minimized revisits)
* Hybrid algorithm:

  * Greedy local movement
  * BFS for global reconnection

---

### 🎨 Interactive UI

* Draw obstacles using mouse drag
* Smooth robot animation 🤖
* Adjustable speed control
* Clean modern UI (Tailwind CSS)

---

### 📊 Metrics Dashboard

* Total steps
* Unique cells covered
* Number of revisits

---

### 💾 Data Persistence

* Save generated trajectories
* Retrieve past paths
* Delete stored trajectories
* SQLite database integration

---

## 🏗️ Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* Axios

### Backend

* FastAPI
* SQLAlchemy
* SQLite

---

## 📂 Project Structure

```
wall-robot/
│
├── backend/
│   ├── app/
│   │   ├── api/        # Routes
│   │   ├── models/     # DB models
│   │   ├── schemas/    # Request schemas
│   │   ├── services/   # Path logic
│   │   ├── core/       # DB config
│   │   └── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 🔹 Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

### 🔹 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 API Endpoints

| Method | Endpoint           | Description          |
| ------ | ------------------ | -------------------- |
| POST   | `/trajectory`      | Generate + save path |
| GET    | `/trajectories`    | Get all saved paths  |
| GET    | `/trajectory/{id}` | Get specific path    |
| DELETE | `/trajectory/{id}` | Delete path          |

---

## 🧠 Algorithm Overview

The system uses a hybrid strategy:

1. **Greedy Movement**

   * Moves to nearest unvisited neighbor

2. **BFS (Breadth-First Search)**

   * Finds shortest path to nearest unvisited cell when stuck

👉 Ensures:

* Full coverage
* No teleportation
* Minimal revisits

---

## ⚠️ Deployment Note

* SQLite works locally but does **not persist in cloud environments**
* For production, use:

  * PostgreSQL (Neon / Supabase)

---

## 🧠 Key Learnings

* Grid-based path planning
* BFS optimization
* Full-stack integration
* State management in React
* REST API design
* Database persistence handling

---

## 📸 Screenshots

*Add screenshots here*

---

## 👨‍💻 Author

**ShrajjAL Prakash**

* GitHub: https://github.com/shrajjal


---

## ⭐ If you like this project

Give it a star ⭐ on GitHub!

---
