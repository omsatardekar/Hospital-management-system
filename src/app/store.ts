import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import appReducer from '../features/app/appSlice'
import uiReducer from '../features/ui/uiSlice'
import auditReducer from '../features/audit/auditSlice'
import doctorsReducer from '../features/doctors/doctorsSlice'
import patientsReducer from '../features/patients/patientsSlice'
import appointmentsReducer from '../features/appointments/appointmentsSlice'
import billingReducer from '../features/billing/billingSlice'
import pharmacyReducer from '../features/pharmacy/pharmacySlice'
import labReducer from '../features/lab/labSlice'
import usersReducer from '../features/users/usersSlice'

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    ui: uiReducer,
    audit: auditReducer,
    doctors: doctorsReducer,
    patients: patientsReducer,
    appointments: appointmentsReducer,
    billing: billingReducer,
    pharmacy: pharmacyReducer,
    lab: labReducer,
    users: usersReducer,
  },
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: {
        ignoredActions: ['appointments/setCalendarRange'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

