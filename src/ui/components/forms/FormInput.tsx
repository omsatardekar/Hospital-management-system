import { forwardRef, useState } from 'react'
import {
  TextField,
  type TextFieldProps,
  InputAdornment,
  IconButton,
  Box,
  useTheme,
  alpha,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { motion } from 'framer-motion'

export interface FormInputProps extends Omit<TextFieldProps, 'variant'> {
  label?: string
  helperText?: string
  error?: boolean
  required?: boolean
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  showPasswordToggle?: boolean
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      helperText,
      error,
      required,
      startIcon,
      endIcon,
      showPasswordToggle,
      type = 'text',
      sx,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const [showPassword, setShowPassword] = useState(false)

    const handleTogglePassword = () => {
      setShowPassword(!showPassword)
    }

    const inputType = showPasswordToggle && type === 'password' && !showPassword
      ? 'password'
      : showPasswordToggle && type === 'password' && showPassword
      ? 'text'
      : type

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <TextField
          {...props}
          ref={ref}
          type={inputType}
          label={label}
          helperText={helperText}
          error={error}
          required={required}
          variant="outlined"
          fullWidth
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
          }}
          InputProps={{
            startAdornment: startIcon && (
              <InputAdornment position="start">
                <Box
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: '1.25rem',
                  }}
                >
                  {startIcon}
                </Box>
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {showPasswordToggle && type === 'password' && (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePassword}
                      edge="end"
                      size="small"
                      sx={{ mr: endIcon ? 1 : 0 }}
                    >
                      {showPassword ? (
                        <VisibilityOff
                          sx={{
                            fontSize: '1.25rem',
                            color: theme.palette.text.secondary,
                          }}
                        />
                      ) : (
                        <Visibility
                          sx={{
                            fontSize: '1.25rem',
                            color: theme.palette.text.secondary,
                          }}
                        />
                      )}
                    </IconButton>
                  </InputAdornment>
                )}
                {endIcon && (
                  <InputAdornment position="end">
                    <Box
                      sx={{
                        color: theme.palette.text.secondary,
                        fontSize: '1.25rem',
                      }}
                    >
                      {endIcon}
                    </Box>
                  </InputAdornment>
                )}
              </>
            ),
          }}
        />
      </motion.div>
    )
  }
)

FormInput.displayName = 'FormInput'
