const fs = require('fs');
const express = require('express');
const path = require('path');
const crypto = require('crypto');
const Database = require('better-sqlite3');

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json({ limit: '15mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const dataDir = path.join(__dirname, 'data');
fs.mkdirSync(dataDir, { recursive: true });
const dbPath = process.env.DATABASE_PATH || path.join(dataDir, 'zimamoto.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      label TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      checknumber TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role_code TEXT NOT NULL,
      station_id INTEGER,
      avatar TEXT,
      availability TEXT NOT NULL DEFAULT 'Off duty',
      status_message TEXT NOT NULL DEFAULT '',
      active INTEGER NOT NULL DEFAULT 1,
      email TEXT,
      phone TEXT,
      FOREIGN KEY(role_code) REFERENCES roles(code)
    );
    CREATE TABLE IF NOT EXISTS stations (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      location TEXT,
      commander TEXT,
      officers TEXT,
      status TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      assigned_station_id INTEGER,
      assigned_officers TEXT,
      status TEXT NOT NULL,
      deadline TEXT,
      priority TEXT,
      conditions TEXT,
      history TEXT,
      attachments TEXT,
      feedback TEXT,
      FOREIGN KEY(assigned_station_id) REFERENCES stations(id)
    );
    CREATE TABLE IF NOT EXISTS incidents (
      id INTEGER PRIMARY KEY,
      type TEXT NOT NULL,
      location TEXT,
      date TEXT,
      officers TEXT,
      vehicles TEXT,
      equipment TEXT,
      media TEXT,
      report TEXT
    );
    CREATE TABLE IF NOT EXISTS vehicles (
      id INTEGER PRIMARY KEY,
      plate TEXT NOT NULL,
      chassis TEXT,
      engine TEXT,
      model TEXT,
      capacity TEXT,
      fuel TEXT,
      insurance TEXT,
      status TEXT NOT NULL,
      station_id INTEGER,
      FOREIGN KEY(station_id) REFERENCES stations(id)
    );
    CREATE TABLE IF NOT EXISTS equipment (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      status TEXT NOT NULL,
      station_id INTEGER
    );
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      message TEXT,
      type TEXT,
      date TEXT,
      active INTEGER DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS shifts (
      id INTEGER PRIMARY KEY,
      officer TEXT NOT NULL,
      shift_type TEXT,
      station_id INTEGER,
      date TEXT,
      FOREIGN KEY(station_id) REFERENCES stations(id)
    );
    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY,
      source TEXT,
      message TEXT,
      created_at TEXT,
      user TEXT
    );
    CREATE TABLE IF NOT EXISTS password_resets (
      id INTEGER PRIMARY KEY,
      user_id INTEGER NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires_at TEXT NOT NULL,
      used INTEGER DEFAULT 0,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS auth_sessions (
      token_hash TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS leave_requests (
      id INTEGER PRIMARY KEY,
      user_id INTEGER NOT NULL,
      leave_type TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      reason TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      review_note TEXT NOT NULL DEFAULT '',
      reviewed_by INTEGER,
      reviewed_at TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(reviewed_by) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS training_records (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      coordinator TEXT NOT NULL,
      training_date TEXT NOT NULL,
      location TEXT NOT NULL,
      participants INTEGER NOT NULL DEFAULT 1,
      status TEXT NOT NULL DEFAULT 'Upcoming',
      description TEXT NOT NULL DEFAULT '',
      created_by INTEGER,
      created_at TEXT NOT NULL,
      FOREIGN KEY(created_by) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS performance_goals (
      id INTEGER PRIMARY KEY,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      metric TEXT NOT NULL DEFAULT '',
      deadline TEXT NOT NULL,
      progress INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'Pending',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS user_settings (
      user_id INTEGER PRIMARY KEY,
      theme TEXT NOT NULL DEFAULT 'dark',
      language TEXT NOT NULL DEFAULT 'sw',
      email_notifications INTEGER NOT NULL DEFAULT 1,
      push_notifications INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY,
      user_id INTEGER,
      action TEXT NOT NULL,
      entity TEXT NOT NULL,
      record_id INTEGER,
      details TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
    );
  `);

  const userColumns = new Set(db.prepare('PRAGMA table_info(users)').all().map(column => column.name));
  if (!userColumns.has('avatar')) db.exec('ALTER TABLE users ADD COLUMN avatar TEXT');
  if (!userColumns.has('availability')) db.exec("ALTER TABLE users ADD COLUMN availability TEXT NOT NULL DEFAULT 'Off duty'");
  if (!userColumns.has('status_message')) db.exec("ALTER TABLE users ADD COLUMN status_message TEXT NOT NULL DEFAULT ''");
  if (!userColumns.has('active')) db.exec('ALTER TABLE users ADD COLUMN active INTEGER NOT NULL DEFAULT 1');
  if (!userColumns.has('email')) db.exec('ALTER TABLE users ADD COLUMN email TEXT');
  if (!userColumns.has('phone')) db.exec('ALTER TABLE users ADD COLUMN phone TEXT');
}

function parseJson(value) {
  if (!value) return [];
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}

function normalizeRow(row) {
  if (!row) return null;
  return {
    ...row,
    officers: parseJson(row.officers),
    assigned_officers: parseJson(row.assigned_officers),
    history: parseJson(row.history),
    attachments: parseJson(row.attachments),
    feedback: parseJson(row.feedback),
    vehicles: parseJson(row.vehicles),
    equipment: parseJson(row.equipment),
    media: parseJson(row.media)
  };
}

function seedData() {
  const roleCount = db.prepare('SELECT COUNT(*) AS count FROM roles').get().count;
  if (roleCount > 0) return;

  const insertRole = db.prepare('INSERT INTO roles (code, label) VALUES (?, ?)');
  const insertUser = db.prepare('INSERT INTO users (checknumber, password, name, role_code, station_id) VALUES (?, ?, ?, ?, ?)');
  const insertStation = db.prepare('INSERT INTO stations (name, location, commander, officers, status) VALUES (?, ?, ?, ?, ?)');
  const insertTask = db.prepare('INSERT INTO tasks (title, assigned_station_id, assigned_officers, status, deadline, priority, conditions, history, attachments, feedback) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  const insertIncident = db.prepare('INSERT INTO incidents (type, location, date, officers, vehicles, equipment, media, report) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  const insertVehicle = db.prepare('INSERT INTO vehicles (plate, chassis, engine, model, capacity, fuel, insurance, status, station_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
  const insertEquipment = db.prepare('INSERT INTO equipment (name, status, station_id) VALUES (?, ?, ?)');
  const insertNotification = db.prepare('INSERT INTO notifications (title, message, type, date, active) VALUES (?, ?, ?, ?, ?)');
  const insertShift = db.prepare('INSERT INTO shifts (officer, shift_type, station_id, date) VALUES (?, ?, ?, ?)');
  const insertFeedback = db.prepare('INSERT INTO feedback (source, message, created_at, user) VALUES (?, ?, ?, ?)');

  const roles = [
    ['admin', 'Kamanda wa Mkoa'],
    ['station', 'Kamanda wa Kituo'],
    ['shift', 'Mkuu wa Zamu'],
    ['officer', 'Askari Zimamoto'],
    ['mechanic', 'Fundi Magari'],
    ['equipment', 'Afisa wa Vifaa'],
    ['viewer', 'Viewer / Read-only']
  ];
  roles.forEach(r => insertRole.run(...r));

  insertStation.run('Kituo cha Jiji', 'Dar es Salaam', 'Kamanda A', JSON.stringify(['Askari A', 'Askari B']), 'active');
  insertStation.run('Kituo cha Mjini', 'Arusha', 'Kamanda B', JSON.stringify(['Askari C', 'Askari D']), 'active');
  insertStation.run('Kituo cha Kanda', 'Dodoma', 'Kamanda C', JSON.stringify(['Askari E']), 'maintenance');

  insertUser.run('KAMANDA001', 'admin123', 'Kamanda wa Mkoa', 'admin', null);
  insertUser.run('KAMANDA002', 'station123', 'Kamanda wa Kituo', 'station', 1);
  insertUser.run('ZAMU001', 'shift123', 'Mkuu wa Zamu', 'shift', null);
  insertUser.run('ASKARI001', 'askari123', 'Askari Zimamoto', 'officer', 1);
  insertUser.run('FUNDIA001', 'mechanic123', 'Fundi Magari', 'mechanic', 1);
  insertUser.run('VIFAA001', 'equipment123', 'Afisa wa Vifaa', 'equipment', 2);
  insertUser.run('TEST001', 'test123', 'Test User', 'viewer', null);

  insertTask.run('Kagua Tanki la Maji', 1, JSON.stringify(['Askari A', 'Askari C']), 'in-progress', '2026-08-15', 'High', 'Chapa moto kabla ya 18:00', JSON.stringify(['Created by Kamanda wa Mkoa']), JSON.stringify([]), JSON.stringify([]));
  insertTask.run('Lesson on Hose Repair', 2, JSON.stringify(['Askari B']), 'pending', '2026-08-20', 'Medium', 'Prepare report after training', JSON.stringify(['Created by Kamanda wa Kituo']), JSON.stringify([]), JSON.stringify([]));
  insertTask.run('Inspect Breathing Apparatus', 3, JSON.stringify(['Afisa wa Vifaa']), 'assigned', '2026-08-14', 'High', 'Record faults', JSON.stringify(['Created by Kamanda wa Mkoa']), JSON.stringify([]), JSON.stringify([]));
  insertTask.run('Refuel Chimney Truck', 1, JSON.stringify(['Fundi Magari']), 'completed', '2026-08-12', 'Low', 'Upload receipt', JSON.stringify(['Created by Kamanda wa Kituo']), JSON.stringify([]), JSON.stringify(['Great execution']));
  insertTask.run('Prepare Incident Report', 2, JSON.stringify(['Askari D']), 'delayed', '2026-08-10', 'High', 'Submit before shift ends', JSON.stringify(['Created by Mkuu wa Zamu']), JSON.stringify([]), JSON.stringify([]));
  insertTask.run('Routine Vehicle Check', 3, JSON.stringify(['Fundi Magari']), 'in-progress', '2026-08-18', 'Medium', 'Check tyres and battery', JSON.stringify(['Created by Kamanda wa Mkoa']), JSON.stringify([]), JSON.stringify([]));

  insertIncident.run('Moto wa Nyumbani', 'Mtaa wa Kimara', '2026-08-01', JSON.stringify(['Askari A', 'Askari B']), JSON.stringify(['T 123 ABC']), JSON.stringify(['Breathing Apparatus']), JSON.stringify(['photo1.jpg']), 'Mafanikio, hakuna majeruhi.');
  insertIncident.run('Kutokea kwa Mafusho', 'Kizaazaa cha Gongo la Mboto', '2026-07-28', JSON.stringify(['Askari D']), JSON.stringify(['T 234 DEF']), JSON.stringify(['Hose reel']), JSON.stringify([]), 'Inavyoendelea, utoaji wa maji kwa wakati.');

  insertVehicle.run('T 123 ABC', 'CHS-001', 'ENG-001', 'Rosenbauer', '5000L', 'Diesel', '2027-05-10', 'active', 1);
  insertVehicle.run('T 234 DEF', 'CHS-002', 'ENG-002', 'Magirus', '4000L', 'Diesel', '2026-11-01', 'maintenance', 2);
  insertVehicle.run('T 345 GHI', 'CHS-003', 'ENG-003', 'Scania', '7500L', 'Diesel', '2027-01-12', 'active', 3);

  insertEquipment.run('Hose reel', 'good', 2);
  insertEquipment.run('Breathing Apparatus', 'damaged', 3);
  insertEquipment.run('Fire Suit', 'good', 1);

  insertNotification.run('Mkutano wa Kamanda', 'Mkutano wa wilaya saa 10:00 asubuhi.', 'alert', '2026-08-10', 1);
  insertNotification.run('Mabadiliko ya Ratiba', 'Ratiba mpya ya zamu sasa imetumika.', 'info', '2026-08-09', 1);

  insertShift.run('Askari A', 'Asubuhi', 1, '2026-08-11');
  insertShift.run('Askari B', 'Mchana', 1, '2026-08-11');
  insertShift.run('Askari D', 'Usiku', 2, '2026-08-11');

  insertFeedback.run('Askari A', 'Nahitaji kuhakikisha gari iko tayari', '2026-08-08T08:00:00Z', 'Askari Zimamoto');
}

function getStationName(id) {
  if (!id) return null;
  const row = db.prepare('SELECT name FROM stations WHERE id = ?').get(id);
  return row ? row.name : null;
}

function taskRowToObject(row) {
  return {
    ...normalizeRow(row),
    assignedStation: getStationName(row.assigned_station_id)
  };
}

function incidentRowToObject(row) {
  return normalizeRow(row);
}

function vehicleRowToObject(row) {
  return {
    ...row,
    stationName: getStationName(row.station_id)
  };
}

initSchema();
seedData();

const sessionCookieName = 'zimamoto_session';
const sessionDurationMs = 24 * 60 * 60 * 1000;

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function setSessionCookie(res, userId, persistent = false) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + sessionDurationMs).toISOString();
  db.prepare('INSERT INTO auth_sessions (token_hash, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)')
    .run(hashToken(token), userId, expiresAt, new Date().toISOString());
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  const maxAge = persistent ? `; Max-Age=${Math.floor(sessionDurationMs / 1000)}` : '';
  res.setHeader('Set-Cookie', `${sessionCookieName}=${token}; HttpOnly; SameSite=Strict; Path=/${maxAge}${secure}`);
}

function clearSessionCookie(res) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', `${sessionCookieName}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${secure}`);
}

function requireAuthentication(req, res, next) {
  const cookie = req.headers.cookie || '';
  const token = cookie.split(';').map(part => part.trim()).find(part => part.startsWith(`${sessionCookieName}=`))?.slice(sessionCookieName.length + 1);
  if (!token) return res.status(401).json({ message: 'Sign in required' });
  const session = db.prepare(`
    SELECT u.id, u.checknumber, u.name, u.role_code AS roleCode, u.station_id,
      u.avatar, u.availability, u.status_message, u.active, r.label AS role
    FROM auth_sessions s
    JOIN users u ON u.id = s.user_id
    JOIN roles r ON r.code = u.role_code
    WHERE s.token_hash = ? AND s.expires_at > ?
  `).get(hashToken(token), new Date().toISOString());
  if (!session || !session.active) {
    if (session) db.prepare('DELETE FROM auth_sessions WHERE token_hash = ?').run(hashToken(token));
    clearSessionCookie(res);
    return res.status(401).json({ message: 'Session expired; sign in again' });
  }
  req.user = session;
  req.sessionTokenHash = hashToken(token);
  next();
}

function requireRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.roleCode)) {
      return res.status(403).json({ message: 'You do not have permission to perform this action' });
    }
    next();
  };
}

function recordAudit(req, action, entity, recordId, details = '') {
  db.prepare('INSERT INTO audit_logs (user_id, action, entity, record_id, details, created_at) VALUES (?, ?, ?, ?, ?, ?)')
    .run(req.user?.id ?? null, action, entity, recordId ?? null, details, new Date().toISOString());
}

function validDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

app.post('/api/auth/login', (req, res) => {
  const { checknumber, password } = req.body;
  const user = db.prepare('SELECT u.id, u.checknumber, u.name, u.role_code AS roleCode, u.station_id, u.avatar, u.availability, u.status_message, r.label AS role FROM users u JOIN roles r ON u.role_code = r.code WHERE u.checknumber = ? AND u.password = ? AND u.active = 1').get(checknumber, password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid checknumber or password' });
  }
  setSessionCookie(res, user.id, Boolean(req.body.keepLoggedIn));
  res.json(user);
});

app.post('/api/auth/register', (req, res) => {
  const { checknumber, password, name } = req.body;
  if (!checknumber || !password || !name) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  const existing = db.prepare('SELECT id FROM users WHERE checknumber = ?').get(checknumber);
  if (existing) {
    return res.status(409).json({ message: 'User already exists' });
  }
  try {
    const result = db.prepare('INSERT INTO users (checknumber, password, name, role_code, station_id) VALUES (?, ?, ?, ?, ?)').run(checknumber, password, name, 'officer', null);
    const user = db.prepare('SELECT u.id, u.checknumber, u.name, u.role_code AS roleCode, u.station_id, u.avatar, u.availability, u.status_message, r.label AS role FROM users u JOIN roles r ON u.role_code = r.code WHERE u.id = ?').get(result.lastInsertRowid);
    setSessionCookie(res, user.id, Boolean(req.body.keepLoggedIn));
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

app.post('/api/auth/forgot-password', (req, res) => {
  const { checknumber } = req.body;
  if (!checknumber) {
    return res.status(400).json({ message: 'Checknumber is required' });
  }
  const user = db.prepare('SELECT id, checknumber, name FROM users WHERE checknumber = ?').get(checknumber);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const token = crypto.randomBytes(24).toString('hex');
  const expiresAt = new Date(Date.now() + 3600000).toISOString();
  db.prepare('INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)').run(user.id, token, expiresAt);
  res.json({ 
    message: 'Password reset token created', 
    token: token,
    checknumber: user.checknumber,
    name: user.name
  });
});

app.post('/api/auth/reset-password', (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token and new password are required' });
  }
  const reset = db.prepare('SELECT user_id, expires_at, used FROM password_resets WHERE token = ?').get(token);
  if (!reset) {
    return res.status(404).json({ message: 'Invalid reset token' });
  }
  if (reset.used) {
    return res.status(400).json({ message: 'Reset token already used' });
  }
  if (new Date(reset.expires_at) < new Date()) {
    return res.status(400).json({ message: 'Reset token expired' });
  }
  db.prepare('UPDATE users SET password = ? WHERE id = ?').run(newPassword, reset.user_id);
  db.prepare('UPDATE password_resets SET used = 1 WHERE token = ?').run(token);
  db.prepare('DELETE FROM auth_sessions WHERE user_id = ?').run(reset.user_id);
  res.json({ message: 'Password reset successful' });
});

app.use('/api', requireAuthentication);

app.get('/api/auth/me', (req, res) => {
  const { active, ...user } = req.user;
  res.json(user);
});

app.post('/api/auth/logout', (req, res) => {
  db.prepare('DELETE FROM auth_sessions WHERE token_hash = ?').run(req.sessionTokenHash);
  clearSessionCookie(res);
  res.json({ message: 'Logged out' });
});

app.get('/api/users/:id/profile', (req, res) => {
  if (Number(req.params.id) !== req.user.id) return res.status(403).json({ message: 'You can only view your own profile' });
  const user = db.prepare('SELECT id, checknumber, name, role_code AS roleCode, station_id, avatar, availability, status_message FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

app.put('/api/users/:id/profile', (req, res) => {
  const id = Number(req.params.id);
  if (id !== req.user.id) return res.status(403).json({ message: 'You can only update your own profile' });
  const { currentPassword, name, avatar, availability, status_message } = req.body;
  const existing = db.prepare('SELECT id, password FROM users WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ message: 'User not found' });
  if (!currentPassword || currentPassword !== existing.password) {
    return res.status(401).json({ message: 'Current password is incorrect' });
  }
  if (typeof name !== 'string' || !name.trim() || name.trim().length > 100) {
    return res.status(400).json({ message: 'Name is required and must be 100 characters or fewer' });
  }
  const allowedAvailability = new Set(['Available', 'On duty', 'Off duty', 'On leave']);
  if (!allowedAvailability.has(availability)) {
    return res.status(400).json({ message: 'Choose a valid availability status' });
  }
  if (typeof status_message !== 'string' || status_message.length > 120) {
    return res.status(400).json({ message: 'Status message must be 120 characters or fewer' });
  }
  if (avatar !== null && avatar !== '' && (typeof avatar !== 'string' || !/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(avatar))) {
    return res.status(400).json({ message: 'Profile picture must be a PNG, JPEG, or WebP image' });
  }
  if (typeof avatar === 'string' && avatar.length > 1400000) {
    return res.status(413).json({ message: 'Profile picture must be 1 MB or smaller' });
  }

  db.prepare('UPDATE users SET name = ?, avatar = ?, availability = ?, status_message = ? WHERE id = ?').run(
    name.trim(), avatar || null, availability, status_message.trim(), id
  );
  res.json(db.prepare('SELECT id, checknumber, name, role_code AS roleCode, station_id, avatar, availability, status_message FROM users WHERE id = ?').get(id));
});

app.get('/api/users', (req, res) => {
  if (req.user.roleCode !== 'admin') return res.status(403).json({ message: 'Administrator access required' });
  const rows = db.prepare(`SELECT u.id, u.checknumber, u.name, u.email, u.phone, r.label AS role,
    u.role_code AS roleCode, u.station_id, u.active, u.availability
    FROM users u JOIN roles r ON u.role_code = r.code ORDER BY u.name`).all();
  res.json(rows);
});

app.post('/api/users', requireRoles('admin'), (req, res) => {
  const { checknumber, name, password, role_code, station_id, email, phone } = req.body;
  if (![checknumber, name, password, role_code].every(value => typeof value === 'string' && value.trim())) {
    return res.status(400).json({ message: 'Username, name, password, and role are required' });
  }
  if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
  if (db.prepare('SELECT id FROM users WHERE checknumber = ?').get(checknumber.trim())) {
    return res.status(409).json({ message: 'Username already exists' });
  }
  if (!db.prepare('SELECT code FROM roles WHERE code = ?').get(role_code)) return res.status(400).json({ message: 'Choose a valid role' });
  if (station_id && !db.prepare('SELECT id FROM stations WHERE id = ?').get(Number(station_id))) return res.status(400).json({ message: 'Choose a valid station' });
  const result = db.prepare(`INSERT INTO users (checknumber, password, name, role_code, station_id, email, phone)
    VALUES (?, ?, ?, ?, ?, ?, ?)`).run(checknumber.trim(), password, name.trim(), role_code, station_id ? Number(station_id) : null, email || null, phone || null);
  recordAudit(req, 'create', 'user', result.lastInsertRowid, `role=${role_code}`);
  res.status(201).json(db.prepare(`SELECT id, checknumber, name, email, phone, role_code AS roleCode, station_id, active
    FROM users WHERE id = ?`).get(result.lastInsertRowid));
});

app.put('/api/users/:id', requireRoles('admin'), (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ message: 'User not found' });
  const { name, role_code, station_id, email, phone, active } = req.body;
  if (typeof name !== 'string' || !name.trim()) return res.status(400).json({ message: 'Name is required' });
  if (!db.prepare('SELECT code FROM roles WHERE code = ?').get(role_code)) return res.status(400).json({ message: 'Choose a valid role' });
  if (station_id && !db.prepare('SELECT id FROM stations WHERE id = ?').get(Number(station_id))) return res.status(400).json({ message: 'Choose a valid station' });
  const isActive = active === false || active === 0 ? 0 : 1;
  if (id === req.user.id && (!isActive || role_code !== 'admin')) return res.status(400).json({ message: 'You cannot deactivate or remove your own administrator access' });
  db.prepare(`UPDATE users SET name = ?, role_code = ?, station_id = ?, email = ?, phone = ?, active = ? WHERE id = ?`)
    .run(name.trim(), role_code, station_id ? Number(station_id) : null, email || null, phone || null, isActive, id);
  if (!isActive) db.prepare('DELETE FROM auth_sessions WHERE user_id = ?').run(id);
  recordAudit(req, 'update', 'user', id, `role=${role_code}; active=${isActive}`);
  res.json(db.prepare(`SELECT id, checknumber, name, email, phone, role_code AS roleCode, station_id, active
    FROM users WHERE id = ?`).get(id));
});

app.get('/api/roles', (req, res) => {
  res.json(db.prepare('SELECT * FROM roles').all());
});

app.get('/api/notices', (req, res) => {
  res.json(db.prepare('SELECT * FROM notifications ORDER BY date DESC, id DESC').all());
});

app.post('/api/notices', requireRoles('admin', 'station'), (req, res) => {
  const { title, message, type, date } = req.body;
  if (typeof title !== 'string' || !title.trim()) return res.status(400).json({ message: 'Notice title is required' });
  if (!['alert', 'info', 'warning', 'event'].includes(type)) return res.status(400).json({ message: 'Choose a valid notice type' });
  const noticeDate = date || new Date().toISOString().slice(0, 10);
  if (!validDate(noticeDate)) return res.status(400).json({ message: 'Notice date must use YYYY-MM-DD' });
  const result = db.prepare('INSERT INTO notifications (title, message, type, date, active) VALUES (?, ?, ?, ?, 1)')
    .run(title.trim(), String(message || '').trim(), type, noticeDate);
  recordAudit(req, 'create', 'notice', result.lastInsertRowid);
  res.status(201).json(db.prepare('SELECT * FROM notifications WHERE id = ?').get(result.lastInsertRowid));
});

app.put('/api/notices/:id', requireRoles('admin', 'station'), (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM notifications WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ message: 'Notice not found' });
  const { title, message, type, date, active } = req.body;
  const nextTitle = typeof title === 'string' ? title.trim() : existing.title;
  const nextType = type || existing.type;
  const nextDate = date || existing.date;
  if (!nextTitle) return res.status(400).json({ message: 'Notice title is required' });
  if (!['alert', 'info', 'warning', 'event'].includes(nextType)) return res.status(400).json({ message: 'Choose a valid notice type' });
  if (!validDate(nextDate)) return res.status(400).json({ message: 'Notice date must use YYYY-MM-DD' });
  db.prepare('UPDATE notifications SET title = ?, message = ?, type = ?, date = ?, active = ? WHERE id = ?')
    .run(nextTitle, message === undefined ? existing.message : String(message).trim(), nextType, nextDate, active === false ? 0 : 1, id);
  recordAudit(req, 'update', 'notice', id);
  res.json(db.prepare('SELECT * FROM notifications WHERE id = ?').get(id));
});

app.delete('/api/notices/:id', requireRoles('admin', 'station'), (req, res) => {
  const id = Number(req.params.id);
  const notice = db.prepare('SELECT * FROM notifications WHERE id = ?').get(id);
  if (!notice) return res.status(404).json({ message: 'Notice not found' });
  db.prepare('DELETE FROM notifications WHERE id = ?').run(id);
  recordAudit(req, 'delete', 'notice', id);
  res.json(notice);
});

app.get('/api/leave', (req, res) => {
  const canReview = ['admin', 'station', 'shift'].includes(req.user.roleCode);
  const query = `SELECT l.*, u.name AS employee, u.checknumber, reviewer.name AS reviewer
    FROM leave_requests l JOIN users u ON u.id = l.user_id
    LEFT JOIN users reviewer ON reviewer.id = l.reviewed_by
    ${canReview ? '' : 'WHERE l.user_id = ?'} ORDER BY l.created_at DESC`;
  res.json(canReview ? db.prepare(query).all() : db.prepare(query).all(req.user.id));
});

app.post('/api/leave', (req, res) => {
  const { leave_type, start_date, end_date, reason } = req.body;
  if (typeof leave_type !== 'string' || !leave_type.trim() || !validDate(start_date) || !validDate(end_date) || start_date > end_date || typeof reason !== 'string' || !reason.trim()) {
    return res.status(400).json({ message: 'Provide a leave type, valid date range, and reason' });
  }
  const result = db.prepare(`INSERT INTO leave_requests (user_id, leave_type, start_date, end_date, reason, created_at)
    VALUES (?, ?, ?, ?, ?, ?)`).run(req.user.id, leave_type.trim(), start_date, end_date, reason.trim(), new Date().toISOString());
  recordAudit(req, 'create', 'leave_request', result.lastInsertRowid);
  res.status(201).json(db.prepare('SELECT * FROM leave_requests WHERE id = ?').get(result.lastInsertRowid));
});

app.patch('/api/leave/:id/review', requireRoles('admin', 'station', 'shift'), (req, res) => {
  const id = Number(req.params.id);
  const { status, review_note = '' } = req.body;
  if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ message: 'Review status must be approved or rejected' });
  const existing = db.prepare('SELECT * FROM leave_requests WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ message: 'Leave request not found' });
  if (existing.status !== 'pending') return res.status(409).json({ message: 'This leave request has already been reviewed' });
  db.prepare('UPDATE leave_requests SET status = ?, review_note = ?, reviewed_by = ?, reviewed_at = ? WHERE id = ?')
    .run(status, String(review_note).slice(0, 500), req.user.id, new Date().toISOString(), id);
  recordAudit(req, status, 'leave_request', id);
  res.json(db.prepare('SELECT * FROM leave_requests WHERE id = ?').get(id));
});

app.delete('/api/leave/:id', (req, res) => {
  const id = Number(req.params.id);
  const request = db.prepare('SELECT * FROM leave_requests WHERE id = ?').get(id);
  if (!request) return res.status(404).json({ message: 'Leave request not found' });
  const mayDelete = request.user_id === req.user.id && request.status === 'pending' || req.user.roleCode === 'admin';
  if (!mayDelete) return res.status(403).json({ message: 'Only the owner of a pending request or an administrator can remove it' });
  db.prepare('DELETE FROM leave_requests WHERE id = ?').run(id);
  recordAudit(req, 'delete', 'leave_request', id);
  res.json(request);
});

app.get('/api/training', (req, res) => {
  res.json(db.prepare(`SELECT t.*, creator.name AS creator_name FROM training_records t
    LEFT JOIN users creator ON creator.id = t.created_by ORDER BY t.training_date DESC, t.id DESC`).all());
});

app.post('/api/training', requireRoles('admin', 'station', 'shift'), (req, res) => {
  const { name, coordinator, training_date, location, participants = 1, status = 'Upcoming', description = '' } = req.body;
  if (![name, coordinator, location].every(value => typeof value === 'string' && value.trim()) || !validDate(training_date)) {
    return res.status(400).json({ message: 'Training name, coordinator, location, and a valid date are required' });
  }
  const participantCount = Number(participants);
  if (!Number.isInteger(participantCount) || participantCount < 1 || participantCount > 10000) return res.status(400).json({ message: 'Participant count must be from 1 to 10,000' });
  if (!['Upcoming', 'In Progress', 'Completed', 'Cancelled'].includes(status)) return res.status(400).json({ message: 'Choose a valid training status' });
  const result = db.prepare(`INSERT INTO training_records (name, coordinator, training_date, location, participants, status, description, created_by, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(name.trim(), coordinator.trim(), training_date, location.trim(), participantCount, status, String(description).slice(0, 2000), req.user.id, new Date().toISOString());
  recordAudit(req, 'create', 'training', result.lastInsertRowid);
  res.status(201).json(db.prepare('SELECT * FROM training_records WHERE id = ?').get(result.lastInsertRowid));
});

app.put('/api/training/:id', requireRoles('admin', 'station', 'shift'), (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM training_records WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ message: 'Training record not found' });
  const values = {
    name: req.body.name ?? existing.name,
    coordinator: req.body.coordinator ?? existing.coordinator,
    training_date: req.body.training_date ?? existing.training_date,
    location: req.body.location ?? existing.location,
    participants: req.body.participants ?? existing.participants,
    status: req.body.status ?? existing.status,
    description: req.body.description ?? existing.description
  };
  if (![values.name, values.coordinator, values.location].every(value => typeof value === 'string' && value.trim()) || !validDate(values.training_date)) return res.status(400).json({ message: 'Invalid training details or date' });
  if (!Number.isInteger(Number(values.participants)) || Number(values.participants) < 1 || Number(values.participants) > 10000) return res.status(400).json({ message: 'Participant count must be from 1 to 10,000' });
  if (!['Upcoming', 'In Progress', 'Completed', 'Cancelled'].includes(values.status)) return res.status(400).json({ message: 'Choose a valid training status' });
  db.prepare(`UPDATE training_records SET name = ?, coordinator = ?, training_date = ?, location = ?, participants = ?, status = ?, description = ? WHERE id = ?`)
    .run(values.name.trim(), values.coordinator.trim(), values.training_date, values.location.trim(), Number(values.participants), values.status, String(values.description).slice(0, 2000), id);
  recordAudit(req, 'update', 'training', id);
  res.json(db.prepare('SELECT * FROM training_records WHERE id = ?').get(id));
});

app.delete('/api/training/:id', requireRoles('admin', 'station'), (req, res) => {
  const id = Number(req.params.id);
  const row = db.prepare('SELECT * FROM training_records WHERE id = ?').get(id);
  if (!row) return res.status(404).json({ message: 'Training record not found' });
  db.prepare('DELETE FROM training_records WHERE id = ?').run(id);
  recordAudit(req, 'delete', 'training', id);
  res.json(row);
});

app.get('/api/performance', (req, res) => {
  const isManager = ['admin', 'station'].includes(req.user.roleCode);
  const query = `SELECT g.*, u.name AS employee FROM performance_goals g JOIN users u ON u.id = g.user_id
    ${isManager ? '' : 'WHERE g.user_id = ?'} ORDER BY g.deadline ASC, g.id DESC`;
  res.json(isManager ? db.prepare(query).all() : db.prepare(query).all(req.user.id));
});

app.post('/api/performance', (req, res) => {
  const { name, metric = '', deadline, progress = 0, status = 'Pending' } = req.body;
  const amount = Number(progress);
  if (typeof name !== 'string' || !name.trim() || !validDate(deadline)) return res.status(400).json({ message: 'Goal name and valid deadline are required' });
  if (!Number.isInteger(amount) || amount < 0 || amount > 100) return res.status(400).json({ message: 'Progress must be from 0 to 100' });
  if (!['Pending', 'In Progress', 'Completed'].includes(status)) return res.status(400).json({ message: 'Choose a valid goal status' });
  const timestamp = new Date().toISOString();
  const result = db.prepare(`INSERT INTO performance_goals (user_id, name, metric, deadline, progress, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(req.user.id, name.trim(), String(metric).slice(0, 200), deadline, amount, status, timestamp, timestamp);
  recordAudit(req, 'create', 'performance_goal', result.lastInsertRowid);
  res.status(201).json(db.prepare('SELECT * FROM performance_goals WHERE id = ?').get(result.lastInsertRowid));
});

app.put('/api/performance/:id', (req, res) => {
  const id = Number(req.params.id);
  const goal = db.prepare('SELECT * FROM performance_goals WHERE id = ?').get(id);
  if (!goal) return res.status(404).json({ message: 'Goal not found' });
  if (goal.user_id !== req.user.id && !['admin', 'station'].includes(req.user.roleCode)) return res.status(403).json({ message: 'You can only edit your own goals' });
  const values = { name: req.body.name ?? goal.name, metric: req.body.metric ?? goal.metric, deadline: req.body.deadline ?? goal.deadline, progress: Number(req.body.progress ?? goal.progress), status: req.body.status ?? goal.status };
  if (typeof values.name !== 'string' || !values.name.trim() || !validDate(values.deadline) || !Number.isInteger(values.progress) || values.progress < 0 || values.progress > 100 || !['Pending', 'In Progress', 'Completed'].includes(values.status)) return res.status(400).json({ message: 'Invalid goal details' });
  db.prepare('UPDATE performance_goals SET name = ?, metric = ?, deadline = ?, progress = ?, status = ?, updated_at = ? WHERE id = ?')
    .run(values.name.trim(), String(values.metric).slice(0, 200), values.deadline, values.progress, values.status, new Date().toISOString(), id);
  recordAudit(req, 'update', 'performance_goal', id);
  res.json(db.prepare('SELECT * FROM performance_goals WHERE id = ?').get(id));
});

app.delete('/api/performance/:id', (req, res) => {
  const id = Number(req.params.id);
  const goal = db.prepare('SELECT * FROM performance_goals WHERE id = ?').get(id);
  if (!goal) return res.status(404).json({ message: 'Goal not found' });
  if (goal.user_id !== req.user.id && !['admin', 'station'].includes(req.user.roleCode)) return res.status(403).json({ message: 'You can only delete your own goals' });
  db.prepare('DELETE FROM performance_goals WHERE id = ?').run(id);
  recordAudit(req, 'delete', 'performance_goal', id);
  res.json(goal);
});

app.get('/api/settings', (req, res) => {
  const settings = db.prepare('SELECT theme, language, email_notifications, push_notifications FROM user_settings WHERE user_id = ?').get(req.user.id);
  res.json(settings || { theme: 'dark', language: 'sw', email_notifications: 1, push_notifications: 1 });
});

app.put('/api/settings', (req, res) => {
  const existing = db.prepare('SELECT * FROM user_settings WHERE user_id = ?').get(req.user.id);
  const theme = req.body.theme ?? existing?.theme ?? 'dark';
  const language = req.body.language ?? existing?.language ?? 'sw';
  const emailNotifications = req.body.email_notifications ?? Boolean(existing?.email_notifications ?? 1);
  const pushNotifications = req.body.push_notifications ?? Boolean(existing?.push_notifications ?? 1);
  if (!['dark', 'light'].includes(theme) || !['sw', 'en'].includes(language)) return res.status(400).json({ message: 'Invalid theme or language' });
  db.prepare(`INSERT INTO user_settings (user_id, theme, language, email_notifications, push_notifications)
    VALUES (?, ?, ?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET theme = excluded.theme, language = excluded.language,
    email_notifications = excluded.email_notifications, push_notifications = excluded.push_notifications`)
    .run(req.user.id, theme, language, emailNotifications ? 1 : 0, pushNotifications ? 1 : 0);
  res.json(db.prepare('SELECT theme, language, email_notifications, push_notifications FROM user_settings WHERE user_id = ?').get(req.user.id));
});

app.get('/api/audit', requireRoles('admin'), (req, res) => {
  res.json(db.prepare(`SELECT a.*, u.name AS actor FROM audit_logs a LEFT JOIN users u ON u.id = a.user_id ORDER BY a.id DESC LIMIT 500`).all());
});

app.get('/api/backup/export', requireRoles('admin'), (req, res) => {
  const data = {
    stations: db.prepare('SELECT * FROM stations').all(),
    tasks: db.prepare('SELECT * FROM tasks').all(),
    incidents: db.prepare('SELECT * FROM incidents').all(),
    vehicles: db.prepare('SELECT * FROM vehicles').all(),
    equipment: db.prepare('SELECT * FROM equipment').all(),
    shifts: db.prepare('SELECT * FROM shifts').all(),
    notifications: db.prepare('SELECT * FROM notifications').all(),
    feedback: db.prepare('SELECT * FROM feedback').all(),
    leave: db.prepare('SELECT * FROM leave_requests').all(),
    training: db.prepare('SELECT * FROM training_records').all(),
    performance: db.prepare('SELECT * FROM performance_goals').all(),
    settings: db.prepare('SELECT theme, language, email_notifications, push_notifications FROM user_settings WHERE user_id = ?').get(req.user.id),
    users: db.prepare('SELECT id, checknumber, name, role_code, station_id, email, phone, avatar, availability, status_message, active FROM users').all()
  };
  recordAudit(req, 'export', 'backup', null);
  res.json({ format: 'zimamoto-backup', version: 1, exportedAt: new Date().toISOString(), data });
});

app.post('/api/backup/import', requireRoles('admin'), (req, res) => {
  const data = req.body?.data && typeof req.body.data === 'object' ? req.body.data : req.body;
  if (!data || typeof data !== 'object' || Array.isArray(data)) return res.status(400).json({ message: 'Backup JSON must contain an object of records' });
  const list = value => Array.isArray(value) ? value.slice(0, 5000) : [];
  const counts = { tasks: 0, vehicles: 0, equipment: 0, shifts: 0, notices: 0, training: 0, leave: 0, performance: 0, skipped: 0 };
  const importRows = db.transaction(() => {
    const stationIdFor = name => {
      if (!name) return null;
      return db.prepare('SELECT id FROM stations WHERE lower(name) = lower(?)').get(String(name).trim())?.id || null;
    };

    for (const row of list(data.tasks)) {
      const title = String(row.title || '').trim();
      const deadline = row.deadline || row.dueDate;
      if (!title || !validDate(deadline)) { counts.skipped++; continue; }
      if (db.prepare('SELECT id FROM tasks WHERE title = ? AND deadline = ?').get(title, deadline)) { counts.skipped++; continue; }
      const statusMap = { pending: 'pending', assigned: 'assigned', 'in progress': 'in-progress', 'in-progress': 'in-progress', completed: 'completed', delayed: 'delayed', cancelled: 'cancelled' };
      const status = statusMap[String(row.status || 'pending').toLowerCase()] || 'pending';
      const priority = ['Low', 'Medium', 'High'].includes(row.priority) ? row.priority : 'Medium';
      const assignedTo = String(row.assignedTo || row.assigned_to || '').trim();
      db.prepare(`INSERT INTO tasks (title, assigned_station_id, assigned_officers, status, deadline, priority, conditions, history, attachments, feedback)
        VALUES (?, NULL, ?, ?, ?, ?, ?, ?, '[]', '[]')`).run(title.slice(0, 200), JSON.stringify(assignedTo ? [assignedTo] : []), status, deadline, priority, String(row.conditions || '').slice(0, 1000), JSON.stringify(['Imported from standalone dashboard']));
      counts.tasks++;
    }

    for (const row of list(data.vehicles)) {
      const plate = String(row.plate || row.registration || '').trim();
      const model = String(row.model || row.type || '').trim();
      if (!plate) { counts.skipped++; continue; }
      if (db.prepare('SELECT id FROM vehicles WHERE plate = ?').get(plate)) { counts.skipped++; continue; }
      const statusText = String(row.status || 'Active').toLowerCase();
      const status = statusText === 'active' ? 'active' : 'maintenance';
      const stationId = stationIdFor(row.station);
      db.prepare(`INSERT INTO vehicles (plate, chassis, engine, model, capacity, fuel, insurance, status, station_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(plate.slice(0, 80), String(row.chassis || '').slice(0, 100), String(row.engine || '').slice(0, 100), model.slice(0, 120), String(row.capacity || '').slice(0, 60), String(row.fuel || '').slice(0, 60), String(row.insurance || row.lastMaintenance || '').slice(0, 100), status, stationId);
      counts.vehicles++;
    }

    for (const row of list(data.equipment)) {
      const name = String(row.name || '').trim();
      if (!name) { counts.skipped++; continue; }
      if (db.prepare('SELECT id FROM equipment WHERE lower(name) = lower(?)').get(name)) { counts.skipped++; continue; }
      const statusText = String(row.status || 'Good').toLowerCase();
      const status = ['good', 'ready', 'active'].includes(statusText) ? 'good' : statusText.includes('out') ? 'out of service' : 'damaged';
      const stationId = stationIdFor(row.station);
      db.prepare('INSERT INTO equipment (name, status, station_id) VALUES (?, ?, ?)').run(name.slice(0, 200), status, stationId);
      counts.equipment++;
    }

    for (const row of list(data.shifts)) {
      const officer = String(row.supervisor || row.officer || '').trim();
      const date = row.date;
      if (!officer || !validDate(date)) { counts.skipped++; continue; }
      const shiftType = String(row.name || row.shift_type || 'Shift').slice(0, 100);
      if (db.prepare('SELECT id FROM shifts WHERE officer = ? AND shift_type = ? AND date = ?').get(officer, shiftType, date)) { counts.skipped++; continue; }
      const stationId = stationIdFor(row.station);
      db.prepare('INSERT INTO shifts (officer, shift_type, station_id, date) VALUES (?, ?, ?, ?)').run(officer, shiftType, stationId, date);
      counts.shifts++;
    }

    const notifications = list(data.notifications).concat(list(data.notices));
    for (const row of notifications) {
      const title = String(row.title || '').trim();
      const date = row.date || new Date().toISOString().slice(0, 10);
      const message = String(row.message ?? row.body ?? '').slice(0, 2000);
      const type = ['alert', 'info', 'warning', 'event'].includes(row.type) ? row.type : 'info';
      if (!title || !validDate(date)) { counts.skipped++; continue; }
      if (db.prepare(`SELECT id FROM notifications WHERE title = ? AND date = ? AND COALESCE(message, '') = ?`).get(title, date, message)) { counts.skipped++; continue; }
      db.prepare('INSERT INTO notifications (title, message, type, date, active) VALUES (?, ?, ?, ?, ?)')
        .run(title.slice(0, 200), message, type, date, row.active === false ? 0 : 1);
      counts.notices++;
    }

    for (const row of list(data.training)) {
      const name = String(row.name || '').trim();
      const coordinator = String(row.coordinator || '').trim();
      const date = row.training_date || row.date;
      const location = String(row.location || '').trim();
      if (!name || !coordinator || !location || !validDate(date)) { counts.skipped++; continue; }
      if (db.prepare('SELECT id FROM training_records WHERE name = ? AND training_date = ?').get(name, date)) { counts.skipped++; continue; }
      const rawStatus = String(row.status || 'Upcoming');
      const status = rawStatus === 'Ongoing' ? 'In Progress' : ['Upcoming', 'In Progress', 'Completed', 'Cancelled'].includes(rawStatus) ? rawStatus : 'Upcoming';
      const participants = Math.min(10000, Math.max(1, Number(row.participants) || 1));
      db.prepare(`INSERT INTO training_records (name, coordinator, training_date, location, participants, status, description, created_by, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(name.slice(0, 200), coordinator.slice(0, 120), date, location.slice(0, 200), participants, status, String(row.description || '').slice(0, 2000), req.user.id, new Date().toISOString());
      counts.training++;
    }

    for (const row of list(data.leave)) {
      const startDate = row.start_date || row.from;
      const endDate = row.end_date || row.to;
      const name = String(row.employee || row.name || '').trim();
      const matched = name ? db.prepare('SELECT id FROM users WHERE name = ? OR checknumber = ?').get(name, name) : null;
      if (!matched || !validDate(startDate) || !validDate(endDate) || startDate > endDate) { counts.skipped++; continue; }
      const oldStatus = String(row.status || 'pending').toLowerCase();
      const status = ['approved', 'rejected'].includes(oldStatus) ? oldStatus : 'pending';
      const leaveType = String(row.leave_type || row.type || 'Annual').slice(0, 100);
      if (db.prepare('SELECT id FROM leave_requests WHERE user_id = ? AND leave_type = ? AND start_date = ? AND end_date = ?').get(matched.id, leaveType, startDate, endDate)) { counts.skipped++; continue; }
      const reviewer = status === 'pending' ? null : req.user.id;
      db.prepare(`INSERT INTO leave_requests (user_id, leave_type, start_date, end_date, reason, status, review_note, reviewed_by, reviewed_at, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(matched.id, leaveType, startDate, endDate, String(row.reason || '').slice(0, 1000), status, '', reviewer, reviewer ? new Date().toISOString() : null, new Date().toISOString());
      counts.leave++;
    }

    for (const row of list(data.performance)) {
      const name = String(row.name || '').trim();
      if (!name || !validDate(row.deadline)) { counts.skipped++; continue; }
      if (db.prepare('SELECT id FROM performance_goals WHERE user_id = ? AND name = ? AND deadline = ?').get(req.user.id, name, row.deadline)) { counts.skipped++; continue; }
      const progress = Math.min(100, Math.max(0, Number(row.progress) || 0));
      const status = ['Pending', 'In Progress', 'Completed'].includes(row.status) ? row.status : 'Pending';
      const timestamp = new Date().toISOString();
      db.prepare(`INSERT INTO performance_goals (user_id, name, metric, deadline, progress, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(req.user.id, name.slice(0, 200), String(row.metric || '').slice(0, 200), row.deadline, progress, status, timestamp, timestamp);
      counts.performance++;
    }

    const settings = data.settings || { theme: data.theme, language: data.lang };
    if (['dark', 'light'].includes(settings.theme) && ['sw', 'en'].includes(settings.language)) {
      db.prepare(`INSERT INTO user_settings (user_id, theme, language, email_notifications, push_notifications)
        VALUES (?, ?, ?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET theme = excluded.theme, language = excluded.language,
        email_notifications = excluded.email_notifications, push_notifications = excluded.push_notifications`)
        .run(req.user.id, settings.theme, settings.language, settings.email_notifications === false ? 0 : 1, settings.push_notifications === false ? 0 : 1);
    }
  });

  try {
    importRows();
  } catch (error) {
    return res.status(400).json({ message: `Import rolled back: ${error.message}` });
  }
  recordAudit(req, 'import', 'backup', null, JSON.stringify(counts));
  res.json({ message: 'Import completed additively; duplicate records were skipped, existing users and passwords were not imported or changed.', counts });
});

app.get('/api/dashboard', (req, res) => {
  const totalUsers = db.prepare('SELECT COUNT(*) AS count FROM users').get().count;
  const stationsCount = db.prepare('SELECT COUNT(*) AS count FROM stations').get().count;
  const tasksCount = db.prepare('SELECT COUNT(*) AS count FROM tasks').get().count;
  const completed = db.prepare("SELECT COUNT(*) AS count FROM tasks WHERE status = 'completed'").get().count;
  const inProgress = db.prepare("SELECT COUNT(*) AS count FROM tasks WHERE status = 'in-progress'").get().count;
  const pending = db.prepare("SELECT COUNT(*) AS count FROM tasks WHERE status IN ('pending', 'assigned')").get().count;
  const delayed = db.prepare("SELECT COUNT(*) AS count FROM tasks WHERE status = 'delayed'").get().count;
  const vehiclesActive = db.prepare("SELECT COUNT(*) AS count FROM vehicles WHERE status = 'active'").get().count;
  const maintenance = db.prepare("SELECT COUNT(*) AS count FROM vehicles WHERE status = 'maintenance'").get().count;
  const brokenEquipment = db.prepare("SELECT COUNT(*) AS count FROM equipment WHERE status != 'good'").get().count;
  const incidentReports = db.prepare('SELECT COUNT(*) AS count FROM incidents').get().count;
  const notificationCount = db.prepare('SELECT COUNT(*) AS count FROM notifications WHERE active = 1').get().count;
  const pendingLeave = db.prepare("SELECT COUNT(*) AS count FROM leave_requests WHERE status = 'pending'").get().count;
  const trainingUpcoming = db.prepare("SELECT COUNT(*) AS count FROM training_records WHERE status = 'Upcoming'").get().count;
  const performanceGoals = db.prepare("SELECT COUNT(*) AS count FROM performance_goals WHERE status != 'Completed'").get().count;

  const stations = db.prepare('SELECT * FROM stations').all().map(normalizeRow);
  const tasks = db.prepare('SELECT t.*, s.name AS assignedStation FROM tasks t LEFT JOIN stations s ON t.assigned_station_id = s.id').all().map(taskRowToObject);
  const incidents = db.prepare('SELECT * FROM incidents').all().map(incidentRowToObject);
  const vehicles = db.prepare('SELECT * FROM vehicles').all().map(vehicleRowToObject);
  const equipment = db.prepare('SELECT * FROM equipment').all();
  const notifications = db.prepare('SELECT * FROM notifications WHERE active = 1 ORDER BY date DESC').all();
  const shifts = db.prepare('SELECT s.*, st.name AS stationName FROM shifts s LEFT JOIN stations st ON s.station_id = st.id ORDER BY date ASC').all();
  const feedback = db.prepare('SELECT * FROM feedback ORDER BY created_at DESC').all();

  res.json({
    userCount: totalUsers,
    stationCount: stationsCount,
    taskCount: tasksCount,
    completed,
    inProgress,
    pending,
    delayed,
    vehiclesActive,
    maintenance,
    brokenEquipment,
    incidentReports,
    notificationCount,
    pendingLeave,
    trainingUpcoming,
    performanceGoals,
    stations,
    tasks,
    incidents,
    vehicles,
    equipment,
    notifications,
    shifts,
    feedback
  });
});

app.get('/api/stations', (req, res) => {
  res.json(db.prepare('SELECT * FROM stations').all().map(normalizeRow));
});

app.post('/api/stations', requireRoles('admin', 'station'), (req, res) => {
  const { name, location, commander, officers, status } = req.body;
  const officersJson = JSON.stringify(Array.isArray(officers) ? officers : String(officers || '').split(',').map(o => o.trim()).filter(Boolean));
  const result = db.prepare('INSERT INTO stations (name, location, commander, officers, status) VALUES (?, ?, ?, ?, ?)').run(name, location, commander, officersJson, status || 'active');
  res.status(201).json(db.prepare('SELECT * FROM stations WHERE id = ?').get(result.lastInsertRowid));
});

app.put('/api/stations/:id', requireRoles('admin', 'station'), (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM stations WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Station not found' });
  const { name, location, commander, officers, status } = req.body;
  const officersJson = JSON.stringify(Array.isArray(officers) ? officers : String(officers || '').split(',').map(o => o.trim()).filter(Boolean));
  db.prepare('UPDATE stations SET name = ?, location = ?, commander = ?, officers = ?, status = ? WHERE id = ?').run(name || existing.name, location || existing.location, commander || existing.commander, officersJson, status || existing.status, id);
  res.json(db.prepare('SELECT * FROM stations WHERE id = ?').get(id));
});

app.delete('/api/stations/:id', requireRoles('admin', 'station'), (req, res) => {
  const id = Number(req.params.id);
  const removed = db.prepare('SELECT * FROM stations WHERE id = ?').get(id);
  if (!removed) return res.status(404).json({ error: 'Station not found' });
  db.prepare('DELETE FROM stations WHERE id = ?').run(id);
  res.json(removed);
});

app.get('/api/tasks', (req, res) => {
  const rows = db.prepare('SELECT t.*, s.name AS assignedStation FROM tasks t LEFT JOIN stations s ON t.assigned_station_id = s.id').all();
  res.json(rows.map(taskRowToObject));
});

app.post('/api/tasks', requireRoles('admin', 'station', 'shift'), (req, res) => {
  const { title, assigned_station_id, assigned_officers, status, deadline, priority, conditions } = req.body;
  const officersJson = JSON.stringify(Array.isArray(assigned_officers) ? assigned_officers : String(assigned_officers || '').split(',').map(o => o.trim()).filter(Boolean));
  const historyJson = JSON.stringify(['Created']);
  const attachmentsJson = JSON.stringify([]);
  const feedbackJson = JSON.stringify([]);
  const result = db.prepare('INSERT INTO tasks (title, assigned_station_id, assigned_officers, status, deadline, priority, conditions, history, attachments, feedback) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(title, assigned_station_id || null, officersJson, status || 'pending', deadline || null, priority || 'Normal', conditions || '', historyJson, attachmentsJson, feedbackJson);
  res.status(201).json(taskRowToObject(db.prepare('SELECT t.*, s.name AS assignedStation FROM tasks t LEFT JOIN stations s ON t.assigned_station_id = s.id WHERE t.id = ?').get(result.lastInsertRowid)));
});

app.put('/api/tasks/:id', requireRoles('admin', 'station', 'shift'), (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Task not found' });
  const { title, assigned_station_id, assigned_officers, status, deadline, priority, conditions, history } = req.body;
  const officersJson = JSON.stringify(Array.isArray(assigned_officers) ? assigned_officers : String(assigned_officers || existing.assigned_officers || '').split(',').map(o => o.trim()).filter(Boolean));
  const historyJson = JSON.stringify(Array.isArray(history) ? history : parseJson(existing.history).concat(history ? [history] : []));
  db.prepare('UPDATE tasks SET title = ?, assigned_station_id = ?, assigned_officers = ?, status = ?, deadline = ?, priority = ?, conditions = ?, history = ? WHERE id = ?').run(title || existing.title, assigned_station_id || existing.assigned_station_id, officersJson, status || existing.status, deadline || existing.deadline, priority || existing.priority, conditions || existing.conditions, historyJson, id);
  res.json(taskRowToObject(db.prepare('SELECT t.*, s.name AS assignedStation FROM tasks t LEFT JOIN stations s ON t.assigned_station_id = s.id WHERE t.id = ?').get(id)));
});

app.delete('/api/tasks/:id', requireRoles('admin', 'station'), (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Task not found' });
  db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  res.json(existing);
});

app.get('/api/incidents', (req, res) => {
  res.json(db.prepare('SELECT * FROM incidents').all().map(incidentRowToObject));
});

app.post('/api/incidents', requireRoles('admin', 'station', 'shift', 'officer'), (req, res) => {
  const { type, location, date, officers, vehicles, equipment, media, report } = req.body;
  const officersJson = JSON.stringify(Array.isArray(officers) ? officers : String(officers || '').split(',').map(o => o.trim()).filter(Boolean));
  const vehiclesJson = JSON.stringify(Array.isArray(vehicles) ? vehicles : String(vehicles || '').split(',').map(v => v.trim()).filter(Boolean));
  const equipmentJson = JSON.stringify(Array.isArray(equipment) ? equipment : String(equipment || '').split(',').map(e => e.trim()).filter(Boolean));
  const mediaJson = JSON.stringify(Array.isArray(media) ? media : String(media || '').split(',').map(m => m.trim()).filter(Boolean));
  const result = db.prepare('INSERT INTO incidents (type, location, date, officers, vehicles, equipment, media, report) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(type, location, date, officersJson, vehiclesJson, equipmentJson, mediaJson, report || '');
  res.status(201).json(incidentRowToObject(db.prepare('SELECT * FROM incidents WHERE id = ?').get(result.lastInsertRowid)));
});

app.put('/api/incidents/:id', requireRoles('admin', 'station', 'shift'), (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM incidents WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Incident not found' });
  const { type, location, date, officers, vehicles, equipment, media, report } = req.body;
  const officersJson = JSON.stringify(Array.isArray(officers) ? officers : String(officers ?? existing.officers ?? '').split(',').map(o => o.trim()).filter(Boolean));
  const vehiclesJson = JSON.stringify(Array.isArray(vehicles) ? vehicles : String(vehicles ?? existing.vehicles ?? '').split(',').map(v => v.trim()).filter(Boolean));
  const equipmentJson = JSON.stringify(Array.isArray(equipment) ? equipment : String(equipment ?? existing.equipment ?? '').split(',').map(e => e.trim()).filter(Boolean));
  const mediaJson = JSON.stringify(Array.isArray(media) ? media : String(media ?? existing.media ?? '').split(',').map(m => m.trim()).filter(Boolean));
  db.prepare('UPDATE incidents SET type = ?, location = ?, date = ?, officers = ?, vehicles = ?, equipment = ?, media = ?, report = ? WHERE id = ?').run(type || existing.type, location || existing.location, date || existing.date, officersJson, vehiclesJson, equipmentJson, mediaJson, report ?? existing.report, id);
  res.json(incidentRowToObject(db.prepare('SELECT * FROM incidents WHERE id = ?').get(id)));
});

app.delete('/api/incidents/:id', requireRoles('admin', 'station'), (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM incidents WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Incident not found' });
  db.prepare('DELETE FROM incidents WHERE id = ?').run(id);
  res.json(existing);
});

app.get('/api/vehicles', (req, res) => {
  res.json(db.prepare('SELECT * FROM vehicles').all().map(vehicleRowToObject));
});

app.post('/api/vehicles', requireRoles('admin', 'mechanic'), (req, res) => {
  const { plate, chassis, engine, model, capacity, fuel, insurance, status, station_id } = req.body;
  const result = db.prepare('INSERT INTO vehicles (plate, chassis, engine, model, capacity, fuel, insurance, status, station_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(plate, chassis, engine, model, capacity, fuel, insurance, status || 'active', station_id || null);
  res.status(201).json(vehicleRowToObject(db.prepare('SELECT * FROM vehicles WHERE id = ?').get(result.lastInsertRowid)));
});

app.put('/api/vehicles/:id', requireRoles('admin', 'mechanic'), (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM vehicles WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Vehicle not found' });
  const { plate, chassis, engine, model, capacity, fuel, insurance, status, station_id } = req.body;
  db.prepare('UPDATE vehicles SET plate = ?, chassis = ?, engine = ?, model = ?, capacity = ?, fuel = ?, insurance = ?, status = ?, station_id = ? WHERE id = ?').run(plate || existing.plate, chassis || existing.chassis, engine || existing.engine, model || existing.model, capacity || existing.capacity, fuel || existing.fuel, insurance || existing.insurance, status || existing.status, station_id ?? existing.station_id, id);
  res.json(vehicleRowToObject(db.prepare('SELECT * FROM vehicles WHERE id = ?').get(id)));
});

app.delete('/api/vehicles/:id', requireRoles('admin', 'mechanic'), (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM vehicles WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Vehicle not found' });
  db.prepare('DELETE FROM vehicles WHERE id = ?').run(id);
  res.json(existing);
});

app.get('/api/equipment', (req, res) => {
  const rows = db.prepare('SELECT e.*, s.name AS stationName FROM equipment e LEFT JOIN stations s ON e.station_id = s.id').all();
  res.json(rows);
});

app.post('/api/equipment', requireRoles('admin', 'equipment'), (req, res) => {
  const { name, status, station_id } = req.body;
  const result = db.prepare('INSERT INTO equipment (name, status, station_id) VALUES (?, ?, ?)').run(name, status || 'good', station_id || null);
  res.status(201).json(db.prepare('SELECT e.*, s.name AS stationName FROM equipment e LEFT JOIN stations s ON e.station_id = s.id WHERE e.id = ?').get(result.lastInsertRowid));
});

app.put('/api/equipment/:id', requireRoles('admin', 'equipment'), (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM equipment WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Equipment not found' });
  const { name, status, station_id } = req.body;
  db.prepare('UPDATE equipment SET name = ?, status = ?, station_id = ? WHERE id = ?').run(name || existing.name, status || existing.status, station_id ?? existing.station_id, id);
  res.json(db.prepare('SELECT e.*, s.name AS stationName FROM equipment e LEFT JOIN stations s ON e.station_id = s.id WHERE e.id = ?').get(id));
});

app.delete('/api/equipment/:id', requireRoles('admin', 'equipment'), (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM equipment WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Equipment not found' });
  db.prepare('DELETE FROM equipment WHERE id = ?').run(id);
  res.json(existing);
});

app.get('/api/notifications', (req, res) => {
  res.json(db.prepare('SELECT * FROM notifications WHERE active = 1 ORDER BY date DESC').all());
});

app.get('/api/shifts', (req, res) => {
  res.json(db.prepare('SELECT s.*, st.name AS stationName FROM shifts s LEFT JOIN stations st ON s.station_id = st.id ORDER BY date ASC').all());
});

app.post('/api/shifts', requireRoles('admin', 'station', 'shift'), (req, res) => {
  const { officer, shift_type, station_id, date } = req.body;
  const result = db.prepare('INSERT INTO shifts (officer, shift_type, station_id, date) VALUES (?, ?, ?, ?)').run(officer, shift_type || 'Morning', station_id || null, date || new Date().toISOString().slice(0, 10));
  res.status(201).json(db.prepare('SELECT s.*, st.name AS stationName FROM shifts s LEFT JOIN stations st ON s.station_id = st.id WHERE s.id = ?').get(result.lastInsertRowid));
});

app.put('/api/shifts/:id', requireRoles('admin', 'station', 'shift'), (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM shifts WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Shift not found' });
  const { officer, shift_type, station_id, date } = req.body;
  db.prepare('UPDATE shifts SET officer = ?, shift_type = ?, station_id = ?, date = ? WHERE id = ?').run(officer || existing.officer, shift_type || existing.shift_type, station_id ?? existing.station_id, date || existing.date, id);
  res.json(db.prepare('SELECT s.*, st.name AS stationName FROM shifts s LEFT JOIN stations st ON s.station_id = st.id WHERE s.id = ?').get(id));
});

app.delete('/api/shifts/:id', requireRoles('admin', 'station'), (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM shifts WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Shift not found' });
  db.prepare('DELETE FROM shifts WHERE id = ?').run(id);
  res.json(existing);
});

app.post('/api/feedback', (req, res) => {
  const { source, message, createdAt } = req.body;
  const result = db.prepare('INSERT INTO feedback (source, message, created_at, user) VALUES (?, ?, ?, ?)').run(source, message, createdAt || new Date().toISOString(), req.user.name);
  res.status(201).json({ id: result.lastInsertRowid, source, message, createdAt, user: req.user.name });
});

app.get('/api/feedback', (req, res) => {
  const feedback = db.prepare('SELECT * FROM feedback ORDER BY created_at DESC').all();
  res.json(feedback);
});

app.delete('/api/feedback/:id', requireRoles('admin'), (req, res) => {
  const id = Number(req.params.id);
  const feedback = db.prepare('SELECT * FROM feedback WHERE id = ?').get(id);
  if (!feedback) return res.status(404).json({ error: 'Feedback not found' });
  db.prepare('DELETE FROM feedback WHERE id = ?').run(id);
  res.json(feedback);
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(port, () => {
  console.log(`Zimamoto Management System running at http://localhost:${port}`);
});
