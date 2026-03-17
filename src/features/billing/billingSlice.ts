import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type InvoiceStatus = 'PAID' | 'PARTIAL' | 'DUE' | 'VOID'

export type Invoice = {
  id: string
  patientId: string
  createdAt: string
  status: InvoiceStatus
  total: number
  paid: number
  insuranceProvider?: string
  insurancePolicyId?: string
  items: { label: string; amount: number }[]
  payments: { id: string; at: string; amount: number; method: 'CASH' | 'CARD' | 'UPI' | 'INSURANCE' }[]
}

type BillingState = {
  invoices: Invoice[]
}

const initialState: BillingState = {
  invoices: [],
}

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    seedInvoices(state, action: PayloadAction<Invoice[]>) {
      state.invoices = action.payload
    },
    addInvoice(state, action: PayloadAction<Invoice>) {
      state.invoices.unshift(action.payload)
    },
    updateInvoice(state, action: PayloadAction<{ id: string; changes: Partial<Invoice> }>) {
      const inv = state.invoices.find((x) => x.id === action.payload.id)
      if (inv) Object.assign(inv, action.payload.changes)
    },
  },
})

export const { seedInvoices, addInvoice, updateInvoice } = billingSlice.actions
export default billingSlice.reducer

