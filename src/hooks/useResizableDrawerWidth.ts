import { useCallback, useEffect, useRef, useState } from 'react'

export const SPLIT_HANDLE_WIDTH = 6

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

const readStoredWidth = (storageKey: string | undefined, fallback: number): number => {
  if (!storageKey) return fallback
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return fallback
    const n = Number(raw)
    return Number.isFinite(n) ? n : fallback
  } catch {
    return fallback
  }
}

interface UseResizableDrawerWidthOptions {
  containerRef: React.RefObject<HTMLDivElement | null>
  minMainWidth: number
  minDrawerWidth: number
  defaultDrawerWidth: number
  storageKey?: string
}

export const useResizableDrawerWidth = ({
  containerRef,
  minMainWidth,
  minDrawerWidth,
  defaultDrawerWidth,
  storageKey,
}: UseResizableDrawerWidthOptions) => {
  const [drawerWidth, setDrawerWidth] = useState(() =>
    readStoredWidth(storageKey, defaultDrawerWidth),
  )
  const [maxDrawerWidth, setMaxDrawerWidth] = useState(defaultDrawerWidth)
  const maxRef = useRef(maxDrawerWidth)

  useEffect(() => {
    maxRef.current = maxDrawerWidth
  }, [maxDrawerWidth])

  const recomputeBounds = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    const max = Math.max(
      minDrawerWidth,
      el.clientWidth - minMainWidth - SPLIT_HANDLE_WIDTH,
    )
    setMaxDrawerWidth(max)
    setDrawerWidth((w) => clamp(w, minDrawerWidth, max))
  }, [containerRef, minDrawerWidth, minMainWidth])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    recomputeBounds()
    const ro = new ResizeObserver(() => recomputeBounds())
    ro.observe(el)
    return () => ro.disconnect()
  }, [containerRef, recomputeBounds])

  useEffect(() => {
    if (!storageKey) return
    try {
      localStorage.setItem(storageKey, String(drawerWidth))
    } catch {
      /* ignore quota */
    }
  }, [drawerWidth, storageKey])

  const onResizePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault()
      const startX = e.clientX
      const startWidth = drawerWidth

      const onMove = (ev: PointerEvent) => {
        const next = startWidth + (startX - ev.clientX)
        setDrawerWidth(clamp(next, minDrawerWidth, maxRef.current))
      }

      const onUp = () => {
        document.removeEventListener('pointermove', onMove)
        document.removeEventListener('pointerup', onUp)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }

      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
      document.addEventListener('pointermove', onMove)
      document.addEventListener('pointerup', onUp)
    },
    [drawerWidth, minDrawerWidth],
  )

  return { drawerWidth, maxDrawerWidth, onResizePointerDown }
}
