# Grocer Project 🛒

A comprehensive grocery management and delivery system consisting of a Backend Server, an Administration Dashboard, and a Mobile Application.

## Project Structure

- **`server/`**: Node.js/Express backend with MongoDB. Handles API requests, authentication, and data management.
- **`website-admin/`**: React-based administration portal for managing inventory, orders, and users.
- **`MobileUser/`**: React Native mobile application for customers to browse and buy groceries.

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or Atlas)
- [React Native Environment Setup](https://reactnative.dev/docs/set-up-your-environment) (for Mobile app)

---

## 🛠️ Step 1: Backend Setup (`server`)

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Copy `.env.example` to `.env`.
   - Update `DB_URI` with your MongoDB connection string.
4. Start the server:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:5200` by default.

---

## 💻 Step 2: Admin Dashboard Setup (`website-admin`)

1. Navigate to the admin directory:
   ```bash
   cd website-admin
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Copy `.env.example` to `.env`.
   - Set `REACT_APP_API_BASE_URL` to your backend URL.
4. Start the development server:
   ```bash
   npm start
   ```
   The dashboard will be available at `http://localhost:3200`.

---

## 📱 Step 3: Mobile App Setup (`MobileUser`)

1. Navigate to the mobile directory:
   ```bash
   cd MobileUser
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Copy `.env.example` to `.env`.
   - Update `API_URL` to your backend URL (use your local IP or a tunnel like Ngrok if testing on a physical device).
4. **Android**:
   ```bash
   npm run android
   ```
5. **iOS** (macOS only):
   ```bash
   cd ios && pod install && cd ..
   npm run ios
   ```

---

## 🔒 Security & Privacy

This repository uses a `.gitignore` file to ensure that `.env` files and other sensitive configuration data are not uploaded. Always use the provided `.env.example` templates for local configuration.

## 📄 License

This project is for demonstration purposes.
