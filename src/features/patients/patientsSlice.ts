import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type Patient = {
  id: string
  name: string
  avatar?: string
  address?: string
  gender: 'Male' | 'Female' | 'Other'
  age: number
  phone: string
  email: string
  bloodGroup: string
  status: 'ACTIVE' | 'DISCHARGED' | 'IN_TREATMENT' | 'ADMITTED' | 'BLOCKED'
  lastVisit: string
  department: string
  assignedDoctorId?: string
  allergies?: string[]
  diseases?: string[]
  medicalTimeline: { at: string; title: string; note: string; type?: 'GENERAL' | 'APPOINTMENT' | 'PAYMENT' | 'STATUS_CHANGE' }[]
  reports: { id: string; name: string; type: string; uploadedAt: string }[]
}

type PatientsState = {
  items: Patient[]
}

const initialState: PatientsState = {
  items: [],
}

const patientsSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    seedPatients(state, action: PayloadAction<Patient[]>) {
      state.items = action.payload
    },
    updatePatient(state, action: PayloadAction<{ id: string; changes: Partial<Patient> }>) {
      const p = state.items.find((x) => x.id === action.payload.id)
      if (p) Object.assign(p, action.payload.changes)
    },
    addPatient(state, action: PayloadAction<Patient>) {
      state.items.unshift(action.payload)
    },
    deletePatient(state, action: PayloadAction<string>) {
      state.items = state.items.filter((x) => x.id !== action.payload)
    },
  },
})

export const { seedPatients, updatePatient, addPatient, deletePatient } = patientsSlice.actions
export default patientsSlice.reducer
