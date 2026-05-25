import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database.sqlite');
const db = new Database(dbPath);

console.log("Database opened successfully. Path:", dbPath);

// List all tables
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log("Tables in database:", tables.map(t => t.name).join(", "));

const searchTerms = ['UAE', '971', 'Dubai', 'Abu Dhabi', 'United Arab Emirates', 'Sharjah'];

for (const table of tables) {
  const tableName = table.name;
  try {
    const rows = db.prepare(`SELECT * FROM "${tableName}"`).all();
    if (rows.length === 0) continue;
    
    // Check if any row has text containing UAE or similar
    const matchedRows = [];
    for (const row of rows) {
      const rowStr = JSON.stringify(row);
      const isMatch = searchTerms.some(term => rowStr.toLowerCase().includes(term.toLowerCase()));
      if (isMatch) {
        matchedRows.push(row);
      }
    }
    
    if (matchedRows.length > 0) {
      console.log(`\n=== MATCH IN TABLE: ${tableName} (${matchedRows.length} rows) ===`);
      for (const row of matchedRows) {
        console.log(JSON.stringify(row, null, 2));
      }
    }
  } catch (err) {
    console.error(`Error querying table ${tableName}:`, err.message);
  }
}

// Also let's print all row counts for reference
console.log("\n=== TABLE ROW COUNTS ===");
for (const table of tables) {
  try {
    const count = db.prepare(`SELECT COUNT(*) as count FROM "${table.name}"`).get();
    console.log(`${table.name}: ${count.count} rows`);
  } catch (err) {
    console.log(`${table.name}: error (${err.message})`);
  }
}
