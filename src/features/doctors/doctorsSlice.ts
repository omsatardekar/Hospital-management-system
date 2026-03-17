import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type DoctorStatus = 'ACTIVE' | 'INACTIVE'

export type Doctor = {
  id: string
  name: string
  email: string
  phone: string
  specialization: string
  department: string
  status: DoctorStatus
  rating: number
  todayAppointments: number
  availability: {
    day: string
    slots: string[]
  }[]
}

type DoctorsState = {
  items: Doctor[]
}

const initialState: DoctorsState = {
  items: [],
}

const doctorsSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {
    seedDoctors(state, action: PayloadAction<Doctor[]>) {
      state.items = action.payload
    },
    addDoctor(state, action: PayloadAction<Doctor>) {
      state.items.unshift(action.payload)
    },
    updateDoctor(state, action: PayloadAction<{ id: string; changes: Partial<Doctor> }>) {
      const d = state.items.find((x) => x.id === action.payload.id)
      if (d) Object.assign(d, action.payload.changes)
    },
    deleteDoctor(state, action: PayloadAction<string>) {
      state.items = state.items.filter((x) => x.id !== action.payload)
    },
  },
})

export const { seedDoctors, addDoctor, updateDoctor, deleteDoctor } = doctorsSlice.actions
export default doctorsSlice.reducer

