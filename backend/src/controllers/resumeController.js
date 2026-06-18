import asyncHandler from '../utils/asyncHandler.js';
import Resume from '../models/Resume.js';
import { parseResumeFile } from '../utils/fileParser.js';
import { buildResumeSummary } from '../utils/analysis.js';

const extractSkills = (text) => {
  const keywords = [
    'react',
    'javascript',
    'typescript',
    'node',
    'express',
    'mongodb',
    'mongoose',
    'html',
    'css',
    'tailwind',
    'redux',
    'jwt',
    'docker',
    'sql',
    'python',
    'tableau',
    'power bi',
    'aws',
    'azure',
    'git',
    'testing',
  ];

  return keywords.filter((keyword) => text.toLowerCase().includes(keyword));
};

export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Resume file is required' });
  }

  const textContent = await parseResumeFile(req.file);
  const summary = buildResumeSummary(textContent);
  const skills = extractSkills(textContent);

  const resume = await Resume.create({
    user: req.user._id,
    originalName: req.file.originalname,
    fileName: req.file.filename || req.file.originalname,
    fileType: req.file.mimetype,
    fileSize: req.file.size,
    textContent,
    summary: summary.excerpt,
    skills,
    parsedSections: summary.detectedSections,
  });

  res.status(201).json({
    message: 'Resume uploaded successfully',
    resume,
  });
});

export const getMyResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ resumes });
});

export const getResumeById = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });

  if (!resume) {
    return res.status(404).json({ message: 'Resume not found' });
  }

  res.json({ resume });
});