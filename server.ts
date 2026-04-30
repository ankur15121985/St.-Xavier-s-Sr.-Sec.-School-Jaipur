import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import multer from 'multer';
import Database from 'better-sqlite3';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// GLOBAL LOGGER
app.use((req, res, next) => {
  console.log(`[SYS] ${req.method} ${req.url} - IP: ${req.ip}`);
  next();
});

// Basic Middleware
app.use(cors());
// Do not use global express.json() here if you want to avoid interfering with files, 
// move it to routes that need it, or ensure it only runs for json content-type.
app.use((req, res, next) => {
  if (req.headers['content-type']?.includes('application/json')) {
    express.json()(req, res, next);
  } else {
    next();
  }
});

// Setup Multer for Image Uploads
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine subdirectory from query param or body
    const section = req.query.section || req.body.section || '';
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
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

// Upload Route (Defined VERY EARLY and handles both trailing slash and not)
app.post(['/api/upload', '/api/upload/'], (req, res) => {
  const section = req.query.section || req.body.section || 'misc';
  console.log(`[UPLOAD REQUEST] Starting for section: ${section}`);
  
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error(`[UPLOAD ERROR] Multer error:`, err);
      return res.status(400).json({ error: `Upload Failed: ${err.message}` });
    }
    if (!req.file) {
      console.warn(`[UPLOAD WARNING] No file attached to 'file' field`);
      return res.status(400).json({ error: 'No file uploaded (use "file" field)' });
    }
    
    // Ensure section subdirectory exists
    const sectionDir = path.join(uploadDir, String(section));
    if (!fs.existsSync(sectionDir)) fs.mkdirSync(sectionDir, { recursive: true });

    const relativePath = section !== 'misc' ? `${section}/${req.file.filename}` : req.file.filename;
    console.log(`[UPLOAD SUCCESS] Saved: ${req.file.filename} in ${section}`);
    
    res.json({ 
      success: true,
      url: `/uploads/${relativePath}`,
      filename: req.file.filename,
      path: relativePath
    });
  });
});

// Detailed Request Logger for API
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[API REQUEST] ${new Date().toISOString()} - ${req.method} ${req.url}`);
  }
  next();
});

// Setup Database
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

// Diagnostic Ping
app.get('/api/ping', (req, res) => res.json({ pong: true, time: new Date().toISOString() }));

app.get('/api/routes', (req, res) => {
  const routes = app._router.stack
    .filter((r: any) => r.route)
    .map((r: any) => ({
      path: r.route.path,
      methods: r.route.methods
    }));
  res.json(routes);
});

// Constants
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabaseServer = (SUPABASE_URL && SUPABASE_KEY) ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

if (supabaseServer) {
  console.log('[SUPABASE] Server-side client initialized.');
} else {
  console.warn('[SUPABASE] Server-side client missing credentials.');
}

// Removed old upload routes from here as they were moved up

app.post('/api/gallery/upload', (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: 'No image file uploaded' });
    res.json({ url: `/uploads/${req.file.filename}` });
  });
});

app.post('/api/gallery/upload-multiple', (req, res) => {
  upload.array('images', 10)(req, res, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) return res.status(400).json({ error: 'No images uploaded' });
    res.json({ urls: files.map(file => `/uploads/${file.filename}`) });
  });
});

app.use('/uploads', express.static(uploadDir));
app.use('/public/uploads', express.static(uploadDir));

// Setup Database

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS gallery (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    caption TEXT NOT NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS notices (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    date TEXT NOT NULL,
    category TEXT NOT NULL,
    link TEXT,
    attachmentUrl TEXT
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS staff (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    bio TEXT NOT NULL,
    image TEXT NOT NULL,
    type TEXT NOT NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS fees (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    particulars TEXT NOT NULL,
    amount TEXT NOT NULL,
    quarterly TEXT NOT NULL,
    remarks TEXT,
    order_index INTEGER NOT NULL,
    attachmentUrl TEXT
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS links (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    attachmentUrl TEXT
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    location TEXT NOT NULL,
    attachmentUrl TEXT
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS menu (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    href TEXT NOT NULL,
    parent_id TEXT,
    order_index INTEGER NOT NULL,
    attachmentUrl TEXT
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS studentHonors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    result TEXT NOT NULL,
    subtext TEXT NOT NULL,
    image TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    attachmentUrl TEXT
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS achievements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    year TEXT NOT NULL,
    description TEXT NOT NULL,
    attachmentUrl TEXT
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS carousel (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    caption TEXT NOT NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS faqs (
    id TEXT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT,
    order_index INTEGER NOT NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    status TEXT NOT NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS popups (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    content TEXT NOT NULL,
    buttonText TEXT,
    buttonLink TEXT,
    isActive INTEGER NOT NULL,
    order_index INTEGER NOT NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY,
    applyNowEnabled INTEGER NOT NULL,
    applyNowUrl TEXT NOT NULL,
    applyNowLabel TEXT NOT NULL,
    siteName TEXT,
    siteLogo TEXT,
    contactEmail TEXT,
    contactPhone TEXT,
    contactAddress TEXT,
    currentSession TEXT
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS content (
    id TEXT PRIMARY KEY,
    heroTitle1 TEXT,
    heroTitle2 TEXT,
    heroBadge TEXT,
    heroDescription TEXT,
    carouselBranding TEXT,
    aboutBadge TEXT,
    aboutTitle1 TEXT,
    aboutTitle2 TEXT,
    aboutDescription TEXT,
    mottoTitle TEXT,
    mottoDescription TEXT,
    historyButton TEXT,
    principalBadge TEXT,
    principalTitle1 TEXT,
    principalTitle2 TEXT,
    principalTitle3 TEXT,
    principalQuote TEXT,
    principalButton TEXT,
    oeuvreTitle1 TEXT,
    oeuvreTitle2 TEXT,
    oeuvreDescription TEXT,
    regencyBadge TEXT,
    regencyTitle1 TEXT,
    regencyTitle2 TEXT,
    nodesTitle1 TEXT,
    nodesTitle2 TEXT,
    nodesDescription TEXT,
    helpdeskLabel TEXT,
    wiredTitle TEXT,
    wiredBadge TEXT,
    exploreButton TEXT,
    footerDescription TEXT
  )
`);

// Migration to add attachmentUrl to existing tables if missing
const tablesToUpdate = ['links', 'events', 'achievements', 'menu', 'studentHonors', 'staff', 'gallery', 'carousel', 'faqs', 'messages', 'popups', 'notices'];
tablesToUpdate.forEach(table => {
  try {
    db.prepare(`ALTER TABLE "${table}" ADD COLUMN attachmentUrl TEXT`).run();
    console.log(`[MIGRATION] Added attachmentUrl column to ${table}`);
  } catch (err: any) {
    if (!err.message.toLowerCase().includes('duplicate column name')) {
      console.warn(`[MIGRATION] Status for ${table}: ${err.message}`);
    }
  }
});

