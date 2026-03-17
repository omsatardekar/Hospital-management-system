import { faker } from '@faker-js/faker'
import type { Role } from '../features/auth/rbac'
import type { Doctor } from '../features/doctors/doctorsSlice'
import type { Patient } from '../features/patients/patientsSlice'
import type { Appointment } from '../features/appointments/appointmentsSlice'
import type { Invoice } from '../features/billing/billingSlice'
import type { Medicine, Prescription } from '../features/pharmacy/pharmacySlice'
import type { LabTest } from '../features/lab/labSlice'
import type { SystemUser } from '../features/users/usersSlice'
import type { AuditEvent } from '../features/audit/auditSlice'
import type { UiNotification } from '../features/ui/uiSlice'

faker.seed(20260317)

const INDIAN_FIRST_NAMES = [
  'Aarav', 'Aditya', 'Arjun', 'Vivaan', 'Vihaan', 'Ishaan', 'Sahil', 'Rohan', 'Priya', 'Ananya',
  'Diya', 'Sneha', 'Kavya', 'Meera', 'Riya', 'Aditi', 'Shreya', 'Anjali', 'Nisha', 'Pooja',
  'Raj', 'Amit', 'Sanjay', 'Vikram', 'Deepak', 'Manish', 'Suresh', 'Rajesh', 'Anil', 'Sunil',
  'Lakshmi', 'Savita', 'Geeta', 'Rekha', 'Neha', 'Pooja', 'Kiran', 'Asha', 'Usha', 'Meena',
  'Rahul', 'Ajay', 'Prateek', 'Karthik', 'Naveen', 'Srinivas', 'Ganesh', 'Mahesh', 'Raghav',
  'Divya', 'Harshita', 'Jaya', 'Shivani', 'Trisha', 'Mrunal', 'Aishwarya', 'Vidhya', 'Chandra',
  'Harish', 'Kumar', 'Ravi', 'Shankar', 'Gopal', 'Murali', 'Srinath', 'Madhav', 'Krishna',
  'Padma', 'Uma', 'Sarala', 'Vijaya', 'Lalitha', 'Radha', 'Kalyani', 'Shyamala', 'Devi',
  'Amitabh', 'Akshay', 'Arvind', 'Gaurav', 'Mohit', 'Nikhil', 'Piyush', 'Rohit', 'Siddharth',
  'Ankita', 'Bhavana', 'Charu', 'Diksha', 'Esha', 'Farah', 'Gauri', 'Hema', 'Ira', 'Jasmine',
  'Kartik', 'Lakshay', 'Mohan', 'Nirav', 'Omkar', 'Parth', 'Quasar', 'Rohan', 'Sagar',
  'Tanvi', 'Urmila', 'Varun', 'Yash', 'Zara', 'Aryan', 'Bina', 'Chetan', 'Dhanraj', 'Ekta',
  'Falguni', 'Gopal', 'Hemant', 'Indra', 'Jatin', 'Kavita', 'Lalit', 'Mona', 'Niraj',
  'Ojas', 'Prakash', 'Queen', 'Rashmi', 'Sonal', 'Tarun', 'Uday', 'Vikas', 'Washi', 'Xena',
  'Yogita', 'Zeenat', 'Aasha', 'Brijesh', 'Chitra', 'Darshan', 'Ela', 'Firoz', 'Gurmit',
  'Harsha', 'Indu', 'Jahnavi', 'Kalyan', 'Laxmi', 'Madhuri', 'Nanda', 'Omi', 'Pavan',
  'Rani', 'Suman', 'Teja', 'Ujwal', 'Varsha', 'Winay', 'Yashoda', 'Zubin'
]

