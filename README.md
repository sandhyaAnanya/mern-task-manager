# MERN Task Manager

A beginner-friendly MERN CRUD application. Add tasks, mark them complete, and delete them.

## Stack
- MongoDB Atlas – database
- Express + Node.js – REST API
- React + Vite – frontend

## Run locally

### 1. Requirements
Install Node.js (LTS) and Git. Create a free MongoDB Atlas cluster and obtain a connection string.

### 2. Configure the backend
```bash
cd server
cp .env.example .env
```
Edit `server/.env` and set:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/mern_tasks
CLIENT_URL=http://localhost:5173
```
Replace the placeholders with your Atlas connection string. Do not share or commit `.env`.

### 3. Start the API
```bash
npm install
npm run dev
```
The API runs at `http://localhost:5000`.

### 4. Start React (open a second terminal)
```bash
cd client
cp .env.example .env
npm install
npm run dev
```
Open `http://localhost:5173`.

## Publish the code to GitHub

Create an empty repository on GitHub (do not add a README if you already have this project README). From the project root:
```bash
git init
git add .
git commit -m "Initial MERN task manager"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```
Replace the remote URL with your own repository URL. `.gitignore` excludes `.env` files.

## Deploy the live application

GitHub stores the source code; it does not run the Express API or host MongoDB. A straightforward free-tier setup (provider limits may change):

### A. Database – MongoDB Atlas
1. Create a free cluster in MongoDB Atlas.
2. Create a database user and password.
3. In Network Access, allow the deployment platform to connect. For a learning project you may temporarily allow `0.0.0.0/0`; use a strong database password and restrict access when possible.
4. Copy the application connection string. Replace the password placeholder and use database name `mern_tasks`.

### B. Backend – Render
1. In Render, create a **Web Service** and connect your GitHub repository.
2. Set **Root Directory** to `server`.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add environment variables:
   - `MONGODB_URI` = your Atlas connection string
   - `CLIENT_URL` = your deployed frontend URL (after deploying frontend; you can update this later)
   - `NODE_ENV` = `production`
6. Deploy and copy the service URL, for example `https://your-api.onrender.com`.

### C. Frontend – GitHub Pages is not suitable for this full-stack setup by itself
Use a static hosting provider such as Render Static Site or Vercel, connected to the same GitHub repository:
1. Set the frontend root directory to `client`.
2. Build command: `npm install && npm run build`
3. Publish directory: `dist`
4. Set environment variable `VITE_API_URL` to your backend URL, with no trailing slash, e.g. `https://your-api.onrender.com`.
5. Deploy the frontend.
6. Update the backend's `CLIENT_URL` environment variable to the deployed frontend URL, then redeploy/restart the backend.

## API endpoints
- `GET /api/tasks` – list tasks
- `POST /api/tasks` – create a task (`{ "title": "Learn Docker" }`)
- `PATCH /api/tasks/:id` – toggle completion (`{ "completed": true }`)
- `DELETE /api/tasks/:id` – delete a task
- `GET /api/health` – health check

## Troubleshooting
- `MONGODB_URI is missing`: check the backend environment variables.
- MongoDB connection error: verify the Atlas database username/password and Network Access rules.
- Browser CORS error: set backend `CLIENT_URL` to the exact frontend origin, then restart the backend.
- API unavailable on free hosting: the service may be waking from sleep; wait and retry.
