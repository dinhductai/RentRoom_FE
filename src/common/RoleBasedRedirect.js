import { Navigate } from 'react-router-dom';

/**
 * Component để redirect user đến đúng dashboard dựa trên role
 */
function RoleBasedRedirect({ authenticated, role, children }) {
  console.log('🔀 RoleBasedRedirect - authenticated:', authenticated, 'role:', role);
  
  if (!authenticated) {
    return children;
  }

  // Nếu đã authenticated, redirect đến dashboard phù hợp với role
  switch (role) {
    case 'ROLE_ADMIN':
      console.log('➡️ Redirecting to /admin');
      return <Navigate to="/admin" replace />;
    case 'ROLE_RENTALER':
      console.log('➡️ Redirecting to /rentaler');
      return <Navigate to="/rentaler" replace />;
    case 'ROLE_USER':
      console.log('➡️ Redirecting to /');
      return <Navigate to="/" replace />;
    default:
      console.log('⚠️ Unknown role, showing login page');
      return children;
  }
}

export default RoleBasedRedirect;
