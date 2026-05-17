# Smart Leads Dashboard - Backend Server

This is the backend API for the Smart Leads Dashboard. It provides a robust, RESTful architecture for managing users, authentication, and lead data.

## 🚀 Features

*   **RESTful API:** Clean and predictable endpoints for all operations.
*   **Authentication:** Secure JWT-based authentication and role authorization (Admin/Sales).
*   **Database Integration:** MongoDB with Mongoose ODM for flexible schema definitions.
*   **Data Validation:** Request validation to ensure data integrity.
*   **Error Handling:** Centralized error handling and standardized API responses.
*   **Pagination & Filtering:** Backend support for efficient data querying.

## 🛠️ Tech Stack

*   **Environment:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB
*   **ODM:** Mongoose
*   **Language:** TypeScript
*   **Security:** JSON Web Tokens (JWT), bcrypt

## ⚙️ Setup Instructions

### 1. Prerequisites
*   Node.js (v18+)
*   MongoDB instance (local or Atlas)

### 2. Installation

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

### 3. Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Ensure the following are set:
*   `PORT`: Server port (default 5000)
*   `MONGO_URI`: MongoDB connection string
*   `JWT_SECRET`: Secret key for signing tokens

### 4. Running the Server

Start in development mode:
```bash
npm run dev
```

Start in production mode:
```bash
npm run build
npm start
```

## 🔌 API Usage

### Authentication
*   `POST /api/auth/register` - Create a new user (sales or admin)
*   `POST /api/auth/login` - Authenticate user and receive JWT
*   `GET /api/auth/me` - Get current authenticated user details

### Leads
*   `GET /api/leads` - Retrieve leads (Supports filters: `status`, `source`, `search`, `sortBy`, `page`, `limit`)
*   `GET /api/leads/:id` - Retrieve a specific lead by ID
*   `POST /api/leads` - Create a new lead
*   `PUT /api/leads/:id` - Update an existing lead
*   `DELETE /api/leads/:id` - Delete a lead (Admin only, depending on setup)
