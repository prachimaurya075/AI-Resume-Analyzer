import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

const normalizeText = (text) =>
  text
    .replace(/\r/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ ]{2,}/g, ' ')
    .trim();

export const parseResumeFile = async (file) => {
  if (!file) {
    const error = new Error('Resume file is required');
    error.statusCode = 400;
    throw error;
  }

  const mimeType = file.mimetype || '';
  let text = '';

  if (mimeType === 'application/pdf') {
    const parsed = await pdfParse(file.buffer);
    text = parsed.text;
  } else if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.originalname.toLowerCase().endsWith('.docx')
  ) {
    const parsed = await mammoth.extractRawText({ buffer: file.buffer });
    text = parsed.value;
  } else {
    text = file.buffer.toString('utf8');
  }

  return normalizeText(text);
};