export interface PagedDateParams {
  startAt: string
  endAt: string
  page: number
  pageSize: number
}

export const filterPagedByDate = <T>(
  items: T[],
  params: PagedDateParams,
  getIso: (item: T) => string,
): { items: T[]; total: number } => {
  const start = new Date(params.startAt).getTime()
  const end = new Date(params.endAt).getTime()

  const filtered = items
    .filter((item) => {
      const t = new Date(getIso(item)).getTime()
      return t >= start && t <= end
    })
    .sort((a, b) => new Date(getIso(b)).getTime() - new Date(getIso(a)).getTime())

  const total = filtered.length
  const offset = Math.max(0, (params.page - 1) * params.pageSize)
  return {
    items: filtered.slice(offset, offset + params.pageSize),
    total,
  }
}
