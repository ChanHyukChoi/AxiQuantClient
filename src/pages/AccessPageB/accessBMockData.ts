import type { AccLvReaderRow } from '@/pages/AccessPage/utils/accLvHelpers'

/** 2안 목업 — 선택 ID별 연결 리더 샘플 */
export const MOCK_ACCLV_READERS: Record<number, AccLvReaderRow[]> = {
  4: [
    {
      scpId: 1,
      scpName: 'KIT_UP1000',
      readerId: 1,
      readerName: 'UP1000-001 (AMICO)',
      timezoneId: 1,
      timezoneName: 'Always',
    },
  ],
  10: [
    {
      scpId: 1,
      scpName: 'KIT_UP1000',
      readerId: 1,
      readerName: 'UP1000-001 (AMICO)',
      timezoneId: 1,
      timezoneName: 'Always',
    },
    {
      scpId: 2,
      scpName: 'KIT_DN2000',
      readerId: 3,
      readerName: 'DN2000-002',
      timezoneId: 2,
      timezoneName: 'Weekday',
    },
  ],
}

export const mockReadersForAccLv = (accLvId: number): AccLvReaderRow[] =>
  MOCK_ACCLV_READERS[accLvId] ?? []
