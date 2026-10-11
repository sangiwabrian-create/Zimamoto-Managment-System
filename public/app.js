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
const themeToggleButton = document.getElementById('themeToggleBtn');
const themeSelect = document.getElementById('settingsTheme');
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
let loginGalleryData = [];
let pendingLoginGallery = [];
let loginSlideIndex = 0;
let loginSlideshowTimer = null;
let loginSlideshowInterval = 6;
const displaySettingsDefaults = { compactTables: false, reduceMotion: false };
const printSettingsDefaults = { paper: 'a4', orientation: 'landscape', includeLogo: true, includeTimestamp: true, footer: 'Mbeya Fire and Rescue · Official Copy' };
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
const noticesList = document.getElementById('noticesList');
const usersList = document.getElementById('usersList');
const rolesList = document.getElementById('rolesList');
const regionalPersonnelSummary = document.getElementById('regionalPersonnelSummary');
const regionalPersonnelList = document.getElementById('regionalPersonnelList');
const newRegionalPersonnelBtn = document.getElementById('newRegionalPersonnelBtn');
const leaveList = document.getElementById('leaveList');
const trainingList = document.getElementById('trainingList');
const performanceList = document.getElementById('performanceList');
const financeList = document.getElementById('financeList');
const inspectionList = document.getElementById('inspectionList');
const newNoticeBtn = document.getElementById('newNoticeBtn');
const newUserBtn = document.getElementById('newUserBtn');
const newTrainingBtn = document.getElementById('newTrainingBtn');
const views = Array.from(document.querySelectorAll('.view'));
const navBtns = Array.from(document.querySelectorAll('.nav-btn'));
let regionalPersonnelRecords = [];
let stationOfficerCandidates = [];
let pendingRegionalCsvRows = [];
let regionalPersonnelStations = [];
let attendanceAdminRecords = [];
let attendanceMonthlyReport = null;

const translations = {
  en: {
    menu: 'Menu',
    dashboard: 'Dashboard',
    stationManagement: 'Station Management',
    stationTableColumns: ['Station Name', 'Location', 'Commander', 'Officers', 'Status', 'Actions'],
    viewRecord: 'View',
    manageOfficers: 'Manage officers',
    editRecord: 'Edit',
    deleteRecord: 'Delete',
    taskManagement: 'Task Management',
    incidentManagement: 'Incident Management',
    vehicleManagement: 'Vehicle Management',
    equipment: 'Equipment & Inventory',
    shiftManagement: 'Shift Management',
    attendance: 'Daily Attendance',
    attendanceDescription: 'Sign in for today. Attendance times are recorded by the server using East Africa Time.',
    yourAttendance: 'YOUR ATTENDANCE',
    regionalRegister: 'Regional daily register',
    attendanceRegisterDescription: 'Review active accounts and regional personnel. Update attendance for the selected date.',
    attendanceDate: 'Attendance date',
    attendanceMonth: 'Attendance month',
    findStaff: 'Find staff',
    searchStaffPlaceholder: 'Search name, role, or station',
    monthlyAttendanceSummary: 'Monthly attendance summary',
    allAttendanceRecords: 'All attendance records for this month',
    attendanceHistoryDescription: 'Every saved check-in and administrator update for the selected month.',
    selectedDayAttendance: 'Staff attendance for selected day',
    closeAttendanceMonth: 'Close completed month',
    printAttendance: 'Print attendance',
    attendancePeriodOpen: (month, isCurrent) => isCurrent
      ? `${month} is open. A new attendance month starts automatically at the beginning of each month.`
      : `${month} remains open for review until an administrator closes it.`,
    attendancePeriodClosed: (month, closedAt, closedBy) => `${month} was closed ${closedAt ? `on ${closedAt}` : ''}${closedBy ? ` by ${closedBy}` : ''}.`,
    closeAttendanceConfirm: month => `Close attendance for ${month}? This locks its records against further edits.`,
    attendanceCloseSuccess: 'Attendance month closed.',
    invalidAttendanceDate: 'Choose a valid attendance date.',
    invalidAttendanceMonth: 'Choose a valid attendance month.',
    attendanceMonthlyColumns: ['Date', 'Name', 'Role', 'Station', 'Status', 'Check-in time (EAT)', 'Recorded by'],
    attendanceChartLabel: 'Daily attendance by status. Bars show present, absent, and on-leave records.',
    noAttendanceHistory: 'No attendance records have been saved for this month.',
    attendanceRecordedBy: 'Recorded by',
    attendanceRecordsTotal: 'Saved records',
    signInToday: 'Sign in for today',
    signedIn: 'Signed in',
    signedInAt: time => `Signed in at ${time}`,
    notSignedIn: 'You have not signed in today.',
    onLeaveToday: 'Your attendance is marked as on leave today.',
    absentToday: 'Your attendance is marked absent. Sign in to update it to present.',
    recordingSignIn: 'Recording your sign-in…',
    attendanceColumns: ['Name', 'Role', 'Station', 'Status', 'Check-in time (EAT)', 'Actions'],
    attendanceStatuses: ['Present', 'Absent', 'On leave'],
    personnelFieldLabels: ['Full name', 'Role or position', 'Email', 'Phone', 'Station', 'Availability', 'Status message'],
    regionalPersonnelDescription: 'A clear, printable view of staff accounts and regional personnel records.',
    regionalPersonnelTitle: 'Regional Personnel',
    availabilityLabel: 'Availability',
    searchLabel: 'Search',
    regionalSearchPlaceholder: 'Search name, username, role, or station',
    printRoster: 'Print roster',
    useOfficialLogo: 'Use official logo',
    importCsv: 'Import CSV',
    csvTemplate: 'CSV template',
    addRegionalPersonnel: 'Add Regional Personnel',
    regionalPersonnelFormDescription: 'This adds someone to the regional roster only. It does not create a login account.',
    addPersonnelRecord: 'Add Personnel Record',
    editPersonnelRecord: 'Edit Personnel Record',
    savePersonnel: 'Save Personnel',
    personnelAdded: 'Personnel added to the regional roster.',
    personnelUpdated: 'Personnel record updated.',
    stationOfficerDescription: 'Select active staff for this station. Selecting someone at another station moves them here; clearing a selection removes them from this station.',
    searchStaff: 'Search staff',
    searchStaffPlaceholderStation: 'Search by name or role',
    noActiveStaff: 'No active staff accounts.',
    noMatchingStaff: 'No matching active staff members.',
    selectedStaff: (selected, total) => `${selected} of ${total} active staff selected`,
    saveOfficerAssignments: 'Save officer assignments',
    savingAssignments: 'Saving assignments…',
    officerAssignmentsUpdated: 'Officer assignments updated successfully.',
    regionalTableColumns: ['Name', 'Username', 'Role', 'Station', 'Availability', 'Status message', 'Record type'],
    personnelRecord: 'Personnel record',
    account: 'Account',
    noLogin: 'No login',
    unassigned: 'Unassigned',
    activeStaff: 'Active staff',
    availableNow: 'Available now',
    onDuty: 'On duty',
    onLeave: 'On leave',
    availabilityFilterOptions: ['All active staff', 'Available', 'On duty', 'Off duty', 'On leave'],
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
    submitFeedback: 'Submit Feedback',
    notices: 'Notice Board',
    users: 'User Administration',
    leave: 'Leave Requests',
    training: 'Training Management',
    performance: 'Performance Goals',
    settings: 'System Settings',
    createNotice: 'Create Notice',
    addUser: 'Add User',
    scheduleTraining: 'Schedule Training',
    emergencyHotline: 'Emergency hotline',
    heroEyebrow: 'M B E Y A  R E G I O N · OPERATIONS CENTRE',
    heroTitle: 'Ready to respond.',
    heroTitleAccent: 'Ready to protect.',
    heroDescription: 'Regional stations, response teams, incidents and resources — together in one command view.',
    recordIncident: 'Record an incident',
    emergencyLine: 'Emergency line',
    shortcutsLabel: 'Operational shortcuts'
  },
  sw: {
    menu: 'Menyu',
    dashboard: 'Dashboard',
    stationManagement: 'Usimamizi wa Vituo',
    stationTableColumns: ['Jina la kituo', 'Mahali', 'Kamanda', 'Askari', 'Hali', 'Vitendo'],
    viewRecord: 'Angalia',
    manageOfficers: 'Dhibiti askari',
    editRecord: 'Hariri',
    deleteRecord: 'Futa',
    taskManagement: 'Usimamizi wa Task',
    incidentManagement: 'Usimamizi wa Matukio',
    vehicleManagement: 'Usimamizi wa Magari',
    equipment: 'Vifaa & Mali',
    shiftManagement: 'Usimamizi wa Zamu',
    attendance: 'Mahudhurio ya Kila Siku',
    attendanceDescription: 'Jisajili kwa leo. Muda wa mahudhurio unarekodiwa na seva kwa saa za Afrika Mashariki.',
    yourAttendance: 'MAHUDHURIO YAKO',
    regionalRegister: 'Daftari la mahudhurio ya mkoa',
    attendanceRegisterDescription: 'Kagua akaunti hai na watumishi wa mkoa. Sasisha mahudhurio kwa tarehe iliyochaguliwa.',
    attendanceDate: 'Tarehe ya mahudhurio',
    attendanceMonth: 'Mwezi wa mahudhurio',
    findStaff: 'Tafuta mtumishi',
    searchStaffPlaceholder: 'Tafuta jina, wadhifa au kituo',
    monthlyAttendanceSummary: 'Muhtasari wa mahudhurio ya mwezi',
    allAttendanceRecords: 'Rekodi zote za mahudhurio ya mwezi huu',
    attendanceHistoryDescription: 'Kila usajili na sasisho la msimamizi lililohifadhiwa kwa mwezi uliochaguliwa.',
    selectedDayAttendance: 'Mahudhurio ya watumishi kwa siku iliyochaguliwa',
    closeAttendanceMonth: 'Funga mwezi uliokamilika',
    printAttendance: 'Chapisha mahudhurio',
    attendancePeriodOpen: (month, isCurrent) => isCurrent
      ? `${month} uko wazi. Mwezi mpya wa mahudhurio utaanza moja kwa moja mwanzoni mwa kila mwezi.`
      : `${month} uko wazi kwa ukaguzi hadi msimamizi atakapoufunga.`,
    attendancePeriodClosed: (month, closedAt, closedBy) => `${month} ulifungwa ${closedAt ? `tarehe ${closedAt}` : ''}${closedBy ? ` na ${closedBy}` : ''}.`,
    closeAttendanceConfirm: month => `Funga mahudhurio ya ${month}? Rekodi zake hazitaweza kusasishwa tena.`,
    attendanceCloseSuccess: 'Mwezi wa mahudhurio umefungwa.',
    invalidAttendanceDate: 'Chagua tarehe halali ya mahudhurio.',
    invalidAttendanceMonth: 'Chagua mwezi halali wa mahudhurio.',
    attendanceMonthlyColumns: ['Tarehe', 'Jina', 'Wadhifa', 'Kituo', 'Hali', 'Muda wa kuingia (EAT)', 'Imerekodiwa na'],
    attendanceChartLabel: 'Mahudhurio ya kila siku kwa hali. Michoro inaonyesha waliopo, wasiokuwepo na walio likizo.',
    noAttendanceHistory: 'Hakuna rekodi za mahudhurio zilizohifadhiwa kwa mwezi huu.',
    attendanceRecordedBy: 'Imerekodiwa na',
    attendanceRecordsTotal: 'Rekodi zilizohifadhiwa',
    signInToday: 'Jisajili leo',
    signedIn: 'Umejisajili',
    signedInAt: time => `Umejisajili saa ${time}`,
    notSignedIn: 'Bado hujajisajili leo.',
    onLeaveToday: 'Mahudhurio yako yamewekwa kwenye likizo ya leo.',
    absentToday: 'Mahudhurio yako yamewekwa kuwa haupo. Jisajili ili kubadilisha kuwa yupo.',
    recordingSignIn: 'Inarekodi usajili wako…',
    attendanceColumns: ['Jina', 'Wadhifa', 'Kituo', 'Hali', 'Muda wa kuingia (EAT)', 'Vitendo'],
    attendanceStatuses: ['Yupo', 'Hayupo', 'Likizo'],
    personnelFieldLabels: ['Jina kamili', 'Wadhifa', 'Barua pepe', 'Simu', 'Kituo', 'Upatikanaji', 'Ujumbe wa hali'],
    regionalPersonnelDescription: 'Orodha safi ya akaunti za watumishi na rekodi za watumishi wa mkoa, tayari kuchapishwa.',
    regionalPersonnelTitle: 'Watumishi wa Mkoa',
    availabilityLabel: 'Upatikanaji',
    searchLabel: 'Tafuta',
    regionalSearchPlaceholder: 'Tafuta jina, jina la mtumiaji, wadhifa au kituo',
    printRoster: 'Chapisha orodha',
    useOfficialLogo: 'Tumia nembo rasmi',
    importCsv: 'Ingiza CSV',
    csvTemplate: 'Kiolezo cha CSV',
    addRegionalPersonnel: 'Ongeza Mtumishi wa Mkoa',
    regionalPersonnelFormDescription: 'Hii huongeza mtu kwenye orodha ya mkoa pekee; haifungui akaunti ya kuingia.',
    addPersonnelRecord: 'Ongeza Rekodi ya Mtumishi',
    editPersonnelRecord: 'Hariri Rekodi ya Mtumishi',
    savePersonnel: 'Hifadhi Mtumishi',
    personnelAdded: 'Mtumishi ameongezwa kwenye orodha ya mkoa.',
    personnelUpdated: 'Rekodi ya mtumishi imesasishwa.',
    stationOfficerDescription: 'Chagua watumishi walio hai kwa kituo hiki. Ukimchagua aliye kituo kingine, atahamishiwa hapa; ukiondoa uteuzi, ataondolewa kituoni.',
    searchStaff: 'Tafuta watumishi',
    searchStaffPlaceholderStation: 'Tafuta kwa jina au wadhifa',
    noActiveStaff: 'Hakuna akaunti za watumishi zilizo hai.',
    noMatchingStaff: 'Hakuna watumishi walio hai wanaolingana na utafutaji.',
    selectedStaff: (selected, total) => `Watumishi ${selected} kati ya ${total} walio hai wamechaguliwa`,
    saveOfficerAssignments: 'Hifadhi ugawaji wa askari',
    savingAssignments: 'Inahifadhi ugawaji…',
    officerAssignmentsUpdated: 'Ugawaji wa askari umesasishwa.',
    regionalTableColumns: ['Jina', 'Jina la mtumiaji', 'Wadhifa', 'Kituo', 'Upatikanaji', 'Ujumbe wa hali', 'Aina ya rekodi'],
    personnelRecord: 'Rekodi ya mtumishi',
    account: 'Akaunti',
    noLogin: 'Hana akaunti ya kuingia',
    unassigned: 'Hajapangiwa',
    activeStaff: 'Watumishi hai',
    availableNow: 'Wanapatikana sasa',
    onDuty: 'Zamu kazini',
    onLeave: 'Likizo',
    availabilityFilterOptions: ['Watumishi wote walio hai', 'Wanapatikana', 'Zamu kazini', 'Hawapo kazini', 'Likizo'],
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
    submitFeedback: 'Tuma Maoni',
    notices: 'Ubao wa Matangazo',
    users: 'Usimamizi wa Watumiaji',
    leave: 'Maombi ya Likizo',
    training: 'Usimamizi wa Mafunzo',
    performance: 'Malengo ya Utendaji',
    settings: 'Mipangilio ya Mfumo',
    createNotice: 'Unda Tangazo',
    addUser: 'Ongeza Mtumiaji',
    scheduleTraining: 'Panga Mafunzo',
    emergencyHotline: 'Namba ya dharura',
    heroEyebrow: 'M B E Y A  M K O A · KITUO CHA UENDESHAJI',
    heroTitle: 'Tayari kuitikia.',
    heroTitleAccent: 'Tayari kulinda.',
    heroDescription: 'Vituo, vikosi vya uokoaji, matukio na rasilimali za mkoa — katika kituo kimoja cha uendeshaji.',
    recordIncident: 'Rekodi tukio',
    emergencyLine: 'Namba ya dharura'
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
  document.getElementById('attendanceTitle').textContent = t.attendance;
  document.getElementById('attendanceDescription').textContent = t.attendanceDescription;
  document.getElementById('attendanceKicker').textContent = t.yourAttendance;
  document.getElementById('attendanceRegisterTitle').textContent = t.regionalRegister;
  document.getElementById('attendanceRegisterDescription').textContent = t.attendanceRegisterDescription;
  document.getElementById('attendanceDateLabel').textContent = t.attendanceDate;
  document.getElementById('attendanceMonthLabel').textContent = t.attendanceMonth;
  document.getElementById('attendanceSearchLabel').textContent = t.findStaff;
  document.getElementById('attendanceSearchInput').placeholder = t.searchStaffPlaceholder;
  document.getElementById('attendanceMonthlyTitle').textContent = t.monthlyAttendanceSummary;
  document.getElementById('attendanceHistoryTitle').textContent = t.allAttendanceRecords;
  document.getElementById('attendanceHistoryDescription').textContent = t.attendanceHistoryDescription;
  document.getElementById('attendanceDailyTitle').textContent = t.selectedDayAttendance;
  document.getElementById('closeAttendanceMonthBtn').textContent = t.closeAttendanceMonth;
  document.getElementById('printAttendanceBtn').textContent = t.printAttendance;
  document.getElementById('attendanceCheckInBtn').textContent = t.signInToday;
  document.getElementById('regionalPersonnelDescription').textContent = t.regionalPersonnelDescription;
  document.querySelector('#regionalPersonnelView .regional-personnel-header h2').textContent = t.regionalPersonnelTitle;
  document.getElementById('regionalPersonnelAvailabilityFieldLabel').textContent = t.availabilityLabel;
  document.getElementById('regionalPersonnelAvailabilityLabel').textContent = t.availabilityLabel;
  document.getElementById('regionalPersonnelSearchLabel').textContent = t.searchLabel;
  document.getElementById('regionalPersonnelSearch').placeholder = t.regionalSearchPlaceholder;
  document.getElementById('printRegionalPersonnelBtn').textContent = t.printRoster;
  document.getElementById('regionalPersonnelLogoLabel').childNodes[0].textContent = `${t.useOfficialLogo} `;
  document.getElementById('uploadRegionalPersonnelCsvBtn').textContent = t.importCsv;
  document.getElementById('downloadRegionalPersonnelTemplateBtn').textContent = t.csvTemplate;
  newRegionalPersonnelBtn.textContent = t.addRegionalPersonnel;
  document.getElementById('regionalPersonnelFormDescription').textContent = t.regionalPersonnelFormDescription;
  Array.from(document.querySelectorAll('#regionalPersonnelForm .module-form-grid > label')).forEach((label, index) => {
    if (label.firstChild?.nodeType === Node.TEXT_NODE) label.firstChild.textContent = `${t.personnelFieldLabels[index]}\n`;
  });
  const statusMessageLabel = document.getElementById('regionalPersonnelStatusMessage').parentElement;
  if (statusMessageLabel.firstChild?.nodeType === Node.TEXT_NODE) statusMessageLabel.firstChild.textContent = `${t.personnelFieldLabels.at(-1)} `;
  if (!document.getElementById('regionalPersonnelId').value) {
    document.getElementById('regionalPersonnelFormTitle').textContent = t.addPersonnelRecord;
  }
  document.querySelector('#regionalPersonnelForm .form-actions .primary').textContent = t.savePersonnel;
  Array.from(document.getElementById('regionalPersonnelAvailability').options).forEach((option, index) => {
    option.textContent = t.availabilityFilterOptions[index];
  });
  const personnelAvailabilityLabels = currentLanguage === 'sw'
    ? ['Wanapatikana', 'Zamu kazini', 'Hawapo kazini', 'Likizo']
    : ['Available', 'On duty', 'Off duty', 'On leave'];
  Array.from(document.getElementById('regionalPersonnelNewAvailability').options).forEach((option, index) => {
    option.textContent = personnelAvailabilityLabels[index];
  });
  document.getElementById('stationOfficerDescription').textContent = t.stationOfficerDescription;
  document.getElementById('stationOfficerSearch').previousElementSibling.textContent = t.searchStaff;
  document.getElementById('stationOfficerSearch').placeholder = t.searchStaffPlaceholderStation;
  document.getElementById('saveStationOfficersBtn').textContent = t.saveOfficerAssignments;
  document.getElementById('cancelStationOfficersBtn').textContent = currentLanguage === 'sw' ? 'Ghairi' : 'Cancel';
  document.getElementById('cancelRegionalPersonnelBtn').textContent = currentLanguage === 'sw' ? 'Ghairi' : 'Cancel';
  feedbackTitle.textContent = t.feedback;
  reportsTitle.textContent = t.reports;
  document.querySelector('#noticesView h2').textContent = t.notices;
  document.querySelector('#usersView h2').textContent = t.users;
  document.querySelector('#leaveView h2').textContent = t.leave;
  document.querySelector('#trainingView h2').textContent = t.training;
  document.querySelector('#performanceView h2').textContent = t.performance;
  document.querySelector('#settingsView h2').textContent = t.settings;
  document.getElementById('newStationBtn').textContent = t.addStation;
  document.getElementById('newTaskBtn').textContent = t.createTask;
  document.getElementById('newIncidentBtn').textContent = t.recordIncident;
  document.getElementById('newVehicleBtn').textContent = t.registerVehicle;
  if (newEquipmentBtn) newEquipmentBtn.textContent = 'Add Equipment';
  if (newShiftBtn) newShiftBtn.textContent = 'Add Shift';
  newNoticeBtn.textContent = t.createNotice;
  newUserBtn.textContent = t.addUser;
  newTrainingBtn.textContent = t.scheduleTraining;
  feedbackSource.placeholder = t.feedbackSourcePlaceholder;
  document.getElementById('submitFeedbackBtn').textContent = t.submitFeedback;
  document.querySelector('.emergency-hotline span').textContent = t.emergencyHotline;
  document.querySelector('.operations-eyebrow').textContent = t.heroEyebrow;
  document.querySelector('#operationsHeroTitle').innerHTML = `${escapeHtml(t.heroTitle)}<br><span>${escapeHtml(t.heroTitleAccent)}</span>`;
  document.querySelector('.operations-hero-copy > p').textContent = t.heroDescription;
  document.getElementById('dashboardRecordIncidentBtn').textContent = t.recordIncident;
  document.querySelector('.hero-action-secondary').firstChild.textContent = `${t.emergencyLine} `;
  document.querySelector('.command-shortcuts').setAttribute('aria-label', t.shortcutsLabel || 'Operational shortcuts');
}

function createSummaryCard(label, value) {
  const card = document.createElement('div');
  card.className = 'summary-card';
  const labelElement = document.createElement('span');
  labelElement.className = 'summary-label';
  labelElement.textContent = label;
  const valueElement = document.createElement('strong');
  valueElement.className = 'summary-value';
  valueElement.textContent = String(value);
  card.append(labelElement, valueElement);
  return card;
}

function translateAvailability(value) {
  if (currentLanguage !== 'sw') return value;
  return ({
    Available: 'Anapatikana',
    'On duty': 'Zamu kazini',
    'Off duty': 'Hayupo kazini',
    'On leave': 'Likizo'
  })[value] || value;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
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
    body: JSON.stringify({ ...credentials, keepLoggedIn: keepLoggedInCheckbox.checked })
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }
  return response.json();
}

