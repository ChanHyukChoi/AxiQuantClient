import { Badge } from '@/components/primitive/Badge'
import { EmpPhotoSlot } from '@/pages/EmpsPage/components/EmpPhotoSlot'
import { empDeptLabel, empNoDisplay } from '@/pages/EmpsPage/utils/empHelpers'

/** 학생증형 — 사진 + 이름·사번·부서 뱃지 */
export const EMP_SUMMARY_HEIGHT = 126

const FONT_SIZE = 15

interface EmpSummaryHeaderProps {
  mode: 'empty' | 'create' | 'view' | 'edit'
  name?: string
  empNo?: string
  dept?: number
  photoUrl?: string
  photoEditable?: boolean
  photoLoading?: boolean
  onPhotoFileSelect?: (file: File) => void
  onPhotoClear?: () => void
}

export const EmpSummaryHeader = ({
  mode,
  name,
  empNo,
  dept = 0,
  photoUrl,
  photoEditable = false,
  photoLoading = false,
  onPhotoFileSelect,
  onPhotoClear,
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
  const noLabel = isCreate
    ? empNo?.trim()
      ? empNoDisplay(empNo)
      : '새 사용자 정보를 입력하세요'
    : empNoDisplay(empNo)
  const deptLabel = empDeptLabel(dept)

  return (
    <div className="pb-3 w-full min-w-0">
      <div
        className="w-full min-w-0"
        style={{
          minHeight: EMP_SUMMARY_HEIGHT,
          border: '0.5px solid var(--color-border)',
          borderRadius: 8,
          background: 'var(--color-bg)',
          padding: '12px 14px',
        }}
      >
        <div className="flex gap-3 items-stretch min-w-0">
          <EmpPhotoSlot
            variant="drawer"
            photoUrl={photoUrl}
            editable={photoEditable}
            loading={photoLoading}
            onFileSelect={onPhotoFileSelect}
            onClear={onPhotoClear}
          />
          <div className="flex flex-col flex-1 min-w-0 justify-between">
            <div className="min-w-0">
              <span
                className="font-medium leading-tight truncate block min-w-0"
                style={{ color: 'var(--color-text)', fontSize: 20 }}
              >
                {displayName}
              </span>
              <span
                className={[
                  'block leading-tight mt-1.5 truncate',
                  !isCreate || empNo?.trim() ? 'font-mono' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                style={{
                  color: 'var(--color-text-muted)',
                  fontSize: FONT_SIZE,
                }}
              >
                {noLabel}
              </span>
            </div>
            {dept !== 0 ? (
              <div className="flex justify-end items-center mt-2 flex-shrink-0">
                <Badge variant="card">부서 {deptLabel}</Badge>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
