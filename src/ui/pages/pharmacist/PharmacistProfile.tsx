import { useState } from 'react'
import {
  Box, Card, Typography, Avatar, Button, TextField,
  Chip, Divider, Stack, useTheme, alpha,
  Grid, IconButton, Dialog, DialogContent, DialogActions,
  Tooltip, Paper
} from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Edit, Email, Close, PictureAsPdf,
  CheckCircle, History, Star, PhotoCamera,
  VerifiedUser, Science, LocationOn,
  Badge, Lock, Shield, Inventory
} from '@mui/icons-material'
import toast from 'react-hot-toast'

// ----------------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------------

const INITIAL_PROFILE = {
  pharmacyName: 'Citycare Central Dispensary',
  ownerName: 'Dr. Michael Roberts',
  title: 'Chief Pharmacist (Pharm.D)',
  licenseNumber: 'PHARM-NY-20491-XYZ',
  email: 'm.roberts@citycare.com',
  phone: '+1 (555) 987-6543',
  location: '120 Health Ave, Ground Floor, New York',
  about: 'A verified, state-of-the-art clinical dispensary registered under the National Health Board. We specialize in compounding, prescription management, and strict inventory control for hospital-grade pharmaceuticals, ensuring 100% compliance with FDA drug dispensing guidelines.',
  stats: {
    dispensed: '142,500',
    accuracy: '99.9%',
    inventory: '8,420',
    experience: '12 Years'
  },
  operatingHours: [
    { day: 'Monday - Friday', time: '08:00 AM - 10:00 PM' },
    { day: 'Saturday', time: '09:00 AM - 08:00 PM' },
    { day: 'Sunday & Holidays', time: 'Emergency Only (24/7)' }
  ],
  certificates: [
    { id: 1, name: 'State Pharmacy License 2026', type: 'License', date: 'Oct 2026' },
    { id: 2, name: 'FDA Compliance Audit', type: 'Audit', date: 'Jan 2025' }
  ]
}

// ----------------------------------------------------------------------
// Components
// ----------------------------------------------------------------------

