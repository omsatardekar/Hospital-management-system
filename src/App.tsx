import { useEffect } from 'react'
import { AppRouter } from './routes/AppRouter'
import { useAppDispatch, useAppSelector } from './app/hooks'
import { bootstrap } from './features/app/appSlice'
import { login } from './features/auth/authSlice'

export default function App() {
  const dispatch = useAppDispatch()
  const token = useAppSelector((s) => s.auth.token)
  const bootStatus = useAppSelector((s) => s.app.bootStatus)

  useEffect(() => {
    // Auto-login with admin credentials for demo
    if (!token) {
      dispatch(login({
        email: 'admin@hospital.com',
        password: 'admin123',
        role: 'ADMIN',
      }))
    }
    
    if (token && bootStatus === 'idle') {
      dispatch(bootstrap())
    }
  }, [dispatch, token, bootStatus])

  return <AppRouter />
}
