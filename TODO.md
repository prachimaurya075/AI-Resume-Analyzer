# TODO - AI Resume Analyzer Backend Fixes

## Step 1: Fix Firebase named export mismatch
- [ ] Update `backend/src/controllers/authController.js` to import `{ firebaseAdminAuth }` correctly.

## Step 2: Ensure Firebase failures don’t crash server at startup
- [ ] Keep Firebase optional (503 only when calling the Firebase auth endpoint).
- [ ] Guard any startup-time Firebase initialization issues.

## Step 3: Ensure backend loads correct env for Mongo
- [ ] Verify/adjust `.env` loading so `process.env.MONGODB_URI` exists when server starts.
- [ ] Add a safe startup log that indicates which env vars are present (no secrets).

## Step 4: Run and verify
- [ ] Run `npm run dev` in `backend`.
- [ ] Confirm Mongo connects.
- [ ] Confirm server no longer crashes on Firebase import.

