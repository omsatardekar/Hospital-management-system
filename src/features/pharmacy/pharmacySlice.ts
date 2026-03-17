import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type Medicine = {
  id: string
  name: string
  category: string
  stock: number
  reorderLevel: number
  price: number
  status: 'OK' | 'LOW' | 'OUT'
  updatedAt: string
}

export type Prescription = {
  id: string
  patientId: string
  doctorId: string
  createdAt: string
  medicines: { medicineId: string; dose: string; days: number }[]
}

type PharmacyState = {
  medicines: Medicine[]
  prescriptions: Prescription[]
}

const initialState: PharmacyState = {
  medicines: [],
  prescriptions: [],
}

const pharmacySlice = createSlice({
  name: 'pharmacy',
  initialState,
  reducers: {
    seedPharmacy(
      state,
      action: PayloadAction<{ medicines: Medicine[]; prescriptions: Prescription[] }>,
    ) {
      state.medicines = action.payload.medicines
      state.prescriptions = action.payload.prescriptions
    },
    addMedicine(state, action: PayloadAction<Medicine>) {
      state.medicines.unshift(action.payload)
    },
    updateMedicine(state, action: PayloadAction<{ id: string; changes: Partial<Medicine> }>) {
      const m = state.medicines.find((x) => x.id === action.payload.id)
      if (m) Object.assign(m, action.payload.changes)
    },
    deleteMedicine(state, action: PayloadAction<string>) {
      state.medicines = state.medicines.filter((x) => x.id !== action.payload)
    },
    updateStock(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const m = state.medicines.find((x) => x.id === action.payload.id)
      if (m) {
        m.stock += action.payload.quantity
        m.updatedAt = new Date().toISOString()
        
        // Update status based on stock level
        if (m.stock <= 0) {
          m.status = 'OUT'
        } else if (m.stock <= m.reorderLevel) {
          m.status = 'LOW'
        } else {
          m.status = 'OK'
        }
      }
    },
    addPrescription(state, action: PayloadAction<Prescription>) {
      state.prescriptions.unshift(action.payload)
    },
  },
})

export const { seedPharmacy, addMedicine, updateMedicine, deleteMedicine, updateStock, addPrescription } = pharmacySlice.actions
export default pharmacySlice.reducer

