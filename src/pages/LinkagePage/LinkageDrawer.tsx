import { useEffect, useState } from 'react'
import { Link2 } from 'lucide-react'
import { Drawer } from '@/components/primitive/Drawer'
import { CrudDetailActions } from '@/components/page-actions'
import { LinkageWorkspace } from '@/pages/LinkagePage/components/LinkageWorkspace'
import type { LinkageRule } from '@/pages/LinkagePage/linkageTypes'

interface LinkageDrawerProps {
  rule: LinkageRule | null
  onEditModeChange?: (editing: boolean) => void
}

export const LinkageDrawer = ({ rule, onEditModeChange }: LinkageDrawerProps) => {
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    setEditMode(false)
    onEditModeChange?.(false)
  }, [rule?.id, onEditModeChange])

  const setEditing = (editing: boolean) => {
    setEditMode(editing)
    onEditModeChange?.(editing)
  }

  const titleActions = rule ? (
    <CrudDetailActions
      editMode={editMode}
      onEdit={() => setEditing(true)}
      onDelete={() => undefined}
      onSave={() => setEditing(false)}
      onCancel={() => setEditing(false)}
    />
  ) : undefined

  if (!rule) {
    return (
      <Drawer
        fill
        borderLeft={false}
        header={
          <div className="flex items-center gap-2 py-2">
            <Link2 size={18} style={{ color: 'var(--color-text-dim)' }} />
            <p className="text-[14px]" style={{ color: 'var(--color-text-dim)' }}>
              연동 규칙을 선택하세요
            </p>
          </div>
        }
      >
        <div className="flex-1 min-h-[120px]" aria-hidden />
      </Drawer>
    )
  }

  return (
    <LinkageWorkspace rule={rule} editMode={editMode} titleActions={titleActions} />
  )
}
