import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../modules/auth/store/authSlice';
import { hasPermission } from '../utils/permissions';

export function useAuth() {
  const { user, isAuthenticated, loading } = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  return {
    user,
    isAuthenticated,
    loading,
    role: user?.role,
    can: (permission) => hasPermission(user?.role, permission),
    logout: () => dispatch(logout()),
  };
}
