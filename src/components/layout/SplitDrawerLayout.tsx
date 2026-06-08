import { useRef } from 'react'
import {
  SPLIT_HANDLE_WIDTH,
  useResizableDrawerWidth,
} from '@/hooks/ui/useResizableDrawerWidth'

interface SplitDrawerLayoutProps {
  main: React.ReactNode
  drawer: React.ReactNode
  /** Grid/List 등 메인 영역 최소 폭(px) */
  minMainWidth: number
  minDrawerWidth?: number
  defaultDrawerWidth?: number
  storageKey?: string
}

const DEFAULT_MIN_DRAWER = 320
const DEFAULT_DRAWER_WIDTH = 400

export const SplitDrawerLayout = ({
  main,
  drawer,
  minMainWidth,
  minDrawerWidth = DEFAULT_MIN_DRAWER,
  defaultDrawerWidth = DEFAULT_DRAWER_WIDTH,
  storageKey,
}: SplitDrawerLayoutProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { drawerWidth, maxDrawerWidth, onResizePointerDown } = useResizableDrawerWidth({
    containerRef,
    minMainWidth,
    minDrawerWidth,
    defaultDrawerWidth,
    storageKey,
  })

  return (
    <div
      ref={containerRef}
      className="flex flex-1 overflow-hidden min-h-0 min-w-0"
    >
      <div
        className="flex flex-col flex-1 min-w-0 overflow-hidden"
        style={{ minWidth: minMainWidth }}
      >
        {main}
      </div>

      <div
        className="flex flex-row flex-shrink-0 overflow-hidden h-full"
        style={{
          width: drawerWidth + SPLIT_HANDLE_WIDTH,
          minWidth: minDrawerWidth + SPLIT_HANDLE_WIDTH,
          maxWidth: maxDrawerWidth + SPLIT_HANDLE_WIDTH,
        }}
      >
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="패널 너비 조절"
          onPointerDown={onResizePointerDown}
          className="flex-shrink-0 touch-none self-stretch"
          style={{
            width: SPLIT_HANDLE_WIDTH,
            cursor: 'col-resize',
            background: 'var(--color-sidebar)',
            borderLeft: '0.5px solid var(--color-border)',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLDivElement).style.background =
              'var(--color-btn-hover)'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLDivElement).style.background =
              'var(--color-sidebar)'
          }}
        />

        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {drawer}
        </div>
      </div>
    </div>
  )
}