function renderLoginSlideshow(images) {
  const image = document.getElementById('loginArtwork');
  const placeholder = document.getElementById('loginArtworkPlaceholder');
  const controls = document.getElementById('loginSlideshowControls');
  const indicators = document.getElementById('loginSlideIndicators');
  const slides = Array.isArray(images) ? images : [];
  loginSlideIndex = slides.length ? loginSlideIndex % slides.length : 0;
  image.classList.toggle('hidden', slides.length === 0);
  placeholder.classList.toggle('hidden', slides.length > 0);
  controls.classList.toggle('hidden', slides.length < 2);
  indicators.replaceChildren(...slides.map((_, index) => {
    const indicator = document.createElement('button');
    indicator.type = 'button';
    indicator.className = 'login-slide-indicator';
    indicator.setAttribute('aria-label', `Show photo ${index + 1}`);
    indicator.setAttribute('aria-current', String(index === loginSlideIndex));
    indicator.addEventListener('click', () => showLoginSlide(index));
    return indicator;
  }));
  if (slides.length) {
    image.src = slides[loginSlideIndex];
    image.alt = `Fire and rescue force photo ${loginSlideIndex + 1} of ${slides.length}`;
  } else {
    image.removeAttribute('src');
    image.alt = 'Zimamoto Mbeya login page artwork';
  }
  if (slides.length > 1) startLoginSlideshow();
  else stopLoginSlideshow();
}

function showLoginSlide(index) {
  if (!loginGalleryData.length) return;
  loginSlideIndex = (index + loginGalleryData.length) % loginGalleryData.length;
  const image = document.getElementById('loginArtwork');
  image.src = loginGalleryData[loginSlideIndex];
  image.alt = `Fire and rescue force photo ${loginSlideIndex + 1} of ${loginGalleryData.length}`;
  document.querySelectorAll('.login-slide-indicator').forEach((indicator, i) => {
    indicator.setAttribute('aria-current', String(i === loginSlideIndex));
  });
}

function stopLoginSlideshow() {
  if (loginSlideshowTimer) window.clearInterval(loginSlideshowTimer);
  loginSlideshowTimer = null;
}

function startLoginSlideshow() {
  stopLoginSlideshow();
  if (
    loginGalleryData.length < 2 ||
    document.hidden ||
    loginView.classList.contains('hidden') ||
    document.body.classList.contains('reduce-motion') ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    document.getElementById('loginSlideshowToggle').getAttribute('aria-pressed') === 'true'
  ) return;
  loginSlideshowTimer = window.setInterval(() => showLoginSlide(loginSlideIndex + 1), loginSlideshowInterval * 1000);
}

function renderLoginGallerySettings(images) {
  const preview = document.getElementById('loginGallerySettingsPreview');
  preview.replaceChildren();
  if (!images.length) {
    const empty = document.createElement('p');
    empty.className = 'empty-preview';
    empty.textContent = 'No slideshow photos selected. The official emblem remains visible.';
    preview.appendChild(empty);
    return;
  }
  images.forEach((src, index) => {
    const item = document.createElement('div');
    item.className = 'login-gallery-preview-item';
    const thumbnail = document.createElement('img');
    thumbnail.src = src;
    thumbnail.alt = `Slideshow photo ${index + 1}`;
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'secondary compact-button';
    remove.textContent = `Remove ${index + 1}`;
    remove.setAttribute('aria-label', `Remove slideshow photo ${index + 1}`);
    remove.addEventListener('click', () => {
      pendingLoginGallery.splice(index, 1);
      renderLoginGallerySettings(pendingLoginGallery);
    });
    item.append(thumbnail, remove);
    preview.appendChild(item);
  });
}

async function loadLoginArtwork() {
  const response = await fetch('/api/public/login-artwork');
  if (!response.ok) throw new Error('Unable to load login page artwork');
  const payload = await response.json();
  loginGalleryData = Array.isArray(payload.images) ? payload.images : payload.image ? [payload.image] : [];
  loginSlideshowInterval = [4, 6, 8, 10].includes(Number(payload.interval)) ? Number(payload.interval) : 6;
  document.getElementById('loginSlideshowInterval').value = String(loginSlideshowInterval);
  pendingLoginGallery = [...loginGalleryData];
  renderLoginSlideshow(loginGalleryData);
  renderLoginGallerySettings(pendingLoginGallery);
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
  if (authenticated) stopLoginSlideshow();
  else startLoginSlideshow();
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
  admin: ['dashboard', 'stations', 'tasks', 'incidents', 'vehicles', 'equipment', 'shifts', 'attendance', 'notices', 'users', 'regionalPersonnel', 'leave', 'training', 'performance', 'finance', 'inspections', 'feedback', 'reports', 'settings'],
  system_manager: ['dashboard', 'stations', 'tasks', 'incidents', 'vehicles', 'equipment', 'shifts', 'attendance', 'notices', 'users', 'regionalPersonnel', 'leave', 'training', 'performance', 'finance', 'inspections', 'feedback', 'reports', 'settings'],
  station: ['dashboard', 'stations', 'tasks', 'incidents', 'vehicles', 'equipment', 'shifts', 'attendance', 'notices', 'leave', 'training', 'performance', 'feedback', 'reports', 'settings'],
  shift: ['dashboard', 'tasks', 'incidents', 'shifts', 'attendance', 'notices', 'leave', 'training', 'performance', 'feedback', 'reports', 'settings'],
  officer: ['dashboard', 'tasks', 'incidents', 'attendance', 'notices', 'leave', 'training', 'performance', 'feedback', 'reports', 'settings'],
  mechanic: ['dashboard', 'vehicles', 'equipment', 'attendance', 'notices', 'leave', 'training', 'performance', 'feedback', 'reports', 'settings'],
  equipment: ['dashboard', 'equipment', 'attendance', 'notices', 'leave', 'feedback', 'reports', 'settings'],
  hr: ['dashboard', 'users', 'regionalPersonnel', 'attendance', 'leave', 'training', 'performance', 'notices', 'feedback', 'reports', 'settings'],
  accountant: ['dashboard', 'finance', 'attendance', 'notices', 'reports', 'settings'],
  fire_marshal: ['dashboard', 'stations', 'incidents', 'equipment', 'inspections', 'attendance', 'notices', 'reports', 'settings'],
  viewer: ['dashboard', 'attendance', 'notices', 'reports', 'settings']
};

const roleActivities = {
  admin: ['Manage every module, users, role assignments, attendance, system settings, and backups.'],
  system_manager: ['Full operational and user administration access, including attendance, audit, and backup tools.'],
  hr: ['Review regional staff availability and maintain the staff directory; review leave requests; coordinate training and performance records.'],
  accountant: ['Record income and expenses; maintain references; verify or reject pending financial entries; review reports.'],
  fire_marshal: ['Review station, incident, and equipment records; record fire-safety inspections, hazards, and follow-up actions.'],
  station: ['Manage station operations, assignments, incidents, shifts, notices, and local staff workflows.'],
  shift: ['Coordinate shifts, tasks, incident responses, leave reviews, and training schedules.'],
  officer: ['Review assigned operations, report incidents, submit leave requests, and track personal goals.'],
  mechanic: ['Maintain assigned vehicle and equipment readiness and report operational issues.'],
  equipment: ['Track equipment inventory and condition and report damaged or missing items.'],
  viewer: ['View dashboard summaries, notices, and reports without operational write access.']
};

