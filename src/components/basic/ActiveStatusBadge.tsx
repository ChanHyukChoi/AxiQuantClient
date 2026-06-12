import { Badge } from '@/components/primitive/Badge'

interface ActiveStatusBadgeProps {
  active: boolean
}

/** 상세 타이틀바 등 — 선택 항목의 활성 상태 1회 표시용 */
export const ActiveStatusBadge = ({ active }: ActiveStatusBadgeProps) => (
  <Badge variant={active ? 'on' : 'off'}>{active ? '활성' : '비활성'}</Badge>
)

/** Grid 활성 컬럼 — 목록 스캔용 최소 표시 (pill 뱃지 대신) */
export const ActiveGridMark = ({ active }: { active: boolean }) =>
  active ? <span style={{ color: 'var(--color-accent)' }}>✓</span> : null
