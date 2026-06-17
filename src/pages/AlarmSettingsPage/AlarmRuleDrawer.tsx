import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Bell, Check, Pencil, Trash2, X } from 'lucide-react'
import { Drawer } from '@/components/primitive/Drawer'
import { DrawerSelectPrompt } from '@/components/basic/DrawerSelectPrompt'
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
  scps: ScpInfo[]
  scpNameMap: Record<number, string>
  editor: AlarmRuleEditor
}

type DrawerSection = 'general' | 'users'

export const AlarmRuleDrawer = ({
  rule,
  scps,
  scpNameMap,
  editor,
}: AlarmRuleDrawerProps) => {
  const { t } = useTranslation(['alarm', 'common'])
  const [section, setSection] = useState<DrawerSection>('general')
  const userIds = editor.form.watch('userIds')

  const drawerTabs = useMemo<TabItem[]>(
    () => [
      { key: 'general', label: t('alarm:drawerTab.general') },
      { key: 'users', label: t('alarm:drawerTab.users') },
    ],
    [t],
  )

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
          {rule.name?.trim() || t('alarm:rule.fallback')}
        </span>
        <span className="text-[14px]" style={{ color: 'var(--color-text-subtle)' }}>
          {t('alarm:rule.summary', {
            status: isAlarmActive(rule.active) ? t('common:active') : t('common:inactive'),
            priority: rule.priority,
            controller: scpNameForRule(rule, scpNameMap),
          })}
        </span>
      </div>
    </div>
  ) : (
    <div />
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
            {t('common:cancel')}
          </Button>
          <Button
            variant="accent"
            size="sm"
            leftIcon={<Check size={12} />}
            loading={editor.isSaving}
            onClick={editor.handleSave}
          >
            {t('common:save')}
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
    )
  ) : undefined

  return (
    <>
      <Drawer fill borderLeft={false} contentFill={!rule} header={drawerHeader} actions={drawerActions}>
        {rule ? (
          <div className="flex flex-col gap-3 min-h-0 flex-1">
            <Tab
              items={drawerTabs}
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
        ) : (
          <DrawerSelectPrompt message={t('alarm:selectRule')} />
        )}
      </Drawer>

      <DevicePickerModal
        open={editor.devicePickerOpen}
        onCancel={() => editor.setDevicePickerOpen(false)}
        onConfirm={editor.handleDevicePick}
      />

      <Modal
        open={editor.deleteOpen}
        title={t('alarm:rule.modal.deleteTitle')}
        description={t('alarm:rule.modal.deleteDescription', { name: rule?.name ?? '' })}
        confirmLabel={t('common:delete')}
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
}) => {
  const { t } = useTranslation(['alarm', 'common'])

  return (
    <div
      className="flex flex-col gap-3 text-[14px]"
      style={{ color: 'var(--color-text-muted)' }}
    >
      <p>
        <span style={{ color: 'var(--color-text-subtle)' }}>{t('alarm:field.name')}: </span>
        {rule.name || t('common:empty')}
      </p>
      <p>
        <span style={{ color: 'var(--color-text-subtle)' }}>{t('alarm:field.eventCode')}: </span>
        {eventCodeLabel(rule.eventCode)}
      </p>
      <p>
        <span style={{ color: 'var(--color-text-subtle)' }}>{t('alarm:field.controller')}: </span>
        {scpNameForRule(rule, scpNameMap)}
      </p>
      <p>
        <span style={{ color: 'var(--color-text-subtle)' }}>{t('alarm:field.device')}: </span>
        {deviceNameForRule(rule, scpNameMap)}
      </p>
      <p>
        <span style={{ color: 'var(--color-text-subtle)' }}>{t('alarm:field.priority')}: </span>
        {rule.priority}
      </p>
      <p>
        <span style={{ color: 'var(--color-text-subtle)' }}>{t('alarm:field.monitoring')}: </span>
        {rule.monitoring ? t('alarm:yes') : t('alarm:no')}
      </p>
      <p>
        <span style={{ color: 'var(--color-text-subtle)' }}>{t('alarm:field.ackRequired')}: </span>
        {rule.ackRequired ? t('alarm:yes') : t('alarm:no')}
      </p>
      <p>
        <span style={{ color: 'var(--color-text-subtle)' }}>{t('alarm:field.users')}: </span>
        {rule.userIds.length > 0
          ? t('alarm:rule.userCount', { count: rule.userIds.length })
          : t('common:empty')}
      </p>
    </div>
  )
}
