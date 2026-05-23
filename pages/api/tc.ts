import { NextApiResponse } from 'next';
import { getDatabase } from '../../src/lib/db';
import { authenticateToken, AuthenticatedRequest } from '../../src/lib/auth';

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const db = getDatabase();

  if (req.method === 'GET') {
    try {
      const list = db.prepare("SELECT * FROM transfer_certificates ORDER BY id DESC").all();
      return res.status(200).json(list);
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch certificates' });
    }
  }

  if (req.method === 'POST') {
    if (!authenticateToken(req, res)) {
      return;
    }

    const { admission_number, dob, student_name, attachmentUrl } = req.body;
    const id = Math.random().toString(36).substring(2, 11);
    try {
      db.prepare("INSERT INTO transfer_certificates (id, admission_number, dob, student_name, attachmentUrl) VALUES (?, ?, ?, ?, ?)")
        .run(id, admission_number, dob, student_name, attachmentUrl);
      return res.status(200).json({ id, admission_number, dob, student_name, attachmentUrl });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to upload certificate' });
    }
  }

  if (req.method === 'DELETE') {
    if (!authenticateToken(req, res)) {
      return;
    }

    const { id } = req.query;
    if (!id) {
       return res.status(400).json({ error: 'Missing certificate id' });
    }

    try {
      db.prepare("DELETE FROM transfer_certificates WHERE id = ?").run(id);
      return res.status(200).json({ success: true });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
