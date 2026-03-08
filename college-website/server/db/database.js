/* =====================================================
   db/database.js – SQLite Database via sql.js (pure JS)
   Persists to college.db file using Node.js fs module
   ===================================================== */

'use strict';

const path = require('path');
const fs = require('fs');
const initSqlJs = require('sql.js');

const DB_PATH = path.join(__dirname, 'college.db');

let db = null;

/** Load or create the SQLite database */
async function getDb() {
    if (db) return db;

    const SQL = await initSqlJs();

    if (fs.existsSync(DB_PATH)) {
        const fileBuffer = fs.readFileSync(DB_PATH);
        db = new SQL.Database(fileBuffer);
    } else {
        db = new SQL.Database();
    }

    // Enable WAL-equivalent: just run some pragmas
    db.run('PRAGMA foreign_keys = ON;');

    return db;
}

/** Save the in-memory db to disk */
function persistDb() {
    if (!db) return;
    const data = db.export();
    fs.writeFileSync(DB_PATH, Buffer.from(data));
}

/** Execute a write query and immediately persist */
function run(sql, params = []) {
    if (!db) throw new Error('DB not initialized. Call getDb() first.');
    db.run(sql, params);
    persistDb();
}

/** Execute a SELECT returning all rows as objects */
function all(sql, params = []) {
    if (!db) throw new Error('DB not initialized.');
    const stmt = db.prepare(sql);
    stmt.bind(params);
    const rows = [];
    while (stmt.step()) {
        rows.push(stmt.getAsObject());
    }
    stmt.free();
    return rows;
}

/** Execute a SELECT returning the first row */
function get(sql, params = []) {
    const rows = all(sql, params);
    return rows[0] || null;
}

/** Create all tables if they don't exist */
function createTables() {
    const schema = `
    CREATE TABLE IF NOT EXISTS students (
      id             TEXT PRIMARY KEY,
      name           TEXT NOT NULL,
      email          TEXT UNIQUE NOT NULL,
      password_hash  TEXT NOT NULL,
      roll_no        TEXT UNIQUE NOT NULL,
      cnic           TEXT,
      program        TEXT,
      semester       TEXT,
      section        TEXT,
      dob            TEXT,
      phone          TEXT,
      address        TEXT,
      guardian       TEXT,
      guardian_phone TEXT,
      gpa            REAL DEFAULT 0,
      status         TEXT DEFAULT 'Active',
      admission_date TEXT,
      avatar_initials TEXT
    );

    CREATE TABLE IF NOT EXISTS results (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id     TEXT NOT NULL REFERENCES students(id),
      semester_label TEXT NOT NULL,
      semester_order INTEGER DEFAULT 1,
      subject_code   TEXT,
      subject_name   TEXT,
      credit         INTEGER,
      marks          INTEGER,
      total_marks    INTEGER DEFAULT 100,
      grade          TEXT,
      semester_gpa   REAL
    );

    CREATE TABLE IF NOT EXISTS fee_records (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id  TEXT NOT NULL REFERENCES students(id),
      title       TEXT NOT NULL,
      amount      INTEGER NOT NULL,
      due_date    TEXT,
      status      TEXT DEFAULT 'Pending',
      paid_on     TEXT
    );

    CREATE TABLE IF NOT EXISTS payments (
      id                        INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id                TEXT NOT NULL REFERENCES students(id),
      fee_record_id             INTEGER REFERENCES fee_records(id),
      stripe_payment_intent_id  TEXT,
      amount                    INTEGER NOT NULL,
      currency                  TEXT DEFAULT 'pkr',
      status                    TEXT DEFAULT 'pending',
      created_at                TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS timetable (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id  TEXT NOT NULL REFERENCES students(id),
      program     TEXT,
      day         TEXT,
      period_1    TEXT,
      period_2    TEXT,
      period_3    TEXT,
      period_4    TEXT,
      period_5    TEXT,
      period_6    TEXT,
      period_7    TEXT
    );

    CREATE TABLE IF NOT EXISTS announcements (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      title     TEXT NOT NULL,
      category  TEXT DEFAULT 'General',
      author    TEXT DEFAULT 'Admin',
      excerpt   TEXT,
      date      TEXT DEFAULT (date('now')),
      icon      TEXT DEFAULT 'fa-solid fa-bullhorn',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS admissions (
      id         TEXT PRIMARY KEY,
      name       TEXT NOT NULL,
      program    TEXT NOT NULL,
      cnic       TEXT,
      email      TEXT,
      status     TEXT DEFAULT 'Pending',
      applied_on TEXT DEFAULT (date('now'))
    );
  `;

    // Split and run each statement
    schema.split(';').forEach(stmt => {
        const s = stmt.trim();
        if (s) {
            try { db.run(s + ';'); } catch (e) { /* already exists */ }
        }
    });
    persistDb();
}

module.exports = { getDb, persistDb, run, all, get, createTables };
