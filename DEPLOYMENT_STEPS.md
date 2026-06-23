# Step-by-Step: Development to GitHub Deployment

## STEP 1 — Install Prerequisites

Make sure you have these installed:
```bash
node --version     # v18 or above
npm --version      # v9 or above
git --version      # any recent version
mongod --version   # local MongoDB (or use Atlas free tier)
```

---

## STEP 2 — Create Project Folder and Git Init

```bash
mkdir cogzart-dashboard
cd cogzart-dashboard
git init
```

---

## STEP 3 — Backend Setup

```bash
mkdir backend
cd backend
npm init -y
npm install express mongoose jsonwebtoken bcryptjs cors dotenv
npm install --save-dev nodemon
```

Create `backend/.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/cogzart
JWT_SECRET=cogzart_super_secret_key_2024
NODE_ENV=development
```

Folder structure to create inside `backend/`:
```
backend/
  config/db.js
  models/Puzzle.js
  models/Order.js
  controllers/authController.js
  controllers/puzzleController.js
  controllers/orderController.js
  routes/authRoutes.js
  routes/puzzleRoutes.js
  routes/orderRoutes.js
  middleware/authMiddleware.js
  seed.js
  server.js
```

(Paste the code from each file in this repo.)

Update `backend/package.json` scripts:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

Test backend:
```bash
node seed.js       # seed sample data
npm run dev        # start server → http://localhost:5000
```

Test with curl or Postman:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cogzart.com","password":"admin123"}'
```
You should get a token back.

---

## STEP 4 — Frontend Setup

```bash
cd ..
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install axios react-router-dom recharts
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Replace `tailwind.config.js` with the one from this repo.

Replace `src/index.css` with the one from this repo.

Update `vite.config.js` to add the proxy:
```js
server: {
  port: 3000,
  proxy: {
    "/api": { target: "http://localhost:5000", changeOrigin: true }
  }
}
```

Create the src folder structure:
```
src/
  components/Layout/  (Layout.jsx, Sidebar.jsx, Header.jsx, Modal.jsx)
  components/Dashboard/ (StatCard.jsx)
  components/Inventory/ (PuzzleForm.jsx)
  context/ (AuthContext.jsx, ToastContext.jsx)
  pages/ (LoginPage.jsx, DashboardPage.jsx, InventoryPage.jsx, OrdersPage.jsx)
  utils/ (api.js)
  App.jsx
  main.jsx
  index.css
```

(Paste all file contents from this repo.)

Test frontend:
```bash
npm run dev    # → http://localhost:3000
```

Login with `admin@cogzart.com` / `admin123` — you should see the dashboard.

---

## STEP 5 — Create .gitignore

In the root `cogzart-dashboard/` folder, create `.gitignore`:
```
node_modules/
.env
dist/
.DS_Store
*.log
```

---

## STEP 6 — Push to GitHub

### A. Create a repository on GitHub
1. Go to https://github.com → Click **New repository**
2. Name it: `cogzart-dashboard`
3. Set to **Public** (required for submission)
4. Do NOT initialize with README (we already have one)
5. Click **Create repository**

### B. Push your code

```bash
# From the root cogzart-dashboard/ folder
git add .
git commit -m "Initial commit: CogZart Puzzle Admin Dashboard"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cogzart-dashboard.git
git push -u origin main
```





