import mongoose from 'mongoose';

const analysisReportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resume: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', required: true },
    roleName: { type: String, required: true },
    jobDescription: { type: String, default: '' },
    atsScore: { type: Number, required: true },
    matchPercentage: { type: Number, required: true },
    missingKeywords: [{ type: String }],
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    skillGaps: [{ type: String }],
    skillRecommendations: [{ type: String }],
    suggestions: { type: Object, default: {} },
    aiSummary: { type: String, default: '' },
  },
  { timestamps: true }
);

const AnalysisReport = mongoose.model('AnalysisReport', analysisReportSchema);

export default AnalysisReport;