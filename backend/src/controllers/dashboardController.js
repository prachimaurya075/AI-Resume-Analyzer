import asyncHandler from '../utils/asyncHandler.js';
import Resume from '../models/Resume.js';
import AnalysisReport from '../models/AnalysisReport.js';

export const getDashboardSummary = asyncHandler(async (req, res) => {
  const [resumes, reports] = await Promise.all([
    Resume.find({ user: req.user._id }).sort({ createdAt: -1 }),
    AnalysisReport.find({ user: req.user._id }).sort({ createdAt: -1 }).populate('resume', 'originalName'),
  ]);

  const latestReport = reports[0] || null;
  const averageScore = reports.length
    ? Math.round(reports.reduce((sum, report) => sum + report.atsScore, 0) / reports.length)
    : 0;

  res.json({
    stats: {
      totalResumes: resumes.length,
      totalAnalyses: reports.length,
      averageScore,
      latestScore: latestReport?.atsScore || 0,
      latestMatch: latestReport?.matchPercentage || 0,
    },
    latestReport,
    resumes,
    reports,
  });
});