import { useEffect, useMemo, useState } from 'react'

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

export function AnimatedNumber(props: { value: number; durationMs?: number; format?: (n: number) => string }) {
  const { value, durationMs = 650, format } = props
  const [display, setDisplay] = useState(0)

  const fmt = useMemo(() => format ?? ((n: number) => n.toLocaleString()), [format])

  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const from = display
    const to = value
    const delta = to - from
    const dur = Math.max(250, durationMs)

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur)
      const v = from + delta * easeOutCubic(t)
      setDisplay(v)
      if (t < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, durationMs])

  return <>{fmt(Math.round(display))}</>
}

