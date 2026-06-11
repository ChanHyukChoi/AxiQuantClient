import { useState } from 'react'
import { Bell, Check, Pencil, Trash2, X } from 'lucide-react'
import { Drawer } from '@/components/primitive/Drawer'
import { Button } from '@/components/primitive/Button'
import { Modal } from '@/components/primitive/Modal'
import { Tab, type TabItem } from '@/components/primitive/Tab'
import { AlarmRuleFormFields } from '@/pages/AlarmSettingsPage/components/AlarmRuleFormFields'
import { AlarmUserPermissionList } from '@/pages/AlarmSettingsPage/components/AlarmUserPermissionList'
import { DevicePickerModal } from '@/pages/AlarmSettingsPage/components/DevicePickerModal'
import type { AlarmRuleDisplay } from '@/pages/AlarmSettingsPage/alarmRuleTypes'
import type { useAlarmRuleEditor } from '@/pages/AlarmSettingsPage/useAlarmRuleEditor'
import { isAlarmActive } from '@/pages/AlarmSettingsPage/utils/alarmHelpers'
import {
  deviceNameForRule,
  eventCodeLabel,
  scpNameForRule,
} from '@/pages/AlarmSettingsPage/utils/alarmRuleDisplay'
import type { ScpInfo } from '@/types/api'

type AlarmRuleEditor = ReturnType<typeof useAlarmRuleEditor>

interface AlarmRuleDrawerProps {
  rule: AlarmRuleDisplay | null
  useMock: boolean
  scps: ScpInfo[]
  scpNameMap: Record<number, string>
  editor: AlarmRuleEditor
}

type DrawerSection = 'general' | 'users'

const DRAWER_TABS: TabItem[] = [
  { key: 'general', label: '일반' },
  { key: 'users', label: '사용자' },
]

export const AlarmRuleDrawer = ({
  rule,
  useMock,
  scps,
  scpNameMap,
  editor,
}: AlarmRuleDrawerProps) => {
  const [section, setSection] = useState<DrawerSection>('general')
  const userIds = editor.form.watch('userIds')

  const drawerHeader = rule ? (
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
        <Bell size={20} strokeWidth={1.6} />
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <span
          className="text-[15px] font-medium leading-tight truncate"
          style={{ color: 'var(--color-text)' }}
        >
          {rule.name?.trim() || '경보'}
        </span>
        <span className="text-[14px]" style={{ color: 'var(--color-text-subtle)' }}>
          {isAlarmActive(rule.active) ? '활성' : '비활성'} · 우선순위 {rule.priority} ·{' '}
          {scpNameForRule(rule, scpNameMap)}
        </span>
      </div>
    </div>
  ) : (
    <div className="pb-3 text-[14px]" style={{ color: 'var(--color-text-subtle)' }}>
      좌측 목록에서 경보를 선택하세요.
    </div>
  )

  const drawerActions = rule ? (
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
        {rule ? (
          <div className="flex flex-col gap-3 min-h-0 flex-1">
            <Tab
              items={DRAWER_TABS}
              activeKey={section}
              onChange={(k) => setSection(k as DrawerSection)}
              fontSize={14}
            />
            {section === 'general' ? (
              editor.editMode ? (
                <AlarmRuleFormFields
                  form={editor.form}
                  editMode
                  scps={scps}
                  scpNameMap={scpNameMap}
                  deviceLabel={editor.deviceLabel}
                  onOpenDevicePicker={() => editor.setDevicePickerOpen(true)}
                />
              ) : (
                <AlarmReadOnly rule={rule} scpNameMap={scpNameMap} />
              )
            ) : (
              <AlarmUserPermissionList
                selectedUserIds={userIds}
                editMode={editor.editMode}
                useMock={useMock}
                onToggle={editor.toggleUserId}
                onSelectAll={(ids) =>
                  editor.form.setValue('userIds', ids, { shouldDirty: true })
                }
                onDeselectAll={() =>
                  editor.form.setValue('userIds', [], { shouldDirty: true })
                }
              />
            )}
          </div>
        ) : null}
      </Drawer>

      <DevicePickerModal
        open={editor.devicePickerOpen}
        onCancel={() => editor.setDevicePickerOpen(false)}
        onConfirm={editor.handleDevicePick}
      />

      <Modal
        open={editor.deleteOpen}
        title="경보 삭제"
        description={`「${rule?.name ?? ''}」 경보를 삭제하시겠습니까?`}
        confirmLabel="삭제"
        loading={editor.isDeleting}
        onConfirm={editor.handleDeleteConfirm}
        onCancel={() => editor.setDeleteOpen(false)}
      />
    </>
  )
}

const AlarmReadOnly = ({
  rule,
  scpNameMap,
}: {
  rule: AlarmRuleDisplay
  scpNameMap: Record<number, string>
}) => (
  <div
    className="flex flex-col gap-3 text-[14px]"
    style={{ color: 'var(--color-text-muted)' }}
  >
    <p>
      <span style={{ color: 'var(--color-text-subtle)' }}>명칭: </span>
      {rule.name || '—'}
    </p>
    <p>
      <span style={{ color: 'var(--color-text-subtle)' }}>경보 코드: </span>
      {eventCodeLabel(rule.eventCode)}
    </p>
    <p>
      <span style={{ color: 'var(--color-text-subtle)' }}>컨트롤러: </span>
      {scpNameForRule(rule, scpNameMap)}
    </p>
    <p>
      <span style={{ color: 'var(--color-text-subtle)' }}>장치: </span>
      {deviceNameForRule(rule, scpNameMap)}
    </p>
    <p>
      <span style={{ color: 'var(--color-text-subtle)' }}>우선순위: </span>
      {rule.priority}
    </p>
    <p>
      <span style={{ color: 'var(--color-text-subtle)' }}>모니터링: </span>
      {rule.monitoring ? '예' : '아니오'}
    </p>
    <p>
      <span style={{ color: 'var(--color-text-subtle)' }}>인지 필요: </span>
      {rule.ackRequired ? '예' : '아니오'}
    </p>
    <p>
      <span style={{ color: 'var(--color-text-subtle)' }}>사용자: </span>
      {rule.userIds.length > 0 ? `${rule.userIds.length}명` : '—'}
    </p>
  </div>
)
