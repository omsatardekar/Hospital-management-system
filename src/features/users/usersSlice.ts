import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Role } from '../auth/rbac'

export type SystemUser = {
  id: string
  name: string
  email: string
  role: Role
  status: 'ACTIVE' | 'SUSPENDED'
  createdAt: string
}

type UsersState = {
  users: SystemUser[]
}

const initialState: UsersState = {
  users: [],
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    seedUsers(state, action: PayloadAction<SystemUser[]>) {
      state.users = action.payload
    },
    addUser(state, action: PayloadAction<SystemUser>) {
      state.users.unshift(action.payload)
    },
    updateUser(state, action: PayloadAction<{ id: string; changes: Partial<SystemUser> }>) {
      const u = state.users.find((x) => x.id === action.payload.id)
      if (u) Object.assign(u, action.payload.changes)
    },
    deleteUser(state, action: PayloadAction<string>) {
      state.users = state.users.filter((x) => x.id !== action.payload)
    },
  },
})

export const { seedUsers, addUser, updateUser, deleteUser } = usersSlice.actions
export default usersSlice.reducer

