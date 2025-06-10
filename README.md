# 🧾 Easare – Secure File Sharing App

Easare is a simple, elegant, and secure file-sharing web application that allows users to upload files, generate shareable links, and have those files automatically deleted after 24 hours. Powered by **Cloudinary**, **MongoDB**, **Express**, and a **React-based frontend**.

---

## 🔧 Tech Stack & Tools

![React](https://img.shields.io/badge/Frontend-React-blue)
![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-06B6D4?logo=tailwindcss)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![Express.js](https://img.shields.io/badge/Framework-Express-black)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)
![Cloudinary](https://img.shields.io/badge/Storage-Cloudinary-3448C5?logo=cloudinary)
![Render](https://img.shields.io/badge/Hosting-Render-purple)
![Vercel](https://img.shields.io/badge/Frontend%20Hosting-Vercel-black?logo=vercel)

---

## 🚀 Features

- 📤 Upload any file securely
- 🔗 Share auto-generated secure file link
- 🕐 File auto-deletes after 24 hours (via CRON job)
- 🔒 Token-based upload authorization
- 🌐 CORS-enabled secure API communication

---

## 📸 Screenshots

| Upload Form | File Share |
|-------------|------------|
| ![upload](./screenshots/upload.png) | ![share](./screenshots/share.png) |

---

## 🛠️ Installation & Setup

### Backend (Node.js + Express)

```bash
# Clone the repo
git clone https://github.com/your-username/easare.git
cd easare/backend

# Install dependencies
npm install

# Add your .env file
# Include CLOUDINARY_API_KEY, MONGO_URI, etc.

# Start the server
npm run dev
```

## ⏰ CRON Job Logic
A scheduled CRON job runs every midnight to:

🧹 Delete expired files (older than 24 hrs) from Cloudinary

🗃️ Remove corresponding entries from MongoDB

## 🙌 Author
Kunwar Atharav Singh Kotwal
