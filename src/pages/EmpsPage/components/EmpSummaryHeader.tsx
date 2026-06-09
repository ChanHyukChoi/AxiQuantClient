import { BadgeCheck, Plus } from 'lucide-react'
import { Badge } from '@/components/primitive/Badge'
import { empDeptLabel, empLvLabel } from '@/pages/EmpsPage/utils/empHelpers'

/** 추가·수정·조회 모드 공통 — Badge 행 포함 고정 높이 */
export const EMP_SUMMARY_HEIGHT = 108

const FONT_SIZE = 15

interface EmpSummaryHeaderProps {
  mode: 'empty' | 'create' | 'view' | 'edit'
  name?: string
  dept?: number
  lv?: number
  empId?: number
}

export const EmpSummaryHeader = ({
  mode,
  name,
  dept = 0,
  lv = 0,
  empId,
}: EmpSummaryHeaderProps) => {
  if (mode === 'empty') {
    return (
      <div className="pb-3 w-full min-w-0" style={{ minHeight: EMP_SUMMARY_HEIGHT + 12 }}>
        <div
          className="w-full min-w-0 flex items-center justify-center"
          style={{
            minHeight: EMP_SUMMARY_HEIGHT,
            border: '0.5px solid var(--color-border)',
            borderRadius: 8,
            background: 'var(--color-bg)',
            padding: '12px 14px',
          }}
        >
          <span style={{ color: 'var(--color-text-subtle)', fontSize: FONT_SIZE }}>
            목록에서 항목을 선택하세요
          </span>
        </div>
      </div>
    )
  }

  const isCreate = mode === 'create'
  const displayName = isCreate
    ? name?.trim()
      ? name.trim()
      : '사용자 추가'
    : (name?.trim() || '—')
  const deptLabel = empDeptLabel(dept)
  const lvLabel = empLvLabel(lv)
  const subtitle = isCreate
    ? name?.trim()
      ? `${deptLabel} · ${lvLabel}`
      : '새 사용자 정보를 입력하세요'
    : `${deptLabel} · ${lvLabel}`

  return (
    <div className="pb-3 w-full min-w-0">
      <div
        className="w-full min-w-0 flex flex-col"
        style={{
          minHeight: EMP_SUMMARY_HEIGHT,
          border: '0.5px solid var(--color-border)',
          borderRadius: 8,
          background: 'var(--color-bg)',
          padding: '12px 14px',
        }}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          {isCreate ? (
            <Plus
              size={16}
              className="flex-shrink-0"
              style={{ color: 'var(--color-accent)' }}
            />
          ) : (
            <BadgeCheck
              size={16}
              className="flex-shrink-0"
              style={{ color: 'var(--color-accent)' }}
            />
          )}
          <span
            className="font-medium leading-tight truncate min-w-0"
            style={{ color: 'var(--color-text)', fontSize: 20 }}
          >
            {displayName}
          </span>
        </div>
        <span
          className="block leading-tight mt-1 truncate"
          style={{
            color: 'var(--color-text-muted)',
            paddingLeft: 22,
            fontSize: FONT_SIZE,
          }}
        >
          {subtitle}
        </span>
        <div
          className="flex justify-end items-center mt-2 gap-1.5 flex-shrink-0"
          style={{ minHeight: 24 }}
        >
          {dept !== 0 ? <Badge variant="card">부서 {deptLabel}</Badge> : null}
          {!isCreate && empId != null ? (
            <Badge variant="off">#{empId}</Badge>
          ) : null}
        </div>
      </div>
    </div>
  )
}
