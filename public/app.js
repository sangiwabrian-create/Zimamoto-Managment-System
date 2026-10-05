const loginView = document.getElementById('loginView');
const appShell = document.getElementById('appShell');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const checknumberInput = document.getElementById('checknumberInput');
const passwordInput = document.getElementById('passwordInput');
const keepLoggedInCheckbox = document.getElementById('keepLoggedIn');
const loginError = document.getElementById('loginError');
const registerError = document.getElementById('registerError');
const forgotPasswordError = document.getElementById('forgotPasswordError');
const languageSelect = document.getElementById('languageSelect');
const currentUserLabel = document.getElementById('currentUserLabel');
const signOutBtn = document.getElementById('signOutBtn');
const editProfileBtn = document.getElementById('editProfileBtn');
const profileDialog = document.getElementById('profileDialog');
const profileForm = document.getElementById('profileForm');
const profilePhotoInput = document.getElementById('profilePhotoInput');
const profilePhotoPreview = document.getElementById('profilePhotoPreview');
const profilePhotoInitials = document.getElementById('profilePhotoInitials');
const headerProfileAvatar = document.getElementById('headerProfileAvatar');
const headerProfileInitials = document.getElementById('headerProfileInitials');
const headerProfileStatus = document.getElementById('headerProfileStatus');
let profileAvatarData = null;
const menuTitle = document.getElementById('menuTitle');
const sidebarToggle = document.getElementById('sidebarToggle');
const dashboardTitle = document.getElementById('dashboardTitle');
const stationsTitle = document.getElementById('stationsTitle');
const tasksTitle = document.getElementById('tasksTitle');
const incidentsTitle = document.getElementById('incidentsTitle');
const vehiclesTitle = document.getElementById('vehiclesTitle');
const equipmentTitle = document.getElementById('equipmentTitle');
const shiftsTitle = document.getElementById('shiftsTitle');
const feedbackTitle = document.getElementById('feedbackTitle');
const reportsTitle = document.getElementById('reportsTitle');
const dashboardSummary = document.getElementById('dashboardSummary');
const dashboardCards = document.getElementById('dashboardCards');
const stationsList = document.getElementById('stationsList');
const tasksList = document.getElementById('tasksList');
const incidentsList = document.getElementById('incidentsList');
const vehiclesList = document.getElementById('vehiclesList');
const equipmentList = document.getElementById('equipmentList');
const shiftsList = document.getElementById('shiftsList');
const reportCards = document.getElementById('reportCards');
const feedbackSource = document.getElementById('feedbackSource');
const feedbackMessage = document.getElementById('feedbackMessage');
const feedbackConfirmation = document.getElementById('feedbackConfirmation');
const feedbackList = document.getElementById('feedbackList');
const submitFeedbackBtn = document.getElementById('submitFeedbackBtn');
const newEquipmentBtn = document.getElementById('newEquipmentBtn');
const newShiftBtn = document.getElementById('newShiftBtn');
const views = Array.from(document.querySelectorAll('.view'));
const navBtns = Array.from(document.querySelectorAll('.nav-btn'));

const translations = {
  en: {
    menu: 'Menu',
    dashboard: 'Dashboard',
    stationManagement: 'Station Management',
    taskManagement: 'Task Management',
    incidentManagement: 'Incident Management',
    vehicleManagement: 'Vehicle Management',
    equipment: 'Equipment & Inventory',
    shiftManagement: 'Shift Management',
    feedback: 'Feedback',
    reports: 'Reports & Analytics',
    addStation: 'Add Station',
    createTask: 'Create Task',
    recordIncident: 'Record Incident',
    registerVehicle: 'Register Vehicle',
    stationName: 'Station Name',
    location: 'Location',
    commander: 'Commander',
    officers: 'Officers',
    status: 'Status',
    actions: 'Actions',
    pending: 'Pending',
    assigned: 'Assigned',
    inProgress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
    delayed: 'Delayed',
    taskTitle: 'Task Title',
    assignedTo: 'Assigned To',
    assignedStation: 'Assigned Station',
    deadline: 'Deadline',
    priority: 'Priority',
    conditions: 'Conditions',
    feedbackSourcePlaceholder: 'Name or station',
    submitFeedback: 'Submit Feedback'
  },
  sw: {
    menu: 'Menyu',
    dashboard: 'Dashboard',
    stationManagement: 'Usimamizi wa Vituo',
    taskManagement: 'Usimamizi wa Task',
    incidentManagement: 'Usimamizi wa Matukio',
    vehicleManagement: 'Usimamizi wa Magari',
    equipment: 'Vifaa & Mali',
    shiftManagement: 'Usimamizi wa Zamu',
    feedback: 'Maoni',
    reports: 'Ripoti & Analytics',
    addStation: 'Ongeza Kituo',
    createTask: 'Unda Task',
    recordIncident: 'Rekodi Tukio',
    registerVehicle: 'Sajili Gari',
    stationName: 'Jina la Kituo',
    location: 'Mahali',
    commander: 'Kamanda',
    officers: 'Askari',
    status: 'Hali',
    actions: 'Vitendo',
    pending: 'Inasubiri',
    assigned: 'Imetengwa',
    inProgress: 'Inatekelezwa',
    completed: 'Imekamilika',
    cancelled: 'Imesitishwa',
    delayed: 'Imesubiriwa',
    taskTitle: 'Kichwa cha Task',
    assignedTo: 'Imetengwa Kwa',
    assignedStation: 'Imepewa Kituo',
    deadline: 'Muda',
    priority: 'Kipaumbele',
    conditions: 'Masharti',
    feedbackSourcePlaceholder: 'Jina au kituo',
    submitFeedback: 'Tuma Maoni'
  }
};

let currentLanguage = 'sw';
let currentUser = null;
let currentData = null;

