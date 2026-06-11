import { useMemo } from 'react'
import { Grid, type ColumnDef } from '@/components/primitive/Grid'
import { Modal } from '@/components/primitive/Modal'
import { AlarmRuleActionButtons } from '@/pages/AlarmSettingsPage/components/AlarmRuleActionButtons'
import { HolidayDetailFields } from '@/pages/TimezoneHolidayPage/components/HolidayDetailFields'
import { useHolidayEditor } from '@/pages/TimezoneHolidayPage/useHolidayEditor'
import { useHolidaysData } from '@/pages/TimezoneHolidayPage/useHolidaysData'
import type { HolidayInfo } from '@/types/api'

const holidayLabel = (item: HolidayInfo): string => item.name?.trim() || '휴일'

const GRID_COLUMNS: ColumnDef<HolidayInfo>[] = [
  {
    key: 'name',
    header: '명칭',
    width: 180,
    sortable: true,
    render: (_, row) => (
      <span className="text-[14px] truncate block" style={{ color: 'var(--color-text)' }}>
        {holidayLabel(row)}
      </span>
    ),
  },
  {
    key: 'date',
    header: '날짜',
    width: 120,
    sortable: true,
    render: (value) => (
      <span className="text-[14px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
        {String(value ?? '—')}
      </span>
    ),
  },
  {
    key: 'isRecurring',
    header: '매년',
    width: 64,
    align: 'center',
    sortable: true,
    render: (value) =>
      value ? <span style={{ color: 'var(--color-accent)' }}>✓</span> : null,
  },
]

export const HolidayTabB = () => {
  const data = useHolidaysData()

  const editor = useHolidayEditor({
    item: data.selectedItem,
    useMock: data.useMock,
    patchMockItem: data.patchMockItem,
    addMockItem: data.addMockItem,
    removeMockItem: data.removeMockItem,
    onDeleted: data.onItemDeleted,
  })

  const gridColumns = useMemo(() => GRID_COLUMNS, [])

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      <div
        className="flex flex-col min-h-0 overflow-hidden"
        style={{
          flex: '0 0 45%',
          borderBottom: '0.5px solid var(--color-border)',
        }}
      >
        <Grid
          columns={gridColumns}
          data={data.filtered}
          selectedId={data.selectedId ?? undefined}
          onRowClick={data.selectItem}
          onSearch={data.setSearchQuery}
          searchPlaceholder="휴일 검색..."
          totalCount={data.filtered.length}
          loading={data.isLoading}
        />
        {data.isError ? (
          <p className="text-[13px] px-3 py-1" style={{ color: 'var(--color-danger)' }}>
            휴일 목록을 불러오지 못했습니다.
          </p>
        ) : null}
      </div>

      <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
        <div
          className="flex-shrink-0 px-3 py-2 text-[14px] font-medium"
          style={{
            background: 'var(--color-accent-subtle)',
            color: 'var(--color-accent)',
            borderBottom: '0.5px solid var(--color-border)',
          }}
        >
          일반
        </div>

        <div className="flex-1 p-4 overflow-y-auto app-scrollbar min-h-0">
          {data.selectedItem ? (
            <HolidayDetailFields
              item={data.selectedItem}
              editMode={editor.editMode}
              draftName={editor.draftName}
              draftDate={editor.draftDate}
              draftRecurring={editor.draftRecurring}
              onDraftNameChange={editor.setDraftName}
              onDraftDateChange={editor.setDraftDate}
              onDraftRecurringChange={editor.setDraftRecurring}
            />
          ) : (
            <p className="text-[14px]" style={{ color: 'var(--color-text-subtle)' }}>
              상단 목록에서 휴일을 선택하세요.
            </p>
          )}
        </div>

        <div
          className="flex-shrink-0 px-3 py-2"
          style={{
            borderTop: '0.5px solid var(--color-border)',
            background: 'var(--color-sidebar)',
          }}
        >
          {editor.actionError ? (
            <p className="text-[13px] text-right mb-1.5" style={{ color: '#c75c5c' }}>
              {editor.actionError}
            </p>
          ) : null}
          <AlarmRuleActionButtons
            hasRule={data.selectedItem != null}
            editMode={editor.editMode}
            showAddAlways
            onAdd={editor.handleAdd}
            onEdit={editor.handleEdit}
            onCancel={editor.handleCancel}
            onSave={editor.handleSave}
            onDelete={() => editor.setDeleteOpen(true)}
          />
        </div>
      </div>

      <Modal
        open={editor.deleteOpen}
        title="휴일 삭제"
        description={
          data.selectedItem
            ? `「${holidayLabel(data.selectedItem)}」 휴일을 삭제하시겠습니까?`
            : undefined
        }
        confirmLabel="삭제"
        onConfirm={editor.handleDeleteConfirm}
        onCancel={() => editor.setDeleteOpen(false)}
      />
    </div>
  )
}
