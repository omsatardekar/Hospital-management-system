import { useState, useMemo } from 'react'
import {
  Box, Card, Typography, Avatar, Chip, Stack, alpha, useTheme,
  Grid, Divider, IconButton, Paper, Button, InputBase,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogContent, DialogActions, TextField,
  InputAdornment, Tooltip, Menu, MenuItem, LinearProgress,
  DialogTitle,
  Zoom,
  Fade
} from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, AddCircleOutline, Science, Edit, Delete, WarningAmber,
  CheckCircle, LocalPharmacy, CalendarToday, Inventory as InventoryIcon,
  TrendingDown, TrendingUp, FilterList, MoreVert, Close, InfoOutlined,
  RemoveRedEye, Storage, AttachMoney, BarChart
} from '@mui/icons-material'
import toast from 'react-hot-toast'

// Types
export type MedicineStatus = 'Healthy' | 'Low' | 'Critical' | 'Expired';

export interface MedicineItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  maxStock: number;
  price: number;
  expiry: string;
  batchNo: string;
  manufacturer: string;
  lastRestocked: string;
  description: string;
}

// Mock Inventory Data
const INITIAL_INVENTORY: MedicineItem[] = [
  { 
    id: 'MED-101', name: 'Amoxicillin 500mg', category: 'Antibiotic', stock: 15, maxStock: 200, price: 250, 
    expiry: '2026-10-24', batchNo: 'AX-9921', manufacturer: 'Cipra Pharma', 
    lastRestocked: '2025-12-15', description: 'Broad-spectrum antibiotic used for various bacterial infections.'
  },
  { 
    id: 'MED-102', name: 'Ibuprofen 400mg', category: 'Painkiller', stock: 450, maxStock: 500, price: 150, 
    expiry: '2027-12-10', batchNo: 'IB-4412', manufacturer: 'Global Meds', 
    lastRestocked: '2026-02-01', description: 'Nonsteroidal anti-inflammatory drug (NSAID) used for pain and fever.'
  },
  { 
    id: 'MED-103', name: 'Pantoprazole 40mg', category: 'Antacid', stock: 8, maxStock: 150, price: 400, 
    expiry: '2026-01-15', batchNo: 'PT-8810', manufacturer: 'Astra Zen', 
    lastRestocked: '2025-11-20', description: 'Proton pump inhibitor that decreases stomach acid production.'
  },
  { 
    id: 'MED-104', name: 'Metformin 500mg', category: 'Anti-diabetic', stock: 85, maxStock: 300, price: 120, 
    expiry: '2026-06-30', batchNo: 'MT-1122', manufacturer: 'Sun Health', 
    lastRestocked: '2026-01-10', description: 'First-line medication for the treatment of type 2 diabetes.'
  },
  { 
    id: 'MED-105', name: 'Atorvastatin 20mg', category: 'Cholesterol', stock: 120, maxStock: 250, price: 350, 
    expiry: '2027-03-24', batchNo: 'AT-5566', manufacturer: 'Zydus Group', 
    lastRestocked: '2025-10-30', description: 'Used to lower cholesterol and prevent cardiovascular disease.'
  },
  { 
    id: 'MED-106', name: 'Cetirizine 10mg', category: 'Antihistamine', stock: 3, maxStock: 100, price: 80, 
    expiry: '2025-12-05', batchNo: 'CT-3344', manufacturer: 'Lupin Ltd', 
    lastRestocked: '2025-09-12', description: 'Antihistamine used to treat allergy symptoms.'
  },
]

