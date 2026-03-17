import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type AuditEvent = {
  id: string
  actorUserId: string
  actorName: string
  action: string
  entity: string
  entityId?: string
  meta?: Record<string, unknown>
  createdAt: string
}

type AuditState = {
  events: AuditEvent[]
}

const initialState: AuditState = {
  events: [],
}

const auditSlice = createSlice({
  name: 'audit',
  initialState,
  reducers: {
    logEvent(state, action: PayloadAction<Omit<AuditEvent, 'id' | 'createdAt'> & { id?: string; createdAt?: string }>) {
      const id = action.payload.id ?? crypto.randomUUID()
      state.events.unshift({
        id,
        actorUserId: action.payload.actorUserId,
        actorName: action.payload.actorName,
        action: action.payload.action,
        entity: action.payload.entity,
        entityId: action.payload.entityId,
        meta: action.payload.meta,
        createdAt: action.payload.createdAt ?? new Date().toISOString(),
      })
      state.events = state.events.slice(0, 500)
    },
    seedAudit(state, action: PayloadAction<AuditEvent[]>) {
      state.events = action.payload
    },
  },
})

export const { logEvent, seedAudit } = auditSlice.actions
export default auditSlice.reducer

