import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { AppShell } from '../ui/layout/AppShell'
import { PageLoader } from '../ui/shared/PageLoader'

const LoginPage = lazy(() => import('../pages/LoginPage'))
const SignUpPage = lazy(() => import('../pages/SignUpPage'))
const DoctorDashboard = lazy(() => import('../ui/pages/doctor/DoctorDashboard'))
const DoctorPatientManagement = lazy(() => import('../ui/pages/doctor/DoctorPatientManagement'))
const DoctorSchedule = lazy(() => import('../ui/pages/doctor/DoctorSchedule'))
const DoctorPortfolio = lazy(() => import('../ui/pages/doctor/DoctorPortfolio'))
const SettingsPage = lazy(() => import('../ui/pages/SettingsPage'))
const ForbiddenPage = lazy(() => import('../ui/pages/ForbiddenPage'))

// Admin Pages from the branch
const DashboardPage = lazy(() => import('../ui/pages/DashboardPage'))
const PatientsPage = lazy(() => import('../ui/pages/PatientsPage'))
const DoctorsPage = lazy(() => import('../ui/pages/DoctorsPage'))
const BillingPage = lazy(() => import('../ui/pages/BillingPage'))
const PharmacyPage = lazy(() => import('../ui/pages/PharmacyPage'))
const LaboratoryPage = lazy(() => import('../ui/pages/LaboratoryPage'))
const UsersRolesPage = lazy(() => import('../ui/pages/UsersRolesPage'))
const ReportsPage = lazy(() => import('../ui/pages/ReportsPage'))
const AuditLogsPage = lazy(() => import('../ui/pages/AuditLogsPage'))

export function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/403" element={<ForbiddenPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            {/* Root Redirection */}
            <Route index element={<Navigate to="/doctor/dashboard" replace />} />

            {/* Doctor Specific Routes */}
            <Route element={<ProtectedRoute permission="dashboard:view" />}>
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
              <Route path="/doctor/appointments" element={<DoctorPatientManagement />} />
              <Route path="/doctor/schedule" element={<DoctorSchedule />} />
              <Route path="/doctor/portfolio" element={<DoctorPortfolio />} />
            </Route>

            {/* Admin Specific Routes (Sync'd from branch) */}
            <Route element={<ProtectedRoute permission="dashboard:view" />}>
               <Route path="/dashboard" element={<DashboardPage />} />
               <Route path="/patients" element={<PatientsPage />} />
               <Route path="/doctors" element={<DoctorsPage />} />
               <Route path="/billing" element={<BillingPage />} />
               <Route path="/pharmacy" element={<PharmacyPage />} />
               <Route path="/laboratory" element={<LaboratoryPage />} />
               <Route path="/users-roles" element={<UsersRolesPage />} />
               <Route path="/reports" element={<ReportsPage />} />
               <Route path="/audit-logs" element={<AuditLogsPage />} />
            </Route>

            <Route element={<ProtectedRoute permission="settings:read" />}>
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/doctor/dashboard" replace />} />
      </Routes>
    </Suspense>
  )
}
