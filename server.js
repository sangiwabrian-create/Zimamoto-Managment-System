const fs = require('fs');
const express = require('express');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const dataDir = path.join(__dirname, 'data');
fs.mkdirSync(dataDir, { recursive: true });
const dbPath = path.join(dataDir, 'zimamoto.db');
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
  `);
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

app.post('/api/auth/login', (req, res) => {
  const { checknumber, password } = req.body;
  const user = db.prepare('SELECT u.id, u.checknumber, u.name, u.role_code AS roleCode, u.station_id, r.label AS role FROM users u JOIN roles r ON u.role_code = r.code WHERE u.checknumber = ? AND u.password = ?').get(checknumber, password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid checknumber or password' });
  }
  res.json(user);
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Logged out' });
});

app.get('/api/users', (req, res) => {
  const rows = db.prepare('SELECT u.id, u.checknumber, u.name, r.label AS role, u.station_id FROM users u JOIN roles r ON u.role_code = r.code').all();
  res.json(rows);
});

app.get('/api/roles', (req, res) => {
  res.json(db.prepare('SELECT * FROM roles').all());
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

  const stations = db.prepare('SELECT * FROM stations').all().map(normalizeRow);
  const tasks = db.prepare('SELECT t.*, s.name AS assignedStation FROM tasks t LEFT JOIN stations s ON t.assigned_station_id = s.id').all().map(taskRowToObject);
  const incidents = db.prepare('SELECT * FROM incidents').all().map(incidentRowToObject);
  const vehicles = db.prepare('SELECT * FROM vehicles').all().map(vehicleRowToObject);
  const equipment = db.prepare('SELECT * FROM equipment').all();
  const notifications = db.prepare('SELECT * FROM notifications WHERE active = 1 ORDER BY date DESC').all();
  const shifts = db.prepare('SELECT s.*, st.name AS stationName FROM shifts s LEFT JOIN stations st ON s.station_id = st.id ORDER BY date ASC').all();

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
    stations,
    tasks,
    incidents,
    vehicles,
    equipment,
    notifications,
    shifts
  });
});

app.get('/api/stations', (req, res) => {
  res.json(db.prepare('SELECT * FROM stations').all().map(normalizeRow));
});

app.post('/api/stations', (req, res) => {
  const { name, location, commander, officers, status } = req.body;
  const officersJson = JSON.stringify(Array.isArray(officers) ? officers : String(officers || '').split(',').map(o => o.trim()).filter(Boolean));
  const result = db.prepare('INSERT INTO stations (name, location, commander, officers, status) VALUES (?, ?, ?, ?, ?)').run(name, location, commander, officersJson, status || 'active');
  res.status(201).json(db.prepare('SELECT * FROM stations WHERE id = ?').get(result.lastInsertRowid));
});

app.put('/api/stations/:id', (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM stations WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Station not found' });
  const { name, location, commander, officers, status } = req.body;
  const officersJson = JSON.stringify(Array.isArray(officers) ? officers : String(officers || '').split(',').map(o => o.trim()).filter(Boolean));
  db.prepare('UPDATE stations SET name = ?, location = ?, commander = ?, officers = ?, status = ? WHERE id = ?').run(name || existing.name, location || existing.location, commander || existing.commander, officersJson, status || existing.status, id);
  res.json(db.prepare('SELECT * FROM stations WHERE id = ?').get(id));
});

app.delete('/api/stations/:id', (req, res) => {
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

app.post('/api/tasks', (req, res) => {
  const { title, assigned_station_id, assigned_officers, status, deadline, priority, conditions } = req.body;
  const officersJson = JSON.stringify(Array.isArray(assigned_officers) ? assigned_officers : String(assigned_officers || '').split(',').map(o => o.trim()).filter(Boolean));
  const historyJson = JSON.stringify(['Created']);
  const attachmentsJson = JSON.stringify([]);
  const feedbackJson = JSON.stringify([]);
  const result = db.prepare('INSERT INTO tasks (title, assigned_station_id, assigned_officers, status, deadline, priority, conditions, history, attachments, feedback) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(title, assigned_station_id || null, officersJson, status || 'pending', deadline || null, priority || 'Normal', conditions || '', historyJson, attachmentsJson, feedbackJson);
  res.status(201).json(taskRowToObject(db.prepare('SELECT t.*, s.name AS assignedStation FROM tasks t LEFT JOIN stations s ON t.assigned_station_id = s.id WHERE t.id = ?').get(result.lastInsertRowid)));
});

app.put('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Task not found' });
  const { title, assigned_station_id, assigned_officers, status, deadline, priority, conditions, history } = req.body;
  const officersJson = JSON.stringify(Array.isArray(assigned_officers) ? assigned_officers : String(assigned_officers || existing.assigned_officers || '').split(',').map(o => o.trim()).filter(Boolean));
  const historyJson = JSON.stringify(Array.isArray(history) ? history : parseJson(existing.history).concat(history ? [history] : []));
  db.prepare('UPDATE tasks SET title = ?, assigned_station_id = ?, assigned_officers = ?, status = ?, deadline = ?, priority = ?, conditions = ?, history = ? WHERE id = ?').run(title || existing.title, assigned_station_id || existing.assigned_station_id, officersJson, status || existing.status, deadline || existing.deadline, priority || existing.priority, conditions || existing.conditions, historyJson, id);
  res.json(taskRowToObject(db.prepare('SELECT t.*, s.name AS assignedStation FROM tasks t LEFT JOIN stations s ON t.assigned_station_id = s.id WHERE t.id = ?').get(id)));
});

app.get('/api/incidents', (req, res) => {
  res.json(db.prepare('SELECT * FROM incidents').all().map(incidentRowToObject));
});

app.post('/api/incidents', (req, res) => {
  const { type, location, date, officers, vehicles, equipment, media, report } = req.body;
  const officersJson = JSON.stringify(Array.isArray(officers) ? officers : String(officers || '').split(',').map(o => o.trim()).filter(Boolean));
  const vehiclesJson = JSON.stringify(Array.isArray(vehicles) ? vehicles : String(vehicles || '').split(',').map(v => v.trim()).filter(Boolean));
  const equipmentJson = JSON.stringify(Array.isArray(equipment) ? equipment : String(equipment || '').split(',').map(e => e.trim()).filter(Boolean));
  const mediaJson = JSON.stringify(Array.isArray(media) ? media : String(media || '').split(',').map(m => m.trim()).filter(Boolean));
  const result = db.prepare('INSERT INTO incidents (type, location, date, officers, vehicles, equipment, media, report) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(type, location, date, officersJson, vehiclesJson, equipmentJson, mediaJson, report || '');
  res.status(201).json(incidentRowToObject(db.prepare('SELECT * FROM incidents WHERE id = ?').get(result.lastInsertRowid)));
});

app.get('/api/vehicles', (req, res) => {
  res.json(db.prepare('SELECT * FROM vehicles').all().map(vehicleRowToObject));
});

app.post('/api/vehicles', (req, res) => {
  const { plate, chassis, engine, model, capacity, fuel, insurance, status, station_id } = req.body;
  const result = db.prepare('INSERT INTO vehicles (plate, chassis, engine, model, capacity, fuel, insurance, status, station_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(plate, chassis, engine, model, capacity, fuel, insurance, status || 'active', station_id || null);
  res.status(201).json(vehicleRowToObject(db.prepare('SELECT * FROM vehicles WHERE id = ?').get(result.lastInsertRowid)));
});

app.get('/api/equipment', (req, res) => {
  const rows = db.prepare('SELECT e.*, s.name AS stationName FROM equipment e LEFT JOIN stations s ON e.station_id = s.id').all();
  res.json(rows);
});

app.get('/api/notifications', (req, res) => {
  res.json(db.prepare('SELECT * FROM notifications WHERE active = 1 ORDER BY date DESC').all());
});

app.get('/api/shifts', (req, res) => {
  res.json(db.prepare('SELECT s.*, st.name AS stationName FROM shifts s LEFT JOIN stations st ON s.station_id = st.id ORDER BY date ASC').all());
});

app.post('/api/feedback', (req, res) => {
  const { source, message, createdAt, user } = req.body;
  const result = db.prepare('INSERT INTO feedback (source, message, created_at, user) VALUES (?, ?, ?, ?)').run(source, message, createdAt || new Date().toISOString(), user || 'Guest');
  res.status(201).json({ id: result.lastInsertRowid, source, message, createdAt, user });
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(port, () => {
  console.log(`Zimamoto Management System running at http://localhost:${port}`);
});
