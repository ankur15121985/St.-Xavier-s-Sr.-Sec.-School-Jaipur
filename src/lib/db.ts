import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

// Global cache to prevent multiple connections in Next.js HMR development mode
let dbInstance: Database.Database | null = null;

let serverDataCache: any = null;
let serverDataCacheExpiresAt: number = 0;
const CACHE_TTL_MS = 86400000; // Cache for 24 hours (hyper optimized with automatic mutation cache bust)

export function clearServerDataCache(): void {
  console.log('[CACHE] Clearing server data cache (mutation transpired).');
  serverDataCache = null;
  serverDataCacheExpiresAt = 0;
}

export function handleDatabaseError(err: any): void {
  if (err && err.message && err.message.toLowerCase().includes('malformed')) {
    console.error("[DB] Malformed database error detected. Unlinking and rebuilding...", err.message);
    if (dbInstance) {
      try {
        dbInstance.close();
      } catch (e) {}
      dbInstance = null;
    }
    const fs = require('fs');
    const primaryPath = '/tmp/database.sqlite';
    const fallbackPath = path.join(process.cwd(), 'database.sqlite');
    try {
      if (fs.existsSync(primaryPath)) {
        fs.unlinkSync(primaryPath);
        console.log("[DB] Successfully deleted malformed sqlite file in /tmp.");
      }
    } catch (e) {}
    try {
      if (fs.existsSync(fallbackPath)) {
        fs.unlinkSync(fallbackPath);
        console.log("[DB] Successfully deleted malformed sqlite file in workspace.");
      }
    } catch (e) {}
  }
}

