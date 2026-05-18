import type { CSSProperties } from 'react'
import type { AuditActionType } from '@/types/api/audit'

export const actionBadgeStyle = (action: string): CSSProperties => {
  const key = action.toUpperCase()
  switch (key as AuditActionType) {
    case 'CREATE':
    case 'ONLINE':
      return { background: '#0d2b1a', color: '#4caf7d' }
    case 'UPDATE':
      return { background: '#172d4a', color: '#4f9cf9' }
    case 'DELETE':
      return { background: '#2b1616', color: '#e06060' }
    case 'OFFLINE':
      return { background: '#222428', color: '#555a63' }
    case 'LOGIN_FAIL':
      return { background: '#2b1a00', color: '#e8a838' }
    default:
      return { background: 'var(--color-btn-hover)', color: 'var(--color-text-muted)' }
  }
}

export const DATA_TYPE_OPTIONS = ['DGU', 'ZONE', 'ALARM', 'ADAM'] as const

export const ACTION_TYPE_OPTIONS = [
  'CREATE',
  'UPDATE',
  'DELETE',
  'ONLINE',
  'OFFLINE',
  'LOGIN_FAIL',
] as const
