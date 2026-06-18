import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { analyzeResumeForRole, getAnalysisHistory, getAnalysisReport } from '../controllers/analysisController.js';

const router = Router();

router.post('/analyze', protect, analyzeResumeForRole);
router.get('/history', protect, getAnalysisHistory);
router.get('/:id', protect, getAnalysisReport);

export default router;