export default function PharmacistProfile() {
  const [tab, setTab] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState(INITIAL_PROFILE)
  const [editForm, setEditForm] = useState(profile)

  const handleSave = () => {
    setProfile(editForm)
    setIsEditing(false)
    toast.success('Professional profile updated successfully!')
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4, lg: 5 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>

      {/* 1. HERO HEADER SECTION */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Card
          sx={{
            borderRadius: 6,
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0,0,0,0.08)',
            border: 'none',
            mb: 4,
            position: 'relative'
          }}
        >
          {/* Cover/Gradient */}
          <Box sx={{ height: 70, background: `linear-gradient(135deg, #0f172a 0%, #1e293b 100%)`, position: 'relative' }}>
            <Box sx={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
          </Box>

          <Box sx={{ p: 4, mt: -4, position: 'relative', zIndex: 1 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="flex-end">
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  sx={{
                    width: 160, height: 160,
                    border: '6px solid white',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    bgcolor: '#0ea5e9', fontSize: 64, fontWeight: 900
                  }}
                >
                  MR
                </Avatar>
                <IconButton sx={{ position: 'absolute', bottom: 10, right: 10, bgcolor: 'white', color: '#64748b', border: '1px solid #e2e8f0', '&:hover': { bgcolor: '#f8fafc' } }}>
                  <PhotoCamera fontSize="small" />
                </IconButton>
              </Box>

              <Box sx={{ flex: 1, pb: 1, textAlign: { xs: 'center', md: 'left' } }}>
                <Stack direction="row" spacing={1.5} alignItems="center" justifyContent={{ xs: 'center', md: 'flex-start' }} mb={0.5}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', letterSpacing: '-0.02em' }}>{profile.ownerName}</Typography>
                  <Tooltip title="Verified Chief Pharmacist">
                    <VerifiedUser sx={{ color: '#0ea5e9', fontSize: 24 }} />
                  </Tooltip>
                </Stack>
                <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 600, mb: 2 }}>{profile.title} • {profile.pharmacyName}</Typography>

                <Stack direction="row" spacing={3} flexWrap="wrap" justifyContent={{ xs: 'center', md: 'flex-start' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn sx={{ color: '#94a3b8', fontSize: 18 }} />
                    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>{profile.location}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Email sx={{ color: '#94a3b8', fontSize: 18 }} />
                    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>{profile.email}</Typography>
                  </Box>
                </Stack>
              </Box>

              <Box sx={{ pb: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={() => setIsEditing(true)}
                  sx={{ borderRadius: 2.5, px: 4, py: 1.5, fontWeight: 700, bgcolor: '#0ea5e9', textTransform: 'none', boxShadow: '0 10px 20px rgba(14, 165, 233, 0.2)' }}
                >
                  Edit Professional Profile
                </Button>
              </Box>
            </Stack>
          </Box>
        </Card>
      </motion.div>

      {/* 2. STATS SECTION */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Medicines Dispensed', value: profile.stats.dispensed, icon: <Science />, color: '#0ea5e9' },
          { label: 'Fulfillment Accuracy', value: profile.stats.accuracy, icon: <CheckCircle />, color: '#10b981' },
          { label: 'Inventory Managed', value: profile.stats.inventory, icon: <Inventory />, color: '#6366f1' },
          { label: 'Total Experience', value: profile.stats.experience, icon: <Star />, color: '#f59e0b' },
        ].map((stat, i) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={i}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
              <Card sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: alpha(stat.color, 0.1), color: stat.color, borderRadius: 2 }}>{stat.icon}</Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight={800} color="#1e293b">{stat.value}</Typography>
                    <Typography variant="caption" fontWeight={700} color="#94a3b8" sx={{ letterSpacing: 0.5 }}>{stat.label.toUpperCase()}</Typography>
                  </Box>
                </Stack>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* 3. TABS SECTION */}
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, lg: 3 }}>
          <Stack spacing={2}>
            {[
              { id: 0, label: 'Professional Bio', icon: <Badge /> },
              { id: 1, label: 'Compliance & Legal', icon: <Shield /> },
              { id: 2, label: 'Operating Matrix', icon: <History /> },
              { id: 3, label: 'Account Security', icon: <Lock /> },
            ].map((item) => (
              <Button
                key={item.id}
                startIcon={item.icon}
                onClick={() => setTab(item.id)}
                sx={{
                  p: 2,
                  justifyContent: 'flex-start',
                  borderRadius: 3,
                  fontWeight: 700,
                  textTransform: 'none',
                  bgcolor: tab === item.id ? alpha('#0ea5e9', 0.1) : 'transparent',
                  color: tab === item.id ? '#0ea5e9' : '#64748b',
                  '&:hover': { bgcolor: alpha('#0ea5e9', 0.05) }
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, lg: 9 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {tab === 0 && <BioCard profile={profile} />}
              {tab === 1 && <ComplianceCard profile={profile} />}
              {tab === 2 && <OperatingCard profile={profile} />}
              {tab === 3 && <SecurityCard />}
            </motion.div>
          </AnimatePresence>
        </Grid>
      </Grid>

      {/* EDIT MODAL */}
      <Dialog open={isEditing} onClose={() => setIsEditing(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        <Box sx={{ p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
          <Typography variant="h5" fontWeight={800}>Update Profile Information</Typography>
          <IconButton onClick={() => setIsEditing(false)}><Close /></IconButton>
        </Box>
        <DialogContent sx={{ p: 4 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="Full Name & Credentials" name="ownerName" value={editForm.ownerName} onChange={(e) => setEditForm({ ...editForm, ownerName: e.target.value })} sx={{ mb: 3 }} />
              <TextField fullWidth label="Designation" name="title" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} sx={{ mb: 3 }} />
              <TextField fullWidth label="Official Pharmacy Name" name="pharmacyName" value={editForm.pharmacyName} onChange={(e) => setEditForm({ ...editForm, pharmacyName: e.target.value })} sx={{ mb: 3 }} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="Email Address" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} sx={{ mb: 3 }} />
              <TextField fullWidth label="Phone Number" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} sx={{ mb: 3 }} />
              <TextField fullWidth label="Dispensary Location" value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} sx={{ mb: 3 }} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth multiline rows={4} label="Professional Biography" value={editForm.about} onChange={(e) => setEditForm({ ...editForm, about: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 4, pt: 0 }}>
          <Button onClick={() => setIsEditing(false)} sx={{ fontWeight: 700, color: '#64748b' }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} sx={{ borderRadius: 2, px: 4, py: 1.2, fontWeight: 700, bgcolor: '#0ea5e9' }}>Save Clinical Profile</Button>
        </DialogActions>
      </Dialog>

    </Box>
  )
}

// ----------------------------------------------------------------------
// Internal UI Cards
// ----------------------------------------------------------------------

function BioCard({ profile }: { profile: any }) {
  return (
    <Card sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
      <Typography variant="h6" fontWeight={800} color="#1e293b" mb={3}>Professional Biography</Typography>
      <Typography variant="body1" sx={{ color: '#475569', lineHeight: 2, fontSize: '1.05rem', mb: 4 }}>
        {profile.about}
      </Typography>

      <Typography variant="subtitle1" fontWeight={800} color="#1e293b" mb={2}>Expertise & Specialties</Typography>
      <Stack direction="row" spacing={1.5} flexWrap="wrap">
        {['Prescription Compounding', 'Clinical Pharmacology', 'Drug Interaction Analysis', 'Controlled Substances', 'Patient Counseling'].map((tag) => (
          <Chip key={tag} label={tag} sx={{ fontWeight: 700, bgcolor: '#f1f5f9', color: '#64748b', mb: 1.5 }} />
        ))}
      </Stack>
    </Card>
  )
}

function ComplianceCard({ profile }: { profile: any }) {
  return (
    <Card sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
      <Typography variant="h6" fontWeight={800} color="#1e293b" mb={1}>Legal & Compliance Records</Typography>
      <Typography variant="body2" color="#64748b" mb={4}>Official state-verified credentials for medicinal dispensation.</Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, bgcolor: '#f8fafc' }}>
            <Typography variant="caption" fontWeight={800} color="#94a3b8" display="block" mb={1}>PHARMACY LICENSE NO.</Typography>
            <Typography variant="h5" fontWeight={800} color="#0ea5e9" sx={{ fontFamily: 'monospace' }}>{profile.licenseNumber}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" fontWeight={800} color="#1e293b" mb={2}>Verified Certifications</Typography>
          <Stack spacing={2}>
            {profile.certificates.map((cert: any) => (
              <Box key={cert.id} sx={{ p: 2, borderRadius: 2, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 2 }}>
                <PictureAsPdf sx={{ color: '#ef4444' }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" fontWeight={700}>{cert.name}</Typography>
                  <Typography variant="caption" color="#94a3b8">{cert.type} • Valid until {cert.date}</Typography>
                </Box>
                <Tooltip title="Verified System">
                  <CheckCircle sx={{ color: '#10b981', fontSize: 18 }} />
                </Tooltip>
              </Box>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Card>
  )
}

function OperatingCard({ profile }: { profile: any }) {
  const theme = useTheme()
  return (
    <Card sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
      <Typography variant="h6" fontWeight={800} color="#1e293b" mb={1}>Authorized Operating Matrix</Typography>
      <Typography variant="body2" color="#64748b" mb={4}>Legally mandated dispensing hours under Clinical Council board.</Typography>

      <Stack spacing={2}>
        {profile.operatingHours.map((op: any, i: number) => (
          <Box key={i} sx={{ p: 2.5, borderRadius: 3, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" fontWeight={700} color="#475569">{op.day}</Typography>
            <Typography variant="body2" fontWeight={800} color="#0ea5e9">{op.time}</Typography>
          </Box>
        ))}
      </Stack>
    </Card>
  )
}

function SecurityCard() {
  return (
    <Card sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
      <Typography variant="h6" fontWeight={800} color="#1e293b" mb={1}>Account & System Security</Typography>
      <Typography variant="body2" color="#64748b" mb={4}>Manage credentials and two-factor authentication.</Typography>

      <Stack spacing={2}>
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="subtitle2" fontWeight={800}>Multi-Factor Authentication</Typography>
            <Typography variant="caption" color="#10b981">Securely active via system mobile</Typography>
          </Box>
          <Button size="small" variant="outlined" sx={{ fontWeight: 700, borderRadius: 2 }}>Configuration</Button>
        </Paper>
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="subtitle2" fontWeight={800}>System Access Password</Typography>
            <Typography variant="caption" color="#94a3b8">Last changed: 24 days ago</Typography>
          </Box>
          <Button size="small" variant="outlined" sx={{ fontWeight: 700, borderRadius: 2 }}>Rotate Secrets</Button>
        </Paper>
      </Stack>
    </Card>
  )
}
