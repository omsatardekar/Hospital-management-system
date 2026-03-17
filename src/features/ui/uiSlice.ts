import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type UiNotification = {
  id: string
  title: string
  message: string
  severity: 'info' | 'success' | 'warning' | 'error'
  createdAt: string
  read: boolean
}

type UiState = {
  sidebarCollapsed: boolean
  themeMode: 'light' | 'dark'
  notifications: UiNotification[]
}

const initialState: UiState = {
  sidebarCollapsed: false,
  themeMode: (localStorage.getItem('hms_theme') as UiState['themeMode']) ?? 'light',
  notifications: [],
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    setThemeMode(state, action: PayloadAction<UiState['themeMode']>) {
      state.themeMode = action.payload
      localStorage.setItem('hms_theme', action.payload)
    },
    pushNotification(state, action: PayloadAction<Omit<UiNotification, 'id' | 'createdAt' | 'read'> & { id?: string }>) {
      const id = action.payload.id ?? crypto.randomUUID()
      state.notifications.unshift({
        id,
        title: action.payload.title,
        message: action.payload.message,
        severity: action.payload.severity,
        createdAt: new Date().toISOString(),
        read: false,
      })
      state.notifications = state.notifications.slice(0, 30)
    },
    markNotificationRead(state, action: PayloadAction<string>) {
      const n = state.notifications.find((x) => x.id === action.payload)
      if (n) n.read = true
    },
    seedNotifications(state, action: PayloadAction<UiNotification[]>) {
      state.notifications = action.payload
    },
    markAllNotificationsRead(state) {
      state.notifications.forEach((n) => (n.read = true))
    },
  },
})

export const {
  toggleSidebar,
  setThemeMode,
  pushNotification,
  markNotificationRead,
  markAllNotificationsRead,
  seedNotifications,
} = uiSlice.actions
export default uiSlice.reducer