function setTranslations() {
  const t = translations[currentLanguage];
  menuTitle.textContent = t.menu;
  dashboardTitle.textContent = t.dashboard;
  stationsTitle.textContent = t.stationManagement;
  tasksTitle.textContent = t.taskManagement;
  incidentsTitle.textContent = t.incidentManagement;
  vehiclesTitle.textContent = t.vehicleManagement;
  equipmentTitle.textContent = t.equipment;
  shiftsTitle.textContent = t.shiftManagement;
  feedbackTitle.textContent = t.feedback;
  reportsTitle.textContent = t.reports;
  document.getElementById('newStationBtn').textContent = t.addStation;
  document.getElementById('newTaskBtn').textContent = t.createTask;
  document.getElementById('newIncidentBtn').textContent = t.recordIncident;
  document.getElementById('newVehicleBtn').textContent = t.registerVehicle;
  if (newEquipmentBtn) newEquipmentBtn.textContent = 'Add Equipment';
  if (newShiftBtn) newShiftBtn.textContent = 'Add Shift';
  feedbackSource.placeholder = t.feedbackSourcePlaceholder;
  document.getElementById('submitFeedbackBtn').textContent = t.submitFeedback;
}

function createSummaryCard(label, value) {
  const card = document.createElement('div');
  card.className = 'summary-card';
  card.innerHTML = `<span>${label}</span><strong>${value}</strong>`;
  return card;
}

function createTable(columns, rows) {
  const template = document.getElementById('tableTemplate');
  const table = template.content.firstElementChild.cloneNode(true);
  const headerRow = document.createElement('tr');
  columns.forEach(col => {
    const th = document.createElement('th');
    th.textContent = col;
    headerRow.appendChild(th);
  });
  table.tHead.appendChild(headerRow);
  rows.forEach(row => {
    const tr = document.createElement('tr');
    row.forEach(cell => {
      const td = document.createElement('td');
      td.innerHTML = cell;
      tr.appendChild(td);
    });
    table.tBodies[0].appendChild(tr);
  });
  return table;
}

async function loginUser(credentials) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }
  return response.json();
}

async function fetchDashboardData() {
  const response = await fetch('/api/dashboard');
  return response.json();
}

async function sendFeedback(feedback) {
  const response = await fetch('/api/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(feedback)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to submit feedback');
  }

  return response.json();
}

function setAuthenticated(authenticated) {
  loginView.classList.toggle('hidden', authenticated);
  appShell.classList.toggle('hidden', !authenticated);
}

function profileInitials(name) {
  return String(name || '?').trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase() || '?';
}

function renderProfileIdentity(user) {
  if (!user) return;
  currentUserLabel.textContent = `${user.name} (${user.role})`;
  const initials = profileInitials(user.name);
  [headerProfileInitials, profilePhotoInitials].forEach(element => {
    element.textContent = initials;
  });
  [headerProfileAvatar, profilePhotoPreview].forEach(image => {
    if (user.avatar) {
      image.src = user.avatar;
      image.classList.remove('hidden');
    } else {
      image.removeAttribute('src');
      image.classList.add('hidden');
    }
  });
  headerProfileInitials.classList.toggle('hidden', Boolean(user.avatar));
  profilePhotoInitials.classList.toggle('hidden', Boolean(user.avatar));
  const status = [user.availability, user.status_message].filter(Boolean).join(' · ');
  headerProfileStatus.textContent = status;
  editProfileBtn.title = status ? `Edit profile — ${status}` : 'Edit profile';
}

async function refreshCurrentProfile() {
  if (!currentUser?.id) return;
  const response = await fetch(`/api/users/${currentUser.id}/profile`);
  if (!response.ok) throw new Error('Unable to load profile');
  const profile = await response.json();
  currentUser = { ...currentUser, ...profile };
  renderProfileIdentity(currentUser);
  if (localStorage.getItem('zimamotoUser')) {
    localStorage.setItem('zimamotoUser', JSON.stringify(currentUser));
  }
}

function setProfilePhotoPreview(imageData) {
  profileAvatarData = imageData;
  const initials = profileInitials(document.getElementById('profileNameInput').value);
  profilePhotoInitials.textContent = initials;
  headerProfileInitials.textContent = initials;
  [profilePhotoPreview, headerProfileAvatar].forEach(image => {
    if (imageData) {
      image.src = imageData;
      image.classList.remove('hidden');
    } else {
      image.removeAttribute('src');
      image.classList.add('hidden');
    }
  });
  profilePhotoInitials.classList.toggle('hidden', Boolean(imageData));
  headerProfileInitials.classList.toggle('hidden', Boolean(imageData));
}

editProfileBtn.addEventListener('click', async () => {
  const saveMessage = document.getElementById('profileSaveMessage');
  saveMessage.textContent = '';
  document.getElementById('profileCurrentPasswordInput').value = '';
  document.getElementById('profileNameInput').value = currentUser?.name || '';
  document.getElementById('profileAvailabilityInput').value = currentUser?.availability || 'Off duty';
  document.getElementById('profileStatusMessageInput').value = currentUser?.status_message || '';
  profilePhotoInput.value = '';
  setProfilePhotoPreview(currentUser?.avatar || null);
  profileDialog.showModal();
  try {
    await refreshCurrentProfile();
    document.getElementById('profileNameInput').value = currentUser.name || '';
    document.getElementById('profileAvailabilityInput').value = currentUser.availability || 'Off duty';
    document.getElementById('profileStatusMessageInput').value = currentUser.status_message || '';
    setProfilePhotoPreview(currentUser.avatar || null);
  } catch (error) {
    saveMessage.textContent = error.message;
    saveMessage.className = 'notification error';
  }
});

