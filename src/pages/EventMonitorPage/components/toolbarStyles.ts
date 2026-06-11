import type { TypeFilter } from '@/pages/EventMonitorPage/utils/eventFilters'
import { EVENT_MONITOR_FONT_SIZE } from '@/pages/EventMonitorPage/eventMonitorUi'

const CONTROL_H = 26

export const toolbarFilterRowClass =
  'flex items-center gap-2 px-3 py-2 min-h-[42px] flex-wrap'

export const toolbarDateRowClass =
  'flex items-center gap-2 px-3 pb-2 flex-wrap'

export const toolbarActionRowClass =
  'flex items-center gap-3 px-3 py-2 min-h-[42px] flex-nowrap'

export const pillStyle = (active: boolean, variant: TypeFilter): React.CSSProperties => {
  const base: React.CSSProperties = {
    height: CONTROL_H,
    minHeight: CONTROL_H,
    boxSizing: 'border-box',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  }
  if (!active) {
    return {
      ...base,
      background: 'transparent',
      color: 'var(--color-text-muted)',
      border: '0.5px solid var(--color-btn-default-border)',
    }
  }
  if (variant === 'access')
    return { ...base, background: '#0d2b1a', color: '#4caf7d', border: '0.5px solid #1a3d28' }
  if (variant === 'alarm')
    return { ...base, background: '#2b1616', color: '#e06060', border: '0.5px solid #3a2020' }
  return {
    ...base,
    background: 'var(--color-btn-accent-bg)',
    color: 'var(--color-accent)',
    border: '0.5px solid var(--color-btn-accent-border)',
  }
}

export const presetBtnStyle = (active: boolean): React.CSSProperties => ({
  height: CONTROL_H,
  minHeight: CONTROL_H,
  boxSizing: 'border-box',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  background: active ? 'var(--color-btn-hover)' : 'transparent',
  color: active ? 'var(--color-text)' : 'var(--color-text-muted)',
  border: '0.5px solid var(--color-btn-default-border)',
  fontSize: EVENT_MONITOR_FONT_SIZE,
  padding: '0 8px',
  borderRadius: 4,
  cursor: 'pointer',
})

export const toolbarShellStyle: React.CSSProperties = {
  background: 'var(--color-sidebar)',
  borderBottom: '0.5px solid var(--color-border)',
}

export const toolbarDateInputClass = 'app-field-control app-field-control--date-toolbar shrink-0'