function updateNavForRole(role) {
  const fullAccess = ['admin', 'system_manager'].includes(role);
  const allowed = viewPermissions[role] || viewPermissions.viewer;
  navBtns.forEach(btn => btn.classList.toggle('hidden', !allowed.includes(btn.dataset.view)));
  document.querySelectorAll('.command-shortcut').forEach(button => {
    button.classList.toggle('hidden', !allowed.includes(button.dataset.dashboardView));
  });
  document.getElementById('dashboardRecordIncidentBtn').classList.toggle('hidden', !['admin', 'system_manager', 'station', 'shift', 'officer', 'fire_marshal'].includes(role));
  const activeButton = navBtns.find(btn => btn.classList.contains('active') && !btn.classList.contains('hidden'));
  if (!activeButton) {
    const firstVisible = navBtns.find(btn => !btn.classList.contains('hidden'));
    if (firstVisible) switchView(firstVisible.dataset.view);
  }
  newNoticeBtn.classList.toggle('hidden', !(fullAccess || ['station'].includes(role)));
  newUserBtn.classList.toggle('hidden', !fullAccess);
  newRegionalPersonnelBtn.classList.toggle('hidden', !(fullAccess || role === 'hr'));
  newTrainingBtn.classList.toggle('hidden', !(fullAccess || ['station', 'shift', 'hr'].includes(role)));
  document.getElementById('newStationBtn').classList.toggle('hidden', !(fullAccess || role === 'station'));
  document.getElementById('newTaskBtn').classList.toggle('hidden', !(fullAccess || ['station', 'shift'].includes(role)));
  document.getElementById('newIncidentBtn').classList.toggle('hidden', !(fullAccess || ['station', 'shift', 'officer', 'fire_marshal'].includes(role)));
  document.getElementById('newVehicleBtn').classList.toggle('hidden', !(fullAccess || role === 'mechanic'));
  newEquipmentBtn.classList.toggle('hidden', !(fullAccess || ['equipment', 'fire_marshal'].includes(role)));
  newShiftBtn.classList.toggle('hidden', !(fullAccess || ['station', 'shift'].includes(role)));
  document.getElementById('newInspectionBtn').classList.toggle('hidden', !(fullAccess || role === 'fire_marshal'));
  document.querySelectorAll('.admin-only').forEach(element => element.classList.toggle('hidden', !fullAccess));
  renderRoleActivities(role);
}

function renderRoleActivities(role) {
  const descriptions = roleActivities[role] || roleActivities.viewer;
  const label = currentUser?.role || role;
  document.getElementById('roleActivities').innerHTML = `<article class="role-activity-card"><div><span class="role-activity-kicker">YOUR ROLE</span><h3>${escapeHtml(label)}</h3></div><ul>${descriptions.map(activity => `<li>${escapeHtml(activity)}</li>`).join('')}</ul></article>`;
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
  if (data.pendingLeave !== undefined) dashboardSummary.appendChild(createSummaryCard('Leave Requests', data.pendingLeave));
  if (data.trainingUpcoming !== undefined) dashboardSummary.appendChild(createSummaryCard('Upcoming Training', data.trainingUpcoming));
  if (data.performanceGoals !== undefined) dashboardSummary.appendChild(createSummaryCard('Performance Goals', data.performanceGoals));
  if (data.financePending !== undefined) dashboardSummary.appendChild(createSummaryCard('Finance Pending', data.financePending));
  if (data.fireInspections !== undefined) dashboardSummary.appendChild(createSummaryCard('Fire Inspections', data.fireInspections));

  const noticeItems = data.notifications.slice(0, 3).map(notice => `
    <li class="notice-preview">
      <span class="notice-preview-marker" aria-hidden="true"></span>
      <span><strong>${escapeHtml(notice.title)}</strong><small>${escapeHtml(notice.date || '')}${notice.message ? ` · ${escapeHtml(notice.message)}` : ''}</small></span>
    </li>
  `).join('');
  const stationItems = data.stations.slice(0, 4).map(station => {
    const isOperational = String(station.status).toLowerCase() === 'active';
    return `
      <li class="station-preview">
        <span class="station-preview-indicator ${isOperational ? 'operational' : 'attention'}" aria-hidden="true"></span>
        <span><strong>${escapeHtml(station.name)}</strong><small>${escapeHtml(station.location || 'Location not set')} · ${station.officers.length} personnel</small></span>
        <span class="station-status-label">${isOperational ? 'Operational' : escapeHtml(station.status)}</span>
      </li>
    `;
  }).join('');
  dashboardCards.innerHTML = `
    <article class="dashboard-card">
      <div class="dashboard-card-heading">
        <div><span class="dashboard-section-kicker">REGIONAL BRIEFING</span><h3>Official notices</h3></div>
        <button class="text-action" data-dashboard-view="notices" type="button">View all <span aria-hidden="true">→</span></button>
      </div>
      <ul class="dashboard-preview-list">${noticeItems || '<li class="empty-preview">No active notices at this time.</li>'}</ul>
    </article>
    <article class="dashboard-card">
      <div class="dashboard-card-heading">
        <div><span class="dashboard-section-kicker">FIELD NETWORK</span><h3>Station readiness</h3></div>
        <button class="text-action" data-dashboard-view="stations" type="button">All stations <span aria-hidden="true">→</span></button>
      </div>
      <ul class="dashboard-preview-list">${stationItems || '<li class="empty-preview">No stations have been registered.</li>'}</ul>
    </article>
  `;
  dashboardCards.querySelectorAll('[data-dashboard-view]').forEach(button => {
    button.addEventListener('click', () => switchView(button.dataset.dashboardView));
  });
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

async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Unable to load data');
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
  return `<span class="row-actions"><button class="secondary action-btn" data-action="${type}" data-id="${id}">${label}</button></span>`;
}

