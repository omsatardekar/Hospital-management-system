import AxiosMockAdapter from 'axios-mock-adapter'
import { http } from './http'
import { createMockDb, paginate, parseNum, type MockDb } from './mockDb'

let mock: AxiosMockAdapter | null = null
let db: MockDb | null = null

function ok(data: unknown): [number, unknown] {
  return [200, data]
}

function notFound(message = 'Not found'): [number, { message: string }] {
  return [404, { message }]
}

function badRequest(message = 'Bad request'): [number, { message: string }] {
  return [400, { message }]
}

function parseBody(config: any) {
  try {
    return config.data ? JSON.parse(config.data) : {}
  } catch {
    return {}
  }
}

export function ensureMockServer() {
  if (mock && db) return { mock, db }
  db = createMockDb()
  mock = new AxiosMockAdapter(http, { delayResponse: 450 })

  // Boot
  mock.onGet('/bootstrap').reply(() => {
    if (!db) return badRequest()
    return ok({
      doctors: db.doctors,
      patients: db.patients,
      appointments: db.appointments,
      invoices: db.invoices,
      pharmacy: { medicines: db.medicines, prescriptions: db.prescriptions },
      labTests: db.labTests,
      users: db.users,
      audit: db.audit,
      notifications: db.notifications,
      beds: db.beds,
    })
  })

  // Doctors
  mock.onGet('/doctors').reply((config) => {
    if (!db) return badRequest()
    const p = new URLSearchParams(config.params ?? config.url?.split('?')[1])
    const page = parseNum(p.get('page'), 1)
    const pageSize = parseNum(p.get('pageSize'), 10)
    const q = (p.get('q') ?? '').toLowerCase().trim()
    const filtered = q
      ? db.doctors.filter((d) => (d.name + d.specialization + d.department).toLowerCase().includes(q))
      : db.doctors
    return ok(paginate(filtered, page, pageSize))
  })

  mock.onPost('/doctors').reply((config) => {
    if (!db) return badRequest()
    const body = parseBody(config)
    if (!body?.name) return badRequest('Doctor name is required')
    const id = `doc_${String(db.doctors.length + 1).padStart(3, '0')}`
    const doctor = {
      id,
      name: body.name,
      email: body.email ?? '',
      phone: body.phone ?? '',
      specialization: body.specialization ?? 'Internal Medicine',
      department: body.department ?? 'General Medicine',
      status: body.status ?? 'ACTIVE',
      rating: body.rating ?? 4.2,
      todayAppointments: 0,
      availability: body.availability ?? [],
    }
    db.doctors.unshift(doctor)
    return ok(doctor)
  })

  mock.onPut(/\/doctors\/[^/]+/).reply((config) => {
    if (!db) return badRequest()
    const id = config.url?.split('/').pop()
    const body = parseBody(config)
    const d = db.doctors.find((x) => x.id === id)
    if (!d) return notFound('Doctor not found')
    Object.assign(d, body)
    return ok(d)
  })

  mock.onDelete(/\/doctors\/[^/]+/).reply((config) => {
    if (!db) return badRequest()
    const id = config.url?.split('/').pop()
    const before = db.doctors.length
    db.doctors = db.doctors.filter((x) => x.id !== id)
    return ok({ deleted: before !== db.doctors.length })
  })

  // Patients
  mock.onGet('/patients').reply((config) => {
    if (!db) return badRequest()
    const p = new URLSearchParams(config.params ?? config.url?.split('?')[1])
    const page = parseNum(p.get('page'), 1)
    const pageSize = parseNum(p.get('pageSize'), 10)
    const q = (p.get('q') ?? '').toLowerCase().trim()
    const dept = (p.get('department') ?? '').toLowerCase().trim()
    const status = (p.get('status') ?? '').toLowerCase().trim()
    let items = db.patients
    if (q) items = items.filter((x) => (x.name + x.email + x.phone).toLowerCase().includes(q))
    if (dept) items = items.filter((x) => x.department.toLowerCase() === dept)
    if (status) items = items.filter((x) => x.status.toLowerCase() === status)
    return ok(paginate(items, page, pageSize))
  })

  mock.onGet(/\/patients\/[^/]+/).reply((config) => {
    if (!db) return badRequest()
    const id = config.url?.split('/').pop()
    const p = db.patients.find((x) => x.id === id)
    if (!p) return notFound('Patient not found')
    return ok(p)
  })

  mock.onPut(/\/patients\/[^/]+/).reply((config) => {
    if (!db) return badRequest()
    const id = config.url?.split('/').pop()
    const body = parseBody(config)
    const p = db.patients.find((x) => x.id === id)
    if (!p) return notFound('Patient not found')
    Object.assign(p, body)
    return ok(p)
  })

  // Appointments
  mock.onGet('/appointments').reply((config) => {
    if (!db) return badRequest()
    const p = new URLSearchParams(config.params ?? config.url?.split('?')[1])
    const page = parseNum(p.get('page'), 1)
    const pageSize = parseNum(p.get('pageSize'), 10)
    const status = (p.get('status') ?? '').toLowerCase().trim()
    const items = status ? db.appointments.filter((a) => a.status.toLowerCase() === status) : db.appointments
    return ok(paginate(items, page, pageSize))
  })

  mock.onPost('/appointments').reply((config) => {
    if (!db) return badRequest()
    const body = parseBody(config)
    if (!body?.patientId || !body?.doctorId || !body?.startAt || !body?.endAt) return badRequest('Missing fields')
    const appt = {
      id: `apt_${String(db.appointments.length + 1).padStart(5, '0')}`,
      patientId: body.patientId,
      doctorId: body.doctorId,
      department: body.department ?? 'General Medicine',
      startAt: body.startAt,
      endAt: body.endAt,
      status: 'SCHEDULED' as const,
      reason: body.reason ?? 'Consultation',
      createdAt: new Date().toISOString(),
    }
    db.appointments.unshift(appt)
    return ok(appt)
  })

  mock.onPut(/\/appointments\/[^/]+/).reply((config) => {
    if (!db) return badRequest()
    const id = config.url?.split('/').pop()
    const body = parseBody(config)
    const a = db.appointments.find((x) => x.id === id)
    if (!a) return notFound('Appointment not found')
    Object.assign(a, body)
    return ok(a)
  })

  // Billing
  mock.onGet('/billing/invoices').reply((config) => {
    if (!db) return badRequest()
    const p = new URLSearchParams(config.params ?? config.url?.split('?')[1])
    const page = parseNum(p.get('page'), 1)
    const pageSize = parseNum(p.get('pageSize'), 10)
    return ok(paginate(db.invoices, page, pageSize))
  })

  mock.onPost('/billing/invoices').reply((config) => {
    if (!db) return badRequest()
    const body = parseBody(config)
    if (!body?.patientId || !body?.items?.length) return badRequest('patientId and items required')
    const total = body.items.reduce((sum: number, it: any) => sum + Number(it.amount ?? 0), 0)
    const inv = {
      id: `inv_${String(db.invoices.length + 1).padStart(5, '0')}`,
      patientId: body.patientId,
      createdAt: new Date().toISOString(),
      status: 'DUE' as const,
      total,
      paid: 0,
      insuranceProvider: body.insuranceProvider,
      insurancePolicyId: body.insurancePolicyId,
      items: body.items,
      payments: [],
    }
    db.invoices.unshift(inv)
    return ok(inv)
  })

  mock.onPut(/\/billing\/invoices\/[^/]+/).reply((config) => {
    if (!db) return badRequest()
    const id = config.url?.split('/').pop()
    const body = parseBody(config)
    const inv = db.invoices.find((x) => x.id === id)
    if (!inv) return notFound('Invoice not found')
    Object.assign(inv, body)
    return ok(inv)
  })

  // Pharmacy
  mock.onGet('/pharmacy/medicines').reply((config) => {
    if (!db) return badRequest()
    const p = new URLSearchParams(config.params ?? config.url?.split('?')[1])
    const page = parseNum(p.get('page'), 1)
    const pageSize = parseNum(p.get('pageSize'), 10)
    return ok(paginate(db.medicines, page, pageSize))
  })

  mock.onPut(/\/pharmacy\/medicines\/[^/]+/).reply((config) => {
    if (!db) return badRequest()
    const id = config.url?.split('/').pop()
    const body = parseBody(config)
    const med = db.medicines.find((x) => x.id === id)
    if (!med) return notFound('Medicine not found')
    Object.assign(med, body)
    return ok(med)
  })

  mock.onGet('/pharmacy/prescriptions').reply(() => {
    if (!db) return badRequest()
    return ok(db.prescriptions)
  })

  // Lab
  mock.onGet('/lab/tests').reply((config) => {
    if (!db) return badRequest()
    const p = new URLSearchParams(config.params ?? config.url?.split('?')[1])
    const page = parseNum(p.get('page'), 1)
    const pageSize = parseNum(p.get('pageSize'), 10)
    return ok(paginate(db.labTests, page, pageSize))
  })

  mock.onPut(/\/lab\/tests\/[^/]+/).reply((config) => {
    if (!db) return badRequest()
    const id = config.url?.split('/').pop()
    const body = parseBody(config)
    const t = db.labTests.find((x) => x.id === id)
    if (!t) return notFound('Lab test not found')
    Object.assign(t, body)
    return ok(t)
  })

  // Users
  mock.onGet('/users').reply(() => {
    if (!db) return badRequest()
    return ok(db.users)
  })
  mock.onPost('/users').reply((config) => {
    if (!db) return badRequest()
    const body = parseBody(config)
    if (!body?.name || !body?.email || !body?.role) return badRequest('name/email/role required')
    const user = {
      id: `u_${String(db.users.length + 1).padStart(3, '0')}`,
      name: body.name,
      email: body.email,
      role: body.role,
      status: body.status ?? 'ACTIVE',
      createdAt: new Date().toISOString(),
    }
    db.users.unshift(user)
    return ok(user)
  })

  return { mock, db }
}

