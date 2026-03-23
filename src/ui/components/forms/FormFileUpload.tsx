import { forwardRef, useState, useCallback } from 'react'
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  alpha,
  Paper,
  Stack,
} from '@mui/material'
import {
  CloudUpload,
  Delete,
  InsertDriveFile,
  Image,
  Description,
} from '@mui/icons-material'
import { motion } from 'framer-motion'

export interface FileUploadItem {
  id: string
  name: string
  size: number
  type: string
  preview?: string
}

export interface FormFileUploadProps {
  label?: string
  helperText?: string
  error?: boolean
  required?: boolean
  accept?: string
  multiple?: boolean
  maxSize?: number // in bytes
  maxFiles?: number
  value?: FileUploadItem[]
  onChange?: (files: FileUploadItem[]) => void
  disabled?: boolean
}

export const FormFileUpload = forwardRef<HTMLDivElement, FormFileUploadProps>(
  (
    {
      label,
      helperText,
      error,
      required,
      accept,
      multiple = false,
      maxSize = 10 * 1024 * 1024, // 10MB
      maxFiles = 5,
      value = [],
      onChange,
      disabled = false,
    },
    ref
  ) => {
    const theme = useTheme()
    const [isDragOver, setIsDragOver] = useState(false)

    const handleDragOver = useCallback((e: React.DragEvent) => {
      e.preventDefault()
      if (!disabled) {
        setIsDragOver(true)
      }
    }, [disabled])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
    }, [])

    const handleDrop = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)

        if (disabled) return

        const files = Array.from(e.dataTransfer.files)
        processFiles(files)
      },
      [disabled]
    )

    const handleFileSelect = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled) return

        const files = Array.from(e.target.files || [])
        processFiles(files)
      },
      [disabled]
    )

    const processFiles = useCallback(
      (files: File[]) => {
        const validFiles = files.filter((file) => {
          // Check file size
          if (file.size > maxSize) {
            return false
          }

          // Check file type if accept is specified
          if (accept) {
            const acceptTypes = accept.split(',').map((type) => type.trim())
            const isValidType = acceptTypes.some((type) => {
              if (type.startsWith('.')) {
                return file.name.toLowerCase().endsWith(type.toLowerCase())
              }
              return file.type.match(new RegExp(type.replace('*', '.*')))
            })
            if (!isValidType) {
              return false
            }
          }

          return true
        })

        const newFiles: FileUploadItem[] = validFiles.map((file) => {
          const preview = file.type.startsWith('image/')
            ? URL.createObjectURL(file)
            : undefined

          return {
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: file.size,
            type: file.type,
            preview,
          }
        })

        const updatedFiles = multiple ? [...value, ...newFiles].slice(0, maxFiles) : newFiles
        onChange?.(updatedFiles)
      },
      [value, multiple, maxFiles, maxSize, accept, onChange]
    )

    const removeFile = useCallback(
      (fileId: string) => {
        const updatedFiles = value.filter((file) => file.id !== fileId)
        onChange?.(updatedFiles)
      },
      [value, onChange]
    )

    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const getFileIcon = (type: string) => {
      if (type.startsWith('image/')) return <Image />
      if (type.includes('pdf')) return <Description />
      return <InsertDriveFile />
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        ref={ref}
      >
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

        {/* Upload Area */}
        <Paper
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          sx={{
            border: `2px dashed ${
              error
                ? theme.palette.error.main
                : isDragOver
                ? theme.palette.primary.main
                : alpha(theme.palette.divider, 0.5)
            }`,
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            backgroundColor: isDragOver
              ? alpha(theme.palette.primary.main, 0.04)
              : disabled
              ? alpha(theme.palette.action.disabled, 0.1)
              : theme.palette.background.paper,
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease-in-out',
            ...(!disabled && {
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.02),
                borderColor: alpha(theme.palette.primary.main, 0.5),
              },
            }),
          }}
        >
          <input
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileSelect}
            disabled={disabled}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
          />
          
          <Stack alignItems="center" spacing={2}>
            <CloudUpload
              sx={{
                fontSize: '3rem',
                color: isDragOver
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
              }}
            />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {isDragOver ? 'Drop files here' : 'Click to upload or drag and drop'}
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                {accept && `Accepts: ${accept}`}
                {accept && ' • '}
                Max size: {formatFileSize(maxSize)}
                {multiple && ` • Max ${maxFiles} files`}
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* File List */}
        {value.length > 0 && (
          <Box sx={{ mt: 2 }}>
            {value.map((file, index) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Paper
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    mb: 1,
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                    borderRadius: 2,
                  }}
                >
                  {file.preview ? (
                    <Box
                      component="img"
                      src={file.preview}
                      alt={file.name}
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1,
                        objectFit: 'cover',
                        mr: 2,
                      }}
                    />
                  ) : (
                    <Box sx={{ mr: 2, color: theme.palette.text.secondary }}>
                      {getFileIcon(file.type)}
                    </Box>
                  )}
                  
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      sx={{ 
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {file.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: theme.palette.text.secondary }}
                    >
                      {formatFileSize(file.size)}
                    </Typography>
                  </Box>
                  
                  <IconButton
                    size="small"
                    onClick={() => removeFile(file.id)}
                    disabled={disabled}
                    sx={{ ml: 1 }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Paper>
              </motion.div>
            ))}
          </Box>
        )}

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
      </motion.div>
    )
  }
)

FormFileUpload.displayName = 'FormFileUpload'
