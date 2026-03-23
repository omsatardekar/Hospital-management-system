import { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Grid,
  Avatar,
  Chip,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
} from '@mui/material'
import {
  Person as PersonIcon,
  MedicalServices as MedicalIcon,
  Assignment as ReportIcon,
  History as TimelineIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  LocalHospital as HospitalIcon,
  Medication as MedicationIcon,
  FileUpload as UploadIcon,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'
import { PageHeader } from '../shared/PageHeader'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { updatePatient, type Patient } from '../../features/patients/patientsSlice'
import toast from 'react-hot-toast'

export default function PatientProfilePage() {
  const { patientId } = useParams()
  const dispatch = useAppDispatch()
  const patient = useAppSelector((state) =>
    state.patients.items.find((p) => p.id === patientId)
  )
  
  const [activeTab, setActiveTab] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [editedPatient, setEditedPatient] = useState<Patient | null>(patient || null)

  if (!patient) {
    return (
      <Box>
        <PageHeader title="Patient Profile" subtitle="Patient not found" />
        <Card>
          <CardContent>
            <Typography color="error">Patient with ID {patientId} not found.</Typography>
          </CardContent>
        </Card>
      </Box>
    )
  }

  const handleSave = () => {
    if (editedPatient) {
      dispatch(updatePatient({
        id: patient.id,
        changes: editedPatient
      }))
      toast.success('Patient profile updated successfully')
      setIsEditing(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'success'
      case 'DISCHARGED':
        return 'default'
      case 'IN_TREATMENT':
        return 'warning'
      default:
        return 'default'
    }
  }

  return (
    <Box>
      <PageHeader
        title="Patient Profile"
        subtitle={`Patient ID: ${patientId}`}
        right={
          <Button
            variant="contained"
            startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </Button>
        }
      />

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
        {/* Left Sidebar - Patient Info */}
        <Box sx={{ minWidth: { lg: 300 } }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Avatar sx={{ width: 100, height: 100, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}>
                  <PersonIcon sx={{ fontSize: 50 }} />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {patient.name}
                </Typography>
                <Chip
                  label={patient.status}
                  color={getStatusColor(patient.status) as any}
                  size="small"
                  sx={{ mt: 1 }}
                />
                <Box sx={{ mt: 3, textAlign: 'left' }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Age:</strong> {patient.age} years
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Gender:</strong> {patient.gender}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Blood Group:</strong> {patient.bloodGroup}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Phone:</strong> {patient.phone}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Email:</strong> {patient.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Department:</strong> {patient.department}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Last Visit:</strong> {new Date(patient.lastVisit).toLocaleDateString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Box>

        {/* Right Content Area */}
        <Box sx={{ flexGrow: 1 }}>
          <Card>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab icon={<MedicalIcon />} label="Overview" />
              <Tab icon={<TimelineIcon />} label="Medical History" />
              <Tab icon={<ReportIcon />} label="Reports" />
            </Tabs>

            <CardContent sx={{ p: 3 }}>
              {activeTab === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Patient Overview
                  </Typography>
                  
                  {isEditing ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <TextField
                        label="Full Name"
                        value={editedPatient?.name || ''}
                        onChange={(e) => setEditedPatient(prev => prev ? { ...prev, name: e.target.value } : null)}
                      />
                      <TextField
                        label="Age"
                        type="number"
                        value={editedPatient?.age || ''}
                        onChange={(e) => setEditedPatient(prev => prev ? { ...prev, age: parseInt(e.target.value) || 0 } : null)}
                      />
                      <TextField
                        label="Phone"
                        value={editedPatient?.phone || ''}
                        onChange={(e) => setEditedPatient(prev => prev ? { ...prev, phone: e.target.value } : null)}
                      />
                      <TextField
                        label="Email"
                        value={editedPatient?.email || ''}
                        onChange={(e) => setEditedPatient(prev => prev ? { ...prev, email: e.target.value } : null)}
                      />
                    </Box>
                  ) : (
                    <Box>
                      <Typography variant="body1" paragraph>
                        <strong>Current Status:</strong> {patient.status === 'IN_TREATMENT' ? 'Currently under treatment' : patient.status === 'ACTIVE' ? 'Active patient' : 'Discharged'}
                      </Typography>
                      <Typography variant="body1" paragraph>
                        <strong>Department:</strong> {patient.department}
                      </Typography>
                      <Typography variant="body1" paragraph>
                        <strong>Assigned Doctor ID:</strong> {patient.assignedDoctorId || 'Not assigned'}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Medical Timeline Entries:</strong> {patient.medicalTimeline.length}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Uploaded Reports:</strong> {patient.reports.length}
                      </Typography>
                    </Box>
                  )}
                </motion.div>
              )}

              {activeTab === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Medical History Timeline
                  </Typography>
                  
                  <List>
                    {patient.medicalTimeline.map((event, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <HospitalIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={event.title}
                          secondary={
                            <Box>
                              <Typography variant="body2">{event.note}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(event.at).toLocaleString()}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                    {patient.medicalTimeline.length === 0 && (
                      <Typography color="text.secondary">No medical history recorded yet.</Typography>
                    )}
                  </List>
                </motion.div>
              )}

              {activeTab === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Medical Reports
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<UploadIcon />}
                      onClick={() => toast.success('Report upload feature coming soon')}
                    >
                      Upload Report
                    </Button>
                  </Box>
                  
                  <List>
                    {patient.reports.map((report) => (
                      <ListItem key={report.id}>
                        <ListItemIcon>
                          <ReportIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={report.name}
                          secondary={
                            <Box>
                              <Typography variant="body2">Type: {report.type}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                Uploaded: {new Date(report.uploadedAt).toLocaleString()}
                              </Typography>
                            </Box>
                          }
                        />
                        <IconButton color="primary">
                          <ReportIcon />
                        </IconButton>
                      </ListItem>
                    ))}
                    {patient.reports.length === 0 && (
                      <Typography color="text.secondary">No reports uploaded yet.</Typography>
                    )}
                  </List>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  )
}

