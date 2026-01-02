🧘 ZenFlow – Full Stack Wellness Platform

ZenFlow is a full-stack web application designed to promote wellness through yoga, meditation, mindfulness content, and curated newsletters. The platform follows a secure, scalable architecture with role-based access control and backend-driven content management.

📌 Features
🔐 Authentication & Authorization

User authentication using JWT

Protected routes for logged-in users

Access control for premium and restricted content

📰 News & Newsletters

Backend-driven newsletters stored in MongoDB

Login required to read newsletters

Early-access logic for recent newsletters (premium access window)

Older newsletters available for free users

🧘 Instructors Module

Instructor data seeded from backend (no static frontend data)

Automatic instructor card rendering on addition

Location-based mapping using Leaflet

Filter options for better discovery

🌐 General Platform

Clean, responsive UI

Secure REST APIs

Modular frontend and backend structure

🛠 Tech Stack
Frontend

React.js

React Router

Axios

Leaflet (Maps)

Tailwind CSS

Backend

Node.js

Express.js

MongoDB

Mongoose

JWT Authentication

🗂 Project Structure
Zenflow/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api/
│   │   └── App.jsx
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── seed/
│   ├── middleware/
│   └── server.js
│
└── README.md

🔁 Data Flow Architecture
MongoDB → Backend (Express APIs) → Frontend (React)
                         ↓
                  JWT Access Control


All dynamic content is fetched from backend APIs

No hardcoded data on the frontend

Authorization enforced at API level

🚀 Getting Started
1️⃣ Clone the Repository
git clone https://github.com/your-username/zenflow.git
cd zenflow

2️⃣ Backend Setup
cd backend
npm install
npm start


Create a .env file:

MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key

3️⃣ Frontend Setup
cd frontend
npm install
npm run dev

🌱 Database Seeding

Instructors and newsletters are seeded using backend scripts

Ensures realistic and scalable data for testing

node seed-instructors.js
node seed-newsletters.js

🔒 Security Highlights

JWT-based authentication

Protected routes on frontend

Authorization middleware on backend

No sensitive data exposed on client side

🎯 Future Enhancements

Subscription & payment gateway

Admin dashboard

User progress tracking

AI-based wellness recommendations

👩‍💻 Author

Jyotsna Kasibhotla
Computer Engineering Student