export default function PharmacistInventory() {
  const theme = useTheme()
  const [inventory, setInventory] = useState<MedicineItem[]>(INITIAL_INVENTORY)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  
  // Modals state
  const [addEditModal, setAddEditModal] = useState<{ open: boolean; data: MedicineItem | null }>({ open: false, data: null })
  const [detailModal, setDetailModal] = useState<{ open: boolean; data: MedicineItem | null }>({ open: false, data: null })
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Menu states
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null)
  const [itemMenuAnchor, setItemMenuAnchor] = useState<{ anchor: HTMLElement; id: string } | null>(null)

  // ----------------------------------------------------------------------
  // Derived Data
  // ----------------------------------------------------------------------
  const filteredData = useMemo(() => {
    return inventory.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.id.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
  }, [inventory, search, filterCategory])

  const categories = useMemo(() => ['All', ...Array.from(new Set(inventory.map(i => i.category)))], [inventory])

  const stats = useMemo(() => {
    const total = inventory.length;
    const low = inventory.filter(i => i.stock <= i.maxStock * 0.2 && i.stock > 0).length;
    const critical = inventory.filter(i => i.stock === 0 || i.stock <= 5).length;
    const expiring = inventory.filter(i => {
      const expiry = new Date(i.expiry);
      const now = new Date();
      const diff = expiry.getTime() - now.getTime();
      return diff < (1000 * 60 * 60 * 24 * 90); // 90 days
    }).length;

    return [
      { label: 'Total Inventory', value: total, icon: <Storage />, color: '#0ea5e9' },
      { label: 'Low Stock Items', value: low, icon: <TrendingDown />, color: '#f59e0b' },
      { label: 'Critical / Out', value: critical, icon: <WarningAmber />, color: '#ef4444' },
      { label: 'Near Expiry', value: expiring, icon: <CalendarToday />, color: '#6366f1' },
    ]
  }, [inventory])

  // ----------------------------------------------------------------------
  // Handlers
  // ----------------------------------------------------------------------
  const handleSaveItem = (itemData: Partial<MedicineItem>) => {
    if (addEditModal.data) {
      // Edit
      setInventory(prev => prev.map(i => i.id === addEditModal.data!.id ? { ...i, ...itemData } as MedicineItem : i));
      toast.success('Medicine updated successfully');
    } else {
      // Add
      const newItem: MedicineItem = {
        ...itemData as MedicineItem,
        id: `MED-${Math.floor(Math.random() * 900) + 100}`,
        lastRestocked: new Date().toISOString().split('T')[0]
      };
      setInventory(prev => [newItem, ...prev]);
      toast.success('New medicine registered');
    }
    setAddEditModal({ open: false, data: null });
  }

  const handleDeleteItem = () => {
    if (deleteId) {
      setInventory(prev => prev.filter(i => i.id !== deleteId));
      toast.success('Item removed from inventory');
      setDeleteId(null);
    }
  }

  const getStockStatus = (item: MedicineItem): { label: string; color: string; status: MedicineStatus } => {
    if (item.stock === 0) return { label: 'OUT OF STOCK', color: '#ef4444', status: 'Critical' };
    if (item.stock <= 10) return { label: 'CRITICAL', color: '#ef4444', status: 'Critical' };
    if (item.stock <= item.maxStock * 0.3) return { label: 'LOW STOCK', color: '#f59e0b', status: 'Low' };
    
    const expiry = new Date(item.expiry);
    const now = new Date();
    if (expiry < now) return { label: 'EXPIRED', color: '#94a3b8', status: 'Expired' };
    
    return { label: 'HEALTHY', color: '#10b981', status: 'Healthy' };
  }

  // ----------------------------------------------------------------------
  // Render
  // ----------------------------------------------------------------------
  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4, lg: 5 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', letterSpacing: '-0.02em', mb: 0.5 }}>Inventory Management</Typography>
            <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>Track pharmaceutical stock, manage suppliers, and monitor expiry dates.</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', md: 'auto' } }}>
             <Paper sx={{ display: 'flex', alignItems: 'center', px: 2, maxWidth: 320, borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
               <Search sx={{ color: '#94a3b8' }} />
               <InputBase sx={{ ml: 1, flex: 1, py: 1, color: '#1e293b' }} placeholder="Search medicine..." value={search} onChange={e => setSearch(e.target.value)} />
             </Paper>
             <Button 
               variant="contained" 
               startIcon={<AddCircleOutline />} 
               onClick={() => setAddEditModal({ open: true, data: null })}
               sx={{ borderRadius: 2, fontWeight: 700, px: 3, bgcolor: '#0ea5e9', textTransform: 'none', boxShadow: '0 4px 12px rgba(14, 165, 233, 0.25)' }}
             >
               Add New Medicine
             </Button>
          </Box>
        </Box>
      </motion.div>

      {/* STATS */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, idx) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={idx}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }}>
              <Card sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none', position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', top: -10, right: -10, opacity: 0.05, transform: 'scale(3)' }}>
                  {stat.icon}
                </Box>
                <Stack spacing={0.5}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: alpha(stat.color, 0.1), color: stat.color }}>
                      {stat.icon}
                    </Avatar>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, letterSpacing: 0.5 }}>{stat.label.toUpperCase()}</Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>{stat.value}</Typography>
                </Stack>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* TABLE SECTION */}
      <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: 'none', overflow: 'hidden' }}>
        <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" fontWeight={700} color="#1e293b">Medicine Catalog</Typography>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button 
              size="small" 
              startIcon={<FilterList />} 
              onClick={(e) => setFilterMenuAnchor(e.currentTarget)}
              sx={{ color: '#64748b', textTransform: 'none', fontWeight: 600 }}
            >
              {filterCategory === 'All' ? 'Filter by Category' : `Category: ${filterCategory}`}
            </Button>
            <Menu anchorEl={filterMenuAnchor} open={Boolean(filterMenuAnchor)} onClose={() => setFilterMenuAnchor(null)}>
              {categories.map(cat => (
                <MenuItem key={cat} onClick={() => { setFilterCategory(cat); setFilterMenuAnchor(null); }}>{cat}</MenuItem>
              ))}
            </Menu>
          </Box>
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#64748b', py: 2 }}>PRODUCT INFO</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b', py: 2 }}>STOCK LEVEL</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b', py: 2 }}>STATUS</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b', py: 2 }}>EXPIRY</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b', py: 2 }}>PRICE</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b', py: 2, textAlign: 'right' }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <AnimatePresence mode="popLayout">
                {filteredData.map((item, idx) => {
                  const statusInfo = getStockStatus(item);
                  const stockPercent = Math.min((item.stock / item.maxStock) * 100, 100);
                  
                  return (
                    <TableRow 
                      key={item.id} 
                      component={motion.tr}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      hover 
                      sx={{ '&:last-child td': { border: 0 } }}
                    >
                      <TableCell sx={{ py: 2.5 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar sx={{ bgcolor: alpha(statusInfo.color, 0.08), color: statusInfo.color, borderRadius: 1.5, width: 44, height: 44 }}>
                            <Science />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={700} color="#1e293b">{item.name}</Typography>
                            <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>#{item.id} • {item.category}</Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      
                      <TableCell sx={{ minWidth: 140 }}>
                        <Box sx={{ width: '100%' }}>
                          <Stack direction="row" justifyContent="space-between" mb={0.5}>
                            <Typography variant="caption" fontWeight={700} color="#475569">{item.stock} Units</Typography>
                            <Typography variant="caption" color="#94a3b8">Max: {item.maxStock}</Typography>
                          </Stack>
                          <LinearProgress 
                            variant="determinate" 
                            value={stockPercent} 
                            sx={{ 
                              height: 6, 
                              borderRadius: 3, 
                              bgcolor: '#f1f5f9',
                              '& .MuiLinearProgress-bar': { bgcolor: statusInfo.color, borderRadius: 3 }
                            }} 
                          />
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Chip 
                          label={statusInfo.label} 
                          size="small" 
                          sx={{ 
                            bgcolor: alpha(statusInfo.color, 0.1), 
                            color: statusInfo.color, 
                            fontWeight: 700, 
                            fontSize: '0.65rem',
                            height: 22,
                            borderRadius: '6px'
                          }} 
                        />
                      </TableCell>

                      <TableCell>
                        <Stack spacing={0.5}>
                          <Typography variant="body2" fontWeight={600} color="#475569">{new Date(item.expiry).toLocaleDateString()}</Typography>
                          <Typography variant="caption" color="#94a3b8">Batch: {item.batchNo}</Typography>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" fontWeight={700} color="#1e293b">₹{item.price.toLocaleString()}</Typography>
                      </TableCell>

                      <TableCell sx={{ textAlign: 'right' }}>
                        <IconButton 
                          size="small" 
                          onClick={(e) => setItemMenuAnchor({ anchor: e.currentTarget, id: item.id })}
                        >
                          <MoreVert sx={{ color: '#94a3b8' }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </AnimatePresence>
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* ITEM ACTIONS MENU */}
      <Menu
        anchorEl={itemMenuAnchor?.anchor}
        open={Boolean(itemMenuAnchor)}
        onClose={() => setItemMenuAnchor(null)}
        PaperProps={{ sx: { boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9' } }}
      >
        <MenuItem onClick={() => {
          const item = inventory.find(i => i.id === itemMenuAnchor?.id);
          if (item) setDetailModal({ open: true, data: item });
          setItemMenuAnchor(null);
        }}>
          <RemoveRedEye sx={{ fontSize: 18, mr: 1.5, color: '#64748b' }} /> View Full Info
        </MenuItem>
        <MenuItem onClick={() => {
          const item = inventory.find(i => i.id === itemMenuAnchor?.id);
          if (item) setAddEditModal({ open: true, data: item });
          setItemMenuAnchor(null);
        }}>
          <Edit sx={{ fontSize: 18, mr: 1.5, color: '#0ea5e9' }} /> Edit Details
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => {
          setDeleteId(itemMenuAnchor?.id || null);
          setItemMenuAnchor(null);
        }} sx={{ color: '#ef4444' }}>
          <Delete sx={{ fontSize: 18, mr: 1.5 }} /> Delete Item
        </MenuItem>
      </Menu>

      {/* ADD / EDIT MODAL */}
      <Dialog 
        open={addEditModal.open} 
        onClose={() => setAddEditModal({ open: false, data: null })}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ p: 3, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }} component="div">
          <Typography variant="h6" fontWeight={800}>{addEditModal.data ? 'Edit Medicine' : 'Add New Medicine'}</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 4, pt: 3 }}>
          <AddEditForm 
            initialData={addEditModal.data} 
            onSave={handleSaveItem} 
            onCancel={() => setAddEditModal({ open: false, data: null })} 
          />
        </DialogContent>
      </Dialog>

      {/* DETAIL VIEW MODAL */}
      <Dialog 
        open={detailModal.open} 
        onClose={() => setDetailModal({ open: false, data: null })}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}
      >
        {detailModal.data && (
          <Box>
            <Box sx={{ p: 3, bgcolor: '#0ea5e9', color: 'white', position: 'relative' }}>
              <IconButton onClick={() => setDetailModal({ open: false, data: null })} sx={{ position: 'absolute', top: 16, right: 16, color: 'white' }}>
                <Close />
              </IconButton>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ width: 64, height: 64, bgcolor: 'white', color: '#0ea5e9' }}>
                   <Science sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={800}>{detailModal.data.name}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Batch No: {detailModal.data.batchNo} • ID: {detailModal.data.id}</Typography>
                </Box>
              </Stack>
            </Box>
            
            <DialogContent sx={{ p: 4 }}>
              <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 7 }}>
                  <Typography variant="subtitle2" fontWeight={700} color="#1e293b" mb={2}>Description</Typography>
                  <Typography variant="body2" color="#64748b" sx={{ lineHeight: 1.8, mb: 4 }}>
                    {detailModal.data.description}
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc' }}>
                        <Typography variant="caption" color="#94a3b8" fontWeight={700} display="block" mb={0.5}>MANUFACTURER</Typography>
                        <Typography variant="body2" fontWeight={700} color="#475569">{detailModal.data.manufacturer}</Typography>
                      </Paper>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc' }}>
                        <Typography variant="caption" color="#94a3b8" fontWeight={700} display="block" mb={0.5}>CATEGORY</Typography>
                        <Typography variant="body2" fontWeight={700} color="#475569">{detailModal.data.category}</Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid size={{ xs: 12, md: 5 }}>
                  <Paper sx={{ p: 3, borderRadius: 4, bgcolor: '#f1f5f9', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                    <Typography variant="subtitle2" fontWeight={700} color="#1e293b" mb={3}>Stock Status</Typography>
                    
                    <Stack spacing={3}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Storage sx={{ color: '#0ea5e9', fontSize: 20 }} />
                          <Typography variant="body2" fontWeight={600} color="#64748b">Current Stock</Typography>
                        </Box>
                        <Typography variant="subtitle1" fontWeight={800} color="#1e293b">{detailModal.data.stock} Units</Typography>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <AttachMoney sx={{ color: '#10b981', fontSize: 20 }} />
                          <Typography variant="body2" fontWeight={600} color="#64748b">Unit Price</Typography>
                        </Box>
                        <Typography variant="subtitle1" fontWeight={800} color="#1e293b">₹{detailModal.data.price}</Typography>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <CalendarToday sx={{ color: '#f59e0b', fontSize: 20 }} />
                          <Typography variant="body2" fontWeight={600} color="#64748b">Expiry Date</Typography>
                        </Box>
                        <Typography variant="subtitle1" fontWeight={800} color="#1e293b">{new Date(detailModal.data.expiry).toLocaleDateString()}</Typography>
                      </Box>
                    </Stack>

                    <Divider sx={{ my: 3 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="#64748b">Last Restocked</Typography>
                      <Typography variant="body2" fontWeight={700} color="#475569">{new Date(detailModal.data.lastRestocked).toLocaleDateString()}</Typography>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            
            <DialogActions sx={{ p: 3, pt: 0 }}>
               <Button 
                variant="contained" 
                fullWidth 
                onClick={() => {
                  setAddEditModal({ open: true, data: detailModal.data });
                  setDetailModal({ open: false, data: null });
                }}
                sx={{ bgcolor: '#0ea5e9', borderRadius: 2, py: 1.5, fontWeight: 700, textTransform: 'none' }}
              >
                 Edit Inventory Record
               </Button>
            </DialogActions>
          </Box>
        )}
      </Dialog>

      {/* DELETE CONFIRMATION */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Avatar sx={{ bgcolor: alpha('#ef4444', 0.1), color: '#ef4444', mx: 'auto', mb: 2, width: 56, height: 56 }}>
            <Delete />
          </Avatar>
          <Typography variant="h6" fontWeight={800} mb={1}>Confirm Deletion</Typography>
          <Typography variant="body2" color="#64748b" mb={3}>Are you sure you want to remove this medicine from inventory? This action cannot be undone.</Typography>
          <Stack direction="row" spacing={2}>
            <Button fullWidth onClick={() => setDeleteId(null)} sx={{ color: '#64748b', fontWeight: 600 }}>Cancel</Button>
            <Button fullWidth variant="contained" color="error" onClick={handleDeleteItem} sx={{ fontWeight: 700, borderRadius: 2 }}>Delete</Button>
          </Stack>
        </Box>
      </Dialog>
    </Box>
  )
}

// ----------------------------------------------------------------------
// Internal Components
// ----------------------------------------------------------------------

function AddEditForm({ initialData, onSave, onCancel }: { initialData: MedicineItem | null; onSave: (data: Partial<MedicineItem>) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState<Partial<MedicineItem>>(initialData || {
    name: '',
    category: '',
    stock: 0,
    maxStock: 100,
    price: 0,
    expiry: new Date().toISOString().split('T')[0],
    batchNo: '',
    manufacturer: '',
    description: ''
  });

  return (
    <Stack spacing={3}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <TextField 
            label="Medicine Name" 
            fullWidth 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})} 
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField 
            label="Category" 
            fullWidth 
            value={formData.category} 
            onChange={e => setFormData({...formData, category: e.target.value})} 
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField 
            label="Manufacturer" 
            fullWidth 
            value={formData.manufacturer} 
            onChange={e => setFormData({...formData, manufacturer: e.target.value})} 
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField 
            label="Batch No" 
            fullWidth 
            value={formData.batchNo} 
            onChange={e => setFormData({...formData, batchNo: e.target.value})} 
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField 
            label="Unit Price (₹)" 
            type="number" 
            fullWidth 
            value={formData.price} 
            onChange={e => setFormData({...formData, price: Number(e.target.value)})} 
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField 
            label="Current Stock" 
            type="number" 
            fullWidth 
            value={formData.stock} 
            onChange={e => setFormData({...formData, stock: Number(e.target.value)})} 
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField 
            label="Max Stock Level" 
            type="number" 
            fullWidth 
            value={formData.maxStock} 
            onChange={e => setFormData({...formData, maxStock: Number(e.target.value)})} 
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField 
            label="Expiry Date" 
            type="date" 
            fullWidth 
            value={formData.expiry} 
            onChange={e => setFormData({...formData, expiry: e.target.value})}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField 
            label="Description" 
            multiline 
            rows={3} 
            fullWidth 
            value={formData.description} 
            onChange={e => setFormData({...formData, description: e.target.value})} 
          />
        </Grid>
      </Grid>
      
      <Divider />
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onCancel} sx={{ color: '#64748b', fontWeight: 600 }}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={() => onSave(formData)} 
          sx={{ bgcolor: '#0ea5e9', px: 4, py: 1.2, borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
        >
          {initialData ? 'Update Record' : 'Save Medicine'}
        </Button>
      </Box>
    </Stack>
  )
}
