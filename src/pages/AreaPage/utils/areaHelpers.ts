import type { AreaInfo } from '@/types/api'

export const isAreaActive = (active: number): boolean => active !== 0

export const occupancyRatio = (occup: number, occmax: number): number => {
  if (!Number.isFinite(occup) || !Number.isFinite(occmax) || occmax <= 0) return 0
  return Math.min(1, Math.max(0, occup / occmax))
}

export const occupancyPercent = (occup: number, occmax: number): number =>
  Math.round(occupancyRatio(occup, occmax) * 100)

export const areaToUpdatePayload = (area: AreaInfo): Omit<AreaInfo, 'id'> => {
  const { id, ...rest } = area
  void id
  return rest
}
