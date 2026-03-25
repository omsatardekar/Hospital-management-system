import { useState, useMemo } from 'react'
import {
  Box, Card, Typography, Avatar, Chip, Stack, alpha, useTheme,
  Grid, Divider, IconButton, Paper, Button, InputBase,
  Tabs, Tab, Dialog, DialogContent, DialogActions,
  Menu, MenuItem, Tooltip, CircularProgress
} from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, FilterList, ReceiptLong, CheckCircle, Warning,
  Close, Person, Medication, CalendarToday,
  ArrowForwardIos, Download
} from '@mui/icons-material'
import toast from 'react-hot-toast'
import { jsPDF } from 'jspdf'

// Mock Data
export type Medicine = { name: string; dosage: string; days: string; qty: number; price: number }
export type Order = { id: string; patient: string; doctor: string; age: number; status: 'Pending' | 'Completed'; time: string; date: string; medicines: Medicine[]; totalBill: number }

const initialOrders: Order[] = [
  { 
    id: 'ORD-8821', patient: 'Sarah Jennings', doctor: 'Dr. John Williams', age: 34,
    status: 'Pending', time: '10:42 AM', date: '24 Mar 2026',
    medicines: [
      { name: 'Amoxicillin 500mg', dosage: '1 tablet 3x daily', days: '5 Days', qty: 15, price: 250 },
      { name: 'Ibuprofen 400mg', dosage: '1 tablet PRN', days: '3 Days', qty: 10, price: 150 },
      { name: 'Pantoprazole 40mg', dosage: '1 tablet before food', days: '5 Days', qty: 5, price: 300 }
    ],
    totalBill: 700
  },
  { 
    id: 'ORD-8822', patient: 'Marcus Chen', doctor: 'Dr. Emily Carter', age: 45,
    status: 'Pending', time: '11:15 AM', date: '24 Mar 2026',
    medicines: [
      { name: 'Metformin 500mg', dosage: '1 tablet twice daily', days: '30 Days', qty: 60, price: 850 },
      { name: 'Atorvastatin 20mg', dosage: '1 tablet at night', days: '30 Days', qty: 30, price: 1200 }
    ],
    totalBill: 2050
  },
  { 
    id: 'ORD-8823', patient: 'Emma Watson', doctor: 'Dr. John Williams', age: 29,
    status: 'Completed', time: '09:30 AM', date: '24 Mar 2026',
    medicines: [
      { name: 'Cetirizine 10mg', dosage: '1 tablet at night', days: '10 Days', qty: 10, price: 120 }
    ],
    totalBill: 120
  }
]

