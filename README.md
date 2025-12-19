# Rent Manager App (Frontend)

A React (Create React App) frontend for a rental management platform with **three isolated roles**:

- **User** (tenant/customer)
- **Rentaler** (property owner/landlord)
- **Admin**

The frontend talks to a backend API (default: `http://localhost:8080`) and includes:

- Role-based dashboards & CRUD flows
- Authentication with JWT + OAuth2 redirect
- Realtime-like messaging UI (REST-backed)
- An in-app **AI Assistant** chatbot
- Analytics dashboards with charts
- Google Maps + Places autocomplete for address selection
- Excel export for bills/checkout documents

---

## 1) Tech Stack

**Core**
- React 18, Create React App (`react-scripts`)
- React Router v6

**HTTP / Auth**
- `fetch` wrapper with JWT injection: `src/services/fetch/ApiUtils.js`
- `axios` services for uploads / `multipart/form-data`: `src/services/axios/*`
- JWT parsing: `jwt-decode`

**UI & UX**
- Bootstrap 5 + vendor assets under `public/assets` and `src/assets`
- Ant Design (`antd`)
- Material UI (`@mui/material`) + Emotion
- Notifications: `react-toastify` (backend messages are commonly Vietnamese)

**Charts / Analytics**
- `chart.js` + `react-chartjs-2`

**Maps**
- `react-google-maps` (map rendering)
- `react-google-autocomplete` (Places predictions)

**Exports**
- `xlsx` (Excel generation and download)

**Firebase (present in repo)**
- `firebase` config exists in `src/page/messages/firebase.js`.
	- Note: the current chat UI components primarily use backend REST endpoints (see “Messaging” below). Firebase context files appear partially wired.

---

## 2) Product Overview & Roles

### User (tenant)
Main routes live at `/…` (see `src/App.js`). Typical capabilities include:

- Browse room listings and view room detail pages
- Manage profile, change password
- Send rental requests / view request status
- Follow agents / save blogs (feature pages exist)
- Messaging with owners (chat module)
- AI Assistant chatbot (floating widget)

### Rentaler (owner)
All rentaler routes are under `/rentaler/...`.

- Room management (add/edit/list)
- Contract management (create/edit/list)
- Maintenance management (add/edit/list)
- Utilities management (electric/water)
- Export invoices / checkout documents to Excel
- Dashboard analytics (revenue, occupancy, costs) with charts
- Messaging UI (shared message module)

### Admin
All admin routes are under `/admin/...`.

- Approve/remove room posts
- Account management / authorization pages
- Send email to users from admin flows
- Dashboard KPIs + moderation table (pagination)

---

## 3) Key Features (What the FE Implements)

### 3.1 Authentication & Role Routing

- Access token is stored in LocalStorage under key `accessToken`.
- On app startup, the token is decoded to detect role and load the correct “current user” endpoint:
	- `GET /user/me`
	- `GET /rentaler/me`
	- `GET /admin/me`

This logic is implemented in `src/App.js` and `src/services/fetch/ApiUtils.js`.

**OAuth2 redirect** route exists at:
- `/oauth2/redirect` handled by `src/oauth2/OAuth2RedirectHandler.js`

### 3.2 CRUD Modules

This frontend is organized around CRUD pages per role under `src/page/{user|rentaler|admin}/`.

Examples:

- Rentaler:
	- Rooms: `src/page/rentaler/AddRoom.js`, `EditRoom.js`, `RoomManagement.js`
	- Contracts: `src/page/rentaler/AddContract.js`, `EditContract.js`, `ContractManagement.js`
	- Maintenance: `src/page/rentaler/AddMaintence.js`, `EditMaintence.js`, `MaintenceManagement.js`
	- Utilities: `src/page/rentaler/AddElectricAndWater.js`, `EditElectricAndWater.js`, `ElectricAndWaterManagement.js`

- Admin:
	- Dashboard/moderation: `src/page/admin/DashboardAdmin.js`
	- Room management, accounts, authorization: `src/page/admin/*`

### 3.3 Messaging (Chat)

The chat UI is shared and embedded in both:

- User: `/message` → `src/page/user/ChatOfUser.js`
- Rentaler: `/rentaler/chat` → `src/page/rentaler/Chat.js`

