# Trashilizer — Industrial Waste Management System

A professional full-stack waste management application built for Industrial supply chain operations. Features real-time waste segregation monitoring, AI-powered sustainability reporting, and ROS 2 Bridge integration with fail-safe manual entry protocols.

You can see the operational working of the full stack app with the Webots Simulated environment in the below video link:
https://drive.google.com/file/d/1YWsmqwKmc7TCusUcPXIKg84vz75zbC1I/view?usp=sharing

---

## Tech Stack

| Layer    | Technology                                     |
|----------|------------------------------------------------|
| Frontend | React.js + Vite, Tailwind CSS, Recharts, jsPDF |
| Backend  | Java Spring Boot 3.2.3 (REST API)              |
| Database | MySQL 8.0 (Port 3306)                          |
| Icons    | Lucide React                                   |

---

## Project Structure

```
Trashlyzer/
├── frontend/               # React.js application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx         # Navigation sidebar
│   │   │   ├── Dashboard.jsx       # Charts & analytics
│   │   │   ├── SKUWorkflow.jsx     # SKU input & loading animation
│   │   │   ├── ManualEntryForm.jsx # 5-bin waste entry form
│   │   │   ├── WasteIcon.jsx       # Waste category icons
│   │   │   └── Reports.jsx         # AI analysis & PDF generation
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css               # Tailwind theme & animations
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── backend/                # Spring Boot application
│   ├── src/main/java/com/trashilizer/
│   │   ├── TrashilizerApplication.java
│   │   ├── model/WasteRecord.java
│   │   ├── repository/WasteRecordRepository.java
│   │   └── controller/WasteRecordController.java
│   ├── src/main/resources/application.properties
│   └── pom.xml
└── database/
    └── init.sql            # MySQL schema + seed data
```

---

## Setup & Running

### 1. Database (MySQL)

Run the SQL script in MySQL Workbench:

```sql
-- Connect to MySQL (Port: 3306, User: root, Password: BoDmAs@12)
source database/init.sql;
```

### 2. Backend (Spring Boot)

```bash
cd backend
../mvnw spring-boot:run
# OR from any directory
./mvnw spring-boot:run -pl backend
```

### 3. Frontend (React)

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## Features

### Operations Dashboard
- Real-time stat cards: Total Weight, Items Processed, Recyclable Waste, Sustainability Score
- 5 waste category breakdown with themed icons
- **Bar chart**: Daily collection by waste type
- **Pie chart**: Waste distribution (donut style)
- **Area chart**: Cumulative weight trend

### SKU Production Workflow
1. Enter a SKU ID and click "Start Collection"
2. 6-second "Machine Data Syncing" loading animation with progress bar
3. ROS 2 Bridge connection failure → Fail-Safe Protocol
4. Manual Audit Entry form with 5 waste bin inputs

### Report Generation
- Mock "AI Analysis" with step-by-step progress animation
- Downloadable PDF with:
  - Waste Analysis Summary
  - Per-record breakdown table
  - Sustainability Goals Met (✓/✗)
  - Recycling Recommendations with CO₂ calculations

---

## API Endpoints

| Method | Endpoint                      | Description          |
|--------|-------------------------------|----------------------|
| GET    | `/api/waste-records`          | Get all records      |
| GET    | `/api/waste-records/{id}`     | Get record by ID     |
| GET    | `/api/waste-records/sku/{id}` | Get records by SKU   |
| POST   | `/api/waste-records`          | Create new record    |
| PUT    | `/api/waste-records/{id}`     | Update record        |
| DELETE | `/api/waste-records/{id}`     | Delete record        |

---

## Key Presentation Points

### The "Failure" Logic
The "Could not fetch data from ROS2 Bridge" error is an intentional **fail-safe protocol**. When the ROS 2 Humble bridge loses connection with the UR5e/UR10e robotic arms, the system mandates manual audit entry to ensure **zero data loss** in the Pharma supply chain.

### The Sustainability PDF
The PDF generation uses a **heuristic model** to calculate CO₂ savings:
- Paper recycling saves **0.91 kg CO₂** per kg
- Plastic recycling saves **1.50 kg CO₂** per kg

---

## Database Schema

```sql
CREATE TABLE waste_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sku_id VARCHAR(50) NOT NULL,
    entry_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paper_waste FLOAT DEFAULT 0,
    plastic_waste FLOAT DEFAULT 0,
    wet_waste FLOAT DEFAULT 0,
    organic_waste FLOAT DEFAULT 0,
    defective_waste FLOAT DEFAULT 0,
    total_weight FLOAT AS (...) STORED
);
```