export default function PharmacistOrders() {
  const theme = useTheme()
  const [tab, setTab] = useState(0)
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [search, setSearch] = useState('')
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null)
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // ----------------------------------------------------------------------
  // Derived State
  // ----------------------------------------------------------------------
  const filteredOrders = useMemo(() => {
    let result = orders.filter(o => {
      const matchesTab = tab === 0 ? o.status === 'Pending' : o.status === 'Completed'
      const matchesSearch = o.patient.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase())
      return matchesTab && matchesSearch
    })

    result.sort((a, b) => {
      if (sortOrder === 'newest') return b.id.localeCompare(a.id)
      return a.id.localeCompare(b.id)
    })
    return result
  }, [orders, tab, search, sortOrder])

  // ----------------------------------------------------------------------
  // Handlers
  // ----------------------------------------------------------------------
  const handleFulfill = async (order: Order) => {
    setIsProcessing(true)
    
    // Simulate API delay for better UX flow
    await new Promise(res => setTimeout(res, 800))
    
    setOrders(orders.map(o => o.id === order.id ? { ...o, status: 'Completed' } : o))
    setIsProcessing(false)
    setSelectedOrder(null)
    setShowSuccessModal(true)
    toast.success(`Order ${order.id} processed successfully.`)
  }

  const generatePDF = (order: Order) => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    
    // Header
    doc.setFillColor(8, 145, 178) // Primary color
    doc.rect(0, 0, pageWidth, 40, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text('City General Hospital', 14, 25)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Pharmacy Department | Official Receipt', 14, 32)
    
    // Order info
    doc.setTextColor(50, 50, 50)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Bill To:', 14, 55)
    doc.setFont('helvetica', 'normal')
    doc.text(`Patient Name: ${order.patient}`, 14, 62)
    doc.text(`Age: ${order.age} Yrs`, 14, 68)
    doc.text(`Doctor: ${order.doctor}`, 14, 74)

    doc.setFont('helvetica', 'bold')
    doc.text('Order Details:', pageWidth - 70, 55)
    doc.setFont('helvetica', 'normal')
    doc.text(`Invoice No: ${order.id}`, pageWidth - 70, 62)
    doc.text(`Date & Time: ${order.date} ${order.time}`, pageWidth - 70, 68)
    doc.text(`Status: Completed`, pageWidth - 70, 74)

    // Divider
    doc.setDrawColor(220, 220, 220)
    doc.line(14, 85, pageWidth - 14, 85)

    // Table Header
    doc.setFont('helvetica', 'bold')
    doc.text('Item Description', 14, 95)
    doc.text('Dosage & Duration', 80, 95)
    doc.text('Qty', 145, 95)
    doc.text('Amount', 175, 95)
    
    doc.line(14, 100, pageWidth - 14, 100)

    // Table Content
    doc.setFont('helvetica', 'normal')
    let yPos = 110
    order.medicines.forEach((med) => {
      doc.text(med.name, 14, yPos)
      doc.text(`${med.dosage} (${med.days})`, 80, yPos)
      doc.text(med.qty.toString(), 145, yPos)
      doc.text(`₹${med.price.toFixed(2)}`, 175, yPos)
      yPos += 10
    })

    // Divider
    doc.line(14, yPos + 5, pageWidth - 14, yPos + 5)

    // Total
    yPos += 15
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Total Amount Due:', 135, yPos)
    doc.setTextColor(8, 145, 178)
    doc.text(`₹${order.totalBill.toFixed(2)}`, 175, yPos)

    // Footer
    doc.setTextColor(150, 150, 150)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'italic')
    doc.text('Thank you for trusting City General Hospital.', pageWidth / 2, 270, { align: 'center' })
    doc.text('This is a computer-generated document and requires no physical signature.', pageWidth / 2, 275, { align: 'center' })

    // Save
    doc.save(`Pharmacy_Receipt_${order.id}.pdf`)
  }

  // ----------------------------------------------------------------------
  // Render Helpers
  // ----------------------------------------------------------------------
  const getStatusColor = (status: string) => status === 'Completed' ? 'success' : 'warning'

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4, lg: 5 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* HEADER SECTION */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', letterSpacing: '-0.02em', mb: 0.5 }}>Prescription Orders</Typography>
            <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>Manage, process, and discharge patient prescriptions seamlessly.</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', md: 'auto' } }}>
             <Paper sx={{ display: 'flex', alignItems: 'center', px: 2, maxWidth: 320, borderRadius: 2, border: `1px solid ${alpha(theme.palette.divider, 0.1)}`, boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
               <Search sx={{ color: '#94a3b8' }} />
               <InputBase sx={{ ml: 1, flex: 1, py: 1, color: '#1e293b' }} placeholder="Search patient or ID..." value={search} onChange={e => setSearch(e.target.value)} />
             </Paper>
             <Tooltip title="Filter & Sort">
               <IconButton 
                 onClick={(e) => setFilterMenuAnchor(e.currentTarget)} 
                 sx={{ bgcolor: 'white', border: `1px solid ${alpha(theme.palette.divider, 0.1)}`, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}
               >
                 <FilterList sx={{ color: '#475569' }} />
               </IconButton>
             </Tooltip>
             <Menu anchorEl={filterMenuAnchor} open={Boolean(filterMenuAnchor)} onClose={() => setFilterMenuAnchor(null)}>
               <MenuItem onClick={() => { setSortOrder('newest'); setFilterMenuAnchor(null) }}>Sort by Newest</MenuItem>
               <MenuItem onClick={() => { setSortOrder('oldest'); setFilterMenuAnchor(null) }}>Sort by Oldest</MenuItem>
             </Menu>
          </Box>
        </Box>
      </motion.div>

      {/* DASHBOARD TABS */}
      <Box sx={{ mb: 4 }}>
        <Tabs 
          value={tab} 
          onChange={(_, v) => setTab(v)} 
          sx={{ 
            minHeight: 44,
            '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0', backgroundColor: '#0ea5e9' },
            '& .MuiTab-root': { fontWeight: 600, fontSize: '1rem', textTransform: 'none', minWidth: 140, color: '#64748b', mb: 0.5 },
            '& .Mui-selected': { color: '#0ea5e9 !important' }
          }}
        >
          <Tab icon={<Warning sx={{ fontSize: 18 }} />} iconPosition="start" label="Pending verification" />
          <Tab icon={<CheckCircle sx={{ fontSize: 18 }} />} iconPosition="start" label="Fulfilled orders" />
        </Tabs>
        <Divider sx={{ mt: -0.2 }} />
      </Box>

      {/* ORDERS GRID */}
      <Grid container spacing={3}>
        <AnimatePresence>
          {filteredOrders.length === 0 ? (
            <Grid size={{ xs: 12 }}>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Box sx={{ textAlign: 'center', py: 12, bgcolor: 'white', borderRadius: 4, border: '1px dashed #cbd5e1' }}>
                  <ReceiptLong sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
                  <Typography variant="h6" fontWeight={600} color="#64748b">No {tab === 0 ? 'pending' : 'completed'} orders found.</Typography>
                  <Typography variant="body2" color="#94a3b8" mt={0.5}>Adjust your search or check back later.</Typography>
                </Box>
              </motion.div>
            </Grid>
          ) : (
            filteredOrders.map((order, idx) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={order.id}>
                <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3, delay: idx * 0.05 }} style={{ height: '100%' }}>
                  <Card sx={{ 
                    borderRadius: 3, 
                    border: `1px solid #e2e8f0`,
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)',
                    height: '100%',
                    display: 'flex', flexDirection: 'column',
                    transition: 'all 0.2s ease-in-out',
                    cursor: 'pointer',
                    '&:hover': { boxShadow: '0 10px 15px -3px rgba(0,0,0,0.06)', transform: 'translateY(-2px)' },
                  }}
                  onClick={() => setSelectedOrder(order)}
                  >
                    {/* Header */}
                    <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f1f5f9' }}>
                       <Stack direction="row" spacing={1.5} alignItems="center">
                         <Avatar sx={{ width: 42, height: 42, bgcolor: alpha(theme.palette.primary.main, 0.08), color: 'primary.main', fontWeight: 700, fontSize: '1.1rem' }}>{order.patient.charAt(0)}</Avatar>
                         <Box>
                           <Typography variant="subtitle1" fontWeight={700} color="#1e293b" lineHeight={1.2}>{order.patient}</Typography>
                           <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>ID: {order.id}</Typography>
                         </Box>
                       </Stack>
                       <Chip label={order.status} size="small" color={getStatusColor(order.status) as any} sx={{ fontWeight: 600, borderRadius: 1.5, height: 24, fontSize: '0.75rem' }} />
                    </Box>

                    {/* Content */}
                    <Box sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                         <Person fontSize="small" sx={{ color: '#94a3b8' }} />
                         <Typography variant="body2" color="#475569" fontWeight={500}>{order.doctor}</Typography>
                       </Box>
                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                         <CalendarToday fontSize="small" sx={{ color: '#94a3b8', fontSize: 18 }} />
                         <Typography variant="body2" color="#475569" fontWeight={500}>{order.date} • {order.time}</Typography>
                       </Box>
                       
                       <Box sx={{ mt: 1, p: 1.5, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                          <Typography variant="caption" color="#64748b" fontWeight={600} mb={1} display="block">MEDICATIONS ({order.medicines.length})</Typography>
                          {order.medicines.slice(0, 2).map((med, i) => (
                              <Typography key={i} variant="body2" sx={{ color: '#334155', fontWeight: 500, display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>• {med.name}</span>
                                <span style={{ color: '#94a3b8', marginLeft: 8 }}>x{med.qty}</span>
                              </Typography>
                          ))}
                          {order.medicines.length > 2 && <Typography variant="caption" sx={{ color: '#0ea5e9', fontWeight: 600, mt: 0.5, display: 'block' }}>+ {order.medicines.length - 2} more items</Typography>}
                       </Box>
                    </Box>

                    {/* Footer Actions */}
                    <Box sx={{ p: 2.5, pt: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9' }}>
                       <Box>
                         <Typography variant="caption" color="#94a3b8" fontWeight={500}>Total bill</Typography>
                         <Typography variant="subtitle1" fontWeight={700} color="#1e293b">₹{order.totalBill.toLocaleString()}</Typography>
                       </Box>
                       <IconButton size="small" sx={{ color: '#0ea5e9', bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                         <ArrowForwardIos sx={{ fontSize: 14 }} />
                       </IconButton>
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))
          )}
        </AnimatePresence>
      </Grid>

      {/* DETAILED ORDER MODAL */}
      <Dialog 
        open={!!selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
        maxWidth="md" 
        fullWidth 
        PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}
      >
        {selectedOrder && (
          <>
            <Box sx={{ bgcolor: '#f8fafc', p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0' }}>
               <Box>
                 <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>Order details</Typography>
                 <Typography variant="body2" sx={{ color: '#64748b' }}>#{selectedOrder.id} • {selectedOrder.date}</Typography>
               </Box>
               <IconButton onClick={() => setSelectedOrder(null)} size="small" sx={{ color: '#64748b' }}><Close /></IconButton>
            </Box>
            
            <DialogContent sx={{ p: { xs: 2, sm: 3, md: 4 }, bgcolor: 'white' }}>
               <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 5 }}>
                     <Stack spacing={2}>
                       <Paper sx={{ p: 2.5, borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none', bgcolor: '#f8fafc' }}>
                         <Typography variant="caption" color="#64748b" fontWeight={700} mb={1.5} display="block" letterSpacing={0.5}>PATIENT INFO</Typography>
                         <Typography variant="subtitle1" fontWeight={700} color="#1e293b">{selectedOrder.patient}</Typography>
                         <Typography variant="body2" color="#475569" mt={0.5}>Age: {selectedOrder.age} years</Typography>
                       </Paper>
                       
                       <Paper sx={{ p: 2.5, borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none', bgcolor: '#f8fafc' }}>
                         <Typography variant="caption" color="#64748b" fontWeight={700} mb={1.5} display="block" letterSpacing={0.5}>PRESCRIPTION SOURCE</Typography>
                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                           <Avatar sx={{ width: 36, height: 36, bgcolor: 'white', color: '#0ea5e9', border: '1px solid #e2e8f0' }}><Person fontSize="small" /></Avatar>
                           <Box>
                             <Typography variant="body2" fontWeight={600} color="#1e293b">{selectedOrder.doctor}</Typography>
                             <Typography variant="caption" color="#64748b">Verified practitioner</Typography>
                           </Box>
                         </Box>
                       </Paper>

                       {selectedOrder.status === 'Pending' && (
                         <Box sx={{ p: 2.5, borderRadius: 2, bgcolor: '#fffbeb', border: '1px solid #fde68a' }}>
                           <Typography variant="body2" color="#b45309" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                             <Warning fontSize="small" /> Verification needed
                           </Typography>
                           <Typography variant="caption" color="#92400e" lineHeight={1.4} display="block">Please verify inventory and ensure correct dosages are dispensed before completing this order.</Typography>
                         </Box>
                       )}
                     </Stack>
                  </Grid>

                  <Grid size={{ xs: 12, md: 7 }}>
                     <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                         <Typography variant="subtitle2" fontWeight={700} color="#1e293b" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                           <Medication sx={{ color: '#0ea5e9', fontSize: 20 }} /> Prescribed items ({selectedOrder.medicines.length})
                         </Typography>
                         
                         <Box sx={{ flex: 1, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0', p: 2 }}>
                           {selectedOrder.medicines.map((med: any, i: number) => (
                               <Box key={i} sx={{ mb: 2, pb: 2, borderBottom: i !== selectedOrder.medicines.length - 1 ? '1px solid #e2e8f0' : 'none', '&:last-child': { mb: 0, pb: 0 } }}>
                                   <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                       <Box pr={2}>
                                           <Typography variant="body2" fontWeight={600} color="#1e293b">{med.name}</Typography>
                                           <Typography variant="caption" color="#64748b" display="block" mt={0.5}>{med.dosage}</Typography>
                                       </Box>
                                       <Typography variant="body2" fontWeight={700} color="#0ea5e9">₹{med.price}</Typography>
                                   </Box>
                                   <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                       <Chip label={`Qty: ${med.qty}`} size="small" sx={{ fontWeight: 500, bgcolor: 'white', color: '#475569', border: '1px solid #cbd5e1', height: 20, fontSize: '0.7rem' }} />
                                       <Chip label={med.days} size="small" sx={{ fontWeight: 500, bgcolor: 'white', color: '#475569', border: '1px solid #cbd5e1', height: 20, fontSize: '0.7rem' }} />
                                   </Stack>
                               </Box>
                           ))}
                         </Box>

                         <Box sx={{ mt: 3, p: 2.5, bgcolor: 'white', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '2px solid #f1f5f9' }}>
                            <Typography variant="body2" fontWeight={600} color="#64748b">Total payable amount</Typography>
                            <Typography variant="h5" fontWeight={800} color="#1e293b">₹{selectedOrder.totalBill.toLocaleString()}</Typography>
                         </Box>
                     </Box>
                  </Grid>
               </Grid>
            </DialogContent>
            
            <DialogActions sx={{ p: 2.5, px: 3, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
               <Button onClick={() => setSelectedOrder(null)} disabled={isProcessing} sx={{ color: '#64748b', fontWeight: 600, mr: 'auto', textTransform: 'none' }}>Cancel</Button>
               
               {selectedOrder.status === 'Pending' ? (
                 <Button 
                   variant="contained" 
                   onClick={() => handleFulfill(selectedOrder)} 
                   disabled={isProcessing}
                   startIcon={isProcessing ? <CircularProgress size={18} color="inherit" /> : <CheckCircle />} 
                   sx={{ 
                     px: 3, 
                     py: 1.2, 
                     borderRadius: 2, 
                     fontWeight: 600, 
                     bgcolor: '#0ea5e9', 
                     textTransform: 'none',
                     boxShadow: '0 4px 12px rgba(14, 165, 233, 0.25)',
                     '&:hover': { bgcolor: '#0284c7' }
                   }}
                 >
                    {isProcessing ? 'Processing' : 'Process and Bill'}
                 </Button>
               ) : (
                 <Button 
                   variant="outlined" 
                   onClick={() => generatePDF(selectedOrder)} 
                   startIcon={<Download />} 
                   sx={{ 
                     px: 3, 
                     py: 1.2, 
                     borderRadius: 2, 
                     fontWeight: 600, 
                     textTransform: 'none',
                     color: '#0ea5e9',
                     borderColor: '#0ea5e9'
                   }}
                 >
                    Download PDF Receipt
                 </Button>
               )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* SUCCESS & PRINT MODAL */}
      <Dialog 
        open={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)}
        maxWidth="xs" 
        fullWidth 
        PaperProps={{ sx: { borderRadius: 4, p: 2 } }}
      >
          <Box sx={{ textAlign: 'center', py: 3, px: 2 }}>
            <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: '#dcfce7', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
               <CheckCircle sx={{ fontSize: 36 }} />
            </Box>
            <Typography variant="h6" fontWeight={700} color="#1e293b" mb={1}>Order Processed!</Typography>
            <Typography variant="body2" color="#64748b" mb={4} lineHeight={1.5}>
               The prescription has been successfully fulfilled. The final receipt is ready to be provided to the patient.
            </Typography>
            <Stack spacing={2} sx={{ mb: 1 }}>
                <Button 
                   variant="contained" 
                   onClick={() => {
                     const recentOrder = orders.find(o => o.status === 'Completed');
                     if(recentOrder) generatePDF(recentOrder);
                     setShowSuccessModal(false);
                   }} 
                   startIcon={<Download />} 
                   sx={{ 
                     fontWeight: 600, 
                     py: 1.2, 
                     borderRadius: 2, 
                     bgcolor: '#0ea5e9', 
                     textTransform: 'none',
                     boxShadow: '0 4px 12px rgba(14, 165, 233, 0.25)' 
                   }}
                >
                   Download Receipt
                </Button>
                <Button 
                   onClick={() => setShowSuccessModal(false)} 
                   sx={{ fontWeight: 600, color: '#64748b', textTransform: 'none' }}
                >
                   Close
                </Button>
            </Stack>
          </Box>
      </Dialog>

    </Box>
  )
}
