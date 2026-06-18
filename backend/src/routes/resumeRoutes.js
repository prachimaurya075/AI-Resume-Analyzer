import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { getMyResumes, getResumeById, uploadResume } from '../controllers/resumeController.js';

const router = Router();

router.route('/').get(protect, getMyResumes).post(protect, upload.single('resume'), uploadResume);
router.get('/:id', protect, getResumeById);

export default router;