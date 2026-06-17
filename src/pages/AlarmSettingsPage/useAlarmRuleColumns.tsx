import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { type ColumnDef } from '@/components/primitive/Grid'
import type { AlarmRuleDisplay } from '@/pages/AlarmSettingsPage/alarmRuleTypes'
import {
  deviceNameForRule,
  eventCodeLabel,
  isRuleDisabled,
  scpNameForRule,
} from '@/pages/AlarmSettingsPage/utils/alarmRuleDisplay'

export const useAlarmRuleColumns = (scpNameMap: Record<number, string>) => {
  const { t } = useTranslation(['alarm', 'common'])

  return useMemo<ColumnDef<AlarmRuleDisplay>[]>(
    () => [
      {
        key: 'name',
        header: t('common:name'),
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
        header: t('alarm:field.disabled'),
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
        header: t('alarm:field.priority'),
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
        key: 'eventCode',
        header: t('alarm:field.event'),
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
        header: t('alarm:field.controller'),
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
        header: t('alarm:field.device'),
        width: 120,
        sortable: true,
        render: (_, row) => (
          <span className="text-[14px] truncate block" style={{ color: 'var(--color-text-muted)' }}>
            {deviceNameForRule(row, scpNameMap)}
          </span>
        ),
      },
    ],
    [scpNameMap, t],
  )
}
