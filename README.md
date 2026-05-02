# Pulse: Premium Real-Time Messaging Platform 🚀

Pulse is a state-of-the-art, high-performance messaging platform built on the **MERN stack**, designed for seamless real-time communication with a premium aesthetic.

![Pulse Dashboard](https://raw.githubusercontent.com/Varshiniamara/pulse/main/message/public/logo192.png) *(Note: Add actual screenshot link here later)*

## ✨ Key Features

- **Real-Time Messaging**: Instant delivery using Socket.io with 1-to-1 and Group Chat support.
- **Premium UI/UX**: Aesthetic glassmorphic design using Tailwind CSS and Framer Motion for smooth animations.
- **Media Sharing**: Upload and share images, videos, and documents directly within the chat.
- **Identity & Profiles**: Simplified 5-item profile system (Photo, Bio, Status, Activity, Logout).
- **Security**: JWT-based authentication, salted password hashing with Bcrypt, and protected API routes.
- **Smart Activity**: Real-time status indicators (Online, Busy, Away) synced across the network.
- **Threaded Replies & Reactions**: Support for message threading and emoji-based reactions.

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React (Vite), TypeScript, Tailwind CSS, Framer Motion |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | MongoDB (Mongoose) |
| **Real-Time** | Socket.io |
| **Auth** | JWT (JSON Web Tokens), Bcryptjs |
| **Storage** | Multer (Local Storage for media) |

## 📁 Project Structure

```text
├── backend/                # Express & Node.js Server
│   ├── src/
│   │   ├── controllers/    # Business logic (Auth, User, Message, Chat)
│   │   ├── middleware/     # Security & Auth middleware
│   │   ├── models/         # MongoDB Schemas
│   │   ├── routes/         # API Endpoint definitions
│   │   └── sockets/        # Socket.io event handling
│   └── uploads/            # Media storage (Profile & Chat)
├── message/                # React Frontend (Vite)
│   ├── src/
│   │   ├── components/     # UI Components (Chat, Sidebar, Common)
│   │   ├── pages/          # Full page views (Login, Profile, Dashboard)
│   │   ├── store/          # Redux Toolkit state management
│   │   └── types/          # TypeScript interfaces
│   └── index.html
└── PROJECT_DETAILS.md      # Comprehensive technical documentation
```

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Running locally on port 27017)

### 2. Backend Setup
```bash
cd backend
npm install
# Create a .env file with:
# MONGO_URI=mongodb://127.0.0.1:27017/pulse_app
# JWT_SECRET=your_secret_key
# PORT=5005
npx ts-node src/server.ts
```

### 3. Frontend Setup
```bash
cd message
npm install
npm run dev -- --port 5100
```

## 🔐 Security Highlights

- **Stateless Authentication**: Uses JWT stored securely in the client side.
- **Password Protection**: Passwords are never stored in plain text; salted with Bcrypt.
- **Access Control**: Middleware ensures that users can only access messages and profiles they are authorized for.
- **Data Integrity**: Strict Mongoose schemas prevent invalid data injection.

## 📄 License
This project is for educational and portfolio purposes.

---

*Developed with ❤️ by Varshini Amara*
