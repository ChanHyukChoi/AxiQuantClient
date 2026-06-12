import { useEffect, useState } from 'react'
import { ScanLine } from 'lucide-react'
import { PageHeader } from '@/layouts/PageHeader'
import { AddButton, CrudDetailActions } from '@/components/page-actions'
import { ReaderDetailWorkspace } from '@/pages/ReadersPage/components/ReaderDetailWorkspace'
import { ReaderListPane } from '@/pages/ReadersPage/components/ReaderListPane'
import { useReadersData } from '@/pages/ReadersPage/useReadersData'

export const ReadersPage = () => {
  const [editMode, setEditMode] = useState(false)

  const {
    useMock,
    scps,
    filteredRows,
    selected,
    selectedKey,
    selectRow,
    searchQuery,
    setSearchQuery,
    scpFilter,
    setScpFilter,
    kindFilter,
    setKindFilter,
    isLoading,
    isError,
    patchMockRow,
  } = useReadersData()

  const handleToggleActive = (active: boolean) => {
    if (!selected || !useMock) return
    patchMockRow(selected.scp, selected.id, { active: active ? 1 : 0 })
  }

  useEffect(() => {
    setEditMode(false)
  }, [selected?.scp, selected?.id])

  const titleActions = selected ? (
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
        title="리더"
        icon={<ScanLine size={15} />}
        variantPaths={{ a: '/readers', b: '/readers-b' }}
        actions={<AddButton onClick={() => undefined} />}
      />

      <div className="flex flex-1 overflow-hidden">
        <ReaderListPane
          rows={filteredRows}
          scps={scps}
          selectedKey={selectedKey}
          searchQuery={searchQuery}
          scpFilter={scpFilter}
          kindFilter={kindFilter}
          loading={isLoading}
          error={isError}
          onSearch={setSearchQuery}
          onScpFilterChange={setScpFilter}
          onKindFilterChange={setKindFilter}
          onSelect={selectRow}
        />
        <ReaderDetailWorkspace
          reader={selected}
          useMock={useMock}
          layout="rail"
          onToggleActive={handleToggleActive}
          titleActions={titleActions}
        />
      </div>
    </div>
  )
}
