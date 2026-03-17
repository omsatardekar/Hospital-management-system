import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Role } from './rbac'

type AuthUser = {
  id: string
  name: string
  email: string
  role: Role
}

type AuthState = {
  token: string | null
  user: AuthUser | null
  status: 'idle' | 'loading' | 'authenticated' | 'error'
  error?: string
}

const STORAGE_KEY = 'hms_admin_auth'

function readPersisted(): Pick<AuthState, 'token' | 'user'> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { token: null, user: null }
    const parsed = JSON.parse(raw) as { token: string; user: AuthUser }
    return { token: parsed.token ?? null, user: parsed.user ?? null }
  } catch {
    return { token: null, user: null }
  }
}

function persist(token: string | null, user: AuthUser | null) {
  try {
    if (!token || !user) {
      localStorage.removeItem(STORAGE_KEY)
      return
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }))
  } catch {
    // ignore
  }
}

export const login = createAsyncThunk(
  'auth/login',
  async (payload: { email: string; password: string; role?: Role }) => {
    // Mock enterprise login (JWT-like token)
    await new Promise((r) => setTimeout(r, 650))
    const role: Role = payload.role ?? 'ADMIN'
    const user: AuthUser = {
      id: 'u_admin_001',
      name: role === 'ADMIN' ? 'System Administrator' : 'Operations User',
      email: payload.email,
      role,
    }
    const token = `mock.jwt.${btoa(`${user.id}:${Date.now()}`)}`
    return { token, user }
  },
)

const initialPersisted = readPersisted()

const initialState: AuthState = {
  token: initialPersisted.token,
  user: initialPersisted.user,
  status: initialPersisted.token ? 'authenticated' : 'idle',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null
      state.user = null
      state.status = 'idle'
      state.error = undefined
      persist(null, null)
    },
    setRole(state, action: PayloadAction<Role>) {
      if (!state.user) return
      state.user.role = action.payload
      persist(state.token, state.user)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = undefined
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'authenticated'
        state.token = action.payload.token
        state.user = action.payload.user
        persist(state.token, state.user)
      })
      .addCase(login.rejected, (state) => {
        state.status = 'error'
        state.error = 'Invalid credentials'
      })
  },
})

export const { logout, setRole } = authSlice.actions
export default authSlice.reducer

