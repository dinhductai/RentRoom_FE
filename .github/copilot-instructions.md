# Rent Manager App - AI Coding Agent Instructions

## Project Overview
React-based rental management platform with three distinct user roles: **User** (renters), **Rentaler** (property owners), and **Admin**. Backend API at `http://localhost:8080`.

## Architecture & Key Patterns

### 1. Role-Based Routing (3 Separate Workflows)
```javascript
// Three authentication endpoints for three roles
getCurrentUser()     // /user/me - ROLE_USER
getCurrentRentaler() // /rentaler/me - ROLE_RENTALER  
getCurrentAdmin()    // /admin/me - ROLE_ADMIN
```
- **Never mix role contexts** - each role has isolated dashboards and API endpoints
- Login routes: `/login` (user), `/login-rentaler`, `/login-admin`
- Check `App.js` for role-specific route patterns (`/rentaler/*`, `/admin/*`, root for users)

### 2. Dual API Service Pattern
The codebase uses **two different HTTP client patterns**:

**Fetch-based (`src/services/fetch/ApiUtils.js`)**: 
- For JSON operations (GET, POST with JSON body)
- Includes centralized auth token injection
- Use for: listings, authentication, state changes

**Axios-based (`src/services/axios/`)**: 
- For `multipart/form-data` file uploads
- Manual Authorization header: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
- Services: `RoomService`, `ContractService`, `MaintenanceService`, `AuthService`
- Use for: room creation, profile updates, contract uploads

**When adding new API calls:**
- File uploads → Axios services
- JSON CRUD → Fetch-based ApiUtils

### 3. Authentication Flow
```javascript
// Token stored in localStorage with key from Connect.js
export const ACCESS_TOKEN = 'accessToken';

// All protected endpoints check this:
if(!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
}
```
- OAuth2 redirect handler at `/oauth2/redirect` (Google/Facebook)
- Password reset flow: forgot-password → reset-password/:email → success-confirmed/:email
- **Always check `authenticated` prop before rendering protected components**

### 4. Component Props Pattern
Every page component receives standard props:
```javascript
{ authenticated, currentUser, role, onLogout, loadCurrentUser }
```
- Use `<Navigate to="/login" />` for unauthenticated users
- Role-specific redirects: `/login-rentaler`, `/login-admin`

### 5. Toast Notifications
Standardized user feedback pattern (react-toastify):
```javascript
toast.success(response.message)
toast.error((error && error.message) || 'Oops! Có điều gì đó xảy ra. Vui lòng thử lại!')
```
- Backend sends Vietnamese messages in `response.message`
- Always show toast after API operations (success/error)

### 6. Firebase Integration
Real-time chat functionality (`src/page/messages/firebase.js`):
```javascript
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
```
- Separate from JWT-based REST API
- Used for: User chat (`/message`), Rentaler chat (`/rentaler/chat`)

## Development Workflow

### Running the App
```bash
npm start          # Dev server at http://localhost:3000
npm run build      # Production build
npm test           # Jest tests
```

### API Configuration
Edit `src/constants/Connect.js`:
```javascript
export const API_BASE_URL = 'http://localhost:8080';
export const OAUTH2_REDIRECT_URI = 'http://localhost:3000/oauth2/redirect';
```

### Adding New Features
1. **New page component**: Place in `src/page/{role}/` (user/rentaler/admin)
2. **API endpoint**: Add to appropriate service file (fetch vs axios)
3. **Route**: Update `App.js` Routes section for the role
4. **Navigation**: Update Nav/SidebarNav for the role

## Key Files Reference
- **Auth**: `src/services/fetch/ApiUtils.js` (lines 10-90)
- **Room Management**: `src/page/rentaler/RoomManagement.js`
- **Admin Dashboard**: `src/page/admin/DashboardAdmin.js`
- **User Profile**: `src/page/user/Profile.js`
- **Main Router**: `src/App.js` (50+ routes)

## Common Pitfalls
- **Don't** use relative paths for API calls - always use `API_BASE_URL` constant
- **Don't** forget Authorization header in axios calls (fetch handles automatically)
- **Don't** mix role navigation (e.g., user accessing `/rentaler/*` routes)
- **Do** handle Vietnamese error messages from backend
- **Do** use FormData for file uploads with axios services
- **Do** check `authenticated` and `role` props before rendering protected content

## UI Libraries
- Bootstrap 5 (primary)
- Material-UI (@mui/material)
- Ant Design (antd)
- Chart.js + react-chartjs-2
- Semantic UI React

## Testing Notes
- Run backend at port 8080 before starting frontend
- Firebase chat requires valid config in `firebase.js`
- OAuth2 requires redirect URI whitelisting in backend
