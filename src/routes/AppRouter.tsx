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
const DoctorConsultation = lazy(() => import('../ui/pages/doctor/DoctorConsultation'))
const SettingsPage = lazy(() => import('../ui/pages/SettingsPage'))
const ForbiddenPage = lazy(() => import('../ui/pages/ForbiddenPage'))

export function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/403" element={<ForbiddenPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route index element={<Navigate to="/doctor/dashboard" replace />} />

            <Route element={<ProtectedRoute permission="dashboard:view" />}>
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
              <Route path="/dashboard" element={<Navigate to="/doctor/dashboard" replace />} />
            </Route>

            {/* Doctor Specific Routes */}
            <Route path="/doctor/appointments" element={<DoctorPatientManagement />} />
            <Route path="/doctor/schedule" element={<DoctorSchedule />} />
            <Route path="/doctor/portfolio" element={<DoctorPortfolio />} />


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
