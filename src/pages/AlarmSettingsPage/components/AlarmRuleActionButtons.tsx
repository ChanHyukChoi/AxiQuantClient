import { Check, Pencil, Plus, Trash2, X } from 'lucide-react'
import { Button } from '@/components/primitive/Button'

interface AlarmRuleActionButtonsProps {
  hasRule: boolean
  editMode: boolean
  isSaving?: boolean
  isDeleting?: boolean
  isAdding?: boolean
  onAdd: () => void
  onEdit: () => void
  onCancel: () => void
  onSave: () => void
  onDelete: () => void
  /** B안: 추가 버튼을 항상 표시 */
  showAddAlways?: boolean
}

export const AlarmRuleActionButtons = ({
  hasRule,
  editMode,
  isSaving = false,
  isDeleting = false,
  isAdding = false,
  onAdd,
  onEdit,
  onCancel,
  onSave,
  onDelete,
  showAddAlways = false,
}: AlarmRuleActionButtonsProps) => {
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
    <div className="flex justify-end gap-1.5">
      {showAddAlways || !hasRule ? (
        <Button
          variant="accent"
          size="sm"
          leftIcon={<Plus size={12} />}
          loading={isAdding}
          onClick={onAdd}
        >
          추가
        </Button>
      ) : null}
      {hasRule ? (
        <>
          <Button
            variant="danger"
            size="sm"
            leftIcon={<Trash2 size={12} />}
            loading={isDeleting}
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
        </>
      ) : null}
    </div>
  )
}
