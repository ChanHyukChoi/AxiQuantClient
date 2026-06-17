import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { Drawer } from '@/components/primitive/Drawer'
import { DrawerSelectPrompt } from '@/components/basic/DrawerSelectPrompt'
import { CrudDetailActions } from '@/components/page-actions'
import { LinkageWorkspace } from '@/pages/LinkagePage/components/LinkageWorkspace'
import type { LinkageRule } from '@/pages/LinkagePage/linkageTypes'

interface LinkageDrawerProps {
  rule: LinkageRule | null
  onEditModeChange?: (editing: boolean) => void
}

export const LinkageDrawer = ({ rule, onEditModeChange }: LinkageDrawerProps) => {
  const { t } = useTranslation('linkage')
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
      <Drawer fill borderLeft={false} contentFill header={<div />}>
        <DrawerSelectPrompt message={t('selectRule')} />
      </Drawer>
    )
  }

  return (
    <LinkageWorkspace rule={rule} editMode={editMode} titleActions={titleActions} />
  )
}
