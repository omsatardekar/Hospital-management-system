import { faker } from '@faker-js/faker'
import type { Role } from '../features/auth/rbac'
import type { Doctor } from '../features/doctors/doctorsSlice'
import type { Patient } from '../features/patients/patientsSlice'
import type { Appointment } from '../features/appointments/appointmentsSlice'
import type { Medicine, Prescription } from '../features/pharmacy/pharmacySlice'
import type { LabTest } from '../features/lab/labSlice'
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
  'Kartik', 'Lakshay', 'Mohan', 'Nirav', 'Williams', 'Parth', 'Quasar', 'Rohan', 'Sagar',
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
  'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology', 'ENT', 'Oncology', 'Radiology', 'General Medicine', 'Emergency'
] as const

const SPECIALIZATIONS = [
  'Interventional Cardiology', 'Neurosurgery', 'Sports Medicine', 'Neonatology', 'Dermatopathology', 'Audiology', 'Medical Oncology', 'Diagnostic Radiology', 'Internal Medicine', 'Trauma Care'
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
  medicines: Medicine[]
  prescriptions: Prescription[]
  labTests: LabTest[]
  users: any[]
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
    return {
      id: `pat_${String(i + 1).padStart(4, '0')}`,
      name: generateIndianName(),
      gender,
      age: faker.number.int({ min: 1, max: 90 }),
      phone: faker.phone.number({ style: 'international' }),
      email: faker.internet.email().toLowerCase(),
      bloodGroup: pick(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const),
      status: pick(['ACTIVE', 'IN_TREATMENT', 'DISCHARGED'] as const),
      lastVisit: isoDaysAgo(faker.number.int({ min: 0, max: 60 })),
      department: dept,
      assignedDoctorId,
      medicalTimeline: [
        { at: isoDaysAgo(60), title: 'Registration', note: 'Patient registered' },
        { at: isoDaysAgo(25), title: 'Consultation', note: 'Initial diagnosis' },
      ],
      reports: [
        { id: faker.string.uuid(), name: 'CBC Report', type: 'pdf', uploadedAt: isoDaysAgo(10) },
      ],
    }
  })

  const appointments: Appointment[] = Array.from({ length: 220 }).map((_, i) => {
    const patient = pick(patients)
    const doctor = patient.assignedDoctorId ? doctors.find((d) => d.id === patient.assignedDoctorId) ?? pick(doctors) : pick(doctors)
    const start = new Date()
    start.setHours(pick([9, 10, 11, 14, 15, 16]), pick([0, 30]), 0, 0)
    return {
      id: `apt_${String(i + 1).padStart(5, '0')}`,
      patientId: patient.id,
      doctorId: doctor.id,
      department: doctor.department,
      startAt: start.toISOString(),
      endAt: start.toISOString(),
      status: pick(['SCHEDULED', 'COMPLETED', 'CANCELLED'] as const),
      reason: 'Regular Checkup',
      createdAt: isoDaysAgo(5),
    }
  })

  const medicines: Medicine[] = Array.from({ length: 80 }).map((_, i) => ({
    id: `med_${String(i + 1).padStart(4, '0')}`,
    name: `${faker.commerce.productName()}`,
    category: 'General',
    status: 'OK',
    stock: 100,
    reorderLevel: 20,
    price: 50,
    updatedAt: isoDaysAgo(1),
  }))

  const prescriptions: Prescription[] = Array.from({ length: 90 }).map(() => ({
    id: `rx_${faker.string.alphanumeric(8)}`,
    patientId: pick(patients).id,
    doctorId: pick(doctors).id,
    createdAt: isoDaysAgo(2),
    medicines: [{ medicineId: 'med_0001', dose: '1-0-1', days: 5 }],
  }))

  const labTests: LabTest[] = Array.from({ length: 110 }).map((_, i) => ({
    id: `lab_${String(i + 1).padStart(5, '0')}`,
    patientId: pick(patients).id,
    requestedByDoctorId: pick(doctors).id,
    testName: 'Blood Test',
    status: 'REPORTED',
    requestedAt: isoDaysAgo(5),
    reportFiles: [],
  }))

  const users: any[] = [
    { id: 'u_doc_001', name: 'Dr. John Williams', email: 'doctor@hospital.com', role: 'DOCTOR', status: 'ACTIVE', createdAt: isoDaysAgo(60) },
  ]

  const notifications: UiNotification[] = []

  return {
    doctors, patients, appointments, medicines, prescriptions, labTests, users, notifications,
    beds: { total: 240, occupied: 180 },
  }
}

export function paginate<T>(items: T[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize
  return { items: items.slice(start, start + pageSize), total: items.length, page, pageSize }
}

export function parseNum(v: unknown, fallback: number) {
  const n = typeof v === 'string' ? Number(v) : typeof v === 'number' ? v : NaN
  return Number.isFinite(n) ? n : fallback
}

export function parseRole(v: unknown): Role | undefined {
  const allowed: Role[] = ['ADMIN', 'OPS_MANAGER', 'FINANCE', 'PHARMACY', 'LAB', 'DOCTOR']
  return allowed.includes(v as Role) ? (v as Role) : undefined
}
