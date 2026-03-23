import type { Permission } from '../../features/auth/rbac'

export type NavItem = {
  key: string
  label: string
  to: string
  icon: string
  permission: Permission
}

export const DOCTOR_NAV_ITEMS: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', to: '/doctor/dashboard', icon: 'dashboard', permission: 'dashboard:view' },
  { key: 'appointments', label: 'Appointments', to: '/doctor/appointments', icon: 'appointments', permission: 'appointments:read' },
  { key: 'schedule', label: 'Schedule', to: '/doctor/schedule', icon: 'appointments', permission: 'appointments:read' },
  { key: 'profile', label: 'Profile', to: '/doctor/portfolio', icon: 'doctors', permission: 'doctors:read' },
]

export const PHARMACIST_NAV_ITEMS: NavItem[] = []

export const NAV_ITEMS = DOCTOR_NAV_ITEMS