export function getDatabase(): Database.Database {
  if (dbInstance) {
    try {
      dbInstance.prepare("SELECT 1").get();
      return dbInstance;
    } catch (err: any) {
      if (err.message && err.message.toLowerCase().includes('malformed')) {
        handleDatabaseError(err);
      } else {
        // Safe reset if the connection had a non-malformed issue
        try { dbInstance.close(); } catch (e) {}
        dbInstance = null;
      }
    }
  }

  // Choose /tmp path as the primary target for production compatibility with serverless environments
  let dbPath = '/tmp/database.sqlite';
  const fs = require('fs');
  const localOrigPath = path.join(process.cwd(), 'database.sqlite');
  
  // Create /tmp folder if it does not exist
  try {
    const tmpDir = path.dirname(dbPath);
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
  } catch (err) {}

  // Migrate existing data from process.cwd() database to /tmp if not already done
  try {
    if (fs.existsSync(localOrigPath)) {
      if (!fs.existsSync(dbPath)) {
        try {
          fs.copyFileSync(localOrigPath, dbPath);
          console.log("[DB] Database template copied from workspace to /tmp for writable state.");
        } catch (copyErr: any) {
          console.warn("[DB] Failed to copy database template from workspace to /tmp:", copyErr.message);
        }
      }
    }
  } catch (e) {}

  let useFallback = false;

  try {
    const db = new Database(dbPath, { timeout: 15000 });
    // Use TRUNCATE journal mode and NORMAL synchronicity for fast, robust execution without memory-mapped WAL/.shm files
    try {
      db.pragma('journal_mode = TRUNCATE');
      db.pragma('synchronous = NORMAL');
    } catch (e) {}

    // Verify connection works perfectly
    db.prepare("SELECT 1").get();
    dbInstance = db;
  } catch (err: any) {
    if (err.message && err.message.toLowerCase().includes('malformed')) {
      console.error("[DB] SQLite database file is malformed. Deleting and self-healing...", err.message);
      try {
        if (fs.existsSync(dbPath)) {
          fs.unlinkSync(dbPath);
        }
      } catch (unlinkErr) {}
      
      try {
        const db = new Database(dbPath, { timeout: 15000 });
        try {
          db.pragma('journal_mode = TRUNCATE');
          db.pragma('synchronous = NORMAL');
        } catch (e) {}
        dbInstance = db;
      } catch (recreateErr: any) {
        useFallback = true;
      }
    } else {
      console.error("[DB] Primary DB path /tmp failed, setting flag to use workspace fallback:", err.message);
      useFallback = true;
    }
  }

  if (useFallback) {
    console.log("[DB] Falling back to process.cwd() database.sqlite path");
    dbPath = localOrigPath;
    try {
      const db = new Database(dbPath, { timeout: 15000 });
      try {
        db.pragma('journal_mode = TRUNCATE');
        db.pragma('synchronous = NORMAL');
      } catch (e) {}
      db.prepare("SELECT 1").get();
      dbInstance = db;
    } catch (fallbackErr: any) {
      console.error("[DB] Critical: Fallback SQLite also failed:", fallbackErr.message);
      throw fallbackErr;
    }
  }

  const db = dbInstance!;

  // 1. Initial table structures
  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT,
      last_login TEXT
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS site_stats (
      id TEXT PRIMARY KEY,
      visitor_count INTEGER DEFAULT 0
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS visitor_ips (
      ip TEXT PRIMARY KEY,
      visited_at TEXT
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS site_settings (
      id TEXT PRIMARY KEY,
      applyNowEnabled INTEGER DEFAULT 1,
      applyNowUrl TEXT,
      applyNowLabel TEXT,
      siteName TEXT,
      siteLogo TEXT,
      contactEmail TEXT,
      contactPhone TEXT,
      contactAddress TEXT,
      currentSession TEXT,
      showCarousel INTEGER DEFAULT 1,
      showMarquee INTEGER DEFAULT 1,
      showAbout INTEGER DEFAULT 1,
      showFeature INTEGER DEFAULT 1,
      showVision INTEGER DEFAULT 1,
      showInsights INTEGER DEFAULT 1,
      showPrincipalMessage INTEGER DEFAULT 1,
      showDistinction INTEGER DEFAULT 1,
      showGallery INTEGER DEFAULT 1,
      showLeadership INTEGER DEFAULT 1,
      showHonors INTEGER DEFAULT 1,
      feesPdfUrl TEXT,
      googleSearchConsoleKey TEXT DEFAULT '',
      bingWebmasterKey TEXT DEFAULT '',
      indexNowKey TEXT DEFAULT '',
      ogTitle TEXT DEFAULT '',
      ogDescription TEXT DEFAULT '',
      ogImage TEXT DEFAULT '',
      showVirtualCampus INTEGER DEFAULT 1,
      careerFormEnabled INTEGER DEFAULT 1
    )
  `);

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
      type TEXT NOT NULL,
      is_enabled INTEGER DEFAULT 1
    )
  `);

  try {
    db.prepare("ALTER TABLE staff ADD COLUMN is_enabled INTEGER DEFAULT 1").run();
  } catch (e) {}

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
      attachmentUrl TEXT,
      is_enabled INTEGER DEFAULT 1
    )
  `);

  try {
    db.prepare("ALTER TABLE menu ADD COLUMN is_enabled INTEGER DEFAULT 1").run();
  } catch (e) {}

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
      caption TEXT NOT NULL,
      session TEXT,
      attachmentUrl TEXT
    )
  `);

  try {
    db.prepare("ALTER TABLE carousel ADD COLUMN session TEXT").run();
  } catch (e) {}
  try {
    db.prepare("ALTER TABLE carousel ADD COLUMN attachmentUrl TEXT").run();
  } catch (e) {}

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
      header TEXT,
      type TEXT NOT NULL,
      content TEXT NOT NULL,
      buttonText TEXT,
      buttonLink TEXT,
      isActive INTEGER NOT NULL,
      order_index INTEGER NOT NULL
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS digital_campus (
      id TEXT PRIMARY KEY,
      title TEXT,
      is_enabled INTEGER DEFAULT 1,
      model_url TEXT
    )
  `);

  const legacyTables = ['former_principals', 'former_rectors', 'former_managers'];
  legacyTables.forEach(table => {
    db.exec(`
      CREATE TABLE IF NOT EXISTS "${table}" (
        id TEXT PRIMARY KEY,
        name TEXT,
        tenure TEXT,
        image TEXT,
        order_index INTEGER
      )
    `);
  });

  db.exec(`
    CREATE TABLE IF NOT EXISTS former_student_leaders (
      id TEXT PRIMARY KEY,
      name TEXT,
      role TEXT,
      academic_year TEXT,
      image TEXT,
      order_index INTEGER
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS streamwise_toppers (
      id TEXT PRIMARY KEY,
      name TEXT,
      stream TEXT,
      percentage TEXT,
      academic_year TEXT,
      image TEXT,
      order_index INTEGER
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS xavierite_of_the_year (
      id TEXT PRIMARY KEY,
      name TEXT,
      academic_year TEXT,
      citation TEXT,
      image TEXT,
      order_index INTEGER
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS marquee (
      id TEXT PRIMARY KEY,
      text TEXT NOT NULL,
      link TEXT,
      attachmentUrl TEXT,
      isActive INTEGER NOT NULL,
      order_index INTEGER NOT NULL
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS useful_links (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      url TEXT,
      isPriority INTEGER DEFAULT 0,
      icon TEXT,
      attachmentUrl TEXT
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS logs (
      id TEXT PRIMARY KEY,
      "user" TEXT NOT NULL,
      action TEXT NOT NULL,
      details TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
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
      currentSession TEXT,
      popupEnabled INTEGER DEFAULT 1,
      popupMessage TEXT,
      feesPdfUrl TEXT,
      flagImage TEXT,
      flagEnabled INTEGER DEFAULT 1,
      aboutTitle TEXT,
      aboutContent TEXT,
      historyTitle TEXT,
      historyContent TEXT,
      showCarousel INTEGER DEFAULT 1,
      showMarquee INTEGER DEFAULT 1,
      showAbout INTEGER DEFAULT 1,
      showFeature INTEGER DEFAULT 1,
      showVision INTEGER DEFAULT 1,
      showInsights INTEGER DEFAULT 1,
      showPrincipalMessage INTEGER DEFAULT 1,
      showDistinction INTEGER DEFAULT 1,
      showVirtualCampus INTEGER DEFAULT 1,
      showGallery INTEGER DEFAULT 1,
      showLeadership INTEGER DEFAULT 1,
      showHonors INTEGER DEFAULT 1,
      faviconUrl TEXT DEFAULT 'https://xaviersjaipur.edu.in/wp-content/uploads/2023/12/SchoolLogoTest.png',
      googleSearchConsoleKey TEXT DEFAULT '',
      bingWebmasterKey TEXT DEFAULT '',
      indexNowKey TEXT DEFAULT '',
      ogTitle TEXT DEFAULT '',
      ogDescription TEXT DEFAULT '',
      ogImage TEXT DEFAULT '',
      careerFormEnabled INTEGER DEFAULT 1
    )
  `);

  // Migration: Ensure new columns exist in settings and site_settings
  const addColumn = (table: string, column: string, type: string) => {
    try {
      db.exec(`ALTER TABLE "${table}" ADD COLUMN "${column}" ${type}`);
    } catch (e) {
      // Column likely already exists
    }
  };

  const newToggleColumns = [
    'showCarousel', 'showMarquee', 'showAbout', 'showFeature', 'showVision', 
    'showInsights', 'showPrincipalMessage', 'showDistinction', 'showVirtualCampus', 
    'showGallery', 'showLeadership', 'showHonors', 'careerFormEnabled', 'flagEnabled', 'popupEnabled'
  ];

  newToggleColumns.forEach(col => {
    addColumn('settings', col, 'INTEGER DEFAULT 1');
    addColumn('site_settings', col, 'INTEGER DEFAULT 1');
  });
  
  addColumn('settings', 'googleSearchConsoleKey', "TEXT DEFAULT ''");
  addColumn('settings', 'bingWebmasterKey', "TEXT DEFAULT ''");
  addColumn('settings', 'indexNowKey', "TEXT DEFAULT ''");
  addColumn('settings', 'ogTitle', "TEXT DEFAULT ''");
  addColumn('settings', 'ogDescription', "TEXT DEFAULT ''");
  addColumn('settings', 'ogImage', "TEXT DEFAULT ''");
  
  addColumn('site_settings', 'googleSearchConsoleKey', "TEXT DEFAULT ''");
  addColumn('site_settings', 'bingWebmasterKey', "TEXT DEFAULT ''");
  addColumn('site_settings', 'indexNowKey', "TEXT DEFAULT ''");
  addColumn('site_settings', 'ogTitle', "TEXT DEFAULT ''");
  addColumn('site_settings', 'ogDescription', "TEXT DEFAULT ''");
  addColumn('site_settings', 'ogImage', "TEXT DEFAULT ''");

  db.exec(`
    CREATE TABLE IF NOT EXISTS school_info (
      id TEXT PRIMARY KEY,
      title TEXT,
      heading TEXT,
      content TEXT,
      order_index INTEGER,
      attachmentUrl TEXT
    )
  `);

  const pageTables = ['activities', 'alumni', 'parent_obligations', 'careers', 'mandatory_disclosures', 'contact_content', 'scholarships', 'fire_safety', 'custom_content'];
  pageTables.forEach(table => {
    db.exec(`
      CREATE TABLE IF NOT EXISTS "${table}" (
        id TEXT PRIMARY KEY,
        title TEXT,
        heading TEXT,
        content TEXT,
        order_index INTEGER,
        attachmentUrl TEXT,
        image_url TEXT,
        is_enabled INTEGER DEFAULT 1
      )
    `);
  });

  db.exec(`
    CREATE TABLE IF NOT EXISTS co_curricular_activities (
      id TEXT PRIMARY KEY,
      title TEXT,
      heading TEXT,
      content TEXT,
      display_type TEXT DEFAULT 'tile',
      category TEXT DEFAULT 'General',
      order_index INTEGER DEFAULT 0,
      attachmentUrl TEXT,
      image_url TEXT,
      is_enabled INTEGER DEFAULT 1
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS former_leaders (
      id TEXT PRIMARY KEY,
      name TEXT,
      tenure TEXT,
      image TEXT,
      order_index INTEGER,
      type TEXT
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS career_applications (
      id TEXT PRIMARY KEY,
      application_no TEXT,
      category TEXT,
      full_name TEXT,
      parent_spouse_name TEXT,
      mobile_number TEXT,
      email TEXT,
      gender TEXT,
      dob TEXT,
      aadhar_number TEXT,
      address TEXT,
      photo_url TEXT,
      user_ip TEXT,
      declaration_accepted INTEGER,
      major_subject TEXT,
      minor_subject_1 TEXT,
      minor_subject_2 TEXT,
      salary_expected TEXT,
      tet_details TEXT,
      interests TEXT,
      responsibilities_handled TEXT,
      statement_of_purpose TEXT,
      other_experience TEXT,
      education_qualifications TEXT,
      teaching_experience TEXT,
      achievements TEXT,
      teacher_category TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      status TEXT
    )
  `);

  pageTables.forEach(table => {
    try {
      db.prepare(`ALTER TABLE "${table}" ADD COLUMN is_enabled INTEGER DEFAULT 1`).run();
    } catch (e) {}
  });

  try {
    db.prepare(`ALTER TABLE mandatory_disclosures ADD COLUMN category TEXT`).run();
  } catch (e) {}

  db.exec(`
    CREATE TABLE IF NOT EXISTS jesuit_page_content (
       id TEXT PRIMARY KEY,
       objectives_html TEXT,
       examinations_html TEXT,
       promotions_html TEXT,
       discipline_html TEXT,
       updated_at TEXT
    )
  `);

  // Migrations for settings schema
  try { db.prepare("ALTER TABLE settings ADD COLUMN currentSession TEXT").run(); } catch (e) {}
  try { db.prepare("ALTER TABLE settings ADD COLUMN popupEnabled INTEGER DEFAULT 1").run(); } catch (e) {}
  try { db.prepare("ALTER TABLE settings ADD COLUMN popupMessage TEXT").run(); } catch (e) {}
  try { db.prepare("ALTER TABLE settings ADD COLUMN feesPdfUrl TEXT").run(); } catch (e) {}
  try { db.prepare("ALTER TABLE settings ADD COLUMN flagImage TEXT").run(); } catch (e) {}
  try { db.prepare("ALTER TABLE settings ADD COLUMN flagEnabled INTEGER DEFAULT 1").run(); } catch (e) {}
  try { db.prepare("ALTER TABLE settings ADD COLUMN aboutTitle TEXT").run(); } catch (e) {}
  try { db.prepare("ALTER TABLE settings ADD COLUMN aboutContent TEXT").run(); } catch (e) {}
  try { db.prepare("ALTER TABLE settings ADD COLUMN historyTitle TEXT").run(); } catch (e) {}
  try { db.prepare("ALTER TABLE settings ADD COLUMN historyContent TEXT").run(); } catch (e) {}
  try { db.prepare("ALTER TABLE settings ADD COLUMN showCarousel INTEGER DEFAULT 1").run(); } catch (e) {}
  try { db.prepare("ALTER TABLE settings ADD COLUMN showMarquee INTEGER DEFAULT 1").run(); } catch (e) {}
  try { db.prepare("ALTER TABLE settings ADD COLUMN showAbout INTEGER DEFAULT 1").run(); } catch (e) {}
  try { db.prepare("ALTER TABLE settings ADD COLUMN showFeature INTEGER DEFAULT 1").run(); } catch (e) {}
  try { db.prepare("ALTER TABLE settings ADD COLUMN showVision INTEGER DEFAULT 1").run(); } catch (e) {}
  try { db.prepare("ALTER TABLE settings ADD COLUMN showInsights INTEGER DEFAULT 1").run(); } catch (e) {}
  try { db.prepare("ALTER TABLE settings ADD COLUMN showPrincipalMessage INTEGER DEFAULT 1").run(); } catch (e) {}
  try { db.prepare("ALTER TABLE settings ADD COLUMN showDistinction INTEGER DEFAULT 1").run(); } catch (e) {}
  try { db.prepare("ALTER TABLE settings ADD COLUMN showVirtualCampus INTEGER DEFAULT 1").run(); } catch (e) {}
  try { db.prepare("ALTER TABLE settings ADD COLUMN showGallery INTEGER DEFAULT 1").run(); } catch (e) {}
  try { db.prepare("ALTER TABLE settings ADD COLUMN showLeadership INTEGER DEFAULT 1").run(); } catch (e) {}
  try { db.prepare("ALTER TABLE settings ADD COLUMN showHonors INTEGER DEFAULT 1").run(); } catch (e) {}
  try { db.prepare("ALTER TABLE settings ADD COLUMN faviconUrl TEXT DEFAULT 'https://xaviersjaipur.edu.in/wp-content/uploads/2023/12/SchoolLogoTest.png'").run(); } catch (e) {}
  try { db.prepare("ALTER TABLE settings ADD COLUMN googleSearchConsoleKey TEXT DEFAULT ''").run(); } catch (e) {}
  try { db.prepare("ALTER TABLE settings ADD COLUMN bingWebmasterKey TEXT DEFAULT ''").run(); } catch (e) {}
  try { db.prepare("ALTER TABLE settings ADD COLUMN indexNowKey TEXT DEFAULT ''").run(); } catch (e) {}
  try { db.prepare("ALTER TABLE settings ADD COLUMN ogTitle TEXT DEFAULT ''").run(); } catch (e) {}
  try { db.prepare("ALTER TABLE settings ADD COLUMN ogDescription TEXT DEFAULT ''").run(); } catch (e) {}
  try { db.prepare("ALTER TABLE settings ADD COLUMN ogImage TEXT DEFAULT ''").run(); } catch (e) {}

  try { db.prepare("ALTER TABLE site_settings ADD COLUMN googleSearchConsoleKey TEXT DEFAULT ''").run(); } catch (e) {}
  try { db.prepare("ALTER TABLE site_settings ADD COLUMN bingWebmasterKey TEXT DEFAULT ''").run(); } catch (e) {}
  try { db.prepare("ALTER TABLE site_settings ADD COLUMN indexNowKey TEXT DEFAULT ''").run(); } catch (e) {}
  try { db.prepare("ALTER TABLE site_settings ADD COLUMN ogTitle TEXT DEFAULT ''").run(); } catch (e) {}
  try { db.prepare("ALTER TABLE site_settings ADD COLUMN ogDescription TEXT DEFAULT ''").run(); } catch (e) {}
  try { db.prepare("ALTER TABLE site_settings ADD COLUMN ogImage TEXT DEFAULT ''").run(); } catch (e) {}

  db.exec(`
    CREATE TABLE IF NOT EXISTS school_history (
      id TEXT PRIMARY KEY,
      title TEXT,
      content TEXT,
      updated_at TEXT
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS lead_grace (
      id TEXT PRIMARY KEY,
      heading TEXT,
      content TEXT,
      image_url TEXT,
      updated_at TEXT
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
      regencyTitle TEXT,
      regencyDescription TEXT,
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

  try {
    const contentInfo = db.pragma("table_info(content)") as any[];
    if (!contentInfo.some(c => c.name === 'regencyTitle')) {
      db.exec("ALTER TABLE content ADD COLUMN regencyTitle TEXT");
      db.exec("ALTER TABLE content ADD COLUMN regencyDescription TEXT");
    }
  } catch (e) {}

  const tablesToUpdate = ['links', 'events', 'achievements', 'menu', 'studentHonors', 'staff', 'gallery', 'carousel', 'faqs', 'messages', 'popups', 'notices', 'marquee'];
  tablesToUpdate.forEach(table => {
    try {
      db.prepare(`ALTER TABLE "${table}" ADD COLUMN attachmentUrl TEXT`).run();
    } catch (err: any) {}
  });

  // Seeds
  try {
    const statsInfo = db.pragma("table_info(site_stats)") as any[];
    if (!statsInfo.some(c => c.name === 'updated_at')) {
      db.exec("ALTER TABLE site_stats ADD COLUMN updated_at TEXT");
    }
  } catch (e) {}

  try {
    const statsInfo = db.pragma("table_info(site_stats)") as any[];
    if (!statsInfo.some(c => c.name === 'content_updated_at')) {
      db.exec("ALTER TABLE site_stats ADD COLUMN content_updated_at TEXT");
    }
  } catch (e) {}

  const stats = db.prepare("SELECT id FROM site_stats WHERE id = 'main'").get();
  if (!stats) {
    db.prepare("INSERT INTO site_stats (id, visitor_count) VALUES ('main', 477706)").run();
  }

  const jesuitCount = db.prepare("SELECT COUNT(*) as count FROM jesuit_page_content").get() as any;
  if ((jesuitCount?.count || 0) === 0) {
    db.prepare(`
      INSERT INTO jesuit_page_content (id, objectives_html, examinations_html, promotions_html, discipline_html, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      'primary',
      '<ul><li>Help students become mature, spiritually oriented men and women of character.</li><li>Encourage continual striving after excellence in every field.</li><li>Value and judiciously use their freedom.</li><li>Be clear and firm on principles and courageous in action.</li><li>Be unselfish in the service of their fellow human beings.</li><li>Become agents of needed social change in the country.</li></ul>',
      '',
      '',
      '',
      new Date().toISOString()
    );
  } else {
    // If table has already been seeded with legacy placeholders, clean them to allow beautiful default rendering
    try {
      db.prepare(`
        UPDATE jesuit_page_content
        SET examinations_html = ''
        WHERE examinations_html LIKE '%Information about examinations%'
           OR examinations_html = '<p>Information about examinations will be updated soon.</p>'
      `).run();
      db.prepare(`
        UPDATE jesuit_page_content
        SET promotions_html = ''
        WHERE promotions_html LIKE '%Information about promotions%'
           OR promotions_html = '<p>Information about promotions will be updated soon.</p>'
      `).run();
      db.prepare(`
        UPDATE jesuit_page_content
        SET discipline_html = ''
        WHERE discipline_html LIKE '%Arrive at least five minutes%'
           OR discipline_html LIKE '%Habitually clean%'
      `).run();
    } catch (err) {
      console.error('Failed to clean legacy placeholders:', err);
    }
  }

  // Admin seed
  const adminCount = db.prepare("SELECT COUNT(*) as count FROM admins").get() as any;
  if ((adminCount?.count || 0) === 0) {
    const rootUser = process.env.INITIAL_ADMIN_USERNAME;
    const rootPass = process.env.INITIAL_ADMIN_PASSWORD;
    
    if (rootUser && rootPass) {
      console.log(`[DB] Seeding initial admin user: ${rootUser}`);
      bcrypt.hash(rootPass, 12).then((hashedPass) => {
        db.prepare("INSERT INTO admins (id, username, password, role) VALUES (?, ?, ?, ?)").run(
          'root-admin',
          rootUser,
          hashedPass,
          'admin'
        );
      });
    } else {
      console.warn('[DB] Skipping initial admin seed: INITIAL_ADMIN_USERNAME or INITIAL_ADMIN_PASSWORD missing.');
    }

    const secondaryUser = process.env.SECONDARY_ADMIN_USERNAME;
    const secondaryPass = process.env.SECONDARY_ADMIN_PASSWORD;
    
    if (secondaryUser && secondaryPass) {
      console.log(`[DB] Seeding secondary admin user: ${secondaryUser}`);
      bcrypt.hash(secondaryPass, 12).then((secondaryHashed) => {
        db.prepare("INSERT INTO admins (id, username, password, role) VALUES (?, ?, ?, ?)").run(
          'secondary-admin',
          secondaryUser,
          secondaryHashed,
          'admin'
        );
      });
    }
  }

  return db;
}

export function getLocalSQLiteData() {
  const db = getDatabase();
  const data: any = {};
  const tables = [
    'gallery', 'notices', 'staff', 'fees', 'links', 'events', 'achievements',
    'menu', 'carousel', 'studentHonors', 'faqs', 'messages', 'content', 'popups',
    'school_history', 'lead_grace', 'school_info', 'activities', 'co_curricular_activities',
    'alumni', 'parent_obligations', 'careers', 'mandatory_disclosures', 'contact_content',
    'scholarships', 'jesuit_page_content', 'fire_safety', 'site_stats', 'former_leaders',
    'former_principals', 'former_rectors', 'former_managers', 'former_student_leaders',
    'streamwise_toppers', 'xavierite_of_the_year', 'useful_links', 'custom_content',
    'transfer_certificates', 'career_applications', 'digital_campus', 'marquee'
  ];

  tables.forEach(table => {
    let rows: any[] = [];
    try {
      rows = db.prepare(`SELECT * FROM "${table}"`).all() as any[];
    } catch (err: any) {
      // Table may not yet be defined
    }
    
    // Convert SQLite integers (0/1) to Booleans for frontend consistency
    if (['popups', 'marquee'].includes(table)) {
      rows = rows.map(r => ({ ...r, isActive: Boolean(r.isActive) }));
    } else if (table === 'staff') {
      rows = rows.map(r => ({ ...r, is_enabled: r.is_enabled === null ? true : Boolean(r.is_enabled) }));
    } else if (table === 'useful_links') {
      rows = rows.map(r => ({ ...r, isPriority: Boolean(r.isPriority) }));
    } else if (['studentHonors', 'co_curricular_activities', 'custom_content', 'fire_safety', 'menu'].includes(table)) {
      rows = rows.map(r => ({ ...r, is_enabled: r.is_enabled === null ? true : Boolean(r.is_enabled) }));
    }
    
    if (table === 'digital_campus') {
      const row = rows[0] || { id: 'current', title: 'Legacy in Motion', is_enabled: 1, model_url: '' };
      data['digital_campus'] = { ...row, is_enabled: Boolean(row.is_enabled) };
    } else {
      data[table] = rows;
    }
  });

  data['navigation_menu'] = data['menu'] || [];

  if (Array.isArray(data.content)) {
    const contentObj: Record<string, string> = {};
    if (data.content.length > 0) {
      const firstRow = data.content[0];
      Object.keys(firstRow).forEach(key => {
        if (key !== 'id') {
          contentObj[key] = String(firstRow[key] ?? '');
        }
      });
    }
    data.content = contentObj;
  } else if (data.content && typeof data.content === 'object' && !Array.isArray(data.content)) {
    const contentObj: Record<string, string> = {};
    Object.keys(data.content).forEach(key => {
      if (key !== 'id') {
        contentObj[key] = String(data.content[key] ?? '');
      }
    });
    data.content = contentObj;
  }

  let settings = db.prepare(`SELECT * FROM site_settings WHERE id = 'global'`).get() as any;
  if (!settings) {
    try {
      settings = db.prepare(`SELECT * FROM settings WHERE id = 'global'`).get() as any;
    } catch (e) {}
  }
  
  if (settings) {
    // Convert SQLite integers (0/1) to Booleans for frontend consistency
    const toggleKeys = [
      'applyNowEnabled', 'showCarousel', 'showMarquee', 'showAbout', 'showFeature', 
      'showVision', 'showInsights', 'showPrincipalMessage', 'showDistinction', 
      'showVirtualCampus', 'showGallery', 'showLeadership', 'showHonors', 
      'popupEnabled', 'flagEnabled', 'careerFormEnabled'
    ];
    toggleKeys.forEach(key => {
      if (key in settings) {
        settings[key] = settings[key] === null ? true : Boolean(settings[key]);
      }
    });
  }
  
  if (!settings) {
    settings = {
      id: 'global',
      applyNowEnabled: 1,
      applyNowUrl: 'https://xaviersjaipur.edu.in/wp-content/uploads/2024/03/Admission-Prospectus-2024-25.pdf',
      applyNowLabel: 'Apply 2026-27',
      siteName: "St. Xavier's Sr. Sec. School, Jaipur",
      siteLogo: 'https://xaviersjaipur.edu.in/wp-content/uploads/2023/12/SchoolLogoTest.png',
      contactEmail: 'xavier41jaipur@gmail.com',
      contactPhone: '0141-2372336, 2362436',
      contactAddress: 'Bhagwan Das Road, C-Scheme, Jaipur - 302001, Rajasthan, India',
      currentSession: '2025-26',
      showCarousel: 1, showMarquee: 1, showAbout: 1, showFeature: 1, showVision: 1, 
      showInsights: 1, showPrincipalMessage: 1, showDistinction: 1, showGallery: 1, 
      showLeadership: 1, showHonors: 1, popupEnabled: 1, popupMessage: 'Welcome to St. Xavier\'s, C-scheme.',
      flagEnabled: 1, careerFormEnabled: 1, faviconUrl: 'https://xaviersjaipur.edu.in/wp-content/uploads/2023/12/SchoolLogoTest.png',
      googleSearchConsoleKey: '', bingWebmasterKey: '', indexNowKey: '', ogTitle: '', ogDescription: '', ogImage: ''
    };
  }

  const convertedSettings = { ...settings };
  Object.keys(settings).forEach(key => {
    if (key.startsWith('show') || key.endsWith('Enabled')) {
      convertedSettings[key] = Boolean(settings[key] ?? 1);
    }
  });
  data.settings = convertedSettings;

  return data;
}

export function proxySupabaseUrls(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') {
    if (obj.includes('.supabase.co/storage/v1/object/public/')) {
      if (!obj.startsWith('/api/img?url=')) {
        return `/api/img?url=${encodeURIComponent(obj)}`;
      }
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => proxySupabaseUrls(item));
  }
  if (typeof obj === 'object') {
    const res: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        res[key] = proxySupabaseUrls(obj[key]);
      }
    }
    return res;
  }
  return obj;
}

export async function fetchServerData(force: boolean = false) {
  const now = Date.now();
  if (!force && serverDataCache && now < serverDataCacheExpiresAt) {
    return serverDataCache;
  }

  const SUPABASE_URL = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
  const ANON_KEY = (process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();
  const SERVICE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || '').trim();
  const SUPABASE_KEY = SERVICE_KEY || ANON_KEY;
  const isUsingServiceRole = !!SERVICE_KEY;

  console.log(`[Server Cache Manager] Sync attempt. Force: ${force}, ServiceRole: ${isUsingServiceRole}`);

  // 1. Fetch from local SQLite first immediately
  const localData = getLocalSQLiteData();

  if (!SUPABASE_URL || !SUPABASE_KEY || SUPABASE_URL.includes('placeholder-project-id')) {
    console.log('[Server Cache Manager] Supabase not configured. Using local data only.');
    const proxied = proxySupabaseUrls(localData);
    serverDataCache = proxied;
    serverDataCacheExpiresAt = Date.now() + CACHE_TTL_MS;
    return proxied;
  }

  // 2. Perform SINGLE-ROW query to Supabase to check content version timestamp
  let remoteContentUpdatedAt = 'FORCE_SYNC';
  let localContentUpdatedAt: string | null = null;
  
  try {
    const cleanUrl = SUPABASE_URL
      .replace(/\/rest\/v1\/?$/, '') 
      .replace(/\/$/, '');
    const supabaseServer = createClient(cleanUrl, SUPABASE_KEY);

      const db = getDatabase();
      try {
        const row = db.prepare("SELECT value FROM content WHERE key = 'content_updated_at'").get() as any;
        if (row && row.value) {
          localContentUpdatedAt = row.value;
        }
      } catch (e) {}

      // Check remote timestamp from content table first
      const { data: remoteContentRow, error: contentTimeErr } = await supabaseServer
        .from('content')
        .select('value')
        .eq('key', 'content_updated_at')
        .maybeSingle();

      if (contentTimeErr) {
        console.warn('[Server Cache Manager] Querying content timestamp failed (table might be missing), proceeding to check tables directly:', contentTimeErr.message);
        remoteContentUpdatedAt = 'UNKNOWN'; 
      } else {
        const defaultTime = '2026-06-15T00:00:00.000Z';
        remoteContentUpdatedAt = remoteContentRow?.value || defaultTime;

        // If remote has no timestamp yet (legacy DB), prime it asynchronously
        if (!remoteContentRow?.value && isUsingServiceRole) {
          try {
            await supabaseServer.from('content').upsert({ key: 'content_updated_at', value: defaultTime });
          } catch (e) {}
        }
      }

      // COMPARE TIMESTAMPS
      const isLocalDataPopulated = Object.values(localData).some(val => Array.isArray(val) && val.length > 0);
      
      if (!force && isLocalDataPopulated && localContentUpdatedAt && remoteContentUpdatedAt !== 'UNKNOWN' && localContentUpdatedAt === remoteContentUpdatedAt) {
        console.log(`[Server Cache Manager] Cache VALID (${localContentUpdatedAt}). Skipping concurrent fetch of all tables.`);
        const proxied = proxySupabaseUrls(localData);
        serverDataCache = proxied;
        serverDataCacheExpiresAt = Date.now() + CACHE_TTL_MS;
        return proxied;
      }

      console.log(`[Server Cache Manager] Cache STALE, EMPTY, or FORCE. Local: ${localContentUpdatedAt}, Remote: ${remoteContentUpdatedAt}, LocalPopulated: ${isLocalDataPopulated}. Syncing fresh tables...`);
    if (!isUsingServiceRole) {
      console.warn('[Server Cache Manager] WARNING: Syncing without SUPABASE_SERVICE_ROLE_KEY. Private tables (messages, etc) will be skipped to prevent local data wipe.');
    }

    const collections = [
       'notices', 'staff', 'gallery', 'fees', 'links', 
       'events', 'achievements', 'studentHonors', 'navigation_menu', 'carousel', 'popups', 'transfer_certificates', 'faqs', 'messages', 'marquee', 'admins', 'logs', 'former_leaders',
       'former_principals', 'former_rectors', 'former_managers', 'former_student_leaders', 'streamwise_toppers', 'xavierite_of_the_year', 'useful_links', 'custom_content', 'lead_grace', 'school_history',
       'activities', 'co_curricular_activities', 'alumni', 'school_info', 'parent_obligations', 'careers', 'mandatory_disclosures', 'contact_content', 'jesuit_page_content', 'scholarships', 'fire_safety', 'site_stats', 'career_applications'
    ];

    const privateTables = ['messages', 'career_applications', 'transfer_certificates', 'admins', 'logs', 'visitor_ips'];

    const results: any = {};
    let successCount = 0;
    const supabaseTableStatus: Record<string, 'online' | 'offline' | 'skipped'> = {};

    const fetchTasks = [
      ...collections.map(async (colName) => {
        try {
          // PROTECTION: If not using service role, we still attempt fetch. 
          // We only skip the local wipe if we get 0 rows and suspect RLS is blocking us.
          console.log(`[Server Cache Sync] Fetching ${colName}...`);
          const { data, error } = await supabaseServer.from(colName).select('*');
          
          if (error) {
            supabaseTableStatus[colName] = 'offline';
            results[colName] = localData[colName] || [];
            
            if (error.message.includes('Could not find the table') || error.message.includes('does not exist')) {
              console.warn(`[Server Cache Sync] Table ${colName} missing in Supabase (skipping):`, error.message);
            } else {
              console.error(`[Server Cache Sync] Error fetching ${colName}:`, error.message);
            }
          } else {
            const rowCount = data?.length || 0;
            console.log(`[Server Cache Sync] Fetched ${colName}: ${rowCount} rows`);
            
            // If we are NOT using service role and got 0 rows for a private table, 
            // it might be RLS blocking us. In this case, we prefer to KEEP local data 
            // instead of wiping it, UNLESS local data is already empty.
            const isPossiblyBlocked = !isUsingServiceRole && rowCount === 0 && privateTables.includes(colName);
            const hasLocalData = (localData[colName]?.length || 0) > 0;

            if (isPossiblyBlocked && hasLocalData) {
              console.warn(`[Server Cache Sync] Potential RLS block for ${colName} (0 rows fetched without Service Role). Preserving local cache.`);
              supabaseTableStatus[colName] = 'online'; // Mark as online but we didn't update
              results[colName] = localData[colName];
              return;
            }

            supabaseTableStatus[colName] = 'online';
            results[colName] = data || [];
            successCount++;

            // Sync to local SQLite
            const sqliteTable = colName === 'navigation_menu' ? 'menu' : colName;
            try {
              if (Array.isArray(data)) {
                const columnsInfo = db.pragma(`table_info("${sqliteTable}")`) as any[];
                if (columnsInfo && columnsInfo.length > 0) {
                  const columns = columnsInfo.map(c => c.name);
                  
                  // Clear local table before sync (standard behavior)
                  if (sqliteTable !== 'logs' && sqliteTable !== 'visitor_ips') {
                    db.prepare(`DELETE FROM "${sqliteTable}"`).run();
                  }

                  if (data.length > 0) {
                    db.transaction(() => {
                      data.forEach((row: any) => {
                        const rowKeys = Object.keys(row).filter(k => columns.includes(k));
                        if (rowKeys.length > 0) {
                          const placeholders = rowKeys.map(() => '?').join(',');
                          const values = rowKeys.map(k => {
                            const val = row[k];
                            if (typeof val === 'boolean') return val ? 1 : 0;
                            return val;
                          });
                          const query = `INSERT OR REPLACE INTO "${sqliteTable}" (${rowKeys.map(k => `"${k}"`).join(',')}) VALUES (${placeholders})`;
                          db.prepare(query).run(values);
                        }
                      });
                    })();
                  }
                }
              }
            } catch (liteErr: any) {
              console.warn(`[Local Cache Sync] Table ${sqliteTable} write issue:`, liteErr.message);
            }
          }
        } catch (e) {
          supabaseTableStatus[colName] = 'offline';
          results[colName] = localData[colName] || [];
        }
      }),
      // Settings
      (async () => {
        try {
          let { data, error } = await supabaseServer.from('site_settings').select('*').limit(1).maybeSingle();
          if (error || !data) {
            const fallback = await supabaseServer.from('settings').select('*').limit(1).maybeSingle();
            data = fallback.data;
          }
          if (data) {
            results.settings = data;
            successCount++;
            supabaseTableStatus['settings'] = 'online';

            try {
              const columnsInfo = db.pragma(`table_info("site_settings")`) as any[];
              const columns = columnsInfo.map(c => c.name);
              const rowKeys = Object.keys(data).filter(k => columns.includes(k));
              const placeholders = rowKeys.map(() => '?').join(',');
              const values = rowKeys.map(k => {
                const val = data[k];
                if (typeof val === 'boolean') return val ? 1 : 0;
                return val;
              });
              const query = `INSERT OR REPLACE INTO "site_settings" (${rowKeys.map(k => `"${k}"`).join(',')}) VALUES (${placeholders})`;
              db.prepare(query).run(values);
            } catch (liteErr) {}
          } else {
            results.settings = localData.settings;
          }
        } catch (e) {
          results.settings = localData.settings;
        }
      })(),
      // Digital Campus
      (async () => {
        try {
          const { data, error } = await supabaseServer.from('digital_campus').select('*').limit(1).maybeSingle();
          if (data) {
            results.digital_campus = data;
            successCount++;
            supabaseTableStatus['digital_campus'] = 'online';

            try {
              const columnsInfo = db.pragma(`table_info("digital_campus")`) as any[];
              const columns = columnsInfo.map(c => c.name);
              const rowKeys = Object.keys(data).filter(k => columns.includes(k));
              const placeholders = rowKeys.map(() => '?').join(',');
              const values = rowKeys.map(k => {
                const val = data[k];
                if (typeof val === 'boolean') return val ? 1 : 0;
                return val;
              });
              const query = `INSERT OR REPLACE INTO "digital_campus" (${rowKeys.map(k => `"${k}"`).join(',')}) VALUES (${placeholders})`;
              db.prepare(query).run(values);
            } catch (liteErr) {}
          } else {
            results.digital_campus = localData.digital_campus;
          }
        } catch (e) {
          results.digital_campus = localData.digital_campus;
        }
      })(),
      // Content (Key Value structure)
      (async () => {
        try {
          const { data, error } = await supabaseServer.from('content').select('*');
          if (data && Array.isArray(data)) {
            const contentObj: Record<string, string> = {};
            data.forEach((row: any) => {
              if (row.key) {
                contentObj[row.key] = row.value || '';
              }
            });
            results.content = contentObj;
            successCount++;
            supabaseTableStatus['content'] = 'online';

            try {
              data.forEach((row: any) => {
                if (row.key) {
                  db.prepare(`INSERT OR REPLACE INTO "content" (key, value) VALUES (?, ?)`).run(row.key, row.value || '');
                }
              });
            } catch (liteErr) {}
          } else {
            results.content = localData.content;
          }
        } catch (e) {
          results.content = localData.content;
        }
      })()
    ];

    await Promise.all(fetchTasks);

    // Save final content timestamp to local SQLite so subsequent requests hit cache
    try {
      db.prepare("INSERT OR REPLACE INTO content (key, value) VALUES ('content_updated_at', ?)").run(remoteContentUpdatedAt);
    } catch (e) {}

    const processed = getLocalSQLiteData();
    processed.supabaseTableStatus = supabaseTableStatus;

    const proxied = proxySupabaseUrls(processed);
    serverDataCache = proxied;
    serverDataCacheExpiresAt = Date.now() + CACHE_TTL_MS;
    return proxied;

  } catch (err: any) {
    console.warn('[Server Cache Manager] Fetch error, returning local SQLite:', err.message);
    const proxied = proxySupabaseUrls(localData);
    serverDataCache = proxied;
    serverDataCacheExpiresAt = Date.now() + 60000; // retry in 1 minute on failure
    return proxied;
  }
}
