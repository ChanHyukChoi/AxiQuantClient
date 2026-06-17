import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowRightToLine } from 'lucide-react'
import { Drawer } from '@/components/primitive/Drawer'
import { ActiveStatusBadge } from '@/components/basic/ActiveStatusBadge'
import { DetailInfoField } from '@/components/basic/DetailInfoField'
import { DetailTitleBar } from '@/components/basic/DetailTitleBar'
import { DrawerSelectPrompt } from '@/components/basic/DrawerSelectPrompt'
import { CrudDetailActions } from '@/components/page-actions'
import type { InputDisplayRow } from '@/pages/InputsPage/inputDisplayTypes'
import {
  formatInputAddr,
  formatInputMode,
  formatSioName,
  inputLabel,
} from '@/pages/InputsPage/utils/inputDisplay'
import { isDeviceActive } from '@/lib/device/deviceHelpers'

interface InputDrawerProps {
  row: InputDisplayRow | null
  onEditModeChange?: (editing: boolean) => void
}

export const InputDrawer = ({ row, onEditModeChange }: InputDrawerProps) => {
  const { t } = useTranslation(['common', 'device'])
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    setEditMode(false)
    onEditModeChange?.(false)
  }, [row?.scp, row?.id, onEditModeChange])

  const setEditing = (editing: boolean) => {
    setEditMode(editing)
    onEditModeChange?.(editing)
  }

  const drawerHeader = row ? (
    <DetailTitleBar
      icon={<ArrowRightToLine size={14} style={{ color: 'var(--color-accent)' }} />}
      title={inputLabel(row)}
      badge={<ActiveStatusBadge active={isDeviceActive(row.active)} />}
    />
  ) : (
    <div />
  )

  const drawerActions = row ? (
    <CrudDetailActions
      editMode={editMode}
      onEdit={() => setEditing(true)}
      onDelete={() => undefined}
      onSave={() => setEditing(false)}
      onCancel={() => setEditing(false)}
    />
  ) : null

  return (
    <Drawer fill borderLeft={false} contentFill={!row} header={drawerHeader} actions={drawerActions ?? undefined}>
      {row ? (
        <div className="max-w-md flex flex-col gap-3">
          <DetailInfoField label={t('device:grid.scp')}>{row.scpName}</DetailInfoField>
          <DetailInfoField label={t('device:grid.sio')}>
            {formatSioName(row.sio, row.sioName)}
          </DetailInfoField>
          <DetailInfoField label={t('common:address')}>{formatInputAddr(row.addr)}</DetailInfoField>
          <DetailInfoField label={t('common:mode')}>{formatInputMode(row.mode)}</DetailInfoField>
          <DetailInfoField label={t('device:input.invert')}>{String(row.icvt)}</DetailInfoField>
          <DetailInfoField label={t('device:input.holdTime')}>{`${row.holdtime} sec`}</DetailInfoField>
          <DetailInfoField label={t('common:status')}>
            {isDeviceActive(row.active) ? t('common:active') : t('common:inactive')}
          </DetailInfoField>
        </div>
      ) : (
        <DrawerSelectPrompt message={t('common:selectRow')} />
      )}
    </Drawer>
  )
}