**Important implementation detail:**
- The current message components under `src/page/messages/*` primarily call backend REST endpoints:
	- `GET /user/message-chat/{otherUserId}`
	- `POST /user/message-chat/{otherUserId}`
	- Auto-select conversation support uses navigation state `ownerId` (see `src/page/messages/context/UserContext.js`).

### 3.4 AI Assistant Chatbot

A floating AI assistant widget is mounted globally in `src/App.js`:

- Component: `src/components/AIChatbot/AIChatbot.js`
- Calls backend endpoint:
	- `POST /api/ai/chat` with JSON body `{ message: string }`
	- Adds `Authorization: Bearer <token>` if the user is logged in

This means the “AI model/provider” is implemented server-side; the FE only renders the chat UI and calls the endpoint.

### 3.5 Analytics Dashboards (Charts)

Rentaler dashboard includes KPI cards and chart visualizations:

- Dashboard: `src/page/rentaler/DashboardRentaler.js`
- Charts: `src/page/rentaler/chart/*` using `react-chartjs-2` (Bar/Pie)
- Data is fetched via endpoints like `getByMonth()` and rendered as:
	- Room revenue by month (Bar chart)
	- Cost breakdown (water/electric/internet) (multi-series Bar chart)

Admin also has chart components under `src/page/admin/chart/*` (simple Bar/Pie wrappers).

### 3.6 Maps & Address Autocomplete

Maps and Places search appear under role-specific folders:

- Map rendering: `src/page/*/map/MyMapComponent.js` (uses `react-google-maps`)
- Places autocomplete: `src/page/*/map/StandaloneSearchBox.js` (uses `react-google-autocomplete`)

Used to help users select/preview addresses and retrieve latitude/longitude.

### 3.7 Excel Export

Excel export is implemented using `xlsx`:

- Export invoice/bill: `src/page/rentaler/ExportBillRequier.js`
- Export checkout/contract: `src/page/rentaler/ExportCheckoutRoom.js`

The pages generate a workbook client-side and trigger a download.

---

## 4) Project Structure

High-level layout:

```
src/
	App.js                         # main router + role detection + global widgets (AIChatbot)
	constants/Connect.js            # API_BASE_URL, OAuth redirect constants
	services/
		fetch/ApiUtils.js             # JSON fetch wrapper + most REST calls
		axios/                        # multipart uploads + specific services
	page/
		user/                         # user pages
		rentaler/                     # rentaler pages
		admin/                        # admin pages
		messages/                     # chat UI module
	common/                         # shared Header/Footer/NotFound/etc.
```

---

## 5) Configuration

### Backend API base URL
Edit `src/constants/Connect.js`:

- `API_BASE_URL` (default `http://localhost:8080`)
- `OAUTH2_REDIRECT_URI` (default `http://localhost:3000/oauth2/redirect`)

### Keys (Google Maps / Firebase)

This repo currently contains client keys inside source files (e.g., Maps and Firebase config).

- Recommended: move keys to environment variables (CRA `REACT_APP_*`) and rotate exposed keys.
- Do not commit production secrets into the frontend repository.

---

## 6) Local Development

### Prerequisites

- Node.js 16+ (Node 18 recommended)
- npm 8+
- Backend API running at `http://localhost:8080`

### Install & Run

```bash
npm install
npm start
```

App runs at `http://localhost:3000`.

### Tests & Build

```bash
npm test
npm run build
```

---

## 7) Useful Routes (Quick Links)

Authentication:
- `/login` (User)
- `/login-rentaler`
- `/login-admin`
- `/signup` (User)
- `/signup-rentaler`
- `/oauth2/redirect`

Dashboards:
- `/` (User landing)
- `/rentaler` (Rentaler dashboard)
- `/admin` (Admin dashboard)

Chat:
- `/message` (User)
- `/rentaler/chat` (Rentaler)

---

## 8) Notes / Known Implementation Quirks

- Routing is React Router v6 (`Routes` + `element`). There is a legacy `src/common/PrivateRoute.js` (v5 style) that is not the primary mechanism.
- `src/App.js` includes a global suppression for noisy Bootstrap modal console errors; remove only if you are explicitly fixing the underlying modal lifecycle issues.