document.getElementById('closeProfileBtn').addEventListener('click', () => profileDialog.close());
document.getElementById('cancelProfileBtn').addEventListener('click', () => profileDialog.close());

document.getElementById('profileNameInput').addEventListener('input', () => {
  if (!profileAvatarData) {
    const initials = profileInitials(document.getElementById('profileNameInput').value);
    profilePhotoInitials.textContent = initials;
    headerProfileInitials.textContent = initials;
  }
});

profilePhotoInput.addEventListener('change', () => {
  const file = profilePhotoInput.files?.[0];
  if (!file) return;
  const message = document.getElementById('profileSaveMessage');
  message.textContent = '';
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
    message.textContent = 'Choose a PNG, JPEG, or WebP image.';
    message.className = 'notification error';
    profilePhotoInput.value = '';
    return;
  }
  if (file.size > 1024 * 1024) {
    message.textContent = 'Profile picture must be 1 MB or smaller.';
    message.className = 'notification error';
    profilePhotoInput.value = '';
    return;
  }
  const reader = new FileReader();
  reader.addEventListener('load', () => setProfilePhotoPreview(reader.result));
  reader.readAsDataURL(file);
});

document.getElementById('removeProfilePhotoBtn').addEventListener('click', () => {
  profilePhotoInput.value = '';
  setProfilePhotoPreview(null);
});

profileForm.addEventListener('submit', async event => {
  event.preventDefault();
  const saveMessage = document.getElementById('profileSaveMessage');
  saveMessage.textContent = '';
  saveMessage.className = 'notification';
  try {
    const profile = await putJson(`/api/users/${currentUser.id}/profile`, {
      currentPassword: document.getElementById('profileCurrentPasswordInput').value,
      name: document.getElementById('profileNameInput').value.trim(),
      avatar: profileAvatarData,
      availability: document.getElementById('profileAvailabilityInput').value,
      status_message: document.getElementById('profileStatusMessageInput').value.trim()
    });
    currentUser = { ...currentUser, ...profile };
    renderProfileIdentity(currentUser);
    if (localStorage.getItem('zimamotoUser')) {
      localStorage.setItem('zimamotoUser', JSON.stringify(currentUser));
    }
    saveMessage.textContent = 'Profile updated successfully.';
    saveMessage.className = 'notification success';
    document.getElementById('profileCurrentPasswordInput').value = '';
    window.setTimeout(() => profileDialog.close(), 900);
  } catch (error) {
    saveMessage.textContent = error.message;
    saveMessage.className = 'notification error';
  }
});

const viewPermissions = {
  admin: ['dashboard', 'stations', 'tasks', 'incidents', 'vehicles', 'equipment', 'shifts', 'feedback', 'reports'],
  station: ['dashboard', 'stations', 'tasks', 'incidents', 'vehicles', 'equipment', 'shifts', 'feedback', 'reports'],
  shift: ['dashboard', 'tasks', 'incidents', 'shifts', 'feedback', 'reports'],
  officer: ['dashboard', 'tasks', 'incidents', 'feedback', 'reports'],
  mechanic: ['dashboard', 'vehicles', 'equipment', 'feedback', 'reports'],
  equipment: ['dashboard', 'equipment', 'feedback', 'reports'],
  viewer: ['dashboard', 'reports']
};

function updateNavForRole(role) {
  const allowed = viewPermissions[role] || viewPermissions.viewer;
  navBtns.forEach(btn => btn.classList.toggle('hidden', !allowed.includes(btn.dataset.view)));
  const activeButton = navBtns.find(btn => btn.classList.contains('active') && !btn.classList.contains('hidden'));
  if (!activeButton) {
    const firstVisible = navBtns.find(btn => !btn.classList.contains('hidden'));
    if (firstVisible) switchView(firstVisible.dataset.view);
  }
}

function renderDashboard(data) {
  dashboardSummary.innerHTML = '';
  dashboardSummary.appendChild(createSummaryCard('Stations', data.stationCount));
  dashboardSummary.appendChild(createSummaryCard('Tasks', data.taskCount));
  dashboardSummary.appendChild(createSummaryCard('Completed', data.completed));
  dashboardSummary.appendChild(createSummaryCard('In Progress', data.inProgress));
  dashboardSummary.appendChild(createSummaryCard('Delayed', data.delayed));
  dashboardSummary.appendChild(createSummaryCard('Vehicles Active', data.vehiclesActive));
  dashboardSummary.appendChild(createSummaryCard('Needs Repair', data.maintenance));
  dashboardSummary.appendChild(createSummaryCard('Broken Equipment', data.brokenEquipment));

  dashboardCards.innerHTML = `
    <div class="card"><h3>Incident Reports</h3><p>${data.incidents.length} recorded events</p></div>
    <div class="card"><h3>Alerts</h3><p>${data.notifications.length} active notices</p></div>
    <div class="card"><h3>Shifts</h3><p>${data.shifts.length} scheduled shifts</p></div>
  `;
}

function attachActionButtons(container, selector, handler) {
  const buttons = container.querySelectorAll(selector);
  buttons.forEach(button => {
    button.addEventListener('click', () => handler(button.dataset.id));
  });
}

async function postJson(url, payload) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Request failed');
  }
  return response.json();
}

async function putJson(url, payload) {
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Update failed');
  }
  return response.json();
}

async function deleteJson(url) {
  const response = await fetch(url, { method: 'DELETE' });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Delete failed');
  }
  return response.json();
}

async function createStation() {
  const name = prompt('Station name:');
  if (!name) return;
  const location = prompt('Location:') || '';
  const commander = prompt('Station commander:') || '';
  const officers = prompt('Officers (comma separated):') || '';
  const status = prompt('Status (active/maintenance):', 'active') || 'active';

  await postJson('/api/stations', {
    name,
    location,
    commander,
    officers: officers.split(',').map(o => o.trim()).filter(Boolean),
    status
  });
  await loadAllData();
  alert('Station created successfully.');
}

