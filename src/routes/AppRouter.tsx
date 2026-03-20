import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { AppShell } from '../ui/layout/AppShell'
import { PageLoader } from '../ui/shared/PageLoader'

const SplashPage = lazy(() => import('../ui/pages/SplashPage'))
const LoginPage = lazy(() => import('../ui/pages/LoginPage'))
const DashboardPage = lazy(() => import('../ui/pages/DashboardPage'))
const DoctorsPage = lazy(() => import('../ui/pages/DoctorsPage'))
const PatientsPage = lazy(() => import('../ui/pages/PatientsPage'))
const PatientProfilePage = lazy(() => import('../ui/pages/PatientProfilePage'))
const AppointmentsPage = lazy(() => import('../ui/pages/AppointmentsPage'))
const BillingPage = lazy(() => import('../ui/pages/BillingPage'))
const PharmacyPage = lazy(() => import('../ui/pages/PharmacyPage'))
const LaboratoryPage = lazy(() => import('../ui/pages/LaboratoryPage'))
const UsersRolesPage = lazy(() => import('../ui/pages/UsersRolesPage'))
const ReportsPage = lazy(() => import('../ui/pages/ReportsPage'))
const AuditLogsPage = lazy(() => import('../ui/pages/AuditLogsPage'))
const SettingsPage = lazy(() => import('../ui/pages/SettingsPage'))
const ForbiddenPage = lazy(() => import('../ui/pages/ForbiddenPage'))

export function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route index element={<SplashPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/403" element={<ForbiddenPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route index element={<Navigate to="/dashboard" replace />} />

            <Route element={<ProtectedRoute permission="dashboard:view" />}>
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>

            <Route element={<ProtectedRoute permission="doctors:read" />}>
              <Route path="/doctors" element={<DoctorsPage />} />
            </Route>

            <Route element={<ProtectedRoute permission="patients:read" />}>
              <Route path="/patients" element={<PatientsPage />} />
              <Route path="/patients/:patientId" element={<PatientProfilePage />} />
            </Route>

            <Route element={<ProtectedRoute permission="appointments:read" />}>
              <Route path="/appointments" element={<AppointmentsPage />} />
            </Route>

            <Route element={<ProtectedRoute permission="billing:read" />}>
              <Route path="/billing" element={<BillingPage />} />
            </Route>

            <Route element={<ProtectedRoute permission="pharmacy:read" />}>
              <Route path="/pharmacy" element={<PharmacyPage />} />
            </Route>

            <Route element={<ProtectedRoute permission="lab:read" />}>
              <Route path="/laboratory" element={<LaboratoryPage />} />
            </Route>

            <Route element={<ProtectedRoute permission="users:read" />}>
              <Route path="/users-roles" element={<UsersRolesPage />} />
            </Route>

            <Route element={<ProtectedRoute permission="reports:read" />}>
              <Route path="/reports" element={<ReportsPage />} />
            </Route>

            <Route element={<ProtectedRoute permission="audit:read" />}>
              <Route path="/audit-logs" element={<AuditLogsPage />} />
            </Route>

            <Route element={<ProtectedRoute permission="settings:read" />}>
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  )
}

