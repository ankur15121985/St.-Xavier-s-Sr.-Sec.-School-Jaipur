import { NextApiResponse } from 'next';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticateToken, AuthenticatedRequest } from '../../src/lib/auth';

const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const section = req.query.section || req.body?.section || '';
    const dest = section ? path.join(uploadDir, String(section)) : uploadDir;
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    cb(null, dest);
  },
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const allowedExtensions = /\.(png|jpg|jpeg|gif|webp|pdf|doc|docx|xls|xlsx)$/i;
    if (!allowedExtensions.test(file.originalname)) {
      return cb(new Error('Only images (png, jpg, jpeg, gif, webp), PDFs, Word, and Excel files are allowed.'));
    }
    cb(null, true);
  }
});

function runMiddleware(req: any, res: any, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!await authenticateToken(req, res)) {
    return;
  }

  try {
    await runMiddleware(req, res, upload.single('file'));
    
    const file = (req as any).file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded (ensure field name is "file")' });
    }

    const section = req.query.section || req.body?.section || 'misc';
    const relativePath = section !== 'misc' ? `${section}/${file.filename}` : file.filename;
    
    return res.status(200).json({ 
      success: true,
      url: `/uploads/${relativePath}`,
      filename: file.filename,
      path: relativePath
    });
  } catch (err: any) {
    console.error(`[UPLOAD ERROR]`, err);
    return res.status(400).json({ error: err.message || 'Upload failed' });
  }
}
