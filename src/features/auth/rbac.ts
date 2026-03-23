export type Role = 'ADMIN' | 'OPS_MANAGER' | 'FINANCE' | 'PHARMACY' | 'LAB' | 'DOCTOR'

export type Permission =
  | 'dashboard:view'
  | 'patients:read'
  | 'patients:write'
  | 'doctors:read'
  | 'doctors:write'
  | 'appointments:read'
  | 'appointments:write'
  | 'billing:read'
  | 'billing:write'
  | 'pharmacy:read'
  | 'pharmacy:write'
  | 'lab:read'
  | 'lab:write'
  | 'users:read'
  | 'users:write'
  | 'audit:read'
  | 'reports:read'
  | 'settings:read'
  | 'settings:write'

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  ADMIN: [
    'dashboard:view',
    'patients:read',
    'patients:write',
    'doctors:read',
    'doctors:write',
    'appointments:read',
    'appointments:write',
    'billing:read',
    'billing:write',
    'pharmacy:read',
    'pharmacy:write',
    'lab:read',
    'lab:write',
    'users:read',
    'users:write',
    'audit:read',
    'reports:read',
    'settings:read',
    'settings:write',
  ],
  OPS_MANAGER: [
    'dashboard:view',
    'patients:read',
    'patients:write',
    'doctors:read',
    'doctors:write',
    'appointments:read',
    'appointments:write',
    'audit:read',
    'reports:read',
    'settings:read',
  ],
  FINANCE: ['dashboard:view', 'billing:read', 'billing:write', 'reports:read', 'audit:read'],
  PHARMACY: ['dashboard:view', 'pharmacy:read', 'pharmacy:write', 'audit:read'],
  LAB: ['dashboard:view', 'lab:read', 'lab:write', 'audit:read'],
  DOCTOR: [
    'dashboard:view', 
    'appointments:read', 
    'patients:read', 
    'lab:read', 
    'doctors:read', 
    'settings:read'
  ],
}

export function hasPermission(role: Role | null | undefined, permission: Permission) {
  if (!role) return false
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}
