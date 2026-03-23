import { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Avatar,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material'
import {
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as ThemeIcon,
  Save as SaveIcon,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { PageHeader } from '../shared/PageHeader'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { setThemeMode } from '../../features/ui/uiSlice'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const dispatch = useAppDispatch()
  const mode = useAppSelector((s) => s.ui.themeMode)
  const currentUser = useAppSelector((s) => s.auth.user)
  
  const [activeTab, setActiveTab] = useState(0)
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '',
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    appointmentReminders: true,
    systemUpdates: false,
    newPatientAlerts: true,
  })

  const handleProfileUpdate = () => {
    toast.success('Profile updated successfully')
  }

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    toast.success('Password changed successfully')
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  const handleThemeToggle = () => {
    dispatch(setThemeMode(mode === 'dark' ? 'light' : 'dark'))
    toast.success(`Theme changed to ${mode === 'dark' ? 'light' : 'dark'} mode`)
  }

  return (
    <Box>
      <PageHeader
        title="Settings"
        subtitle="Manage your profile, preferences, and system settings"
      />

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Sidebar Tabs */}
        <Box sx={{ minWidth: { md: 250 } }}>
          <Card>
            <CardContent sx={{ p: 0 }}>
              <Tabs
                orientation="vertical"
                value={activeTab}
                onChange={(_, newValue) => setActiveTab(newValue)}
                sx={{ borderRight: 1, borderColor: 'divider' }}
              >
                <Tab icon={<PersonIcon />} label="Profile" />
                <Tab icon={<NotificationsIcon />} label="Notifications" />
                <Tab icon={<SecurityIcon />} label="Security" />
                <Tab icon={<ThemeIcon />} label="Appearance" />
              </Tabs>
            </CardContent>
          </Card>
        </Box>

        {/* Content Area */}
        <Box sx={{ flexGrow: 1 }}>
          {activeTab === 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Profile Settings
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                    <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}>
                      <PersonIcon sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{profileData.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {currentUser?.role}
                      </Typography>
                    </Box>
                  </Box>

                  <TextField
                    fullWidth
                    label="Full Name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    sx={{ mb: 3 }}
                  />

                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleProfileUpdate}
                  >
                    Save Profile
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Notification Preferences
                  </Typography>

                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Email Alerts"
                        secondary="Receive important system alerts via email"
                      />
                      <Switch
                        checked={notifications.emailAlerts}
                        onChange={(e) => setNotifications({ ...notifications, emailAlerts: e.target.checked })}
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary="Appointment Reminders"
                        secondary="Get notified about upcoming appointments"
                      />
                      <Switch
                        checked={notifications.appointmentReminders}
                        onChange={(e) => setNotifications({ ...notifications, appointmentReminders: e.target.checked })}
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary="System Updates"
                        secondary="Receive notifications about system updates"
                      />
                      <Switch
                        checked={notifications.systemUpdates}
                        onChange={(e) => setNotifications({ ...notifications, systemUpdates: e.target.checked })}
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary="New Patient Alerts"
                        secondary="Get notified when new patients are registered"
                      />
                      <Switch
                        checked={notifications.newPatientAlerts}
                        onChange={(e) => setNotifications({ ...notifications, newPatientAlerts: e.target.checked })}
                      />
                    </ListItem>
                  </List>

                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={() => toast.success('Notification preferences saved')}
                    sx={{ mt: 2 }}
                  >
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Change Password
                  </Typography>

                  <TextField
                    fullWidth
                    label="Current Password"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="New Password"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    sx={{ mb: 3 }}
                  />

                  <Button
                    variant="contained"
                    onClick={handlePasswordChange}
                  >
                    Change Password
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Appearance Settings
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      Theme Mode
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Current theme: <strong>{mode}</strong>
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={handleThemeToggle}
                    >
                      Toggle {mode === 'dark' ? 'Light' : 'Dark'} Mode
                    </Button>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    Preview
                  </Typography>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body1">
                        This is how your interface looks in {mode} mode.
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        The theme affects all pages and components across the system.
                      </Typography>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </Box>
      </Box>
    </Box>
  )
}

