# Smart-Apartment-Maintenance-Management-System
Smart Apartment Maintenance Management System is a DBMS-based application that manages apartment maintenance requests, staff assignments, status tracking, and billing. It ensures structured data handling, faster issue resolution, and transparent maintenance workflows.

## 📂 Folder Structure :
<img src="https://github.com/user-attachments/assets/ac3ff027-7f2e-48f0-aea6-afc937415f04" width="350" alt="File structure" />

---

## 🚀 Project Overview : 
SmartStay simplifies apartment maintenance by providing:

- Structured maintenance request handling
- Transparent cost tracking
- Role-based access control
- Centralized database-driven workflow

The system eliminates manual communication gaps and ensures accountability through a relational database backend.

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Lucide Icons
- React Router

### Backend
- Node.js
- Express.js

### Database
- MySQL

---

## 👥 User Roles

### 🧑 Resident
- Register & Login
- Raise maintenance requests (Flat / Asset level)
- Track request status
- View pending maintenance payments
- Pay maintenance bills

### 🛠 Technician
- View assigned tasks
- Update request status
- Enter maintenance cost on completion

### 🛡 Admin
- Manage users
- Monitor all maintenance requests
- Track system activity

---

## 🔐 Key Features

- Role-based login system
- Maintenance request validation
- Mandatory cost entry before request completion
- Automatic maintenance bill generation
- Resident payment log tracking
- Dashboard for each role
- Dark / Light theme support & Responsive UI

---
## 🎥 Project Demo

Watch the complete demo of the Smart Apartment Maintenance Management System:
- https://drive.google.com/file/d/1Ac7m--vpTplXZoH-aNGo3-h8r6yTp2oa/view?usp=sharing

---

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

## 🏗️ System Architecture Diagram
<img width="2308" height="1728" alt="diagram (1)" src="https://github.com/user-attachments/assets/8e4c6786-067c-4f39-9728-e18499c2ddc2" />

---

## ER Diagram : 
<img width="1268" height="907" alt="image" src="https://github.com/user-attachments/assets/3f4e244d-cf91-4e09-8506-7e5a8bf6e882" />

---

## Database Schema Overview :

<img width="1102" height="606" alt="image" src="https://github.com/user-attachments/assets/4be60f5e-62cd-45f6-80af-573833e300ac" />

---

<img width="864" height="806" alt="image" src="https://github.com/user-attachments/assets/28b883b1-ad40-43a1-ae0c-e3f139a97048" />







