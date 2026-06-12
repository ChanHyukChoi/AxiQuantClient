import { useEffect, useState } from 'react'
import { Link2 } from 'lucide-react'
import { PageHeader } from '@/layouts/PageHeader'
import { AddButton, CrudDetailActions, ExportButton, ImportButton } from '@/components/page-actions'
import { LinkageListPane } from '@/pages/LinkagePage/components/LinkageListPane'
import { LinkageWorkspace } from '@/pages/LinkagePage/components/LinkageWorkspace'
import { useLinkageData } from '@/pages/LinkagePage/useLinkageData'

/** 연동 A안 — 좌 ListPane + 우 Workspace */
export const LinkagePage = () => {
  const [editMode, setEditMode] = useState(false)
  const { rules, selectedId, selectedRule, searchQuery, setSearchQuery, selectRule } =
    useLinkageData()

  useEffect(() => {
    setEditMode(false)
  }, [selectedId])

  const titleActions = selectedRule ? (
    <CrudDetailActions
      editMode={editMode}
      onEdit={() => setEditMode(true)}
      onDelete={() => undefined}
      onSave={() => setEditMode(false)}
      onCancel={() => setEditMode(false)}
    />
  ) : null

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <PageHeader
        title="연동"
        icon={<Link2 size={15} />}
        variantPaths={{ a: '/linkage', b: '/linkage-b' }}
        actions={
          <>
            <ImportButton size="sm" showLabel={false} onClick={() => undefined} />
            <ExportButton size="sm" showLabel={false} onClick={() => undefined} />
            <AddButton onClick={() => undefined} />
          </>
        }
      />

      <div className="flex flex-1 overflow-hidden min-h-0">
        <LinkageListPane
          rules={rules}
          selectedId={selectedId}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          onSelect={(rule) => selectRule(rule.id)}
        />
        <LinkageWorkspace
          rule={selectedRule}
          editMode={editMode}
          titleActions={titleActions}
        />
      </div>
    </div>
  )
}
