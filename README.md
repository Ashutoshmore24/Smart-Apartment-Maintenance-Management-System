# Smart-Apartment-Maintenance-Management-System
Smart Apartment Maintenance Management System is a DBMS-based application that manages apartment maintenance requests, staff assignments, status tracking, and billing. It ensures structured data handling, faster issue resolution, and transparent maintenance workflows.

## Folder Structure :

<img width="364" height="988" alt="image" src="https://github.com/user-attachments/assets/0a36a368-68be-478c-bd15-905f9f490f12" />

## 🚀 How to Run This Project (After Cloning)

### 1️⃣ Prerequisites
Make sure the following are installed on your system:
- Node.js (v18+ recommended)
- MySQL Server (8.x)
- Git
- MySQL Workbench (or any MySQL client)

### 2️⃣ Clone the Repository
```bash
git clone https://github.com/Ashutoshmore24/Smart-Apartment-Maintenance-Management-System.git
cd Smart-Apartment-Maintenance-Management-System
```

### 3️⃣ Create Database 
Open MySQL Workbench & Run the following files in order :
```bash
database/schema.sql
```
```bash
database/seed.sql
```
```bash
database/trigger.sql
```
This will Create tables ,Insert sample data , Create triggers , Database Name: smart_apartment_db 

### 4️⃣ Update Database Credentials
Edit backend/db.js:
```bash
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "your_mysql_password",  // write your mysql root password
  database: "smart_apartment_db"
});
```

### 5️⃣ Install Backend Dependencies

```bash
cd backend
npm install
```
Start the Backend : 
```bash
npm start
```
### ✅ Expected output :
```bash
Server running on port 5000
Connected to MySQL database
```
Backend API runs at: http://localhost:5000

---

### 🎨 Frontend (React + Vite)

### 7️⃣ Install Frontend Dependencies 
```bash
cd ../frontend
npm install
```
### 8️⃣ Start Frontend Server
```bash
npm run dev
```
Frontend runs at: http://localhost:5173

---

### Common Issue - axios error (if occur) :
```bash
cd frontend
npm install axios
```
---

## Database Schema Overview : 

<img width="1071" height="665" alt="image" src="https://github.com/user-attachments/assets/9c5a08f7-03fc-44f1-b7b0-55f9e1ecc366" />

---

<img width="1052" height="822" alt="ER_BLOCK_DIAGRAM" src="https://github.com/user-attachments/assets/c404fb28-0ac4-4fbd-97af-bec5a1dbe22e" />

---




