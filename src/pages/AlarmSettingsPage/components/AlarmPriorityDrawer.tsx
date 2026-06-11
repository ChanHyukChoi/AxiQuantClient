import { Check, Pencil, Star, Trash2, X } from 'lucide-react'
import { Drawer } from '@/components/primitive/Drawer'
import { Button } from '@/components/primitive/Button'
import { Modal } from '@/components/primitive/Modal'
import { AlarmPriorityFormFields } from '@/pages/AlarmSettingsPage/components/AlarmPriorityFormFields'
import type { AlarmPriorityDisplay } from '@/pages/AlarmSettingsPage/alarmPriorityTypes'
import type { useAlarmPriorityEditor } from '@/pages/AlarmSettingsPage/useAlarmPriorityEditor'
import { normalizeHexColor } from '@/pages/AlarmSettingsPage/utils/alarmHelpers'

type AlarmPriorityEditor = ReturnType<typeof useAlarmPriorityEditor>

interface AlarmPriorityDrawerProps {
  item: AlarmPriorityDisplay | null
  editor: AlarmPriorityEditor
}

export const AlarmPriorityDrawer = ({ item, editor }: AlarmPriorityDrawerProps) => {
  const hex = normalizeHexColor(item?.alarmFg ?? '#4f9cf9')

  const drawerHeader = item ? (
    <div
      className="flex items-start gap-3 pb-3"
      style={{ borderBottom: '0.5px solid var(--color-border)' }}
    >
      <div
        className="flex items-center justify-center rounded-md flex-shrink-0"
        style={{
          width: 40,
          height: 40,
          background: 'var(--color-btn-hover)',
          color: 'var(--color-accent)',
        }}
      >
        <Star size={20} strokeWidth={1.6} />
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-[15px] font-medium" style={{ color: 'var(--color-text)' }}>
          우선순위 {item.priority}
        </span>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ background: hex }} />
          <span
            className="text-[14px] font-mono"
            style={{ color: 'var(--color-text-subtle)' }}
          >
            {hex}
          </span>
        </div>
      </div>
    </div>
  ) : (
    <div className="pb-3 text-[14px]" style={{ color: 'var(--color-text-subtle)' }}>
      좌측 목록에서 우선순위를 선택하세요.
    </div>
  )

  const drawerActions = item ? (
    editor.editMode ? (
      <div className="flex flex-col items-stretch gap-2 w-full max-w-[260px] ml-auto">
        {editor.actionError ? (
          <p className="text-[13px] text-right" style={{ color: '#c75c5c' }}>
            {editor.actionError}
          </p>
        ) : null}
        <div className="flex justify-end gap-1.5">
          <Button
            variant="default"
            size="sm"
            leftIcon={<X size={12} />}
            onClick={editor.handleCancel}
          >
            취소
          </Button>
          <Button
            variant="accent"
            size="sm"
            leftIcon={<Check size={12} />}
            loading={editor.isSaving}
            onClick={editor.handleSave}
          >
            저장
          </Button>
        </div>
      </div>
    ) : (
      <>
        <Button
          variant="danger"
          size="sm"
          leftIcon={<Trash2 size={12} />}
          onClick={() => editor.setDeleteOpen(true)}
        >
          삭제
        </Button>
        <Button
          variant="accent"
          size="sm"
          leftIcon={<Pencil size={12} />}
          onClick={editor.handleEdit}
        >
          수정
        </Button>
      </>
    )
  ) : undefined

  return (
    <>
      <Drawer fill header={drawerHeader} actions={drawerActions}>
        {item ? (
          <AlarmPriorityFormFields
            form={editor.form}
            editMode={editor.editMode}
            layout="stack"
          />
        ) : null}
      </Drawer>

      <Modal
        open={editor.deleteOpen}
        title="우선순위 삭제"
        description={`우선순위 ${item?.priority ?? ''} 항목을 삭제하시겠습니까?`}
        confirmLabel="삭제"
        loading={editor.isDeleting}
        onConfirm={editor.handleDeleteConfirm}
        onCancel={() => editor.setDeleteOpen(false)}
      />
    </>
  )
}
