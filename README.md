# 📈 StockSphere

**StockSphere** is a modern and responsive Stock Portfolio Management web app that helps users track their investments, view real-time stock prices, and understand their overall portfolio. Built using React, Firebase, Tailwind CSS, and Yahoo Finance API.

---

## ✨ Features

- ✅ Email/Password Authentication via Firebase Auth  
- 📥 Add Stocks (symbol, shares, purchase price, date)  
- 📊 View All Stocks in a Table  
- 🗑️ Delete Stocks  
- 💹 Live Stock Prices (Yahoo Finance API)  
- 💰 Total Portfolio Value Calculation  
- 📋 Animated Dashboard with Summary and Visuals  
- 🔐 Protected Routes (Only authenticated users can access)  
- 🧠 Risk Profile (planned with ML backend)  
- 📈 Data Visualizations (planned with charting library)

---

## 🔧 Tech Stack

| Frontend           | Backend (Optional)       | Auth & DB         | Styling      | Animations         | APIs                 |
|--------------------|--------------------------|-------------------|--------------|---------------------|----------------------|
| React (.jsx)       | Firebase Functions / Node | Firebase Auth + Firestore | Tailwind CSS | Framer Motion, Lottie | Yahoo Finance API     |

---

## 📂 Folder Structure

src/
├── components/ # Reusable UI components
├── context/ # Auth context and provider
├── pages/ # Pages like Dashboard, Login, Signup, ViewStocks
├── firebase.js # Firebase configuration
├── App.jsx # App routes
└── index.js # Entry point