async function createTask() {
  const title = prompt('Task title:');
  if (!title) return;
  const assignedStationId = prompt('Assigned station ID:');
  const assignedOfficers = prompt('Assigned officers (comma separated):') || '';
  const status = prompt('Status (pending/in-progress/assigned/completed/delayed):', 'pending') || 'pending';
  const deadline = prompt('Deadline (YYYY-MM-DD):', '') || null;
  const priority = prompt('Priority (Low/Medium/High):', 'Medium') || 'Medium';
  const conditions = prompt('Conditions or notes:') || '';

  await postJson('/api/tasks', {
    title,
    assigned_station_id: assignedStationId ? Number(assignedStationId) : null,
    assigned_officers: assignedOfficers.split(',').map(o => o.trim()).filter(Boolean),
    status,
    deadline,
    priority,
    conditions
  });
  await loadAllData();
  alert('Task created successfully.');
}

async function createIncident() {
  const type = prompt('Incident type:');
  if (!type) return;
  const location = prompt('Location:') || '';
  const date = prompt('Date (YYYY-MM-DD):', new Date().toISOString().slice(0, 10));
  const officers = prompt('Officers involved (comma separated):') || '';
  const vehicles = prompt('Vehicles involved (comma separated):') || '';
  const equipment = prompt('Equipment used (comma separated):') || '';
  const report = prompt('Report summary:') || '';

  await postJson('/api/incidents', {
    type,
    location,
    date,
    officers: officers.split(',').map(o => o.trim()).filter(Boolean),
    vehicles: vehicles.split(',').map(v => v.trim()).filter(Boolean),
    equipment: equipment.split(',').map(e => e.trim()).filter(Boolean),
    media: [],
    report
  });
  await loadAllData();
  alert('Incident recorded successfully.');
}

async function createVehicle() {
  const plate = prompt('Vehicle plate number:');
  if (!plate) return;
  const chassis = prompt('Chassis number:') || '';
  const engine = prompt('Engine number:') || '';
  const model = prompt('Model:') || '';
  const capacity = prompt('Capacity:') || '';
  const fuel = prompt('Fuel type:') || '';
  const insurance = prompt('Insurance expiry:') || '';
  const status = prompt('Status (active/maintenance):', 'active') || 'active';
  const stationId = prompt('Station ID:');

  await postJson('/api/vehicles', {
    plate,
    chassis,
    engine,
    model,
    capacity,
    fuel,
    insurance,
    status,
    station_id: stationId ? Number(stationId) : null
  });
  await loadAllData();
  alert('Vehicle registered successfully.');
}

async function createEquipment() {
  const name = prompt('Equipment name:');
  if (!name) return;
  const status = prompt('Status:', 'good') || 'good';
  const stationId = prompt('Station ID:');

  await postJson('/api/equipment', {
    name,
    status,
    station_id: stationId ? Number(stationId) : null
  });
  await loadAllData();
  alert('Equipment created successfully.');
}

async function createShift() {
  const officer = prompt('Officer name:');
  if (!officer) return;
  const shiftType = prompt('Shift type:', 'Morning') || 'Morning';
  const stationId = prompt('Station ID:');
  const date = prompt('Date (YYYY-MM-DD):', new Date().toISOString().slice(0, 10)) || new Date().toISOString().slice(0, 10);

  await postJson('/api/shifts', {
    officer,
    shift_type: shiftType,
    station_id: stationId ? Number(stationId) : null,
    date
  });
  await loadAllData();
  alert('Shift created successfully.');
}

function showDetails(title, details) {
  alert(`${title}\n\n${details}`);
}

function actionButtonsHtml(id, type, label) {
  return `<div class="row-actions"><button class="secondary action-btn" data-action="${type}" data-id="${id}">${label}</button></div>`;
}

function renderStations(data) {
  const rows = data.map(station => [
    station.name,
    station.location,
    station.commander,
    station.officers.join(', '),
    station.status,
    `${actionButtonsHtml(station.id, 'view-station', 'View')}${actionButtonsHtml(station.id, 'edit-station', 'Edit')}${actionButtonsHtml(station.id, 'delete-station', 'Delete')}`
  ]);
  stationsList.innerHTML = '';
  const table = createTable(['Station Name', 'Location', 'Commander', 'Officers', 'Status', 'Actions'], rows);
  stationsList.appendChild(table);
  attachActionButtons(stationsList, '.action-btn[data-action="view-station"]', async (id) => {
    const station = data.find(item => item.id === Number(id));
    if (!station) return;
    showDetails('Station Details', `Name: ${station.name}\nLocation: ${station.location}\nCommander: ${station.commander}\nOfficers: ${station.officers.join(', ')}\nStatus: ${station.status}`);
  });
  attachActionButtons(stationsList, '.action-btn[data-action="edit-station"]', async (id) => {
    const station = data.find(item => item.id === Number(id));
    if (!station) return;
    const name = prompt('Station name:', station.name) || station.name;
    const location = prompt('Location:', station.location || '') || station.location || '';
    const commander = prompt('Station commander:', station.commander || '') || station.commander || '';
    const officers = prompt('Officers (comma separated):', station.officers.join(', ')) || station.officers.join(', ');
    const status = prompt('Status (active/maintenance):', station.status || 'active') || station.status || 'active';
    await putJson(`/api/stations/${id}`, {
      name,
      location,
      commander,
      officers: officers.split(',').map(o => o.trim()).filter(Boolean),
      status
    });
    await loadAllData();
    alert('Station updated successfully.');
  });
  attachActionButtons(stationsList, '.action-btn[data-action="delete-station"]', async (id) => {
    const station = data.find(item => item.id === Number(id));
    if (!station) return;
    if (!confirm(`Delete station ${station.name}?`)) return;
    await deleteJson(`/api/stations/${id}`);
    await loadAllData();
    alert('Station deleted successfully.');
  });
}