const INDIAN_LAST_NAMES = [
  'Sharma', 'Patel', 'Kumar', 'Singh', 'Gupta', 'Agarwal', 'Mehta', 'Reddy', 'Iyer', 'Nair',
  'Menon', 'Desai', 'Shah', 'Kapoor', 'Malhotra', 'Bhatia', 'Chatterjee', 'Mukherjee', 'Banerjee',
  'Sinha', 'Jha', 'Mishra', 'Prasad', 'Tripathi', 'Dubey', 'Chaudhary', 'Yadav', 'Gaur',
  'Rastogi', 'Tiwari', 'Saxena', 'Mathur', 'Bhandari', 'Mahajan', 'Kaur', 'Gill', 'Singh',
  'Arora', 'Chhabra', 'Garg', 'Khanna', 'Jain', 'Anand', 'Balan', 'Pillai', 'Nambiar', 'Kurup',
  'Kartha', 'Rao', 'Babu', 'Naidu', 'Krishnan', 'Lakshman', 'Narayan', 'Subramanian', 'Iyengar',
  'Venkatesh', 'Prasanna', 'Sarma', 'Kulkarni', 'Hegde', 'Shenoy', 'Udupa', 'Bhat', 'Kamat',
  'Mestry', 'D\'Souza', 'Fernandes', 'Mello', 'Almeida', 'Dias', 'Dsouza', 'Saldanha', 'Sequeira',
  'Mandal', 'Sarkar', 'Das', 'Bose', 'Ray', 'Ganguly', 'Sengupta', 'Bhattacharya', 'Chakraborty',
  'Dutta', 'Majumdar', 'Nag', 'Sinha', 'Pal', 'Dhar', 'Biswas', 'Chowdhury', 'Molla', 'Sk',
  'Ahmed', 'Khan', 'Ali', 'Ansari', 'Siddiqui', 'Qureshi', 'Hussain', 'Raza', 'Mirza', 'Baig',
  'Choudhary', 'Sheikh', 'Hashmi', 'Farooq', 'Omer', 'Bilal', 'Yusuf', 'Zahid', 'Nazar',
  'Mahendra', 'Karnam', 'Gopalakrishnan', 'Ranganathan', 'Sundaram', 'Lakshminarayanan', 'Ramaswamy',
  'Chandrasekhar', 'Parthasarathy', 'Vijayaraghavan', 'Ramakrishnan', 'Ganapathy', 'Viswanathan', 'Srinivasan',
  'Thiagarajan', 'Palanisamy', 'Subramani', 'Muthuswamy', 'Natarajan', 'Rajagopal', 'Doraiswamy',
  'Vaidyanathan', 'Sankaranarayanan', 'Radhakrishnan', 'Gopalakrishnan', 'Haridas', 'Menon', 'Varier',
  'Potti', 'Warrier', 'Nambiar', 'Pisharodi', 'Mannath', 'Padmanabhan', 'Valiya', 'Chelakkara'
]

function generateIndianName(): string {
  const firstName = pick(INDIAN_FIRST_NAMES)
  const lastName = pick(INDIAN_LAST_NAMES)
  return `${firstName} ${lastName}`
}

const DEPARTMENTS = [
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Dermatology',
  'ENT',
  'Oncology',
  'Radiology',
  'General Medicine',
  'Emergency',
] as const

const SPECIALIZATIONS = [
  'Interventional Cardiology',
  'Neurosurgery',
  'Sports Medicine',
  'Neonatology',
  'Dermatopathology',
  'Audiology',
  'Medical Oncology',
  'Diagnostic Radiology',
  'Internal Medicine',
  'Trauma Care',
] as const

function pick<T>(arr: readonly T[]) {
  return arr[Math.floor(Math.random() * arr.length)] as T
}

function isoDaysAgo(days: number) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

function genAvailability() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const
  return days.map((day) => ({
    day,
    slots: ['09:00', '09:30', '10:00', '11:00', '14:00', '15:00', '16:00'],
  }))
}

export type MockDb = {
  doctors: Doctor[]
  patients: Patient[]
  appointments: Appointment[]
  invoices: Invoice[]
  medicines: Medicine[]
  prescriptions: Prescription[]
  labTests: LabTest[]
  users: SystemUser[]
  audit: AuditEvent[]
  notifications: UiNotification[]
  beds: { total: number; occupied: number }
}