function renderStations(data) {
  const canManage = ['admin', 'system_manager', 'station'].includes(currentUser?.roleCode);
  const rows = data.map(station => [
    escapeHtml(station.name),
    escapeHtml(station.location),
    escapeHtml(station.commander),
    escapeHtml(station.officers.join(', ')),
    escapeHtml(station.status),
    `${actionButtonsHtml(station.id, 'view-station', translations[currentLanguage].viewRecord)}${canManage ? actionButtonsHtml(station.id, 'manage-station-officers', translations[currentLanguage].manageOfficers) + actionButtonsHtml(station.id, 'edit-station', translations[currentLanguage].editRecord) + actionButtonsHtml(station.id, 'delete-station', translations[currentLanguage].deleteRecord) : ''}`
  ]);
  stationsList.innerHTML = '';
  const table = createTable(translations[currentLanguage].stationTableColumns, rows);
  stationsList.appendChild(table);
  attachActionButtons(stationsList, '.action-btn[data-action="view-station"]', async (id) => {
    const station = data.find(item => item.id === Number(id));
    if (!station) return;
    showDetails('Station Details', `Name: ${station.name}\nLocation: ${station.location}\nCommander: ${station.commander}\nOfficers: ${station.officers.join(', ')}\nStatus: ${station.status}`);
  });
  attachActionButtons(stationsList, '.action-btn[data-action="manage-station-officers"]', id => {
    const station = data.find(item => item.id === Number(id));
    if (station) showStationOfficerManager(station);
  });
  attachActionButtons(stationsList, '.action-btn[data-action="edit-station"]', async (id) => {
    const station = data.find(item => item.id === Number(id));
    if (!station) return;
    const name = prompt('Station name:', station.name) || station.name;
    const location = prompt('Location:', station.location || '') || station.location || '';
    const commander = prompt('Station commander:', station.commander || '') || station.commander || '';
    const officers = prompt('Legacy officer names (comma separated):', station.legacyOfficers.join(', ')) ?? station.legacyOfficers.join(', ');
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

function renderStationOfficerChoices() {
  const stationId = Number(document.getElementById('stationOfficersStationId').value);
  const container = document.getElementById('stationOfficerChoices');
  container.innerHTML = stationOfficerCandidates.map(user => {
    const otherStation = user.stationName && Number(user.station_id) !== stationId
      ? ` · ${currentLanguage === 'sw' ? 'Kwa sasa kituo cha' : 'Currently at'} ${escapeHtml(user.stationName)}`
      : '';
    return `
      <label class="staff-choice-item">
        <input type="checkbox" name="stationOfficerIds" value="${user.id}" ${Number(user.station_id) === stationId ? 'checked' : ''}>
        <span>${escapeHtml(user.name)}<small>${escapeHtml(user.role)} · ${escapeHtml(translateAvailability(user.availability || 'Off duty'))}${otherStation}</small></span>
      </label>
    `;
  }).join('') || `<p>${escapeHtml(translations[currentLanguage].noActiveStaff)}</p>`;
  if (stationOfficerCandidates.length) {
    container.insertAdjacentHTML('beforeend', `<p id="stationOfficerNoMatches" class="hidden">${escapeHtml(translations[currentLanguage].noMatchingStaff)}</p>`);
  }
  filterStationOfficerChoices();
}

function filterStationOfficerChoices() {
  const search = document.getElementById('stationOfficerSearch').value.trim().toLowerCase();
  const items = Array.from(document.querySelectorAll('#stationOfficerChoices .staff-choice-item'));
  let hasMatches = false;
  items.forEach(item => {
    const matches = item.textContent.toLowerCase().includes(search);
    item.classList.toggle('hidden', !matches);
    hasMatches ||= matches;
  });
  document.getElementById('stationOfficerNoMatches')?.classList.toggle('hidden', hasMatches);
}

async function showStationOfficerManager(station) {
  const form = document.getElementById('stationOfficersForm');
  const message = document.getElementById('stationOfficersMessage');
  moduleNotice(message, '');
  try {
    stationOfficerCandidates = await getJson(`/api/stations/${station.id}/officer-candidates`);
    document.getElementById('stationOfficersStationId').value = station.id;
    document.getElementById('stationOfficersTitle').textContent = `${currentLanguage === 'sw' ? 'Dhibiti askari' : 'Manage officers'} — ${station.name}`;
    document.getElementById('stationOfficerSearch').value = '';
    renderStationOfficerChoices();
    updateStationOfficerSelectionCount();
    form.classList.remove('hidden');
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } catch (error) {
    alert(error.message);
  }
}

function updateStationOfficerSelectionCount() {
  const selected = document.querySelectorAll('#stationOfficerChoices input[name="stationOfficerIds"]:checked').length;
  const total = stationOfficerCandidates.length;
  document.getElementById('stationOfficerSelectionCount').textContent = translations[currentLanguage].selectedStaff(selected, total);
}

function renderRegionalPersonnel() {
  const availableCount = regionalPersonnelRecords.filter(user => user.availability === 'Available').length;
  const onDutyCount = regionalPersonnelRecords.filter(user => user.availability === 'On duty').length;
  const onLeaveCount = regionalPersonnelRecords.filter(user => user.availability === 'On leave').length;
  regionalPersonnelSummary.replaceChildren(
    createSummaryCard(translations[currentLanguage].activeStaff, regionalPersonnelRecords.length),
    createSummaryCard(translations[currentLanguage].availableNow, availableCount),
    createSummaryCard(translations[currentLanguage].onDuty, onDutyCount),
    createSummaryCard(translations[currentLanguage].onLeave, onLeaveCount)
  );

  const selectedAvailability = document.getElementById('regionalPersonnelAvailability').value;
  const search = document.getElementById('regionalPersonnelSearch').value.trim().toLowerCase();
  const filtered = regionalPersonnelRecords.filter(user => {
    const matchesAvailability = selectedAvailability === 'all' || user.availability === selectedAvailability;
    const matchesSearch = `${user.name} ${user.checknumber} ${user.role} ${user.stationName || ''}`.toLowerCase().includes(search);
    return matchesAvailability && matchesSearch;
  });
  const rows = filtered.map(user => {
    const availability = user.availability || 'Off duty';
    const availabilityClass = {
      Available: 'available',
      'On duty': 'on-duty',
      'Off duty': 'off-duty',
      'On leave': 'on-leave'
    }[availability] || 'off-duty';
    return [
      escapeHtml(user.name),
      escapeHtml(user.checknumber || translations[currentLanguage].noLogin),
      escapeHtml(user.role),
      escapeHtml(user.stationName || translations[currentLanguage].unassigned),
      `<span class="availability-pill ${availabilityClass}">${escapeHtml(translateAvailability(availability))}</span>`,
      escapeHtml(user.status_message || '—'),
      user.recordType === 'Personnel record'
        ? `<div class="personnel-record-cell"><span>${escapeHtml(translations[currentLanguage].personnelRecord)}</span>${actionButtonsHtml(user.personnelId, 'edit-regional-personnel', currentLanguage === 'sw' ? 'Hariri' : 'Edit')}</div>`
        : `<span>${escapeHtml(translations[currentLanguage].account)}</span>`
    ];
  });
  regionalPersonnelList.replaceChildren(createTable(translations[currentLanguage].regionalTableColumns, rows));
  attachActionButtons(regionalPersonnelList, '.action-btn[data-action="edit-regional-personnel"]', id => {
    const record = regionalPersonnelRecords.find(user => Number(user.personnelId) === Number(id));
    if (record) showRegionalPersonnelEditor(record);
  });
}

async function loadRegionalPersonnel() {
  [regionalPersonnelRecords, regionalPersonnelStations] = await Promise.all([
    getJson('/api/regional-personnel'),
    getJson('/api/stations')
  ]);
  renderRegionalPersonnel();
}

function parseRegionalCsv(text) {
  const source = text.replace(/^\uFEFF/, '');
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    if (character === '"' && quoted && source[index + 1] === '"') {
      field += '"';
      index += 1;
    } else if (character === '"' && field.length === 0) {
      quoted = !quoted;
    } else if (character === ',' && !quoted) {
      row.push(field.trim());
      field = '';
    } else if ((character === '\n' || character === '\r') && !quoted) {
      row.push(field.trim());
      field = '';
      if (row.some(value => value !== '')) rows.push(row);
      row = [];
      if (character === '\r' && source[index + 1] === '\n') index += 1;
    } else {
      field += character;
    }
  }
  if (quoted) throw new Error('The CSV contains an unclosed quote.');
  row.push(field.trim());
  if (row.some(value => value !== '')) rows.push(row);
  if (rows.length < 2) throw new Error('The CSV must include a header row and at least one person.');
  if (rows.length > 501) throw new Error('Import no more than 500 people in one CSV file.');

  const normalizeHeader = value => value.trim().toLowerCase().replace(/[\s-]+/g, '_');
  const headers = rows[0].map(normalizeHeader);
  const findColumn = (...names) => names.map(name => headers.indexOf(name)).find(index => index !== -1);
  const columns = {
    name: findColumn('name', 'full_name', 'person_name'),
    role_title: findColumn('role', 'role_title', 'position', 'job_title'),
    email: findColumn('email', 'email_address'),
    phone: findColumn('phone', 'telephone', 'mobile'),
    station: findColumn('station', 'station_name'),
    availability: findColumn('availability', 'status'),
    status_message: findColumn('status_message', 'message')
  };
  if (columns.name === undefined || columns.role_title === undefined) {
    throw new Error('CSV headers must include name and role (or role_title/position).');
  }
  return rows.slice(1).map(values => Object.fromEntries(
    Object.entries(columns).filter(([, column]) => column !== undefined).map(([key, column]) => [key, values[column] || ''])
  ));
}

function validateRegionalCsvRows(rows) {
  const allowedAvailability = new Map(['Available', 'On duty', 'Off duty', 'On leave'].map(value => [value.toLowerCase(), value]));
  const stationNames = new Set(regionalPersonnelStations.map(station => station.name.toLowerCase()));
  const errors = [];
  const normalized = rows.map((row, index) => {
    const rowNumber = index + 2;
    const availability = row.availability ? allowedAvailability.get(row.availability.toLowerCase()) : 'Available';
    if (!row.name || row.name.length > 100) errors.push(`Row ${rowNumber}: add a name (up to 100 characters).`);
    if (!row.role_title || row.role_title.length > 100) errors.push(`Row ${rowNumber}: add a role (up to 100 characters).`);
    if (row.email.length > 200) errors.push(`Row ${rowNumber}: email must be 200 characters or fewer.`);
    if (row.phone.length > 40) errors.push(`Row ${rowNumber}: phone must be 40 characters or fewer.`);
    if (row.status_message.length > 120) errors.push(`Row ${rowNumber}: status message must be 120 characters or fewer.`);
    if (row.availability && !availability) errors.push(`Row ${rowNumber}: availability must be Available, On duty, Off duty, or On leave.`);
    if (row.station && !stationNames.has(row.station.toLowerCase()) && !regionalPersonnelStations.some(station => String(station.id) === row.station)) {
      errors.push(`Row ${rowNumber}: station "${row.station}" was not found.`);
    }
    return { ...row, availability: availability || row.availability };
  });
  return { rows: normalized, errors };
}

function renderRegionalCsvPreview(rows, errors) {
  const preview = document.getElementById('regionalPersonnelImportPreview');
  const previewRows = rows.slice(0, 12).map(row => [
    escapeHtml(row.name || '—'),
    escapeHtml(row.role_title || '—'),
    escapeHtml(row.email || '—'),
    escapeHtml(row.station || 'Unassigned'),
    escapeHtml(row.availability || 'Available')
  ]);
  preview.replaceChildren();
  if (previewRows.length) {
    preview.appendChild(createTable(['Name', 'Role', 'Email', 'Station', 'Availability'], previewRows));
  }
  if (rows.length > 12) {
    const note = document.createElement('p');
    note.textContent = `Previewing 12 of ${rows.length} records.`;
    preview.appendChild(note);
  }
  if (errors.length) {
    const list = document.createElement('ul');
    list.className = 'csv-import-errors';
    errors.forEach(error => {
      const item = document.createElement('li');
      item.textContent = error;
      list.appendChild(item);
    });
    preview.appendChild(list);
  }
}

function setRegionalPersonnelLogo(source) {
  const logo = document.getElementById('regionalPersonnelPrintLogo');
  logo.src = source || 'fire-rescue-force-logo.png';
  logo.classList.remove('hidden');
}

function renderTasks(data) {
  const canEdit = ['admin', 'station', 'shift'].includes(currentUser?.roleCode);
  const canDelete = ['admin', 'station'].includes(currentUser?.roleCode);
  const rows = data.map(task => [
    task.title,
    task.assignedStation,
    task.assigned_officers.join(', '),
    task.status,
    task.deadline,
    task.priority,
    `${actionButtonsHtml(task.id, 'view-task', 'View')}${canEdit ? actionButtonsHtml(task.id, 'edit-task', 'Edit') : ''}${canDelete ? actionButtonsHtml(task.id, 'delete-task', 'Delete') : ''}`
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
  const canEdit = ['admin', 'station', 'shift'].includes(currentUser?.roleCode);
  const canDelete = ['admin', 'station'].includes(currentUser?.roleCode);
  const rows = data.map(item => [
    item.type,
    item.location,
    item.date,
    item.officers.join(', '),
    item.vehicles.join(', '),
    item.report,
    `${actionButtonsHtml(item.id, 'view-incident', 'View')}${canEdit ? actionButtonsHtml(item.id, 'edit-incident', 'Edit') : ''}${canDelete ? actionButtonsHtml(item.id, 'delete-incident', 'Delete') : ''}`
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
  const canManage = ['admin', 'mechanic'].includes(currentUser?.roleCode);
  const rows = data.map(vehicle => [
    vehicle.plate,
    vehicle.model,
    vehicle.capacity,
    vehicle.fuel,
    vehicle.insurance,
    vehicle.status,
    `${actionButtonsHtml(vehicle.id, 'view-vehicle', 'View')}${canManage ? actionButtonsHtml(vehicle.id, 'edit-vehicle', 'Edit') + actionButtonsHtml(vehicle.id, 'delete-vehicle', 'Delete') : ''}`
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
  const canManage = ['admin', 'equipment'].includes(currentUser?.roleCode);
  const rows = data.map(item => [
    item.name,
    item.stationName || 'N/A',
    item.status,
    `${actionButtonsHtml(item.id, 'view-equipment', 'View')}${canManage ? actionButtonsHtml(item.id, 'edit-equipment', 'Edit') + actionButtonsHtml(item.id, 'delete-equipment', 'Delete') : ''}`
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
  const canEdit = ['admin', 'station', 'shift'].includes(currentUser?.roleCode);
  const canDelete = ['admin', 'station'].includes(currentUser?.roleCode);
  const rows = data.map(shift => [
    shift.officer,
    shift.shift_type,
    shift.stationName || 'N/A',
    shift.date,
    `${actionButtonsHtml(shift.id, 'view-shift', 'View')}${canEdit ? actionButtonsHtml(shift.id, 'edit-shift', 'Edit') : ''}${canDelete ? actionButtonsHtml(shift.id, 'delete-shift', 'Delete') : ''}`
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
  const canDelete = currentUser?.roleCode === 'admin';
  const rows = data.map(item => [
    item.user || 'Unknown',
    item.source || 'N/A',
    item.message,
    item.created_at ? new Date(item.created_at).toLocaleString() : 'N/A',
    `${actionButtonsHtml(item.id, 'view-feedback', 'View')}${canDelete ? actionButtonsHtml(item.id, 'delete-feedback', 'Delete') : ''}`
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

function moduleNotice(container, message, kind = 'error') {
  if (!container) return;
  container.textContent = message;
  container.className = `notification ${kind}`;
}

function showNoticeEditor(notice = null) {
  document.getElementById('noticeId').value = notice?.id || '';
  document.getElementById('noticeTitleInput').value = notice?.title || '';
  document.getElementById('noticeMessageInput').value = notice?.message || '';
  document.getElementById('noticeTypeInput').value = notice?.type || 'info';
  document.getElementById('noticeDateInput').value = notice?.date || new Date().toISOString().slice(0, 10);
  document.getElementById('noticeForm').classList.remove('hidden');
  document.getElementById('noticeForm').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function renderNotices(data) {
  const canManage = ['admin', 'station'].includes(currentUser?.roleCode);
  const rows = data.map(item => [
    escapeHtml(item.title), escapeHtml(item.message), escapeHtml(item.type), escapeHtml(item.date),
    item.active ? 'Active' : 'Archived',
    `${actionButtonsHtml(item.id, 'view-notice', 'View')}${canManage ? actionButtonsHtml(item.id, 'edit-notice', 'Edit') + actionButtonsHtml(item.id, 'delete-notice', 'Delete') : ''}`
  ]);
  noticesList.innerHTML = '';
  noticesList.appendChild(createTable(['Title', 'Message', 'Type', 'Date', 'Status', 'Actions'], rows));
  attachActionButtons(noticesList, '.action-btn[data-action="view-notice"]', id => {
    const notice = data.find(item => item.id === Number(id));
    if (notice) showDetails('Notice', `${notice.title}\n\n${notice.message || ''}\n\nType: ${notice.type}\nDate: ${notice.date}`);
  });
  attachActionButtons(noticesList, '.action-btn[data-action="edit-notice"]', id => showNoticeEditor(data.find(item => item.id === Number(id))));
  attachActionButtons(noticesList, '.action-btn[data-action="delete-notice"]', async id => {
    const notice = data.find(item => item.id === Number(id));
    if (!notice || !confirm(`Delete notice “${notice.title}”?`)) return;
    try { await deleteJson(`/api/notices/${id}`); await loadViewData('notices'); }
    catch (error) { alert(error.message); }
  });
}

async function loadUsers() {
  const canManageUsers = ['admin', 'system_manager'].includes(currentUser?.roleCode);
  const canSeeAvailability = ['admin', 'system_manager', 'hr'].includes(currentUser?.roleCode);
  const [listedUsers, roles, stations] = await Promise.all([getJson('/api/users'), getJson('/api/roles'), getJson('/api/stations')]);
  const staffStatuses = canSeeAvailability ? await getJson('/api/staff-status') : [];
  const statusById = new Map(staffStatuses.map(status => [status.id, status]));
  const users = listedUsers.map(user => ({ ...user, ...statusById.get(user.id) }));
  const roleSelect = document.getElementById('managedUserRole');
  const stationSelect = document.getElementById('managedUserStation');
  roleSelect.replaceChildren(...roles.map(role => new Option(role.label, role.code)));
  stationSelect.replaceChildren(new Option('No station', ''), ...stations.map(station => new Option(station.name, station.id)));
  rolesList.replaceChildren(createTable(
    ['Role', 'Role code'],
    roles.map(role => [escapeHtml(role.label), escapeHtml(role.code)])
  ));
  const rows = users.map(user => {
    const availability = user.availability || 'Off duty';
    const availabilityClass = {
      Available: 'available',
      'On duty': 'on-duty',
      'Off duty': 'off-duty',
      'On leave': 'on-leave'
    }[availability] || 'off-duty';
    const row = [
      escapeHtml(user.name), escapeHtml(user.checknumber), escapeHtml(user.role), escapeHtml(user.station_id ? stations.find(item => Number(item.id) === Number(user.station_id))?.name || 'Unassigned' : 'Unassigned'),
      escapeHtml(user.email || '—'), user.active ? 'Active' : 'Disabled'
    ];
    if (canSeeAvailability) {
      row.push(`<span class="availability-pill ${availabilityClass}">${escapeHtml(availability)}</span>`, escapeHtml(user.status_message || '—'));
    }
    row.push(canManageUsers ? `${actionButtonsHtml(user.id, 'edit-user', 'Edit')}${actionButtonsHtml(user.id, 'toggle-user', user.active ? 'Disable' : 'Enable')}` : 'Staff directory');
    return row;
  });
  usersList.innerHTML = '';
  usersList.appendChild(createTable([
    'Name', 'Username', 'Role', 'Station', 'Email', 'Account status',
    ...(canSeeAvailability ? ['Availability', 'Staff status'] : []), 'Actions'
  ], rows));
  attachActionButtons(usersList, '.action-btn[data-action="edit-user"]', id => {
    const user = users.find(item => item.id === Number(id));
    if (!user) return;
    document.getElementById('managedUserId').value = user.id;
    document.getElementById('userFormTitle').textContent = `Edit ${user.name}`;
    document.getElementById('managedUserName').value = user.name;
    document.getElementById('managedUserChecknumber').value = user.checknumber;
    document.getElementById('managedUserChecknumber').readOnly = true;
    document.getElementById('managedUserPassword').value = '';
    document.getElementById('managedUserEmail').value = user.email || '';
    document.getElementById('managedUserPhone').value = user.phone || '';
    document.getElementById('managedUserRole').value = user.roleCode;
    document.getElementById('managedUserStation').value = user.station_id || '';
    document.getElementById('managedUserActive').checked = Boolean(user.active);
    document.getElementById('userForm').classList.remove('hidden');
    document.getElementById('userForm').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
  attachActionButtons(usersList, '.action-btn[data-action="toggle-user"]', async id => {
    const user = users.find(item => item.id === Number(id));
    if (!user || user.id === currentUser.id) return alert('You cannot disable your own account.');
    try {
      await putJson(`/api/users/${id}`, { name: user.name, role_code: user.roleCode, station_id: user.station_id, email: user.email, phone: user.phone, active: !user.active });
      await loadAllData();
    } catch (error) { alert(error.message); }
  });
}

function renderLeave(data) {
  const canReview = ['admin', 'system_manager', 'station', 'shift', 'hr'].includes(currentUser?.roleCode);
  const rows = data.map(item => [
    escapeHtml(item.employee || currentUser.name), escapeHtml(item.leave_type), `${escapeHtml(item.start_date)} – ${escapeHtml(item.end_date)}`,
    escapeHtml(item.reason), `<span class="status-pill ${escapeHtml(item.status)}">${escapeHtml(item.status)}</span>`,
    escapeHtml(item.review_note || '—'),
    escapeHtml(item.reviewer || '—'),
    item.reviewed_at ? escapeHtml(new Date(item.reviewed_at).toLocaleString()) : '—',
    `${canReview && item.status === 'pending' ? `${actionButtonsHtml(item.id, 'approve-leave', 'Approve')}${actionButtonsHtml(item.id, 'reject-leave', 'Reject')}` : ''}${canReview || item.status === 'pending' ? actionButtonsHtml(item.id, 'delete-leave', 'Delete') : ''}`
  ]);
  leaveList.innerHTML = '';
  leaveList.appendChild(createTable(['Employee', 'Leave Type', 'Dates', 'Reason', 'Status', 'Review Note', 'Reviewed By', 'Reviewed At', 'Actions'], rows));
  for (const [action, status] of [['approve-leave', 'approved'], ['reject-leave', 'rejected']]) {
    attachActionButtons(leaveList, `.action-btn[data-action="${action}"]`, async id => {
      try { await fetchJson(`/api/leave/${id}/review`, 'PATCH', { status, review_note: '' }); await loadViewData('leave'); }
      catch (error) { alert(error.message); }
    });
  }
  attachActionButtons(leaveList, '.action-btn[data-action="delete-leave"]', async id => {
    if (!confirm('Remove this leave request?')) return;
    try { await deleteJson(`/api/leave/${id}`); await loadViewData('leave'); }
    catch (error) { alert(error.message); }
  });
}

function showTrainingEditor(training = null) {
  document.getElementById('trainingId').value = training?.id || '';
  document.getElementById('trainingNameInput').value = training?.name || '';
  document.getElementById('trainingCoordinatorInput').value = training?.coordinator || currentUser.name;
  document.getElementById('trainingDateInput').value = training?.training_date || new Date().toISOString().slice(0, 10);
  document.getElementById('trainingLocationInput').value = training?.location || '';
  document.getElementById('trainingParticipantsInput').value = training?.participants || 1;
  document.getElementById('trainingStatusInput').value = training?.status || 'Upcoming';
  document.getElementById('trainingDescriptionInput').value = training?.description || '';
  document.getElementById('trainingForm').classList.remove('hidden');
  document.getElementById('trainingForm').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function renderTraining(data) {
  const canManage = ['admin', 'station', 'shift'].includes(currentUser?.roleCode);
  const rows = data.map(item => [escapeHtml(item.name), escapeHtml(item.coordinator), escapeHtml(item.training_date), escapeHtml(item.location), escapeHtml(item.participants), `<span class="status-pill ${escapeHtml(item.status)}">${escapeHtml(item.status)}</span>`,
    canManage ? `${actionButtonsHtml(item.id, 'edit-training', 'Edit')}${actionButtonsHtml(item.id, 'delete-training', 'Delete')}` : '—']);
  trainingList.innerHTML = '';
  trainingList.appendChild(createTable(['Training', 'Coordinator', 'Date', 'Location', 'Participants', 'Status', 'Actions'], rows));
  attachActionButtons(trainingList, '.action-btn[data-action="edit-training"]', id => showTrainingEditor(data.find(item => item.id === Number(id))));
  attachActionButtons(trainingList, '.action-btn[data-action="delete-training"]', async id => {
    const row = data.find(item => item.id === Number(id));
    if (!row || !confirm(`Delete training “${row.name}”?`)) return;
    try { await deleteJson(`/api/training/${id}`); await loadViewData('training'); }
    catch (error) { alert(error.message); }
  });
}

function showPerformanceEditor(goal) {
  document.getElementById('performanceId').value = goal.id;
  document.getElementById('performanceNameInput').value = goal.name;
  document.getElementById('performanceMetricInput').value = goal.metric || '';
  document.getElementById('performanceDeadlineInput').value = goal.deadline;
  document.getElementById('performanceProgressInput').value = goal.progress;
  document.getElementById('performanceStatusInput').value = goal.status;
  document.getElementById('cancelPerformanceEditBtn').classList.remove('hidden');
  document.getElementById('performanceForm').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function resetPerformanceForm() {
  document.getElementById('performanceForm').reset();
  document.getElementById('performanceId').value = '';
  document.getElementById('performanceProgressInput').value = '0';
  document.getElementById('cancelPerformanceEditBtn').classList.add('hidden');
}

function renderPerformance(data) {
  const rows = data.map(goal => [escapeHtml(goal.employee || currentUser.name), escapeHtml(goal.name), escapeHtml(goal.metric || '—'), escapeHtml(goal.deadline), `${escapeHtml(goal.progress)}%`, `<span class="status-pill ${escapeHtml(goal.status)}">${escapeHtml(goal.status)}</span>`,
    `${actionButtonsHtml(goal.id, 'edit-performance', 'Edit')}${actionButtonsHtml(goal.id, 'delete-performance', 'Delete')}`]);
  performanceList.innerHTML = '';
  performanceList.appendChild(createTable(['Employee', 'Goal', 'Measure', 'Deadline', 'Progress', 'Status', 'Actions'], rows));
  attachActionButtons(performanceList, '.action-btn[data-action="edit-performance"]', id => {
    const goal = data.find(item => item.id === Number(id));
    if (goal) showPerformanceEditor(goal);
  });
  attachActionButtons(performanceList, '.action-btn[data-action="delete-performance"]', async id => {
    if (!confirm('Delete this performance goal?')) return;
    try { await deleteJson(`/api/performance/${id}`); await loadViewData('performance'); }
    catch (error) { alert(error.message); }
  });
}

function renderFinance(data) {
  const summary = document.getElementById('financeSummary');
  const income = data.filter(entry => entry.entry_type === 'income').reduce((sum, entry) => sum + Number(entry.amount), 0);
  const expenses = data.filter(entry => entry.entry_type === 'expense').reduce((sum, entry) => sum + Number(entry.amount), 0);
  const pending = data.filter(entry => entry.status === 'pending').length;
  summary.replaceChildren(
    createSummaryCard('Income (TZS)', income.toLocaleString('en-TZ')),
    createSummaryCard('Expenses (TZS)', expenses.toLocaleString('en-TZ')),
    createSummaryCard('Pending verification', pending)
  );
  const money = amount => `TZS ${Number(amount).toLocaleString('en-TZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const rows = data.map(entry => {
    const isOwnerPending = entry.submitted_by === currentUser.id && entry.status === 'pending';
    const canVerify = ['admin', 'system_manager'].includes(currentUser.roleCode) || currentUser.roleCode === 'accountant' && entry.status === 'pending' && entry.submitted_by !== currentUser.id;
    const actions = `${isOwnerPending ? actionButtonsHtml(entry.id, 'edit-finance', 'Edit') + actionButtonsHtml(entry.id, 'delete-finance', 'Delete') : ''}${canVerify ? actionButtonsHtml(entry.id, 'approve-finance', 'Verify') + actionButtonsHtml(entry.id, 'reject-finance', 'Reject') : ''}`;
    return [escapeHtml(entry.entry_date), escapeHtml(entry.entry_type), escapeHtml(entry.category), escapeHtml(money(entry.amount)), escapeHtml(entry.description), escapeHtml(entry.reference || '—'), `<span class="status-pill ${escapeHtml(entry.status)}">${escapeHtml(entry.status)}</span>`, escapeHtml(entry.submitted_by_name || ''), actions || '—'];
  });
  financeList.innerHTML = '';
  financeList.appendChild(createTable(['Date', 'Type', 'Category', 'Amount', 'Description', 'Reference', 'Status', 'Recorded By', 'Actions'], rows));
  attachActionButtons(financeList, '.action-btn[data-action="edit-finance"]', id => {
    const entry = data.find(item => item.id === Number(id));
    if (!entry) return;
    document.getElementById('financeId').value = entry.id;
    document.getElementById('financeDateInput').value = entry.entry_date;
    document.getElementById('financeTypeInput').value = entry.entry_type;
    document.getElementById('financeCategoryInput').value = entry.category;
    document.getElementById('financeAmountInput').value = entry.amount;
    document.getElementById('financeReferenceInput').value = entry.reference;
    document.getElementById('financeDescriptionInput').value = entry.description;
    document.getElementById('cancelFinanceEditBtn').classList.remove('hidden');
    document.getElementById('financeForm').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
  attachActionButtons(financeList, '.action-btn[data-action="delete-finance"]', async id => {
    if (!confirm('Delete this pending finance entry?')) return;
    try { await deleteJson(`/api/finance/${id}`); await loadViewData('finance'); }
    catch (error) { alert(error.message); }
  });
  for (const [action, status] of [['approve-finance', 'approved'], ['reject-finance', 'rejected']]) {
    attachActionButtons(financeList, `.action-btn[data-action="${action}"]`, async id => {
      try { await fetchJson(`/api/finance/${id}/verify`, 'PATCH', { status }); await loadViewData('finance'); }
      catch (error) { alert(error.message); }
    });
  }
}

async function showInspectionEditor(inspection = null) {
  const stations = await getJson('/api/stations');
  const select = document.getElementById('inspectionStationInput');
  select.replaceChildren(new Option('Other / community site', ''), ...stations.map(station => new Option(station.name, station.id)));
  document.getElementById('inspectionId').value = inspection?.id || '';
  document.getElementById('inspectionStationInput').value = inspection?.station_id || '';
  document.getElementById('inspectionDateInput').value = inspection?.inspected_on || new Date().toISOString().slice(0, 10);
  document.getElementById('inspectionTypeInput').value = inspection?.inspection_type || '';
  document.getElementById('inspectionRiskInput').value = inspection?.risk_level || 'low';
  document.getElementById('inspectionOutcomeInput').value = inspection?.outcome || 'compliant';
  document.getElementById('inspectionFollowUpInput').value = inspection?.follow_up_date || '';
  document.getElementById('inspectionFindingsInput').value = inspection?.findings || '';
  document.getElementById('inspectionActionInput').value = inspection?.corrective_action || '';
  document.getElementById('inspectionForm').classList.remove('hidden');
  document.getElementById('inspectionForm').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function renderInspections(data) {
  const rows = data.map(item => [escapeHtml(item.inspected_on), escapeHtml(item.station_name || 'Community site'), escapeHtml(item.inspection_type), `<span class="status-pill ${escapeHtml(item.risk_level)}">${escapeHtml(item.risk_level)}</span>`, escapeHtml(item.outcome.replaceAll('_', ' ')), escapeHtml(item.inspector_name || ''), escapeHtml(item.follow_up_date || '—'), `${actionButtonsHtml(item.id, 'view-inspection', 'View')}${['admin', 'system_manager', 'fire_marshal'].includes(currentUser.roleCode) ? actionButtonsHtml(item.id, 'edit-inspection', 'Edit') + actionButtonsHtml(item.id, 'delete-inspection', 'Delete') : ''}`]);
  inspectionList.innerHTML = '';
  inspectionList.appendChild(createTable(['Date', 'Station / Site', 'Type', 'Risk', 'Outcome', 'Inspector', 'Follow-up', 'Actions'], rows));
  attachActionButtons(inspectionList, '.action-btn[data-action="view-inspection"]', id => {
    const item = data.find(record => record.id === Number(id));
    if (item) showDetails('Fire Safety Inspection', `Station: ${item.station_name || 'Community site'}\nDate: ${item.inspected_on}\nType: ${item.inspection_type}\nRisk: ${item.risk_level}\nOutcome: ${item.outcome}\nFindings: ${item.findings}\nCorrective action: ${item.corrective_action || 'None'}\nFollow-up: ${item.follow_up_date || 'None'}`);
  });
  attachActionButtons(inspectionList, '.action-btn[data-action="edit-inspection"]', id => showInspectionEditor(data.find(item => item.id === Number(id))));
  attachActionButtons(inspectionList, '.action-btn[data-action="delete-inspection"]', async id => {
    if (!confirm('Delete this inspection record?')) return;
    try { await deleteJson(`/api/fire-inspections/${id}`); await loadViewData('inspections'); }
    catch (error) { alert(error.message); }
  });
}

function getTanzaniaDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Dar_es_Salaam',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function formatAttendanceTime(timestamp) {
  if (!timestamp) return '—';
  const parsedTimestamp = new Date(timestamp);
  if (Number.isNaN(parsedTimestamp.getTime())) return '—';
  return `${new Intl.DateTimeFormat(currentLanguage === 'sw' ? 'sw-TZ' : 'en-GB', {
    timeZone: 'Africa/Dar_es_Salaam',
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(parsedTimestamp)} EAT`;
}

function isAttendanceDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsedDate = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().slice(0, 10) === value;
}

function isAttendanceMonth(value) {
  return typeof value === 'string' && /^\d{4}-(0[1-9]|1[0-2])$/.test(value);
}

function formatAttendanceMonth(month) {
  const [year, monthNumber] = month.split('-').map(Number);
  return new Intl.DateTimeFormat(currentLanguage === 'sw' ? 'sw-TZ' : 'en-GB', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(Date.UTC(year, monthNumber - 1, 1)));
}

function renderAttendanceChart(days, label) {
  const chart = document.getElementById('attendanceChart');
  chart.replaceChildren();
  const width = 960;
  const height = 260;
  const left = 30;
  const right = 12;
  const top = 16;
  const bottom = 34;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const maxValue = Math.max(1, ...days.map(day => day.present + day.absent + day.onLeave));
  const step = plotWidth / days.length;
  const barWidth = Math.max(3, step * 0.62);
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', label);
  svg.classList.add('attendance-chart');

  const baseline = document.createElementNS(svg.namespaceURI, 'line');
  baseline.setAttribute('x1', String(left));
  baseline.setAttribute('x2', String(width - right));
  baseline.setAttribute('y1', String(top + plotHeight));
  baseline.setAttribute('y2', String(top + plotHeight));
  baseline.setAttribute('class', 'attendance-chart-baseline');
  svg.appendChild(baseline);

  days.forEach((day, index) => {
    const x = left + index * step + (step - barWidth) / 2;
    let y = top + plotHeight;
    [['present', 'present'], ['absent', 'absent'], ['onLeave', 'on-leave']].forEach(([key, className]) => {
      const segmentHeight = day[key] / maxValue * plotHeight;
      if (segmentHeight <= 0) return;
      y -= segmentHeight;
      const rect = document.createElementNS(svg.namespaceURI, 'rect');
      rect.setAttribute('x', String(x));
      rect.setAttribute('y', String(y));
      rect.setAttribute('width', String(barWidth));
      rect.setAttribute('height', String(segmentHeight));
      rect.setAttribute('class', `attendance-chart-bar ${className}`);
      rect.setAttribute('aria-label', `${day.date}: ${day[key]} ${key}`);
      svg.appendChild(rect);
    });
    const dayNumber = Number(day.date.slice(-2));
    if (dayNumber === 1 || dayNumber % 5 === 0) {
      const text = document.createElementNS(svg.namespaceURI, 'text');
      text.setAttribute('x', String(x + barWidth / 2));
      text.setAttribute('y', String(height - 10));
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('class', 'attendance-chart-label');
      text.textContent = String(dayNumber);
      svg.appendChild(text);
    }
  });
  chart.appendChild(svg);
  const t = translations[currentLanguage];
  const legend = document.createElement('div');
  legend.className = 'attendance-chart-legend';
  [['present', t.attendanceStatuses[0]], ['absent', t.attendanceStatuses[1]], ['on-leave', t.attendanceStatuses[2]]].forEach(([className, text]) => {
    const item = document.createElement('span');
    item.className = 'attendance-chart-legend-item';
    const swatch = document.createElement('i');
    swatch.className = `attendance-chart-swatch ${className}`;
    item.append(swatch, document.createTextNode(text));
    legend.appendChild(item);
  });
  chart.appendChild(legend);
}

function renderAttendanceMonthly(report) {
  attendanceMonthlyReport = report;
  const t = translations[currentLanguage];
  const summary = document.getElementById('attendanceMonthlySummary');
  summary.replaceChildren(
    createSummaryCard(t.attendanceStatuses[0], report.totals.present),
    createSummaryCard(t.attendanceStatuses[1], report.totals.absent),
    createSummaryCard(t.attendanceStatuses[2], report.totals.onLeave),
    createSummaryCard(t.attendanceRecordsTotal, report.records.length)
  );
  renderAttendanceChart(report.days, t.attendanceChartLabel);

  const periodStatus = document.getElementById('attendancePeriodStatus');
  const monthName = formatAttendanceMonth(report.period.month);
  periodStatus.textContent = report.period.status === 'closed'
    ? t.attendancePeriodClosed(monthName, report.period.closedAt ? formatAttendanceTime(report.period.closedAt) : '', report.period.closedBy || '')
    : t.attendancePeriodOpen(monthName, report.period.month === report.currentMonth);
  periodStatus.classList.toggle('is-closed', report.period.status === 'closed');
  periodStatus.classList.toggle('is-open', report.period.status === 'open');
  const closeButton = document.getElementById('closeAttendanceMonthBtn');
  closeButton.classList.toggle('hidden', report.period.status === 'closed' || report.period.month >= report.currentMonth);

  const search = document.getElementById('attendanceSearchInput').value.trim().toLowerCase();
  const records = report.records.filter(record => `${record.name} ${record.role || ''} ${record.station || ''} ${record.updatedBy || ''}`.toLowerCase().includes(search));
  const rows = records.map(record => {
    const statusIndex = ['Present', 'Absent', 'On leave'].indexOf(record.status);
    const displayStatus = statusIndex >= 0 ? t.attendanceStatuses[statusIndex] : record.status;
    const statusClass = record.status === 'Present' ? 'active' : record.status === 'Absent' ? 'rejected' : 'pending';
    return [
      escapeHtml(record.date),
      escapeHtml(record.name || t.personnelRecord),
      escapeHtml(record.role || t.personnelRecord),
      escapeHtml(record.station || t.unassigned),
      `<span class="status-pill ${statusClass}">${escapeHtml(displayStatus)}</span>`,
      escapeHtml(formatAttendanceTime(record.checkInAt)),
      escapeHtml(record.updatedBy || '—')
    ];
  });
  const list = document.getElementById('attendanceMonthlyList');
  list.replaceChildren(createTable(t.attendanceMonthlyColumns, rows));
  if (!records.length) {
    const emptyMessage = document.createElement('p');
    emptyMessage.className = 'attendance-empty';
    emptyMessage.textContent = report.records.length
      ? (currentLanguage === 'sw' ? 'Hakuna rekodi zinazolingana na utafutaji.' : 'No records match this search.')
      : t.noAttendanceHistory;
    list.appendChild(emptyMessage);
  }
}

function updateAttendanceCheckIn(record, date) {
  const status = record?.status || 'Not signed in';
  const statusElement = document.getElementById('attendanceCheckinStatus');
  const button = document.getElementById('attendanceCheckInBtn');
  document.getElementById('attendanceCheckinTitle').textContent = `${currentLanguage === 'sw' ? 'Leo' : 'Today'} · ${date}`;
  statusElement.textContent = status === 'Present'
    ? translations[currentLanguage].signedInAt(formatAttendanceTime(record.checkInAt))
    : status === 'On leave'
      ? translations[currentLanguage].onLeaveToday
      : status === 'Absent'
        ? translations[currentLanguage].absentToday
        : translations[currentLanguage].notSignedIn;
  button.disabled = status === 'Present';
  button.textContent = status === 'Present' ? translations[currentLanguage].signedIn : translations[currentLanguage].signInToday;
}

function renderAttendanceAdmin(records, date) {
  attendanceAdminRecords = records;
  const search = document.getElementById('attendanceSearchInput').value.trim().toLowerCase();
  const filtered = records.filter(record => `${record.name} ${record.role || ''} ${record.station || ''}`.toLowerCase().includes(search));
  const present = records.filter(record => record.status === 'Present').length;
  const absent = records.filter(record => record.status === 'Absent').length;
  const onLeave = records.filter(record => record.status === 'On leave').length;
  const unrecorded = records.length - present - absent - onLeave;
  const t = translations[currentLanguage];
  const summary = document.getElementById('attendanceSummary');
  summary.replaceChildren(
    createSummaryCard(t.attendanceStatuses[0], present),
    createSummaryCard(t.attendanceStatuses[1], absent),
    createSummaryCard(t.attendanceStatuses[2], onLeave),
    createSummaryCard(currentLanguage === 'sw' ? 'Haijarekodiwa' : 'Not recorded', unrecorded)
  );
  const rows = filtered.map(record => {
    const status = record.status || 'Not recorded';
    const statusClass = status === 'Present' ? 'active' : status === 'Absent' ? 'rejected' : status === 'On leave' ? 'pending' : '';
    const displayStatus = status === 'Present'
      ? t.attendanceStatuses[0]
      : status === 'Absent'
        ? t.attendanceStatuses[1]
        : status === 'On leave'
          ? t.attendanceStatuses[2]
          : currentLanguage === 'sw' ? 'Haijarekodiwa' : 'Not recorded';
    const monthIsClosed = attendanceMonthlyReport?.period.month === date.slice(0, 7) && attendanceMonthlyReport.period.status === 'closed';
    const buttons = ['Present', 'Absent', 'On leave'].map((option, index) => (
      `<button type="button" class="secondary attendance-status-button" data-action="set-attendance" data-person-type="${escapeHtml(record.personType)}" data-person-id="${record.personId}" data-status="${escapeHtml(option)}"${status === option || monthIsClosed ? ' disabled' : ''}>${escapeHtml(t.attendanceStatuses[index])}</button>`
    )).join('');
    return [
      escapeHtml(record.name),
      escapeHtml(record.role || t.personnelRecord),
      escapeHtml(record.station || t.unassigned),
      `<span class="status-pill ${statusClass}">${escapeHtml(displayStatus)}</span>`,
      escapeHtml(formatAttendanceTime(record.checkInAt)),
      `<div class="attendance-row-actions">${buttons}</div>`
    ];
  });
  const list = document.getElementById('attendanceList');
  list.replaceChildren(createTable(t.attendanceColumns, rows));
  if (!filtered.length) {
    const emptyMessage = document.createElement('p');
    emptyMessage.className = 'attendance-empty';
    emptyMessage.textContent = records.length
      ? (currentLanguage === 'sw' ? 'Hakuna mtumishi anayelingana na utafutaji.' : 'No staff match this search.')
      : `${currentLanguage === 'sw' ? 'Hakuna rekodi za watumishi hai tarehe' : 'No active staff records for'} ${date}.`;
    list.appendChild(emptyMessage);
  }
  list.querySelectorAll('[data-action="set-attendance"]').forEach(button => {
    button.addEventListener('click', async () => {
      button.disabled = true;
      try {
        await fetchJson(`/api/attendance/${encodeURIComponent(button.dataset.personType)}/${button.dataset.personId}`, 'PUT', {
          date,
          status: button.dataset.status
        });
        await loadAttendance(date);
      } catch (error) {
        button.disabled = false;
        alert(error.message);
      }
    });
  });
}

async function loadAttendance(selectedDate) {
  const isAdmin = ['admin', 'system_manager'].includes(currentUser?.roleCode);
  const today = getTanzaniaDate();
  const dateInput = document.getElementById('attendanceDateInput');
  const monthInput = document.getElementById('attendanceMonthInput');
  const inputFeedback = document.getElementById('attendanceInputFeedback');
  dateInput.max = today;
  monthInput.max = today.slice(0, 7);
  if (isAdmin && selectedDate !== undefined && (!isAttendanceDate(selectedDate) || selectedDate > today)) {
    inputFeedback.textContent = translations[currentLanguage].invalidAttendanceDate;
    inputFeedback.classList.remove('hidden');
    return;
  }
  inputFeedback.textContent = '';
  inputFeedback.classList.add('hidden');
  const requestedValue = selectedDate || dateInput.value;
  const requestedDate = isAdmin && isAttendanceDate(requestedValue) && requestedValue <= today
    ? requestedValue
    : today;
  if (isAdmin) dateInput.value = requestedDate;
  const requestedMonth = requestedDate.slice(0, 7);
  if (isAdmin && isAttendanceMonth(requestedMonth)) monthInput.value = requestedMonth;
  const requests = [
    getJson(`/api/attendance?date=${encodeURIComponent(requestedDate)}`),
    requestedDate === today ? Promise.resolve(null) : getJson(`/api/attendance?date=${encodeURIComponent(today)}`)
  ];
  if (isAdmin) requests.push(getJson(`/api/attendance/monthly?month=${encodeURIComponent(requestedMonth)}`));
  const [selectedDay, todayData, monthlyReport] = await Promise.all(requests);
  const ownRecord = (todayData || selectedDay).records.find(record => record.personType === 'user' && Number(record.personId) === Number(currentUser.id));
  updateAttendanceCheckIn(ownRecord, today);
  document.getElementById('attendanceAdminPanel').classList.toggle('hidden', !isAdmin);
  if (isAdmin) {
    renderAttendanceMonthly(monthlyReport);
    renderAttendanceAdmin(selectedDay.records, selectedDay.date);
  }
}

async function loadViewData(viewName) {
  try {
    if (viewName === 'notices') renderNotices(await getJson('/api/notices'));
    if (viewName === 'users') await loadUsers();
    if (viewName === 'regionalPersonnel') await loadRegionalPersonnel();
    if (viewName === 'attendance') await loadAttendance();
    if (viewName === 'leave') renderLeave(await getJson('/api/leave'));
    if (viewName === 'training') renderTraining(await getJson('/api/training'));
    if (viewName === 'performance') renderPerformance(await getJson('/api/performance'));
    if (viewName === 'finance') renderFinance(await getJson('/api/finance'));
    if (viewName === 'inspections') renderInspections(await getJson('/api/fire-inspections'));
    if (viewName === 'settings') await loadSettings();
  } catch (error) {
    const containers = { notices: noticesList, users: usersList, regionalPersonnel: regionalPersonnelList, leave: leaveList, training: trainingList, performance: performanceList, attendance: document.getElementById('attendanceList') };
    if (viewName === 'attendance' && !['admin', 'system_manager'].includes(currentUser?.roleCode)) {
      document.getElementById('attendanceCheckinStatus').textContent = error.message;
    } else if (containers[viewName]) {
      containers[viewName].innerHTML = `<p class="notification error">${escapeHtml(error.message)}</p>`;
    }
  }
}

async function loadSettings() {
  const settings = await getJson('/api/settings');
  themeSelect.value = settings.theme;
  document.getElementById('settingsLanguage').value = settings.language;
  document.getElementById('settingsEmailNotifications').checked = Boolean(settings.email_notifications);
  document.getElementById('settingsPushNotifications').checked = Boolean(settings.push_notifications);
  applyTheme(settings.theme);
  currentLanguage = settings.language;
  languageSelect.value = settings.language;
  setTranslations();
}

function applyTheme(theme) {
  const isLight = theme === 'light';
  document.body.classList.toggle('light-theme', isLight);
  themeToggleButton.textContent = isLight ? 'Dark mode' : 'Light mode';
  themeToggleButton.setAttribute('aria-label', `Switch to ${isLight ? 'dark' : 'light'} mode`);
  themeToggleButton.setAttribute('aria-pressed', String(isLight));
  themeSelect.value = isLight ? 'light' : 'dark';
}

function loadLocalPreferences(key, defaults) {
  const saved = localStorage.getItem(key);
  if (!saved) return { ...defaults };
  try {
    const parsed = JSON.parse(saved);
    return parsed && typeof parsed === 'object' ? { ...defaults, ...parsed } : { ...defaults };
  } catch (error) {
    console.warn(`Unable to read ${key}; using defaults.`, error);
    return { ...defaults };
  }
}

let displayPreferences = { ...displaySettingsDefaults };
let printPreferences = { ...printSettingsDefaults };

function applyDisplayPreferences() {
  document.body.classList.toggle('compact-tables', Boolean(displayPreferences.compactTables));
  document.body.classList.toggle('reduce-motion', Boolean(displayPreferences.reduceMotion));
  document.getElementById('compactTablesSetting').checked = Boolean(displayPreferences.compactTables);
  document.getElementById('reduceMotionSetting').checked = Boolean(displayPreferences.reduceMotion);
}

function applyPrintPreferences() {
  const paper = printPreferences.paper === 'letter' ? 'Letter' : 'A4';
  const orientation = printPreferences.orientation === 'portrait' ? 'portrait' : 'landscape';
  const rules = document.getElementById('printPageSettings') || document.head.appendChild(document.createElement('style'));
  rules.id = 'printPageSettings';
  rules.textContent = `@media print { @page { size: ${paper} ${orientation}; margin: 14mm; } }`;
  document.getElementById('printPaperSetting').value = printPreferences.paper;
  document.getElementById('printOrientationSetting').value = printPreferences.orientation;
  document.getElementById('printLogoSetting').checked = Boolean(printPreferences.includeLogo);
  document.getElementById('printTimestampSetting').checked = Boolean(printPreferences.includeTimestamp);
  document.getElementById('printFooterSetting').value = printPreferences.footer;
  document.body.classList.toggle('print-with-logo', Boolean(printPreferences.includeLogo));
  document.body.classList.toggle('print-with-timestamp', Boolean(printPreferences.includeTimestamp));
}

function initializeWorkspacePreferences() {
  const savedDisplay = loadLocalPreferences('zimamotoDisplayPreferences', displaySettingsDefaults);
  displayPreferences = {
    compactTables: savedDisplay.compactTables === true,
    reduceMotion: savedDisplay.reduceMotion === true
  };
  const savedPrint = loadLocalPreferences('zimamotoPrintPreferences', printSettingsDefaults);
  printPreferences = {
    paper: ['a4', 'letter'].includes(savedPrint.paper) ? savedPrint.paper : printSettingsDefaults.paper,
    orientation: ['landscape', 'portrait'].includes(savedPrint.orientation) ? savedPrint.orientation : printSettingsDefaults.orientation,
    includeLogo: savedPrint.includeLogo !== false,
    includeTimestamp: savedPrint.includeTimestamp !== false,
    footer: typeof savedPrint.footer === 'string' ? savedPrint.footer.slice(0, 100) : printSettingsDefaults.footer
  };
  applyDisplayPreferences();
  applyPrintPreferences();
}

function setPrintHeader(view) {
  const header = view.querySelector('.activity-print-header');
  const heading = view.querySelector('.view-header h2') || view.querySelector('h2');
  header.querySelector('h1').textContent = heading?.textContent.trim() || 'Fire and Rescue Operations';
  header.querySelector('.activity-print-time').textContent = printPreferences.includeTimestamp ? new Date().toLocaleString() : '';
  header.querySelector('.activity-print-time').classList.toggle('hidden', !printPreferences.includeTimestamp);
  header.querySelector('.activity-print-footer').textContent = printPreferences.footer.trim();
  header.querySelector('img').classList.toggle('hidden', !printPreferences.includeLogo);
}

function printCurrentActivity(view) {
  setPrintHeader(view);
  view.querySelectorAll('.table-container table').forEach(table => {
    const headers = Array.from(table.tHead?.rows[0]?.cells || []);
    if (headers.at(-1)?.textContent.trim().toLowerCase() === 'actions') {
      headers.at(-1).classList.add('print-action-column');
      Array.from(table.tBodies).forEach(body => {
        Array.from(body.rows).forEach(row => row.cells.at(-1)?.classList.add('print-action-column'));
      });
    }
  });
  document.body.classList.add('printing-activity');
  window.addEventListener('afterprint', () => document.body.classList.remove('printing-activity'), { once: true });
  window.print();
}

function initializeActivityPrinting() {
  document.querySelectorAll('.view').forEach(view => {
    const header = document.createElement('section');
    header.className = 'activity-print-header';
    header.innerHTML = `<img src="fire-rescue-force-logo.png" alt=""><div><span>JESHI LA ZIMAMOTO NA UOKOAJI</span><h1></h1><p>Mbeya Fire and Rescue Regional Operations</p></div><div class="activity-print-time"></div>`;
    header.insertAdjacentHTML('beforeend', '<footer class="activity-print-footer"></footer>');
    view.prepend(header);

    let button = view.querySelector('#printRegionalPersonnelBtn, #printAttendanceBtn');
    if (button) {
      button.classList.add('activity-print-btn');
    } else {
      button = document.createElement('button');
      button.type = 'button';
      button.className = 'secondary activity-print-btn';
      button.textContent = 'Print this activity';
      const activityTitle = view.querySelector('.view-header h2') || view.querySelector('h2');
      button.setAttribute('aria-label', `Print ${activityTitle?.textContent.trim() || 'this activity'}`);
      const viewHeader = view.querySelector('.view-header');
      if (viewHeader) {
        viewHeader.appendChild(button);
      } else {
        const toolbar = document.createElement('div');
        toolbar.className = 'activity-print-toolbar';
        toolbar.appendChild(button);
        header.after(toolbar);
      }
    }
    button.addEventListener('click', () => {
      if (view.id === 'regionalPersonnelView') {
        document.getElementById('regionalPersonnelPrintedAt').textContent = new Date().toLocaleString();
      }
      printCurrentActivity(view);
    });
  });
}

async function fetchJson(url, method, payload) {
  const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Request failed');
  }
  return response.json();
}

function renderReports(data) {
  reportCards.innerHTML = `
    <div class="report-card"><h3>Stations</h3><p>${data.stationCount}</p></div>
    <div class="report-card"><h3>Tasks</h3><p>${data.taskCount}</p></div>
    <div class="report-card"><h3>Incidents</h3><p>${data.incidentReports}</p></div>
    <div class="report-card"><h3>Vehicles Active</h3><p>${data.vehiclesActive}</p></div>
    <div class="report-card"><h3>Delayed Tasks</h3><p>${data.delayed}</p></div>
    <div class="report-card"><h3>Notifications</h3><p>${data.notificationCount}</p></div>
    ${data.pendingLeave !== undefined ? `<div class="report-card"><h3>Pending Leave</h3><p>${data.pendingLeave}</p></div>` : ''}
    <div class="report-card"><h3>Upcoming Training</h3><p>${data.trainingUpcoming || 0}</p></div>
    <div class="report-card"><h3>Open Goals</h3><p>${data.performanceGoals || 0}</p></div>
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
  if (currentUser) loadViewData(viewName);
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

document.getElementById('uploadRegionalPersonnelCsvBtn').addEventListener('click', () => {
  document.getElementById('regionalPersonnelImportPanel').classList.remove('hidden');
  document.getElementById('regionalPersonnelCsvInput').click();
});
document.getElementById('closeRegionalPersonnelImportBtn').addEventListener('click', () => {
  document.getElementById('regionalPersonnelImportPanel').classList.add('hidden');
});
document.getElementById('regionalPersonnelCsvInput').addEventListener('change', async event => {
  const file = event.currentTarget.files?.[0];
  if (!file) return;
  const message = document.getElementById('regionalPersonnelImportMessage');
  const preview = document.getElementById('regionalPersonnelImportPreview');
  const importButton = document.getElementById('confirmRegionalPersonnelImportBtn');
  importButton.classList.add('hidden');
  pendingRegionalCsvRows = [];
  preview.replaceChildren();
  try {
    if (!file.name.toLowerCase().endsWith('.csv') || file.size > 2 * 1024 * 1024) {
      throw new Error('Choose a CSV file no larger than 2 MB.');
    }
    if (!regionalPersonnelStations.length) regionalPersonnelStations = await getJson('/api/stations');
    const rows = parseRegionalCsv(await file.text());
    const result = validateRegionalCsvRows(rows);
    renderRegionalCsvPreview(result.rows, result.errors);
    if (result.errors.length) {
      moduleNotice(message, `Found ${result.errors.length} issue(s). Correct the CSV and select it again.`);
      return;
    }
    pendingRegionalCsvRows = result.rows;
    moduleNotice(message, `${result.rows.length} people ready to import. Review the preview, then confirm.`, 'success');
    importButton.classList.remove('hidden');
  } catch (error) {
    moduleNotice(message, error.message);
  }
});
document.getElementById('confirmRegionalPersonnelImportBtn').addEventListener('click', async () => {
  const message = document.getElementById('regionalPersonnelImportMessage');
  if (!pendingRegionalCsvRows.length) {
    moduleNotice(message, 'Select and review a valid CSV before importing.');
    return;
  }
  const button = document.getElementById('confirmRegionalPersonnelImportBtn');
  button.disabled = true;
  try {
    const result = await postJson('/api/regional-personnel/import', { personnel: pendingRegionalCsvRows });
    pendingRegionalCsvRows = [];
    document.getElementById('regionalPersonnelCsvInput').value = '';
    button.classList.add('hidden');
    document.getElementById('regionalPersonnelImportPreview').replaceChildren();
    moduleNotice(message, result.message, 'success');
    await loadRegionalPersonnel();
  } catch (error) {
    moduleNotice(message, error.message);
  } finally {
    button.disabled = false;
  }
});
document.getElementById('downloadRegionalPersonnelTemplateBtn').addEventListener('click', () => {
  const template = 'name,role,email,phone,station,availability,status_message\n"Asha Mwakalinga","Rescue Specialist","asha@example.com","0712345678","Mbeya Central","Available","Ready for duty"\n';
  const url = URL.createObjectURL(new Blob([template], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'regional-personnel-template.csv';
  link.click();
  URL.revokeObjectURL(url);
});
document.getElementById('regionalPersonnelLogoInput').addEventListener('change', async event => {
  const file = event.currentTarget.files?.[0];
  if (!file) return;
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 1200 * 1024) {
    alert('Choose the official logo as a PNG, JPEG, or WebP image under 1.2 MB.');
    event.currentTarget.value = '';
    return;
  }
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    if (typeof reader.result !== 'string') return;
    localStorage.setItem('zimamotoRegionalOfficialLogo', reader.result);
    setRegionalPersonnelLogo(reader.result);
  });
  reader.addEventListener('error', () => alert('The logo file could not be read.'));
  reader.readAsDataURL(file);
});
setRegionalPersonnelLogo(localStorage.getItem('zimamotoRegionalOfficialLogo'));

async function showRegionalPersonnelEditor(personnel = null) {
  const form = document.getElementById('regionalPersonnelForm');
  form.classList.add('hidden');
  try {
    const stations = await getJson('/api/stations');
    const stationSelect = document.getElementById('regionalPersonnelStation');
    stationSelect.replaceChildren(new Option(translations[currentLanguage].unassigned, ''), ...stations.map(station => new Option(station.name, station.id)));
    form.reset();
    document.getElementById('regionalPersonnelId').value = personnel?.personnelId || '';
    document.getElementById('regionalPersonnelFormTitle').textContent = personnel
      ? `${translations[currentLanguage].editPersonnelRecord}: ${personnel.name}`
      : translations[currentLanguage].addPersonnelRecord;
    document.getElementById('regionalPersonnelName').value = personnel?.name || '';
    document.getElementById('regionalPersonnelRole').value = personnel?.role || '';
    document.getElementById('regionalPersonnelEmail').value = personnel?.email || '';
    document.getElementById('regionalPersonnelPhone').value = personnel?.phone || '';
    stationSelect.value = personnel?.station_id || '';
    document.getElementById('regionalPersonnelNewAvailability').value = personnel?.availability || 'Available';
    document.getElementById('regionalPersonnelStatusMessage').value = personnel?.status_message || '';
    moduleNotice(document.getElementById('regionalPersonnelFormMessage'), '');
    form.classList.remove('hidden');
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } catch (error) {
    alert(error.message);
  }
}

newRegionalPersonnelBtn.addEventListener('click', () => showRegionalPersonnelEditor());

document.getElementById('cancelRegionalPersonnelBtn').addEventListener('click', () => {
  document.getElementById('regionalPersonnelForm').classList.add('hidden');
});

document.getElementById('regionalPersonnelForm').addEventListener('submit', async event => {
  event.preventDefault();
  const id = document.getElementById('regionalPersonnelId').value;
  const payload = {
    name: document.getElementById('regionalPersonnelName').value.trim(),
    role_title: document.getElementById('regionalPersonnelRole').value.trim(),
    email: document.getElementById('regionalPersonnelEmail').value.trim(),
    phone: document.getElementById('regionalPersonnelPhone').value.trim(),
    station_id: document.getElementById('regionalPersonnelStation').value || null,
    availability: document.getElementById('regionalPersonnelNewAvailability').value,
    status_message: document.getElementById('regionalPersonnelStatusMessage').value.trim()
  };
  try {
    const result = id
      ? await putJson(`/api/regional-personnel/${id}`, payload)
      : await postJson('/api/regional-personnel', payload);
    document.getElementById('regionalPersonnelId').value = result.personnelId;
    await loadRegionalPersonnel();
    moduleNotice(document.getElementById('regionalPersonnelFormMessage'), id ? translations[currentLanguage].personnelUpdated : translations[currentLanguage].personnelAdded, 'success');
    document.getElementById('regionalPersonnelFormTitle').textContent = `${translations[currentLanguage].editPersonnelRecord}: ${result.name}`;
  } catch (error) {
    moduleNotice(document.getElementById('regionalPersonnelFormMessage'), error.message);
  }
});

document.getElementById('stationOfficerSearch').addEventListener('input', filterStationOfficerChoices);
document.getElementById('stationOfficerChoices').addEventListener('change', updateStationOfficerSelectionCount);
document.getElementById('cancelStationOfficersBtn').addEventListener('click', () => {
  document.getElementById('stationOfficersForm').classList.add('hidden');
});
document.getElementById('stationOfficersForm').addEventListener('submit', async event => {
  event.preventDefault();
  const stationId = document.getElementById('stationOfficersStationId').value;
  const officerIds = Array.from(document.querySelectorAll('#stationOfficerChoices input[name="stationOfficerIds"]:checked'), input => Number(input.value));
  const saveButton = document.getElementById('saveStationOfficersBtn');
  saveButton.disabled = true;
  saveButton.textContent = translations[currentLanguage].savingAssignments;
  try {
    await putJson(`/api/stations/${stationId}/officers`, { officer_ids: officerIds });
    await loadAllData();
    stationOfficerCandidates = await getJson(`/api/stations/${stationId}/officer-candidates`);
    renderStationOfficerChoices();
    updateStationOfficerSelectionCount();
    moduleNotice(document.getElementById('stationOfficersMessage'), translations[currentLanguage].officerAssignmentsUpdated, 'success');
  } catch (error) {
    moduleNotice(document.getElementById('stationOfficersMessage'), error.message);
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = translations[currentLanguage].saveOfficerAssignments;
  }
});
document.getElementById('regionalPersonnelAvailability').addEventListener('change', renderRegionalPersonnel);
document.getElementById('regionalPersonnelSearch').addEventListener('input', renderRegionalPersonnel);

newNoticeBtn.addEventListener('click', () => showNoticeEditor());
document.getElementById('cancelNoticeEditBtn').addEventListener('click', () => document.getElementById('noticeForm').classList.add('hidden'));
document.getElementById('noticeForm').addEventListener('submit', async event => {
  event.preventDefault();
  const form = document.getElementById('noticeForm');
  const id = document.getElementById('noticeId').value;
  const payload = {
    title: document.getElementById('noticeTitleInput').value.trim(),
    message: document.getElementById('noticeMessageInput').value.trim(),
    type: document.getElementById('noticeTypeInput').value,
    date: document.getElementById('noticeDateInput').value
  };
  try {
    await fetchJson(id ? `/api/notices/${id}` : '/api/notices', id ? 'PUT' : 'POST', payload);
    form.reset();
    document.getElementById('noticeId').value = '';
    document.getElementById('noticeForm').classList.add('hidden');
    await loadViewData('notices');
  } catch (error) { alert(error.message); }
});

newUserBtn.addEventListener('click', () => {
  document.getElementById('userForm').reset();
  document.getElementById('managedUserId').value = '';
  document.getElementById('managedUserChecknumber').readOnly = false;
  document.getElementById('managedUserActive').checked = true;
  document.getElementById('userFormTitle').textContent = 'Create Staff Account';
  moduleNotice(document.getElementById('userFormMessage'), '');
  document.getElementById('userForm').classList.remove('hidden');
});
document.getElementById('cancelUserEditBtn').addEventListener('click', () => document.getElementById('userForm').classList.add('hidden'));
document.getElementById('userForm').addEventListener('submit', async event => {
  event.preventDefault();
  const id = document.getElementById('managedUserId').value;
  const password = document.getElementById('managedUserPassword').value;
  const payload = {
    name: document.getElementById('managedUserName').value.trim(),
    role_code: document.getElementById('managedUserRole').value,
    station_id: document.getElementById('managedUserStation').value || null,
    email: document.getElementById('managedUserEmail').value.trim(),
    phone: document.getElementById('managedUserPhone').value.trim(),
    active: document.getElementById('managedUserActive').checked
  };
  if (!id) {
    payload.checknumber = document.getElementById('managedUserChecknumber').value.trim();
    payload.password = password;
    if (password.length < 6) return moduleNotice(document.getElementById('userFormMessage'), 'Password must be at least 6 characters.');
  }
  try {
    await fetchJson(id ? `/api/users/${id}` : '/api/users', id ? 'PUT' : 'POST', payload);
    moduleNotice(document.getElementById('userFormMessage'), 'User saved.', 'success');
    document.getElementById('userForm').classList.add('hidden');
    await Promise.all([loadUsers(), loadAllData()]);
  } catch (error) { moduleNotice(document.getElementById('userFormMessage'), error.message); }
});

document.getElementById('leaveForm').addEventListener('submit', async event => {
  event.preventDefault();
  const form = document.getElementById('leaveForm');
  try {
    await postJson('/api/leave', {
      leave_type: document.getElementById('leaveTypeInput').value,
      start_date: document.getElementById('leaveStartInput').value,
      end_date: document.getElementById('leaveEndInput').value,
      reason: document.getElementById('leaveReasonInput').value.trim()
    });
    form.reset();
    moduleNotice(document.getElementById('leaveFormMessage'), 'Leave request submitted.', 'success');
    await loadViewData('leave');
  } catch (error) { moduleNotice(document.getElementById('leaveFormMessage'), error.message); }
});

const loginArtworkInput = document.getElementById('loginArtworkInput');
async function readLoginPhoto(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject(new Error(`Unable to read ${file.name}.`));
    });
    reader.addEventListener('error', () => reject(new Error(`Unable to read ${file.name}.`)));
    reader.readAsDataURL(file);
  });
}

loginArtworkInput.addEventListener('change', async () => {
  const files = Array.from(loginArtworkInput.files || []);
  const message = document.getElementById('loginArtworkMessage');
  if (!files.length) return;
  const totalSize = files.reduce((sum, file) => sum + file.size, pendingLoginGallery.reduce((total, image) => total + Math.floor(image.length * 0.75), 0));
  const invalidType = files.find(file => !['image/png', 'image/jpeg', 'image/webp'].includes(file.type));
  const oversized = files.find(file => file.size > 1200 * 1024);
  if (invalidType) {
    moduleNotice(message, `${invalidType.name} is not a PNG, JPEG, or WebP photo.`);
    loginArtworkInput.value = '';
    return;
  }
  if (oversized) {
    moduleNotice(message, `${oversized.name} must be 1.2 MB or smaller.`);
    loginArtworkInput.value = '';
    return;
  }
  if (files.length + pendingLoginGallery.length > 5) {
    moduleNotice(message, 'The slideshow can contain up to five photos.');
    loginArtworkInput.value = '';
    return;
  }
  if (totalSize > 6.2 * 1024 * 1024) {
    moduleNotice(message, 'The complete slideshow must be 6.2 MB or smaller.');
    loginArtworkInput.value = '';
    return;
  }
  try {
    pendingLoginGallery.push(...await Promise.all(files.map(readLoginPhoto)));
    renderLoginGallerySettings(pendingLoginGallery);
    moduleNotice(message, 'Photo preview ready. Publish the slideshow to make it visible on the login page.', 'success');
  } catch (error) {
    moduleNotice(message, error.message);
  } finally {
    loginArtworkInput.value = '';
  }
});

document.getElementById('saveLoginArtworkBtn').addEventListener('click', async () => {
  const message = document.getElementById('loginArtworkMessage');
  try {
    const result = await fetchJson('/api/system/login-gallery', 'PUT', {
      images: pendingLoginGallery,
      interval: Number(document.getElementById('loginSlideshowInterval').value)
    });
    loginGalleryData = result.images;
    loginSlideshowInterval = result.interval;
    loginSlideIndex = 0;
    renderLoginSlideshow(loginGalleryData);
    moduleNotice(message, 'Login slideshow published.', 'success');
  } catch (error) {
    moduleNotice(message, error.message);
  }
});

document.getElementById('removeLoginArtworkBtn').addEventListener('click', async () => {
  const message = document.getElementById('loginArtworkMessage');
  if (!confirm('Clear all photos from the login slideshow?')) return;
  try {
    await deleteJson('/api/system/login-gallery');
    loginGalleryData = [];
    pendingLoginGallery = [];
    loginArtworkInput.value = '';
    loginSlideshowInterval = 6;
    document.getElementById('loginSlideshowInterval').value = '6';
    renderLoginSlideshow(loginGalleryData);
    renderLoginGallerySettings(pendingLoginGallery);
    moduleNotice(message, 'Login slideshow cleared.', 'success');
  } catch (error) {
    moduleNotice(message, error.message);
  }
});

document.getElementById('loginSlidePrevious').addEventListener('click', () => showLoginSlide(loginSlideIndex - 1));
document.getElementById('loginSlideNext').addEventListener('click', () => showLoginSlide(loginSlideIndex + 1));
document.getElementById('loginSlideshowToggle').addEventListener('click', event => {
  const button = event.currentTarget;
  const paused = button.getAttribute('aria-pressed') !== 'true';
  button.setAttribute('aria-pressed', String(paused));
  button.setAttribute('aria-label', paused ? 'Play slideshow' : 'Pause slideshow');
  button.textContent = paused ? 'Play' : 'Pause';
  if (paused) stopLoginSlideshow();
  else startLoginSlideshow();
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) stopLoginSlideshow();
  else startLoginSlideshow();
});

newTrainingBtn.addEventListener('click', () => showTrainingEditor());
document.getElementById('cancelTrainingEditBtn').addEventListener('click', () => {
  document.getElementById('trainingForm').reset();
  document.getElementById('trainingId').value = '';
  document.getElementById('trainingForm').classList.add('hidden');
});
document.getElementById('trainingForm').addEventListener('submit', async event => {
  event.preventDefault();
  const form = document.getElementById('trainingForm');
  const id = document.getElementById('trainingId').value;
  const payload = {
    name: document.getElementById('trainingNameInput').value.trim(),
    coordinator: document.getElementById('trainingCoordinatorInput').value.trim(),
    training_date: document.getElementById('trainingDateInput').value,
    location: document.getElementById('trainingLocationInput').value.trim(),
    participants: Number(document.getElementById('trainingParticipantsInput').value),
    status: document.getElementById('trainingStatusInput').value,
    description: document.getElementById('trainingDescriptionInput').value.trim()
  };
  try {
    await fetchJson(id ? `/api/training/${id}` : '/api/training', id ? 'PUT' : 'POST', payload);
    form.reset();
    document.getElementById('trainingId').value = '';
    document.getElementById('trainingForm').classList.add('hidden');
    await loadViewData('training');
  } catch (error) { alert(error.message); }
});

document.getElementById('performanceForm').addEventListener('submit', async event => {
  event.preventDefault();
  const id = document.getElementById('performanceId').value;
  const payload = {
    name: document.getElementById('performanceNameInput').value.trim(),
    metric: document.getElementById('performanceMetricInput').value.trim(),
    deadline: document.getElementById('performanceDeadlineInput').value,
    progress: Number(document.getElementById('performanceProgressInput').value),
    status: document.getElementById('performanceStatusInput').value
  };
  try {
    await fetchJson(id ? `/api/performance/${id}` : '/api/performance', id ? 'PUT' : 'POST', payload);
    resetPerformanceForm();
    moduleNotice(document.getElementById('performanceFormMessage'), 'Goal saved.', 'success');
    await loadViewData('performance');
  } catch (error) { moduleNotice(document.getElementById('performanceFormMessage'), error.message); }
});
document.getElementById('cancelPerformanceEditBtn').addEventListener('click', resetPerformanceForm);

document.getElementById('financeForm').addEventListener('submit', async event => {
  event.preventDefault();
  const id = document.getElementById('financeId').value;
  const form = document.getElementById('financeForm');
  const payload = {
    entry_date: document.getElementById('financeDateInput').value,
    entry_type: document.getElementById('financeTypeInput').value,
    category: document.getElementById('financeCategoryInput').value.trim(),
    amount: Number(document.getElementById('financeAmountInput').value),
    reference: document.getElementById('financeReferenceInput').value.trim(),
    description: document.getElementById('financeDescriptionInput').value.trim()
  };
  try {
    await fetchJson(id ? `/api/finance/${id}` : '/api/finance', id ? 'PUT' : 'POST', payload);
    form.reset();
    document.getElementById('financeId').value = '';
    document.getElementById('cancelFinanceEditBtn').classList.add('hidden');
    moduleNotice(document.getElementById('financeFormMessage'), 'Finance entry saved and queued for verification.', 'success');
    await loadViewData('finance');
  } catch (error) { moduleNotice(document.getElementById('financeFormMessage'), error.message); }
});

document.getElementById('cancelFinanceEditBtn').addEventListener('click', () => {
  document.getElementById('financeForm').reset();
  document.getElementById('financeId').value = '';
  document.getElementById('cancelFinanceEditBtn').classList.add('hidden');
});

newInspectionBtn.addEventListener('click', () => showInspectionEditor());
document.getElementById('cancelInspectionEditBtn').addEventListener('click', () => {
  document.getElementById('inspectionForm').reset();
  document.getElementById('inspectionId').value = '';
  document.getElementById('inspectionForm').classList.add('hidden');
});
document.getElementById('inspectionForm').addEventListener('submit', async event => {
  event.preventDefault();
  const id = document.getElementById('inspectionId').value;
  const form = document.getElementById('inspectionForm');
  const payload = {
    station_id: document.getElementById('inspectionStationInput').value || null,
    inspected_on: document.getElementById('inspectionDateInput').value,
    inspection_type: document.getElementById('inspectionTypeInput').value.trim(),
    risk_level: document.getElementById('inspectionRiskInput').value,
    outcome: document.getElementById('inspectionOutcomeInput').value,
    follow_up_date: document.getElementById('inspectionFollowUpInput').value || null,
    findings: document.getElementById('inspectionFindingsInput').value.trim(),
    corrective_action: document.getElementById('inspectionActionInput').value.trim()
  };
  try {
    await fetchJson(id ? `/api/fire-inspections/${id}` : '/api/fire-inspections', id ? 'PUT' : 'POST', payload);
    form.reset();
    document.getElementById('inspectionId').value = '';
    form.classList.add('hidden');
    await loadViewData('inspections');
  } catch (error) { alert(error.message); }
});

document.getElementById('settingsForm').addEventListener('submit', async event => {
  event.preventDefault();
  const payload = {
    theme: document.getElementById('settingsTheme').value,
    language: document.getElementById('settingsLanguage').value,
    email_notifications: document.getElementById('settingsEmailNotifications').checked,
    push_notifications: document.getElementById('settingsPushNotifications').checked
  };
  try {
    await fetchJson('/api/settings', 'PUT', payload);
    applyTheme(payload.theme);
    currentLanguage = payload.language;
    languageSelect.value = payload.language;
    setTranslations();
    moduleNotice(document.getElementById('settingsFormMessage'), 'Preferences saved.', 'success');
  } catch (error) { moduleNotice(document.getElementById('settingsFormMessage'), error.message); }
});

document.getElementById('settingsTheme').addEventListener('change', event => {
  applyTheme(event.currentTarget.value);
});

document.getElementById('displaySettingsForm').addEventListener('submit', event => {
  event.preventDefault();
  displayPreferences = {
    compactTables: document.getElementById('compactTablesSetting').checked,
    reduceMotion: document.getElementById('reduceMotionSetting').checked
  };
  try {
    localStorage.setItem('zimamotoDisplayPreferences', JSON.stringify(displayPreferences));
    applyDisplayPreferences();
    moduleNotice(document.getElementById('displaySettingsMessage'), 'Display preferences saved on this device.', 'success');
  } catch (error) {
    moduleNotice(document.getElementById('displaySettingsMessage'), `Unable to save display preferences: ${error.message}`);
  }
});

document.getElementById('resetDisplaySettingsBtn').addEventListener('click', () => {
  displayPreferences = { ...displaySettingsDefaults };
  try {
    localStorage.removeItem('zimamotoDisplayPreferences');
    applyDisplayPreferences();
    moduleNotice(document.getElementById('displaySettingsMessage'), 'Display settings reset.', 'success');
  } catch (error) {
    moduleNotice(document.getElementById('displaySettingsMessage'), `Unable to reset display preferences: ${error.message}`);
  }
});

document.getElementById('printSettingsForm').addEventListener('submit', event => {
  event.preventDefault();
  printPreferences = {
    paper: document.getElementById('printPaperSetting').value,
    orientation: document.getElementById('printOrientationSetting').value,
    includeLogo: document.getElementById('printLogoSetting').checked,
    includeTimestamp: document.getElementById('printTimestampSetting').checked,
    footer: document.getElementById('printFooterSetting').value.trim()
  };
  try {
    localStorage.setItem('zimamotoPrintPreferences', JSON.stringify(printPreferences));
    applyPrintPreferences();
    moduleNotice(document.getElementById('printSettingsMessage'), 'Print layout preferences saved on this device.', 'success');
  } catch (error) {
    moduleNotice(document.getElementById('printSettingsMessage'), `Unable to save print preferences: ${error.message}`);
  }
});

document.getElementById('resetPrintSettingsBtn').addEventListener('click', () => {
  printPreferences = { ...printSettingsDefaults };
  try {
    localStorage.removeItem('zimamotoPrintPreferences');
    applyPrintPreferences();
    moduleNotice(document.getElementById('printSettingsMessage'), 'Print settings reset.', 'success');
  } catch (error) {
    moduleNotice(document.getElementById('printSettingsMessage'), `Unable to reset print preferences: ${error.message}`);
  }
});

themeToggleButton.addEventListener('click', async () => {
  const previousTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
  const nextTheme = previousTheme === 'light' ? 'dark' : 'light';
  applyTheme(nextTheme);
  try {
    await putJson('/api/settings', { theme: nextTheme });
    moduleNotice(document.getElementById('settingsFormMessage'), 'Appearance updated.', 'success');
  } catch (error) {
    applyTheme(previousTheme);
    moduleNotice(document.getElementById('settingsFormMessage'), error.message);
  }
});

document.getElementById('toggleLoginPassword').addEventListener('click', event => {
  const button = event.currentTarget;
  const isVisible = passwordInput.type === 'text';
  passwordInput.type = isVisible ? 'password' : 'text';
  button.textContent = isVisible ? 'Show' : 'Hide';
  button.setAttribute('aria-label', `${isVisible ? 'Show' : 'Hide'} password`);
  button.setAttribute('aria-pressed', String(!isVisible));
});

document.getElementById('exportBackupBtn').addEventListener('click', async () => {
  try {
    const backup = await getJson('/api/backup/export');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' }));
    link.download = `zimamoto-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    moduleNotice(document.getElementById('backupMessage'), 'Backup exported.', 'success');
  } catch (error) { moduleNotice(document.getElementById('backupMessage'), error.message); }
});

document.getElementById('importBackupInput').addEventListener('change', async event => {
  const file = event.currentTarget.files?.[0];
  if (!file) return;
  try {
    if (file.size > 10 * 1024 * 1024) throw new Error('Backup file must be 10 MB or smaller.');
    const backup = JSON.parse(await file.text());
    const payload = backup.data || backup;
    const summary = ['notices', 'notifications', 'leave', 'training', 'performance'].map(key => `${key}: ${Array.isArray(payload[key]) ? payload[key].length : 0}`).join('\n');
    if (!confirm(`Import these records? Existing core records and accounts will not be overwritten.\n\n${summary}`)) return;
    const result = await postJson('/api/backup/import', backup);
    moduleNotice(document.getElementById('backupMessage'), `${result.message} Imported ${Object.entries(result.counts).map(([key, value]) => `${key}: ${value}`).join(' · ')}`, 'success');
    await loadSettings();
    await loadAllData();
  } catch (error) { moduleNotice(document.getElementById('backupMessage'), error.message); }
  finally { event.currentTarget.value = ''; }
});

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
    } else {
      localStorage.removeItem('zimamotoUser');
    }
    updateNavForRole(user.roleCode || user.role?.toLowerCase());
    setAuthenticated(true);
    try { await loadSettings(); } catch (error) { console.warn('Settings load failed', error); }
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
  currentUser = null;
  navBtns.forEach(btn => btn.classList.remove('hidden'));
  setAuthenticated(false);
});

languageSelect.addEventListener('change', (event) => {
  currentLanguage = event.target.value;
  setTranslations();
  const activeView = navBtns.find(button => button.classList.contains('active'))?.dataset.view;
  if (['attendance', 'regionalPersonnel'].includes(activeView)) loadViewData(activeView);
  if (currentUser) fetchJson('/api/settings', 'PUT', { theme: document.body.classList.contains('light-theme') ? 'light' : 'dark', language: currentLanguage }).catch(console.warn);
});

navBtns.forEach(btn => {
  btn.addEventListener('click', () => switchView(btn.dataset.view));
});

document.getElementById('attendanceDateInput').addEventListener('change', event => {
  loadAttendance(event.currentTarget.value);
});

document.getElementById('attendanceMonthInput').addEventListener('change', event => {
  const month = event.currentTarget.value;
  if (!isAttendanceMonth(month) || month > getTanzaniaDate().slice(0, 7)) {
    const feedback = document.getElementById('attendanceInputFeedback');
    feedback.textContent = translations[currentLanguage].invalidAttendanceMonth;
    feedback.classList.remove('hidden');
    event.currentTarget.value = getTanzaniaDate().slice(0, 7);
    return;
  }
  document.getElementById('attendanceInputFeedback').classList.add('hidden');
  const today = getTanzaniaDate();
  const date = month === today.slice(0, 7) ? today : `${month}-01`;
  document.getElementById('attendanceDateInput').value = date;
  loadAttendance(date);
});

document.getElementById('closeAttendanceMonthBtn').addEventListener('click', async event => {
  const button = event.currentTarget;
  const month = document.getElementById('attendanceMonthInput').value;
  if (!isAttendanceMonth(month) || !attendanceMonthlyReport || month >= attendanceMonthlyReport.currentMonth) return;
  if (!confirm(translations[currentLanguage].closeAttendanceConfirm(formatAttendanceMonth(month)))) return;
  button.disabled = true;
  try {
    await postJson(`/api/attendance/monthly/${encodeURIComponent(month)}/close`, {});
    await loadAttendance(document.getElementById('attendanceDateInput').value);
  } catch (error) {
    alert(error.message);
    button.disabled = false;
  }
});

document.getElementById('attendanceSearchInput').addEventListener('input', () => {
  renderAttendanceAdmin(attendanceAdminRecords, document.getElementById('attendanceDateInput').value);
  if (attendanceMonthlyReport) renderAttendanceMonthly(attendanceMonthlyReport);
});

document.getElementById('attendanceCheckInBtn').addEventListener('click', async event => {
  const button = event.currentTarget;
  const status = document.getElementById('attendanceCheckinStatus');
  button.disabled = true;
  status.textContent = translations[currentLanguage].recordingSignIn;
  try {
    await postJson('/api/attendance/check-in', {});
    await loadAttendance(document.getElementById('attendanceDateInput').value || getTanzaniaDate());
  } catch (error) {
    status.textContent = error.message;
    button.disabled = false;
  }
});

document.querySelectorAll('.command-shortcut').forEach(button => {
  button.addEventListener('click', () => switchView(button.dataset.dashboardView));
});
document.getElementById('dashboardRecordIncidentBtn').addEventListener('click', () => {
  document.getElementById('newIncidentBtn').click();
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
      body: JSON.stringify({ name, checknumber, password, keepLoggedIn: document.getElementById('keepLoggedIn').checked })
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
    } else {
      localStorage.removeItem('zimamotoUser');
    }
    updateNavForRole(user.roleCode || user.role?.toLowerCase());
    setAuthenticated(true);
    try { await loadSettings(); } catch (error) { console.warn('Settings load failed', error); }
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

async function initialize() {
  initializeWorkspacePreferences();
  initializeActivityPrinting();
  try { await loadLoginArtwork(); } catch (error) { console.warn(error.message); }
  try {
    currentUser = await getJson('/api/auth/me');
    renderProfileIdentity(currentUser);
    updateNavForRole(currentUser.roleCode);
    setAuthenticated(true);
    await loadSettings();
    await loadAllData();
    if (localStorage.getItem('zimamotoUser')) localStorage.setItem('zimamotoUser', JSON.stringify(currentUser));
  } catch (error) {
    localStorage.removeItem('zimamotoUser');
    currentUser = null;
    setAuthenticated(false);
  }
  setTranslations();
}

initialize();
