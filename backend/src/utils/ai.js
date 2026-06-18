import OpenAI from 'openai';

let client;

const getClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  return client;
};

export const generateAiSuggestions = async ({ resumeText, jobDescription, roleName, analysis }) => {
  const openai = getClient();
  const fallback = {
    professionalSummary: `Tailor the summary for ${roleName} with measurable outcomes and key tools.`,
    projectDescriptions: ['Rewrite project bullets to show business impact, scope, and metrics.'],
    atsKeywords: analysis.missingKeywords.slice(0, 8),
    improvementPoints: [
      'Quantify achievements with numbers.',
      'Add a clearer skills section with the target role keywords.',
      'Use concise, ATS-friendly bullet points.',
    ],
  };

  if (!openai) {
    return fallback;
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.3,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume reviewer. Return only valid JSON with professionalSummary, projectDescriptions, atsKeywords, improvementPoints, and roleMatchSummary.',
        },
        {
          role: 'user',
          content: JSON.stringify({
            roleName,
            jobDescription,
            resumeText,
            analysis,
          }),
        },
      ],
    });

    const content = response.choices?.[0]?.message?.content || '{}';
    const parsed = JSON.parse(content);

    return {
      professionalSummary: parsed.professionalSummary || fallback.professionalSummary,
      projectDescriptions: Array.isArray(parsed.projectDescriptions)
        ? parsed.projectDescriptions
        : fallback.projectDescriptions,
      atsKeywords: Array.isArray(parsed.atsKeywords) ? parsed.atsKeywords : fallback.atsKeywords,
      improvementPoints: Array.isArray(parsed.improvementPoints)
        ? parsed.improvementPoints
        : fallback.improvementPoints,
      roleMatchSummary: parsed.roleMatchSummary || `The resume was analyzed for ${roleName}.`,
    };
  } catch (error) {
    return {
      ...fallback,
      roleMatchSummary: `The resume was analyzed for ${roleName}.`,
      aiError: error.message,
    };
  }
};