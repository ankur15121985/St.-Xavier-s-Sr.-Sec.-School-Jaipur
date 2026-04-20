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
    content TEXT,
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

  // Diagnostic: Check fees table columns
  db.all("PRAGMA table_info(fees)", (err, rows: any[]) => {
    if (err) console.error("Diagnostic error:", err);
    else if (rows) {
      console.log("[DIAG] FEES SCHEMA:", rows.map(r => r.name).join(', '));
    }
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

  db.get("SELECT COUNT(*) as count FROM staff", (err, row: any) => {
    if (!row || row.count < targetStaff.length) {
      console.log(`Updating staff table from ${row?.count || 0} to ${targetStaff.length} records...`);
      db.serialize(() => {
        db.run("DELETE FROM staff");
        const stmt = db.prepare("INSERT INTO staff (id, name, role, bio, image, type) VALUES (?, ?, ?, ?, ?, ?)");
        targetStaff.forEach(s => stmt.run(s.id, s.name, s.role, s.bio, s.image, s.type));
        stmt.finalize();
      });
    }
  });
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
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit for high-res photos
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

app.post('/api/gallery/upload', (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'Image exceeds 20MB limit' });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(500).json({ error: 'Internal server error during upload' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
  });
});

app.post('/api/gallery/upload-multiple', upload.array('images', 10), (req, res) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'No images uploaded' });
  }

  const urls = files.map(file => `/uploads/${file.filename}`);
  res.json({ urls });
});

const SCHEMA: { [key: string]: string[] } = {
  gallery: ['id', 'url', 'caption'],
  notices: ['id', 'title', 'content', 'date', 'category', 'link'],
  staff: ['id', 'name', 'role', 'bio', 'image', 'type'],
  fees: ['id', 'grade', 'admissionFee', 'tuition_fees', 'quarterly'],
  links: ['id', 'title', 'url'],
  events: ['id', 'title', 'date', 'time', 'location'],
  achievements: ['id', 'title', 'year', 'description']
};

app.post('/api/save', (req, res) => {
  const { table, item } = req.body;
  const whitelist = Object.keys(SCHEMA);
  
  if (!whitelist.includes(table)) {
    return res.status(400).json({ error: 'Invalid table name' });
  }

  // Filter item keys to match schema and prevent SQL errors
  const allowedFields = SCHEMA[table];
  const fields = Object.keys(item).filter(k => allowedFields.includes(k));
  
  if (fields.length === 0) {
    return res.status(400).json({ error: 'No valid fields to save' });
  }

  const placeholders = fields.map(() => '?').join(',');
  const values = fields.map(f => item[f]);

  // Use double quotes for column names to avoid issues with reserved words
  const query = `INSERT OR REPLACE INTO "${table}" (${fields.map(f => `"${f}"`).join(',')}) VALUES (${placeholders})`;
  
  console.log(`[SQL EXEC] Table: ${table}, Keys: ${fields.join(',')}`);
  
  db.run(query, values, function(err) {
    if (err) {
      console.error(`[SQL ERROR] ${table.toUpperCase()} SAVE FAILED:`, err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log(`[SQL SUCCESS] ${table} item ${item.id} persisted.`);
    res.json({ success: true });
  });
});

app.delete('/api/delete', (req, res) => {
  const { table, id, ids } = req.body;
  const whitelist = ['gallery', 'notices', 'staff', 'fees', 'links', 'events', 'achievements'];
  
  if (!whitelist.includes(table)) {
    return res.status(400).json({ error: 'Invalid table name' });
  }

  if (ids && Array.isArray(ids)) {
    const placeholders = ids.map(() => '?').join(',');
    db.run(`DELETE FROM ${table} WHERE id IN (${placeholders})`, ids, function(err) {
      if (err) {
        console.error(`!!!! SQL Bulk Delete Error !!!! (Table: ${table}):`, err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true, changes: this.changes });
    });
  } else {
    db.run(`DELETE FROM ${table} WHERE id = ?`, [id], function(err) {
      if (err) {
        console.error(`!!!! SQL Delete Error !!!! (Table: ${table}):`, err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true, changes: this.changes });
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
