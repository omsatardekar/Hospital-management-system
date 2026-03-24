import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded'
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded'
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded'
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded'
import LocalPharmacyRoundedIcon from '@mui/icons-material/LocalPharmacyRounded'
import ScienceRoundedIcon from '@mui/icons-material/ScienceRounded'
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded'
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded'
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded'

export function navIcon(key: string) {
  switch (key) {
    case 'dashboard':
      return <DashboardRoundedIcon fontSize="small" />
    case 'patients':
      return <PeopleAltRoundedIcon fontSize="small" />
    case 'doctors':
      return <LocalHospitalRoundedIcon fontSize="small" />
    case 'appointments':
      return <EventAvailableRoundedIcon fontSize="small" />
    case 'billing':
      return <PaymentsRoundedIcon fontSize="small" />
    case 'pharmacy':
      return <LocalPharmacyRoundedIcon fontSize="small" />
    case 'lab':
      return <ScienceRoundedIcon fontSize="small" />
    case 'users':
      return <AdminPanelSettingsRoundedIcon fontSize="small" />
    case 'reports':
      return <AssessmentRoundedIcon fontSize="small" />
    case 'audit':
      return <ReceiptLongRoundedIcon fontSize="small" />
    case 'settings':
      return <SettingsRoundedIcon fontSize="small" />
    case 'schedule':
      return <CalendarMonthRoundedIcon fontSize="small" />
    case 'portfolio':
      return <VerifiedUserRoundedIcon fontSize="small" />
    default:
      return <DashboardRoundedIcon fontSize="small" />
  }
}

