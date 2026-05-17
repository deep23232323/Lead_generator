# Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack using modern engineering practices, scalable architecture, and a professional UI/UX.

This project was developed as part of a Full Stack MERN Internship Assignment.

---

# 🚀 Features

## Authentication & Authorization
- JWT-based authentication
- User registration and login
- Protected routes
- Role-based access control (Admin / Sales User)
- Password hashing with bcrypt

## Lead Management
- Create, update, delete leads
- View all leads
- View single lead details
- Backend pagination
- CSV export functionality

## Advanced Filtering & Search
- Filter by status
- Filter by source
- Search by name or email
- Debounced search
- Combined multi-filter support
- Sorting by latest/oldest

## Frontend Features
- Responsive dashboard UI
- Reusable components
- Form validation
- Loading states
- Empty states
- Error handling UI

## Backend Features
- RESTful API architecture
- Centralized error handling
- Request validation
- Clean response structure
- MongoDB aggregation/query filtering

---

# 🛠️ Tech Stack

## Frontend
- React.js
- TypeScript
- Tailwind CSS
- Shadcn UI
- Zustand
- Axios
- React Router DOM
- React Hook Form
- Zod

## Backend
- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt

## DevOps
- Docker
- Docker Compose

---

# 📂 Project Structure

```bash
smart-leads-dashboard/
│
├── client/                 # Frontend Application
│
├── server/                 # Backend API
│
├── docker-compose.yml
├── README.md
└── .gitignore


# ▶️ Running the Application

## Start Backend Server

```bash
cd server
npm install
npm run dev
```

Backend will run on:

```bash
http://localhost:5000
```

---

## Start Frontend Client

Open a new terminal and run:

```bash
cd client
npm install
npm run dev
```

Frontend will run on:

```bash
http://localhost:5173
```

---

# 🏗️ Production Build

## Backend

```bash
cd server
npm run build
npm start
```

## Frontend

```bash
cd client
npm run build
```

---

# 🐳 Run Using Docker

```bash
docker-compose up --build
```