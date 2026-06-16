import { useEffect, useState } from 'react'
import { ArrowRightToLine } from 'lucide-react'
import { Drawer } from '@/components/primitive/Drawer'
import { ActiveStatusBadge } from '@/components/basic/ActiveStatusBadge'
import { DetailInfoField } from '@/components/basic/DetailInfoField'
import { DetailTitleBar } from '@/components/basic/DetailTitleBar'
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
    <div className="flex items-center gap-2 py-2">
      <ArrowRightToLine size={18} style={{ color: 'var(--color-text-dim)' }} />
      <p className="text-[14px]" style={{ color: 'var(--color-text-dim)' }}>
        ??? ?????.
      </p>
    </div>
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
    <Drawer fill borderLeft={false} header={drawerHeader} actions={drawerActions ?? undefined}>
      {row ? (
        <div className="max-w-md flex flex-col gap-3">
          <DetailInfoField label="????">{row.scpName}</DetailInfoField>
          <DetailInfoField label="????">
            {formatSioName(row.sio, row.sioName)}
          </DetailInfoField>
          <DetailInfoField label="????">{formatInputAddr(row.addr)}</DetailInfoField>
          <DetailInfoField label="??">{formatInputMode(row.mode)}</DetailInfoField>
          <DetailInfoField label="??? ??">{String(row.icvt)}</DetailInfoField>
          <DetailInfoField label="?? ??">{`${row.holdtime} sec`}</DetailInfoField>
          <DetailInfoField label="??">
            {isDeviceActive(row.active) ? '??' : '???'}
          </DetailInfoField>
        </div>
      ) : (
        <div className="flex-1 min-h-[120px]" aria-hidden />
      )}
    </Drawer>
  )
}
