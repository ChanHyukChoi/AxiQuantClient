export type DatePreset = 'today' | '7d' | '30d' | '180d' | 'custom'

export const toIsoStart = (d: Date): string => {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x.toISOString()
}

export const toIsoEnd = (d: Date): string => {
  const x = new Date(d)
  x.setHours(23, 59, 59, 999)
  return x.toISOString()
}

export const presetRange = (preset: Exclude<DatePreset, 'custom'>): { startAt: string; endAt: string } => {
  const end = new Date()
  const start = new Date()
  if (preset === 'today') {
    // start is today 00:00
  } else if (preset === '7d') {
    start.setDate(start.getDate() - 7)
  } else if (preset === '30d') {
    start.setDate(start.getDate() - 30)
  } else {
    start.setDate(start.getDate() - 180)
  }
  return { startAt: toIsoStart(start), endAt: toIsoEnd(end) }
}

export const formatDateInput = (d: Date): string => {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export const parseDateInput = (s: string): Date | null => {
  const d = new Date(`${s}T00:00:00`)
  return Number.isNaN(d.getTime()) ? null : d
}