// Seed Default Settings if empty
const settingsCountResult = db.prepare("SELECT COUNT(*) as count FROM settings").get() as any;
if ((settingsCountResult?.count || 0) === 0) {
    console.log("Seeding default settings...");
    db.prepare("INSERT INTO settings (id, applyNowEnabled, applyNowUrl, applyNowLabel, siteName, siteLogo, contactEmail, contactPhone, contactAddress, currentSession) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").run(
      'global',
      1,
      'https://xaviersjaipur.edu.in/wp-content/uploads/2024/03/Admission-Prospectus-2024-25.pdf',
      'Apply 2026-27',
      "St. Xavier's Sr. Sec. School, Jaipur",
      'https://xaviersjaipur.edu.in/wp-content/uploads/2023/12/SchoolLogoTest.png',
      'xaviersjaipur@gmail.com',
      '0141-2372336, 2362436',
      'Bhagwan Das Road, C-Scheme, Jaipur - 302001, Rajasthan, India',
      '2025-26'
    );
}

// Seed Default Content if empty
const contentCountResult = db.prepare("SELECT COUNT(*) as count FROM content").get() as any;
if ((contentCountResult?.count || 0) === 0) {
    console.log("Seeding default content...");
    const content = {
        id: 'global',
        heroTitle1: 'Beyond',
        heroTitle2: 'Imagination.',
        heroBadge: 'A Legacy of Jesuit Excellence',
        heroDescription: 'Step into a world where tradition meets innovation. Empowering leaders since 1941.',
        carouselBranding: 'Jaipur Legacy.',
        aboutBadge: 'Welcome to Excellence',
        aboutTitle1: 'About',
        aboutTitle2: 'St. Xavier’s School.',
        aboutDescription: 'Established in 1941, St. Xavier\'s School, Jaipur, is a premier Jesuit institution dedicated to the holistic development of its students. Rooted in the rich heritage of the Society of Jesus, we strive to nurture "men and women for others" through academic excellence, character building, and social responsibility.',
        mottoTitle: 'Motto',
        mottoDescription: '"For God and Country" represents our core ethos of service and devotion.',
        historyButton: 'Discover Our Story',
        principalBadge: "Guardian's Vision",
        principalTitle1: 'Lead',
        principalTitle2: 'with',
        principalTitle3: 'Grace.',
        principalQuote: 'We cultivate individuals of character, resilient in spirit and enlightened in soul. Education is the journey of becoming.',
        principalButton: 'The Full Narrative',
        oeuvreTitle1: 'Campus',
        oeuvreTitle2: 'Oeuvre.',
        oeuvreDescription: 'A visual collective capturing the vibrant soul of St. Xavier\'s Jaipur.',
        regencyBadge: 'The Guardians',
        regencyTitle1: 'The',
        regencyTitle2: 'Regency.',
        nodesTitle1: 'Vital',
        nodesTitle2: 'Nodes.',
        nodesDescription: 'The administrative heart of our institution, condensed for your convenience.',
        helpdeskLabel: 'Support Helpdesk',
        wiredTitle: 'Stay Wired.',
        wiredBadge: 'Real-time Institutional Heartbeat',
        exploreButton: 'Explore Campus',
        footerDescription: 'Pioneering Jesuit excellence since 1941. Shaping the leaders of tomorrow with soul, heart, and mind.'
    };
    
    const fields = Object.keys(content);
    const placeholders = fields.map(() => '?').join(',');
    const query = `INSERT INTO content (${fields.join(',')}) VALUES (${placeholders})`;
    db.prepare(query).run(fields.map(f => (content as any)[f]));
}

// Seed Default Menu if empty
const menuCountResult = db.prepare("SELECT COUNT(*) as count FROM menu").get() as any;
if ((menuCountResult?.count || 0) === 0) {
    console.log("Seeding default menu items...");
    const navLinks = [
        { id: '1', label: 'Home', href: '/', parent_id: null, order_index: 0 },
        { id: '2', label: 'About Us', href: '#', parent_id: null, order_index: 1 },
        { id: '2-1', label: 'Our Founder & Patron', href: '/founder-patron', parent_id: '2', order_index: 0 },
        { id: '2-3', label: 'Our Patron', href: '/founder-patron#patron', parent_id: '2', order_index: 2 },
        { id: '2-4', label: 'School Governing Members', href: '/governing-members', parent_id: '2', order_index: 3 },
        { id: '2-5', label: 'School Staff', href: '/staff', parent_id: '2', order_index: 4 },
        { id: '2-6', label: 'Other Association & Committee', href: '#', parent_id: '2', order_index: 5 },
        { id: '2-6-1', label: 'Internal Complaints Committee (POSH)', href: '#', parent_id: '2-6', order_index: 0 },
        { id: '2-6-2', label: 'Internal Grievance Cell', href: '#', parent_id: '2-6', order_index: 1 },
        { id: '2-6-3', label: 'POCSO Committee', href: '#', parent_id: '2-6', order_index: 2 },
        { id: '2-6-4', label: 'School Level Fee Committee (SLFC)', href: '#', parent_id: '2-6', order_index: 3 },
        { id: '2-6-5', label: 'Parent Teacher Association (PTA)', href: '#', parent_id: '2-6', order_index: 4 },
        { id: '3', label: 'Admission', href: '#', parent_id: null, order_index: 2 },
        { id: '3-1', label: 'Admission Policy', href: '/admission-policy', parent_id: '3', order_index: 0 },
        { id: '3-2', label: 'Scholarship & Concessions', href: '/scholarships', parent_id: '3', order_index: 1 },
        { id: '3-3', label: 'Fees Structure', href: '/fees', parent_id: '3', order_index: 2 },
        { id: '3-4', label: 'Studybase Mobile App', href: '/studybase-app', parent_id: '3', order_index: 3 },
        { id: '4', label: 'Academics', href: '#', parent_id: null, order_index: 3 },
        { id: '4-1', label: 'Jesuit Education Objectives', href: '/jesuit-education-objectives', parent_id: '4', order_index: 0 },
        { id: '4-2', label: 'Examinations & Premotions', href: '#', parent_id: '4', order_index: 1 },
        { id: '4-3', label: 'Rules & Discipline', href: '#', parent_id: '4', order_index: 2 },
        { id: '5', label: 'Activities', href: '#', parent_id: null, order_index: 4 },
        { id: '5-1', label: 'Co-Curricular Activities', href: '/co-curricular', parent_id: '5', order_index: 0 },
        { id: '5-2', label: 'Fr. Batson Sports Complex', href: '/sports-complex', parent_id: '5', order_index: 1 },
        { id: '5-3', label: 'Xavier’s Alumni', href: '/alumni', parent_id: '5', order_index: 2 },
        { id: '5-4', label: 'Media Gallery', href: '/gallery', parent_id: '5', order_index: 3 },
        { id: '5-5', label: 'Event Calendar', href: '/events', parent_id: '5', order_index: 4 },
        { id: '5-6', label: 'Student Achievements', href: '/achievements', parent_id: '5', order_index: 5 },
        { id: '6', label: 'CBSE Corner', href: '#', parent_id: null, order_index: 5 },
        { id: '6-1', label: 'School Information', href: '/school-info', parent_id: '6', order_index: 0 },
        { id: '6-2', label: 'Fire safety', href: '#', parent_id: '6', order_index: 1 },
        { id: '7', label: 'For Parents', href: '#', parent_id: null, order_index: 6 },
        { id: '7-1', label: 'Obligations of Parents', href: '/parent-obligations', parent_id: '7', order_index: 0 },
        { id: '8', label: 'Career', href: '#', parent_id: null, order_index: 7 },
        { id: '8-1', label: 'Careers', href: '/careers', parent_id: '8', order_index: 0 },
        { id: '9', label: 'More', href: '#', parent_id: null, order_index: 8 },
        { id: '9-1', label: 'Notice Board', href: '/notice-board', parent_id: '9', order_index: 0 },
        { id: '9-3', label: 'Mandatory disclosure', href: '#', parent_id: '9', order_index: 1 },
        { id: '9-4', label: 'Transfer Certificate', href: '#', parent_id: '9', order_index: 2 },
    ];

    const insert = db.prepare("INSERT INTO menu (id, label, href, parent_id, order_index) VALUES (?, ?, ?, ?, ?)");
    const transaction = db.transaction((links) => {
        for (const l of links) insert.run(l.id, l.label, l.href, l.parent_id, l.order_index);
    });
    transaction(navLinks);
}

