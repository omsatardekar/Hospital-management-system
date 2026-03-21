import { useState } from 'react'
import { Box, Button, Card, CardContent, Typography, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, ListItemIcon } from '@mui/material'
import { Add as AddIcon, Assignment as TestIcon, PictureAsPdf as PdfIcon, Image as ImageIcon, InsertDriveFile as FileIcon, CloudUpload as UploadIcon } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { PageHeader } from '../shared/PageHeader'
import { LabTestsTable } from '../components/LabTestsTable'
import { SimpleLabForm } from '../components/forms/SimpleLabForm'
import { addLabTest, updateLabTest, deleteLabTest, addReportFile } from '../../features/lab/labSlice'
import toast from 'react-hot-toast'

export default function LaboratoryPage() {
  const dispatch = useAppDispatch()
  const tests = useAppSelector((state) => state.lab.tests)
  
  const [showForm, setShowForm] = useState(false)
  const [editingTest, setEditingTest] = useState<any | null>(null)
  const [viewingTest, setViewingTest] = useState<any | null>(null)

  const handleAddTest = () => {
    setEditingTest(null)
    setShowForm(true)
  }

  const handleEditTest = (test: any) => {
    setEditingTest(test)
    setShowForm(true)
  }

  const handleDeleteTest = (testId: string) => {
    if (confirm('Are you sure you want to delete this lab test?')) {
      dispatch(deleteLabTest(testId))
      toast.success('Lab test deleted successfully')
    }
  }

  const handleUploadReport = (testId: string) => {
    const fileName = prompt('Enter report file name:', 'lab_report.pdf')
    if (fileName) {
      const fileExtension = fileName.split('.').pop()?.toLowerCase() || 'pdf'
      let fileType = 'application/pdf'
      if (['jpg', 'jpeg', 'png'].includes(fileExtension)) {
        fileType = 'image/' + fileExtension
      }
      
      dispatch(addReportFile({
        testId,
        file: {
          id: `FILE-${Date.now()}`,
          name: fileName,
          type: fileType,
          uploadedAt: new Date().toISOString()
        }
      }))
      toast.success('Report uploaded successfully')
    }
  }

  const handleViewResults = (test: any) => {
    setViewingTest(test)
  }

  const handleFormSubmit = (testData: any) => {
    if (editingTest) {
      dispatch(updateLabTest({ 
        id: editingTest.id, 
        changes: testData 
      }))
      toast.success('Lab test updated successfully')
    } else {
      const newTest = {
        ...testData,
        id: `LAB-${Date.now()}`,
        requestedAt: new Date().toISOString(),
        reportFiles: [],
      }
      dispatch(addLabTest(newTest))
      toast.success('Lab test added successfully')
    }
    setShowForm(false)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingTest(null)
  }

  const totalTests = tests.length
  const requestedCount = tests.filter(t => t.status === 'REQUESTED').length
  const processingCount = tests.filter(t => t.status === 'PROCESSING').length
  const reportedCount = tests.filter(t => t.status === 'REPORTED').length

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <PdfIcon color="error" />
    if (fileType.includes('image')) return <ImageIcon color="primary" />
    return <FileIcon color="action" />
  }

  return (
    <Box>
      <PageHeader
        title="Laboratory Management"
        subtitle="Manage lab tests, upload reports, and track test status"
        right={
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddTest}
              sx={{ borderRadius: 2 }}
            >
              Add Lab Test
            </Button>
          </motion.div>
        }
      />
      
      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card sx={{ minWidth: 200 }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <TestIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
                {totalTests}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Tests
              </Typography>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card sx={{ minWidth: 200 }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Box sx={{ fontSize: 40, color: 'info.main', mb: 1 }}>📋</Box>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'info.main' }}>
                {requestedCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Requested
              </Typography>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card sx={{ minWidth: 200 }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Box sx={{ fontSize: 40, color: 'warning.main', mb: 1 }}>🔬</Box>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'warning.main' }}>
                {processingCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Processing
              </Typography>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card sx={{ minWidth: 200 }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Box sx={{ fontSize: 40, color: 'success.main', mb: 1 }}>✓</Box>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'success.main' }}>
                {reportedCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Reported
              </Typography>
            </CardContent>
          </Card>
        </motion.div>
      </Box>

      <LabTestsTable
        tests={tests}
        onEdit={handleEditTest}
        onDelete={handleDeleteTest}
        onUploadReport={handleUploadReport}
        onViewResults={handleViewResults}
      />

      <SimpleLabForm
        open={showForm}
        labTest={editingTest}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
      />

      {viewingTest && (
        <Dialog open={!!viewingTest} onClose={() => setViewingTest(null)} maxWidth="md" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TestIcon />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Test Results - {viewingTest.testName}
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Uploaded Reports ({viewingTest.reportFiles.length})
              </Typography>
              
              {viewingTest.reportFiles.length === 0 ? (
                <Typography color="text.secondary">
                  No reports uploaded yet
                </Typography>
              ) : (
                <List>
                  {viewingTest.reportFiles.map((file: any) => (
                    <ListItem key={file.id}>
                      <ListItemIcon>
                        {getFileIcon(file.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={file.name}
                        secondary={`Uploaded: ${new Date(file.uploadedAt).toLocaleString()}`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}

              {viewingTest.status !== 'REPORTED' && (
                <Button
                  variant="outlined"
                  startIcon={<UploadIcon />}
                  onClick={() => {
                    handleUploadReport(viewingTest.id)
                    setViewingTest(null)
                  }}
                  sx={{ mt: 2 }}
                >
                  Upload New Report
                </Button>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setViewingTest(null)} color="secondary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  )
}

