import { NextApiResponse } from 'next';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticateToken, AuthenticatedRequest } from '../../../src/lib/auth';

const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

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
    await runMiddleware(req, res, upload.single('image'));
    const file = (req as any).file;
    if (!file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }
    return res.status(200).json({ url: `/uploads/${file.filename}` });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Gallery upload failed' });
  }
}
