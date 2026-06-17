import { useTranslation } from 'react-i18next'
import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/primitive/Button'
import { CrudDetailActions } from '@/components/page-actions'

interface ScpTitleActionsProps {
  hasScp: boolean
  editMode: boolean
  isSaving?: boolean
  isDeleting?: boolean
  isResetting?: boolean
  onEdit: () => void
  onCancel: () => void
  onSave: () => void
  onDelete: () => void
  onReset: () => void
}

export const ScpTitleActions = ({
  hasScp,
  editMode,
  isSaving = false,
  isDeleting = false,
  isResetting = false,
  onEdit,
  onCancel,
  onSave,
  onDelete,
  onReset,
}: ScpTitleActionsProps) => {
  const { t } = useTranslation('common')

  if (!hasScp) return null

  if (editMode) {
    return (
      <CrudDetailActions
        editMode
        isSaving={isSaving}
        onCancel={onCancel}
        onSave={onSave}
      />
    )
  }

  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <Button
        variant="default"
        size="sm"
        leftIcon={<RotateCcw size={12} />}
        loading={isResetting}
        onClick={onReset}
      >
        {t('reset')}
      </Button>
      <CrudDetailActions
        editMode={false}
        isDeleting={isDeleting}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  )
}
