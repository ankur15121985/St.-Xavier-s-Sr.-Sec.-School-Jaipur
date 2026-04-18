import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import multer from 'multer';
import sqlite3 from 'sqlite3';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Setup Database
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Gallery Table
  db.run(`CREATE TABLE IF NOT EXISTS gallery (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    caption TEXT NOT NULL
  )`);

  // Notices Table
  db.run(`CREATE TABLE IF NOT EXISTS notices (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    category TEXT NOT NULL,
    link TEXT
  )`);

  // Staff Table
  db.run(`CREATE TABLE IF NOT EXISTS staff (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    bio TEXT NOT NULL,
    image TEXT NOT NULL,
    type TEXT NOT NULL
  )`);

  // Fees Table
  db.run(`CREATE TABLE IF NOT EXISTS fees (
    id TEXT PRIMARY KEY,
    grade TEXT NOT NULL,
    admissionFee TEXT NOT NULL,
    tuition_fees TEXT NOT NULL,
    quarterly TEXT NOT NULL
  )`);

  // Links Table
  db.run(`CREATE TABLE IF NOT EXISTS links (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT NOT NULL
  )`);

  // Events Table
  db.run(`CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    location TEXT NOT NULL
  )`);

  // Achievements Table
  db.run(`CREATE TABLE IF NOT EXISTS achievements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    year TEXT NOT NULL,
    description TEXT NOT NULL
  )`);
});

// Setup Multer for Image Uploads
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

// API Routes
app.get('/api/data', (req, res) => {
  const data: any = {};
  const tables = ['gallery', 'notices', 'staff', 'fees', 'links', 'events', 'achievements'];
  let completed = 0;
  let hasError = false;

  tables.forEach(table => {
    db.all(`SELECT * FROM ${table}`, (err, rows) => {
      if (hasError) return;
      
      if (err) {
        hasError = true;
        console.error(`Fetch error for ${table}:`, err);
        return res.status(500).json({ error: err.message });
      }
      
      data[table] = rows;
      completed++;
      if (completed === tables.length) {
        res.json(data);
      }
    });
  });
});

app.post('/api/gallery/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded' });
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ url: imageUrl });
});

app.post('/api/gallery/upload-multiple', upload.array('images', 10), (req, res) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'No images uploaded' });
  }

  const urls = files.map(file => `/uploads/${file.filename}`);
  res.json({ urls });
});

app.post('/api/save', (req, res) => {
  const { table, item } = req.body;
  const fields = Object.keys(item);
  const placeholders = fields.map(() => '?').join(',');
  const values = fields.map(f => item[f]);

  const query = `INSERT OR REPLACE INTO ${table} (${fields.join(',')}) VALUES (${placeholders})`;
  
  db.run(query, values, (err) => {
    if (err) {
      console.error(`SQL Save Error (${table}):`, err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true });
  });
});

app.delete('/api/delete', (req, res) => {
  const { table, id, ids } = req.body;
  if (ids && Array.isArray(ids)) {
    const placeholders = ids.map(() => '?').join(',');
    db.run(`DELETE FROM ${table} WHERE id IN (${placeholders})`, ids, (err) => {
      if (err) {
        console.error(`SQL Bulk Delete Error (${table}):`, err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true });
    });
  } else {
    db.run(`DELETE FROM ${table} WHERE id = ?`, [id], (err) => {
      if (err) {
        console.error(`SQL Delete Error (${table}):`, err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true });
    });
  }
});

// Vite Integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
