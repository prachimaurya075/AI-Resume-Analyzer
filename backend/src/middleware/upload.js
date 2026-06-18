import multer from 'multer';

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];

    if (allowedTypes.includes(file.mimetype) || file.originalname.toLowerCase().endsWith('.docx')) {
      cb(null, true);
    } else {
      const error = new Error('Only PDF or DOCX files are allowed');
      error.statusCode = 400;
      cb(error);
    }
  },
});