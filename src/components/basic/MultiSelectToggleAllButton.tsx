import { useTranslation } from 'react-i18next'
import { ListChecks, ListX } from 'lucide-react'

interface MultiSelectToggleAllButtonProps {
  /** 하나라도 선택됨 → 전체 해제, 없음 → 전체 선택 */
  hasSelection: boolean
  onSelectAll: () => void
  onDeselectAll: () => void
  disabled?: boolean
}

export const MultiSelectToggleAllButton = ({
  hasSelection,
  onSelectAll,
  onDeselectAll,
  disabled = false,
}: MultiSelectToggleAllButtonProps) => {
  const { t } = useTranslation('common')
  const label = hasSelection ? t('deselectAll') : t('selectAll')

  return (
    <button
      type="button"
      disabled={disabled}
      title={label}
      aria-label={label}
      className="app-multi-select-toggle-all"
      onClick={hasSelection ? onDeselectAll : onSelectAll}
    >
      {hasSelection ? (
        <ListX size={15} style={{ color: 'var(--color-icon)' }} />
      ) : (
        <ListChecks size={15} style={{ color: 'var(--color-icon)' }} />
      )}
    </button>
  )
}
