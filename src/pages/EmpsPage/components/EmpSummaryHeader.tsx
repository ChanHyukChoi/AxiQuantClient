import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/primitive/Badge'
import { DrawerSelectPrompt } from '@/components/basic/DrawerSelectPrompt'
import { DrawerSummaryCardShell } from '@/components/basic/DrawerSummaryCardShell'
import { EmpPhotoSlot } from '@/pages/EmpsPage/components/EmpPhotoSlot'
import { empDeptLabel, empNoDisplay } from '@/pages/EmpsPage/utils/empHelpers'
import { DRAWER_SUMMARY_CARD_HEIGHT } from '@/lib/layout/splitDrawerDefaults'

/** @deprecated DRAWER_SUMMARY_CARD_HEIGHT 사용 */
export const EMP_SUMMARY_HEIGHT = DRAWER_SUMMARY_CARD_HEIGHT

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
  const { t } = useTranslation(['emp', 'common'])

  if (mode === 'empty') {
    return (
      <DrawerSummaryCardShell centerContent>
        <DrawerSelectPrompt message={t('common:selectRow')} compact />
      </DrawerSummaryCardShell>
    )
  }

  const isCreate = mode === 'create'
  const displayName = isCreate
    ? name?.trim()
      ? name.trim()
      : t('emp:summary.addTitle')
    : (name?.trim() || t('common:empty'))
  const noLabel = isCreate
    ? empNo?.trim()
      ? empNoDisplay(empNo)
      : t('common:empty')
    : empNoDisplay(empNo)
  const deptLabel = empDeptLabel(dept)

  return (
    <DrawerSummaryCardShell>
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
              <Badge variant="card">{t('emp:summary.deptBadge', { dept: deptLabel })}</Badge>
            </div>
          ) : (
            <div className="flex-shrink-0" style={{ minHeight: 24 }} aria-hidden />
          )}
        </div>
      </div>
    </DrawerSummaryCardShell>
  )
}
