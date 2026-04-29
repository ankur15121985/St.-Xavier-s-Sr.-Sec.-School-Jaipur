-- SQL to setup Supabase Tables for St. Xavier's School App
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS notices (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    date TEXT NOT NULL,
    category TEXT NOT NULL,
    link TEXT,
    "attachmentUrl" TEXT
);

CREATE TABLE IF NOT EXISTS staff (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    bio TEXT NOT NULL,
    image TEXT NOT NULL,
    type TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS gallery (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    caption TEXT NOT NULL,
    session TEXT
);

CREATE TABLE IF NOT EXISTS fees (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    particulars TEXT NOT NULL,
    amount TEXT NOT NULL,
    quarterly TEXT NOT NULL,
    remarks TEXT,
    order_index INTEGER NOT NULL,
    "attachmentUrl" TEXT
);

CREATE TABLE IF NOT EXISTS links (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    "attachmentUrl" TEXT
);

CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    location TEXT NOT NULL,
    "attachmentUrl" TEXT
);

CREATE TABLE IF NOT EXISTS menu (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    href TEXT NOT NULL,
    parent_id TEXT,
    order_index INTEGER NOT NULL,
    "attachmentUrl" TEXT
);

CREATE TABLE IF NOT EXISTS "studentHonors" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    result TEXT NOT NULL,
    subtext TEXT NOT NULL,
    image TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    "attachmentUrl" TEXT
);

CREATE TABLE IF NOT EXISTS achievements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    year TEXT NOT NULL,
    description TEXT NOT NULL,
    "attachmentUrl" TEXT
);

CREATE TABLE IF NOT EXISTS carousel (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    caption TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS faqs (
    id TEXT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT,
    order_index INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    status TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS popups (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    content TEXT NOT NULL,
    buttonText TEXT,
    buttonLink TEXT,
    isActive BOOLEAN NOT NULL,
    order_index INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY,
    applyNowEnabled BOOLEAN NOT NULL,
    applyNowUrl TEXT NOT NULL,
    applyNowLabel TEXT NOT NULL,
    siteName TEXT,
    siteLogo TEXT,
    contactEmail TEXT,
    contactPhone TEXT,
    contactAddress TEXT,
    currentSession TEXT,
    feesPdfUrl TEXT,
    popupMessage TEXT,
    popupEnabled BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS content (
    id TEXT DEFAULT 'global',
    key TEXT NOT NULL,
    value TEXT,
    PRIMARY KEY (id, key)
);

CREATE TABLE IF NOT EXISTS transfer_certificates (
    id TEXT PRIMARY KEY,
    admission_number TEXT NOT NULL UNIQUE,
    dob TEXT NOT NULL,
    student_name TEXT NOT NULL,
    "attachmentUrl" TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Schema Migration: Ensure attachmentUrl exists in all required tables
-- (Run these if you already have the tables but are getting "column not found" errors)

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='notices' AND column_name='attachmentUrl') THEN
        ALTER TABLE notices ADD COLUMN "attachmentUrl" TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='fees' AND column_name='attachmentUrl') THEN
        ALTER TABLE fees ADD COLUMN "attachmentUrl" TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='links' AND column_name='attachmentUrl') THEN
        ALTER TABLE links ADD COLUMN "attachmentUrl" TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events' AND column_name='attachmentUrl') THEN
        ALTER TABLE events ADD COLUMN "attachmentUrl" TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='menu' AND column_name='attachmentUrl') THEN
        ALTER TABLE menu ADD COLUMN "attachmentUrl" TEXT;
    END IF;

    -- Student Honors (Case sensitive handling)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'studentHonors') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='studentHonors' AND column_name='attachmentUrl') THEN
            ALTER TABLE "studentHonors" ADD COLUMN IF NOT EXISTS "attachmentUrl" TEXT;
        END IF;
    ELSIF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'studenthonors') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='studenthonors' AND column_name='attachmentUrl') THEN
            ALTER TABLE studenthonors ADD COLUMN IF NOT EXISTS "attachmentUrl" TEXT;
        END IF;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='achievements' AND column_name='attachmentUrl') THEN
        ALTER TABLE achievements ADD COLUMN "attachmentUrl" TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='staff' AND column_name='bio') THEN
        ALTER TABLE staff ADD COLUMN "bio" TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='feesPdfUrl') THEN
        ALTER TABLE settings ADD COLUMN "feesPdfUrl" TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='popupMessage') THEN
        ALTER TABLE settings ADD COLUMN "popupMessage" TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='popupEnabled') THEN
        ALTER TABLE settings ADD COLUMN "popupEnabled" BOOLEAN DEFAULT false;
    END IF;
END $$;

-- 3. FIX: Convert UUID ID columns to TEXT (Run if you get "invalid input syntax for type uuid")
-- This is common if you created tables manually in the UI instead of using this script.

DO $$ 
DECLARE
    t_name TEXT;
    pk_name TEXT;
BEGIN 
    FOR t_name IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' 
    AND table_name IN ('notices', 'fees', 'links', 'events', 'menu', 'studentHonors', 'studenthonors', 'achievements', 'staff', 'gallery', 'carousel', 'faqs', 'messages', 'popups', 'settings', 'transfer_certificates')
    LOOP
        -- Check if 'id' column is UUID
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = t_name AND column_name = 'id' AND data_type = 'uuid'
        ) THEN
            -- Dynamically find primary key constraint name
            SELECT conname INTO pk_name
            FROM pg_constraint
            WHERE conrelid = quote_ident(t_name)::regclass AND contype = 'p' LIMIT 1;

            -- Drop primary key constraint if found
            IF pk_name IS NOT NULL THEN
                EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I', t_name, pk_name);
            END IF;

            -- Change column type
            EXECUTE format('ALTER TABLE %I ALTER COLUMN id TYPE TEXT USING id::text', t_name);
            -- Re-add primary key
            EXECUTE format('ALTER TABLE %I ADD PRIMARY KEY (id)', t_name);
            
            RAISE NOTICE 'Converted id in % from UUID to TEXT', t_name;
        END IF;
    END LOOP;
END $$;