function renderTasks(data) {
  const rows = data.map(task => [
    task.title,
    task.assignedStation,
    task.assigned_officers.join(', '),
    task.status,
    task.deadline,
    task.priority,
    `${actionButtonsHtml(task.id, 'view-task', 'View')}${actionButtonsHtml(task.id, 'edit-task', 'Edit')}${actionButtonsHtml(task.id, 'delete-task', 'Delete')}`
  ]);
  tasksList.innerHTML = '';
  const table = createTable(['Task Title', 'Assigned Station', 'Assigned To', 'Status', 'Deadline', 'Priority', 'Actions'], rows);
  tasksList.appendChild(table);
  attachActionButtons(tasksList, '.action-btn[data-action="view-task"]', async (id) => {
    const task = data.find(item => item.id === Number(id));
    if (!task) return;
    showDetails('Task Details', `Title: ${task.title}\nStation: ${task.assignedStation}\nAssigned Officers: ${task.assigned_officers.join(', ')}\nStatus: ${task.status}\nDeadline: ${task.deadline}\nPriority: ${task.priority}\nConditions: ${task.conditions}`);
  });
  attachActionButtons(tasksList, '.action-btn[data-action="edit-task"]', async (id) => {
    const task = data.find(item => item.id === Number(id));
    if (!task) return;
    const title = prompt('Task title:', task.title) || task.title;
    const assignedStationId = prompt('Assigned station ID:', task.assigned_station_id || '') || task.assigned_station_id || null;
    const assignedOfficers = prompt('Assigned officers (comma separated):', task.assigned_officers.join(', ')) || task.assigned_officers.join(', ');
    const status = prompt('Status (pending/in-progress/assigned/completed/delayed):', task.status) || task.status;
    const deadline = prompt('Deadline (YYYY-MM-DD):', task.deadline || '') || task.deadline || null;
    const priority = prompt('Priority (Low/Medium/High):', task.priority || 'Medium') || task.priority || 'Medium';
    const conditions = prompt('Conditions or notes:', task.conditions || '') || task.conditions || '';
    await putJson(`/api/tasks/${id}`, {
      title,
      assigned_station_id: assignedStationId ? Number(assignedStationId) : null,
      assigned_officers: assignedOfficers.split(',').map(o => o.trim()).filter(Boolean),
      status,
      deadline,
      priority,
      conditions,
      history: Array.isArray(task.history) ? task.history : []
    });
    await loadAllData();
    alert('Task updated successfully.');
  });
  attachActionButtons(tasksList, '.action-btn[data-action="delete-task"]', async (id) => {
    const task = data.find(item => item.id === Number(id));
    if (!task) return;
    if (!confirm(`Delete task ${task.title}?`)) return;
    await deleteJson(`/api/tasks/${id}`);
    await loadAllData();
    alert('Task deleted successfully.');
  });
}

function renderIncidents(data) {
  const rows = data.map(item => [
    item.type,
    item.location,
    item.date,
    item.officers.join(', '),
    item.vehicles.join(', '),
    item.report,
    `${actionButtonsHtml(item.id, 'view-incident', 'View')}${actionButtonsHtml(item.id, 'edit-incident', 'Edit')}${actionButtonsHtml(item.id, 'delete-incident', 'Delete')}`
  ]);
  incidentsList.innerHTML = '';
  const table = createTable(['Type', 'Location', 'Date', 'Officers', 'Vehicles', 'Report', 'Actions'], rows);
  incidentsList.appendChild(table);
  attachActionButtons(incidentsList, '.action-btn[data-action="view-incident"]', async (id) => {
    const incident = data.find(item => item.id === Number(id));
    if (!incident) return;
    showDetails('Incident Details', `Type: ${incident.type}\nLocation: ${incident.location}\nDate: ${incident.date}\nOfficers: ${incident.officers.join(', ')}\nVehicles: ${incident.vehicles.join(', ')}\nEquipment: ${incident.equipment.join(', ')}\nReport: ${incident.report}`);
  });
  attachActionButtons(incidentsList, '.action-btn[data-action="edit-incident"]', async (id) => {
    const incident = data.find(item => item.id === Number(id));
    if (!incident) return;
    const type = prompt('Incident type:', incident.type) || incident.type;
    const location = prompt('Location:', incident.location || '') || incident.location || '';
    const date = prompt('Date (YYYY-MM-DD):', incident.date || new Date().toISOString().slice(0, 10)) || incident.date || new Date().toISOString().slice(0, 10);
    const officers = prompt('Officers involved (comma separated):', incident.officers.join(', ')) || incident.officers.join(', ');
    const vehicles = prompt('Vehicles involved (comma separated):', incident.vehicles.join(', ')) || incident.vehicles.join(', ');
    const equipment = prompt('Equipment used (comma separated):', incident.equipment.join(', ')) || incident.equipment.join(', ');
    const report = prompt('Report summary:', incident.report || '') || incident.report || '';
    await putJson(`/api/incidents/${id}`, {
      type,
      location,
      date,
      officers: officers.split(',').map(o => o.trim()).filter(Boolean),
      vehicles: vehicles.split(',').map(v => v.trim()).filter(Boolean),
      equipment: equipment.split(',').map(e => e.trim()).filter(Boolean),
      media: incident.media || [],
      report
    });
    await loadAllData();
    alert('Incident updated successfully.');
  });
  attachActionButtons(incidentsList, '.action-btn[data-action="delete-incident"]', async (id) => {
    const incident = data.find(item => item.id === Number(id));
    if (!incident) return;
    if (!confirm(`Delete incident ${incident.type}?`)) return;
    await deleteJson(`/api/incidents/${id}`);
    await loadAllData();
    alert('Incident deleted successfully.');
  });
}

