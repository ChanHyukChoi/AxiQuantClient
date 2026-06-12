import { useEffect, useState } from 'react'
import { ArrowLeftFromLine } from 'lucide-react'
import { Drawer } from '@/components/primitive/Drawer'
import { ActiveMockToggle } from '@/components/basic/ActiveMockToggle'
import { ActiveStatusBadge } from '@/components/basic/ActiveStatusBadge'
import { DetailInfoField } from '@/components/basic/DetailInfoField'
import { DetailTitleBar } from '@/components/basic/DetailTitleBar'
import { CrudDetailActions } from '@/components/page-actions'
import type { OutputDisplayRow } from '@/pages/OutputsPage/outputsMockData'
import {
  formatOutputAddr,
  formatSioName,
  outputLabel,
} from '@/pages/OutputsPage/utils/outputDisplay'
import { isDeviceActive } from '@/pages/DeviceControlPage/utils/deviceHelpers'

interface OutputDrawerProps {
  row: OutputDisplayRow | null
  useMock: boolean
  onToggleActive?: (active: boolean) => void
  onEditModeChange?: (editing: boolean) => void
}

export const OutputDrawer = ({
  row,
  useMock,
  onToggleActive,
  onEditModeChange,
}: OutputDrawerProps) => {
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
        출력을 선택하세요
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
    <Drawer
      fill
      borderLeft={false}
      header={drawerHeader}
      actions={drawerActions ?? undefined}
    >
      {row ? (
        <div className="max-w-md flex flex-col gap-3">
          <DetailInfoField label="주제어기">{row.scpName}</DetailInfoField>
          <DetailInfoField label="부제어기">
            {formatSioName(row.sio, row.sioName)}
          </DetailInfoField>
          <DetailInfoField label="어드레스">{formatOutputAddr(row.addr)}</DetailInfoField>
          <DetailInfoField label="지속 시간">{`${row.defpulse} sec`}</DetailInfoField>
          {useMock ? (
            <DetailInfoField label="활성">
              <ActiveMockToggle
                checked={isDeviceActive(row.active)}
                onChange={onToggleActive ?? (() => undefined)}
              />
            </DetailInfoField>
          ) : (
            <DetailInfoField label="활성">
              {isDeviceActive(row.active) ? '활성' : '비활성'}
            </DetailInfoField>
          )}
        </div>
      ) : (
        <div className="flex-1 min-h-[120px]" aria-hidden />
      )}
    </Drawer>
  )
}
