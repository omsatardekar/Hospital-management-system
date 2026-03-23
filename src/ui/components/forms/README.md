# Hospital Management System Forms

## Overview
This directory contains all the redesigned forms for the Hospital Management System with modern SaaS UI.

## Components

### Base Form Components
- **BaseForm.tsx** - Main form container with card layout
- **FormInput.tsx** - Enhanced input field with validation
- **FormSelect.tsx** - Dropdown with descriptions and chips
- **FormDatePicker.tsx** - Date picker with calendar integration
- **FormFileUpload.tsx** - Drag-and-drop file upload

### Working Forms
- **PatientRegistrationForm.tsx** - Patient registration with medical history
- **SimpleDoctorForm.tsx** - Doctor registration with specializations
- **SimpleAppointmentForm.tsx** - Appointment booking system
- **SimpleBillingForm.tsx** - Invoice creation and management
- **SimpleMedicineForm.tsx** - Pharmacy inventory management
- **SimpleLabForm.tsx** - Laboratory test ordering

### PDF Generation
- **PDFGenerator.tsx** - Professional PDF generation for invoices and lab reports

## Features
- ✅ Modern SaaS UI with card-based layouts
- ✅ 2-column responsive design on desktop
- ✅ 48px+ input heights for better readability
- ✅ Floating labels with helper text
- ✅ Real-time validation with error states
- ✅ Smooth animations and transitions
- ✅ Hospital-standard field structure
- ✅ PDF export functionality

## Usage
```tsx
import { PatientRegistrationForm } from '../components/forms'

<PatientRegistrationForm
  open={showForm}
  patient={editingPatient}
  onClose={handleClose}
  onSubmit={handleSubmit}
/>
```

## Integration
All forms are integrated with existing Redux slices and work seamlessly with the current data structures.
