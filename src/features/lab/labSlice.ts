import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type LabStatus = 'REQUESTED' | 'COLLECTED' | 'PROCESSING' | 'REPORTED'

export type LabTest = {
  id: string
  patientId: string
  requestedByDoctorId: string
  testName: string
  status: LabStatus
  requestedAt: string
  reportedAt?: string
  reportFiles: { id: string; name: string; type: string; uploadedAt: string }[]
}

type LabState = {
  tests: LabTest[]
}

const initialState: LabState = {
  tests: [],
}

const labSlice = createSlice({
  name: 'lab',
  initialState,
  reducers: {
    seedLab(state, action: PayloadAction<LabTest[]>) {
      state.tests = action.payload
    },
    addLabTest(state, action: PayloadAction<LabTest>) {
      state.tests.unshift(action.payload)
    },
    updateLabTest(state, action: PayloadAction<{ id: string; changes: Partial<LabTest> }>) {
      const t = state.tests.find((x) => x.id === action.payload.id)
      if (t) Object.assign(t, action.payload.changes)
    },
    deleteLabTest(state, action: PayloadAction<string>) {
      state.tests = state.tests.filter((x) => x.id !== action.payload)
    },
    addReportFile(state, action: PayloadAction<{ testId: string; file: LabTest['reportFiles'][0] }>) {
      const test = state.tests.find((x) => x.id === action.payload.testId)
      if (test) {
        test.reportFiles.push(action.payload.file)
        test.status = 'REPORTED'
        test.reportedAt = new Date().toISOString()
      }
    },
  },
})

export const { seedLab, addLabTest, updateLabTest, deleteLabTest, addReportFile } = labSlice.actions
export default labSlice.reducer

