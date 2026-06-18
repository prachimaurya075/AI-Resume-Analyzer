import dotenv from 'dotenv';
import path from 'path';
import app from './app.js';
import connectDB from './config/db.js';

// Ensure the backend loads its intended env file regardless of where nodemon is started from.
const envPathCandidates = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'backend', '.env'),
  path.resolve(process.cwd(), '.env.local'),
  path.resolve(process.cwd(), 'backend', '.env.local'),
];

let loaded = false;
for (const p of envPathCandidates) {
  const result = dotenv.config({ path: p });
  if (result.parsed) {
    loaded = true;
    break;
  }
}

// Avoid printing secrets; log presence only.
const envPresence = {
  MONGODB_URI: Boolean(process.env.MONGODB_URI),
  JWT_SECRET: Boolean(process.env.JWT_SECRET),
  FIREBASE_PROJECT_ID: Boolean(process.env.FIREBASE_PROJECT_ID),
  PORT: process.env.PORT ? process.env.PORT : undefined,
};

console.log(`[env] loaded=${loaded} pathCandidatesCount=${envPathCandidates.length}`);
console.log('[env] presence=', envPresence);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
