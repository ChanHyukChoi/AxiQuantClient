import { useMemo } from 'react'
import { Grid, type ColumnDef } from '@/components/primitive/Grid'
import { Modal } from '@/components/primitive/Modal'
import { AlarmRuleActionButtons } from '@/pages/AlarmSettingsPage/components/AlarmRuleActionButtons'
import { AlarmRuleFormFields } from '@/pages/AlarmSettingsPage/components/AlarmRuleFormFields'
import { AlarmUserPermissionList } from '@/pages/AlarmSettingsPage/components/AlarmUserPermissionList'
import { DevicePickerModal } from '@/pages/AlarmSettingsPage/components/DevicePickerModal'
import type { AlarmRuleDisplay } from '@/pages/AlarmSettingsPage/alarmRuleTypes'
import { useAlarmRuleEditor } from '@/pages/AlarmSettingsPage/useAlarmRuleEditor'
import { useAlarmRulesData } from '@/pages/AlarmSettingsPage/useAlarmRulesData'
import {
  deviceNameForRule,
  eventCodeLabel,
  isRuleDisabled,
  scpNameForRule,
} from '@/pages/AlarmSettingsPage/utils/alarmRuleDisplay'

const buildGridColumns = (
  scpNameMap: Record<number, string>,
): ColumnDef<AlarmRuleDisplay>[] => [
  {
    key: 'name',
    header: '명칭',
    width: 160,
    sortable: true,
    render: (value) => (
      <span className="text-[14px] truncate block" style={{ color: 'var(--color-text)' }}>
        {String(value ?? '')}
      </span>
    ),
  },
  {
    key: 'active',
    header: '사용 안함',
    width: 72,
    align: 'center',
    sortable: true,
    render: (_, row) =>
      isRuleDisabled(row) ? (
        <span style={{ color: 'var(--color-accent)' }}>✓</span>
      ) : null,
  },
  {
    key: 'priority',
    header: '우선순위',
    width: 72,
    align: 'center',
    sortable: true,
    render: (value) => (
      <span className="text-[14px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
        {String(value ?? '')}
      </span>
    ),
  },
  {
    key: 'monitoring',
    header: '모니터링',
    width: 72,
    align: 'center',
    sortable: true,
    render: (value) =>
      value ? <span style={{ color: 'var(--color-accent)' }}>✓</span> : null,
  },
  {
    key: 'ackRequired',
    header: '인지 필요',
    width: 72,
    align: 'center',
    sortable: true,
    render: (value) =>
      value ? <span style={{ color: 'var(--color-accent)' }}>✓</span> : null,
  },
  {
    key: 'eventCode',
    header: '이벤트',
    width: 180,
    sortable: true,
    render: (value) => (
      <span className="text-[14px] truncate block" style={{ color: 'var(--color-text-muted)' }}>
        {eventCodeLabel(String(value ?? ''))}
      </span>
    ),
  },
  {
    key: 'scpId',
    header: '컨트롤러',
    width: 120,
    sortable: true,
    render: (_, row) => (
      <span className="text-[14px] truncate block" style={{ color: 'var(--color-text-muted)' }}>
        {scpNameForRule(row, scpNameMap)}
      </span>
    ),
  },
  {
    key: 'deviceId',
    header: '장치',
    width: 120,
    sortable: true,
    render: (_, row) => (
      <span className="text-[14px] truncate block" style={{ color: 'var(--color-text-muted)' }}>
        {deviceNameForRule(row, scpNameMap)}
      </span>
    ),
  },
]

export const AlarmRulesTabB = () => {
  const data = useAlarmRulesData()

  const editor = useAlarmRuleEditor({
    rule: data.selectedRule,
    useMock: data.useMock,
    scpNameMap: data.scpNameMap,
    patchMockRule: data.patchMockRule,
    addMockRule: data.addMockRule,
    removeMockRule: data.removeMockRule,
    onDeleted: data.onRuleDeleted,
  })

  const userIds = editor.form.watch('userIds')

  const gridColumns = useMemo(
    () => buildGridColumns(data.scpNameMap),
    [data.scpNameMap],
  )

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
          data={data.filteredRules}
          selectedId={data.selectedId ?? undefined}
          onRowClick={data.selectRule}
          onSearch={data.setSearchQuery}
          searchPlaceholder="경보 검색..."
          totalCount={data.filteredRules.length}
          loading={data.isLoading}
        />
        {data.isError ? (
          <p className="text-[13px] px-3 py-1" style={{ color: 'var(--color-danger)' }}>
            경보 목록을 불러오지 못했습니다.
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

        <div className="flex flex-1 min-h-0 overflow-hidden">
          {data.selectedRule ? (
            <>
              <div
                className="flex-1 min-w-0 p-3 overflow-y-auto app-scrollbar"
                style={{ borderRight: '0.5px solid var(--color-border)' }}
              >
                <AlarmRuleFormFields
                  form={editor.form}
                  editMode={editor.editMode}
                  scps={data.scpList}
                  scpNameMap={data.scpNameMap}
                  deviceLabel={editor.deviceLabel}
                  onOpenDevicePicker={() => editor.setDevicePickerOpen(true)}
                  layout="columns"
                />
              </div>

              <div
                className="flex flex-col flex-shrink-0 overflow-hidden"
                style={{ width: 220 }}
              >
                <div
                  className="flex-shrink-0 px-3 py-2 text-[14px] font-medium"
                  style={{
                    background: 'var(--color-sidebar)',
                    borderBottom: '0.5px solid var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                >
                  사용자
                </div>
                <div className="flex-1 min-h-0 p-2">
                  <AlarmUserPermissionList
                    selectedUserIds={userIds}
                    editMode={editor.editMode}
                    useMock={data.useMock}
                    onToggle={editor.toggleUserId}
                    onSelectAll={(ids) =>
                      editor.form.setValue('userIds', ids, { shouldDirty: true })
                    }
                    onDeselectAll={() =>
                      editor.form.setValue('userIds', [], { shouldDirty: true })
                    }
                  />
                </div>
              </div>
            </>
          ) : (
            <p
              className="text-[14px] p-4"
              style={{ color: 'var(--color-text-subtle)' }}
            >
              상단 목록에서 경보를 선택하세요.
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
            hasRule={data.selectedRule != null}
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

      <DevicePickerModal
        open={editor.devicePickerOpen}
        onCancel={() => editor.setDevicePickerOpen(false)}
        onConfirm={editor.handleDevicePick}
      />

      <Modal
        open={editor.deleteOpen}
        title="경보 삭제"
        description={`「${data.selectedRule?.name ?? ''}」 경보를 삭제하시겠습니까?`}
        confirmLabel="삭제"
        loading={editor.isDeleting}
        onConfirm={editor.handleDeleteConfirm}
        onCancel={() => editor.setDeleteOpen(false)}
      />
    </div>
  )
}
