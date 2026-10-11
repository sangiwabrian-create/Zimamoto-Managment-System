# Zimamoto Management System

A Tanzania Fire and Rescue management prototype with role-based dashboards, station operations, incident logging, vehicle management, and multilingual support.

## Features
- Login page branded for Zimamoto Mbeya Fire & Rescue.
- Responsive split-panel login page with a public photo carousel; regional admins and system managers can upload up to five photos and set the slide interval in System Settings.
- Staff can set an availability status and message on their profile; HR, administrators, and system managers can review the regional personnel roster and staff availability.
- Persistent SQLite storage for roles, stations, tasks, incidents, vehicles, equipment, shifts, notifications, and feedback.
- Role-based dashboard content for Kamanda wa Mkoa, Kamanda wa Kituo, Mkuu wa Zamu, Askari Zimamoto, Fundi Magari, Afisa wa Vifaa.
- Dashboard summary of stations, tasks, incidents, vehicles, equipment, shifts, and notifications.
- Station CRUD operations, detailed station lists, and multi-person staff assignments for each station.
- Task management with assignment, deadlines, priorities, and statuses.
- Incident logging and vehicle inventory.
- Shift management and feedback submission.
- Daily attendance sign-in records each account's check-in using the server clock in East Africa Time; administrators can review and update daily attendance for all active accounts and regional personnel, including staff without login accounts.
- User administration with server-enforced role permissions and account deactivation.
- Notice board, leave requests and approvals, training management, and personal performance goals.
- Any signed-in user can submit a leave request; only the regional administrator and HR can list, review, or delete requests. Other roles see no leave records or pending-request totals.
- Dedicated Human Resources, Accountant, and Fire Marshal roles with role-specific workflows for staff/leave/training, financial ledger verification, and fire-safety inspections.
- The regional personnel view covers active staff accounts and personnel-only records for this single-region installation; HR and administrators can add individual records or import a validated CSV roster, filter the list, and print a register with an optional locally uploaded official logo.
- HR can review the user directory and role catalog without administrator account-edit controls.
- The login emblem is the Fire and Rescue Force PNG published in the [official Force website masthead](https://zimamoto.go.tz/sites/default/files/inline-images/frf_logo.png).
- A System Manager role with full administrative access alongside the existing regional administrator role.
- Per-user dark/light theme, language, and notification preferences.
- Per-device display density and animation preferences, plus configurable A4/Letter activity printing with orientation, Force logo, date, and footer options.
- Every operational view, including reports and the regional personnel register, has a print action with an official report header.
- Administrator JSON backups and additive import from the standalone dashboard export; account passwords are never imported.
- English/Kiswahili language toggle.

## Setup
1. Open the workspace in VS Code.
2. Install dependencies:

```bash
cd /Users/maxpro/Desktop/Zimamoto\ Managment\ System
npm install --cache ./npm-cache --no-audit --no-fund
```

3. Start the server (it listens on port 3000 and is reachable on this computer and your local Wi-Fi):

```bash
npm start
```

4. On this computer, open `http://localhost:3000`.

## Open on a phone
1. Connect the phone and this computer to the same Wi-Fi network.
2. Find this computer's local IP address in macOS System Settings → Network → Wi-Fi → Details, or run `ipconfig getifaddr en0` in Terminal (try `en1` if that returns nothing). On this computer, the current address is `192.168.1.181`.
3. On the phone, open `http://<computer-ip>:3000` (currently `http://192.168.1.181:3000`; the IP can change when you reconnect to Wi-Fi).
4. If macOS asks whether Node.js may accept incoming connections, allow it on the private network. Keep the computer and server running while the phone uses the app.

The same setup works on a local network only. Do not forward port 3000 to the public internet; public deployment should use HTTPS and production-grade authentication.

## Sample login credentials
- `KAMANDA001` / `admin123`
- `KAMANDA002` / `station123`
- `ZAMU001` / `shift123`
- `ASKARI001` / `askari123`
- `FUNDIA001` / `mechanic123`
- `VIFAA001` / `equipment123`

## Notes
- Backend data is persisted using SQLite in `data/zimamoto.db`.
- The API uses server-side SQLite sessions and role checks for protected writes. For production, use HTTPS, password hashing, email-based password recovery, and external image/file storage.
# Zimamoto-Managment-System
# Zimamoto-Managment-System
