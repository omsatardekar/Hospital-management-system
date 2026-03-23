import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import type { Permission } from '../features/auth/rbac'
import { hasPermission } from '../features/auth/rbac'

export function ProtectedRoute(props: { permission?: Permission }) {
  const { permission } = props
  const location = useLocation()
  const token = useAppSelector((s) => s.auth.token)
  const role = useAppSelector((s) => s.auth.user?.role ?? null)

  if (!token) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (permission && !hasPermission(role, permission)) return <Navigate to="/403" replace />
  return <Outlet />
}

