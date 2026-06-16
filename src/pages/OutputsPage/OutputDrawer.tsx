import { useEffect, useState } from 'react'
import { ArrowLeftFromLine } from 'lucide-react'
import { Drawer } from '@/components/primitive/Drawer'
import { ActiveStatusBadge } from '@/components/basic/ActiveStatusBadge'
import { DetailInfoField } from '@/components/basic/DetailInfoField'
import { DetailTitleBar } from '@/components/basic/DetailTitleBar'
import { CrudDetailActions } from '@/components/page-actions'
import type { OutputDisplayRow } from '@/pages/OutputsPage/outputDisplayTypes'
import {
  formatOutputAddr,
  formatSioName,
  outputLabel,
} from '@/pages/OutputsPage/utils/outputDisplay'
import { isDeviceActive } from '@/lib/device/deviceHelpers'

interface OutputDrawerProps {
  row: OutputDisplayRow | null
  onEditModeChange?: (editing: boolean) => void
}

export const OutputDrawer = ({ row, onEditModeChange }: OutputDrawerProps) => {
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
      icon={<ArrowLeftFromLine size={14} style={{ color: 'var(--color-accent)' }} />}
      title={outputLabel(row)}
      badge={<ActiveStatusBadge active={isDeviceActive(row.active)} />}
    />
  ) : (
    <div className="flex items-center gap-2 py-2">
      <ArrowLeftFromLine size={18} style={{ color: 'var(--color-text-dim)' }} />
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
          <DetailInfoField label="????">{formatOutputAddr(row.addr)}</DetailInfoField>
          <DetailInfoField label="?? ??">{`${row.defpulse} sec`}</DetailInfoField>
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
