# Zimamoto Management System

A Tanzania Fire and Rescue management prototype with role-based dashboards, station operations, incident logging, vehicle management, and multilingual support.

## Features
- Login page branded for Zimamoto Mbeya Fire & Rescue.
- Persistent SQLite storage for roles, stations, tasks, incidents, vehicles, equipment, shifts, notifications, and feedback.
- Role-based dashboard content for Kamanda wa Mkoa, Kamanda wa Kituo, Mkuu wa Zamu, Askari Zimamoto, Fundi Magari, Afisa wa Vifaa.
- Dashboard summary of stations, tasks, incidents, vehicles, equipment, shifts, and notifications.
- Station CRUD operations and detailed station lists.
- Task management with assignment, deadlines, priorities, and statuses.
- Incident logging and vehicle inventory.
- Shift management and feedback submission.
- User administration with server-enforced role permissions and account deactivation.
- Notice board, leave requests and approvals, training management, and personal performance goals.
- Dedicated Human Resources, Accountant, and Fire Marshal roles with role-specific workflows for staff/leave/training, financial ledger verification, and fire-safety inspections.
- A System Manager role with full administrative access alongside the existing regional administrator role.
- Per-user dark/light theme, language, and notification preferences.
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
