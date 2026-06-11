import { useMemo } from 'react'
import { Grid, type ColumnDef } from '@/components/primitive/Grid'
import { Modal } from '@/components/primitive/Modal'
import { AlarmRuleActionButtons } from '@/pages/AlarmSettingsPage/components/AlarmRuleActionButtons'
import { TimezoneDetailFields } from '@/pages/TimezoneHolidayPage/components/TimezoneDetailFields'
import { useTimezoneEditor } from '@/pages/TimezoneHolidayPage/useTimezoneEditor'
import { useTimezonesData } from '@/pages/TimezoneHolidayPage/useTimezonesData'
import {
  timezoneDisplayName,
  timezoneRangeLabel,
} from '@/pages/TimezoneHolidayPage/utils/timezoneDisplay'
import type { TimezoneInfo } from '@/types/api'

const GRID_COLUMNS: ColumnDef<TimezoneInfo>[] = [
  {
    key: 'name',
    header: '명칭',
    width: 160,
    sortable: true,
    render: (_, row) => (
      <span className="text-[14px] truncate block" style={{ color: 'var(--color-text)' }}>
        {timezoneDisplayName(row)}
      </span>
    ),
  },
  {
    key: 'startTime',
    header: '시작',
    width: 80,
    align: 'center',
    sortable: true,
    render: (_, row) => (
      <span className="text-[14px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
        {row.startTime ?? row.intervals[0]?.stm ?? '—'}
      </span>
    ),
  },
  {
    key: 'endTime',
    header: '종료',
    width: 80,
    align: 'center',
    sortable: true,
    render: (_, row) => (
      <span className="text-[14px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
        {row.endTime ?? row.intervals[0]?.etm ?? '—'}
      </span>
    ),
  },
  {
    key: 'intervals',
    header: '구간',
    width: 64,
    align: 'center',
    sortable: true,
    render: (_, row) => (
      <span className="text-[14px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
        {row.intervals.length}
      </span>
    ),
  },
  {
    key: 'id',
    header: '범위',
    width: 140,
    sortable: false,
    render: (_, row) => (
      <span className="text-[13px] truncate block" style={{ color: 'var(--color-text-subtle)' }}>
        {timezoneRangeLabel(row)}
      </span>
    ),
  },
]

export const TimezoneTabB = () => {
  const data = useTimezonesData()

  const editor = useTimezoneEditor({
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
          searchPlaceholder="타임존 검색..."
          totalCount={data.filtered.length}
          loading={data.isLoading}
        />
        {data.isError ? (
          <p className="text-[13px] px-3 py-1" style={{ color: 'var(--color-danger)' }}>
            타임존 목록을 불러오지 못했습니다.
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
            <TimezoneDetailFields
              item={data.selectedItem}
              editMode={editor.editMode}
              draftName={editor.draftName}
              onDraftNameChange={editor.setDraftName}
            />
          ) : (
            <p className="text-[14px]" style={{ color: 'var(--color-text-subtle)' }}>
              상단 목록에서 타임존을 선택하세요.
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
        title="타임존 삭제"
        description={
          data.selectedItem
            ? `「${timezoneDisplayName(data.selectedItem)}」 타임존을 삭제하시겠습니까?`
            : undefined
        }
        confirmLabel="삭제"
        onConfirm={editor.handleDeleteConfirm}
        onCancel={() => editor.setDeleteOpen(false)}
      />
    </div>
  )
}
