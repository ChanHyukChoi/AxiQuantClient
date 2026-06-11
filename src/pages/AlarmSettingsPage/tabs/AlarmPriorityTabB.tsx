import { useMemo } from 'react'
import { Grid, type ColumnDef } from '@/components/primitive/Grid'
import { Modal } from '@/components/primitive/Modal'
import { AlarmPriorityFormFields } from '@/pages/AlarmSettingsPage/components/AlarmPriorityFormFields'
import { AlarmPrioritySamplePreview } from '@/pages/AlarmSettingsPage/components/AlarmPrioritySamplePreview'
import { AlarmRuleActionButtons } from '@/pages/AlarmSettingsPage/components/AlarmRuleActionButtons'
import type { AlarmPriorityDisplay } from '@/pages/AlarmSettingsPage/alarmPriorityTypes'
import { useAlarmPrioritiesData } from '@/pages/AlarmSettingsPage/useAlarmPrioritiesData'
import { useAlarmPriorityEditor } from '@/pages/AlarmSettingsPage/useAlarmPriorityEditor'
import { normalizeHexColor } from '@/pages/AlarmSettingsPage/utils/alarmHelpers'

const GRID_COLUMNS: ColumnDef<AlarmPriorityDisplay>[] = [
  {
    key: 'priority',
    header: '우선순위',
    width: 80,
    align: 'center',
    sortable: true,
    render: (value) => (
      <span className="text-[14px] font-mono" style={{ color: 'var(--color-text)' }}>
        {String(value ?? '')}
      </span>
    ),
  },
  {
    key: 'alarmFg',
    header: '경보',
    width: 140,
    sortable: false,
    render: (_, row) => (
      <AlarmPrioritySamplePreview
        fgColor={normalizeHexColor(row.alarmFg)}
        bgColor={normalizeHexColor(row.alarmBg)}
        bgEnabled={row.alarmBgEnabled}
        blinking={row.blinking}
        compact
      />
    ),
  },
  {
    key: 'ackFg',
    header: '인지 처리 후',
    width: 140,
    sortable: false,
    render: (_, row) => (
      <AlarmPrioritySamplePreview
        fgColor={normalizeHexColor(row.ackFg)}
        bgColor={normalizeHexColor(row.ackBg)}
        bgEnabled={row.ackBgEnabled}
        compact
      />
    ),
  },
]

export const AlarmPriorityTabB = () => {
  const data = useAlarmPrioritiesData()

  const editor = useAlarmPriorityEditor({
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
          data={data.items}
          selectedId={data.selectedId ?? undefined}
          onRowClick={data.selectItem}
          totalCount={data.items.length}
          loading={data.isLoading}
        />
        {data.isError ? (
          <p className="text-[13px] px-3 py-1" style={{ color: 'var(--color-danger)' }}>
            우선순위 목록을 불러오지 못했습니다.
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
            <AlarmPriorityFormFields
              form={editor.form}
              editMode={editor.editMode}
              layout="wpf"
            />
          ) : (
            <p className="text-[14px]" style={{ color: 'var(--color-text-subtle)' }}>
              상단 목록에서 우선순위를 선택하세요.
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
            isSaving={editor.isSaving}
            isDeleting={editor.isDeleting}
            isAdding={editor.isAdding}
            showAddAlways
            onAdd={() => void editor.handleAdd()}
            onEdit={editor.handleEdit}
            onCancel={editor.handleCancel}
            onSave={editor.handleSave}
            onDelete={() => editor.setDeleteOpen(true)}
          />
        </div>
      </div>

      <Modal
        open={editor.deleteOpen}
        title="우선순위 삭제"
        description={`우선순위 ${data.selectedItem?.priority ?? ''} 항목을 삭제하시겠습니까?`}
        confirmLabel="삭제"
        loading={editor.isDeleting}
        onConfirm={editor.handleDeleteConfirm}
        onCancel={() => editor.setDeleteOpen(false)}
      />
    </div>
  )
}
