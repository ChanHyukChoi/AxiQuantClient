export interface LinkageWhenRow {
  id: number
  event: string
  controller: string
  device: string
  formula: string
  invert: boolean
}

export interface LinkageThenRow {
  id: number
  function: string
  controller: string
  device: string
  mode: string
}

export interface LinkageRule {
  id: number
  name: string
  active: boolean
  when: LinkageWhenRow[]
  then: LinkageThenRow[]
}