// Seed Carousel if empty
const carouselCountResult = db.prepare("SELECT COUNT(*) as count FROM carousel").get() as any;
if ((carouselCountResult?.count || 0) === 0) {
    console.log("Seeding default carousel items...");
    const defaultSlides = [
        { id: 'c1', url: 'https://lh3.googleusercontent.com/d/1C-_jZCL-OpkhhOV_R6oTGRfNxkhBIkHN=w1600', caption: 'Legacy of Excellence' },
        { id: 'c2', url: 'https://lh3.googleusercontent.com/d/1ZfP3k6bFiwdZdEe3CI_U6KhBkAEaybUs=w1600', caption: 'Modern Campus Mastery' },
        { id: 'c3', url: 'https://lh3.googleusercontent.com/d/187y5AfGgvXnofNL6h85uU1rpdfaWYDCH=w1600', caption: 'St. Xavier\'s Spirit' },
    ];
    const insert = db.prepare("INSERT INTO carousel (id, url, caption) VALUES (?, ?, ?)");
    const transaction = db.transaction((slides) => {
        for (const s of slides) insert.run(s.id, s.url, s.caption);
    });
    transaction(defaultSlides);
}

// General Seeding for missing tables
const tablesToSeed = ['notices', 'gallery', 'fees', 'links', 'events', 'achievements', 'studentHonors'];
tablesToSeed.forEach(table => {
    const countResult = db.prepare(`SELECT COUNT(*) as count FROM "${table}"`).get() as any;
    if ((countResult?.count || 0) === 0) {
        console.log(`Seeding default ${table} items...`);
        let defaultData: any[] = [];
        if (table === 'notices') {
            defaultData = [
                { id: '1', title: 'Summer Holiday Closure Notice', content: 'Dear parents, In view of the summer holidays (from 18-05-2024 to 30-06-2024) the school will be closed. Students will report to school on 01-07-2024 @ 07:30 a.m. Principal SXS, C-Scheme', date: 'May 18, 2024 10:52 AM', category: 'Circular' },
                { id: '2', title: 'Class Timetable 6 to 12 (2026_27)', content: '', date: 'March 30, 2026 5:50 PM', category: 'Circular' },
                { id: '3', title: 'Revised Provisional List of Std. XI (2026-27)', content: '', date: 'March 30, 2026 5:49 PM', category: 'Circular' },
            ];
        } else if (table === 'gallery') {
            defaultData = [
                { id: '1', url: 'https://picsum.photos/seed/x_facade/1200/800', caption: 'St. Xavier\'s Main Architecture' },
                { id: '2', url: 'https://picsum.photos/seed/x_prayer/1200/800', caption: 'The Morning Assembly Circle' },
                { id: '3', url: 'https://picsum.photos/seed/x_lab/1200/800', caption: 'Physics Research Wing' },
            ];
        } else if (table === 'fees') {
            defaultData = [
                // School Fee
                { id: 'f1', category: 'School Fee', particulars: 'School fee (std. I to VII)', amount: '95900', quarterly: '23975', remarks: '', order_index: 0 },
                { id: 'f2', category: 'School Fee', particulars: 'School fee (std. VIII)', amount: '87600', quarterly: '21900', remarks: '', order_index: 1 },
                { id: 'f3', category: 'School Fee', particulars: 'School fee (std. IX & X)', amount: '88000', quarterly: '22000', remarks: '', order_index: 2 },
                { id: 'f4', category: 'School Fee', particulars: 'School fee (std. XI & XII)', amount: '100400', quarterly: '25100', remarks: '', order_index: 3 },
                // Annual Fee
                { id: 'f5', category: 'Annual Fee', particulars: 'Annual fee (std. I to X)', amount: '8700', quarterly: '2175', remarks: 'Charged in 4 Quarters', order_index: 4 },
                { id: 'f6', category: 'Annual Fee', particulars: 'Annual fee (std. XI)', amount: '11800', quarterly: '2950', remarks: 'Charged in 4 Quarters', order_index: 5 },
                { id: 'f7', category: 'Annual Fee', particulars: 'Annual fee (std. XII)', amount: '13000', quarterly: '3250', remarks: 'Charged in 4 Quarters', order_index: 6 },
                // Admission Fee
                { id: 'f8', category: 'Admission Fee', particulars: 'Admission fee (std. I)', amount: '33200', quarterly: '0', remarks: 'Charged at the time of admission', order_index: 7 },
                { id: 'f9', category: 'Admission Fee', particulars: 'Admission fee (std. II to XII)', amount: '43500', quarterly: '0', remarks: 'Charged at the time of admission', order_index: 8 },
            ];
        } else if (table === 'links') {
            defaultData = [
                { id: '1', title: 'Admission Prospectus 2026-27', url: '#' },
                { id: '2', title: 'Student & Parent Portal', url: '#' },
            ];
        } else if (table === 'events') {
            defaultData = [
                { id: '1', title: 'Investiture Ceremony 2026', date: 'May 15, 2026', time: '09:00 AM', location: 'St. Ignatius Hall' },
                { id: '2', title: 'Summer Football Camp', date: 'June 01, 2026', time: '06:30 AM', location: 'Main School Grounds' },
            ];
        } else if (table === 'achievements') {
            defaultData = [
                { id: '1', title: 'National Science Fair Gold', year: '2026', description: 'Our senior robotics team secured the first position at the National Science Congress.' },
                { id: '2', title: 'Best School in Jaipur 2025', year: '2025', description: 'Ranked #1 for Holistic Development by Education World.' },
            ];
        } else if (table === 'studentHonors') {
            defaultData = [
                { id: '1', name: 'Rijul Jain', category: 'JEE Mains:- 90.44%', result: '90.44%', subtext: 'SCIENCE CLUB (JOINT SECRETARY), RAJYA PURASKAR AWARDEE (SCOUTS AND GUIDES)', image: 'https://picsum.photos/seed/student1/300/300', order_index: 0 },
                { id: '2', name: 'Ameyatman Roy', category: 'JEE Mains:- 90.27%', result: '90.27%', subtext: '90.27 PERCENTILE', image: 'https://picsum.photos/seed/student2/300/300', order_index: 1 },
                { id: '3', name: 'Aryan Sharma', category: 'JEE Mains:- 99.12%', result: '99.12%', subtext: 'ACADEMIC EXCELLENCE AWARD WINNER', image: 'https://picsum.photos/seed/student3/300/300', order_index: 2 },
            ];
        }

        if (defaultData.length > 0) {
            const fields = Object.keys(defaultData[0]);
            const placeholders = fields.map(() => '?').join(',');
            const insert = db.prepare(`INSERT INTO "${table}" (${fields.map(f => `"${f}"`).join(',')}) VALUES (${placeholders})`);
            const transaction = db.transaction((items) => {
                for (const item of items) insert.run(fields.map(f => item[f]));
            });
            transaction(defaultData);
        }
    }
});

