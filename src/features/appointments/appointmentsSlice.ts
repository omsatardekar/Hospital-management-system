import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type AppointmentStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED'

export type Appointment = {
  id: string
  patientId: string
  doctorId: string
  department: string
  startAt: string
  endAt: string
  status: AppointmentStatus
  reason: string
  createdAt: string
}

type AppointmentsState = {
  items: Appointment[]
  calendarRange?: { start: string; end: string }
}

const initialState: AppointmentsState = {
  items: [],
}

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    seedAppointments(state, action: PayloadAction<Appointment[]>) {
      state.items = action.payload
    },
    addAppointment(state, action: PayloadAction<Appointment>) {
      state.items.unshift(action.payload)
    },
    updateAppointment(state, action: PayloadAction<{ id: string; changes: Partial<Appointment> }>) {
      const appt = state.items.find((x) => x.id === action.payload.id)
      if (appt) Object.assign(appt, action.payload.changes)
    },
    setCalendarRange(state, action: PayloadAction<{ start: string; end: string }>) {
      state.calendarRange = action.payload
    },
  },
})

export const { seedAppointments, addAppointment, updateAppointment, setCalendarRange } =
  appointmentsSlice.actions
export default appointmentsSlice.reducer

