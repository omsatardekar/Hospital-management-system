import { Box, Button, Card, CardContent, Divider, MenuItem, TextField, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { login } from '../../features/auth/authSlice'
import type { Role } from '../../features/auth/rbac'

const ROLES: { value: Role; label: string }[] = [
  { value: 'ADMIN', label: 'Admin (Full Control)' },
  { value: 'OPS_MANAGER', label: 'Operations Manager' },
  { value: 'FINANCE', label: 'Finance' },
  { value: 'PHARMACY', label: 'Pharmacy' },
  { value: 'LAB', label: 'Laboratory' },
  { value: 'DOCTOR', label: 'Doctor (Read-limited)' },
]

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const status = useAppSelector((s) => s.auth.status)

  const from = useMemo(() => {
    const state = location.state as { from?: string } | null
    return state?.from ?? '/dashboard'
  }, [location.state])

  const [email, setEmail] = useState('admin@hospital.com')
  const [password, setPassword] = useState('Admin@123')
  const [role, setRole] = useState<Role>('ADMIN')

  return (
    <Box sx={{ minHeight: '100svh', display: 'grid', placeItems: 'center', p: 2 }}>
      <Card sx={{ width: 'min(520px, 100%)', boxShadow: 6 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: -0.4 }}>
            Hospital Management System
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.75, mt: 0.5 }}>
            Admin Panel Login (mock JWT + RBAC)
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Box
            component="form"
            onSubmit={async (e) => {
              e.preventDefault()
              const res = await dispatch(login({ email, password, role }))
              if (login.fulfilled.match(res)) navigate(from, { replace: true })
            }}
            sx={{ display: 'grid', gap: 1.5 }}
          >
            <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            <TextField
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
            />
            <TextField select label="Login as" value={role} onChange={(e) => setRole(e.target.value as Role)}>
              {ROLES.map((r) => (
                <MenuItem key={r.value} value={r.value}>
                  {r.label}
                </MenuItem>
              ))}
            </TextField>
            <Button type="submit" variant="contained" size="large" disabled={status === 'loading'}>
              {status === 'loading' ? 'Signing in…' : 'Sign in'}
            </Button>
          </Box>

          <Typography variant="caption" sx={{ display: 'block', mt: 2, opacity: 0.7 }}>
            This is a simulated enterprise login. RBAC will hide modules and block routes based on role.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

