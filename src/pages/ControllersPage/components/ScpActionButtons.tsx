import { Check, Pencil, RotateCcw, Trash2, X } from 'lucide-react'
import { Button } from '@/components/primitive/Button'

interface ScpActionButtonsProps {
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

export const ScpActionButtons = ({
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
}: ScpActionButtonsProps) => {
  if (!hasScp) return null

  if (editMode) {
    return (
      <div className="flex justify-end gap-1.5">
        <Button variant="default" size="sm" leftIcon={<X size={12} />} onClick={onCancel}>
          취소
        </Button>
        <Button
          variant="accent"
          size="sm"
          leftIcon={<Check size={12} />}
          loading={isSaving}
          onClick={onSave}
        >
          저장
        </Button>
      </div>
    )
  }

  return (
    <div className="flex justify-end gap-1.5 flex-wrap">
      <Button
        variant="default"
        size="sm"
        leftIcon={<RotateCcw size={12} />}
        loading={isResetting}
        onClick={onReset}
      >
        초기화
      </Button>
      <Button
        variant="danger"
        size="sm"
        leftIcon={<Trash2 size={12} />}
        onClick={onDelete}
      >
        삭제
      </Button>
      <Button
        variant="accent"
        size="sm"
        leftIcon={<Pencil size={12} />}
        onClick={onEdit}
      >
        수정
      </Button>
    </div>
  )
}
