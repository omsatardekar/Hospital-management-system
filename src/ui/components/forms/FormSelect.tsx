import { forwardRef } from 'react'
import {
  Select,
  type SelectProps,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  useTheme,
  alpha,
  Chip,
  Typography,
} from '@mui/material'
import { motion } from 'framer-motion'

export interface FormSelectOption {
  value: string | number
  label: string
  disabled?: boolean
  description?: string
  icon?: React.ReactNode
}

export interface FormSelectProps extends Omit<SelectProps, 'variant'> {
  label?: string
  helperText?: string
  error?: boolean
  required?: boolean
  options: FormSelectOption[]
  showChips?: boolean
}

export const FormSelect = forwardRef<HTMLDivElement, FormSelectProps>(
  (
    {
      label,
      helperText,
      error,
      required,
      options,
      showChips = false,
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
        <FormControl
          fullWidth
          error={error}
          required={required}
          ref={ref}
        >
          {label && (
            <InputLabel
              sx={{
                fontSize: '0.875rem',
                fontWeight: 500,
                '&.Mui-focused': {
                  color: error ? theme.palette.error.main : theme.palette.primary.main,
                },
                '&.Mui-error': {
                  color: theme.palette.error.main,
                },
              }}
            >
              {label}
            </InputLabel>
          )}
          <Select
            {...props}
            label={label}
            sx={{
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
              '& .MuiSelect-select': {
                fontSize: '0.9375rem',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              },
              ...sx,
            }}
            renderValue={(selected) => {
              if (!selected) return <span>&nbsp;</span>
              
              const selectedOption = options.find(option => option.value === selected)
              
              if (showChips && selectedOption) {
                return (
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    <Chip
                      label={selectedOption.label}
                      size="small"
                      sx={{
                        fontSize: '0.8125rem',
                        height: 24,
                      }}
                    />
                  </Box>
                )
              }
              
              return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {selectedOption?.icon}
                  <span>{selectedOption?.label || selected}</span>
                </Box>
              )
            }}
          >
            {options.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                sx={{
                  fontSize: '0.9375rem',
                  py: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                {option.icon && (
                  <Box
                    sx={{
                      fontSize: '1.25rem',
                      color: theme.palette.text.secondary,
                    }}
                  >
                    {option.icon}
                  </Box>
                )}
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 500 }}>{option.label}</Typography>
                  {option.description && (
                    <Typography
                      component="div"
                      sx={{
                        fontSize: '0.75rem',
                        color: theme.palette.text.secondary,
                        mt: 0.25,
                      }}
                    >
                      {option.description}
                    </Typography>
                  )}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        {helperText && (
          <Box
            sx={{
              mt: 0.5,
              mx: '14px',
              fontSize: '0.75rem',
              color: error ? theme.palette.error.main : theme.palette.text.secondary,
              lineHeight: 1.4,
            }}
          >
            {helperText}
          </Box>
        )}
      </motion.div>
    )
  }
)

FormSelect.displayName = 'FormSelect'
