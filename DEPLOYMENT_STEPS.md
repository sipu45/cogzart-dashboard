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

Replace `YOUR_USERNAME` with your GitHub username.

---

## STEP 7 — Deploy Backend (Railway — Free)

1. Go to https://railway.app → Sign up/login with GitHub
2. Click **New Project** → **Deploy from GitHub repo**
3. Select `cogzart-dashboard`
4. Click **Add service** → choose your repo
5. In the service settings → set **Root Directory** to `backend`
6. Go to **Variables** tab and add:
   ```
   PORT=5000
   MONGO_URI=<your MongoDB Atlas URI>
   JWT_SECRET=cogzart_super_secret_key_2024
   NODE_ENV=production
   ```
7. Railway auto-detects `npm start` → click Deploy
8. Copy the generated URL (e.g. `https://cogzart-backend.up.railway.app`)

### MongoDB Atlas (free):
1. Go to https://cloud.mongodb.com → Create free account
2. Create a free M0 cluster
3. Under **Database Access** → Add user with password
4. Under **Network Access** → Allow all IPs (`0.0.0.0/0`)
5. Click **Connect** → **Drivers** → copy the URI
6. Replace `<password>` in the URI with your actual password
7. Use this as `MONGO_URI` in Railway

---

## STEP 8 — Deploy Frontend (Vercel — Free)

1. In `frontend/`, update `vite.config.js` — replace the proxy with your Railway URL by creating `frontend/.env.production`:
   ```
   VITE_API_URL=https://cogzart-backend.up.railway.app
   ```
   
   Update `frontend/src/utils/api.js`:
   ```js
   const api = axios.create({
     baseURL: import.meta.env.VITE_API_URL
       ? `${import.meta.env.VITE_API_URL}/api`
       : "/api",
   });
   ```

2. Push the change:
   ```bash
   git add .
   git commit -m "feat: configure production API URL"
   git push
   ```

3. Go to https://vercel.com → Sign up with GitHub
4. Click **New Project** → import `cogzart-dashboard`
5. Set **Root Directory** to `frontend`
6. Add env variable: `VITE_API_URL=https://cogzart-backend.up.railway.app`
7. Click **Deploy**

Your frontend is live at `https://cogzart-dashboard.vercel.app`

---

## STEP 9 — Seed Production Database

After the backend is live:
```bash
cd backend
MONGO_URI=<your Atlas URI> node seed.js
```

Or run it from Railway shell.

---

## STEP 10 — Final Submission Checklist

- [ ] GitHub repo is public
- [ ] `frontend/` folder contains React app
- [ ] `backend/` folder contains Express API
- [ ] README.md includes setup instructions, features, screenshots
- [ ] All CRUD operations work (Add/Edit/Delete puzzles, Create/View orders)
- [ ] Login works with `admin@cogzart.com` / `admin123`
- [ ] Sidebar navigation (Dashboard / Inventory / Orders) works
- [ ] Search and filters on Inventory page work

### Add screenshots to README:
1. Take screenshots of: Login page, Dashboard, Inventory, Orders
2. Create a `screenshots/` folder in the root
3. Reference them in README.md:
   ```markdown
   ## Screenshots
   ![Dashboard](screenshots/dashboard.png)
   ![Inventory](screenshots/inventory.png)
   ![Orders](screenshots/orders.png)
   ```

---

## Interview Prep — Quick Answers

**Explain your project structure:**
"I used MVC architecture on the backend — Models define schemas (Puzzle, Order), Controllers hold business logic, and Routes map HTTP endpoints. The frontend uses React context for global state (auth, toasts), custom Axios instance for API calls with automatic JWT injection, and page-level components for each module."

**How would you scale for large datasets?**
"Implement MongoDB indexes on frequently queried fields (name, status). Add pagination to all list endpoints using skip/limit. Use Redis for caching dashboard stats. Move image uploads to S3 instead of URL strings."

**Performance improvements:**
"Add React.memo and useCallback to prevent unnecessary re-renders. Implement debounce on search input (already done). Add database-level filtering and sorting instead of in-memory. Use virtual scrolling for large tables."

**Additional production features:**
"Role-based access control, audit logs for CRUD operations, real image upload (Multer + S3), invoice PDF generation, email notifications on order status changes, analytics with date range filters."
