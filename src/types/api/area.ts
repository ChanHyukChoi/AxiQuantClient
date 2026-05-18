export interface AreaInfo {
  id: number
  name: string
  active: number
  multiocc: number
  occset: number
  occmax: number
  occup: number
  occdown: number
  flags: number
  ext: string
}

export type CreateAreaRequest = Omit<AreaInfo, 'id'>
export type UpdateAreaRequest = Omit<AreaInfo, 'id'>
