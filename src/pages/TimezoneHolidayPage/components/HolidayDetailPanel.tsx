import { Check, Calendar, Pencil, Trash2, X } from 'lucide-react'
import { Drawer } from '@/components/primitive/Drawer'
import { Button } from '@/components/primitive/Button'
import { Modal } from '@/components/primitive/Modal'
import { HolidayDetailFields } from '@/pages/TimezoneHolidayPage/components/HolidayDetailFields'
import type { useHolidayEditor } from '@/pages/TimezoneHolidayPage/useHolidayEditor'
import type { HolidayInfo } from '@/types/api'

type HolidayEditor = ReturnType<typeof useHolidayEditor>

interface HolidayDetailPanelProps {
  item: HolidayInfo | null
  editor?: HolidayEditor
}

const holidayLabel = (item: HolidayInfo): string => item.name?.trim() || '휴일'

export const HolidayDetailPanel = ({ item, editor }: HolidayDetailPanelProps) => {
  const editMode = editor?.editMode ?? false

  const header = item ? (
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
        <Calendar size={20} strokeWidth={1.6} />
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <span
          className="text-[15px] font-medium leading-tight truncate"
          style={{ color: 'var(--color-text)' }}
        >
          {holidayLabel(item)}
        </span>
        <span className="text-[14px]" style={{ color: 'var(--color-text-subtle)' }}>
          {item.date || '—'}
        </span>
      </div>
    </div>
  ) : (
    <div className="pb-3 text-[14px]" style={{ color: 'var(--color-text-subtle)' }}>
      좌측 목록에서 휴일을 선택하세요.
    </div>
  )

  const drawerActions =
    item && editor ? (
      editMode ? (
        <div className="flex justify-end gap-1.5">
          <Button variant="default" size="sm" leftIcon={<X size={12} />} onClick={editor.handleCancel}>
            취소
          </Button>
          <Button variant="accent" size="sm" leftIcon={<Check size={12} />} onClick={editor.handleSave}>
            저장
          </Button>
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
          <Button variant="accent" size="sm" leftIcon={<Pencil size={12} />} onClick={editor.handleEdit}>
            수정
          </Button>
        </>
      )
    ) : undefined

  return (
    <>
      <Drawer fill header={header} actions={drawerActions}>
        {item ? (
          <HolidayDetailFields
            item={item}
            editMode={editMode}
            draftName={editor?.draftName}
            draftDate={editor?.draftDate}
            draftRecurring={editor?.draftRecurring}
            onDraftNameChange={editor?.setDraftName}
            onDraftDateChange={editor?.setDraftDate}
            onDraftRecurringChange={editor?.setDraftRecurring}
          />
        ) : null}
      </Drawer>

      {editor ? (
        <Modal
          open={editor.deleteOpen}
          title="휴일 삭제"
          description={`「${item ? holidayLabel(item) : ''}」 휴일을 삭제하시겠습니까?`}
          confirmLabel="삭제"
          onConfirm={editor.handleDeleteConfirm}
          onCancel={() => editor.setDeleteOpen(false)}
        />
      ) : null}
    </>
  )
}
