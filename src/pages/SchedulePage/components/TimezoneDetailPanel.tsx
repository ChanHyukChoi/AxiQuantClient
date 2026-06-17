import { useTranslation } from 'react-i18next'
import { Check, Clock, Pencil, Trash2, X } from 'lucide-react'
import { Drawer } from '@/components/primitive/Drawer'
import { Button } from '@/components/primitive/Button'
import { Modal } from '@/components/primitive/Modal'
import { HolidaySection } from '@/pages/SchedulePage/components/HolidaySection'
import { TimezoneDetailFields } from '@/pages/SchedulePage/components/TimezoneDetailFields'
import type { ScheduleHolidaysApi } from '@/pages/SchedulePage/useScheduleHolidays'
import type { useTimezoneEditor } from '@/pages/SchedulePage/useTimezoneEditor'
import { timezoneDisplayName } from '@/pages/SchedulePage/utils/timezoneDisplay'
import type { TimezoneInfo } from '@/types/api'

type TimezoneEditor = ReturnType<typeof useTimezoneEditor>

interface TimezoneDetailPanelProps {
  item: TimezoneInfo | null
  editor?: TimezoneEditor
  holidays: ScheduleHolidaysApi
}

export const TimezoneDetailPanel = ({ item, editor, holidays }: TimezoneDetailPanelProps) => {
  const { t } = useTranslation(['schedule', 'common'])
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
        <Clock size={20} strokeWidth={1.6} />
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <span
          className="text-[15px] font-medium leading-tight truncate"
          style={{ color: 'var(--color-text)' }}
        >
          {timezoneDisplayName(item)}
        </span>
        <span className="text-[14px]" style={{ color: 'var(--color-text-subtle)' }}>
          {t('schedule:timezone.intervalCount', { count: item.intervals.length })}
        </span>
      </div>
    </div>
  ) : (
    <div className="pb-3 text-[14px]" style={{ color: 'var(--color-text-subtle)' }}>
      {t('schedule:selectTimezone')}
    </div>
  )

  const drawerActions =
    item && editor ? (
      editMode ? (
        <div className="flex justify-end gap-1.5">
          <Button variant="default" size="sm" leftIcon={<X size={12} />} onClick={editor.handleCancel}>
            {t('common:cancel')}
          </Button>
          <Button variant="accent" size="sm" leftIcon={<Check size={12} />} onClick={editor.handleSave}>
            {t('common:save')}
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
            {t('common:delete')}
          </Button>
          <Button variant="accent" size="sm" leftIcon={<Pencil size={12} />} onClick={editor.handleEdit}>
            {t('common:edit')}
          </Button>
        </>
      )
    ) : undefined

  return (
    <>
      <Drawer fill borderLeft={false} header={header} actions={drawerActions}>
        {item ? (
          <div className="flex flex-col gap-1 min-h-0">
            <TimezoneDetailFields
              item={item}
              editMode={editMode}
              draftName={editor?.draftName}
              onDraftNameChange={editor?.setDraftName}
            />
            <HolidaySection timezoneId={item.id} holidays={holidays} />
          </div>
        ) : null}
      </Drawer>

      {editor ? (
        <Modal
          open={editor.deleteOpen}
          title={t('schedule:timezone.modal.deleteTitle')}
          description={t('schedule:timezone.modal.deleteDescription', {
            name: item ? timezoneDisplayName(item) : '',
          })}
          confirmLabel={t('common:delete')}
          onConfirm={editor.handleDeleteConfirm}
          onCancel={() => editor.setDeleteOpen(false)}
        />
      ) : null}
    </>
  )
}
