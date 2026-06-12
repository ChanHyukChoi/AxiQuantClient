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
          취소
        </Button>
        <Button
          variant="accent"
          size="sm"
          leftIcon={<Check size={12} />}
          loading={isSaving}
          disabled={disabled}
          onClick={onSave}
        >
          저장
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
        삭제
      </Button>
      <Button
        variant="accent"
        size="sm"
        leftIcon={<Pencil size={12} />}
        disabled={disabled}
        onClick={onEdit}
      >
        수정
      </Button>
    </div>
  )
}
