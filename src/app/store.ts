import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import appReducer from '../features/app/appSlice'
import uiReducer from '../features/ui/uiSlice'
import doctorsReducer from '../features/doctors/doctorsSlice'
import patientsReducer from '../features/patients/patientsSlice'
import appointmentsReducer from '../features/appointments/appointmentsSlice'
import pharmacyReducer from '../features/pharmacy/pharmacySlice'
import labReducer from '../features/lab/labSlice'
export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    ui: uiReducer,
    doctors: doctorsReducer,
    patients: patientsReducer,
    appointments: appointmentsReducer,
    pharmacy: pharmacyReducer,
    lab: labReducer,
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

