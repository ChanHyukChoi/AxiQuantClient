import type { CSSProperties, ReactNode } from 'react'
import {
  DRAWER_SUMMARY_CARD_HEIGHT,
  DRAWER_SUMMARY_OUTER_GAP,
} from '@/lib/layout/splitDrawerDefaults'

export const drawerSummaryCardStyle: CSSProperties = {
  minHeight: DRAWER_SUMMARY_CARD_HEIGHT,
  border: '0.5px solid var(--color-border)',
  borderRadius: 8,
  background: 'var(--color-bg)',
  padding: '12px 14px',
}

interface DrawerSummaryCardShellProps {
  children: ReactNode
  centerContent?: boolean
}

export const DrawerSummaryCardShell = ({
  children,
  centerContent = false,
}: DrawerSummaryCardShellProps) => (
  <div
    className="pb-3 w-full min-w-0"
    style={{ minHeight: DRAWER_SUMMARY_CARD_HEIGHT + DRAWER_SUMMARY_OUTER_GAP }}
  >
    <div
      className={[
        'w-full min-w-0',
        centerContent ? 'flex items-center justify-center' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={drawerSummaryCardStyle}
    >
      {children}
    </div>
  </div>
)
