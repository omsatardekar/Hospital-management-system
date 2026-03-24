import type { Permission } from '../../features/auth/rbac'

export type NavItem = {
  key: string
  label: string
  to: string
  icon: string
  permission: Permission
}

export const NAV_ITEMS: NavItem[] = [
  // Admin Items
  { key: 'dashboard', label: 'Dashboard', to: '/dashboard', icon: 'dashboard', permission: 'dashboard:view' },
  { key: 'patients', label: 'Patients', to: '/patients', icon: 'patients', permission: 'patients:read' },
  { key: 'doctors', label: 'Doctors', to: '/doctors', icon: 'doctors', permission: 'doctors:read' },
  { key: 'billing', label: 'Billing', to: '/billing', icon: 'billing', permission: 'billing:read' },
  { key: 'pharmacy', label: 'Pharmacy', to: '/pharmacy', icon: 'pharmacy', permission: 'pharmacy:read' },
  { key: 'laboratory', label: 'Laboratory', to: '/laboratory', icon: 'lab', permission: 'lab:read' },
  { key: 'usersRoles', label: 'Users / Roles', to: '/users-roles', icon: 'users', permission: 'users:read' },
  { key: 'reports', label: 'Reports', to: '/reports', icon: 'reports', permission: 'reports:read' },
  { key: 'auditLogs', label: 'Audit Logs', to: '/audit-logs', icon: 'audit', permission: 'audit:read' },
  { key: 'settings', label: 'Settings', to: '/settings', icon: 'settings', permission: 'settings:read' },
  
  // Doctor Items (Omkar)
  { key: 'doctor-dashboard', label: 'Doctor Dashboard', to: '/doctor/dashboard', icon: 'dashboard', permission: 'doctor:dashboard' },
  { key: 'doctor-appointments', label: 'Appointments', to: '/doctor/appointments', icon: 'appointments', permission: 'appointments:read' },
  { key: 'doctor-schedule', label: 'Schedule', to: '/doctor/schedule', icon: 'schedule', permission: 'doctor:schedule' },
  { key: 'doctor-portfolio', label: 'Profile', to: '/doctor/portfolio', icon: 'portfolio', permission: 'doctor:profile' },

  // Pharmacist Items
  { key: 'pharmacist-dashboard', label: 'Pharmacist Dashboard', to: '/pharmacist/dashboard', icon: 'dashboard', permission: 'pharmacist:dashboard' },
]