export function createMockDb(): MockDb {
  const doctors: Doctor[] = Array.from({ length: 24 }).map((_, i) => {
    const dept = pick(DEPARTMENTS)
    const spec = SPECIALIZATIONS[DEPARTMENTS.indexOf(dept)] ?? pick(SPECIALIZATIONS)
    return {
      id: `doc_${String(i + 1).padStart(3, '0')}`,
      name: `Dr. ${generateIndianName()}`,
      email: faker.internet.email({ provider: 'hospital.com' }).toLowerCase(),
      phone: faker.phone.number({ style: 'international' }),
      specialization: spec,
      department: dept,
      status: Math.random() > 0.1 ? 'ACTIVE' : 'INACTIVE',
      rating: Number((3.8 + Math.random() * 1.2).toFixed(1)),
      todayAppointments: faker.number.int({ min: 0, max: 12 }),
      availability: genAvailability(),
    }
  })

  const patients: Patient[] = Array.from({ length: 140 }).map((_, i) => {
    const dept = pick(DEPARTMENTS)
    const assignedDoctorId = pick(doctors.filter((d) => d.department === dept)).id
    const gender = pick(['Male', 'Female', 'Other'] as const)
    const age = faker.number.int({ min: 1, max: 90 })
    return {
      id: `pat_${String(i + 1).padStart(4, '0')}`,
      name: generateIndianName(),
      gender,
      age,
      phone: faker.phone.number({ style: 'international' }),
      email: faker.internet.email().toLowerCase(),
      bloodGroup: pick(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const),
      status: pick(['ACTIVE', 'IN_TREATMENT', 'DISCHARGED'] as const),
      lastVisit: isoDaysAgo(faker.number.int({ min: 0, max: 60 })),
      department: dept,
      assignedDoctorId,
      medicalTimeline: [
        { at: isoDaysAgo(60), title: 'Registration', note: 'Patient registered in HMS' },
        { at: isoDaysAgo(25), title: 'Consultation', note: 'Initial diagnosis recorded' },
        { at: isoDaysAgo(8), title: 'Follow-up', note: 'Medication adjusted' },
      ],
      reports: [
        { id: faker.string.uuid(), name: 'CBC Report', type: 'pdf', uploadedAt: isoDaysAgo(10) },
        { id: faker.string.uuid(), name: 'X-Ray Chest', type: 'jpg', uploadedAt: isoDaysAgo(22) },
      ],
    }
  })

  // Appointments across the last 30 days + next 10 days
  const appointments: Appointment[] = Array.from({ length: 220 }).map((_, i) => {
    const patient = pick(patients)
    const doctor = patient.assignedDoctorId
      ? doctors.find((d) => d.id === patient.assignedDoctorId) ?? pick(doctors)
      : pick(doctors)
    const offsetDays = faker.number.int({ min: -30, max: 10 })
    const start = new Date()
    start.setDate(start.getDate() + offsetDays)
    start.setHours(pick([9, 10, 11, 14, 15, 16]), pick([0, 30]), 0, 0)
    const end = new Date(start)
    end.setMinutes(end.getMinutes() + 30)
    const status = pick(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED'] as const)
    return {
      id: `apt_${String(i + 1).padStart(5, '0')}`,
      patientId: patient.id,
      doctorId: doctor.id,
      department: doctor.department,
      startAt: start.toISOString(),
      endAt: end.toISOString(),
      status,
      reason: pick(['Follow-up', 'New symptoms', 'Lab review', 'Prescription renewal', 'Post-op check'] as const),
      createdAt: isoDaysAgo(faker.number.int({ min: 1, max: 30 })),
    }
  })

  const invoices: Invoice[] = Array.from({ length: 120 }).map((_, i) => {
    const patient = pick(patients)
    const total = faker.number.int({ min: 1200, max: 45000 })
    const paid =
      Math.random() > 0.6 ? total : Math.random() > 0.35 ? faker.number.int({ min: 0, max: total }) : 0
    const status: Invoice['status'] =
      paid >= total ? 'PAID' : paid > 0 ? 'PARTIAL' : Math.random() > 0.95 ? 'VOID' : 'DUE'
    const insurance = Math.random() > 0.55
    return {
      id: `inv_${String(i + 1).padStart(5, '0')}`,
      patientId: patient.id,
      createdAt: isoDaysAgo(faker.number.int({ min: 0, max: 40 })),
      status,
      total,
      paid,
      insuranceProvider: insurance ? pick(['Star Health', 'ICICI Lombard', 'HDFC ERGO', 'Bajaj Allianz'] as const) : undefined,
      insurancePolicyId: insurance ? faker.string.alphanumeric(10).toUpperCase() : undefined,
      items: [
        { label: 'Consultation', amount: faker.number.int({ min: 300, max: 1500 }) },
        { label: 'Lab Tests', amount: faker.number.int({ min: 200, max: 8000 }) },
        { label: 'Medication', amount: faker.number.int({ min: 100, max: 12000 }) },
      ],
      payments:
        paid > 0
          ? [
              {
                id: faker.string.uuid(),
                at: isoDaysAgo(faker.number.int({ min: 0, max: 30 })),
                amount: paid,
                method: insurance && Math.random() > 0.5 ? 'INSURANCE' : pick(['CASH', 'CARD', 'UPI'] as const),
              },
            ]
          : [],
    }
  })

  const medicines: Medicine[] = Array.from({ length: 80 }).map((_, i) => {
    const stock = faker.number.int({ min: 0, max: 480 })
    const reorderLevel = faker.number.int({ min: 20, max: 120 })
    const status: Medicine['status'] = stock === 0 ? 'OUT' : stock < reorderLevel ? 'LOW' : 'OK'
    return {
      id: `med_${String(i + 1).padStart(4, '0')}`,
      name: `${faker.commerce.productName()} ${pick(['Tablet', 'Capsule', 'Syrup', 'Injection'] as const)}`,
      category: pick(['Antibiotic', 'Analgesic', 'Antipyretic', 'Antacid', 'Vaccine', 'Antiseptic'] as const),
      stock,
      reorderLevel,
      price: Number(faker.commerce.price({ min: 20, max: 1500 })),
      status,
      updatedAt: isoDaysAgo(faker.number.int({ min: 0, max: 20 })),
    }
  })

  const prescriptions: Prescription[] = Array.from({ length: 90 }).map(() => {
    const patient = pick(patients)
    const doctor = pick(doctors)
    const meds = faker.helpers.arrayElements(medicines, faker.number.int({ min: 1, max: 4 }))
    return {
      id: `rx_${faker.string.alphanumeric(8).toLowerCase()}`,
      patientId: patient.id,
      doctorId: doctor.id,
      createdAt: isoDaysAgo(faker.number.int({ min: 0, max: 20 })),
      medicines: meds.map((m) => ({
        medicineId: m.id,
        dose: pick(['1-0-1', '0-1-0', '1-1-1', '0-0-1'] as const),
        days: faker.number.int({ min: 3, max: 14 }),
      })),
    }
  })

  const labTests: LabTest[] = Array.from({ length: 110 }).map((_, i) => {
    const patient = pick(patients)
    const doctor = pick(doctors)
    const status = pick(['REQUESTED', 'COLLECTED', 'PROCESSING', 'REPORTED'] as const)
    const requestedAt = isoDaysAgo(faker.number.int({ min: 0, max: 20 }))
    return {
      id: `lab_${String(i + 1).padStart(5, '0')}`,
      patientId: patient.id,
      requestedByDoctorId: doctor.id,
      testName: pick(['CBC', 'LFT', 'KFT', 'Thyroid Profile', 'HbA1c', 'MRI Brain', 'CT Chest'] as const),
      status,
      requestedAt,
      reportedAt: status === 'REPORTED' ? isoDaysAgo(faker.number.int({ min: 0, max: 10 })) : undefined,
      reportFiles:
        status === 'REPORTED'
          ? [{ id: faker.string.uuid(), name: `${patient.id}_${i}_report.pdf`, type: 'pdf', uploadedAt: isoDaysAgo(1) }]
          : [],
    }
  })

  const users: SystemUser[] = [
    { id: 'u_admin_001', name: 'System Administrator', email: 'admin@hospital.com', role: 'ADMIN', status: 'ACTIVE', createdAt: isoDaysAgo(120) },
    { id: 'u_ops_001', name: 'Operations Manager', email: 'ops@hospital.com', role: 'OPS_MANAGER', status: 'ACTIVE', createdAt: isoDaysAgo(90) },
    { id: 'u_fin_001', name: 'Finance Controller', email: 'finance@hospital.com', role: 'FINANCE', status: 'ACTIVE', createdAt: isoDaysAgo(70) },
    { id: 'u_ph_001', name: 'Pharmacy Admin', email: 'pharmacy@hospital.com', role: 'PHARMACY', status: 'ACTIVE', createdAt: isoDaysAgo(80) },
    { id: 'u_lab_001', name: 'Lab Admin', email: 'lab@hospital.com', role: 'LAB', status: 'ACTIVE', createdAt: isoDaysAgo(60) },
  ]

  const audit: AuditEvent[] = Array.from({ length: 30 }).map((_, i) => ({
    id: faker.string.uuid(),
    actorUserId: 'u_admin_001',
    actorName: 'System Administrator',
    action: pick(['ADD_DOCTOR', 'UPDATE_PATIENT', 'CREATE_INVOICE', 'UPDATE_INVENTORY', 'UPLOAD_LAB_REPORT'] as const),
    entity: pick(['Doctor', 'Patient', 'Invoice', 'Medicine', 'LabTest'] as const),
    entityId: String(i + 1),
    createdAt: isoDaysAgo(faker.number.int({ min: 0, max: 7 })),
    meta: { source: 'seed' },
  }))

  const notifications: UiNotification[] = [
    {
      id: 'notif_001',
      title: 'New Patient Admission',
      message: 'Patient Rajesh Kumar has been admitted to Room 302 in Cardiology department.',
      severity: 'info',
      createdAt: isoDaysAgo(0.1),
      read: false,
    },
    {
      id: 'notif_002',
      title: 'Lab Report Ready',
      message: 'Blood test results for Priya Sharma are now available for review.',
      severity: 'success',
      createdAt: isoDaysAgo(0.3),
      read: false,
    },
    {
      id: 'notif_003',
      title: 'Appointment Cancelled',
      message: 'Dr. Arjun Patel has cancelled the 2:30 PM appointment due to emergency surgery.',
      severity: 'warning',
      createdAt: isoDaysAgo(0.5),
      read: true,
    },
    {
      id: 'notif_004',
      title: 'Low Inventory Alert',
      message: 'Paracetamol 500mg stock is running low. Only 50 units remaining.',
      severity: 'error',
      createdAt: isoDaysAgo(1),
      read: false,
    },
    {
      id: 'notif_005',
      title: 'Staff Schedule Updated',
      message: 'Nursing staff roster for next week has been updated. Please review.',
      severity: 'info',
      createdAt: isoDaysAgo(1.5),
      read: true,
    },
    {
      id: 'notif_006',
      title: 'Payment Received',
      message: 'Invoice #INV-2024-0156 has been paid. Amount: ₹12,500',
      severity: 'success',
      createdAt: isoDaysAgo(2),
      read: true,
    },
    {
      id: 'notif_007',
      title: 'Emergency Alert',
      message: 'Trauma case incoming. Emergency team standby required.',
      severity: 'error',
      createdAt: isoDaysAgo(0.05),
      read: false,
    },
    {
      id: 'notif_008',
      title: 'Equipment Maintenance',
      message: 'CT Scanner scheduled for maintenance tomorrow at 6:00 AM.',
      severity: 'warning',
      createdAt: isoDaysAgo(0.8),
      read: true,
    },
  ]

  return {
    doctors,
    patients,
    appointments,
    invoices,
    medicines,
    prescriptions,
    labTests,
    users,
    audit,
    notifications,
    beds: { total: 240, occupied: faker.number.int({ min: 140, max: 225 }) },
  }
}

export type PaginationResult<T> = {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export function paginate<T>(items: T[], page: number, pageSize: number): PaginationResult<T> {
  const start = (page - 1) * pageSize
  const sliced = items.slice(start, start + pageSize)
  return { items: sliced, total: items.length, page, pageSize }
}

export function parseNum(v: unknown, fallback: number) {
  const n = typeof v === 'string' ? Number(v) : typeof v === 'number' ? v : NaN
  return Number.isFinite(n) ? n : fallback
}

export function parseRole(v: unknown): Role | undefined {
  const s = typeof v === 'string' ? v : undefined
  if (!s) return undefined
  const allowed: Role[] = ['ADMIN', 'OPS_MANAGER', 'FINANCE', 'PHARMACY', 'LAB', 'DOCTOR']
  return allowed.includes(s as Role) ? (s as Role) : undefined
}

