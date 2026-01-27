🚀 PingUp – Full Stack Social Media Web Application

PingUp is a full-stack social media platform inspired by modern applications like Instagram and LinkedIn.
It supports real-time messaging, posts, stories, connections, and notifications, built using scalable and event-driven architecture.

✨ Features

🔐 Secure Authentication & Authorization

User authentication using Clerk

Backend user sync via event-driven workflows (Inngest)

📝 Posts & Feed

Create text, image, or mixed posts

Personalized feed based on connections and following

Like / Unlike functionality

📸 Stories (24-Hour Expiry)

Text, image, and video stories

Automatic deletion after 24 hours using Inngest background jobs

💬 Real-Time Messaging

One-to-one chat system

Instant message delivery using Server-Sent Events (SSE)

Seen/unseen message tracking

🤝 Connections & Followers

Send and accept connection requests

Follow / Unfollow users

Email reminders for pending connection requests

🔔 Notifications

Real-time in-app notifications

Scheduled email notifications for unseen messages

🛠 Tech Stack
Frontend

React

Redux Toolkit

React Router

Tailwind CSS

Axios

Backend

Node.js

Express.js

MongoDB (Mongoose)

Inngest (event-driven background jobs)

Server-Sent Events (SSE)

Authentication & Services

Clerk (Auth & User Management)

ImageKit (Media uploads & optimization)

Nodemailer (Email notifications)

🧠 Architecture Highlights

Event-Driven Backend
Used Inngest for:

User sync from Clerk

Story auto-deletion after 24 hours

Email reminders for pending connections

Daily unseen message notifications

Real-Time Communication
Implemented SSE instead of WebSockets for:

Lightweight real-time messaging

Lower server complexity

State Management

Centralized global state using Redux Toolkit

Separate slices for users, connections, and messages

📂 Project Structure
pingup/
├── client/        # React frontend
│   ├── src/
│   │   ├── features/    # Redux slices
│   │   ├── pages/
│   │   ├── components/
│   │   └── App.jsx
│
├── server/        # Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── inngest/
│   ├── configs/
│   └── server.js

⚙️ Environment Variables
Backend (server/.env)
PORT=4000
MONGODB_URL=your_mongodb_url
CLERK_SECRET_KEY=your_clerk_secret
IMAGEKIT_PUBLIC_KEY=your_key
IMAGEKIT_PRIVATE_KEY=your_key
IMAGEKIT_URL_ENDPOINT=your_endpoint
FRONT_URL=http://localhost:5173

Frontend (client/.env)
VITE_BASEURL=http://localhost:4000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key

▶️ How to Run Locally
1️⃣ Clone the Repository
git clone https://github.com/your-username/pingup.git
cd pingup

2️⃣ Backend Setup
cd server
npm install
npm run dev

3️⃣ Frontend Setup
cd client
npm install
npm run dev

📸 Screenshots

<img width="2160" height="1440" alt="image" src="https://github.com/user-attachments/assets/035bb5cd-5776-41fd-9b94-63e62bd56c2a" />
<img width="2160" height="1440" alt="image" src="https://github.com/user-attachments/assets/52711a3c-8379-4f1f-8116-cb4f2fa69fab" />
<img width="2160" height="1440" alt="image" src="https://github.com/user-attachments/assets/cb4a790e-b6f3-4881-82fe-22b506326102" />




📚 What I Learned

Building scalable full-stack MERN applications

Event-driven architecture using Inngest

Implementing real-time features using SSE

Secure authentication and token-based authorization

Managing complex global state with Redux Toolkit

👤 Author

Shiva

GitHub: https://github.com/Shivavarma11

LinkedIn: https://www.linkedin.com/in/shiva-barisetti-5684782b8/

⭐ If you like this project

Give it a star ⭐ and feel free to fork or suggest improvements!
