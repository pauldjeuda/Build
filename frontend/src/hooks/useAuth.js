import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../modules/auth/store/authSlice';
import { can, canAny, getDashboardPath, getRoleLabel } from '../utils/permissions';

export function useAuth() {
  const { user, isAuthenticated, loading } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const role = user?.role ?? null;

  return {
    user,
    isAuthenticated,
    loading,
    role,
    roleLabel: getRoleLabel(role),
    dashboardPath: getDashboardPath(role),
    can: (permission) => can(role, permission),
    canAny: (permissions) => canAny(role, permissions),
    isRole: (...roles) => roles.includes(role),
    logout: () => dispatch(logout()),
  };
}
