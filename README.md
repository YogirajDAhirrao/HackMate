# HackMate

HackMate is a full-stack web application designed to help users find teammates for hackathons, manage friend and team requests, and collaborate on team-based projects. Built with a modern tech stack including React, Express, MongoDB, and TypeScript, HackMate provides a complete ecosystem for developers and hackers.

---

## 🚀 Features

### 🔑 Authentication

* Signup & login with JWT (stored in cookies)
* Protected routes with middleware

### � User Profile

* View and update profile info (name, bio, GitHub, skills, interests)
* Profile photo and details displayed

### � Friends System

* Send, accept, reject, and cancel friend requests
* View list of friends

### � Teams System

* Create teams
* Add or remove members (admin only)
* Leave or delete teams
* Admin transfer and cleanup if admin leaves
* View team details

### 🛳️ Team Invites

* Invite friends to join teams
* Accept/reject incoming invites
* View sent and received invites

---

## 🧱 Tech Stack

### Frontend

* React (Vite)
* Context API for auth
* Fetch API (no Axios)
* Plain CSS for styling

### Backend

* Node.js + Express
* TypeScript
* MongoDB + Mongoose
* JWT for authentication

---

## 📂 Folder Structure

### Frontend (`/Frontend`)

```
Frontend
├── public
├── src
│   ├── api          # API functions (fetch wrappers)
│   ├── config       # Environment/configuration
│   ├── context      # AuthContext
│   ├── pages        # All page-level components (e.g. MyProfile)
│   ├── ui           # Reusable UI components
│   ├── App.jsx
│   ├── main.jsx
│   └── App.css / index.css
├── .env
├── vite.config.js
```

### Backend (`/Backend`)

```
Backend
├── src
│   ├── config       # DB connection, constants
│   ├── controllers  # Business logic
│   ├── middlewares  # Auth middleware, error handlers
│   ├── model        # Mongoose models: User, Team, FriendRequest, TeamInvite
│   ├── routes       # Route definitions
│   ├── scripts      # Optional scripts
│   ├── utils        # Utility functions
│   ├── app.ts       # Express app setup
│   └── server.ts    # Entry point
├── .env
├── tsconfig.json
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/hackmate
cd hackmate
```

### 2. Install Dependencies

```bash
# Backend
cd Backend
npm install

# Frontend
cd ../Frontend
npm install
```

### 3. Environment Variables

#### Backend `.env`

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hackmate
JWT_SECRET=your_jwt_secret
```

#### Frontend `.env`

```
VITE_API_URL=http://localhost:5000
```

### 4. Run the Application

#### Backend

```bash
cd Backend
npm run dev
```

#### Frontend

```bash
cd Frontend
npm run dev
```

---

## 📅 Future Improvements

* Profile picture upload via cloud storage
* Real-time notifications with Socket.IO
* Hackathon discovery and registration
* Direct messaging or team chat

---

## ✌️ Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📅 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Made with ❤️ by Yogiraj Ahirrao
