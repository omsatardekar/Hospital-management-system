import { forwardRef } from 'react'
import {
  TextField,
  useTheme,
  alpha,
  IconButton,
} from '@mui/material'
import { CalendarToday } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { DatePicker, type DatePickerProps } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

export interface FormDatePickerProps extends Omit<DatePickerProps<Date>, 'renderInput'> {
  label?: string
  helperText?: string
  error?: boolean
  required?: boolean
}

export const FormDatePicker = forwardRef<HTMLDivElement, FormDatePickerProps>(
  (
    {
      label,
      helperText,
      error,
      required,
      sx,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            {...props}
            ref={ref}
            slots={{
              textField: TextField,
            }}
            slotProps={{
              textField: {
                label,
                helperText,
                error,
                required,
                fullWidth: true,
                variant: 'outlined',
                InputProps: {
                  startAdornment: (
                    <IconButton size="small" sx={{ mr: 1 }}>
                      <CalendarToday
                        sx={{
                          fontSize: '1.25rem',
                          color: theme.palette.text.secondary,
                        }}
                      />
                    </IconButton>
                  ),
                },
                sx: {
                  '& .MuiOutlinedInput-root': {
                    height: 48,
                    borderRadius: 2,
                    backgroundColor: theme.palette.background.paper,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.02),
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: alpha(theme.palette.primary.main, 0.3),
                      },
                    },
                    '&.Mui-focused': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.04),
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                        borderWidth: 2,
                      },
                    },
                    '&.Mui-error': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.error.main,
                      },
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    '&.Mui-focused': {
                      color: error ? theme.palette.error.main : theme.palette.primary.main,
                    },
                    '&.Mui-error': {
                      color: theme.palette.error.main,
                    },
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '0.9375rem',
                    padding: '12px 14px',
                  },
                  '& .MuiFormHelperText-root': {
                    fontSize: '0.75rem',
                    marginTop: '4px',
                    marginLeft: 0,
                  },
                  ...sx,
                },
              },
            }}
          />
        </LocalizationProvider>
      </motion.div>
    )
  }
)

FormDatePicker.displayName = 'FormDatePicker'
