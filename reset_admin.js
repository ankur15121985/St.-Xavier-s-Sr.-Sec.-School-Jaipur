
import bcrypt from 'bcryptjs';
import Database from 'better-sqlite3';

const db = new Database('/tmp/database.sqlite');
const password = 'admin123';
const hashed = bcrypt.hashSync(password, 12);

try {
  const result = db.prepare('UPDATE admins SET password = ? WHERE username = ?').run(hashed, 'ankur24121985');
  console.log('Password reset result:', result);
  
  // Also ensure the user exists if not
  if (result.changes === 0) {
    db.prepare('INSERT INTO admins (id, username, password, role) VALUES (?, ?, ?, ?)').run(
      'admin-manual',
      'ankur24121985',
      hashed,
      'admin'
    );
    console.log('Admin user created manually.');
  }
} catch (err) {
  console.error('Error resetting password:', err);
} finally {
  db.close();
}