// Ensure columns exist (handle migrations)
const addColumnIfMissing = (table: string, column: string, type: string) => {
  try {
    const info = db.pragma(`table_info("${table}")`) as any[];
    if (!info.some(col => col.name === column)) {
      console.log(`[MIGRATION] Adding column ${column} to ${table}...`);
      db.exec(`ALTER TABLE "${table}" ADD COLUMN "${column}" ${type}`);
    }
  } catch (err) {
    console.error(`[MIGRATION ERROR] ${table}.${column}:`, err);
  }
};

addColumnIfMissing('fees', 'category', 'TEXT');
addColumnIfMissing('fees', 'particulars', 'TEXT');
addColumnIfMissing('fees', 'amount', 'TEXT');
addColumnIfMissing('fees', 'remarks', 'TEXT');
addColumnIfMissing('fees', 'order_index', 'INTEGER');
addColumnIfMissing('fees', 'attachmentUrl', 'TEXT');
addColumnIfMissing('settings', 'currentSession', 'TEXT');

// Migration: Initialize currentSession if null
try {
  db.prepare("UPDATE settings SET currentSession = '2025-26' WHERE currentSession IS NULL").run();
} catch (err) {
  console.warn("[MIGRATION] currentSession initialization skipped:", err);
}

// Forced Data Sync for Fees (New Schema)
const syncFeesIfNeeded = () => {
    try {
        // Transfer Certificates Table
        db.exec(`
          CREATE TABLE IF NOT EXISTS transfer_certificates (
            id TEXT PRIMARY KEY,
            admission_number TEXT NOT NULL UNIQUE,
            dob TEXT NOT NULL,
            student_name TEXT NOT NULL,
            attachmentUrl TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);
        
        const tableInfo = db.pragma("table_info(fees)") as any[];
        const hasGrade = tableInfo.some(c => c.name === 'grade');
        const countRes = db.prepare("SELECT COUNT(*) as count FROM fees").get() as any;
        const count = countRes?.count || 0;

        if (hasGrade || count < 5) {
            console.log("[MIGRATION] Old schema detected or empty table. Wiping and reseeding fees...");
            if (hasGrade) {
                db.exec("DROP TABLE IF EXISTS fees");
                db.exec(`
                  CREATE TABLE fees (
                    id TEXT PRIMARY KEY,
                    category TEXT NOT NULL,
                    particulars TEXT NOT NULL,
                    amount TEXT NOT NULL,
                    quarterly TEXT NOT NULL,
                    remarks TEXT,
                    order_index INTEGER NOT NULL,
                    attachmentUrl TEXT
                  )
                `);
            } else {
                db.prepare("DELETE FROM fees").run();
            }

            const defaultFees = [
                { id: 'f1', category: 'School Fee', particulars: 'School fee (std. I to VII)', amount: '95900', quarterly: '23975', remarks: '', order_index: 0, attachmentUrl: 'https://xaviersjaipur.edu.in/wp-content/uploads/2024/03/Admission-Prospectus-2024-25.pdf' },
                { id: 'f2', category: 'School Fee', particulars: 'School fee (std. VIII)', amount: '87600', quarterly: '21900', remarks: '', order_index: 1, attachmentUrl: '' },
                { id: 'f3', category: 'School Fee', particulars: 'School fee (std. IX & X)', amount: '88000', quarterly: '22000', remarks: '', order_index: 2, attachmentUrl: '' },
                { id: 'f4', category: 'School Fee', particulars: 'School fee (std. XI & XII)', amount: '100400', quarterly: '25100', remarks: '', order_index: 3, attachmentUrl: '' },
                { id: 'f5', category: 'Annual Fee', particulars: 'Annual fee (std. I to X)', amount: '8700', quarterly: '2175', remarks: 'Charged in 4 Quarters', order_index: 4, attachmentUrl: '' },
                { id: 'f6', category: 'Annual Fee', particulars: 'Annual fee (std. XI)', amount: '11800', quarterly: '2950', remarks: 'Charged in 4 Quarters', order_index: 5, attachmentUrl: '' },
                { id: 'f7', category: 'Annual Fee', particulars: 'Annual fee (std. XII)', amount: '13000', quarterly: '3250', remarks: 'Charged in 4 Quarters', order_index: 6, attachmentUrl: '' },
                { id: 'f8', category: 'Admission Fee', particulars: 'Admission fee (std. I)', amount: '33200', quarterly: '0', remarks: 'Charged at the time of admission', order_index: 7, attachmentUrl: '' },
                { id: 'f9', category: 'Admission Fee', particulars: 'Admission fee (std. II to XII)', amount: '43500', quarterly: '0', remarks: 'Charged at the time of admission', order_index: 8, attachmentUrl: '' },
            ];
            const insert = db.prepare(`INSERT INTO fees (id, category, particulars, amount, quarterly, remarks, order_index, attachmentUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
            defaultFees.forEach(f => insert.run(f.id, f.category, f.particulars, f.amount, f.quarterly, f.remarks, f.order_index, f.attachmentUrl));
        }

        // Seed TC for testing if empty
        const tcCountRes = db.prepare("SELECT COUNT(*) as count FROM transfer_certificates").get() as any;
        if ((tcCountRes?.count || 0) === 0) {
            console.log("[MIGRATION] Seeding test Transfer Certificate...");
            db.prepare("INSERT INTO transfer_certificates (id, admission_number, dob, student_name, attachmentUrl) VALUES (?, ?, ?, ?, ?)")
              .run('test-tc-1', 'TC01', '2026-04-27', 'TEST STUDENT', 'https://xaviersjaipur.edu.in/wp-content/uploads/2024/03/Admission-Prospectus-2024-25.pdf');
        }
    } catch (err) {
        console.error("[MIGRATION ERROR] Fees sync failed:", err);
    }
};

syncFeesIfNeeded();

// Aggressive Menu Cleanup
const cleanMenu = () => {
    try {
        // Force all existing menu items to uppercase labels
        db.prepare("UPDATE menu SET label = UPPER(label)").run();
        
        // Remove "Other Association & Committee" from Admission (parent '3') if it exists
        db.prepare("DELETE FROM menu WHERE label LIKE 'OTHER ASSOCIATION%' AND parent_id = '3'").run();
        
        db.prepare("DELETE FROM menu WHERE label LIKE 'OTHER %' AND href LIKE '%school-info%'").run();
        
        // Update TC link if it exists
        db.prepare("UPDATE menu SET href = '/transfer-certificate' WHERE label = 'TRANSFER CERTIFICATE' OR label = 'Transfer Certificate'").run();

        // Forced re-alignment for Association Menu to About Us
        const associations = [
            { id: '2-6', label: 'OTHER ASSOCIATION & COMMITTEE', href: '#', parent_id: '2', order_index: 5 },
            { id: '2-6-1', label: 'INTERNAL COMPLAINTS COMMITTEE (POSH)', href: '#', parent_id: '2-6', order_index: 0 },
            { id: '2-6-2', label: 'INTERNAL GRIEVANCE CELL', href: '#', parent_id: '2-6', order_index: 1 },
            { id: '2-6-3', label: 'POCSO COMMITTEE', href: '#', parent_id: '2-6', order_index: 2 },
            { id: '2-6-4', label: 'SCHOOL LEVEL FEE COMMITTEE (SLFC)', href: '#', parent_id: '2-6', order_index: 3 },
            { id: '2-6-5', label: 'PARENT TEACHER ASSOCIATION (PTA)', href: '#', parent_id: '2-6', order_index: 4 },
        ];

        associations.forEach(item => {
            const exists = db.prepare("SELECT id FROM menu WHERE id = ?").get(item.id);
            if (!exists) {
                db.prepare("INSERT INTO menu (id, label, href, parent_id, order_index) VALUES (?, ?, ?, ?, ?)").run(item.id, item.label, item.href, item.parent_id, item.order_index);
            } else {
                db.prepare("UPDATE menu SET label = ?, href = ?, parent_id = ?, order_index = ? WHERE id = ?").run(item.label, item.href, item.parent_id, item.order_index, item.id);
            }
        });

        // Final De-dupe
        const items = db.prepare("SELECT * FROM menu").all() as any[];
        const seen = new Set();
        items.forEach(item => {
            const key = `${item.label}-${item.parent_id}`;
            if (seen.has(key)) {
                db.prepare("DELETE FROM menu WHERE id = ?").run(item.id);
            } else {
                seen.add(key);
            }
        });
    } catch (err) {
        console.error("[CLEANUP ERROR] Menu cleanup failed:", err);
    }
};
cleanMenu();
addColumnIfMissing('notices', 'attachmentUrl', 'TEXT');
addColumnIfMissing('links', 'attachmentUrl', 'TEXT');
addColumnIfMissing('events', 'attachmentUrl', 'TEXT');
addColumnIfMissing('achievements', 'attachmentUrl', 'TEXT');
addColumnIfMissing('settings', 'siteName', 'TEXT');
addColumnIfMissing('settings', 'siteLogo', 'TEXT');
addColumnIfMissing('settings', 'contactEmail', 'TEXT');
addColumnIfMissing('settings', 'contactPhone', 'TEXT');
addColumnIfMissing('settings', 'contactAddress', 'TEXT');
addColumnIfMissing('settings', 'feesPdfUrl', 'TEXT');
addColumnIfMissing('gallery', 'session', 'TEXT');

// Diagnostic: Check fees table columns
const columns = db.pragma('table_info(fees)');
console.log("[DIAG] FEES SCHEMA:", (columns as any[]).map((r: any) => r.name).join(', '));

app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'online', 
    timestamp: new Date().toISOString(),
    uploadDirExists: fs.existsSync(uploadDir)
  });
});

