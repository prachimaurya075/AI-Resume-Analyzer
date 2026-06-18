Deployement -https://ai-resume-analyzer-two-jet.vercel.app/login
vercel and Render -https://ai-resume-analyzer-git-main-prachi-mauryas-projects.vercel.app/


# AI Resume Analyzer

Production-ready MERN resume analyzer with Firebase Google sign-in, JWT-backed API sessions, PDF/DOCX upload, ATS scoring, skill-gap analysis, OpenAI-powered suggestions, and a recruiter-friendly dashboard.

## Features

- User signup and login with Firebase email/password and Google sign-in
- Backend JWT session exchange for protected API access
- Protected dashboard for authenticated users
- PDF and DOCX resume upload
- Resume storage in MongoDB with extracted text and metadata
- ATS score out of 100 with missing keywords and strengths/weaknesses
- Role-based match percentage for Frontend Developer, MERN Developer, Software Engineer, and Data Analyst
- AI-driven resume improvement suggestions through OpenAI
- Analysis history and uploaded resume history
- Modern responsive UI with dark/light mode, loading states, and animations

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Framer Motion, React Router
- Backend: Node.js, Express.js, MongoDB, Mongoose, JWT, Firebase Admin, Multer, pdf-parse, Mammoth
- AI: OpenAI API
- Deployment: Vercel for frontend, Render for backend, MongoDB Atlas for database

## Project Structure

- `backend/` - Express API, models, routes, controllers, and AI utilities
- `frontend/` - React dashboard, auth screens, shared UI, and services
- `render.yaml` - Render deployment template for the API
- `frontend/vercel.json` - SPA rewrite config for Vercel

## Local Setup

1. Create a MongoDB Atlas cluster and copy the connection string.
2. Copy `backend/.env.example` to `backend/.env` and fill in the values.
3. Copy `frontend/.env.example` to `frontend/.env` and fill in the Firebase web config values.
4. Install backend and frontend dependencies.
5. Start the backend and frontend in separate terminals.

### Backend Environment Variables

Use these values in `backend/.env`:

```bash
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/ai_resume_analyzer
JWT_SECRET=replace_with_a_long_random_secret
OPENAI_API_KEY=sk-your-openai-key
CLIENT_URL=http://localhost:5173
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
```

### Frontend Environment Variables

Use these values in `frontend/.env`:

```bash
VITE_API_BASE_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=optional_measurement_id
```

## Run Locally

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Production Deployment

### Backend on Render

1. Create a new Web Service from the `backend` folder.
2. Set the build command to `npm install`.
3. Set the start command to `npm start`.
4. Add environment variables for `MONGODB_URI`, `JWT_SECRET`, `OPENAI_API_KEY`, `CLIENT_URL`, and the Firebase Admin credentials.

### Frontend on Vercel

1. Import the `frontend` folder as a Vercel project.
2. Set `VITE_API_BASE_URL` to your Render API URL ending in `/api`.
3. Set the Firebase web config variables in Vercel.
4. Deploy with the included SPA rewrite configuration.

## Notes

- The OpenAI API is optional at runtime. If the key is missing, the backend falls back to a deterministic heuristic suggestion engine.
- Uploads are parsed in memory and the extracted resume text is stored in MongoDB for analysis history.
- The scoring algorithm is intentionally transparent so recruiters can understand why a score was produced.

