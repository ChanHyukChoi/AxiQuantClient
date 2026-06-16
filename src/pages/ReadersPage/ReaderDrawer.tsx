import { useEffect, useMemo, useState } from 'react'
import { ScanLine } from 'lucide-react'
import { Drawer } from '@/components/primitive/Drawer'
import { ActiveStatusBadge } from '@/components/basic/ActiveStatusBadge'
import { DetailTitleBar } from '@/components/basic/DetailTitleBar'
import { CrudDetailActions } from '@/components/page-actions'
import {
  ReaderDetailContent,
  ReaderKindBadge,
} from '@/pages/ReadersPage/components/ReaderDetailContent'
import type { ReaderDisplayRow } from '@/pages/ReadersPage/readerDisplayTypes'
import { readerLabel, tabsForReaderKind } from '@/pages/ReadersPage/utils/readerDisplay'
import { isDeviceActive } from '@/lib/device/deviceHelpers'

interface ReaderDrawerProps {
  reader: ReaderDisplayRow | null
  onEditModeChange?: (editing: boolean) => void
}

export const ReaderDrawer = ({
  reader,
  onEditModeChange,
}: ReaderDrawerProps) => {
  const [editMode, setEditMode] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  const tabs = useMemo(
    () =>
      reader
        ? tabsForReaderKind(reader.kind).map((tab) => ({
            key: tab.key,
            label: tab.label,
            icon: <ScanLine size={12} />,
          }))
        : undefined,
    [reader],
  )

  useEffect(() => {
    setEditMode(false)
    onEditModeChange?.(false)
  }, [reader?.scp, reader?.id, onEditModeChange])

  useEffect(() => {
    if (!reader) return
    const next = tabsForReaderKind(reader.kind)
    setActiveTab(next[0]?.key ?? 'general')
  }, [reader?.scp, reader?.id, reader?.kind, reader])

  const setEditing = (editing: boolean) => {
    setEditMode(editing)
    onEditModeChange?.(editing)
  }

  const drawerHeader = reader ? (
    <DetailTitleBar
      icon={<ScanLine size={14} style={{ color: 'var(--color-accent)' }} />}
      title={readerLabel(reader)}
      badge={
        <>
          <ReaderKindBadge kind={reader.kind} />
          <ActiveStatusBadge active={isDeviceActive(reader.active)} />
        </>
      }
    />
  ) : (
    <div className="flex items-center gap-2 py-2">
      <ScanLine size={18} style={{ color: 'var(--color-text-dim)' }} />
      <p className="text-[14px]" style={{ color: 'var(--color-text-dim)' }}>
        ????????????
      </p>
    </div>
  )

  const drawerActions = reader ? (
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
      tabs={reader && !editMode ? tabs : undefined}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {reader ? (
        <ReaderDetailContent
          reader={reader}
          activeTab={activeTab}
        />
      ) : (
        <div className="flex-1 min-h-[120px]" aria-hidden />
      )}
    </Drawer>
  )
}
