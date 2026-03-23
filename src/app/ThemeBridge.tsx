import { useMemo, type PropsWithChildren } from 'react'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { useAppSelector } from './hooks'
import { buildTheme } from './theme'

export function ThemeBridge(props: PropsWithChildren) {
  const mode = useAppSelector((s) => s.ui.themeMode)
  const theme = useMemo(() => buildTheme(mode), [mode])
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {props.children}
    </ThemeProvider>
  )
}

