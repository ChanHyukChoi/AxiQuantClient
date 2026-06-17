import { useTranslation } from 'react-i18next'
import { Check, Pencil, Trash2, X } from 'lucide-react'
import { Button } from '@/components/primitive/Button'

export interface CrudDetailActionsProps {
  editMode: boolean
  disabled?: boolean
  isSaving?: boolean
  isDeleting?: boolean
  onEdit?: () => void
  onDelete?: () => void
  onSave?: () => void
  onCancel?: () => void
}

export const CrudDetailActions = ({
  editMode,
  disabled = false,
  isSaving = false,
  isDeleting = false,
  onEdit,
  onDelete,
  onSave,
  onCancel,
}: CrudDetailActionsProps) => {
  const { t } = useTranslation('common')

  if (editMode) {
    return (
      <div className="flex items-center gap-1.5 shrink-0">
        <Button
          variant="default"
          size="sm"
          leftIcon={<X size={12} />}
          disabled={disabled}
          onClick={onCancel}
        >
          {t('cancel')}
        </Button>
        <Button
          variant="accent"
          size="sm"
          leftIcon={<Check size={12} />}
          loading={isSaving}
          disabled={disabled}
          onClick={onSave}
        >
          {t('save')}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <Button
        variant="danger"
        size="sm"
        leftIcon={<Trash2 size={12} />}
        loading={isDeleting}
        disabled={disabled}
        onClick={onDelete}
      >
        {t('delete')}
      </Button>
      <Button
        variant="accent"
        size="sm"
        leftIcon={<Pencil size={12} />}
        disabled={disabled}
        onClick={onEdit}
      >
        {t('edit')}
      </Button>
    </div>
  )
}
