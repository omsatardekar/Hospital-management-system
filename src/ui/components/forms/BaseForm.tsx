import { type ReactNode } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Stack,
  useTheme,
  alpha,
} from '@mui/material'
import { motion } from 'framer-motion'

export interface FormSectionProps {
  title: string
  description?: string
  children: ReactNode
}

export function FormSection({ title, description, children }: FormSectionProps) {
  const theme = useTheme()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box sx={{ mb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              mb: description ? 0.5 : 0,
              fontSize: '1.125rem',
            }}
          >
            {title}
          </Typography>
          {description && (
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '0.875rem',
              }}
            >
              {description}
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 3,
          }}
        >
          {children}
        </Box>
      </Box>
    </motion.div>
  )
}

export interface BaseFormProps {
  title: string
  subtitle?: string
  children: ReactNode
  actions?: ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
}

export function BaseForm({
  title,
  subtitle,
  children,
  actions,
  maxWidth = 'lg',
}: BaseFormProps) {
  const theme = useTheme()

  const maxWidthMap = {
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Card
        sx={{
          maxWidth: maxWidthMap[maxWidth],
          mx: 'auto',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          overflow: 'visible',
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
          {/* Header */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: subtitle ? 1 : 0,
                fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: '1rem',
                  maxWidth: 600,
                  mx: 'auto',
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>

          {/* Form Content */}
          <Box sx={{ mb: 4 }}>{children}</Box>

          {/* Actions */}
          {actions && (
            <>
              <Divider sx={{ mb: 3 }} />
              <Stack
                direction="row"
                spacing={2}
                justifyContent="flex-end"
                sx={{ px: 1 }}
              >
                {actions}
              </Stack>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export interface FormFieldWrapperProps {
  label?: string
  helperText?: string
  error?: boolean
  required?: boolean
  children: ReactNode
  fullWidth?: boolean
  sx?: any
}

export function FormFieldWrapper({
  label,
  helperText,
  error,
  required,
  children,
  fullWidth = true,
  sx,
}: FormFieldWrapperProps) {
  const theme = useTheme()

  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto', ...sx }}>
      {label && (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            color: theme.palette.text.primary,
            mb: 1,
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          {label}
          {required && (
            <Typography
              component="span"
              sx={{
                color: theme.palette.error.main,
                fontSize: '0.75rem',
              }}
            >
              *
            </Typography>
          )}
        </Typography>
      )}

      {children}

      {helperText && (
        <Typography
          variant="caption"
          sx={{
            color: error ? theme.palette.error.main : theme.palette.text.secondary,
            mt: 0.5,
            display: 'block',
            fontSize: '0.75rem',
            lineHeight: 1.4,
          }}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  )
}
