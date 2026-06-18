import { getRoleProfile } from '../config/jobRoles.js';

const stopWords = new Set([
  'the', 'and', 'with', 'for', 'you', 'your', 'that', 'this', 'from', 'have', 'are', 'was', 'were', 'can', 'will', 'has', 'had', 'our', 'their', 'they', 'them', 'been', 'into', 'using', 'use', 'used', 'work', 'working', 'experience', 'skills', 'skill', 'resume', 'candidate', 'job', 'role', 'team', 'project', 'projects', 'responsible', 'responsibilities', 'strong', 'good', 'years'
]);

const sectionPatterns = {
  summary: /\b(summary|professional summary|profile)\b/i,
  experience: /\b(experience|employment|work history)\b/i,
  skills: /\b(skills|technical skills|core competencies)\b/i,
  projects: /\b(projects|project experience)\b/i,
  education: /\b(education|academic background)\b/i,
  certifications: /\b(certifications?|licenses?)\b/i,
};

const splitWords = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9+.#\s-]/g, ' ')
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean);

const phraseToRegex = (phrase) => new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');

const unique = (values) => [...new Set(values.filter(Boolean))];

const extractKeywords = (text, minLength = 3) => {
  const tokens = splitWords(text).filter((word) => word.length >= minLength && !stopWords.has(word));
  return unique(tokens);
};

const countMatches = (text, keywords) =>
  keywords.reduce((count, keyword) => (phraseToRegex(keyword).test(text) ? count + 1 : count), 0);

const sectionsPresent = (resumeText) =>
  Object.entries(sectionPatterns)
    .filter(([_name, pattern]) => pattern.test(resumeText))
    .map(([name]) => name);

export const analyzeResume = ({ resumeText, jobDescription, roleName }) => {
  const roleProfile = getRoleProfile(roleName);
  const resumeLower = resumeText.toLowerCase();
  const descriptionKeywords = extractKeywords(jobDescription, 4);
  const roleKeywords = roleProfile.keywords;
  const allKeywords = unique([...descriptionKeywords, ...roleKeywords]);

  const matchedKeywords = allKeywords.filter((keyword) => phraseToRegex(keyword).test(resumeLower));
  const missingKeywords = allKeywords.filter((keyword) => !matchedKeywords.includes(keyword));
  const sections = sectionsPresent(resumeText);
  const wordCount = splitWords(resumeText).length;

  const keywordCoverage = allKeywords.length ? matchedKeywords.length / allKeywords.length : 0;
  const roleCoverage = roleKeywords.length ? countMatches(resumeLower, roleKeywords) / roleKeywords.length : 0;
  const sectionScore = ['summary', 'experience', 'skills', 'projects', 'education'].reduce(
    (score, section) => score + (sections.includes(section) ? 1 : 0),
    0
  ) / 5;
  const lengthScore = Math.min(wordCount / 450, 1);
  const formattingScore = resumeText.includes('\n') ? 0.7 : 0.3;

  const rawScore =
    keywordCoverage * 45 +
    roleCoverage * 25 +
    sectionScore * 15 +
    lengthScore * 10 +
    formattingScore * 5;

  const atsScore = Math.max(20, Math.min(100, Math.round(rawScore)));
  const matchPercentage = Math.max(10, Math.min(100, Math.round((keywordCoverage * 0.6 + roleCoverage * 0.4) * 100)));

  const strengths = [];
  if (sections.includes('summary')) strengths.push('Includes a professional summary section');
  if (sections.includes('experience')) strengths.push('Shows work experience structure');
  if (matchedKeywords.length >= Math.min(5, allKeywords.length)) strengths.push('Contains several role-relevant keywords');
  if (wordCount >= 250) strengths.push('Has enough content depth for ATS parsing');

  const weaknesses = [];
  if (!sections.includes('skills')) weaknesses.push('Add a dedicated skills section');
  if (!sections.includes('projects')) weaknesses.push('Add measurable project highlights');
  if (missingKeywords.length >= 3) weaknesses.push('Missing several important role keywords');
  if (wordCount < 200) weaknesses.push('Resume content is too short for senior ATS screening');

  const skillGaps = roleProfile.skillRecommendations.filter((skill) =>
    !resumeLower.includes(skill.toLowerCase())
  );

  return {
    atsScore,
    matchPercentage,
    missingKeywords: missingKeywords.slice(0, 12),
    strengths,
    weaknesses,
    skillGaps,
    skillRecommendations: roleProfile.skillRecommendations,
    matchedKeywords,
    sections,
    wordCount,
  };
};

export const buildResumeSummary = (resumeText) => {
  const words = splitWords(resumeText).length;
  const sections = sectionsPresent(resumeText);
  return {
    wordCount: words,
    detectedSections: sections,
    excerpt: resumeText.slice(0, 260),
  };
};