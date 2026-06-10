export interface AreaMockReaderRow {
  scpName: string
  readerName: string
}

export interface AreaMockOccupantRow {
  empId: number
  name: string
  cardNumber: string
}

/** 2안 목업 — 선택 ID별 샘플 */
export const MOCK_AREA_READERS: Record<number, AreaMockReaderRow[]> = {
  1: [
    { scpName: 'KIT_UP1000', readerName: 'UP1000-001 (입구)' },
    { scpName: 'KIT_UP1000', readerName: 'UP1000-002 (출구)' },
  ],
}

export const MOCK_AREA_OCCUPANTS: Record<number, AreaMockOccupantRow[]> = {
  1: [
    { empId: 101, name: '홍길동', cardNumber: '12345678' },
    { empId: 205, name: '김영희', cardNumber: '87654321' },
  ],
}

export const mockReadersForArea = (areaId: number): AreaMockReaderRow[] =>
  MOCK_AREA_READERS[areaId] ?? []

export const mockOccupantsForArea = (areaId: number): AreaMockOccupantRow[] =>
  MOCK_AREA_OCCUPANTS[areaId] ?? []