function renderVehicles(data) {
  const rows = data.map(vehicle => [
    vehicle.plate,
    vehicle.model,
    vehicle.capacity,
    vehicle.fuel,
    vehicle.insurance,
    vehicle.status,
    `${actionButtonsHtml(vehicle.id, 'view-vehicle', 'View')}${actionButtonsHtml(vehicle.id, 'edit-vehicle', 'Edit')}${actionButtonsHtml(vehicle.id, 'delete-vehicle', 'Delete')}`
  ]);
  vehiclesList.innerHTML = '';
  const table = createTable(['Plate', 'Model', 'Capacity', 'Fuel', 'Insurance', 'Status', 'Actions'], rows);
  vehiclesList.appendChild(table);
  attachActionButtons(vehiclesList, '.action-btn[data-action="view-vehicle"]', async (id) => {
    const vehicle = data.find(item => item.id === Number(id));
    if (!vehicle) return;
    showDetails('Vehicle Details', `Plate: ${vehicle.plate}\nModel: ${vehicle.model}\nCapacity: ${vehicle.capacity}\nFuel: ${vehicle.fuel}\nInsurance: ${vehicle.insurance}\nStatus: ${vehicle.status}\nStation: ${vehicle.stationName || 'N/A'}`);
  });
  attachActionButtons(vehiclesList, '.action-btn[data-action="edit-vehicle"]', async (id) => {
    const vehicle = data.find(item => item.id === Number(id));
    if (!vehicle) return;
    const plate = prompt('Vehicle plate number:', vehicle.plate) || vehicle.plate;
    const chassis = prompt('Chassis number:', vehicle.chassis || '') || vehicle.chassis || '';
    const engine = prompt('Engine number:', vehicle.engine || '') || vehicle.engine || '';
    const model = prompt('Model:', vehicle.model || '') || vehicle.model || '';
    const capacity = prompt('Capacity:', vehicle.capacity || '') || vehicle.capacity || '';
    const fuel = prompt('Fuel type:', vehicle.fuel || '') || vehicle.fuel || '';
    const insurance = prompt('Insurance expiry:', vehicle.insurance || '') || vehicle.insurance || '';
    const status = prompt('Status (active/maintenance):', vehicle.status || 'active') || vehicle.status || 'active';
    const stationId = prompt('Station ID:', vehicle.station_id || '') || vehicle.station_id || null;
    await putJson(`/api/vehicles/${id}`, {
      plate,
      chassis,
      engine,
      model,
      capacity,
      fuel,
      insurance,
      status,
      station_id: stationId ? Number(stationId) : null
    });
    await loadAllData();
    alert('Vehicle updated successfully.');
  });
  attachActionButtons(vehiclesList, '.action-btn[data-action="delete-vehicle"]', async (id) => {
    const vehicle = data.find(item => item.id === Number(id));
    if (!vehicle) return;
    if (!confirm(`Delete vehicle ${vehicle.plate}?`)) return;
    await deleteJson(`/api/vehicles/${id}`);
    await loadAllData();
    alert('Vehicle deleted successfully.');
  });
}

function renderEquipment(data) {
  const rows = data.map(item => [
    item.name,
    item.stationName || 'N/A',
    item.status,
    `${actionButtonsHtml(item.id, 'view-equipment', 'View')}${actionButtonsHtml(item.id, 'edit-equipment', 'Edit')}${actionButtonsHtml(item.id, 'delete-equipment', 'Delete')}`
  ]);
  equipmentList.innerHTML = '';
  const table = createTable(['Equipment', 'Station', 'Status', 'Actions'], rows);
  equipmentList.appendChild(table);
  attachActionButtons(equipmentList, '.action-btn[data-action="view-equipment"]', async (id) => {
    const equipment = data.find(item => item.id === Number(id));
    if (!equipment) return;
    showDetails('Equipment Details', `Name: ${equipment.name}\nStation: ${equipment.stationName || 'N/A'}\nStatus: ${equipment.status}`);
  });
  attachActionButtons(equipmentList, '.action-btn[data-action="edit-equipment"]', async (id) => {
    const equipment = data.find(item => item.id === Number(id));
    if (!equipment) return;
    const name = prompt('Equipment name:', equipment.name) || equipment.name;
    const status = prompt('Status:', equipment.status || 'good') || equipment.status || 'good';
    const stationId = prompt('Station ID:', equipment.station_id ?? '') || equipment.station_id || null;
    await putJson(`/api/equipment/${id}`, {
      name,
      status,
      station_id: stationId ? Number(stationId) : null
    });
    await loadAllData();
    alert('Equipment updated successfully.');
  });
  attachActionButtons(equipmentList, '.action-btn[data-action="delete-equipment"]', async (id) => {
    const equipment = data.find(item => item.id === Number(id));
    if (!equipment) return;
    if (!confirm(`Delete equipment ${equipment.name}?`)) return;
    await deleteJson(`/api/equipment/${id}`);
    await loadAllData();
    alert('Equipment deleted successfully.');
  });
}

