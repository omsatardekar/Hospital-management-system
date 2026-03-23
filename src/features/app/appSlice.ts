import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ensureMockServer } from '../../api/mockServer'
import { http } from '../../api/http'
import { seedDoctors } from '../doctors/doctorsSlice'
import { seedPatients } from '../patients/patientsSlice'
import { seedAppointments } from '../appointments/appointmentsSlice'
import { seedPharmacy } from '../pharmacy/pharmacySlice'
import { seedLab } from '../lab/labSlice'
import { seedNotifications, pushNotification } from '../ui/uiSlice'

type AppState = {
  bootStatus: 'idle' | 'loading' | 'ready' | 'error'
}

const initialState: AppState = { bootStatus: 'idle' }

export const bootstrap = createAsyncThunk('app/bootstrap', async (_, { dispatch }) => {
  ensureMockServer()
  const res = await http.get('/bootstrap')
  const data = res.data as any

  dispatch(seedDoctors(data.doctors))
  dispatch(seedPatients(data.patients))
  dispatch(seedAppointments(data.appointments))
  dispatch(seedPharmacy(data.pharmacy))
  dispatch(seedLab(data.labTests))
  dispatch(seedNotifications(data.notifications))

  dispatch(
    pushNotification({
      severity: 'info',
      title: 'System Ready',
      message: 'Mock hospital backend connected. Data loaded for all modules.',
    }),
  )

  return true
})

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(bootstrap.pending, (s) => {
        s.bootStatus = 'loading'
      })
      .addCase(bootstrap.fulfilled, (s) => {
        s.bootStatus = 'ready'
      })
      .addCase(bootstrap.rejected, (s) => {
        s.bootStatus = 'error'
      })
  },
})

export default appSlice.reducer

