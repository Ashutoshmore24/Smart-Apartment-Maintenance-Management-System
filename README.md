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
```
```bash
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

## ER Diagram : 
<img width="1268" height="907" alt="image" src="https://github.com/user-attachments/assets/3f4e244d-cf91-4e09-8506-7e5a8bf6e882" />

---

## Database Schema Overview : 
 - comming soon