// Mandatory Staff Reseed to match user request
const targetStaff = [
    { id: '1', name: "FR. NELSON A. D'SILVA, SJ", role: 'MANAGER, TREASURER', bio: 'Appointed: 01-05-2021. Overseeing financial stewardship and institutional management.', image: 'https://picsum.photos/seed/nelson/400/400', type: 'Management' },
    { id: '2', name: 'FR. M. AROCKIAM, SJ', role: 'PRINCIPAL', bio: 'Appointed: 01-07-2018. Leading the academic vision and spiritual growth of the institution.', image: 'https://picsum.photos/seed/arockiam/400/400', type: 'Management' },
    { id: '3', name: 'FR. MADALAIMUTHU ANTHONIAPPAN, SJ ( Fr. BRITTO )', role: 'COORDINATOR ( MIDDLE SCHOOL )', bio: 'Appointed: 01-07-2024. Ensuring academic excellence and discipline in the middle school wing.', image: 'https://picsum.photos/seed/britto/400/400', type: 'Administration' },
    { id: '4', name: 'SR. RUTH MARIAM, SCJM', role: 'COORDINATOR ( JUNIOR SCHOOL )', bio: 'Appointed: 01-04-2025. Dedicated to the holistic primary education and foundational growth.', image: 'https://picsum.photos/seed/ruth/400/400', type: 'Administration' },
    { id: '5', name: 'MRS. KSHAMA SHARMA', role: 'COORDINATOR-ACADEMICS ( SENIOR SCHOOL )', bio: 'Appointed: 01-04-2002. Senior academic lead ensuring curriculum standards in senior secondary.', image: 'https://picsum.photos/seed/kshama/400/400', type: 'Administration' },
    { id: '6', name: 'MR. ALEX THOMAS', role: 'COORDINATOR-ACTIVITIES ( SENIOR SCHOOL )', bio: 'Appointed: 01-08-1996. Overseeing extracurricular engagement and senior school activities.', image: 'https://picsum.photos/seed/alex/400/400', type: 'Administration' },
    // PGT (7-25)
    { id: '7', name: 'ABHISHEK MATHUR', role: 'PGT', bio: 'Appointed: 01-07-2023. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '8', name: 'R. TRIVEDI', role: 'PGT', bio: 'Appointed: 01-07-1994. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '9', name: 'SHAJI THOMAS', role: 'PGT', bio: 'Appointed: 01-04-2003. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '10', name: 'DILIP SRIVASTAVA', role: 'PGT', bio: 'Appointed: 01-07-2007. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '11', name: 'GOPAL SHARMA', role: 'PGT', bio: 'Appointed: 01-07-2007. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '12', name: 'AJAY P. JOSE', role: 'PGT', bio: 'Appointed: 01-04-2009. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '13', name: 'NIMMI SAM', role: 'PGT', bio: 'Appointed: 06-07-2013. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '14', name: 'RAJENDRA JOSHI', role: 'PGT', bio: 'Appointed: 01-07-1990. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '15', name: 'SUJITHA KUMAR', role: 'PGT', bio: 'Appointed: 01-04-2006. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '16', name: 'VINEET BANSAL', role: 'PGT', bio: 'Appointed: 01-04-2015. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '17', name: 'NELEMA J. SOLOMON', role: 'PGT', bio: 'Appointed: 01-04-2016. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '18', name: 'NITIN ARORA', role: 'PGT', bio: 'Appointed: 01-04-2016. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '19', name: 'LORRAINE DAVIS', role: 'PGT', bio: 'Appointed: 01-04-2017. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '20', name: 'SHABANA AHMED', role: 'PGT', bio: 'Appointed: 01-04-2017. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '21', name: 'KIRAN PAREEK', role: 'PGT', bio: 'Appointed: 01-04-2018. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '22', name: 'RAJNI SINHA', role: 'PGT', bio: 'Appointed: 01-07-2019. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '23', name: 'DEEKSHA CHHABRA', role: 'PGT', bio: 'Appointed: 01-07-2020. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '24', name: 'SANGEETA JOSEPH', role: 'PGT', bio: 'Appointed: 01-07-2022. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '25', name: 'NEHA WHITNEY', role: 'PGT', bio: 'Appointed: 01-07-2025. Status: Contract. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    
    // TGT (26-63)
    { id: '26', name: 'M. CASTELINO', role: 'TGT', bio: 'Appointed: 01-07-1994. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '27', name: 'B. ACHARYA', role: 'TGT', bio: 'Appointed: 01-07-1997. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '28', name: 'ASHOK SINGH KACHHWAHA', role: 'TGT', bio: 'Appointed: 01-11-1999. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '29', name: 'PINKY VARGHESE', role: 'TGT', bio: 'Appointed: 01-07-2000. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '30', name: 'S. SRIVASTAVA', role: 'TGT', bio: 'Appointed: 01-07-2000. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '31', name: 'A. LAZER', role: 'TGT', bio: 'Appointed: 01-10-2000. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '32', name: 'B. SHARMA', role: 'TGT', bio: 'Appointed: 01-04-2001. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '33', name: 'KAMAYANI ATRE', role: 'TGT', bio: 'Appointed: 01-04-2001. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '34', name: 'S GAUTAM', role: 'TGT', bio: 'Appointed: 01-04-2002. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '35', name: 'SUMIT CHAUHAN', role: 'TGT', bio: 'Appointed: 01-04-2002. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '36', name: 'MAMTA BATRA', role: 'TGT', bio: 'Appointed: 01-07-2002. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '37', name: 'S. RATHORE', role: 'TGT', bio: 'Appointed: 01-04-2003. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '38', name: 'NAVRATAN AGARWAL', role: 'TGT', bio: 'Appointed: 01-04-2005. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '39', name: 'SAPNA SHARMA', role: 'TGT', bio: 'Appointed: 01-04-2006. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '40', name: 'ARADHANA BHATNAGAR', role: 'TGT', bio: 'Appointed: 01-04-2006. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '41', name: 'CHRISTINE UPASANA LOBO', role: 'TGT', bio: 'Appointed: 01-04-2007. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '42', name: 'GOVIND NARAYAN SHARMA', role: 'TGT', bio: 'Appointed: 01-07-2007. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '43', name: 'C.B. JOSE', role: 'TGT', bio: 'Appointed: 01-04-2008. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '44', name: 'SAROJ NAUTIYAL', role: 'TGT', bio: 'Appointed: 01-04-2008. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '45', name: 'MAMTA SHEKHAWAT', role: 'TGT', bio: 'Appointed: 01-04-2009. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '46', name: 'ANANT AKASH HENRY', role: 'TGT', bio: 'Appointed: 01-08-2010. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '47', name: 'POOJA SHERRY', role: 'TGT', bio: 'Appointed: 01-04-2011. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '48', name: 'JINU GEORGE', role: 'TGT', bio: 'Appointed: 01-04-2012. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '49', name: 'GOLDY BHARGAVA', role: 'TGT', bio: 'Appointed: 01-07-2012. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '50', name: 'OLIVE E MALAKI', role: 'TGT', bio: 'Appointed: 01-10-2014. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '51', name: 'SHRUTI PAREEK', role: 'TGT', bio: 'Appointed: 01-07-2014. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '52', name: 'NAMRATA SOMANI', role: 'TGT', bio: 'Appointed: 01-10-2014. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '53', name: 'JENNIFER BARNO', role: 'TGT', bio: 'Appointed: 01-04-2016. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '54', name: 'CHHAYA SINGH', role: 'TGT', bio: 'Appointed: 01-04-2017. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '55', name: 'JISS MARY GEORGE', role: 'TGT', bio: 'Appointed: 01-04-2017. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '56', name: 'AKHILA R. NAIR', role: 'TGT', bio: 'Appointed: 01-04-2017. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '57', name: 'SIJI JOSE', role: 'TGT', bio: 'Appointed: 02-07-2018. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '58', name: 'SOBIN CHERIAN', role: 'TGT', bio: 'Appointed: 01-07-2019. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '59', name: 'KHUSHBOO KHANGAROT', role: 'TGT', bio: 'Appointed: 01-07-2022. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '60', name: 'STEPHIE CAROLENE MENDONCA', role: 'TGT', bio: 'Appointed: 01-07-2022. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '61', name: 'BHUMIKA SHARMA', role: 'TGT', bio: 'Appointed: 01-12-2024. Status: Contract. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '62', name: 'DIVYA SWARUP', role: 'TGT', bio: 'Appointed: 01-07-2023. Status: Contract. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '63', name: 'K.B. ARUN', role: 'TGT', bio: 'Appointed: 01-07-2025. Status: Contract. Full Time Trained Faculty.', image: '', type: 'Faculty' },

    // PRT (64-102)
    { id: '64', name: 'N. CHOPRA', role: 'PRT', bio: 'Appointed: 01-07-1993. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '65', name: 'LALITA PAREEK', role: 'PRT', bio: 'Appointed: 01-07-1994. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '66', name: 'M. ARORA', role: 'PRT', bio: 'Appointed: 01-07-1997. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '67', name: 'PINKY GROVER', role: 'PRT', bio: 'Appointed: 01-07-2001. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '68', name: 'MALVEA TRIBENI', role: 'PRT', bio: 'Appointed: 01-04-2008. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '69', name: 'NEETU GAGAN SINGH', role: 'PRT', bio: 'Appointed: 01-04-2008. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '70', name: 'VARSHA JAIN', role: 'PRT', bio: 'Appointed: 01-04-2010. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '71', name: 'ELIZABETH THOMAS', role: 'PRT', bio: 'Appointed: 01-04-2010. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '72', name: 'SONAL GUPTA', role: 'PRT', bio: 'Appointed: 01-04-2010. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '73', name: 'SAPNA SHARMA', role: 'PRT', bio: 'Appointed: 01-08-2010. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '74', name: 'VINITA YADAV', role: 'PRT', bio: 'Appointed: 01-08-2010. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '75', name: 'AMALA JOHN', role: 'PRT', bio: 'Appointed: 01-04-2011. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '76', name: 'ASHA JOHN', role: 'PRT', bio: 'Appointed: 01-04-2011. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '77', name: 'VIBHA OJHA', role: 'PRT', bio: 'Appointed: 01-04-2011. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '78', name: 'SANKRANTI BHARDWAJ', role: 'PRT', bio: 'Appointed: 01-04-2012. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '79', name: 'NIDHI JAIN', role: 'PRT', bio: 'Appointed: 01-04-2012. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '80', name: 'SHAISTA REHMAN', role: 'PRT', bio: 'Appointed: 01-04-2012. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '81', name: 'RICHA KAPOOR', role: 'PRT', bio: 'Appointed: 01-04-2012. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '82', name: 'SINDHU VARMA', role: 'PRT', bio: 'Appointed: 01-04-2012. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '83', name: 'MEGHA MANAN MUKUL', role: 'PRT', bio: 'Appointed: 01-04-2012. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '84', name: 'LIJI JAIN', role: 'PRT', bio: 'Appointed: 01-04-2013. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '85', name: 'SUCHITA JACOB', role: 'PRT', bio: 'Appointed: 01-04-2013. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '86', name: 'YOGITA MOUDGIL', role: 'PRT', bio: 'Appointed: 01-07-2013. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '87', name: 'ARPITA BHARGAVA', role: 'PRT', bio: 'Appointed: 01-04-2014. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '88', name: 'JINSY PHILIP', role: 'PRT', bio: 'Appointed: 01-04-2014. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '89', name: 'NISHA BHATI', role: 'PRT', bio: 'Appointed: 01-10-2014. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '90', name: 'RUPA SHUKLA', role: 'PRT', bio: 'Appointed: 01-07-2014. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '91', name: 'SEEMA SHARMA', role: 'PRT', bio: 'Appointed: 01-11-2013. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '92', name: 'A B PATHAK', role: 'PRT', bio: 'Appointed: 01-04-2014. Status: Contract (Ad Hoc). Trained Faculty.', image: '', type: 'Faculty' },
    { id: '93', name: 'SHIKHA SRIVASTAVA', role: 'PRT', bio: 'Appointed: 01-04-2015. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '94', name: 'SR. LISSY KURIAN, SCJM', role: 'PRT', bio: 'Appointed: 01-07-2025. Status: Confirmed (Ad Hoc). Trained Faculty.', image: '', type: 'Faculty' },
    { id: '95', name: 'MANISHA DIXIT', role: 'PRT', bio: 'Appointed: 01-08-2017. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '96', name: 'BLOSSOM BLISS FERNADES', role: 'PRT', bio: 'Appointed: 01-07-2022. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '97', name: 'SHAZIA IRAM', role: 'PRT', bio: 'Appointed: 01-07-2022. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '98', name: 'NANCY MANSINGH', role: 'PRT', bio: 'Appointed: 01-07-2023. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '99', name: 'MAGDELENE LOBO', role: 'PRT', bio: 'Appointed: 01-07-2023. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '100', name: 'RUCHIKA SINGHAL', role: 'PRT', bio: 'Appointed: 01-07-2024. Status: Probation. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '101', name: 'VINITA SINGH', role: 'PRT', bio: 'Appointed: 01-07-2024. Status: Contract. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '102', name: 'PRAHLAD SINGH', role: 'PRT', bio: 'Appointed: 01-07-2025. Status: Contract. Full Time Trained Faculty.', image: '', type: 'Faculty' },

    // Administrative Staff (103-111)
    { id: '103', name: 'S.G. MATHEW', role: 'OFFICE ASSISTANT', bio: 'Appointed: 01-04-2001. Status: Confirmed. Full Time Trained staff.', image: '', type: 'Administration' },
    { id: '104', name: 'BINU JOHN THOMAS', role: 'ACCOUNTANT', bio: 'Appointed: 01-07-2001. Status: Confirmed. Full Time Trained staff.', image: '', type: 'Administration' },
    { id: '105', name: 'PRATAP LAKRA', role: 'LIBRARIAN', bio: 'Appointed: 01-09-1997. Status: Confirmed. Full Time Trained staff.', image: '', type: 'Administration' },
    { id: '106', name: 'KURIAKOSE P. PAULOSE', role: 'CHEMISTRY LAB ASST.', bio: 'Appointed: 01-04-2005. Status: Confirmed. Full Time Trained staff.', image: '', type: 'Administration' },
    { id: '107', name: 'BETCY AJI', role: 'OFFICE ASSISTANT', bio: 'Appointed: 15-09-2010. Status: Confirmed. Full Time Trained staff.', image: '', type: 'Administration' },
    { id: '108', name: 'BISHNU POKHREL', role: 'COMPUTER LAB ASST.', bio: 'Appointed: 01-04-2011. Status: Confirmed. Full Time Trained staff.', image: '', type: 'Administration' },
    { id: '109', name: 'NELSON STANLEY THEODORE', role: 'PA TO PRINCIPAL', bio: 'Appointed: 07-01-2015. Status: Confirmed. Full Time Trained staff.', image: '', type: 'Administration' },
    { id: '110', name: 'NIKHIL ABRAHAM GEORGE', role: 'ACC. ASST', bio: 'Appointed: 03-07-2017. Status: Confirmed. Full Time Trained staff.', image: '', type: 'Administration' },
    { id: '111', name: 'RAVINDRA SHARMA', role: 'BIO LAB ASST.', bio: 'Appointed: 01-09-1994. Status: Confirmed. Full Time Trained staff.', image: '', type: 'Administration' }
  ];

  const staffCountResult = db.prepare("SELECT COUNT(*) as count FROM staff").get() as any;
  const staffCount = staffCountResult?.count || 0;

  if (staffCount < targetStaff.length) {
    console.log(`Updating staff table from ${staffCount} to ${targetStaff.length} records...`);
    const deleteBtn = db.prepare("DELETE FROM staff");
    const insert = db.prepare("INSERT INTO staff (id, name, role, bio, image, type) VALUES (?, ?, ?, ?, ?, ?)");

    const transaction = db.transaction((staff) => {
      deleteBtn.run();
      for (const s of staff) insert.run(s.id, s.name, s.role, s.bio, s.image, s.type);
    });
    
    transaction(targetStaff);
  }

// API Routes
app.get('/api/data', (req, res) => {
  try {
    const data: any = {};
    const tables = ['gallery', 'notices', 'staff', 'fees', 'links', 'events', 'achievements', 'menu', 'carousel', 'studentHonors', 'faqs', 'messages', 'content', 'popups'];

    tables.forEach(table => {
      let rows = db.prepare(`SELECT * FROM "${table}"`).all();
      if (table === 'popups') {
        rows = (rows as any[]).map(r => ({ ...r, isActive: Boolean(r.isActive) }));
      }
      data[table] = rows;
    });

    const settings = db.prepare(`SELECT * FROM settings WHERE id = 'global'`).get() as any;
    if (settings) {
      data.settings = {
        ...settings,
        applyNowEnabled: Boolean(settings.applyNowEnabled)
      };
    }

    res.json(data);
  } catch (err: any) {
    console.error(`Fetch error:`, err);
    res.status(500).json({ error: err.message });
  }
});

const SCHEMA: Record<string, string[]> = {
  notices: ['id', 'title', 'content', 'date', 'category', 'link', 'attachmentUrl'],
  staff: ['id', 'name', 'role', 'bio', 'image', 'type', 'attachmentUrl'],
  gallery: ['id', 'url', 'caption', 'session', 'attachmentUrl'],
  carousel: ['id', 'url', 'caption', 'session', 'attachmentUrl'],
  fees: ['id', 'category', 'particulars', 'amount', 'quarterly', 'remarks', 'order_index', 'attachmentUrl'],
  links: ['id', 'title', 'url', 'isPriority', 'icon', 'attachmentUrl'],
  events: ['id', 'title', 'date', 'time', 'location', 'attachmentUrl'],
  achievements: ['id', 'title', 'year', 'description', 'attachmentUrl'],
  transfer_certificates: ['id', 'admission_number', 'dob', 'student_name', 'attachmentUrl'],
  studentHonors: ['id', 'name', 'category', 'result', 'subtext', 'image', 'order_index', 'attachmentUrl'],
  menu: ['id', 'label', 'href', 'parent_id', 'order_index', 'attachmentUrl'],
  faqs: ['id', 'question', 'answer', 'category', 'order_index', 'attachmentUrl'],
  messages: ['id', 'name', 'email', 'subject', 'message', 'timestamp', 'status', 'attachmentUrl'],
  popups: ['id', 'title', 'type', 'content', 'buttonText', 'buttonLink', 'isActive', 'order_index', 'attachmentUrl'],
  settings: ['id', 'applyNowEnabled', 'applyNowUrl', 'applyNowLabel', 'siteName', 'siteLogo', 'contactEmail', 'contactPhone', 'contactAddress', 'currentSession', 'feesPdfUrl', 'popupMessage', 'popupEnabled'],
  content: ['id', 'key', 'value']
};

app.post('/api/save', async (req, res) => {
  try {
    const { table, item } = req.body;
    const whitelist = Object.keys(SCHEMA);
    
    if (!whitelist.includes(table)) {
      return res.status(400).json({ error: 'Invalid table name' });
    }

    const allowedFields = SCHEMA[table];
    const fields = Object.keys(item).filter(k => allowedFields.includes(k));
    
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to save' });
    }

    console.log(`[SYNC INITIATED] Table: ${table}, ID: ${item.id}`);

    // 1. Sync to Supabase if client is ready
    if (supabaseServer) {
        try {
            const sanitizedForSupabase = { ...item };
            // Ensure booleans for PG
            if (table === 'popups' && 'isActive' in sanitizedForSupabase) sanitizedForSupabase.isActive = !!sanitizedForSupabase.isActive;
            if (table === 'settings' && 'applyNowEnabled' in sanitizedForSupabase) sanitizedForSupabase.applyNowEnabled = !!sanitizedForSupabase.applyNowEnabled;
            if (table === 'settings' && 'popupEnabled' in sanitizedForSupabase) sanitizedForSupabase.popupEnabled = !!sanitizedForSupabase.popupEnabled;

            if (table === 'content') {
              const { error } = await supabaseServer.from('content').upsert({ id: item.id || 'global', key: item.key, value: item.value });
              if (error) console.error('[SUPABASE SYNC ERROR] Content:', error.message);
            } else {
              const { error } = await supabaseServer.from(table).upsert(sanitizedForSupabase);
              if (error) console.error(`[SUPABASE SYNC ERROR] ${table}:`, error.message);
            }
        } catch (e: any) {
            console.warn('[SUPABASE SYNC EXCEPTION]', e.message);
        }
    }

    // 2. Local SQLite Sync
    const placeholders = fields.map(() => '?').join(',');
    const values = fields.map(f => {
      const val = item[f];
      if (typeof val === 'boolean') return val ? 1 : 0;
      return val;
    });

    const query = `INSERT OR REPLACE INTO "${table}" (${fields.map(f => `"${f}"`).join(',')}) VALUES (${placeholders})`;
    db.prepare(query).run(values);
    
    console.log(`[SQL SUCCESS] Local ${table} item persisted.`);
    res.json({ success: true });
  } catch (err: any) {
    console.error(`[SQL ERROR] SAVE FAILED:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/delete', async (req, res) => {
  try {
    const { table, id, ids } = req.body;
    const whitelist = Object.keys(SCHEMA);
    
    if (!whitelist.includes(table)) {
      return res.status(400).json({ error: `Invalid table: ${table}` });
    }

    console.log(`[DELETE INITIATED] Table: ${table}, ID: ${id || 'bulk'}`);

    // 1. Sync Delete to Supabase
    if (supabaseServer) {
        try {
            if (ids && Array.isArray(ids)) {
                const { error } = await supabaseServer.from(table).delete().in('id', ids);
                if (error) console.error(`[SUPABASE DELETE ERROR] ${table} bulk:`, error.message);
            } else if (id) {
                const { error } = await supabaseServer.from(table).delete().eq('id', id);
                if (error) console.error(`[SUPABASE DELETE ERROR] ${table} single:`, error.message);
            }
        } catch (e: any) {
            console.warn('[SUPABASE DELETE EXCEPTION]', e.message);
        }
    }

    // 2. Local SQLite Delete
    let result;
    if (ids && Array.isArray(ids)) {
      if (ids.length === 0) return res.json({ success: true, changes: 0 });
      const placeholders = ids.map(() => '?').join(',');
      const stmt = db.prepare(`DELETE FROM "${table}" WHERE id IN (${placeholders})`);
      result = stmt.run(ids);
    } else {
      const stmt = db.prepare(`DELETE FROM "${table}" WHERE id = ?`);
      result = stmt.run(id);
    }
    
    console.log(`[SQL DELETE SUCCESS] Local ${table} removed ${result.changes} rows.`);
    res.json({ success: true, changes: result.changes });
  } catch (err: any) {
    console.error(`[SQL DELETE ERROR]`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// API Endpoints for Transfer Certificates
app.get('/api/tc', (req, res) => {
  try {
    const list = db.prepare("SELECT * FROM transfer_certificates ORDER BY created_at DESC").all();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
});

app.post('/api/tc/search', express.json(), (req, res) => {
  const { admissionNumber, dob } = req.body;
  console.log(`[TC SEARCH] Query: ${admissionNumber}, DOB: ${dob}`);
  try {
    const tc = db.prepare("SELECT * FROM transfer_certificates WHERE admission_number = ? AND dob = ?").get(admissionNumber, dob) as any;
    if (tc) {
      console.log(`[TC SEARCH] Match found for ${admissionNumber}`);
      res.json(tc);
    } else {
      console.warn(`[TC SEARCH] No match for ${admissionNumber} with DOB ${dob}`);
      res.status(404).json({ error: 'Certificate not found. Please verify details.' });
    }
  } catch (err: any) {
    console.error(`[TC SEARCH ERROR]`, err.message);
    res.status(500).json({ error: 'Search failed' });
  }
});

app.post('/api/tc', express.json(), (req, res) => {
  const { admission_number, dob, student_name, attachmentUrl } = req.body;
  const id = Math.random().toString(36).substr(2, 9);
  try {
    db.prepare("INSERT INTO transfer_certificates (id, admission_number, dob, student_name, attachmentUrl) VALUES (?, ?, ?, ?, ?)")
      .run(id, admission_number, dob, student_name, attachmentUrl);
    res.json({ id, admission_number, dob, student_name, attachmentUrl });
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload certificate' });
  }
});

app.delete('/api/tc/:id', (req, res) => {
  try {
    db.prepare("DELETE FROM transfer_certificates WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

// Explicit API 404 handler to prevent SPA fallback for missing API routes
app.all('/api/*', (req, res) => {
  console.warn(`[API 404] ${req.method} ${req.url}`);
  res.status(404).json({ error: `API route not found: ${req.method} ${req.url}` });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(`[SERVER ERROR]`, err);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
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
    const distPath = path.join(process.cwd(), 'dist');
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