function renderShifts(data) {
  const rows = data.map(shift => [
    shift.officer,
    shift.shift_type,
    shift.stationName || 'N/A',
    shift.date,
    `${actionButtonsHtml(shift.id, 'view-shift', 'View')}${actionButtonsHtml(shift.id, 'edit-shift', 'Edit')}${actionButtonsHtml(shift.id, 'delete-shift', 'Delete')}`
  ]);
  shiftsList.innerHTML = '';
  const table = createTable(['Officer', 'Shift', 'Station', 'Date', 'Actions'], rows);
  shiftsList.appendChild(table);
  attachActionButtons(shiftsList, '.action-btn[data-action="view-shift"]', async (id) => {
    const shift = data.find(item => item.id === Number(id));
    if (!shift) return;
    showDetails('Shift Details', `Officer: ${shift.officer}\nShift: ${shift.shift_type}\nStation: ${shift.stationName || 'N/A'}\nDate: ${shift.date}`);
  });
  attachActionButtons(shiftsList, '.action-btn[data-action="edit-shift"]', async (id) => {
    const shift = data.find(item => item.id === Number(id));
    if (!shift) return;
    const officer = prompt('Officer name:', shift.officer) || shift.officer;
    const shiftType = prompt('Shift type:', shift.shift_type || 'Morning') || shift.shift_type || 'Morning';
    const stationId = prompt('Station ID:', shift.station_id || '') || shift.station_id || null;
    const date = prompt('Date (YYYY-MM-DD):', shift.date || new Date().toISOString().slice(0, 10)) || shift.date || new Date().toISOString().slice(0, 10);
    await putJson(`/api/shifts/${id}`, {
      officer,
      shift_type: shiftType,
      station_id: stationId ? Number(stationId) : null,
      date
    });
    await loadAllData();
    alert('Shift updated successfully.');
  });
  attachActionButtons(shiftsList, '.action-btn[data-action="delete-shift"]', async (id) => {
    const shift = data.find(item => item.id === Number(id));
    if (!shift) return;
    if (!confirm(`Delete shift for ${shift.officer}?`)) return;
    await deleteJson(`/api/shifts/${id}`);
    await loadAllData();
    alert('Shift deleted successfully.');
  });
}

function renderFeedback(data) {
  const rows = data.map(item => [
    item.user || 'Unknown',
    item.source || 'N/A',
    item.message,
    item.created_at ? new Date(item.created_at).toLocaleString() : 'N/A',
    `${actionButtonsHtml(item.id, 'view-feedback', 'View')}${actionButtonsHtml(item.id, 'delete-feedback', 'Delete')}`
  ]);
  feedbackList.innerHTML = '';
  const table = createTable(['Submitted By', 'From', 'Message', 'Date', 'Actions'], rows);
  feedbackList.appendChild(table);
  
  attachActionButtons(feedbackList, '.action-btn[data-action="view-feedback"]', async (id) => {
    const feedback = data.find(item => item.id === Number(id));
    if (!feedback) return;
    showDetails('Feedback Details', `User: ${feedback.user}\nSource: ${feedback.source}\nMessage: ${feedback.message}\nDate: ${feedback.created_at}`);
  });
  
  attachActionButtons(feedbackList, '.action-btn[data-action="delete-feedback"]', async (id) => {
    if (!confirm('Delete this feedback?')) return;
    try {
      await deleteJson(`/api/feedback/${id}`);
      await loadAllData();
      alert('Feedback deleted successfully.');
    } catch (error) {
      alert('Failed to delete feedback: ' + error.message);
    }
  });
}

function renderReports(data) {
  reportCards.innerHTML = `
    <div class="report-card"><h3>Stations</h3><p>${data.stationCount}</p></div>
    <div class="report-card"><h3>Tasks</h3><p>${data.taskCount}</p></div>
    <div class="report-card"><h3>Incidents</h3><p>${data.incidentReports}</p></div>
    <div class="report-card"><h3>Vehicles Active</h3><p>${data.vehiclesActive}</p></div>
    <div class="report-card"><h3>Delayed Tasks</h3><p>${data.delayed}</p></div>
    <div class="report-card"><h3>Notifications</h3><p>${data.notificationCount}</p></div>
  `;
}

async function loadAllData() {
  const data = await fetchDashboardData();
  renderDashboard(data);
  renderStations(data.stations);
  renderTasks(data.tasks);
  renderIncidents(data.incidents);
  renderVehicles(data.vehicles);
  renderEquipment(data.equipment);
  renderShifts(data.shifts);
  renderFeedback(data.feedback);
  renderReports(data);
}

function switchView(viewName) {
  views.forEach(view => view.classList.toggle('active', view.id === `${viewName}View`));
  navBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.view === viewName));
}

function setSidebarCollapsed(collapsed) {
  appShell.classList.toggle('sidebar-collapsed', collapsed);
  sidebarToggle.setAttribute('aria-expanded', String(!collapsed));
  const toggleIcon = sidebarToggle.querySelector('.toggle-icon');
  toggleIcon.textContent = collapsed ? '»' : '«';
}

sidebarToggle.addEventListener('click', () => {
  const collapsed = appShell.classList.contains('sidebar-collapsed');
  setSidebarCollapsed(!collapsed);
});

document.getElementById('newStationBtn').addEventListener('click', createStation);
document.getElementById('newTaskBtn').addEventListener('click', createTask);
document.getElementById('newIncidentBtn').addEventListener('click', createIncident);
document.getElementById('newVehicleBtn').addEventListener('click', createVehicle);
if (newEquipmentBtn) newEquipmentBtn.addEventListener('click', createEquipment);
if (newShiftBtn) newShiftBtn.addEventListener('click', createShift);

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  loginError.textContent = '';
  try {
    const user = await loginUser({
      checknumber: checknumberInput.value.trim(),
      password: passwordInput.value.trim()
    });
    currentUser = user;
    renderProfileIdentity(user);
    if (keepLoggedInCheckbox.checked) {
      localStorage.setItem('zimamotoUser', JSON.stringify(user));
    }
    updateNavForRole(user.roleCode || user.role?.toLowerCase());
    setAuthenticated(true);
    await loadAllData();
  } catch (error) {
    loginError.textContent = error.message;
  }
});

