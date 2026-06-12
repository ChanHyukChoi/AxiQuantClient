import { filterPagedByDate } from '@/lib/mock/pagedDateFilter'
import type { AuditLogItem, AuditLogParams, PagedAuditLogResponse } from '@/types/api/audit'

const forceMock = import.meta.env.VITE_AUDIT_MOCK === 'true'

type MockAuditRow = AuditLogItem & { userId: number }

const atOffset = (daysAgo: number, hours: number, minutes: number): string => {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  d.setHours(hours, minutes, 0, 0)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

const toIsoFromTs = (ts: string): string => {
  const d = new Date(ts.replace(' ', 'T'))
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString()
}

const MOCK_AUDIT_ROWS: MockAuditRow[] = [
  {
    id: 1,
    userId: 1,
    ts: atOffset(0, 9, 5),
    user: '관리자',
    clientType: 'Web',
    actionType: 'CREATE',
    dataType: 'ALARM',
    controller: 'SCP-01',
    data: '경보 규칙 「Door Forced」 등록',
  },
  {
    id: 2,
    userId: 2,
    ts: atOffset(0, 8, 40),
    user: 'catis',
    clientType: 'Desktop',
    actionType: 'UPDATE',
    dataType: 'ZONE',
    controller: 'DGU-01',
    data: 'ZONE A 설정 변경',
  },
  {
    id: 3,
    userId: 1,
    ts: atOffset(0, 7, 15),
    user: '관리자',
    clientType: 'Web',
    actionType: 'DELETE',
    dataType: 'ADAM',
    controller: 'ADAM-01',
    data: '입력 채널 3 삭제',
  },
  {
    id: 4,
    userId: 5,
    ts: atOffset(1, 18, 30),
    user: 'operator',
    clientType: 'Web',
    actionType: 'ONLINE',
    dataType: 'DGU',
    controller: 'DGU-01',
    data: 'DGU-01 온라인',
  },
  {
    id: 5,
    userId: 3,
    ts: atOffset(1, 10, 0),
    user: 'chchoi',
    clientType: 'Desktop',
    actionType: 'UPDATE',
    dataType: 'ALARM',
    controller: 'SCP-02',
    data: '경보 우선순위 3 → 5',
  },
  {
    id: 6,
    userId: 4,
    ts: atOffset(2, 22, 10),
    user: 'gltest',
    clientType: 'Web',
    actionType: 'LOGIN_FAIL',
    dataType: 'DGU',
    controller: '—',
    data: '로그인 실패 (잘못된 비밀번호)',
  },
  {
    id: 7,
    userId: 2,
    ts: atOffset(3, 14, 50),
    user: 'catis',
    clientType: 'Desktop',
    actionType: 'OFFLINE',
    dataType: 'ADAM',
    controller: 'ADAM-01',
    data: 'ADAM-01 오프라인',
  },
  {
    id: 8,
    userId: 1,
    ts: atOffset(5, 11, 25),
    user: '관리자',
    clientType: 'Web',
    actionType: 'CREATE',
    dataType: 'ZONE',
    controller: 'DGU-01',
    data: 'ZONE C 추가',
  },
  {
    id: 9,
    userId: 5,
    ts: atOffset(7, 16, 5),
    user: 'operator',
    clientType: 'Web',
    actionType: 'UPDATE',
    dataType: 'DGU',
    controller: 'DGU-02',
    data: '통신 포트 변경',
  },
  {
    id: 10,
    userId: 3,
    ts: atOffset(10, 9, 40),
    user: 'chchoi',
    clientType: 'Desktop',
    actionType: 'DELETE',
    dataType: 'ALARM',
    controller: 'SCP-01',
    data: '미사용 경보 규칙 삭제',
  },
  {
    id: 11,
    userId: 1,
    ts: atOffset(15, 13, 0),
    user: '관리자',
    clientType: 'Web',
    actionType: 'ONLINE',
    dataType: 'DGU',
    controller: 'DGU-02',
    data: 'DGU-02 온라인',
  },
  {
    id: 12,
    userId: 2,
    ts: atOffset(20, 8, 20),
    user: 'catis',
    clientType: 'Desktop',
    actionType: 'UPDATE',
    dataType: 'ADAM',
    controller: 'ADAM-02',
    data: '입력 임계값 조정',
  },
]

const stripUserId = ({ userId: _userId, ...row }: MockAuditRow): AuditLogItem => row

export const shouldUseAuditMock = (result: PagedAuditLogResponse & { apiNotReady?: boolean }): boolean =>
  forceMock || Boolean(result.apiNotReady) || (import.meta.env.DEV && result.items.length === 0)

export const getMockAuditLog = (params: AuditLogParams): PagedAuditLogResponse => {
  let rows = MOCK_AUDIT_ROWS

  if (params.userId != null) {
    rows = rows.filter((r) => r.userId === params.userId)
  }
  if (params.actionType) {
    rows = rows.filter((r) => r.actionType === params.actionType)
  }
  if (params.dataType) {
    rows = rows.filter((r) => r.dataType === params.dataType)
  }

  const paged = filterPagedByDate(rows, params, (row) => toIsoFromTs(row.ts))
  return {
    items: paged.items.map(stripUserId),
    total: paged.total,
  }
}
