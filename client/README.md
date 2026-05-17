# Smart Leads Dashboard - Frontend

Welcome to the frontend application for the Smart Leads Dashboard. This is a modern, production-ready React application built to provide a clean and intuitive interface for managing leads efficiently.

## 🚀 Features

*   **Authentication & Authorization:** Secure login/registration with JWT and role-based access control (Admin vs. Sales User).
*   **Lead Management:** Complete CRUD operations (Create, Read, Update, Delete) for leads.
*   **Advanced Filtering & Search:** Debounced searching by name/email, and multi-criteria filtering by status and source.
*   **Pagination & Sorting:** Efficient data handling using backend pagination and time-based sorting.
*   **CSV Export:** Instantly download current filtered lead data for offline analysis.
*   **Modern UI/UX:** Built with Tailwind CSS and Shadcn UI components for a polished, responsive, and accessible experience.
*   **State Management:** Clean global state handling using Zustand.

## 🛠️ Tech Stack

*   **Framework:** React 18 + Vite
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS (v4)
*   **UI Components:** Shadcn UI (Radix Primitives)
*   **Routing:** React Router v6
*   **State Management:** Zustand
*   **Data Fetching:** Axios
*   **Form Handling & Validation:** React Hook Form + Zod
*   **Icons:** Lucide React

## 📂 Project Structure

```
client/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI elements
│   │   ├── layout/     # Structural components (Navbar, Sidebar)
│   │   └── ui/         # Shadcn UI primitives
│   ├── constants/      # App-wide constant values
│   ├── context/        # React context (if used alongside Zustand)
│   ├── hooks/          # Custom React hooks (e.g., useDebounce)
│   ├── pages/          # Main application views/routes
│   ├── routes/         # Routing logic and Guards (Protected/Admin)
│   ├── services/       # API abstraction layer (Axios instances)
│   ├── store/          # Zustand global stores
│   ├── styles/         # Global styles (if any)
│   ├── types/          # TypeScript interfaces and types
│   ├── utils/          # Helper functions (e.g., cn utility)
│   ├── App.tsx         # Root application component
│   └── main.tsx        # Application entry point
├── .env.example        # Environment variable template
├── Dockerfile          # Docker configuration for frontend
├── package.json        # Dependencies and scripts
└── vite.config.ts      # Vite bundler configuration
```

## ⚙️ Setup Instructions

### 1. Prerequisites
*   Node.js (v18+ recommended)
*   npm or yarn

### 2. Installation

Clone the repository and navigate to the client directory:

```bash
cd client
npm install
```

### 3. Environment Configuration

Copy the example environment file and update it if necessary:

```bash
cp .env.example .env
```

Ensure `VITE_API_URL` points to your backend server (default is `http://localhost:5000/api`).

### 4. Running the Development Server

Start the Vite development server:

```bash
npm run dev
```

The application will be accessible at `http://localhost:5173`.

## 🐳 Docker Setup

To build and run the frontend using Docker (utilizing Nginx for serving static files):

```bash
# Build the image
docker build -t smart-leads-frontend .

# Run the container
docker run -p 80:80 smart-leads-frontend
```

## 🏗️ Future Improvements

*   **Dark Mode Toggle:** Implement persistent theme switching.
*   **Data Visualization:** Add charts to the dashboard for visual lead analytics.
*   **Drag and Drop Kanban:** View leads in a Trello-style board based on their status.
*   **Websockets:** Real-time updates when leads are modified by other users.
*   **Testing:** Add unit tests with Vitest and E2E tests with Playwright or Cypress.