submitFeedbackBtn.addEventListener('click', async () => {
  feedbackConfirmation.textContent = '';
  const source = feedbackSource.value.trim();
  const message = feedbackMessage.value.trim();

  if (!source || !message) {
    feedbackConfirmation.textContent = 'Please provide both source and message.';
    return;
  }

  try {
    await sendFeedback({
      source,
      message,
      createdAt: new Date().toISOString(),
      user: currentUser ? currentUser.name : 'Guest'
    });
    feedbackConfirmation.textContent = 'Feedback submitted successfully.';
    feedbackSource.value = '';
    feedbackMessage.value = '';
    await loadAllData();
  } catch (error) {
    feedbackConfirmation.textContent = error.message;
  }
});

signOutBtn.addEventListener('click', async () => {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } catch (error) {
    console.warn('Logout failed', error);
  }
  localStorage.removeItem('zimamotoUser');
  navBtns.forEach(btn => btn.classList.remove('hidden'));
  setAuthenticated(false);
});

languageSelect.addEventListener('change', (event) => {
  currentLanguage = event.target.value;
  setTranslations();
});

navBtns.forEach(btn => {
  btn.addEventListener('click', () => switchView(btn.dataset.view));
});

// Auth form switching
function showAuthForm(formId) {
  document.querySelectorAll('.auth-form').forEach(form => form.classList.add('hidden'));
  document.getElementById(formId).classList.remove('hidden');
}

document.getElementById('registerLink').addEventListener('click', (e) => {
  e.preventDefault();
  showAuthForm('registerForm');
  document.getElementById('authFormTitle').textContent = 'Create New Account';
});

document.getElementById('backToLoginLink').addEventListener('click', (e) => {
  e.preventDefault();
  showAuthForm('loginForm');
  document.getElementById('authFormTitle').textContent = 'Sign In to Zimamoto Mbeya';
});

document.getElementById('forgotPasswordLink').addEventListener('click', (e) => {
  e.preventDefault();
  showAuthForm('forgotPasswordForm');
  document.getElementById('authFormTitle').textContent = 'Reset Your Password';
});

document.getElementById('backToLoginLink2').addEventListener('click', (e) => {
  e.preventDefault();
  showAuthForm('loginForm');
  document.getElementById('authFormTitle').textContent = 'Sign In to Zimamoto Mbeya';
  document.getElementById('resetCodeContainer').classList.add('hidden');
});

// Registration
registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  registerError.textContent = '';
  const name = document.getElementById('registerNameInput').value.trim();
  const checknumber = document.getElementById('registerChecknumberInput').value.trim();
  const password = document.getElementById('registerPasswordInput').value.trim();
  const confirmPassword = document.getElementById('registerPasswordConfirmInput').value.trim();

  if (password !== confirmPassword) {
    registerError.textContent = 'Passwords do not match';
    return;
  }

  if (password.length < 6) {
    registerError.textContent = 'Password must be at least 6 characters';
    return;
  }

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, checknumber, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const user = await response.json();
    currentUser = user;
    renderProfileIdentity(user);
    if (document.getElementById('keepLoggedIn').checked) {
      localStorage.setItem('zimamotoUser', JSON.stringify(user));
    }
    updateNavForRole(user.roleCode || user.role?.toLowerCase());
    setAuthenticated(true);
    await loadAllData();
  } catch (error) {
    registerError.textContent = error.message;
  }
});

// Forgot Password
forgotPasswordForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  forgotPasswordError.textContent = '';
  const checknumber = document.getElementById('forgotChecknumberInput').value.trim();

  try {
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checknumber })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to request password reset');
    }

    const data = await response.json();
    forgotPasswordError.textContent = '';
    forgotPasswordError.style.color = 'green';
    forgotPasswordError.textContent = `Reset code sent! Code: ${data.token}`;
    document.getElementById('resetCodeContainer').classList.remove('hidden');
  } catch (error) {
    forgotPasswordError.textContent = error.message;
    forgotPasswordError.style.color = 'red';
  }
});

// Reset Password
document.getElementById('submitResetBtn').addEventListener('click', async () => {
  const token = document.getElementById('resetTokenInput').value.trim();
  const newPassword = document.getElementById('newPasswordInput').value.trim();
  const confirmPassword = document.getElementById('newPasswordConfirmInput').value.trim();

  if (newPassword !== confirmPassword) {
    forgotPasswordError.textContent = 'Passwords do not match';
    forgotPasswordError.style.color = 'red';
    return;
  }

  if (newPassword.length < 6) {
    forgotPasswordError.textContent = 'Password must be at least 6 characters';
    forgotPasswordError.style.color = 'red';
    return;
  }

  try {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Password reset failed');
    }

    forgotPasswordError.textContent = 'Password reset successful! Please sign in.';
    forgotPasswordError.style.color = 'green';
    setTimeout(() => {
      showAuthForm('loginForm');
      document.getElementById('authFormTitle').textContent = 'Sign In to Zimamoto Mbeya';
      document.getElementById('resetCodeContainer').classList.add('hidden');
      document.getElementById('forgotChecknumberInput').value = '';
      document.getElementById('resetTokenInput').value = '';
      document.getElementById('newPasswordInput').value = '';
      document.getElementById('newPasswordConfirmInput').value = '';
      forgotPasswordError.textContent = '';
    }, 2000);
  } catch (error) {
    forgotPasswordError.textContent = error.message;
    forgotPasswordError.style.color = 'red';
  }
});

function initialize() {
  const storedUser = localStorage.getItem('zimamotoUser');
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
    renderProfileIdentity(currentUser);
    updateNavForRole(currentUser.roleCode || currentUser.role?.toLowerCase());
    setAuthenticated(true);
    refreshCurrentProfile().catch(error => console.warn('Profile refresh failed', error));
    loadAllData();
  }
  setTranslations();
}

initialize();
