import asyncHandler from '../utils/asyncHandler.js';
import AnalysisReport from '../models/AnalysisReport.js';
import Resume from '../models/Resume.js';
import { analyzeResume } from '../utils/analysis.js';
import { generateAiSuggestions } from '../utils/ai.js';

export const analyzeResumeForRole = asyncHandler(async (req, res) => {
  const { resumeId, jobDescription = '', roleName } = req.body;

  if (!resumeId || !roleName) {
    return res.status(400).json({ message: 'resumeId and roleName are required' });
  }

  const resume = await Resume.findOne({ _id: resumeId, user: req.user._id });
  if (!resume) {
    return res.status(404).json({ message: 'Resume not found' });
  }

  const analysis = analyzeResume({
    resumeText: resume.textContent,
    jobDescription,
    roleName,
  });

  const aiSuggestions = await generateAiSuggestions({
    resumeText: resume.textContent,
    jobDescription,
    roleName,
    analysis,
  });

  const report = await AnalysisReport.create({
    user: req.user._id,
    resume: resume._id,
    roleName,
    jobDescription,
    atsScore: analysis.atsScore,
    matchPercentage: analysis.matchPercentage,
    missingKeywords: analysis.missingKeywords,
    strengths: analysis.strengths,
    weaknesses: analysis.weaknesses,
    skillGaps: analysis.skillGaps,
    skillRecommendations: analysis.skillRecommendations,
    suggestions: aiSuggestions,
    aiSummary: aiSuggestions.roleMatchSummary || '',
  });

  res.status(201).json({
    report,
    analysis,
    aiSuggestions,
  });
});

export const getAnalysisHistory = asyncHandler(async (req, res) => {
  const reports = await AnalysisReport.find({ user: req.user._id })
    .populate('resume', 'originalName fileName createdAt')
    .sort({ createdAt: -1 });

  res.json({ reports });
});

export const getAnalysisReport = asyncHandler(async (req, res) => {
  const report = await AnalysisReport.findOne({ _id: req.params.id, user: req.user._id }).populate('resume');

  if (!report) {
    return res.status(404).json({ message: 'Analysis report not found' });
  }

  res.json({ report });
});