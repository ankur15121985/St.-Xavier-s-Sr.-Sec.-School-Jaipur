import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

// Global cache to prevent multiple connections in Next.js HMR development mode
let dbInstance: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (dbInstance) {
    try {
      dbInstance.prepare("SELECT 1").get();
      return dbInstance;
    } catch (err: any) {
      if (err.message && err.message.toLowerCase().includes('malformed')) {
        console.error("[DB] Cached database is malformed, re-opening database...");
        try { dbInstance.close(); } catch (e) {}
        dbInstance = null;
      } else {
        throw err;
      }
    }
  }

  const dbPath = path.join(process.cwd(), 'database.sqlite');

  // Self-heal/recovery for malformed SQLite databases
  try {
    const fs = require('fs');
    if (fs.existsSync(dbPath)) {
      const tempDb = new Database(dbPath);
      try {
        tempDb.prepare("SELECT 1").get();
        // Also verify stats table
        try {
          tempDb.prepare("SELECT id FROM site_stats LIMIT 1").get();
        } catch (tableErr) {}
        tempDb.close();
      } catch (testErr: any) {
        try { tempDb.close(); } catch (e) {}
        if (testErr.message && testErr.message.toLowerCase().includes('malformed')) {
          console.error("[DB] SQLite database file is malformed. Deleting the corrupt database for automatic self-healing:", testErr.message);
          try {
            fs.unlinkSync(dbPath);
          } catch (unlinkErr: any) {
            console.error("[DB] Failed to delete corrupt database file:", unlinkErr.message);
          }
        } else {
          throw testErr;
        }
      }
    }
  } catch (initErr: any) {
    console.warn("[DB] Database pre-startup scan details:", initErr.message);
  }

  const db = new Database(dbPath);
  dbInstance = db;

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
      ogImage TEXT DEFAULT ''
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
      ogImage TEXT DEFAULT ''
    )
  `);

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
    const rootUser = process.env.INITIAL_ADMIN_USERNAME || 'admin';
    const rootPass = process.env.INITIAL_ADMIN_PASSWORD || 'admin123';
    
    bcrypt.hash(rootPass, 12).then((hashedPass) => {
      db.prepare("INSERT INTO admins (id, username, password, role) VALUES (?, ?, ?, ?)").run(
        'root-admin',
        rootUser,
        hashedPass,
        'admin'
      );
    });

    const secondaryUser = 'ankur15121985';
    bcrypt.hash('ankur24121985', 12).then((secondaryHashed) => {
      db.prepare("INSERT INTO admins (id, username, password, role) VALUES (?, ?, ?, ?)").run(
        'ankur-admin',
        secondaryUser,
        secondaryHashed,
        'admin'
      );
    });
  }

  return db;
}

export async function fetchServerData() {
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (SUPABASE_URL && SUPABASE_KEY && !SUPABASE_URL.includes('placeholder-project-id')) {
    try {
      const cleanUrl = SUPABASE_URL.trim().replace('/rest/v1/', '').replace('/rest/v1', '').replace(/\/$/, '');
      const supabaseServer = createClient(cleanUrl, SUPABASE_KEY);

      console.log('[Server Supabase] Fetching dynamic live tables...');
      const collections = [
         'notices', 'staff', 'gallery', 'fees', 'links', 
         'events', 'achievements', 'studentHonors', 'navigation_menu', 'carousel', 'popups', 'transfer_certificates', 'faqs', 'messages', 'marquee', 'admins', 'logs', 'former_leaders',
         'former_principals', 'former_rectors', 'former_managers', 'former_student_leaders', 'streamwise_toppers', 'xavierite_of_the_year', 'useful_links', 'custom_content', 'lead_grace', 'school_history',
         'activities', 'co_curricular_activities', 'alumni', 'school_info', 'parent_obligations', 'careers', 'mandatory_disclosures', 'contact_content', 'jesuit_page_content', 'scholarships', 'fire_safety', 'site_stats', 'career_applications'
      ];

      const results: any = {};
      let successCount = 0;
      const supabaseTableStatus: Record<string, 'online' | 'offline'> = {};

      const fetchTasks = [
        ...collections.map(async (colName) => {
          try {
            const { data, error } = await supabaseServer.from(colName).select('*');
            if (error) {
              supabaseTableStatus[colName] = 'offline';
              console.log(`[Server Supabase] Optional table '${colName}' not yet configured/live in Supabase. Falling back to local database.`);
              // Try to retrieve from SQLite specifically for this table
              try {
                const db = getDatabase();
                const sqlTable = colName === 'navigation_menu' ? 'menu' : colName;
                const localRows = db.prepare(`SELECT * FROM "${sqlTable}"`).all() as any[];
                results[colName] = localRows || [];
                successCount++;
              } catch (liteErr: any) {
                results[colName] = [];
              }
            } else {
              supabaseTableStatus[colName] = 'online';
              results[colName] = data || [];
              successCount++;
            }
          } catch (e: any) {
            supabaseTableStatus[colName] = 'offline';
            console.log(`[Server Supabase] Table '${colName}' exception (${e.message}). Falling back to local database.`);
            try {
              const db = getDatabase();
              const sqlTable = colName === 'navigation_menu' ? 'menu' : colName;
              const localRows = db.prepare(`SELECT * FROM "${sqlTable}"`).all() as any[];
              results[colName] = localRows || [];
              successCount++;
            } catch (liteErr) {
              results[colName] = [];
            }
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
            } else {
              supabaseTableStatus['settings'] = 'offline';
              const db = getDatabase();
              let localSettings = db.prepare(`SELECT * FROM site_settings WHERE id = 'global'`).get() as any;
              if (!localSettings) {
                try {
                  localSettings = db.prepare(`SELECT * FROM settings WHERE id = 'global'`).get() as any;
                } catch (e) {}
              }
              if (localSettings) {
                results.settings = localSettings;
                successCount++;
              }
            }
          } catch (e: any) {
            supabaseTableStatus['settings'] = 'offline';
            console.log('[Server Supabase] Settings fetch issue, using local SQLite Settings:', e.message);
            try {
              const db = getDatabase();
              let localSettings = db.prepare(`SELECT * FROM site_settings WHERE id = 'global'`).get() as any;
              if (!localSettings) {
                localSettings = db.prepare(`SELECT * FROM settings WHERE id = 'global'`).get() as any;
              }
              if (localSettings) {
                results.settings = localSettings;
                successCount++;
              }
            } catch (liteErr) {}
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
            } else {
              supabaseTableStatus['digital_campus'] = 'offline';
              const db = getDatabase();
              const dc = db.prepare(`SELECT * FROM digital_campus`).all() as any[];
              if (dc && dc[0]) {
                results.digital_campus = dc[0];
                successCount++;
              } else {
                results.digital_campus = { id: 'current', title: 'Legacy in Motion', is_enabled: true };
              }
            }
          } catch (e: any) {
            supabaseTableStatus['digital_campus'] = 'offline';
            console.log('[Server Supabase] Digital Campus fetch issue, using local SQLite DC:', e.message);
            try {
              const db = getDatabase();
              const dc = db.prepare(`SELECT * FROM digital_campus`).all() as any[];
              if (dc && dc[0]) {
                results.digital_campus = dc[0];
                successCount++;
              }
            } catch (liteErr) {}
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
            } else {
              supabaseTableStatus['content'] = 'offline';
              const db = getDatabase();
              const rows = db.prepare(`SELECT * FROM "content"`).all() as any[];
              const contentObj: Record<string, string> = {};
              rows.forEach((row: any) => {
                if (row.key) {
                  contentObj[row.key] = row.value || '';
                }
              });
              results.content = contentObj;
              successCount++;
            }
          } catch (e: any) {
            supabaseTableStatus['content'] = 'offline';
            console.log('[Server Supabase] Content fetch issue, using local SQLite Content:', e.message);
            try {
              const db = getDatabase();
              const rows = db.prepare(`SELECT * FROM "content"`).all() as any[];
              const contentObj: Record<string, string> = {};
              rows.forEach((row: any) => {
                if (row.key) {
                  contentObj[row.key] = row.value || '';
                }
              });
              results.content = contentObj;
              successCount++;
            } catch (liteErr) {}
          }
        })()
      ];

      await Promise.all(fetchTasks);

      if (successCount > 0) {
        console.log(`[Server Supabase] Live Sync from Supabase verified. Synced ${successCount} database streams.`);
        
        const processed: any = {};
        
        collections.forEach(colName => {
          let rows = results[colName] || [];
          if (['popups', 'marquee'].includes(colName)) {
            rows = rows.map((r: any) => ({ ...r, isActive: Boolean(r.isActive) }));
          } else if (colName === 'staff') {
            rows = rows.map((r: any) => ({ ...r, is_enabled: r.is_enabled === null ? true : Boolean(r.is_enabled) }));
          } else if (colName === 'useful_links') {
            rows = rows.map((r: any) => ({ ...r, isPriority: Boolean(r.isPriority) }));
          } else if (['studentHonors', 'co_curricular_activities', 'custom_content', 'fire_safety'].includes(colName)) {
            rows = rows.map((r: any) => ({ ...r, is_enabled: r.is_enabled === null ? true : Boolean(r.is_enabled) }));
          }
          processed[colName] = rows;
        });

        processed.menu = processed.navigation_menu || [];
        processed.navigation_menu = processed.navigation_menu || [];
        processed.supabaseTableStatus = supabaseTableStatus;

        // Digital Campus
        if (results.digital_campus) {
          processed.digital_campus = {
            ...results.digital_campus,
            is_enabled: Boolean(results.digital_campus.is_enabled)
          };
        } else {
          processed.digital_campus = { id: 'current', title: 'Legacy in Motion', is_enabled: true };
        }

        // Content
        processed.content = results.content || {};

        // Settings
        const rawSettings = results.settings || {
          id: 'global',
          applyNowEnabled: true,
          applyNowUrl: 'https://xaviersjaipur.edu.in/wp-content/uploads/2024/03/Admission-Prospectus-2024-25.pdf',
          applyNowLabel: 'Apply 2026-27',
          siteName: "St. Xavier's Sr. Sec. School, Jaipur",
          siteLogo: 'https://xaviersjaipur.edu.in/wp-content/uploads/2023/12/SchoolLogoTest.png',
          contactEmail: 'xaviersjaipur@gmail.com',
          contactPhone: '0141-2372336, 2362436',
          contactAddress: 'Bhagwan Das Road, C-Scheme, Jaipur - 302001, Rajasthan, India',
          currentSession: '2025-26',
          showCarousel: true, showMarquee: true, showAbout: true, showFeature: true, showVision: true, 
          showInsights: true, showPrincipalMessage: true, showDistinction: true, showGallery: true, 
          showLeadership: true, showHonors: true, popupEnabled: true, popupMessage: 'Welcome to St. Xavier\'s, C-scheme.',
          flagEnabled: true, careerFormEnabled: true, faviconUrl: 'https://xaviersjaipur.edu.in/wp-content/uploads/2023/12/SchoolLogoTest.png',
          googleSearchConsoleKey: '', bingWebmasterKey: '', indexNowKey: '', ogTitle: '', ogDescription: '', ogImage: ''
        };

        const convertedSettings = { ...rawSettings };
        Object.keys(rawSettings).forEach(key => {
          if (key.startsWith('show') || key.endsWith('Enabled')) {
            convertedSettings[key] = Boolean(rawSettings[key] ?? true);
          }
        });
        processed.settings = convertedSettings;

        return processed;
      }
    } catch (e: any) {
      console.warn('[Server Supabase] Error during remote fetch sequence. Falling back to local SQLite:', e.message);
    }
  }

  // Fallback to local SQLite Database (Server Mode)
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
    } else if (['studentHonors', 'co_curricular_activities', 'custom_content', 'fire_safety'].includes(table)) {
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
  
  if (!settings) {
    settings = {
      id: 'global',
      applyNowEnabled: 1,
      applyNowUrl: 'https://xaviersjaipur.edu.in/wp-content/uploads/2024/03/Admission-Prospectus-2024-25.pdf',
      applyNowLabel: 'Apply 2026-27',
      siteName: "St. Xavier's Sr. Sec. School, Jaipur",
      siteLogo: 'https://xaviersjaipur.edu.in/wp-content/uploads/2023/12/SchoolLogoTest.png',
      contactEmail: 'xaviersjaipur@gmail.com',
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
