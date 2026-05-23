import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  const uploadDirExists = fs.existsSync(uploadDir);
  const writable = (() => {
    try {
      const testFile = path.join(uploadDir, '.write-test');
      fs.writeFileSync(testFile, 'test');
      fs.unlinkSync(testFile);
      return true;
    } catch { return false; }
  })();

  return res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uploadDir: uploadDir,
    exists: uploadDirExists,
    writable: writable,
    serverMode: process.env.NODE_ENV || 'development'
  });
}
