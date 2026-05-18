/** AdminClient(WPF) 호환: JSON에 구·신 프로퍼티명이 섞여 올 때 숫자 필드 추출 */

export const firstNumber = (row: Record<string, unknown>, keys: string[]): number => {
  for (const k of keys) {
    const v = row[k]
    if (typeof v === 'number' && Number.isFinite(v)) return Math.trunc(v)
    if (typeof v === 'string' && v.trim() !== '') {
      const n = Number(v)
      if (Number.isFinite(n)) return Math.trunc(n)
    }
  }
  return 0
}

export const optionalString = (row: Record<string, unknown>, key: string): string | undefined => {
  const v = row[key]
  return typeof v === 'string' ? v : undefined
}

export const asRecordArray = (data: unknown): Record<string, unknown>[] =>
  Array.isArray(data) ? (data as Record<string, unknown>[]) : []
