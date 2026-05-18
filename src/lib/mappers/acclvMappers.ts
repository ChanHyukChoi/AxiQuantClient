import { asRecordArray, firstNumber, optionalString } from '@/lib/wire/wireJson'
import type { AccLvInfo, CreateAccLvRequest, UpdateAccLvRequest } from '@/types/api/acclv'

const parseExtDescription = (ext: string | undefined): string | undefined => {
  if (!ext?.trim()) return undefined
  try {
    const o = JSON.parse(ext) as unknown
    if (typeof o === 'object' && o !== null && !Array.isArray(o)) {
      const d = (o as Record<string, unknown>).description
      if (typeof d === 'string' && d.trim()) return d
    }
  } catch {
    if (ext.trim()) return ext
  }
  return undefined
}

const descriptionToExt = (description?: string): string => {
  if (!description?.trim()) return ''
  return JSON.stringify({ description: description.trim() })
}

export const wireToAccLvInfo = (row: Record<string, unknown>): AccLvInfo => ({
  id: firstNumber(row, ['id']),
  name: optionalString(row, 'name') ?? '',
  description:
    optionalString(row, 'description') ?? parseExtDescription(optionalString(row, 'ext')),
  active: 'active' in row ? Boolean(row.active) : undefined,
  opermode: firstNumber(row, ['opermode']) || undefined,
  escort: firstNumber(row, ['escort']) || undefined,
})

export const parseAccLvList = (data: unknown): AccLvInfo[] => {
  if (data == null) return []
  const rows = Array.isArray(data)
    ? asRecordArray(data)
    : (() => {
        if (typeof data !== 'object') return []
        const o = data as Record<string, unknown>
        return asRecordArray(o.items ?? o.data ?? o.acclv)
      })()
  return rows.map(wireToAccLvInfo)
}

export const accLvToWire = (
  acclv: CreateAccLvRequest | UpdateAccLvRequest,
  id: number,
): Record<string, unknown> => ({
  id,
  name: acclv.name,
  active: acclv.active ?? true,
  opermode: acclv.opermode ?? 0,
  escort: acclv.escort ?? 0,
  ext: descriptionToExt(acclv.description),
})
