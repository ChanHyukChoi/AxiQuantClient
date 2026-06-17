import { Calendar, Pencil, Plus, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/primitive/Button'
import { Modal } from '@/components/primitive/Modal'
import { fetchHolidayList } from '@/hooks/api/queryCache'
import { HolidayDetailFields } from '@/pages/SchedulePage/components/HolidayDetailFields'
import { useHolidayEditor } from '@/pages/SchedulePage/useHolidayEditor'
import type { ScheduleHolidaysApi } from '@/pages/SchedulePage/useScheduleHolidays'
import { holidayDisplayLabel } from '@/pages/SchedulePage/utils/timezoneDisplay'
import type { HolidayInfo } from '@/types/api'

interface HolidaySectionProps {
  timezoneId: number
  holidays: ScheduleHolidaysApi
}

export const HolidaySection = ({ timezoneId, holidays }: HolidaySectionProps) => {
  const { t } = useTranslation(['schedule', 'common'])
  const qc = useQueryClient()
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const items = holidays.itemsByTimezone(timezoneId)

  const selectedItem = items.find((h) => h.id === selectedId) ?? null

  useEffect(() => {
    setSelectedId(null)
  }, [timezoneId])

  const selectNewestHoliday = useCallback(async () => {
    const list = await fetchHolidayList(qc)
    const tzHolidays = (list ?? []).filter((h) => h.timezoneId === timezoneId)
    const newest = [...tzHolidays].sort((a, b) => b.id - a.id)[0]
    if (newest) setSelectedId(newest.id)
  }, [qc, timezoneId])

  const editor = useHolidayEditor({
    timezoneId,
    item: selectedItem,
    onDeleted: () => setSelectedId(null),
    onCreated: () => void selectNewestHoliday(),
  })

  const handleRowClick = (row: HolidayInfo) => {
    if (editor.editMode && selectedItem?.id !== row.id) return
    setSelectedId(row.id)
  }

  return (
    <section
      className="flex flex-col gap-2 pt-4 mt-1"
      style={{ borderTop: '0.5px solid var(--color-border)' }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <Calendar size={14} style={{ color: 'var(--color-accent)' }} />
          <span className="text-[14px] font-medium" style={{ color: 'var(--color-text)' }}>
            {t('schedule:holiday.title')}
          </span>
          <span className="text-[13px]" style={{ color: 'var(--color-text-subtle)' }}>
            ({items.length})
          </span>
        </div>
        <Button
          variant="default"
          size="sm"
          leftIcon={<Plus size={12} />}
          onClick={() => void editor.handleAdd()}
          loading={editor.isAdding}
        >
          {t('common:add')}
        </Button>
      </div>

      <div
        className="overflow-y-auto app-scrollbar max-h-48"
        style={{
          border: '0.5px solid var(--color-border)',
          background: 'var(--color-input-bg)',
        }}
      >
        {items.length === 0 ? (
          <p
            className="text-[13px] text-center py-5"
            style={{ color: 'var(--color-text-subtle)' }}
          >
            {t('schedule:holiday.empty')}
          </p>
        ) : (
          <ul>
            {items.map((row) => {
              const selected = selectedId === row.id
              return (
                <li key={row.id}>
                  <button
                    type="button"
                    onClick={() => handleRowClick(row)}
                    className="w-full text-left px-2.5 py-2 flex items-center justify-between gap-2"
                    style={{
                      background: selected ? 'var(--color-btn-hover)' : 'transparent',
                      borderBottom: '0.5px solid var(--color-border)',
                    }}
                  >
                    <span
                      className="text-[14px] truncate"
                      style={{ color: 'var(--color-text)' }}
                    >
                      {holidayDisplayLabel(row)}
                    </span>
                    <span
                      className="text-[13px] font-mono flex-shrink-0"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      {row.date || t('common:empty')}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {selectedItem ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-end gap-1.5">
            {editor.editMode ? (
              <>
                <Button variant="default" size="sm" onClick={editor.handleCancel}>
                  {t('common:cancel')}
                </Button>
                <Button variant="accent" size="sm" onClick={() => void editor.handleSave()}>
                  {t('common:save')}
                </Button>
              </>
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
                <Button
                  variant="accent"
                  size="sm"
                  leftIcon={<Pencil size={12} />}
                  onClick={editor.handleEdit}
                >
                  {t('common:edit')}
                </Button>
              </>
            )}
          </div>
          <HolidayDetailFields
            item={selectedItem}
            editMode={editor.editMode}
            draftName={editor.draftName}
            draftDate={editor.draftDate}
            draftRecurring={editor.draftRecurring}
            onDraftNameChange={editor.setDraftName}
            onDraftDateChange={editor.setDraftDate}
            onDraftRecurringChange={editor.setDraftRecurring}
          />
        </div>
      ) : null}

      {editor.actionError ? (
        <p className="text-[13px]" style={{ color: 'var(--color-danger)' }}>
          {editor.actionError}
        </p>
      ) : null}

      <Modal
        open={editor.deleteOpen}
        title={t('schedule:holiday.modal.deleteTitle')}
        description={t('schedule:holiday.modal.deleteDescription', {
          name: selectedItem ? holidayDisplayLabel(selectedItem) : '',
        })}
        confirmLabel={t('common:delete')}
        onConfirm={() => void editor.handleDeleteConfirm()}
        onCancel={() => editor.setDeleteOpen(false)}
      />
    </section>
  )
}
